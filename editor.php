<meta charset="utf-8">
<script src="./jquery-2.1.3.min.js"></script>
<script src="./jquery-ui.min.js"></script>
<script src="./system.js"></script>
<script src="./pyr.js"></script>
<script src="./natsu.js"></script>

<style>
.dialog-background {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.67)
    overflow-y: scroll;
    z-index: 5000;
}
.dialog input[type="text"]{
	color:black;
}
.dialog {
	margin: 0px auto;
	background: #161616;
    border: 1px solid #2d2d2d;
    box-shadow: 2px 2px 5px black;
}
.dialog-title{
	padding: 10px;
}
.dialog-title .close {
    width: 20px;
    height: 20px;
    float: right;
    background-image: url(./images/gtk_close.png);
    background-repeat: no-repeat;
    background-size: 20px;
    position: relative;
    top: -2px;
    right: -5px;
    border: 1px solid rgba(0, 0, 0, 0);
    cursor: pointer;
}
.dialog-title .title {
	font-weight: bold;
}
.dialog-content {
	padding: 0px 10px;
}
.dialog-footer {
	padding: 10px;
}
.dialog-footer-button {
	text-align:right;
}
.dialog-footer-button button, .dialog-footer-button a {
	margin-left:10px;
}

body {background:black;font-family:Arial;margin:0px;padding:0px;border: 1px solid #02435d;}
* {color:white;}
.button {     
	min-width: 40px;
    height: 34px;
    background-repeat: no-repeat;
    background-position: 12px 9px;
	cursor:pointer;
	background-color:#191919;
}
.button:hover {
	background-color:#2f2f2f;
}
.button:active {
	background-color:#023f73;
}
.button.iconhelp { background-image:url(./images/info.png); }

button, a.button, .ContextMenu, input[type="submit"] {
	-border: 1px solid #C0C0C0;
	background-color: #191919;
	padding: 5px 12px;
	cursor:pointer;
	text-decoration: none;
	color:white;
	font-size: 12px;
	outline:0px;
	border:1px solid transparent;
	border-bottom:0px;
}
button:active, a.button:active, .ContextMenu:active, input[type="submit"]:active, .button.clicked{
	box-shadow: 1px 1px 4px #C0C0C0 inset;
}
button:hover, a.button:hover, .ContextMenu:hover{
	background-color: #F5F5F5;
	color:black;
}
button a:focus, a.button:focus, .ContextMenu a:focus, a.ContextMenu:focus, input[type="submit"] a:focus{
	color:black;
}
.ContextMenu.selected {
	background-color: #353535;
	color: #FFF;
	border: 1px solid #525252;
	-z-index: 600;
    border-bottom: 0px;
    position: relative;
}
.ContextMenu.selected:active{
	box-shadow: 1px 1px 4px #2E2E2E inset;
}
.ContextMenu.selected:focus{
	color:white;
}

.listBox.ToolTipMax {
	overflow:inherit;
	position:relative;
	background-color:white;
	color: black;
	box-shadow: 0 3px 8px rgba(0, 0, 0, 0.8);
	border: 1px solid #777;
	border-radius: 3px;
	width:270px;
}

.listDiv {float:left;width:400px;height:0px;display:none;position:absolute;top:0px;z-index:500;}
.listBox {
  border: 1px solid #525252;
  background-color: #353535;
  -border: 1px solid #A3A3A3;
  padding: 5px 0px;
  min-width: 120px;
  -box-shadow: 0px 2px 11px #626262;
  display: inline-block;
  max-height: 200px;
  border-radius: 0px;
  overflow: auto;
}
.listBox ul{
	list-style-type:none;
	margin: 0px;
    padding: 0px 5px;
}
 
.listBox ul li:hover{
	background-color: #4E69A2;
	-box-shadow: 0px 0px 1px #435A8B;
	color: white;
}
.listBox ul li a {
	display:block;
	padding: 6px 8px;
	text-decoration: none;
	background-color:transparent;
	font-size:12px;
	white-space: nowrap;
}
.listbox ul li a img.des { 
  float: left;
  position: relative;
  bottom: 2px;
  padding-right: 7px;
}
.listBox ul li{ font-size:12px;cursor:pointer; } 
.listBox ul li:hover{
	background-color:#4c4c4c;
	color:white;
}

 li.sel.selx {background-color: #4c4c4c;color: #FFF;background-repeat: no-repeat;background-position: 6px 9px;background-image:url(images/check_white.png);}
 li.selx {background-color: #4c4c4c;color: #FFF;}
 li.selx a {
  color: white;
}

.listBox ul li.text { background-color: rgba(0, 0, 0, 0);color: #646464;padding: 4px 9px;padding-top: 1px; }
.listBox ul li.cara {    
	border-bottom: 1px solid #6d6d6d;
    height: 0px;
    margin: 1px 18px;
    margin-right: 0px;
}

 li a {color:white;}
.listBox ul li.disabled:hover { background:#353535; }
.listBox ul li.disabled a {color: #505050;}
 li.sel {background-image:url(images/check.png);background-repeat: no-repeat;padding-left: 11px;background-position: 6px 9px;background-size: 12px;font-weight:bold;}
 li.sel:hover {background-image:url(images/check_white.png);}
 li.nos {padding-left:11px;}

.ContextMenuHi {
	background:transparent;
	border:1px solid transparent;
}

.ContextMenu input {
	background-color:transparent;
	border:0px;
	outline:0;
}
.ContextMenu.selected input {
	color: #FFF;
}

.ContextMenu.input.accepted {
	border: 1px solid #8B8B8B;
	background: blue;
}
.ContextMenu.input {
	border: 1px solid #8B8B8B;
	background: #FFF;
	padding: 4px 6px;
	cursor:text;	
}
.ContextMenu.withimage{
	background-repeat: no-repeat;	
	background-size: 20px 20px;
	background-position: 2px 2px;
}
.ContextMenu.withimage input {
	margin-left:20px;
}
.ContextMenu.input:active {
	background: #E2E2E2;
	box-shadow: 0px 0px 0px;
	background-repeat: no-repeat;
	background-size: 20px 20px;
	background-position: 2px 2px;
}

.ContextMenu .textin {
	width: 92%;
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	margin-bottom: -4px;
	white-space: nowrap;
}

.ContextMenu.input.selected input { color:black; }

.uprow_pan {width: 400px;position: relative;height: 11px;}
.uprow {background-image:url(images/up.png);width:20px;height:11px;right: 2px;top:1px;position: absolute;}

.item {
	padding: 5px;
    padding-left: 45px;
	cursor:pointer;
	background: url(./images/file.png);
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: 23px 6px;
}
.item.selected {
	background-color: #232323;
	font-weight:bold;
}
.item.callback {
	background-image:url(./images/settings.png);
}

.selected_tab {
	display: inline-block;
    position: relative;
    padding: 6px 15px;
    background-color: #353535;
    border-bottom: 0px;
    top: 0px;
    float: left;
    cursor: pointer;
    margin-right: 7px;
    color: white;
}

.tab {
	float: left;
    padding: 6px 15px;
    cursor: pointer;
    background-color: #232323;
	margin-right: 7px;
}

.info_msg {
    padding: 5px;
    padding-left: 25px;
    font-size: 12px;
    background-image: url(./images/question_blue.png);
    background-repeat: no-repeat;
    background-position: 2px 4px;
    background-size: 15px;
}
.error_msg {
	background: #380000;
	-border-top: 1px solid red;
    -border-bottom: 1px solid red;
    padding: 5px;
    padding-left: 25px;
    font-size: 12px;
    background-image: url(./images/delete.png);
    background-repeat: no-repeat;
    background-position: 2px 4px;
    background-size: 15px;
}
.warning_msg {
	background: #F2FFAF;
    border-bottom: 1px solid yellow;
    border-top: 1px solid yellow;
    padding: 5px;
    padding-left: 25px;
    font-size: 12px;
    background-image: url(./images/messagebox_warning.png);
    background-repeat: no-repeat;
    background-position: 2px 4px;
    background-size: 15px;
}
.repeat {
	margin-right: 5px;
    background: #2d2d2d;
    color: white;
    padding: 2px 6px;
    border-radius: 17px;
}

.expand {
    background-image: url(./images/ExpandArrow.png);
    background-size: 12px;
    padding-left: 17px;
    background-position: 1px 0px;
    background-repeat: no-repeat;
	cursor:pointer;
}

#terminal {background-color:black;color:white;font-family:courier,fixed,swiss,monospace,sans-serif;font-size:14px;}
#terminal2 {background-color:black;color:white;font-family:courier,fixed,swiss,monospace,sans-serif;font-size:14px;}

.inside_whatewer {overflow: hidden;}
</style>
<link rel="stylesheet" href="./codemirror/base16-dark.css">
<link rel="stylesheet" href="./codemirror/codemirror.css">
<link rel="stylesheet" href="./codemirror/addon/hint/show-hint.css">
<script src="./codemirror/codemirror.js"></script>
<script src="./codemirror/python/python.js"></script>
<script src="./codemirror/addon/selection/active-line.js"></script>
<script src="./codemirror/addon/edit/matchbrackets.js"></script>
<script src="./codemirror/addon/hint/show-hint.js"></script>
<script src="./codemirror/addon/hint/html-hint.js"></script>
<body>
	<div style="background: #191919;">
		<div style="position:absolute;bottom: 10px;left: 10px;background:white;width: 241px;">
			<div style="padding:10px;color:black;border: 1px solid #837373;">
				<b style="color:black;">Víte že?</b><br>
				Spuštěná aplikace je provozována tak jak je, builded aplikace může běžet rychleji!
			</div>
		</div>
		<div style="float:right;"><div class='button iconhelp'></div></div>
		<div style="padding: 8px;">PYR code editor <span id="error_top_alert" style="display:none;background-color:red;margin-left:5px;padding:4px;">Sorry! No Web Storage support.. You can't save settings and projects!</span></div>
		<div style="padding:6px 0px;font-size: 12px;">
			<a class="ContextMenu noarrow" id="file_butt" autosize="0" width="200" dropdown="file_list" dropdown-open="left" selecttype="3">File</a>
			<div class="listDiv" id="file_list">
				<div class="listBox" style="width:200px">
					<ul>
						<li value_="1" class="nos"><a>New project</a></li>
						<li value_="2" class="nos"><a onClick="newFile();">New file</a></li>
						<li value_="3" class="nos disabled"><a>Open last project</a></li>
						<li value_=""  class="nos cara"><a></a></li>
						<li value_="4" class="nos disabled"><a>Rename</a></li>
						<li value_="5" class="nos"><a onClick="saveProject();">Save project</a></li>
						<li value_="6" class="nos"><a onClick="loadProject();">Load project</a></li>
					</ul>
				</div>
			</div>
			<a class="ContextMenu noarrow" autosize="0" width="200" dropdown="project_list" dropdown-open="left" selecttype="3">Project</a>
			<div class="listDiv" id="project_list">
				<div class="listBox" style="width:200px">
					<ul>
						<li value_="1" class="nos disabled"><a>Settings</a></li>
						<li value_="" class="nos cara"><a></a></li>
						<li value_="2" class="nos disabled"><a>Close</a></li>
					</ul>
				</div>
			</div>
			<a class="ContextMenu noarrow" autosize="0" width="200" dropdown="help_list" dropdown-open="left" selecttype="3">Help</a>
			<div class="listDiv" id="help_list">
				<div class="listBox" style="width:200px">
					<ul>
						<li value_="1" class="nos"><a>Open help</a></li>
						<li value_="2" class="nos"><a>Samples</a></li>
						<li value_="" class="nos cara"><a></a></li>
						<li value_="3" class="nos"><a>About PYR editor</a></li>
					</ul>
				</div>
			</div>
			<div style="display: inline-block;background: silver;width: 1px;height: 15px;position: relative;top: 3px;margin-right:13px;"></div>
			Executable <input type="text" id="run_file" value="main.pyr" style="background:black;border:1px solid white;padding-left:4px;">
			<a class="button" onClick="run();" id="runbutt">RUN</a>
			<div style="display: inline-block;background: silver;width: 1px;height: 15px;position: relative;top: 3px;margin-right:13px;"></div>
			<span id="infoprog">ID vlákna: ...</span>
		</div>
		
		<div style="background:black;">
			<div style="float:left;">
				<div style="width:100px;height:30px;" id=pleft>
					<div style="background: #0e0e0e;border:1px solid #252525;margin:10px;margin-right:0px;padding:0px;">
						<div style="padding:5px;background: #191919;">Files</div>
						<div id="project_files">
						
						</div>
					</div>
				</div>
			</div>
			<div style="float:right">
				<div style="width:100px;height:30px;" id=prigh>
					<div style="background: #0e0e0e;border:1px solid #252525;margin:10px;margin-left:0px;padding:5px;" id="all_pages">
						<div class="inside_whatewer" style="display:none;" id="blank_page"><div style="font-size: 57px;color: #1d1d1d;text-align: center;padding-top: 69px;">Blank page</div></div>
					</div>
					<div style="background: #0e0e0e;border:1px solid #252525;margin:10px;margin-left:0px;padding:5px;height:180px;">
						<div style='height: 30px;float: left;border-bottom: 1px solid #2b2b2b;width: 99%;padding: 5px 12px;padding-left: 0px;padding-bottom: 0px;position: relative;top: -5px;'>
							<div class=selected_tab xx=5 id=devtab5>Log</div>
							<div class=tab xx=6 id=devtab6>Variables</div>
							<div class=tab xx=7 id=devtab7>Output</div>
							<div class=tab xx=8 id=devtab8>Handler</div>
						</div><div style='clear:both;'></div>
						
						<div style="overflow: auto;height: 144px;" id="debugtab5">
							<div class="info_msg">PYR debug line....</div>
						</div>
						<div style="overflow: auto;height: 144px;display:none;" id="debugtab6">
							variables...
						</div>
						<div style="overflow: auto;height: 144px;display:none;" id="debugtab7">
							<form action=# onSubmit="try{ terminal_execute(); }catch(Error){ errorCatcher(Error, 'Form'); }finally{ return false; }" style="height:0px;border: 0px;padding:0px;margin:0px;position:relative;top:-1px;">
								<input type="text" autocomplete="off" style="width: 1px;height: 1px;border: 0px;padding: 0px;margin: 0px;background:transparent;color:transparent;" onFocus="terminal.youtype=true;" onBlur="if($(this).val()=='' && lastTab2 == $('#devtab7')){ $(this).focus(); }else{ terminal.youtype=false; }" id="terminal_code" onKeyPress="terminal_type(this, this.value);" onKeyUp="terminal_type(this, this.value);return false;">
							</form>
							<div id="terminal2" style="margin:0px;background:black;color:white;" onClick="$('#terminal_code').focus();"></div>
						</div>
						<div style="overflow: auto;height: 144px;display:none;" id="debugtab8">
							<textarea style="width:100%;height:144px;background:black;border:1px solid silver;" id="handler" readonly></textarea>
						</div>
					</div>
				</div>
			</div>
			<div style="clear:both"></div>
		</div>
	</div>
	<div id="template_text_editor" style="display:none;">
			<textarea onKeyUp="files[actual_file] = $(this).val();" id="code" name="code" style="width:100%;height:100%;background-color:black;"></textarea>
	</div>
	<div id="template_blank_page"  style="display:none;"><div style="font-size: 57px;color: #1d1d1d;text-align: center;padding-top: 69px;">Blank page</div></div>
	<script>
	var _js_errors_catch = 0;
	window.onerror = function (message, file, line, col, error) {
		_js_errors_catch++;
		$("#devtab8").html("Handler ("+_js_errors_catch+")");
		$("#handler").val(message+"\n[  "+file+" ("+line+":"+col+")  ]\n"+$("#handler").val());
	};
	/*
	var oldLog = console.log;
    console.log = function (message) {
		if(typeof message != "object"){
			_js_errors_catch++;
			var temp = new Date();
			$("#devtab8").html("Handler ("+_js_errors_catch+")");
			$("#handler").val("["+temp.getHours()+":"+(temp.getMinutes()<10?"0"+temp.getMinutes():temp.getMinutes())+"] "+message+"\n"+$("#handler").val());
		}
        oldLog.apply(console, arguments);
    };
	*/
	var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
		lineNumbers: true,
		styleActiveLine: true,
		matchBrackets: true,
		theme: "base16-dark"
	  });
  
	terminal = new Terminal(95, 8, "#terminal2");
	terminal.write(">> ");
	function terminal_type(id, value){
		terminal.clearLine();
		if(value.substr(0,1) == "@"){
			terminal.setColor("yellow").write("<< ").setColor("white").write(value);
		}else{
			terminal.write(">> ").write(value);
		}
		var pos = doGetCaretPosition(document.getElementById("terminal_code"));
		terminal.setCursor(3 + pos, terminal.cursor[1]);
		terminal.redraw(true);
		$(id).focus();
	}
	pyr = new Pyr(terminal);

	var premJsMode = false;
	function terminal_execute(){
		var val = $("#terminal_code").val();
		$("#terminal_code").val("");
		terminal.next();
		data = val.split(" ");
		
		if(data[0] == "js"){
			if(premJsMode){
				terminal.setColor("red").write("Javascript mode switched off").next().setColor("white");
			}else{
				terminal.setColor("green").write("Javascript mode switched on").next().setColor("white");
			}
			premJsMode=!premJsMode;
		}else if(val.substring(0,1) == "@" || premJsMode){
			try{
				if(premJsMode)
					ret = eval(val);
				else		
					ret = eval(val.substring(1));
				terminal.setColor("yellow").write(""+ret).setColor("white").next();
			}catch(Error){
				errorCatcher(Error, "Console");
			}
		}else if(data[0] == ".var"){
			for (var vars in pyr.variables) {
				var_name = vars;
				vars = pyr.variables[vars];
				val = "...";
				if(typeof vars.type == "undefined") vtp = "undefined"; else vtp = vars.type;
				for(i=0, mezera = "";i<13-("("+vtp+")").length;i++) mezera+=" ";
				for(i=0, mezer2 = "";i<13-(var_name).length;i++) mezer2+=" ";
				if(typeof vars.func["_string"] != "undefined") val = getValue(vars);
				terminal.write("("+vars.type+")"+mezera+" "+var_name+""+mezer2+" "+val).next();
			}
		}else{
			//terminal.setColor("silver").write("[Executeting code]").next().setColor("white");
			executed = pyr.execute(val, "<console>");
			if(executed != "null" && executed!=null){
				if(pyr.isError()){
					terminal.setColor("red");				
					//terminal.write("ErrorCatcher: ").next();
					if(getValue(executed.vars["tline"]) == ""){
						terminal.write((executed.func["type"]())+": "+getValue(executed.vars["error"])).setColor("white");
					}else{
						if(getValue(executed.vars["line"]) != "NaN"){
							terminal.write("  Line "+getValue(executed.vars["line"])+", in file "+getValue(executed.vars["file"])+"").next();
							terminal.write("  "+getValue(executed.vars["tline"])).next();
							mezera = "  ";
							for(var i=0;i<getValue(executed.vars["pos"]);i+=1){
								mezera+=" ";
							}
							terminal.write(mezera+"^").next();
						}
						terminal.write((executed.func["type"]())+": "+getValue(executed.vars["error"])).setColor("white");
					}
				}else{
					terminal.write(""+getValue(executed, "")).setColor("white").next();
				}
			}
			if(terminal.getCurrentLine() != ""){ terminal.next(); }
		}
	}

	function expand(id){
		$("#id_error_exp_"+id).toggle();
	}
	var _last_message_added = 0;
	function logit(text, clas){
		var same = false;
		_last_message_added++;
		if($("#_msg_id_"+(_last_message_added-1)+"").length > 0){
			if($($("#_msg_id_"+(_last_message_added-1)+"").find(".text")[0]).html() == text){
				if($($("#_msg_id_"+(_last_message_added-1)+"").find(".repeat")[0]).html() == "") $($("#_msg_id_"+(_last_message_added-1)+"").find(".repeat")[0]).html("1");
				$($("#_msg_id_"+(_last_message_added-1)+"").find(".repeat")[0]).html(parseInt($($("#_msg_id_"+(_last_message_added-1)+"").find(".repeat")[0]).html())+1);
				$($("#_msg_id_"+(_last_message_added-1)+"").find(".repeat")[0]).show();
				same = true;
				_last_message_added--;
			}
		}
		if(!same){
			if(typeof clas == "undefined") clas = "info_msg";
			$("#debugtab5").append("<div class='"+clas+"' id='_msg_id_"+_last_message_added+"'><span class=repeat style='display:none;'></span><span class=text>"+text+"</span></div>");
			$('#debugtab5').scrollTop($('#debugtab5')[0].scrollHeight);
		}
	}
	//files[actual_file]
	var files;
	var _pyr_thread, _actual_thread = 0;
	function run(){
		var rnfl = $("#run_file").val();
		if(typeof files[rnfl] == "undefined" || files[rnfl] == ""){
			logit("File '"+rnfl+"' is not exists or is empty!", 'error_msg');
			return false;
		}
		var vl = $("#runbutt").html();
		if(vl == "RUN"){
			terminal.clear();
			_pyr_thread = new Pyr(terminal);
			_pyr_thread.files = files;
			pyr = _pyr_thread;
			$("#infoprog").html("ID vlákna: "+(_pyr_thread._thread_id));
			_actual_thread = _pyr_thread._thread_id;
			_pyr_state = _pyr_thread.compile(files[rnfl],rnfl);
			$("#runbutt").html("STOP");
			if(_pyr_thread.errorOcured){
				logit("Program ended at "+((Math.floor((Date.now() - _pyr_thread.save_time_) / 10))/100)+"s with error", 'error_msg');
				stoped();
			}
		}else{
			$("#infoprog").html("ID vlákna: ...");
			_pyr_thread._thread_stoped = true;
			$("#runbutt").html("RUN");
		}
	}
	function stoped(){
		$("#infoprog").html("ID vlákna: ...");
		$("#runbutt").html("RUN");
		terminal.next();
		_pyr_thread._thread_stoped = true;
	}
	var selectedDIV = "", lastDIVsel = "", selectedBUT = "", selectData = new Array();
	start();
	document.body.addEventListener('contextmenu', function(ev) {
		/*
		ev.preventDefault();
		$('#file_butt').click();
		$("#file_list").css("left",ev.pageX );
		$("#file_list").css("top",ev.pageY );
		$("#file_list").css("width","300px");
		return false;
		*/
	}, false);
	function rsizewin(){
		var plef,prigh;
		plef = $("#pleft");
		prigh = $("#prigh");
		plef.css("height", "0px");
		prigh.css("height", "0px");
		$(".inside_whatewer").css("height", "0px");
		winh = $(document).height();
		winw = ($(document).width()-20)/100;
		plef.css("height", (winh-80)+"px");
		plef.css("width", "250px");
		prigh.css("height", (winh-80)+"px");
		prigh.css("width", ((winw*100)-250)+"px");
		$(".inside_whatewer").css("height", (prigh.height()-25-200)+"px");
	}
	rsizewin();
	$( window ).resize(function() {
	  rsizewin();
	});
	
	var canSaveProject = false;
	if (typeof(Storage) !== "undefined") {
		canSaveProject = true;
	} else {
		$("#error_top_alert").show();
	}
	
	function saveProject(){
		_project_files_selected.selected = false;
		projects = new Array();
		var i=0;
		if(canSaveProject){
			for(var file in files){
				save(file, files[file]);
				projects[i] = file;
				i++;
			}
		}
		localStorage.setItem("project_default", JSON.stringify(projects));
		localStorage.setItem("project_files", JSON.stringify(_project_files));
		_project_files_selected.selected = true;
	}
	
	function loadProject(){
		project_files = $.parseJSON(localStorage.getItem("project_default"));
		for(var file in project_files){
			files[project_files[file]] = localStorage.getItem("file_"+project_files[file]);
		}
		if(localStorage.getItem("project_files") != null){
			_project_files = $.parseJSON(localStorage.getItem("project_files"));
			redraw_filelist();
		}
	}
	
	function save(name, text){
		if(canSaveProject){
			localStorage.setItem("file_"+name, text);
		}
	}
	
	var _project_files = {
		0: { type: "file", exc: "pyr", name: "main.pyr", selected: false },
		1: { type: "file", exc: "callback", name: "Properties", selected: false },
		2: { type: "file", exc: "manifest", name: ".manifest", selected: false }
	}
	
	function crmakeNewFile(){
		var __dialog = new Dialog();
		__dialog.setTitle("New file");
		__dialog.setButtons([Dialog.CONFIRM, Dialog.CANCEL2]);
		__dialog.enableMove();
		__dialog.dialogHtml.html("<b>Write new file name: </b><br><input type=text id=new_file style='width:100%;padding:8px;'>");
		__dialog.Show();
		butt = __dialog.getButtons();
		$(butt[1]).click(function(){ __dialog.Close(); }); //Close
		$(butt[0]).click(function(){
			nf = $("#new_file").val(); if(nf == "") nf = null;
			if(nf == null) return;
			_project_files_selected = _project_files[Object.keys(_project_files).length] = { type: "file", exc: "pyr", name: nf, selected: false };
			redraw_filelist();
			__dialog.Close();
		});
	}
	
	
	function newFile(){
		/*
		var nf = prompt("Please enter name of new file", "newfile.pyr");
		if(nf == null) return;
		_project_files_selected = _project_files[Object.keys(_project_files).length] = { type: "file", exc: "pyr", name: nf, selected: false };
		redraw_filelist();
		*/
		crmakeNewFile();
	}
	
	var _project_files_selected = _project_files[0];
	var allList = new Array();
	var last_showed_page = $("#blank_page");
	var actual_file = "";
	var files = new Array();
	var editors = new Array();
	
	var comp = [
		["here", "hither"],
		["asynchronous", "nonsynchronous"],
		["completion", "achievement", "conclusion", "culmination", "expirations"],
		["hinting", "advive", "broach", "imply"],
		["function","action"],
		["provide", "add", "bring", "give"],
		["synonyms", "equivalents"],
		["words", "token"],
		["each", "every"],
		["return"],
		["repeat"]
	  ]
	
	function hintCode(cm, option) {
		return new Promise(function(accept) {
		  setTimeout(function() {
			var cursor = cm.getCursor(), line = cm.getLine(cursor.line)
			var start = cursor.ch, end = cursor.ch
			while (start && /\w/.test(line.charAt(start - 1))) --start
			while (end < line.length && /\w/.test(line.charAt(end))) ++end
			var word = line.slice(start, end).toLowerCase()
			var lis = new Array();
			for (var i = 0; i < comp.length; i++){ if(comp[i][0].substr(0, end - start) == word){ lis.push(comp[i][0]); } }
			console.log(lis);
			if(lis.length != 0)
				return accept({list: lis, from: CodeMirror.Pos(cursor.line, start), to: CodeMirror.Pos(cursor.line, end)})
			else
				return accept({list: new Array("No suggestion")})
		  }, 100)
		})
	  }
	
	function _project_files_draw(object, id, cat){
		var i=0;
		for (var key in object){
			var it = object[key];
			allList[cat+"_"+i] = it;
			if(it.type == "file"){
				var item = $("<div></div>");
				item.addClass("item");
				item.attr("id", cat+"_"+i);
				item.attr("data-exc", it.exc);
				item.attr("data-name", it.name);
				item.html(it.name);
				if(it.selected){
					item.addClass("selected");
				}
				item.addClass(it.exc);
				it.clickF = item.click;
				item.click(function(){
					var it = allList[$(this).attr("id")];
					_project_files_selected.selected = false;
					_project_files_selected = it;
					it.selected = true;
					
					var id;
					var exc = $(this).attr("data-exc");
					last_showed_page.hide();
					
					if($("#page_"+$(this).attr("id")).length != 0){
						$("#page_"+$(this).attr("id")).show();
						id = $("#page_"+$(this).attr("id"));
						if(exc == "pyr"){
							id.find("textarea").val(files[$(this).attr("data-name")]);
							
						}
					}else{
						id = $("<div></div>");
						id.addClass("inside_whatewer");
						id.attr("id", "page_"+$(this).attr("id"));
						if(exc == "pyr"){
							id.html($("#template_text_editor").html());
							id.find("textarea").val(files[$(this).attr("data-name")]);
							
							editors[$(this).attr("data-name")] = CodeMirror.fromTextArea(id.find("textarea")[0], {
								lineNumbers: true,
								styleActiveLine: true,
								matchBrackets: true,
								mode: "python",
								theme: "base16-dark",
								extraKeys: {"Ctrl-Space": "autocomplete"},
								hintOptions: {hint: hintCode}
							  });
							var that = editors[$(this).attr("data-name")];
							that.on('change', function () {
								html = that.getValue();
								files[actual_file] = html;
							});
							setTimeout(function() {
								that.refresh();
							},1);
						}else{
							id.html($("#template_blank_page").html());
						}
						$("#all_pages").append(id);
						rsizewin();
					}
					actual_file = $(this).attr("data-name");
					last_showed_page = id;
					last_showed_page.show();
					
					redraw_filelist();
				})
				id.append(item);
			}
			i++;
		}
	}
	function redraw_filelist(){
		allList = new Array()
		$("#project_files").html("");
		_project_files_draw(_project_files, $("#project_files"), "cat");
	}
	redraw_filelist();
	setTimeout(function(){$("#blank_page").show();}, 1);
	
	$("#devtab2").click();

	var lastTab2 = $("#devtab5");
	var lastTar2 = $("#debugtab5");
	for(var xx = 5; xx <= 8; xx++){
		$("#devtab"+xx).click(function(){
			if( lastTab2 != $(this) ){
				lastTab2.removeClass("selected_tab");
				lastTab2.addClass("tab");
				lastTab2 = $(this);
				lastTab2.addClass("selected_tab");
				lastTab2.removeClass("tab");
				lastTar2.hide();
				lastTar2 = $("#debugtab"+$(this).attr("xx"));
				lastTar2.show();
				rsizewin();
			}
		});
	}
	
	loadProject();
	document.title = "PYR Editor";
	</script>
</body>