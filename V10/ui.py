"""
Nextion Stream Deck - Main UI Implementation
Main PyQt6 interface components and window
"""

import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QGridLayout, QPushButton, QApplication, QHBoxLayout, QVBoxLayout, QLabel, QFrame,
    QComboBox, QLineEdit, QTextEdit, QTabWidget, QGroupBox, QSpinBox, QCheckBox, QListWidget, QListWidgetItem,
    QMessageBox, QFileDialog, QStatusBar, QMenuBar, QMenu, QSystemTrayIcon,
    QFormLayout, QSlider, QPushButton as QtPushButton, QSpacerItem, QSizePolicy
)
from PyQt6.QtCore import Qt, QTimer, pyqtSignal, QSize
from PyQt6.QtGui import (
    QIcon, QFont, QColor, QPalette, QPixmap, QPainter, QBrush,
    QLinearGradient, QAction, QKeySequence, QFontDatabase
)

from ui_components import (
    ModernButton, StreamDeckButton, 
    PluginCreatorDialog, LogHandler
)
from right_menu_widget import RightMenuWidget
from property_inspector_widget import PropertyInspectorWidget
from aao_client import AAOClient
from nextion_button_manager import NextionButtonManager
import os
from icon_pack_manager import IconPackManager
from icon_library_tab import IconLibraryTab

class StreamDeckMainWindow(QMainWindow):
    def __init__(self, app_instance):
        super().__init__()
        self.app_instance = app_instance
        self.setWindowTitle("Stream Deck Neo")
        self.setFixedSize(1200, 700)
        
        # Apply comprehensive QSS styling
        self.apply_stylesheet()
        
        central = QWidget()
        self.setCentralWidget(central)
        main_layout = QHBoxLayout()
        central.setLayout(main_layout)

        # Button grid area (reuse your existing grid logic, or import from another file)
        from ui_components import StreamDeckButton
        self.grid_layout = QGridLayout()
        self.grid_layout.setSpacing(16)
        self.grid_layout.setContentsMargins(32, 32, 32, 32)
        self.grid_buttons = []
        for row in range(4):
            row_buttons = []
            for col in range(6):
                btn = StreamDeckButton(row, col)  # Use 0-based indices for internal logic
                self.grid_layout.addWidget(btn, row, col)
                row_buttons.append(btn)
            self.grid_buttons.append(row_buttons)
        grid_widget = QWidget()
        grid_widget.setLayout(self.grid_layout)
        grid_widget.setObjectName("button-grid-container")
        main_layout.addWidget(grid_widget, stretch=1)
        
        # Property Inspector
        self.property_inspector = PropertyInspectorWidget()
        self.property_inspector.config_saved.connect(self.on_button_config_saved)
        main_layout.addWidget(self.property_inspector, stretch=1)
        
        # Right Menu
        plugins = []
        for plugin_name, plugin in self.app_instance.plugin_manager.get_all_plugins().items():
            actions = []
            for action_name in plugin.get_actions().keys():
                actions.append({
                    'name': action_name,
                    'label': action_name.replace('_', ' ').title(),
                    'icon': getattr(plugin, 'icon', None)
                })
            plugins.append({
                'name': plugin_name,
                'label': getattr(plugin, 'name', plugin_name),
                'icon': getattr(plugin, 'icon', None),
                'actions': actions
            })
        self.right_menu = RightMenuWidget(plugins)
        main_layout.addWidget(self.right_menu, stretch=1)
        
        # Connect signals
        self.right_menu.action_selected.connect(self.on_action_selected)
        self.right_menu.action_dragged.connect(self.on_action_dragged)
        
        # Connect button drop signals
        for row in range(len(self.grid_buttons)):
            for col in range(len(self.grid_buttons[row])):
                button = self.grid_buttons[row][col]
                button.action_dropped.connect(self.on_action_dropped)
                button.button_clicked.connect(self.on_button_clicked)
        
        # Initialize attributes that plugins expect
        self.current_page = 0
        self.stream_deck_buttons = {}
        self._update_button_dictionary()
        
    def _update_button_dictionary(self):
        """Update the button dictionary for plugin access"""
        self.stream_deck_buttons.clear()
        for row in range(len(self.grid_buttons)):
            for col in range(len(self.grid_buttons[row])):
                button_key = f"{row}_{col}"
                self.stream_deck_buttons[button_key] = self.grid_buttons[row][col]
        
    def apply_stylesheet(self):
        """Apply comprehensive QSS styling based on the CSS design"""
        stylesheet = """
        /* Main Window */
        QMainWindow {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        
        /* Central Widget */
        QWidget#centralwidget {
            background-color: #2d2d2d;
        }
        
        /* Button Grid Container */
        QWidget#button-grid-container {
            background-color: #1a1a1a;
            border: none;
        }
        
        /* Stream Deck Buttons */
        QFrame[class="StreamDeckButton"] {
            background-color: #333333;
            border: 2px solid transparent;
            border-radius: 12px;
            margin: 1px;
        }
        
        QFrame[class="StreamDeckButton"]:hover {
            border-color: #555555;
            background-color: #3a3a3a;
        }
        
        QFrame[class="StreamDeckButton"][selected="true"] {
            border-color: #007AFF;
            background-color: #333333;
        }
        
        QFrame[class="StreamDeckButton"][drop-zone="true"] {
            border-color: #00FF00;
            background-color: rgba(0, 255, 0, 0.1);
            border-width: 3px;
            border-style: solid;
        }
        
        QFrame[class="StreamDeckButton"][pressed="true"] {
            background-color: #3a7bd5;
            border: 2.5px solid #4CAF50;
            border-radius: 18px;
            margin: 2px;
        }
        
        /* Button Labels */
        QLabel[class="button-icon"] {
            background: transparent;
            border: none;
            color: #cccccc;
            font-size: 24px;
            font-weight: bold;
        }
        
        QLabel[class="button-icon"][live-value="true"] {
            color: #4CAF50;
            font-size: 32px;
                font-weight: bold;
        }
        
        /* Predefined Button Styles */
        QFrame[class="StreamDeckButton"][button-type="youtube"] {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                stop:0 #ff0000, stop:1 #cc0000);
        }
        
        QFrame[class="StreamDeckButton"][button-type="windscribe"] {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                stop:0 #ffd700, stop:1 #ffb347);
        }
        
        QFrame[class="StreamDeckButton"][button-type="mixer"] {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                stop:0 #4a90e2, stop:1 #357abd);
        }
        
        QFrame[class="StreamDeckButton"][button-type="audio"] {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                stop:0 #333333, stop:1 #555555);
        }
        
        QFrame[class="StreamDeckButton"][button-type="system"] {
            background: qlineargradient(x1:0, y1:0, x2:1, y2:1, 
                stop:0 #666666, stop:1 #888888);
        }
        
        /* Right Menu */
        QWidget[class="RightMenuWidget"] {
            background-color: #2d2d2d;
            border-left: 1px solid #444444;
        }
        
        /* Actions Panel */
        QWidget[class="actions-panel"] {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QLabel[class="actions-header"] {
                color: #ffffff;
            font-size: 16px;
            font-weight: bold;
            padding: 10px;
            background-color: #333333;
            border-bottom: 1px solid #444444;
        }
        
        /* Action Categories */
        QGroupBox[class="action-category"] {
                color: #ffffff;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
        }
        
        QGroupBox[class="action-category"]::title {
            color: #cccccc;
            font-size: 14px;
            font-weight: bold;
            padding: 5px;
        }
        
        /* Action Items */
        QWidget[class="action-item"] {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 6px;
            padding: 8px;
            margin: 2px;
        }
        
        QWidget[class="action-item"]:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        QWidget[class="action-item"]:pressed {
            background-color: #303030;
            border-color: #444444;
        }
        
        /* Draggable items */
        QListWidget::item {
            background-color: #404040;
            border: 1px solid #555555;
                border-radius: 4px;
            padding: 6px;
            margin: 2px;
        }
        
        QListWidget::item:hover {
            background-color: #505050;
            border-color: #007AFF;
        }
        
        QListWidget::item:selected {
            background-color: #007AFF;
            border-color: #007AFF;
        }
        
        /* Action Icons */
        QLabel[class="action-icon"] {
            background: transparent;
            border: none;
            color: #cccccc;
            font-size: 20px;
        }
        
        /* Action Names */
        QLabel[class="action-name"] {
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 12px;
            font-weight: 500;
        }
        
        /* Property Inspector */
        QWidget[class="PropertyInspectorWidget"] {
            background-color: #2d2d2d;
            border-left: 1px solid #444444;
        }
        
        /* Property Header */
        QWidget[class="property-header"] {
            background-color: #333333;
            border-bottom: 1px solid #444444;
            padding: 10px;
        }
        
        QLabel[class="property-icon"] {
            background: transparent;
            border: none;
            color: #cccccc;
            font-size: 24px;
        }
        
        QLabel[class="property-title"] {
            color: #ffffff;
            font-size: 16px;
            font-weight: bold;
        }
        
        QLabel[class="property-subtitle"] {
            color: #cccccc;
            font-size: 12px;
        }
        
        QLabel[class="info-label"] {
            color: #cccccc;
            font-size: 12px;
            padding: 2px 0px;
        }
        
        /* Property Fields */
        QWidget[class="property-field"] {
            padding: 8px;
            margin: 2px;
        }
        
        QLabel[class="field-label"] {
            color: #cccccc;
            font-size: 12px;
            font-weight: 500;
        }
        
        QLineEdit, QComboBox, QSpinBox {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 6px;
            font-size: 12px;
        }
        
        QLineEdit:focus, QComboBox:focus, QSpinBox:focus {
            border-color: #007AFF;
            background-color: #505050;
        }
        
        QComboBox::drop-down {
            border: none;
            width: 20px;
        }
        
        QComboBox::down-arrow {
            image: none;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #cccccc;
        }
        
        QCheckBox {
            color: #cccccc;
            font-size: 12px;
        }
        
        QCheckBox::indicator {
            width: 16px;
            height: 16px;
            border: 1px solid #555555;
            border-radius: 3px;
            background-color: #404040;
        }
        
        QCheckBox::indicator:checked {
            background-color: #007AFF;
            border-color: #007AFF;
        }
        
        /* Buttons */
        QPushButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 6px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 500;
            padding: 8px 16px;
            min-height: 20px;
        }
        
        QPushButton[class="ModernButton"] {
            background: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, 
                stop:0 rgba(64, 64, 64, 255), stop:1 rgba(48, 48, 48, 255));
            border: 1px solid #555;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            padding: 8px 16px;
            min-height: 20px;
        }
        
        QPushButton[class="ModernButton"]:hover {
            background: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, 
                stop:0 rgba(80, 80, 80, 255), stop:1 rgba(64, 64, 64, 255));
            border: 1px solid #777;
        }
        
        QPushButton[class="ModernButton"]:pressed {
            background: qlineargradient(spread:pad, x1:0, y1:0, x2:0, y2:1, 
                stop:0 rgba(32, 32, 32, 255), stop:1 rgba(48, 48, 48, 255));
            border: 1px solid #333;
        }
        
        QPushButton[class="ModernButton"]:disabled {
            background: #2a2a2a;
            color: #666;
            border: 1px solid #333;
        }
        
        QPushButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        QPushButton:pressed {
            background-color: #303030;
            border-color: #444444;
        }
        
        QPushButton[class="btn-primary"] {
            background-color: #007AFF;
            border-color: #007AFF;
        }
        
        QPushButton[class="btn-primary"]:hover {
            background-color: #0056CC;
            border-color: #0056CC;
        }
        
        QPushButton[class="btn-secondary"] {
            background-color: #666666;
            border-color: #666666;
        }
        
        QPushButton[class="btn-secondary"]:hover {
            background-color: #777777;
            border-color: #777777;
        }
        
        /* Scroll Areas */
        QScrollArea {
            background-color: transparent;
            border: none;
        }
        
        QScrollBar:vertical {
            background-color: #2d2d2d;
            width: 12px;
            border-radius: 6px;
        }
        
        QScrollBar::handle:vertical {
            background-color: #555555;
            border-radius: 6px;
            min-height: 20px;
        }
        
        QScrollBar::handle:vertical:hover {
            background-color: #666666;
        }
        
        QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
            height: 0px;
        }
        
        /* Tabs */
        QTabWidget::pane {
            border: 1px solid #444444;
            background-color: #2d2d2d;
        }
        
        QTabBar::tab {
            background-color: #404040;
            color: #cccccc;
            padding: 8px 16px;
            margin-right: 2px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
        
        QTabBar::tab:selected {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QTabBar::tab:hover {
            background-color: #505050;
        }
        
        /* Lists */
        QListWidget {
            background-color: #2d2d2d;
            border: 1px solid #444444;
            color: #ffffff;
        }
        
        QListWidget::item {
            padding: 8px;
            border-bottom: 1px solid #444444;
        }
        
        QListWidget::item:selected {
            background-color: #007AFF;
        }
        
        QListWidget::item:hover {
            background-color: #505050;
        }
        
        /* Group Boxes */
        QGroupBox {
            color: #ffffff;
            font-weight: bold;
            border: 1px solid #444444;
            border-radius: 6px;
            margin-top: 10px;
            padding-top: 10px;
        }
        
        QGroupBox::title {
            subcontrol-origin: margin;
            left: 10px;
            padding: 0 5px 0 5px;
            color: #cccccc;
        }
        
        /* Form Layouts */
        QFormLayout {
            color: #ffffff;
        }
        
        /* Status Bar */
        QStatusBar {
            background-color: #333333;
            color: #cccccc;
            border-top: 1px solid #444444;
        }
        
        /* Menu Bar */
        QMenuBar {
            background-color: #333333;
            color: #ffffff;
            border-bottom: 1px solid #444444;
        }
        
        QMenuBar::item {
            background-color: transparent;
            padding: 8px 12px;
        }
        
        QMenuBar::item:selected {
            background-color: #505050;
        }
        
        QMenu {
            background-color: #2d2d2d;
            border: 1px solid #444444;
            color: #ffffff;
        }
        
        QMenu::item {
            padding: 8px 20px;
        }
        
        QMenu::item:selected {
            background-color: #007AFF;
        }
        
        QMenu::separator {
            height: 1px;
            background-color: #444444;
            margin: 4px 0px;
        }
        
        /* Dialogs */
        QDialog {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QDialog QLabel {
            color: #ffffff;
        }
        
        QDialog QLineEdit, QDialog QComboBox, QDialog QSpinBox, QDialog QTextEdit {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 6px;
        }
        
        QDialog QLineEdit:focus, QDialog QComboBox:focus, QDialog QSpinBox:focus, QDialog QTextEdit:focus {
            border-color: #007AFF;
            background-color: #505050;
        }
        
        QDialog QPushButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 6px;
            color: #ffffff;
            padding: 8px 16px;
            min-height: 20px;
        }
        
        QDialog QPushButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        QDialog QPushButton:pressed {
            background-color: #303030;
            border-color: #444444;
        }
        
        /* Dialog Button Box */
        QDialogButtonBox {
            background-color: transparent;
            border: none;
        }
        
        QDialogButtonBox QPushButton {
            min-width: 80px;
        }
        
        /* Icon Library */
        QWidget[class="IconLibraryTab"] {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QWidget[class="IconLibraryTab"] QLineEdit {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 8px;
            font-size: 12px;
        }
        
        QWidget[class="IconLibraryTab"] QLineEdit:focus {
            border-color: #007AFF;
            background-color: #505050;
        }
        
        QWidget[class="IconLibraryTab"] QPushButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
        }
        
        QWidget[class="IconLibraryTab"] QPushButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        /* Tool Buttons */
        QToolButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 4px;
        }
        
        QToolButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        QToolButton:pressed {
            background-color: #303030;
            border-color: #444444;
        }
        
        /* Radio Buttons */
        QRadioButton {
            color: #ffffff;
            font-size: 12px;
        }
        
        QRadioButton::indicator {
            width: 16px;
            height: 16px;
            border: 1px solid #555555;
            border-radius: 8px;
            background-color: #404040;
        }
        
        QRadioButton::indicator:checked {
            background-color: #007AFF;
            border-color: #007AFF;
        }
        
        /* Sliders */
        QSlider::groove:horizontal {
            border: 1px solid #555555;
            height: 8px;
            background-color: #404040;
            border-radius: 4px;
        }
        
        QSlider::handle:horizontal {
            background-color: #007AFF;
            border: 1px solid #007AFF;
            width: 16px;
            height: 16px;
            border-radius: 8px;
            margin: -4px 0;
        }
        
        QSlider::handle:horizontal:hover {
            background-color: #0056CC;
            border-color: #0056CC;
        }
        
        /* Text Edit */
        QTextEdit {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 6px;
            font-size: 12px;
        }
        
        QTextEdit:focus {
            border-color: #007AFF;
            background-color: #505050;
        }
        
        /* File Dialog */
        QFileDialog {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QFileDialog QTreeView, QFileDialog QListView {
            background-color: #2d2d2d;
            border: 1px solid #444444;
            color: #ffffff;
        }
        
        QFileDialog QTreeView::item, QFileDialog QListView::item {
            padding: 4px;
        }
        
        QFileDialog QTreeView::item:selected, QFileDialog QListView::item:selected {
            background-color: #007AFF;
        }
        
        QFileDialog QTreeView::item:hover, QFileDialog QListView::item:hover {
            background-color: #505050;
        }
        
        /* Message Box */
        QMessageBox {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QMessageBox QLabel {
            color: #ffffff;
        }
        
        QMessageBox QPushButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 6px;
            color: #ffffff;
            padding: 8px 16px;
            min-width: 80px;
        }
        
        QMessageBox QPushButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        /* Progress Bar */
        QProgressBar {
            border: 1px solid #555555;
            border-radius: 4px;
            text-align: center;
            background-color: #404040;
            color: #ffffff;
        }
        
        QProgressBar::chunk {
            background-color: #007AFF;
            border-radius: 3px;
        }
        
        /* Splitter */
        QSplitter::handle {
            background-color: #444444;
        }
        
        QSplitter::handle:horizontal {
            width: 2px;
        }
        
        QSplitter::handle:vertical {
            height: 2px;
        }
        
        /* Frame */
        QFrame {
            background-color: transparent;
            border: none;
        }
        
        QFrame[frameShape="4"] {
            border: 1px solid #444444;
        }
        
        /* Button Config Dialog */
        QDialog#button-config-dialog {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        QDialog#button-config-dialog QLabel[class="property-title"] {
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        QDialog#button-config-dialog QLabel[class="property-subtitle"] {
            color: #cccccc;
            font-size: 12px;
        }
        
        QDialog#button-config-dialog QGroupBox {
            color: #ffffff;
            font-weight: bold;
            border: 1px solid #444444;
            border-radius: 6px;
            margin-top: 8px;
            padding-top: 8px;
        }
        
        QDialog#button-config-dialog QGroupBox::title {
            subcontrol-origin: margin;
            left: 8px;
            padding: 0 4px 0 4px;
        }
        
        QDialog#button-config-dialog QLineEdit, QDialog#button-config-dialog QTextEdit {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 4px;
            color: #ffffff;
            padding: 6px;
            font-size: 12px;
        }
        
        QDialog#button-config-dialog QLineEdit:focus, QDialog#button-config-dialog QTextEdit:focus {
            border-color: #007AFF;
            background-color: #505050;
        }
        
        QDialog#button-config-dialog QPushButton {
            background-color: #404040;
            border: 1px solid #555555;
            border-radius: 6px;
            color: #ffffff;
            padding: 8px 16px;
            min-width: 80px;
        }
        
        QDialog#button-config-dialog QPushButton:hover {
            background-color: #505050;
            border-color: #666666;
        }
        
        QDialog#button-config-dialog QPushButton#save-button {
            background-color: #007AFF;
            border-color: #0056CC;
            color: #ffffff;
            font-weight: bold;
        }
        
        QDialog#button-config-dialog QPushButton#save-button:hover {
            background-color: #0056CC;
            border-color: #004499;
        }
        
        QDialog#button-config-dialog QCheckBox {
            color: #ffffff;
        }
        
        QDialog#button-config-dialog QCheckBox::indicator {
            width: 16px;
            height: 16px;
            border: 1px solid #555555;
            border-radius: 3px;
            background-color: #404040;
        }
        
        QDialog#button-config-dialog QCheckBox::indicator:checked {
            background-color: #007AFF;
            border-color: #0056CC;
        }
        
        /* Grid Layout */
        QGridLayout {
            background-color: transparent;
        }
        
        /* Horizontal and Vertical Layouts */
        QHBoxLayout, QVBoxLayout {
            background-color: transparent;
        }
        
        /* Spacer Items */
        QSpacerItem {
            background-color: transparent;
        }
        """
        
        self.setStyleSheet(stylesheet)
        
    def on_action_selected(self, data):
        # data: {'plugin': ..., 'action': ...}
        # Update property inspector for this action
        self.property_inspector.set_action(data['plugin'], data['action'], {})
        
    def on_action_dragged(self, data):
        # Handle drag-and-drop assignment to grid (implement as needed)
        pass
        
    def on_action_dropped(self, page_id: int, button_id: int, action_info: dict):
        """Handle when an action is dropped on a button"""
        # Update the property inspector with the dropped action
        plugin_name = action_info.get('plugin', '')
        action_name = action_info.get('action', '')
        parameters = action_info.get('parameters', {})
        
        # Update property inspector
        self.property_inspector.set_action(plugin_name, action_name, parameters)
        
        # Log the action assignment
        import logging
        logging.info(f"Action assigned to button {page_id}_{button_id}: {plugin_name}.{action_name}")
        
    def update_connection_status(self, connected: bool):
        """Update the connection status display"""
        if connected:
            self.setWindowTitle("Stream Deck Neo - Connected")
            # You can add a status bar or other visual indicator here
        else:
            self.setWindowTitle("Stream Deck Neo - Disconnected")
            
    def update_button_press_status(self, page_id: int, button_id: int):
        """Update button press status from Nextion"""
        if 0 <= page_id < len(self.grid_buttons) and 0 <= button_id < len(self.grid_buttons[page_id]):
            button = self.grid_buttons[page_id][button_id]
            button.flash_press()
            
    def update_inspector_for_button(self, page_id: int, button_id: int):
        """Update property inspector for a specific button"""
        if 0 <= page_id < len(self.grid_buttons) and 0 <= button_id < len(self.grid_buttons[page_id]):
            button = self.grid_buttons[page_id][button_id]
            if hasattr(button, 'button_config') and button.button_config:
                # Update the property inspector with the button's current config
                plugin_name = button.button_config.get('plugin', '')
                action_name = button.button_config.get('action', '')
                parameters = button.button_config.get('parameters', {})
                self.property_inspector.set_action(plugin_name, action_name, parameters)

    def on_button_clicked(self, page_id: int, button_id: int):
        """Update property inspector when a button is clicked"""
        if 0 <= page_id < len(self.grid_buttons) and 0 <= button_id < len(self.grid_buttons[page_id]):
            button = self.grid_buttons[page_id][button_id]
            # Clear selection from all other buttons
            for row in range(len(self.grid_buttons)):
                for col in range(len(self.grid_buttons[row])):
                    self.grid_buttons[row][col].set_selected(False)
            # Select the clicked button
            button.set_selected(True)
            # Update property inspector
            if hasattr(button, 'button_config') and button.button_config:
                plugin_name = button.button_config.get('plugin', '')
                action_name = button.button_config.get('action', '')
                parameters = button.button_config.get('parameters', {})
                # Add button position to the config for display
                display_config = button.button_config.copy()
                display_config['button_position'] = f"Row {page_id + 1}, Column {button_id + 1}"
                self.property_inspector.set_action(plugin_name, action_name, display_config)
            else:
                # Show default state for unconfigured buttons
                self.property_inspector.show_default_state()
            # Log the button selection
            import logging
            logging.info(f"Button {page_id}_{button_id} selected")

    def on_button_config_saved(self, button_config: dict):
        """Handle the signal when a button's configuration is saved."""
        # Update the button's display in the grid
        button_position = button_config.get('button_position', 'Row 1, Column 1')
        try:
            # Extract row and column from the position string (convert from 1-based to 0-based)
            parts = button_position.split()
            row = int(parts[1].rstrip(',')) - 1  # Convert to 0-based
            col = int(parts[3]) - 1  # Convert to 0-based
            if 0 <= row < len(self.grid_buttons) and 0 <= col < len(self.grid_buttons[row]):
                button = self.grid_buttons[row][col]
                # Update the button's configuration
                button.button_config = button_config
                button.update_config(button_config)
                # Update property inspector
                self.update_inspector_for_button(row, col)
                import logging
                logging.info(f"Button config saved: {button_config.get('plugin', 'Unknown')}.{button_config.get('action', 'Unknown')}")
            else:
                import logging
                logging.warning(f"Button position {button_position} out of bounds for grid.")
        except (IndexError, ValueError) as e:
            import logging
            logging.warning(f"Invalid button position format in config: {button_position} - {e}")