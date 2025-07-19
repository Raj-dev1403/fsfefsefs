function RotaryEncoderAction(inContext, inSettings, coordinates, canvs) {
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
    var feedbackCanvas = null;

    var settings = inSettings;
    if (!settings["fastturnspeed"])
        settings["fastturnspeed"] = 2;

    settings["statectr"] = 0;
    
    var imagesLoaded = false;
    loadImages();

    this.getCoords = function() 
    {
        return 'R' + coords;
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
        if (settings["simvar"] && settings["simvar"].length > 0){
            allVars.push(settings["simvar"]);
        }
        if (settings["altsimvar"] && settings["altsimvar"].length > 0){
            allVars.push(settings["altsimvar"]);
        }
        if (settings["alttwosimvar"] && settings["alttwosimvar"].length > 0){
            allVars.push(settings["alttwosimvar"]);
        }
        if (settings["altcolorvar"] && settings["altcolorvar"].length > 0){
            allVars.push(settings["altcolorvar"]);
        }
        if (settings["imagedefs"] && settings["imagedefs"].length > 0){
            for (let i = 0; i < settings["imagedefs"].length; i++){
                if (settings["imagedefs"][i].visivar)
                    allVars.push(settings["imagedefs"][i].visivar);
            }
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
    
    var lastDrawnOutStr = '';
    var lastTextColor = 0;
    var cnvData = '';
    var lastCnvData = '';
    
    this.drawIcon = function(inSimVars, inStringVars) {
        if (!imagesLoaded) {
            return false;
        }
        if (!varsChanged(inSimVars, inStringVars))
            return false;
        
        var outStr = '';
        if (settings["altsimvar"] && settings["altsimvar"].length > 0){
            var simVal = settings["lastAltValue"];
            var varOffset = settings["altvaroffset"] != null ? parseFloat(settings["altvaroffset"]) : 0;
            var simVarPad = settings["altvarpad"];
            var textColor = settings["altcolor"];
            if (settings["altsimvar"].includes(", String") || settings["altsimvar"].includes("%!") || settings["altsimvar"].includes("'") || settings["altsimvar"].includes("(STRARR")){
                outStr = '' + simVal;
            } else{
                outStr = '' + ((simVal + varOffset) * settings["altmultiplier"]).toFixed(settings["altfractions"]).padStart(simVarPad, '0');
            }
        }
        // if (lastDrawnOutStr === outStr && lastTextColor === textColor && (!settings["imagedefs"] || settings["imagedefs"].length == 0)) {
        //    return false;
        //}
        var ctx = cnv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = settings["altbackcolor"];
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.save();
        if (settings["imagedefs"]){
            // Draw images
            for (let i = 0; i < settings["imagedefs"].length; i++){
                var curImgDef = settings["imagedefs"][i];
                if (curImgDef.visivar && (inSimVars[curImgDef.visivar] == 0 || inStringVars[curImgDef.visivar] === '0'))
                    continue;
                ctx.save();
                ctx.drawImage(curImgDef.imgwrk, 0, 0, 144, 144);
                ctx.restore();
            }
        }
        // Draw text
        var factor = 50;
        var tform = "";
        if (settings["altfontbold"] == 1)
            tform = "bold ";
        if (settings["altfontitalic"] == 1)
            tform += "italic ";
        ctx.font = tform + settings["altfontsize"] + 'px ' + settings["altfont"];
        ctx.fillStyle = textColor;
        var widthPx = ctx.measureText(outStr).width;
        if (widthPx > 144){
            factor = settings["altfontsize"] * 144 / widthPx;
            ctx.font = tform + Math.floor(factor) + 'px ' + settings["altfont"];
        }
        // console.log(ctx.font);
        widthPx = ctx.measureText(outStr).width;
        var xLoc = 72 - (widthPx / 2) + parseInt(settings["altxshift"]);
        var yLoc = settings["altyshift"] ;
        ctx.fillText(outStr, xLoc, yLoc);
        ctx.restore();
        lastTextColor = textColor;
        lastDrawnOutStr = outStr;
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
        return cnv.toDataURL();
    };
    
    var lastDrawnOutTitleStr = null;
    
    this.getStripValue = function() {
        if (!settings["simvar"] || settings["simvar"].length == 0){
            return false;
        }
        var simVal = settings["lastValue"];
        var varOffset = settings["varoffset"] != null ? parseFloat(settings["varoffset"]) : 0;
        var simVarPad = settings["simvarpad"];
        var outStr = '';
        if (settings["simvar"] && settings["simvar"].length > 0){
            if (settings["simvar"].includes(", String") || settings["simvar"].includes("%!") || settings["simvar"].includes("'") || settings["simvar"].includes("(STRARR")){
                outStr = '' + simVal;
            } else{
                outStr = '' + ((simVal + varOffset) * settings["multiplier"]).toFixed(settings["fractions"]).padStart(simVarPad, '0');
            }
        }
        if (lastDrawnOutTitleStr === outStr) {
            return false;
        }
        lastDrawnOutTitleStr = outStr;
        return true;
    };
    
    this.getStripValueString = function() 
    {
        return lastDrawnOutTitleStr;
    };
    
    var lastDrawnOutIndicator = -1;
    
    this.getIndicator = function() {
        if (!settings["alttwosimvar"] || settings["alttwosimvar"].length == 0){
            return false;
        }
        var simVal = settings["lastAltTwoValue"];
        var varOffset = settings["alttwooffset"] != null ? parseFloat(settings["alttwooffset"]) : 0;
        simVal = (simVal + varOffset) * settings["alttwomultiplier"];
        if (simVal < 0) simVal = 0;
        if (simVal > 100) simVal = 100;
        if (lastDrawnOutIndicator == simVal) {
            return false;
        }
        lastDrawnOutIndicator = simVal;
        return true;
    };
    
    this.getIndicatorValue = function() 
    {
        return lastDrawnOutIndicator;
    };
    
    this.resetVars = function() 
    {
        lastDrawnOutStr = null;
        lastDrawnOutTitleStr = null;
        lastDrawnOutIndicator = -1;
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
    
    this.getFeedbackData = function(){
        if (feedbackCanvas == null){
            var feedbackCanvas = document.createElement('canvas');
            feedbackCanvas.width = 200;
            feedbackCanvas.height = 100;
        }
        var fctx = feedbackCanvas.getContext('2d');
        fctx.globalCompositeOperation = 'source-over';
        fctx.clearRect(0, 0, feedbackCanvas.width, feedbackCanvas.height);
        fctx.fillStyle = settings["altbackcolor"];
        fctx.fillRect(0, 0, feedbackCanvas.width, feedbackCanvas.height);
        fctx.save();
        if (lastCnvData.length > 0) {
          fctx.drawImage(cnv, 0, 25, 70, 70);
        }
        if (lastDrawnOutTitleStr) {
          fctx.fillStyle = "white";
          fctx.font = 'bold 22px sans-serif';
          var widthPx = fctx.measureText(lastDrawnOutTitleStr).width;
          fctx.fillText(lastDrawnOutTitleStr, 190 - widthPx, 65);
        }
        if (lastDrawnOutIndicator >= 0){
          fctx.fillStyle = "white";
          fctx.fillRect(75, 90, lastDrawnOutIndicator, 5);
          fctx.strokeStyle = "white";
          fctx.strokeRect(75, 90, 100, 5);
        }
        fctx.restore();
        return feedbackCanvas.toDataURL();
    }
}
