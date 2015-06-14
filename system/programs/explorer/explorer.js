function explorer() {
	$("head").append('<link class="explorer" rel="stylesheet" href="'+window.programs+'explorer/window.css" type="text/css">');
	$("body").append('<div id="explorer"></div>');
	$("#explorer").append('<div id="taskbar"></div>');
	
	$("#explorer #taskbar").append('<div id="iconwrapper"></div>');
	$("#explorer #iconwrapper").append('<div id="time"></div>');
	
	$("#explorer #taskbar").append('<div id="programwrapper"></div>');
	$("#explorer #programwrapper").append('<div id="startbutton" class="element pinned" tabindex=1><img src="'+programs+'explorer/gfx/win8.png"></img></div>');
	$("#explorer").append('<div id="menu"></div>');
	
	$("#explorer #menu").append('<div id="menufirst"></div>');
	$("#explorer #menufirst").append('<div id="programs"></div>');
	$("#explorer #programs").append('<div class="element" program="commandline"><img src="'+programs+'explorer/gfx/commandline.png">cmd</div>');
	$("#explorer #menufirst").append('<div id="search"><input type=text placeholder="Search"></div>');
	
	$("#explorer #menu").append('<div id="menusecond"></div>');
	$("#explorer #menusecond").append('<div id="userfoto"><img src="system/users/'+user+'/icon.png"></div>');
	$("#explorer #menusecond").append('<div class="element">Files</div>');
	$("#explorer #menusecond").append('<div class="element">Uploads</div>');
	$("#explorer #menusecond").append('<div class="element">Downloads</div>');
	$("#explorer #menusecond").append('<hr>');
	$("#explorer #menusecond").append('<div class="element">Computer</div>');
	$("#explorer #menusecond").append('<div class="element">Settings</div>');
	
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

function createWindow(title, iconpath, width, height) {
	if (typeof window.windows==="undefined") {
		window.windows=new Array();
	}
	var id=window.windows.length;
	window.windows.push(id);
	
	title = title ? title : "";
	icon = iconpath ? '<img class="programicon" src="'+iconpath+'">' : "";
	content='<div id="'+id+'" class="window" style="width:'+width+'px; height:'+height+'px;"><div class="titlebar">';
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
	return id;
}
function destroyWindow(id) {
	$("#"+id).remove();
}