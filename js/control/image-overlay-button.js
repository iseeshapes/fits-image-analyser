'use strict'

class ImageOverlayButton {
    _buttonId;
    _siteController;
    _shown = true;

    constructor (buttonId, siteController) {
        this._buttonId = buttonId;
        this._siteController = siteController;

        $("#" + buttonId).click(() => {
            this._siteController.setOverlayEnabled(!this._siteController.getOverlayEnabled());
        });
    }

    noImage () {
        $("#" + this._buttonId).prop('disabled', true);
    }

    clear () {

    }

    dataLoaded () {
        $("#" + this._buttonId).prop('disabled', false);
    }

    setSelectedItem (caller, item) {

    }

    overlayEnabled(enabled) {
        let html = "";
        if (enabled) {
            html += "Hide";
        } else {
            html += "Show";
        }
        html += " Overlay";
        $("#" + this._buttonId).html(html);
    }
}
