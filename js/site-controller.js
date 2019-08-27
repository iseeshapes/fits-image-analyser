'use strict'

class SiteController {
    _dataListeners = [];
    _searchListeners = [];
    _zoomListeners = [];
	fitsHeader = {};
    _selectedItem = undefined;
    _overlayEnabled = true;

    addSearchListener (listener) {
		this._searchListeners.push(listener);
	}

    addDataListener (listener) {
		this._dataListeners.push(listener);
	}

    addZoomListener (listener) {
        this._zoomListeners.push(listener);
    }

    addOverlayListener (listener) {
        this._overlayListeners.push(listener)
    }

    noImage () {
        this.fitsHeader = null;
        this.image = null;

        this._selectedItem = undefined;

        for (let listener of this._searchListeners) {
            listener.noImage();
        }
        for (let listener of this._dataListeners) {
            listener.clear();
        }
    }

	loadData (filename, fileContents) {
        let text = new TextDecoder('utf-8').decode(fileContents);

        try {
            this.fitsHeader = new FitsHeader(text);
            this.image = new Image(filename, fileContents, this.fitsHeader);
        } catch (e) {
            console.log(e);
            alert("Invalid FITS File - see console log for details");
            return;
        }

        for (let listener of this._searchListeners) {
            listener.clear();
        }

        try {
            this.fitsHeader.findString("CRPIX1");
            let _wcs = new wcs();
            _wcs.init (text);

            this.image.setWCS(_wcs);

            $.ajax({
             	type : "POST",
             	headers : {
                 	'Accept': 'application/json',
                	'Content-Type': 'application/json'
              		},
              	url : "/sip/points",
              	data : JSON.stringify([
                        [this.image.topLeft.ra    , this.image.topLeft.dec    ],
                        [this.image.topRight.ra   , this.image.topRight.dec   ],
                        [this.image.bottomRight.ra, this.image.bottomRight.dec],
                        [this.image.bottomLeft.ra , this.image.bottomLeft.dec ]
                ]),
              	success : (data) => {
              		this.loadSearchResults(data);
              	},
            	error : function (jqXHR, textStatus, errorThrown) {
                    console.log("AJAX Error:\n\nText Status: " + textStatus + "\nerrorThrown: " + errorThrown);
                    alert("Error getting catalog items - see console log");
            	}
            });
        } catch (e) {
            //TO DO draw
            console.log("Error: " + e);
        }

        for (let listener of this._dataListeners) {
            listener.dataLoaded(this.image);
        }

        this.zoom(this, 1);
	}

	loadSearchResults (searchResults) {
        this.image.createItems(searchResults);

		for (let listener of this._searchListeners) {
			listener.dataLoaded(this.image);
		}
        this.setOverlayEnabled(true);
	}

	selectItem(caller, id) {
        let selected = undefined;
		for (let item of this.image.items) {
			if (item.getId() === id) {
				selected = item;
				break;
			}
		}
        this.notifyListenersOfSelectionChange (caller, selected);
    }

    clearSelection (caller) {
        this.notifyListenersOfSelectionChange (caller, undefined);
    }

    notifyListenersOfSelectionChange (caller, selected) {
        this.selectedItem = selected;
		for (let listener of this._searchListeners) {
			listener.setSelectedItem (caller, selected);
		}
	}

    zoom (caller, zoom) {
        for (let listener of this._zoomListeners) {
            listener.zoom(caller, zoom);
        }
    }

    getOverlayEnabled() {
        return this._overlayEnabled;
    }

    setOverlayEnabled(enabled) {
        this._overlayEnabled = enabled;

        for (let listener of this._searchListeners) {
            listener.overlayEnabled(enabled);
        }
    }
}
