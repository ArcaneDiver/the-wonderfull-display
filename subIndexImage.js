var ledMatrix = require('easybotics-rpi-rgb-led-matrix');
var child = require('child_process');
var matrix = new ledMatrix(32, 64, 1, 4, 20);
var fs = require('fs');

while(1){
	
	var x = 0;
	var convert = child.spawnSync('convert', ['ciao.jpg', 'input.ppm']);
	
	var imgBuff = fs.readFileSync('input.ppm');
	
	var imgLength = imgBuff.length - 14;


	var openToRead = fs.openSync('input.ppm', 'r');
	var openToWrite = fs.openSync('output.ppm', 'w');
	console.log(openToRead, openToWrite);
	var realBuff = new Buffer(imgLength);

	fs.readSync(openToRead, realBuff, 0, imgLength, 14, callBack);
	//delay(5);
	//console.log(realBuff);
	fs.writeSync(openToWrite, realBuff, 0, imgLength, 0, callBack);
	//delay(5);

	const imageBuff = fs.readFileSync("output.ppm");
	//console.log(realBuff.length, imageBuff.length);
	//console.log(imageBuff.length, imageBuff);
	var width, height;
	height = 32; //questo fa preso come assodato perche al momento non so come calcolarne le dimensioni
	width = (imageBuff.length / 3 ) / height;
	
	//console.log(height, width, imageBuff.length);
	
	matrix.brightness(20);//rimettere arrText[4]
	console.log(width, height);
	matrix.setImageBuffer(imageBuff, width, height);
	while(1){
		x=0;
	while (x<width) {
		
		matrix.clear();	
		
		matrix.draw(0, 0, 256, 32, x, 0, true, false);	
		matrix.update();
		x++;
		
		delay(0);
	}}
	fs.close(openToRead);
	fs.close(openToWrite);

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
function removeHeader(i, o){
	var i = 0;
	
}
var callBack = function(err, bytesRead, buffer){
	console.log('err: ', err);
}
