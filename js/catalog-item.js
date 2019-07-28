'use strict'

class CatalogItem {
    static coreAttributes = [];
    static imageAttributes = [];
    static idAttributes = [];
    static dataAttributes = [];

    static setAttributes (searchResults) {
        CatalogItem.coreAttributes = [
            { type: "x-pixel" , title : "X (WCS)"    , id: "-12"},
            { type: "y-pixel" , title : "Y (WCS)"    , id: "-13"},
            { type: "ra"      , title : "Right Ascension" },
            { type: "dec"     , title : "Declination"     },
            { type: "mag"     , title : "Visual Mag"      }
        ];

        CatalogItem.imageAttributes = [
          { type: "x-image" , title : "X (Image)"       , id : 1 },
          { type: "y-image" , title : "Y (Image)"       , id : 2 },
          { type: "size"    , title : "Image Size"      , id : 3 }
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
    }

    _id;
    _attributeValues = {};
    _imageValues = {};

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

    getValue (attribute) {
        for (let imageAttribute of CatalogItem.imageAttributes) {
            if (imageAttribute === attribute) {
                return this._imageValues[attribute.id];
            }
        }
        return this._attributeValues[attribute.id];
    }

    getName () {
        for (let attribute of CatalogItem.idAttributes) {
            if (this._attributeValues[attribute.id] !== undefined) {
                return attribute.title + ": " + this._attributeValues[attribute.id];
            }
        }
        return "Unknown Star";
    }
}
