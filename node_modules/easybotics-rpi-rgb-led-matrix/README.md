# easybotics-rpi-rgb-led-matrix

# WORKS ON THE RASPBERRY PI 3B AND RASPBERRY PI 4!!!!
# tested on node 8 and node 10, probably works on node13 now 
# check out this guys fork: https://github.com/easybotics/node-rpi-rgb-led-matrix/pull/9 
# targetted at raspbian jesse 
Pilot your rgb led matrix with Nodejs on Raspberry Pi ! Nodejs binding of rpi-rgb-led-matrix library https://github.com/hzeller/rpi-rgb-led-matrix


**Fork of: https://github.com/zeitungen/node-rpi-rgb-led-matrix**

**Actively being maintained and modified for: https://github.com/easybotics/node-red-contrib-led-matrix**

**It is binding recent version of rpi-rgb-led-matrix library.**


### Installation with npm
```
$ npm i easybotics-rpi-rgb-led-matrix
```

### Installation with git

```
$ git clone --recursive https://github.com/easybotics/node-rpi-rgb-led-matrix.git
$ cd easybotics-rpi-rgb-led-matrix
$ npm i
```

## Get some Fun

```js
var LedMatrix = require("easybotics-rpi-rgb-led-matrix");

//init a 16 rows  by 16 cols led matrix 
//default hardware mapping is 'regular', could be 'adafruit-hat-pwm' ect 
var matrix = new LedMatrix(16, 16 );
matrix.fill(255, 50, 100);
matrix.setPixel(0, 0, 0, 50, 255);
matrix.update();
```

The API has changed somewhat since the zeitungen version
## LedMatrix API

**All operations modify a local frame buffer, only after calling 'Update' are they printed to the display**
* **Constructor: LedMatrix (rows, cols, chainedDisplays, parallelDisplays, brightness, hardware-mapping, rgbSequence, cliFlags)**
```
	rows: height of led panels in pixels
	cols: width of led panels in pixels
	chainedDisplays: number of chained panels
	parallelDisplays: number of parallel panels
	brightness: initial brightness 0 - 100
	hardware-mapping: 'regular', 'adafruit-hat' etc
	rgbSequence: default 'RGB'
	cliFlags: array of cli flags
```
* **brightness (value)**
```
	set brightness between 0 - 100
```
* **clear ()**
```
	clear the display buffer
```
* **drawCircle (x, y, radius, r, g, b)**
```
	draw colored circle to the buffer
```
* **drawLine (x0, y0, x1, y1, r, g, b)** 
```
	draw colored line to the buffer
```
* **drawText (x, y, text, font, r, g, b)**
``` 
	draw colored text to the buffer
	to use the fonts that come with the repo it looks something like this

	const input = "hello world!"; //whever you get the input from
	const font  =  __dirname + '/fonts/' + "5x8.bdf";
	led.drawText(x, y, input, font, r, g, b);
	led.update();
```
* **fill (r, g, b)**
```
	fill the buffer with a color
```
* **getHeight ()**
```
	get height of addressable space
```
* **getWidth ()**
```
	get width of addressable space
```
```
scroll
setImageBuffer
mysterious methods back from before we picked up this library 
```
* **setPixel (x, y, r, g, b)**
```
	set pixel to a color
```
* **update ()**
```
	Draw the current buffer to the display (with vsync!)
```


