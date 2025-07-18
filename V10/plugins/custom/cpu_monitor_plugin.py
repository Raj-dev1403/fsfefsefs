import psutil
import platform
try:
    import cpuinfo
except ImportError:
    cpuinfo = None
from PyQt6.QtCore import QTimer
from plugins.base_plugin import BasePlugin, action

class CpuMonitorPlugin(BasePlugin):
    """
    CPU Monitor Plugin for Nextion Stream Deck

    Nextion Component Structure:
    - Component Name: n0 (used in commands)
    - Component ID: 05 (internal, ignore for commands)
    - Page: 00 (page 0)

    📝 Correct Nextion Commands:
    When sending from your Python app, use the component name (n0), not the ID:
        cmd = f"n0.val={temperature}".encode("ascii") + b"\xFF\xFF\xFF"
    ❌ Do NOT use the ID number:
        # cmd = f"05.val={temperature}".encode("ascii") + b"\xFF\xFF\xFF"

    📋 Nextion Component Naming Rules:
    - Number components: n0, n1, n2, etc.
    - Text components: t0, t1, t2, etc.
    - Button components: b0, b1, b2, etc.
    - Picture components: p0, p1, p2, etc.
    The ID (05) is just Nextion's internal tracking number - you don't use it in commands.
    """
    def __init__(self, app_instance=None, *args, **kwargs):
        super().__init__()
        self.name = "CPU Monitor"
        self.description = "Live CPU usage and temperature monitor for Nextion display."
        self.version = "1.1.0"
        self.author = "Custom"
        self.category = "System"
        self.app_instance = app_instance
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_monitoring)
        self.monitoring = False
        self.update_interval = 1000  # ms
        self.temp_unit = "C"  # or "F"
        self.nextion_component = "n0"  # default component
        self.load_plugin_config()

    def load_plugin_config(self):
        # Try to load config from app_instance if available
        config = None
        if self.app_instance and hasattr(self.app_instance, "config_manager"):
            config = self.app_instance.config_manager.config.get("cpu_monitor", {})
        if config:
            self.update_interval = int(config.get("update_interval", 1)) * 1000
            self.temp_unit = config.get("temperature_unit", "C")
            self.nextion_component = config.get("nextion_component", "n0")
        self.timer.setInterval(self.update_interval)

    def get_actions(self):
        return {
            "send_cpu_usage": self.send_cpu_usage,
            "send_cpu_temperature": self.send_cpu_temperature,
            "start_monitoring": self.start_monitoring,
            "stop_monitoring": self.stop_monitoring
        }

    @action(name="send_cpu_usage", description="Send current CPU usage to Nextion display")
    def send_cpu_usage(self, **kwargs):
        self.update_cpu_usage()

    @action(name="send_cpu_temperature", description="Send current CPU temperature to Nextion display")
    def send_cpu_temperature(self, **kwargs):
        self.update_cpu_temperature()

    @action(name="start_monitoring", description="Start live CPU usage and temperature monitoring", parameters={"interval": {"type": "int", "default": 1, "description": "Update interval (seconds)"}})
    def start_monitoring(self, interval=None, **kwargs):
        if interval:
            self.update_interval = int(interval) * 1000
            self.timer.setInterval(self.update_interval)
        self.monitoring = True
        if not self.timer.isActive():
            self.timer.start()
        self.log_info(f"Started monitoring (interval: {self.update_interval} ms)")

    @action(name="stop_monitoring", description="Stop live CPU monitoring")
    def stop_monitoring(self, **kwargs):
        self.monitoring = False
        if self.timer.isActive():
            self.timer.stop()
        self.log_info("Stopped monitoring")

    def update_monitoring(self):
        if self.monitoring:
            self.update_cpu_usage()
            self.update_cpu_temperature()

    def update_cpu_usage(self):
        if not self.app_instance:
            return
        cpu_percent = int(psutil.cpu_percent())
        cmd = f"{self.nextion_component}.val={cpu_percent}".encode("ascii") + b"\xFF\xFF\xFF"
        self.app_instance.send_to_nextion(cmd)
        self.log_info(f"Sent CPU usage: {cpu_percent}%")

    def update_cpu_temperature(self):
        if not self.app_instance:
            return
        temp = self.get_cpu_temperature()
        if self.temp_unit == "F":
            temp = int(temp * 9 / 5 + 32)
        cmd = f"{self.nextion_component}.val={temp}".encode("ascii") + b"\xFF\xFF\xFF"
        self.app_instance.send_to_nextion(cmd)
        self.log_info(f"Sent CPU temperature: {temp}°{self.temp_unit}")

    def send_temperature_to_nextion(self):
        """Send CPU temperature to Nextion number component n0 (use component name, not ID)"""
        if not self.app_instance:
            return
        temp = self.get_cpu_temperature()
        # ✅ Use component name 'n0', not ID '05'
        cmd = f"n0.val={temp}".encode("ascii") + b"\xFF\xFF\xFF"
        self.app_instance.send_to_nextion(cmd)
        self.log_info(f"Sent CPU temperature to n0: {temp}°C")

    def get_cpu_temperature(self):
        """Get CPU temperature in Celsius"""
        try:
            if hasattr(psutil, "sensors_temperatures"):
                temps = psutil.sensors_temperatures()
                # Try common keys
                for key in ["coretemp", "cpu_thermal", "acpitz", "k10temp", "nvme"]:
                    if key in temps and temps[key]:
                        return int(temps[key][0].current)
                # Try all available
                for entries in temps.values():
                    if entries and hasattr(entries[0], "current"):
                        return int(entries[0].current)
            # Windows fallback (optional: use wmi)
            if platform.system() == "Windows":
                try:
                    import wmi
                    w = wmi.WMI(namespace="root\\wmi")
                    temperature_info = w.MSAcpi_ThermalZoneTemperature()[0]
                    temp_c = int(temperature_info.CurrentTemperature / 10.0 - 273.15)
                    return temp_c
                except Exception:
                    pass
            # Fallback: return 0 if not available
            return 0
        except Exception as e:
            self.log_error(f"Failed to get CPU temperature: {e}")
            return 0 