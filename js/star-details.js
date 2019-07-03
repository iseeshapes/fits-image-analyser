'use strict';

class StarDetails {
    constructor (tableId, siteController) {
        this.tableId = tableId;
        this.siteController = siteController;
    }

    dataLoaded () {
        //do nothing...
    }

    createRow (attribute, item) {
        let html = '<tr>';
        html += '<td class="attributeTitle">' + attribute.title + '</td>';
        html += '<td class="attributeValue">';
        if (item.attributes[attribute.id] !== undefined) {
            if (attribute.type == "x-pixel" || attribute.type == "y-pixel" || attribute.type === "mag") {
                let value = Math.round(item.attributes[attribute.id] * 10) / 10;
                html += value;
                if (value % 1 == 0) {
                    html += ".0";
                }
            } else if (attribute.type === "ra") {
                html += Angle.printHours(item.attributes[attribute.id]);
            } else if (attribute.type === "dec") {
                html += Angle.printDegrees(item.attributes[attribute.id]);
            } else {
                html += item.attributes[attribute.id];
            }
        }
        html += '</td></tr>';
        return html;
    }

    setSelectedItem (caller, item) {
        let html = "";
        for (let coreAttribute of this.siteController.coreAttributes) {
            html += this.createRow(coreAttribute, item);
        }
        for (let idAttribute of this.siteController.idAttributes) {
            html += this.createRow(idAttribute, item);
        }
        for (let dataAttribute of this.siteController.dataAttributes) {
            html += this.createRow(dataAttribute, item);
        }
        $("#" + this.tableId).html(html);
    }
}