class AstrometryForm {
    constructor (overWrightId, noPlotId, raId, decId, radiusId, scaleLowId,
        scaleHighId, scaleUnitsId, downsampleId, dirId, depthId, resortId,
        noVerifyId, parityId, verboseId, filenameId, commandId, loadButtonId,
        fileInputId) {

        this.overWrightId = overWrightId;
        this.noPlotId = noPlotId;
        this.raId = raId;
        this.decId = decId;
        this.radiusId = radiusId;
        this.scaleLowId = scaleLowId;
        this.scaleHighId = scaleHighId;
        this.scaleUnitsId = scaleUnitsId;
        this.downsampleId = downsampleId
        this.dirId = dirId;
        this.depthId = depthId;
        this.resortId = resortId;
        this.noVerifyId = noVerifyId;
        this.parityId = parityId;
        this.verboseId = verboseId;
        this.filenameId = filenameId;
        this.commandId = commandId;

        $('#' + loadButtonId).click(() => {
            this.createCommand ();
        });

        $("#" + fileInputId).change(event => {
            this.loadFile(event.target.files[0]);
        });
    }

    loadFile (file) {
        if(!file) {
            return;
        }
        console.log("Opening file: " + file.name);
        let reader = new FileReader();
        reader.onload = (event) => {
            var contents = event.target.result;
            let fitsHeader = new FitsHeader(contents);

            let objectRa;
            try {
                objectRa = fitsHeader.findString('OBJCTRA');
            } catch (e) {
                objectRa = "Not Found";
            }
            $('#' + this.raId).val(objectRa);

            let objectDec;
            try {
                objectDec = fitsHeader.findString('OBJCTDEC');
            } catch (e) {
                objectDec = "Not Found";
            }
            $('#' + this.decId).val(objectDec);

            $('#' + this.filenameId).val(file.name);

            this.createCommand();
        };
        reader.readAsText(file);
    }

    checkboxValue (id) {
        if ($("#" + id).prop('checked')) {
            return true;
        }
        return undefined;
    }

    convertRightAscension (id) {
        let item = $("#" + id);
        let rightAscension = Angle.parseRA (item.val());
        if (rightAscension === undefined) {
            item.css("color", "#ff0000");
        } else {
            item.css("color", "#000000");
        }
        return rightAscension;
    }

    convertDeclination (id) {
        let item = $("#" + id);
        let declination = Angle.parseDec (item.val());
        if (declination === undefined) {
            item.css("color", "#ff0000");
        } else {
            item.css("color", "#000000");
        }
        return declination;
    }

    //$('#loadButton').click(() => ;
    createCommand () {
        let argument = {
            '--overwrite' : this.checkboxValue (this.overWrightId),
            '--no-plot' : this.checkboxValue (this.noPlotId),
            '--ra' : this.convertRightAscension (this.raId),
            '--dec' : this.convertDeclination(this.decId),
            '--radius' : $("#" + this.radiusId).val(),
            '--scale-low' : $("#" + this.scaleLowId).val(),
            '--scale-high' : $("#" + this.scaleHighId).val(),
            '--scale-units' : $("#" + this.scaleUnitsId).val(),
            '--downsample' : $("#" + this.downsample).val(),
            '--dir' : $("#" + this.dirId).val(),
            '--depth' : $("#" + this.depthId).val(),
            '--resort' : this.checkboxValue (this.resortId),
            '--no-verify' : this.checkboxValue (this.noVerifyId),
            '--parity' : $("#" + this.parityId).val(),
            '--verbose' : this.checkboxValue (this.verboseId)
        }
        let filename = $("#" + this.filenameId).val();

        let command = "solve-field"
        for (let [key, value] of Object.entries(argument)) {
            if (value === true) {
                command += " " + key;
            } else if (value !== undefined && value !== "" && value != "no value") {
                command += " " + key + " " + value;
            }
        }
        if (filename !== undefined) {
            command += " " + filename;
        }

        $("#" + this.commandId).val(command);
    }
}
