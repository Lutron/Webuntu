function explorer(path) {
	if ($("#explorer").length==0) {
		explorer_firstinstance();
	} else {
		explorer_filemanager(path);
	}
}

function explorer_filemanager_saveasopendir(windowdiv,dir) {
	var files=windowdiv.children(".files");
	var request=$.getJSON("index.php?action=listFiles&directory="+dir);
	request.done(function(data) {
		var curpathinput=windowdiv.children(".adressbar").children("input[name=path]");
		curpathinput.val(data[0]);
		windowdiv.children(".adressbar").children("input[type=text]").val(data[0]);
		files.html("");
		for (id in data[1]) {
			var entry=data[1][id];
			var image="";
			if (entry[1]=="dir") {
				image='<img src="'+programs+'/explorer/explorer.png">';
			} else {
				image='<img src="'+programs+'/explorer/file.png">';
			}
			files.append('<div class="element" type="'+entry[1]+'">'+image+entry[0]+'</div>');
		}

		var curpath=data[0];
		var elements=files.children(".element");
		elements.dblclick(function() {
			if ($(this).attr("type")=="dir") {
				var newpath=curpath+"/"+$(this).text();
				explorer_filemanager_saveasopendir(windowdiv,newpath);
			} else {
				alert("Insert function for setting inputfilename here.");
			}
		});
		elements.click(function(e) {
			if (e.which!=1) {
				return;
			}
			elements.removeClass("marked");
			$(this).addClass("marked");
			if ($(this).attr("type")=="file") {
				$(this).closest(".content").find(".targetfile").children("input").val($(this).text());
			} else {
				$(this).closest(".content").find(".targetfile").children("input").val("");
			}
		});
		files.contextmenu(function(e) {
			var context=[];
			var submenu=[["Dummy",'alert();']];
			context.push(["New file",'explorer_createNewFile("'+data[0]+'");']);
			
			context.push(["Refresh",'alert("Refresh");']);
			explorer_contextmenu(e,context);
		});
		var folderup=windowdiv.children(".adressbar").children("img");
		folderup.unbind("click");
		if (curpath.replace("/","")!="") {
			folderup.removeClass("disabled");
			folderup.click(function() {
				explorer_filemanager_saveasonefolderup(windowdiv);
			});
		} else {
			folderup.addClass("disabled");
		}
	});
}

function explorer_filemanager_saveasonefolderup(windowdiv) {
	var curpathinput=windowdiv.children(".adressbar").children("input[name=path]");
	var curpath=curpathinput.val();
	var curpath=curpath.split("/");
	if (curpath.length>0) {
		curpath.splice(-1,1);
	}
	var newpath=curpath.join("/");
	explorer_filemanager_saveasopendir(windowdiv,newpath);
}

function explorer_filemanager_saveas(filecontent) {
	var id=createWindow("filemanager saveas", "Filemanager", programs+"/explorer/explorer.png", 400, 400);
	var window=$("#"+id+" > .content");
	window.append('<div class="files"></div>');
	
	window.append('<div class="adressbar"></div>');
	var adressbar=window.children(".adressbar");
	adressbar.append('<input type="hidden" name="path"><input type="text">');
	adressbar.append('<img src="'+programs+'/explorer/folderup.png">');
	adressbar.children("input[type=text]").keydown(function(e) {
		var curpathinput=window.children(".adressbar").children("input[name=path]");
		if (e.which==13) {
			explorer_filemanager_saveasopendir(window,$(this).val());
		}
	});
	
	window.append('<div class="places"></div>');
	var places=window.children(".places");
	places.append('<div class="element" dir="/"><img src="'+programs+'/explorer/explorer.png">root</div>');
	places.append('<div class="element" dir="/system/users/Lutan"><img src="'+programs+'/explorer/explorer.png">Lutan</div>');
	places.children(".element").dblclick(function() {
		var window=places.parent();
		explorer_filemanager_saveasopendir(window,$(this).attr("dir"));
	});
	explorer_filemanager_saveasopendir(window,"");
	window.append('<div class="targetfile"><input type="text"><img src="'+programs+'/explorer/save.png"></div>');
	var windowpathinput=window.children(".targetfile").children("input");
	windowpathinput.data("filecontent",filecontent);
	windowpathinput.keydown(function(e) {
		if (e.which==13) {
			var path=$(this).closest(".window").find("input[name=path]").val();
			var filename=windowpathinput.val();
			var request=$.get("index.php?action=writeFile&path="+path+"/"+filename+"&content="+encodeURIComponent($(this).data("filecontent")));
			request.done(function(data) {
				if (data!="") {
					alert(data);
				} else {
					$(".window.filemanager.saveas").remove();
				}
			});
		}
	});
	window.children(".targetfile").children("img").click(function() {
		var path=$(this).closest(".window").find("input[name=path]").val();
		var filename=windowpathinput.val();
		var request=$.get("index.php?action=writeFile&path="+path+"/"+filename+"&content="+encodeURIComponent($(this).siblings("input").data("filecontent")));
		request.done(function(data) {
			if (data!="") {
				alert(data);
			} else {
				$(".window.filemanager.saveas").each(function() {
					var id=$(this).attr("id");
					$(this).remove();
					$('#explorer #taskbar .element[window="'+id+'"]').remove();
				});
			}
		});
	});
}

function explorer_filemanager(path) {
	var id=createWindow("filemanager", "Filemanager", programs+"/explorer/explorer.png", 400, 400);
	var window=$("#"+id+" > .content");
	window.append('<div class="files"></div>');
	var files=window.children(".files");
	
	window.append('<div class="adressbar"></div>');
	var adressbar=window.children(".adressbar");
	adressbar.append('<input type="hidden" name="path"><input type="text">');
	adressbar.append('<img src="'+programs+'/explorer/folderup.png">');
	adressbar.children("input[type=text]").keydown(function(e) {
		var curpathinput=window.children(".adressbar").children("input[name=path]");
		if (e.which==13) {
			explorer_filemanager_opendir(window,$(this).val());
		}
	});
	
	window.append('<div class="places"></div>');
	var places=window.children(".places");
	places.append('<div class="element" dir="/"><img src="'+programs+'/explorer/explorer.png">root</div>');
	places.append('<div class="element" dir="/system/users/Lutan"><img src="'+programs+'/explorer/explorer.png">Lutan</div>');
	places.children(".element").dblclick(function() {
		var window=places.parent();
		explorer_filemanager_opendir(window,$(this).attr("dir"));
	});
	explorer_filemanager_opendir(window,path);
}

function explorer_refreshWindows() {
	$(".window").each(function() {
		explorer_filemanager_opendir($(this).children(".content"),$(this).find("input[name=path]").val());
	});
}

function explorer_filemanager_opendir(windowdiv,dir) {
	var files=windowdiv.children(".files");
	var request=$.getJSON("index.php?action=listFiles&directory="+dir);
	request.done(function(data) {
		var curpathinput=windowdiv.children(".adressbar").children("input[name=path]");
		curpathinput.val(data[0]);
		windowdiv.children(".adressbar").children("input[type=text]").val(data[0]);
		files.html("");
		for (id in data[1]) {
			var entry=data[1][id];
			var image="";
			if (entry[1]=="dir") {
				image='<img src="'+programs+'/explorer/explorer.png">';
			} else {
				image='<img src="'+programs+'/explorer/file.png">';
			}
			files.append('<div class="element" type="'+entry[1]+'">'+image+entry[0]+'</div>');
		}

		var curpath=data[0];
		var elements=files.children(".element");
		elements.dblclick(function() {
			if ($(this).attr("type")=="dir") {
				var newpath=curpath+"/"+$(this).text();
				explorer_filemanager_opendir(windowdiv,newpath);
			} else {
				alert("Insert function for filerunning here.");
			}
		});
		elements.contextmenu(function(e) {
			if (e.ctrlKey) {
				$(this).addClass("marked");
			} else if (e.shiftKey) {
				if (elements.is(".marked").length==0) {
					$(this).addClass("marked");
					return;
				}
				
				var now=$(this).index();
				var ele=elements.filter(".marked");
				var first=ele.first().index();
				
				if (now < first) {
					var start=now+1;
					var end=first+1;
				} else {
					var start=first+1;
					var end=now+1;
				}
				
				files.children(".element.marked").removeClass("marked");
				for (i=start; i<=end; i++) {
					files.children(".element:nth-child("+i+")").addClass("marked");
				}
			} else {
				if (!$(this).hasClass("marked")) {
					elements.removeClass("marked");
					$(this).addClass("marked");
				}
			}
			
			var context=[];
			context.push(["Copy",'explorer_setClipboard("copy");']);
			context.push(["Cut",'explorer_setClipboard("cut");']);
			context.push(["Delete",'explorer_deleteFiles();']);
			context.push(["Rename",'explorer_rename("'+data[0]+'","'+$(this).text()+'");']);
			if ($(this).attr("type")=="dir" && window.clipboard instanceof Array && window.clipboard.length!=0) {
				context.push(["Paste",'explorer_pasteFiles("'+data[0]+"/"+$(this).text()+'");']);
			} else if ($(this).attr("type")=="file") {
				context.push(["Texteditor",'runProgram("texteditor","'+data[0]+"/"+$(this).text()+'")']);
			}
			e.stopPropagation();
			explorer_contextmenu(e,context);
		});
		files.contextmenu(function(e) {
			var context=[];
			var submenu=[["Dummy",'alert();']];
			context.push(["New file",'explorer_createNewFile("'+data[0]+'");']);
			
			if (window.clipboard instanceof Array && window.clipboard.length!=0) {
				context.push(["Paste",'explorer_pasteFiles("'+data[0]+'");']);
			}
			
			context.push(["Refresh",'alert("Refresh");']);
			explorer_contextmenu(e,context);
		});
		elements.click(function(e) {
			if (e.which!=1) {
				return;
			}
			if (e.ctrlKey) {
				$(this).toggleClass("marked");
			} else if (e.shiftKey) {
				if (elements.is(".marked").length==0) {
					$(this).toggleClass("marked");
					return;
				}
				
				var now=$(this).index();
				var ele=elements.filter(".marked");
				var first=ele.first().index();
				
				if (now < first) {
					var start=now+1;
					var end=first+1;
				} else {
					var start=first+1;
					var end=now+1;
				}
				
				files.children(".element.marked").removeClass("marked");
				for (i=start; i<=end; i++) {
					files.children(".element:nth-child("+i+")").addClass("marked");
				}
			} else {
				elements.removeClass("marked");
				$(this).addClass("marked");
			}
		});
		var folderup=windowdiv.children(".adressbar").children("img");
		folderup.unbind("click");
		if (curpath.replace("/","")!="") {
			folderup.removeClass("disabled");
			folderup.click(function() {
				explorer_filemanager_onefolderup(windowdiv);
			});
		} else {
			folderup.addClass("disabled");
		}
	});
}

function explorer_rename(curpath,oldname) {
	var newname=prompt("Enter the new name",oldname);
	var request=$.get("index.php?action=renameFile&basepath="+curpath+"&oldname="+oldname+"&newname="+newname);
	request.done(function(data) {
		if (data!="") {
			alert(data);
		}
		explorer_refreshWindows();
	});
	request.error(function() {
		alert("Connection problems.");
	});
}

function explorer_pasteFiles(destinationpath) {
	var type=window.clipboard[0];
	var paths=window.clipboard[1];
	paths=JSON.stringify(paths);
	if (type=="copy") {
		var action="copyFiles";
	} else if (type=="cut") {
		var action="moveFiles";
	} else {
		return;
	}
	var request=$.get("index.php?action="+action+"&destination="+destinationpath+"&paths="+paths);
	request.done(function(data) {
		if (data!="") {
			alert(data);
		}
		explorer_refreshWindows();
	});
	request.error(function() {
		alert("Connection problems.");
	});
}

function explorer_deleteFiles(filesdiv) {
	if (!confirm("Are you sure you want to delete this?")) {
		return;
	}
	var windowdiv=$(".window.active");;
	
	var curpath=windowdiv.find("input[name=path]").val();
	var files=[];
	
	windowdiv.find(".files").children(".element").filter(".marked").each(function() {
		files.push($(this).text());
	});
	
	var i;
	for (i=0; i<files.length; i++) {
		system_deleteFile(curpath+"/"+files[i]);
	}
}

function explorer_createNewFile(path) {
	filename=prompt("Filename?");
	if (!filename) {
		return;
	}
	system_writeFile(path+"/"+filename,"");
}

function explorer_setClipboard(type) {
	var windowdiv=$(".window.active > .content");
	var files=windowdiv.children(".files");
	var curpath=windowdiv.find("input[name=path]").val();
	window.clipboard=[];
	var buffer=[];
	files.children(".element.marked").each(function() {
		if ($(this).text()!="") {
			buffer.push(curpath+'/'+$(this).text());
		}
	});
	window.clipboard.push(type);
	window.clipboard.push(buffer);
}

function explorer_filemanager_onefolderup(windowdiv) {
	var curpathinput=windowdiv.children(".adressbar").children("input[name=path]");
	var curpath=curpathinput.val();
	var curpath=curpath.split("/");
	if (curpath.length>0) {
		curpath.splice(-1,1);
	}
	var newpath=curpath.join("/");
	explorer_filemanager_opendir(windowdiv,newpath);
}

function explorer_contextmenu(e,elements) {
	var context=$("#explorer_contextmenu");
	context.css("left",e.pageX+"px");
	context.css("top",e.pageY+"px");
	var zindex = typeof window.windowszindex == "undefined" ? 500 : window.windowszindex+2;
	context.css("zIndex",zindex);
	context.html(explorer_createmenu(elements));
	
	context.show();
	e.preventDefault();
	e.stopPropagation();
}

function explorer_createmenu(elements) {
	var menu='<div class="menu">';
	var i;
	for (i=0; i<elements.length; i++) {
		if (elements[i].length==0) {
			menu+='<hr class="divider">';
		} else {
			if (typeof elements[i][1]=="string") {
				menu+='<div onclick=\''+elements[i][1]+'; $(this).parent().hide();\' class="element">'+elements[i][0]+'</div>';
			} else {
				menu+='<div onclick=\'event.stopPropagation();\' class="element">'+elements[i][0]+explorer_createmenu(elements[i][1])+'</div>';
			}
		}
	}
	
	return menu+'</div>';
}

function explorer_firstinstance() {
	$("head").append('<link class="explorer" rel="stylesheet" href="'+window.programs+'explorer/window.css" type="text/css">');
	$("body").append('<div id="explorer"></div>');
	$("#explorer").append('<div id="explorer_contextmenu"></div>');
	$("#explorer").click(function() {
		$("#explorer_contextmenu").hide();
	});
	$(window).contextmenu(function(e) {
		e.preventDefault();
	});
	
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
	$("#explorer #programs").append('<div class="element" program="texteditor"><img src="'+programs+'texteditor/texteditor.png">Texteditor</div>');
	$("#explorer #menufirst").append('<div id="search"><input type=text placeholder="Search"></div>');
	
	$("#explorer #menu").append('<div id="menusecond"></div>');
	$("#explorer #menusecond").append('<div id="userfoto"><img src="system/users/'+user+'/icon.png"></div>');
	$("#explorer #menusecond").append('<div class="element" onclick="runProgram(\'explorer\',\'/system/users/Lutan\');">Files</div>');
	$("#explorer #menusecond").append('<div class="element">Uploads</div>');
	$("#explorer #menusecond").append('<div class="element">Downloads</div>');
	$("#explorer #menusecond").append('<hr>');
	$("#explorer #menusecond").append('<div class="element" onclick="runProgram(\'explorer\',\'/\');">Root</div>');
	$("#explorer #menusecond").append('<div class="element">Settings</div>');
	//End taskbar and menu
	
	//Desktop
	$("#explorer").append('<div id="desktop"></div>');
	var desktop=$("#explorer #desktop");
	desktop.contextmenu(function(e) {
		var elements=[];
		elements.push(["Alert",'alert("test");']);
		explorer_contextmenu(e,elements);
	});
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
				if ($(this)!=ui && curpos.top==top && curpos.left==left) {
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
		window.windowszindex=0;
	}
	window.windowszindex++;
	
	var id=window.windows;
	window.windows++;
	title = title ? title : "";
	icon = iconpath ? '<img class="programicon" src="'+iconpath+'">' : "";
	content='<div id="'+id+'" class="window '+cla+'" style="width:'+width+'px; height:'+height+'px; z-index:'+window.windowszindex+';"><div class="titlebar">';
	content+='<div class="titlename">'+icon+title+'</div><img class="titleicon closeicon" src="system/gfx/closewindow.png"><img class="titleicon minimizeicon" src="system/gfx/minimizewindow.png">';
	content+='</div><div class="content"></div>';
	content+='</div>';
	$("#explorer").append(content);
	
	
	var filewindow=$("#"+id);
	$("#"+id+" > .titlebar > .closeicon").click(function() {
		$('#explorer #taskbar .element[window="'+id+'"]').remove();
		filewindow.remove();
	});
	$("#"+id+" > .titlebar > .minimizeicon").click(function() {
		filewindow.hide();
	});
	$("#explorer #taskbar .element").removeClass("active");
	$("#explorer #programwrapper").append('<div class="element active" window="'+id+'"><img src="'+iconpath+'"></img></div>');
	$('#explorer #taskbar .element[window="'+id+'"]').click(function() {
		var target=$("#"+$(this).attr("window"));
		if ($(this).hasClass("active")) {
			target.hide();
			$("#explorer #taskbar .element").removeClass("active");
		} else {
			target.show();
			window.windowszindex++;
			target.css("zIndex",window.windowszindex);
			$(".window").removeClass("active");
			target.addClass("active");
			$("#explorer #taskbar .element").removeClass("active");
			$(this).addClass("active");
		}
	});
	filewindow.draggable({
		handle:".titlebar",
		cancel:".closeicon, .minimizeicon",
	});
	filewindow.mousedown(function() {
		id=$(this).attr("id");
		$("#explorer #taskbar .element").removeClass("active");
		$("#explorer #taskbar .element[window="+id+"]").addClass("active");
		window.windowszindex++;
		$(this).css("zIndex",window.windowszindex);
		$(".window").removeClass("active");
		$(this).addClass("active");
	});
	filewindow.css("min-width",width+"px");
	filewindow.css("min-height","34px");
	filewindow.resizable();
	$(".window").removeClass("active");
	filewindow.addClass("active");
	return id;
}
function destroyWindow(id) {
	$("#"+id).remove();
}