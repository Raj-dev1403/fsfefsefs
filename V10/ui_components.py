"""
Nextion Stream Deck - UI Components and Dialogs
Custom PyQt6 components, dialogs, and widgets
"""

import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List
import os

from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QFormLayout, QPushButton, 
    QLabel, QLineEdit, QTextEdit, QComboBox, QSpinBox, QCheckBox,
    QFrame, QGroupBox, QDialog, QDialogButtonBox, QFileDialog,
    QMessageBox, QScrollArea, QListWidget, QListWidgetItem, QSizePolicy,
    QSlider, QButtonGroup, QRadioButton, QToolButton, QTextBrowser,
    QProgressBar, QTabWidget, QSplitter, QGridLayout,
    QApplication  # <-- add this import
)
from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QSize, QRect, QMetaObject, Q_ARG
from PyQt6.QtGui import QIcon, QFont, QPixmap, QPainter, QBrush, QLinearGradient, QTextCursor
from PyQt6.QtSvgWidgets import QSvgWidget
from PyQt6.QtGui import QPainterPath

class ModernButton(QPushButton):
    """Modern styled button with hover effects"""
    
    def __init__(self, text: str = "", icon: QIcon = QIcon(), parent=None):
        super().__init__(text, parent)
        self.setup_style()
        if isinstance(icon, QIcon):
            self.setIcon(icon)
            
    def setup_style(self):
        """Apply modern styling"""
        # Set object name and class for QSS targeting
        self.setObjectName("modern-button")
        self.setProperty("class", "ModernButton")

class StreamDeckButton(QFrame):
    """Custom Stream Deck button representation"""
    
    clicked = pyqtSignal(int, int)  # page_id, button_id
    action_dropped = pyqtSignal(int, int, dict)  # page_id, button_id, action_info
    button_clicked = pyqtSignal(int, int)  # page_id, button_id for property inspector
    
    def __init__(self, page_id: int, button_id: int, parent=None):
        super().__init__(parent)
        self.page_id = page_id
        self.button_id = button_id
        self.is_configured = False
        self.button_config = {}
        self.setup_ui()
        self.setup_style()
        self.setAcceptDrops(True)
    def setup_ui(self):
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        self.icon_label = QLabel()
        self.icon_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.icon_label.setObjectName("button-icon")
        self.icon_label.setProperty("class", "button-icon")
        self.icon_label.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
        layout.addWidget(self.icon_label)
        self.setLayout(layout)
    def setup_style(self):
        # Set object name and class for QSS targeting
        self.setObjectName("stream-deck-button")
        self.setProperty("class", "StreamDeckButton")
        self.setFixedSize(80, 80)
    def update_config(self, config: Dict[str, Any]):
        self.button_config = config
        self.is_configured = bool(config)
        icon_path = config.get("icon")
        action_name = config.get("action", "")
        # Try to get icon for the action if not explicitly set
        if not icon_path:
            # Placeholder: in future, lookup from icons_config.json
            icon_path = None
        if icon_path and Path(icon_path).exists():
            pixmap = QPixmap(icon_path)
            # Create a rounded mask for the pixmap
            size = min(self.width()-4, self.height()-4)
            rounded = QPixmap(size, size)
            rounded.fill(Qt.GlobalColor.transparent)
            painter = QPainter(rounded)
            painter.setRenderHint(QPainter.RenderHint.Antialiasing)
            path = QPainterPath()
            path.addRoundedRect(0, 0, size, size, 20, 20)
            painter.setClipPath(path)
            painter.drawPixmap(0, 0, pixmap.scaled(size, size, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation))
            painter.end()
            self.icon_label.setPixmap(rounded)
            self.icon_label.setText("")
        elif action_name:
            # Show the action name or first letter as text
            display_text = action_name.replace('_', ' ').title()
            if len(display_text) > 6:
                display_text = display_text[:6] + "..."
            self.icon_label.setPixmap(QPixmap())
            self.icon_label.setText(display_text)
            self.icon_label.setProperty("live-value", False)
            style = self.icon_label.style()
            if style:
                style.unpolish(self.icon_label)
                style.polish(self.icon_label)
        else:
            self.icon_label.clear()
            self.icon_label.setProperty("live-value", False)

    def flash_press(self):
        """Visual feedback for button press"""
        self.setProperty("pressed", True)
        style = self.style()
        if style:
            style.unpolish(self)
            style.polish(self)
        QTimer.singleShot(200, self.reset_style)
        
    def reset_style(self):
        """Reset to normal style"""
        self.setProperty("pressed", False)
        style = self.style()
        if style:
            style.unpolish(self)
            style.polish(self)

    def set_selected(self, selected: bool):
        self.setProperty("selected", selected)
        style = self.style()
        if style:
            style.unpolish(self)
            style.polish(self)

    def set_live_value(self, value: str):
        """Set the live value (e.g., CPU %, temperature) as the button's main label."""
        self.icon_label.setText(value)
        self.icon_label.setProperty("live-value", True)
        style = self.icon_label.style()
        if style:
            style.unpolish(self.icon_label)
            style.polish(self.icon_label)

    def dragEnterEvent(self, event):
        """Handle drag enter events with visual feedback"""
        mime_data = event.mimeData()
        
        # Accept our custom MIME type or text format
        if (mime_data.hasFormat("application/x-streamdeck-action") or 
            mime_data.hasText()):
            
            # Set visual feedback
            self.setProperty("drop-zone", True)
            style = self.style()
            if style:
                style.unpolish(self)
                style.polish(self)
            
            event.acceptProposedAction()
        else:
            event.ignore()
    
    def dragLeaveEvent(self, event):
        """Handle drag leave events - reset visual feedback"""
        self.setProperty("drop-zone", False)
        style = self.style()
        if style:
            style.unpolish(self)
            style.polish(self)
        super().dragLeaveEvent(event)
    
    def mousePressEvent(self, event):
        """Handle mouse press events - emit click signal"""
        if event.button() == Qt.MouseButton.LeftButton:
            # Emit the button clicked signal
            self.button_clicked.emit(self.page_id, self.button_id)
            # Also emit the regular clicked signal for backward compatibility
            self.clicked.emit(self.page_id, self.button_id)
        super().mousePressEvent(event)

    def dropEvent(self, event):
        """Handle drop events with proper JSON parsing"""
        try:
            mime_data = event.mimeData()
            action_info = None
            # Check for our custom MIME type
            if mime_data.hasFormat("application/x-streamdeck-action"):
                data_bytes = mime_data.data("application/x-streamdeck-action")
                import json
                action_info = json.loads(data_bytes.data().decode())
            # Fallback to text format
            elif mime_data.hasText():
                data = mime_data.text()
                if ':' in data:
                    plugin, action = data.split(':', 1)
                    from PyQt6.QtWidgets import QApplication
                    window = QApplication.activeWindow()
                    app_instance = getattr(window, 'app_instance', None)
                    action_key = action
                    if app_instance and hasattr(app_instance, 'plugin_manager'):
                        plugin_obj = app_instance.plugin_manager.plugins.get(plugin)
                        if plugin_obj:
                            actions = plugin_obj.get_actions()
                            dropped_norm = action.lower().replace(' ', '_')
                            found = False
                            for key in actions.keys():
                                key_norm = key.lower().replace(' ', '_')
                                if key_norm == dropped_norm:
                                    action_key = key
                                    found = True
                                    break
                            if not found:
                                import logging
                                logging.warning(f"No matching action key for dropped action '{action}' in plugin '{plugin}'. Using original value.")
                    action_info = {'plugin': plugin, 'action': action_key}
                else:
                    try:
                        import json
                        action_info = json.loads(data)
                    except Exception:
                        action_info = {'raw': data}
            if action_info:
                self.button_config.update(action_info)
                self.is_configured = True
                self.update_config(self.button_config)
                self.action_dropped.emit(self.page_id, self.button_id, action_info)
                self.flash_press()
                import logging
                logging.info(f"Action dropped on button {self.page_id}_{self.button_id}: {action_info}")
                event.acceptProposedAction()
            else:
                event.ignore()
        except Exception as e:
            import logging
            logging.error(f"Error in dropEvent: {e}")
            event.ignore()

# Remove ButtonConfigDialog and all related code




class PluginCreatorDialog(QDialog):
    """Dialog for creating new plugins"""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Create New Plugin")
        self.setModal(True)
        self.setMinimumSize(700, 600)
        self.setup_ui()

    def setup_ui(self):
        # Set object name and class for QSS targeting
        self.setObjectName("plugin-creator-dialog")
        self.setProperty("class", "PluginCreatorDialog")
        layout = QVBoxLayout()

        # Plugin information
        info_group = QGroupBox("Plugin Information")
        info_layout = QFormLayout()

        self.plugin_name_edit = QLineEdit()
        self.plugin_name_edit.setPlaceholderText("e.g., My Custom Plugin")
        self.plugin_name_edit.textChanged.connect(self.update_preview)
        info_layout.addRow("Plugin Name:", self.plugin_name_edit)

        self.plugin_description_edit = QLineEdit()
        self.plugin_description_edit.setPlaceholderText("Brief description of the plugin")
        self.plugin_description_edit.textChanged.connect(self.update_preview)
        info_layout.addRow("Description:", self.plugin_description_edit)

        self.plugin_author_edit = QLineEdit()
        self.plugin_author_edit.setPlaceholderText("Your name")
        self.plugin_author_edit.textChanged.connect(self.update_preview)
        info_layout.addRow("Author:", self.plugin_author_edit)

        self.plugin_version_edit = QLineEdit()
        self.plugin_version_edit.setText("1.0.0")
        self.plugin_version_edit.textChanged.connect(self.update_preview)
        info_layout.addRow("Version:", self.plugin_version_edit)

        self.plugin_category_edit = QLineEdit()
        self.plugin_category_edit.setPlaceholderText("e.g., System, Media, Web")
        self.plugin_category_edit.textChanged.connect(self.update_preview)
        info_layout.addRow("Category:", self.plugin_category_edit)

        info_group.setLayout(info_layout)
        layout.addWidget(info_group)

        # Template selection
        template_group = QGroupBox("Plugin Template")
        template_layout = QVBoxLayout()

        self.template_combo = QComboBox()
        self.template_combo.addItems([
            "Basic Action Plugin",
            "System Control Plugin",
            "Application Launcher Plugin",
            "Custom API Plugin",
            "File Operation Plugin",
            "Media Control Plugin"
        ])
        self.template_combo.currentTextChanged.connect(self.update_preview)
        template_layout.addWidget(self.template_combo)

        self.template_description = QLabel()
        self.template_description.setWordWrap(True)
        self.template_description.setStyleSheet("color: #ccc; font-style: italic;")
        template_layout.addWidget(self.template_description)

        template_group.setLayout(template_layout)
        layout.addWidget(template_group)

        # Code preview
        preview_group = QGroupBox("Code Preview")
        preview_layout = QVBoxLayout()

        self.code_preview = QTextEdit()
        self.code_preview.setReadOnly(True)
        self.code_preview.setFont(QFont("Consolas", 10))
        self.code_preview.setStyleSheet("background-color: #1e1e1e; color: #ffffff;")
        preview_layout.addWidget(self.code_preview)

        preview_group.setLayout(preview_layout)
        layout.addWidget(preview_group)

        # Buttons
        button_layout = QHBoxLayout()
        self.generate_btn = ModernButton("Generate Plugin")
        self.generate_btn.clicked.connect(self.generate_plugin)
        button_layout.addWidget(self.generate_btn)

        self.save_btn = ModernButton("Save to File")
        self.save_btn.clicked.connect(self.save_plugin)
        button_layout.addWidget(self.save_btn)

        self.install_btn = ModernButton("Save & Install")
        self.install_btn.clicked.connect(self.save_and_install)
        button_layout.addWidget(self.install_btn)

        button_layout.addStretch()
        self.close_btn = ModernButton("Close")
        self.close_btn.clicked.connect(self.close)
        button_layout.addWidget(self.close_btn)

        layout.addLayout(button_layout)
        self.setLayout(layout)
        self.update_preview()

    def update_preview(self):
        template = self.template_combo.currentText()
        descriptions = {
            "Basic Action Plugin": "Simple plugin template with basic action structure",
            "System Control Plugin": "Template for system operations like shutdown, restart, etc.",
            "Application Launcher Plugin": "Template for launching applications and managing windows",
            "Custom API Plugin": "Template for interacting with web APIs and services",
            "File Operation Plugin": "Template for file and folder operations",
            "Media Control Plugin": "Template for media playback and volume control"
        }
        self.template_description.setText(descriptions.get(template, ""))
        if template == "Basic Action Plugin":
            code = self.get_basic_template()
        elif template == "System Control Plugin":
            code = self.get_system_template()
        elif template == "Application Launcher Plugin":
            code = self.get_launcher_template()
        elif template == "Custom API Plugin":
            code = self.get_api_template()
        elif template == "File Operation Plugin":
            code = self.get_file_template()
        elif template == "Media Control Plugin":
            code = self.get_media_template()
        else:
            code = self.get_basic_template()
        self.code_preview.setPlainText(code)

    def get_basic_template(self):
        name = self.plugin_name_edit.text() or "Custom Plugin"
        description = self.plugin_description_edit.text() or "A custom plugin for Stream Deck"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "Custom"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """Custom plugin with basic functionality"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"custom_action": self.custom_action}}
    def get_parameters(self):
        return {{"message": {{"type": "string", "default": "Hello World!", "description": "Message to display"}}}}
    @action(name="custom_action", description="Custom action implementation")
    def custom_action(self, message="Hello!"):
        self.log_info(f"Custom action executed: {{message}}")
'''

    def get_system_template(self):
        name = self.plugin_name_edit.text() or "System Control"
        description = self.plugin_description_edit.text() or "Control system functions"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "System"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import subprocess
import platform
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """System control plugin"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"shutdown": self.shutdown, "restart": self.restart, "lock_screen": self.lock_screen}}
    def get_parameters(self):
        return {{"delay": {{"type": "int", "default": 0, "description": "Delay in seconds"}}}}
    @action(name="shutdown", description="Shutdown system")
    def shutdown(self, delay=0):
        if platform.system() == "Windows":
            subprocess.run(f"shutdown /s /t {{delay}}", shell=True)
        else:
            subprocess.run(f"sudo shutdown -h +{{delay // 60}}", shell=True)
        self.log_info(f"System shutdown initiated with {{delay}}s delay")
'''

    def get_launcher_template(self):
        name = self.plugin_name_edit.text() or "App Launcher"
        description = self.plugin_description_edit.text() or "Launch applications and files"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "Application"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import subprocess
import platform
import os
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """Application launcher plugin"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"launch_app": self.launch_app, "open_file": self.open_file}}
    def get_parameters(self):
        return {{"path": {{"type": "file", "default": "", "description": "Path to application or file"}}}}
    @action(name="launch_app", description="Launch application")
    def launch_app(self, path=""):
        if path:
            if platform.system() == "Windows":
                os.startfile(path)
            else:
                subprocess.Popen([path])
            self.log_info(f"Application launched: {{path}}")
'''

    def get_api_template(self):
        name = self.plugin_name_edit.text() or "API Plugin"
        description = self.plugin_description_edit.text() or "Interact with web APIs"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "API"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import requests
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """API plugin"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"call_api": self.call_api}}
    def get_parameters(self):
        return {{"url": {{"type": "string", "default": "https://", "description": "API URL"}}}}
    @action(name="call_api", description="Call API endpoint")
    def call_api(self, url="https://"):
        try:
            response = requests.get(url)
            self.log_info(f"API call to {{url}}: {{response.status_code}}")
        except Exception as e:
            self.log_error(f"API call failed: {{e}}")
'''

    def get_file_template(self):
        name = self.plugin_name_edit.text() or "File Plugin"
        description = self.plugin_description_edit.text() or "File operations"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "File"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import os
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """File operation plugin"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"create_file": self.create_file}}
    def get_parameters(self):
        return {{"file_path": {{"type": "file", "default": "", "description": "File path"}}}}
    @action(name="create_file", description="Create a file")
    def create_file(self, file_path=""):
        try:
            with open(file_path, "w") as f:
                f.write("")
            self.log_info(f"File created: {{file_path}}")
        except Exception as e:
            self.log_error(f"Failed to create file: {{e}}")
'''

    def get_media_template(self):
        name = self.plugin_name_edit.text() or "Media Plugin"
        description = self.plugin_description_edit.text() or "Media control plugin"
        author = self.plugin_author_edit.text() or "Plugin Author"
        version = self.plugin_version_edit.text() or "1.0.0"
        category = self.plugin_category_edit.text() or "Media"
        return f'''"""
{name}
{description}
"""

from plugins.base_plugin import BasePlugin, action
import logging

class {name.replace(' ', '')}Plugin(BasePlugin):
    """Media control plugin"""
    def __init__(self):
        super().__init__()
        self.name = "{name}"
        self.description = "{description}"
        self.version = "{version}"
        self.author = "{author}"
        self.category = "{category}"
    def get_actions(self):
        return {{"play": self.play, "pause": self.pause}}
    def get_parameters(self):
        return {{"media_file": {{"type": "file", "default": "", "description": "Media file path"}}}}
    @action(name="play", description="Play media file")
    def play(self, media_file=""):
        self.log_info(f"Playing media: {{media_file}}")
    @action(name="pause", description="Pause playback")
    def pause(self):
        self.log_info("Playback paused")
'''

    def generate_plugin(self):
        QMessageBox.information(self, "Generate Plugin", "Plugin code generated. You can now save or install it.")

    def save_plugin(self):
        file_path, _ = QFileDialog.getSaveFileName(self, "Save Plugin", "", "Python Files (*.py)")
        if file_path:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(self.code_preview.toPlainText())
            QMessageBox.information(self, "Saved", f"Plugin saved to {file_path}")

    def save_and_install(self):
        self.save_plugin()
        QMessageBox.information(self, "Installed", "Plugin installed (copied to custom plugins directory if implemented).")

class LogHandler(logging.Handler):
    """Logging handler that writes log messages to a QTextEdit widget in the UI."""
    def __init__(self, text_edit: QTextEdit):
        super().__init__()
        self.text_edit = text_edit

    def emit(self, record):
        msg = self.format(record)
        # Use invokeMethod to call append in the main thread
        QMetaObject.invokeMethod(
            self.text_edit,
            "append",
            Qt.ConnectionType.QueuedConnection,
            Q_ARG(str, msg)
        )
        # Move cursor to end using QTimer.singleShot to ensure it runs on the main thread
        from PyQt6.QtCore import QTimer
        def move_to_end():
            self.text_edit.moveCursor(QTextCursor.MoveOperation.End)
        QTimer.singleShot(0, move_to_end)