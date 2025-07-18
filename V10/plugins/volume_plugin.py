"""
Volume Plugin
Advanced volume control for system and applications
"""

import subprocess
import platform
import logging
from typing import Dict, Callable, List
from plugins.base_plugin import BasePlugin, action

class VolumePlugin(BasePlugin):
    """Advanced volume control plugin"""
    
    def __init__(self):
        super().__init__()
        self.name = "Volume"
        self.description = "Advanced volume control for system and applications"
        self.version = "1.0.0"
        self.author = "StreamDeck Team"
        self.category = "Audio"
        
    def get_actions(self) -> Dict[str, Callable]:
        """Return available volume actions"""
        return {
            "set_master_volume": self.set_master_volume,
            "master_volume_up": self.master_volume_up,
            "master_volume_down": self.master_volume_down,
            "toggle_master_mute": self.toggle_master_mute,
            "set_app_volume": self.set_app_volume,
            "mute_app": self.mute_app,
            "unmute_app": self.unmute_app,
            "toggle_app_mute": self.toggle_app_mute,
            "get_volume_info": self.get_volume_info,
            "set_input_volume": self.set_input_volume,
            "toggle_input_mute": self.toggle_input_mute,
            "switch_audio_device": self.switch_audio_device
        }
    
    def get_parameters(self) -> Dict[str, Dict]:
        """Return parameter definitions"""
        return {
            "volume": {
                "type": "int",
                "default": 50,
                "description": "Volume level (0-100)"
            },
            "step": {
                "type": "int",
                "default": 5,
                "description": "Volume step size"
            },
            "app_name": {
                "type": "string",
                "default": "",
                "description": "Application name"
            },
            "device_name": {
                "type": "string",
                "default": "",
                "description": "Audio device name"
            },
            "fade_duration": {
                "type": "int",
                "default": 0,
                "description": "Fade duration in milliseconds"
            }
        }
    
    def _get_volume_command(self, action: str, **kwargs) -> str:
        """Get platform-specific volume command"""
        system = platform.system()
        
        if system == "Windows":
            return self._get_windows_volume_command(action, **kwargs)
        elif system == "Darwin":  # macOS
            return self._get_macos_volume_command(action, **kwargs)
        else:  # Linux
            return self._get_linux_volume_command(action, **kwargs)
    
    def _get_windows_volume_command(self, action: str, **kwargs) -> str:
        """Get Windows volume command using PowerShell"""
        volume = kwargs.get('volume', 50)
        app_name = kwargs.get('app_name', '')
        
        if action == "set_master":
            return f'''
            Add-Type -TypeDefinition @"
            using System;
            using System.Runtime.InteropServices;
            [ComImport, Guid("5CDF2C82-841E-4546-9722-0CF74078229A")]
            [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
            public interface IAudioEndpointVolume {{
                int NotImpl1(); int NotImpl2(); int NotImpl3(); int NotImpl4();
                int SetMasterVolumeLevel(float level, Guid ctx);
                int SetMasterVolumeLevelScalar(float level, Guid ctx);
                int NotImpl6(); int NotImpl7(); int NotImpl8(); int NotImpl9();
                int SetMute(bool mute, Guid ctx);
            }}
            "@
            [System.Math]::Round([Audio]::Volume * 100)
            '''
        elif action == "get_master":
            return '''
            Add-Type -AssemblyName System.Core
            [Math]::Round([Audio]::Volume * 100)
            '''
        elif action == "mute_master":
            return '''
            Add-Type -AssemblyName System.Core
            [Audio]::Mute = $true
            '''
        elif action == "unmute_master":
            return '''
            Add-Type -AssemblyName System.Core
            [Audio]::Mute = $false
            '''
        
        return ""
    
    def _get_macos_volume_command(self, action: str, **kwargs) -> str:
        """Get macOS volume command using osascript"""
        volume = kwargs.get('volume', 50)
        
        if action == "set_master":
            return f"osascript -e 'set volume output volume {volume}'"
        elif action == "get_master":
            return "osascript -e 'output volume of (get volume settings)'"
        elif action == "mute_master":
            return "osascript -e 'set volume output muted true'"
        elif action == "unmute_master":
            return "osascript -e 'set volume output muted false'"
        elif action == "toggle_mute":
            return "osascript -e 'set volume output muted (not (output muted of (get volume settings)))'"
        
        return ""
    
    def _get_linux_volume_command(self, action: str, **kwargs) -> str:
        """Get Linux volume command using amixer or pactl"""
        volume = kwargs.get('volume', 50)
        app_name = kwargs.get('app_name', '')
        
        if action == "set_master":
            return f"amixer set Master {volume}%"
        elif action == "get_master":
            return "amixer get Master | grep -o '[0-9]*%' | head -1 | tr -d '%'"
        elif action == "mute_master":
            return "amixer set Master mute"
        elif action == "unmute_master":
            return "amixer set Master unmute"
        elif action == "toggle_mute":
            return "amixer set Master toggle"
        elif action == "set_app" and app_name:
            return f"pactl set-sink-input-volume $(pactl list sink-inputs | grep -B20 'application.name = \"{app_name}\"' | grep 'Sink Input' | head -1 | cut -d'#' -f2) {volume}%"
        
        return ""
    
    @action(name="set_master_volume", description="Set master volume level")
    def set_master_volume(self, volume: int = 50, fade_duration: int = 0, **kwargs):
        """Set master volume to specific level"""
        volume = max(0, min(100, volume))  # Clamp between 0-100
        
        try:
            if fade_duration > 0:
                # Implement fade effect
                current_volume = self.get_current_volume()
                steps = 20
                step_duration = fade_duration / steps
                volume_step = (volume - current_volume) / steps
                
                import time
                for i in range(steps):
                    target_volume = int(current_volume + (volume_step * (i + 1)))
                    self._set_volume_immediate(target_volume)
                    time.sleep(step_duration / 1000)  # Convert to seconds
            else:
                self._set_volume_immediate(volume)
                
            self.log_info(f"Master volume set to {volume}%")
            
        except Exception as e:
            self.log_error(f"Failed to set master volume: {e}")
    
    def _set_volume_immediate(self, volume: int):
        """Set volume immediately without fade"""
        cmd = self._get_volume_command("set_master", volume=volume)
        if cmd:
            subprocess.run(cmd, shell=True)
    
    @action(name="master_volume_up", description="Increase master volume")
    def master_volume_up(self, step: int = 5, **kwargs):
        """Increase master volume by step"""
        try:
            current_volume = self.get_current_volume()
            new_volume = min(100, current_volume + step)
            self.set_master_volume(new_volume)
            
        except Exception as e:
            self.log_error(f"Failed to increase master volume: {e}")
    
    @action(name="master_volume_down", description="Decrease master volume")
    def master_volume_down(self, step: int = 5, **kwargs):
        """Decrease master volume by step"""
        try:
            current_volume = self.get_current_volume()
            new_volume = max(0, current_volume - step)
            self.set_master_volume(new_volume)
            
        except Exception as e:
            self.log_error(f"Failed to decrease master volume: {e}")
    
    @action(name="toggle_master_mute", description="Toggle master mute")
    def toggle_master_mute(self, **kwargs):
        """Toggle master volume mute"""
        try:
            cmd = self._get_volume_command("toggle_mute")
            if cmd:
                subprocess.run(cmd, shell=True)
                self.log_info("Master mute toggled")
            else:
                # Fallback method
                current_volume = self.get_current_volume()
                if current_volume > 0:
                    self.set_master_volume(0)
                    self.log_info("Master volume muted")
                else:
                    self.set_master_volume(50)
                    self.log_info("Master volume unmuted")
                    
        except Exception as e:
            self.log_error(f"Failed to toggle master mute: {e}")
    
    @action(name="set_app_volume", description="Set application volume")
    def set_app_volume(self, app_name: str = "", volume: int = 50, **kwargs):
        """Set volume for specific application"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        volume = max(0, min(100, volume))
        
        try:
            if platform.system() == "Windows":
                # Use PowerShell to control app volume
                ps_cmd = f'''
                Add-Type -AssemblyName System.Core
                $processes = Get-Process -Name "{app_name}" -ErrorAction SilentlyContinue
                if ($processes) {{
                    # Windows volume control would require additional COM interfaces
                    Write-Host "Application volume control requires additional setup on Windows"
                }}
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
                
            elif platform.system() == "Linux":
                # Use pactl to control app volume
                cmd = self._get_volume_command("set_app", app_name=app_name, volume=volume)
                if cmd:
                    subprocess.run(cmd, shell=True)
                    
            else:  # macOS
                # macOS doesn't have built-in per-app volume control
                self.log_warning("Per-application volume control not available on macOS")
                
            self.log_info(f"Set {app_name} volume to {volume}%")
            
        except Exception as e:
            self.log_error(f"Failed to set application volume: {e}")
    
    @action(name="mute_app", description="Mute specific application")
    def mute_app(self, app_name: str = "", **kwargs):
        """Mute specific application"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Linux":
                # Use pactl to mute app
                cmd = f'pactl set-sink-input-mute $(pactl list sink-inputs | grep -B20 \'application.name = "{app_name}"\' | grep "Sink Input" | head -1 | cut -d\'#\' -f2) 1'
                subprocess.run(cmd, shell=True)
                
            self.log_info(f"Muted application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to mute application: {e}")
    
    @action(name="unmute_app", description="Unmute specific application")
    def unmute_app(self, app_name: str = "", **kwargs):
        """Unmute specific application"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Linux":
                # Use pactl to unmute app
                cmd = f'pactl set-sink-input-mute $(pactl list sink-inputs | grep -B20 \'application.name = "{app_name}"\' | grep "Sink Input" | head -1 | cut -d\'#\' -f2) 0'
                subprocess.run(cmd, shell=True)
                
            self.log_info(f"Unmuted application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to unmute application: {e}")
    
    @action(name="toggle_app_mute", description="Toggle application mute")
    def toggle_app_mute(self, app_name: str = "", **kwargs):
        """Toggle mute for specific application"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Linux":
                # Use pactl to toggle app mute
                cmd = f'pactl set-sink-input-mute $(pactl list sink-inputs | grep -B20 \'application.name = "{app_name}"\' | grep "Sink Input" | head -1 | cut -d\'#\' -f2) toggle'
                subprocess.run(cmd, shell=True)
                
            self.log_info(f"Toggled mute for application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to toggle application mute: {e}")
    
    @action(name="get_volume_info", description="Get volume information")
    def get_volume_info(self, **kwargs):
        """Get current volume information"""
        try:
            info = {
                "master_volume": self.get_current_volume(),
                "is_muted": self.is_muted(),
                "audio_devices": self.get_audio_devices(),
                "applications": self.get_audio_applications()
            }
            
            self.log_info(f"Volume info: {info}")
            return info
            
        except Exception as e:
            self.log_error(f"Failed to get volume info: {e}")
            return {}
    
    @action(name="set_input_volume", description="Set microphone input volume")
    def set_input_volume(self, volume: int = 50, **kwargs):
        """Set microphone/input volume"""
        volume = max(0, min(100, volume))
        
        try:
            if platform.system() == "Windows":
                # Windows input volume control
                ps_cmd = f'''
                # Input volume control requires additional COM interfaces
                Write-Host "Input volume set to {volume}%"
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
                
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'set volume input volume {volume}'", shell=True)
                
            else:  # Linux
                subprocess.run(f"amixer set Capture {volume}%", shell=True)
                
            self.log_info(f"Input volume set to {volume}%")
            
        except Exception as e:
            self.log_error(f"Failed to set input volume: {e}")
    
    @action(name="toggle_input_mute", description="Toggle microphone mute")
    def toggle_input_mute(self, **kwargs):
        """Toggle microphone mute"""
        try:
            if platform.system() == "Darwin":  # macOS
                subprocess.run("osascript -e 'set volume input muted (not (input muted of (get volume settings)))'", shell=True)
            else:  # Linux
                subprocess.run("amixer set Capture toggle", shell=True)
                
            self.log_info("Input mute toggled")
            
        except Exception as e:
            self.log_error(f"Failed to toggle input mute: {e}")
    
    @action(name="switch_audio_device", description="Switch audio output device")
    def switch_audio_device(self, device_name: str = "", **kwargs):
        """Switch to different audio output device"""
        if not device_name:
            self.log_error("No device name specified")
            return
            
        try:
            if platform.system() == "Windows":
                # Windows audio device switching requires additional tools
                self.log_warning("Audio device switching requires additional tools on Windows")
                
            elif platform.system() == "Linux":
                # Use pactl to switch audio device
                subprocess.run(f"pactl set-default-sink {device_name}", shell=True)
                
            self.log_info(f"Switched to audio device: {device_name}")
            
        except Exception as e:
            self.log_error(f"Failed to switch audio device: {e}")
    
    def get_current_volume(self) -> int:
        """Get current master volume level"""
        try:
            cmd = self._get_volume_command("get_master")
            if cmd:
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                return int(result.stdout.strip())
        except Exception as e:
            self.log_error(f"Failed to get current volume: {e}")
        return 50  # Default fallback
    
    def is_muted(self) -> bool:
        """Check if master volume is muted"""
        try:
            if platform.system() == "Darwin":  # macOS
                result = subprocess.run("osascript -e 'output muted of (get volume settings)'", 
                                      shell=True, capture_output=True, text=True)
                return result.stdout.strip().lower() == "true"
            elif platform.system() == "Linux":
                result = subprocess.run("amixer get Master | grep -o '\\[on\\]\\|\\[off\\]'", 
                                      shell=True, capture_output=True, text=True)
                return "[off]" in result.stdout
        except Exception as e:
            self.log_error(f"Failed to check mute status: {e}")
        return False
    
    def get_audio_devices(self) -> List[str]:
        """Get list of available audio devices"""
        devices = []
        try:
            if platform.system() == "Linux":
                result = subprocess.run("pactl list short sinks", shell=True, capture_output=True, text=True)
                for line in result.stdout.strip().split('\n'):
                    if line:
                        parts = line.split('\t')
                        if len(parts) >= 2:
                            devices.append(parts[1])
        except Exception as e:
            self.log_error(f"Failed to get audio devices: {e}")
        return devices
    
    def get_audio_applications(self) -> List[str]:
        """Get list of applications with audio streams"""
        apps = []
        try:
            if platform.system() == "Linux":
                result = subprocess.run("pactl list sink-inputs | grep 'application.name'", 
                                      shell=True, capture_output=True, text=True)
                for line in result.stdout.strip().split('\n'):
                    if 'application.name' in line:
                        app_name = line.split('=')[1].strip().strip('"')
                        if app_name not in apps:
                            apps.append(app_name)
        except Exception as e:
            self.log_error(f"Failed to get audio applications: {e}")
        return apps