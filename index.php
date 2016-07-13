<meta charset="utf-8">
<script src="./jquery-2.1.3.min.js"></script>
<script src="./jquery-ui.min.js"></script>
<script src="./system.js"></script>
<script src="./pyr.js"></script>

<style>
* {margin:0px;padding:0px;}
body {font-family:Arial;}
#terminal {background-color:black;color:white;font-family:courier,fixed,swiss,monospace,sans-serif;font-size:14px;}
.dialog-background {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.2);
  overflow-y: scroll;
}

.dialog {
  margin: 0px auto;
  background: #F9F9F9;
  margin-top: 40px;
  border: 1px solid #00B8FF;
  -box-shadow: 0px 2px 10px #8C8C8C;
}

.dialog-title {
  background-color: #FFFFFF;
  border-bottom: 1px solid #007EFF;
  padding: 6px 13px;
  font-size: 14px;
}

.dialog-footer {
  border-top: 1px solid rgb(218, 218, 218); 
  margin: 0px 10px 0px; 
  padding: 10px 0px;
  height: 25px;
}

h2 {
    padding: 0px;
    padding-bottom: 10px;
    margin: 0px 0px;
    margin-bottom: 15px;
    border-bottom: 1px solid silver;
}

.dialog-footer-button {
  float:right;
}

.dialog-footer-button button {
  padding: 4px 8px;
  margin-left:5px;
}

.dialog-footer-button .blue {
  color: #FFF;
  background: #5B74A8;
  border: 1px solid #394B6F;
}  

.dialog-footer-button .blue:active {
    box-shadow: 2px 2px 4px rgba(87, 87, 87, 0.87) inset;
}  

.dialog-footer-button a.button {
  padding: 4px 8px;
  margin-left: 5px;
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
.dialog-title .close:hover {
	opacity:0.5;
}

.dialog-content .red {
	padding:10px;
	font-size:13px;
}

.loading {
  -webkit-animation: rotateSpinner 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  background-image: url(./images/t-wz8gw1xG1.png);
  width: 30px;
  height: 30px;
  margin: 30px 135px;
  background-size: 30px;
}

.selected_tab {
	display: inline-block;
    position: relative;
    padding: 6px;
    background-color: #007EFF;
    border-bottom: 0px;
    top: 0px;
    float: left;
    cursor: pointer;
    margin-right: 7px;
    color: white;
}

.tab {
	float: left;
    padding: 6px;
    cursor: pointer;
    background-color: #E4E4E4;
	margin-right: 7px;
}

input[type="text"] {
	padding: 3px;
    border: 1px solid silver;
}
input[type="text"]:focus {
	border-color:#007EFF;
	box-shadow: 0px 0px 2px #007EFF;
	outline:0px;
}

button {
	border: 0px;
    padding: 4px 10px;
    color: #1D1D1D;
    font-weight: bold;
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
	background: #FFAFAF;
	border-top: 1px solid red;
    border-bottom: 1px solid red;
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
    background: silver;
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
</style>

<div id="container"></div>

<div id="terminal" style="margin:0px;background:black;color:white;" onClick="$('#terminal_code').focus();"></div>
<form action=# onSubmit="try{ terminal_execute(); }catch(Error){ errorCatcher(Error, 'Form'); }finally{ return false; }" style="height:0px;border: 0px;position:relative;top:-1px;">
	<input type="text" autocomplete="off" style="width: 1px;height: 1px;border: 0px;padding: 0px;margin: 0px;background:transparent;color:transparent;" onFocus="terminal.youtype=true;" onBlur="if($(this).val()=='' && lastTab == $('#devtab1')){ $(this).focus(); }else{ terminal.youtype=false; }" id="terminal_code" onKeyPress="terminal_type(this, this.value);" onKeyUp="terminal_type(this, this.value);return false;">
</form>

<div id="sourcecode">
	<div style="padding: 7px;border-bottom: 1px solid silver;"><input type=text name=name id="fnam" value="main.pyr" width=200> <button id="runbutt" onClick="run();">RUN</button> <span id=infoprog style="padding: 10px;">ID vlákna: ...</span><br></div>
	<textarea style="width:600px;height:219px;background:rgb(255, 255, 255);border:0px;outline: 0px;padding: 5px;" id="pyr_code">canvas = new Canvas();
a=0;
while(a < 11){
  a++;
  if(a%2 == 0){
    canvas.fillText("Hello World ("+a+")",10,20*a);
  }else{
    canvas.fillText("Lichý",10,20*a);
  }
}</textarea>
	<div style="height: 150px;">
		<div style="text-align: center; border-top: 1px solid silver;border-bottom: 1px solid silver;color: #424242;background: #F1F1F1;height: 10px;line-height: 2px;font-weight: bold;">...</div>
		
		<div style='height: 30px;float: left;border-bottom: 1px solid #007EFF;width: 96%;background: #f3f3f3;padding: 5px 12px;padding-bottom: 0px;'>
			<div class=selected_tab xx=5 id=devtab5>Log</div>
			<div class=tab xx=6 id=devtab6>Variables</div>
			<div class=tab xx=7 id=devtab7>Output</div>
		</div><div style='clear:both;'></div>
		
		<div style="overflow: auto;height: 105px;" id="debugtab5">
			<div class="info_msg">PYR debug line....</div>
		</div>
		<div style="overflow: auto;height: 105px;display:none;" id="debugtab6">
			variables...
		</div>
		<div style="overflow: auto;height: 105px;display:none;" id="debugtab7">
			<div id="terminal2" style="margin:0px;background:black;color:white;" onClick=""></div>
		</div>
	</div>
</div>


<script>
function selectIn(id){
	var vl = $(id).html().split(":");
	vl[1]-=2;
	var line = 1, xl = 1;
	for(var i = 0; i < $("#pyr_code").val().length; i++){
		var k = $("#pyr_code").val().charAt(i);
		if(line == vl[0] && xl == vl[1]){
			tarea = document.getElementById("pyr_code");
			tarea.focus();
			tarea.selectionStart = i+1;
			tarea.selectionEnd = i+1;
			tarea.focus();
			break;
		}
		if(k == "\n"){
			line++;
			xl = 0;
		}
		xl++;
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

terminal2 = new Terminal(75, 6, "#terminal2");
terminal2.redraw(true);

terminal = new Terminal(75, 24, "#terminal");
terminal.setColor("orange").write("PYR terminal build-in app").next().write("Copyright © 2014 - 2016 Wolfox corporation").setColor("white").next().write(">> ");
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

var _pyr_thread, _actual_thread = 0;
function run(){
	var vl = $("#runbutt").html();
	if(vl == "RUN"){
		terminal2.clear();
		_pyr_thread = new Pyr(terminal2);
		$("#infoprog").html("ID vlákna: "+(_pyr_thread._thread_id));
		_actual_thread = _pyr_thread._thread_id;
		_pyr_state = _pyr_thread.compile($("#pyr_code").val(),$("#fnam").val());
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
	_pyr_thread._thread_stoped = true;
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
			if(typeof vars.func["_string"] != "undefined") val = getValue(vars.func["_string"]("",pyr));
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

var dialog = new Dialog();
	dialog.setTitle("<div style='height:0px;float: left;'><div class=selected_tab xx=1 id=devtab1>Console</div><div class=tab xx=2 id=devtab2>Source code</div></div><div style='clear:both;'></div>");
	dialog.dialogHtml.html("<div id=debugtab1></div><div id=debugtab2 style='display:none;'></div><div style='clear:both;'></div>");
	dialog.enableMove();
	setTimeout(function(){ dialog.Show(); }, 100);
	$("#debugtab1").append($("#terminal"));
	$("#debugtab2").append($("#sourcecode"));	
	
window.addEventListener("error",errorCatcher);
function errorCatcher(error, frm) {
	console.error(error);
	if(typeof(frm)!="undefined"){ error.lineno = frm; }
	terminal.clearLine();
	terminal.setColor("red").write("(JsError:"+error.lineno+") "+error.message).setColor("white").next();
	terminal.redraw(true);
	terminal_type($("#terminal_code"), $("#terminal_code").val());
}
	
var lastTab = $("#devtab1");
var lastTar = $("#debugtab1");
for(var xx = 1; xx <= 2; xx++){
	$("#devtab"+xx).click(function(){
		if( lastTab != $(this) ){
			lastTab.removeClass("selected_tab");
			lastTab.addClass("tab");
			lastTab = $(this);
			lastTab.addClass("selected_tab");
			lastTab.removeClass("tab");
			lastTar.hide();
			lastTar = $("#debugtab"+$(this).attr("xx"));
			lastTar.show();
		}
	});
}
$("#devtab2").click();

var lastTab2 = $("#devtab5");
var lastTar2 = $("#debugtab5");
for(var xx = 5; xx <= 7; xx++){
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
		}
	});
}

setTimeout(function(){dialog.type = 1;dialog.Center(true);}, 500);
</script>