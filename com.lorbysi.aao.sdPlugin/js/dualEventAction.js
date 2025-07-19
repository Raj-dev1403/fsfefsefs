function DualEventAction(inContext, inSettings, coordinates) {
    // Init Action
    var instance = this;
    var coords = "99_99";
	if (coordinates) coords = coordinates.column + "_" + coordinates.row;
    // Private variable containing the context of the action
    var context = inContext;

    var settings = inSettings;

	this.getCoords = function() 
	{
		return coords;
	};
	
    // Public function returning the context
    this.getContext = function() {
        return context;
    };
    // Public function returning the settings
    this.getSettings = function() {
        return settings;
    };

    // Public function for settings the settings
    this.setSettings = function(inSettings) {
        settings = inSettings;
    };
	
	this.getSimVars = function(){
		var allVars = [];
		if (settings["simvar"] && settings["simvar"].length > 0){
			allVars.push(settings["simvar"]);
		}
		if (settings["altsimvar"] && settings["altsimvar"].length > 0){
			allVars.push(settings["altsimvar"]);
		}
		if (settings["alttwosimvar"] && settings["alttwosimvar"].length > 0){
			allVars.push(settings["alttwosimvar"]);
		}
		return allVars;
	};
	
    var updateFlip = 0;
    var autoscriptArmed = true;
	this.onUpdate = function(){
        if (settings["updateFast"] && settings["updateFast"] === '2'){
            autoscriptArmed = false;
        } else{
            autoscriptArmed = true;
        }
        if (autoscriptArmed){
            if ((updateFlip > 4 || (settings["updateFast"] && settings["updateFast"] !== '0')) && settings["updateAction"] && settings["updateAction"].length > 0){
                updateFlip = 0;
                var lRequestObj = {};
                if (settings["updateType"] && settings["updateType"] === 'S:'){
                    lRequestObj = {"scripts":[{"code":""}]};
                    lRequestObj.scripts[0].code = settings["updateAction"];
                } else{
                    lRequestObj = {"triggers":[{"evt":"","value":1.0}]};
                    lRequestObj.triggers[0].evt = '(>K:' + settings["updateAction"] + ')';
                    lRequestObj.triggers[0].value = 1;
                }
                var xhttp = new XMLHttpRequest();
                xhttp.open("POST", AAO_URL, true);
                xhttp.send(JSON.stringify(lRequestObj));
            }
            updateFlip++;
        }
	}

    this.onKeyDown = function(inContext, inSettings, inCoordinates, inUserDesiredState, inState) {
        var xhttp = new XMLHttpRequest();
		var requestObj = {};
		if (inState == 1){
			var evt = settings["offsimevt"];
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					evt = evt.substr(4, evt.length - 5);
					requestObj.scripts[0].code = evt;
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
					requestObj.triggers[0].value = settings["offevtval"];
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = settings["offevtval"];
				}
			}
		}
		else
		{
			var evt = settings["onsimevt"];
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					evt = evt.substr(4, evt.length - 5);
					requestObj.scripts[0].code = evt;
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
					requestObj.triggers[0].value = settings["onevtval"];
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = settings["onevtval"];
				}
			}
		}
        xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
        xhttp.send();
    };
	
	this.onKeyUp = function(inContext, inSettings, inCoordinates, inUserDesiredState, inState) {
		settings.lastValue = -9999;
    };
	
	this.onLongClick = function() {
		var evt = settings["longsimevt"];
		if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					evt = evt.substr(4, evt.length - 5);
					requestObj.scripts[0].code = evt;
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
	};
	
	this.onLongClickUp = function() {
		var evt = settings["longupsimevt"];
		if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					evt = evt.substr(4, evt.length - 5);
					requestObj.scripts[0].code = evt;
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
	};
	
	var titleString = "";
	
	this.getTitle = function() 
	{
		return titleString;
	};
	
	this.setTitle = function(inTitleStr) 
	{
		titleString = inTitleStr;
	};
	
		
	this.md5 = function(inState) 
	{
		let retStr = "";
		if (settings["profileID"]) retStr += settings["profileID"];
		retStr += coords;
		retStr += inState;
		return md5(retStr);
	};
		
	this.profileID = function(){
		return settings["profileID"];
	};
	
	this.keyDownScript = function() {
        var retStr = '';
		if (settings["onsimevt"]){
			var evt = settings["onsimevt"];
			if (evt.includes('(>S:')){
				retStr = evt.substr(4, evt.length - 5);
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					retStr = '1 ' + evt;
				} else {
					retStr = settings["onevtval"] + ' ' + evt;
				}
			}
		}
        return retStr;
    };
	
	this.updateKeyDownScript = function(inState){
		var retStr = '';
		if (settings["onsimevt"]){
			if (inState == 1){
				var evt = settings["offsimevt"];
				if (evt.includes('(>S:')){
					retStr = evt.substr(4, evt.length - 5);
				} else {
					retStr = settings["offevtval"] + ' ' + evt;
				}
			}
			else
			{
				var evt = settings["onsimevt"];
				if (evt.includes('(>S:')){
					retStr = evt.substr(4, evt.length - 5);
				} else {
					retStr = settings["onevtval"] + ' ' + evt;
				}
			}
		}
		return retStr;
	};
}
