'use strict';

class StarList {
    _tableId;
    _siteController;
    _rows;

    constructor(tableId, siteController) {
        this._tableId = tableId;
        this._siteController = siteController;
    }

    dataLoaded() {
        this._attributes = [];
        for (let attribute of CatalogItem.coreAttributes) {
            this._attributes.push(attribute);
        }
        for (let attribute of CatalogItem.idAttributes) {
            this._attributes.push(attribute);
        }

        let html = '<tr>'
        for (let attribute of this._attributes) {
            + '<th class="' + attribute.type + '">' + attribute.title + '</th>'
        }
        html += '</tr>';
        $("#" + this.tableId + " thead").html(html);

        this._rows = [];
        for(let item of this._siteController.items) {
            let row = {};
            row.id = item.id;
            for (let attribute of this._attributes) {
                if (attribute.type === "id") {
                    row[attribute.id] = Number(item.getValue(attribute));
                } else {
                    row[attribute.id] = item.getValue(attribute);
                }
            }
            this._rows.push (row);
        }

        this.sortRowsByMagnitude();
        this.writeRows();
    }

    sortRowsByMagnitude() {
        let magIndex = undefined;
        for (let heading of this._attributes) {
            if (heading.type === 'mag') {
                magIndex = heading.id;
                break;
            }
        }

        if (magIndex === undefined) {
            console.log ("No magnitude heading defined");
            return;
        }
        this._rows.sort((lhs, rhs) => {
            if (lhs[magIndex] < rhs[magIndex]) {
                return -1;
            }
            if (lhs[magIndex] > rhs[magIndex]) {
                return 1;
            }
            return 0;
        });
    }

    writeRows () {
        let html = "";
        for(let row of this._rows) {
            html += '<tr id="starRow' + row.id + '">';

            for (let attribute of this._attributes) {
                if (row[attribute.id] === undefined) {
                    html += '<td class="blank"></td>';
                } else {
                    html += '<td class="' + attribute.type + '">';
                    if (attribute.type == "x-pixel" || attribute.type == "y-pixel" || attribute.type === "mag") {
                        let value = Math.round(row[attribute.id] * 10) / 10;
                        html += value;
                        if (value % 1 == 0) {
                            html += ".0";
                        }
                    } else if (attribute.type === "ra") {
                        html += Angle.printHours(row[attribute.id]);
                    } else if (attribute.type === "dec") {
                        html += Angle.printDegrees(row[attribute.id]);
                    } else {
                        html += row[attribute.id];
                    }
                    html += '</td>';
                }
            }
            html += '</tr>'
        }
        $("#" + this._tableId + " tbody").html(html);
        for (let row of this._rows) {
            $('#starRow' + row.id).click(() => {
                this.printRow(row.id);
            });
        }
    }

    printRow (rowId) {
        this._siteController.selectItem(this, rowId);
    }

    setSelectedItem(caller, item) {
        if (caller === this) {
            return;
        }

        for (let row of this._rows) {
            $('#starRow' + row.id).removeClass("selected");
        }
        if (item !== undefined) {
            $("#starRow" + item.id).addClass("selected");
        }
    }
}
