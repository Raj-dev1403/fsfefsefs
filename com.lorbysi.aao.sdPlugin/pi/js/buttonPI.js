function ButtonPI(inContext, inStreamDeckVersion, inPluginVersion) {
    var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

    var cnt = "<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Device ID</div> \
					<input class='sdpi-item-value' id='deviceid' value='433'> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Channel</div> \
					<input class='sdpi-item-value' id='channel' value='0'> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Button</div> \
					<input class='sdpi-item-value' id='button' value='0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Button Long Press</div> \
					<input class='sdpi-item-value' id='lpbutton' value=''> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>LP after ms</div> \
					<input type='number' id='lptimeout' value='750' />\
				</div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Repeat</div> \
					<select class='sdpi-item-value select' id='cbrepeat'> \
						<option value='1'>Yes&nbsp;&nbsp;</option> \
						<option value='0'>No</option> \
					</select> \
					<label><span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Autoscript</div> \
                    <select class='sdpi-item-value select' id='autoscripttype'> \
						<option value='K:'>K:&nbsp;&nbsp;&nbsp;</option> \
						<option value='S:'>S:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='autoscript' value=''></textarea> \
					 </span> \
				</div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Auto Rate</div> \
					<select class='sdpi-item-value select' id='cbauto'> \
						<option value='1'>Fast&nbsp;&nbsp;</option> \
						<option value='0'>Slow</option> \
                        <option value='2'>One Shot</option> \
					</select> \
					<label><span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> \
				</div> \
			   <hr> \
			    <div class='sdpi-item'> \
				    <div class='sdpi-item-label'>Save changes</div> \
					<button class='sdpi-item-value' id='submitbtn' accesskey='s'>Submit (Alt+S)</button> \
				</div>";

    document.getElementById('placeholder').innerHTML = cnt;
	
	if (settings["repeatAction"] == null){
		document.getElementById('cbrepeat').value = '1';
	} else{
		document.getElementById('cbrepeat').value = settings["repeatAction"];
	}

	document.getElementById('deviceid').value = settings["deviceid"];
	document.getElementById('channel').value = settings["channel"];
	document.getElementById('button').value = settings["button"];
	var evtStr = settings["longsimevt"];
	if (evtStr){
		document.getElementById('lpbutton').value = evtStr;
	}
	evtStr = settings["longclicktimeout"];
	if (evtStr){
		document.getElementById('lptimeout').value = evtStr;
	}
	evtStr = settings["updateAction"];
	if (evtStr){
		document.getElementById('autoscript').value = evtStr;
	}
    if (settings["updateType"]){
        document.getElementById('autoscripttype').value = settings["updateType"];
    }
	if (settings["updateFast"]){
		document.getElementById('cbauto').value = settings["updateFast"];
	} else {
		document.getElementById('cbauto').value = '0';
	}
    document.getElementById('submitbtn').addEventListener('click', valuesChanged);

    function valuesChanged(inEvent) {
		settings["deviceid"] = document.getElementById('deviceid').value;
		settings["channel"] = document.getElementById('channel').value;
		settings["button"] = document.getElementById('button').value;
		var varStr = document.getElementById('lpbutton').value;
		if (varStr && varStr.length > 0){
			settings["longsimevt"] = document.getElementById('lpbutton').value;
		} else{
			settings["longsimevt"] = null;
		}
		settings["longclicktimeout"] = document.getElementById('lptimeout').value;
		settings["repeatAction"] = document.getElementById('cbrepeat').value;
		var attsStr = document.getElementById('autoscript').value;
		if (attsStr && attsStr.length > 0){
            settings["updateType"] = document.getElementById('autoscripttype').value
			settings["updateAction"] = attsStr.replace(/·/g, ' ');
			settings["updateFast"] = document.getElementById('cbauto').value;
		} else{
            settings["updateType"] = null;
			settings["updateAction"] = null;
			settings["updateFast"] = 0;
		}
		settings["frompi"] = 1;
        instance.saveSettings();
        // instance.sendToPlugin({ 'piEvent': 'valueChanged' });
    }
}
