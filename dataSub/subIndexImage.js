/*

    Autore: Michele Della Mea

*/


const ledMatrix = require('easybotics-rpi-rgb-led-matrix');
const child = require('child_process');
const fs = require('fs');
const path = require('path');
const Jimp = require("jimp");

const matrix = new ledMatrix(32, 64, 1, 4);


// Nel caso in cui la funzione principale crashi questo while riparte
(async () => {
    while (1) {
        const timeStart = new Date().getTime();

        // Funzione principale
        await (async () => {
            while (1) {

                // Svuoto la matrice
                matrix.clear();
                matrix.update();

                var dataForImageScrolling = fs.readFileSync(path.resolve(__dirname, './dataInImage.txt'), 'utf8', {}); //legge i dati per lo scorrimento

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

                var numberOfFile = fs.readFileSync(path.resolve(__dirname, './numberOfFile.txt'), {}); //leggo il file che contiene il numero di immagini e visto che le immagini vengono salvate da input0 non aggiungo niente


                if (parseInt(arrImg[2])) { //se è 1 nel file

                    var actualDate = new Date(); //otengo la data e poi il resto dei dati

                    var day = actualDate.getDate().toString(), month = (actualDate.getMonth() + 1).toString(), year = actualDate.getFullYear().toString(), hour = actualDate.getHours().toString(), minute = actualDate.getMinutes().toString();
                    var timeStrinbg;

                    if (day < 10) {
                        timeString = "0" + day;
                    } else {
                        timeString = day;
                    }

                    if (month < 10) {
                        timeString = timeString.concat('/0', month);
                    } else {
                        timeString = timeString.concat('/' + month);
                    }

                    timeString = timeString.concat('/' + year + '   ');

                    if (hour < 10) {
                        timeString = timeString.concat('0' + hour + ':');
                    } else {
                        timeString = timeString.concat(hour + ':');
                    }

                    if (minute < 10) {
                        timeString = timeString.concat('0' + minute);
                    } else {
                        timeString = timeString.concat(minute);
                    }

                    var createImageWithTime = child.spawnSync('sudo', ['convert', path.resolve(__dirname, '../img/empty.jpg'), '-gravity', 'center', '-pointsize', '30', '-size', '256x32', '+antialias', '-fill', 'green', '-annotate', '0x0+0+3', timeString, path.resolve(__dirname, `../img/input${numberOfFile}.jpg`)]);
                } else {
                    try {
                        fs.unlinkSync(path.resolve(__dirname, `../img/input${numberOfFile}.jpg`)); //rimuovo l'ultimo perche senno la include lo stesso
                        console.log("Eliminazione del file", `input${numberOfFile}`);
                    } catch (_) { }
                }
                //delay(1000);


                // ImageMagick https://imagemagick.org/index.php
                // Converto tutte le immagini
                const convert = child.spawnSync('sudo', ['convert', path.resolve(__dirname, '../img/input*.jpg'), '+append', '-crop', '100000x32+0+0', path.resolve(__dirname, '../img/converted/input.jpg')]); //+append serve per concatenare le immagini

                if (convert.error) {
                    convert.output.forEach(buffer => buffer !== null ? console.error(buffer.toString()) : null);
                    continue;
                }

                // Se non ci sono immagini
                if (!fs.existsSync(path.resolve(__dirname, "../img/converted/input.jpg")) || fs.readFileSync(path.resolve(__dirname, "../img/converted/input.jpg")).toString() === "" || existInputImages() || numberOfFile <= 0) {
                    continue;
                }


                try {

                    // Leggo l`immagine con jimp
                    const bundledImage = await Jimp.read(path.resolve(__dirname, "../img/converted/input.jpg"));


                    // converto la bitmap da rgba a rgb
                    bundledImage.bitmap.data = bundledImage.bitmap.data.filter((e, i) => ((i + 1) % 4) !== 0);


                    const { data: imageBuffer, width, height } = bundledImage.bitmap;


                    matrix.setImageBuffer(imageBuffer, width, height);// setto l' immagine nel buffer


                    // Inizio a far scorrere
                    var x = 0;
                    var x1 = 256;
                    while (x1 != 0) { //serve per farlo *comparire* dal destra la prima volta
                        matrix.clear();
                        matrix.draw(x1, 0, 256, 32, 0, 0, false, false);
                        matrix.update();
                        x1--;
                        delay(tDelay);
                    }


                    while (x < width) { //serve per farlo *scomparire* a sinistra

                        matrix.clear();
                        matrix.draw(0, 0, 256, 32, x, 0, false, false);
                        matrix.update();
                        x++;

                        delay(tDelay);
                    }


                    if ((Date.now() - timeStart > parseInt(arrImg[3], 10)) && parseInt(arrImg[3], 10) != -1) {

                        console.log('uscito tempo scaduto');
                        break;
                    }
                } catch (_) {
                    console.error(_);
                }

            }

            var clock = child.spawn(path.resolve(__dirname, '../dataSub/example/clock'), ['--led-cols', '64', '--led-rows', '32', '--led-chain', '4', '-f', './fonts/10x20.bdf', '-b', '30', '-C', '0,255,0', '-y', '5', '-d', "%d/%m/%Y       %H:%M:%S"], {});

            process.once('SIGTERM', function () {
                console.log('caught');
                clock.kill('SIGKILL');
            });
        })();
    }
})();

function delay(ms) {

    var cur_d = new Date();
    var cur_ticks = cur_d.getTime();
    var ms_passed = 0;

    while (ms_passed < ms) {
        var d = new Date();
        var ticks = d.getTime();
        ms_passed = ticks - cur_ticks;
    }

}
 
function existInputImages() {
    return fs.readdirSync(path.resolve(__dirname, "../img")).filter(file => file.includes(`input`)).length === 0;
}
