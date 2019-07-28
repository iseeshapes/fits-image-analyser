'use strict'

class FitsHeaderTable {
    constructor(tableId, controller) {
        this.tableId = tableId;
        this.controller = controller;
    }

    dataLoaded() {
        let html = '<thead><tr>'
                    + '<th class="attribute">Attribute</th>'
                    + '<th class="value">Value</th>'
                    + '<th class="comment">Comment</th>'
                    + '</tr></thead>';
        html += '<tbody>'
        for (let headerItem of this.controller.fitsHeader.headerItems) {
            if (headerItem.name === "COMMENT") {
                continue;
            }
            html += '<tr>'
                    + '<td class="attribute">' + headerItem.name + '</td>'
                    + '<td class="value">' + headerItem.value + '</td>'
                    + '<td class="comment">' + headerItem.comment + '</td>'
                    + '</tr>';
        }
        html += '</tbody>';

        $("#fitsHeaderTable").html(html);
    }

    setSelectedItem(caller, item) {
        //do nothing
    }
}
