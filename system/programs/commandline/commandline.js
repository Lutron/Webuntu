function commandline() {
	id=createWindow("Commandline","system/programs/explorer/gfx/commandline.png",400,400);
	$("#"+id).addClass("commandline");
	$("#"+id+" > .content").append('<div id="consoleoutput">ayayayay<br>ayayay</div>');
	$("#"+id+" > .content").append('<input class="userinput" prefix="Lutan@GLaDOS:~$ " autofocus autocomplete=off>');
	$("#"+id+" .userinput").val("Lutan@GLaDOS:~$ ");
	$("#"+id+" .userinput").keydown(function (e) {
		var current = $(this).val();
		var prefix=$(this).attr("prefix");
		var caretPos=doGetCaretPosition($(this)[0]);
		if (e.which==13) {
			var cmd=current.substring(prefix-1);
			console.log(cmd);
		} else if ((e.which==37 || e.which==8) && caretPos<=prefix.length) {
			e.preventDefault();
			$(this).selectRange(prefix.length);
		} else if (e.which==36) {
			e.preventDefault();
			$(this).selectRange(prefix.length);
		} else if (e.which==38) {
			//Previous command
			e.preventDefault();
		} else if (e.which==40) {
			//Next command
			e.preventDefault();
		} else if (caretPos<prefix.length) {
			$(this).selectRange(prefix.length);
		} else if (current.indexOf(prefix) !== 0) {
			var length=prefix.length;
			var after = current.slice(length);
			
			$(this).val(prefix + after);
		}
		
		if (e.shiftKey) {
			$(this).selectRange(caretPos);
		}
	});
	
	$(document).on("click","#"+id,function() {
		$(this).find(".userinput").focus();
		$(this).find(".userinput").selectRange($(this).find(".userinput").attr("prefix").length);
	});
	$("#"+id).click();
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