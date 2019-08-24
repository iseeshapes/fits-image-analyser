'use strict';

class CatalogItemButton {
    constructor(buttonId, backgroundId, containerId, controller) {
        this.buttonId = buttonId;
        this.controller = controller;

        $("#" + buttonId).click(() => {
            $("#" + backgroundId).css("display", "inline-block");
        });

        $("#" + backgroundId).click(() => {
            $("#" + backgroundId).css("display", "none");
        });

        $("#" + containerId).click((e) => {
            e.stopPropagation();
        });
    }

    noImage () {
        this.setSelectedItem(this, undefined);
    }

    clear () {
        this.setSelectedItem(this, undefined);
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

    overlayEnabled (enabled) {
    }
}
