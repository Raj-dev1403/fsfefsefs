from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QListWidget, QListWidgetItem,
    QLabel, QLineEdit, QGridLayout, QScrollArea, QPushButton, QSizePolicy
)
from PyQt6.QtGui import QPixmap, QIcon
from PyQt6.QtCore import Qt, QSize
import os

class IconLibraryTab(QWidget):
    def __init__(self, icon_pack_manager=None, icons_list=None):
        super().__init__()
        self.icon_pack_manager = icon_pack_manager
        self.icons_list = icons_list
        self.selected_pack = None
        self.setup_ui()

    def setup_ui(self):
        # Set object name and class for QSS targeting
        self.setObjectName("icon-library-tab")
        self.setProperty("class", "IconLibraryTab")
        main_layout = QVBoxLayout(self)
        # Search bar
        search_layout = QHBoxLayout()
        self.search_bar = QLineEdit()
        self.search_bar.setPlaceholderText("Search in icons...")
        self.search_bar.textChanged.connect(self.on_search)
        search_layout.addWidget(self.search_bar)
        main_layout.addLayout(search_layout)

        if self.icons_list is not None:
            # Flat icon list mode (no packs)
            self.icons_area = QScrollArea()
            self.icons_area.setWidgetResizable(True)
            self.icons_widget = QWidget()
            self.icons_grid = QGridLayout(self.icons_widget)
            self.icons_grid.setSpacing(8)
            self.icons_area.setWidget(self.icons_widget)
            main_layout.addWidget(self.icons_area)
            self.populate_flat_icons()
        else:
            # Packs list mode (default)
            packs_layout = QHBoxLayout()
            self.packs_list = QListWidget()
            self.packs_list.setMaximumWidth(250)
            self.packs_list.itemClicked.connect(self.on_pack_selected)
            packs_layout.addWidget(self.packs_list)

            # Icons grid
            self.icons_area = QScrollArea()
            self.icons_area.setWidgetResizable(True)
            self.icons_widget = QWidget()
            self.icons_grid = QGridLayout(self.icons_widget)
            self.icons_grid.setSpacing(8)
            self.icons_area.setWidget(self.icons_widget)
            packs_layout.addWidget(self.icons_area)

            main_layout.addLayout(packs_layout)
            self.setLayout(main_layout)
            self.populate_packs()
        self.setLayout(main_layout)

    def populate_packs(self):
        self.packs_list.clear()
        if not self.icon_pack_manager:
            return
        for pack_name, pack in self.icon_pack_manager.get_packs().items():
            manifest = pack.get("manifest", {})
            label = manifest.get("Name", pack_name)
            count = len(pack.get("icons", []))
            item = QListWidgetItem(f"{label} ({count})")
            item.setData(Qt.ItemDataRole.UserRole, pack_name)
            self.packs_list.addItem(item)

    def populate_flat_icons(self, filter_text=None):
        # Show all icons in self.icons_list, optionally filtered
        if self.icons_list is None:
            return
        icons = self.icons_list
        if filter_text:
            icons = [icon for icon in icons if filter_text.lower() in os.path.basename(icon).lower()]
        # Clear grid
        for i in reversed(range(self.icons_grid.count())):
            item = self.icons_grid.itemAt(i)
            widget = item.widget() if item else None
            if widget:
                widget.setParent(None)
        row, col = 0, 0
        for icon_path in icons:
            icon_btn = QPushButton()
            icon_btn.setIcon(QIcon(QPixmap(icon_path)))
            icon_btn.setIconSize(QSize(48, 48))
            icon_btn.setFixedSize(56, 56)
            icon_btn.setToolTip(os.path.basename(icon_path))
            icon_btn.clicked.connect(lambda checked, p=icon_path: self.on_icon_selected(p))
            self.icons_grid.addWidget(icon_btn, row, col)
            col += 1
            if col >= 8:
                col = 0
                row += 1

    def on_pack_selected(self, item):
        if not self.icon_pack_manager:
            return
        pack_name = item.data(Qt.ItemDataRole.UserRole)
        self.selected_pack = pack_name
        self.populate_icons(pack_name)

    def populate_icons(self, pack_name):
        if not self.icon_pack_manager:
            return
        # Clear grid
        for i in reversed(range(self.icons_grid.count())):
            item = self.icons_grid.itemAt(i)
            widget = item.widget() if item else None
            if widget:
                widget.setParent(None)
        icons = self.icon_pack_manager.get_icons(pack_name)
        row, col = 0, 0
        for icon in icons:
            icon_path = icon.get("abs_path")
            icon_btn = QPushButton()
            icon_btn.setIcon(QIcon(QPixmap(icon_path)))
            icon_btn.setIconSize(QSize(48, 48))
            icon_btn.setFixedSize(56, 56)
            icon_btn.setToolTip(icon.get("name", ""))
            icon_btn.clicked.connect(lambda checked, p=icon_path: self.on_icon_selected(p))
            self.icons_grid.addWidget(icon_btn, row, col)
            col += 1
            if col >= 8:
                col = 0
                row += 1

    def on_icon_selected(self, icon_path):
        # You can connect this to your button config logic
        print(f"Selected icon: {icon_path}")

    def on_search(self, text):
        if self.icons_list is not None:
            self.populate_flat_icons(filter_text=text)
            return
        if not self.selected_pack or not self.icon_pack_manager:
            return
        icons = self.icon_pack_manager.get_icons(self.selected_pack)
        filtered = [icon for icon in icons if text.lower() in icon.get("name", "").lower()]
        # Clear grid
        for i in reversed(range(self.icons_grid.count())):
            item = self.icons_grid.itemAt(i)
            widget = item.widget() if item else None
            if widget:
                widget.setParent(None)
        row, col = 0, 0
        for icon in filtered:
            icon_path = icon.get("abs_path")
            icon_btn = QPushButton()
            icon_btn.setIcon(QIcon(QPixmap(icon_path)))
            icon_btn.setIconSize(QSize(48, 48))
            icon_btn.setFixedSize(56, 56)
            icon_btn.setToolTip(icon.get("name", ""))
            icon_btn.clicked.connect(lambda checked, p=icon_path: self.on_icon_selected(p))
            self.icons_grid.addWidget(icon_btn, row, col)
            col += 1
            if col >= 8:
                col = 0
                row += 1 