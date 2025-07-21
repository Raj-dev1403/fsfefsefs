# main_controller.py
import sys
import json
import base64
import time
import threading
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QGridLayout, 
                             QPushButton, QComboBox, QLabel, QFileDialog, QMessageBox, QProgressBar)
from PyQt6.QtGui import QIcon, QPixmap, QMovie
from PyQt6.QtCore import Qt, QSize, pyqtSignal, QObject
from PIL import Image
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
import io
import serial
import serial.tools.list_ports

# --- Configuration ---
GRID_ROWS = 3
GRID_COLS = 5
BUTTON_SIZE = 110
ESP32_IMAGE_WIDTH = 110
ESP32_IMAGE_HEIGHT = 110
CHUNK_SIZE = 102400  # Increased to 100KB for larger payloads

# --- FIX: Create a worker class for handling UI updates from other threads ---
class Communicate(QObject):
    update_widget = pyqtSignal(int, str, object)

class StreamDeckApp(QMainWindow):
    """
    This class defines the entire Stream Deck controller application using PyQt6.
    It features a modern UI styled with CSS and handles sending static images
    and animated GIFs to the ESP32.
    """
    def __init__(self):
        super().__init__()
        self.setWindowTitle("ESP32 Stream Deck Controller (GIF Support)")
        self.setGeometry(100, 100, 800, 650)

        # --- Application State Variables ---
        self.serial_connection = None
        self.button_widgets = {}
        self.movies = {} # To hold QMovie objects for GIF previews

        # --- UI Update Signal ---
        self.comm = Communicate()
        self.comm.update_widget.connect(self.update_ui_element)

        # --- Progress bar for GIF upload ---
        self.progress_bar = QProgressBar(self)
        self.progress_bar.setGeometry(50, 600, 700, 30)
        self.progress_bar.setVisible(False)
        self.progress_label = QLabel(self)
        self.progress_label.setGeometry(50, 630, 700, 20)
        self.progress_label.setVisible(False)

        # --- Main UI Setup ---
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)
        main_layout = QGridLayout(central_widget)
        main_layout.setSpacing(15)

        self._create_connection_bar(main_layout)
        self._create_button_grid(main_layout)
        
        # Apply the stylesheet
        self.setStyleSheet(self.get_stylesheet())

    def _create_connection_bar(self, layout):
        """Creates the top bar for COM port selection and connection."""
        self.com_port_dropdown = QComboBox()
        self.com_port_dropdown.addItems([port.device for port in serial.tools.list_ports.comports()])
        
        self.connect_button = QPushButton("Connect")
        self.connect_button.clicked.connect(self.toggle_connection)
        
        self.status_label = QLabel("Status: Disconnected")
        self.status_label.setObjectName("StatusLabel") # For CSS styling

        layout.addWidget(QLabel("COM Port:"), 0, 0)
        layout.addWidget(self.com_port_dropdown, 0, 1)
        layout.addWidget(self.connect_button, 0, 2)
        layout.addWidget(self.status_label, 0, 3, 1, 2, alignment=Qt.AlignmentFlag.AlignRight)

    def _create_button_grid(self, layout):
        """Creates the main grid of buttons as QPushButton widgets."""
        grid_container = QWidget()
        grid_layout = QGridLayout(grid_container)
        grid_layout.setSpacing(15)
        for i in range(GRID_ROWS):
            for j in range(GRID_COLS):
                button_id = i * GRID_COLS + j
                btn = QPushButton(str(button_id))
                btn.setFixedSize(BUTTON_SIZE, BUTTON_SIZE)
                btn.setObjectName("ImageButton")
                btn.clicked.connect(lambda checked, bid=button_id: self.select_image(bid))
                grid_layout.addWidget(btn, i, j)
                self.button_widgets[button_id] = btn
        layout.addWidget(grid_container, 1, 0, 1, 5)

    def toggle_connection(self):
        """Connects to or disconnects from the selected COM port."""
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
            self.serial_connection = None
            self.status_label.setText("Status: Disconnected")
            self.status_label.setStyleSheet("color: #FF5555;") # Red
            self.connect_button.setText("Connect")
        else:
            port = self.com_port_dropdown.currentText()
            if not port:
                QMessageBox.critical(self, "Error", "Please select a COM port.")
                return
            try:
                self.serial_connection = serial.Serial(port, 115200, timeout=1)
                time.sleep(2) # Wait for ESP32 to reset
                self.status_label.setText(f"Status: Connected to {port}")
                self.status_label.setStyleSheet("color: #50FA7B;") # Green
                self.connect_button.setText("Disconnect")
            except serial.SerialException as e:
                QMessageBox.critical(self, "Connection Failed", f"Failed to connect to {port}:\n{e}")

    def select_image(self, button_id):
        """Opens a file dialog to select an image or GIF."""
        filepath, _ = QFileDialog.getOpenFileName(
            self,
            f"Select Image or GIF for Button {button_id}",
            "",
            "Image Files (*.png *.svg *.gif);;All Files (*)"
        )
        if not filepath:
            return

        # Process the file in a background thread to keep the UI responsive
        threading.Thread(target=self.process_and_send, args=(filepath, button_id), daemon=True).start()

    def process_and_send(self, filepath, button_id):
        try:
            # Only static image logic
            file_type = "static"
            if filepath.lower().endswith('.svg'):
                drawing = svg2rlg(filepath)
                png_data = renderPM.drawToString(drawing, fmt="PNG")
                image = Image.open(io.BytesIO(png_data)).convert("RGBA")
            else:
                image = Image.open(filepath).convert("RGBA")
            pixmap = self.pil_to_pixmap(image)
            self.comm.update_widget.emit(button_id, "static", pixmap)
            img_resized = image.resize((ESP32_IMAGE_WIDTH, ESP32_IMAGE_HEIGHT), Image.LANCZOS)
            raw_data = self.convert_to_rgb565(img_resized)
            b64_data = base64.b64encode(raw_data).decode('utf-8')
            payload = { "id": button_id, "type": file_type, "data": b64_data }
            self.send_payload(payload)
        except Exception as e:
            print(f"Error processing file: {e}")

    def update_ui_element(self, button_id, image_type, data):
        """Update the QPushButton icon with the static image."""
        btn = self.button_widgets[button_id]
        if image_type == "static":
            btn.setIcon(QIcon(data))
            btn.setIconSize(QSize(BUTTON_SIZE-10, BUTTON_SIZE-10))
        else:
            btn.setIcon(QIcon())

    def send_payload(self, payload):
        """Converts payload to JSON and sends it over serial in large chunks if needed. Prints the actual data size sent."""
        if self.serial_connection and self.serial_connection.is_open:
            try:
                json_payload = json.dumps(payload) + '\n'
                # Print the size of the base64 data if present
                if 'data' in payload:
                    print(f"Base64 data size: {len(payload['data'])} bytes for button {payload['id']}")
                # Send in chunks if payload is very large
                if len(json_payload) <= CHUNK_SIZE:
                    self.serial_connection.write(json_payload.encode('utf-8'))
                    self.serial_connection.flush()
                    print(f"Sent {len(json_payload)} bytes for button {payload['id']}")
                else:
                    # If the payload is too large, print a warning and send anyway (may be truncated by serial buffer)
                    print(f"Warning: Payload size {len(json_payload)} exceeds CHUNK_SIZE {CHUNK_SIZE}. Sending anyway.")
                    self.serial_connection.write(json_payload.encode('utf-8'))
                    self.serial_connection.flush()
                    print(f"Sent {len(json_payload)} bytes for button {payload['id']}")
            except serial.SerialException as e:
                print(f"Serial Send Error: {e}")

    def pil_to_pixmap(self, pil_image):
        """Converts a Pillow Image to a PyQt QPixmap."""
        return QPixmap.fromImage(pil_image.toqimage())

    def convert_to_rgb565(self, img):
        """Converts a Pillow Image to raw RGB565 byte data."""
        pixels = list(img.convert("RGB").getdata())
        rgb565_bytes = bytearray()
        for r, g, b in pixels:
            rgb565 = ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3)
            rgb565_bytes.extend([rgb565 & 0xFF, (rgb565 >> 8) & 0xFF])
        return rgb565_bytes

    def closeEvent(self, event):
        """Ensures the serial port is closed when the application exits."""
        if self.serial_connection and self.serial_connection.is_open:
            self.serial_connection.close()
        event.accept()

    def get_stylesheet(self):
        """Returns the CSS stylesheet for the application."""
        return """
            QWidget {
                background-color: #282a36;
                color: #f8f8f2;
                font-family: "Segoe UI";
                font-size: 14px;
            }
            QMainWindow, QWidget {
                border: 1px solid #44475a;
            }
            QPushButton, #ImageButton {
                background-color: #44475a;
                border: 1px solid #6272a4;
                padding: 5px;
                border-radius: 12px;
                font-weight: bold;
            }
            #ImageButton:hover {
                background-color: #526294;
            }
            QPushButton:hover {
                background-color: #526294;
            }
            QPushButton:pressed {
                background-color: #3a4a7e;
            }
            QComboBox {
                background-color: #44475a;
                border: 1px solid #6272a4;
                padding: 5px;
                border-radius: 5px;
            }
            QComboBox::drop-down {
                border: none;
            }
            QLabel {
                border: none;
            }
            #StatusLabel {
                font-weight: bold;
                padding-right: 10px;
            }
        """

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = StreamDeckApp()
    window.show()
    sys.exit(app.exec())
