 var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');



const { spawn } = require('child_process')
const fixReadTxt = 'fixReadTxt.exe';
const emptyImageGen = 'emptyImageGen.exe'
var app = express();
//var filepreview = require('filepreview-es6');


var port = process.env.PORT || 3000;

// setting up views
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var procEx = 0;
var bashSummon;

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


app.post('/', function (req, res) { // bottone cliccato
	var item = req.body.userSearchInput;
	var brig = req.body.userSearchBright;
	var color = req.body.userSearchColor;
	var r = hexToRgb(color).r;
	var g = hexToRgb(color).g;
	var b = hexToRgb(color).b;

	console.log(brig, color, r, g, b);
	var lengTextIn = item.length;
	console.log('Dato inserito = ' + item + ' | Lunghezza stringa = '+lengTextIn);
	if(procEx == 1){
		process.kill(-bashSummon.pid);


	};
	
	bashSummon = spawn('sudo', ['../../rpi-rgb-led-matrix/examples-api-use/scrolling-text-example', '--led-rows', '32', '--led-cols', '64', '--led-chain', '4', '-f', 'fmax.bdf', '-b', brig, '-C', r+','+g+','+b , '-s', '20', item], {detached: true}); 
	procEx = 1;
	bashSummon.stderr.on('data', (data) => {
	  console.log('stderr: ' + data);
	});
	
	
	
	
	
	res.render('index', {});

});

app.listen(port, '10.201.0.11');
