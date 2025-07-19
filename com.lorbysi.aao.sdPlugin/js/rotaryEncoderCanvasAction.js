function RotaryEncoderCanvasAction(inContext, inSettings, coordinates, canvs) {
    // Init Action
    var instance = this;
	var cnv = canvs;
	var mySimvars = {};
	var mySimStringvars = {};
	var firstCall = true;
    var coords = "99_99";
	if (coordinates) coords = coordinates.column + "_" + coordinates.row;
    // Private variable containing the context of the action
    var context = inContext;
	var ctx = null;
	var cnvData = '';
	var lastCnvData = '';
	var updateCounter = 0;
    
    var pimode = false;

    var settings = inSettings;
	if (!settings["fastturnspeed"])
		settings["fastturnspeed"] = 2;

	settings["statectr"] = 0;
	
	if (!settings["imagedefs"]){
		settings["imagedefs"] = [];
	}
	
	if (!settings["textdefs"]){
		settings["textdefs"] = [];
	}
	
	var imagesLoaded = false;
    loadImages();

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
		loadImages();
    };
	
	function varsChanged(inSimVars, inSimStringVars){
		let retval = firstCall;
		firstCall = false;
		for (let key in mySimvars){
			if (!mySimvars[key] || mySimvars[key] != inSimVars[key])
				retval = true;
			mySimvars[key] = inSimVars[key];
		}
		for (let key in mySimStringvars){
			if (!mySimStringvars[key] || mySimStringvars[key] !== inSimStringVars[key])
				retval = true;
			mySimStringvars[key] = inSimStringVars[key];
		}
		return retval;
	}
	
	this.getSimVars = function(){
		var allVars = [];
		for (let i = 0; i < settings["imagedefs"].length; i++){
			if (settings["imagedefs"][i].rsimvar)
				allVars.push(settings["imagedefs"][i].rsimvar);
			if (settings["imagedefs"][i].xsimvar)
				allVars.push(settings["imagedefs"][i].xsimvar);
			if (settings["imagedefs"][i].ysimvar)
				allVars.push(settings["imagedefs"][i].ysimvar);
			if (settings["imagedefs"][i].visivar)
				allVars.push(settings["imagedefs"][i].visivar);
		}
		for (let i = 0; i < settings["textdefs"].length; i++){
			if (!settings["textdefs"][i].simvar.includes("TXT:"))
				allVars.push(settings["textdefs"][i].simvar);
			if (settings["textdefs"][i].visivar)
				allVars.push(settings["textdefs"][i].visivar);
		}
		mySimvars = {};
		mySimStringvars = {};
		for (let i = 0; i < allVars.length; i++){
			let inGetvar = allVars[i];
			if (inGetvar.includes(", String") || inGetvar.includes("%!") || inGetvar.includes("'") || inGetvar.includes("(STRARR")){
				mySimStringvars[inGetvar] = "";
			} else{
				mySimvars[inGetvar] = 0.0;
			}
		}
		return allVars;
	}
	
	function loadImage(img) {
        return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    }
    
    function loadImages() {
		if (settings["imagedefs"]){
			imagesLoaded = false;
			let promises = [];
			for (let i = 0; i < settings["imagedefs"].length; i++){
				var movImgDef = settings["imagedefs"][i];
				// console.log(movImgDef.mainImage);
				movImgDef.imgwrk = new Image();
				movImgDef.imgwrk.src = (movImgDef.mainImage && movImgDef.mainImage.length > 0) ? movImgDef.mainImage : '';	
				promises.push(loadImage(movImgDef.imgwrk));
			}
			Promise.all(promises).then(() => imagesLoaded = true);
		}
		imagesLoaded = true;
    }

    this.onKeyDown = function(inContext, inSettings) {
		var evt = settings["keydownevt"];
		var evtval = settings["keydownval"];
        if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					requestObj.scripts[0].code = evt.substr(4, evt.length - 5);
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
					requestObj.triggers[0].value = evtval;
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = evtval;
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
    };
	
	this.onKeyUp = function(inContext, inSettings) {
		var evt = settings["keyupevt"];
		var evtval = settings["keyupval"];
        if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					requestObj.scripts[0].code = evt.substr(4, evt.length - 5);
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
					requestObj.triggers[0].value = evtval;
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = evtval;
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
    };
	
	this.onDialRotate = function(inContext, inSettings, ticks) {
		var evt = "";
		var evtval = 0;
		var fastturnspeed = settings["fastturnspeed"];
		if (ticks > 0){
			evt = settings["rightevt"];
			evtval = settings["rightval"];
			if (ticks > fastturnspeed && settings["fastrightevt"] && settings["fastrightevt"].length > 0){
				evt = settings["fastrightevt"];
				evtval = settings["fastrightval"];
				ticks = 1;
			}
		}
		else{
			evt = settings["leftevt"];
			evtval = settings["leftval"];
			if (ticks < -fastturnspeed && settings["fastleftevt"] && settings["fastleftevt"].length > 0){
				evt = settings["fastleftevt"];
				evtval = settings["fastleftval"];
				ticks = 1;
			}
		}
        if (evt) {
			for (let i = 0; i < Math.abs(ticks); i++){
				var xhttp = new XMLHttpRequest();
				var requestObj = {};
				if (evt.includes('(>S:')){
						requestObj = {"scripts":[{"code":""}]};
						requestObj.scripts[0].code = evt.substr(4, evt.length - 5);
				} else {
					if (evt.includes('K:') || evt.includes('H:')){
						requestObj = {"triggers":[{"evt":"","value":1.0}]};
						requestObj.triggers[0].evt = evt;
						requestObj.triggers[0].value = evtval;
					} else {
						requestObj = {"setvars":[{"var":"","value":1.0}]};
						requestObj.setvars[0].var = evt;
						requestObj.setvars[0].value = evtval;
					}
				}
				xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
				xhttp.send();
			}
		}
    };
	
	this.onTouchTap = function(inContext, inSettings) {
		var evt = settings["touchtapevt"];
		var evtval = settings["touchtapval"];
        if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					requestObj.scripts[0].code = evt.substr(4, evt.length - 5);
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					requestObj = {"triggers":[{"evt":"","value":1.0}]};
					requestObj.triggers[0].evt = evt;
					requestObj.triggers[0].value = evtval;
				} else {
					requestObj = {"setvars":[{"var":"","value":1.0}]};
					requestObj.setvars[0].var = evt;
					requestObj.setvars[0].value = evtval;
				}
			}
			xhttp.open("GET", AAO_URL + "?json=" + encodeURIComponent(JSON.stringify(requestObj)));
			xhttp.send();
		}
    };
		
	this.onLongClick = function() {
		var evt = settings["longsimevt"];
		if (evt) {
			var xhttp = new XMLHttpRequest();
			var requestObj = {};
			if (evt.includes('(>S:')){
					requestObj = {"scripts":[{"code":""}]};
					requestObj.scripts[0].code = evt.substr(4, evt.length - 5);
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
	
	var lastDrawnTextStr = null;
    var lastDrawnImageStr = null;
    
    this.drawCanvas = function(inSimVars, inStringVars) {
        if (!imagesLoaded) {
            lastDrawnTextStr = null;
            lastDrawnImageStr = null;
            return false;
        }
		updateCounter++;
		var fps = settings["fpsnum"]
		if (fps){
			if (fps === '1'){
				if (updateCounter < 10) return false;
			} else{
				if (fps === '5'){
					if (updateCounter < 5) return false;
				} else{
				}
			}
		}
		updateCounter = 0;
		if (!pimode && !varsChanged(inSimVars, inStringVars))
			return false;
		// Draw background
		ctx = cnv.getContext('2d');
		
        ctx.globalCompositeOperation = 'source-over';
		ctx.clearRect(0, 0, cnv.width, cnv.height);
		ctx.fillStyle = settings["backcolor"];
		ctx.fillRect(0, 0, cnv.width, cnv.height);

		// Draw images
		for (let i = 0; i < settings["imagedefs"].length; i++){
			var curImgDef = settings["imagedefs"][i];
            if (curImgDef.visivar){ 
				if (curImgDef.visival){
					if (inSimVars[curImgDef.visivar] != curImgDef.visival && inStringVars[curImgDef.visivar] !== curImgDef.visival)
						continue;
				} else{
					if (inSimVars[curImgDef.visivar] == 0 || inStringVars[curImgDef.visivar] === '0')
						continue;
				}
			}
			ctx.save();
			var xPos = curImgDef.xoffset;
			var yPos = curImgDef.yoffset;
			if (curImgDef.rsimvar){
				var rotation = (inSimVars[curImgDef.rsimvar] * curImgDef.rmultiplier) - degrees_to_radians(curImgDef.roffset);
				ctx.translate(curImgDef.rxshift, curImgDef.ryshift);
				ctx.rotate(rotation);
				ctx.translate(-curImgDef.rxshift, -curImgDef.ryshift);
			}			
			if (curImgDef.xsimvar){
				xPos = (inSimVars[curImgDef.xsimvar] * curImgDef.xmultiplier) - xPos;
			}			
			if (curImgDef.ysimvar){
				yPos = (inSimVars[curImgDef.ysimvar] * curImgDef.ymultiplier) - yPos;
			}
			if (curImgDef.stretch){
				ctx.drawImage(curImgDef.imgwrk, xPos, yPos, 200, 100);
			} else {
				ctx.drawImage(curImgDef.imgwrk, xPos, yPos);
			}
			ctx.restore();
		}
		// Draw text elements
		for (let i = 0; i < settings["textdefs"].length; i++){
			outStr = '';
			var currTextDef = settings["textdefs"][i];
			if (currTextDef.visivar){ 
				if (currTextDef.visival){
					if (inSimVars[currTextDef.visivar] != currTextDef.visival && inStringVars[currTextDef.visivar] !== currTextDef.visival)
						continue;
				} else{
					if (inSimVars[currTextDef.visivar] == 0 || inStringVars[currTextDef.visivar] === '0')
						continue;
				}
			}
			if (currTextDef.simvar.includes("TXT:")){
				outStr = currTextDef.simvar.substr(4, currTextDef.simvar.length - 5);
			} else{
				if (currTextDef.simvar.includes(", String") || currTextDef.simvar.includes("%!") || currTextDef.simvar.includes("'") || currTextDef.simvar.includes("(STRARR")){
					outStr = '' + inStringVars[currTextDef.simvar];
				} else{
					outStr = '' + ((inSimVars[currTextDef.simvar] + parseFloat(currTextDef.varoffset)) * currTextDef.multiplier).toFixed(currTextDef.fractions).padStart(currTextDef.simvarpad, '0');
				}
			}
			ctx.save();
			
			if (currTextDef.splittext && currTextDef.splittext !== '0'){
				var rawlines = outStr.split(' ');
				var splitwidth = 0; 
				if (currTextDef.splitwidth){
					splitwidth = parseFloat(currTextDef.splitwidth);
				}
				var lines = [];
				var li = 0;
				for (var ilin = 0; ilin < rawlines.length; ilin++){
					var lineText = rawlines[ilin];
					while (lineText.length < splitwidth && ilin < rawlines.length - 1){
						var checkText = lineText + ' ' + rawlines[ilin+1];
						if (checkText.length <= splitwidth){
							lineText = checkText;
							ilin++;
						}else{
							break;
						}
					}
					lines[li++] = lineText;
				}
				var heightPx = parseFloat(currTextDef.fontsize); 
				if (currTextDef.splitstretch && currTextDef.splitstretch !== '0'){
					heightPx = 100 / lines.length;
				}
				var yLoc = (heightPx / 2) + parseFloat(currTextDef.yshift);
				var tform = "";
				if (currTextDef.bold == 1)
					tform = "bold ";
				if (currTextDef.italic == 1)
					tform += "italic ";
				ctx.font = tform + currTextDef.fontsize + 'px ' + currTextDef.font;
				ctx.fillStyle = currTextDef.color;
				for (var ilin = 0; ilin < lines.length; ilin++){
					var lineText = lines[ilin];
					var widthPx = ctx.measureText(lineText).width;
					var xLoc = parseInt(currTextDef.xshift) - (widthPx / 2);
					if (currTextDef.align && currTextDef.align == 1) {
						xLoc = parseInt(currTextDef.xshift);
					} else {
						if (currTextDef.align && currTextDef.align == 2) {
							xLoc = parseInt(currTextDef.xshift) - widthPx;
						}
					}
					ctx.fillText(lineText, xLoc, yLoc);
					yLoc = yLoc + heightPx;
				}
			}
			else
			{
				var factor = 50;
				var tform = "";
				if (currTextDef.bold == 1)
					tform = "bold ";
				if (currTextDef.italic == 1)
					tform += "italic ";
				ctx.font = tform + currTextDef.fontsize + 'px ' + currTextDef.font;
				ctx.fillStyle = currTextDef.color;
				var widthPx = ctx.measureText(outStr).width;
				var xLoc = parseInt(currTextDef.xshift) - (widthPx / 2);
				if (currTextDef.align && currTextDef.align == 1) {
					xLoc = parseInt(currTextDef.xshift);
				} else {
					if (currTextDef.align && currTextDef.align == 2) {
						xLoc = parseInt(currTextDef.xshift) - widthPx;
					}
				}
				var yLoc = 100 - currTextDef.yshift;
				ctx.fillText(outStr, xLoc, yLoc);
			}
			ctx.restore();
		}
		cnvData = cnv.toDataURL();
		if (cnvData === lastCnvData){
			return false;
		} else {
			lastCnvData = cnvData;
			return true;
		}
    };

	this.getImageData = function() 
	{
		return lastCnvData;
	};
	
	this.getCoords = function() 
	{
		return 'R' + coords;
	};
	
	function degrees_to_radians(degrees)
	{
	  var pi = Math.PI;
	  return degrees * (pi/180);
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
		if (settings["keydownevt"])
		{
			var evt = settings["keydownevt"];
			if (evt.includes('(>S:')){
				retStr = evt.substr(4, evt.length - 5);
			} else {
				if (evt.includes('K:') || evt.includes('H:')){
					retStr = '1 ' + evt;
				} else {
					retStr = settings["keydownval"] + ' ' + evt;
				}
			}
			return retStr;
		}
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
    
    this.setPiMode = function(pimodeon) 
	{
		pimode = pimodeon;
	};
}
