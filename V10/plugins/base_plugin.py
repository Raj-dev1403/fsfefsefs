"""
Base Plugin System for Nextion Stream Deck
Provides the foundation for all plugins
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Callable
import logging

class BasePlugin(ABC):
    """Base class for all Stream Deck plugins"""
    
    def __init__(self):
        self.name = "Base Plugin"
        self.description = "Base plugin class"
        self.version = "1.0.0"
        self.author = "System"
        self.category = "System"
        self.icon = None
        
    @abstractmethod
    def get_actions(self) -> Dict[str, Callable]:
        """
        Return a dictionary of available actions
        Format: {"action_name": self.action_method}
        """
        pass
    
    def get_parameters(self) -> Dict[str, Dict[str, Any]]:
        """
        Return parameter definitions for actions
        Format: {
            "parameter_name": {
                "type": "string|int|bool|file",
                "default": "default_value",
                "description": "Parameter description"
            }
        }
        """
        return {}
    
    def get_info(self) -> Dict[str, Any]:
        """Return plugin information"""
        return {
            "name": self.name,
            "description": self.description,
            "version": self.version,
            "author": self.author,
            "category": self.category,
            "actions": list(self.get_actions().keys())
        }
    
    def validate_parameters(self, action_name: str, parameters: Dict[str, Any]) -> bool:
        """Validate action parameters"""
        param_definitions = self.get_parameters()
        
        for param_name, param_value in parameters.items():
            if param_name in param_definitions:
                param_def = param_definitions[param_name]
                param_type = param_def.get("type", "string")
                
                # Type validation
                if param_type == "int":
                    try:
                        int(param_value)
                    except (ValueError, TypeError):
                        logging.error(f"Invalid integer value for {param_name}: {param_value}")
                        return False
                elif param_type == "bool":
                    if not isinstance(param_value, bool):
                        logging.error(f"Invalid boolean value for {param_name}: {param_value}")
                        return False
                elif param_type == "file":
                    from pathlib import Path
                    if param_value and not Path(param_value).exists():
                        logging.warning(f"File not found for {param_name}: {param_value}")
                        
        return True
    
    def execute_action(self, action_name: str, parameters: Dict[str, Any] = None) -> bool:
        """Execute an action with parameters"""
        if parameters is None:
            parameters = {}
            
        actions = self.get_actions()
        if action_name not in actions:
            logging.error(f"Action {action_name} not found in plugin {self.name}")
            return False
            
        if not self.validate_parameters(action_name, parameters):
            logging.error(f"Invalid parameters for action {action_name}")
            return False
            
        try:
            actions[action_name](**parameters)
            return True
        except Exception as e:
            logging.error(f"Error executing action {action_name}: {e}")
            return False
    
    def log_info(self, message: str):
        """Log info message with plugin name"""
        logging.info(f"[{self.name}] {message}")
        
    def log_error(self, message: str):
        """Log error message with plugin name"""
        logging.error(f"[{self.name}] {message}")
        
    def log_warning(self, message: str):
        """Log warning message with plugin name"""
        logging.warning(f"[{self.name}] {message}")

class PluginManager:
    """Manages plugin lifecycle and execution"""
    
    def __init__(self):
        self.plugins: Dict[str, BasePlugin] = {}
        self.enabled_plugins: Dict[str, bool] = {}
        
    def register_plugin(self, plugin: BasePlugin):
        """Register a plugin"""
        self.plugins[plugin.name] = plugin
        self.enabled_plugins[plugin.name] = True
        logging.info(f"Registered plugin: {plugin.name}")
        
    def unregister_plugin(self, plugin_name: str):
        """Unregister a plugin"""
        if plugin_name in self.plugins:
            del self.plugins[plugin_name]
            del self.enabled_plugins[plugin_name]
            logging.info(f"Unregistered plugin: {plugin_name}")
            
    def get_plugin(self, plugin_name: str) -> BasePlugin:
        """Get a plugin by name"""
        return self.plugins.get(plugin_name)
        
    def get_enabled_plugins(self) -> Dict[str, BasePlugin]:
        """Get all enabled plugins"""
        return {name: plugin for name, plugin in self.plugins.items() 
                if self.enabled_plugins.get(name, False)}
        
    def enable_plugin(self, plugin_name: str):
        """Enable a plugin"""
        if plugin_name in self.plugins:
            self.enabled_plugins[plugin_name] = True
            logging.info(f"Enabled plugin: {plugin_name}")
            
    def disable_plugin(self, plugin_name: str):
        """Disable a plugin"""
        if plugin_name in self.plugins:
            self.enabled_plugins[plugin_name] = False
            logging.info(f"Disabled plugin: {plugin_name}")
            
    def execute_action(self, plugin_name: str, action_name: str, parameters: Dict[str, Any] = None) -> bool:
        """Execute an action from a plugin"""
        if plugin_name not in self.plugins:
            logging.error(f"Plugin {plugin_name} not found")
            return False
            
        if not self.enabled_plugins.get(plugin_name, False):
            logging.error(f"Plugin {plugin_name} is disabled")
            return False
            
        plugin = self.plugins[plugin_name]
        return plugin.execute_action(action_name, parameters)
        
    def get_all_actions(self) -> Dict[str, Dict[str, Callable]]:
        """Get all actions from all enabled plugins"""
        all_actions = {}
        for plugin_name, plugin in self.get_enabled_plugins().items():
            all_actions[plugin_name] = plugin.get_actions()
        return all_actions
        
    def get_plugin_info(self, plugin_name: str) -> Dict[str, Any]:
        """Get plugin information"""
        plugin = self.get_plugin(plugin_name)
        if plugin:
            return plugin.get_info()
        return {}
        
    def get_all_plugins_info(self) -> Dict[str, Dict[str, Any]]:
        """Get information for all plugins"""
        return {name: plugin.get_info() for name, plugin in self.plugins.items()}

class ActionDecorator:
    """Decorator for plugin actions"""
    
    def __init__(self, name: str = None, description: str = None, parameters: Dict[str, Any] = None):
        self.name = name
        self.description = description
        self.parameters = parameters or {}
        
    def __call__(self, func):
        func._action_name = self.name or func.__name__
        func._action_description = self.description or func.__doc__
        func._action_parameters = self.parameters
        return func

def action(name: str = None, description: str = None, parameters: Dict[str, Any] = None):
    """Decorator for marking methods as plugin actions"""
    return ActionDecorator(name, description, parameters)

class PluginConfig:
    """Configuration management for plugins"""
    
    def __init__(self, plugin_name: str):
        self.plugin_name = plugin_name
        self.config_file = f"plugins/config/{plugin_name}.json"
        self.config = self.load_config()
        
    def load_config(self) -> Dict[str, Any]:
        """Load plugin configuration"""
        try:
            import json
            from pathlib import Path
            
            config_path = Path(self.config_file)
            if config_path.exists():
                with open(config_path, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logging.error(f"Failed to load config for {self.plugin_name}: {e}")
            
        return {}
        
    def save_config(self):
        """Save plugin configuration"""
        try:
            import json
            from pathlib import Path
            
            config_path = Path(self.config_file)
            config_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(config_path, 'w') as f:
                json.dump(self.config, f, indent=2)
        except Exception as e:
            logging.error(f"Failed to save config for {self.plugin_name}: {e}")
            
    def get(self, key: str, default=None):
        """Get configuration value"""
        return self.config.get(key, default)
        
    def set(self, key: str, value: Any):
        """Set configuration value"""
        self.config[key] = value
        self.save_config()
        
    def update(self, updates: Dict[str, Any]):
        """Update multiple configuration values"""
        self.config.update(updates)
        self.save_config()

class PluginException(Exception):
    """Base exception for plugin errors"""
    pass

class PluginNotFoundError(PluginException):
    """Exception for plugin not found"""
    pass

class ActionNotFoundError(PluginException):
    """Exception for action not found"""
    pass

class ParameterValidationError(PluginException):
    """Exception for parameter validation errors"""
    pass