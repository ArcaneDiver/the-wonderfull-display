
/**
 * @author Michele Della MEa
 */


const express = require('express'); //framework che sta alla base
const path = require('path'); //lo uso per i percorsi
const bodyParser = require('body-parser'); //lo uso per leggere il testo
const fs = require('fs'); // lo uso per leggere i file
const fileUpload = require('express-fileupload'); // lo uso per leggere i file dal sito
const child = require('child_process') // lo uso per i processi figli
const session = require(`express-session`); // Autenticazione
const morgan = require(`morgan`); // DEV

require('dotenv').config();
require("util").inspect.defaultOptions.depth = null; // In Node.JS i console.log non sono ricorsivi, con questo parametro sì

const app = express();



/*
---------------------------------------------------------Inizializzazione variabili etc.---------------------------------------------------------
*/

const port = process.env.PORT || 80; //uso la porta 80 cos� che io possa scrivere direttamente 10.201.0.11 senza la porta

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs'); //cartella dei file html da inviare al sito
app.set('trust proxy', 1) // trust first proxy

app.use(express.static(path.join(__dirname, 'public'))); //le risorse usate dal sito


app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.use(morgan(`dev`));

app.use('/image', fileUpload());
app.use('/addImage', fileUpload());
app.use('/text', bodyParser.json());
app.use('/text', bodyParser.urlencoded({ extended: true }));
app.use('/dataImage', bodyParser.json());
app.use('/dataImage', bodyParser.urlencoded({ extended: true }));
app.use('/delete', bodyParser.json());
app.use('/delete', bodyParser.urlencoded({ extended: true }));
app.use("/login_check", bodyParser.urlencoded({ extended: true }));



var childSub;
var numImg = fs.readFileSync(path.resolve(__dirname, "./dataSub/numberOfFile.txt"), {}); //numero attuale di immagini che scorrono

var posToAdd = 0;

//riavvio l'ultimo processo che è stato avviato 
const actualMatrix = parseInt(fs.readFileSync(path.resolve(__dirname, "./dataSub/lastMatrix.txt"), {}));

switch (actualMatrix) {
	case 1: // 1 = immagine
		childSub = child.fork(path.resolve(__dirname, "./dataSub/subIndexImage.js"));
		childSub.on("error", console.error)
		break;
	case 2: // 2 = testo
		childSub = child.fork(path.resolve(__dirname, "./dataSub/subIndexText.js"));
		childSub.on("error", console.error)
		break;
	default: //non dovrebbe accadere mai spero
		
		childSub = child.fork(path.resolve(__dirname, "./dataSub/subIndexText.js")); //faccio ripartire questo senno da errore quando chiamo i post per la prima volta
		childSub.on("error", console.error)
		break;
}


let actualImage = [];

// Tento di leggere il file dataImage se fallisco cancello le immagini precedentemente caricate
try {
	actualImage = require(path.resolve(__dirname, "./dataImage.json"));
	if (actualImage.length === undefined) throw new Error();
} catch (err) {
	cleanImageFolder();
	numImg = 0;
}


const metaBase64 = "data:image/png;base64,";


/*
---------------------------------------------------------Fine Inizializzazione---------------------------------------------------------
*/



app.use((req, res, next) => {

	
	console.log(req.originalUrl, "Path:", (req.originalUrl !== "/login" && req.originalUrl !== "/login_check"), "Session_token:", req.session.logged, "Redirected", !req.session.logged && (req.originalUrl !== "/login" && req.originalUrl !== "/login_check"));

	if (!req.session.logged && (req.originalUrl !== "/login" && req.originalUrl !== "/login_check")) {
		res.status(401).redirect(`/login`);
		
	} else {
		next();
	}
})

app.get(`/login`, (req, res) => {
	res.status(200).render(`login`);
});

app.post(`/login_check`, (req, res) => {

	console.log(req.body.password, "VS", process.env.PW, "Result: ", req.body.password == process.env.PW);

	if (req.body.password == process.env.PW) {
		req.session.logged = true;
		res.status(200).redirect(`/`);
	} else {
		res.status(403).redirect("/login");
	}
})
/*

	+ Gestione delle richeste da /delete

*/

app.post('/delete', function(req, res){
	const toDelete = req.body.remove; //ottengo il nome dell' immagine da cancellare
	const whereAdd = req.body.add; //ottengo la posizione dove aggiungere

	if(toDelete){ //se toDelete è definito allora cancello
		deleteImage(toDelete);
		
	} else { //senno aggiungo
		posToAdd = whereAdd;
		res.status(300).redirect('/addImage');
		return;
	}
	saveJson(); //salvo i cambiamenti anche nel file
	res.status(300).redirect('/dataImage');
})

/*
	Gestione delle richieste da /image
*/
app.get('/addImage', function(req, res){
	res.status(200).render('indexImageAdd', {});
});

app.post("/addImage", function(req,res){ // le operarazioni come +x + +y sono perche senno le variabili sarebbere trattate come stringhe anzichè interi

	//TODO errore qui

	const file = req.files.imageToDisplay;
	
	var numberOfFileToAdd = 0;
	
	if (file.length > 0) { //questo serve per sapere di quante *posizioni* devo *shiftare* le immagini
		
		numberOfFileToAdd = file.length; //se non è un array deve essere per forza 1
	} else {
		numberOfFileToAdd = 1;
	}
	
	for (var i = numImg - 1; i >= posToAdd; i--){ //-1 perche lavoro con le posizioni
		
		

		//shifto gli elementi nel filesystem
		var rename = child.spawnSync('sudo', ['mv', path.resolve(__dirname, `./img/input${i}.jpg`), path.resolve(__dirname, `./img/input${parseInt(+i + +numberOfFileToAdd)}.jpg`)], {}); //*shifto* i nomi
		
		//shifto anche gli elementi nell'array
		
		actualImage[+i + +numberOfFileToAdd] = new Object();
		actualImage[+i + +numberOfFileToAdd] = actualImage[i];
		actualImage[+i + +numberOfFileToAdd].posNumber = +actualImage[+i+numberOfFileToAdd].posNumber + +numberOfFileToAdd;
	}

	if(file.length > 0){ //capisco se cio' che carico e' un array di file o solo un singolo file

		for(var i = 0; i<(file.length); i++){ 

			actualImage[parseInt(+i + +posToAdd, 10)] = new Object(); //inizializzo l'oggetto

			actualImage[parseInt(+i + +posToAdd, 10)].imgSrc = metaBase64.concat(file[i].data.toString('base64')); //converto il buffer dell immagine in base64 e gli aggiungo i metadati

			file[i].mv(path.resolve(__dirname, `./img/input${parseInt(+i + +posToAdd)}.jpg`), function(err) { //inserisco nel filesystem le immaggini
				if (err) return res.send(err);
			});
			console.log(parseInt(+i + +posToAdd, 10), parseInt((+i + +posToAdd + 1), 10))
			//actualImage[i].name = 'img/input' + i +'.jpg';
			actualImage[parseInt(+i + +posToAdd, 10)].name = file[i].name;

			actualImage[parseInt(+i + +posToAdd, 10)].posNumber = parseInt((+i + +posToAdd + 1), 10);

			
		}
		numImg = file.length + numImg;
	} else {
		
		actualImage[posToAdd] = new Object();
		actualImage[posToAdd].imgSrc = metaBase64.concat(file.data.toString('base64')); //converto il buffer dell immagine in base64 e gli aggiungo i metadati

		file.mv(`./img/input${posToAdd}.jpg`, function(err) { //inserisco nel filesystem l'immagine
			if (err) return res.send(err);
		});

		//actualImage[0].name = 'img/input' + i +'.jpg';
		actualImage[posToAdd].name = file.name;

		actualImage[posToAdd].posNumber = parseInt(+posToAdd + +1, 10) ;

		numImg = +1 + +numImg;
		
	}
	console.log(actualImage);

	saveJson();
	//salvo il numero di file in modo tale da poterli eliminare al prossimo caricamento
	fs.writeFileSync(path.resolve(__dirname, './dataSub/numberOfFile.txt'), numImg, {});
	

	res.status(300).redirect('/dataImage');
	
	
});
app.get('/dataImage', function(req, res){
	//console.log(actualImage);
	res.status(200).render('indexImageData', {imageList: actualImage});
});

app.post('/dataImage', function(req, res){
	var speed = req.body.speedImage;
	var brig = req.body.brigImage;
	var date = req.body.selectClock == 'on' ? 1 : 0;
	var hour = parseInt(req.body.hours, 10);
	var minute = parseInt(req.body.minutes, 10);
	var resTime;

	if(!hour && !minute) resTime = -1;
	else {
		resTime = (((+hour * 60) + +minute) * +60) * 1000; //converto in minuti
	}
	console.log(resTime, hour, minute, req.body);

	var data = speed.concat('Ĭ' + brig + 'Ĭ' + date + 'Ĭ' + resTime);
	fs.writeFileSync(path.resolve(__dirname, './dataSub/dataInImage.txt'), data, {});
	
	res.status(300).redirect('/image');
});


app.get('/image', function (req, res) { 
	var dataForImageScrolling = fs.readFileSync(path.resolve(__dirname, "./dataSub/dataInImage.txt"), 'utf8', {}); //legge i dati per lo scorrimento
	var arrImg = dataForImageScrolling.split("Ĭ"); //alt+300 unicode
	
	var data = {
		brig: arrImg[1],
		speed: arrImg[0],
		resTime: arrImg[3] / 1000,
		date: arrImg[2],

	}
	
	res.status(200).render('indexImage', {
		data: data
	});
})


app.post('/image', function (req, res) { 
	
	childSub.kill('SIGTERM', {});

	
	// la rimozione delle vecchie immagini e' fondamentale
	var i = 0
	var fileToRemove = fs.readFileSync(path.resolve(__dirname, './dataSub/numberOfFile.txt'), {}); //questo file DEVE esistere NON VA CANCELLATO o non funziona
	fileToRemove ++; //in modo tale da canellare anche il file con data e ora finale
	
	while(fileToRemove > i){ // questo perche child process fa schifo e non mi lascia fare sudo rm ./img/*.jpg
		
		//TODO cambiare con fs.unlink
		const removeImageFromFolder = child.spawnSync('sudo', ['rm', path.resolve(__dirname, `.r/img/input${i}.jpg`)], {}); //cancello tutti i file immagine da dalla cartella
		
		i++;
	}
	
	const file = req.files.imageToDisplay;//array di oggetti contenente tutti i file


	

	actualImage = []; // svuoto l'array

	
	if(file.length > 0){ //capisco se cio' che carico e' un array di file o solo un singolo file

		for(var i = 0; i<(file.length); i++){ 

			actualImage[i] = new Object(); //inizializzo l'oggetto

			actualImage[i].imgSrc = metaBase64.concat(file[i].data.toString('base64')); //converto il buffer dell immagine in base64 e gli aggiungo i metadati

			file[i].mv(path.resolve(__dirname, `./img/input${i}.jpg`), function(err) { //inserisco nel filesystem le immaggini
				if (err) return res.send(err);
			});

			//actualImage[i].name = 'img/input' + i +'.jpg';
			actualImage[i].name = file[i].name;

			actualImage[i].posNumber = i + 1;

			
		}
		numImg = file.length;
	} else {
		
		actualImage[0] = new Object();
		actualImage[0].imgSrc = metaBase64.concat(file.data.toString('base64')); //converto il buffer dell immagine in base64 e gli aggiungo i metadati

		file.mv(path.resolve(__dirname, './img/input0.jpg'), function(err) { //inserisco nel filesystem l'immagine
			if (err) return res.send(err);
		});

		//actualImage[0].name = 'img/input' + i +'.jpg';
		actualImage[0].name = file.name;

		actualImage[0].posNumber = i + 1;

		numImg = 1;
		
	}
	
	saveJson();

	//salvo il numero di file in modo tale da poterli eliminare al prossimo caricamento
	fs.writeFileSync(path.resolve(__dirname, './dataSub/numberOfFile.txt'), numImg, {});
	
	childSub = child.fork(path.resolve(__dirname, './dataSub/subIndexImage.js'), {});
	fs.writeFile(path.resolve(__dirname, './dataSub/lastMatrix.txt'), 1, {});

	res.status(300).redirect('dataImage');
});

/*
	Gestione delle richieste da /text
*/

app.get('/text', function (req, res) { 
	res.status(200).render('indexText', {});
})


app.post('/text', function (req, res) {
	
	childSub.kill('SIGKILL'); //INVIA IL SEGNALE DI CHIUSRA
	
	
	
	const item = req.body.userSearchInput;

	const s = req.body.speed;
	
	const brig = req.body.userSearchBright;
	
	const color = req.body.userSearchColor;
	const r = hexToRgb(color).r;
	const g = hexToRgb(color).g;
	const b = hexToRgb(color).b;
	
	/*
		-> I � carattere UNICODE realizzato con alt+300 il quale viene usato come divisore
		-> Unisco tutto in un unica stringa che poi scriver� sul file
	*/
	
	fs.writeFile(path.resolve(__dirname, './dataSub/dataInText.txt'), item.concat('I'+r+'I'+g+'I'+b+'I'+brig+'I'+s), (err)=>{
		if (err) throw err;
	}); 
	
	
	
	childSub = child.fork(path.resolve(__dirname, './dataSub/subIndexText.js'));
	fs.writeFile(path.resolve(__dirname, './dataSub/lastMatrix.txt'), 2, {});

	
	res.status(200).render('indexText', {});
});



app.get('/', function(req,res){ //pagina di base
	res.status(200).render('index', {});
});



app.listen(port, function(){
	console.log(`Server IP: 10.201.0.11 on port ${port}`);
});

function deleteImage(toDelete){
	for(var i = 0; i< actualImage.length; i++){
		if(actualImage[i].name == toDelete){ //trovato cosa cancellare
			
			actualImage = arrayRemove(actualImage, actualImage[i]);//cancello nell' array
			
			// TODO cambiare fs.unlink
			const removeImageFromFolder = child.spawnSync('sudo', ['rm', path.resolve(__dirname, `./img/input${i}.jpg`)], {}); //cancello effetivamente il file
			break;
		}
	}
	numImg --;

	fs.writeFileSync(path.resolve(__dirname, './dataSub/numberOfFile.txt'), numImg); //rendo effettivi i cambiamenti anche nel file
}

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

function arrayRemove(arr, value) {
	
	console.log(arr, value);
	return arr.filter(function(ele){
	    return ele != value;
	});

}

function saveJson() {
	
	const data = JSON.stringify(actualImage, null, 2);
	fs.writeFile(path.resolve(__dirname, './dataImage.json'), data);
}

function cleanImageFolder() {
	fs.readdirSync(path.resolve(__dirname, "./img"))
		.filter(file => file.includes(`input`))
		.map(file => path.resolve(__dirname, "./img")
			.concat("/")
			.concat(file))
		.forEach(filepath => fs.unlinkSync(filepath));
}
