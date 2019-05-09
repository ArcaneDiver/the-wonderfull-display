/*

    Autore: Michele Della Mea

*/


var ledMatrix = require('easybotics-rpi-rgb-led-matrix');
var child = require('child_process');
var matrix = new ledMatrix(32, 64, 1, 4);
var fs = require('fs');

while(1){

    // ImageMagick https://imagemagick.org/index.php
    var actualDate = new Date();
    
    var day = actualDate.getDate(), month = actualDate.getMonth() + 1, year= actualDate.getFullYear(), hour = actualDate.getHours(), minute = actualDate.getMinutes();
    var timeString;
    
    if (day < 10) {
        timeString = "0" + day;
    } else {
        timeString = day;
    }
    if (month < 10) {
        timeString = timeString.concat('/0' + month);
    } else {
        timeString = timeString.concat('/' + month);
    }
    timeString = timeString.concat('/' + year + '   ');
    
    if (hour < 10) {
        timeString = timeString.concat('0' + hour + ':');
    } else {
        timeString = timeString.concat(hour + ':');
    }
    if(minute < 10){
        timeString = timeString.concat('0' + minute);
    } else {
        timeString = timeString.concat(minute);
    }

    


    var numberOfFile = fs.readFileSync('./dataSub/numberOfFile.txt', {}); //leggo il file che contiene il numero di immagini e visto che le immagini vengono salvate da input0 non aggiungo niente
    var createImageWithTime = child.spawnSync('sudo', ['convert', './img/empty.jpg', '-gravity', 'center', '-pointsize', '30', '-size', '256x32', '+antialias', '-fill', 'green', '-annotate', '0x0+0+3', timeString, './img/input' + numberOfFile + '.jpg']);
    
    var convert = child.spawnSync('sudo', ['convert', './img/input*.jpg', '+append', '-crop', '100000x32+0+0', './img/converted/input.ppm']); //+append serve per concatenare le immagini
	
    var x = 0;
    
    var imgBuff = fs.readFileSync('./img/converted/input.ppm');
    
    
    
    var openToRead = fs.openSync('./img/converted/input.ppm', 'r');

    var openToWrite = fs.openSync('./img/converted/output.ppm', 'w');

    var i = 0, numberOfDots = 0;
    while(1){
        var tempBuff = new Buffer(1);//buffer da 1 Byte
        fs.readSync(openToRead, tempBuff, 0, 1, i); //un bit alla volta
        
        i++; //conto quanto è lunga l'intestazione
        
        if(tempBuff.lastIndexOf(10) == 0){ //l'intestazione è composta da 3 punti di cui uno finale
            numberOfDots ++;
            
        }

        if(numberOfDots == 3){
            break;
        }
        
    }
   
    var imgLength = imgBuff.length - i;

    var realBuff = new Buffer(imgLength);
    //vado a riscrivere il file per rimuovere l'intestazione
    fs.readSync(openToRead, realBuff, 0, imgLength, i);
    fs.writeSync(openToWrite, realBuff, 0, imgLength, 0);
    
    fs.close(openToRead);
    fs.close(openToWrite);

    const imageBuff = fs.readFileSync("./img/converted/output.ppm");
    
    var width, height;
    height = 32; //questo perchè l'immagine viene tagliata automaticamente con altezza 32
    width = (imageBuff.length / 3 ) / height;
    
    var dataForImageScrolling = fs.readFileSync('dataSub/dataInImage.txt', 'utf8', {}); //legge i dati per lo scorrimento
   
    var arrImg = dataForImageScrolling.split("Ĭ"); //alt+300 unicode
    const speed = arrImg[0];

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
    
    matrix.brightness(arrImg[1]); //imposto la luminosità
    
    matrix.setImageBuffer(imageBuff, width, height);// setto l' immagine
    
    var x1= 256;
    while(x1!=0){ //serve per farlo *comparire* dal destra la prima volta
        matrix.clear();	
        matrix.draw(x1, 0, 256, 32, 0, 0, false, false);	
        matrix.update();
        x1--;	
        delay(tDelay);
    }
       
    
    
    while (x<width) { //serve per farlo *scomparire* a sinistra
        
        matrix.clear();	
        matrix.draw(0, 0, 256, 32, x, 0, false, false);	
        matrix.update();
        x++;
        
        delay(tDelay);
    }
    //if(Date.now() - timeStart > timeToScroll){
        //break;
    //}
}
// Cosa problematica da risolvere !!!!!!!!!!!!!!!!!
var clock = child.spawn('sudo', ['../../rpi-rgb-led-matrix/examples-api-use/clock',  '--led-cols', '64', '--led-rows', '32', '--led-chain', '4', '-f', '/home/pi/rpi-rgb-led-matrix/fonts/10x20.bdf', '-b', '30', '-C', '0,255,0', '-y', '5', '-d', "%d/%m/%Y       %H:%M:%S"], {});
/*
process.once('SIGKILL', function () {
    console.log('caugh');
    clock.on('close', () => {});
});*/
process.once('SIGTERM', function () {
    console.log('caugh');
    clock.on('close', () => {});
});
clock.stderr.on('data', (data) =>{
    console.log('hey un errore', data.toString('utf8'));
})
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
