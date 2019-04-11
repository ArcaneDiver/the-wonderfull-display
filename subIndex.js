var ledMatrix = require('easybotics-rpi-rgb-led-matrix');

var matrix = new ledMatrix(32, 64, 1, 4, 20);
var fs = require('fs');

while(1){
	
	const textToScroll = fs.readFileSync('dataIn.txt', 'utf8');
	const arrText = textToScroll.split("Ĭ");
	const lun = Object.keys(arrText[0]).length;
	console.log(lun);
	var x = 256, y = 0, x1 = 256;
	const aWorldOfAir = '                                ';
	const speed = arrText[5];
	var tDelay;
	switch (speed) {
		case 'max':
			tDelay = 0;
			break;
		case 'medium':
			tDelay = 15;
			break;
		case 'min':
			tDelay = 30;
			break;
		default:
			break;
	}

	var r = parseInt(arrText[1], 10), g = parseInt(arrText[2], 10), b = parseInt(arrText[3], 10);
	console.log('|' + arrText[0] + '|' + r + '|' + g + '|' + b + '|');
	const numTutSchermo = 32;
	var toWrite = arrText[0].slice(0 , numTutSchermo);
	toWrite = toWrite.concat(arrText[0].slice(numTutSchermo, numTutSchermo*2));
	var i = 1, k = 0;
	while (x1 > (-8 * lun)) { // 26 perche ci sono gli spazi prima
		if((k % 256 == 0 ) && k != 0){
			var tmp = arrText[0].slice(numTutSchermo*(i-1), numTutSchermo*i);
			toWrite = tmp.concat(arrText[0].slice(numTutSchermo*i, numTutSchermo*(i+1)));			
			console.log(toWrite);
			
			x=0;
			i++;
		}
		
		console.log('|'+toWrite+'|');
		matrix.clear();	
		matrix.brightness(arrText[4]);//rimettere arrText[4]
		matrix.drawText(x, 5, toWrite , '../../rpi-rgb-led-matrix/fonts/8x13.bdf', r, g, b);	
		//matrix.setImageBuffer('text.ppm', 256, 32);	
		matrix.update();
		x--;
		x1--;
		k++;
		delay(tDelay);
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
