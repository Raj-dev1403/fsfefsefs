function AaoDeck(inDeckID, inWebsocket) {
    var websocket = inWebsocket;
    var sddeviceid = inDeckID;
    var deviceIndex = -1;
    var actions = {};
    var mainLoopRequestObj = {};
    mainLoopRequestObj.getvars = [];
    mainLoopRequestObj.getstringvars = [];
    mainLoopRequestObj.pulllvars = [];
    mainLoopRequestObj.pullstringlvars = [];
    var simvars = {};
    var simstringvars = {};
    var altsimvars = {};
    
    var bulkInitArmed = false;
    var bulkInitScript = '';
    var bulkInitHandle;

    // Global settings
    var globalSettings = {};

    // repeating action
    var repeating = false;
    var lastRepeat = 0;
    var repcontext = null;
    var repsettings = null;
    var repcoordinates = null;
    var repuserDesiredState = null;
    var repstate = null;

    // long click action
    var longclickarmed = false;
    var longclickfired = false;
    var lccontext = null;
    var longclickStart = 0;
    var longclickTimout = 750;

    var connActCtx = null;
    var connState = false;

    var dataLoopArmed = true;
    var dataLoopActive = false;
    var dataLoopHandle;
    var lastUpdate =  0;
    var loopCountdown = -1;        

    var requestArmed = true;
    var loopNum = 0;
    var loopRecoveryNum = 0;
    
    var staticPicsCounter = 0;
    
    var STREAMING_ACTIVE = STREAM_IMAGES_TO_AAO;
    var streamActCtx = null;
    var actionsComplete = false;
    var lastAppear = 0;
    
    var keyUpActions = [];

    // var numberOfButtons = 0;
    
    this.setDeviceIndex = function(inDeckIndex){
        deviceIndex = inDeckIndex;
        // console.info("Device index set " + deviceIndex + " on " + sddeviceid);
    }

    this.onMessage = function(inEvent){
        // Parse parameter from string to object
        var jsonObj = JSON.parse(inEvent.data);

        // Extract payload information
        var event = jsonObj['event'];
        var action = jsonObj['action'];
        var context = jsonObj['context'];
        var settings = {};
        var coordinates = {};
        var userDesiredState = {};
        var state = {};
        var jsonPayload = jsonObj['payload'];
        if (jsonPayload){
            settings = jsonPayload['settings'];
            coordinates = jsonPayload['coordinates'];
            userDesiredState = jsonPayload['userDesiredState'];
            state = jsonPayload['state'];
        }

        if(event === 'keyDown' || event === 'dialDown') {
            // console.info("keyDown");
            
            // Send onKeyDown event to actions
            if (context in actions) {
                if (actions[context].onKeyDown){
                    if (settings["longsimevt"]){
                        longclickarmed = true;
                        lccontext = context;
                        if (settings["longclicktimeout"] && settings["longclicktimeout"] !== '0'){
                            longclickTimout = parseInt(settings["longclicktimeout"]);
                        } else{
                            longclickTimout = LONG_CLICK_MS;
                        }
                        longclickStart = Date.now();
                    }
                    else {
                        actions[context].onKeyDown(context, settings, coordinates, userDesiredState, state);
                        if (settings["repeatAction"] && settings["repeatAction"] === '1'){
                            repeating = true;
                            lastRepeat = Date.now();
                            repcontext = context;
                            repsettings = settings;
                            repcoordinates = coordinates;
                            repuserDesiredState = userDesiredState;
                            repstate = state;
                        }
                    }
                }
            }
        }
        else if(event === 'keyUp' || event === 'dialUp') {
            // writeToLog("keyUp");
            // switchToProfile(pluginUUid, sddeviceid, "Lorby Gauges");
            // switchToProfile(context, "@(1)[4057/108/CL49K2A00884]", 'Lorby Gauges');
            // return;
            if (context in actions) {
                if (actions[context].onKeyDown && longclickarmed && !longclickfired){
                    actions[context].onKeyDown(context, settings, coordinates, userDesiredState, state);
                    if (actions[context].onKeyUp){
                        keyUpActions.push(actions[context]);
                        AAOsetTimeoutESD(FireKeyUp, 50);
                       
                       // actions[context].onKeyUp(context, settings, coordinates, userDesiredState, state);
                    }
                    longclickarmed = false;
                } else{
                    if (longclickfired){
                        if (actions[context].onLongClickUp)
                            actions[context].onLongClickUp(context, settings, coordinates, userDesiredState, state);
                    } else{
                        if (actions[context].onKeyUp)
                            actions[context].onKeyUp(context, settings, coordinates, userDesiredState, state);
                    }
                }
                // saveSettings(actions[context], context, settings);
                repeating = false;
                repcontext = null;
                repsettings = null;
                repcoordinates = null;
                repuserDesiredState = null;
                repstate = null;
                longclickarmed = false;
                longclickfired = false;
            } else{
                if (streamActCtx && context === streamActCtx){
                    STREAMING_ACTIVE = !STREAMING_ACTIVE;
                    if (STREAMING_ACTIVE){
                        InitializeStream();
                    } else {
                        CleanAllImages();
                    }
                    setState (context, STREAMING_ACTIVE ? 1 : 0);
                } else{
                    if (context === connActCtx){
                        if (STREAMING_ACTIVE) CleanAllImages();
                        this.stopDataLoop();
                        CleanVars();
                        this.startDataLoop();
                    }
                }
            }
        }
        else if(event === 'dialRotate') {
            // console.info("dialRotate");
            if (context in actions) {
                if (actions[context].onDialRotate){
                    actions[context].onDialRotate(context, settings, jsonPayload['ticks']);
                }
            }
        }
        else if(event === 'touchTap') {
            // console.info("touchTap");
            if (context in actions) {
                if (actions[context].onTouchTap){
                    actions[context].onTouchTap(context, settings);
                }
            }
        }
        else if(event === 'willAppear') {
            if (Object.keys(actions).length == 0){
                CleanVars();
                bulkInitArmed = true;
                bulkInitScript = '';
                AAOsetTimeoutESD(BulkInit, 1000);
            }
            lastAppear = Date.now();
            // console.info("Appear " + action + " " + coordinates.column + "_" + coordinates.row);
            // Add current instance is not in actions array
            if (!(context in actions)) {
                // console.info("Action appears: " + action);
                // Add current instance to array
                if (action === ('com.lorby-si.aao.btn')) {
                    actions[context] = new ButtonAction(context, settings, coordinates);
                    setState (context, 0);
                    if (STREAMING_ACTIVE) streamButtonState(actions[context].getCoords(), 0, actions[context]);
                }
                else if (action === ('com.lorby-si.aao.event')) {
                    actions[context] = new EventAction(context, settings, coordinates);
                    // if (STREAMING_ACTIVE) streamButtonState(actions[context].getCoords(), 0, actions[context]);
                }
                else if (action === ('com.lorby-si.aao.connection')) {
                    connActCtx = context;
                    setState (context, 0);
                }
                else if (action === ('com.lorby-si.aao.streamtoaao')) {
                    streamActCtx = context;
                    setState (context, STREAMING_ACTIVE ? 1 : 0);
                }
                else if (action === ('com.lorby-si.aao.toggle')) {
                    actions[context] = new ToggleAction(context, settings, coordinates);
                    setState (context, 0);
                    // if (STREAMING_ACTIVE) streamButtonState(actions[context].getCoords(), 0, actions[context]);
                }
                else if (action === ('com.lorby-si.aao.onoff')) {
                    actions[context] = new OnOffAction(context, settings, coordinates);
                    setState (context, 0);
                    // if (STREAMING_ACTIVE) streamButtonState(actions[context].getCoords(), 0, actions[context]);
                }
                else if (action === ('com.lorby-si.aao.dualevent')) {
                    actions[context] = new DualEventAction(context, settings, coordinates);
                    setState (context, 0);
                    if (STREAMING_ACTIVE) streamButtonState(actions[context].getCoords(), 0, actions[context]);
                }
                else if (action === ('com.lorby-si.aao.gaugetext')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new TextGaugeAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.steamgauge')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new SteamGaugeAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.slidergauge')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new SliderGaugeAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.lvarimage')) {
                    actions[context] = new ImageAction(context, settings, coordinates);
                }
                else if (action === ('com.lorby-si.aao.multigauge')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new MultiGaugeAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.multitilegauge')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new MultiTileGaugeAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.rotary')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 144;
                    canvas.height = 144;
                    actions[context] = new RotaryEncoderAction(context, settings, coordinates, canvas);
                }
                else if (action === ('com.lorby-si.aao.rotarycanvas')) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 200;
                    canvas.height = 100;
                    actions[context] = new RotaryEncoderCanvasAction(context, settings, coordinates, canvas);
                }
                if (actions[context]){
                    var gsimvars = actions[context].getSimVars();
                    for (let i = 0; i < gsimvars.length; i++){
                        var getvar = {"var":gsimvars[i],"value":0.0};
                        AddVar(getvar);
                        if (!gsimvars[i].includes("(S:") && !bulkInitScript.includes(gsimvars[i]))
                            bulkInitScript = bulkInitScript + gsimvars[i] + ' ';
                    }
                    if (actions[context].getPullSimVars){
                        gsimvars = actions[context].getPullSimVars();
                        for (let i = 0; i < gsimvars.length; i++){
                            var getvar = {"var":gsimvars[i],"value":0.0};
                            AddPullVar(getvar);
                        }
                    }
                    // initialize script calls                    
                    var scrrequestObj = { };
                    scrrequestObj.inits = [];
                    InitScriptEvt(settings["simevt"], scrrequestObj);
                    InitScriptEvt(settings["upsimevt"], scrrequestObj);
                    InitScriptEvt(settings["longsimevt"], scrrequestObj);
                    InitScriptEvt(settings["longupsimevt"], scrrequestObj);
                    InitScriptEvt(settings["offsimevt"], scrrequestObj);
                    InitScriptEvt(settings["onsimevt"], scrrequestObj);
                    InitScriptEvt(settings["keydownevt"], scrrequestObj);
                    InitScriptEvt(settings["keyupevt"], scrrequestObj);
                    InitScriptEvt(settings["rightevt"], scrrequestObj);
                    InitScriptEvt(settings["leftevt"], scrrequestObj);
                    InitScriptEvt(settings["touchtapevt"], scrrequestObj);
                    if (scrrequestObj.inits.length > 0) {
                        var url = encodeURI(AAO_URL);
                        var scrxhttp = new XMLHttpRequest();
                        scrxhttp.open("POST", url, true);
                        scrxhttp.send(JSON.stringify(scrrequestObj));
                    }
                    // initialize image
                    if (actions[context].drawButton){
                        actions[context].drawButton();
                        setPicture(context, actions[context].getImageData(), actions[context].getCoords());
                    }
                }
                settings["statectr"] =0;
                saveSettings(action, context, settings);
                // writeToLog("Add button " + actions[context].constructor.name + " total #" + Object.keys(actions).length);
            }                    
        }
        else if(event === 'willDisappear') {
            // console.info("Disappear " + action);
            // Remove current instance from array
            actionsComplete = false;
            lastAppear = 0;
            var coordinates = jsonPayload['coordinates'];
            if (context in actions) {
                settings = jsonPayload['settings'];
                var gsimvars = actions[context].getSimVars();
                for (let i = 0; i < gsimvars.length; i++){
                    var getvar = {"var":gsimvars[i],"value":0.0};
                    RemoveVar(getvar);
                }    
                if (actions[context].getPullSimVars){
                    gsimvars = actions[context].getPullSimVars();
                    for (let i = 0; i < gsimvars.length; i++){
                        var getvar = {"var":gsimvars[i],"value":0.0};
                        RemoveVar(getvar);
                    }    
                }
                // writeToLog("Remove button " + actions[context].constructor.name + " of #" + Object.keys(actions).length);
                delete actions[context];
            }
            // numberOfButtons--;
            
            // writeToLog("willDisappear " + Object.keys(actions).length);
            if (Object.keys(actions).length == 0){
                // dataLoopActive = false;
                // writeToLog("Deck empty, Data loop disabled");
                // loopCountdown = -1;
                CleanVars();
                if (STREAMING_ACTIVE) CleanAllImages();
                // console.info("Deck empty");
                // numberOfButtons = 0;
            }
        }
        else if(event === 'titleParametersDidChange') {
            // Get title
            var titleStr = jsonPayload['title'];
            var titleParams = jsonPayload['titleParameters'];
            if (titleParams){
                titleStr = titleStr + '|' + titleParams.titleColor;
                titleStr = titleStr + '|' + titleParams.titleAlignment;
            }
            var state = jsonPayload['state'];
            if (state == 0 && context in actions) {
                actions[context].setTitle(titleStr);
                if (STREAMING_ACTIVE){
                    var coordinates = jsonPayload['coordinates'];
                    streamButtonTitle(actions[context].getCoords(), titleStr);
                }
            }
        }
        else if(event === 'didReceiveGlobalSettings') {
            // Set global settings
            globalSettings = jsonPayload['settings'];
        }
        else if(event === 'didReceiveSettings') {
            settings = jsonPayload['settings'];
            // Set settings
            if (context in actions) {
                var act = actions[context];
                var locSet = act.getSettings();
                if (settings["frompi"] && settings["frompi"] == 1){
                    settings["frompi"] = 0;
                    act.setSettings(settings);
                    saveSettings(act, context, settings);
                    var gsimvars = act.getSimVars();
                    for (let i = 0; i < gsimvars.length; i++){
                        var getvar = {"var":gsimvars[i],"value":0.0};
                        AddVar(getvar);
                    }    
                    if (act.resetVars)
                        act.resetVars();
                }
                else{
                    if (locSet["cursimval"] != null) {
                        var simVal = locSet["cursimval"];
                        var onVal = locSet["onvarval"];
                        if (simVal == onVal){
                          setState (context, 1);
                          if (STREAMING_ACTIVE) {
                              streamButtonState(act.getCoords(), 1, act);
                              if (act.updateKeyDownScript)
                                streamKeyDown(act.updateKeyDownScript(1), actions[context].getCoords());
                          }
                        } else{
                          setState (context, 0);
                          if (STREAMING_ACTIVE) {
                              streamButtonState(act.getCoords(), 0, act);
                              if (act.updateKeyDownScript)
                                streamKeyDown(act.updateKeyDownScript(0), actions[context].getCoords());
                          }
                        }
                        
                    } 
                    if (STREAMING_ACTIVE) streamButtonTitle(act.getCoords(), act.getTitle());
                }
            }
        }
        else if(event === 'propertyInspectorDidAppear') {
            if (context in actions) {
                var act = actions[context];
                if (act.setPiMode) act.setPiMode(true);
                sendToPropertyInspector(action, context, act.getSettings());
            }
        }
        else if(event === 'propertyInspectorDidDisAappear') {
            if (context in actions) {
                var act = actions[context];
                if (act.setPiMode) act.setPiMode(false);
            }
        }
        else if(event === 'sendToPlugin') {
            var piEvent = jsonPayload['piEvent'];

            if (piEvent === 'valueChanged') {
                if (context in actions) {
                    var act = actions[context];
                    act.getSettings()["frompi"] = 1;
                    if (act.clearImages)
                        act.clearImages();
                    CleanVars();
                    if (STREAMING_ACTIVE) InitializeStream();
                    for( var ctx in actions){
                        var act = actions[ctx];
                        var gsimvars = actions[context].getSimVars();
                        for (let i = 0; i < gsimvars.length; i++){
                            var getvar = {"var":gsimvars[i],"value":0.0};
                            AddVar(getvar);
                        }    
                    }
                }
            }
        }
        else{
            // console.info("received unknown event: " + event);
        }
    };

    function InitScriptEvt(evt, scrrequestObj) {
        if (evt && (evt.includes('(>S:') || (evt.includes('(>K:') && evt.includes('-')))) {
            var toAdd = { "code": evt };
            scrrequestObj.inits.push(toAdd);
        }
    }
 
    function AddVar(inGetvar){
        if (inGetvar.var.length > 0 && !inGetvar.var.includes(":,")){
            // console.info("add " + inGetvar.var);
            if (inGetvar.var.includes(", String") || inGetvar.var.includes("%!") || inGetvar.var.includes("'") || inGetvar.var.includes("(STRARR")){
                if (!(inGetvar.var in simstringvars))
                {
                    // console.info("add string " + inGetvar.var + " " + simstringvars.length);
                    simstringvars[inGetvar.var] = "";
                    mainLoopRequestObj.getstringvars.push(inGetvar);
                    // console.info("done add ");
                    // currentVarIndex++;
                }
            } else{
                // console.info("add " + inGetvar.var + " " + simvars.length);
                if (!(inGetvar.var in simvars))
                {
                    simvars[inGetvar.var] = inGetvar.value;
                    mainLoopRequestObj.getvars.push(inGetvar);
                    // console.info("done add ");
                    // currentVarIndex++;
                }
            }
        }
    }
    
    function AddPullVar(inGetvar){
        if (inGetvar.var.length > 0 && !inGetvar.var.includes(":,")){
            // console.info("add " + inGetvar.var);
            if (inGetvar.var.includes(", String") || inGetvar.var.includes("%!") || inGetvar.var.includes("'") || inGetvar.var.includes("(STRARR")){
                if (!(inGetvar.var in simstringvars))
                {
                    // console.info("add string " + inGetvar.var + " " + simstringvars.length);
                    simstringvars[inGetvar.var] = "";
                    mainLoopRequestObj.pullstringlvars.push(inGetvar);
                    // console.info("done add ");
                    // currentVarIndex++;
                }
            } else{
                // console.info("add " + inGetvar.var + " " + simvars.length);
                if (!(inGetvar.var in simvars))
                {
                    simvars[inGetvar.var] = inGetvar.value;
                    mainLoopRequestObj.pulllvars.push(inGetvar);
                    // console.info("done add ");
                    // currentVarIndex++;
                }
            }
        }
    }

    function RemoveVar(inGetvar){
        if (inGetvar.var.length > 0 && inGetvar.var.includes(",") && !inGetvar.var.includes("A:var")  && !inGetvar.var.includes(":,")){
            // console.info("remove " + inGetvar.var);
            if (inGetvar.var in simvars)
            {
                var vrcnt = 0;
                for( var ctx in actions){
                    var act = actions[ctx];
                    var settings = act.getSettings();
                    var gsimvars = act.getSimVars();
                    for (let i = 0; i < gsimvars.length; i++){
                        if(gsimvars[i] === inGetvar.var) {
                            vrcnt++;
                            break;
                        }
                    }
                }
                if (vrcnt == 1){
                    delete simvars[inGetvar.var];
                    for (var vi = 0; vi < mainLoopRequestObj.getvars.length; vi++){
                        if (mainLoopRequestObj.getvars[vi].var === inGetvar.var){
                            mainLoopRequestObj.getvars.splice(vi, 1);
                            // console.info("done remove ");
                            break;
                        }                        
                    }
                    for (var vi = 0; vi < mainLoopRequestObj.pulllvars.length; vi++){
                        if (mainLoopRequestObj.pulllvars[vi].var === inGetvar.var){
                            mainLoopRequestObj.pulllvars.splice(vi, 1);
                            // console.info("done remove ");
                            break;
                        }                        
                    }
                }

            } else{
                if (inGetvar.var in simstringvars)
                {
                    var vrcnt = 0;
                    for( var ctx in actions){
                        var act = actions[ctx];
                        var settings = act.getSettings();
                        var gsimvars = act.getSimVars();
                        for (let i = 0; i < gsimvars.length; i++){
                            if(gsimvars[i] === inGetvar.var) {
                                vrcnt++;
                                break;
                            }
                        }    
                    }
                    if (vrcnt == 1){
                        delete simstringvars[inGetvar.var];
                        for (var vi = 0; vi < mainLoopRequestObj.getstringvars.length; vi++){
                            if (mainLoopRequestObj.getstringvars[vi].var === inGetvar.var){
                                mainLoopRequestObj.getstringvars.splice(vi, 1);
                                //console.info("done remove ");
                                break;
                            }
                        }
                        for (var vi = 0; vi < mainLoopRequestObj.pullstringlvars.length; vi++){
                            if (mainLoopRequestObj.pullstringlvars[vi].var === inGetvar.var){
                                mainLoopRequestObj.pullstringlvars.splice(vi, 1);
                                //console.info("done remove ");
                                break;
                            }
                        }
                    }
                    // else{
                    //    console.info("wait remove " + vrcnt);
                    //}
                }
            }
            // var releaseRequestObj = {};
            // releaseRequestObj.releasevars = [];
            // releaseRequestObj.releasevars.push(inGetvar);
            // var relxhttp = new XMLHttpRequest();
            // var relurl = encodeURI(AAO_URL + "?json=" + JSON.stringify(releaseRequestObj));
            // relurl = relurl.replace(/\+/g, '%2B');
            // relxhttp.open("POST", relurl);
            // relxhttp.send();
        }
    }

    function CleanVars(){
        // writeToLog("clean");
        mainLoopRequestObj = {};
        mainLoopRequestObj.getvars = [];
        mainLoopRequestObj.getstringvars = [];
        mainLoopRequestObj.pulllvars = [];
        mainLoopRequestObj.pullstringlvars = [];
        simvars = {};
        simstringvars = {};
    }

    this.startDataLoop = function (){
        if (dataLoopHandle) AAOclearIntervalESD(dataLoopHandle);
        bulkInitArmed = true;
        BulkInit();
        dataLoopHandle = AAOsetIntervalESD(DataLoop,REFRESH_MS);
        dataLoopActive = true;
        dataLoopArmed = true;
    }

    this.stopDataLoop = function (){
        dataLoopActive = false;
        if (connActCtx) {
            setState (connActCtx, 0);
            connState = false;
        }
        if (dataLoopHandle) AAOclearIntervalESD(dataLoopHandle);
    }
    
    function BulkInit(){
        bulkInitArmed = false;
        if (bulkInitScript && bulkInitScript.length > 0){
            var bulkRequestObj = {"scripts":[{"code":""}]};
            bulkRequestObj.scripts[0].code = bulkInitScript;
            // console.info(bulkInitScript);
            var url = encodeURI(AAO_URL + "?json=" + JSON.stringify(bulkRequestObj));
            url = url.replace(/\+/g, '%2B').replace(/&/g, '%26').replace(/#/g, '%23');
            var bulkxhttp = new XMLHttpRequest();
            bulkxhttp.open("GET", url);
            bulkxhttp.send();
        }
    };
    
    function FireKeyUp(){
        let lend = keyUpActions.length;
        for (let i = 0; i < lend; i++){
            keyUpActions[0].onKeyUp(0, 0, 0, 0, 0);
            keyUpActions.splice(0, 1)
        }
        
    };

    function DataLoop(){
        if (!dataLoopArmed){
            loopRecoveryNum++;
            if (loopRecoveryNum > 25){
                dataLoopArmed = true;
            }
        }
        if ((!bulkInitArmed) && dataLoopActive && dataLoopArmed)
        {
            loopRecoveryNum = 0;
            dataLoopArmed = false;
            var millis = Date.now() - lastUpdate;
            if (millis < 80){
                // writeToLog("DataLoop too fast " + millis);
                // if (millis < 10){
                //    if (dataLoopHandle) AAOclearIntervalESD(dataLoopHandle);
                //    dataLoopHandle = AAOsetIntervalESD(DataLoop,REFRESH_MS);
                //}
                return;
            }
            lastUpdate = Date.now();
            
            var url = encodeURI(AAO_URL);
            var dataxhttp = new XMLHttpRequest();
            dataxhttp.timeout = 500;
            dataxhttp.addEventListener("load", dataRequestListener);
            dataxhttp.addEventListener("error", dataRequestError);
            // dataxhttp.addEventListener("timeout", dataRequestError);
            dataxhttp.open("POST", url, true);
            dataxhttp.send(JSON.stringify(mainLoopRequestObj));
            
            loopNum++;

            millis = Date.now() - lastRepeat;
            if (repeating && (millis > REPEAT_MS)) {
                lastRepeat = Date.now();
                RepeatAction();
            }    
            millis = Date.now() - longclickStart;
            if (longclickarmed && (millis > longclickTimout)) {
                LongClickAction();
            }
            if (lastAppear != 0 && actionsComplete == false){
                millis = Date.now() - lastAppear;
                if (millis > 250){
                    actionsComplete = true;
                    // Initialize images
                    if (STREAMING_ACTIVE){
                        InitializeStream();
                    }
                }
            }
        }
        
    };

    function dataRequestListener(){
        if (loopNum > 5){
            loopNum = 0;
            if (dataLoopActive && !connState){
                if (connActCtx) setState (connActCtx, 1);
                if (STREAMING_ACTIVE) AAOsetTimeoutESD(InitializeStream, 2000);
                connState = true;
            }
        }
        dataLoopArmed = true;
        var commObj = JSON.parse(this.responseText);
        var i;
        var currentProfileId = null;
        if (commObj.getvars){
            for (i = 0; i < commObj.getvars.length; i++){
                if (commObj.getvars[i].var in simvars){
                    simvars[commObj.getvars[i].var] = commObj.getvars[i].value;
                }
            }
        }
        if (commObj.getstringvars){
            for (i = 0; i < commObj.getstringvars.length; i++){
                simstringvars[commObj.getstringvars[i].var] = commObj.getstringvars[i].value;
            }
        }
        if (commObj.pulllvars){
            for (i = 0; i < commObj.pulllvars.length; i++){
                if (commObj.pulllvars[i].var in simvars){
                    simvars[commObj.pulllvars[i].var] = commObj.pulllvars[i].value;
                }
            }
        }
        if (commObj.pullstringlvars){
            for (i = 0; i < commObj.pullstringlvars.length; i++){
                simstringvars[commObj.pullstringlvars[i].var] = commObj.pullstringlvars[i].value;
            }
        }
        for( var ctx in actions){
            var act = actions[ctx];
            var settings = act.getSettings();
            if (settings["updateAction"] && act.onUpdate){
                act.onUpdate();
            }
            if (STREAMING_ACTIVE && act.profileID){
                let newProf = act.profileID();
                if (newProf && newProf.length > 0)
                    currentProfileId = newProf;
            }
            var stateCtr = settings["statectr"] + 1;
            // if (act.dynamicTitle){
            //    if (act.dynamicTitle(simvars, simstringvars) || (STREAMING_ACTIVE && stateCtr > 10)){
            //        setTitle(ctx, act.getTitleString());
            //        if (STREAMING_ACTIVE){
            //                streamButtonTitle(act.getCoords(), act.getTitle());
            //        }
            //    }
            // }
            if (settings["multivar"]){
                if (act.drawButton){
                    if (act.drawButton(simvars, simstringvars) || (STREAMING_ACTIVE && stateCtr > 10)){
                        stateCtr = 0;
                        setPicture (ctx, act.getImageData(), act.getCoords() );
                        if (STREAMING_ACTIVE){
                            streamPicture (act.getImageData(), act.getCoords() );
                            streamButtonTitle(act.getCoords(), act.getTitle());
                        }
                    }
                }
            }
            else {
                var simvar = settings["simvar"];
                var simVal = 0;
                var lastVal = 0;
                if (simvar && simvar.length > 0){
                    if (simvar in simvars)
                        simVal = simvars[simvar];
                    if (simvar in simstringvars)
                        simVal = simstringvars[simvar];
                    lastVal = settings["lastValue"];
                    settings["lastValue"] = simVal;
                }
                simvar = settings["altsimvar"];
                var altsimVal = 0;
                var altlastVal = 0;
                if (simvar && simvar.length > 0){
                    if (simvar in simvars)
                        altsimVal = simvars[simvar];
                    if (simvar in simstringvars)
                        altsimVal = simstringvars[simvar];
                    altlastVal = settings["lastAltValue"];
                    settings["lastAltValue"] = altsimVal;
                }
                simvar = settings["alttwosimvar"];
                var altTwosimVal = 0;
                var altTwolastVal = 0;
                if (simvar && simvar.length > 0){
                    if (simvar in simvars)
                        altTwosimVal = simvars[simvar];
                    if (simvar in simstringvars)
                        altTwosimVal = simstringvars[simvar];
                    altTwolastVal = settings["lastAltTwoValue"];
                    settings["lastAltTwoValue"] = altTwosimVal;
                }
                simvar = settings["altcolorvar"];
                if (simvar && simvar.length > 0){
                    if (simvar in simstringvars)
                        settings["altcolor"] = simstringvars[simvar];
                }    
                simvar = settings["onsimvar"];
                var onsimVal = 0;
                var onlastVal = 0;
                if (simvar && simvar.length > 0){
                    onsimVal = simvars[simvar];
                    onlastVal = settings["lastOnValue"];
                    settings["lastOnValue"] = onsimVal;
                }
                
                if (act.drawButton){
                    if (act.drawButton() || (STREAMING_ACTIVE && stateCtr > 10)){
                        stateCtr = 0;
                        setPicture (ctx, act.getImageData(), act.getCoords());
                        if (STREAMING_ACTIVE){
                            streamPicture (act.getImageData(), act.getCoords() );
                            streamButtonTitle(act.getCoords(), act.getTitle());
                        }
                    }
                }
                else{
                    if (act.drawIcon){
                        let iconOut = act.drawIcon(simvars, simstringvars);
                        let valueOut = act.getStripValue();
                        let indicatorOut = act.getIndicator();
                        if (iconOut || valueOut || indicatorOut){
                            setFeedback(ctx, iconOut, act.getImageData(), valueOut, act.getStripValueString(), indicatorOut, act.getIndicatorValue());
                            if (STREAMING_ACTIVE){
                                streamPicture (act.getFeedbackData(), act.getCoords() );
                                streamButtonTitle(act.getCoords(), act.getTitle());
                            }
                        }
                    } else{
                        if (act.drawCanvas){
                            if (act.drawCanvas(simvars, simstringvars)){
                                setFeedbackCanvas(ctx, act.getImageData());
                                if (STREAMING_ACTIVE){
                                    streamPicture (act.getImageData(), act.getCoords() );
                                }
                            }
                        } else{
                            if ((lastVal != simVal) || (altlastVal != altsimVal) || (altTwolastVal != altTwosimVal) || (onlastVal != onsimVal)){
                                settings["cursimval"] = simVal;
                                requestSettings(ctx);
                            }
                        }
                    }
                    
                }
            }
            settings["statectr"] = stateCtr;
        }
    };
    
    function dataRequestError(){
        // writeToLog("DataLoop error, loop terminated");
        // console.log("DataLoop error, loop terminated");
        if (connActCtx) {
            setState (connActCtx, 0);
            connState = false;
        }
        if (dataLoopHandle) AAOclearIntervalESD(dataLoopHandle);
    }

    function setState(inContext, inState) {
        if (websocket) {
            var json = {
                'event': 'setState',
                'context': inContext,
                'payload': {
                    'state': inState
                }
            };

            websocket.send(JSON.stringify(json));
        }
    }
    
    function setTitle(inContext, inTitle) {
        if (websocket) {
            var json = {
                'event': 'setTitle',
                'context': inContext,
                'payload': {
                    'title': inTitle
                }
            };

            websocket.send(JSON.stringify(json));
        }
    }

    function setPicture(inContext, inPic, coords) {
        if (websocket) {
            var json = {
                'event': 'setImage',
                'context': inContext,
                'payload': {
                    'image': inPic,
                    'target': 0
                }
            };
            websocket.send(JSON.stringify(json));
        }
    }

    function setFeedback(inContext, drawIcon, iconData, drawValue, valueStr, drawIndicator, indVal) {
        if (websocket) {
            var payloadData = {};
            if (drawIcon){
                payloadData.icon = iconData
            }
            if (drawValue){
                payloadData.value = valueStr
            }
            if (drawIndicator){
                payloadData.indicator = { value: indVal, opacity: 1, enabled: true };
            }
            else{
                payloadData.indicator = false;
            }
            var json = {
                'event': 'setFeedback',
                'context': inContext,
                'payload': payloadData
            };
            websocket.send(JSON.stringify(json));
        }
    }
    
        function setFeedbackCanvas(inContext, imageData) {
        if (websocket) {
            var json = {
                'event': 'setFeedback',
                'context': inContext,
                'payload': {
                    'full-canvas': imageData
                }
            };
            websocket.send(JSON.stringify(json));
        }
    }

    function setFeedbackValue(inContext, valText) {
        if (websocket) {
            var json = {
                'event': 'setFeedback',
                'context': inContext,
                'payload': {
                    'indicator': false,
                    'value': valText
                }
            };

            websocket.send(JSON.stringify(json));
        }
    }

     
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

    function requestSettings(inUUID) {
        if (websocket) {
            const json = {
                'event': 'getSettings',
                'context': inUUID
             };
             websocket.send(JSON.stringify(json));
        }
    }
     
     // Set data to PI
    function sendToPropertyInspector(inAction, inContext, inData) {
        if (websocket) {
            var json = {
                'action': inAction,
                'event': 'sendToPropertyInspector',
                'context': inContext,
                'payload': inData
            };
            var act = actions[inContext];
            saveSettings(inAction, inContext, act.getSettings());
            websocket.send(JSON.stringify(json));
        }
    }
    
    function switchToProfile(inContext, inDevice, profname) {
        if (websocket) {
            var json = {
                'event': 'switchToProfile',
                'context': inContext,
                'device': inDevice,
                'payload': {
                    'profile': profname
                }
            };

            websocket.send(JSON.stringify(json));
        }
    }

    function writeToLog(logtext){
         var json = {
            "event": "logMessage",
            "payload": { "message" : logtext }
        };

        websocket.send(JSON.stringify(json));
     };

    function RepeatAction() {
        if (repcontext && repcontext in actions) {
            if (actions[repcontext].onKeyRepeat)
            {
                actions[repcontext].onKeyRepeat();
                return;
            }
            if (actions[repcontext].onKeyUp)
                actions[repcontext].onKeyUp(repcontext, repsettings, repcoordinates, repuserDesiredState, repstate);
            if (actions[repcontext].onKeyDown)
                actions[repcontext].onKeyDown(repcontext, repsettings, repcoordinates, repuserDesiredState, repstate);
            // writeToLog("repeat");
        }
    }

    function LongClickAction() {
        if (lccontext && lccontext in actions) {
            var laction = actions[lccontext];
            var lsettings = laction.getSettings();
            if (laction.onLongClick)
            {
                laction.onLongClick();
                longclickfired = true;
                if (lsettings["repeatAction"] && lsettings["repeatAction"] === '1'){
                    longclickStart = Date.now();
                    longclickTimout = REPEAT_MS;
                    longclickarmed = true;
                } else{
                    longclickarmed = false;
                }
            }
        }
    }
    
    function InitializeStream(){
        console.log("InitializeStream");
        if (deviceIndex >= 0){
            let profileID = "";
            let drequestObj = {};
            drequestObj.setstringvars = [];
            drequestObj.files = [];
            for (var col = 0; col < 8; col++){
                for (var row = 0; row < 4; row++){
                    var coords = "" + col + "_" + row;
                    var dtosend = {};
                    var imgSet = false;
                    var kdSet = false;
                    for( var ctx in actions){
                        var action = actions[ctx];
                        if (profileID === "")
                            profileID = action.profileID();
                        if (action.getCoords() === coords){
                            if (action.drawButton || action.drawCanvas || action.drawIcon){
                                imgSet = true;
                                if (action.drawButton){
                                    dtosend = { "var": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + col + "_" + row + ", String)","value": action.getImageData().substr(22) };
                                    drequestObj.setstringvars.push(dtosend);
                                }
                            } else{
                                let cnt = "WebPages/aaostreamdeck/buttonOff.png";
                                if (action.md5)
                                    cnt = "WebPages/aaostreamdeck/images/" + action.md5(0) + ".png";
                                imgSet = true;
                                dtosend = { "lvar": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + col + "_" + row + ", String)","base64": cnt };
                                drequestObj.files.push(dtosend);
                            }
                            if (action.keyDownScript){
                                kdSet = true;
                                dtosend = { "var": "(L:SD_ACTION_" + deviceIndex + "_" + col + "_" + row + ", String)","value": action.keyDownScript() };
                                drequestObj.setstringvars.push(dtosend);
                            }
                            dtosend = {"var": "(L:SD_ACTION_TITLE_" + deviceIndex + "_" + col + "_" + row + ", String)","value":action.getTitle().replaceAll('\n', '/N') };
                            drequestObj.setstringvars.push(dtosend);
                            break;
                        }
                    }
                    if (!imgSet){
                        var cnt = "WebPages/aaostreamdeck/images/" + md5("" + profileID + coords) + ".png";
                        dtosend = { "lvar": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + coords + ", String)","base64": cnt };
                        drequestObj.files.push(dtosend);
                    }
                }
            }
            let dxhttp = new XMLHttpRequest();
            let durl = encodeURI(STREAM_TO_URL);
            dxhttp.open("POST", durl, true);
            dxhttp.send(JSON.stringify(drequestObj));
        }
    }
    
    function CleanAllImages(){
        if (deviceIndex >= 0){
            let drequestObj = {};
            drequestObj.setstringvars = [];
            console.log("CleanAllImages");
            for (var col = 0; col < 8; col++){
                for (var row = 0; row < 4; row++){
                    var coords = "" + deviceIndex + "_" + col + "_" + row;
                    var dtosend = {"var": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + col + "_" + row + ", String)","value":EMPTY_ACTION};
                    drequestObj.setstringvars.push(dtosend);
                    if (row == 0 && col < 4){
                        dtosend = {"var": "(L:SD_ACTION_IMG_" + deviceIndex + "_R" + col + "_" + row + ", String)","value":EMPTY_STRIP};
                        drequestObj.setstringvars.push(dtosend);
                        dtosend = {"var": "(L:SD_ACTION_TITLE_" + deviceIndex + "_R" + col + "_" + row + ", String)","value":"" };
                        drequestObj.setstringvars.push(dtosend);
                    }
                    dtosend = {"var": "(L:SD_ACTION_TITLE_" + deviceIndex + "_" + col + "_" + row + ", String)","value":"" };
                    drequestObj.setstringvars.push(dtosend);
                    dtosend = {"var": "(L:SD_ACTION_" + deviceIndex + "_" + col + "_" + row + ", String)","value":"" };
                    drequestObj.setstringvars.push(dtosend);
                }
            }
            let dxhttp = new XMLHttpRequest();
            let durl = encodeURI(STREAM_TO_URL);
            dxhttp.open("POST", durl, true);
            dxhttp.send(JSON.stringify(drequestObj));
        }
    }
    
    function streamPicture(inPic, coords) {
        if (deviceIndex >= 0){
            let requestObj = {};
            requestObj.setstringvars = [];
            let tosend = { "var": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + coords + ", String)","value": inPic.substr(22) };
            requestObj.setstringvars.push(tosend);
            let relxhttp = new XMLHttpRequest();
            let relurl = encodeURI(STREAM_TO_URL);
            relxhttp.open("POST", relurl, true);
            relxhttp.send(JSON.stringify(requestObj));
        }
    }
    
    function streamButtonState(coords, inState, action) {
        if (deviceIndex >= 0){
            let cnt = "WebPages/aaostreamdeck/buttonOff.png";
            if (inState){
                cnt = "WebPages/aaostreamdeck/buttonOnGreen.png";
            }
            if (action.md5)
                cnt = "WebPages/aaostreamdeck/images/" + action.md5(inState) + ".png";
            let tosend = { "lvar": "(L:SD_ACTION_IMG_" + deviceIndex + "_" + coords + ", String)","base64": cnt };
            let requestObj = {};
            requestObj.files = [];
            requestObj.files.push(tosend);
            let relxhttp = new XMLHttpRequest();
            let relurl = encodeURI(STREAM_TO_URL);
            relxhttp.open("POST", relurl, true);
            relxhttp.send(JSON.stringify(requestObj));
        }
    }
    
    function streamButtonTitle(coords, titleStr) {
        if (deviceIndex >= 0){
            let requestObj = {};
            requestObj.setstringvars = [];
            var tosend = {"var": "(L:SD_ACTION_TITLE_" + deviceIndex + "_" + coords + ", String)","value":titleStr.replaceAll('\n', '/N') };
            requestObj.setstringvars.push(tosend);
            let relxhttp = new XMLHttpRequest();
            let relurl = encodeURI(STREAM_TO_URL);
            relxhttp.open("POST", relurl, true);
            relxhttp.send(JSON.stringify(requestObj));
        }
    }
    
    function streamKeyDown(keyDownCode, coords) {
        if (deviceIndex >= 0){
            let requestObj = {};
            requestObj.setstringvars = [];
            let tosend = { "var": "(L:SD_ACTION_" + deviceIndex + "_" + coords + ", String)","value": keyDownCode };
            requestObj.setstringvars.push(tosend);
            let relxhttp = new XMLHttpRequest();
            let relurl = encodeURI(STREAM_TO_URL);
            relxhttp.open("POST", relurl, true);
            relxhttp.send(JSON.stringify(requestObj));
        }
    }
}
