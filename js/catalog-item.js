'use strict'

class CatalogItem {
    static setAttributes (searchResults) {
        CatalogItem.coreAttributes = [
            { type: "x-pixel" , title : "X (WCS)"         , id: "-12"},
            { type: "y-pixel" , title : "Y (WCS)"         , id: "-13"},
            { type: "ra"      , title : "Right Ascension"            },
            { type: "dec"     , title : "Declination"                },
            { type: "mag"     , title : "Visual Mag"                 }
        ];

        CatalogItem.imageAttributes = [
          { type: "x-image"   , title : "X (Image)"  , id : 1 },
          { type: "y-image"   , title : "Y (Image)"  , id : 2 },
          { type: "size"      , title : "Image Size" , id : 3 },
          { type: "saturated" , title : "Saturated"  , id : 4 },
          { type: "peak"      , title : "Peak Value" , id : 5 }
        ];

        CatalogItem.idAttributes = [];
        CatalogItem.dataAttributes = [];

        for (let id in searchResults.attributes) {
            let found = false;
            for (let attribute of CatalogItem.coreAttributes) {
                if (searchResults.attributes[id].type == attribute.type) {
                    attribute.id = id;
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (searchResults.attributes[id].type === "id") {
                    CatalogItem.idAttributes.push({
                        type : searchResults.attributes[id].type,
                        title : searchResults.attributes[id].name,
                        id : id
                    });
                } else if (searchResults.attributes[id].type === "data") {
                    CatalogItem.dataAttributes.push({
                        type : searchResults.attributes[id].type,
                        title : searchResults.attributes[id].name,
                        id : id
                    });
                }
            }
        }

        CatalogItem.idAttributes.sort((lhs, rhs) => {
            let lhsScore;
            if (lhs.title === "GCVS") {
                lhsScore = -2;
            } else if (lhs.title === "HD") {
                lhsScore = -1;
            } else {
                lhsScore = lhs.id;
            }

            let rhsScore;
            if (rhs.title === "GCVS") {
                rhsScore = -2;
            } else if (rhs.title === "HD") {
                rhsScore = -1;
            } else {
                rhsScore = rhs.id;
            }

            if (lhsScore < rhsScore) {
                return -1;
            }

            if (lhsScore > rhsScore) {
                return 1;
            }

            return 0;
        });
    }

    _id;
    _attributeValues = {};
    _imageValues = {};

    photometry = "low";

    constructor (id, attributeValues) {
        this._id = id;
        this._attributeValues = attributeValues;

        for (let attribute of CatalogItem.coreAttributes) {
            let value = this._attributeValues[attribute.id];
            if (value !== undefined) {
                this._attributeValues[attribute.id] = Number(value);
            }
        }
    }

    isInCatalog() {
        return Object.keys(this._attributeValues).length > 0;
    }

    isInImage() {
        return Object.keys(this._imageValues).length > 0;
    }

    getId () {
        return this._id;
    }

    getCoreValue (type) {
        for (let attribute of CatalogItem.coreAttributes) {
            if (attribute.type === type) {
                return this._attributeValues[attribute.id];
            }
        }
        return undefined;
    }

    setCoreValue (type, value) {
        for (let attribute of CatalogItem.coreAttributes) {
            if (attribute.type === type) {
                this._attributeValues[attribute.id] = value;
            }
        }
    }

    getImageValue (type) {
        for (let attribute of CatalogItem.imageAttributes) {
            if (attribute.type === type) {
                return this._imageValues[attribute.id];
            }
        }
        return undefined;
    }

    setImageValue (type, value) {
        for (let attribute of CatalogItem.imageAttributes) {
            if (attribute.type === type) {
                this._imageValues[attribute.id] = Number(value);
                return;
            }
        }
        throw "Cannot find type " + type;
    }

    getValueById (attributeId) {
        return this._attributeValues[attributeId];
    }

    getValue (attribute) {
        for (let imageAttribute of CatalogItem.imageAttributes) {
            if (imageAttribute === attribute) {
                return this._imageValues[attribute.id];
            }
        }
        return this._attributeValues[attribute.id];
    }

    getBestIdAttribute () {
        for (let attribute of CatalogItem.idAttributes) {
            if (this._attributeValues[attribute.id] !== undefined) {
                return attribute;
            }
        }
        return undefined;
    }

    getName () {
        let idAttribute = this.getBestIdAttribute ();
        if (idAttribute === undefined) {
            return "Unknown Star";
        }
        return idAttribute.title + " " + this._attributeValues[idAttribute.id];
    }

    isVariable () {
        for (let idAttribute of CatalogItem.idAttributes) {
            if (idAttribute.title === "GCVS") {
                let value = this._attributeValues[idAttribute.id];
                if (value !== undefined) {
                    //console.log ("Found GVCS " + value);
                    return true;
                }
                return false;
            }
        }
        return false;
    }
}

CatalogItem.coreAttributes = [];
CatalogItem.imageAttributes = [];
CatalogItem.idAttributes = [];
CatalogItem.dataAttributes = [];
