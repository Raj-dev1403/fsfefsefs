function ButtonAction(inContext, inSettings, coordinates) {
    // Init Action
    var instance = this;
    var coords = "99_99";
	if (coordinates) coords = coordinates.column + "_" + coordinates.row;
    // Private variable containing the context of the action
    var context = inContext;

    var settings = inSettings;
	if (!settings["deviceid"]){
		settings["deviceid"] = 433;
		settings["channel"] = 0;
		settings["button"] = 0;
	}
    
    var requestObj = {"buttons":[{"dev":1,"chn":1,"btn":0}]};

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
        if (settings["longsimevt"]){
            var xhttp = new XMLHttpRequest();
            var requestObjLoc = {"buttons":[{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":127},{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":0}]};
            xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObjLoc)));
            xhttp.send();
            
        } else{
            var xhttp = new XMLHttpRequest();
            var requestObjLoc = {"buttons":[{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":127}]};
            xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObjLoc)));
            xhttp.send();
        }
    };
    
    this.onKeyUp = function(inContext, inSettings, inCoordinates, inUserDesiredState, inState) {
        if (settings["longsimevt"]){
        } else{
            var xhttp = new XMLHttpRequest();
            var requestObjLoc = {"buttons":[{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":0}]};
            xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObjLoc)));
            xhttp.send();
        }
    };
	
	
	this.onKeyRepeat = function() {
        var xhttp = new XMLHttpRequest();
		var requestObjLoc = {"buttons":[{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":127},{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["button"],"bval":0}]};
        xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObjLoc)));
        xhttp.send();
    };
	
	this.onLongClick = function() {
		if (settings["longsimevt"]){
            var xhttp = new XMLHttpRequest();
            var requestObjLoc = {"buttons":[{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["longsimevt"],"bval":127},{"dev":settings["deviceid"],"chn":settings["channel"],"btn":settings["longsimevt"],"bval":0}]};
            xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObjLoc)));
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
}
