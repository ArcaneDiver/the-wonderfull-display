var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var fileUpload = require('express-fileupload');
const child = require('child_process');

var app = express();
app.use(fileUpload());

childSub = child.fork('subIndexImage.js');

var port = process.env.PORT || 3000;

// setting up views
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
	*/
app.get('/', function (req, res) { // detecta entrata in /
	
    res.render('indexImage', {});
})


app.post('/', async function (req, res) { // bottone cliccato
    let file = req.files.imageToDisplay;
    console.log(file, req.body, req.file);
    file.mv('img/input.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
    
        console.log('File uploaded!');
      });
	
	res.render('indexImage', {});
	
	
});
	

app.listen(port, '10.201.0.11');


