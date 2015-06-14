$(function() {
	//Start booting
	runProgram("boot");
});

//GLOBALS
window.programs="system/programs/";
window.user="Lutan";



function runProgram(program) {
	if ($("style."+program).length==0) {
		$("head").append('<link class="'+program+'" rel="stylesheet" href="'+programs+program+'/'+program+'.css" type="text/css">');
	}
	if ($("script."+program).length==0) {
		$("head").append('<script class="'+program+'" src="'+programs+program+'/'+program+'.js">');
	}
	window[program]();
}