//////////////////////////////////////////////////////////////////////////////////////////
//																						//
// PYR VER 0.1 (JS)																		//
// Create by Natsu (Jakub Teichmann)  													//
// Last official chnanged: 21.06.2016													//
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

var thread = 0;

var Pyr = function(terminal){
	this.terminal = terminal;
	this.variables = {};
	this.patch = new Array();
	this.func = {}
	this.errorOcured = false;
	this._thread_stoped = false;
	this._thread_id = thread++;
	this._thread_ticks = 0;
	
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
	//Variables
	vars["true"]  = new dateCreator["int"]("1");
	vars["false"] = new dateCreator["int"]("0");
	vars["null"] = new dateCreator["null"]();
	
	var _this = var_type();
		_this.id = this;
		_this.type = "object";
		_this.func["_get"] = function(vars, global){
			console.log(this.id.id.variables);
			return "N00L";
		}
		_this.func["_string"] = function(vars, global){
			var ret  = "";
			for (var prop in this.id.id.variables) {
				if(prop == "id" || prop == "this") continue;
				
				val = getValue(this.id.id.variables[prop]);
				if(this.id.id.variables[prop].type == "string") val = "\""+val+"\"";
				
				if(ret == "")
					ret+="\""+prop+"\" => "+val+"";
				else
					ret+=", \""+prop+"\" => "+val+"";
			}
			return "( "+ret+" )";
		}
		_this.func["_getitem"] = function(vars, global){  // [?]
			vars[0] = getValue(vars[0]);
			if(typeof this.id.id.variables[vars[0]] == "undefined"){
				global.errorOcured = true;
				return dateCreator["IndexError"]("index '"+vars[1]+"' is undefined");
			}
			return this.id.id.variables[vars[0]];
		}
	vars["this"] = _this;
}
var ErrorOcured=false;

Pyr.prototype = {
	compile: function(code, filename, si, poii){		
		this.errorOcured = false;
		this._thread_ticks++;
		var action = "",
			ptype = "",
			type = "",
			excode = code+"\n",
			i = 0,
			mam = "",
			open = false,
			_thread_call_agan = false,
			_thread_call_save_pos = 0,
			save_as_id = 0,
			close_expresion_at = "",
			save_expresion = "",
			expresion_state = -1,
			_time_ = 0,
			ltype = "";
			
		if(typeof poii == "undefined") poii = 0;
		if(typeof si != "undefined") i = si;
		var radek = 1, xa = 1;
		
		while(i < excode.length){
			this.errorOcured = false;
			if(excode.length-1 == i) _end_code = true; else _end_code = false;
			le = excode.substring(i,i+1);
			mame = mam+le;
			
			if(close_expresion_at != "" && close_expresion_at != le && ptype != ""){
				mam+=le;
			}
			else if(le == "\""){
				open = !open;
				mam+="\"";
			}
			else if(open){
				if(_end_code){
					this.errorOcured = true;
					this.throwError("EOL while scanning string", radek, xa, mam);
					//vrat = dateCreator["SyntaxError"]("EOL while scanning string", pline, i, filename, excode);
					mam="";
					break;
				}
				mam+=le;
			}
			else if(le == "#" && type == ""){
				type = "defined";
			}else if(le == "\n" && type == "defined"){
				var exp = mam.split(" ");
				if(exp[0] == "debug"){
					msg = mam.substr(exp[0].length+1);
					logit(msg, 'warning_msg');
				}else if(mam == "top"){
					_thread_call_save_pos = 0;
					_thread_call_agan = true;
					i = excode.length;
				}
				mam = "";
				type = "";
				ptype = "";
				radek++;
				xa=1;
			}else if(le == "}"){
				if((expresion_state && ptype == "if") || (!expresion_state && ptype == "else") || (expresion_state && ptype == "while")){
					//this.execute(mam, filename);
					this.compile(mam,filename,0,radek);
					
					if(ptype == "while"){
						var threa = 0;
						var expresion = this.execute(save_expresion);
						while(getValue(expresion, "int", this) == 1 && threa < 1000){
							this.compile(mam,filename,0,radek);
							expresion = this.execute(save_expresion);
							console.log(getValue(this.execute("a;")),"int",this);
							threa++;
						}
						if(threa == 1000) {
							this.throwError("Loop: Never eneded loop!", radek+poii, xa, save_expresion);
							i=excode.length;
							break;
						}
					}
					
					close_expresion_at = "";
					mam = "";
					ltype = ptype;
					ptype = "";
				}else{
					close_expresion_at = "";
					mam = "";
					ptype = "";
				}
				/*
				if(ptype == "else") { expresion_state = -1; ptype = ""; close_expresion_at = ""; }
				if(ptype == "if") ptype = "else"; else ptype = "";
				*/
			}else if(le == "\n" || le == ";"){
				if(mam != "" && le == "\n"){
					if(ptype == ""){
						i = excode.length;
						this.throwError("SyntaxError: You can't write new line in code!", radek+poii, xa, mam);
					}
				}
				if(mam.trim() != ""){
					var doit = false;
					if(close_expresion_at == '\n'){
						if((expresion_state && ptype == "if") || (!expresion_state && ptype == "else")){
							console.log(ptype+"[\\n] -> "+mam);
							doit=true;
						}
						close_expresion_at = "\n";
						if(ptype == "else") { expresion_state = -1; ptype = "";close_expresion_at = ""; }
						if(ptype == "if") ptype = "else"; else ptype = "";
					}else if(close_expresion_at != "}"){
						if((expresion_state && ptype == "if") || (!expresion_state && ptype == "else")){
							doit=true;
							close_expresion_at = "\n";
							if(ptype == "else") { expresion_state = -1; ptype = ""; }
							if(ptype == "if") ptype = "else"; else ptype = "";
						}else if(ptype == "" && mam.trim() != ""){
							doit=true;
						}
					}
					if(doit){
						var executed = this.execute(mam, filename);
						if(ptype == ""){
							if(this.isError()){
								i = excode.length;
								this.throwError((executed.func["type"]())+": "+getValue(executed.vars["error"]), radek+poii, xa, mam);
							}
						}
					}
				}
				mam = "";
				if(le == "\n"){
					radek++;
					xa=1;
				}
			}else if(le == " " && type == ""){
				if(mam != "")
					mam+=" ";
			}else if(mame.trim() == "else"){
				if(ltype != "if"){
					i = excode.length;
					this.throwError("SyntaxError: Unexpected token else", radek+poii, xa, mame);
				}
				ptype = "else";
				close_expresion_at = "";
				mam = "";
			}else if(le == "(" && type == ""){
				if(mam == "if"){
					ptype = type;
					type = "if";
					mam = "";
				}else if(mam == "while"){
					ptype = type;
					type = "while";
					mam = "";
				}else 
					mam+=le;
			}else if(le == ")"){
				if(type != ""){
					close_expresion_at = "";
					save_expresion = mam;
					var expresion = this.execute(save_expresion);
					
					save_line = i+1;
					
					if(getValue(expresion, "int", this) == 1){
						expresion_state = true;
					}else{
						expresion_state = false;
					}
					
					ptype = type;
					ltype = type;
					mam = "";
					type = "";
				}else{
					mam+=")";
				}
			}else{
				if((ptype == "if" || ptype == "else" || ptype == "while") && le == "{"){
					close_expresion_at = "}";
					
					console.log(close_expresion_at);
					
					mam = "";
				}else if((ptype == "if" || ptype == "else" || ptype == "while") && le != " "){
					close_expresion_at = "\n";
					
					console.log(close_expresion_at);
					
					mam+=le;
				}else
					mam+=le;
			}
			i++;
			xa++;
			_time_++;
			
			if(this.errorOcured){
				this.throwError((executed.func["type"]())+": "+getValue(executed.vars["error"]), 0, 0, "");
			}
		}
		
		if(_thread_call_agan && !this._thread_stoped){
			var _this = this, _code = code, _filename = filename;
			setTimeout(function(){_this.compile(_code, _filename, _thread_call_save_pos);}, 1);
		}else{
			if(poii == 0){
				logit("Program ended at "+(Math.round((_time_/99)*10)/10)+"s", 'info_msg');
				setTimeout(function(){stoped();}, 1);
			}
		}
	},
	throwError: function(error, line, at, what){
		var tmi = Date.now();
		if(typeof what == "undefined")
			logit("<div style='float:right;'>(<a href='#' onClick='selectIn(this);return false;'>"+line+":"+at+"</a>)</div>"+error, 'error_msg');
		else{
			logit("<div style='float:right;'>(<a href='#' onClick='selectIn(this);return false;'>"+line+":"+at+"</a>)</div><div class=expand onClick=\"expand("+tmi+");return false;\">"+error+"</div><div style='display: none;color: #2D2D2D;margin-left: 17px;padding-left: 5px;margin-top: 3px;border-left: 2px solid #7B7B7B;' id='id_error_exp_"+(tmi)+"'>"+what+"</div>", 'error_msg');
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
		excode = code,
		varcom = "",
		fullname = "",
		savenamvar = "",
		vrat = "null",
		builder = "",
		nofucntionnow = false;
		notBeVarButFunc = false,
		myActionAft = "";
		if(typeof filename == "undefined") filename = "<console>";
		if(typeof pline == "undefined") pline = 1;
		
		var znak = excode.substring(0,1);
		if(znak == "-" || znak == "+"){
			nofucntionnow = true;
		}
		
		normal = excode;
		if(excode.substring(excode.length-1,excode.length) != ";")
			excode+=";";
		else{
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
					vrat = dateCreator["SyntaxError"]("EOL while scanning string", pline, i, filename, excode);
					mam="";
					break;
				}
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
				}else if(le == "." && !nofucntionnow){
					if(this.getType(mam) == "int"){
						mam+=".";
					}else if(this.getType(mam) == "float"){
						this.errorOcured = true;
						vrat = dateCreator["SyntaxError"]("unexpected EOF while parsing", pline, i+1, filename, excode);
						mam="";
						break;
					}else{
						if(!notBeVarButFunc){
							canbeit = false;
							
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
				}else if(le == "(" && !nofucntionnow){
					savenamvar = mam;
					mam = "";					
				}else if(le == ")" && !nofucntionnow){
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
								vrat = dateCreator["SyntaxError"]("class '"+savenamvar.substring(4)+"' is not defined", pline, i-(savenamvar.length)-1-(mam.length), filename, excode);
								mam="";
								break;
							}
						}else{
							fullname = savenamvar;
							if(typeof this.func[savenamvar] != "undefined"){	
								var getvrat = this.func[savenamvar](this.makeArgs(mam));
								if(typeof getvrat != "undefined")
									if(getvrat.type != "null")
										return getvrat;
								canbeit = true;	
							}
						}
					}else if(typeof varcom.body[savenamvar] != "undefined"){
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
						if(mam.indexOf('-') > 0 || mam.indexOf('+') > 0 || mam.indexOf('/') > 0 || mam.indexOf('*') > 0 || mam.indexOf('%') > 0 || mam.indexOf('==') > 0 || mam.indexOf('!=') > 0){
							if((le == '-' || le == '+' || le == '/' || le == '*' || le == '%' || le == "==" || le == "!=") && i == excode.length-1){
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
						vrat = null;
						args[argc] = mam.trim();argc++;
						mam = "";
						
						ret = this.priAction(acttype, args);
						vrat = null;
						if(this.errorOcured){
							vrat = ret;
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
			var operace = {
				1: {
					"*": "_mul",
					"/": "_div",
					"%": "_mod"
				},
				2: {
					"+": "_add",
					"-": "_sub"
				},
				3: {
					"==": "_eq",
					"!=": "_ine"
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
						buffer+="\"";
						a++;
						chr = vstup.substring(a,a+1);
						ch2 = vstup.substring(a,a+2);
					}else if(open == true){
						if(chr == "\\"){
							a++;
							chr = vstup.substring(a,a+1)
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
									num2 = buff.trim();
									
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
												
									var argu = new Array();
									argu[0] = cislo2;
												
									var vysledek = cislo1.func[fnc](argu, this);
									if(this.errorOcured){ return vysledek; }
									
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
												
								var argu = new Array();
								argu[0] = cislo2;
												
								var vysledek = cislo1.func[fnc](argu, this);
								if(this.errorOcured){ return vysledek; }
								
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
				//args[0].vars[args[1]] = args[2];
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
					locVariable = locVariable.func["_setitem"](new Array(args[1], parseInt(index)), this);
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
	makeArgs: function(args){
		mam  = "";
		open = false;
		var vars = new Array();
		
		for(var i=0;i<args.length; i+=1){
			le = args.substring(i,i+1);
			
			if(open && le == "\""){
				open = false;
				mam = mam.trim();
				if(i == args.length-1){
					vars[vars.length] = mam+"\"";
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
					if(this.getType(mam) == "string")
						vars[vars.length] = mam;
					else
						vars[vars.length] = getValue(this.execute(mam));
					mam="";
				}else{
					mam+=le;
				}
			}	
		}
		
		for(var i=0;i<vars.length; i+=1){
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
	var_Tobject.func["_radd"] 		= function(vars, global){ }; // +
	var_Tobject.func["_rsub"] 		= function(vars, global){ }; // -
	var_Tobject.func["_rmul"] 		= function(vars, global){ }; // *
	var_Tobject.func["_rfloordiv"] 	= function(vars, global){ }; // //
	var_Tobject.func["_rdiv"] 		= function(vars, global){ }; // /
	var_Tobject.func["_rmod"] 		= function(vars, global){ }; // %
	var_Tobject.func["_rpow"] 		= function(vars, global){ }; // **
	var_Tobject.func["_rlshift"] 	= function(vars, global){ }; // <<
	var_Tobject.func["_rrshift"] 	= function(vars, global){ }; // >>
	var_Tobject.func["_rand"] 		= function(vars, global){ }; // &
	var_Tobject.func["_ror"] 		= function(vars, global){ }; // |
	var_Tobject.func["_rxor"] 		= function(vars, global){ }; // ^	
	
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
	var_Tobject.func["_getitem"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["TypeError"]("'"+this.id.type+"' class does not support items"); }; // []
	var_Tobject.func["_setitem"] 	= function(vars, global){ global.errorOcured = true;return dateCreator["TypeError"]("'"+this.id.type+"' class does not support item assignment"); }; // [] =
	var_Tobject.func["_delitem"] 	= function(vars, global){ };
	var_Tobject.func["_contains"] 	= function(vars, global){ }; // kolo in auto
	var_Tobject.func["_missing"] 	= function(vars, global){ }; // kolo not in auto
	var_Tobject.func["_call"] 		= function(vars, global){ };
	
	var_Tobject.func["_get"] 		= function(vars, global){ }; // Delete maybe...
	var_Tobject.func["_set"] 		= function(vars, global){ this.id.vars[vars[0]] = vars[1]; }; // Update value
	//functions
	var_Tobject.func["type"] 		= function(vars, global){ return this.id.type; };
	
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
		return dateCreator["string"](this.id.vars["value"].value);;
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
		
	return var_Tint;
}

function var_type_float(){
	var var_Tfloat = var_type();
	var_Tfloat.type = "float";
	
	var_Tfloat.func["_init"] = function(vars, global){
		var value = getValue(vars[0])+"";
		if(value.indexOf("e") == -1)
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
	//
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
		
	return var_Tfloat;
}

function var_type_null(){
	var var_Tnull = var_type();
	var_Tnull.type = "null";
	
	var_Tnull.func["_init"] = function(vars, global){
		this.id.vars["value"]  = new PValue("null");
	}
	var_Tnull.func["_int"] = function(vars, global){
		return new PValue(0);
	}
	var_Tnull.func["_string"] = function(vars, global){
		return new PValue("null");
	}
	var_Tnull.func["_eq"] = function(vars, global){  // ==
		if(this.id.type == vars[0].type || getValue(getFunct(vars[0], "_int", new Array(), global),"int") == 0)
			return 1;
		else
			return 0;
	}
	var_Tnull.func["_ine"] = function(vars, global){  // !=
		if(this.id.type != vars[0].type && getValue(getFunct(vars[0], "_int", new Array(), global),"int") != 0)
			return 1;
		else
			return 0;
	}
	
	return var_Tnull;
}

function var_type_string(){
	var var_Tstring = var_type();
	var_Tstring.type = "string";
	
	var_Tstring.func["_init"] = function(vars, global){
		var value = (getValue(vars[0])+"").trim();
		if(value == "") value = getValue(vars[0]);
		
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
			global.errorOcured = true;return dateCreator["TypeError"]("can't multiply list by '"+this.id.type+"' class");
		}
		return parseInt(this.id.vars["value"].value) * getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
	}
	var_Tlist.func["_add"] = function(vars, global){  // +
		return parseInt(this.id.vars["value"].value) + getValue(getFunct(vars[0], "_"+this.id.type, new Array(), global));
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
		
	return var_Tlist;
}

function var_type_object(){
	var var_Tobject = var_type();
	var_Tobject.type = "list";
	
	var_Tobject.func["_init"] = function(vars, global){
		this.id.vars["container"] = vars;
	}
	var_Tobject.func["_string"] = function(vars, global){
		global.errorOcured = true;
			return dateCreator["SyntaxError"]("Not implemented");
	}
	
	return var_Tobject;
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
					for(i=0;i<vl.length;i++){ zn = vl.charAt(i); if(zn == "\\"){noS = true;}else if(zn == "\"" && noS == false){ }else{ nvl+=zn; } }
					_return = nvl;
				}
			}else if(typeof vars.func[jak] != "undefined"){
				_return = vars.func[jak]();
			}
		}else if(typeof vars.func == "undefined"){
			if(typeof vars.value != "undefined")
				_return = getValue(dateCreator[type](vars.value));			
		}else if(typeof vars.func[jak] != "undefined"){
			if(type == "string"){
				_return = vars.func[jak]();
			}
			_return = vars.func[jak]();
		}
	}
	if(typeof _return == "object") return getValue(_return, type);
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
	
	bots = 0;
	while(i < text.length){
		le = text.substring(i,i+1);
		
		if(onlynumber){
			if(le == "0" || le == "1" || le == "2" || le == "3" || le == "4" || le == "5" || le == "6" || le == "7" || le == "8" || le == "9" || le == "-" || le == '+'){
				//Number
			}else if(le == "." && bots == 0){
				type = "float";
				bots++;
			}else{
				onlynumber = false;
				type = "variable";
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
dateType["null"] 	= var_type_null;
dateType["int"] 	= var_type_int;
dateType["float"] 	= var_type_float;
dateType["string"]	= var_type_string;
dateType["list"]	= var_type_list;

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
		return dateCreator["string"]("[object Canvas]");
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

var dateCreator = {}
dateCreator["null"] 	= function(){ 				var vars = dateType["null"](); 		args = new Array();						vars.func["_init"](args); 			return vars; }
dateCreator["int"] 		= function(value){ 			var vars = dateType["int"](); 		args = new Array();args[0] = value; 	vars.func["_init"](args); 			return vars; }
dateCreator["float"] 	= function(value){ 			var vars = dateType["float"](); 	args = new Array();args[0] = value; 	vars.func["_init"](args); 			return vars; }
dateCreator["string"] 	= function(value){ 			var vars = dateType["string"](); 	args = new Array();args[0] = value;		vars.func["_init"](args); 			return vars; }
dateCreator["list"] 	= function(value, global){ 	var vars = dateType["list"](); 		args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }
dateCreator["Canvas"] 	= function(value, global){ 	var vars = dateType["Canvas"](); 	args = new Array();args[0] = value;		vars.func["_init"](args, global); 	return vars; }

//Errors
function var_type_Error(type){
	var var_TSyntaxError = var_type();
	var_TSyntaxError.type = type;
	
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
		
		if(getValue(vars[4])=="null")
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
dateCreator["FunctionMissing"]		= function(error,line,pos,file,tline){  var vars = dateType["Error"]("FunctionMissing"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ZeroDivisionError"]	= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ZeroDivisionError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ValueError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ValueError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["UnsuportedOperator"]	= function(error,line,pos,file,tline){  var vars = dateType["Error"]("UnsuportedOperator"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["ConvertError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("ConvertError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["TypeError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("TypeError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["IndexError"]			= function(error,line,pos,file,tline){  var vars = dateType["Error"]("IndexError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }
dateCreator["InternalError"]		= function(error,line,pos,file,tline){  var vars = dateType["Error"]("InternalError"); args = new Array(); args[0] = error; args[1] = line; args[2] = pos; args[3] = file; args[4] = tline; vars.func["_init"](args); return vars; }