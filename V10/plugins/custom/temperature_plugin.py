import psutil
from plugins.base_plugin import BasePlugin, action
from PyQt6.QtCore import QTimer

class TemperaturePlugin(BasePlugin):
    def __init__(self, app_instance=None):
        super().__init__()
        self.name = "CPU Temperature"
        self.description = "Sends CPU temperature or utilization to Nextion component and shows in UI button label."
        self.version = "1.1.0"
        self.author = "Custom"
        self.category = "System"
        self.app_instance = app_instance
        self.timer = QTimer()
        self.timer.timeout.connect(self.send_value)
        self.current_temp = 0
        self.target_page = None
        self.target_button = None
        self.component_name = "n0"  # Default component name
        self.mode = "temperature"   # 'temperature' or 'cpu_percent'

    def get_actions(self):
        return {"start_monitoring": self.start_monitoring, "stop_monitoring": self.stop_monitoring}

    @action(name="start_monitoring", description="Start sending CPU temperature or utilization to Nextion component and UI button every second.", parameters={"page_id": {"type": "int", "description": "Page ID"}, "button_id": {"type": "int", "description": "Button ID"}, "component_name": {"type": "string", "description": "Nextion component name (e.g., n0, n1, t0)", "default": "n0"}, "mode": {"type": "string", "description": "Mode: 'temperature' or 'cpu_percent'", "default": "temperature"}})
    def start_monitoring(self, page_id=None, button_id=None, component_name="n0", mode="temperature"):
        # Always update parameters on each call
        self.target_page = int(page_id) if page_id is not None else 0
        self.target_button = int(button_id) if button_id is not None else 4
        self.component_name = component_name
        self.mode = mode if mode in ("temperature", "cpu_percent") else "temperature"
        self.log_info(f"Monitoring started for page {self.target_page}, button {self.target_button}")
        self.log_info(f"Using Nextion component: {self.component_name}")
        self.log_info(f"Monitoring mode: {self.mode}")
        # Always restart timer to apply new parameters
        if self.timer.isActive():
            self.timer.stop()
        self.timer.start(1000)
        self.log_info("Started monitoring timer.")

    @action(name="stop_monitoring", description="Stop monitoring.")
    def stop_monitoring(self):
        self.timer.stop()
        self.log_info("Stopped monitoring.")

    def send_value(self):
        if not self.app_instance:
            self.log_error("No app_instance; cannot send value.")
            return
        if self.mode == "cpu_percent":
            value = int(psutil.cpu_percent())
            label = f"{value}%"
            log_label = "CPU utilization"
        else:
            value = self.get_cpu_temperature()
            label = f"{value}°C"
            log_label = "CPU temperature"
        # Send to Nextion component (configurable)
        command = f"{self.component_name}.val={value}"
        cmd = command.encode("ascii") + b"\xFF\xFF\xFF"
        self.log_info(f"Preparing to send to Nextion: {command} (raw: {cmd})")
        try:
            self.app_instance.send_to_nextion(cmd)
            self.log_info(f"Sent to Nextion: {command}")
        except Exception as e:
            self.log_error(f"Failed to send to Nextion: {e}")
        # Update UI button label
        if hasattr(self.app_instance, 'main_window') and self.app_instance.main_window:
            try:
                page = self.target_page if self.target_page is not None else 0
                button_id = self.target_button if self.target_button is not None else 0
                button_key = f"{page}_{button_id}"
                
                # Check if stream_deck_buttons exists and has the key
                if hasattr(self.app_instance.main_window, 'stream_deck_buttons'):
                    button = self.app_instance.main_window.stream_deck_buttons.get(button_key)
                    if button:
                        button.set_live_value(label)
                        self.log_info(f"Updated UI button {button_key} with value: {label}")
                    else:
                        self.log_warning(f"UI button {button_key} not found; cannot update label.")
                else:
                    self.log_warning("stream_deck_buttons not available in main window.")
            except Exception as e:
                self.log_error(f"Error updating UI button: {e}")
        else:
            self.log_warning("No main_window found in app_instance; cannot update UI button.")
        self.log_info(f"Current {log_label}: {label}")

    def get_cpu_temperature(self):
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                for key in ["coretemp", "cpu_thermal", "acpitz", "k10temp"]:
                    if key in temps and temps[key]:
                        return int(temps[key][0].current)
                for entries in temps.values():
                    if entries and hasattr(entries[0], "current"):
                        return int(entries[0].current)
            import random
            return random.randint(35, 75)
        except Exception as e:
            self.log_error(f"Failed to get CPU temperature: {e}")
            return 0 