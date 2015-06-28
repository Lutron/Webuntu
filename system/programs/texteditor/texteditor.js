function texteditor(filepath) {
	if (typeof filepath!="undefined") {
		var request=$.get("index.php?action=readFile&path="+filepath);
		request.done(function(data) {
			if (data=="") {
				texteditor_createWindow("","");
			} else {
				texteditor_createWindow(filepath,data);
			}
		});
		request.error(function() {
			alert("Connection problems.");
		});
	} else {
		texteditor_createWindow("","");
	}
}

function texteditor_createWindow(path,content) {
	var title=path!="" ? "Texteditor - "+path : "Texteditor";
	var id=createWindow("texteditor", title, programs+"texteditor/texteditor.png", 400, 400);
	var windowdiv=$("#"+id+" > .content");
	windowdiv.append('<div class="menu"><input type="hidden" name="curfile" value="'+path+'"></div>');
	var menu=windowdiv.children(".menu");
	menu.append('<img class="openfile" src="'+programs+'/explorer/file.png">');
	menu.append('<img class="savefile" src="'+programs+'/explorer/save.png">');
	menu.append('<img class="savefileas" src="'+programs+'/explorer/saveas.png">');
	windowdiv.append('<div class="textareawrapper"><textarea>'+escapeHtml(content)+'</textarea></div>');
	menu.children(".openfile").click(function() {
		alert("openfile");
	});
	menu.children(".savefile").click(function() {
		var content=$(this).closest(".content");
		var curfile=$(this).siblings("input[name=curfile]").val();
		var filecontent=content.find("textarea").val();
		if (curfile=="") {
			explorer_filemanager_saveas(filecontent);
		} else {
			system_writeFile(curfile,filecontent);
		}
	});
	menu.children(".savefileas").click(function() {
		var content=$(this).closest(".content");
		var filecontent=content.find("textarea").val();
		explorer_filemanager_saveas(filecontent);
	});
}