var WindowTitle = document.title;

function NotifView(op){
	if(jak==0){
		selectedDIV = "notificatons";
		if(op!=5){ $("#notificatons").toggle(); }
		$("#nottifSpin").css('display',"inline")
		if($("#notificatons").css('display')=="block"){
			if($("#buttonNotificationOther").css('display')=="none"){ $("#buttonNotificationOther").css('display',"inline");posbut = $("#buttonNotificationOther").offset();$("#buttonNotificationOther").css('display',"none");}
			else{ posbut = $("#buttonNotificationOther").offset();}
			$("#notificatons").offset({ top: (posbut.top+22), left: (posbut.left-400+24)});
			if($("#notificationsText").html()==""){ $("#notificationsText").html("<div style='text-align:center;padding:7px;'>Načítám....</div>"); }
			$.ajax({
				url: notificationaj,
				data: { "jak":jak },
				success: function( data ) {	
					$("#nottifSpin").css('display',"none")
					$("#notificationsText").html("");
					for(i=0;i<data.length;i++){
						if(data[i].Url!=""){ divN="a";style=""; }else{ divN="div";style="cursor:default;"; }
						$("<"+divN+" style='"+style+"' class='notifList "+data[i].Class+"' href='"+data[i].Url+"'><img src='"+data[i].Image+"' class='img'><div class=body><div class='text'>"+data[i].Text+"</div><div class='info'>"+data[i].Info+"</div></div><div style='clear:both;'></div><div style='clear:both;'></div></"+divN+">").appendTo("#notificationsText");
					}		
					if(data.length==0){ $("<div style='text-align:center;padding:7px;'>Žádná notifikace k zobrazení!</div>").appendTo("#notificationsText"); }					
				}
			});
		}
	}else{
		selectedDIV = "notificatons_other";
		if(op!=5){ $("#notificatons_other").toggle(); }
		$("#nottifSpin_other").css('display',"inline")
		if($("#notificatons_other").css('display')=="block"){
			if($("#buttonNotificationOther").css('display')=="none"){ $("#buttonNotificationOther").css('display',"inline");posbut = $("#buttonNotificationOther").offset();$("#buttonNotificationOther").css('display',"none");}
			else{ posbut = $("#buttonNotificationOther").offset();}
			$("#notificatons_other").offset({ top: (posbut.top+22), left: (posbut.left-400+24)});
			if($("#notificationsText_other").html()==""){ $("#notificationsText_other").html("<div style='text-align:center;padding:7px;'>Načítám....</div>"); }
			$.ajax({
				url: notificationaj,
				data: { "jak":jak },
				success: function( data ) {	
					$("#nottifSpin_other").css('display',"none")
					$("#notificationsText_other").html("");
					for(i=0;i<data.length;i++){
						if(data[i].Url!=""){ divN="a";style=""; }else{ divN="div";style="cursor:default;"; }
						$("<"+divN+" style='"+style+"' class='notifList "+data[i].Class+"' href='"+data[i].Url+"'><img src='"+data[i].Image+"' class='img'><div class=body><div class='text'>"+data[i].Text+"</div><div class='info'>"+data[i].Info+"</div></div><div style='clear:both;'></div><div style='clear:both;'></div></"+divN+">").appendTo("#notificationsText_other");
					}		
					if(data.length==0){ $("<div style='text-align:center;padding:7px;'>Žádná notifikace k zobrazení!</div>").appendTo("#notificationsText_other"); }					
				}
			});
		}
	}
}

/*Notification create*/
notifID = 0;
function NotificationCreate(text,desc,href,image){
	if(typeof image!="undefined" && image!="" && image!="undefined")
	{ $("<a class='notifAlert' id='notification_"+notifID+"' style='display:none;' href='"+href+"'><img src='"+image+"' style='float:left;width:50px;height:50px;padding-top: 4px;padding-bottom:4px;padding-right: 6px;'><div class=text>"+text+"</div><div class=info style='padding-left: 50px;'>"+desc+"</div><div style='clear:both;'></div></a>").appendTo("#notificatonsAlert"); }
	else
	{ $("<a class='notifAlert' id='notification_"+notifID+"' style='display:none;' href='"+href+"'><div class=text>"+text+"</div><div class=info>"+desc+"</div></a>").appendTo("#notificatonsAlert"); }
	$("#notification_"+notifID).fadeIn( "slow", function() {} );
	setTimeout(function(bi) { $("#notification_"+bi).fadeOut( "slow", function() {} ); }, 30000, notifID);
	notifID++;
}

function NotificationControl(){
	$.ajax({
			url: notifcountajax,
			data: {},
			success: function( data ) {					
				$("#buttonNotification").html(data.Count);
				$("#buttonNotificationOther").html(data.Notif);
				$("#buttonNotification").css("display","inline");
				if(data.Count>0 || data.Notif>0){ 					
					document.title = "("+(data.Count+data.Notif)+") "+WindowTitle; 
				}else{ 
					document.title = WindowTitle; 
				}
				$("#buttonNotification_count").css("display","block");
				$("#buttonNotification_count").css("top",$("#buttonNotification").offset().top+7);
				$("#buttonNotification_count").css("left",$("#buttonNotification").offset().left+$("#buttonNotification").width()-$("#buttonNotification_count").width()+4);
				
				$("#buttonNotificationOther_count").css("display","block");
				$("#buttonNotificationOther_count").css("top",$("#buttonNotificationOther").offset().top+7);
				$("#buttonNotificationOther_count").css("left",$("#buttonNotificationOther").offset().left+$("#buttonNotificationOther").width()-$("#buttonNotificationOther_count").width()+4);
				
				if($("#buttonNotification_count").attr("jsed")!=1){
					$("#buttonNotification_count").appendTo("body");
					$("#buttonNotification_count").attr("jsed",1)
					$("#buttonNotificationOther_count").appendTo("body");
				}
				if(data.Count>0){
					$("#buttonNotification_count_text").html(data.Count);
				}else{ $("#buttonNotification_count_text").html(data.Count);$("#buttonNotification_count").css("display","none"); }
				if(data.Notif>0){					
					$("#buttonNotificationOther_count_text").html(data.Notif);
				}else{ $("#buttonNotificationOther_count_text").html(data.Notif);$("#buttonNotificationOther_count").css("display","none"); }
			}
		});					
	$.ajax({				
			url: notificationco+"?time="+(timeNot-1000),
			data: {},
			success: function( data ) {		
				for(i=1;i<data.length;i++){
					NotificationCreate(data[i].Text,data[i].Info,data[i].Href,data[i].Image);
				}
				timeNot = data[0].time;
			}
		});	
}

SelectTotal = 1;
function ReplaceSelect(){
	$("select").each(function(i){	
		if($(this).attr("id")!="" && typeof $(this).attr("id")!="undefined" && $(this).css("display")!="none"){
			$(this).attr("parent", 'select__'+SelectTotal);
			if($(this).hasClass("input")){classAdd=" input";_type=2;}else if($(this).hasClass("selinp")){classAdd="";_type=2;}else{classAdd="";_type=1;}
			if($(this).css("width")!=""){au=0;css='width:'+$(this).css("width")+'';width=($(this).css("width")).replace("px","");}else{au=1;css="";width="";}			
			$(this).after('<a class="JS ContextMenu '+classAdd+'" autosize="'+au+'" width="'+width+'" dropdown="select__'+SelectTotal+'_list" data-custom="true" dropdown-open="left" selectType="'+_type+'" onChange="var gu=$(this).attr(\'value_\');console.log(gu);$(\'#'+$(this).attr("id")+'\').val(gu);$(\'#'+$(this).attr("id")+'\').change();" dropdown-absolute="true" id="select__'+SelectTotal+'" style="display:inline-block;'+css+';">'+$($(this).find("option")[0]).html()+'</a>');
			if($('#select__'+SelectTotal).outerWidth() != width){
				width = width - ( $('#select__'+SelectTotal).outerWidth() - width );
				$('#select__'+SelectTotal).css("width", width);
			}			
			if($('select__'+SelectTotal).outerWidth() != width){ width = width - ($('select__'+SelectTotal).outerWidth() - width);$('select__'+SelectTotal).css("width", width); }
			var selectedval = $(this).val();
			var html = "<div class='listDiv' id='select__"+SelectTotal+"_list'><div class='listBox' style='"+css+"'><ul>";
				$(this).find("option").each(function(i){
					if($(this).attr("data-no")!="1"){
						if(typeof $(this).attr("disabled")!="undefined"){ disabled="disabled"; }else{ disabled=""; }
						if(selectedval == $(this).attr("value")){ sel=" sel='1' "; }else{ sel=" "; }
						html+="<li value_='"+$(this).attr("value")+"'"+sel+"class='"+disabled+"'><a>"+$(this).html()+"</a></li>";
					}
				});
			html+= "</ul></div></div>";
			$(this).after(html);
			SelectTotal++;
			$(this).hide();
		}	
	});
}
function SelectRe(id){

}

selectData = new Array();
function ContextMenuList(divi){
				$("#"+divi).find("li").each(function(i){
					if($(this).attr("selx")==1){ 
						$(this).addClass("selx");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);	
						selectData[divi][1].attr("value_",$(this).attr("value_")); 
					}
					$(this).attr("divi",divi);
					$(this).attr("pos",i);
					$(this).click(function(){
						divi = $(this).attr("divi");
						$(this).addClass("selx");
						selectData[divi][0] = $(this).attr("pos");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);					
						selectData[divi][1].attr("value_",$(this).attr("value_"));
						eval("var value_='"+$(this).attr("value_")+"';"+selectData[divi][1].attr("onChange"));
						$("#"+divi).find("li").each(function(i){
							if(selectData[divi][0]!=i){
								$(this).removeClass("selx");
								$(this).removeClass("nos");
								selectData[divi][6] = 1;
								//$(this).addClass("nos");
								//Close!								
							}						
						 });
						 $("#"+selectedDIV).hide();
						 selectedDIV="";
						 selectedBUT.removeClass("selected");
						 selectData[divi][2].keyup();
					});
				});
}
function ContextMenuClickable(){
	$(".ContextMenu").each(function(i)
	{
	if($(this).attr("jsed")==2){
				var divi = $(this).attr("dropdown");
				$("#"+divi).find("li").each(function(i){
					if($(this).attr("selx")==1){ 
						$(this).addClass("selx");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);	
						selectData[divi][1].attr("value_",$(this).attr("value_")); 
					}
					$(this).attr("divi",divi);
					$(this).attr("pos",i);
					$(this).click(function(){
						divi = $(this).attr("divi");
						$(this).addClass("selx");
						selectData[divi][0] = $(this).attr("pos");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);					
						selectData[divi][1].attr("value_",$(this).attr("value_"));
						eval("var value_='"+$(this).attr("value_")+"';"+selectData[divi][1].attr("onChange"));
						$("#"+divi).find("li").each(function(i){
							if(selectData[divi][0]!=i){
								$(this).removeClass("selx");
								$(this).removeClass("nos");
								selectData[divi][6] = 1;
								//$(this).addClass("nos");
								//Close!								
							}						
						 });
						 $("#"+selectedDIV).hide();
						 selectedDIV="";
						 selectedBUT.removeClass("selected");
						 selectData[divi][2].keyup();
					});
				});
				$(this).attr("jsed",1);
	}
	else if($(this).attr("jsed")!=1){
		selectbox_html = $(this).html();
		selectbox = $(this);
		$(this).attr("jsed",1);		
		if(!$(this).hasClass("input") && !$(this).hasClass("noarrow")){ $(this).append(" &#x25bc;"); }
		$(this).click(function(){		
			
			var divi = $(this).attr("dropdown");
			var ope_ = $(this).attr("dropdown-open");
			var abs_ = $(this).attr("dropdown-absolute");	
			var sel_ = $(this).attr("selectType");
			var arow = false;
			
			if($("#"+divi).find(".listBox").length > 0){				
				if($($("#"+divi).find(".listBox")[0]).hasClass("ToolTipMax")){
					arow = true;
					if($($("#"+divi).find(".uprow")[0]).length == 0){
						if(ope_ == "left")
							$('<div class="uprow" style="top:-11px;left:5px;"></div>').insertBefore($($("#"+divi).find("ul")[0]));							
						else
							$('<div class="uprow" style="top:-11px;right:5px;"></div>').insertBefore($($("#"+divi).find("ul")[0]));
					}
				}				
			}			
			if(typeof $(this).attr("disabled") != "undefined")
				return false;
				
			$("#"+divi).css("width",$(window).width()-$("#"+divi).offset().left-20);
			if($("#"+divi).css('display')=="none" && (lastDIVsel!=divi || $(this).find("input").length>0 )){
				pass = false;
				if(  $(this).find("input").length == 0 ){ pass = true; }
				else if( $(this).find("input")[0].value!="" || !$(this).hasClass("input") ){ pass = true; }
				if( pass ){				
				
				$("#"+divi).appendTo("body");
				
				if(arow){ topplus = 10; }else{ topplus = 0; }
				
				if(abs_=="true"){ top_=$(this).offset().top+topplus;left_=$(this).offset().left; }else{ top_=0+topplus;left_=0; }
					//$($("#"+divi).find(".listBox")[0]).css("border-top-left-radius","3px");
					//$($("#"+divi).find(".listBox")[0]).css("border-top-right-radius","3px");
				if(ope_=="right"){
					$("#"+divi).show();
					$("#"+divi).css("top",$(this).offset().top+this.offsetHeight-1+topplus);						
					$("#"+divi).css("left",$(this).offset().left-($($("#"+divi).children(".listBox")[0]).outerWidth()-this.offsetWidth));												
					//$($("#"+divi).find(".listBox")[0]).css("border-top-right-radius","0px");					
				}
				if(ope_=="left"){
					if(  $(this).find("input").length == 0 )
						$("#"+divi).css("top",$(this).offset().top+this.offsetHeight-1+topplus-this.offsetHeight);
					else
						$("#"+divi).css("top",$(this).offset().top+this.offsetHeight-1+topplus);
					$("#"+divi).css("left",$(this).offset().left);
					$("#"+divi).show();
					var bx = $("#"+divi).find(".listBox")[0];
					var he = $(bx).height();
					$(bx).css("height", this.offsetHeight);
					$(bx).animate({height: he+"px"}, 100, function(){ $(bx).css("height", ""); });
					//$($("#"+divi).find(".listBox")[0]).css("border-top-left-radius","0px");
				}	
				if(ope_=="top"){
					$("#"+divi).show();
					$("#"+divi).css("top",$(this).offset().top-($($("#"+divi).children(".listBox")[0]).outerHeight()));
					$("#"+divi).css("left",$(this).offset().left);						
					//$("#"+divi).css("right",$("#"+divi).children(".listBox")[0].offsetWidth);
				}						
				//alert($(this).outerWidth());
				
				$("#"+divi).find("li.sel").each(function(i){
					divi = $(this).attr("divi");										
					parentDiv = $($("#"+divi).find("div")[0]);
					if($(this).position().top < 0){
						parentDiv.scrollTop(parentDiv.scrollTop() + $(this).position().top - 5);	
					}
					if(($(this).position().top - parentDiv.height() + $(this).height()) > 0){
						parentDiv.scrollTop(parentDiv.scrollTop() + ( $(this).height() + ($(this).position().top - parentDiv.height() )) - 5);	
					}					
				});
				
				divi = $(this).attr("dropdown");
				$("#"+divi).css("width",$(window).width()-$("#"+divi).offset().left-20);
			
			
				maxHeight = $($("#"+divi).find("div.listBox")[0]).css("max-height").replace("px","");
			
				if($($("#"+divi).find(".listBox")[0]).outerWidth() <= $(this).outerWidth()){				
					plus = 0;
					if($($("#"+divi).find(".listBox")[0]).outerHeight() > maxHeight ){ plus = 15; }					
					$($("#"+divi).find(".listBox")[0]).css("width", $(this).outerWidth()); 
					var wigh = ($($("#"+divi).find(".listBox")[0]).outerWidth() - $(this).outerWidth());
					if(wigh<0){wigh=0;}					
					$($("#"+divi).find(".listBox")[0]).css("width", $(this).outerWidth()-wigh+plus); 					
				}
												
				if($($("#"+divi).find("ul")[0]).outerHeight() > maxHeight && typeof $("#"+divi).attr("width-new") == "undefined"){					
					var maxwid=0;
					$("#"+divi).find("li").each(function(i){
						if($(this).outerWidth() > maxwid){maxwid=$(this).outerWidth();}
					});				
					$($("#"+divi).find(".listBox")[0]).css("width", maxwid+19); 
					$("#"+divi).attr("width-new", maxwid+19)
					
					var wigh = ($($("#"+divi).find(".listBox")[0]).outerWidth() - $(this).outerWidth());
					if(wigh<0){wigh=0;}					
					$($("#"+divi).find(".listBox")[0]).css("width", $(this).outerWidth()-wigh); 		
				}
				
				if($($("#"+divi).find(".listBox")[0]).outerWidth() == $(this).outerWidth()){
					//$($("#"+divi).find(".listBox")[0]).css("border-top-left-radius","0px");
					//$($("#"+divi).find(".listBox")[0]).css("border-top-right-radius","0px");
				}
				
				$(this).addClass("selected");
				selectedDIV = divi;
				selectedBUT = $(this);
				return false;
				}
			}else{ 
				if(  $(this).find("input").length != 0 ){ 
					if($(this).hasClass("input") && $(this).find("input")[0].value==""){ $("#"+divi).css('display',"none") }
				}else{
					$("#"+divi).css('display',"none");
				}
			}
		
		});
	
		$(this).each(function(i)
		{
			var sel_ = $(this).attr("selectType");			
			var divi = $(this).attr("dropdown");
			selectData[divi] = new Array();
			selectData[divi][0] = 0;
			selectData[divi][3] = 0;
			selectData[divi][1] = $(this);	
			if(sel_=="2"){
				$(this).html("");
				var wid_ = $(this).attr("width");
				if(typeof wid_ == "undefined"){wid_=100;}
				$(this).width(wid_);
				//$(this).html("&#x25bc;");
				
				inputer = document.createElement('input');
				inputer.setAttribute("parent",i);
				inputer.setAttribute("divi",divi);				
				if(selectbox.hasClass("input"))
				{inputer.setAttribute("style","width:"+wid_+"px;padding:0px;");}
				else
				{inputer.setAttribute("style","width:"+(wid_)+"px;padding:0px;margin:0px;");}
				inputer.setAttribute("placeholder",selectbox_html);
				
				$(inputer).keydown(function( event ) {
					if(event.keyCode == 40){
						return false;
					}
					else if(event.keyCode == 13){
						return false;
					}
					else if(event.keyCode == 38){
						return false;
					}
				});
				$(inputer).keyup(function( event ) {
					mam=0;mat="";map=0;maq=0;
					valu_trigged_input  = $(this).val();
					divi = $(this).attr("divi");
					
					if(selectData[divi][6] != 1){ selectData[divi][1].click(); }
					selectData[divi][6]=0;
					
					var callbackfunct = selectData[divi][1].attr("data-callback");
					if(typeof callbackfunct!="undefined" && callbackfunct!=""){
						if(event.keyCode != 40 && event.keyCode != 13 && event.keyCode != 38)
						eval(callbackfunct+"($(this), $(this).val(), '"+divi+"');");
						mam=$("#"+divi).find("li").length;
					}else{
					
					var lijak="";
					if(event.keyCode!=8){lijak=":visible";}
					
					$("#"+divi).find("li").each(function(i){
						value_trigged_list = $(this).find("a")[0].innerHTML;
						if( value_trigged_list.toLowerCase().indexOf( valu_trigged_input.toLowerCase() ) ==-1 ){
							$(this).hide();
						}
						else{ 
							mam++;
							mat = value_trigged_list;
							map = i;
							$(this).show();
							if( value_trigged_list.toLowerCase() ==  valu_trigged_input.toLowerCase() && $("#"+divi).attr("xeter") != "nope"){								
								maq++;
								divi = $(this).attr("divi");
								$(this).addClass("selx");
								selectData[divi][0] = $(this).attr("pos");
								if(event.keyCode>=48 && event.keyCode<=122){ selectData[divi][2].val(value_trigged_list); }
								selectData[divi][1].attr("value_",$(this).attr("value_")); 
								eval("var value_='"+$(this).attr("value_")+"', custom=0;"+selectData[divi][1].attr("onChange"));								
								if(typeof $(this).attr("data-image")!="undefined"){ selectData[divi][1].css("background-image","url("+$(this).attr("data-image")+")"); }
								
								$("#"+divi).find("li"+lijak).each(function(i){
									if(selectData[divi][0]!=i){
										$(this).removeClass("selx");
									}										
								 });		
								
							}else if(value_trigged_list.toLowerCase() ==  valu_trigged_input.toLowerCase()){
								$("#"+divi).attr("xeter","");
							}else{
								$(this).removeClass("selx");
							}
						}													
					});
					
					}
					returnFalse = false;
					if(mam>1){
						var selectDiv = 0;
						okolik=0;
						if(event.keyCode == 40){
							selectData[divi][3]++;
							if(mam<=selectData[divi][3]){ selectData[divi][3]=0; }
						}
						else if(event.keyCode == 38){
							selectData[divi][3]--;
							if(selectData[divi][3]<0){ selectData[divi][3]=mam-1; }
						}
						else if(event.keyCode == 13){
							a=-1;mam____=0;				
							$("#"+divi).find("li"+lijak).each(function(i){								
								divi = $(this).attr("divi");
								if($(this).is(":visible")){
									a++;
								}
								if((selectData[divi][3])==a && mam____==0 && typeof $(this).attr("disabled") == "undefined"  && !$(this).hasClass("disabled")){
									mam____=1;
									$(this).addClass("selx"); 
									selectData[divi][0] = $(this).attr("pos");
									if(typeof $(this).attr("place-text")!="undefined")
										selectData[divi][2].val($(this).attr("place-text"));	
									else
										selectData[divi][2].val($(this).find("a")[0].innerHTML);	
									selectData[divi][1].attr("value_",$(this).attr("value_"));
									eval("var value_='"+$(this).attr("value_")+"', custom=0;"+selectData[divi][1].attr("onChange"));									
									if(typeof $(this).attr("data-image")!="undefined"){ selectData[divi][1].css("background-image","url("+$(this).attr("data-image")+")"); }
									selectData[divi][3]=0;
									$("#"+selectedDIV).hide();
									selectedDIV="";
									selectedBUT.removeClass("selected");
									selectData[divi][6] = 1;
									selectData[divi][2].keyup();									
									//$("#"+divi).css('display',"none");									
								}
								else{ $(this).removeClass("selx"); }								
							});
						}
						else{
							selectData[divi][3]=0;							
						}
						parentDiv = $($("#"+divi).find("div")[0]);
						//if(selectData[divi][3]!=0){
							a=-1;
							$("#"+divi).find("li"+lijak).each(function(i){
								divi = $(this).attr("divi");
								if($(this).is(":visible")){
									a++;
								}
								if((selectData[divi][3])==a){ 
									$(this).addClass("selx"); 										
									parentDiv = $($("#"+divi).find("div")[0]);
									if($(this).position().top < 0){
										parentDiv.scrollTop(parentDiv.scrollTop() + $(this).position().top - 5);	
									}
									if(($(this).position().top - parentDiv.height() + $(this).height()) > 0){
										parentDiv.scrollTop(parentDiv.scrollTop() + ( $(this).height() + ($(this).position().top - parentDiv.height() )) - 5);	
									}
								}
								else{ $(this).removeClass("selx"); }
							});
						//}
					}
					nom = 1;
					
					if(mam==1 && event.keyCode!=8 && event.keyCode>=48 && event.keyCode<=122 && $("#"+divi).attr("xeter") != "nope"){  							
						$("#"+divi).find("li"+lijak).each(function(i){
							divi = $(this).attr("divi");
							if(typeof $(this).attr("disabled") == "undefined" && !$(this).hasClass("disabled")){
								$(this).addClass("selx");
								var startsize = selectData[divi][2].val().length;
								selectData[divi][0] = $(this).attr("pos");
								if(typeof $(this).attr("place-text")!="undefined")
									selectData[divi][2].val($(this).attr("place-text"));
								else
									selectData[divi][2].val($(this).find("a")[0].innerHTML);
								
								$(selectData[divi][2]).get(0).selectionStart = startsize;
								$(selectData[divi][2]).get(0).selectionEnd = selectData[divi][2].val().length;
								
								selectData[divi][1].attr("value_",$(this).attr("value_"));
								selectData[divi][1].attr("custom",0);
								eval("var value_='"+$(this).attr("value_")+"', custom=0;"+selectData[divi][1].attr("onChange"));								
								if(typeof $(this).attr("data-image")!="undefined"){
									selectData[divi][1].css("background-image","url("+$(this).attr("data-image")+")");
								}	
								nom=0;
							}
							else{ $(this).removeClass("selx"); }								
						});						
					}else if($("#"+divi).attr("xeter") == "nope"){ $("#"+divi).attr("xeter", ""); }
					
					if(mam==0){
						if(selectData[divi][1].attr("data-custom") == "true"){
							selectData[divi][1].attr("value_",selectData[divi][2].val());
							selectData[divi][1].attr("custom",1);
							eval("var value_='"+selectData[divi][2].val()+"', custom=1;"+selectData[divi][1].attr("onChange"));								
							$("#"+divi).hide();
						}else{
							selectData[divi][2].animate({backgroundColor:'red'},200);
						}
					}else{ selectData[divi][2].animate({backgroundColor:'transparent'},200); }
					
					if(maq<1 && event.keyCode>=48 && event.keyCode<=122){
						if(selectData[divi][0]!=0){
							selectData[divi][0] = 0;
							selectData[divi][1].attr("value_","");
							selectData[divi][1].attr("custom",0);
							eval("var value_='', custom=0;"+selectData[divi][1].attr("onChange"));
						} 
					}
					if(selectData[divi][1].attr("value_")=="" && selectData[divi][1].hasClass("withimage") && nom==1){ selectData[divi][1].css("background-image", 'none'); }
				});
				
				selectData[divi][2] = $(inputer);
				$(this).append(inputer);
				
				if(selectData[divi][1].outerWidth() > selectData[divi][1].attr("width")){
					inputer.setAttribute("style","width:"+(selectData[divi][1].attr("width")-(selectData[divi][1].outerWidth() - selectData[divi][1].attr("width"))+13)+"px;padding:0px;");
					divib = selectData[divi][1].attr("dropdown");
					$("#"+divib).css("width",selectData[divi][1].outerWidth()+"px");
				}
				
				span = document.createElement('span');
				if(!$(this).hasClass("input") && !$(this).hasClass("noarrow")){ $(span).html("&#x25bc;"); }
				$(this).append(span);
				
				//$(this).html("&#x25bc;");
				$(this).attr("value_","");			
				$("#"+divi).find("li").each(function(i){
					if($(this).attr("sel")==1){
						$(this).addClass("sel");
						$(this).addClass("selx");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);	
						selectData[divi][1].attr("value_",$(this).attr("value_")); 
					}else{
						$(this).addClass("nos"); 
					}
					$(this).attr("divi",divi);
					$(this).attr("pos",i);
					$(this).click(function(){
						divi = $(this).attr("divi");
						$(this).addClass("selx");
						selectData[divi][0] = $(this).attr("pos");
						selectData[divi][2].val($(this).find("a")[0].innerHTML);
						
						selectData[divi][1].attr("value_",$(this).attr("value_"));						
						eval("var value_='"+$(this).attr("value_")+"';"+selectData[divi][1].attr("onChange"));
						$("#"+divi).attr("xeter","nope");
						$("#"+divi).find("li").each(function(i){
							if(selectData[divi][0]!=i){
								$(this).removeClass("selx");
								$(this).removeClass("nos");
								selectData[divi][6] = 1;
								//$(this).addClass("nos");
								//Close!								
							}						
						 });
						 $("#"+selectedDIV).hide();
						 selectedDIV="";
						 selectedBUT.removeClass("selected");
						 selectData[divi][2].keyup();
					});
					
					$(this).hover(function(){
						$("#"+divi).find("li").each(function(i){
							if($(this).hasClass("cara")){
								//Cara -_-						
							}else{
								$(this).removeClass("selx");
							}
						});
						$(this).addClass("selx");
					});
				});
			}else if(sel_=="1"){
				if(!$(this).hasClass("noarrow"))
					$(this).html(" &#x25bc;");
				$(this).attr("value_","");
				$(this).attr("tabindex",SelectTotal+100);					
				var nextSel = false, haveIt = false, first = -1, prev = -1, damam = -1;
				$(this).on( "keyup", function(key){		
					if(key.keyCode == 13){
						var mamm = -1;
						
						$("#"+divi).find("li").each(function(i){
							if($(this).hasClass("selx")){
								mamm = $(this);
							}
						});
						
						if(mamm != -1){
							mamm.click();
							mamm.addClass("selx");						
						}
						return false;
					}
					$("#"+divi).find("li").each(function(i){
						value_trigged_list = $(this).find("a")[0].innerHTML;
						if(first == -1){ first = $(this); }
						if($(this).hasClass("selx")){
							if(key.keyCode == 40){
								nextSel = true;
								haveIt  = true;
							}else if(key.keyCode == 38){
								prev.addClass("selx");
								damam = $(this);
								haveIt  = true;
							}							
							$(this).removeClass("selx");
						}						
						else if(nextSel){
							nextSel = false;
							$(this).addClass("selx");	
							damam = $(this);
						}
						prev = $(this);
					});
					if((!haveIt) && key.keyCode == 38){
						prev.addClass("selx");
						damam = prev;
					}
					else if((nextSel || !haveIt) && key.keyCode == 40){
						first.addClass("selx");
						damam = first;
					}
															
					parentDiv = $($("#"+divi).find("div")[0]);
					if(damam.position().top < 30){
						parentDiv.scrollTop(parentDiv.scrollTop() + damam.position().top - 30);	
					}
					if((damam.position().top - parentDiv.height() + damam.height()) > 0){
						parentDiv.scrollTop(parentDiv.scrollTop() + ( damam.height() + (damam.position().top - parentDiv.height() )) - 5);	
					}		
					$(this).focus();	
					return false;
				});				
				
				$("#"+divi).find("li").each(function(i){
					if(selectData[divi][1].attr("autosize") == 0){ class_="textin"; }else{ class_=""; }
					if($(this).attr("sel")==1){
						$(this).addClass("sel");
						selectData[divi][1].html("<span class='"+class_+"' style='width:"+(selectData[divi][1].outerWidth()-41)+"px;'>"+$(this).find("a")[0].innerHTML+"</span> &#x25bc;");
						selectData[divi][1].attr("value_",$(this).attr("value_")); 
					}else{ 
						$(this).addClass("nos"); 
					}
					$(this).attr("divi",divi);
					$(this).attr("pos",i);
					$(this).click(function(){						
						divi = $(this).attr("divi");
						if($(this).hasClass("disabled")){ return false; }
						$(this).addClass("sel");
						selectData[divi][0] = $(this).attr("pos");
						if(selectData[divi][1].attr("autosize") == 0){ class_="textin"; }else{ class_=""; }
						selectData[divi][1].html("<span class='"+class_+"' style='width:"+(selectData[divi][1].outerWidth()-41)+"px;'>"+$(this).find("a")[0].innerHTML+"</span> &#x25bc;");					
						selectData[divi][1].attr("value_",$(this).attr("value_"));
						eval("var value_='"+$(this).attr("value_")+"';"+selectData[divi][1].attr("onChange"));
						$("#"+divi).find("li").each(function(i){
							if(selectData[divi][0]!=i){
								$(this).removeClass("sel");$(this).removeClass("nos");
								$(this).addClass("nos");
								//Close!								
							}						
						 });
						 //$("#"+selectedDIV).hide();
						 var bx = $("#"+selectedDIV).find(".listBox")[0];
						 var he = $(bx).height();
						 var container = $("#"+selectedDIV);
						 $(bx).animate({height: $(selectedBUT).outerHeight()}, 100, function(){ container.hide();$(bx).css("height", ""); });
						 selectedDIV="";
						 selectedBUT.removeClass("selected");
					});
					$(this).hover(function(){
						$("#"+divi).find("li").each(function(i){
							if($(this).hasClass("cara")){
								//Cara -_-						
							}else{
								$(this).removeClass("selx");
							}
						});
						$(this).addClass("selx");
					});
				});
				SelectTotal+=1;
			}else{				
				$(this).attr("tabindex",SelectTotal+100);					
				$(this).on( "keyup", function(key){		
					var nextSel = false, haveIt = false, first = -1, prev = -1, damam = -1;
					if($("#"+divi).is(":visible")){
						if(key.keyCode == 27){	
							$("#"+selectedDIV).hide();
							selectedDIV="";
							selectedBUT.removeClass("selected");
							return false;
						}
						if(key.keyCode == 13){
							var mamm = -1;
							
							$("#"+divi).find("li").each(function(i){
								if($(this).hasClass("selx")){
									mamm = $(this);
								}
							});
							
							if(mamm != -1){
								window.location.href = $(mamm.find("a")[0]).attr("href");
								$(mamm.find("a")[0]).click();
								mamm.addClass("selx");						
							}
							return false;
						}						
						$("#"+divi).find("li").each(function(i){
							if($(this).hasClass("cara") || $(this).hasClass("text")){
								//Cara -_-						
							}else{
								value_trigged_list = $(this).find("a")[0].innerHTML;
								if(first == -1){ first = $(this); }								
								if($(this).hasClass("selx") && damam!=$(this)){
									if(key.keyCode == 40){
										nextSel = true;
										haveIt  = true;
									}else if(key.keyCode == 38){	
										if(prev == -1){
											haveIt = false;
										}else{
											prev.addClass("selx");
											damam = $(this);
											haveIt  = true;	
										}
									}							
									$(this).removeClass("selx");
								}						
								else if(nextSel && damam!=$(this)){
									nextSel = false;
									$(this).addClass("selx");	
									damam = $(this);
								}
								prev = $(this);
							}
						});
						if((!haveIt) && key.keyCode == 38){
							prev.addClass("selx");
							damam = prev;
						}
						else if((nextSel || !haveIt) && key.keyCode == 40){
							first.addClass("selx");
							damam = first;
						}
																
						parentDiv = $($("#"+divi).find("div")[0]);
						if(damam.position().top < 30){
							parentDiv.scrollTop(parentDiv.scrollTop() + damam.position().top - 30);	
						}
						if((damam.position().top - parentDiv.height() + damam.height()) > 0){
							parentDiv.scrollTop(parentDiv.scrollTop() + ( damam.height() + (damam.position().top - parentDiv.height() )) - 5);	
						}					
						return false;
					}
					$(this).focus();
					return false;
				});
				
				$(this).on( "keydown", function(key){
					if(key.keyCode == 116)
						return true;  //Enable f5
					if($("#"+divi).is(":visible")){
						return false;
					}
					return false;
				});
				
				$("#"+divi).find("li").each(function(i){
					$(this).click(function(){
						//Close!	
						$("#"+selectedDIV).hide();
						selectedDIV="";
						selectedBUT.removeClass("selected");
						if($($(this).find("a")[0]).attr("href")=="#no"){ return false; }
					});
					$(this).hover(function(){
						$("#"+divi).find("li").each(function(i){
							$(this).removeClass("selx");
						});
						if(!$(this).hasClass("cara") && !$(this).hasClass("text")){							
							$(this).addClass("selx");
						}
					});
				});
				SelectTotal+=1;
			}
		});	
		$(this).on('selectstart', false);
		}
	});
}

function loading_show(){ 
	$("#dialog-loading").show("scale",400); 
}
function loading_hide(div){ 
	$('#dialog-loading').css("width","300px");
	$('#dialog-loading').css("height","70px");
	if(typeof div!="undefined"){
		var div=div;
		div.css("opacity",0);
		$("#dialog-loading").hide();
		$('#dialog-loading').animate({height:div.outerHeight(),width:div.outerWidth(),top:div.offset().top,left:div.offset().left}, function(){ 
			div.css("opacity",1);
			$('#dialog-loading').css("width","300px");
			$('#dialog-loading').css("height","70px");
			$("#dialog-loading").center();
		});
		//parents('.ui-dialog:first').
	}else{
		$("#dialog-loading").hide("fade",200);  
	}
}

function ResetPassword(id){
	html = "<div style='padding:8px;'><div class=redbox>Tomuto uživately již bylo heslo resetováno!</div>";
	html+= "Níže naleznete kod pro resetování hesla pro daného uživatele:";
	html+= "<input type=text value='45fs1v45' style='width:200px;font-size: 23px;display:block;margin: 12px 0px;'>";
	html+= "<div style='border-top:1px solid silver;margin: 8px 0px;'></div>";
	html+= "<button style='float:right;margin:3px;' onClick='$(\"#dialog-dialog\").dialog(\"close\");'>Zavřít</button>";
	html+= "<div style='clear:both;'></div></div>";
	$("#dialog-dialog").dialog('option', 'title', "Resetování hesla");
	$("#dialog-dialog").html(html); 	
	$("#dialog-dialog").dialog("open");
}

function UserShowCategory(ids){
	html="";
	if(ids==-1){
		for(i=0;i<allUserCategory.sekcion.length;i++){
			if(typeof allUserCategory.users[i]!="undefined"){
				for(a=0;a<allUserCategory.users[i].length;a++){
					html+="<div class='ratingBoxis'><img src='"+basepath+"/images/avatars/"+allUserCategory.users[i][a]["Avatar"]+"' class='ratingAvatar'><div style='float:left;'><b><a style='bacground:white;' href='"+intercomlinked+"/"+allUserCategory.users[i][a]["Username"]+"/'>"+allUserCategory.users[i][a]["Name"]+"</a></b><br>"+allUserCategory.sekcion[i]+"</div><div style='clear:both;'></div></div>";
				}
			}
		}
	}else{
		if(typeof allUserCategory.users[ids] == "undefined"){
			html = "<div style='font-weight:bold;text-align:center;padding:20px;'>Nebyly nalezeny žádné výsledky.</div>";
		}else{
			for(var i=0;i<allUserCategory.users[ids].length;i++){
				html+="<div class='ratingBoxis'><img src='"+basepath+"/images/avatars/"+allUserCategory.users[ids][i]["Avatar"]+"' class='ratingAvatar'><div style='float:left;'><b>"+allUserCategory.users[ids][i]["Name"]+"</b><br><a href='"+intercomlinked+"/"+allUserCategory.users[ids][i]["Username"]+"/'>Poslat zprávu</a></div><div style='clear:both;'></div></div>";
			}
		}
	}	
	$("#UserListCategory").html(html);
}

var swpier_toggle_body = new Array();
var swpier_toggle_id = new Array(); 
var resizer_klt = new Array();
var progres_bar = new Array();

$("input[type=\"progressbar\"]").each(function(i)
	{
		var state = $(this).attr("value");
		var width = $(this).outerWidth(true);
		var max = $(this).attr("data-max");
		var proc = Math.round((state/max)*100);
		var wigra = (width/100)*state;
				
		$(this).css("display","none");
		this.setAttribute("parent",i);
		body = document.createElement('div');
		body.setAttribute("parent",i);
		$(body).css("width",width+"px");
		$(body).addClass("progress_bar");
		$(body).html("<span class=pro>"+proc+"%</span>");
		
		gra = document.createElement('div');
		$(gra).css("width",wigra+"px");
		$(gra).addClass("gra");
		$(body).append(gra);
		
		text = document.createElement('div');
		$(text).css("width",width+"px");
		$(text).addClass("text");
		$(text).html(proc+"%");
		$(gra).append(text);		
		
		progres_bar[i] = new Array($(this),body);
		
		$(this).bind("change paste keyup", function(event){
			var state = $(this).val();
			var max = $(this).attr("data-max");
			var proc = Math.round((state/max)*100);
			var wigra = (state/width)*100;
			var parent = $(this).attr("parent");
			var div = progres_bar[parent][1];
			
			$($(div).find(".pro")[0]).html(proc+"%");
			//$($(div).find(".gra")[0]).css("width",wigra+"px");
			$($(div).find(".gra")[0]).animate({ width: wigra+"px",}, 200 );
			$($(div).find(".text")[0]).html(proc+"%");
		});
		
		$(this).after(body);
	}
);	
$("img[type=\"image_resize\"]").load(function(a)
	{
		i=a.timeStamp;
		var image = $(this).attr("src");
		var name = $(this).attr("name");
		var resize = $(this).attr("data-resize").split("x");
		
		$(this).css("display","none");
		
		imre_body = document.createElement('div');
		$(imre_body).css("width",resize[0]);
		$(imre_body).css("height",resize[1]);
		imre_body.setAttribute("parent",i);
		$(imre_body).css("background","url("+image+")");	
		$(imre_body).addClass("image_resize_b");
		
		$(this).after(imre_body);
	}
);	

$("input[type=\"toggle_swipe\"]").each(function(i)
	{
		swpier_toggle_id[i] = $(this);
		swpier_toggle_id[i].css("display","none");
		var state = $(this).attr("value"); if(state == undefined){state=0;}
		var stav = $(this).attr("data-state"); if(typeof $(this).attr("data-state") == "undefined" || $(this).attr("data-state")==""){stav=new Array("ON","OFF");}else{stav = stav.split("|");}
		var disab = $(this).attr("disabled");
		swpier_toggle = document.createElement('a');
		swpier_toggle.setAttribute("id","toggle_swipe_"+i);
		swpier_toggle.setAttribute("parent",i);
		swpier_toggle.setAttribute("href","#toggle_swipe_"+i);
		$(swpier_toggle).addClass("toggle_swipe");
		this.setAttribute("value",state);
		$(swpier_toggle).click(function(){
			var parent = $(this).attr("parent");			
			var state = swpier_toggle_id[parent].attr("value");
			var disab = swpier_toggle_id[parent].attr("disabled");
			if(disab=="disabled"){
				if(state==1){
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "-=15px",
					}, 200 );
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "+=15px",
					}, 200 );
				}else{
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "+=15px",
					}, 200 );
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "-=15px",
					}, 200 );
				}
			}else{			
				if(state==1){
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "-=34px",
					}, 200 );
				}else{
					$($(swpier_toggle_body[i]).find(".mover")[0]).animate({ 
						left: "+=34px",
					}, 200 );
				}
				swpier_toggle_id[parent].attr("value",(state==0?1:0));
			}
			return false;
		});
		
		swpier_toggle_body[i] = document.createElement('span'); // tělo switche
		$(swpier_toggle_body[i]).addClass("body");
		
		swpier_toggle_body_zap = document.createElement('div'); //pozadí zap
		$(swpier_toggle_body_zap).addClass("zap");
		$(swpier_toggle_body_zap).html(stav[0]);
		$(swpier_toggle_body[i]).append(swpier_toggle_body_zap);
		
		swpier_toggle_body_vyp = document.createElement('div'); //pozadí vyp
		$(swpier_toggle_body_vyp).addClass("vyp");
		$(swpier_toggle_body_vyp).html(stav[1]);
		$(swpier_toggle_body[i]).append(swpier_toggle_body_vyp);
		
		swpier_toggle_body_switch = document.createElement('div'); //přepínač
		$(swpier_toggle_body_switch).addClass("mover");
		if(disab=="disabled"){ $(swpier_toggle_body_switch).addClass("disabled"); }
		if(state==1){
			$(swpier_toggle_body_switch).css("left",75-1-39);	
			$(swpier_toggle_body_switch).css("top",1);	
		}else{
			$(swpier_toggle_body_switch).css("left",1);	
			$(swpier_toggle_body_switch).css("top",1);	
		}
		$(swpier_toggle_body[i]).append(swpier_toggle_body_switch);
		
		$(swpier_toggle).append(swpier_toggle_body[i]);
		
		$(this).after(swpier_toggle);
	}
);	

function start(){
	$(".NoJS").hide();
	$(".JS").show();
	
	ReplaceSelect();
	ContextMenuClickable();

	$(document).mouseup(function (e)
	{
		lastDIVsel="";
		if(selectedDIV!=""){
			var container = $("#"+selectedDIV);

			if (!container.is(e.target) // if the target of the click isn't the container...
				&& container.has(e.target).length === 0) // ... nor a descendant of the container
			{
				//container.hide();
				var bx = $(container).find(".listBox")[0];
				var he = $(bx).height();
				$(bx).animate({height: $(selectedBUT).outerHeight()}, 100, function(){ container.hide();$(bx).css("height", ""); });
				lastDIVsel = selectedDIV;
				selectedDIV="";
				selectedBUT.removeClass("selected");				
			}
		}		
	});
}
/*
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
Dialog.CREATE   = {name:"create", className:"blue", title:"Vytvořit", type:"button"};
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
		this.html.dialog.css("width", this.width);
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
		
		//if(typeof param != "undefined"){ param = $.param(param); }
		
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
		
		parent.html.dialog.css("width", this.html.dialogLoading.width());
		parent.html.dialog.css("height", this.html.dialogLoading.height());
		parent.html.dialog.css("margin-top", this.html.dialogLoading.css("margin-top"));
		parent.html.dialog.css("margin-bottom", this.html.dialogLoading.css("margin-bottom"));
		parent.html.dialogContent.css("opacity", 0);
		
		parent.html.background.show();				
		parent.html.dialog.show();
		parent.html.dialogLoading.hide();
		
		parent.html.dialog.animate({
			width: width+"px",
			height: height+"px"
		}, 400, function() { parent.html.dialog.css("height", "auto") ;parent.html.dialogContent.animate({ opacity:1 }, 400);parent.Center() });
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
		if(margin < 10) { margin = 10;}
		if(margin > 250) { margin = 250; }
		margin-=1;
		
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
*/
function messageBox(title, text){
	var dialog = new Dialog();
	dialog.setTitle(title);
	dialog.setButtons(Dialog.CLOSE);
	dialog.dialogHtml.html("<div class=cnt>"+text+"</div>");
	dialog.Show();
	butt = dialog.getButtons();
	$(butt[0]).click(function(){ dialog.Close(); });
}

function InputError(input, error){
	
}

function addScript(url){
	var script = document.createElement('script');
	script.src = url;
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
}

function shohid(id,tid){
	if($(tid).is(":visible")){
		$(tid).slideUp();
		$(id).removeClass("hide_box_row");
		$(id).addClass("show_box_row");
	}else{
		$(tid).slideDown();
		$(id).removeClass("show_box_row");
		$(id).addClass("hide_box_row");
	}
}

var lastlistajx = new Array();
var lastlistajw = new Array();

function ajaxcall(url){
	$.ajax({
		method: "GET",
		url: url
	}).done(function( msg ) {
		
	});
}

function ajaxcall_draw(url, data, id, callback){
	$.ajax({
		method: "GET",
		url: url,
		data: data
	}).done(function( msg ) {
		$(id).html(msg);
		callback(msg);
	});
}

function ajaxcall_loadtext(url,id1,id2){
	$(id1).slideUp("quick");
	$(id2).slideDown("quick");
	$(id2).html("<span class='loading small'></span> Načítám...");
	$.ajax({
		method: "GET",
		url: url
	}).done(function( msg ) {
		$(id2).html(msg);
	});
}

function hideSlide(id1,id2){
	$(id2).slideUp("quick");
	$(id1).slideDown("quick");
}

function ajaxload(url, id, sh, il){
	if(typeof lastlistajx[il] == "undefined") lastlistajx[il] = "";
	if(typeof lastlistajw[il] == "undefined") lastlistajw[il] = "";
	if(lastlistajx[il] != ""){
		$(lastlistajw[il]).removeClass("arrow_b");
		$(lastlistajw[il]).addClass("arrow_r");
		$(lastlistajx[il]).slideUp("quick");
	}
	var can = true;
	if(typeof sh!="undefined"){
		if($(id).is(":visible")){
			$(sh).removeClass("arrow_b");
			$(sh).addClass("arrow_r");
			$(id).slideUp("quick");
			can = false;
		}else{
			$(sh).addClass("arrow_b");
			$(sh).removeClass("arrow_r");
		}
	}
	if(can){
		$.ajax({
		  method: "GET",
		  url: url
		}).done(function( msg ) {
			$(id).html(msg);
			$(id).slideDown("quick");
			ReplaceSelect();
		});
	}
	lastlistajx[il] = id;
	lastlistajw[il] = sh;
}

function ajaxsend_nor(butt, url, id1, id2){
	$(butt).html("<span class='loading small'></span> Sending...");
	
	$.ajax({
		method: "GET",
		url: url
	}).done(function( msg ) {
		$(id1).html(msg);
		hideSlide(id1,id2);
	});
}

function doAction(msg){
	var ret = new Array();
	var data = JSON.parse(msg.trim());
	for (key in data) {
		if(data[key][0] == "html"){ 
			$(data[key][1]).html(data[key][2]);
		}
		else if(data[key][0] == "redirect"){ 
			window.location.replace(data[key][1]);
		}
		else { ret[data[key][0]] = data[key][1]; }
	}
	return ret;
}

function ajaxsend(frm, butt, error, url){
	if(url.charAt("?") == -1) url+="?";
	else url+="&";
	var saveText = $(butt).html();
	$(butt).attr("disabled", true);
	$(butt).html("<span class='loading small'></span> Sending...");
	
	//var dt = $(frm).serialize();
	
	var dt = "";
	var fields = $(frm).serializeArray();
    jQuery.each( fields, function( i, field ) {
		dt+=field.name + "=" + field.value.replace(new RegExp("\r\n", 'g'), "_R_N_")+"&";
    });
	dt = dt.substr(0,dt.length-1);
	
	$.ajax({
		method: "GET",
		url: url+dt
	}).done(function( msg ) {
		$(butt).attr("disabled", false);
		if(msg.trim().substr(0,1) == "{" || msg.trim().substr(0,1) == "["){
			var dat = doAction(msg);
			if(dat["message"] !== undefined){
				$(error).show();
				$(error).html(dat["message"]);
			}
		}
		else if(msg.trim() != "ok"){
			$(error).show();
			$(error).html(msg);
		}
		$(butt).html(saveText);
	});
}

function ajaxsend_ext(frm, butt, error, url, url2, id2){
	if(url.charAt("?") == -1) url+="?";
	else url+="&";
	var saveText = $(butt).html();
	$(butt).attr("disabled", true);
	$(butt).html("<span class='loading small'></span> Sending...");
	
	var url2=url2;
	var id2 = id2;
	
	//var dt = $(frm).serialize();
	
	var dt = "";
	var fields = $(frm).serializeArray();
    jQuery.each( fields, function( i, field ) {
		dt+=field.name + "=" + field.value.replace(new RegExp("\r\n", 'g'), "_R_N_")+"&";
    });
	dt = dt.substr(0,dt.length-1);
	
	$.ajax({
		method: "GET",
		url: url+dt
	}).done(function( msg ) {
		$(butt).attr("disabled", false);
		$.ajax({
		  method: "GET",
		  url: url2
		}).done(function( msg ) {
			$(id2).html(msg);
		});
	});
}

function ajaxsend_del(frm, butt, error, url, id2){
	var dt = "";
	var fields = $(frm).serializeArray();
    jQuery.each( fields, function( i, field ) {
		dt+=field.name + "=" + field.value.replace(new RegExp("\r\n", 'g'), "_R_N_")+"&";
    });
	dt = dt.substr(0,dt.length-1);
	
	console.log(url);
	console.log(dt);
	
	var id2=id2;
	$(butt).html("<span class='loading small'></span> Wait...");
	$.ajax({
		method: "GET",
		url: url+"&"+dt
	}).done(function( msg ) {
		//$(id2).html(msg);
		$(id2).remove();
	});
}