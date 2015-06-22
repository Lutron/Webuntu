function commandline() {
	id=createWindow("commandline","Commandline",programs+"commandline/commandline.png",400,400);
	$("#"+id+" > .content").append('<div class="consoleoutput"></div>');
	$("#"+id+" > .content").append('<textarea class="userinput" prefix="'+user+'@GLaDOS:~$ " autofocus autocomplete=off></textarea>');
	$("#"+id+" .userinput").val(user+"@GLaDOS:~$ ");
	$("#"+id+" .userinput").keydown(function (e) {
		var current = $(this).val();
		var prefix=$(this).attr("prefix");
		var caretPos=doGetCaretPosition($(this)[0]);
		if (e.which==13) {
			e.preventDefault();
			var cmd=current.substring(prefix-1);
			console.log(cmd);
			$(this).val(prefix);
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