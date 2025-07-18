"""
Stream Deck Core - Central App Management
This file centralizes all app setup, plugin loading, icon management, and UI launching.
Edit this file to restructure your app, add plugins, or manage icons.
"""

import sys
import os
from pathlib import Path
from PyQt6.QtWidgets import QApplication
from ui import StreamDeckMainWindow
from icon_library_tab import IconLibraryTab
from plugins.base_plugin import BasePlugin
from plugins.system_plugin import SystemPlugin
from plugins.application_plugin import ApplicationPlugin
from plugins.multimedia_plugin import MultimediaPlugin
from plugins.website_plugin import WebsitePlugin
from plugins.volume_plugin import VolumePlugin

# --- ICON MANAGEMENT ---
def scan_icons():
    """Scan both 'icons/' and 'IconPacks/' for .png and .svg icons."""
    icon_dirs = [Path('icons')]
    iconpacks_dir = Path('IconPacks')
    if iconpacks_dir.exists():
        for pack in iconpacks_dir.iterdir():
            if (pack / 'icons').exists():
                icon_dirs.append(pack / 'icons')
    icons = []
    for icon_dir in icon_dirs:
        if icon_dir.exists():
            for file in icon_dir.iterdir():
                if file.suffix.lower() in ['.png', '.svg']:
                    icons.append(str(file.resolve()))
    return icons

# --- PLUGIN MANAGEMENT ---
def load_plugins():
    """Load built-in plugins. Add your custom plugins here."""
    plugins = [
        SystemPlugin(),
        ApplicationPlugin(),
        MultimediaPlugin(),
        WebsitePlugin(),
        VolumePlugin(),
        # Add custom plugins here
    ]
    return {plugin.name: plugin for plugin in plugins}

# --- MAIN APP CLASS ---
class StreamDeckCoreApp:
    def __init__(self):
        self.app = QApplication(sys.argv)
        self.plugins = load_plugins()
        self.icons = scan_icons()
        self.main_window = None

    def launch(self):
        # Pass icons and plugins to the main window (extend StreamDeckMainWindow as needed)
        self.main_window = StreamDeckMainWindow(self)
        # Add or update the icon tab
        icon_tab = IconLibraryTab(self)
        icon_tab.icons = self.icons  # Provide icons list to the tab
        # You may need to update StreamDeckMainWindow to accept and use this icon_tab
        self.main_window.icon_library_tab = icon_tab
        self.main_window.show()
        sys.exit(self.app.exec())

    # Example: expose icons for use in the icon tab
    def get_all_icons(self):
        return self.icons

    # Example: expose plugins for use in the UI
    def get_all_plugins(self):
        return self.plugins

if __name__ == "__main__":
    app = StreamDeckCoreApp()
    app.launch() 