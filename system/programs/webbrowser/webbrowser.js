function webbrowser() {
	var id=createWindow("webbrowser","Webbrowser",programs+"webbrowser/webbrowser.png",400,400);
	var content=$("#"+id+" > .content");
	content.append('<div class="navbar"><input type="text"></div>');
	content.append('<div class="page"><iframe src=""></iframe></div>');
	var input=content.children(".navbar").children("input");
	var frame=content.children(".page").children("iframe");
	input.keydown(function(e) {
		if (e.which==13) {
			var url=$(this).val();
			if (url.indexOf("http://")!=0 && url.indexOf("https://")!=0) {
				url="http://"+url;
				$(this).val(url);
			}
			frame.attr("src",url);
			/*request=$.getJSON("system/programs/webbrowser/webbrowser.php?url="+input.val()+"&id="+id);
			request.done(function(data) {
				console.log(data);
				$("#"+data[0]+" .page > iframe").attr("src","data:text/html;charset=utf-8," + escape(data[1]));
			});*/
		}
	});
}