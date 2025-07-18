"""
Application Plugin
Launch applications, open files, and manage windows
"""

import subprocess
import platform
import os
import logging
from pathlib import Path
from typing import Dict, Callable
from plugins.base_plugin import BasePlugin, action

class ApplicationPlugin(BasePlugin):
    """Application launcher and management plugin"""
    
    def __init__(self):
        super().__init__()
        self.name = "Application"
        self.description = "Launch applications, open files, and manage windows"
        self.version = "1.0.0"
        self.author = "StreamDeck Team"
        self.category = "Application"
        
    def get_actions(self) -> Dict[str, Callable]:
        """Return available application actions"""
        return {
            "launch_app": self.launch_app,
            "open_file": self.open_file,
            "open_folder": self.open_folder,
            "close_app": self.close_app,
            "switch_app": self.switch_app,
            "minimize_app": self.minimize_app,
            "maximize_app": self.maximize_app,
            "toggle_app": self.toggle_app,
            "open_calculator": self.open_calculator,
            "open_notepad": self.open_notepad,
            "open_browser": self.open_browser
        }
    
    def get_parameters(self) -> Dict[str, Dict]:
        """Return parameter definitions"""
        return {
            "path": {
                "type": "file",
                "default": "",
                "description": "Path to application or file"
            },
            "arguments": {
                "type": "string",
                "default": "",
                "description": "Command line arguments"
            },
            "working_directory": {
                "type": "file",
                "default": "",
                "description": "Working directory for the application"
            },
            "app_name": {
                "type": "string",
                "default": "",
                "description": "Application name or window title"
            },
            "url": {
                "type": "string",
                "default": "https://",
                "description": "URL to open in browser"
            },
            "wait_for_exit": {
                "type": "bool",
                "default": False,
                "description": "Wait for application to exit"
            }
        }
    
    @action(name="launch_app", description="Launch an application")
    def launch_app(self, path: str = "", arguments: str = "", working_directory: str = "", wait_for_exit: bool = False, **kwargs):
        """Launch an application"""
        if not path:
            self.log_error("No application path specified")
            return
            
        if not os.path.exists(path):
            self.log_error(f"Application not found: {path}")
            return
            
        try:
            # Build command
            cmd = [path]
            if arguments:
                cmd.extend(arguments.split())
            
            # Set working directory
            cwd = working_directory if working_directory and os.path.exists(working_directory) else None
            
            # Launch application
            if platform.system() == "Windows":
                if wait_for_exit:
                    subprocess.run(cmd, cwd=cwd)
                else:
                    subprocess.Popen(cmd, cwd=cwd)
            else:
                if wait_for_exit:
                    subprocess.run(cmd, cwd=cwd)
                else:
                    subprocess.Popen(cmd, cwd=cwd)
                    
            self.log_info(f"Launched application: {path}")
            
        except Exception as e:
            self.log_error(f"Failed to launch application: {e}")
    
    @action(name="open_file", description="Open file with default application")
    def open_file(self, path: str = "", **kwargs):
        """Open file with default application"""
        if not path:
            self.log_error("No file path specified")
            return
            
        if not os.path.exists(path):
            self.log_error(f"File not found: {path}")
            return
            
        try:
            if platform.system() == "Windows":
                os.startfile(path)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", path])
            else:  # Linux
                subprocess.run(["xdg-open", path])
                
            self.log_info(f"Opened file: {path}")
            
        except Exception as e:
            self.log_error(f"Failed to open file: {e}")
    
    @action(name="open_folder", description="Open folder in file manager")
    def open_folder(self, path: str = "", **kwargs):
        """Open folder in file manager"""
        if not path:
            self.log_error("No folder path specified")
            return
            
        # If path is a file, get its directory
        if os.path.isfile(path):
            path = os.path.dirname(path)
            
        if not os.path.exists(path):
            self.log_error(f"Folder not found: {path}")
            return
            
        try:
            if platform.system() == "Windows":
                subprocess.run(f'explorer "{path}"', shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", path])
            else:  # Linux
                subprocess.run(["xdg-open", path])
                
            self.log_info(f"Opened folder: {path}")
            
        except Exception as e:
            self.log_error(f"Failed to open folder: {e}")
    
    @action(name="close_app", description="Close application by name")
    def close_app(self, app_name: str = "", **kwargs):
        """Close application by name"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Windows":
                subprocess.run(f"taskkill /f /im {app_name}", shell=True)
            else:  # macOS and Linux
                subprocess.run(f"pkill -f {app_name}", shell=True)
                
            self.log_info(f"Closed application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to close application: {e}")
    
    @action(name="switch_app", description="Switch to application")
    def switch_app(self, app_name: str = "", **kwargs):
        """Switch to application window"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Windows":
                # Use PowerShell to switch to window
                ps_cmd = f'''
                Add-Type -AssemblyName Microsoft.VisualBasic
                Add-Type -AssemblyName System.Windows.Forms
                $proc = Get-Process -Name "{app_name}" -ErrorAction SilentlyContinue
                if ($proc) {{
                    [Microsoft.VisualBasic.Interaction]::AppActivate($proc.Id)
                }}
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'tell application \"{app_name}\" to activate'", shell=True)
            else:  # Linux
                subprocess.run(f"wmctrl -a {app_name}", shell=True)
                
            self.log_info(f"Switched to application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to switch to application: {e}")
    
    @action(name="minimize_app", description="Minimize application")
    def minimize_app(self, app_name: str = "", **kwargs):
        """Minimize application window"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Windows":
                # Use PowerShell to minimize window
                ps_cmd = f'''
                Add-Type -AssemblyName Microsoft.VisualBasic
                $proc = Get-Process -Name "{app_name}" -ErrorAction SilentlyContinue
                if ($proc) {{
                    $hwnd = $proc.MainWindowHandle
                    [Microsoft.VisualBasic.Interaction]::ShowWindow($hwnd, 2)
                }}
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'tell application \"{app_name}\" to set miniaturized of every window to true'", shell=True)
            else:  # Linux
                subprocess.run(f"wmctrl -r {app_name} -b add,hidden", shell=True)
                
            self.log_info(f"Minimized application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to minimize application: {e}")
    
    @action(name="maximize_app", description="Maximize application")
    def maximize_app(self, app_name: str = "", **kwargs):
        """Maximize application window"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Windows":
                # Use PowerShell to maximize window
                ps_cmd = f'''
                Add-Type -AssemblyName Microsoft.VisualBasic
                $proc = Get-Process -Name "{app_name}" -ErrorAction SilentlyContinue
                if ($proc) {{
                    $hwnd = $proc.MainWindowHandle
                    [Microsoft.VisualBasic.Interaction]::ShowWindow($hwnd, 3)
                }}
                '''
                subprocess.run(["powershell", "-Command", ps_cmd], shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(f"osascript -e 'tell application \"{app_name}\" to set bounds of every window to {{0, 0, 1920, 1080}}'", shell=True)
            else:  # Linux
                subprocess.run(f"wmctrl -r {app_name} -b add,maximized_vert,maximized_horz", shell=True)
                
            self.log_info(f"Maximized application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to maximize application: {e}")
    
    @action(name="toggle_app", description="Toggle application visibility")
    def toggle_app(self, app_name: str = "", **kwargs):
        """Toggle application visibility (show/hide)"""
        if not app_name:
            self.log_error("No application name specified")
            return
            
        try:
            if platform.system() == "Windows":
                # Check if process is running
                result = subprocess.run(f"tasklist /fi \"imagename eq {app_name}\"", 
                                      shell=True, capture_output=True, text=True)
                if app_name in result.stdout:
                    # App is running, try to switch to it
                    self.switch_app(app_name)
                else:
                    # App is not running, launch it
                    self.launch_app(app_name)
            else:
                # For macOS and Linux, try to activate or launch
                try:
                    self.switch_app(app_name)
                except:
                    self.launch_app(app_name)
                    
            self.log_info(f"Toggled application: {app_name}")
            
        except Exception as e:
            self.log_error(f"Failed to toggle application: {e}")
    
    @action(name="open_calculator", description="Open calculator")
    def open_calculator(self, **kwargs):
        """Open system calculator"""
        try:
            if platform.system() == "Windows":
                subprocess.run("calc", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("open -a Calculator", shell=True)
            else:  # Linux
                calculators = ["gnome-calculator", "kcalc", "xcalc"]
                for calc in calculators:
                    try:
                        subprocess.run(calc, shell=True, check=True)
                        break
                    except subprocess.CalledProcessError:
                        continue
                        
            self.log_info("Calculator opened")
            
        except Exception as e:
            self.log_error(f"Failed to open calculator: {e}")
    
    @action(name="open_notepad", description="Open text editor")
    def open_notepad(self, **kwargs):
        """Open system text editor"""
        try:
            if platform.system() == "Windows":
                subprocess.run("notepad", shell=True)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run("open -a TextEdit", shell=True)
            else:  # Linux
                editors = ["gedit", "kate", "nano", "vim"]
                for editor in editors:
                    try:
                        subprocess.run(editor, shell=True, check=True)
                        break
                    except subprocess.CalledProcessError:
                        continue
                        
            self.log_info("Text editor opened")
            
        except Exception as e:
            self.log_error(f"Failed to open text editor: {e}")
    
    @action(name="open_browser", description="Open web browser")
    def open_browser(self, url: str = "https://google.com", **kwargs):
        """Open web browser with URL"""
        try:
            import webbrowser
            webbrowser.open(url)
            self.log_info(f"Opened browser with URL: {url}")
            
        except Exception as e:
            self.log_error(f"Failed to open browser: {e}")
    
    def get_running_applications(self) -> list:
        """Get list of running applications"""
        try:
            if platform.system() == "Windows":
                result = subprocess.run("tasklist /fo csv", shell=True, capture_output=True, text=True)
                lines = result.stdout.strip().split('\n')[1:]  # Skip header
                apps = []
                for line in lines:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        apps.append(parts[0].strip('"'))
                return apps
            else:
                result = subprocess.run("ps aux", shell=True, capture_output=True, text=True)
                lines = result.stdout.strip().split('\n')[1:]  # Skip header
                apps = []
                for line in lines:
                    parts = line.split()
                    if len(parts) >= 11:
                        apps.append(' '.join(parts[10:]))
                return apps
        except Exception as e:
            self.log_error(f"Failed to get running applications: {e}")
            return []

    def find_applications(self, search_term: str = "") -> list:
        """Find installed applications"""
        apps = []
        try:
            if platform.system() == "Windows":
                # Search in common program directories
                program_dirs = [
                    "C:\\Program Files",
                    "C:\\Program Files (x86)",
                    os.path.expanduser("~\\AppData\\Local\\Programs")
                ]
                
                for program_dir in program_dirs:
                    if os.path.exists(program_dir):
                        for root, dirs, files in os.walk(program_dir):
                            for file in files:
                                if file.endswith('.exe') and (not search_term or search_term.lower() in file.lower()):
                                    apps.append(os.path.join(root, file))
                                    
            elif platform.system() == "Darwin":  # macOS
                # Search in Applications folder
                apps_dir = "/Applications"
                if os.path.exists(apps_dir):
                    for item in os.listdir(apps_dir):
                        if item.endswith('.app') and (not search_term or search_term.lower() in item.lower()):
                            apps.append(os.path.join(apps_dir, item))
                            
            else:  # Linux
                # Search in common binary directories
                bin_dirs = ["/usr/bin", "/usr/local/bin", "/bin"]
                for bin_dir in bin_dirs:
                    if os.path.exists(bin_dir):
                        for file in os.listdir(bin_dir):
                            if os.path.isfile(os.path.join(bin_dir, file)) and (not search_term or search_term.lower() in file.lower()):
                                apps.append(os.path.join(bin_dir, file))
                                
        except Exception as e:
            self.log_error(f"Failed to find applications: {e}")
            
        return apps[:50]  # Limit to 50 results