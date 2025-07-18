import json
import os
from PyQt6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QLineEdit, QTextEdit, QComboBox, QSpinBox, QCheckBox, QSlider, QFileDialog, QFrame, QToolButton
from PyQt6.QtCore import Qt, pyqtSignal
from PyQt6.QtGui import QIcon, QPixmap

class PropertyInspectorWidget(QFrame):
    field_changed = pyqtSignal(str, object)  # field_name, value
    config_saved = pyqtSignal(dict)  # complete config

    def __init__(self, parent=None):
        super().__init__(parent)
        self.current_config = {}
        self.schema = self.load_schema()
        self.help_texts = self.load_help_texts()
        self.field_widgets = {}
        self._layout = QVBoxLayout(self)
        self._layout.setContentsMargins(24, 16, 24, 16)
        self._layout.setSpacing(16)
        self.title_label = QLabel("Property Inspector")
        self.title_label.setObjectName("property-inspector-title")
        self.title_label.setProperty("class", "property-title")
        self._layout.addWidget(self.title_label)
        self.content_layout = QVBoxLayout()
        self._layout.addLayout(self.content_layout)
        self.save_btn = QPushButton("Save")
        self.save_btn.setObjectName("save-button")
        self.save_btn.setProperty("class", "btn-primary")
        self.save_btn.clicked.connect(self.save_config)
        self._layout.addWidget(self.save_btn)
        self.show_default_state()

    def load_schema(self):
        try:
            with open('inspector_schema.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}

    def load_help_texts(self):
        if not os.path.exists('PROPERTY_INSPECTOR_README.md'):
            return {}
        help_texts = {}
        with open('PROPERTY_INSPECTOR_README.md', 'r', encoding='utf-8') as f:
            lines = f.readlines()
        key = None
        for line in lines:
            if line.startswith('### '):
                key = line[4:].strip()
                help_texts[key] = ''
            elif key:
                help_texts[key] += line
        return help_texts

    def show_default_state(self):
        self.clear_content()
        msg = QLabel("Select a button with an assigned script to configure its action")
        msg.setObjectName("default-message")
        msg.setProperty("class", "property-subtitle")
        msg.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.content_layout.addWidget(msg)
        self.title_label.setText("Property Inspector")
        self.save_btn.setEnabled(False)

    def set_action(self, plugin, action, config):
        self.clear_content()
        self.current_config = config or {}
        self.missing_required = False
        self.required_fields = []
        self.required_warning_label = None
        # Show only two states: default or full config form
        if plugin and action:
            self.title_label.setText(f"Button Configuration")
            # Add button info section
            info_frame = QFrame()
            info_layout = QVBoxLayout()
            info_layout.setContentsMargins(0, 0, 0, 0)
            info_layout.setSpacing(4)
            # Plugin and action info
            plugin_label = QLabel(f"Plugin: {plugin}")
            plugin_label.setObjectName("info-label")
            plugin_label.setProperty("class", "property-subtitle")
            info_layout.addWidget(plugin_label)
            action_label = QLabel(f"Action: {action}")
            action_label.setObjectName("info-label")
            action_label.setProperty("class", "property-subtitle")
            info_layout.addWidget(action_label)
            # Configuration status
            status_text = "Configured" if config else "Not Configured"
            status_label = QLabel(f"Status: {status_text}")
            status_label.setObjectName("info-label")
            status_label.setProperty("class", "property-subtitle")
            info_layout.addWidget(status_label)
            # Button position (if available)
            if 'button_position' in config:
                # Convert from 0-based to 1-based indexing for display
                position_text = config['button_position']
                if 'Row' in position_text and 'Column' in position_text:
                    try:
                        parts = position_text.split()
                        row_idx = int(parts[1].rstrip(',')) + 1
                        col_idx = int(parts[3]) + 1
                        position_text = f"Row {row_idx}, Column {col_idx}"
                    except (IndexError, ValueError):
                        pass
                position_label = QLabel(f"Position: {position_text}")
                position_label.setObjectName("info-label")
                position_label.setProperty("class", "property-subtitle")
                info_layout.addWidget(position_label)
            info_frame.setLayout(info_layout)
            self.content_layout.addWidget(info_frame)
            # Add separator
            separator = QFrame()
            separator.setFrameShape(QFrame.Shape.HLine)
            separator.setFrameShadow(QFrame.Shadow.Sunken)
            separator.setStyleSheet("background-color: #444444;")
            self.content_layout.addWidget(separator)
            # Add configuration fields (always show form, no dialog)
            fields = self.get_fields_for_action(plugin, action)
            for field in fields:
                # Track required fields
                if field.get('required', False) or field.get('type') in ('file', 'folder'):
                    self.required_fields.append(field['name'])
                self.add_field(field)
            # Add warning label for missing required fields
            self.required_warning_label = QLabel("")
            self.required_warning_label.setStyleSheet("color: #ff5555; font-size: 12px; font-weight: bold;")
            self.content_layout.addWidget(self.required_warning_label)
            self.update_save_button_state()
        else:
            self.title_label.setText("Property Inspector")
            self.show_default_state()
            self.save_btn.setEnabled(False)

    def get_fields_for_action(self, plugin, action):
        plugin_key = str(plugin)
        action_key = str(action).lower()
        if plugin_key in self.schema and action_key in self.schema[plugin_key]:
            return self.schema[plugin_key][action_key].get('fields', [])
        return self.schema.get('_default', {}).get('fields', [])

    def add_field(self, field_def):
        field_type = field_def.get('type', 'text')
        name = field_def.get('name', '')
        label_text = field_def.get('label', name)
        default_value = field_def.get('default', '')
        current_value = self.current_config.get(name, default_value)
        placeholder = field_def.get('placeholder', f"Enter {label_text.lower()}...")
        help_text = field_def.get('help', self.help_texts.get(name, None))
        field_frame = QFrame()
        field_frame.setStyleSheet("background: transparent; border: none;")
        field_layout = QVBoxLayout()
        field_layout.setContentsMargins(0, 0, 0, 0)
        field_layout.setSpacing(4)
        label = QLabel(label_text + ":")
        label.setObjectName("field-label")
        label.setProperty("class", "field-label")
        field_layout.addWidget(label)
        widget = None
        if field_type == 'text':
            widget = QLineEdit()
            widget.setText(str(current_value))
            widget.setPlaceholderText(placeholder)
            widget.textChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
        elif field_type == 'textarea':
            widget = QTextEdit()
            widget.setPlainText(str(current_value))
            widget.setPlaceholderText(placeholder)
            widget.textChanged.connect(lambda n=name, w=widget: self.on_field_changed(n, w.toPlainText()))
        elif field_type == 'icon':
            container = QWidget()
            layout = QHBoxLayout()
            layout.setContentsMargins(0, 0, 0, 0)
            text_field = QLineEdit()
            text_field.setText(str(current_value))
            text_field.setPlaceholderText("Icon path or select...")
            text_field.textChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
            browse_btn = QToolButton()
            browse_btn.setText("...")
            browse_btn.clicked.connect(lambda: self.browse_icon(name, text_field))
            layout.addWidget(text_field, stretch=1)
            layout.addWidget(browse_btn)
            container.setLayout(layout)
            widget = container
        elif field_type == 'file':
            container = QWidget()
            layout = QHBoxLayout()
            layout.setContentsMargins(0, 0, 0, 0)
            text_field = QLineEdit()
            text_field.setText(str(current_value))
            text_field.setPlaceholderText("Select file...")
            text_field.textChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
            browse_btn = QToolButton()
            browse_btn.setText("...")
            browse_btn.clicked.connect(lambda: self.browse_file(name, text_field))
            layout.addWidget(text_field, stretch=1)
            layout.addWidget(browse_btn)
            container.setLayout(layout)
            widget = container
        elif field_type == 'folder':
            container = QWidget()
            layout = QHBoxLayout()
            layout.setContentsMargins(0, 0, 0, 0)
            text_field = QLineEdit()
            text_field.setText(str(current_value))
            text_field.setPlaceholderText("Select folder...")
            text_field.textChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
            browse_btn = QToolButton()
            browse_btn.setText("...")
            browse_btn.clicked.connect(lambda: self.browse_folder(name, text_field))
            layout.addWidget(text_field, stretch=1)
            layout.addWidget(browse_btn)
            container.setLayout(layout)
            widget = container
        elif field_type == 'checkbox':
            widget = QCheckBox()
            widget.setChecked(bool(current_value))
            widget.stateChanged.connect(lambda state, n=name: self.on_field_changed(n, bool(state)))
        elif field_type == 'radio':
            options = field_def.get('options', [])
            from PyQt6.QtWidgets import QButtonGroup, QRadioButton
            group = QButtonGroup(field_frame)
            radio_layout = QHBoxLayout()
            for opt in options:
                rb = QRadioButton(str(opt))
                group.addButton(rb)
                radio_layout.addWidget(rb)
                if str(current_value) == str(opt):
                    rb.setChecked(True)
            def on_radio():
                checked = [b.text() for b in group.buttons() if b.isChecked()]
                self.on_field_changed(name, checked[0] if checked else None)
            group.buttonClicked.connect(on_radio)
            radio_widget = QWidget()
            radio_widget.setLayout(radio_layout)
            widget = radio_widget
        elif field_type == 'dropdown':
            widget = QComboBox()
            options = field_def.get('options', [])
            widget.addItems([str(opt) for opt in options])
            if str(current_value) in [str(opt) for opt in options]:
                widget.setCurrentText(str(current_value))
            widget.currentTextChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
        elif field_type == 'slider':
            container = QWidget()
            layout = QHBoxLayout()
            layout.setContentsMargins(0, 0, 0, 0)
            slider = QSlider(Qt.Orientation.Horizontal)
            slider.setMinimum(field_def.get('min', 0))
            slider.setMaximum(field_def.get('max', 100))
            slider.setValue(int(current_value))
            value_label = QLabel(str(slider.value()))
            slider.valueChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
            slider.valueChanged.connect(lambda val: value_label.setText(str(val)))
            layout.addWidget(slider, stretch=1)
            layout.addWidget(value_label)
            container.setLayout(layout)
            widget = container
        elif field_type == 'number':
            widget = QSpinBox()
            widget.setMinimum(field_def.get('min', 0))
            widget.setMaximum(field_def.get('max', 1000000))
            widget.setValue(int(current_value))
            widget.valueChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
        else:
            widget = QLineEdit()
            widget.setText(str(current_value))
            widget.setPlaceholderText(placeholder)
            widget.textChanged.connect(lambda val, n=name: self.on_field_changed(n, val))
        if widget:
            field_layout.addWidget(widget)
            self.field_widgets[name] = widget
        if help_text:
            help_label = QLabel(help_text)
            help_label.setStyleSheet("color: #aaa; font-size: 11px; font-style: italic;")
            field_layout.addWidget(help_label)
        field_frame.setLayout(field_layout)
        self.content_layout.addWidget(field_frame)

    def on_field_changed(self, field_name, value):
        self.current_config[field_name] = value
        self.field_changed.emit(field_name, value)
        self.update_save_button_state()

    def save_config(self):
        self.config_saved.emit(self.current_config)

    def clear_content(self):
        while self.content_layout.count():
            child = self.content_layout.takeAt(0)
            if child:
                widget = child.widget()
                if widget:
                    widget.setParent(None)

    def browse_icon(self, field_name, line_edit):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Icon", "", "Image Files (*.png *.jpg *.jpeg *.bmp *.gif *.svg)")
        if file_path:
            line_edit.setText(file_path)
            self.on_field_changed(field_name, file_path)

    def browse_file(self, field_name, line_edit):
        file_path, _ = QFileDialog.getOpenFileName(self, "Select File", "", "All Files (*)")
        if file_path:
            line_edit.setText(file_path)
            self.on_field_changed(field_name, file_path)

    def browse_folder(self, field_name, line_edit):
        folder_path = QFileDialog.getExistingDirectory(self, "Select Folder")
        if folder_path:
            line_edit.setText(folder_path)
            self.on_field_changed(field_name, folder_path)

    def update_save_button_state(self):
        # Check if all required fields are filled
        missing = []
        for field in getattr(self, 'required_fields', []):
            val = self.current_config.get(field, "")
            if not val:
                missing.append(field)
        self.missing_required = bool(missing)
        if self.missing_required:
            self.save_btn.setEnabled(False)
            if self.required_warning_label:
                self.required_warning_label.setText(f"Please fill all required fields: {', '.join(missing)}")
        else:
            self.save_btn.setEnabled(True)
            if self.required_warning_label:
                self.required_warning_label.setText("") 