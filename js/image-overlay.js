'use strict';

class ImageOverlay {
	imageId;
	siteController;

	stars = [];

	coordinatePrecision = 2;
    magnitudePrecision = 1;
    maxMagnitude = 17.0;
    starSizeDivisor = 5.0;
    starSizeMultiplier = 2.0;
  	
  	constructor (imageId, searchResults) {
    	this.imageId = imageId;
    	this.siteController = siteController;
  	}

  	calcStarSize (magnitude) {
        let nextMagnitude = Math.floor(this.maxMagnitude * this.magnitudePrecision) / this.magnitudePrecision;

        let lastSize = 1.0;
        let starSize = 1.0;

        while (magnitude < nextMagnitude) {
            starSize += lastSize / this.starSizeDivisor;
            lastSize = starSize;
            nextMagnitude -= this.magnitudePrecision;
        }

        return Math.round(starSize * this.starSizeMultiplier * this.coordinatePrecision) / this.coordinatePrecision;
    }

  	static makeSVG (tag, attrs) {
        let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (let k in attrs) {
        	el.setAttribute(k, attrs[k]);
        }
        return el;
    }

    createBackground (width, height) {
        let rectangle = ImageOverlay.makeSVG('rect', {
            id: "imageBackground",
            x: 0,
            y: 0,
            width: width,
            height: height
        });
        document.getElementById(this.imageId).appendChild(rectangle);
    }

    createLabel(starId) {
        let circle = $("#imageStar" + starId);
        let radius = Number(circle.attr("r"));
        let x = Number(circle.attr("cx"));
        let y = Number(circle.attr("cy"));

        let label = ImageOverlay.makeSVG('text', {
            id: "imageStarLabel" + starId,
            class: "starImageLabel",
            x: x + radius + 5,
            y: y - radius - 5
        });
        label.innerHTML = this.siteController.getStarName(starId);
        document.getElementById(this.imageId).appendChild(label);
        //console.log ("Create Label => Star: " + starId + ", name: " + this.siteController.getStarName(starId));
    }

    deleteLabel (starId) {
        let label = document.getElementById("imageStarLabel" + starId);
        label.remove();
    }

    createStar (star) {
  		let circle = ImageOverlay.makeSVG('circle', {
  			id: "imageStar" + star.id,
  			class: "star",
  			cx: star.x, 
  			cy: star.y, 
  			r: star.size
  		});
    	document.getElementById(this.imageId).appendChild(circle);
    	circle.onclick = () => {
    		this.siteController.selectItem(this, star.id)
    	};
        circle.onmouseenter = () => {
            this.createLabel(star.id);
        };
        circle.onmouseleave = () => {
            this.deleteLabel (star.id);
            //console.log ("Mouse Leave Star " + star.id);
        }
    }

  	dataLoaded () {
  		let sipData = siteController.sipData;
  		$("#" + this.imageId).attr("viewBox", "0 0 " + sipData.imageWidth + " " + sipData.imageHeight);
  		$("#" + this.imageId).attr("width", sipData.imageWidth);
  		$("#" + this.imageId).attr("height", sipData.imageHeight);

  		let xIndex = undefined;
  		let yIndex = undefined;
  		let magIndex = undefined;
  		for (let attribute of this.siteController.coreAttributes) {
  			if (attribute.type === "x-pixel") {
  				xIndex = attribute.id;
  			}
  			if (attribute.type === "y-pixel") {
  				yIndex = attribute.id;
  			}
  			if (attribute.type === "mag") {
  				magIndex = attribute.id;
  			}
  		}

  		if (xIndex === undefined || yIndex === undefined || magIndex == undefined) {
  			throw "Cannot find x or y pixel values in search results";
  		}

  		for (let item of this.siteController.items) {
  			this.stars.push({
  				id : item.id,
  				x : item.attributes[xIndex],
  				y : item.attributes[yIndex],
  				size: this.calcStarSize(item.attributes[magIndex])
  			});
  		}
  		this.stars.sort((lhs, rhs) => {
  			if (lhs.size < rhs.size)
  				return 1;
  			if (lhs.size > rhs.size)
  				return -1;
  			return 0;
  		});

        this.createBackground(sipData.imageWidth, sipData.imageHeight);

  		for (let star of this.stars) {
  			this.createStar(star);
  		}
  	}

  	setSelectedItem (caller, item) {
       for (let star of this.stars) {
            $('#imageStar' + star.id).removeClass("selected");
        }
        $("#imageStar" + item.id).addClass("selected");
  	}

    zoom (zoom) {
        let sipData = siteController.sipData;
        $("#" + this.imageId).attr("width", sipData.imageWidth * zoom);
        $("#" + this.imageId).attr("height", sipData.imageHeight * zoom);
    }
}
