'use strict'

class FitsImage {
    _average = 0;
    _standardDeviation = 0;
    _imageData;

    constructor (canvasId, siteController) {
        this._canvasId = canvasId;
        this._siteController = siteController;
    }

    dataLoaded (image) {
        this._pixels = image.pixels;
        this._width = image.width;
        this._height = image.height;

        for (let pixel of this._pixels) {
            this._average += pixel;
        }
        this._average = this._average / this._pixels.length;

        let standardDeviation = 0;
        for (let pixel of this._pixels) {
            this._standardDeviation += Math.pow(this._average - pixel, 2);
        }
        this._standardDeviation = Math.sqrt(this._standardDeviation / this._pixels.length);
        console.log("average: " + this._average + ", stdDev: " + this._standardDeviation);

        this.draw ();
    }

    draw () {
        let canvas = document.getElementById(this._canvasId);
        canvas.width = this._width;
        canvas.height = this._height;

        let minimum = this._average - this._standardDeviation / 2;
        let maximum = this._average + this._standardDeviation;
        let ratio = (255) / (maximum - minimum);
        console.log("minimum: " + minimum + ", maximum: " + maximum);

        let ctx = canvas.getContext('2d');
        this._imageData = ctx.getImageData(0, 0, this._width, this._height);
        let data = this._imageData.data;
        console.log("Got data");

        let index;
        let x;
        let y;
        for (let i=0;i<this._pixels.length;i++) {
            let value = this._pixels[i];
            value -= minimum;
            if (value < 0) {
                value = 0;
            } else if (value > maximum - minimum) {
                value = maximum - minimum;
            }

            x = i % this._width;
            y = this._height - Math.floor(i / this._width) - 1;
            index = (y * this._width + x) * 4;

            value = Math.round(value * ratio);
            value = 255 - value;

            data[index] = value;
            data[index + 1] = value;
            data[index + 2] = value;
            data[index + 3] = 255;

            index += 4;
        }

        console.log("Calculated pixel values");

        ctx.putImageData(this._imageData, 0, 0);

        console.log("Put image data");
    }

    zoom (zoom) {
        let drawCanvas = document.createElement('canvas');
        if (zoom <= 1) {
            drawCanvas.width = this._width;
            drawCanvas.height = this._height;
        } else {
            drawCanvas.width = this._width * zoom;
            drawCanvas.height = this._height * zoom;
        }
        let drawContext = drawCanvas.getContext('2d');
        drawContext.putImageData(this._imageData, 0, 0);
        drawContext.scale(zoom, zoom);
        drawContext.drawImage(drawCanvas, 0, 0);
        let imageData = drawContext.getImageData(0, 0, this._width * zoom, this._height * zoom);

        let canvas = document.getElementById(this._canvasId);
        canvas.width = this._width * zoom;
        canvas.height = this._height * zoom;
        let context = canvas.getContext('2d');
        context.putImageData(imageData, 0, 0);
        context.drawImage(canvas, 0, 0);

        drawCanvas.remove();
    }
}
