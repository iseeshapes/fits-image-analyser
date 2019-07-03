'use strict'

class SiteController {
	listeners = [];
	fitsHeader = {};
	sipData = {};

	coreAttributes = [
      { type: "x-pixel", title : "X" },
      { type: "y-pixel", title : "Y" },
      { type: "ra"     , title : "Right Ascension" },
      { type: "dec"    , title : "Declination" },
      { type: "mag"    , title : "Visual Mag" }
    ];

    idAttributes = [];
    dataAttributes = [];

    items = [];

	addListener (listener) {
		this.listeners.push(listener);
	}

	loadData (rawFileContents) {
		this.fitsHeader = new FitsHeader(rawFileContents)
		this.sipData = new SipData(this.fitsHeader);

		$.ajax({
         	type : "POST",
         	headers : {
             	'Accept': 'application/json',
            	'Content-Type': 'application/json'
          		},
          	url : "/sip",
          	data : JSON.stringify(this.sipData),
          	success : (data) => {
          		this.loadSearchResults(data);
          	},
        	error : function (jqXHR, textStatus, errorThrown) {
            	console.log("AJAX Error:\n\nText Status: " + textStatus + "\nerrorThrown: " + errorThrown);
        	}
        });
	}

	loadSearchResults (searchResults) {
		for (let id in searchResults.attributes) {
			let found = false;
			for (let heading of this.coreAttributes) {
				if (searchResults.attributes[id].type == heading.type) {
					heading.id = id;
					found = true;
					break;
				}
			}
			if (!found) {
				if (searchResults.attributes[id].type === "id") {
					this.idAttributes.push({
						type : searchResults.attributes[id].type,
						title : searchResults.attributes[id].name,
						id : id
					});
				} else if (searchResults.attributes[id].type === "data") {
					this.dataAttributes.push({
						type : searchResults.attributes[id].type,
						title : searchResults.attributes[id].name,
						id : id
					})
				}
			}
		}

		this.items = searchResults.items;

		for (let listener of this.listeners) {
			listener.dataLoaded();
		}
	}

	selectItem(caller, id) {
		let selected = undefined;
		for (let item of this.items) {
			if (item.id === id) {
				selected = item;
				break;
			}
		}
		if (selected !== undefined) {
			for (let listener of this.listeners) {
				listener.setSelectedItem (caller, selected);
			}
		}
	}

    getStarName (id) {
        for (let item of this.items) {
            if (item.id === id) {
                for (let idAttribute of this.idAttributes) {
                    if (item.attributes[idAttribute.id] !== undefined) {
                        return idAttribute.title + ": " + item.attributes[idAttribute.id];
                    }
                }
                break;
            }
        }
        return "Unknown Star";
    }
}