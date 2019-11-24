<<<<<<< HEAD

var ledMatrix = require('easybotics-rpi-rgb-led-matrix');
var child = require('child_process');
var matrix = new ledMatrix(32, 64, 1, 4, 50);
var fs = require('fs');

const args = process.argv.slice(2);
console.log(args);
child.spawnSync('sudo', ['convert', args[0], '-crop', '100000x32+0+0', '../img/converted/staticImage.ppm']);

var imgBuff = fs.readFileSync('../img/converted/staticImage.ppm');

    
var openToRead = fs.openSync('../img/converted/staticImage.ppm', 'r');

var openToWrite = fs.openSync('../img/converted/staticImageO.ppm', 'w');

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

const imageBuff = fs.readFileSync("../img/converted/staticImageO.ppm");

var width, height;
height = 32; //questo perchè l'immagine viene tagliata automaticamente con altezza 32
width = (imageBuff.length / 3 ) / height;


matrix.setImageBuffer(imageBuff, width, height);// setto l' immagine
matrix.draw();
matrix.update();
=======

var ledMatrix = require('easybotics-rpi-rgb-led-matrix');
var child = require('child_process');
var matrix = new ledMatrix(32, 64, 1, 4, 50);
var fs = require('fs');

const args = process.argv.slice(2);
console.log(args);
child.spawnSync('sudo', ['convert', args[0], '-crop', '100000x32+0+0', '../img/converted/staticImage.ppm']);

var imgBuff = fs.readFileSync('../img/converted/staticImage.ppm');

    
var openToRead = fs.openSync('../img/converted/staticImage.ppm', 'r');

var openToWrite = fs.openSync('../img/converted/staticImageO.ppm', 'w');

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

const imageBuff = fs.readFileSync("../img/converted/staticImageO.ppm");

var width, height;
height = 32; //questo perchè l'immagine viene tagliata automaticamente con altezza 32
width = (imageBuff.length / 3 ) / height;


matrix.setImageBuffer(imageBuff, width, height);// setto l' immagine
matrix.draw();
matrix.update();
>>>>>>> 6287b2da7d9bbb953c26da81f72037aa5210b4d2
while(1){};