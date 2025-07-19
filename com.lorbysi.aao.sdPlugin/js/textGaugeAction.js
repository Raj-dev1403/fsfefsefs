function TextGaugeAction(inContext, inSettings, coordinates, canvs) {
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
	settings["lastOnValue"] = -9999;

	var backImage = new Image();
	var onBackImage = new Image();
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
        lastDrawnOutStr = null;
        lastDrawnAltOutStr = null;
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
		if (settings["onsimvar"] && settings["onsimvar"].length > 0){
			allVars.push(settings["onsimvar"]);
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
		promises.push(loadImage(onBackImage));
        Promise.all(promises).then(() => imagesLoaded = true);
        
        backImage.src = (settings["backimg"] && settings["backimg"].length > 0) ? settings["backimg"] : '';
		onBackImage.src = (settings["onbackimg"] && settings["onbackimg"].length > 0) ? settings["onbackimg"] : '';
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
    
    var lastDrawnOutStr = null;
    var lastDrawnAltOutStr = null;
	var lastDrawnAltTwoOutStr = null;
	var lastDrawnOnOutStr = null;
    
    this.drawButton = function() {
        if (!imagesLoaded) {
            lastDrawnOutStr = null;
            lastDrawnAltOutStr = null;
			lastDrawnAltTwoOutStr = null;
            return false;
        }
		var simVal = settings["lastValue"];
		var varOffset = settings["varoffset"] != null ? parseFloat(settings["varoffset"]) : 0;
		var altVal = settings["lastAltValue"];
		var altOffset = settings["altoffset"] != null ? parseFloat(settings["altoffset"]) : 0;
		var altTwoVal = settings["lastAltTwoValue"];
		var altTwoOffset = settings["alttwooffset"] != null ? parseFloat(settings["alttwooffset"]) : 0;
		var simVarPad = settings["simvarpad"];
		var altVarPad = settings["altvarpad"];
		var altTwoVarPad = settings["alttwovarpad"];
		var onVal = settings["lastOnValue"];
        var outStr = '';
		if (settings["simvar"]){
            if (settings["simvar"].includes("TXT:")){
				outStr = settings["simvar"].substr(5, settings["simvar"].length - 6);
			} else{
                if (settings["simvar"].includes(", String") || settings["simvar"].includes("%!") || settings["simvar"].includes("'") || settings["simvar"].includes("(STRARR")){
                    outStr = '' + simVal;
                } else{
                    outStr = '' + ((simVal + varOffset) * settings["multiplier"]).toFixed(settings["fractions"]).padStart(simVarPad, '0');
                }
            }
		}
        var altOutStr = null;
		if (settings["altsimvar"]){ 
            if (settings["altsimvar"].includes("TXT:")){
				altOutStr = settings["altsimvar"].substr(5, settings["altsimvar"].length - 6);
			} else{
                if (settings["altsimvar"].includes(", String") || settings["altsimvar"].includes("%!") || settings["altsimvar"].includes("'") || settings["altsimvar"].includes("(STRARR")){
                    altOutStr = '' + altVal;
                } else{
                    altOutStr = '' + ((altVal + altOffset) * settings["altmultiplier"]).toFixed(settings["altfractions"]).padStart(altVarPad, '0');
                }
            }
		}
		var altTwoOutStr = null;
		if (settings["alttwosimvar"]){ 
            if (settings["alttwosimvar"].includes("TXT:")){
				altTwoOutStr = settings["alttwosimvar"].substr(5, settings["alttwosimvar"].length - 6);
			} else{
                if (settings["alttwosimvar"].includes(", String") || settings["alttwosimvar"].includes("%!") || settings["alttwosimvar"].includes("'") || settings["alttwosimvar"].includes("(STRARR")){
                    altTwoOutStr = '' + altTwoVal;
                } else{
                    altTwoOutStr = '' + ((altTwoVal + altTwoOffset) * settings["alttwomultiplier"]).toFixed(settings["alttwofractions"]).padStart(altTwoVarPad, '0');
                }
            }
		}
		var onOutStr = settings["onsimvar"] ? ('' + (onVal)) : null;
        if (!pimode && lastDrawnOutStr === outStr && lastDrawnAltOutStr === altOutStr && lastDrawnAltTwoOutStr === altTwoOutStr&& lastDrawnOnOutStr === onOutStr) {
            return false;
        }
		var ctx = cnv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		ctx.fillStyle = settings["backcolor"];
		ctx.fillRect(0, 0, cnv.width, cnv.height);
		if (settings["backimg"] && settings["backimg"].length > 0 && onVal != settings["onvarval"]){
			ctx.drawImage(backImage, 0, 0, 144, 144);
		}
		if (settings["onbackimg"] && settings["onbackimg"].length > 0 && onVal == settings["onvarval"]){
			ctx.drawImage(onBackImage, 0, 0, 144, 144);
		}
		ctx.save();
		if (settings["splittext"] && settings["splittext"] !== '0'){
			var rawlines = outStr.split(' ');
			var splitwidth = 0; // 144 / lines.length;
			if (settings["splitwidth"]){
				splitwidth = parseFloat(settings["splitwidth"]);
			}
			var lines = [];
			var li = 0;
			for (var i = 0; i < rawlines.length; i++){
				var lineText = rawlines[i];
				while (lineText.length < splitwidth && i < rawlines.length - 1){
					var checkText = lineText + ' ' + rawlines[i+1];
					if (checkText.length <= splitwidth){
						lineText = checkText;
						i++;
					}else{
						break;
					}
				}
				lines[li++] = lineText;
			}
			var heightPx = parseFloat(settings["fontsize"]); // 144 / lines.length;
			if (settings["splitstretch"] && settings["splitstretch"] !== '0'){
				heightPx = 144 / lines.length;
			}
			var yLoc = (heightPx / 2) + parseFloat(settings["yshift"]);
			var tform = "";
			if (settings["fontbold"] == 1)
				tform = "bold ";
			if (settings["fontitalic"] == 1)
				tform += "italic ";
			ctx.font = tform + settings["fontsize"] + 'px ' + settings["font"];
			ctx.fillStyle = settings["color"];
			for (var i = 0; i < lines.length; i++){
				var lineText = lines[i];
				var widthPx = ctx.measureText(lineText).width;
				if (widthPx > 144){
					var factor = settings["fontsize"] * 144 / widthPx;
					ctx.font = tform + Math.floor(factor) + 'px ' + settings["font"];
				}
				widthPx = ctx.measureText(lineText).width;
				var xLoc = 72 - (widthPx / 2);
				ctx.fillText(lineText, xLoc, yLoc);
				yLoc = yLoc + heightPx;
			}
		}
		else
		{
			var factor = 50;
			var tform = "";
			if (settings["fontbold"] == 1)
				tform = "bold ";
			if (settings["fontitalic"] == 1)
				tform += "italic ";
			ctx.font = tform + settings["fontsize"] + 'px ' + settings["font"];
			ctx.fillStyle = settings["color"];
			var widthPx = ctx.measureText(outStr).width;
			if (widthPx > 144){
				factor = settings["fontsize"] * 144 / widthPx;
				ctx.font = tform + Math.floor(factor) + 'px ' + settings["font"];
			}
			// console.log(ctx.font);
			widthPx = ctx.measureText(outStr).width;
			var xLoc = 72 - (widthPx / 2) + parseInt(settings["xshift"]);
			var yLoc = settings["yshift"] ;
			ctx.fillText(outStr, xLoc, yLoc);
			if (altOutStr !== null){
				tform = "";
				if (settings["altfontbold"] == 1)
					tform = "bold ";
				if (settings["altfontitalic"] == 1)
					tform += "italic ";
				ctx.font = tform + settings["fontsize"] + 'px ' + settings["font"];
				if (settings["altfontsize"] > 0){
					ctx.font = tform + settings["altfontsize"] + 'px ' + settings["altfont"];
					ctx.fillStyle = settings["altcolor"];
				}
				widthPx = ctx.measureText(altOutStr).width;
				if (widthPx > 144){
					if (settings["altfontsize"] > 0){
						factor = settings["altfontsize"] * 144 / widthPx;
						ctx.font = tform + Math.floor(factor) + 'px ' + settings["altfont"];
						ctx.fillStyle = settings["altcolor"];
					} else{
						factor = settings["fontsize"] * 144 / widthPx;
						ctx.font = tform + Math.floor(factor) + 'px ' + settings["font"];
						ctx.fillStyle = settings["color"];
					}
				}
				widthPx = ctx.measureText(altOutStr).width;
				xLoc = 72 - (widthPx / 2) + parseInt(settings["altxshift"]);
				yLoc = settings["altyshift"] ;
				ctx.fillText(altOutStr, xLoc, yLoc);
			}
			if (altTwoOutStr !== null){
				tform = "";
				if (settings["alttwofontbold"] == 1)
					tform = "bold ";
				if (settings["alttwofontitalic"] == 1)
					tform += "italic ";
				ctx.font = tform + settings["fontsize"] + 'px ' + settings["font"];
				if (settings["alttwofontsize"] > 0){
					ctx.font = tform + settings["alttwofontsize"] + 'px ' + settings["alttwofont"];
					ctx.fillStyle = settings["alttwocolor"];
				}
				widthPx = ctx.measureText(altTwoOutStr).width;
				if (widthPx > 144){
					if (settings["alttwofontsize"] > 0){
						factor = settings["alttwofontsize"] * 144 / widthPx;
						ctx.font = tform + Math.floor(factor) + 'px ' + settings["alttwofont"];
						ctx.fillStyle = settings["alttwocolor"];
					} else{
						factor = settings["fontsize"] * 144 / widthPx;
						ctx.font = tform + Math.floor(factor) + 'px ' + settings["font"];
						ctx.fillStyle = settings["color"];
					}
				}
				widthPx = ctx.measureText(altTwoOutStr).width;
				xLoc = 72 - (widthPx / 2) + parseInt(settings["alttwoxshift"]);
				yLoc = settings["alttwoyshift"] ;
				ctx.fillText(altTwoOutStr, xLoc, yLoc);
			}
		}
        ctx.restore();
        lastDrawnOutStr = outStr;
        lastDrawnAltOutStr = altOutStr;
		lastDrawnAltTwoOutStr = altTwoOutStr;
		lastDrawnOnOutStr = onOutStr;
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
