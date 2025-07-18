"""
Website Plugin
Open websites, URLs, and web-based actions
"""

import webbrowser
import requests
import subprocess
import platform
import logging
from typing import Dict, Callable
import sys
import os
from plugins.base_plugin import BasePlugin, action

class WebsitePlugin(BasePlugin):
    """Website and URL handling plugin"""
    
    def __init__(self):
        super().__init__()
        self.name = "Website"
        self.description = "Open websites, URLs, and perform web-based actions"
        self.version = "1.0.0"
        self.author = "StreamDeck Team"
        self.category = "Web"
        
    def get_actions(self) -> Dict[str, Callable]:
        """Return available website actions"""
        return {
            "open_url": self.open_url,
            "open_google_search": self.open_google_search,
            "open_youtube": self.open_youtube,
            "open_github": self.open_github,
            "open_twitter": self.open_twitter,
            "open_facebook": self.open_facebook,
            "open_instagram": self.open_instagram,
            "open_reddit": self.open_reddit,
            "open_gmail": self.open_gmail,
            "webhook": self.webhook,
            "ping_website": self.ping_website,
            "open_localhost": self.open_localhost
        }
    
    def get_parameters(self) -> Dict[str, Dict]:
        """Return parameter definitions"""
        return {
            "url": {
                "type": "string",
                "default": "https://",
                "description": "URL to open"
            },
            "search_query": {
                "type": "string",
                "default": "",
                "description": "Search query"
            },
            "port": {
                "type": "int",
                "default": 3000,
                "description": "Port number for localhost"
            },
            "webhook_data": {
                "type": "string",
                "default": "{}",
                "description": "JSON data to send to webhook"
            },
            "method": {
                "type": "string",
                "default": "GET",
                "description": "HTTP method (GET, POST, PUT, DELETE)"
            },
            "new_tab": {
                "type": "bool",
                "default": True,
                "description": "Open in new tab"
            },
            "browser": {
                "type": "string",
                "default": "",
                "description": "Specific browser to use"
            }
        }
    
    @action(name="open_url", description="Open URL in browser")
    def open_url(self, url: str = "", new_tab: bool = True, browser: str = "", **kwargs):
        """Open URL in default or specified browser"""
        if not url:
            self.log_error("No URL specified")
            return
            
        # Ensure URL has protocol
        if not url.startswith(('http://', 'https://', 'ftp://')):
            url = 'https://' + url
            
        try:
            if browser:
                # Try to open with specific browser
                if platform.system() == "Windows":
                    browser_paths = {
                        "chrome": "chrome.exe",
                        "firefox": "firefox.exe",
                        "edge": "msedge.exe",
                        "opera": "opera.exe"
                    }
                    browser_exe = browser_paths.get(browser.lower(), browser)
                    subprocess.run([browser_exe, url])
                elif platform.system() == "Darwin":  # macOS
                    browser_apps = {
                        "chrome": "Google Chrome",
                        "firefox": "Firefox",
                        "safari": "Safari",
                        "opera": "Opera"
                    }
                    browser_app = browser_apps.get(browser.lower(), browser)
                    subprocess.run(["open", "-a", browser_app, url])
                else:  # Linux
                    subprocess.run([browser, url])
            else:
                # Use default browser
                webbrowser.open(url, new=2 if new_tab else 1)
                
            self.log_info(f"Opened URL: {url}")
            
        except Exception as e:
            self.log_error(f"Failed to open URL: {e}")
    
    @action(name="open_google_search", description="Open Google search")
    def open_google_search(self, search_query: str = "", **kwargs):
        """Open Google search with query"""
        if not search_query:
            self.log_error("No search query specified")
            return
            
        try:
            import urllib.parse
            encoded_query = urllib.parse.quote(search_query)
            url = f"https://www.google.com/search?q={encoded_query}"
            webbrowser.open(url)
            
            self.log_info(f"Opened Google search: {search_query}")
            
        except Exception as e:
            self.log_error(f"Failed to open Google search: {e}")
    
    @action(name="open_youtube", description="Open YouTube")
    def open_youtube(self, search_query: str = "", **kwargs):
        """Open YouTube, optionally with search query"""
        try:
            if search_query:
                import urllib.parse
                encoded_query = urllib.parse.quote(search_query)
                url = f"https://www.youtube.com/results?search_query={encoded_query}"
            else:
                url = "https://www.youtube.com"
                
            webbrowser.open(url)
            
            self.log_info(f"Opened YouTube: {search_query or 'Home'}")
            
        except Exception as e:
            self.log_error(f"Failed to open YouTube: {e}")
    
    @action(name="open_github", description="Open GitHub")
    def open_github(self, search_query: str = "", **kwargs):
        """Open GitHub, optionally with search query"""
        try:
            if search_query:
                import urllib.parse
                encoded_query = urllib.parse.quote(search_query)
                url = f"https://github.com/search?q={encoded_query}"
            else:
                url = "https://github.com"
                
            webbrowser.open(url)
            
            self.log_info(f"Opened GitHub: {search_query or 'Home'}")
            
        except Exception as e:
            self.log_error(f"Failed to open GitHub: {e}")
    
    @action(name="open_twitter", description="Open Twitter/X")
    def open_twitter(self, search_query: str = "", **kwargs):
        """Open Twitter/X, optionally with search query"""
        try:
            if search_query:
                import urllib.parse
                encoded_query = urllib.parse.quote(search_query)
                url = f"https://twitter.com/search?q={encoded_query}"
            else:
                url = "https://twitter.com"
                
            webbrowser.open(url)
            
            self.log_info(f"Opened Twitter: {search_query or 'Home'}")
            
        except Exception as e:
            self.log_error(f"Failed to open Twitter: {e}")
    
    @action(name="open_facebook", description="Open Facebook")
    def open_facebook(self, **kwargs):
        """Open Facebook"""
        try:
            webbrowser.open("https://www.facebook.com")
            self.log_info("Opened Facebook")
            
        except Exception as e:
            self.log_error(f"Failed to open Facebook: {e}")
    
    @action(name="open_instagram", description="Open Instagram")
    def open_instagram(self, **kwargs):
        """Open Instagram"""
        try:
            webbrowser.open("https://www.instagram.com")
            self.log_info("Opened Instagram")
            
        except Exception as e:
            self.log_error(f"Failed to open Instagram: {e}")
    
    @action(name="open_reddit", description="Open Reddit")
    def open_reddit(self, search_query: str = "", **kwargs):
        """Open Reddit, optionally with search query"""
        try:
            if search_query:
                import urllib.parse
                encoded_query = urllib.parse.quote(search_query)
                url = f"https://www.reddit.com/search?q={encoded_query}"
            else:
                url = "https://www.reddit.com"
                
            webbrowser.open(url)
            
            self.log_info(f"Opened Reddit: {search_query or 'Home'}")
            
        except Exception as e:
            self.log_error(f"Failed to open Reddit: {e}")
    
    @action(name="open_gmail", description="Open Gmail")
    def open_gmail(self, **kwargs):
        """Open Gmail"""
        try:
            webbrowser.open("https://mail.google.com")
            self.log_info("Opened Gmail")
            
        except Exception as e:
            self.log_error(f"Failed to open Gmail: {e}")
    
    @action(name="webhook", description="Send webhook request")
    def webhook(self, url: str = "", method: str = "GET", webhook_data: str = "{}", **kwargs):
        """Send webhook request to URL"""
        if not url:
            self.log_error("No webhook URL specified")
            return
            
        try:
            import json
            
            # Parse webhook data
            try:
                data = json.loads(webhook_data) if webhook_data else {}
            except json.JSONDecodeError:
                self.log_error("Invalid JSON in webhook data")
                return
                
            # Send request
            method = method.upper()
            headers = {'Content-Type': 'application/json'}
            
            if method == "GET":
                response = requests.get(url, params=data, timeout=10)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == "DELETE":
                response = requests.delete(url, timeout=10)
            else:
                self.log_error(f"Unsupported HTTP method: {method}")
                return
                
            response.raise_for_status()
            
            self.log_info(f"Webhook sent successfully: {method} {url}")
            self.log_info(f"Response: {response.status_code}")
            
        except requests.exceptions.RequestException as e:
            self.log_error(f"Webhook request failed: {e}")
        except Exception as e:
            self.log_error(f"Failed to send webhook: {e}")
    
    @action(name="ping_website", description="Ping website to check if it's online")
    def ping_website(self, url: str = "", **kwargs):
        """Ping website to check if it's online"""
        if not url:
            self.log_error("No URL specified")
            return
            
        # Ensure URL has protocol
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
            
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            self.log_info(f"Website is online: {url} (Status: {response.status_code})")
            
        except requests.exceptions.RequestException as e:
            self.log_error(f"Website is offline or unreachable: {url} - {e}")
        except Exception as e:
            self.log_error(f"Failed to ping website: {e}")
    
    @action(name="open_localhost", description="Open localhost with port")
    def open_localhost(self, port: int = 3000, **kwargs):
        """Open localhost with specified port"""
        try:
            url = f"http://localhost:{port}"
            webbrowser.open(url)
            
            self.log_info(f"Opened localhost: {url}")
            
        except Exception as e:
            self.log_error(f"Failed to open localhost: {e}")
    
    def get_bookmarks(self) -> list:
        """Get browser bookmarks (basic implementation)"""
        bookmarks = [
            {"name": "Google", "url": "https://www.google.com"},
            {"name": "YouTube", "url": "https://www.youtube.com"},
            {"name": "GitHub", "url": "https://github.com"},
            {"name": "Stack Overflow", "url": "https://stackoverflow.com"},
            {"name": "Reddit", "url": "https://www.reddit.com"},
            {"name": "Twitter", "url": "https://twitter.com"},
            {"name": "Facebook", "url": "https://www.facebook.com"},
            {"name": "Instagram", "url": "https://www.instagram.com"},
            {"name": "LinkedIn", "url": "https://www.linkedin.com"},
            {"name": "Gmail", "url": "https://mail.google.com"}
        ]
        
        return bookmarks
    
    def validate_url(self, url: str) -> bool:
        """Validate if URL is properly formatted"""
        try:
            import re
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)',
                re.IGNORECASE
            )
            return url_pattern.match(url) is not None
        except Exception:
            return False