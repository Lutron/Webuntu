$(function() {
	//Start booting
	runProgram("boot");
});

//GLOBALS
window.programs="system/programs/";
window.user="Lutan";



function runProgram(program,parameter) {
	if ($("link."+program).length==0) {
		$("head").append('<link class="'+program+'" rel="stylesheet" href="'+programs+program+'/'+program+'.css" type="text/css">');
	}
	if ($("script."+program).length==0) {
		$("head").append('<script class="'+program+'" src="'+programs+program+'/'+program+'.js">');
	}
	$("#explorer #menu").hide();
	window[program](parameter);
}

window.ctrlKey=false;
window.shiftKey=false;
$(document).keydown(function(e) {
	window.ctrlKey=e.ctrlKey;
	window.shiftKey=e.shiftKey;
});

function system_deleteFile(filepath) {
	request=$.get("index.php?action=deleteFile&path="+filepath);
	request.done(function(data) {
		if (data!="") {
			alert(data);
		} else if ($("#explorer").length!=0) {
			$(".window.filemanager").each(function() {
				explorer_refreshWindows();
			});
		}
	});
	request.error(function() {
		alert("Connection problems.");
	});
}

function system_writeFile(filepath,content) {
	request=$.ajax("index.php?action=writeFile&path="+filepath+"&content="+encodeURIComponent(content));
	request.done(function(data) {
		if (data!="") {
			alert(data);
		} else if ($("#explorer").length!=0) {
			$(".window.filemanager").each(function() {
				explorer_refreshWindows();
			});
		}
	});
	request.error(function() {
		alert("Connection problems.");
	});
}

function readIni(name, callback) {
	var request=$.ajax({
		url:"index.php?action=readIni&filename="+encodeURIComponent(name),
		success: callback
	});
	request.error(function() {
		return false;
	});
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}