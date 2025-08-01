function RotaryEncoderCanvasPI(inContext, inStreamDeckVersion, inPluginVersion) {
        var instance = this;
    PI.call(this, inContext, inStreamDeckVersion, inPluginVersion);

    var cnt = "\
				<div class='sdpi-heading sdpi-collapser'>Interactions</div>\
				<div>\
                    <div class='sdpi-item'> \
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
					<div class='sdpi-item-label'>Update rate</div> \
					<select class='sdpi-item-value select' id='fpsnum'> \
						<option value='10'>high</option> \
						<option value='5'>medium</option> \
						<option value='1'>low</option> \
					</select> \
				</div> \
				<div type='color' class='sdpi-item'> \
					<div class='sdpi-item-label'>Back Color</div> \
					<input type='color' class='sdpi-item-value' id='backcolor' value='#ffffff'> \
				</div> \
                </div> \
				<hr> \
                <div class='sdpi-heading sdpi-collapser'>Image definitions</div>\
				<div>\
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
						<div class='sdpi-item-label'>Visibility value</div> \
						<input class='sdpi-item-value' id='visival' value=''> \
				</div> \
				<hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Rotation variable</div> \
					<select class='sdpi-item-value select' id='rvartype'> \
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
					 <textarea type='textarea' width='80' id='rsimvar' value=''></textarea> \
					 </span> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Multiplier</div> \
					<input type='number' id='rmultiplier'  value='1.0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Turn offset deg</div> \
					<input class='sdpi-item-value' id='roffset' value='0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Center shift X</div> \
					<input type='number' id='rxshift' value='0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Center shift Y</div> \
					<input type='number' id='ryshift' value='0'> \
				</div> \
				<hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>X shift variable</div> \
					<select class='sdpi-item-value select' id='xvartype'> \
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
					 <textarea type='textarea' width='80' id='xsimvar' value=''></textarea> \
					 </span> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Multiplier</div> \
					<input type='number' id='xmultiplier' value='1.0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>X offset</div> \
					<input class='sdpi-item-value' id='xoffset' value='0'> \
				</div> \
				<hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Y shift variable</div> \
					<select class='sdpi-item-value select' id='yvartype'> \
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
					 <textarea type='textarea' width='80' id='ysimvar' value=''></textarea> \
					 </span> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Multiplier</div> \
					<input type='number' id='ymultiplier' value='1.0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Y offset</div> \
					<input class='sdpi-item-value' id='yoffset' value='0'> \
				</div> \
				<hr> \
				<div type='checkbox' class='sdpi-item'> \
					<div class='sdpi-item-label'>Resize</div> \
					<input class='sdpi-item-value' id='cbStretch' type='checkbox' value='stretch' checked> \
					<label for='cbStretch'><span></span>Stretch to fit</label> \
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
				</div> \
				<div class='sdpi-heading sdpi-collapser'>Text definitions</div>\
				<div>\
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Select text definition</div> \
					<select class='sdpi-item-value select' id='textdefs'> \
					</select> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>or</div> \
					<button class='sdpi-item-value' id='addTextbtn'>Add new text definition</button> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Header</div> \
					<input type='text' id='textheader' required> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Visibility variable</div> \
					<select class='sdpi-item-value select' id='txtvisivartype'> \
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
					<textarea type='textarea' width='80' id='txtvisivar' value=''></textarea> \
					</span> \
				</div> \
                <div class='sdpi-item'> \
						<div class='sdpi-item-label'>Visibility value</div> \
						<input class='sdpi-item-value' id='txtvisival' value=''> \
					</div> \
				<hr> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Text Variable</div> \
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
						<option value='TXT:'>Text</option> \
					</select> \
					<span class='sdpi-item-value textarea'> \
					 <textarea type='textarea' width='80' id='simvar' value=''></textarea> \
					 </span> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Offset</div> \
					<input type='number' id='varoffset' value='0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Multiplier</div> \
					<input type='number' id='multiplier' value='1.0'> \
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
					<div class='sdpi-item-label'>Align</div> \
					<div class='sdpi-item-value '> \
						<span class='sdpi-item-child'> \
							<input id='rdio1' type='radio' value='left' name='rdio' > \
							<label for='rdio1' class='sdpi-item-label'><span></span>left</label> \
						</span> \
						<span class='sdpi-item-child'> \
							<input id='rdio2' type='radio' value='center' name='rdio' checked> \
							<label for='rdio2' class='sdpi-item-label'><span></span>center</label> \
						</span> \
						<span class='sdpi-item-child'> \
							<input id='rdio3' type='radio' value='right' name='rdio'> \
							<label for='rdio3' class='sdpi-item-label'><span></span>right</label> \
						</span> \
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
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Leading 0s</div> \
					<input type='number' id='simvarpad' value='0'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Shift X</div> \
					<input type='number' id='xshift' value='100'> \
				</div> \
				<div class='sdpi-item'> \
					<div class='sdpi-item-label'>Shift Y</div> \
					<input type='number' id='yshift' value='50'> \
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
					<input type='number' id='fontsize' value='50'> \
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
					<input type='color' class='sdpi-item-value' id='forecolor' value='#ffffff'> \
				</div> \
			    <div class='sdpi-item'> \
					<button class='sdpi-item-value' id='saveTextbtn'>Save</button> \
					<button class='sdpi-item-value' id='copyTextbtn'>Copy</button> \
					<button class='sdpi-item-value' id='deleteTextbtn'>Delete</button> \
				</div> \
				</div> \
                <div class='sdpi-heading sdpi-collapser'>Autoscript</div>\
				<div>\
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
			   <hr> \
			    <div class='sdpi-item'> \
				    <div class='sdpi-item-label'>Save changes</div> \
					<button class='sdpi-item-value' id='submitbtn' accesskey='s'>Submit (Alt+S)</button> \
				</div> \
				<input class='sdpi-item-value' type='file' id='filepicker' style='visibility: hidden; width: 0;' accept='.png'> \
				";

    document.getElementById('placeholder').innerHTML = cnt;
	setUpCollapsibles();
    
    document.getElementById('submitbtn').addEventListener('click', valuesChanged);
	
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
	
	var selectedTextDefIndex = 0;
	var currentTextDef = {};
	document.getElementById('textdefs').addEventListener('change', textDefSelected);
	document.getElementById('textdefs').addEventListener('click', textDefClicked);
	document.getElementById('addTextbtn').addEventListener('click', addTextDefinition);
	document.getElementById('copyTextbtn').addEventListener('click', copyTextDefinition);
	document.getElementById('saveTextbtn').addEventListener('click', saveTextDefinition);
	document.getElementById('deleteTextbtn').addEventListener('click', deleteTextDefinition);
	
	if (settings["imagedefs"]){
		var imageSelect = document.getElementById('imagedefs');
		for (let i = 0; i < settings["imagedefs"].length; i++){
			imageSelect.options[imageSelect.options.length] = new Option(settings["imagedefs"][i].header, i);
		}
		currentImageDef = settings["imagedefs"][0];
		document.getElementById('imagelayer').value = '0';
		loadImageDefValues();
	}
	
	if (settings["textdefs"]){
		var textSelect = document.getElementById('textdefs');
		for (let i = 0; i < settings["textdefs"].length; i++){
			if (!settings["textdefs"][i].header || settings["textdefs"][i].header.length == 0)
				settings["textdefs"][i].header = settings["textdefs"][i].simvar;
			textSelect.options[textSelect.options.length] = new Option(settings["textdefs"][i].header, i);
		}
		currentTextDef = settings["textdefs"][0];
		loadTextDefValues(currentTextDef);
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
	
	if (settings["fpsnum"]){
		document.getElementById('fpsnum').value = settings["fpsnum"];
	} else {
		document.getElementById('fpsnum').value = '10';
	}
	
    var colStr = settings["backcolor"];
	if (colStr && colStr.length > 0){
		document.getElementById('backcolor').value = colStr;
	} else {
      document.getElementById('backcolor').value = '#000000';
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
			var varStr = currentImageDef.rsimvar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('rvartype').value = varStr.substr(0,compos + 1);
				document.getElementById('rsimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
			} else {
			  document.getElementById('rvartype').value = "(A:";
			  document.getElementById('rsimvar').value = "";
			}
			varStr = currentImageDef.xsimvar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('xvartype').value = varStr.substr(0,compos + 1);
				document.getElementById('xsimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
			} else {
			  document.getElementById('xvartype').value = "(A:";
			  document.getElementById('xsimvar').value = "";
			}
			varStr = currentImageDef.ysimvar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('yvartype').value = varStr.substr(0,compos + 1);
				document.getElementById('ysimvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
			} else {
			  document.getElementById('yvartype').value = "(A:";
			  document.getElementById('ysimvar').value = "";
			}
			varStr = currentImageDef.visivar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('visivartype').value = varStr.substr(0,compos + 1);
				document.getElementById('visivar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
				if (currentImageDef.visival){
					document.getElementById('visival').value = currentImageDef.visival;
				} else{
					document.getElementById('visival').value = "";
				}
			} else {
			  document.getElementById('visivartype').value = "(A:";
			  document.getElementById('visivar').value = "";
			  document.getElementById('visival').value = "";
			}
			var colStr = currentImageDef.rmultiplier;
			if (colStr && colStr.length > 0){
				document.getElementById('rmultiplier').value = colStr;
			} else {
			  document.getElementById('rmultiplier').value = 1.0;
			}
			colStr = currentImageDef.xmultiplier;
			if (colStr && colStr.length > 0){
				document.getElementById('xmultiplier').value = colStr;
			} else {
			  document.getElementById('xmultiplier').value = 1.0;
			}
			colStr = currentImageDef.ymultiplier;
			if (colStr && colStr.length > 0){
				document.getElementById('ymultiplier').value = colStr;
			} else {
			  document.getElementById('ymultiplier').value = 1.0;
			}
			colStr = currentImageDef.roffset;
			if (colStr && colStr.length > 0){
				document.getElementById('roffset').value = colStr;
			} else {
			  document.getElementById('roffset').value = 0.0;
			}
			colStr = currentImageDef.xoffset;
			if (colStr && colStr.length > 0){
				document.getElementById('xoffset').value = colStr;
			} else {
			  document.getElementById('xoffset').value = 0.0;
			}
			colStr = currentImageDef.yoffset;
			if (colStr && colStr.length > 0){
				document.getElementById('yoffset').value = colStr;
			} else {
			  document.getElementById('yoffset').value = 0.0;
			}
			colStr = currentImageDef.rxshift;
			if (colStr && colStr.length > 0){
				document.getElementById('rxshift').value = colStr;
			} else {
			  document.getElementById('rxshift').value = 0.0;
			}
			colStr = currentImageDef.ryshift;
			if (colStr && colStr.length > 0){
				document.getElementById('ryshift').value = colStr;
			} else {
			  document.getElementById('ryshift').value = 0.0;
			}
			colStr = currentImageDef.picFile;
			if (colStr && colStr.length > 0){
				document.getElementById('imgfilename').value = colStr;
			} else {
			  document.getElementById('imgfilename').value = "";
			}
			if (currentImageDef.stretch){
				document.getElementById('cbStretch').checked = true;
			} else{
				document.getElementById('cbStretch').checked = false;
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
				var varStr = document.getElementById('rsimvar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentImageDef.rsimvar = (document.getElementById('rvartype').value + varStr + ")");
				} else {
					currentImageDef.rsimvar = null;
				}
				varStr = document.getElementById('xsimvar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentImageDef.xsimvar = (document.getElementById('xvartype').value + varStr + ")");
				} else {
					currentImageDef.xsimvar = null;
				}
				varStr = document.getElementById('ysimvar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentImageDef.ysimvar = (document.getElementById('yvartype').value + varStr + ")");
				} else {
					currentImageDef.ysimvar = null;
				}
				varStr = document.getElementById('visivar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentImageDef.visivar = (document.getElementById('visivartype').value + varStr + ")");
					currentImageDef.visival = document.getElementById('visival').value;
				} else {
					currentImageDef.visivar = null;
					currentImageDef.visival = null;
				}
				currentImageDef.rmultiplier = document.getElementById('rmultiplier').value;
				currentImageDef.xmultiplier = document.getElementById('xmultiplier').value;
				currentImageDef.ymultiplier = document.getElementById('ymultiplier').value;
				currentImageDef.roffset = document.getElementById('roffset').value;
				currentImageDef.xoffset = document.getElementById('xoffset').value;
				currentImageDef.yoffset = document.getElementById('yoffset').value;
				currentImageDef.rxshift = document.getElementById('rxshift').value;
				currentImageDef.ryshift = document.getElementById('ryshift').value;
				currentImageDef.stretch = document.getElementById('cbStretch').checked;
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
		document.getElementById('rvartype').value = '(A:';
		document.getElementById('rsimvar').value = '';
		document.getElementById('xvartype').value = '(A:';
		document.getElementById('xsimvar').value = '';
		document.getElementById('yvartype').value = '(A:';
		document.getElementById('ysimvar').value = '';
		document.getElementById('visivartype').value = '(A:';
		document.getElementById('visivar').value = '';
        document.getElementById('visival').value = '';
		document.getElementById('roffset').value = '0';
		document.getElementById('xoffset').value = '0';
		document.getElementById('yoffset').value = '0';
		document.getElementById('rmultiplier').value = '1.0';
		document.getElementById('xmultiplier').value = '1.0';
		document.getElementById('ymultiplier').value = '1.0';
		document.getElementById('rxshift').value = '0';
		document.getElementById('ryshift').value = '0';
	}
	
	function addTextDefinition(inEvent) {
		currentTextDef = {};
		selectedTextDefIndex = -1;
		resetTextFields();
	}
	
	function copyTextDefinition(inEvent) {
		if (currentTextDef && selectedTextDefIndex >= 0){
			var headerstr = document.getElementById('textheader').value;
			if (headerstr && headerstr.length > 0){
				// Copy this text defintion
				currentTextDef = {};
				selectedTextDefIndex = -1;
				saveTextDefinition(inEvent);
			}
		}
	}
	
	function saveTextDefinition(inEvent) {
		if (currentTextDef){
			var headerstr = document.getElementById('textheader').value;
			if (headerstr && headerstr.length > 0){
				currentTextDef.header = headerstr;
				var varStr = document.getElementById('simvar').value.replace(/·/g, ' ');
				currentTextDef.simvar = (document.getElementById('vartype').value + varStr + ")");
				varStr = document.getElementById('txtvisivar').value.replace(/·/g, ' ');
				if (varStr.length > 0){
					currentTextDef.visivar = (document.getElementById('txtvisivartype').value + varStr + ")");
					currentTextDef.visival = document.getElementById('txtvisival').value;
				} else {
					currentTextDef.visivar = null;
					currentTextDef.visival = null;
				}
				currentTextDef.fractions = document.getElementById('fractions').value;
				currentTextDef.simvarpad = document.getElementById('simvarpad').value;
				currentTextDef.varoffset = document.getElementById('varoffset').value;
				currentTextDef.multiplier = document.getElementById('multiplier').value;
				currentTextDef.xshift = document.getElementById('xshift').value;
				currentTextDef.yshift = document.getElementById('yshift').value;
				currentTextDef.color = document.getElementById('forecolor').value;
				currentTextDef.font = document.getElementById('fonts').value;
				currentTextDef.fontsize = document.getElementById('fontsize').value;
				if (document.getElementById('cbBold').checked){
					currentTextDef.bold = 1;
				} else{
					currentTextDef.bold = 0;
				}
				if (document.getElementById('cbItalic').checked){
					currentTextDef.italic = 1;
				} else{
					currentTextDef.italic = 0;
				}
				currentTextDef.align = 0;
				currentTextDef.splittext = document.getElementById('cbsplit').value;
				currentTextDef.splitwidth = document.getElementById('splitwidth').value;
				currentTextDef.splitstretch = document.getElementById('cbstretch').value;
				if (document.getElementById('rdio1').checked)
					currentTextDef.align = 1;
				if (document.getElementById('rdio3').checked)
					currentTextDef.align = 2;
				var textSelect = document.getElementById('textdefs');
				if (selectedTextDefIndex >= 0){
					textSelect.options[selectedTextDefIndex].text = currentTextDef.header;
					settings["textdefs"][selectedTextDefIndex] = currentTextDef;
				} else{
					if (!settings["textdefs"])
						settings["textdefs"] = [];
					settings["textdefs"].push(currentTextDef);
					textSelect.options[textSelect.options.length] = new Option(currentTextDef.header, textSelect.options.length);
					resetTextFields();
				}
				document.getElementById('submitbtn').click();
				currentTextDef = settings["textdefs"][selectedTextDefIndex];
				loadTextDefValues(currentTextDef);
			}
		}
	}
	
	function deleteTextDefinition(inEvent) {
		if (settings["textdefs"].length == 1){
			settings["textdefs"] = [];
			var textSelect = document.getElementById('textdefs');
			textSelect.remove(0);
			document.getElementById('submitbtn').click();
		} else {
			if (selectedTextDefIndex >= 0){
				settings["textdefs"].splice(selectedTextDefIndex, 1);
				var textSelect = document.getElementById('textdefs');
				textSelect.remove(selectedTextDefIndex);
				document.getElementById('submitbtn').click();
			}
		}
		resetTextFields();
	}
	
	function resetTextFields(){
		document.getElementById('simvar').value = '';
		document.getElementById('textheader').value = '';
		document.getElementById('vartype').value = "(A:";
		document.getElementById('txtvisivar').value = '';
        document.getElementById('txtvisival').value = '';
		document.getElementById('txtvisivartype').value = "(A:";
        document.getElementById('fractions').value = '0';
		document.getElementById('simvarpad').value = '0';
		document.getElementById('varoffset').value = '0';
		document.getElementById('multiplier').value = '1.0';
		document.getElementById('xshift').value = '100';
		document.getElementById('yshift').value = '50';
		document.getElementById('forecolor').value = '#ffffff';
		document.getElementById('fonts').value = 'Tahoma';
		document.getElementById('fontsize').value = '50';
		document.getElementById('cbBold').checked = false;
		document.getElementById('cbItalic').checked = false;
		document.getElementById('cbStretch').checked = true;
		document.getElementById('rdio2').checked = true;
		document.getElementById('cbsplit').value = '0';
		document.getElementById('splitwidth').value = '10';
		document.getElementById('cbstretch').value = '0';
	}
	
	function textDefSelected(inEvent) {
		selectedTextDefIndex = event.target.value;
		currentTextDef = settings["textdefs"][selectedTextDefIndex];
		loadTextDefValues(currentTextDef);
	}
	
	function textDefClicked(inEvent) {
		if (settings["textdefs"].length == 1) {
			selectedTextDefIndex = 0;
			currentTextDef = settings["textdefs"][selectedTextDefIndex];
			loadTextDefValues(currentTextDef);
		}
	}
	
	function loadTextDefValues(currentTextDef){
		if (currentTextDef){
			document.getElementById('textheader').value = currentTextDef.header;
			var varStr = currentTextDef.simvar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('vartype').value = varStr.substr(0,compos + 1);
				document.getElementById('simvar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
			} else {
			  document.getElementById('vartype').value = "(A:";
			  document.getElementById('simvar').value = "";
			}
			varStr = currentTextDef.visivar;
			if (varStr && varStr.length > 0){
				var compos = varStr.indexOf(":");
				document.getElementById('txtvisivartype').value = varStr.substr(0,compos + 1);
				document.getElementById('txtvisivar').value = varStr.substr(compos + 1,varStr.length - compos - 2);
				if (currentTextDef.visival){
					document.getElementById('txtvisival').value = currentTextDef.visival;
				} else{
					document.getElementById('txtvisival').value = "";
				}
			} else {
			  document.getElementById('txtvisivartype').value = "(A:";
			  document.getElementById('txtvisivar').value = "";
			  document.getElementById('txtvisival').value = "";
			}
			var colStr = currentTextDef.color;
			if (colStr && colStr.length > 0){
				document.getElementById('forecolor').value = colStr;
			} else {
			  document.getElementById('forecolor').value = '#ffffff';
			}
			
			colStr = currentTextDef.font;
			if (colStr && colStr.length > 0){
				document.getElementById('fonts').value = colStr;
			} else {
			  document.getElementById('fonts').value = 'Tahoma';
			}

			colStr = currentTextDef.fontsize;
			if (colStr && colStr.length > 0){
				document.getElementById('fontsize').value = colStr;
			} else {
			  document.getElementById('fontsize').value = 50;
			}
			
			colStr = currentTextDef.bold;
			if (colStr == 1){
				document.getElementById('cbBold').checked = true;
			} else {
			  document.getElementById('cbBold').checked = false;
			}
			colStr = currentTextDef.italic;
			if (colStr == 1){
				document.getElementById('cbItalic').checked = true;
			} else {
			  document.getElementById('cbItalic').checked = false;
			}
			
			colStr = currentTextDef.varoffset;
			if (colStr && colStr.length > 0){
				document.getElementById('varoffset').value = colStr;
			} else {
			  document.getElementById('varoffset').value = 0;
			}
			
			colStr = currentTextDef.multiplier;
			if (colStr && colStr.length > 0){
				document.getElementById('multiplier').value = colStr;
			} else {
			  document.getElementById('multiplier').value = 1.0;
			}

			colStr = currentTextDef.fractions;
			if (colStr && colStr.length > 0){
				document.getElementById('fractions').value = colStr;
			} else {
			  document.getElementById('fractions').value = 0;
			}
			
			colStr = currentTextDef.simvarpad;
			if (colStr && colStr.length > 0){
				document.getElementById('simvarpad').value = colStr;
			} else {
			  document.getElementById('simvarpad').value = 0;
			}
			
			colStr = currentTextDef.xshift;
			if (colStr && colStr.length > 0){
				document.getElementById('xshift').value = colStr;
			} else {
			  document.getElementById('xshift').value = 100;
			}

			colStr = currentTextDef.yshift;
			if (colStr && colStr.length > 0){
				document.getElementById('yshift').value = colStr;
			} else {
			  document.getElementById('yshift').value = 50;
			}
						colStr = currentTextDef.splittext;
			if (colStr && colStr.length > 0){
				document.getElementById('cbsplit').value = colStr;
			} else {
			  document.getElementById('cbsplit').value = '0';
			}
			colStr = currentTextDef.splitwidth;
			if (colStr && colStr.length > 0){
				document.getElementById('splitwidth').value = colStr;
			} else {
			  document.getElementById('splitwidth').value = '10';
			}
			colStr = currentTextDef.splitstretch;
			if (colStr && colStr.length > 0){
				document.getElementById('cbstretch').value = colStr;
			} else {
			  document.getElementById('cbstretch').value = '0';
			}
			document.getElementById('rdio2').checked = true;
			if (currentTextDef.align && currentTextDef.align == 1)
				document.getElementById('rdio1').checked = true;
			if (currentTextDef.align && currentTextDef.align == 2)
				document.getElementById('rdio3').checked = true;
		}
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
		settings["backcolor"] = document.getElementById('backcolor').value;
		settings["fpsnum"] = document.getElementById('fpsnum').value;
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
