<script>
function math(text){
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
			"==": "_equal"
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
			buffer = "";
		var pos = 0, doubl = false;
		
		for (var act in operace[key]) {
			actualchars[pos] = act;
			pos++;
		}
	
		var num1 = "", num2 = "";
		var buff = "";
		
		for(var a = 0;a < vstup.length;a++){
			var chr = vstup.substring(a,a+1),
				ch2 = vstup.substring(a,a+2);
			var pro = false;
			
			for(var i = 0;i < pos;i++){
				if(actualchars[i].length > 1)
					chr = vstup.substring(a,a+actualchars[i].length);
				
				if(chr == actualchars[i]){
					if(actualchars[i].length > 1)
						a++;
					
					pro = true;
					
					if(lastoperator != ""){
						num2 = buff.trim();
						
						vysledek = ""+num1+""+lastoperator+""+num2+"";
						console.log("COUNTING: "+num1+""+lastoperator+""+num2);
						
						vystup+= vysledek;
					}else{
						num1 = buffer.trim();
					}
					lastoperator = chr;
					//console.log(lastoperator+", n1: "+num1+"; n2:"+num2);
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
					buffer = chr;
				}
				
				if(lastoperator != ""){
					num2 = buffer.trim();
					
					vysledek = ""+num1+""+lastoperator+""+num2+"";
					console.log("COUNTING: "+num1+""+lastoperator+""+num2);
					
					vystup+= vysledek+""+operwi+"";
				}else{
					vystup+= buffer.trim() +""+ operwi+"";
				}
				lastoperator = "";
				buffer="";
			}
			else if(!pro){
				buffer+=chr;
			}
		}
		console.log(vystup);
	}
}
console.log("1+5 == 6");
math("2*3+5 == 6");
</script>