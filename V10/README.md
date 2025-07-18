# Nextion Stream Deck Controller

A modern, Stream Deck-like application for Nextion 5" displays with PyQt6. This application provides a comprehensive plugin system for controlling your computer with custom button actions.

## Features

- 🎛️ **Stream Deck-like Interface**: Modern PyQt6 UI with button grid layout
- 🔌 **Plugin System**: Extensible architecture with built-in and custom plugins
- 📱 **Nextion Integration**: Serial communication with Nextion displays
- 🎨 **Modern UI**: Dark theme with hover effects and animations
- 📊 **Real-time Monitoring**: Connection status and button press feedback
- 💾 **Configuration Management**: Save/load button configurations
- 🔧 **Easy Plugin Creation**: Built-in plugin creator with templates

## Built-in Plugins

### System Plugin
- Shutdown, restart, lock screen
- Sleep, logout, run commands
- Task manager, process control
- Recycle bin management

### Application Plugin
- Launch applications and files
- Open folders and URLs
- Window management (minimize, maximize, switch)
- Built-in shortcuts (calculator, notepad, browser)

### Multimedia Plugin
- Media playback control (play, pause, stop, next, previous)
- Volume control (up, down, mute, set level)
- Advanced controls (shuffle, repeat, seek)
- Cross-platform media key support

### Website Plugin
- Open any URL in browser
- Quick access to popular sites (Google, YouTube, GitHub, etc.)
- Search functionality
- Webhook support for automation

### Volume Plugin
- Advanced system volume control
- Per-application volume control (Linux)
- Input/microphone volume control
- Audio device switching
- Fade effects and smooth transitions

## Installation

1. **Install Python 3.8+**
   ```bash
   python --version  # Should be 3.8 or higher
   ```

2. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd nextion-stream-deck
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

## Nextion Setup

### Hardware Connection
1. Connect your Nextion 5" display to your computer via USB-to-Serial adapter
2. Note the COM port (Windows) or device path (Linux/macOS)

### Nextion Display Programming
1. Create your UI layout in Nextion Editor
2. For each button, add code to send the button press data:
   ```c
   // In button's Touch Release Event
   // Send page ID (0-255) and button ID (0-255)
   printh 00 01  // Page 0, Button 1
   ```

### Serial Communication Protocol
The application expects 2 bytes per button press:
- **Byte 1**: Page ID (0-255)
- **Byte 2**: Button ID (0-255)

Example: `00 01` means Page 0, Button 1 was pressed.

## Usage

### Basic Setup
1. **Launch the application**
2. **Configure serial connection** in Settings tab
3. **Create button mappings** by clicking Stream Deck buttons
4. **Test with your Nextion display**

### Button Configuration
1. Click any button in the Stream Deck grid
2. Click "Configure Button" 
3. Choose plugin and action
4. Set parameters as needed
5. Save configuration

### Creating Custom Plugins

#### Method 1: Built-in Plugin Creator
1. Go to Tools → Plugin Manager
2. Click "Create Plugin"
3. Choose template and fill details
4. Generate and save plugin
5. Install the plugin file

#### Method 2: Manual Plugin Creation
Create a new Python file in `plugins/custom/`:

```python
from plugins.base_plugin import BasePlugin, action

class MyCustomPlugin(BasePlugin):
    def __init__(self):
        super().__init__()
        self.name = "My Plugin"
        self.description = "Custom plugin description"
        self.version = "1.0.0"
        
    def get_actions(self):
        return {
            "my_action": self.my_action
        }
    
    def get_parameters(self):
        return {
            "message": {
                "type": "string",
                "default": "Hello World!",
                "description": "Message to display"
            }
        }
    
    @action(name="my_action", description="My custom action")
    def my_action(self, message="Hello!", **kwargs):
        self.log_info(f"Custom action executed: {message}")
```

### Plugin Templates
The application includes several plugin templates:
- **Basic Action Plugin**: Simple action template
- **System Control Plugin**: System operations
- **Application Launcher Plugin**: Launch apps and files
- **Custom API Plugin**: Web API interactions
- **File Operation Plugin**: File/folder operations

## Configuration

### Application Settings
- **Serial Port**: COM port for Nextion display
- **Baud Rate**: Serial communication speed (default: 9600)
- **Auto-detect**: Automatically find Nextion display
- **Theme**: Dark/Light theme selection
- **System Tray**: Minimize to system tray

### Button Mappings
Button configurations are stored in `config.json`:
```json
{
  "button_mappings": {
    "0_0": {
      "title": "Open Calculator",
      "plugin": "Application", 
      "action": "open_calculator",
      "parameters": {},
      "icon": "path/to/icon.png"
    }
  }
}
```

## File Structure

```
nextion-stream-deck/
├── main.py                 # Main application entry point
├── ui.py                   # PyQt6 user interface
├── config.json             # Configuration file
├── requirements.txt        # Python dependencies
├── plugins/
│   ├── base_plugin.py      # Base plugin class
│   ├── system_plugin.py    # System control plugin
│   ├── application_plugin.py # Application launcher
│   ├── multimedia_plugin.py # Media control
│   ├── website_plugin.py   # Website/URL plugin
│   ├── volume_plugin.py    # Volume control
│   └── custom/             # Custom plugins directory
├── logs/                   # Application logs
└── README.md              # This file
```

## Platform Support

### Windows
- Full feature support
- PowerShell integration for advanced features
- Windows-specific system controls

### macOS
- Full feature support
- AppleScript integration
- macOS-specific system controls

### Linux
- Full feature support
- Native Linux command integration
- Advanced audio control with PulseAudio

## Troubleshooting

### Common Issues

**Serial Connection Issues**
- Check COM port in Device Manager (Windows)
- Verify baud rate matches Nextion settings
- Try different USB-to-Serial adapters
- Check cable connections

**Button Not Responding**
- Verify Nextion code sends correct byte format
- Check serial communication in logs
- Ensure button mapping is configured
- Test with manual button clicks in UI

**Plugin Not Loading**
- Check plugin file syntax
- Verify plugin inherits from BasePlugin
- Check logs for error messages
- Ensure plugin file is in correct directory

### Debug Mode
Enable debug logging by setting log level to DEBUG in main.py:
```python
logging.basicConfig(level=logging.DEBUG)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Test thoroughly
5. Submit a pull request

### Plugin Development Guidelines
- Follow the BasePlugin interface
- Add proper error handling
- Include parameter validation
- Write descriptive docstrings
- Test on multiple platforms

## License

This project is open source and available under the MIT License.

## Changelog

### Version 1.0.0
- Initial release
- Basic Stream Deck functionality
- Built-in plugin system
- Nextion display integration
- Modern PyQt6 interface
- Configuration management
- Plugin creator tool

## Roadmap

### Upcoming Features
- **Multi-page Support**: Enhanced page management
- **Icon Library**: Built-in icon collection
- **Profile Sharing**: Import/export profiles
- **Cloud Sync**: Sync configurations across devices
- **Mobile App**: Companion mobile application
- **Advanced Animations**: Button animations and transitions
- **Voice Commands**: Voice control integration
- **MIDI Support**: MIDI controller integration

### Plugin Ideas
- **OBS Studio Control**: Stream management
- **Philips Hue**: Smart lighting control
- **Spotify Integration**: Music control
- **Teams/Zoom**: Video conferencing shortcuts
- **Home Assistant**: Smart home control
- **Docker Management**: Container controls
- **Git Operations**: Version control shortcuts

## Support

For support, issues, or feature requests:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Join the community Discord (if available)
4. Email support (if available)

## Acknowledgments

- Inspired by Elgato Stream Deck
- Built with PyQt6 and Python
- Nextion display integration
- Community plugin contributions

## FAQ

**Q: Can I use this without a Nextion display?**
A: Yes! The application works standalone. You can click buttons directly in the UI for testing and configuration.

**Q: How many buttons are supported?**
A: The default layout supports 15 buttons (5x3 grid) across 8 pages, totaling 120 possible actions.

**Q: Can I create my own button layouts?**
A: Currently, the layout is fixed to 5x3. Custom layouts may be added in future versions.

**Q: What Nextion display models are supported?**
A: Any Nextion display with serial communication. The 5" model is recommended for optimal button size.

**Q: Can I use this for commercial purposes?**
A: Yes, under the MIT License terms. Attribution is appreciated but not required.

**Q: How do I backup my configuration?**
A: Use File → Export Configuration to save your button mappings to a JSON file.

**Q: Can plugins access the internet?**
A: Yes, plugins can make HTTP requests. The Website plugin demonstrates this functionality.

**Q: Is there a plugin marketplace?**
A: Not yet, but it's planned for future versions. Currently, plugins are shared as Python files.

**Q: How do I report bugs?**
A: Create an issue in the repository with steps to reproduce, your OS, and log files.

**Q: Can I contribute translations?**
A: Translation support is planned for future versions. Currently, the interface is English-only.

---

**Made with ❤️ for the maker community**