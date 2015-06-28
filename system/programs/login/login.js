function login() {
	$("body").append('<div id="login"></div>');
	request=$.getJSON("index.php?action=listUsers");
	request.done(function(data) {
		content='<div id="formwrapper">';
		for (id in data) {
			content+='	<form class="login_form" method=post action=index.php>\
							<input type="hidden" name="user" value="'+data[id]+'">\
							<div class="username">'+data[id]+'</div>\
							<input class="password" type="password" name="password" placeholder="Password">\
						</form>\
						';
		}
		content+='</div>';
		
		$("#login").append(content);
		$("#login .login_form").first().addClass("active");
		$("#login .login_form").first().children(".password").focus();
		
		$("#login .login_form").click(function() {
			$("#login .login_form").removeClass("active");
			$(this).addClass("active");
			$(this).children(".password").focus();
		});
		
		
		$("#login .login_form").submit(function(e) {
			e.preventDefault();
			username=$(this).children("input[name=user]").val();
			password=$(this).children(".password").val();
			request=$.get("index.php?action=login&username="+username+"&password="+password);
			request.done(function(data) {
				if (data!="") {
					runProgram("explorer");
					$("#login .login_form").fadeOut(500,function() {
						$(this).remove();
						$("#login").fadeOut(500,function() {
							$(this).remove();
						});
					});
				} else {
					alert("Wrong password.");
				}
			});
		});
	});
	request.error(function() {
		alert("Failure while booting.");
	});
}