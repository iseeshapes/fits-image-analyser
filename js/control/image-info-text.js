'use strict'

class ImageInfoText {
    _imageInfoId;
    _siteController;

    constructor(imageInfoId, siteController) {
        this._imageInfoId = imageInfoId;
        this._siteController = siteController;
    }

    noImage () {
        this.printText ();
    }

    clear () {
        this.printText ();
    }

    dataLoaded () {
        this.printText ();
    }

    printText () {
        let image = this._siteController.image;
        let text = "File: ";
        if (image === undefined || image === null) {
            text += "No Image Loaded";
        } else {
            text += image.name;
            if (image.wcs == null) {
                text += " (No WCS Data in header)";
            } else {
                text += ", RA: " + Angle.printHours(image.center.ra);
                text += ", Dec: " + Angle.printDegrees(image.center.dec);
                text += ", Rotation: " + Math.round(Angle.toDegrees(image.rotation) * 10.0) / 10.0 + "&deg;";
                text += ", FOV: " + Math.round(Angle.toDegrees(image.fieldOfView) * 10.0) / 10.0 + "&deg;";
            }
        }

        $("#" + this._imageInfoId).html(text);
    }

    setSelectedItem (caller, item) {
    }

    overlayEnabled(enabled) {
    }
}
