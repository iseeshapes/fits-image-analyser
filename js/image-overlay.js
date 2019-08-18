'use strict';

class ImageOverlay {
	_imageId;
	_siteController;
    _lastSelectedStar = undefined;

	_stars = [];

	_coordinatePrecision = 2;
    _magnitudePrecision = 1;
    _maxMagnitude = 17.0;
    _starSizeDivisor = 5;
    _starSizeMultiplier = 5;

  	constructor (imageId, siteController) {
    	this._imageId = imageId;
    	this._siteController = siteController;
  	}

  	calcStarSize (magnitude) {
        let nextMagnitude = Math.floor(this._maxMagnitude * this._magnitudePrecision) / this._magnitudePrecision;

        let lastSize = 1.0;
        let starSize = 1.0;

        while (magnitude < nextMagnitude) {
            starSize += lastSize / this._starSizeDivisor;
            lastSize = starSize;
            nextMagnitude -= this._magnitudePrecision;
        }

        return Math.round(starSize * this._starSizeMultiplier * this._coordinatePrecision) / this._coordinatePrecision;
    }

  	static makeSVG (tag, attrs) {
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
        	el.setAttribute(k, attrs[k]);
        }
        return el;
    }

    createLabel(star) {
        let svg = document.getElementById(this._imageId);

        let label = ImageOverlay.makeSVG('text', {
            id: "imageStarLabel" + star.id,
            class: "starImageLabel",
            x: star.x + star.size + 5,
            y: star.y - star.size - 5
        });
        label.innerHTML = star.name;
        svg.appendChild(label);

        let rect = label.getBBox();

        let rectangle = ImageOverlay.makeSVG ('rect', {
            id: "imageStarLabelBackground" + star.id,
            class: "starImageLabel",
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        });
        svg.insertBefore(rectangle, label);
    }

    deleteLabel (star) {
        let label = document.getElementById("imageStarLabel" + star.id);
        label.remove();
        let rectangle = document.getElementById("imageStarLabelBackground" + star.id);
        rectangle.remove();
    }

    createStar (star) {
        let shape = ImageOverlay.makeSVG('use', {
  			id: star.type + "Star" + star.id,
  			class: "star photometry-" + star.photometry,
  			x: star.x - star.size * 2,
  			y: star.y - star.size * 2,
  			width: star.size * 4,
            height: star.size * 4,
            href: "#" + star.type + "-star"
  		});

    	document.getElementById(this._imageId).appendChild(shape);
        if (star.type === "catalog") {
    	    shape.onclick = () => this._siteController.selectItem(this, star.id);
        } else if (star.type === "image"){
            shape.onclick = () => this._siteController.selectItem(this, undefined);
        }
        shape.onmouseenter = () => this.createLabel (star);
        shape.onmouseleave = () => this.deleteLabel (star);
    }

    clear () {
        let shapes = document.querySelectorAll('.star');
        for (let shape of shapes) {
            shape.remove ();
        }
        this._stars = [];
    }

  	dataLoaded (image) {
        this.clear();

        let width = image.width;
        let height = image.height;
        let overlay = $("#" + this._imageId);
  		overlay.attr("viewBox", "0 0 " + width + " " + height);
  		overlay.attr("width", width);
  		overlay.attr("height", height);

  		for (let item of image.items) {
            let saturated = false;
            if (item.isInImage()) {
                saturated = item.getImageValue("saturated");
            }

            if (item.isInCatalog()) {
      			let star = {
      				id : item.getId(),
      				x : item.getCoreValue("x-pixel"),
      				y : item.getCoreValue("y-pixel"),
      				size : this.calcStarSize(item.getCoreValue("mag")),
                    name : item.getName(),
                    type: "catalog",
                    photometry : "low"
      			};
                if (item.isInImage()) {
                    star.size = item.getImageValue("size") / 2;
                    star.photometry = item.photometry
                }
                this._stars.push(star);
            } else if (item.isInImage()) {
                this._stars.push({
      				id : item.getId(),
      				x : item.getImageValue("x-image"),
      				y : item.getImageValue("y-image"),
      				size : item.getImageValue("size"),
                    name : "No Catalog Item",
                    type : "image",
                    photometry : item.photometry
                });
            }
  		}

  		this._stars.sort((lhs, rhs) => {
  			if (lhs.size < rhs.size)
  				return 1;
  			if (lhs.size > rhs.size)
  				return -1;
  			return 0;
  		});

  		for (let star of this._stars) {
  			this.createStar(star);
  		}

        this._lastSelected = undefined;
  	}

  	setSelectedItem (caller, item) {
        if (this._lastSelected !== undefined) {
            this.deleteLabel(this._lastSelected);
            $('#catalogStar' + this._lastSelected.id).removeClass("selected");
        }

        this._lastSelected = undefined;
        if (item !== undefined) {
            for (let star of this._stars) {
                if (star.id === item.getId()) {
                    this._lastSelected = star;
                    break;
                }
            }
        }

        if (this._lastSelected !== undefined) {
            $("#catalogStar" + this._lastSelected.id).addClass("selected");
            this.createLabel(this._lastSelected);
        }
  	}

    zoom (zoom) {
        let overlay = $("#" + this._imageId);
        overlay.attr("width", this._siteController.image.width * zoom);
        overlay.attr("height", this._siteController.image.height * zoom);
    }
}
