"""
Nextion Stream Deck - Main Application
A modern Stream Deck-like application for Nextion 5" displays
"""

import sys
import json
import logging
from pathlib import Path
from PyQt6.QtWidgets import QApplication
from PyQt6.QtCore import QTimer, QThread, pyqtSignal
import serial
import serial.tools.list_ports
from typing import Dict, Any, Optional, Callable
import importlib.util
import os
from datetime import datetime
import inspect

from ui import StreamDeckMainWindow
from plugins.base_plugin import BasePlugin, action
from plugins.system_plugin import SystemPlugin
from plugins.application_plugin import ApplicationPlugin
from plugins.multimedia_plugin import MultimediaPlugin
from plugins.website_plugin import WebsitePlugin
from plugins.volume_plugin import VolumePlugin

class NextionCommunicationThread(QThread):
    """Thread for handling Nextion display communication"""
    button_pressed = pyqtSignal(int, int)  # page_id, button_id
    connection_status = pyqtSignal(bool)
    
    def __init__(self, port: str = '', baudrate: int = 9600):
        super().__init__()
        self.port = port
        self.baudrate = baudrate
        self.serial_connection = None
        self.running = False
        
    def run(self):
        """Main thread loop for serial communication"""
        self.running = True
        
        # Try to connect to Nextion
        if self.port:
            try:
                self.serial_connection = serial.Serial(
                    port=self.port,
                    baudrate=self.baudrate,
                    timeout=1.0
                )
                self.connection_status.emit(True)
                logging.info(f"Connected to Nextion on {self.port}")
            except Exception as e:
                logging.error(f"Failed to connect to Nextion: {e}")
                self.connection_status.emit(False)
                return
        
        # Main communication loop
        while self.running:
            try:
                if self.serial_connection and self.serial_connection.in_waiting:
                    # Read until we find a '65' event (touch event)
                    header = self.serial_connection.read(1)
                    if header and header[0] == 0x65:
                        data = self.serial_connection.read(6)  # 6 more bytes: page_id, button_id, event, FF FF FF
                        if len(data) == 6:
                            page_id = data[0]
                            button_id = data[1]
                            # Optionally, check data[2] == 0x00 (event type: release)
                            # and data[3:6] == b'\xFF\xFF\xFF'
                            self.button_pressed.emit(page_id, button_id)
                            logging.info(f"Button pressed: Page {page_id}, Button {button_id}")
                self.msleep(10)  # Small delay to prevent excessive CPU usage
                
            except Exception as e:
                logging.error(f"Communication error: {e}")
                self.connection_status.emit(False)
                break
    
    def stop(self):
        """Stop the communication thread"""
        self.running = False
        if self.serial_connection:
            self.serial_connection.close()
        self.wait()

class PluginManager:
    """Manages plugin loading and execution"""
    
    def __init__(self):
        self.plugins: Dict[str, BasePlugin] = {}
        self.app_instance: Any = None
        self.load_built_in_plugins()
        self.load_custom_plugins()
        
    def load_built_in_plugins(self):
        """Load built-in plugins"""
        built_in_plugins = [
            SystemPlugin(),
            ApplicationPlugin(),
            MultimediaPlugin(),
            WebsitePlugin(),
            VolumePlugin()
        ]
        
        for plugin in built_in_plugins:
            self.plugins[plugin.name] = plugin
            logging.info(f"Loaded built-in plugin: {plugin.name}")
    
    def load_custom_plugins(self):
        """Load custom plugins from plugins directory"""
        plugins_dir = Path("plugins/custom")
        if not plugins_dir.exists():
            plugins_dir.mkdir(parents=True)
            return
        for plugin_file in plugins_dir.glob("*.py"):
            try:
                spec = importlib.util.spec_from_file_location(
                    plugin_file.stem, plugin_file
                )
                if spec is not None and spec.loader is not None:
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                # Look for plugin classes that inherit from BasePlugin
                for item_name in dir(module):
                    item = getattr(module, item_name)
                    if (isinstance(item, type) and 
                        issubclass(item, BasePlugin) and 
                        item != BasePlugin):
                        # Use inspect to check if app_instance is accepted
                        sig = inspect.signature(item.__init__)
                        if 'app_instance' in sig.parameters:
                            plugin_instance = item(app_instance=self.app_instance)
                        else:
                            plugin_instance = item()
                        self.plugins[plugin_instance.name] = plugin_instance
                        logging.info(f"Loaded custom plugin: {plugin_instance.name}")
            except Exception as e:
                logging.error(f"Failed to load plugin {plugin_file}: {e}")
    
    def get_plugin(self, name: str) -> Optional[BasePlugin]:
        """Get plugin by name"""
        return self.plugins.get(name)
    
    def get_all_plugins(self) -> Dict[str, BasePlugin]:
        """Get all available plugins"""
        return self.plugins.copy()
    
    def get_plugin_actions(self, plugin_name: str) -> Dict[str, Callable]:
        """Get all actions for a specific plugin"""
        plugin = self.get_plugin(plugin_name)
        if plugin:
            return plugin.get_actions()
        return {}

class ConfigManager:
    """Manages application configuration and button mappings"""
    
    def __init__(self, config_file: str = "config.json"):
        self.config_file = Path(config_file)
        self.config = self.load_config()

    def get_profiles_dir(self):
        profiles_dir = Path("profiles")
        profiles_dir.mkdir(exist_ok=True)
        return profiles_dir

    def save_profile(self, profile_name: str):
        profiles_dir = self.get_profiles_dir()
        profile_path = profiles_dir / f"{profile_name}.json"
        with open(profile_path, "w", encoding="utf-8") as f:
            json.dump(self.config, f, indent=2)

    def load_profile(self, profile_name: str):
        profiles_dir = self.get_profiles_dir()
        profile_path = profiles_dir / f"{profile_name}.json"
        if profile_path.exists():
            with open(profile_path, "r", encoding="utf-8") as f:
                self.config = json.load(f)
            self.save_config()  # Optionally update main config.json

    def list_profiles(self):
        profiles_dir = self.get_profiles_dir()
        return [p.stem for p in profiles_dir.glob("*.json")]
    
    def load_config(self) -> Dict[str, Any]:
        """Load configuration from file"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logging.error(f"Failed to load config: {e}")
                
        # Default configuration
        return {
            "serial_port": None,
            "serial_baudrate": 9600,
            "button_mappings": {},
            "pages": {},
            "theme": "dark",
            "auto_detect_serial": True,
            "auto_start_cpu_monitor": False
        }
    
    def save_config(self):
        """Save configuration to file"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save config: {e}")
    
    def get_button_mapping(self, page_id: int, button_id: int) -> Optional[Dict[str, Any]]:
        """Get button mapping for specific page and button"""
        key = f"{page_id}_{button_id}"
        return self.config.get("button_mappings", {}).get(key)
    
    def set_button_mapping(self, page_id: int, button_id: int, mapping: Dict[str, Any]):
        """Set button mapping for specific page and button"""
        key = f"{page_id}_{button_id}"
        if "button_mappings" not in self.config:
            self.config["button_mappings"] = {}
        self.config["button_mappings"][key] = mapping
        self.save_config()
    
    def get_available_serial_ports(self) -> list:
        """Get list of available serial ports"""
        ports = []
        for port in serial.tools.list_ports.comports():
            ports.append({
                "device": port.device,
                "description": port.description,
                "hwid": port.hwid
            })
        return ports

class StreamDeckApp:
    """Main application class"""
    
    def __init__(self):
        logging.info("StreamDeckApp: __init__ started")
        self.app = QApplication(sys.argv)
        self.config_manager = ConfigManager()
        logging.info("ConfigManager initialized")
        self.plugin_manager = PluginManager()
        logging.info("PluginManager initialized")
        self.plugin_manager.app_instance = self  # Store reference for plugins
        # Ensure all plugins have app_instance set
        for plugin in self.plugin_manager.get_all_plugins().values():
            # Use setattr to avoid linter warnings about undefined attributes
            setattr(plugin, 'app_instance', self)
        logging.info("All plugins have app_instance set")
        # Auto-start CPU monitoring if configured
        if self.config_manager.config.get("auto_start_cpu_monitor", False):
            cpu_plugin = self.plugin_manager.get_plugin("CPU Monitor")
            if cpu_plugin and hasattr(cpu_plugin, "start_monitoring") and callable(getattr(cpu_plugin, "start_monitoring")):
                logging.info("Starting CPU monitoring")
                cpu_plugin.start_monitoring()
        # Also try to start temperature plugin
        temp_plugin = self.plugin_manager.get_plugin("CPU Temperature")
        if temp_plugin and hasattr(temp_plugin, "start_monitoring") and callable(getattr(temp_plugin, "start_monitoring")):
            logging.info("Starting CPU temperature monitoring")
            temp_plugin.start_monitoring()
        self.nextion_thread = None
        self.main_window = None
        
        # Set up logging
        self.setup_logging()
        logging.info("Logging setup complete")
        
        # Initialize main window
        try:
            self.main_window = StreamDeckMainWindow(self)
            logging.info("StreamDeckMainWindow initialized")
        except Exception as e:
            logging.error(f"Failed to initialize StreamDeckMainWindow: {e}")
        
        # Connect to Nextion if configured
        try:
            self.connect_to_nextion()
            logging.info("connect_to_nextion called")
        except Exception as e:
            logging.error(f"Failed to connect to Nextion: {e}")
    
    def setup_logging(self):
        """Set up logging configuration"""
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / f"streamdeck_{datetime.now().strftime('%Y%m%d')}.log"),
                logging.StreamHandler()
            ]
        )
        logging.info("Logging initialized")
    
    def connect_to_nextion(self):
        """Connect to Nextion display"""
        logging.info("connect_to_nextion called")
        serial_port = self.config_manager.config.get("serial_port")
        baudrate = self.config_manager.config.get("serial_baudrate", 9600)
        logging.info(f"Serial port: {serial_port}, Baudrate: {baudrate}")
        
        if serial_port:
            try:
                self.nextion_thread = NextionCommunicationThread(serial_port, baudrate)
                self.nextion_thread.button_pressed.connect(self.handle_button_press)
                self.nextion_thread.connection_status.connect(self.handle_connection_status)
                self.nextion_thread.start()
                logging.info("NextionCommunicationThread started")
            except Exception as e:
                logging.error(f"Failed to start NextionCommunicationThread: {e}")
                # Don't treat this as a critical error - app can run without Nextion
                logging.info("Application will continue without Nextion connection")
        elif self.config_manager.config.get("auto_detect_serial", True):
            logging.info("Auto-detecting Nextion serial port")
            # Try to auto-detect Nextion
            self.auto_detect_nextion()
        else:
            logging.info("No serial port configured and auto-detect disabled. Nextion functionality will not be available.")
    
    def auto_detect_nextion(self):
        """Auto-detect Nextion display"""
        ports = self.config_manager.get_available_serial_ports()
        
        # Common Nextion identifiers
        nextion_identifiers = ["CH340", "CP210", "FT232", "Nextion"]
        
        for port in ports:
            for identifier in nextion_identifiers:
                if identifier.lower() in port["description"].lower():
                    logging.info(f"Auto-detected potential Nextion on {port['device']}")
                    self.config_manager.config["serial_port"] = port["device"]
                    self.config_manager.save_config()
                    self.connect_to_nextion()
                    return
    
    def handle_button_press(self, page_id: int, button_id: int):
        """Handle button press from Nextion"""
        logging.info(f"[Nextion] Raw event: page_id={page_id}, button_id={button_id}")
        mapping = self.config_manager.get_button_mapping(page_id, button_id)
        logging.info(f"[Nextion] Mapping for page {page_id}, button {button_id}: {mapping}")
        if mapping:
            plugin_name = mapping.get("plugin")
            action_name = mapping.get("action")
            parameters = mapping.get("parameters", {})
            logging.info(f"[Nextion] Plugin: {plugin_name}, Action: {action_name}, Parameters: {parameters}")
            if plugin_name and action_name:
                plugin = self.plugin_manager.get_plugin(plugin_name)
                if plugin:
                    try:
                        actions = plugin.get_actions()
                        if action_name in actions:
                            logging.info(f"[Nextion] Executing action: {plugin_name}.{action_name} with {parameters}")
                            actions[action_name](**parameters)
                            logging.info(f"[Nextion] Executed action: {plugin_name}.{action_name}")
                        else:
                            logging.error(f"[Nextion] Action not found: {action_name}")
                    except Exception as e:
                        logging.error(f"[Nextion] Error executing action: {e}")
                else:
                    logging.error(f"[Nextion] Plugin not found: {plugin_name}")
            else:
                logging.warning(f"[Nextion] Incomplete mapping for button {page_id}_{button_id}")
        else:
            logging.warning(f"[Nextion] No mapping found for button {page_id:02X} {button_id:02X}")
        # Update main window if open
        if self.main_window:
            self.main_window.update_button_press_status(page_id, button_id)
            # Always update the property inspector for this button
            if hasattr(self.main_window, 'update_inspector_for_button'):
                logging.info(f"[Nextion] Updating inspector for button {page_id}, {button_id} after Nextion press")
                self.main_window.update_inspector_for_button(page_id, button_id)
    
    def handle_connection_status(self, connected: bool):
        """Handle Nextion connection status"""
        if connected:
            logging.info("Connected to Nextion display")
        else:
            logging.warning("Disconnected from Nextion display")
            
        # Update main window status
        if self.main_window:
            self.main_window.update_connection_status(connected)
    
    def send_to_nextion(self, data: bytes):
        """Send raw bytes to the Nextion display if connected."""
        if self.nextion_thread and self.nextion_thread.serial_connection and self.nextion_thread.serial_connection.is_open:
            try:
                self.nextion_thread.serial_connection.write(data)
                logging.info(f"Sent to Nextion: {data}")
            except Exception as e:
                logging.error(f"Failed to send to Nextion: {e}")
        else:
            logging.warning("Nextion serial connection not available.")
    
    def run(self):
        """Start the application"""
        if not self.main_window:
            logging.critical("Main window failed to initialize. Exiting.")
            print("Critical error: Main window failed to initialize. Exiting.")
            return 1  # Non-zero exit code for error
        self.main_window.show()
        
        # Set up exit handler
        self.app.aboutToQuit.connect(self.cleanup)
        
        return self.app.exec()
    
    def cleanup(self):
        """Clean up resources before exit"""
        if self.nextion_thread:
            self.nextion_thread.stop()
        logging.info("Application shutting down")

def main():
    """Main entry point"""
    app = StreamDeckApp()
    sys.exit(app.run())

if __name__ == "__main__":
    main()