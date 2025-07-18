from plugins.base_plugin import BasePlugin, action
from aao_client import AAOClient
import requests

class AAOPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "AAO"
        self.description = "Send scripts/commands to AxisAndOhs (AAO) via Web API."
        self.version = "1.0.0"
        self.author = "Your Name"
        self.category = "FlightSim"
        self.aao_client = AAOClient()

    def get_actions(self):
        return {
            "Input": self.input_action,
            "Output": self.output_action
        }

    def get_parameters(self):
        return {
            "script": {
                "type": "string",
                "default": "",
                "description": "AAO script/command to send or variable to read (e.g. 'A_VAR_SET;MyVar;1' or 'A_VAR_GET;MyVar')"
            }
        }

    @action(name="Input", description="Send script/command to AAO")
    def input_action(self, script: str = "", **kwargs):
        if not self.aao_client.is_connected():
            self.aao_client.connect()
        if not self.aao_client.is_connected():
            self.log_error("Not connected to AAO.")
            return False
        try:
            from aao_client import AAO_URL
            payload = {"scripts": [{"code": script}]}
            response = requests.post(AAO_URL, json=payload, timeout=2)
            if response.status_code == 200:
                self.log_info(f"AAO script executed: {script}")
                return True
            else:
                self.log_error(f"AAO responded: {response.text}")
                return False
        except Exception as e:
            self.log_error(f"Failed to send script to AAO: {e}")
            return False

    @action(name="Output", description="Read value from AAO and return it")
    def output_action(self, script: str = "", **kwargs):
        if not self.aao_client.is_connected():
            self.aao_client.connect()
        if not self.aao_client.is_connected():
            self.log_error("Not connected to AAO.")
            return None
        try:
            from aao_client import AAO_URL
            url = f"{AAO_URL}?exec={script}"
            response = requests.get(url, timeout=2)
            response.raise_for_status()
            value = response.text.strip()
            self.log_info(f"AAO output for '{script}': {value}")
            return value
        except Exception as e:
            self.log_error(f"Failed to get value from AAO: {e}")
            return None 