function PI(inContext, inStreamDeckVersion, inPluginVersion) {
    // Init PI
    var instance = this;

    // Private function to return the action identifier
    function getAction() {
        var action

        // Find out type of action
        if (instance instanceof ButtonPI) {
            action = 'ccom.lorby-si.aao.btn';
        }
        else if (instance instanceof EventPI) {
            action = 'com.lorby-si.aao.event';
        }
        else if (instance instanceof OnOffPI) {
            action = 'com.lorby-si.aao.onoff';
        }
        else if (instance instanceof TogglePI) {
            action = 'com.lorby-si.aao.toggle';
        }
        else if (instance instanceof ImagePI) {
            action = 'com.lorby-si.aao.lvarimage';
        }
        else if (instance instanceof DualEventPI) {
            action = 'com.lorby-si.aao.dualevent';
        }        
		else if (instance instanceof TextGaugePI) {
            action = 'com.lorby-si.aao.gaugetext';
        }
		else if (instance instanceof SteamGaugePI) {
            action = 'com.lorby-si.aao.steamgauge';
        }
		else if (instance instanceof SliderGaugePI) {
            action = 'com.lorby-si.aao.slidergauge';
        }
		else if (instance instanceof MultiGaugePI) {
            action = 'com.lorby-si.aao.multigauge';
        }
		else if (instance instanceof RotaryEncoderPI) {
            action = 'com.lorby-si.aao.rotary';
        }
		else if (instance instanceof RotaryEncoderCanvasPI) {
            action = 'com.lorby-si.aao.rotarycanvas';
        }
        return action;
    }

    // Public function to save the settings
    this.saveSettings = function() {
        saveSettings(getAction(), inContext, settings);
    }

    // Public function to send data to the plugin
    this.sendToPlugin = function(inData) {
        sendToPlugin(getAction(), inContext, inData);
    }
}
