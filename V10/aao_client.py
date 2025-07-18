import requests

AAO_URL = "http://localhost:43380/webapi"

class AAOClient:
    def __init__(self):
        self.session = requests.Session()
        self.connected = False
        self.last_error = None

    def connect(self):
        """Connect to AAO Web API"""
        try:
            response = self.session.get(f"{AAO_URL}?conn=1", timeout=2)
            if response.text.strip() == 'OK':
                self.connected = True
                self.last_error = None
                return True
            else:
                self.connected = False
                self.last_error = f"AAO responded with: {response.text}"
                return False
        except Exception as e:
            self.connected = False
            self.last_error = str(e)
            return False

    def disconnect(self):
        """Disconnect from AAO (no real API, just mark as disconnected)"""
        self.connected = False
        self.last_error = None

    def is_connected(self):
        return self.connected

    def get_last_error(self):
        return self.last_error 