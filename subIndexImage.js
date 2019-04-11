var ledMatrix = require('easybotics-rpi-rgb-led-matrix');

var matrix = new ledMatrix(32, 64, 1, 4, 20);
var fs = require('fs');

while(1){
	
	var x = 256;
	const imageBuff = fs.readFileSync("b.ppm");
	matrix.setImageBuffer(imageBuff, 256, 32);
	while (x > (-256)) { // 26 perche ci sono gli spazi prima
		
		matrix.clear();	
		matrix.brightness(50);//rimettere arrText[4]
		
		matrix.draw();	
		matrix.update();
		x--;
		
		delay(0);
	}

}
function delay(ms){
	var cur_d = new Date();
	var cur_ticks = cur_d.getTime();
	var ms_passed = 0;
	while(ms_passed < ms) {
		var d = new Date();
		var ticks = d.getTime();
		ms_passed = ticks - cur_ticks;
	}
	
}
