# easybotics-rpi-rgb-led-matrix
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

* **Constructor: LedMatrix(rows, cols,  chainedDisplays, parallelDisplays, brightness,  hardware-mapping)**
  default values are `rows=32`, `cols=32`,  `chainedDisplays=1`, `parallelDisplay=1`, 'brightness=100', `hardware-mapping=regular`
* **getWidth()** return current led matrix width
* **getHeight()** return current led matrix height
* **fill(red, green, blue)** fill the led matrix buffer with color specified
  by `red`, `green` and `blue`. `red`, `green` and `blue` must be between `0` and `255` 
* **setPixel(x, y, red, green, blue)** set the color pixel at the position `x`,`y` 
  with color specified by `red`, `green` and `blue`. `red`, `green` and `blue` must be
  between `0` and `255`. `x` must be between `0` and `getWidth()`. `y` must be between
  `0`and `getGeight()`
* **drawText(x, y, r, g, b, text, fontFile)** draws colored text to the buffer 
* **drawCircle(x, y, radius, r, g, b)** draws colored circle to the buffer 
* **drawLine(x0, y0, x1, y1, r, g, b)** draws colored lines to the buffer
* **clear()** reset the led matrix display buffer (shut down all leds)
* **update()** draw the current buffer to the display with vsync
