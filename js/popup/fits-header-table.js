'use strict'

class FitsHeaderTable {
    constructor(tableId, controller) {
        this.tableId = tableId;
        this.controller = controller;
    }

    clear () {
        $("#fitsHeaderTable tbody").html("");
    }

    dataLoaded(image) {
        let html = ""
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

        $("#fitsHeaderTable tbody").html(html);
    }

    setSelectedItem(caller, item) {
        //do nothing
    }

    overlayEnabled (enabled) {
    }
}
