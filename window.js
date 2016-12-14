var ApiWindow = function(pyr){
	this.pyr = pyr;
	this.wins = new Array();
}

__WINDOW = ApiWindow;

ApiWindow.prototype = {
	_string: function(vars){
		return "<object Window>";
	},
	check: function(id){
		if(typeof this.wins[id] == "undefined")
			this.wins[id] = {open: false, width: 500, height: 400, functionEvent: null};
	},
	open: function(vars, global){
		this.check(vars[0]);
		
		this.wins[vars[0]].open = true;		
		this.wins[vars[0]].win = window.open_("", "", "width="+this.wins[vars[0]].width+",height="+this.wins[vars[0]].height);
		
		this.wins[vars[0]].oldX = this.wins[vars[0]].win.screenX,
		this.wins[vars[0]].oldY = this.wins[vars[0]].win.screenY;
		
		this.wins[vars[0]].global = global;

		var _this = this.wins[vars[0]];
		this.wins[vars[0]].interval = setInterval(function(){
			if(_this.win == null && typeof this.wins[vars[0]].win.document != "undefined"){
				//cancel
				return false;
			}
			if(_this.functionEvent != null){
				if(_this.oldX != _this.win.screenX || _this.oldY != _this.win.screenY){
					_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"window.move\", \"x\": "+_this.win.screenX+", \"y\": "+_this.win.screenY+"}")), _this.global);
				}
			}
			
			_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"update\"}")), _this.global);

			_this.oldX = _this.win.screenX;
			_this.oldY = _this.win.screenY;
		}, 30);
		
		$("body", this.wins[vars[0]].win.document).keypress(function( event ) {
			_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"keyboard.press\", \"key\": "+event.which +"}")), _this.global);
			event.preventDefault();
		});
		$("body", this.wins[vars[0]].win.document).keydown(function( event ) {
			_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"keyboard.press.down\", \"key\": "+event.which +"}")), _this.global);
			event.preventDefault();
		});
		$("body", this.wins[vars[0]].win.document).keyup(function( event ) {
			_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"keyboard.press.up\", \"key\": "+event.which +"}")), _this.global);
			event.preventDefault();
		});
		
		$( this.wins[vars[0]].win.window ).unload(function() {
			_this.functionEvent.func["_call"](new Array(_this.global.execute("{\"action\": \"window.close\"}")), _this.global);
			clearInterval(_this.interval);
		});
		
		return;
	},
	setSize: function(vars){
		this.check(vars[0]);
		this.wins[vars[0]].width = vars[1];
		this.wins[vars[0]].height = vars[2];
		return;
	},
	close: function(vars){
		this.wins[vars[0]].win.close();
		return;
	},
	setHtmlContent: function(vars, global){
		if(typeof files[vars[1]] != "undefined"){
			$(this.wins[vars[0]].win.document.body).html(files[vars[1]]);
		}else{
			global._save_last_error = dateCreator["IOError"]("File \""+vars[1]+"\" not a found!");
		}
		return;
	},
	registerEvenetListeren: function(vars, global){
		this.wins[vars[0]].functionEvent = vars[1];
		//vars[1].func["_call"](global.makeArgs("\"Ahoj jak se máš?\""), global);
	},
	createElement: function(vars, global){
		var _element = $(vars[1]);
		_element.attr("id", vars[2]);
		$("body", this.wins[vars[0]].win.document).append(_element);
	},
	elementSetHtml: function(vars, global){
		$("#"+vars[1], this.wins[vars[0]].win.document).html(vars[2]);
	}
}