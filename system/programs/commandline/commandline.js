function commandline() {
	var id=createWindow("commandline","Commandline",programs+"commandline/commandline.png",400,400);
	commandline_prefix=user+'@Webuntu:~$ ';
	$("#"+id+" > .content").append('<div class="consoleoutput"></div>');
	$("#"+id+" > .content").append('<textarea class="userinput" prefix="'+commandline_prefix+'" autofocus autocomplete=off></textarea>');
	$("#"+id+" .userinput").val(commandline_prefix);
	$("#"+id+" .userinput").keydown(function (e) {
		var current = $(this).val();
		var commandline_prefix=$(this).attr("prefix");
		var caretPos=doGetCaretPosition($(this)[0]);
		if (e.which==13) {
			e.preventDefault();
			var cmd=current.substring(commandline_prefix-1);
			commandline_execute(cmd.substring(commandline_prefix.length), id);
			$(this).val(commandline_prefix);
		} else if ((e.which==37 || e.which==8) && caretPos<=commandline_prefix.length) {
			e.preventDefault();
			$(this).selectRange(commandline_prefix.length);
		} else if (e.which==36) {
			e.preventDefault();
			$(this).selectRange(commandline_prefix.length);
		} else if (e.which==38) {
			//Previous command
			e.preventDefault();
		} else if (e.which==40) {
			//Next command
			e.preventDefault();
		} else if (caretPos<commandline_prefix.length) {
			$(this).selectRange(commandline_prefix.length);
		} else if (current.indexOf(commandline_prefix) !== 0) {
			var length=commandline_prefix.length;
			var after = current.slice(length);
			$(this).val(commandline_prefix + after);
		}
		
		if (e.shiftKey) {
			$(this).selectRange(caretPos);
		}
		
		$(this).height(0);
		$(this).height(this.scrollHeight);
	});
	
	$("#"+id+" .userinput").keyup(function (e) {
		$(this).height(0);
		$(this).height(this.scrollHeight);
	});
	
	$(document).on("click","#"+id,function() {
		$(this).find(".userinput").focus();
		$(this).find(".userinput").selectRange($(this).find(".userinput").val().length);
	});
	$("#"+id).click();
}

function commandline_execute(command, id) {
	commandline_println(id, commandline_prefix+command);
	switch (command) {
		case "clear":
			$("#"+id+" .consoleoutput").html("");
			break;
		default:
			var request=$.get("index.php?action=shell&command="+btoa(command));
			request.done(function(data) {
				commandline_println(id, data.replace(/(?:\r\n|\r|\n)/g, '<br>'));
			});
			request.fail(function() {
				commandline_println(id, "Request failed.");
			});
			break;
	}
}

function commandline_print(id, content) {
	$("#"+id+" .consoleoutput").append(content);
}

function commandline_println(id, content) {
	commandline_print(id, content+"<br>");
}

$.fn.selectRange = function(start, end) {
    if(!end) end = start; 
    return this.each(function() {
        if (this.setSelectionRange) {
            this.focus();
            this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    });
};
function doGetCaretPosition (oField) {
  var iCaretPos = 0;
  if (document.selection) {
    oField.focus ();
    var oSel = document.selection.createRange ();
    oSel.moveStart ('character', -oField.value.length);
    iCaretPos = oSel.text.length;
  } else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  return (iCaretPos);
}