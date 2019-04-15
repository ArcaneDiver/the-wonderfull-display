var express = require('express'); //framework che sta alla base
var path = require('path'); //lo uso per i percorsi
var bodyParser = require('body-parser'); //lo uso per leggere il testo
var fs = require('fs'); // lo uso per leggere i file
var fileUpload = require('express-fileupload'); // lo uso per leggere i file
const child = require('child_process') // lo uso per i processi figli

var port = process.env.PORT || 80; //uso la porta 80 così che io possa scrivere direttamente 10.201.0.11 senza la porta

var app = express();


app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs'); //i file html da inviare al sito
app.use(express.static(path.join(__dirname, 'public'))); //le risorse usate dal sito


app.use('/image', fileUpload());

app.use('/text', bodyParser.json());
app.use('/text', bodyParser.urlencoded({ extended: true }));



var childSub;
//riavvio l'ultimo processo che è stato avviato
var resumeLastMatrix = fs.readFileSync('dataSub/lastMatrix.txt');

switch (parseInt(resumeLastMatrix, 10)) {
	case 1: // 1 = immagine
		childSub = child.fork('dataSub/subIndexImage.js');
		break;
	case 2: // 2 = testo
		childSub = child.fork('dataSub/subIndexText.js');
		break;
	default:
		console.log('no process to resume');
		childSub = child.fork('dataSub/subIndexText.js'); //faccio ripartire questo senno da errore quando chiamo i post per la prima volta
		break;
}



app.get('/text', function (req, res) { // detecta entrata in /
    res.render('indexText', {});
})


app.post('/text', function (req, res) { // bottone cliccato
	
	childSub.kill('SIGKILL');
	
	const item = req.body.userSearchInput;
	const data = item.concat('Ĭ'+r+'Ĭ'+g+'Ĭ'+b+'Ĭ'+brig+'Ĭ'+s); // Ĭ è carattere UNICODE realizzato con alt+300
	
	const s = req.body.speed;

	const brig = req.body.userSearchBright;
	
	const color = req.body.userSearchColor;
	const r = hexToRgb(color).r;
	const g = hexToRgb(color).g;
	const b = hexToRgb(color).b;
	
	fs.writeFile('dataSub/dataIn.txt', data, (err)=>{
		if (err) throw err;
	}); 

	childSub = child.fork('dataSub/subIndexText.js');
	
	
	fs.writeFile('dataSub/lastMatrix.txt', 2);
	
	res.render('indexText', {});
});

app.get('/image', function (req, res) { 
	res.render('indexImage', {});
})


app.post('/image', function (req, res) { 
	
	childSub.kill('SIGKILL');
	
    let file = req.files.imageToDisplay;
    for(var i = 0; i<(file.length); i++){
		file[i].mv('img/input' + i +'.jpg', function(err) {
			if (err)
			return res.send(err);
		});
	}
	
	childSub = child.fork('dataSub/subIndexImage.js');
	fs.writeFile('dataSub/lastMatrix.txt', 1);
	res.render('indexImage', {});
});

app.get('/', function(req,res){
	res.render('index', {});
});


app.all('*', function(req, res){//questo reindirizza tutte le pagine che non sono / o /text o /image
	res.redirect('/');
});

app.listen(port, function(){
	var buff = 
	console.log(`Server IP: 10.201.0.11`);
});

function hexToRgb(hex) {
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

