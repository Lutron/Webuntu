function boot() {
	//Show bootscreen
	$("body").append('<div id="boot"></div>');
	$("#boot").append('<img id="logo" src="'+programs+'boot/logo.png">');
	
	//Show login screen
	request=$.get("index.php?action=currentUser");
	request.done(function(data) {
		if (data=="") {
			runProgram("login");
		} else {
			runProgram("explorer");
		}
		setTimeout(function() {
			$("#boot").fadeOut(500, function() {
				$("#boot").remove();
			});
		},500);
	});
};