function TextGaugePI(inContext, inStreamDeckVersion, inPluginVersion) {
    var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

	var cnt = "\
				<div class='sdpi-heading sdpi-collapser'>Variable 1</div> \
				<div>\
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Variable 1</div> \
						<select class='sdpi-item-value select' id='vartype'> \
							<option value='(A:'>A:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(P:'>P:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(E:'>E:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(B:'>B:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(DREF:'>DREF:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(PMDG:'>PMDG:&nbsp;&nbsp;&nbsp;</option> \
                            <option value='(TXT:'>TXT:&nbsp;&nbsp;&nbsp;</option> \
						</select> \
						<span class='sdpi-item-value textarea'> \
						 <textarea type='textarea' width='80' id='simvar' value=''></textarea> \
						 </span> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Offset</div> \
						<input type='number' id='varoffset'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Multiplier</div> \
						<input type='number' id='multiplier'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Decimals</div> \
						<select class='sdpi-item-value select' id='fractions'> \
							<option value=0>0&nbsp;&nbsp;&nbsp;</option> \
							<option value=1>1&nbsp;&nbsp;&nbsp;</option> \
							<option value=2>2&nbsp;&nbsp;&nbsp;</option> \
							<option value=3>3&nbsp;&nbsp;&nbsp;</option> \
							<option value=4>4&nbsp;&nbsp;&nbsp;</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Leading 0s</div> \
						<input type='number' id='simvarpad'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift X</div> \
						<input type='number' id='xshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift Y</div> \
						<input type='number' id='yshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font</div> \
						<select class='sdpi-item-value select' id='fonts'> \
							<option value='serif'>Serif</option> \
							<option value='Arial'>Arial</option> \
							<option value='Arial Black'>Arial Black</option> \
							<option value='Comic Sans MS'>Comic Sans MS</option> \
							<option value='Courier'>Courier</option> \
							<option value='Courier New'>Courier New</option> \
							<option value='Digital'>Digital</option> \
							<option value='Georgia'>Georgia</option> \
							<option value='Impact'>Impact</option> \
							<option value='Microsoft Sans Serif'>Microsoft Sans Serif</option> \
							<option value='Quartz'>Quartz</option> \
							<option value='Symbol'>Symbol</option> \
							<option value='Tahoma'>Tahoma</option> \
							<option value='Times new Roman'>Times new Roman</option> \
							<option value='Trebuchet MS'>Trebuchet MS</option> \
							<option value='Verdana'>Verdana</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font Size</div> \
						<input type='number' id='fontsize'> \
					</div> \
					<div type='checkbox' class='sdpi-item'> \
						<div class='sdpi-item-label'>Style</div> \
						<div class='sdpi-item-value '> \
							<input id='cbBold' type='checkbox' value='bold'> \
							<label for='cbBold'><span></span>bold</label> \
							<input id='cbItalic' type='checkbox' value='italic'> \
							<label for='cbItalic'><span></span>italic</label> \
						</div> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Split Text</div> \
						<select class='sdpi-item-value select' id='cbsplit'> \
							<option value='1'>Yes&nbsp;&nbsp;</option> \
							<option value='0'>No</option> \
						</select> \
						<label><span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Min Width</div> \
						<input type='number' id='splitwidth'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Stretch Split</div> \
						<select class='sdpi-item-value select' id='cbstretch'> \
							<option value='1'>Yes&nbsp;&nbsp;</option> \
							<option value='0'>No</option> \
						</select> \
						<label><span></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label> \
					</div> \
					<div type='color' class='sdpi-item'> \
						<div class='sdpi-item-label'>Text Color</div> \
						<input type='color' class='sdpi-item-value' id='forecolor' value='#ffffff'> \
					</div> \
				</div>\
				<div class='sdpi-heading sdpi-collapser'>Variable 2</div> \
				<div>\
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Variable 2</div> \
						<select class='sdpi-item-value select' id='altvartype'> \
							<option value='(A:'>A:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(P:'>P:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(E:'>E:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(B:'>B:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(DREF:'>DREF:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(PMDG:'>PMDG:&nbsp;&nbsp;&nbsp;</option> \
                            <option value='(TXT:'>TXT:&nbsp;&nbsp;&nbsp;</option> \
						</select> \
						<span class='sdpi-item-value textarea'> \
						 <textarea type='textarea' width='80' id='altsimvar' value=''></textarea> \
						 </span> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Offset</div> \
						<input type='number' id='altoffset'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Multiplier</div> \
						<input type='number' id='altmultiplier'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Decimals</div> \
						<select class='sdpi-item-value select' id='altfractions'> \
							<option value=0>0&nbsp;&nbsp;&nbsp;</option> \
							<option value=1>1&nbsp;&nbsp;&nbsp;</option> \
							<option value=2>2&nbsp;&nbsp;&nbsp;</option> \
							<option value=3>3&nbsp;&nbsp;&nbsp;</option> \
							<option value=4>4&nbsp;&nbsp;&nbsp;</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Leading 0s</div> \
						<input type='number' id='altvarpad'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift X</div> \
						<input type='number' id='altxshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift Y</div> \
						<input type='number' id='altyshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font</div> \
						<select class='sdpi-item-value select' id='altfonts'> \
							<option value='serif'>Serif</option> \
							<option value='Arial'>Arial</option> \
							<option value='Arial Black'>Arial Black</option> \
							<option value='Comic Sans MS'>Comic Sans MS</option> \
							<option value='Courier'>Courier</option> \
							<option value='Courier New'>Courier New</option> \
							<option value='Digital'>Digital</option> \
							<option value='Georgia'>Georgia</option> \
							<option value='Impact'>Impact</option> \
							<option value='Microsoft Sans Serif'>Microsoft Sans Serif</option> \
							<option value='Quartz'>Quartz</option> \
							<option value='Symbol'>Symbol</option> \
							<option value='Tahoma'>Tahoma</option> \
							<option value='Times new Roman'>Times new Roman</option> \
							<option value='Trebuchet MS'>Trebuchet MS</option> \
							<option value='Verdana'>Verdana</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font Size</div> \
						<input type='number' id='altfontsize'> \
					</div> \
					<div type='checkbox' class='sdpi-item'> \
						<div class='sdpi-item-label'>Style</div> \
						<div class='sdpi-item-value '> \
							<input id='cbAltBold' type='checkbox' value='bold'> \
							<label for='cbAltBold'><span></span>bold</label> \
							<input id='cbAltItalic' type='checkbox' value='italic'> \
							<label for='cbAltItalic'><span></span>italic</label> \
						</div> \
					</div> \
					<div type='color' class='sdpi-item'> \
						<div class='sdpi-item-label'>Text Color</div> \
						<input type='color' class='sdpi-item-value' id='altforecolor' value='#ffffff'> \
					</div> \
				</div>\
				<div class='sdpi-heading sdpi-collapser'>Variable 3</div> \
				<div>\
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Variable 3</div> \
						<select class='sdpi-item-value select' id='alttwovartype'> \
							<option value='(A:'>A:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(P:'>P:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(E:'>E:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(B:'>B:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(DREF:'>DREF:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(PMDG:'>PMDG:&nbsp;&nbsp;&nbsp;</option> \
                            <option value='(TXT:'>TXT:&nbsp;&nbsp;&nbsp;</option> \
						</select> \
						<span class='sdpi-item-value textarea'> \
						 <textarea type='textarea' width='80' id='alttwosimvar' value=''></textarea> \
						 </span> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Offset</div> \
						<input type='number' id='alttwooffset'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Multiplier</div> \
						<input type='number' id='alttwomultiplier'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Decimals</div> \
						<select class='sdpi-item-value select' id='alttwofractions'> \
							<option value=0>0&nbsp;&nbsp;&nbsp;</option> \
							<option value=1>1&nbsp;&nbsp;&nbsp;</option> \
							<option value=2>2&nbsp;&nbsp;&nbsp;</option> \
							<option value=3>3&nbsp;&nbsp;&nbsp;</option> \
							<option value=4>4&nbsp;&nbsp;&nbsp;</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Leading 0s</div> \
						<input type='number' id='alttwovarpad'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift X</div> \
						<input type='number' id='alttwoxshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Shift Y</div> \
						<input type='number' id='alttwoyshift'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font</div> \
						<select class='sdpi-item-value select' id='alttwofonts'> \
							<option value='serif'>Serif</option> \
							<option value='Arial'>Arial</option> \
							<option value='Arial Black'>Arial Black</option> \
							<option value='Comic Sans MS'>Comic Sans MS</option> \
							<option value='Courier'>Courier</option> \
							<option value='Courier New'>Courier New</option> \
							<option value='Digital'>Digital</option> \
							<option value='Georgia'>Georgia</option> \
							<option value='Impact'>Impact</option> \
							<option value='Microsoft Sans Serif'>Microsoft Sans Serif</option> \
							<option value='Quartz'>Quartz</option> \
							<option value='Symbol'>Symbol</option> \
							<option value='Tahoma'>Tahoma</option> \
							<option value='Times new Roman'>Times new Roman</option> \
							<option value='Trebuchet MS'>Trebuchet MS</option> \
							<option value='Verdana'>Verdana</option> \
						</select> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>Font Size</div> \
						<input type='number' id='alttwofontsize'> \
					</div> \
					<div type='checkbox' class='sdpi-item'> \
						<div class='sdpi-item-label'>Style</div> \
						<div class='sdpi-item-value '> \
							<input id='cbAltTwoBold' type='checkbox' value='bold'> \
							<label for='cbAltTwoBold'><span></span>bold</label> \
							<input id='cbAltTwoItalic' type='checkbox' value='italic'> \
							<label for='cbAltTwoItalic'><span></span>italic</label> \
						</div> \
					</div> \
					<div type='color' class='sdpi-item'> \
						<div class='sdpi-item-label'>Text Color</div> \
						<input type='color' class='sdpi-item-value' id='alttwoforecolor' value='#ffffff'> \
					</div> \
				</div>\
				<div class='sdpi-heading sdpi-collapser'>Background / Image</div> \
				<div>\
					<div type='color' class='sdpi-item'> \
						<div class='sdpi-item-label'>Back Color</div> \
						<input type='color' class='sdpi-item-value' id='backcolor' value='#ffffff'> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>OFF Background Image</div> \
						<button class='sdpi-item-value' id='filepickclick'>Upload</button> \
						<button id='backfileclear'>Clear</button> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>ON Background Image</div> \
						<button class='sdpi-item-value' id='onfilepickclick'>Upload</button> \
						<button id='onbackfileclear'>Clear</button> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>ON variable</div> \
						<select class='sdpi-item-value select' id='onvartype'> \
							<option value='(A:'>A:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(B:'>B:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(DREF:'>DREF:&nbsp;&nbsp;&nbsp;</option> \
							<option value='(PMDG:'>PMDG:&nbsp;&nbsp;&nbsp;</option> \
						</select> \
						<input class='sdpi-item-value' id='onsimvar' value=''> \
					</div> \
					<div class='sdpi-item'> \
						<div class='sdpi-item-label'>ON value</div> \
						<input class='sdpi-item-value' id='onvarval' value=''> \
					</div>\
				</div>\
				<div class='sdpi-heading sdpi-collapser'>Button settings</div> \
				<div>\
					<div class='sdpi-item'> \
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
			    </div> \
			    <div class='sdpi-item'> \
				    <div class='sdpi-item-label'>Save changes</div> \
					<button class='sdpi-item-value' id='submitbtn' accesskey='s'>Submit (Alt+S)</button> \
				</div> \
				<input class='sdpi-item-value' type='file' id='filepicker' style='visibility: hidden; width: 0;' accept='.png'> \
				";

    document.getElementById('placeholder').innerHTML = cnt;
	setUpCollapsibles();
	
	if (settings["repeatAction"] == null){
		document.getElementById('cbrepeat').value = '1';
	} else{
		document.getElementById('cbrepeat').value = settings["repeatAction"];
	}
	
	if (settings["splittext"]){
		document.getElementById('cbsplit').value = settings["splittext"];
	} else {
		document.getElementById('cbsplit').value = '0';
	}
	if (settings["splitstretch"]){
		document.getElementById('cbstretch').value = settings["splitstretch"];
	} else {
		document.getElementById('cbstretch').value = '0';
	}
	
	var varStr = settings["simvar"];
	if (varStr && varStr.length > 0){
		var compos = varStr.indexOf(":");
		document.getElementById('vartype').value = varStr.substr(0,compos + 1);
		document.getElementById('simvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
	} else {
      document.getElementById('vartype').value = "(A:";
    }

	varStr = settings["altsimvar"];
	if (varStr && varStr.length > 0){
		var compos = varStr.indexOf(":");
		document.getElementById('altvartype').value = varStr.substr(0,compos + 1);
		document.getElementById('altsimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
	} else {
      document.getElementById('altvartype').value = "(A:";
    }
	varStr = settings["alttwosimvar"];
	if (varStr && varStr.length > 0){
		var compos = varStr.indexOf(":");
		document.getElementById('alttwovartype').value = varStr.substr(0,compos + 1);
		document.getElementById('alttwosimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
	} else {
      document.getElementById('alttwovartype').value = "(A:";
    }
	
	varStr = settings["onsimvar"];
	if (varStr && varStr.length > 0){
        var compos = varStr.indexOf(":");
		document.getElementById('onvartype').value = varStr.substr(0,compos + 1);
		document.getElementById('onsimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
		document.getElementById('onvarval').value = settings["onvarval"];
	} else {
      document.getElementById('onvartype').value = "(A:";
    }

	var colStr = settings["color"];
	if (colStr && colStr.length > 0){
		document.getElementById('forecolor').value = colStr;
	} else {
      document.getElementById('forecolor').value = '#ffffff';
    }
	
	colStr = settings["altcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('altforecolor').value = colStr;
	} else {
      document.getElementById('altforecolor').value = '#ffffff';
    }

	colStr = settings["alttwocolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwoforecolor').value = colStr;
	} else {
      document.getElementById('alttwoforecolor').value = '#ffffff';
    }
	
    colStr = settings["backcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('backcolor').value = colStr;
	} else {
      document.getElementById('backcolor').value = '#000000';
    }

    colStr = settings["font"];
	if (colStr && colStr.length > 0){
		document.getElementById('fonts').value = colStr;
	} else {
      document.getElementById('fonts').value = 'Tahoma';
    }

    colStr = settings["fontsize"];
	if (colStr && colStr.length > 0){
		document.getElementById('fontsize').value = colStr;
	} else {
      document.getElementById('fontsize').value = 50;
    }
	
	colStr = settings["fontbold"];
	if (colStr == 1){
		document.getElementById('cbBold').checked = true;
	} else {
	  document.getElementById('cbBold').checked = false;
	}
	colStr = settings["fontitalic"];
	if (colStr == 1){
		document.getElementById('cbItalic').checked = true;
	} else {
	  document.getElementById('cbItalic').checked = false;
	}
	
	colStr = settings["altfontbold"];
	if (colStr == 1){
		document.getElementById('cbAltBold').checked = true;
	} else {
	  document.getElementById('cbAltBold').checked = false;
	}
	colStr = settings["altfontitalic"];
	if (colStr == 1){
		document.getElementById('cbAltItalic').checked = true;
	} else {
	  document.getElementById('cbAltItalic').checked = false;
	}
	
	colStr = settings["alttwofontbold"];
	if (colStr == 1){
		document.getElementById('cbAltTwoBold').checked = true;
	} else {
	  document.getElementById('cbAltTwoBold').checked = false;
	}
	colStr = settings["alttwofontitalic"];
	if (colStr == 1){
		document.getElementById('cbAltTwoItalic').checked = true;
	} else {
	  document.getElementById('cbAltTwoItalic').checked = false;
	}
	
	colStr = settings["splitwidth"];
	if (colStr && colStr.length > 0){
		document.getElementById('splitwidth').value = colStr;
	} else {
      document.getElementById('splitwidth').value = 10;
    }
	
	    colStr = settings["altfont"];
	if (colStr && colStr.length > 0){
		document.getElementById('altfonts').value = colStr;
	} else {
      document.getElementById('altfonts').value = 'Tahoma';
    }

    colStr = settings["altfontsize"];
	if (colStr && colStr.length > 0){
		document.getElementById('altfontsize').value = colStr;
	} else {
      document.getElementById('altfontsize').value = 50;
    }
	
	    colStr = settings["alttwofont"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwofonts').value = colStr;
	} else {
      document.getElementById('alttwofonts').value = 'Tahoma';
    }

    colStr = settings["alttwofontsize"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwofontsize').value = colStr;
	} else {
      document.getElementById('alttwofontsize').value = 50;
    }

	colStr = settings["varoffset"];
	if (colStr && colStr.length > 0){
		document.getElementById('varoffset').value = colStr;
	} else {
      document.getElementById('varoffset').value = 0;
    }
	
    colStr = settings["multiplier"];
	if (colStr && colStr.length > 0){
		document.getElementById('multiplier').value = colStr;
	} else {
      document.getElementById('multiplier').value = 1.0;
    }

    colStr = settings["fractions"];
	if (colStr && colStr.length > 0){
		document.getElementById('fractions').value = colStr;
	} else {
      document.getElementById('fractions').value = 0;
    }
	
	colStr = settings["simvarpad"];
	if (colStr && colStr.length > 0){
		document.getElementById('simvarpad').value = colStr;
	} else {
      document.getElementById('simvarpad').value = 0;
    }
	
    colStr = settings["xshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('xshift').value = colStr;
	} else {
      document.getElementById('xshift').value = 0;
    }

    colStr = settings["yshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('yshift').value = colStr;
	} else {
      document.getElementById('yshift').value = 85;
    }

    colStr = settings["altfractions"];
	if (colStr && colStr.length > 0){
		document.getElementById('altfractions').value = colStr;
	} else {
      document.getElementById('altfractions').value = 0;
    }
	
	colStr = settings["altvarpad"];
	if (colStr && colStr.length > 0){
		document.getElementById('altvarpad').value = colStr;
	} else {
      document.getElementById('altvarpad').value = 0;
    }
	
	colStr = settings["altoffset"];
	if (colStr && colStr.length > 0){
		document.getElementById('altoffset').value = colStr;
	} else {
      document.getElementById('altoffset').value = 0;
    }

    colStr = settings["altmultiplier"];
	if (colStr && colStr.length > 0){
		document.getElementById('altmultiplier').value = colStr;
	} else {
      document.getElementById('altmultiplier').value = 1.0;
    }
	
    colStr = settings["altxshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('altxshift').value = colStr;
	} else {
      document.getElementById('altxshift').value = 0;
    }
	
    colStr = settings["altyshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('altyshift').value = colStr;
	} else {
      document.getElementById('altyshift').value = 85;
    }
	
	colStr = settings["alttwofractions"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwofractions').value = colStr;
	} else {
      document.getElementById('alttwofractions').value = 0;
    }
	
	colStr = settings["alttwovarpad"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwovarpad').value = colStr;
	} else {
      document.getElementById('alttwovarpad').value = 0;
    }
	
	colStr = settings["alttwooffset"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwooffset').value = colStr;
	} else {
      document.getElementById('alttwooffset').value = 0;
    }

    colStr = settings["alttwomultiplier"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwomultiplier').value = colStr;
	} else {
      document.getElementById('alttwomultiplier').value = 1.0;
    }
	
    colStr = settings["alttwoxshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwoxshift').value = colStr;
	} else {
      document.getElementById('alttwoxshift').value = 0;
    }
	
    colStr = settings["alttwoyshift"];
	if (colStr && colStr.length > 0){
		document.getElementById('alttwoyshift').value = colStr;
	} else {
      document.getElementById('alttwoyshift').value = 85;
    }
	
	var evtStr = settings["simevt"];
	if (evtStr) {
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('evttype').value = evtStr.substr(0,compos);
		document.getElementById('simevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
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

	document.getElementById('filepickclick').addEventListener('click', filepickClicked);
	document.getElementById('onfilepickclick').addEventListener('click', onfilepickClicked);
	
	document.getElementById('backfileclear').addEventListener('click', backfileclearClicked);
	document.getElementById('onbackfileclear').addEventListener('click', onfileclearClicked);
	
	document.getElementById('filepicker').addEventListener('change', fileSelected);
	var filePickerResult;
    var settingsProperty = '';

    document.getElementById('submitbtn').addEventListener('click', valuesChanged);

    function valuesChanged(inEvent) {
		var vvarStr = document.getElementById('simvar').value.replace(/·/g, ' ');
		if (vvarStr.length > 0){
			if (document.getElementById('vartype').value === '(A:' && !vvarStr.includes(',')){
				vvarStr = vvarStr + ", Number";
			}
			settings["simvar"] = (document.getElementById('vartype').value + vvarStr + ")");
		} else {
			settings["simvar"] = '';
		}
        settings["fractions"] = document.getElementById('fractions').value;
		settings["simvarpad"] = document.getElementById('simvarpad').value;
		settings["varoffset"] = document.getElementById('varoffset').value;
		settings["multiplier"] = document.getElementById('multiplier').value;
		settings["xshift"] = document.getElementById('xshift').value;
		settings["yshift"] = document.getElementById('yshift').value;
		vvarStr = document.getElementById('altsimvar').value.replace(/·/g, ' ');
		if (vvarStr && vvarStr.length > 0){
			settings["altsimvar"] = document.getElementById('altvartype').value + vvarStr + ")";
        } else {
			settings["altsimvar"] = '';
		}
        settings["altfractions"] = document.getElementById('altfractions').value;
		settings["altvarpad"] = document.getElementById('altvarpad').value;
		settings["altoffset"] = document.getElementById('altoffset').value;
		settings["altmultiplier"] = document.getElementById('altmultiplier').value;
		settings["altxshift"] = document.getElementById('altxshift').value;
		settings["altyshift"] = document.getElementById('altyshift').value;
		vvarStr = document.getElementById('alttwosimvar').value.replace(/·/g, ' ');
		if (vvarStr && vvarStr.length > 0){
			settings["alttwosimvar"] = document.getElementById('alttwovartype').value + vvarStr + ")";
        } else {
			settings["alttwosimvar"] = '';
		}
        settings["alttwofractions"] = document.getElementById('alttwofractions').value;
		settings["alttwovarpad"] = document.getElementById('alttwovarpad').value;
		settings["alttwooffset"] = document.getElementById('alttwooffset').value;
		settings["alttwomultiplier"] = document.getElementById('alttwomultiplier').value;
		settings["alttwoxshift"] = document.getElementById('alttwoxshift').value;
		settings["alttwoyshift"] = document.getElementById('alttwoyshift').value;
        settings["color"] = document.getElementById('forecolor').value;
		settings["backcolor"] = document.getElementById('backcolor').value;
		settings["font"] = document.getElementById('fonts').value;
		settings["fontsize"] = document.getElementById('fontsize').value;
		if (document.getElementById('cbBold').checked){
			settings["fontbold"] = 1;
		} else{
			settings["fontbold"] = 0;
		}
		if (document.getElementById('cbItalic').checked){
			settings["fontitalic"] = 1;
		} else{
			settings["fontitalic"] = 0;
		}
		settings["altcolor"] = document.getElementById('altforecolor').value;
		settings["altfont"] = document.getElementById('altfonts').value;
		settings["altfontsize"] = document.getElementById('altfontsize').value;
		if (document.getElementById('cbAltBold').checked){
			settings["altfontbold"] = 1;
		} else{
			settings["altfontbold"] = 0;
		}
		if (document.getElementById('cbAltItalic').checked){
			settings["altfontitalic"] = 1;
		} else{
			settings["altfontitalic"] = 0;
		}
		settings["alttwocolor"] = document.getElementById('alttwoforecolor').value;
		settings["alttwofont"] = document.getElementById('alttwofonts').value;
		settings["alttwofontsize"] = document.getElementById('alttwofontsize').value;
		if (document.getElementById('cbAltTwoBold').checked){
			settings["alttwofontbold"] = 1;
		} else{
			settings["alttwofontbold"] = 0;
		}
		if (document.getElementById('cbAltTwoItalic').checked){
			settings["alttwofontitalic"] = 1;
		} else{
			settings["alttwofontitalic"] = 0;
		}
		vvarStr = document.getElementById('simevt').value;
		if (vvarStr && vvarStr.length > 0){
			settings["simevt"] = document.getElementById('evttype').value + vvarStr.replace(/·/g, ' ') + ")";
			settings["onevtval"] = document.getElementById('onevtval').value;	
		} else {
			settings["simevt"] = 0;
			settings["onevtval"] = 0;
		}
		vvarStr = document.getElementById('onsimvar').value;
		if (vvarStr && vvarStr.length > 0){
			settings["onsimvar"] = document.getElementById('onvartype').value + vvarStr + ")";
			settings["onvarval"] = document.getElementById('onvarval').value;
        } else {
			settings["onsimvar"] = '';
		}
		vvarStr = document.getElementById('longsimevt').value;
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
		settings["repeatAction"] = document.getElementById('cbrepeat').value;
		settings["longclicktimeout"] = document.getElementById('lptimeout').value;
		settings["splittext"] = document.getElementById('cbsplit').value;
		settings["splitwidth"] = document.getElementById('splitwidth').value;
		settings["splitstretch"] = document.getElementById('cbstretch').value;
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

	function filepickClicked(inEvent) {
		settingsProperty = 'backimg';
	    document.getElementById('filepicker').click();
    }

	function onfilepickClicked(inEvent) {
		settingsProperty = 'onbackimg';
	    document.getElementById('filepicker').click();
    }

	function backfileclearClicked(inEvent) {
		settings["backimg"] = '';
    }
	
	function onfileclearClicked(inEvent) {
		settings["onbackimg"] = '';
    }
	
	function fileSelected(inEvent) {
	   encodeImageFileAsURL(document.getElementById('filepicker'));
    }
	
	function encodeImageFileAsURL(element) {
        var myfile = element.files[0];
		var path = myfile.name.replace(/%3A/g, ":").replace(/%2F/g, "/");
		// console.log('path', path);
		var xhr = new XMLHttpRequest();
		var reader = new FileReader();
		xhr.addEventListener('load', () => {
		  reader.readAsDataURL(xhr.response)
		});
        reader.addEventListener('load', () => {
		    settings[settingsProperty] = reader.result;
		});
		xhr.open('GET', 'file:///' + path);
		xhr.responseType = 'blob';
		xhr.send();

	}
}
