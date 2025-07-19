var websocket = null;
var sddeviceIds = [];
var sddevices = {};

var conxhttp = new XMLHttpRequest();
conxhttp.timeout = 500;
conxhttp.addEventListener("load", connected);
conxhttp.addEventListener("error", connectionError);
conxhttp.addEventListener("timeout", connectionError);
var connectionLoopHandle;
var connectionActive = false;
var connectionErrorCounter = 0;
var globalSettings = {};
var pluginUUid = null;

function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo)
 {
	websocket = new WebSocket("ws://127.0.0.1:" + inPort);
	
	document.fonts.load('10pt "Digital"');
	document.fonts.load('10pt "Quartz"');
	
	
	websocket.onopen = function()
	{
		registerPlugin(inRegisterEvent, inPluginUUID);
		pluginUUid = inPluginUUID;
		StartLoop();
	};

	websocket.onmessage = function (inEvent)
	{ 
		var jsonObj = JSON.parse(inEvent.data);
		var event = jsonObj['event'];
		var deviceId = jsonObj['device'];
		if (deviceId){
			if (!sddeviceIds.includes(deviceId)){
				sddevices[deviceId] = new AaoDeck(deviceId, websocket);
				sddeviceIds.push(deviceId);
				sddeviceIds.sort();
				for (let sIdx = 0; sIdx < sddeviceIds.length; sIdx++){
					sddevices[sddeviceIds[sIdx]].setDeviceIndex(sIdx);
				}
			}
			var lDeck = sddevices[deviceId];
			lDeck.onMessage(inEvent);
			if(event === 'applicationDidLaunch') {
				StartLoop();
			}
			else if(event === 'applicationDidTerminate') {
				StopLoop();
			}
			else if(jsonObj['action'] === ('com.lorby-si.aao.connection') && event === 'keyUp') {
				StopLoop();
				AAOsetTimeoutESD(StartLoop, 3000);
			}
		}
	};

	websocket.onclose = function()
	{ 
		if (connectionLoopHandle) AAOclearIntervalESD(connectionLoopHandle);
	};
 };

function registerPlugin(inRegisterEvent, inPluginUUID){
	var json = {
		"event": inRegisterEvent,
		"uuid": inPluginUUID
	};

	websocket.send(JSON.stringify(json));
 };
 
function StartLoop(){
	connectionActive = false;
	connectionErrorCounter = 0;
	connectionLoopHandle = AAOsetIntervalESD(ConnectionLoop, 500);
};

function StopLoop(){
	if (connectionLoopHandle) AAOclearIntervalESD(connectionLoopHandle);
	connectionActive = false;
	for (let sIdx = 0; sIdx < sddeviceIds.length; sIdx++){
		sddevices[sddeviceIds[sIdx]].stopDataLoop();
	}
};
 
function ConnectionLoop(){
	conxhttp.open("GET", AAO_URL + "?conn=1");
	conxhttp.send();
};

function connected(){
	var check = this.responseText;
	if (check === 'OK') {
		if (!connectionActive){
			connectionActive = true;
			for (let sIdx = 0; sIdx < sddeviceIds.length; sIdx++){
				sddevices[sddeviceIds[sIdx]].startDataLoop();
			}
		}
	} else{
		connectionActive = false;
		for (let sIdx = 0; sIdx < sddeviceIds.length; sIdx++){
			sddevices[sddeviceIds[sIdx]].stopDataLoop();
		}
	}
};

function connectionError(){
	if (connectionActive){
		connectionActive = false;
	}
	for (let sIdx = 0; sIdx < sddeviceIds.length; sIdx++){
		sddevices[sddeviceIds[sIdx]].stopDataLoop();
	}
};

