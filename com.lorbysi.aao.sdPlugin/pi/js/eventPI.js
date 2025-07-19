function EventPI(inContext, inStreamDeckVersion, inPluginVersion) {
    var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

    var cnt = "<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Key Down event</div> \
					<select class='sdpi-item-value select' id='evttype'> \
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
					 <textarea type='textarea' width='80' id='simevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Event value</div> \
					<input class='sdpi-item-value' id='onevtval' value=''> \
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
					<div class='sdpi-item-label'>Key Up event</div> \
					<select class='sdpi-item-value select' id='upevttype'> \
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
					 <textarea type='textarea' width='80' id='upsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Event value</div> \
					<input class='sdpi-item-value' id='upevtval' value=''> \
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

	var evtStr = settings["simevt"];
	if (evtStr){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('evttype').value = evtStr.substr(0,compos);
		document.getElementById('simevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
	}
	
	evtStr = settings["onevtval"];
	if (evtStr){
		document.getElementById('onevtval').value = settings["onevtval"];
	}
	
	evtStr = settings["upsimevt"];
	if (evtStr){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('upevttype').value = evtStr.substr(0,compos);
		document.getElementById('upsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('upevtval').value = settings["upevtval"];
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
	    settings["simevt"] = document.getElementById('evttype').value + document.getElementById('simevt').value.replace(/·/g, ' ') + ")";
	    settings["onevtval"] = document.getElementById('onevtval').value;
		let vvarStr = document.getElementById('longsimevt').value;
		if (vvarStr && vvarStr.length > 0){
			settings["longsimevt"] = document.getElementById('longevttype').value + document.getElementById('longsimevt').value.replace(/·/g, ' ') + ")";
		} else{
			settings["longsimevt"] = null;
		}
		vvarStr = document.getElementById('longupsimevt').value;
		if (vvarStr && vvarStr.length > 0){
			settings["longupsimevt"] = document.getElementById('longupevttype').value + document.getElementById('longupsimevt').value.replace(/·/g, ' ') + ")";
		} else{
			settings["longupsimevt"] = null;
		}
		settings["longclicktimeout"] = document.getElementById('lptimeout').value;
		settings["repeatAction"] = document.getElementById('cbrepeat').value;
		let uvarStr = document.getElementById('upsimevt').value;
		if (uvarStr && uvarStr.length > 0){
			settings["upsimevt"] = document.getElementById('upevttype').value + document.getElementById('upsimevt').value.replace(/·/g, ' ') + ")";
			settings["upevtval"] = document.getElementById('upevtval').value;
		} else{
			settings["upsimevt"] = null;
			settings["upevtval"] = 0;
		}
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
