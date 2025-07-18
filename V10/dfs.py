#!/usr/bin/env python3
"""
Optimized Fenix A320 Hub - TTKBootstrap Version
Streamlined code with focus on core functionality
"""

import json
import time
import threading
import tkinter as tk
from tkinter import messagebox
import requests
import logging
import ttkbootstrap as ttk
from ttkbootstrap.constants import *
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AAO_URL = "http://localhost:43380/webapi"

class FenixQuartzFSUIPCReader:
    """Read FenixQuartz values from FSUIPC offsets"""
    def __init__(self):
        self.connected = False
        self.pyuipc_available = False
        self.offset_map = {
            'fcuSpdStr': {'offset': 0x5408, 'size': 11},
            'fcuHdgStr': {'offset': 0x5413, 'size': 9},
            'fcuAltStr': {'offset': 0x541C, 'size': 8},
            'fcuVsStr': {'offset': 0x5424, 'size': 10},
            'isisStr': {'offset': 0x542E, 'size': 6},
            'com1ActiveStr': {'offset': 0x5434, 'size': 8},
            'com1StandbyStr': {'offset': 0x543C, 'size': 8},
            'com2ActiveStr': {'offset': 0x5444, 'size': 8},
            'com2StandbyStr': {'offset': 0x544C, 'size': 8},
            'xpdrStr': {'offset': 0x5454, 'size': 5},
            'bat1Str': {'offset': 0x5459, 'size': 5},
            'bat2Str': {'offset': 0x545E, 'size': 5},
            'rudderStr': {'offset': 0x5463, 'size': 6},
            'clockChrStr': {'offset': 0x5469, 'size': 6},
            'clockTimeStr': {'offset': 0x546F, 'size': 9},
            'clockEtStr': {'offset': 0x5478, 'size': 6},
            'baroCptStr': {'offset': 0x547E, 'size': 6}
        }
        
    def check_dependencies(self):
        """Check if pyuipc is available"""
        try:
            import pyuipc
            self.pyuipc_available = True
            return True
        except ImportError:
            print("pyuipc not found. Install with: pip install pyuipc")
            return False
    
    def connect(self):
        """Connect to FSUIPC"""
        if not self.check_dependencies():
            return False
        
        try:
            import pyuipc
            with pyuipc.open() as fsuipc:
                test_read = fsuipc.read(0x0000, 'i')
                print(f"✓ Connected to FSUIPC - status: {test_read}")
            self.connected = True
            return True
        except Exception as e:
            print(f"✗ FSUIPC connection failed: {e}")
            return False
    
    def read_string_value(self, offset, size):
        """Read string value from FSUIPC"""
        if not self.connected or not self.pyuipc_available:
            return None
        
        try:
            import pyuipc
            with pyuipc.open() as fsuipc:
                raw_data = fsuipc.read(offset, f'{size}s')
                if isinstance(raw_data, bytes):
                    value = raw_data.decode('utf-8', errors='ignore').rstrip('\x00')
                else:
                    value = str(raw_data).rstrip('\x00')
                return value.strip() if value else None
        except Exception as e:
            print(f"Error reading offset {hex(offset)}: {e}")
            return None
    
    def get_all_values(self):
        """Get all FenixQuartz values"""
        if not self.connected:
            return None
        
        values = {}
        for var_name, config in self.offset_map.items():
            raw_value = self.read_string_value(config['offset'], config['size'])
            if raw_value:
                values[var_name] = raw_value
        
        return self.process_string_values(values) if values else None
    
    def process_string_values(self, string_values):
        """Process FenixQuartz string values into usable data"""
        processed = {}
        
        # Helper function to safely convert values
        def safe_convert(value, converter, default=None):
            try:
                if value and value not in ['----', '---', '-----', '--:--', '--:--:--', '----.--']:
                    return converter(value.replace('V', '').replace('SPD', '').replace('HDG', '').replace('V/S', '').strip())
            except:
                pass
            return default
        
        # Battery voltages
        for bat_num in ['1', '2']:
            bat_key = f'bat{bat_num}Str'
            if bat_key in string_values:
                voltage = safe_convert(string_values[bat_key], float)
                if voltage is not None:
                    processed[f'bat{bat_num}_voltage'] = voltage
        
        # FCU values
        fcu_mappings = {
            'fcuSpdStr': ('fcu_speed', int),
            'fcuHdgStr': ('fcu_heading', int),
            'fcuAltStr': ('fcu_altitude', lambda x: int(x.replace(' ', ''))),
            'fcuVsStr': ('fcu_vs', int),
            'baroCptStr': ('fcu_baro', float)
        }
        
        for str_key, (proc_key, converter) in fcu_mappings.items():
            if str_key in string_values:
                value = safe_convert(string_values[str_key], converter)
                if value is not None:
                    processed[proc_key] = value
        
        # Clock values
        clock_mappings = {
            'clockChrStr': 'chrono',
            'clockEtStr': 'elapsed',
            'clockTimeStr': 'zulu_time'
        }
        
        for str_key, proc_key in clock_mappings.items():
            if str_key in string_values:
                value = string_values[str_key].strip()
                if value and value not in ['--:--', '--:--:--']:
                    processed[proc_key] = value
        
        # Communication and other values
        other_mappings = {
            'com1ActiveStr': 'com1_active',
            'com1StandbyStr': 'com1_standby',
            'com2ActiveStr': 'com2_active',
            'com2StandbyStr': 'com2_standby',
            'xpdrStr': 'transponder',
            'isisStr': 'isis_baro',
            'rudderStr': 'rudder_trim'
        }
        
        for str_key, proc_key in other_mappings.items():
            if str_key in string_values:
                value = string_values[str_key].strip()
                if value and value not in ['----', '----.--']:
                    processed[proc_key] = value
        
        if processed:
            processed['timestamp'] = time.time()
            print(f"✓ Processed {len(processed)} values from FenixQuartz")
        
        return processed
    
    def disconnect(self):
        """Disconnect from FSUIPC"""
        self.connected = False

class AlternativeDataReader:
    """Alternative data source using file"""
    def __init__(self):
        self.data_file = "fenix_data.txt"
        
    def create_data_file(self):
        """Create sample data file"""
        try:
            empty_data = {
                'timestamp': 0,
                'bat1_voltage': None,
                'bat2_voltage': None,
                'fcu_speed': None,
                'fcu_heading': None,
                'fcu_vs': None,
                'fcu_altitude': None,
                'fcu_baro': None,
                'chrono': None,
                'elapsed': None,
                'note': 'Populate this file with real data from external tools'
            }
            
            with open(self.data_file, 'w') as f:
                json.dump(empty_data, f, indent=2)
            
            print(f"Created data file: {self.data_file}")
            return True
        except Exception as e:
            print(f"Failed to create data file: {e}")
            return False
    
    def read_data(self):
        """Read data from file"""
        try:
            if not os.path.exists(self.data_file):
                self.create_data_file()
            
            with open(self.data_file, 'r') as f:
                data = json.load(f)
            
            # Return only non-None values
            valid_data = {k: v for k, v in data.items() if v is not None and k != 'note'}
            return valid_data if valid_data.get('timestamp', 0) != 0 else None
        except Exception as e:
            print(f"Failed to read data file: {e}")
            return None

class SimpleAAO:
    """AxisAndOhs interface with data integration"""
    def __init__(self):
        self.connected = False
        self.session = requests.Session()
        self.session.timeout = 1.0
        self.monitoring_active = False
        self.monitoring_thread = None
        
        self.fenix_reader = FenixQuartzFSUIPCReader()
        self.alt_reader = AlternativeDataReader()
        self.data_source = None
    
    def connect(self):
        """Connect to AAO"""
        try:
            response = self.session.get(f"{AAO_URL}?conn=1")
            if response.text.strip() == 'OK':
                self.connected = True
                return True
        except:
            pass
        return False
    
    def start_data_integration(self):
        """Start data reading"""
        if self.fenix_reader.connect():
            self.data_source = "fenixquartz_fsuipc"
            return True
        
        if self.alt_reader.create_data_file():
            self.data_source = "alternative"
            return True
        
        return False
    
    def stop_data_integration(self):
        """Stop data reading"""
        if self.data_source == "fenixquartz_fsuipc":
            self.fenix_reader.disconnect()
        self.data_source = None
    
    def get_data_values(self):
        """Get values from active data source"""
        if self.data_source == "fenixquartz_fsuipc":
            return self.fenix_reader.get_all_values()
        elif self.data_source == "alternative":
            return self.alt_reader.read_data()
        return None
    
    def send_command(self, command):
        """Send command to AAO"""
        if not self.connected:
            return False
        
        try:
            # Try as script first
            request_obj = {"scripts": [{"code": command}]}
            response = self.session.post(AAO_URL, json=request_obj)
            
            if response.status_code == 200:
                return True
            
            # Try as key event
            request_obj = {"triggers": [{"evt": f"(>K:{command})", "value": 1}]}
            response = self.session.post(AAO_URL, json=request_obj)
            return response.status_code == 200
        except Exception as e:
            print(f"Command error: {e}")
            return False

class SimpleApp:
    """Main application class"""
    def __init__(self):
        self.root = ttk.Window(themename="superhero")
        self.root.title("Fenix A320 Hub - Optimized")
        self.root.geometry("1200x800")
        
        self.aao = SimpleAAO()
        self.monitoring_data = {}
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the main UI"""
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.pack(fill=BOTH, expand=True)
        
        # Title
        ttk.Label(main_frame, text="Fenix A320 Hub", font=("Arial", 16, "bold")).pack(pady=(0, 10))
        
        # Connection frame
        self.setup_connection_frame(main_frame)
        
        # Create notebook for tabs
        notebook = ttk.Notebook(main_frame, bootstyle="dark")
        notebook.pack(fill=BOTH, expand=True, pady=(0, 10))
        
        # Setup tabs
        self.setup_ecam_tab(notebook)
        self.setup_fcu_tab(notebook)
        self.setup_overhead_tab(notebook)
        self.setup_mcdu_tab(notebook)
        self.setup_fuel_tab(notebook)
        self.setup_monitoring_tab(notebook)
        
        # Log frame
        self.setup_log_frame(main_frame)
    
    def setup_connection_frame(self, parent):
        """Setup connection controls"""
        conn_frame = ttk.Labelframe(parent, text="Connection Status", padding=15, bootstyle="primary")
        conn_frame.pack(fill=X, pady=(0, 10))
        
        conn_inner = ttk.Frame(conn_frame)
        conn_inner.pack(fill=X)
        
        ttk.Button(conn_inner, text="Connect to AAO", command=self.connect, 
                  bootstyle="success-outline", width=15).pack(side=LEFT, padx=(0, 10))
        
        ttk.Button(conn_inner, text="Disconnect", command=self.disconnect, 
                  bootstyle="danger-outline", width=15).pack(side=LEFT, padx=(0, 20))
        
        self.status_label = ttk.Label(conn_inner, text="● Not Connected", font=("Arial", 10, "bold"))
        self.status_label.pack(side=LEFT)
    
    def setup_ecam_tab(self, notebook):
        """Setup ECAM tab"""
        ecam_tab = ttk.Frame(notebook)
        notebook.add(ecam_tab, text="ECAM Controls")
        
        ecam_frame = ttk.Labelframe(ecam_tab, text="ECAM System Pages", padding=15, bootstyle="info")
        ecam_frame.pack(fill=X, padx=10, pady=10)
        
        ecam_commands = {
            "ENG": "1 (>L:S_ECAM_ENGINE, Number) (SLEEP:100) 2 (>L:S_ECAM_ENGINE, Number)",
            "BLEED": "1 (>L:S_ECAM_BLEED, Number) (SLEEP:100) 2 (>L:S_ECAM_BLEED, Number)",
            "PRESS": "1 (>L:S_ECAM_CAB_PRESS, Number) (SLEEP:100) 2 (>L:S_ECAM_CAB_PRESS, Number)",
            "ELEC": "1 (>L:S_ECAM_ELEC, Number) (SLEEP:100) 2 (>L:S_ECAM_ELEC, Number)",
            "HYD": "1 (>L:S_ECAM_HYD, Number) (SLEEP:100) 2 (>L:S_ECAM_HYD, Number)",
            "FUEL": "1 (>L:S_ECAM_FUEL, Number) (SLEEP:100) 2 (>L:S_ECAM_FUEL, Number)",
        }
        
        self.create_button_grid(ecam_frame, ecam_commands, "info-outline", cols=6)
    
    def setup_fcu_tab(self, notebook):
        """Setup FCU tab"""
        fcu_tab = ttk.Frame(notebook)
        notebook.add(fcu_tab, text="FCU Controls")
        
        fcu_frame = ttk.Labelframe(fcu_tab, text="Flight Control Unit", padding=15, bootstyle="success")
        fcu_frame.pack(fill=X, padx=10, pady=10)
        
        fcu_commands = {
            "SPD PUSH": "(L:S_FCU_SPEED, Number) -- (>L:S_FCU_SPEED, Number)",
            "SPD PULL": "(L:S_FCU_SPEED, Number) ++ (>L:S_FCU_SPEED, Number)",
            "SPD INC": "(L:E_FCU_SPEED, Number) ++ (>L:E_FCU_SPEED, Number)",
            "SPD DEC": "(L:E_FCU_SPEED, Number) -- (>L:E_FCU_SPEED, Number)",
            "HDG PUSH": "(L:S_FCU_HEADING, Number) -- (>L:S_FCU_HEADING, Number)",
            "HDG PULL": "(L:S_FCU_HEADING, Number) ++ (>L:S_FCU_HEADING, Number)",
            "AP1": "1 (>L:S_FCU_AP1, Number) (SLEEP:100) 2 (>L:S_FCU_AP1, Number)",
            "AP2": "1 (>L:S_FCU_AP2, Number) (SLEEP:100) 2 (>L:S_FCU_AP2, Number)",
        }
        
        self.create_button_grid(fcu_frame, fcu_commands, "success-outline", cols=4)
    
    def setup_overhead_tab(self, notebook):
        """Setup overhead panel tab"""
        overhead_tab = ttk.Frame(notebook)
        notebook.add(overhead_tab, text="Overhead Panel")
        
        # Electrical System
        elec_frame = ttk.Labelframe(overhead_tab, text="Electrical System", padding=15, bootstyle="danger")
        elec_frame.pack(fill=X, padx=10, pady=5)
        
        elec_commands = {
            "APU MASTER ON": "1 (>L:S_OH_ELEC_APU_MASTER, number) 2 (>L:S_OH_ELEC_APU_MASTER_Anim, number)",
            "APU MASTER OFF": "0 (>L:S_OH_ELEC_APU_MASTER_Anim, number) 0 (>L:S_OH_ELEC_APU_MASTER, number)",
            "APU START": "(L:S_OH_ELEC_APU_START, number) 2 + (>L:S_OH_ELEC_APU_START, number)",
            "BAT1 ON": "1 (>L:S_OH_ELEC_BAT1, number) 2 (>L:S_OH_ELEC_BAT1_Anim, number)",
            "BAT1 OFF": "0 (>L:S_OH_ELEC_BAT1_Anim, number) 0 (>L:S_OH_ELEC_BAT1, number)",
            "BAT2 ON": "1 (>L:S_OH_ELEC_BAT2, number) 2 (>L:S_OH_ELEC_BAT2_Anim, number)",
            "BAT2 OFF": "0 (>L:S_OH_ELEC_BAT2_Anim, number) 0 (>L:S_OH_ELEC_BAT2, number)",
            "EXT PWR TOGGLE": "(L:S_OH_ELEC_EXT_PWR, number) 2 + (>L:S_OH_ELEC_EXT_PWR, number)",
        }
        
        self.create_button_grid(elec_frame, elec_commands, "danger-outline", cols=4)
        
        # External Lights
        lights_frame = ttk.Labelframe(overhead_tab, text="External Lights", padding=15, bootstyle="warning")
        lights_frame.pack(fill=X, padx=10, pady=5)
        
        lights_commands = {
            "BEACON ON": "1 (>L:S_OH_EXT_LT_BEACON, Number)",
            "BEACON OFF": "0 (>L:S_OH_EXT_LT_BEACON, Number)",
            "STROBE AUTO": "1 (>L:S_OH_EXT_LT_STROBE, Number)",
            "STROBE ON": "2 (>L:S_OH_EXT_LT_STROBE, Number)",
        }
        
        self.create_button_grid(lights_frame, lights_commands, "warning-outline", cols=4)
    
    def setup_mcdu_tab(self, notebook):
        """Setup MCDU tab with key functions"""
        mcdu_tab = ttk.Frame(notebook)
        notebook.add(mcdu_tab, text="MCDU Controls")
        
        # Function Keys
        function_frame = ttk.Labelframe(mcdu_tab, text="MCDU Function Keys", padding=15, bootstyle="primary")
        function_frame.pack(fill=X, padx=10, pady=10)
        
        function_commands = {
            "INIT": "(L:S_CDU1_KEY_INIT, number) 2 + (>L:S_CDU1_KEY_INIT, number)",
            "FPLN": "(L:S_CDU1_KEY_FPLN, number) 2 + (>L:S_CDU1_KEY_FPLN, number)",
            "PERF": "(L:S_CDU1_KEY_PERF, number) 2 + (>L:S_CDU1_KEY_PERF, number)",
            "DATA": "(L:S_CDU1_KEY_DATA, number) 2 + (>L:S_CDU1_KEY_DATA, number)",
            "PROG": "(L:S_CDU1_KEY_PROG, number) 2 + (>L:S_CDU1_KEY_PROG, number)",
            "MENU": "(L:S_CDU1_KEY_MENU, number) 2 + (>L:S_CDU1_KEY_MENU, number)",
            "CLR": "(L:S_CDU1_KEY_CLEAR, number) 2 + (>L:S_CDU1_KEY_CLEAR, number)",
            "RAD_NAV": "(L:S_CDU1_KEY_RAD_NAV, number) 2 + (>L:S_CDU1_KEY_RAD_NAV, number)",
        }
        
        self.create_button_grid(function_frame, function_commands, "primary-outline", cols=4)
        
        # Line Select Keys
        lsk_frame = ttk.Labelframe(mcdu_tab, text="Line Select Keys", padding=15, bootstyle="info")
        lsk_frame.pack(fill=X, padx=10, pady=10)
        
        lsk_commands = {
            f"LSK{i}L": f"(L:S_CDU1_KEY_LSK{i}L, number) 2 + (>L:S_CDU1_KEY_LSK{i}L, number)"
            for i in range(1, 7)
        }
        lsk_commands.update({
            f"LSK{i}R": f"(L:S_CDU1_KEY_LSK{i}R, number) 2 + (>L:S_CDU1_KEY_LSK{i}R, number)"
            for i in range(1, 7)
        })
        
        self.create_button_grid(lsk_frame, lsk_commands, "info-outline", cols=6)
    
    def setup_fuel_tab(self, notebook):
        """Setup fuel system tab"""
        fuel_tab = ttk.Frame(notebook)
        notebook.add(fuel_tab, text="Fuel System")
        
        # Fuel Pumps
        pumps_frame = ttk.Labelframe(fuel_tab, text="Fuel Pumps", padding=15, bootstyle="info")
        pumps_frame.pack(fill=X, padx=10, pady=10)
        
        fuel_commands = {
            "L1 ON": "1 (>L:S_OH_FUEL_LEFT_1, number) 2 (>L:S_OH_FUEL_LEFT_1_Anim, number)",
            "L1 OFF": "0 (>L:S_OH_FUEL_LEFT_1_Anim, number) 0 (>L:S_OH_FUEL_LEFT_1, number)",
            "L2 ON": "1 (>L:S_OH_FUEL_LEFT_2, number) 2 (>L:S_OH_FUEL_LEFT_2_Anim, number)",
            "L2 OFF": "0 (>L:S_OH_FUEL_LEFT_2_Anim, number) 0 (>L:S_OH_FUEL_LEFT_2, number)",
            "C1 ON": "1 (>L:S_OH_FUEL_CENTER_1, number) 2 (>L:S_OH_FUEL_CENTER_1_Anim, number)",
            "C1 OFF": "0 (>L:S_OH_FUEL_CENTER_1_Anim, number) 0 (>L:S_OH_FUEL_CENTER_1, number)",
            "C2 ON": "1 (>L:S_OH_FUEL_CENTER_2, number) 2 (>L:S_OH_FUEL_CENTER_2_Anim, number)",
            "C2 OFF": "0 (>L:S_OH_FUEL_CENTER_2_Anim, number) 0 (>L:S_OH_FUEL_CENTER_2, number)",
            "R1 ON": "1 (>L:S_OH_FUEL_RIGHT_1, number) 2 (>L:S_OH_FUEL_RIGHT_1_Anim, number)",
            "R1 OFF": "0 (>L:S_OH_FUEL_RIGHT_1_Anim, number) 0 (>L:S_OH_FUEL_RIGHT_1, number)",
            "R2 ON": "1 (>L:S_OH_FUEL_RIGHT_2, number) 2 (>L:S_OH_FUEL_RIGHT_2_Anim, number)",
            "R2 OFF": "0 (>L:S_OH_FUEL_RIGHT_2_Anim, number) 0 (>L:S_OH_FUEL_RIGHT_2, number)",
        }
        
        self.create_button_grid(pumps_frame, fuel_commands, "info-outline", cols=4)
        
        # Fuel System Controls
        fuel_controls_frame = ttk.Labelframe(fuel_tab, text="System Controls", padding=15, bootstyle="danger")
        fuel_controls_frame.pack(fill=X, padx=10, pady=10)
        
        system_commands = {
            "XFEED ON": "1 (>L:S_OH_FUEL_XFEED, number) 2 (>L:S_OH_FUEL_XFEED_Anim, number)",
            "XFEED OFF": "0 (>L:S_OH_FUEL_XFEED_Anim, number) 0 (>L:S_OH_FUEL_XFEED, number)",
        }
        
        self.create_button_grid(fuel_controls_frame, system_commands, "danger-outline", cols=2)
    
    def setup_monitoring_tab(self, notebook):
        """Setup monitoring tab"""
        monitoring_tab = ttk.Frame(notebook)
        notebook.add(monitoring_tab, text="Live Monitoring")
        
        # Control frame
        control_frame = ttk.Labelframe(monitoring_tab, text="Monitoring Control", padding=15, bootstyle="primary")
        control_frame.pack(fill=X, padx=10, pady=10)
        
        self.monitoring_button = ttk.Button(control_frame, text="Start Monitoring", 
                                          command=self.toggle_monitoring, bootstyle="success")
        self.monitoring_button.pack(side=LEFT, padx=5)
        
        self.monitoring_status = ttk.Label(control_frame, text="● Monitoring Stopped", 
                                         foreground="red", font=("Arial", 10, "bold"))
        self.monitoring_status.pack(side=LEFT, padx=20)
        
        # Create monitoring displays
        self.create_monitoring_displays(monitoring_tab)
    
    def create_monitoring_displays(self, parent):
        """Create monitoring display widgets"""
        # Clock section
        clock_frame = ttk.Labelframe(parent, text="Aircraft Clock & Time", padding=15, bootstyle="info")
        clock_frame.pack(fill=X, padx=10, pady=5)
        
        time_grid = ttk.Frame(clock_frame)
        time_grid.pack(fill=X)
        
        self.create_data_label(time_grid, "Zulu Time:", "zulu_time_label", "--:--", 0, "cyan")
        self.create_data_label(time_grid, "Chrono:", "chrono_label", "--:--", 1, "yellow")
        self.create_data_label(time_grid, "Elapsed:", "elapsed_label", "--:--", 2, "orange")
        
        # Battery section
        battery_frame = ttk.Labelframe(parent, text="Battery Status", padding=15, bootstyle="warning")
        battery_frame.pack(fill=X, padx=10, pady=5)
        
        battery_grid = ttk.Frame(battery_frame)
        battery_grid.pack(fill=X)
        
        self.create_data_label(battery_grid, "Battery 1:", "bat1_voltage_label", "--.-V", 0, "green")
        self.create_data_label(battery_grid, "Battery 2:", "bat2_voltage_label", "--.-V", 1, "green")
        
        # FCU section
        fcu_frame = ttk.Labelframe(parent, text="FCU Parameters", padding=15, bootstyle="success")
        fcu_frame.pack(fill=X, padx=10, pady=5)
        
        fcu_grid = ttk.Frame(fcu_frame)
        fcu_grid.pack(fill=X)
        
        self.create_data_label(fcu_grid, "Speed:", "fcu_speed_label", "---", 0, "cyan", col=0)
        self.create_data_label(fcu_grid, "Heading:", "fcu_heading_label", "---°", 0, "cyan", col=2)
        self.create_data_label(fcu_grid, "V/S:", "fcu_vs_label", "---", 1, "cyan", col=0)
        self.create_data_label(fcu_grid, "Altitude:", "fcu_altitude_label", "-----", 1, "cyan", col=2)
        self.create_data_label(fcu_grid, "Barometric:", "fcu_baro_label", "----.--", 2, "cyan", col=0)
        
        # Data source info
        info_frame = ttk.Labelframe(parent, text="Data Source Info", padding=15, bootstyle="secondary")
        info_frame.pack(fill=X, padx=10, pady=5)
        
        self.data_info = tk.Text(info_frame, height=4, wrap=tk.WORD, font=("Consolas", 9), 
                                bg="#34495e", fg="#ecf0f1")
        self.data_info.pack(fill=BOTH, expand=True)
    
    def create_data_label(self, parent, label_text, attr_name, default_value, row, color, col=0):
        """Create a data display label"""
        ttk.Label(parent, text=label_text, font=("Arial", 12, "bold")).grid(
            row=row, column=col*2, sticky=tk.W, padx=5, pady=5)
        
        label = ttk.Label(parent, text=default_value, font=("Consolas", 14, "bold"), foreground=color)
        label.grid(row=row, column=col*2+1, sticky=tk.W, padx=5, pady=5)
        setattr(self, attr_name, label)
    
    def create_button_grid(self, parent, commands, style, cols=4):
        """Create a grid of command buttons"""
        button_frame = ttk.Frame(parent)
        button_frame.pack(fill=X)
        
        for i, (label, cmd) in enumerate(commands.items()):
            row = i // cols
            col = i % cols
            ttk.Button(button_frame, text=label, width=15,
                      command=lambda c=cmd: self.send_command(c),
                      bootstyle=style).grid(row=row, column=col, padx=5, pady=5)
    
    def setup_log_frame(self, parent):
        """Setup log display"""
        log_frame = ttk.Labelframe(parent, text="Activity Log", padding=10, bootstyle="secondary")
        log_frame.pack(fill=BOTH, expand=True)
        
        log_container = ttk.Frame(log_frame)
        log_container.pack(fill=BOTH, expand=True)
        
        self.log_text = tk.Text(log_container, height=6, wrap=tk.WORD, 
                               font=("Consolas", 9), bg="#2b3e50", fg="#ecf0f1")
        scrollbar = ttk.Scrollbar(log_container, orient=tk.VERTICAL, command=self.log_text.yview)
        self.log_text.configure(yscrollcommand=scrollbar.set)
        
        self.log_text.pack(side=tk.LEFT, fill=BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
    
    def toggle_monitoring(self):
        """Toggle monitoring on/off"""
        if self.aao.monitoring_active:
            self.stop_monitoring()
        else:
            self.start_monitoring()
    
    def start_monitoring(self):
        """Start monitoring"""
        self.aao.monitoring_active = True
        self.monitoring_button.config(text="Stop Monitoring", bootstyle="danger")
        self.monitoring_status.config(text="● Monitoring Active", foreground="green")
        
        self.aao.monitoring_thread = threading.Thread(target=self.monitoring_loop, daemon=True)
        self.aao.monitoring_thread.start()
        
        source = self.aao.data_source or "none"
        self.log(f"🔴 Live monitoring started (source: {source})")
    
    def stop_monitoring(self):
        """Stop monitoring"""
        self.aao.monitoring_active = False
        self.monitoring_button.config(text="Start Monitoring", bootstyle="success")
        self.monitoring_status.config(text="● Monitoring Stopped", foreground="red")
        self.log("⏹️ Live monitoring stopped")
    
    def monitoring_loop(self):
        """Main monitoring loop"""
        while self.aao.monitoring_active:
            try:
                data_values = self.aao.get_data_values()
                
                if data_values:
                    self.monitoring_data.clear()
                    self.monitoring_data.update(data_values)
                    source = self.aao.data_source or "unknown"
                    print(f"✓ {source} data updated")
                else:
                    self.monitoring_data.clear()
                    print("✗ No real data available")
                
                self.root.after(0, self.update_monitoring_display)
                time.sleep(1)
                
            except Exception as e:
                print(f"Monitoring error: {e}")
                time.sleep(2)
    
    def update_monitoring_display(self):
        """Update monitoring display widgets"""
        try:
            # Update time displays
            self.update_time_display("zulu_time", self.zulu_time_label, "--:--")
            self.update_time_display("chrono", self.chrono_label, "--:--")
            self.update_time_display("elapsed", self.elapsed_label, "--:--")
            
            # Update battery voltages
            self.update_voltage_display("bat1_voltage", self.bat1_voltage_label)
            self.update_voltage_display("bat2_voltage", self.bat2_voltage_label)
            
            # Update FCU parameters
            self.update_simple_display("fcu_speed", self.fcu_speed_label, "---", int)
            self.update_simple_display("fcu_heading", self.fcu_heading_label, "---°", 
                                     lambda x: f"{int(x):03d}°")
            self.update_simple_display("fcu_vs", self.fcu_vs_label, "---", 
                                     lambda x: f"{'+' if x > 0 else ''}{int(x)}" if x != 0 else "---")
            self.update_simple_display("fcu_altitude", self.fcu_altitude_label, "-----", 
                                     lambda x: f"{int(x):05d}")
            self.update_simple_display("fcu_baro", self.fcu_baro_label, "----.--", 
                                     lambda x: f"{float(x):.2f}")
            
            # Update data source info
            self.update_data_info()
            
        except Exception as e:
            self.log(f"Display update error: {e}")
    
    def update_time_display(self, key, label, default):
        """Update time display labels"""
        if key in self.monitoring_data:
            value = self.monitoring_data[key]
            if value and value not in ["--:--", "--:--:--"]:
                label.config(text=value)
            else:
                label.config(text=default)
        else:
            label.config(text=default)
    
    def update_voltage_display(self, key, label):
        """Update voltage display with color coding"""
        if key in self.monitoring_data:
            try:
                voltage = float(self.monitoring_data[key])
                color = "green" if voltage > 24.0 else "orange" if voltage > 20.0 else "red"
                label.config(text=f"{voltage:.1f}V", foreground=color)
            except:
                label.config(text="--.-V", foreground="gray")
        else:
            label.config(text="--.-V", foreground="gray")
    
    def update_simple_display(self, key, label, default, formatter=None):
        """Update simple display labels"""
        if key in self.monitoring_data:
            try:
                value = self.monitoring_data[key]
                if formatter:
                    if callable(formatter):
                        text = formatter(value)
                    else:
                        text = formatter(value)
                else:
                    text = str(value)
                label.config(text=text)
            except:
                label.config(text=default)
        else:
            label.config(text=default)
    
    def update_data_info(self):
        """Update data source information"""
        info_text = f"Last Update: {time.strftime('%H:%M:%S')}\n"
        info_text += f"Monitoring: {'Active' if self.aao.monitoring_active else 'Stopped'}\n"
        info_text += f"Data Source: {self.aao.data_source or 'none'}\n"
        info_text += f"AAO Connection: {'Connected' if self.aao.connected else 'Disconnected'}\n"
        
        if self.aao.data_source == "fenixquartz_fsuipc":
            info_text += "✓ Reading FenixQuartz via FSUIPC offsets\n"
        elif self.aao.data_source == "alternative":
            info_text += "✓ Reading from external data file\n"
        else:
            info_text += "✗ No real data source available\n"
        
        working_vars = [k for k, v in self.monitoring_data.items() if v is not None]
        info_text += f"Live Values: {len(working_vars)}"
        
        self.data_info.delete(1.0, tk.END)
        self.data_info.insert(1.0, info_text)
    
    def connect(self):
        """Connect to systems"""
        aao_connected = self.aao.connect()
        data_started = self.aao.start_data_integration()
        
        if aao_connected and data_started:
            self.status_label.config(text="● Fully Connected", foreground="green")
            self.log("✓ Connected to AAO and data source")
        elif aao_connected:
            self.status_label.config(text="● AAO Only", foreground="orange")
            self.log("✓ Connected to AAO only")
        elif data_started:
            self.status_label.config(text="● Data Only", foreground="orange")
            self.log("✓ Data source only")
        else:
            self.status_label.config(text="● Connection Failed", foreground="red")
            self.log("✗ Connection failed")
    
    def disconnect(self):
        """Disconnect from all systems"""
        if self.aao.monitoring_active:
            self.stop_monitoring()
        self.aao.connected = False
        self.aao.stop_data_integration()
        self.status_label.config(text="● Disconnected", foreground="red")
        self.log("🔌 Disconnected from all systems")
    
    def send_command(self, command):
        """Send command to AAO"""
        success = self.aao.send_command(command)
        if success:
            self.log(f"✓ Command sent: {command[:50]}...")
        else:
            self.log(f"✗ Command failed: {command[:50]}...")
    
    def log(self, message):
        """Log message with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
        self.log_text.see(tk.END)
        print(message)
    
    def run(self):
        """Run the application"""
        self.log("Fenix A320 Hub - Optimized Version Started")
        self.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        self.log("Quick Setup:")
        self.log("1. ✈️ Start MSFS with Fenix A320")
        self.log("2. 🔧 Start AxisAndOhs + FSUIPC + FenixQuartz")
        self.log("3. 💾 Install: pip install pyuipc")
        self.log("4. 🔗 Click 'Connect to AAO'")
        self.log("5. 📊 Start monitoring for live data")
        self.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        try:
            self.root.mainloop()
        except Exception as e:
            print(f"Application error: {e}")
        finally:
            if hasattr(self, 'aao') and self.aao.monitoring_active:
                self.aao.monitoring_active = False
            if hasattr(self, 'aao'):
                self.aao.stop_data_integration()

if __name__ == "__main__":
    app = SimpleApp()
    app.run()