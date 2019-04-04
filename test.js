var ledM = require('easybotics-rpi-rgb-led-matrix');
var m = new ledM(32, 64, 1, 4,50);

//textScroll();

async function lol(){
	m.fill(255,50,0);
	
	//});
	m.setPixel(0, 0, 0, 50, 255);
	//var
	//while(time != 1000){
	m.update();
	
	
	
}

 lol();
while(1==1);
//.catch(console.error);

//setInterval(lol, 100);
