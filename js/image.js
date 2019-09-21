'use strict'

class Image {
    name = "Unknown";
    width = -1;
    height = -1;
    pixels = [];
    items = [];
    wcs = null;

    _saturationValue = 65535;

    constructor (filename, fileContents, fitsHeader) {
        this.name = filename;

        if (2 !== fitsHeader.findNumber("NAXIS")) {
            throw "Wrong number of axises: " + this.fitsHeader.findNumber("NAXIS");
        }
        this.width = fitsHeader.findNumber("NAXIS1");
        this.height = fitsHeader.findNumber("NAXIS2");

        let offset = fitsHeader.findNumber("BZERO");
        let scale = fitsHeader.findNumber("BSCALE");
        let dataType = fitsHeader.findNumber("BITPIX");

        let pixel = undefined;
        let pixelSize = this.width * this.height;
        this.pixels = new Array(pixelSize);
        let increment;
        if (dataType === 8) {
            increment = 1;
            this._saturationValue = 255;
        } else if (dataType === 16) {
            increment = 2;
            this._saturationValue = 65535;
        } else if (dataType === -32) {
            increment = 4;
        } else {
            throw "Unknown BITPIX: " + dataType;
        }
        let dataSize = pixelSize * increment;
        let dataView = new DataView(fileContents, fitsHeader.dataLength, dataSize);
        for (let i=0;i<pixelSize;i++) {
            if (dataType === 16) {
                pixel = dataView.getInt16(i*increment, false);
            } else if (dataType === -32) {
                pixel = dataView.getFloat32(i*increment, false);
            }
            pixel *= scale;
            pixel += offset;
            this.pixels[i] = pixel;
        }
    }

    convertXYtoRaDec (x, y){
        let raDec = this.wcs.pix2sky (x, y);
        return {
            ra: Angle.toRadians(raDec[0]),
            dec: Angle.toRadians(raDec[1])
        };
    }

    setWCS (wcs) {
        this.wcs = wcs;

        let top          = this.convertXYtoRaDec(this.width/2, 0            );
        let bottom       = this.convertXYtoRaDec(this.width/2, this.height  );
        let left         = this.convertXYtoRaDec(0           , this.height/2);
        let right        = this.convertXYtoRaDec(this.width  , this.height/2);

        this.topLeft     = this.convertXYtoRaDec(0           , 0            );
        this.topRight    = this.convertXYtoRaDec(this.width  , 0            );
        this.bottomLeft  = this.convertXYtoRaDec(0           , this.height  );
        this.bottomRight = this.convertXYtoRaDec(this.width  , this.height  );

        this.rotation    = Math.atan((bottom.dec - top.dec) / (bottom.ra - top.ra));
        this.widthAngle  = Math.sqrt(Math.pow(right.ra - left.ra, 2) + Math.pow(right.dec - left.dec, 2));
        this.heightAngle = Math.sqrt(Math.pow(bottom.ra - top.ra, 2) + Math.pow(bottom.dec - top.dec, 2));
        this.fieldOfView = Math.sqrt(Math.pow(this.topLeft.ra - this.bottomRight.ra, 2)
                                + Math.pow(this.topLeft.dec - this.bottomRight.dec, 2));
        this.pixelField  = this.fieldOfView / Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
        this.center      = {
            ra : left.ra + (right.ra - left.ra) / 2,
            dec: top.dec + (bottom.dec - top.dec) / 2
        };

        console.log("Center => RA: " + Angle.printHours(this.center.ra)
                + ", DEC: " + Angle.printDegrees(this.center.dec));
        console.log("Rotation: " + Angle.toDegrees(this.rotation)
                + ", Width: " + Angle.toDegrees(this.widthAngle)
                + ", Height: " + Angle.toDegrees(this.heightAngle));
    }

    _calculatePhotomtricValues (item, star) {
        let minimum = this._saturationValue * 0.15;
        let maximum = this._saturationValue * 0.85;
        if (star.peakValue >= this._saturationValue) {
            item.photometry = "saturated"
        } else if (star.peakValue < minimum) {
            item.photometry = "low";
        } else if (star.peakValue > maximum) {
            item.photometry = "high";
        } else {
            item.photometry = "good";
        }
        item.setImageValue("peak", star.peakValue);
    }

    createItems (searchResults) {
        CatalogItem.setAttributes(searchResults);

        console.log("Items returned " + searchResults.items.length);

        let nextId = 0;
        this.items = [];
        for (let item of searchResults.items) {
            let catalogItem = new CatalogItem(nextId, item.attributes)
            let ra = Angle.toDegrees(catalogItem.getCoreValue("ra"));
            let dec = Angle.toDegrees(catalogItem.getCoreValue("dec"));
            let xy = this.wcs.sky2pix(ra, dec);
            catalogItem.setCoreValue("x-pixel", xy[0]);
            catalogItem.setCoreValue("y-pixel", this.height - xy[1]);
            this.items.push(catalogItem);
            nextId++;
        }

        let starFinder = new StarFinder (this);
        if (searchResults.query.type === "radius") {
            let radiusSquared = Math.pow(searchResults.query.r / this.pixelField, 2);
            //let radiusSquared = Math.pow(Angle.toDegrees(searchResults.query.radius), 2);
            //let ra = Angle.toDegrees(searchResults.query.ra);
            //let dec = Angle.toDegrees(searchResults.query.dec);
            starFinder.stars = starFinder.stars.filter((star, index, array) => {
                //let raDec = this.wcs.pix2sky(star.x, star.y);
                //let raSquared = Math.pow(raDec[0] - ra, 2);
                //let decSquared = Math.pow(raDec[1] - dec, 2);
                //return raSquared + decSquared < radiusSquared;
                let distanceSquared = Math.pow(star.x - this.width / 2, 2) + Math.pow(star.y - this.height / 2, 2);
                return distanceSquared < radiusSquared;
            });
        }
        let distance;
        let closestDistance;
        let closestStar;
        let x;
        let y;
        for (let item of this.items) {
            x = item.getCoreValue("x-pixel");
            y = item.getCoreValue("y-pixel");
            closestDistance = 5;
            closestStar = undefined;
            for (let i=0;i<starFinder.stars.length;i++) {
                distance = Math.sqrt(Math.pow(x - starFinder.stars[i].x, 2)
                    + Math.pow(y - starFinder.stars[i].y, 2));
                if (distance < closestDistance) {
                    closestStar = i;
                    distance = closestDistance;
                }
            }
            if (closestStar !== undefined) {
                item.setImageValue("x-image", starFinder.stars[closestStar].x);
                item.setImageValue("y-image", starFinder.stars[closestStar].y);
                item.setImageValue("size", starFinder.stars[closestStar].size);
                this._calculatePhotomtricValues(item, starFinder.stars[closestStar]);
                starFinder.stars.splice(closestStar, 1);
            }
        }

        let item;
        for (let i=0;i<starFinder.stars.length;i++) {
            let star = starFinder.stars[i];
            if (star.size > 3) {
                //console.log("Missing => x: " + star.x + ", y: " + star.y + ", size: " + star.size);
                item = new CatalogItem(nextId + i, {});
                item.setImageValue("x-image", starFinder.stars[i].x);
                item.setImageValue("y-image", starFinder.stars[i].y);
                item.setImageValue("size", starFinder.stars[i].size);
                this._calculatePhotomtricValues(item, starFinder.stars[i]);
                this.items.push(item);
            }
        }
        console.log("Stars in image not matched: " + starFinder.stars.length);
    }
}
