'use strict'

class FitsHeaderButton {
    _buttonId;
    _siteController;

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

    clear () {
        $("#" + this._buttonId).prop('disabled', true);
    }

    dataLoaded (image) {
        $("#" + this._buttonId).prop('disabled', false);
    }

    setSelectedItem (caller, item) {
        //do nothing ....
    }

    overlayEnabled (enabled) {
    }
}
