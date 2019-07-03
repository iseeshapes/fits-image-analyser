class FitsHeader {
	headerItems = [];

	constructor (fileContent) {
		let count = 0;
		let index = 0;
	    while (index + 80 < fileContent.length) {
	      if (fileContent.substring(index, index + 3) === "END") {
	        break;
	      }
	      let name = fileContent.substring(index, index + 8).trim();
	      let value = fileContent.substring(index + 11, index + 80);
	      let comment = "";
	      let commentStarts = value.indexOf("/");
	      if (commentStarts !== -1) {
	        comment = value.substring(commentStarts, value.length - commentStarts).trim();
	        value = value.substring(0, commentStarts);
	      }
	      value = value.replace("'", "");
	      value = value.trim();
	      this.headerItems.push({
	        index : count,
	        name: name, 
	      	value : value, 
	      	comment : comment 
	      });
	      index += 80;
	    }
	}

	findString (name) {
		for (let headerItem of this.headerItems) {
			if (headerItem.name === name) {
				return headerItem.value;
			}
		}
		throw "Could not find '" + name + "'' in header";
	}

	findNumber (name) {
		let value = Number(this.findString(name));
    	if (isNaN(value)) {
      		throw "Fits header item " + name + " is not a number";
    	}
    	return value;
	}
}