'use strict';

class StarDetailsTable {
    constructor (tableId, siteController) {
        this._tableId = tableId;
        //this._siteController = siteController;
    }

    dataLoaded () {
        //do nothing...
    }

    createRow (attribute, item) {
        let html = '<tr>';
        html += '<td class="attributeTitle">' + attribute.title + '</td>';
        html += '<td class="attributeValue">';
        if (item.getValue(attribute) !== undefined) {
            if (attribute.type == "x-pixel" || attribute.type == "y-pixel"
                    || attribute.type == "x-image" || attribute.type == "y-image"
                    || attribute.type === "mag" || attribute.type == "size") {
                let value = Math.round(item.getValue(attribute) * 10) / 10;
                html += value;
                if (value % 1 == 0) {
                    html += ".0";
                }
            } else if (attribute.type === "ra") {
                html += Angle.printHours(item.getValue(attribute));
            } else if (attribute.type === "dec") {
                html += Angle.printDegrees(item.getValue(attribute));
            } else {
                html += item.getValue(attribute);
            }
        }
        html += '</td></tr>';
        return html;
    }

    setSelectedItem (caller, item) {
        let html = "";
        if (item !== undefined) {
            for (let attribute of CatalogItem.coreAttributes) {
                html += this.createRow(attribute, item);
            }
            for (let attribute of CatalogItem.imageAttributes) {
                html += this.createRow(attribute, item);
            }
            for (let attribute of CatalogItem.idAttributes) {
                html += this.createRow(attribute, item);
            }
            for (let attribute of CatalogItem.dataAttributes) {
                html += this.createRow(attribute, item);
            }
        }
        $("#" + this._tableId).html(html);
    }
}
