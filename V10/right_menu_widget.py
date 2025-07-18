from PyQt6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QListWidget, QListWidgetItem, QFrame, QScrollArea, QSizePolicy, QToolButton
from PyQt6.QtCore import Qt, pyqtSignal, QSize, QMimeData
from PyQt6.QtGui import QIcon, QPixmap, QDrag

class DraggableListWidget(QListWidget):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._drag_start_pos = None

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self._drag_start_pos = event.pos()
        super().mousePressEvent(event)

    def mouseMoveEvent(self, event):
        if event.buttons() & Qt.MouseButton.LeftButton and self._drag_start_pos:
            distance = (event.pos() - self._drag_start_pos).manhattanLength()
            if distance > 10:
                item = self.currentItem()
                if item:
                    data = item.data(Qt.ItemDataRole.UserRole)
                    if data:
                        # Create drag object
                        drag = QDrag(self)
                        
                        # Create MIME data
                        mime_data = QMimeData()
                        # Convert data to string format for transfer
                        import json
                        mime_data.setText(json.dumps(data))
                        mime_data.setData("application/x-streamdeck-action", json.dumps(data).encode())
                        
                        drag.setMimeData(mime_data)
                        
                        # Log the drag operation
                        import logging
                        logging.info(f"Starting drag operation with data: {data}")
                        
                        # Execute drag
                        result = drag.exec(Qt.DropAction.CopyAction)
                        
                        # Log the result
                        logging.info(f"Drag operation completed with result: {result}")
                        
                        # Reset drag start position
                        self._drag_start_pos = None
                        return
        super().mouseMoveEvent(event)

class RightMenuWidget(QWidget):
    action_dragged = pyqtSignal(dict)  # Emits {'plugin': ..., 'action': ...}
    action_selected = pyqtSignal(dict)  # Emits {'plugin': ..., 'action': ...}

    def __init__(self, plugins, parent=None):
        super().__init__(parent)
        self.plugins = plugins
        # Initialize with all plugins expanded by default
        self.expanded_plugins = {plugin['name'] for plugin in plugins}
        self.setup_ui()

    def setup_ui(self):
        # Set object name and class for QSS targeting
        self.setObjectName("right-menu-widget")
        self.setProperty("class", "RightMenuWidget")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(8, 8, 8, 8)
        layout.setSpacing(4)
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        content = QWidget()
        self.content_layout = QVBoxLayout(content)
        self.content_layout.setContentsMargins(0, 0, 0, 0)
        self.content_layout.setSpacing(2)
        scroll.setWidget(content)
        layout.addWidget(scroll)
        self.populate_plugins()
        # Remove the stretch to allow full height
        # layout.addStretch()
        self.setMinimumWidth(250)
        self.setMaximumWidth(320)
        # Set size policy to expand vertically
        self.setSizePolicy(QSizePolicy.Policy.Preferred, QSizePolicy.Policy.Expanding)

    def populate_plugins(self):
        while self.content_layout.count():
            item = self.content_layout.takeAt(0)
            w = item.widget() if item is not None else None
            if w is not None:
                w.deleteLater()
        for plugin in self.plugins:
            self.add_plugin_section(plugin)

    def add_plugin_section(self, plugin):
        header = QWidget()
        header_layout = QHBoxLayout(header)
        header_layout.setContentsMargins(0, 0, 0, 0)
        header_layout.setSpacing(6)
        arrow = QToolButton()
        arrow.setText('▶')
        arrow.setCheckable(True)
        arrow.setChecked(plugin['name'] in self.expanded_plugins)
        arrow.setStyleSheet("font-size: 16px; padding: 0 4px;")
        label = QLabel(plugin['label'])
        label.setStyleSheet("font-weight: bold; font-size: 15px;")
        if plugin.get('icon'):
            icon_label = QLabel()
            icon_label.setPixmap(QIcon(plugin['icon']).pixmap(20, 20))
            header_layout.addWidget(icon_label)
        header_layout.addWidget(arrow)
        header_layout.addWidget(label)
        header_layout.addStretch()
        self.content_layout.addWidget(header)
        # Actions list (hidden by default)
        actions_widget = DraggableListWidget()
        actions_widget.setVisible(plugin['name'] in self.expanded_plugins)
        for action in plugin['actions']:
            item = QListWidgetItem(action['label'])
            if action.get('icon'):
                item.setIcon(QIcon(action['icon']))
            item.setData(Qt.ItemDataRole.UserRole, {'plugin': plugin['name'], 'action': action['name']})
            actions_widget.addItem(item)
        actions_widget.setSpacing(2)
        # actions_widget.setMaximumHeight(200) # Removed as per edit hint
        actions_widget.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.MinimumExpanding)
        actions_widget.itemPressed.connect(self.on_action_pressed)
        actions_widget.itemDoubleClicked.connect(self.on_action_selected)
        self.content_layout.addWidget(actions_widget)
        def toggle():
            if plugin['name'] in self.expanded_plugins:
                self.expanded_plugins.remove(plugin['name'])
                actions_widget.setVisible(False)
                arrow.setText('▶')
            else:
                self.expanded_plugins.add(plugin['name'])
                actions_widget.setVisible(True)
                arrow.setText('▼')
        arrow.clicked.connect(toggle)

    def on_action_pressed(self, item):
        data = item.data(Qt.ItemDataRole.UserRole)
        if data:
            self.action_selected.emit(data)

    def on_action_selected(self, item):
        data = item.data(Qt.ItemDataRole.UserRole)
        if data:
            self.action_selected.emit(data) 