# MobiFlightMSFS Plugin

This plugin provides integration between the Stream Deck application and Microsoft Flight Simulator 2020/2024 using the MobiFlight connector.

## Features

### Basic Actions
- **Input**: Send events to MSFS
- **Output**: Read variables from MSFS
- **SendEvent**: Send a specific event to MSFS
- **SetVariable**: Set a variable in MSFS
- **GetVariable**: Get a variable value from MSFS

### Advanced Actions
- **LightsControl**: Control aircraft lights (NAV, BEACON, STROBE, LANDING, TAXI)
- **CockpitView**: Change cockpit view (COCKPIT, VIRTUAL, EXTERNAL)
- **WeatherDisplay**: Display weather information
- **YawDamper**: Control yaw damper
- **PitotHeat**: Control pitot heat
- **BaroSetting**: Set barometric pressure
- **ATCControl**: Control ATC window
- **Flashlight**: Toggle flashlight

### Custom Scripts
- **ExecuteScript**: Execute a saved custom script
- **AddScript**: Add a new custom script
- **RemoveScript**: Remove an existing custom script
- **ListScripts**: List all available custom scripts

## Custom Scripts

Custom scripts are stored in `msfs_config/custom_scripts.json` and can be of two types:
- **event**: Sends an event to MSFS
- **variable**: Sets or gets a variable in MSFS

Each script has a name, type, command, and description. Scripts are automatically added as actions in the plugin with the prefix "Script: ".

## Usage

1. Configure your Stream Deck buttons to use the MobiFlightMSFS plugin
2. Select the desired action
3. Set the required parameters
4. Test the action

## Examples

- Toggle navigation lights
- Set barometric pressure
- Change cockpit view
- Control aircraft systems

## Requirements

- Microsoft Flight Simulator 2020/2024
- SimConnect library
- Python 3.6+