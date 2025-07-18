# Nextion Integration Guide

## Overview

The Stream Deck application now includes comprehensive Nextion display integration, allowing you to map physical buttons on your Nextion display to specific actions in the application. This enables a seamless workflow where you can configure actions in the UI and trigger them directly from your Nextion display.

## Key Features

### 🎯 **Nextion Button Mapping**
- **Custom Button IDs**: Assign any Nextion button ID to any grid button
- **Page Support**: Support for multiple Nextion pages (00, 01, 02, etc.)
- **Real-time Updates**: Changes in Property Inspector immediately update Nextion mappings
- **Persistent Storage**: Mappings are saved and restored automatically

### 🔧 **Property Inspector Integration**
- **Nextion Page ID Field**: Set the Nextion page ID (00-FF)
- **Nextion Button ID Field**: Set the Nextion button ID (00-FF)
- **Automatic Validation**: Ensures proper hex format for IDs
- **Default Values**: Pre-filled with sensible defaults (00 for page, 01 for button)

### 📡 **Serial Communication**
- **Button Press Detection**: Automatically detects button presses from Nextion
- **Action Execution**: Triggers configured actions when Nextion buttons are pressed
- **Error Handling**: Graceful handling of communication errors
- **Logging**: Comprehensive logging for debugging

## Configuration

### Setting Up Nextion Button IDs

1. **Select a Button**: Click on any button in the Stream Deck grid
2. **Configure Action**: Assign a plugin and action (e.g., AAO: input)
3. **Set Nextion IDs**: In the Property Inspector, set:
   - **Nextion Page ID**: The page number on your Nextion display (e.g., "00" for page 0)
   - **Nextion Button ID**: The button number on that page (e.g., "01" for button 1)
4. **Save Configuration**: Click "Save" to apply the mapping

### Example Configuration

```json
{
  "title": "AAO Input Control",
  "plugin": "AAO",
  "action": "input",
  "type": "Set",
  "input": "SFX",
  "output": "Monitor Mix",
  "volume_level": 75,
  "nextion_page_id": "00",
  "nextion_button_id": "01",
  "enabled": true
}
```

This configuration maps:
- **Grid Button**: Row 3, Column 3 (your example)
- **Nextion Button**: Page 00, Button 01
- **Action**: AAO input control for SFX to Monitor Mix at 75% volume

## Nextion Display Setup

### Button Programming

In your Nextion Editor, program each button to send the correct data:

```c
// In button's Touch Release Event
// Send page ID and button ID as hex values
printh 00 01  // Page 00, Button 01
```

### Page Structure

- **Page 00**: Main controls (00-FF buttons)
- **Page 01**: Secondary controls (00-FF buttons)
- **Page 02**: Advanced controls (00-FF buttons)
- And so on...

### Button ID Format

- **Hex Format**: Use hex values (00-FF) for button IDs
- **Range**: 00 to FF (0 to 255) for both page and button IDs
- **Example**: 
  - Page 0, Button 1 = `00 01`
  - Page 1, Button 15 = `01 0F`
  - Page 2, Button 255 = `02 FF`

## Usage Examples

### Example 1: AAO Input Control

1. **Grid Setup**: Configure button in row 3, column 3
2. **Action**: AAO plugin, input action
3. **Nextion Mapping**: Page 00, Button 01
4. **Result**: Pressing button 01 on page 00 of Nextion triggers AAO input control

### Example 2: Application Launcher

1. **Grid Setup**: Configure button for launching an application
2. **Action**: Application plugin, launch_app action
3. **Nextion Mapping**: Page 00, Button 02
4. **Result**: Pressing button 02 on page 00 launches the configured application

### Example 3: System Control

1. **Grid Setup**: Configure button for system shutdown
2. **Action**: System plugin, shutdown action
3. **Nextion Mapping**: Page 01, Button 00
4. **Result**: Pressing button 00 on page 01 initiates system shutdown

## Technical Implementation

### NextionButtonManager Class

The `NextionButtonManager` class handles all Nextion-related functionality:

```python
# Initialize the manager
nextion_manager = NextionButtonManager()

# Add a button mapping
nextion_manager.add_button_mapping(
    page_id="00",
    button_id="01", 
    plugin="AAO",
    action="input",
    config={"volume_level": 75, "input": "SFX"}
)

# Handle button press
nextion_manager.handle_nextion_button_press("00", "01")
```

### Property Inspector Integration

The Property Inspector automatically includes Nextion ID fields for all plugins:

- **Nextion Page ID**: Text field with placeholder "00"
- **Nextion Button ID**: Text field with placeholder "01"
- **Validation**: Ensures proper hex format
- **Auto-save**: Updates mappings when values change

### Serial Communication Protocol

The application expects 2 bytes per button press:
- **Byte 1**: Page ID (00-FF)
- **Byte 2**: Button ID (00-FF)

Example data flow:
1. User presses button on Nextion display
2. Nextion sends: `00 01` (Page 00, Button 01)
3. Application receives data and looks up mapping
4. Application executes: `AAO.input(volume_level=75, input="SFX")`

## Advanced Features

### Multiple Page Support

You can configure buttons across multiple Nextion pages:

```json
{
  "page_00_buttons": {
    "00_01": {"plugin": "AAO", "action": "input", "nextion_page_id": "00", "nextion_button_id": "01"},
    "00_02": {"plugin": "Application", "action": "launch_app", "nextion_page_id": "00", "nextion_button_id": "02"}
  },
  "page_01_buttons": {
    "01_00": {"plugin": "System", "action": "shutdown", "nextion_page_id": "01", "nextion_button_id": "00"},
    "01_01": {"plugin": "Multimedia", "action": "volume_control", "nextion_page_id": "01", "nextion_button_id": "01"}
  }
}
```

### Dynamic Mapping Updates

Mappings are updated in real-time:
- **Field Changes**: When you change Nextion IDs in Property Inspector
- **Action Changes**: When you change plugin or action
- **Configuration Changes**: When you modify action parameters

### Error Handling

The system includes comprehensive error handling:
- **Invalid IDs**: Graceful handling of malformed Nextion IDs
- **Missing Mappings**: Warning when no mapping exists for pressed button
- **Plugin Errors**: Error logging when action execution fails
- **Communication Errors**: Handling of serial communication issues

## Troubleshooting

### Common Issues

1. **Button not responding**
   - Check Nextion ID format (must be hex: 00-FF)
   - Verify mapping exists in Property Inspector
   - Check serial connection status

2. **Wrong action executed**
   - Verify Nextion ID mapping in Property Inspector
   - Check for duplicate button IDs
   - Ensure correct page ID is set

3. **Serial communication issues**
   - Check COM port settings
   - Verify baud rate (default: 9600)
   - Test with Nextion Editor

### Debug Information

Enable debug logging to see detailed information:
- Button press events
- Mapping lookups
- Action execution
- Error details

### Validation

The system validates:
- **Hex Format**: Page and button IDs must be valid hex (00-FF)
- **Mapping Existence**: Ensures mapping exists before execution
- **Plugin Availability**: Verifies plugin and action exist
- **Configuration Completeness**: Checks required parameters

## Best Practices

### Button ID Organization

- **Page 00**: Primary/frequently used controls
- **Page 01**: Secondary controls
- **Page 02**: Advanced/system controls
- **Consistent IDs**: Use consistent button ID patterns across pages

### Configuration Management

- **Descriptive Titles**: Use clear titles for easy identification
- **Logical Grouping**: Group related controls on same page
- **Documentation**: Keep notes of button assignments
- **Backup**: Regularly export configurations

### Performance Optimization

- **Efficient Mappings**: Use direct mappings when possible
- **Minimal Data**: Send only necessary data from Nextion
- **Error Recovery**: Implement proper error handling in Nextion code

## Conclusion

The Nextion integration provides a powerful and flexible way to control your Stream Deck application from physical buttons on your Nextion display. With proper configuration and setup, you can create a seamless workflow that combines the convenience of software configuration with the tactile feedback of physical buttons. 