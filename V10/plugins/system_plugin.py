"""
System Control Plugin
Provides system-level controls like shutdown, restart, lock, etc.
"""

import subprocess
import platform
import logging
from typing import Dict, Callable
from plugins.base_plugin import BasePlugin, action

class SystemPlugin(BasePlugin):
    """System control plugin for basic system operations"""
    
    def __init__(self):
        super().__init__()
        self.name = "System"
        self.description = "System control functions (shutdown, restart, lock, etc.)"
        self.version = "1.0.0"
        self.author = "StreamDeck Team"
        self.category = "System"
        
    def get_actions(self) -> Dict[str, Callable]:
        """Return available system actions"""
        return {
            "shutdown": self.shutdown,
            "restart": self.restart,
            "lock_screen": self.lock_screen,
            "sleep": self.sleep,
            "logout": self.logout,
            "run_command": self.run_command,
            "open_task_manager": self.open_task_manager,
            "empty_recycle_bin": self.empty_recycle_bin,
            "kill_process": self.kill_process
        }
    
    def get_parameters(self) -> Dict[str, Dict]:
        """Return parameter definitions"""
        return {
            "delay": {
                "type": "int",
                "default": 0,
                "description": "Delay in seconds before executing action"
            },
            "command": {
                "type": "string",
                "default": "",
                "description": "Command to execute"
            },
            "process_name": {
                "type": "string",
                "default": "",
                "description": "Name of process to kill"
            },
            "force": {
                "type": "bool",
                "default": False,
                "description": "Force action without confirmation"
            }
        }
    
    @action(name="shutdown", description="Shutdown the system")
    def shutdown(self, delay: int = 0, force: bool = False, **kwargs):
        """Shutdown the system"""
        try:
            if platform.system() == "Windows":
                force_flag = "/f" if force else ""
                subprocess.run(f"shutdown /s /t {delay} {force_flag}", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"sudo shutdown -h +{delay//60}", shell=True)
            else:  # Linux
                subprocess.run(f"sudo shutdown -h +{delay//60}", shell=True)
            
            self.log_info(f"System shutdown initiated with {delay}s delay")
            
        except Exception as e:
            self.log_error(f"Failed to shutdown system: {e}")
    
    @action(name="restart", description="Restart the system")
    def restart(self, delay: int = 0, force: bool = False, **kwargs):
        """Restart the system"""
        try:
            if platform.system() == "Windows":
                force_flag = "/f" if force else ""
                subprocess.run(f"shutdown /r /t {delay} {force_flag}", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"sudo shutdown -r +{delay//60}", shell=True)
            else:  # Linux
                subprocess.run(f"sudo shutdown -r +{delay//60}", shell=True)
            
            self.log_info(f"System restart initiated with {delay}s delay")
            
        except Exception as e:
            self.log_error(f"Failed to restart system: {e}")
    
    @action(name="lock_screen", description="Lock the screen")
    def lock_screen(self, **kwargs):
        """Lock the screen"""
        try:
            if platform.system() == "Windows":
                subprocess.run("rundll32.exe user32.dll,LockWorkStation", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("pmset displaysleepnow", shell=True)
            else:  # Linux
                # Try different lock commands
                lock_commands = [
                    "xdg-screensaver lock",
                    "gnome-screensaver-command -l",
                    "loginctl lock-session",
                    "dm-tool lock"
                ]
                
                for cmd in lock_commands:
                    try:
                        subprocess.run(cmd, shell=True, check=True)
                        break
                    except subprocess.CalledProcessError:
                        continue
                        
            self.log_info("Screen locked")
            
        except Exception as e:
            self.log_error(f"Failed to lock screen: {e}")
    
    @action(name="sleep", description="Put system to sleep")
    def sleep(self, **kwargs):
        """Put the system to sleep"""
        try:
            if platform.system() == "Windows":
                subprocess.run("rundll32.exe powrprof.dll,SetSuspendState 0,1,0", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("pmset sleepnow", shell=True)
            else:  # Linux
                subprocess.run("systemctl suspend", shell=True)
                
            self.log_info("System put to sleep")
            
        except Exception as e:
            self.log_error(f"Failed to put system to sleep: {e}")
    
    @action(name="logout", description="Log out current user")
    def logout(self, **kwargs):
        """Log out the current user"""
        try:
            if platform.system() == "Windows":
                subprocess.run("shutdown /l", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("osascript -e 'tell app \"System Events\" to log out'", shell=True)
            else:  # Linux
                subprocess.run("loginctl terminate-user $USER", shell=True)
                
            self.log_info("User logged out")
            
        except Exception as e:
            self.log_error(f"Failed to logout user: {e}")
    
    @action(name="run_command", description="Execute custom command")
    def run_command(self, command: str = "", **kwargs):
        """Execute a custom command"""
        if not command:
            self.log_error("No command specified")
            return
            
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=30
            )
            
            self.log_info(f"Command executed: {command}")
            
            if result.stdout:
                self.log_info(f"Output: {result.stdout.strip()}")
            if result.stderr:
                self.log_error(f"Error: {result.stderr.strip()}")
            if result.returncode != 0:
                self.log_error(f"Command failed with code: {result.returncode}")
                
        except subprocess.TimeoutExpired:
            self.log_error("Command timed out")
        except Exception as e:
            self.log_error(f"Failed to execute command: {e}")
    
    @action(name="open_task_manager", description="Open Task Manager")
    def open_task_manager(self, **kwargs):
        """Open Task Manager or system monitor"""
        try:
            if platform.system() == "Windows":
                subprocess.run("taskmgr", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("open -a 'Activity Monitor'", shell=True)
            else:  # Linux
                # Try different system monitors
                monitors = ["gnome-system-monitor", "ksysguard", "htop", "top"]
                for monitor in monitors:
                    try:
                        subprocess.run(monitor, shell=True, check=True)
                        break
                    except subprocess.CalledProcessError:
                        continue
                        
            self.log_info("Task Manager opened")
            
        except Exception as e:
            self.log_error(f"Failed to open Task Manager: {e}")
    
    @action(name="empty_recycle_bin", description="Empty Recycle Bin")
    def empty_recycle_bin(self, **kwargs):
        """Empty the Recycle Bin/Trash"""
        try:
            if platform.system() == "Windows":
                subprocess.run("rd /s /q C:\\$Recycle.Bin", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("rm -rf ~/.Trash/*", shell=True)
            else:  # Linux
                subprocess.run("rm -rf ~/.local/share/Trash/*", shell=True)
                
            self.log_info("Recycle Bin emptied")
            
        except Exception as e:
            self.log_error(f"Failed to empty Recycle Bin: {e}")
    
    @action(name="kill_process", description="Kill a process by name")
    def kill_process(self, process_name: str = "", force: bool = False, **kwargs):
        """Kill a process by name"""
        if not process_name:
            self.log_error("No process name specified")
            return
            
        try:
            if platform.system() == "Windows":
                force_flag = "/f" if force else ""
                subprocess.run(f"taskkill /im {process_name} {force_flag}", shell=True)
            else:  # macOS and Linux
                signal_type = "-9" if force else "-15"
                subprocess.run(f"pkill {signal_type} {process_name}", shell=True)
                
            self.log_info(f"Process killed: {process_name}")
            
        except Exception as e:
            self.log_error(f"Failed to kill process {process_name}: {e}")

    def get_system_info(self) -> Dict[str, str]:
        """Get system information"""
        return {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.architecture()[0],
            "processor": platform.processor(),
            "hostname": platform.node()
        }