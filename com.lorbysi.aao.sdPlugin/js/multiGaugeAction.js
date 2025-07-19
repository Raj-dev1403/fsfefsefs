function MultiGaugeAction(inContext, inSettings, coordinates, canvs) {
    // Init Action
    var instance = this;
    var cnv = canvs;
	var ctx = null;
	var cnvData = '';
	var lastCnvData = '';
	var updateCounter = 0;
	var coords = "99_99";
	var mySimvars = {};
	var mySimStringvars = {};
	var firstCall = true;
	if (coordinates) coords = coordinates.column + "_" + coordinates.row;
    
    var pimode = false;

    // Private variable containing the context of the action
    var context = inContext;
    var settings = inSettings;
	if (!settings["simvar"]){
	
		// Base parameters
		settings["simvar"] = "(L:DummyVar)";
		settings["backcolor"] = '#000000';
		// moving images
		settings["imagedefs"] = [];
		
		// Text definitions
		settings["textdefs"] = [];
	}
	settings["multivar"] = 1;
	
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

    // Public function for setting the settings
    this.setSettings = function(inSettings) {
        settings = inSettings;
        loadImages();
    };
    
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
                if (movImgDef.isimvar && movImgDef.isimvar.length > 0){
                    // LVar image - do nothing
                } else{
                    movImgDef.imgwrk.src = (movImgDef.mainImage && movImgDef.mainImage.length > 0) ? movImgDef.mainImage : '';	
                    promises.push(loadImage(movImgDef.imgwrk));
                }
			}
			Promise.all(promises).then(() => imagesLoaded = true);
		}
		imagesLoaded = true;
    }
	
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
				mySimStringvars[inGetvar] = "--";
			} else{
				mySimvars[inGetvar] = -99.0;
			}
		}
		return allVars;
	}
    
    this.getPullSimVars = function(){
		var allVars = [];
		for (let i = 0; i < settings["imagedefs"].length; i++){
			if (settings["imagedefs"][i].isimvar){
				allVars.push(settings["imagedefs"][i].isimvar);
                mySimStringvars[settings["imagedefs"][i].isimvar] = "--";
            }
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
    
    var lastDrawnTextStr = null;
    var lastDrawnImageStr = null;
    
    this.drawButton = function(inSimVars, inStringVars) {
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
        if (!settings["noblack"]){
		   ctx.clearRect(0, 0, cnv.width, cnv.height);
           ctx.fillStyle = settings["backcolor"];
           ctx.fillRect(0, 0, cnv.width, cnv.height);
        }
        ctx.globalCompositeOperation = 'source-over';

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
            if (curImgDef.isimvar){
                let b64str = inStringVars[curImgDef.isimvar];
                if (b64str.length > 0){
                    let newB64 = "data:image/png;base64," + b64str;
                    if (!curImgDef.oldStr || curImgDef.oldStr !== newB64){
                        curImgDef.oldStr = newB64;
                        curImgDef.imageLoaded = false;
                        let promises = [];
                        curImgDef.imgwrk.src = newB64;
                        promises.push(loadImage(curImgDef.imgwrk));
                        Promise.all(promises).then(() => curImgDef.imageLoaded = true);
                    }
                }
                if (!curImgDef.imageLoaded)
                    continue;
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
				ctx.drawImage(curImgDef.imgwrk, xPos, yPos, 144, 144);
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
				var splitwidth = 0; // 144 / lines.length;
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
				var heightPx = parseFloat(currTextDef.fontsize); // 144 / lines.length;
				if (currTextDef.splitstretch && currTextDef.splitstretch !== '0'){
					heightPx = 144 / lines.length;
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
				if (widthPx > 144){
					factor = currTextDef.fontsize * 144 / widthPx;
					ctx.font = Math.floor(factor) + 'px ' + currTextDef.font;
				}
				widthPx = ctx.measureText(outStr).width;
				var xLoc = parseInt(currTextDef.xshift) - (widthPx / 2);
				if (currTextDef.align && currTextDef.align == 1) {
					xLoc = parseInt(currTextDef.xshift);
				} else {
					if (currTextDef.align && currTextDef.align == 2) {
						xLoc = parseInt(currTextDef.xshift) - widthPx;
					}
				}
				var yLoc = 144 - currTextDef.yshift;
				ctx.fillText(outStr, xLoc, yLoc);
			}
			ctx.restore();
		}
		cnvData = cnv.toDataURL();
		if (cnvData === lastCnvData){
			lastCnvData = cnvData;
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
		return coords;
	};
	
	function degrees_to_radians(degrees)
	{
	  var pi = Math.PI;
	  return degrees * (pi/180);
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
