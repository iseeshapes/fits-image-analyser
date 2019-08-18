'use strict';

class StarFinder {
    stars = [];
    pixels = [];
    width = -1;
    height = -1;

    constructor (image) {
        //this.test ();

        this.stars = [];
        this.pixels = image.pixels;
        this.width = image.width;
        this.height = image.height

        let minimum = 0;
        let maximum = 65535;
        for (let i=0;i<2;i++) {
            let count = 0;
            this.average = 0;
            for (let pixel of this.pixels) {
                if (minimum <= pixel && pixel <= maximum) {
                    this.average += pixel;
                    count++;
                }
            }
            this.average = this.average / count;

            count = 0;
            this.standardDeviation = 0;
            for (let pixel of this.pixels) {
                if (minimum <= pixel && pixel <= maximum) {
                    this.standardDeviation += Math.pow(this.average - pixel, 2);
                    count++;
                }
            }
            this.standardDeviation = Math.sqrt(this.standardDeviation / count);
            minimum = this.average - this.standardDeviation * 3;
            maximum = this.average + this.standardDeviation * 3;
        }
        this.floor = this.average + this.standardDeviation * 3;

        console.log("average: " + this.average + ", std dev: " + this.standardDeviation + ", floor: " + this.floor);

        let index = 0;
        let x;
        let y;
        for (let pixel of this.pixels) {
            x = index % this.width;
            y = this.height - Math.floor(index / this.width) - 1;

            if (pixel > this.floor) {
                let found = false;
                for (let star of this.stars) {
                    if (Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2)) < star.size) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    let star = this.findStar(x, y);
                    if (star !== null) {
                        this.stars.push(star);
                    }
                }
            }
            index++;
        }
    }

    test2(x, y, index, width, height) {
        let newIndex = ((height - y - 1) * width) + x
        let xNew = index % width;
        let yNew = height - Math.floor(index / width) - 1;

        console.log("(x: " + x + ", y: " + y + ", index: " + newIndex + ") "
            + "output => (index: " + index + ", x: " + xNew + ", y: " + yNew + ")");
    }

    test() {
        let width = 2;
        let height = 2;
        console.log("Test width: " + width + ", height: " + height);
        this.test2 (0, 0, 2, width, height);
        this.test2 (0, 1, 0, width, height);
        this.test2 (1, 0, 3, width, height);
        this.test2 (1, 1, 1, width, height);

        width = 3;
        height = 2;
        console.log("Test width: " + width + ", height: " + height);
        this.test2 (0, 0, 3, width, height);
        this.test2 (0, 1, 0, width, height);
        this.test2 (1, 0, 4, width, height);
        this.test2 (1, 1, 1, width, height);
        this.test2 (2, 0, 3, width, height);
        this.test2 (2, 1, 2, width, height);
    }

    getIndex(x, y) {
        if (0 > x || x >= this.width || 0 > y || y >= this.height) {
            throw "Invalid coordinates x: " + x + ", y: " + y;
        }
        return ((this.height - y - 1) * this.width) + x;
    }

    getValue (x, y, highest) {
        if (0 > x || x >= this.width || 0 > y || y >= this.height) {
            return highest;
        }
        let index = this.getIndex(x, y);
        let pixel = this.pixels[index];
        if (pixel <= highest.i) {
            return highest;
        }
        return { x : x, y : y , i : pixel};
    }

    crawPixels (x, y, i) {
        let star = { x: x, y: y, i : i };
        let highest = this.getValue(x, y, star);

        highest = this.getValue(x-1, y-1, highest);
        highest = this.getValue(x-1, y, highest);
        highest = this.getValue(x-1, y+1, highest);
        highest = this.getValue(x, y-1, highest);
        highest = this.getValue(x, y+1, highest);
        highest = this.getValue(x+1, y-1, highest);
        highest = this.getValue(x+1, y, highest);
        highest = this.getValue(x+1, y+1, highest);

        if (highest.x === x && highest.y === y) {
            return highest;
        }
        return this.crawPixels(highest.x, highest.y, highest.i);
    }

    calculateXMin (x, y) {
        let index;
        while (true) {
            index = this.getIndex(x, y);
            if (this.pixels[index] < this.average) {
                break;
            }
            x--;
            if (x < 0) {
                return null;
            }
        }
        return x;
    }

    calculateXMax (x, y) {
        let index;
        while (true) {
            index = this.getIndex(x, y);
            if (this.pixels[index] < this.average) {
                break;
            }
            x++;
            if (x >= this.width) {
                return null;
            }
        }
        return x;
    }

    calculateYMin (x, y) {
        let index;
        while (true) {
            index = this.getIndex(x, y);
            if (this.pixels[index] < this.average) {
                break;
            }
            y--;
            if (y <= 0) {
                return null;
            }
        }
        return y;
    }

    calculateYMax (x, y) {
        let index;
        while (true) {
            index = this.getIndex(x, y);
            if (this.pixels[index] < this.average) {
                break;
            }
            y++;
            if (y >= this.height) {
                return null;
            }
        }
        return y;
    }

    calculateCenterOfMass (xMin, xMax, yMin, yMax) {
        let index;
        let xCenterMass = 0;
        let yCenterMass = 0;
        let totalMass = 0;
        let peakValue = 0;
        for (let x=xMin;x<=xMax;x++) {
            for (let y=yMin;y<=yMax;y++) {
                index = this.getIndex(x, y);
                xCenterMass += this.pixels[index] * x;
                yCenterMass += this.pixels[index] * y;
                totalMass += this.pixels[index];
                if (this.pixels[index] >= peakValue) {
                    peakValue = this.pixels[index];
                }
            }
        }

        return {
            x : xCenterMass / totalMass,
            y : yCenterMass / totalMass,
            size : Math.sqrt(Math.pow(xMax - xMin, 2) + Math.pow(yMax - yMin, 2)),
            peakValue : peakValue
        };
    }

    findStar(x, y) {
        let index = this.getIndex(x, y);
        let pixel = this.pixels[index];
        let starCoords = this.crawPixels (x, y, 0);
        if (starCoords === null) {
            return null;
        }

        let xMin = this.calculateXMin(starCoords.x, starCoords.y);
        if (xMin === null) {
            return null;
        }

        let xMax = this.calculateXMax(starCoords.x, starCoords.y);
        if (xMax === null) {
            return null;
        }

        let yMin = this.calculateYMin(starCoords.x, starCoords.y);
        if (yMin === null) {
            return null;
        }

        let yMax = this.calculateYMax(starCoords.x, starCoords.y);
        if (yMax === null) {
            return null;
        }

        if (xMax - xMin < 7 || yMax - yMin < 7) {
            //console.log("xMin: " + xMin + ", xMax: " + xMax + ", yMin: " + yMin + ", yMax: " + yMax);
            return null;
        }

        let star = this.calculateCenterOfMass (xMin, xMax, yMin, yMax);
        star.startX = x;
        star.startY = y;
        return star;
    }

}
