'use strict';

class SipData {
    static createPolynomial(fitsHeader, prefix) {
        let order = fitsHeader.findNumber(prefix + "_ORDER");
        if (order !== 2) {
            throw "Fits header item " + prefix + "_ORDER must be 2";
        }
        return { 
            order : order,
            terms: [
                fitsHeader.findNumber(prefix + "_0_0"),
                fitsHeader.findNumber(prefix + "_0_1"),
                fitsHeader.findNumber(prefix + "_0_2"),
                fitsHeader.findNumber(prefix + "_1_0"),
                fitsHeader.findNumber(prefix + "_1_1"),
                fitsHeader.findNumber(prefix + "_2_0"),
            ]
        };
    }

    constructor (fitsHeader) {
        if ("RA---TAN-SIP" !== fitsHeader.findString("CTYPE1") || "DEC--TAN-SIP" !== fitsHeader.findString("CTYPE2")) {
            throw "No WCS/SIP information found in header";
        }

        this.imageWidth = fitsHeader.findNumber("IMAGEW");
        this.imageHeight = fitsHeader.findNumber("IMAGEH");

        this.referencePixel = {
            "x" : fitsHeader.findNumber("CRPIX1"),
            "y" : fitsHeader.findNumber("CRPIX2"),
            "rightAscension" : Angle.toRadians(fitsHeader.findNumber("CRVAL1")),
            "declination" : Angle.toRadians(fitsHeader.findNumber("CRVAL2"))
        };

        this.transformationMatrix = [
            [ fitsHeader.findNumber("CD1_1"), fitsHeader.findNumber("CD1_2") ],
            [ fitsHeader.findNumber("CD2_1"), fitsHeader.findNumber("CD2_2") ]
        ];

        this.a = SipData.createPolynomial(fitsHeader, "A");
        this.b = SipData.createPolynomial(fitsHeader, "B");
        this.invA = SipData.createPolynomial(fitsHeader, "AP");
        this.invB = SipData.createPolynomial(fitsHeader, "BP");
    }
}
