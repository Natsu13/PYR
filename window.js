var ApiWindow = function(pyr){
	this.pyr = pyr;
	this.wins = new Array();
}

__WINDOW = ApiWindow;

ApiWindow.prototype = {
	_string: function(vars){
		return "<object Window>";
	},
	open: function(vars){
		if(typeof this.wins[vars[0]] == "undefined")
			this.wins[vars[0]] = {open: true, width: 500, height: 400};
		else
			this.wins[vars[0]].open = true;
		
		this.wins[vars[0]].win = window.open_("", "", "width="+this.wins[vars[0]].width+",height="+this.wins[vars[0]].height);
		return;
	},
	setSize: function(vars){
		this.wins[vars[0]].width = vars[1];
		this.wins[vars[0]].height = vars[2];
		return;
	},
	close: function(vars){
		this.wins[vars[0]].win.close();
		return;
	},
	setHtmlContent: function(vars){
		if(typeof files[vars[1]] != "undefined"){
			$(this.wins[vars[0]].win.document.body).html(files[vars[1]]);
		}else{
			this.pyr._save_last_error = dateCreator["IOError"]("File \""+vars[1]+"\" not a found!");
		}
		return;
	}
}