var ledMatrix = require('easybotics-rpi-rgb-led-matrix');
var child = require('child_process');
var matrix = new ledMatrix(32, 64, 1, 4, 20);
var fs = require('fs');

while(1){

	//const nImageToDisplay = (fs.readdirSync('./img')).length; //leggo quanti file ci sono nella cartella /img
	var convert = child.spawnSync('sudo', ['convert','./img/*.jpg', '+append', '-crop', '100000x32+0+0', './img/converted/input.ppm']);
	//var countImage = 0;
	//var firstCycle = 0;
	//while(countImage<(nImageToDisplay -1)){
		var x = 0;
		//var convert = child.spawnSync('convert', ['./img/input' + countImage + '.jpg', '-crop', '10000x32', './img/converted/input.ppm']);
		
		var imgBuff = fs.readFileSync('./img/converted/input.ppm');
		
		var imgLength = imgBuff.length - 14;
	
	
		var openToRead = fs.openSync('./img/converted/input.ppm', 'r');
		var openToWrite = fs.openSync('./img/converted/output.ppm', 'w');
		
		var realBuff = new Buffer(imgLength);
	
		fs.readSync(openToRead, realBuff, 0, imgLength, 14);
		
		fs.writeSync(openToWrite, realBuff, 0, imgLength, 0);
		
	
		const imageBuff = fs.readFileSync("./img/converted/output.ppm");
		
		var width, height;
		height = 32; //questo fa preso come assodato perche al momento non so come calcolarne le dimensioni
		width = (imageBuff.length / 3 ) / height;
		
		//console.log(height, width, imageBuff.length);
		
		matrix.brightness(30);
		
		matrix.setImageBuffer(imageBuff, width, height);
		//if(firstCycle == 0){
			var x1= 256;
			while(x1!=0){
				matrix.clear();	
				matrix.draw(x1, 0, 256, 32, 0, 0, false, false);	
				matrix.update();
				x1--;	
				delay(10);
			}
			firstCycle = -1;
		//}
		
		while (x<width) {
			matrix.clear();	
			
			matrix.draw(0, 0, 256, 32, x, 0, false, false);	
			matrix.update();
			x++;
			
			delay(10);
		}
		fs.close(openToRead);
		fs.close(openToWrite);
		//countImage ++;

	//}

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