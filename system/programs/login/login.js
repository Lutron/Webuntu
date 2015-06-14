function login() {
	$("body").append('<div id="login"></div>');
	request=$.getJSON("index.php?program=login&action=listUsers");
	request.done(function(data) {
		dropdown='';
		for (id in data) {
			dropdown+='<option value="'+data[id]+'">'+data[id]+'</option>';
		}
		$("#login").append('\
			<form method=post action=index.php>\
				<select name=user>\
					'+dropdown+'\
				</select>\
				<input type=password name=password>\
			</form>\
		');
		
		$("#login > form").submit(function(e) {
			e.preventDefault();
			username=$("#login > form > select[name=user]").val();
			password=$("#login > form > input[name=password]").val();
			request=$.get("index.php?program=login&action=login&username="+username+"&password="+password);
			request.done(function(data) {
				if (data!="") {
					runProgram("explorer");
					$("#login").fadeOut(500,function() {
						$(this).remove();
					});
				} else {
					alert("Wrong password.");
				}
			});
		});
	});
}