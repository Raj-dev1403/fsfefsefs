// Global web socket
var websocket = null;

// Global plugin settings
var globalSettings = {};

// Global settings
var settings = {};

var initiallyCollapsed = true; // change this to false if you want to have all blocks expanded per default

var infotext = '';
var inactioninfotext = '';
var inUUIDtext = '';
var inPorttext = '';

// Adds a click event on all "collapsible" elements to let them toggle their sibling element to be visible/hidden
// Default state may be either display=none or no display attribute at all
function setUpCollapsibles() {
	// Add toggle option to collapsed elements
	var coll = document.getElementsByClassName("sdpi-collapser");
	var i;
	for (i = 0; i < coll.length; i++) {
		if (initiallyCollapsed && !coll[i].nextElementSibling.classList.contains("sdpi-collapsible-force-open")) {
			coll[i].classList.remove("active");
			coll[i].nextElementSibling.style.display = "none";
		} else {
			coll[i].classList.add("active");
			coll[i].nextElementSibling.style.display = "block";
		}			
		
		coll[i].addEventListener("click", function() {
			var content = this.nextElementSibling;
			if (content.style.display === "block") {
				this.classList.remove("active");
				content.style.display = "none";
			} else {
				this.classList.add("active");
				content.style.display = "block";
			}
		});
	}
}

// Setup the websocket and handle communication
function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    // Parse parameter from string to object
    var actionInfo = JSON.parse(inActionInfo);
    var info = JSON.parse(inInfo);
	inPorttext = inPort
	inUUIDtext = inUUID;
	inactioninfotext = inActionInfo;
	infotext = inInfo;

    var streamDeckVersion = info['application']['version'];
    var pluginVersion = info['plugin']['version'];

    // Save global settings
    settings = actionInfo['payload']['settings'];
	
    // Retrieve action identifier
    var action = actionInfo['action'];

    // Open the web socket to Stream Deck
    // Use 127.0.0.1 because Windows needs 300ms to resolve localhost
    websocket = new WebSocket('ws://127.0.0.1:' + inPort);

    // WebSocket is connected, send message
    websocket.onopen = function() {
        // Register property inspector to Stream Deck
        registerPluginOrPI(inRegisterEvent, inUUID);

        // Request the global settings of the plugin
        requestGlobalSettings(inUUID);
    };

    // Create actions
    var pi;
    
    if (action === 'com.lorby-si.aao.btn') {
        pi = new ButtonPI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.event') {
        pi = new EventPI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.toggle') {
        pi = new TogglePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.onoff') {
        pi = new OnOffPI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.dualevent') {
        pi = new DualEventPI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.gaugetext') {
        pi = new TextGaugePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.steamgauge') {
        pi = new SteamGaugePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.slidergauge') {
        pi = new SliderGaugePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.lvarimage') {
        pi = new ImagePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.multigauge') {
        pi = new MultiGaugePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.multitilegauge') {
        pi = new MultiTileGaugePI(inUUID, streamDeckVersion, pluginVersion);
    }
    else if (action === 'com.lorby-si.aao.rotary') {
        pi = new RotaryEncoderPI(inUUID, streamDeckVersion, pluginVersion);
    }
	else if (action === 'com.lorby-si.aao.rotarycanvas') {
        pi = new RotaryEncoderCanvasPI(inUUID, streamDeckVersion, pluginVersion);
    }
    websocket.onmessage = function(evt) {
        // Received message from Stream Deck
        var jsonObj = JSON.parse(evt.data);
        var event = jsonObj['event'];
        var jsonPayload = jsonObj['payload'];

        if(event === 'didReceiveGlobalSettings') {
            // Set global plugin settings
            globalSettings = jsonPayload['settings'];
        }
        else if(event === 'didReceiveSettings') {
            // Save global settings after default was set
            settings = jsonPayload['settings'];
        }
        else if(event === 'sendToPropertyInspector') {
			settings = jsonPayload;
        }
    };
}

function registerPluginOrPI(inEvent, inUUID) {
    if (websocket) {
        var json = {
            'event': inEvent,
            'uuid': inUUID
        };

        websocket.send(JSON.stringify(json));
	}
}

// Save settings
function saveSettings(inAction, inUUID, inSettings) {
    if (websocket) {
        const json = {
            'action': inAction,
            'event': 'setSettings',
            'context': inUUID,
            'payload': inSettings
         };

         websocket.send(JSON.stringify(json));
    }
}

// Save global settings
function saveGlobalSettings(inUUID) {
    if (websocket) {
        const json = {
            'event': 'setGlobalSettings',
            'context': inUUID,
            'payload': globalSettings
         };

         websocket.send(JSON.stringify(json));
    }
}

// Request global settings for the plugin
function requestGlobalSettings(inUUID) {
    if (websocket) {
        var json = {
            'event': 'getGlobalSettings',
            'context': inUUID
        };

        websocket.send(JSON.stringify(json));
    }
}



// Set data to plugin
function sendToPlugin(inAction, inContext, inData) {
    if (websocket) {
        var json = {
            'action': inAction,
            'event': 'sendToPlugin',
            'context': inContext,
            'payload': inData
        };

        websocket.send(JSON.stringify(json));
    }
}
