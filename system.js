String.prototype.trimStart=function(c)
{
	c = c?c:' ';
	var i=0;
	for(;i<this.length && this.charAt(i)==c; i++);
	return this.substring(i);
}

function doGetCaretPosition(oField) {
  var iCaretPos = 0;
  if (document.selection) {
    oField.focus();
    var oSel = document.selection.createRange();
    oSel.moveStart('character', -oField.value.length);
    iCaretPos = oSel.text.length;
  }
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;
  return iCaretPos;
}

var Terminal = function(w,h,id, lines, cursor){
	this.id 				= id;	
	this.width 				= w;
	this.height				= h;
	this.stop 				= false;	
	this.buffer				= new Array();
	this.buffer_pos 		= 0;
	this.buffer_size 		= 200;
	this.foregroundColor 	= "";
	this.backgroundColor 	= "";
	this.youtype 			= false;
	
	for(var i=0;i<=200;i++){
		this.buffer[i] = new Array();
		for(var a=0;a<w;a++){
			this.buffer[i][a] = new Array("", "", "");
		}
	}
	
	$(id).css("width",this.width * 8);
	
	if(typeof lines == "undefined"){
		this.lines = new Array();
		this.cursor = new Array(0,0,0); //X,Y
		for(var i=0;i<h;i++){
			radek = document.createElement("div");
			radek.setAttribute("id", "line_"+i);
			radek.setAttribute("style", "height:17px;");
			$(id).append(radek); 
			this.lines[i] = new Array();
			for(var a=0;a<w;a++){
				this.lines[i][a] = new Array("", "", ""); // Text, Barva, Pozadí
				radek.innerHTML += "&nbsp;";
			}		
		}	
		this.lines[i] = new Array();
		for(var a=0;a<w;a++){
			this.lines[i][a] = new Array("", "", "");
		}
	}
	else { 
		this.lines = lines; 
		if(lines == ""){ this.lines = new Array(); }
		this.cursor = cursor; 
		for(var i=0;i<h;i++){
			radek = document.createElement("div");
			radek.setAttribute("id", "line_"+i);
			radek.setAttribute("style", "height:17px;");
			$(id).append(radek); 
			if(typeof this.lines[i] == "undefined"){
				this.lines[i] = new Array();
			}
			for(var a=0;a<w;a++){
				if(typeof this.lines[i][a] == "undefined"){
					this.lines[i][a] = new Array("", "", ""); // Text, Barva, Pozadí
					radek.innerHTML += "&nbsp;";
				}else{
					fir = "";las = "";
					if(this.lines[i][a][1] != ""){
						fir+="<span style='color:"+this.lines[i][a][1]+"'>";
						las=las+"</span>";
					}
					if(this.lines[i][a][2] != ""){
						fir+="<span style='background:"+this.lines[i][a][1]+"'>";
						las=las+"</span>";
					}
					radek.innerHTML += fir+this.lines[i][a][0]+las;
				}
			}
		}
	}
		
	this.redraw();
}
Terminal.prototype = {
	redraw: function(stop){
		for(var i=0;i<this.height;i++){
			radek = $("#line_"+i);
			write_ = "";
			if(typeof this.width == "undefined"){ this.width = 0; }		
			var	not=false;
			for(var a=0;a<this.width;a++){		
				try{ letter = this.lines[i][a]; }catch(e){ leter = new Array("","","");not=true;break; }				
				p = letter[0];
				if(this.cursor[0] == a && this.cursor[1] == i && this.youtype){ 
					if(this.cursor[2] == 1){
						if(letter[0].trim() == ""){ p = "&nbsp;"; }
						p = "<span style='background-color:#0F0;color:black;'>"+p+"</span>";
						this.cursor[2] = 0;
					}else{ this.cursor[2] = 1; }
				}
				fir = "";las = "";
				if(letter[1] != ""){
					fir+="<span style='color:"+letter[1]+"'>";
					las=las+"</span>";
				}
				if(letter[2] != ""){
					fir+="<span style='background:"+letter[2]+"'>";
					las=las+"</span>";
				}
				if(p.trim() == "")
					write_+= fir+"&nbsp;"+las;
				else
					write_+= fir+p+las;				
			}
			if(!not)
				radek.html(write_);
		}
		var ter = this;
		if(!this.stop && typeof stop == "undefined")
			setTimeout(function(){ter.redraw();}, 1000);
	},
	write: function(text){		
		for(var i=0;i<text.length;i++){	
			if(text[i] == "\\" && text[i+1]=="n"){
				this.next();
				i++;
			}else{
			
			this.lines[this.cursor[1]][this.cursor[0]][0] = text[i];
			this.lines[this.cursor[1]][this.cursor[0]][1] = this.foregroundColor;
			this.lines[this.cursor[1]][this.cursor[0]][2] = this.backgroundColor;
			this.cursor[0]++;
			if(this.cursor[0] >= this.width){ 
				this.cursor[0] = 0;this.cursor[1]++; 
				if(this.cursor[1] > this.height - 1){	
					this.posun();					
					this.redraw(true);
					this.cursor[1]--;
				}
			}
			
			}
		}
		return this;		
	},
	setColor: function(color){
		this.foregroundColor = color;
		return this;
	},
	setBackground: function(color){
		this.backgroundColor = color;
		return this;
	},
	posun: function(){
		for(var i=1;i<=this.buffer_size;i++){
			this.buffer[i] = this.buffer[i-1];
		}
		this.buffer[200] = this.lines[0];		
		for(var i=0;i<this.height - 1;i++){
			this.lines[i] = this.lines[i+1];			
		}
		this.lines[i] = new Array();
		for(var a=0;a<this.width;a++){
			this.lines[i][a] = new Array("", "", "");
		}
		return this;
	},
	clearLine: function(){
		this.lines[this.cursor[1]] = new Array();
		for(var a=0;a<this.width;a++){
			this.lines[this.cursor[1]][a] = new Array("", "", "");
		}
		this.cursor[0] = 0;
		return this;
	},
	next: function(){
		this.cursor[0] = 0;this.cursor[1]++; 
		if(this.cursor[1] > this.height - 1){	
			this.posun();					
			this.redraw(true);
			this.cursor[1]--;
		}
		return this;
	},
	setCursor: function(x,y){
		this.cursor[0] = x;
		this.cursor[1] = y;
		return this;
	},
	getCurrentLine: function(){
		line = "";
		i = this.cursor[1];		
		for(var a=0;a<this.width;a++){		
			try{ letter = this.lines[i][a][0]; }catch(e){ leter = ""; }	
			line += letter;
		}
		return line;
	}
}

var Dialog = function() {
    this.title 			= "";
	this.content 		= "";
	this.buttons 		= [];
	this.fnOnCancel 	= function(){};
	this.ContextPadding	= 14;
	this.MinHeight		= 100;	
	this.width 			= 500;
	this.html			= function(){};
	this.anonymous		= false;
	this.type 			= 0;
	this.Create();
	
	this._ClickOutsideCl = true;
}

Dialog.OK       = {name:"ok", className:"", title:"OK", type:"button"};
Dialog.OK_CLOSE = [ {name:"close", className:"", title:"Zavřít", type:"button"}, {name:"ok", className:"", title:"OK", type:"button"} ];
Dialog.CANCEL   = {name:"cancel", className:"", title:"Storno", type:"a"};
Dialog.CONFIRM  = {name:"confirm", className:"", title:"Potvrdit", type:"button"};
Dialog.CONTINUE = {name:"continue", className:"blue", title:"Pokračovat", type:"button"};
Dialog.DELETE   = {name:"delete", className:"", title:"Odstranit", type:"button"};
Dialog.NEXT     = {name:"next", className:"", title:"Další", type:"button"};
Dialog.SAVE     = {name:"save", className:"", title:"Uložit", type:"button"};
Dialog.SUBMIT   = {name:"submit", className:"", title:"Odeslat", type:"button"};
Dialog.CLOSE    = {name:"close", className:"", title:"Zavřít", type:"button"};
Dialog.SEARCH   = {name:"search", className:"blue", title:"Hledat", type:"button"};
Dialog.CANCEL2  = {name:"cancel", className:"", title:"Zrušit", type:"a"}

Dialog._WINDOWS = 0;

Dialog.prototype = {
	Create: function(){
		var parent = this;
		
		$("body").css("overflow", "hidden");
		
		this.html.background = $("<div>");
		this.html.background.addClass("dialog-background");
		//this.html.background.click(function(){ parent.Close(); });
		this.html.background.hide();
		$("body").append(this.html.background); 
		
		this.html.dialog = $("<div>");
		this.html.dialog.addClass("dialog");
		this.html.dialog.css("min-width", this.width);
		this.html.dialog.css("min-height", this.MinHeight);
		this.html.background.append(this.html.dialog);
		
		this.html.dialogContent = $("<div>");
		this.html.dialog.append(this.html.dialogContent);
		
		this.html.dialogHtml = $("<div>");
		this.dialogHtml = this.html.dialogHtml;
		this.html.dialogHtml.addClass("dialog-content");		
		this.html.dialogContent.append(this.html.dialogHtml);
		
		this.html.dialogLoading = $("<div>");
		this.html.dialogLoading.addClass("dialog");
		this.html.dialogLoading.css("width", "300px");
		this.html.dialogLoading.css("height", "90px");
		this.html.background.append(this.html.dialogLoading);
		
		this.html.dialogLoadingContent = $("<div>");
		this.html.dialogLoadingContent.addClass("loading");	
		this.html.dialogLoading.append(this.html.dialogLoadingContent);
		
		this.html.dialog.hide();
		this.html.dialogLoading.hide();
		
		$(window).resize(function() {
			parent.Center();
		});
		
		Dialog._WINDOWS++;
	},
	enableMove: function(){
		this.html.title.css("cursor", "move");
		this.html.dialog.draggable({ handle: this.html.title });
		this.type = 1;
		$("body").append(this.html.dialog);
		$("body").append(this.html.dialogLoading);
		if(Dialog._WINDOWS == 1)
			$("body").css("overflow", "auto");
		Dialog._WINDOWS--;
		this.html.dialog.css("position","absolute");
		this.html.dialog.css("top","0px");
	},
	setTitle: function(title){
		if(typeof parent == "undefined")
			var parent = this;
		parent.title = title;
		if(typeof parent.html.title != "undefined"){
			$(parent.html.title.find(".title")[0]).html(this.title);
		}else{
			parent.html.title = $("<div>");
			parent.html.title.addClass("dialog-title");
			parent.html.title.html("<div class=title>"+this.title+"</div>");
			parent.html.dialogContent.prepend(this.html.title);
			parent.html.closeButton = $("<div>");			
			parent.html.closeButton.addClass("close");
			parent.html.closeButton.attr("title", "Zavřít");
			parent.html.closeButton.click(function(){ parent.Close(); });
			parent.html.title.prepend(this.html.closeButton);
		}
		parent.Center();
	},
	getButtons: function(){
		return this.html.footer.find(".button");
	},
	setButtons: function(buttons){
		if(typeof this.html.buttons != "undefined"){			
			this.html.buttons = $("<div>");
		    this.html.buttons.addClass("dialog-footer-button");
		    if(typeof buttons.length == "undefined"){ buttons = [ buttons ]; }
		    for(i=0;i<buttons.length;i++){
				butt = $("<"+buttons[i].type+">");
				butt.addClass(buttons[i].className);
				butt.addClass("button");
				butt.html(buttons[i].title);
				butt.attr("name", buttons[i].name);
				this.html.buttons.append(butt);
			}
			this.html.footer.html("");
			this.html.footer.append(this.html.buttons);
			this.html.footer.append($("<div>").css("clear","both"));
		}else{
			this.html.footer = $("<div>");
			this.html.footer.addClass("dialog-footer");
		    this.html.buttons = $("<div>");
		    this.html.buttons.addClass("dialog-footer-button");
		    if(typeof buttons.length == "undefined"){ buttons = [ buttons ]; }
		    for(i=0;i<buttons.length;i++){
				butt = $("<"+buttons[i].type+">");
				butt.addClass(buttons[i].className);
				butt.addClass("button");
				butt.html(buttons[i].title);
				butt.attr("name", buttons[i].name);
				this.html.buttons.append(butt);
			}
			this.html.footer.append(this.html.buttons);
			this.html.footer.append($("<div>").css("clear","both"));
			this.html.dialogContent.append(this.html.footer);
		}
		this.Center();
	},
	Load: function(url, param, callback){
		var parent = this;
		if(this.anonymous!=true)
			this.html.background.show();		
		
		if(typeof param != "undefined"){ param = $.param(param); }
		
		if(parent.html.dialog.is(":visible")){
			parent.html.dialog.hide();
			
			if(this.anonymous!=true)
				parent.html.dialogLoading.show();
			
			width  = parent.html.dialogLoading.width();
			height = parent.html.dialogLoading.height();
			
			parent.html.dialogLoading.css("width", this.html.dialog.width());
			parent.html.dialogLoading.css("height", this.html.dialog.height());
			parent.html.dialogLoading.css("margin-top", this.html.dialog.css("margin-top"));
			parent.html.dialogLoading.css("margin-bottom", this.html.dialog.css("margin-bottom"));
			parent.html.dialogLoadingContent.css("opacity", 0);
			parent.Center();
			
			parent.html.dialogLoading.animate({
				width: width+"px",
				height: height+"px"
				}, 400, function() { parent.html.dialogLoading.css("height", "auto"); parent.html.dialogLoadingContent.animate({ opacity:1 }, 400); });
		}else{			
			parent.html.dialogLoading.fadeIn("fast");
			parent.Center("fast");
		}
		
		parent.html.dialogHtml.load( url+"?"+param, function( response, status, xhr ) {
		  if ( status == "error" ) {
			var msg = "Omlouváme se ale při načítání nastala chyba<br>";
			parent.setTitle("Error");
			parent.setButtons( Dialog.CLOSE );
			parent.html.dialogHtml.html("<div class='red'>" + msg + xhr.status + " " + xhr.statusText + "</div>");			
		  }
		  
		  if(parent.anonymous!=true)
			  parent.Show();
		  else{	
			  parent.html.background.hide();
		  }
	  
		  if(typeof callback != "undefined" && callback != "")
			callback(parent, parent.html.dialogHtml.html(), status);
		  ReplaceSelect();
		  ContextMenuClickable();
		});
	},
	Show: function(){
		if(typeof parent == "undefined")
			var parent = this;
		
		width  = parent.html.dialog.width();
		height = parent.html.dialog.height();
		
		//parent.Center(true);
		
		parent.html.dialog.css("min-width", this.html.dialogLoading.width());
		parent.html.dialog.css("height", this.html.dialogLoading.height());
		parent.html.dialog.css("margin-top", this.html.dialogLoading.css("margin-top"));
		parent.html.dialog.css("margin-bottom", this.html.dialogLoading.css("margin-bottom"));
		parent.html.dialogContent.css("opacity", 0);
		
		if (parent.type == 0)
			parent.html.background.show();				
		parent.html.dialog.show();
		parent.html.dialogLoading.hide();
		
		if(parent.type == 1){
			parent.Center(1);
			parent.html.dialog.css("min-width", width+"px");
			//parent.html.dialog.css("height", height+"px");
			parent.html.dialog.css("height", "auto");
			parent.html.dialogContent.css("opacity",1);
		}else if(parent.type == 0){		
			parent.html.dialog.animate({
				width: width+"px",
				height: height+"px"
			}, 400, function() { parent.html.dialog.css("height", "auto") ;parent.html.dialogContent.animate({ opacity:1 }, 400);parent.Center() });
		}
	},
	Close: function(){
		var parent = this;
		if(this._ClickOutsideCl){
			this.html.dialog.fadeOut("fast", function(){ parent.html.background.remove(); });
		}		
		if(Dialog._WINDOWS == 1)
			$("body").css("overflow", "auto");
		Dialog._WINDOWS--;
	},
	Center: function(overload){
		var parent = this;
		margin = ($(window).height()/2) - (this.html.dialog.height()/2);
		margi2 = ($(window).width()/2) - (this.html.dialog.width()/2);
		if(margin < 10) { margin = 10;}
		if(margin > 250) { margin = 250; }
		margin-=1;
		
		if(parent.type == 1){
			if(overload == 1){
				this.html.dialogLoading.css("top", margin+"px");
				this.html.dialogLoading.css("left", margi2+"px");
				this.html.dialog.css("top", margin+"px");
				this.html.dialog.css("left", margi2+"px");
			}
		}else{
			if(overload=="fast"){
				this.html.dialogLoading.css("margin-top", margin+"px");
				this.html.dialogLoading.css("margin-bottom", margin+"px");
				this.html.dialog.css("margin-top", margin+"px");
				this.html.dialog.css("margin-bottom", margin+"px");
			}else{		
				if(this.html.dialogLoading.is(':visible') && overload!=true){
					this.html.dialogLoading.animate({
						marginTop: margin+"px",
						marginBottom: margin+"px"
					}, 200, function() {  });
				}
				
				if(this.html.dialog.is(':visible') || overload){
					this.html.dialog.animate({
						marginTop: margin+"px",
						marginBottom: margin+"px"
					}, 200, function() {  });
				}
			}	
		}
	}
}

function messageBox(title, text){
	var dialog = new Dialog();
	dialog.setTitle(title);
	dialog.setButtons(Dialog.CLOSE);
	dialog.dialogHtml.html("<div class=cnt>"+text+"</div>");
	dialog.Show();
	butt = dialog.getButtons();
	$(butt[0]).click(function(){ dialog.Close(); });
}
