'use strict';

class CatalogItemsButton {
    _buttonId = "";
    _siteController = null;

    constructor (buttonId, backgroundId, containerId, siteController) {
        this._buttonId = buttonId;
        this._siteController = siteController;

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
        this.clear ();
    }

    clear () {
        $("#" + this._buttonId).prop('disabled', true);
    }

    dataLoaded () {
        $("#" + this._buttonId).prop('disabled', false);
    }

    setSelectedItem (caller, item) {
        //do nothing
    }

    overlayEnabled (enabled) {
    }
}
