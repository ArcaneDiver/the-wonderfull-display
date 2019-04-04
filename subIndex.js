var ledMatrix = require('easybotics-rpi-rgb-led-matrix');

var matrix = new ledMatrix(32, 64, 1, 4, 20);
var fs = require('fs');

while(1){

	const textToScroll = fs.readFileSync('dataIn.txt', 'utf8');
	const arrText = textToScroll.split("Ĭ");
	const lun = Object.keys(arrText[0]).length;
	matrix.brightness(arrText[4]);
	var x = 256, y = 0;
	var r = parseInt(arrText[1], 10), g = parseInt(arrText[2], 10), b = parseInt(arrText[3], 10);
	//console.log('|' + arrText[0] + '|' + r + '|' + g + '|' + b + '|'); 
	while (!(x < (-10 * lun))) {
		matrix.clear();	
		matrix.brightness(arrText[4]);	
		matrix.drawText(x, y, arrText[0], 'fmax.bdf', r, g, b);
		
		matrix.update();
		x--;	
		//setInterval(() => {}, 100);
		
	}

}

