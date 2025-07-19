function SliderGaugeAction(inContext, inSettings, coordinates, canvs) {
    // Init Action
    var instance = this;
    var cnv = canvs;
	var coords = "99_99";
	if (coordinates) coords = coordinates.column + "_" + coordinates.row;

    // Private variable containing the context of the action
    var context = inContext;
    var settings = inSettings;
    
    var pimode = false;

	settings["lastValue"] = -9999;
	settings["lastAltValue"] = -9999;

	var backImage = new Image();
	var slideImage = new Image();
	var maskImage = new Image();
    var imagesLoaded = false;
    loadImages();
    
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
        loadImages();
        lastDrawnPos = null;
        lastDrawnOutStr = null;
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
    
    function loadImage(img) {
        return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    }
    
    function loadImages() {
        imagesLoaded = false;

        let promises = [];
        promises.push(loadImage(backImage));
        promises.push(loadImage(slideImage));
        promises.push(loadImage(maskImage));
        Promise.all(promises).then(() => imagesLoaded = true);
        
        backImage.src = (settings["backimg"] && settings["backimg"].length > 0) ? settings["backimg"] : '';
        slideImage.src = (settings["slideimg"] && settings["slideimg"].length > 0) ? settings["slideimg"] : '';
        maskImage.src = (settings["maskimg"] && settings["maskimg"].length > 0) ? settings["maskimg"] : '';
    }

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
		if (settings["simevt"]){
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			var evt = settings["simevt"];
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
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
    };

    this.onKeyUp = function(inContext, inSettings, inCoordinates, inUserDesiredState, inState) {
		var evt = settings["upsimevt"];
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
					requestObj.triggers[0].value = settings["upevtval"];
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = settings["upevtval"];
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
    };
	
    var lastDrawnPos = null;
    var lastDrawnOutStr = null;
    
    function posChanged(oldValue, newValue) {
        if (oldValue === newValue) {
            return false;
        }
        if (oldValue === null || newValue === null) {
            return true;
        }
        return (Math.abs(oldValue[0] - newValue[0]) >= 1) || (Math.abs(oldValue[1] - newValue[1]) >= 1);
    }
    
    this.drawButton = function() {
        if (!imagesLoaded) {
            lastDrawnPos = null;
            lastDrawnOutStr = null;
            return false;
        }
		var simVal = settings["lastValue"];
		var altVal = settings["lastAltValue"];
		var altOffset = settings["altoffset"] != null ? parseFloat(settings["altoffset"]) : 0;
		var altVarPad = settings["altvarpad"];
        var pos = (settings["slideimg"] && settings["slideimg"].length > 0) ? [((simVal * settings["xmultiplier"]) - settings["xslideoffset"]), ((simVal * settings["ymultiplier"]) - settings["yslideoffset"])] : null;
		var outStr = null;
		if (settings["altsimvar"]){ 
			if (settings["altsimvar"].includes(", String") || settings["altsimvar"].includes("%!") || settings["altsimvar"].includes("'") || settings["altsimvar"].includes("(STRARR")){
				outStr = '' + altVal;
			} else{
				outStr = '' + ((altVal + altOffset) * settings["altmultiplier"]).toFixed(settings["altfractions"]).padStart(altVarPad, '0');
			}
		}
		
        if (!pimode && outStr === lastDrawnOutStr && !posChanged(lastDrawnPos, pos)) {
            return false;
        }
		var ctx = cnv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		ctx.fillStyle = settings["backcolor"];
		ctx.fillRect(0, 0, cnv.width, cnv.height);
		
		if (settings["backimg"] && settings["backimg"].length > 0){
			ctx.save();
			ctx.drawImage(backImage, 0, 0, 144, 144);
			ctx.restore();
		}
		if (pos !== null){
			ctx.save();
			ctx.drawImage(slideImage, pos[0], pos[1]);
			ctx.restore();
		}
		if (settings["maskimg"] && settings["maskimg"].length > 0){
			ctx.save();
			ctx.drawImage(maskImage, 0, 0, 144, 144);
			ctx.restore();
		}
		if (settings["altsimvar"]){
			ctx.save();
			var tform = "";
			if (settings["fontbold"] == 1)
				tform = "bold ";
			if (settings["fontitalic"] == 1)
				tform += "italic ";
			ctx.font = tform + settings["fontsize"] + 'px ' + settings["font"];
			ctx.fillStyle = settings["color"];
			var widthPx = ctx.measureText(outStr).width;
			if (widthPx > 144){
				var factor = settings["fontsize"] * 144 / widthPx;
				ctx.font = tform + Math.floor(factor) + 'px ' + settings["font"];
			}
			widthPx = ctx.measureText(outStr).width;
			var xLoc = 72 - (widthPx / 2) + parseInt(settings["altxshift"]) ;
			var yLoc = settings["altyshift"] ;
			ctx.fillText(outStr, xLoc, yLoc);
			ctx.restore();
		}
        lastDrawnPos = pos;
        lastDrawnOutStr = outStr;
        return true;
    };

	this.getImageData = function() 
	{
		return cnv.toDataURL();
	}
	
	this.getCoords = function() 
	{
		return coords;
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
	
		
	this.profileID = function(){
		return settings["profileID"];
	};
	
	this.keyDownScript = function() {
        var retStr = '';
		if (settings["simevt"]){
			var evt = settings["simevt"];
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
    
    this.setPiMode = function(pimodeon) 
	{
		pimode = pimodeon;
	};
	
}
