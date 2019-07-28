'use strict';

class StarDetailsButton {
    constructor(buttonId, controller) {
        this.buttonId = buttonId;
        this.controller = controller;
    }

    dataLoaded () {
        this.setSelectedItem(this, undefined);
    }

    setSelectedItem (caller, item) {
        if (item === undefined) {
            $("#" + this.buttonId).prop('disabled', true);
        } else {
            $("#" + this.buttonId).prop('disabled', false);
        }
    }
}
