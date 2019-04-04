 var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var ledMatrix = require('easybotics-rpi-rgb-led-matrix');


const child = require('child_process')

var app = express();



var port = process.env.PORT || 3000;

// setting up views
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

childSub = child.fork('subIndex.js');

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

	
app.get('/', function (req, res) { // detecta entrata in /
	
    res.render('index', {});
})


app.post('/', async function (req, res) { // bottone cliccato
	/*childSub.on('message', (msg) => {
  		console.log('Message from child', msg);
	});*/

	var item = req.body.userSearchInput;
	var brig = req.body.userSearchBright;
	var color = req.body.userSearchColor;
	var r = hexToRgb(color).r;
	var g = hexToRgb(color).g;
	var b = hexToRgb(color).b;
	var data = item.concat('Ĭ'+r+'Ĭ'+g+'Ĭ'+b+'Ĭ'+brig); // carattere realizzato con alt+300
	console.log(data);
	fs.writeFile('dataIn.txt', data, (err)=>{
		if (err) throw err;
 		console.log('The file has been saved!');
	}); 
	console.log(brig, color, r, g, b);
	var lengTextIn = item.length;
	console.log('Dato inserito = ' + item + ' | Lunghezza stringa = '+lengTextIn);

	/* stampa immagine *funzionante*
	var imageBuff = fs.readFileSync("b.ppm");
	matrix.setImageBuffer(imageBuff, 256, 32);	
	matrix.draw();
	matrix.update();	
	*/
	
	
	res.render('index', {});
	
	
});
	

app.listen(port, '10.201.0.11');


