function RotaryEncoderPI(inContext, inStreamDeckVersion, inPluginVersion) {
        var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

    var cnt = "<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Left turn event</div> \
					<select class='sdpi-item-value select' id='leftevttype'> \
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
					 <textarea type='textarea' width='80' id='leftsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Left value</div> \
					<input class='sdpi-item-value' id='leftevtval' value=''> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Right turn event</div> \
					<select class='sdpi-item-value select' id='rightevttype'> \
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
					 <textarea type='textarea' width='80' id='rightsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Right value</div> \
					<input class='sdpi-item-value' id='rightevtval' value=''> \
			   </div> \
			   <hr> \
			   <div type='range' class='sdpi-item' > \
					<div class='sdpi-item-label'>Fast turn speed</div> \
					<div class='sdpi-item-value'> \
						<span class='clickable' value='2'>slow</span> \
						<input id='fastturnspeed' type='range' min='2' max='5' step='1' list='numbers'> \
						<datalist id='numbers'> \
							<option>2</option> \
							<option>3</option> \
							<option>4</option> \
							<option>5</option> \
						</datalist> \
						<span class='clickable' value='5'>fast</span> \
					</div> \
				</div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Left fast turn event</div> \
					<select class='sdpi-item-value select' id='fastleftevttype'> \
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
					 <textarea type='textarea' width='80' id='fastleftsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Left fast value</div> \
					<input class='sdpi-item-value' id='fastleftevtval' value=''> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Right fast turn event</div> \
					<select class='sdpi-item-value select' id='fastrightevttype'> \
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
					 <textarea type='textarea' width='80' id='fastrightsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Right fast value</div> \
					<input class='sdpi-item-value' id='fastrightevtval' value=''> \
			   </div> \
			   <hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Key Down event</div> \
					<select class='sdpi-item-value select' id='keydownevttype'> \
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
					 <textarea type='textarea' width='80' id='keydownsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Key Down value</div> \
					<input class='sdpi-item-value' id='keydownevtval' value=''> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Key Up event</div> \
					<select class='sdpi-item-value select' id='keyupevttype'> \
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
					 <textarea type='textarea' width='80' id='keyupsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Key Up value</div> \
					<input class='sdpi-item-value' id='keyupevtval' value=''> \
			   </div> \
			   	<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Touch Tap event</div> \
					<select class='sdpi-item-value select' id='touchtapevttype'> \
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
					 <textarea type='textarea' width='80' id='touchtapsimevt' value=''></textarea> \
					 </span> \
			   </div> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Touch Tap value</div> \
					<input class='sdpi-item-value' id='touchtapevtval' value=''> \
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
					<div class='sdpi-item-label'>Value Variable</div> \
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
				<div class='sdpi-heading'>Icon definitions</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Select image definition</div> \
					<select class='sdpi-item-value select' id='imagedefs'> \
					</select> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>or</div> \
					<button class='sdpi-item-value' id='addImagebtn'>Add new image definition</button> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Header</div> \
					<input type='text' id='imgheader' required> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Layer</div> \
					<input type='number' id='imagelayer' value='0' />\
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'></div> \
					<button class='sdpi-item-value max30' id='layerUpbtn'>Up</button> \
					<button class='sdpi-item-value max30' id='layerDownbtn'>Down</button> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Visibility variable</div> \
					<select class='sdpi-item-value select' id='visivartype'> \
						<option value='(A:'>A:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(P:'>P:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(E:'>E:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(B:'>B:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(IE:'>IE:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(DREF:'>DREF:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(PMDG:'>PMDG:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					<textarea type='textarea' width='80' id='visivar' value=''></textarea> \
					</span> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>File</div> \
					<input class='sdpi-item-value' id='imgfilename' value='' readonly='true'> \
				</div> \
				<div class='sdpi-item'> \
				    <div class='sdpi-item-label'></div> \
					<button class='sdpi-item-value' id='filepickclick'>Upload Image</button> \
				</div> \
				<div class='sdpi-item'> \
					<button class='sdpi-item-value' id='saveImagebtn'>Save</button> \
					<button class='sdpi-item-value' id='copyImagebtn'>Copy</button> \
					<button class='sdpi-item-value' id='deleteImagebtn'>Delete</button> \
				</div> \
				<hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Icon Text Variable</div> \
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
						<input id='cbBold' type='checkbox' value='bold'> \
						<label for='cbBold'><span></span>bold</label> \
						<input id='cbItalic' type='checkbox' value='italic'> \
						<label for='cbItalic'><span></span>italic</label> \
					</div> \
				</div> \
				<div type='color' class='sdpi-item'> \
					<div class='sdpi-item-label'>Text Color</div> \
					<input type='color' class='sdpi-item-value' id='altforecolor' value='#ffffff'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Color Variable</div> \
					<select class='sdpi-item-value select' id='altcolorvartype'> \
						<option value='(L:'>L:&nbsp;&nbsp;&nbsp;</option> \
						<option value='(S:'>S:&nbsp;&nbsp;&nbsp;</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='altcolorvar' value=''></textarea> \
					 </span> \
				</div> \
				<div type='color' class='sdpi-item'> \
					<div class='sdpi-item-label'>Back Color</div> \
					<input type='color' class='sdpi-item-value' id='backcolor' value='#ffffff'> \
				</div> \
				<hr> \
			   <div class='sdpi-item'> \
					<div class='sdpi-item-label'>Bar Variable</div> \
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
				</div> \
				<input class='sdpi-item-value' type='file' id='filepicker' style='visibility: hidden; width: 0;' accept='.png'> \
				";

    document.getElementById('placeholder').innerHTML = cnt;
	
	var selectedImageDefIndex = 0;
	var currentImageDef = {};
	document.getElementById('imagedefs').addEventListener('change', imageDefSelected);
	document.getElementById('imagedefs').addEventListener('click', imageDefClicked);
	document.getElementById('filepickclick').addEventListener('click', filepickClicked);
	document.getElementById('filepicker').addEventListener('change', fileSelected);
	document.getElementById('addImagebtn').addEventListener('click', addImageDefinition);
	document.getElementById('saveImagebtn').addEventListener('click', saveImageDefinition);
	document.getElementById('copyImagebtn').addEventListener('click', copyImageDefinition);
	document.getElementById('deleteImagebtn').addEventListener('click', deleteImageDefinition);
	document.getElementById('layerUpbtn').addEventListener('click', layerUpImageDefinition);
	document.getElementById('layerDownbtn').addEventListener('click', layerDownImageDefinition);
	
	if (settings["imagedefs"]){
		var imageSelect = document.getElementById('imagedefs');
		for (let i = 0; i < settings["imagedefs"].length; i++){
			imageSelect.options[imageSelect.options.length] = new Option(settings["imagedefs"][i].header, i);
		}
		currentImageDef = settings["imagedefs"][0];
		document.getElementById('imagelayer').value = '0';
		loadImageDefValues();
	}

	var evtStr = settings["leftevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('leftevttype').value = evtStr.substr(0,compos);
		document.getElementById('leftsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('leftevtval').value = settings["leftval"];	
	} else {
      document.getElementById('leftevttype').value = "(>K:";
    }
	evtStr = settings["rightevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('rightevttype').value = evtStr.substr(0,compos);
		document.getElementById('rightsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('rightevtval').value = settings["rightval"];	
	} else {
      document.getElementById('rightevttype').value = "(>K:";
    }
	evtStr = settings["fastleftevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('fastleftevttype').value = evtStr.substr(0,compos);
		document.getElementById('fastleftsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('fastleftevtval').value = settings["fastleftval"];	
	} else {
      document.getElementById('fastleftevttype').value = "(>K:";
    }
	evtStr = settings["fastrightevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('fastrightevttype').value = evtStr.substr(0,compos);
		document.getElementById('fastrightsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('fastrightevtval').value = settings["fastrightval"];
	} else {
      document.getElementById('fastrightevttype').value = "(>K:";
    }
    evtStr = settings["keydownevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('keydownevttype').value = evtStr.substr(0,compos);
		document.getElementById('keydownsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('keydownevtval').value = settings["keydownval"];	
    } else {
      document.getElementById('keydownevttype').value = "(>K:";
    }
	evtStr = settings["keyupevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('keyupevttype').value = evtStr.substr(0,compos);
		document.getElementById('keyupsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('keyupevtval').value = settings["keyupval"];	
    } else {
      document.getElementById('keyupevttype').value = "(>K:";
    }
	evtStr = settings["touchtapevt"];
	if (evtStr && evtStr.length > 0){
		let compos = evtStr.indexOf(":") + 1;
		document.getElementById('touchtapevttype').value = evtStr.substr(0,compos);
		document.getElementById('touchtapsimevt').value = evtStr.substr(compos,evtStr.length - compos - 1);
		document.getElementById('touchtapevtval').value = settings["touchtapval"];	
    } else {
      document.getElementById('touchtapevttype').value = "(>K:";
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
	
	varStr = settings["altcolorvar"];
	if (varStr && varStr.length > 0){
		var compos = varStr.indexOf(":");
		document.getElementById('altcolorvartype').value = varStr.substr(0,compos + 1);
		document.getElementById('altcolorvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
	} else {
      document.getElementById('altcolorvartype').value = "(A:";
    }
	
	var colStr = settings["varoffset"];
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
	
	colStr = settings["altcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('altforecolor').value = colStr;
	} else {
      document.getElementById('altforecolor').value = '#ffffff';
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
	
	colStr = settings["altfontbold"];
	if (colStr == 1){
		document.getElementById('cbBold').checked = true;
	} else {
	  document.getElementById('cbBold').checked = false;
	}
	colStr = settings["altfontitalic"];
	if (colStr == 1){
		document.getElementById('cbItalic').checked = true;
	} else {
	  document.getElementById('cbItalic').checked = false;
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
	
	colStr = settings["altcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('altforecolor').value = colStr;
	} else {
      document.getElementById('altforecolor').value = '#ffffff';
    }

	
    colStr = settings["altbackcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('backcolor').value = colStr;
	} else {
      document.getElementById('backcolor').value = '#000000';
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
	
	colStr = settings["fastturnspeed"];
	if (colStr && colStr.length > 0){
		document.getElementById('fastturnspeed').value = colStr;
	} else {
      document.getElementById('fastturnspeed').value = 2;
    }
	
    document.getElementById('submitbtn').addEventListener('click', valuesChanged);
	
	function imageDefSelected(inEvent) {
		selectedImageDefIndex = event.target.value;
		currentImageDef = settings["imagedefs"][selectedImageDefIndex];
		loadImageDefValues();
	}
	
	function imageDefClicked(inEvent) {
		if (settings["imagedefs"].length == 1) {
			selectedImageDefIndex = 0;
			currentImageDef = settings["imagedefs"][selectedImageDefIndex];
			loadImageDefValues();
		}
	}
	
	function loadImageDefValues(){
		if (currentImageDef){
			document.getElementById('imgheader').value = currentImageDef.header;
			if (selectedImageDefIndex >= 0){
				document.getElementById('imagelayer').value = selectedImageDefIndex;
			} else {
				document.getElementById('imagelayer').value = document.getElementById('imagedefs').options.length;
			}
			var varStr = currentImageDef.visivar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('visivartype').value = varStr.substr(0,compos + 1);
				document.getElementById('visivar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
			} else {
			  document.getElementById('visivartype').value = "(A:";
			  document.getElementById('visivar').value = "";
			}
			colStr = currentImageDef.picFile;
			if (colStr && colStr.length > 0){
				document.getElementById('imgfilename').value = colStr;
			} else {
			  document.getElementById('imgfilename').value = "";
			}
		}
	}
	
	function layerUpImageDefinition(inEvent){
		if (currentImageDef && selectedImageDefIndex >= 0 && selectedImageDefIndex < document.getElementById('imagedefs').options.length - 1){
			var tmpObj = settings["imagedefs"][parseInt(selectedImageDefIndex)];
			var upObj = settings["imagedefs"][(parseInt(selectedImageDefIndex) + 1)];
			settings["imagedefs"][selectedImageDefIndex] = upObj;
			selectedImageDefIndex++;
			settings["imagedefs"][selectedImageDefIndex] = tmpObj;
			document.getElementById('submitbtn').click();
			var imageSelect = document.getElementById('imagedefs');
			while (imageSelect.options.length > 0) {
				imageSelect.remove(0);
			}   
			for (let i = 0; i < settings["imagedefs"].length; i++){
				imageSelect.options[imageSelect.options.length] = new Option(settings["imagedefs"][i].header, i);
			}
			
			currentImageDef = settings["imagedefs"][selectedImageDefIndex];
			loadImageDefValues();
		}
	}
	
	function layerDownImageDefinition(inEvent){
		if (currentImageDef && selectedImageDefIndex > 0){
			var tmpObj = settings["imagedefs"][parseInt(selectedImageDefIndex)];
			var dnObj = settings["imagedefs"][(parseInt(selectedImageDefIndex) - 1)];
			settings["imagedefs"][selectedImageDefIndex] = dnObj;
			selectedImageDefIndex--;
			settings["imagedefs"][selectedImageDefIndex] = tmpObj;
			document.getElementById('submitbtn').click();
			var imageSelect = document.getElementById('imagedefs');
			while (imageSelect.options.length > 0) {
				imageSelect.remove(0);
			}   
			for (let i = 0; i < settings["imagedefs"].length; i++){
				imageSelect.options[imageSelect.options.length] = new Option(settings["imagedefs"][i].header, i);
			}
			
			currentImageDef = settings["imagedefs"][selectedImageDefIndex];
			loadImageDefValues();
		}
	}
	
	function addImageDefinition(inEvent) {
		currentImageDef = {};
		selectedImageDefIndex = -1;
		document.getElementById('imagelayer').value = document.getElementById('imagedefs').options.length;
		resetImageFields();
	}
	
	function copyImageDefinition(inEvent) {
		if (currentImageDef && selectedImageDefIndex >= 0){
			var headerstr = document.getElementById('imgheader').value;
			if (headerstr && headerstr.length > 0){
				// Copy this image defintion
				var imgdata = currentImageDef.mainImage;
				currentImageDef = {};
				currentImageDef.mainImage = imgdata;
				selectedImageDefIndex = -1;
				document.getElementById('imagelayer').value = document.getElementById('imagedefs').options.length;
				saveImageDefinition(inEvent);
			}
		}
	}
	
	function saveImageDefinition(inEvent) {
		// var currentImageDef = settings["imagedefs"][selectedImageDefIndex];
		if (currentImageDef){
			var headerstr = document.getElementById('imgheader').value;
			if (headerstr && headerstr.length > 0){
				currentImageDef.header = headerstr;
				var varStr = document.getElementById('visivar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentImageDef.visivar = (document.getElementById('visivartype').value + varStr + ")");
				} else {
					currentImageDef.visivar = null;
				}
				var imageSelect = document.getElementById('imagedefs');
				if (selectedImageDefIndex >= 0){
					imageSelect.options[selectedImageDefIndex].text = currentImageDef.header;
					settings["imagedefs"][selectedImageDefIndex] = currentImageDef;
				} else{
					if (!settings["imagedefs"])
						settings["imagedefs"] = [];
					settings["imagedefs"].push(currentImageDef);
					imageSelect.options[imageSelect.options.length] = new Option(currentImageDef.header, imageSelect.options.length);
					resetImageFields();
				}
				document.getElementById('submitbtn').click();
				currentImageDef = settings["imagedefs"][selectedImageDefIndex];
				loadImageDefValues();
			}
		}
	}
	
	function deleteImageDefinition(inEvent) {
		if (settings["imagedefs"].length == 1){
			settings["imagedefs"] = [];
			var imageSelect = document.getElementById('imagedefs');
			imageSelect.remove(0);
			document.getElementById('submitbtn').click();
		} else {
			if (selectedImageDefIndex >= 0){
				settings["imagedefs"].splice(selectedImageDefIndex, 1);
				var imageSelect = document.getElementById('imagedefs');
				imageSelect.remove(selectedImageDefIndex);
				document.getElementById('submitbtn').click();
			}
		}
		resetImageFields();
	}
	
	function resetImageFields(){
		document.getElementById('imgheader').value = '';
		document.getElementById('imgfilename').value = '';
		document.getElementById('visivartype').value = '(A:';
		document.getElementById('visivar').value = '';
	}

    function valuesChanged(inEvent) {
		let vvarStr = document.getElementById('leftsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["leftevt"] = document.getElementById('leftevttype').value + document.getElementById('leftsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["leftevt"] = null; }
		settings["leftval"] = document.getElementById('leftevtval').value;
		vvarStr = document.getElementById('rightsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["rightevt"] = document.getElementById('rightevttype').value + document.getElementById('rightsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["rightevt"] = null; }
		settings["rightval"] = document.getElementById('rightevtval').value;
		settings["fastturnspeed"] = document.getElementById('fastturnspeed').value;
		vvarStr = document.getElementById('fastleftsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["fastleftevt"] = document.getElementById('fastleftevttype').value + document.getElementById('fastleftsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["fastleftevt"] = null; }
		settings["fastleftval"] = document.getElementById('fastleftevtval').value;
		vvarStr = document.getElementById('fastrightsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["fastrightevt"] = document.getElementById('fastrightevttype').value + document.getElementById('fastrightsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["fastrightevt"] = null; }
		settings["fastrightval"] = document.getElementById('fastrightevtval').value;
		vvarStr = document.getElementById('keydownsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["keydownevt"] = document.getElementById('keydownevttype').value + document.getElementById('keydownsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["keydownevt"] = null; }
		settings["keydownval"] = document.getElementById('keydownevtval').value;
		vvarStr = document.getElementById('keyupsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["keyupevt"] = document.getElementById('keyupevttype').value + document.getElementById('keyupsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["keyupevt"] = null; }
		settings["keyupval"] = document.getElementById('keyupevtval').value;
		vvarStr = document.getElementById('touchtapsimevt').value;
		if (vvarStr && vvarStr.length > 0){
		   settings["touchtapevt"] = document.getElementById('touchtapevttype').value + document.getElementById('touchtapsimevt').value.replace(/·/g, ' ') + ")";
        } else { settings["touchtapevt"] = null; }
		settings["touchtapval"] = document.getElementById('touchtapevtval').value;
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
		vvarStr = document.getElementById('simvar').value.replace(/·/g, ' ');
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
		vvarStr = document.getElementById('altsimvar').value.replace(/·/g, ' ');
		if (vvarStr.length > 0){
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
		settings["altbackcolor"] = document.getElementById('backcolor').value;
		settings["altcolor"] = document.getElementById('altforecolor').value;
		settings["altfont"] = document.getElementById('altfonts').value;
		settings["altfontsize"] = document.getElementById('altfontsize').value;
		if (document.getElementById('cbBold').checked){
			settings["altfontbold"] = 1;
		} else{
			settings["altfontbold"] = 0;
		}
		if (document.getElementById('cbItalic').checked){
			settings["altfontitalic"] = 1;
		} else{
			settings["altfontitalic"] = 0;
		}
		vvarStr = document.getElementById('alttwosimvar').value.replace(/·/g, ' ');
		if (vvarStr.length > 0){
			settings["alttwosimvar"] = document.getElementById('alttwovartype').value + vvarStr + ")";
		} else {
			settings["alttwosimvar"] = '';
		}
		settings["alttwooffset"] = document.getElementById('alttwooffset').value;
		settings["alttwomultiplier"] = document.getElementById('alttwomultiplier').value;
		vvarStr = document.getElementById('altcolorvar').value.replace(/·/g, ' ');
		if (vvarStr.length > 0){
			settings["altcolorvar"] = document.getElementById('altcolorvartype').value + vvarStr + ")";
		} else {
			settings["altcolorvar"] = '';
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
		settings["longclicktimeout"] = document.getElementById('lptimeout').value;
		settings["frompi"] = 1;
        instance.saveSettings();
        // instance.sendToPlugin({ 'piEvent': 'valueChanged' });
    }
	
	function filepickClicked(inEvent) {
	    document.getElementById('filepicker').click();
    }
	
	function fileSelected(inEvent) {
	   encodeImageFileAsURL(document.getElementById('filepicker'));
    }
	
	function encodeImageFileAsURL(element) {
        var myfile = element.files[0];
		var path = myfile.name.replace(/%3A/g, ":").replace(/%2F/g, "/");
		currentImageDef.picFile = path.substring(path.lastIndexOf("/") + 1);
		document.getElementById('imgfilename').value = currentImageDef.picFile;
		// console.log('path', path);
		var xhr = new XMLHttpRequest();
		var reader = new FileReader();
		xhr.addEventListener('load', () => {
		  reader.readAsDataURL(xhr.response)
		});
        reader.addEventListener('load', () => {
		    currentImageDef.mainImage = reader.result;
		});
		xhr.open('GET', 'file:///' + path);
		xhr.responseType = 'blob';
		xhr.send();
	}
}
