const ledMatrix = require(`easybotics-rpi-rgb-led-matrix`);
const path = require(`path`);
const fs = require(`fs`);
const Jimp = require(`jimp`);

(async () => {
        const matrix = new ledMatrix(32, 64, 1, 4);

        image = fs.readFileSync(path.resolve(__dirname, "./img/input0.jpg"));

        img = await Jimp.read(path.resolve(__dirname, "./img/input0.jpg"));

        console.log(img.bitmap, img.bitmap.data, 15.081);
/*
        matrix.setImageBuffer(rawImage.data, rawImage.width, rawImage.height);
        matrix.draw(0, 0, 0, 32, 0, 0, false, false)
*/
})().then(process.exit)

const rgbaToRgb = (arr) => arr.map((e, i) => i % 4 != 0 ? e : null);
