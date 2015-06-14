function explorer() {
	$("head").append('<link class="explorer" rel="stylesheet" href="'+window.programs+'explorer/window.css" type="text/css">');
	$("body").append('<div id="explorer"></div>');
	
	//Taskbar and menu
	$("#explorer").append('<div id="taskbar"></div>');
	
	$("#explorer #taskbar").append('<div id="iconwrapper"></div>');
	$("#explorer #iconwrapper").append('<div id="time"></div>');
	
	$("#explorer #taskbar").append('<div id="programwrapper"></div>');
	$("#explorer #programwrapper").append('<div id="startbutton" class="element pinned" tabindex=1><img src="system/gfx/win8.png"></img></div>');
	$("#explorer").append('<div id="menu"></div>');
	
	$("#explorer #menu").append('<div id="menufirst"></div>');
	$("#explorer #menufirst").append('<div id="programs"></div>');
	$("#explorer #programs").append('<div class="element" program="commandline"><img src="'+programs+'commandline/commandline.png">cmd</div>');
	$("#explorer #programs").append('<div class="element" program="webbrowser"><img src="'+programs+'webbrowser/webbrowser.png">Webbrowser</div>');
	$("#explorer #menufirst").append('<div id="search"><input type=text placeholder="Search"></div>');
	
	$("#explorer #menu").append('<div id="menusecond"></div>');
	$("#explorer #menusecond").append('<div id="userfoto"><img src="system/users/'+user+'/icon.png"></div>');
	$("#explorer #menusecond").append('<div class="element">Files</div>');
	$("#explorer #menusecond").append('<div class="element">Uploads</div>');
	$("#explorer #menusecond").append('<div class="element">Downloads</div>');
	$("#explorer #menusecond").append('<hr>');
	$("#explorer #menusecond").append('<div class="element">Computer</div>');
	$("#explorer #menusecond").append('<div class="element">Settings</div>');
	//End taskbar and menu
	
	//Desktop
	$("#explorer").append('<div id="desktop"></div>');
	var desktop=$("#explorer #desktop");
	desktop.append('<div class="icon" program="commandline"><img src="system/programs/commandline/commandline.png"></div>');
	desktop.append('<div class="icon" program="commandline"><img src="system/programs/webbrowser/webbrowser.png"></div>');
	
	desktop.children(".icon").draggable({
		grid:[50,50],
		containment:"parent",
		start: function(event,ui) {
			window.explorer_dragstartpos=[ui.position.left,ui.position.top];
		},
		stop: function(event,ui) {
			var collision=0;
			window.explorer_dragstoppos=[ui.position.left,ui.position.top];
			$(".icon").each(function() {
				var left=window.explorer_dragstoppos[0];
				var top=window.explorer_dragstoppos[1];
				var curpos=$(this).position();
				console.log("");
				console.log(top+"  "+left);
				console.log(curpos.top+"  "+curpos.left);
				console.log($(this));
				console.log(ui);
				if ($(this)!=ui && curpos.top==top && curpos.left==left) {
					console.log("collision");
					collision++;
				}
			});
			if (collision>=2) {
				$(this).css("left",window.explorer_dragstartpos[0]);
				$(this).css("top",window.explorer_dragstartpos[1]);
			}
		}
	});
	
	//End desktop
	
	$(document).on("click","#explorer #startbutton",function(e) {
		$("#explorer #menu").toggle();
		e.stopPropagation();
	});
	$(document).on("click","#explorer #menu",function(e) {
		e.stopPropagation();
	});
	$(document).click(function() {
		$("#explorer #menu").hide();
	});
	$(document).on("click","#explorer #programs .element",function() {
		pro=$(this).attr("program");
		runProgram(pro);
		$("#explorer #menu").hide();
	});
}

function createWindow(cla, title, iconpath, width, height) {
	if (typeof window.windows==="undefined") {
		window.windows=0;
	}
	if (typeof window.windowszindex==="undefined") {
		window.windowszindex=1;
	}
	
	var id=window.windows;
	window.windows++;
	
	title = title ? title : "";
	icon = iconpath ? '<img class="programicon" src="'+iconpath+'">' : "";
	content='<div id="'+id+'" class="window '+cla+'" style="width:'+width+'px; height:'+height+'px; z-index:'+window.windowszindex+';"><div class="titlebar">';
	content+=''+icon+title+'<img class="titleicon closeicon" src="system/gfx/closewindow.png"><img class="titleicon minimizeicon" src="system/gfx/minimizewindow.png">';
	content+='</div><div class="content"></div>';
	content+='</div>';
	$("body").append(content);
	
	$("#"+id+" > .titlebar > .closeicon").click(function() {
		$('#explorer #taskbar .element[window="'+id+'"]').remove();
		$("#"+id).remove();
	});
	$("#"+id+" > .titlebar > .minimizeicon").click(function() {
		$("#"+id).hide();
	});
	$("#explorer #programwrapper").append('<div class="element" window="'+id+'"><img src="'+iconpath+'"></img></div>');
	$('#explorer #taskbar .element[window="'+id+'"]').click(function() {
		$("#"+$(this).attr("window")).toggle();
	});
	$("#"+id).draggable({
		handle:".titlebar",
		cancel:".closeicon, .minimizeicon",
	});
	$("#"+id).click(function() {
		window.windowszindex++;
		$(this).css("zIndex",window.windowszindex);
	});
	$("#"+id).css("min-width",width+"px");
	$("#"+id).css("min-height","34px");
	$("#"+id).resizable();
	return id;
}
function destroyWindow(id) {
	$("#"+id).remove();
}