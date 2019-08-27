'use strict';

class FileLoadButton {
    _buttonId;
    _fileInputId;
    _siteController;

    constructor(buttonId, fileInputId, siteController) {
        this._buttonId = buttonId;
        this._fileInputId = fileInputId;
        this._siteController = siteController;

        $("#" + fileInputId).change(event => {
            this.loadFile(event.target.files[0]);
        });
    }

    loadFile(file) {
        if(!file) {
            return;
        }
        console.log("Opening file: " + file.name);
        let reader = new FileReader();
        reader.onload = (event) => {
            var contents = event.target.result;
            this._siteController.loadData(file.name, contents);
        };
        reader.readAsArrayBuffer(file);
    }
}
