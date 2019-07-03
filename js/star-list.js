'use strict';

class StarList {
    tableId;
    siteController;
    rows;

    constructor(tableId, siteController) {
        this.tableId = tableId;
        this.siteController = siteController;
    }

    dataLoaded() {
        let html = '<tr><th>X Pixel</th><th>Y Pixel</th><th>Right Ascension</th><th>Declination</th><th>Magnitude</th>';
        for (let heading of this.siteController.idAttributes) {
            html += '<th>' + heading.title + '</th>';
        }
        html += '</tr>';
        $("#" + this.tableId + " thead").html(html);

        this.rows = [];
        for(let item of this.siteController.items) {
            let row = {};
            row.id = item.id;
            for (let heading of this.siteController.coreAttributes) {
                row[heading.id] = Number(item.attributes[heading.id]);
            }
            for (let heading of this.siteController.idAttributes) {
                row[heading.id] = item.attributes[heading.id];
            }
            this.rows.push (row);
        }

        this.sortRowsByMagnitude();
        this.writeRows();
    }

    sortRowsByMagnitude() {
        let magIndex = undefined;
        for (let heading of this.siteController.coreAttributes) {
            if (heading.type === 'mag') {
                magIndex = heading.id;
                break;
            }
        }

        if (magIndex === undefined) {
            console.log ("No magnitude heading defined");
            return;
        }
        this.rows.sort((lhs, rhs) => {
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
        for(let row of this.rows) {
            html += '<tr id="starRow' + row.id + '">';
            for (let heading of this.siteController.coreAttributes) {
                if (row[heading.id] === undefined) {
                    html += '<td class="blank"></td>';
                } else {
                    html += '<td class="' + heading.type + '">';
                    if (heading.type == "x-pixel" || heading.type == "y-pixel" || heading.type === "mag") {
                        let value = Math.round(row[heading.id] * 10) / 10;
                        html += value;
                        if (value % 1 == 0) {
                            html += ".0";
                        }
                    } else if (heading.type === "ra") {
                        html += Angle.printHours(row[heading.id]);
                    } else if (heading.type === "dec") {
                        html += Angle.printDegrees(row[heading.id]);
                    } else {
                        html += row[heading.id];
                    }
                    html += '</td>';
                }
            }
            for (let heading of this.siteController.idAttributes) {
                if (row[heading.id] === undefined) {
                    html += '<td class="blank"></td>';
                } else {
                    html += '<td class="' + heading.type + '">';
                    html += row[heading.id];
                    html += '</td>';
                }
            }
            html += '</tr>'
        }
        $("#" + this.tableId + " tbody").html(html);
        for (let row of this.rows) {
            $('#starRow' + row.id).click(() => {
                this.printRow(row.id);
            });
        }
    }

    printRow (rowId) {
        this.siteController.selectItem(this, rowId);
    }

    setSelectedItem(caller, item) {
        if (caller === this) {
            return;
        }

        for (let row of this.rows) {
            $('#starRow' + row.id).removeClass("selected");
        }
        $("#starRow" + item.id).addClass("selected");
    }
}
