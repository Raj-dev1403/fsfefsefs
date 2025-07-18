"""
Nextion Button Manager
Handles mapping between Nextion button IDs and configured actions
"""

import json
import logging
from typing import Dict, Any, Optional, Callable
from dataclasses import dataclass

@dataclass
class NextionButtonMapping:
    """Represents a mapping between Nextion button and configured action"""
    page_id: str
    button_id: str
    plugin: str
    action: str
    config: Dict[str, Any]
    callback: Optional[Callable] = None

class NextionButtonManager:
    """Manages Nextion button mappings and handles button press events"""
    
    def __init__(self):
        self.button_mappings: Dict[str, NextionButtonMapping] = {}
        self.plugin_manager = None
        self.logger = logging.getLogger(__name__)
        
    def set_plugin_manager(self, plugin_manager):
        """Set the plugin manager for executing actions"""
        self.plugin_manager = plugin_manager
        
    def add_button_mapping(self, page_id: str, button_id: str, plugin: str, action: str, config: Dict[str, Any]):
        """Add a mapping between Nextion button and action"""
        mapping_key = f"{page_id}_{button_id}"
        
        mapping = NextionButtonMapping(
            page_id=page_id,
            button_id=button_id,
            plugin=plugin,
            action=action,
            config=config
        )
        
        self.button_mappings[mapping_key] = mapping
        self.logger.info(f"Added Nextion button mapping: {mapping_key} -> {plugin}.{action}")
        
    def remove_button_mapping(self, page_id: str, button_id: str):
        """Remove a button mapping"""
        mapping_key = f"{page_id}_{button_id}"
        if mapping_key in self.button_mappings:
            del self.button_mappings[mapping_key]
            self.logger.info(f"Removed Nextion button mapping: {mapping_key}")
            
    def get_button_mapping(self, page_id: str, button_id: str) -> Optional[NextionButtonMapping]:
        """Get button mapping for given page and button IDs"""
        mapping_key = f"{page_id}_{button_id}"
        return self.button_mappings.get(mapping_key)
        
    def handle_nextion_button_press(self, page_id: str, button_id: str):
        """Handle button press from Nextion display"""
        mapping = self.get_button_mapping(page_id, button_id)
        
        if mapping:
            self.logger.info(f"Nextion button pressed: {page_id}_{button_id} -> {mapping.plugin}.{mapping.action}")
            
            # Execute the action if plugin manager is available
            if self.plugin_manager:
                try:
                    plugin = self.plugin_manager.get_plugin(mapping.plugin)
                    if plugin:
                        actions = plugin.get_actions()
                        if mapping.action in actions:
                            # Execute the action with the stored configuration
                            actions[mapping.action](**mapping.config)
                            self.logger.info(f"Successfully executed {mapping.plugin}.{mapping.action}")
                        else:
                            self.logger.error(f"Action {mapping.action} not found in plugin {mapping.plugin}")
                    else:
                        self.logger.error(f"Plugin {mapping.plugin} not found")
                except Exception as e:
                    self.logger.error(f"Error executing action {mapping.plugin}.{mapping.action}: {e}")
        else:
            self.logger.warning(f"No mapping found for Nextion button: {page_id}_{button_id}")
            
    def load_mappings_from_config(self, config_manager):
        """Load button mappings from configuration manager"""
        if not hasattr(config_manager, 'config'):
            return
            
        button_configs = config_manager.config.get('button_configs', {})
        
        for key, config in button_configs.items():
            # Extract page_id and button_id from key (format: "row_col")
            try:
                row, col = key.split('_')
                # Convert grid position to Nextion IDs
                nextion_page_id = config.get('nextion_page_id', '00')
                nextion_button_id = config.get('nextion_button_id', '01')
                
                plugin = config.get('plugin')
                action = config.get('action')
                
                if plugin and action:
                    self.add_button_mapping(
                        page_id=nextion_page_id,
                        button_id=nextion_button_id,
                        plugin=plugin,
                        action=action,
                        config=config
                    )
            except Exception as e:
                self.logger.error(f"Error loading mapping for key {key}: {e}")
                
    def save_mappings_to_config(self, config_manager):
        """Save current mappings to configuration manager"""
        if not hasattr(config_manager, 'config'):
            return
            
        # Update button configs with current mappings
        button_configs = config_manager.config.get('button_configs', {})
        
        for mapping in self.button_mappings.values():
            # Find the corresponding grid button config
            for key, config in button_configs.items():
                if (config.get('nextion_page_id') == mapping.page_id and 
                    config.get('nextion_button_id') == mapping.button_id):
                    # Update the config with current mapping
                    config.update({
                        'plugin': mapping.plugin,
                        'action': mapping.action,
                        'nextion_page_id': mapping.page_id,
                        'nextion_button_id': mapping.button_id
                    })
                    config.update(mapping.config)
                    break
                    
        config_manager.save_config()
        
    def get_all_mappings(self) -> Dict[str, NextionButtonMapping]:
        """Get all current button mappings"""
        return self.button_mappings.copy()
        
    def clear_all_mappings(self):
        """Clear all button mappings"""
        self.button_mappings.clear()
        self.logger.info("Cleared all Nextion button mappings")
        
    def get_mappings_for_page(self, page_id: str) -> Dict[str, NextionButtonMapping]:
        """Get all mappings for a specific page"""
        return {key: mapping for key, mapping in self.button_mappings.items() 
                if mapping.page_id == page_id}
                
    def validate_nextion_id(self, page_id: str, button_id: str) -> bool:
        """Validate Nextion page and button IDs"""
        try:
            # Check if IDs are valid hex strings (00-FF)
            int(page_id, 16)
            int(button_id, 16)
            return True
        except ValueError:
            return False
            
    def format_nextion_id(self, page_id: str, button_id: str) -> str:
        """Format Nextion IDs to ensure proper format (00-FF)"""
        try:
            page_hex = format(int(page_id), '02x').upper()
            button_hex = format(int(button_id), '02x').upper()
            return f"{page_hex} {button_hex}"
        except ValueError:
            return f"{page_id} {button_id}"
            
    def parse_nextion_data(self, data: bytes) -> tuple:
        """Parse Nextion serial data to extract page and button IDs"""
        if len(data) >= 2:
            page_id = format(data[0], '02x').upper()
            button_id = format(data[1], '02x').upper()
            return page_id, button_id
        return None, None 