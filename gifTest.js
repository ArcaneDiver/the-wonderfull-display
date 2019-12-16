const gifFrames = require('gif-frames');
const jimp = require("jimp");
const LedMatrix = require(`easybotics-rpi-rgb-led-matrix`);
const path = require("path");

const matrix = new LedMatrix(32, 64, 1, 4);

matrix.clear();
matrix.update();
matrix.brightness(50);

(async () => {
        let images = [];

        const frameData = await gifFrames({ url: './img/gif.gif', frames: "all" });
        
        for (frame in frameData) {
                const jimpImage = await jimp.read(frameData[frame].getImage().read());
                
                jimpImage.resize(128, 32)
                jimpImage.write(`./gif/${frame}.jpg`)
                images.push(jimpImage.bitmap);
        }
        console.log(images[0].data)
        images = images.map((img, i) => {
                img.data = img.data.filter((e, i) => ((i+1) % 4) !== 0);
                return img;
        })

        console.log("rgb created");

        const rgb = [
                [61, 191, 240],
                [142, 247, 139],
                [247, 136, 247]
        ];

        while (1) {
                console.log(images[0].width, images[0].height)
                for (i in images) {
                        const r = Math.round(((Math.random() + 1) * 2 - 2));

                        matrix.clear();
                        matrix.setImageBuffer(images[i].data, images[i].width, images[i].height);
                        matrix.draw(0, 0);
                        matrix.drawText(128, 10, "Buon Natale", path.resolve(__dirname, './fonts/10x20.bdf'), rgb[r][0], rgb[r][1], rgb[r][2]);
                        matrix.update();
                        delay(25);
                }
        }

})().then(process.exit)


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