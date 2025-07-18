# Enhanced Property Inspector

## Overview

The Property Inspector has been completely redesigned and enhanced with comprehensive widget support, proper state management, and a modern UI that matches the StreamDeck SDK standards.

## Key Features

### 🎯 **Proper State Management**
- **No more "sticking" to previous button configs** - Each button maintains its own independent configuration
- **Dynamic updates** - Property Inspector automatically refreshes when switching between buttons
- **Real-time synchronization** - Changes are immediately reflected in the button preview

### 🎨 **Enhanced UI Design**
- **Button Preview** - Live preview of the selected button with current icon/text
- **Modern Dark Theme** - Consistent with the overall application design
- **Responsive Layout** - Adapts to different screen sizes and content
- **Scrollable Content** - Handles large numbers of configuration fields

### 🔧 **Comprehensive Widget Support**

#### Text Input Widgets
- **Text Field** - Single-line text input with placeholder support
- **Textarea** - Multi-line text input for descriptions and scripts
- **Number Field** - Numeric input with min/max validation
- **URL Field** - Specialized for web addresses with validation

#### Selection Widgets
- **Dropdown** - Predefined option selection
- **Radio Buttons** - Exclusive choice selection
- **Checkbox** - Boolean true/false selection
- **Slider** - Range selection with visual feedback

#### File/Resource Widgets
- **Icon Picker** - Image file selection with preview
- **File Picker** - Application/file selection with type filtering
- **Folder Picker** - Directory selection for working paths

#### Advanced Widgets
- **Color Picker** - Color selection for UI customization
- **Progress Bar** - Visual feedback for operations
- **Tab Widget** - Organized configuration sections

## Widget Types Supported

### Basic Widgets
```json
{
  "name": "title",
  "type": "text",
  "label": "Title",
  "placeholder": "Enter button title..."
}
```

### Numeric Widgets
```json
{
  "name": "volume_level",
  "type": "slider",
  "label": "Volume Level",
  "min": 0,
  "max": 100,
  "default": 50
}
```

### Selection Widgets
```json
{
  "name": "type",
  "type": "radio",
  "label": "Type",
  "options": ["Set", "Adjust", "Mute", "Add"]
}
```

### File Widgets
```json
{
  "name": "icon",
  "type": "icon",
  "label": "Icon"
}
```

## Configuration Schema

The Property Inspector uses a JSON schema file (`inspector_schema.json`) to define which widgets appear for each plugin and action combination.

### Schema Structure
```json
{
  "_default": {
    "fields": [
      {"name": "title", "type": "text", "label": "Title"},
      {"name": "icon", "type": "icon", "label": "Icon"}
    ]
  },
  "PluginName": {
    "action_name": {
      "fields": [
        // Widget definitions here
      ]
    }
  }
}
```

### Adding New Widgets

1. **Update the schema** - Add widget definitions to `inspector_schema.json`
2. **Widget types available**:
   - `text` - Single-line text input
   - `textarea` - Multi-line text input
   - `number` - Numeric input with validation
   - `slider` - Range slider
   - `dropdown` - Option selection
   - `radio` - Radio button group
   - `checkbox` - Boolean checkbox
   - `icon` - Icon file picker
   - `file` - File picker
   - `folder` - Folder picker

3. **Widget properties**:
   - `name` - Unique identifier for the field
   - `type` - Widget type
   - `label` - Display label
   - `default` - Default value
   - `placeholder` - Placeholder text
   - `min`/`max` - For numeric widgets
   - `options` - For selection widgets

## Usage Examples

### AAO Plugin Configuration
```json
{
  "AAO": {
    "input": {
      "fields": [
        {"name": "title", "type": "text", "label": "Title"},
        {"name": "type", "type": "radio", "label": "Type", "options": ["Set", "Adjust", "Mute", "Add"]},
        {"name": "input", "type": "dropdown", "label": "Input", "options": ["SFX", "Music", "Game", "Voice", "Aux"]},
        {"name": "output", "type": "dropdown", "label": "Output", "options": ["Monitor Mix", "Stream Mix", "All", "Headphones"]},
        {"name": "volume_level", "type": "slider", "label": "Volume Level", "min": 0, "max": 100, "default": 50},
        {"name": "enabled", "type": "checkbox", "label": "Enabled", "default": true}
      ]
    }
  }
}
```

### Application Plugin Configuration
```json
{
  "Application": {
    "launch_app": {
      "fields": [
        {"name": "title", "type": "text", "label": "Title"},
        {"name": "icon", "type": "icon", "label": "Icon"},
        {"name": "path", "type": "file", "label": "Application Path", "file_types": "exe,app,sh"},
        {"name": "arguments", "type": "text", "label": "Arguments"},
        {"name": "working_directory", "type": "folder", "label": "Working Directory"},
        {"name": "run_as_admin", "type": "checkbox", "label": "Run as Administrator", "default": false}
      ]
    }
  }
}
```

## Technical Implementation

### PropertyInspectorWidget Class
- **Location**: `ui_components.py`
- **Features**:
  - Dynamic widget creation based on schema
  - Real-time field value updates
  - Automatic configuration saving
  - Button preview with live updates

### Integration with Main UI
- **Location**: `ui.py`
- **Features**:
  - Seamless integration with button grid
  - Proper state management
  - Configuration persistence
  - Event handling for field changes

### State Management
- **Button Selection**: Each button maintains independent configuration
- **Field Updates**: Real-time synchronization between UI and data
- **Configuration Persistence**: Automatic saving to config manager
- **Preview Updates**: Live button preview reflects current settings

## Benefits

### For Users
- **Intuitive Interface** - Easy to understand and use
- **Visual Feedback** - See changes immediately
- **No Data Loss** - Automatic saving prevents configuration loss
- **Consistent Experience** - Same interface for all plugins

### For Developers
- **Extensible** - Easy to add new widget types
- **Maintainable** - Clean separation of concerns
- **Schema-Driven** - Configuration through JSON files
- **Reusable** - Widget system can be used elsewhere

## Future Enhancements

### Planned Features
- **Widget Validation** - Input validation with error messages
- **Custom Widgets** - Plugin-specific custom widgets
- **Widget Groups** - Organized configuration sections
- **Search/Filter** - Find specific configuration options
- **Import/Export** - Configuration backup and sharing

### Widget Types to Add
- **Color Picker** - For UI customization
- **Date/Time Picker** - For scheduling features
- **Multi-Select** - Multiple option selection
- **Rich Text Editor** - Formatted text input
- **JSON Editor** - Structured data input

## Troubleshooting

### Common Issues

1. **Widgets not appearing**
   - Check schema file syntax
   - Verify plugin/action names match
   - Ensure field definitions are correct

2. **Changes not saving**
   - Check config manager permissions
   - Verify file paths are writable
   - Check for error messages in logs

3. **Preview not updating**
   - Ensure button has proper update_config method
   - Check icon file paths exist
   - Verify signal connections

### Debug Mode
Enable debug logging to see detailed information about widget creation and field updates.

## Conclusion

The enhanced Property Inspector provides a professional, user-friendly interface for configuring Stream Deck buttons. With comprehensive widget support, proper state management, and a modern design, it offers an excellent user experience while maintaining extensibility for future enhancements. 