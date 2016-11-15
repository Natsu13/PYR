//////////////////////////////////////////////////////////////////////////////////////////
//																						//
// PYR VER 0.1 (JS)																		//
// Create by Natsu (Jakub Teichmann)  													//
// Last official chnanged: 13.11.2016													//
//																						//
// Tento program je svobodný software: můžete jej šířit a upravovat 					//
// podle ustanovení Obecné veřejné licence GNU (GNU General Public Licence), 			//
// vydávané Free Software Foundation a to buď podle 3. verze této Licence, 				//
// nebo (podle vašeho uvážení) kterékoli pozdější verze.								//
//																						//
// Tento program je rozšiřován v naději, že bude užitečný, avšak BEZ JAKÉKOLIV ZÁRUKY.  //
// Neposkytují se ani odvozené záruky PRODEJNOSTI anebo VHODNOSTI PRO URČITÝ ÚČEL. 		//
// Další podrobnosti hledejte v Obecné veřejné licenci GNU.								//
//																						//
// Kopii Obecné veřejné licence GNU jste měli obdržet spolu s tímto programem. 			//
// Pokud se tak nestalo, najdete ji zde: <http://www.gnu.org/licenses/>.				//
//																						//
// https://github.com/Natsu13/Pyr														//
//////////////////////////////////////////////////////////////////////////////////////////
navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

function isIn(text, array){
	var open=false;
	mam ="";
	for(var i=0;i<text.length;i++){
		c = text.charAt(i);
		if(c == "\""){ open=!open; }
		if(!open && c != "\"") mam+=c;
	}
	text = mam;
	for (val of array) {
		if(text.indexOf(val) > -1)
			return true;
	}
	return false;
}

var thread = 0;

window.open_ = window.open;

var Pyr = function(terminal){
	this.terminal = terminal;
	this.variables = {};
	this.patch = new Array();
	this.func = {}
	this.errorOcured = false;
	this._thread_stoped = false;
	this._thread_id = thread++;
	this._thread_ticks = 0;
	this.files = null;
	this._TYPE_SYNC = {};
	this._wait_finis = false;
	this._parent = null;
	
	vars = this.variables;
	vars.id = this;
	fnc = this.func;
	fnc.id = this;
	
	//Functions
	fnc["print"] = function(vars){
		vr = getValue(vars[0]);
		if(typeof getValue(vars[0]) != "string")
			vr = getValue(vars[0]).toString();
		this.id.terminal.write(vr);
		
		return dateCreator["null"]();
	}
	fnc["print_r"] = function(vars){
		console.log(vars);
		this.id.terminal.write("["+vars[0].type+"]{").next();
		for (key in vars[0].vars) {
			m = "";for(var o=0;o<10-key.length;o++) m+=" ";
			this.id.terminal.write("   \""+key+"\""+m+"=>  ");
			if(vars[0].vars[key].type == "string"){
				this.id.terminal.write("\""+getValue(vars[0].vars[key])+"\"");
			}else{
				this.id.terminal.write(getValue(vars[0].vars[key]));
			}
			this.id.terminal.next();
		}
		this.id.terminal.write("}");
		return dateCreator["null"]();
	}
	fnc["clear"] = function(vars){
		this.id.terminal.clear();
	}
	fnc["ver"] = function(vars){
		return dateCreator["float"]("0.4");
	}
	fnc["os"] = function(vars){
		return dateCreator["list"]('["browser","JavaScript","'+navigator.sayswho+'","'+navigator.vendor+'","'+navigator.platform+'"]', this.id);
	}
	fnc["alert"] = function(vars){
		alert(getValue(vars[0]).toString());
		return dateCreator["null"]();
	}
	fnc["error"] = function(vars){
		this.id.throwError(getValue(vars[0]).toString(), 0, 0, "");
		return dateCreator["null"]();
	}
	fnc["_id"] = function(vars){
		return dateCreator["int"](vars[0].id);
	}
	//Variables
	vars["true"]  	= new dateCreator["int"]("1");
	vars["false"] 	= new dateCreator["int"]("0");
	vars["null"] 	= new dateCreator["null"]();
	
	var _this = var_type();
		_this.id = this;
		_this.type = "object";
		_this.name = "this";
		_this.func["_get"] = function(vars, global){
			return "N00L";
		}
		_this.func["_string"] = function(vars, global){
			var ret  = "";
			for (var prop in this.id.id.variables) {
				if(prop == "id" || prop == "this") continue;
				
				if(this.id.id.variables[prop].name == "this") val = "##this";
				else val = getValue(this.id.id.variables[prop]);
				
				if(this.id.id.variables[prop].type == "string") val = "\""+val+"\"";
				
				if(ret == "")
					ret+="\""+prop+"\": "+val+"";
				else
					ret+=", \""+prop+"\": "+val+"";
			}
			return "{"+ret+"}";
		}
		_this.func["_getitem"] = function(vars, global){  // [?]
			vars[0] = getValue(vars[0]);
			if(typeof this.id.id.variables[vars[0]] == "undefined"){
				global.errorOcured = true;
				return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
			}
			return this.id.id.variables[vars[0]];
		}
		_this.func["_setitem"] = function(vars, global){  // [?] = 
			vars[1] = getValue(vars[1])
			if(vars[1].trim() == "") { 
				global.errorOcured = true;
				return dateCreator["IndexError"]("index can't be empty!");
			}
			if(typeof this.id.id.variables[vars[1]] == "undefined"){
				global.errorOcured = true;
				return dateCreator["IndexError"]("index '"+vars[1]+"' is out of range");
			}
			this.id.id.variables[vars[1]] = vars[0];
			return true;
		}
	vars["this"] = _this;
	
	this.operators = new Array("==","!=",">","<",">=","<=","+","-","/","*","%","?");
	
	library = new Array();
}
var ErrorOcured=false;

Pyr.prototype = {
	compile: function(code, _fileName, si, poii, nocomp, returnError, myLocalData){
		this.errorOcured = false;
		this._thread_ticks++;
		if(typeof this._save_last_error == "undefined")
			this._save_last_error = "";
		
		var _thread_call_agan = false,
			_thread_call_save_pos = 0,
			excode = code.trim()+"\n",
			stop__this = false;
			
		if(typeof myLocalData == "undefined"){
			var _local_data = {
				action: "",
				ptype: "",
				type: "",
				i: 0,
				mam: "",
				open: false,
				save_as_id: 0,
				close_expresion_at: "",
				save_expresion: "",
				expresion_state: -1,
				_time_: Date.now(),
				ltype: "",
				openblock: 0,
				return_object: ""
			}
		}else{
			var _local_data = myLocalData;
		}

		if(typeof this.save_time_ == "undefined")
			this.save_time_	= _local_data._time_;
		
		var _wait_me = false;
		if(this._parent != null){
			if(this._parent._wait_finis)
				_wait_me = true;
		}
		
		if(typeof returnError == "undefined") returnError = false;
		
		if((this._wait_finis || _wait_me) && this._thread_stoped != true){
			var _this = this, _code = code, _filename = _fileName, _si = si, _poii = poii, _nocomp = nocomp, _re = returnError, _ld = myLocalData;
				setTimeout(function(){_this.compile(_code, _filename, _si, _poii, _nocomp, _re, _ld);}, 0);
			return;
		}
		
		if(this._thread_stoped){ _local_data.i = excode.length;this._wait_finis = false; }
			
		if(typeof poii == "undefined") poii = 0;
		if(typeof si != "undefined") _local_data.i = si;
		if(typeof nocomp == "undefined") nocomp = false;
		var radek = 1, xa = 1;
		var save_funct_name = "";
		
		if(excode.length == _local_data.i-1) return;
		
		while(_local_data.i < excode.length && !stop__this){
			this.errorOcured = false;
			if(excode.length-1 == _local_data.i) _end_code = true; else _end_code = false;
			le = excode.substring(_local_data.i,_local_data.i+1);
			mame = _local_data.mam+le;
			
			if((_local_data.close_expresion_at != "" && _local_data.close_expresion_at != le && _local_data.ptype != "") || (_local_data.close_expresion_at == "}" && le == "{") || (_local_data.close_expresion_at == "}" && le == "}" && _local_data.openblock>0)){
				_local_data.mam+=le;
				//console.log(close_expresion_at+", le: "+le+"("+openblock+")");
				if(_local_data.close_expresion_at == "}" && le == "{")
					_local_data.openblock++;
				if(_local_data.close_expresion_at == "}" && le == "}" && _local_data.openblock>0)
					_local_data.openblock--;
			}
			else if(le == "\""){
				_local_data.open = !_local_data.open;
				_local_data.mam+="\"";
			}
			else if(_local_data.open){
				if(_end_code){
					if(returnError){
						this.errorOcured = true;
						return dateCreator["SyntaxError"]("EOL while scanning string");
					}
					this.errorOcured = true;
					this.throwError("EOL while scanning string", radek, xa, _local_data.mam, _fileName);
					//vrat = dateCreator["SyntaxError"]("EOL while scanning string", pline, i, filename, excode);
					_local_data.mam="";
					break;
				}
				_local_data.mam+=le;
			}
			else if(le == "#" && _local_data.type == ""){
				_local_data.type = "defined";
			}else if(le == "\n" && _local_data.type == "defined"){
				var exp = _local_data.mam.split(" ");
				if(exp[0] == "debug"){
					msg = _local_data.mam.substr(exp[0].length+1);
					logit(msg, 'warning_msg');
				}else if(_local_data.mam == "top"){
					_thread_call_save_pos = 0;
					_thread_call_agan = true;
					_local_data.i = excode.length;
				}else if(_local_data.mam == "jump"){
					_thread_call_save_pos = _local_data.mam.substr(exp[0].length+1);
					_thread_call_agan = true;
					_local_data.i = excode.length;
				}
				_local_data.mam = "";
				_local_data.type = "";
				_local_data.ptype = "";
				radek++;
				xa=1;
			}else if(le == "}"){
				if(_local_data.openblock > 0){
					_local_data.openblock--;
					_local_data.mam+="}";
				}else{
					var _break_it_all_and_call_again = false;
					if((_local_data.expresion_state && _local_data.ptype == "if") || (!_local_data.expresion_state && _local_data.ptype == "else") || (_local_data.expresion_state && _local_data.ptype == "while") || _local_data.ptype == "function" || _local_data.ptype == "class" || _local_data.ptype == "try" || _local_data.ptype == "catch"){
						//this.execute(mam, filename);
						if(_local_data.ptype == "function"){
							this.variables[save_funct_name] = new dateCreator["function"](new Array(save_funct_name, _local_data.save_expresion, _local_data.mam), this);
							if(returnError && this.errorOcured){
								return this.variables[save_funct_name];
							}
						}
						else if(_local_data.ptype == "class"){
							//save_class_name
							console.log(save_class_name);
							console.log(_local_data.mam);
						}
						else if(_local_data.ptype == "try"){
							var erro__ = this.compile(_local_data.mam,_fileName,0,radek, true, true);
							if(this.errorOcured){
								this.errorOcured=false;
								this._save_last_error = erro__;
							}
							_local_data.mam = "";
							
							if(erro__ == this._TYPE_SYNC){
								_break_it_all_and_call_again = true;
							}
						}
						else if(_local_data.ptype == "catch"){
							if(this._save_last_error == "_try" || this._save_last_error == "_catched" || this._save_last_error == ""){
								
							}else{
								var to = _local_data.save_expresion.split(","),
									can = false,
									saveVarNameErr = "";
								for(var _ti = 0; _ti < to.length; _ti++){
									var top__d = to[_ti].trim().split(" ");
									if(this._save_last_error.type == top__d[0].trim()){
										can = true;
										if(top__d.length == 1){
											saveVarNameErr = top__d[0].trim();
										}else{
											saveVarNameErr = top__d[1].trim();
										}
									}
								}
								
								if(can){
									var savevar = $.extend( {}, this.variables );
									console.log(this._save_last_error);
									this.variables[saveVarNameErr] = this._save_last_error;
									
									var erro__ = this.compile(_local_data.mam,_fileName,0,radek,true);
									if(returnError && this.errorOcured)
										return erro__;
									
									this.variables = $.extend( {}, savevar );
									this._save_last_error = "_catched";
								}
							}
						}
						else if(_local_data.ptype == "while"){
							var threa = 0;
							var expresion = this.execute(_local_data.save_expresion);
							while(getValue(expresion, "int", this) == 1 && threa < 1000){
								var erro__ = this.compile(_local_data.mam,_fileName,0,radek, true);
								if(returnError && this.errorOcured){
									return erro__;
								}
								if(erro__ == this._TYPE_SYNC){
									_break_it_all_and_call_again = true;
									break;
								}
								expresion = this.execute(_local_data.save_expresion);
								threa++;
							}
							if(threa == 1000) {
								if(returnError){
									this.errorOcured = true;
									return dateCreator["SyntaxError"]("Loop: Never eneded loop!");
								}
								this.throwError("Loop: Never eneded loop!", radek+poii, xa, _local_data.save_expresion, _fileName);
								_local_data.i=excode.length;
								break;
							}
						}else{
							var erro__ = this.compile(_local_data.mam,_fileName,0,radek,true);
							if(returnError && this.errorOcured)
									return erro__;
							else if(erro__ != "" && erro__ != null){
								_local_data.return_object = erro__;
								_local_data.i = excode.length;
							}
						}
						
						_local_data.close_expresion_at = "";
						_local_data.mam = "";
						_local_data.ltype = _local_data.ptype;
						_local_data.ptype = "";
						
						if(_break_it_all_and_call_again){
							_thread_call_save_pos = _local_data.i;
							_thread_call_agan = true;
							this._wait_for_sync = true;
							_local_data.i = excode.length;
							break;
						}
					}else{
						_local_data.close_expresion_at = "";						
						_local_data.mam+="}";
						//_local_data.mam = "";
						_local_data.ptype = "";
					}
					/*
					if(ptype == "else") { expresion_state = -1; ptype = ""; close_expresion_at = ""; }
					if(ptype == "if") ptype = "else"; else ptype = "";
					*/
				}
			}else if(le == "\n" || le == ";"){
				if(_local_data.mam != "" && le == "\n"){
					if(_local_data.ptype == ""){
						_local_data.i = excode.length;
						if(returnError){
							this.errorOcured = true;
							return dateCreator["SyntaxError"]("You can't write new line in code!");
						}
						this.throwError("SyntaxError: You can't write new line in code!", radek+poii, xa, _local_data.mam, _fileName);
						_local_data.i = excode.length;
					}
				}
				if(_local_data.type == "return"){
					_local_data.mam=_local_data.mam.trim();
					_local_data.return_object = this.execute(_local_data.mam);
					_local_data.i = excode.length;
					_local_data.mam = "";
					_local_data.type = "";
				}
				else if(_local_data.type == "import"){
					_local_data.mam=_local_data.mam.trim();
					if(_local_data.mam.substr(0,1) == "\""){
						_local_data.mam = _local_data.mam.substr(1,_local_data.mam.length-2);
						if(typeof this.files[_local_data.mam] != "undefined"){
							var filenam = _local_data.mam;
							var executed = this.compile(this.files[_local_data.mam], filenam, 0, 0, true);
							
							if(executed == this._TYPE_SYNC){							
								_thread_call_save_pos = i;
								_thread_call_agan = true;
								this._wait_for_sync = true;
								_local_data.i = excode.length;
								break;
							}
						}else{
							if(returnError){
								this.errorOcured = true;
								return dateCreator["SyntaxError"]("Can't find module file \""+_local_data.mam+"\" or is empty!");
							}
							this.throwError("SyntaxError: Can't find module file \""+_local_data.mam+"\" or is empty!", radek+poii, xa, _local_data.mam, _fileName);
							_local_data.i = excode.length;
							this.errorOcured = true;
						}
					}else{
						if(returnError){
							this.errorOcured = true;
							return dateCreator["SyntaxError"]("Can't import system file!");
						}
						this.throwError("SyntaxError: Can't import system file", radek+poii, xa, _local_data.mam, _fileName);
						_local_data.i = excode.length;
						this.errorOcured = true;
					}
					_local_data.mam = "";
					_local_data.type = "";
				}
				if(_local_data.mam.trim() != ""){
					var doit = false;
					if(_local_data.close_expresion_at == '\n'){
						if((_local_data.expresion_state && _local_data.ptype == "if") || (!_local_data.expresion_state && _local_data.ptype == "else")){
							doit=true;
						}
						_local_data.close_expresion_at = "\n";
						if(_local_data.ptype == "else") { _local_data.expresion_state = -1; _local_data.ptype = "";_local_data.close_expresion_at = ""; }
						if(_local_data.ptype == "if") _local_data.ptype = "else"; else _local_data.ptype = "";
					}else if(_local_data.close_expresion_at != "}"){
						if((_local_data.expresion_state && _local_data.ptype == "if") || (!_local_data.expresion_state && _local_data.ptype == "else")){
							doit=true;
							_local_data.close_expresion_at = "\n";
							if(_local_data.ptype == "else") { _local_data.expresion_state = -1; _local_data.ptype = ""; }
							if(_local_data.ptype == "if") ptype = "else"; else _local_data.ptype = "";
						}else if(_local_data.ptype == "" && _local_data.mam.trim() != ""){
							doit=true;
						}
					}
					if(doit){
						var executed = this.execute(_local_data.mam, _fileName);
						if(executed == this._TYPE_SYNC){
							_local_data.mam = "";
							_thread_call_save_pos = _local_data.i+1;
							_thread_call_agan = true;
							this._wait_for_sync = true;
							_local_data.i = excode.length;
							break;
						}
						else if(_local_data.ptype == ""){
							if(this.isError()){
								_local_data.i = excode.length;
								if(returnError){
									this.errorOcured = true;
									return executed;
								}
								if(typeof executed == "undefined")
									this.throwError("Undefined error", radek+poii, xa, _local_data.mam, _fileName);
								else
									this.throwError((executed.type)+": "+getValue(executed.vars["error"]), radek+poii, xa, _local_data.mam, _fileName);
							}else if(executed != "" && executed != null){
								//_local_data.return_object = executed;
								//_local_data.i = excode.length;
							}
						}else if(executed != "" && executed != null){
							//_local_data.return_object = executed;
							//_local_data.i = excode.length;
						}
					}
				}
				_local_data.mam = "";
				if(le == "\n"){
					radek++;
					xa=1;
				}
			}else if(le == " " && _local_data.type == ""){
				if(_local_data.mam != "")
					_local_data.mam+=" ";
			}else if(mame.trim() == "return"){
				_local_data.type = "return";
				_local_data.mam = "";
			}else if(mame.trim() == "class"){
				_local_data.type = "class";
				_local_data.mam = "";
			}else if(mame.trim() == "import"){
				_local_data.type = "import";
				_local_data.mam = "";
			}else if(mame.trim() == "try"){
				_local_data.ptype = "try";
				this._save_last_error = "_try";
				_local_data.mam = "";
				_local_data.close_expresion_at = "";
			}else if(mame.trim() == "else"){
				if(_local_data.ltype != "if"){
					_local_data.i = excode.length;
					if(returnError){
						this.errorOcured = true;
						return dateCreator["SyntaxError"]("Unexpected token else");
					}
					this.throwError("SyntaxError: Unexpected token else", radek+poii, xa, mame, _fileName);
				}
				_local_data.ptype = "else";
				_local_data.close_expresion_at = "";
				_local_data.mam = "";
			}else if(le == "{" && _local_data.type == "class"){
				save_class_name = _local_data.mam.trim();
				_local_data.ptype = _local_data.type;
				_local_data.ltype = _local_data.type;
				_local_data.type = "";
				_local_data.close_expresion_at = "}";		
				_local_data.mam = "";
			}else if(le == "(" && _local_data.type == ""){
				var popak = _local_data.mam.split(" ");
				if(_local_data.mam == "if"){
					_local_data.ptype = _local_data.type;
					_local_data.type = "if";
					_local_data.mam = "";
				}else if(_local_data.mam == "while"){
					_local_data.ptype = _local_data.type;
					_local_data.type = "while";
					_local_data.mam = "";
				}else if(popak[0] == "function"){
					_local_data.ptype = _local_data.type;
					_local_data.type = "function";
					save_funct_name = popak[1];
					_local_data.mam = "";
				}else if(_local_data.mam == "catch"){
					if(_local_data.ltype == "try" || _local_data.ltype == "catch"){
						_local_data.type = "catch";
						_local_data.mam = "";
					}
					else{
						_local_data.i = excode.length;
						if(returnError){
							this.errorOcured = true;
							return dateCreator["SyntaxError"]("Unexpected token catch");
						}
						this.throwError("SyntaxError: Unexpected token catch", radek+poii, xa, mame, _fileName);
					}
				}else 
					_local_data.mam+=le;
			}else if(le == ")"){
				if(_local_data.type != ""){
					_local_data.close_expresion_at = "";
					_local_data.save_expresion = _local_data.mam;
					
					if(_local_data.type == "function"){
						save_line = _local_data.i+1;
						_local_data.expresion_state = true;
					}else if(_local_data.type == "catch"){
						save_line = _local_data.i+1;
						_local_data.expresion_state = true;
					}else{
						var expresion = this.execute(_local_data.save_expresion);
						
						if(this.errorOcured){
							if(returnError){
								this.errorOcured = true;
								return expresion;
							}
							this.throwError(getValue(expresion.vars["error"]), radek+poii, xa, _local_data.save_expresion, _fileName);
							return expresion;
						}
						
						save_line = _local_data.i+1;
						
						executed = getValue(expresion, "int", this);
						
						if(this.errorOcured){
							if(returnError){
								this.errorOcured = true;
								return executed;
							}
							this.throwError(getValue(executed.vars["error"]), radek+poii, xa, _local_data.save_expresion, _fileName);
							return executed;
						}
						
						if(executed == 1){
							_local_data.expresion_state = true;
						}else{
							_local_data.expresion_state = false;
						}
					}
					
					_local_data.ptype = _local_data.type;
					_local_data.ltype = _local_data.type;
					_local_data.mam = "";
					_local_data.type = "";
				}else{
					_local_data.mam+=")";
				}
			}else{
				if((_local_data.ptype == "if" || _local_data.ptype == "else" || _local_data.ptype == "while" || _local_data.ptype == "function" || _local_data.ptype == "try" || _local_data.ptype == "catch") && le == "{"){
					_local_data.close_expresion_at = "}";					
					_local_data.mam = "";
				}else if((_local_data.ptype == "if" || _local_data.ptype == "else" || _local_data.ptype == "while" || _local_data.ptype == "function" || _local_data.ptype == "try" || _local_data.ptype == "catch") && le != " "){
					_local_data.close_expresion_at = "\n";					
					_local_data.mam+=le;
				}else
					_local_data.mam+=le;
			}
			_local_data.i++;
			xa++;
			//_time_++;
			/*
			if(this.errorOcured){
				console.log(executed);
				this.throwError((executed.func["type"]())+": "+getValue(executed.vars["error"]), 0, 0, "");
			}
			*/
		}
		
		if(_thread_call_agan && !this._thread_stoped){
			var _this = this, _code = code, _filename = _fileName, _pcsp = _thread_call_save_pos, _ld = _local_data, __returnError = returnError;
			setTimeout(function(){_this.compile(_code, _filename, _pcsp, 0, nocomp, __returnError, _ld);}, 0);
			return this._TYPE_SYNC;
		}else{
			if(!nocomp){
				if(!this.errorOcured){
					logit("Program ended at "+((Math.floor((Date.now() - _local_data._time_) / 10))/100)+"s", 'info_msg');
				}
				setTimeout(function(){stoped();}, 1);
			}
		}
		
		return _local_data.return_object;
	},
	throwError: function(error, line, at, what, fname){
		var tmi = Date.now();
		if(typeof what == "undefined")
			logit("<div style='float:right;'>"+fname+" (<a href='#' onClick='selectIn(this);return false;'>"+line+":"+at+"</a>)</div>"+error, 'error_msg');
		else{
			logit("<div style='float:right;'>"+fname+" (<a href='#' onClick='selectIn(this);return false;'>"+line+":"+at+"</a>)</div><div class=expand onClick=\"expand("+tmi+");return false;\">"+error+"</div><div style='display: none;color: #2D2D2D;margin-left: 17px;padding-left: 5px;margin-top: 3px;border-left: 2px solid #7B7B7B;' id='id_error_exp_"+(tmi)+"'>"+what+"</div>", 'error_msg');
		}
	},
	execute: function(code, filename, posLine){
		this.errorOcured = false;
		var PyrID = this;
		var i = 0,
		pline = posLine,
		mam = "",
		fullmam = "",
		acttype = "",
		subacttype = "";
		args = new Array(),
		argc = 0,
		open = false,
		varcom = "",
		fullname = "",
		savenamvar = "",
		vrat = "null",
		builder = "",
		nofucntionnow = false;
		notBeVarButFunc = false,
		myActionAft = "",
		openLowZavro = 0,
		openAleradyis = false;
		var excode = code;
		if(typeof filename == "undefined") filename = "<console>";
		if(typeof pline == "undefined") pline = 1;
		
		var znak = excode.substring(0,1);
		if(znak == "-" || znak == "+"){
			nofucntionnow = true;
		}
		
		normal = excode;
		if(excode.substring(excode.length-1,excode.length) != ";"){
			excode+=";";
		}else{
			normal = excode.substring(0,excode.length-1);
		}
		/*
		if(this.getType(normal) != "variable"){
			return this.createVar(normal);
		}
		*/
		
		while(i < excode.length){
			le = excode.substring(i,i+1);
			
			if(le == "\""){
				open = !open;
				if(!open){
					
				}
				mam+="\"";
			}
			else if(open){
				if(i == excode.length-1){
					this.errorOcured = true;
					vrat = dateCreator["EOLError"]("EOL while scanning string", pline, i, filename, excode);
					mam="";
					break;
				}
				if(le == "\\" && excode.substring(i+1,i+2) != " "){
					mam+="\\"+excode.substring(i+1,i+2);
					i++;
				}else
					mam+=le;
			}
			else{
				if((le == "=" || excode.substring(i,i+2) == "+=" || excode.substring(i,i+2) == "-=") && excode.substring(i,i+2) != "==" && excode.substring(i-1,i) !="!" && !nofucntionnow){
					acttype = "assignment";
					if(excode.substring(i,i+2) == "+=" || excode.substring(i,i+2) == "-="){
						this.subacttype = excode.substring(i,i+2);
						i++;
					}else{
						this.subacttype = "=";
					}
					mam = mam.trim();
					
					if(varcom != ""){
						canbeit = false;
						argc = 0;
						if(typeof varcom.vars[mam] != "undefined"){
							args[argc] = varcom;argc++;
							args[argc] = mam;argc++;
							fullname += "."+mam;
							canbeit = true;							
						}else if(typeof varcom.func[mam] != "undefined"){							
							fullname += "."+mam;
							invararg = new Array();
							invararg[0] = varcom; //Variable in JS
							invararg[1] = mam;    //Name of function to execute
							invararg[2] = "";     //Variables empty
							varcom = this.priAction("execute", invararg);
							args[argc] = varcom;argc++;
							canbeit = true;	
						}else if(typeof varcom.func["_setattr"] != "undefined"){
							//var __t = varcom.func["_setattr"](varcom, this.execute(mam));
							acttype = "_set_with_setattr";
							args["funct"] = varcom.func["_setattr"];
							args["name"]  = mam;
							canbeit = true;	
						}else if(this.getType(mam) != "variable"){
							this.errorOcured = true;
							if(fullname!="") fullname=fullname+".";
							vrat = dateCreator["SyntaxError"]("Unexpected "+this.getType(mam)+" '"+mam+"'", pline, i-(mam.length), filename, excode);
							mam="";
							break;
						}
							
						if(!canbeit){
							this.errorOcured = true;
							if(fullname!="") fullname=fullname+".";
							console.log(mam);
							vrat = dateCreator["NameError"]("variable '"+fullname+""+mam+"' is not defined", pline, i-(mam.length), filename, excode);
							mam="";
							break;
						}
					}else{
						args[argc] = mam.trim();argc++;
					}
					mam = "";
					nofucntionnow=true;
				}else if(le == "=" && excode.substring(i,i+2) == "=="){
					mam+="==";i+=2;
					continue;
				}else if(le == "." && !nofucntionnow && !isIn(mam, this.operators) && openLowZavro == 0){
					if(this.getType(mam) == "int"){
						mam+=".";
					}else if(this.getType(mam) == "float"){
						this.errorOcured = true;
						vrat = dateCreator["EOFError"]("unexpected EOF while parsing", pline, i+1, filename, excode);
						mam="";
						break;
					}else{
						if(!notBeVarButFunc){
							canbeit = false;
							
							mam = mam.trim();
							
							if(varcom == ""){
								locVariable = this.isVariable(mam, i, filename, excode, fullname);
								if(this.getType(mam) != "variable"){
									varcom = this.createVar(mam);
									fullname = mam;
									canbeit = true;
								}else if(this.errorOcured == false){
									varcom = locVariable;
									fullname = mam;
									canbeit = true;
								}else{
									vrat = locVariable;
									mam = "";
									break;
								}
							}else{
								if(typeof varcom.body[mam] != "undefined"){
									varcom = varcom.body[mam];
									fullname += "."+mam;
									canbeit = true;							
								}else if(typeof varcom.func[mam] != "undefined"){							
									fullname += "."+mam;
									invararg = new Array();
									invararg[0] = varcom; //Variable in JS
									invararg[1] = mam;    //Name of function to execute
									invararg[2] = "";     //Variables empty
									varcom = this.priAction("execute", invararg);
									canbeit = true;	
								}else if(this.getType(mam) != "variable"){
									varcom = this.createVar(mam);
									canbeit = true;
								}
							}
							
							if(!canbeit){
								//this.error("Variable with name: "+mam+" doesn't exists!");
								this.errorOcured = true;
								if(fullname!="") fullname=fullname+".";								
								vrat = dateCreator["NameError"]("variable '"+fullname+""+mam+"' is not defined", pline, i-(mam.length), filename, excode);
								mam="";
								break;
							}
						}else{
							notBeVarButFunc = false;
						}
						
						mam = "";
					}
				}else if(le == "(" && !nofucntionnow && ( !isIn(mam, this.operators) || openAleradyis )){					
					if(openLowZavro == 0){
						savenamvar = mam;
						mam = "";
						openLowZavro = 1;
						openAleradyis = true;
					}else{
						openLowZavro++;
						mam+="(";
					}
				}else if(le == ")" && !nofucntionnow && openLowZavro > 1 && ( !isIn(mam, this.operators) || openAleradyis )){
					openLowZavro--;
					mam+=")";
				}else if(le == ")" && !nofucntionnow && ( !isIn(mam, this.operators) || openAleradyis )){
					openLowZavro--;
					openAleradyis = false;
					canbeit = false;
					notBeVarButFunc = true;					
					if(varcom == "" || (varcom == "" && savenamvar.substring(0,4) == "new ")){
						if(savenamvar.substring(0,4) == "new "){
							var objname = savenamvar.substring(4);
							if(typeof dateCreator[objname] != "undefined"){
								varcom = new dateCreator[objname](this.makeArgs(mam),this);
								fullname += savenamvar.substring(4);
								canbeit = true;	
							}else{
								this.errorOcured = true;
								vrat = dateCreator["NameError"]("class '"+savenamvar.substring(4)+"' is not defined", pline, i-(savenamvar.length)-1-(mam.length), filename, excode);
								mam="";
								break;
							}
						}else{
							fullname = savenamvar;
							var locVariable = this.isVariable(savenamvar, i, filename, excode, fullname);
							if(typeof this.func[savenamvar] != "undefined"){
								var __savenamvar = savenamvar;
								
								var ex = this.makeArgs(mam);
								
								if(this.errorOcured) return ex;
								savenamvar = __savenamvar;
								var getvrat = this.func[savenamvar](ex);
								if(typeof getvrat != "undefined")
									if(getvrat.type != "null")
										return getvrat;
								canbeit = true;	
							}else if(this.errorOcured == false){
								var argsi = this.makeArgs(mam);
								vrat = locVariable.func["_call"](argsi, this);
								canbeit = true;
								if(this.errorOcured) return ex;
								if(this._parent != null && vrat == this._parent._TYPE_SYNC)
									return this._TYPE_SYNC;
							}
						}
					}else if(typeof varcom.body != "undefined" && typeof varcom.body[savenamvar] != "undefined"){
						varcom = varcom.body[savenamvar];
						fullname += "."+savenamvar;
						canbeit = true;							
					}else if(typeof varcom.func[savenamvar] != "undefined"){
						fullname += "."+savenamvar;
						invararg = new Array();						
						invararg[0] = varcom; 				//Variable in JS
						invararg[1] = savenamvar;    		//Name of function to execute
						invararg[2] = mam;   				//Variables args
						varcom = this.priAction("execute", invararg);
						canbeit = true;
						if(this.errorOcured) return varcom;
						if(varcom == this._TYPE_SYNC){
							return varcom;
							break;
						}
					}else if(typeof varcom.vars[savenamvar] != "undefined"){
						var argsi = this.makeArgs(mam);
						vrat = varcom.vars[savenamvar].func["_call"](argsi);
						canbeit = true;
					}else if(varcom != "" && savenamvar.substring(0,4) == "new "){
						this.errorOcured = true;
						vrat = dateCreator["SyntaxError"]("Can't create object '"+savenamvar.substring(4)+"' from '"+fullname+"'", pline, i-(savenamvar.length)-1-(mam.length), filename, excode);
						mam="";
						break;
					}
					
					if(!canbeit){
						this.errorOcured = true;
						vrat = dateCreator["FunctionMissing"]("function '"+savenamvar+"' is not defined", pline, i-(savenamvar.length)-1-(mam.length), filename, excode);
						mam="";
						break;
					}
					mam  = "";					
					acttype = "";
				}else if(le == ";" || i == excode.length-1){
					if(i == excode.length-1 && le != ";"){ mam+=le; }
					if(acttype == "" && varcom != "" && mam == ""){
						vrat = varcom;
					}else if(acttype == "" && mam!=""){
						if(isIn(mam, this.operators)){
							if(isIn(le, this.operators) && i == excode.length-1){
								this.errorOcured = true;
								vrat = dateCreator["SyntaxError"]("unexpected EOF while parsing", pline, i, filename, excode);
								mam="";
								break;
							}else{
								vrat = this.mathCompile(mam, filename);
								mam = "";
								if(this.errorOcured == true)
									break;
							}
							
						}
						else if(varcom == ""){
							locVariable = this.isVariable(mam, i, filename, excode, fullname);
							if(acttype == "assignment"){
								
							}else if(this.errorOcured == false){
								vrat = locVariable;
							}else{				
								vrat = locVariable;
								mam="";
								break;
							}
							mam = "";
						}else{
							canbeit = false;
							
							if(typeof varcom.body[mam] != "undefined"){
								varcom = varcom.body[mam];
								fullname += "."+mam;
								canbeit = true;							
							}else if(typeof varcom.func[mam] != "undefined"){
								fullname += "."+mam;
								invararg = new Array();
								invararg[0] = varcom; //Variable in JS
								invararg[1] = mam;    //Name of function to execute
								invararg[2] = "()";   //Variables empty
								varcom = this.priAction("execute", invararg);
								canbeit = true;	
								nofucntionnow = false;
							}else if(typeof varcom.vars[mam] != "undefined"){
								varcom = varcom.vars[mam];
								fullname += "."+mam;
								canbeit = true;	
							}
							vrat = varcom;
							
							if(!canbeit){
								this.errorOcured = true;
								if(fullname!="") fullname=fullname+".";
								vrat = dateCreator["NameError"]("variable '"+fullname+""+mam+"' is not defined", pline, i-(mam.length), filename, excode);
								mam="";
								break;
							}
							
							mam="";
						}
					}
					
					if(acttype!=""){
						if(acttype == "_set_with_setattr"){							
							var __t = args["funct"](new Array(this.createVar("\""+args["name"]+"\""), this.execute(mam.trim())), this);
							if(this.errorOcured == true){
								vrat = __t;
							}else{
								vrat = dateCreator["null"]();
							}
							acttype = "";
							args = null;
							mam = "";
						}else{
							vrat = null;
							args[argc] = mam.trim();argc++;
							mam = "";
							ret = this.priAction(acttype, args);
							vrat = null;
							if(this.errorOcured){
								vrat = ret;
							}
						}
					}
					
					args = new Array();
					acttype = "";
					varcom = "";
					builder = "";
				}else{
					mam+=le;
				}
			}
				
			i+=1;
			ErrorOcured = false;
		}
		
		if(mam != ""){ vrat = getVal(mam, this); }
		
		return vrat;
	},
	mathCompile: function(text, filename){
			var vstup = "",
				vystup = text;
				
			//unary operstors
			var unar_op = {
				1: {
					"++": ["_psinc", "_princ"],
					"--": ["_psdec", "_prdec"],
					"?" : ["_opnotsupp","_notnull"]
				}
			};
			//binary operators
			var operace = {
				1: {
					"*" : ["_mul", "_rmul"],
					"/" : ["_div", "_rdiv"],
					"%" : ["_mod", "_rmod"]
				},
				2: {
					"+" : ["_add", "_radd"],
					"-" : ["_sub", "_rsub"]
				},
				3: {
					"==": "_eq",
					"!=": "_ine"
				},
				4: {
					"<" : "_lt",
					">" : "_gt"
				}
			}
			
			var alloperator = Array(),
				alloperato_ = Array(),
				allopsize = 0,
				allopsiz_ = 0;
			for (var key in unar_op) {
				for (var act in unar_op[key]) {
					alloperator[allopsize] = act;
					allopsize++;
				}
			}
			for (var key in operace) {
				for (var act in operace[key]) {
					alloperato_[allopsiz_] = act;
					allopsiz_++;
				}
			}
			
			vstup = vystup.trim();
			vystup = "";
			
			for (var key in unar_op) {				
				var lastoperator = "",
					actualchars = Array(),
					acutalfunct = Array(),
					buffer = "";
				var pos = 0;
				
				for (var act in unar_op[key]) {
					actualchars[pos] = act;
					acutalfunct[pos] = unar_op[key][act];
					pos++;
				}
			}
			
			var open = false;
			buff = "";
			for(var a = 0;a < vstup.length;a++){
				var chr = vstup.substring(a,a+1);
				if(chr == "\"" && open == false){
					open = true;
					buff+="\"";
				}else if(chr == "\"" && open == true){
					open = false;
					buff+="\"";
				}else if(open == true){
					if(chr == "\\"){
						a++;
						chr = "\\"+vstup.substring(a,a+1)
					}
					buff+=chr;
				}else if(chr != " "){
					buff+=chr;
				}
			}
			vstup = buff;
			
			var save_operator = "";
			
			var alloperator = Array(),
				allopsize = 0;
			for (var key in unar_op) {
				for (var act in unar_op[key]) {
					alloperator[allopsize] = act;
					allopsize++;
				}
				
				var buff = "",buffadd = "";
				var open = false;
				var fnc = "", snc = "";
				
				for(var a = 0;a < vstup.length;a++){
					var chr = vstup.substring(a,a+1),
						ch2 = vstup.substring(a,a+2);
					
					if(chr == "\"" && open == false){
						open = true;
						buff+="\"";
					}else if(chr == "\"" && open == true){
						open = false;
						buff+="\"";
						a++;
						chr = vstup.substring(a,a+1);
						ch2 = vstup.substring(a,a+2);
					}else if(open == true){
						if(chr == "\\"){
							a++;
							chr = "\\"+vstup.substring(a,a+1)
						}
						buff+=chr;
					}
					
					//++1+1 ??????
					var omam = false;
					
					if(open == false){
						if((isIn(ch2,alloperato_) || isIn(chr,alloperato_)) && !isIn(chr,actualchars) && !isIn(ch2,actualchars)){							
							if(snc != ""){
								fnc = snc;
								omam=true;
								if(isIn(ch2,alloperato_)){
									a++;
									buffadd = ch2;
								}else{
									buffadd = chr;
								}
							}else{
								//this.errorOcured = true;
								//return dateCreator["SyntaxError"]("Unexpected identifier");
								vystup+=buff;
								buff = "";
							}
						}else{
							for(var i = 0;i < pos;i++){
								if(actualchars[i].length > 1)
									chr = vstup.substring(a,a+actualchars[i].length);
								else
									chr = vstup.substring(a,a+1);
								
								if(chr == actualchars[i]){
									save_operator = actualchars[i];
									omam = true;
									if(actualchars[i].length > 1)
										a++;
									
									if(buff.trim()!=""){
										fnc = acutalfunct[actualchars.indexOf(actualchars[i])][0];
									}else{
										snc = acutalfunct[actualchars.indexOf(actualchars[i])][1];
									}
								}
							}
							
							chr = vstup.substring(a,a+1),
							ch2 = vstup.substring(a,a+2);
						}
						
						if(!omam){
							buff+=chr;
							if(a==vstup.length-1 && snc!=""){
								fnc = snc;
							}
						}
							
						if(fnc != ""){
							var num1, cislo1;
							cislo1 = this.isVariable(buff);
							var vysledek = cislo1.func[fnc](new Array(dateCreator["string"](save_operator)), this);
							save_operator = "";
							if(this.errorOcured){ return vysledek; }
							vystup+=vysledek;
							if(buffadd != "") vystup+=buffadd;
							buffadd = "";
							buff="";
						}
					}
				}
			}
			
			var alloperator = Array(),
				allopsize = 0;
			for (var key in operace) {
				for (var act in operace[key]) {
					alloperator[allopsize] = act;
					allopsize++;
				}
			}
			
			if(buff != "") vystup+=buff;
			if(vystup.trim() == "") vystup = vstup;

			for (var key in operace) {
				vstup = vystup.trim();
				vystup = "";
				
				var lastoperator = "",
					actualchars = Array(),
					acutalfunct = Array(),
					buffer = "";
				var pos = 0, doubl = false;
				
				for (var act in operace[key]) {
					actualchars[pos] = act;
					acutalfunct[pos] = operace[key][act];
					pos++;
				}
			
				var num1 = "", num2 = "";
				var buff = "";
				var thisisfloat = false;
				var open = false;
				
				for(var a = 0;a < vstup.length;a++){
					var chr = vstup.substring(a,a+1),
						ch2 = vstup.substring(a,a+2);
					var pro = false;
					
					if(chr == "\"" && open == false){
						open = true;
						buffer+="\"";
					}else if(chr == "\"" && open == true){
						open = false;
						if(a != vstup.length-1){
							buffer+="\"";
							a++;
							chr = vstup.substring(a,a+1);
							ch2 = vstup.substring(a,a+2);
						}
					}else if(open == true){
						if(chr == "\\"){
							a++;
							chr = "\\"+vstup.substring(a,a+1)
						}
						buffer+=chr;
					}
					
					if(open == false){						
						for(var i = 0;i < pos;i++){
							if(actualchars[i].length > 1)
								chr = vstup.substring(a,a+actualchars[i].length);
							
							if(chr == actualchars[i]){
								if(actualchars[i].length > 1)
									a++;
								
								pro = true;
								
								if(lastoperator != ""){								
									num2 = buffer.trim();
									
									if(this.getType(num1) == "variable" || this.getType(num1) == "list") { num1 = this.execute(num1, filename); }
									if(this.errorOcured){ return num1; }
									if(this.getType(num2) == "variable" || this.getType(num2) == "list") { num2 = this.execute(num2, filename); }
									if(this.errorOcured){ return num2; }
									
									if(thisisfloat == true){ type1="float";type2="float"; }
									else{ 	
										if(this.getType(num1) == "float" || this.getType(num2) == "float"){ 
											thisisfloat = true;
											type1 = "float";type2 = "float"; 
										}
										else{ 
											type1 = this.getType(num1);type2 = this.getType(num2); 
										} 
									}	
									cislo1 = dateCreator[type1](num1, this);
									/* if(typeof num1.func[fnc] == "undefined"){
										cislo1 = dateCreator["string"](num1.func["_string"](), this);
									}	*/
									cislo2 = dateCreator[type2](num2, this);
									
									fnc = acutalfunct[actualchars.indexOf(lastoperator)];
									var savefnc = fnc;
									if(Object.prototype.toString.call(fnc) === '[object Array]'){
										fnc = fnc[0];
									}
												
									var argu = new Array();
									argu[0] = cislo2;
											
									if(typeof cislo1.func[fnc] == "undefined"){
										cislo1 = cislo1.func["_string"]();
									}
									var vysledek = cislo1.func[fnc](argu, this);
									if(this.errorOcured){ 
										var _sv = cislo1;
										cislo1 = cislo2;
										cislo2 = _sv;
										fnc = savefnc[1];
										
										this.errorOcured = false;
										var saveerror = vysledek;
										argu[0] = cislo2;
										var vysledek = cislo1.func[fnc](argu, this);
										
										if(this.errorOcured){
											return saveerror; 
										}
									}
									
									if(type1 == "string" || type2 == "string")
										vysledek="\""+vysledek+"\"";
									
									num1 = vysledek;
								}else{
									num1 = buffer.trim();
								}
								lastoperator = chr;
								buffer = "";
							}
						}
						
						if(!pro)
							chr = vstup.substring(a,a+1);
						

						if(!pro && (alloperator.indexOf(chr) > 0 || alloperator.indexOf(ch2) > 0 || a == vstup.length-1)){
							if(alloperator.indexOf(ch2) > 0){
								var operwi = alloperator[alloperator.indexOf(ch2)];
								a++;
							}else
								var operwi = alloperator[alloperator.indexOf(chr)];
							
							if(a == vstup.length-1){
								operwi = "";
								buffer += chr;
							}
							
							if(lastoperator != ""){
								num2 = buffer.trim();
								
								if(this.getType(num1) == "variable" || this.getType(num1) == "list") { num1 = this.execute(num1, filename); }
								if(this.errorOcured){ return num1; }
								if(this.getType(num2) == "variable" || this.getType(num2) == "list") { num2 = this.execute(num2, filename); }
								if(this.errorOcured){ return num2; }														
								
								if(thisisfloat == true){ type1="float";type2="float"; }
								else{ 	
									if(this.getType(num1) == "float" || this.getType(num2) == "float"){ 
										thisisfloat = true;
										type1 = "float";type2 = "float"; 
									}
									else{ 
										type1 = this.getType(num1);type2 = this.getType(num2); 
									} 
								}
																	
								cislo1 = dateCreator[type1](num1, this);
								cislo2 = dateCreator[type2](num2, this);
								
								fnc = acutalfunct[actualchars.indexOf(lastoperator)];
								var savefnc = fnc;
								if(Object.prototype.toString.call(fnc) === '[object Array]'){
									fnc = fnc[0];
								}
												
								var argu = new Array();
								argu[0] = cislo2;
												
								var vysledek = cislo1.func[fnc](argu, this);
								if(this.errorOcured){ 
									var _sv = cislo1;
									cislo1 = cislo2;
									cislo2 = _sv;
									fnc = savefnc[1];
									
									this.errorOcured = false;
									var saveerror = vysledek;
									argu[0] = cislo2;
									var vysledek = cislo1.func[fnc](argu, this);
									
									if(this.errorOcured){
										return saveerror; 
									}
								}
								
								vystup+=vysledek+""+operwi+"";
								
								num1 = "";
								num2 = "";
							}else{
								vystup+= buffer.trim() +""+operwi+"";
							}
							lastoperator = "";
							buffer="";
						}
						else if(!pro){
							buffer+=chr;
						}
					}
				}
				
				if(num1 != "") vystup+=num1;
				if(buffer != "" && vystup == "") vystup = buffer;
			}
		return vystup;
	},
	priAction: function(how, args){
		if(how == "assignment"){
			create = false;
			
			if(typeof args[0] != "object"){
				locVariable = this.isVariable(args[0], 0, "", "", "");
			}
			
			if(this.subacttype == "="){
				actname = "_set";
			}else if(this.subacttype == "+=" || this.subacttype == "-="){
				args[1] = this.execute(args[1]+"");
				if(this.subacttype == "+=")
					actname = "_iadd";
				else if(this.subacttype == "-=")
					actname = "_isub";
				
				if(this.errorOcured){
					return locVariable;
				}else{
					var err = locVariable.func[actname](new Array(args[1]), this);
					
					if(this.errorOcured){
						return err;
					}
				}
				return true;
			}
			this.subacttype = "";
			
			if(typeof args[0] == "object"){				
				args[2] = this.execute(args[2]);
				args[0].func["_set"](new Array(args[1], args[2]), this);
				
				if(this.errorOcured)
					return args[2];
				else
					return true;
			}
			else if(args[0].indexOf("[") != -1){
				var mam = args[1];
				args[1] = this.execute(args[1]);
				
				var nameoflist = "", index = "", sinx = false;
				for(var i=0;i<args[0].length;i++){
					if(args[0].substr(i,1) == "["){
						sinx = true;
					}else if(args[0].substr(i,1) == "]"){
						break;
					}else{ 
						if(!sinx) nameoflist+=args[0].substr(i,1); 
						else index+=args[0].substr(i,1);
					}
				}
				
				locVariable = this.isVariable(nameoflist, 0, "", "", "");
				
				if(!this.errorOcured){
					locVariable = locVariable.func["_setitem"](new Array(args[1], this.execute(index)), this);
					if(!this.errorOcured){
						return true;
					}else return locVariable;
				}else{
					return locVariable;
				}
				
			}else{
				if(args[0].substr(args[0].length-1,1) == "]")
					return locVariable;
				this.errorOcured = false;
			}
			
			var mam = args[1];
			args[1] = this.execute(args[1]);
			
			if(this.errorOcured){
				return args[1];
			}
			
			if(typeof args[1] == "object"){
				this.variables[args[0]] = args[1];
				return true;
			}

			ntype = this.getType(args[1]);
			if(ntype == "int")
				this.variables[args[0]] = new dateCreator["int"](args[1]);
			else if(ntype == "float")
				this.variables[args[0]] = new dateCreator["float"](args[1]);
			else if(ntype == "string")
				this.variables[args[0]] = new dateCreator["string"](args[1]);
			else
				this.variables[args[0]] = new dateCreator["null"](args[1]);
			if(this.errorOcured)
				return args[1];
			else
				return true;
		}else if(how == "execute"){
			myvar = args[0];
			fucnt = args[1];
			varsm = this.makeArgs(args[2]);
			return myvar.func[fucnt](varsm, this);
		}
		
		return null;
	},
	createVar: function(val){
		ntype = this.getType(val);
		
		if(ntype == "int")
			return dateCreator["int"](val);
		else if(ntype == "float")
			return dateCreator["float"](val);
		else if(ntype == "string")
			return dateCreator["string"](val);
		else if(ntype == "list")
			return dateCreator["list"](val, this);
		else
			return dateCreator["null"](val);		
		
	},
	isVariable: function(mam, i, filename, excode){
		var typet = this.getType(mam);		
		if(typet == "list" && mam.substr(0,1) != "[") typet = "variable";
		if(typet != "variable"){
			vrat = new dateCreator[this.getType(mam)](mam, this);
		}else if(typeof this.variables[mam] != "undefined"){
			vrat = this.variables[mam];
		}else if(mam.substr(mam.length-1,1) == "]"){
			var thisvar = "", savename = "", saveindex = "";
			var thisptc = null, can = 1, stateha = 0;
			for(var pi = 0; pi<mam.length; pi++){
				var znk = mam.substr(pi,1);
				if(stateha == 0){
					if(znk == "["){
						if(typeof this.variables[thisvar] != "undefined"){
							thisptc = this.variables[thisvar];
							savename = thisvar;
							thisvar = "";
							stateha++;
							can=0;
						}else{
							savename = thisvar;
							break;
						}
					}else
						thisvar+= znk;
				}else{
					if(znk == "]"){
						if(saveindex != "") saveindex+=", ";
						saveindex+=thisvar;
						executeinde = this.execute(thisvar);
						thisvar = getValue(executeinde);
						
						if(this.errorOcured){ return executeinde; }
						if(typeof thisptc.func["_getitem"] != "undefined"){
							outputer = thisptc.func["_getitem"](new Array(executeinde), this);
							if(this.errorOcured != true){
								thisptc = outputer;
								thisvar = "";
							}else{
								errorToShow = outputer;
								can=1;
								break;
							}
						}
						else if(typeof thisptc.vars[thisvar] != "undefined"){
							thisptc = thisptc.vars[thisvar];
							thisvar = "";
							if(pi != mam.length - 1){
								if(mam.substr(pi+1,1) != "["){
									can = 2;
									break;
								}else
									pi++;
							}
						}else{
							can=1;
							break;
						}
						stateha = 0;
					}else{
						thisvar+= znk;
					}
				}
			}
			if(can == 1 || can == 2){
				this.errorOcured = true;
				if(can == 2)
					vrat = dateCreator["SyntaxError"]("unexpected EOF while parsing", this.pline, i+pi, filename, excode);
				if(saveindex == "")
					vrat = dateCreator["NameError"]("variable '"+savename+"' is not defined", this.pline, i-(mam.length)+pi, filename, excode);
				else{ //variable '"+savename+"' with index '"+saveindex+"' is not defined
					if(typeof errorToShow != "undefined")
						vrat = errorToShow;
					else
						vrat = dateCreator["IndexError"]("index '"+saveindex+"' is out of range", this.pline, i-(mam.length)+pi, filename, excode);
				}
			}else{
				vrat = thisptc;
			}
			mam = "";
		}else if(typeof this.func[mam] != "undefined"){
			vrat = dateCreator["string"]("native function '"+mam+"'", this);
		}else if(typeof dateType[mam] != "undefined"){
			vrat = dateCreator["string"]("native class '"+mam+"'", this);
		}else{
			vrat = dateCreator["NameError"]("variable '"+mam+"' is not defined", this.pline, i-(mam.length), filename, excode);
			this.errorOcured = true;
		}
		return vrat;
	},
	getType: function(text){
		return getType(text);
	},
	error: function(text){
		messageBox("Error", text);
	},
	patchAdd: function(vari){
		this.patch[this.patch.length] = vari;
	},
	patchRemove: function(){
		temparray = new Array();
		for(var i=0;i<this.patch.length-1; i++){
			temparray[i] = this.patch[i];
		}
		this.patch = temparray;
		
		return true;
	},
	patchGet: function(){
		if(this.patch.length == 0)
			return "";
	},
	makeArgs: function(args, justret){
		var mam  = "";
		open = false;
		var vars = new Array();
		if(typeof justret == "undefined") justret = false;
		
		for(var i=0;i<args.length; i+=1){
			le = args.substring(i,i+1);
			
			if(open && le == "\""){
				open = false;
				//mam = mam.trim();
				if(i == args.length-1){
					if(mam.indexOf("\"") > -1){
						mam+="\"";
					}
					mam = mam.trim();
					
					if(justret){
						vars[vars.length] = mam;
					}else{
						var ex = this.execute(mam);
						if(this.errorOcured) return ex;
						if(typeof ex == "object"){
							var vx = getValue(ex);
							if(ex.type == "string")
								vars[vars.length] = "\""+getValue(ex)+"\"";
							else
								vars[vars.length] = getValue(ex);
						}else{
							vars[vars.length] = "\""+ex+"\"";
						}
					}
				}else mam+="\"";
			}
			else if(open){				
				mam+=le;
			}
			else{
				if(le == "\""){
					open = true;
					mam+="\"";
				}else if(le == "," || i == args.length-1){
					if(i == args.length-1)
						mam+=le;
					mam = mam.trim();
										
					if(justret){
						vars[vars.length] = mam;
					}else{					
						var ex = this.execute(mam);
						if(this.errorOcured) return ex;
						
						if(typeof ex == "object"){
							var vx = getValue(ex);
							if(ex.type == "string")
								vars[vars.length] = "\""+getValue(ex)+"\"";
							else if(ex.type == "int" || ex.type == "float" || ex.type == "list")
								vars[vars.length] = getValue(ex);
							else
								vars[vars.length] = ex;
						}else
							vars[vars.length] = "\""+ex+"\"";
					}
					mam="";
				}else{
					mam+=le;
				}
			}	
		}
		
		if(justret)
			return vars;
		
		for(var i=0;i<vars.length; i+=1){
			if(typeof vars[i] != "object")
				vars[i] = this.createVar(vars[i]);
		}
		
		return vars;
	},
	isError: function(){
		return this.errorOcured;
	},
	setCookie: function(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	getCookie: function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	}
}

var Log = function(){
	this.output = null;
	this.outtyp = 1;
	this.lastE = "";
	//1 - console
	//2 - inside pyr
	//3 - nothing
}

Log.prototype = {
	e: function(text){
		this.lastE = text;
		if(this.outtyp == 1){
			this.output.setColor("red").write("Error: "+text).next().setColor("white");
		}
	}
}


var PValue = function(val){
	this.value = val;
}
PValue.prototype = { }


var DefaultVar = function(){
	this.func = {};	//Function in JS
	this.vars = {};
	this.body = {}; //Function in PYR
	this.type = "";
}
DefaultVar.prototype = { }

var var_type_count = 1;
function var_type(){
	var var_Tobject = new DefaultVar();
	
	var_Tobject.type = "";										//Type like "int", "float", "string", etc...
	var_Tobject.id = var_type_count;							//ID of object like #1 for first object
	var_type_count++;
		
	var_Tobject.func["_new"] 		= function(vars, global){ };
	var_Tobject.func["_init"] 		= function(vars, global){ };
	var_Tobject.func["_destroy"] 	= function(vars, global){ };
	
	var_Tobject.func["_eq"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator == is not supported in '"+this.id.type+"' class"); }; // ==
	var_Tobject.func["_ine"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator != is not supported in '"+this.id.type+"' class"); }; // !=
	var_Tobject.func["_lt"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator < is not supported in '"+this.id.type+"' class"); }; // <
	var_Tobject.func["_gt"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator > is not supported in '"+this.id.type+"' class"); }; // >
	var_Tobject.func["_le"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator <= is not supported in '"+this.id.type+"' class"); }; // <=
	var_Tobject.func["_ge"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator >= is not supported in '"+this.id.type+"' class"); }; // >=
	
	var_Tobject.func["_pos"] 		= function(vars, global){ }; // +
	var_Tobject.func["_neg"] 		= function(vars, global){ }; // -
	var_Tobject.func["_abs"] 		= function(vars, global){ }; // abs()	-1.50 => 1.50
	var_Tobject.func["_invert"] 	= function(vars, global){ }; // ~
	var_Tobject.func["_round"] 		= function(vars, global){ }; // round()   1.25 => 1
	var_Tobject.func["_floor"] 		= function(vars, global){ }; // floor()   1.25 => 1
	var_Tobject.func["_ceil"] 		= function(vars, global){ }; // ceil()	 1.25 => 2
	var_Tobject.func["_trunc"] 		= function(vars, global){ }; // trunc()   1.25 => 1
	
	var_Tobject.func["_add"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator + is not supported in '"+this.id.type+"' class"); }; // +
	var_Tobject.func["_sub"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator - is not supported in '"+this.id.type+"' class"); }; // -
	var_Tobject.func["_mul"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator * is not supported in '"+this.id.type+"' class"); }; // *
	var_Tobject.func["_floordiv"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator // is not supported in '"+this.id.type+"' class"); }; // //
	var_Tobject.func["_div"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator / is not supported in '"+this.id.type+"' class"); }; // /
	var_Tobject.func["_mod"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator % is not supported in '"+this.id.type+"' class"); }; // %
	var_Tobject.func["_pow"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator ** is not supported in '"+this.id.type+"' class"); }; // **
	var_Tobject.func["_lshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator << is not supported in '"+this.id.type+"' class"); }; // <<
	var_Tobject.func["_rshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator >> is not supported in '"+this.id.type+"' class"); }; // >>
	var_Tobject.func["_and"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator & is not supported in '"+this.id.type+"' class"); }; // &
	var_Tobject.func["_or"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator | is not supported in '"+this.id.type+"' class"); }; // |
	var_Tobject.func["_xor"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator ^ is not supported in '"+this.id.type+"' class"); }; // ^
	//reverse
	var_Tobject.func["_radd"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // +
	var_Tobject.func["_rsub"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // -
	var_Tobject.func["_rmul"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // *
	var_Tobject.func["_rfloordiv"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // //
	var_Tobject.func["_rdiv"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // /
	var_Tobject.func["_rmod"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // %
	var_Tobject.func["_rpow"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // **
	var_Tobject.func["_rlshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // <<
	var_Tobject.func["_rrshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // >>
	var_Tobject.func["_rand"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // &
	var_Tobject.func["_ror"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // |
	var_Tobject.func["_rxor"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Reverse operator is not supported in '"+this.id.type+"' class"); }; // ^	
	
	var_Tobject.func["_iadd"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator += is not supported in '"+this.id.type+"' class"); }; //  +=
	var_Tobject.func["_isub"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator -= is not supported in '"+this.id.type+"' class"); }; //  -=
	var_Tobject.func["_imul"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator *= is not supported in '"+this.id.type+"' class"); }; //  *=
	var_Tobject.func["_ifloordiv"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator //= is not supported in '"+this.id.type+"' class"); }; // //=
	var_Tobject.func["_idiv"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator /= is not supported in '"+this.id.type+"' class"); }; //  /=
	var_Tobject.func["_imod"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator %= is not supported in '"+this.id.type+"' class"); }; //  %=
	var_Tobject.func["_ipow"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator **= is not supported in '"+this.id.type+"' class"); }; // **=
	var_Tobject.func["_ilshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator <<= is not supported in '"+this.id.type+"' class"); }; // <<=
	var_Tobject.func["_irshift"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator >>= is not supported in '"+this.id.type+"' class"); }; // >>=
	var_Tobject.func["_iand"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator &= is not supported in '"+this.id.type+"' class"); }; //  &=
	var_Tobject.func["_ior"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator |= is not supported in '"+this.id.type+"' class"); }; //  |=
	var_Tobject.func["_ixor"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator ^= is not supported in '"+this.id.type+"' class"); }; //  ^=
	
	var_Tobject.func["_int"] 		= function(vars, global){ global.errorOcured = true; return dateCreator["ConvertError"]("Can not convert '"+this.id.type+"' to 'int'"); }; // integer
	var_Tobject.func["_long"] 		= function(vars, global){ global.errorOcured = true; return dateCreator["ConvertError"]("Can not convert '"+this.id.type+"' to 'long'"); }; // long
	var_Tobject.func["_float"] 		= function(vars, global){ global.errorOcured = true; return dateCreator["ConvertError"]("Can not convert '"+this.id.type+"' to 'float'"); }; // float
	var_Tobject.func["_string"] 	= function(vars, global){ global.errorOcured = true; return dateCreator["ConvertError"]("Can not convert '"+this.id.type+"' to 'string'"); }; // str
	
	var_Tobject.func["_sizeof"] 	= function(vars, global){ }; // sizeof
	
	var_Tobject.func["_getattr"] 	= function(vars, global){ }; // .attr
	var_Tobject.func["_setattr"] 	= function(vars, global){ }; // .attr = value
	var_Tobject.func["_delattr"] 	= function(vars, global){ }; 
	
	var_Tobject.func["_len"] 		= function(vars, global){ };
	var_Tobject.func["_getitem"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["IndexError"]("'"+this.id.type+"' class does not support items"); }; // []
	var_Tobject.func["_setitem"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["IndexError"]("'"+this.id.type+"' class does not support item assignment"); }; // [] =
	var_Tobject.func["_delitem"] 	= function(vars, global){ };
	var_Tobject.func["_contains"] 	= function(vars, global){ }; // kolo in auto
	var_Tobject.func["_missing"] 	= function(vars, global){ }; // kolo not in auto
	var_Tobject.func["_call"] 		= function(vars, global){ }; // call function
	
	var_Tobject.func["_psinc"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Postfix operator ++ is not supported in '"+this.id.type+"' class"); }; //  a++
	var_Tobject.func["_psdec"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Postfix operator -- is not supported in '"+this.id.type+"' class"); }; //  a--
	var_Tobject.func["_princ"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Prefix operator ++ is not supported in '"+this.id.type+"' class"); }; //  ++a
	var_Tobject.func["_prdec"] 		= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Prefix operator -- is not supported in '"+this.id.type+"' class"); }; //  --a
	var_Tobject.func["_notnull"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Prefix operator ? is not supported in '"+this.id.type+"' class"); }; //  ?a
	var_Tobject.func["_opnotsupp"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["UnsuportedOperator"]("Operator "+getValue(vars[0])+" is not supported in '"+this.id.type+"' class"); }; // Unsuported Operator
	
	var_Tobject.func["_get"] 		= function(vars, global){ }; // Delete maybe...
	var_Tobject.func["_set"] 		= function(vars, global){ this.id.vars[vars[0]] = vars[1]; }; // Update value
	//functions
	var_Tobject.func["type"] 		= function(vars, global){ return dateCreator["string"](this.id.type); };
	
	var_Tobject.func.id = var_Tobject;
	
	return var_Tobject;
}

function var_type_int(){
	var var_Tint = var_type();
	var_Tint.type = "int";
	
	var_Tint.func["_init"] = function(vars, global){
		var value = getValue(vars[0]);
		this.id.vars["value"]  = new PValue(parseInt(value));
	}
	var_Tint.func["_set"] = function(vars, global){
		var value = getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
		if(global.errorOcured) return value;
		this.id.vars["value"]  = new PValue(parseInt(value));
	}
	var_Tint.func["_int"] = function(vars, global){
		return this.id;
	}
	var_Tint.func["_float"] = function(vars, global){
		return dateCreator["float"](this.id.vars["value"].value);
	}
	var_Tint.func["_string"] = function(vars, global){
		return dateCreator["string"](this.id.vars["value"].value);
	}
	
	var_Tint.func["_mul"] = function(vars, global){  // *
		return parseInt(this.id.vars["value"].value) * getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
	}
	var_Tint.func["_div"] = function(vars, global){  // /
		if( getValue(vars[0]) == 0 ){
			global.errorOcured = true;
			return dateCreator["ZeroDivisionError"]("division by zero");
		}
		return parseInt(this.id.vars["value"].value) / getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
	}
	var_Tint.func["_add"] = function(vars, global){  // +
		return parseInt(this.id.vars["value"].value) + getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
	}
	var_Tint.func["_iadd"] = function(vars, global){  // +=
		var nw = getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
		if( global.errorOcured ) return nw;
		this.id.vars["value"].value += nw;
	}
	var_Tint.func["_sub"] = function(vars, global){  // -
		return parseInt(this.id.vars["value"].value) - getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
	}
	var_Tint.func["_isub"] = function(vars, global){  // -=
		var nw = getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
		if( global.errorOcured ) return nw;
		this.id.vars["value"].value -= nw;
	}
	var_Tint.func["_mod"] = function(vars, global){  // %
		return parseInt(this.id.vars["value"].value) % getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int");
	}
	var_Tint.func["_eq"] = function(vars, global){  // ==
		if(parseInt(this.id.vars["value"].value) == getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int"))
			return 1;
		else
			return 0;
	}
	var_Tint.func["_ine"] = function(vars, global){  // !=
		if(parseInt(this.id.vars["value"].value) != getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int"))
			return 1;
		else
			return 0;
	}
	var_Tint.func["_lt"] = function(vars, global){  // <
		if(parseInt(this.id.vars["value"].value) < getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int"))
			return 1;
		else
			return 0;
	}
	var_Tint.func["_gt"] = function(vars, global){  // >
		if(parseInt(this.id.vars["value"].value) > getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"int"))
			return 1;
		else
			return 0;
	}
	var_Tint.func["_psinc"] = function(vars, global){  // a++
		var ret = this.id.vars["value"].value;
		this.id.vars["value"]  = new PValue(parseInt(this.id.vars["value"].value+1));
		return ret;
	}
	var_Tint.func["_princ"] = function(vars, global){  // ++a
		this.id.vars["value"]  = new PValue(parseInt(this.id.vars["value"].value+1));
		return this.id.vars["value"].value;
	}
	var_Tint.func["_notnull"] = function(vars, global){  // ?a
		return (this.id.vars["value"].value != 0?1:0);
	}
		
	return var_Tint;
}

function var_type_float(){
	var var_Tfloat = var_type();
	var_Tfloat.type = "float";
	
	var_Tfloat.func["_init"] = function(vars, global){
		var value = getValue(vars[0])+"";
		if(value.indexOf(".") == -1)
			value+=".0";
		this.id.vars["value"]  = new PValue(parseFloat(value));
	}
	var_Tfloat.func["_set"] = function(vars, global){
		var value = getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
		if(global.errorOcured) return value;
		this.id.vars["value"]  = new PValue(parseFloat(value));
	}
	var_Tfloat.func["_int"] = function(vars, global){
		return dateCreator["int"](this.id.vars["value"].value);
	}
	var_Tfloat.func["_float"] = function(vars, global){
		return this.id;
	}
	var_Tfloat.func["_string"] = function(vars, global){
		return dateCreator["string"](this.id.vars["value"].value);;
	}
	var_Tfloat.func["_mul"] = function(vars, global){  // *
		return parseFloat(this.id.vars["value"].value) * getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tfloat.func["_div"] = function(vars, global){  // /
		if( getValue(vars[0]) == 0 ){
			global.errorOcured = true;
			return dateCreator["ZeroDivisionError"]("division by zero");
		}
		return parseFloat(this.id.vars["value"].value) / getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tfloat.func["_add"] = function(vars, global){  // +
		return parseFloat(this.id.vars["value"].value) + getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tfloat.func["_sub"] = function(vars, global){  // -
		return parseFloat(this.id.vars["value"].value) - getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tfloat.func["_mod"] = function(vars, global){  // %
		return parseFloat(this.id.vars["value"].value) % getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tfloat.func["_notnull"] = function(vars, global){  // ?a
		return (this.id.vars["value"].value != 0?1:0);
	}
		
	return var_Tfloat;
}

function var_type_null(){
	var var_Tnull = var_type();
	var_Tnull.type = "null";
	
	var_Tnull.func["_init"] = function(vars, global){
		this.id.vars["value"]  = new PValue("null");
	}
	var_Tnull.func["_int"] = function(vars, global){
		//return new PValue(0);
		return dateCreator["int"]("0");
	}
	var_Tnull.func["_string"] = function(vars, global){
		return new PValue("null");
	}
	var_Tnull.func["_eq"] = function(vars, global){  // ==
		var intr = getFunct(vars[0], "_int", new Array(), global);
		if(global.errorOcured){ global.errorOcured = false; return 0; }
		
		if(this.id.type == vars[0].type || getValue(intr,"int") == 0)
			return 1;
		else
			return 0;
	}
	var_Tnull.func["_ine"] = function(vars, global){  // !=
		var intr = getFunct(vars[0], "_int", new Array(), global);
		if(global.errorOcured){ global.errorOcured = false; return 0; }
		
		if(this.id.type != vars[0].type && getValue(intr,"int") != 0)
			return 1;
		else
			return 0;
	}
	var_Tnull.func["_notnull"] = function(vars, global){  // ?a
		return 0;
	}
	
	return var_Tnull;
}

function var_type_string(){
	var var_Tstring = var_type();
	var_Tstring.type = "string";
	
	var_Tstring.func["_init"] = function(vars, global){
		var vl = getValue(vars[0]);
		var value = (vl+"");
		if(value == "") value = getValue(vars[0]);
		else value = vl+"";
		
		if(value.substring(0,1) == '"' && value.substring(value.length-1,value.length) == '"') value=value.substring(1,value.length-1);
		
		this.id.vars["value"]  = new PValue(value.replace(/\"/g, "\\\""));
		this.id.vars["length"]  = dateCreator["int"](value.length);
	}
	var_Tstring.func["_set"] = function(vars, global){
		var value = getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
		if(global.errorOcured) return value;
		if(value.substring(0,1) == '"' && value.substring(value.length-1,value.length) == '"') value=value.substring(1,value.length-1);
		this.id.vars["value"]  = new PValue(value);
	}
	var_Tstring.func["_int"] = function(vars, global){
		var can = false;
		try {
			if(!isNaN(parseInt(getValue(this.id))))
				can = true;			
		}catch(error){
			can = false;
		}
			
		if(can){			
			value = parseInt(getValue(this.id));	
			newv = dateCreator["int"](value);
			return newv;
		}
		
		global.errorOcured = true;
		return dateCreator["ValueError"]("can not convert 'string' to 'int'");
	}
	var_Tstring.func["_float"] = function(vars, global){
		var can = false;
			
		try {
			if(!isNaN(parseFloat(getValue(this.id))))
				can = true;			
		}catch(error){
			can = false;
		}
			
		if(can){			
			value = parseFloat(getValue(this.id));	
			newv = dateCreator["float"](value);
			return newv;
		}
		
		global.errorOcured = true;
		return dateCreator["ValueError"]("can not convert 'string' to 'float'");
	}
	var_Tstring.func["_string"] = function(vars, global){
		return this.id;
	}
	
	var_Tstring.func["_get"] = function(vars, global){
		return "\""+this.id.vars["value"].value+"\"";
	}
	
	var_Tstring.func["_add"] = function(vars, global){  // +		
		var secondVal = getFunct(vars[0], "_"+this.id.type, new Array(), global);
		if(global.errorOcured) return secondVal;
		return this.id.vars["value"].value+""+getValue(secondVal);
	}
	var_Tstring.func["_radd"] = function(vars, global){  // reverse +
		var secondVal = getFunct(vars[0], "_"+this.id.type, new Array(), global);
		if(global.errorOcured) return secondVal;
		return getValue(secondVal)+""+this.id.vars["value"].value;
	}
	
	var_Tstring.func["indexOf"] = function(vars, global){
		var chars = getValue(vars[0]);
		return global.createVar(this.id.vars["value"].value.indexOf(chars));
	}
	var_Tstring.func["charAt"] = function(vars, global){
		var chars = parseInt(getValue(vars[0]));
		return global.createVar("\""+this.id.vars["value"].value.charAt(chars)+"\"");
	}
	var_Tstring.func["replace"] = function(vars, global){
		var char1 = getValue(vars[0]);
		var char2 = getValue(vars[1]);
		return global.createVar("\""+this.id.vars["value"].value.replace(char1,char2)+"\"");
	}
	var_Tstring.func["_getitem"] = function(vars, global){
		var chars = parseInt(getValue(vars[0]));
		return global.createVar("\""+this.id.vars["value"].value.charAt(chars)+"\"");
	}
	var_Tstring.func["_eq"] = function(vars, global){  // ==
		var intr = getFunct(vars[0], "_string", new Array(), global);
		if(global.errorOcured){ return intr; }
		
		if(getValue(intr,"string") == this.id.vars["value"].value)
			return 1;
		else
			return 0;
	}
	var_Tstring.func["_ine"] = function(vars, global){  // !=
		var intr = getFunct(vars[0], "_string", new Array(), global);
		if(global.errorOcured){ return intr; }
		
		if(getValue(intr,"string") != this.id.vars["value"].value)
			return 1;
		else
			return 0;
	}
	var_Tstring.func["_lt"] = function(vars, global){  // <
		if(this.id.vars["value"].value.length < getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"string").length)
			return 1;
		else
			return 0;
	}
	var_Tstring.func["_gt"] = function(vars, global){  // >
		if(this.id.vars["value"].value.length > getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global),"string").length)
			return 1;
		else
			return 0;
	}
	var_Tstring.func["_notnull"] = function(vars, global){  // ?a
		return (this.id.vars["value"].value != ""?1:0);
	}
	
	return var_Tstring;
}

function var_type_list(){
	var var_Tlist = var_type();
	var_Tlist.type = "list";
	
	var_Tlist.func["_init"] = function(vars, global){
		if(vars.length == 1)
			vars = global.makeArgs(vars[0].substring(1,vars[0].length-1));
		for(i=0;i<vars.length;i++){
			this.id.vars[i] = vars[i];
		}
		this.id.vars["length"] = dateCreator["int"](vars.length);
	}
	var_Tlist.func["_string"] = function(vars, global){
		var retstring = "[";
		for(var i=0;i<getValue(this.id.vars["length"]);i++){
			//console.log(i);
			if(i != 0)
				retstring+= ", ";
			var valreturlo = getValue(this.id.vars[i],"string");
			if(this.id.vars[i].type == "string")
				retstring+= "\""+valreturlo+"\"";
			else
				retstring+= valreturlo;
		}
		retstring+="]";
		return dateCreator["string"](retstring);
	}
	
	var_Tlist.func["_mul"] = function(vars, global){  // *
		if(vars.type != "int"){
			global.errorOcured = true;
			return dateCreator["TypeError"]("can't multiply list by '"+this.id.type+"' class");
		}
		global.errorOcured = true;
		return dateCreator["NotImplemented"]("This is not implemented in '"+this.id.type+"' class");
	}
	var_Tlist.func["add"] = function(vars, global){  // add object to next position
		var thisIndex = getValue(this.id.vars["length"], "int");
		this.id.vars[thisIndex] = vars[0];
		this.id.vars["length"] = dateCreator["int"](thisIndex+1);
		return null;
	}
	var_Tlist.func["_setitem"] = function(vars, global){  // [?] = 
		if(isNaN(vars[1])) { this.id.func["add"](new Array(vars[0]), global); return true;  }
		if(typeof this.id.vars[vars[1]] == "undefined"){
			global.errorOcured = true;
			return dateCreator["IndexError"]("index '"+vars[1]+"' is out of range");
		}
		this.id.vars[vars[1]] = vars[0];
		return true;
	}
	var_Tlist.func["_getitem"] = function(vars, global){
		var index = getValue(vars[0]);
		if(typeof this.id.vars[index] == "undefined"){
			global.errorOcured = true;
			return dateCreator["IndexError"]("index '"+index+"' is out of range");
		}
		return this.id.vars[index];
	}
		
	return var_Tlist;
}

//var_type_dictionary
function var_type_dictionary(){
	var var_Tdictionary = var_type();
	var_Tdictionary.type = "dictionary";
	
	var_Tdictionary.func["_init"] = function(vars, global){
		if(vars.length == 1)
			vars = global.makeArgs(vars[0].substring(1,vars[0].length-1), true);
		for(var i=0;i<vars.length;i++){
			var vl = getValue(vars[i]);
			var name = "";
			for(var q = 0; q < vl.length; q++){
				var chr = vl.charAt(q);
				if(chr == ":") break;
				name+=chr;
			}
			q++;
			this.id.vars[getValue(global.execute(name.trim()))] = global.execute(vl.substr(q).trim());
		}
		this.id.vars["length"] = dateCreator["int"](vars.length);
	}
	var_Tdictionary.func["_string"] = function(vars, global){
		var retstring = "{";
		var i = 0;
		for (key in this.id.vars) {
			if(key == "length") continue;
			if(i != 0)
				retstring+= ", ";
			retstring+="\""+key+"\": ";
			valreturlo = getValue(this.id.vars[key],"string");
			if(this.id.vars[key].type == "string")
				retstring+= "\""+valreturlo+"\"";
			else
				retstring+= valreturlo;
			i++;
		}
		retstring+="}";
		return dateCreator["string"](retstring);
	}
	var_Tdictionary.func["add"] = function(vars, global){  // add object to next position
		var thisIndex = getValue(this.id.vars["length"], "int");
		this.id.vars[getValue(vars[0])] = vars[1];
		this.id.vars["length"] = dateCreator["int"](thisIndex+1);
		return null;
	}
	var_Tdictionary.func["_setitem"] = function(vars, global){  // [?] = 
		if(getValue(vars[0]) == "") { 
			global.errorOcured = true;
			return dateCreator["IndexError"]("index is undefined");
		}
		this.id.vars[getValue(vars[1])] = vars[0];
		return true;
	}
	var_Tdictionary.func["_getitem"] = function(vars, global){
		var index = getValue(vars[0]);
		if(typeof this.id.vars[index] == "undefined"){
			global.errorOcured = true;
			return dateCreator["IndexError"]("index '"+index+"' is out of range");
		}
		return this.id.vars[index];
	}
		
	return var_Tdictionary;
}

function var_type_object(){
	var var_Tobject = var_type();
	var_Tobject.type = "object";
	
	var_Tobject.func["_init"] = function(vars, global){
		this.id.vars["container"] = vars;
	}
	var_Tobject.func["_string"] = function(vars, global){
		global.errorOcured = true;
		return dateCreator["SyntaxError"]("Not implemented");
	}
	
	return var_Tobject;
}

function var_type_function(){
	var var_Tfunction = var_type();
	var_Tfunction.type = "function";
	
	var_Tfunction.func["_init"] = function(vars, global){
		this.id.vars["name"] = vars[0][0];
		this.id.vars["args"] = vars[0][1];
		this.id.vars["code"] = vars[0][2];
	}
	var_Tfunction.func["_string"] = function(vars, global){
		return dateCreator["string"]("<function "+this.id.vars["name"]+">");
	}
	var_Tfunction.func["_call"] = function(vars, global){
		var savevar = $.extend( {}, global.variables );
		
		var vrsname = this.id.vars["args"].split(",");
		for(var i=0;i<vrsname.length;i++){
			vrsname[i] = vrsname[i].trim();
			if(typeof vars[i] != "undefined")
				global.variables[vrsname[i]] = vars[i];
			else
				global.variables[vrsname[i]] = dateCreator["null"]();
		}
		
		var _global = var_type();
			_global.id = this.id;
			_global.type = "object";
			_global.func["_get"] = function(vars, global){
				return this.id.vars["name"];
			}
			_global.func["_getitem"] = function(vars, global){  // [?]
				vars[0] = getValue(vars[0]);
				console.log(vars[0]);
				console.log(savevar);
				if(typeof savevar.variables[vars[0]] == "undefined"){
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
				return savevar.variables[vars[0]];
			}
			_global.func["_getattr"] = function(vars, global){
				var name = getValue(vars[0]);
					
				if(typeof savevar.variables[name] != "undefined"){
					return savevar.variables[name];
				}else{
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
			}
			_global.func["_setattr"] = function(vars, global){
				var name = getValue(vars[0]);
					
				try{
					savevar[name] = vars[1];
					global.variables[name] = vars[1];
					return global.variables["true"];
				}catch(e){
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
			}
			_global.func["type"] = function(vars, global){ return "object"; }
		global.variables["$"] = _global;
		
		var _local_pyr = new Pyr(global.terminal);
		_local_pyr.variables = global.variables;
		
		vratm = _local_pyr.compile(this.id.vars["code"], "", 0, 0, true);
		
		global.variables = $.extend( {}, savevar );
		global._parent = _local_pyr;
		
		return vratm;
	}
	
	return var_Tfunction;
}

/*
DEFINE CLASS
*/
function var_type_class(){
	var var_Tclass = var_type();
	var_Tclass.type = "class";
	
	var_Tclass.func["_init"] = function(vars, global){
		this.id.vars["name"] = vars[0][0];
		this.id.vars["args"] = vars[0][1];
		this.id.vars["code"] = vars[0][2];
	}
	var_Tclass.func["_string"] = function(vars, global){
		return dateCreator["string"]("<function "+this.id.vars["name"]+">");
	}
	var_Tclass.func["_call"] = function(vars, global){
		var savevar = $.extend( {}, global.variables );
		
		var _global = var_type();
			_global.id = this.id;
			_global.type = "object";
			_global.func["_get"] = function(vars, global){
				return this.id.vars["name"];
			}
			_global.func["_getitem"] = function(vars, global){  // [?]
				vars[0] = getValue(vars[0]);
				console.log(vars[0]);
				console.log(savevar);
				if(typeof savevar.variables[vars[0]] == "undefined"){
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
				return savevar.variables[vars[0]];
			}
			_global.func["_getattr"] = function(vars, global){
				var name = getValue(vars[0]);
					
				if(typeof savevar.variables[name] != "undefined"){
					return savevar.variables[name];
				}else{
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
			}
			_global.func["_setattr"] = function(vars, global){
				var name = getValue(vars[0]);
					
				try{
					savevar[name] = vars[1];
					global.variables[name] = vars[1];
					return global.variables["true"];
				}catch(e){
					global.errorOcured = true;
					return dateCreator["IndexError"]("index '"+vars[0]+"' is undefined");
				}
			}
			_global.func["type"] = function(vars, global){ return "object"; }
		global.variables["$"] = _global;
		
		var _local_pyr = new Pyr(global.terminal);
		_local_pyr.variables = global.variables;
		
		vratm = _local_pyr.compile(this.id.vars["code"], "", 0, 0, true);
		
		global.variables = $.extend( {}, savevar );
		global._parent = _local_pyr;
		
		return vratm;
	}
	
	return var_Tfunction;
}

function getVal(vars, global){
	var type = global.getType(vars);
	if(type != "variable")
		vars = global.createVar(vars);
	else
		vars = global.execute(vars);
	return vars;
}

function getValue(vars, type, global){
	_return = vars;
	_stop = false;
	
	if(typeof type == "undefined")
		type = "string";
	else if(type == "")
		type = "string";
	if(typeof vars == "undefined" || vars == "" || vars == null){
		_return = new dateCreator["null"]();
		_stop = true;
	}
	else if(typeof vars != "object"){
		var d = new Date();
		var n = d.toLocaleTimeString();
		if(typeof global != "undefined")
			vars = global.createVar(vars);
		else{
			_return = vars;
			_stop = true;
		}
	}
	
	if(type == "string"){ jak = "_string"; }else{ jak = "_"+type; }
	
	if(!_stop){
		if(typeof vars.vars != "undefined"){
			if(typeof vars.vars["value"] != "undefined"){
				if(typeof vars.vars["value"].value != "undefined"){
					var vl = ""+vars.vars["value"].value, noS = false, nvl = "";
					for(i=0;i<vl.length;i++){ zn = vl.charAt(i);zq = vl.charAt(i+1); if(zn == "\\" && zq != "n" && zq != "r"){noS = true;}else if(zn == "\"" && noS == false){ }else{ nvl+=zn; } }
					_return = nvl;
				}
			}else if(typeof vars.func[jak] != "undefined"){
				_return = vars.func[jak](new Array(), global);				
			}
		}else if(typeof vars.func == "undefined"){
			if(typeof vars.value != "undefined")
				_return = getValue(dateCreator[type](vars.value));			
		}else if(typeof vars.func[jak] != "undefined"){
			if(type == "string"){
				_return = vars.func[jak](new Array(), global);
			}
			_return = vars.func[jak](new Array(), global);
		}
	}
	if(typeof _return == "object"){
		if(typeof _return.isError != "undefined")
			return _return;
		return getValue(_return, type, global);
	}
	if(type == "int") _return = parseInt(_return);
	if(type == "float") _return = parseFloat(_return);
	return _return;
}

function getType(text){
	if(typeof text == "object")
		return text.type;
	var i = 0;
	type = "int";
	onlynumber = true;
	
	text = ""+text; //String it!
	if(text == "") return "null";
	
	if(text.substring(0,1) == "\"")
		return "string";
	
	if(text.substr(text.length-1,1) == "]" && text.indexOf("[") != -1)
		return "list";
	if(text.substr(text.length-1,1) == "}" && text.indexOf("{") != -1)
		return "dictionary";
	
	bots = 0;
	while(i < text.length){
		le = text.substring(i,i+1);
		
		if(onlynumber){
			if(le == "0" || le == "1" || le == "2" || le == "3" || le == "4" || le == "5" || le == "6" || le == "7" || le == "8" || le == "9" || le == "-" || le == '+'){
				//Number
			}else if(le == "." && bots == 0){
				type = "float";
				bots++;
			}else if(type != "string"){
				onlynumber = false;
				type = "variable";
			}
		}else{
			if(le == " "){
				type = "string";
			}
		}
			
		i+=1;
	}
		
	return type;
}

function getFunct(vars, funct, args, global){
	if(typeof vars == "undefined")
		return getValue(new dateCreator["null"]());
	
	if(typeof vars.func != "undefined"){
		return vars.func[funct](args, global);
	}else{
		return getValue(new dateCreator["null"]());
	}
}

// Default date type definition
var dateType = {};
dateType["null"] 		= var_type_null;
dateType["int"] 		= var_type_int;
dateType["float"] 		= var_type_float;
dateType["string"]		= var_type_string;
dateType["list"]		= var_type_list;
dateType["dictionary"]	= var_type_dictionary;
dateType["function"]	= var_type_function;
dateType["class"]		= var_type_class;

/*Canvas*/
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();
createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}
dateType["Canvas"] = function(){
	var var_Tcanvas = var_type();
	var_Tcanvas.type = "canvas";
	var_Tcanvas.vars["error"] = dateCreator["null"]();
	var_Tcanvas.ctx;
	
	var_Tcanvas.func["_init"] = function(vars, global){
		$("#container").html("");
		var c = createHiDPICanvas(window.innerWidth, window.innerHeight);
		$("#container").append(c);
		this.ctx = c.getContext("2d");
		this.ctx.fillStyle = "#000";
		this.ctx.font = "12px Arial";
		this.id.vars["initialized"]  = global.variables["true"];
		this.id.vars["canvas"] = this.ctx;
		this.id.vars["fillStyle"] = dateCreator["string"]("#FFF");
		this.id.vars["font"] = dateCreator["string"]("30px Arial");
	}
	var_Tcanvas.func["getError"] = function(vars, global){
		return this.id.vars["error"];
	}
	var_Tcanvas.func["_int"] = function(vars, global){
		return new PValue(0);
	}
	var_Tcanvas.func["_string"] = function(vars, global){
		return dateCreator["string"]("<object Canvas>");
	}
	var_Tcanvas.func["_set"] = function(vars, global){
		this.ctx[vars[0]] = getValue(vars[1]);
		this.id.vars[vars[0]] = vars[1];
		return;
	}
	//fillText("Hello World",10,50);
	var_Tcanvas.func["fillText"] = function(vars, global){
		this.id.vars["canvas"].fillText(getValue(vars[0]),getValue(vars[1]),getValue(vars[2]));
		return;
	}
	//fillRect(0,0,150,75);
	var_Tcanvas.func["fillRect"] = function(vars, global){
		this.id.vars["canvas"].fillRect(getValue(vars[0]),getValue(vars[1]),getValue(vars[2]),getValue(vars[3]));
		return;
	}
	
	return var_Tcanvas;
}

var library = new Array();
	
dateType["Library"] = function(){
	var var_Tlibrary = var_type();
	var_Tlibrary.type = "library";
	var_Tlibrary.functionJS = null;
	var_Tlibrary.finish = true;
	
	var_Tlibrary.func["_init"] = function(vars, global){
		this.id.librarc = library.length;
	}
	var_Tlibrary.func["load"] = function(vars, global){
		window.open = window.open_;
		this.id.librarc = library.length;
		this.id.vars["name"] = vars[0];
		var nameOfLibrary = getValue(vars[0]);
		library[library.length] = nameOfLibrary;
		var can = true;
		

		global._wait_finis = true;
		var _lib_id_ = this.id, _global = global;
		$.getScript( nameOfLibrary ).done(function( script, textStatus ) {
			_lib_id_.vars["state"] = dateCreator["string"](textStatus, global);
			var mn = nameOfLibrary.replace(".js","").toUpperCase();
				
			if(typeof window["__"+mn] != "undefined"){
				//_global.func["print"](new Array(dateCreator["string"]("DEBUG: Success Loaded library "+mn,_global)));
				_lib_id_.functionJS = new window["__"+mn]();
			}else{
				//_global.func["print"](new Array(dateCreator["string"]("DEBUG: Failed Loaded library "+mn,_global)));
			}
			_global._wait_finis = false;
		}).fail(function( jqxhr, settings, exception ) {
			//_global.throwError(exception, 0, 0, "", "");
			//_global.throwError("OSError: Can't import library \""+nameOfLibrary+"\"", 0, 0, "", "");
			_global._save_last_error = dateCreator["IOError"]("Library \""+nameOfLibrary+"\" not a found!");
			_global._wait_finis = false;
		});
		
		return global._TYPE_SYNC;
	}
	var_Tlibrary.func["call"] = function(vars, global){
		
		var nameOfFunction = getValue(vars[0]);
		try{
			var uarr = new Array();
			for (index = 1; index < vars.length; index++) {
				uarr[index-1] = getValue(vars[index]);
			}
			var exui = this.id.functionJS[nameOfFunction](uarr);
			if(exui == null){
				return dateCreator["null"]("", global);
			}else if(typeof exui == "object"){
				return exui;
			}else if(typeof exui == "string"){
				return dateCreator["string"](exui, global);
			}else{
				return dateCreator["int"](exui, global);
			}
		}catch(e){
			console.log(e);
			global.errorOcured = true;
			return dateCreator["JSError"](e);
		}
		//return new PValue(this.id.librarc);
	}
	var_Tlibrary.func["_int"] = function(vars, global){
		return new PValue(this.id.librarc);
	}
	var_Tlibrary.func["_string"] = function(vars, global){
		return dateCreator["string"]("<Library "+this.id.librarc+">");
	}
	var_Tlibrary.func["_set"] = function(vars, global){
		this.id.vars[vars[0]] = vars[1];
		return;
	}
	
	return var_Tlibrary;
}

// Default constructors
var dateCreator = {}
dateCreator["null"] 	 = function(){ 					var vars = dateType["null"](); 		args = new Array();						vars.func["_init"](args); 			return vars; }
dateCreator["int"] 		 = function(value, global){ 	var vars = dateType["int"](); 		args = new Array();args[0] = value; 	vars.func["_init"](args, global); 	return vars; }
dateCreator["float"] 	 = function(value){ 			var vars = dateType["float"](); 	args = new Array();args[0] = value; 	vars.func["_init"](args); 			return vars; }
dateCreator["string"] 	 = function(value){ 			var vars = dateType["string"](); 	args = new Array();args[0] = value;		vars.func["_init"](args); 			return vars; }
dateCreator["list"] 	 = function(value, global){ 	var vars = dateType["list"](); 		args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["dictionary"]= function(value, global){ 	var vars = dateType["dictionary"]();args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["function"]  = function(value, global){ 	var vars = dateType["function"](); 	args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["class"] 	 = function(value, global){ 	var vars = dateType["class"](); 	args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["Canvas"] 	 = function(value, global){ 	var vars = dateType["Canvas"](); 	args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["Library"] 	 = function(value, global){ 	var vars = dateType["Library"](); 	args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
//Errors
function var_type_Error(type){
	var var_TSyntaxError = var_type();
	var_TSyntaxError.type = type;
	var_TSyntaxError.isError = true;
	
	var_TSyntaxError.func["_init"] = function(vars, global){
		error 	= getValue(vars[0]);
		line 	= getValue(vars[1]);
		pos 	= getValue(vars[2]);
		file	= getValue(vars[3]);
		tline	= getValue(vars[4]);
		
		mezera = "";
		for(var i=0;i<pos;i+=1){
			mezera+=" ";
		}
		
		if(getValue(vars[2])=="null" || vars[2] == null)
			this.id.vars["text"]= new dateCreator["string"](error);
		else
			this.id.vars["text"]= new dateCreator["string"](error+"\\n  "+tline+"\\n  "+mezera+"^\\nOn line "+line+" at position "+pos+" in file "+file);
		this.id.vars["error"]  	= new dateCreator["string"](error);
		this.id.vars["line"] 	= new dateCreator["int"](line);
		this.id.vars["pos"] 	= new dateCreator["int"](pos);
		this.id.vars["file"] 	= new dateCreator["string"](file);
		this.id.vars["tline"] 	= new dateCreator["string"](tline);
	}

	var_TSyntaxError.func["_string"] = function(vars, global){
		return getValue(this.id.vars["text"]);
	}
	
	return var_TSyntaxError;
}
dateType["Error"] 					= var_type_Error;

dateCreator["SyntaxError"] 			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("SyntaxError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }				
dateCreator["NameError"] 			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("NameError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["NotImplemented"] 		= function(error,line,pos,file,tline){  var vars = dateType["Error"]("NotImplemented"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["FunctionMissing"]		= function(error,line,pos,file,tline){  var vars = dateType["Error"]("FunctionMissing"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ZeroDivisionError"]	= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ZeroDivisionError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ValueError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ValueError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["UnsuportedOperator"]	= function(error,line,pos,file,tline){  var vars = dateType["Error"]("UnsuportedOperator"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ConvertError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ConvertError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["TypeError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("TypeError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["IndexError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("IndexError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["InternalError"]		= function(error,line,pos,file,tline){  var vars = dateType["Error"]("InternalError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["OSError"]				= function(error,line,pos,file,tline){  var vars = dateType["Error"]("OSError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["JSError"]				= function(error,line,pos,file,tline){  var vars = dateType["Error"]("JSError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["IOError"]				= function(error,line,pos,file,tline){  var vars = dateType["Error"]("IOError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["EOFError"]				= function(error,line,pos,file,tline){  var vars = dateType["Error"]("EOFError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["EOLError"]				= function(error,line,pos,file,tline){  var vars = dateType["Error"]("EOLError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }