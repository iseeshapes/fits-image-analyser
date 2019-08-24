'use strict';

class ZoomSelector {
    _selectorId = null;
    _siteController = null;

    constructor (selectorId, siteController) {
        this._selectorId = selectorId;
        this._siteController = siteController;

        $("#" + selectorId).change(() => {
            var zoom = $("#" + selectorId).val();
            siteController.zoom(this, zoom);
        });
    }

    clear () {
        $("#" + this._selectorId).prop("disabled", true);
    }

    dataLoaded (image) {
        $("#" + this._selectorId).prop("disabled", false);
    }

    zoom (caller, zoom) {
        if (caller == this) {
            return;
        }
        $('#' + this._selectorId + " option[value=" + zoom + "]").prop("selected", true);
    }
}
