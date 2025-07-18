"""
Multimedia Plugin
Control media playback, volume, and multimedia functions
"""

import subprocess
import platform
import logging
from typing import Dict, Callable
from plugins.base_plugin import BasePlugin, action

class MultimediaPlugin(BasePlugin):
    """Multimedia control plugin for media playback and volume"""
    
    def __init__(self):
        super().__init__()
        self.name = "Multimedia"
        self.description = "Control media playback, volume, and multimedia functions"
        self.version = "1.0.0"
        self.author = "StreamDeck Team"
        self.category = "Media"
        
    def get_actions(self) -> Dict[str, Callable]:
        """Return available multimedia actions"""
        return {
            "play_pause": self.play_pause,
            "play": self.play,
            "pause": self.pause,
            "stop": self.stop,
            "next_track": self.next_track,
            "previous_track": self.previous_track,
            "volume_up": self.volume_up,
            "volume_down": self.volume_down,
            "volume_mute": self.volume_mute,
            "set_volume": self.set_volume,
            "fast_forward": self.fast_forward,
            "rewind": self.rewind,
            "shuffle": self.shuffle,
            "repeat": self.repeat
        }
    
    def get_parameters(self) -> Dict[str, Dict]:
        """Return parameter definitions"""
        return {
            "volume_level": {
                "type": "int",
                "default": 50,
                "description": "Volume level (0-100)"
            },
            "step_size": {
                "type": "int",
                "default": 5,
                "description": "Volume step size"
            },
            "duration": {
                "type": "int",
                "default": 10,
                "description": "Duration in seconds for seek operations"
            }
        }
    
    def _send_media_key(self, key_code: str):
        """Send media key command based on platform"""
        try:
            if platform.system() == "Windows":
                # Use PowerShell to send media keys
                ps_cmd = f'''
                Add-Type -AssemblyName System.Windows.Forms
                [System.Windows.Forms.SendKeys]::SendWait("{key_code}")
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
            elif platform.system() == "Darwin":  # macOS
                # Use osascript to send media keys
                key_mappings = {
                    "PLAYPAUSE": "tell application \"System Events\" to key code 16",
                    "NEXTTRACK": "tell application \"System Events\" to key code 19",
                    "PREVTRACK": "tell application \"System Events\" to key code 20",
                    "STOP": "tell application \"System Events\" to key code 53",
                    "VOLUMEUP": "tell application \"System Events\" to key code 24",
                    "VOLUMEDOWN": "tell application \"System Events\" to key code 25",
                    "VOLUMEMUTE": "tell application \"System Events\" to key code 26"
                }
                if key_code in key_mappings:
                    subprocess.run(f"osascript -e '{key_mappings[key_code]}'", shell=True)
            else:  # Linux
                # Use playerctl or xdotool
                key_mappings = {
                    "PLAYPAUSE": "play-pause",
                    "NEXTTRACK": "next",
                    "PREVTRACK": "previous",
                    "STOP": "stop",
                    "VOLUMEUP": "volume 0.05+",
                    "VOLUMEDOWN": "volume 0.05-",
                    "VOLUMEMUTE": "volume 0"
                }
                if key_code in key_mappings:
                    try:
                        subprocess.run(f"playerctl {key_mappings[key_code]}", shell=True, check=True)
                    except subprocess.CalledProcessError:
                        # Fallback to xdotool
                        xdotool_keys = {
                            "PLAYPAUSE": "XF86AudioPlay",
                            "NEXTTRACK": "XF86AudioNext",
                            "PREVTRACK": "XF86AudioPrev",
                            "STOP": "XF86AudioStop",
                            "VOLUMEUP": "XF86AudioRaiseVolume",
                            "VOLUMEDOWN": "XF86AudioLowerVolume",
                            "VOLUMEMUTE": "XF86AudioMute"
                        }
                        if key_code in xdotool_keys:
                            subprocess.run(f"xdotool key {xdotool_keys[key_code]}", shell=True)
                            
        except Exception as e:
            self.log_error(f"Failed to send media key {key_code}: {e}")
    
    @action(name="play_pause", description="Toggle play/pause")
    def play_pause(self, **kwargs):
        """Toggle play/pause for media playback"""
        self._send_media_key("PLAYPAUSE")
        self.log_info("Play/Pause toggled")
    
    @action(name="play", description="Start playback")
    def play(self, **kwargs):
        """Start media playback"""
        try:
            if platform.system() == "Linux":
                subprocess.run("playerctl play", shell=True)
            else:
                self._send_media_key("PLAYPAUSE")
            self.log_info("Playback started")
        except Exception as e:
            self.log_error(f"Failed to start playback: {e}")
    
    @action(name="pause", description="Pause playback")
    def pause(self, **kwargs):
        """Pause media playback"""
        try:
            if platform.system() == "Linux":
                subprocess.run("playerctl pause", shell=True)
            else:
                self._send_media_key("PLAYPAUSE")
            self.log_info("Playback paused")
        except Exception as e:
            self.log_error(f"Failed to pause playback: {e}")
    
    @action(name="stop", description="Stop playback")
    def stop(self, **kwargs):
        """Stop media playback"""
        self._send_media_key("STOP")
        self.log_info("Playback stopped")
    
    @action(name="next_track", description="Next track")
    def next_track(self, **kwargs):
        """Skip to next track"""
        self._send_media_key("NEXTTRACK")
        self.log_info("Skipped to next track")
    
    @action(name="previous_track", description="Previous track")
    def previous_track(self, **kwargs):
        """Skip to previous track"""
        self._send_media_key("PREVTRACK")
        self.log_info("Skipped to previous track")
    
    @action(name="volume_up", description="Increase volume")
    def volume_up(self, step_size: int = 5, **kwargs):
        """Increase system volume"""
        try:
            if platform.system() == "Windows":
                # Use nircmd or PowerShell
                for _ in range(step_size):
                    self._send_media_key("VOLUMEUP")
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'set volume output volume (output volume of (get volume settings) + {step_size})'", shell=True)
            else:  # Linux
                subprocess.run(f"amixer set Master {step_size}%+", shell=True)
                
            self.log_info(f"Volume increased by {step_size}%")
            
        except Exception as e:
            self.log_error(f"Failed to increase volume: {e}")
    
    @action(name="volume_down", description="Decrease volume")
    def volume_down(self, step_size: int = 5, **kwargs):
        """Decrease system volume"""
        try:
            if platform.system() == "Windows":
                # Use nircmd or PowerShell
                for _ in range(step_size):
                    self._send_media_key("VOLUMEDOWN")
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'set volume output volume (output volume of (get volume settings) - {step_size})'", shell=True)
            else:  # Linux
                subprocess.run(f"amixer set Master {step_size}%-", shell=True)
                
            self.log_info(f"Volume decreased by {step_size}%")
            
        except Exception as e:
            self.log_error(f"Failed to decrease volume: {e}")
    
    @action(name="volume_mute", description="Toggle mute")
    def volume_mute(self, **kwargs):
        """Toggle system volume mute"""
        try:
            if platform.system() == "Windows":
                self._send_media_key("VOLUMEMUTE")
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("osascript -e 'set volume output muted (not (output muted of (get volume settings)))'", shell=True)
            else:  # Linux
                subprocess.run("amixer set Master toggle", shell=True)
                
            self.log_info("Volume mute toggled")
            
        except Exception as e:
            self.log_error(f"Failed to toggle mute: {e}")
    
    @action(name="set_volume", description="Set specific volume level")
    def set_volume(self, volume_level: int = 50, **kwargs):
        """Set system volume to specific level"""
        # Clamp volume level between 0 and 100
        volume_level = max(0, min(100, volume_level))
        
        try:
            if platform.system() == "Windows":
                # Use PowerShell to set volume
                ps_cmd = f'''
                Add-Type -TypeDefinition @"
                using System.Runtime.InteropServices;
                [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
                interface IAudioEndpointVolume {{
                    int f(); int g(); int h(); int i();
                    int SetMasterVolumeLevel(float level, System.Guid ctx);
                    int SetMasterVolumeLevelScalar(float level, System.Guid ctx);
                    int j(); int k(); int l(); int m(); int n();
                    int SetMute([MarshalAs(UnmanagedType.Bool)] bool mute, System.Guid ctx);
                }}
                "@
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'set volume output volume {volume_level}'", shell=True)
            else:  # Linux
                subprocess.run(f"amixer set Master {volume_level}%", shell=True)
                
            self.log_info(f"Volume set to {volume_level}%")
            
        except Exception as e:
            self.log_error(f"Failed to set volume: {e}")
    
    @action(name="fast_forward", description="Fast forward")
    def fast_forward(self, duration: int = 10, **kwargs):
        """Fast forward playback"""
        try:
            if platform.system() == "Linux":
                subprocess.run(f"playerctl position {duration}+", shell=True)
            else:
                # Send right arrow key multiple times (common media shortcut)
                for _ in range(duration):
                    if platform.system() == "Windows":
                        subprocess.run(["powershell", "-Command", "[System.Windows.Forms.SendKeys]::SendWait('{RIGHT}')"], shell=True)
                    elif platform.system() == "Darwin":  # macOS
                        subprocess.run("osascript -e 'tell application \"System Events\" to key code 124'", shell=True)
                        
            self.log_info(f"Fast forwarded {duration} seconds")
            
        except Exception as e:
            self.log_error(f"Failed to fast forward: {e}")
    
    @action(name="rewind", description="Rewind")
    def rewind(self, duration: int = 10, **kwargs):
        """Rewind playback"""
        try:
            if platform.system() == "Linux":
                subprocess.run(f"playerctl position {duration}-", shell=True)
            else:
                # Send left arrow key multiple times (common media shortcut)
                for _ in range(duration):
                    if platform.system() == "Windows":
                        subprocess.run(["powershell", "-Command", "[System.Windows.Forms.SendKeys]::SendWait('{LEFT}')"], shell=True)
                    elif platform.system() == "Darwin":  # macOS
                        subprocess.run("osascript -e 'tell application \"System Events\" to key code 123'", shell=True)
                        
            self.log_info(f"Rewound {duration} seconds")
            
        except Exception as e:
            self.log_error(f"Failed to rewind: {e}")
    
    @action(name="shuffle", description="Toggle shuffle")
    def shuffle(self, **kwargs):
        """Toggle shuffle mode"""
        try:
            if platform.system() == "Linux":
                subprocess.run("playerctl shuffle toggle", shell=True)
            else:
                # Send Ctrl+H (common shuffle shortcut)
                if platform.system() == "Windows":
                    subprocess.run(["powershell", "-Command", "[System.Windows.Forms.SendKeys]::SendWait('^h')"], shell=True)
                elif platform.system() == "Darwin":  # macOS
                    subprocess.run("osascript -e 'tell application \"System Events\" to key code 4 using command down'", shell=True)
                    
            self.log_info("Shuffle toggled")
            
        except Exception as e:
            self.log_error(f"Failed to toggle shuffle: {e}")
    
    @action(name="repeat", description="Toggle repeat")
    def repeat(self, **kwargs):
        """Toggle repeat mode"""
        try:
            if platform.system() == "Linux":
                subprocess.run("playerctl loop toggle", shell=True)
            else:
                # Send Ctrl+R (common repeat shortcut)
                if platform.system() == "Windows":
                    subprocess.run(["powershell", "-Command", "[System.Windows.Forms.SendKeys]::SendWait('^r')"], shell=True)
                elif platform.system() == "Darwin":  # macOS
                    subprocess.run("osascript -e 'tell application \"System Events\" to key code 15 using command down'", shell=True)
                    
            self.log_info("Repeat toggled")
            
        except Exception as e:
            self.log_error(f"Failed to toggle repeat: {e}")
    
    def get_current_volume(self) -> int:
        """Get current system volume level"""
        try:
            if platform.system() == "Windows":
                # Use PowerShell to get volume
                ps_cmd = '''
                Add-Type -AssemblyName System.Core
                [Math]::Round([Audio]::Volume * 100)
                '''
                result = subprocess.run(["powershell", "-Command", ps_cmd], 
                                      capture_output=True, text=True, shell=True)
                return int(result.stdout.strip())
            elif platform.system() == "Darwin":  # macOS
                result = subprocess.run("osascript -e 'output volume of (get volume settings)'", 
                                      capture_output=True, text=True, shell=True)
                return int(result.stdout.strip())
            else:  # Linux
                result = subprocess.run("amixer get Master | grep -o '[0-9]*%' | head -1 | tr -d '%'", 
                                      capture_output=True, text=True, shell=True)
                return int(result.stdout.strip())
        except Exception as e:
            self.log_error(f"Failed to get volume: {e}")
            return 50  # Default fallback
    
    def get_player_info(self) -> Dict[str, str]:
        """Get current media player information"""
        info = {
            "title": "Unknown",
            "artist": "Unknown",
            "album": "Unknown",
            "status": "Unknown"
        }
        
        try:
            if platform.system() == "Linux":
                # Use playerctl to get info
                commands = {
                    "title": "playerctl metadata title",
                    "artist": "playerctl metadata artist",
                    "album": "playerctl metadata album",
                    "status": "playerctl status"
                }
                
                for key, cmd in commands.items():
                    try:
                        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                        if result.returncode == 0:
                            info[key] = result.stdout.strip()
                    except:
                        pass
                        
        except Exception as e:
            self.log_error(f"Failed to get player info: {e}")
            
        return info