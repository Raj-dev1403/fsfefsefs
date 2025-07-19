function DualEventPI(inContext, inStreamDeckVersion, inPluginVersion) {
        var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

    var cnt = "<div class='sdpi-item'> \
					<div class='sdpi-item-label'>ON event</div> \
					<select class='sdpi-item-value select' id='onevttype'> \
						<option value='(>K:'>K:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>H:'>H:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>A:'>A:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>S:'>S:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>B:'>B:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>CMD:'>CMD:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='onsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>ON value</div> \
					<input class='sdpi-item-value' id='onevtval' value=''> \
			   </div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>OFF event</div> \
					<select class='sdpi-item-value select' id='offevttype'> \
						<option value='(>K:'>K:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>H:'>H:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>A:'>A:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>S:'>S:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>B:'>B:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>CMD:'>CMD:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='offsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>OFF value</div> \
					<input class='sdpi-item-value' id='offevtval' value=''> \
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
					<div class='sdpi-item-label'>Long press down</div> \
					<select class='sdpi-item-value select' id='longevttype'> \
						<option value='(>K:'>K:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>H:'>H:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>A:'>A:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>S:'>S:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>B:'>B:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>CMD:'>CMD:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='longsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>LP after ms</div> \
					<input type='number' id='lptimeout' value='750' />\
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Long press up</div> \
					<select class='sdpi-item-value select' id='longupevttype'> \
						<option value='(>K:'>K:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>H:'>H:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>A:'>A:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>S:'>S:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>B:'>B:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(>CMD:'>CMD:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='longupsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <hr> \
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

	var evtStr = settings["onsimevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('onevttype').value = evtStr.substr(0,compos);
		document.getElementById('onsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('onevtval').value = settings["onevtval"];	
	} else {
      document.getElementById('onevttype').value = "(>K:";
    }
    evtStr = settings["offsimevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('offevttype').value = evtStr.substr(0,compos);
		document.getElementById('offsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('offevtval').value = settings["offevtval"];	
    } else {
      document.getElementById('offevttype').value = "(>K:";
    }
	
	evtStr = settings["longsimevt"];
	if (evtStr){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('longevttype').value = evtStr.substr(0,compos);
		document.getElementById('longsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
	}
	evtStr = settings["longclicktimeout"];
	if (evtStr){
		document.getElementById('lptimeout').value = evtStr;
	}
	evtStr = settings["longupsimevt"];
	if (evtStr){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('longupevttype').value = evtStr.substr(0,compos);
		document.getElementById('longupsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
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
	   settings["onsimevt"] = document.getElementById('onevttype').value + document.getElementById('onsimevt').value.replace(/·/g, ' ') + ")";
	   settings["onevtval"] = document.getElementById('onevtval').value;	
	   settings["offsimevt"] = document.getElementById('offevttype').value + document.getElementById('offsimevt').value.replace(/·/g, ' ') + ")";
	   settings["offevtval"] = document.getElementById('offevtval').value;	
	   	var varStr = document.getElementById('longsimevt').value;
		if (varStr && varStr.length > 0){
			settings["longsimevt"] = document.getElementById('longevttype').value + document.getElementById('longsimevt').value.replace(/·/g, ' ') + ")";
		} else{
			settings["longsimevt"] = null;
		}
		varStr = document.getElementById('longupsimevt').value;
		if (varStr && varStr.length > 0){
			settings["longupsimevt"] = document.getElementById('longupevttype').value + document.getElementById('longupsimevt').value.replace(/·/g, ' ') + ")";
		} else{
			settings["longupsimevt"] = null;
		}
		settings["repeatAction"] = document.getElementById('cbrepeat').value;
		settings["longclicktimeout"] = document.getElementById('lptimeout').value;
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
