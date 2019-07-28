'use strict'

class SiteController {
    _dataListeners = [];
    _searchListeners = [];
	fitsHeader = {};
	sipData = {};

    items = [];
    _selectedItem = undefined;

    addSearchListener (listener) {
		this._searchListeners.push(listener);
	}

    addDataListener (listener) {
		this._dataListeners.push(listener);
	}

	loadData (fileContents) {
        let text = new TextDecoder('utf-8').decode(fileContents);

		this.fitsHeader = new FitsHeader(text);
        this.wcs = new wcs();
        this.wcs.init (text);

        this.image = new Image(fileContents, this.fitsHeader, this.wcs);

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
                    [this.image.bottomRight.ra , this.image.bottomRight.dec ],
                    [this.image.bottomLeft.ra, this.image.bottomLeft.dec]
            ]),
          	success : (data) => {
          		this.loadSearchResults(data);
          	},
        	error : function (jqXHR, textStatus, errorThrown) {
            	console.log("AJAX Error:\n\nText Status: " + textStatus + "\nerrorThrown: " + errorThrown);
        	}
        });

        for (let listener of this._dataListeners) {
            listener.dataLoaded(this.image);
        }
	}

	loadSearchResults (searchResults) {
        this.image.createItems(searchResults);

		for (let listener of this._searchListeners) {
			listener.dataLoaded(this.image);
		}
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
}
