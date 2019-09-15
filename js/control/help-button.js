'use strict';

class HelpButton {
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
    }

    clear () {
    }

    dataLoaded () {
    }

    setSelectedItem (caller, item) {
    }

    overlayEnabled (enabled) {
    }
}
