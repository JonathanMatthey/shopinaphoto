/*
 * accordionMenu gerenates an accordion style menu with contents from div, url, rss, json, text and custom function.
 */

// create accordionMenu class
accordionMenu = function(name, doRandomDefault, useAdTrack, slideSpeed, timer, maxList, isDebug) {
	var defaultSeed = 20;
	var defaultTimer = 5;
	var defaultMaxList = 10;
	
	// set the class variables
	this.isIe = window.ActiveXObject;
	this.isFireFox = document.implementation && document.implementation.createDocument;
	this.isDebug = false;

	// set default for other variables
	this.spinner = '<div id="' + name + '_spinner"><img src="img/accordion_spinner.gif"></div>';
	this.titleIdSuffix = '_title';
	this.blindIdSuffix = '_menu';
	this.blindCssPrefix = 'asm-menu';

	try {
		this.name = name;

		// check if the parameters are parsed all together
		var params = doRandomDefault && (typeof(doRandomDefault) == 'string') ? doRandomDefault.split(";") : '';
		if (params.length > 1) {
			this.doRandomDefault = params[0] ? this.isTrue(params[0]) : false;
		    this.useAdTrack = params[1] ? this.isTrue(params[1]) : false;
		    this.slideSpeed = params.length > 2 ? (params[2] ? parseInt(params[2],10) : defaultSeed) : defaultSeed;
		    this.timer = params.length > 3 ? (params[3] ? parseInt(params[3],10) : defaultTimer) : defaultTimer;
		    this.maxList = params.length > 4 ? (params[4] ? parseInt(params[4],10) : defaultMaxList) : defaultMaxList;
		    this.isDebug = params.length == 6 ? (params[5] ? this.isTrue(params[5]) : false) : false;
		}
		else {
			// set the inital settings
			this.doRandomDefault = doRandomDefault ? this.isTrue(doRandomDefault) : false;
			this.useAdTrack = useAdTrack ? this.isTrue(useAdTrack) : false;
			this.slideSpeed = slideSpeed ? parseInt(slideSpeed,10) : defaultSeed;	// the higher, the faster
			this.timer = timer ? parseInt(timer,10) : defaultTimer;				// the lower, the faster
			this.maxList = maxList ? parseInt(maxList,10) : defaultMaxList;		// the lower, the faster
		    this.isDebug = isDebug ? isDebug : false;
		}
		this.menu = new Array();
	}
	catch(e) {
		if(this.isDebug) {
			alert(e);
		}
	}
}

// add a menu to a array
accordionMenu.prototype.addMenu = function(menuId, contentId, target, mode, isOpen, autoUpdate, height) {
	try {
		// check if the parameters are parsed all together
		var params = mode && typeof(mode) == 'string' ? mode.split(";") : '';
		if (params.length > 1) {
			mode = params[0];
		    isOpen = this.isTrue(params[1]);
		    autoUpdate = params.length > 2 ? (params[2] ? params[2] : false) : false;
			height = params.length == 4 ? parseInt(params[3],10) : false;
		}
		else {
			mode = mode ? mode : 'div';
			isOpen = isOpen ? isOpen : false;
		    autoUpdate = autoUpdate ? autoUpdate : false;
			height = height ? height : false;
		}

		// if no div for menu and content, nothing to do
		if((!menuId || !document.getElementById(menuId)) && this.isDebug) {
			alert("Invalid menuId : " + menuId);
		}
		else {
			this.addMenuEvent(menuId + this.blindIdSuffix, autoUpdate);
			this.addMenuEvent(menuId + this.titleIdSuffix, autoUpdate);
			this.menu.push({menuId:menuId,contentId:contentId,mode:mode,isOpen:isOpen,target:target,defaultHeight:height,currentHeight:0});
		}
	}
	catch(e) {
		if(this.isDebug) {
			alert(e);
		}
	}	
}

// add event to a menu
accordionMenu.prototype.addMenuEvent = function(id, autoUpdate) {
	var self = this;
	document.getElementById(id).onclick = function() { 
	    var thisId = this.id;
		if(self.useAdTrack && (typeof AdTrack != 'undefined')) {
			AdTrack.t(this, self.name, (self.getMenuIndex(thisId)+1));
		}
		playAccordionMenu(thisId, self, autoUpdate);
	}
	document.getElementById(id).style.cursor = 'pointer';
}

// initialize the accordion menu
// it also makes menu open if it is set to open or randomly chosen
accordionMenu.prototype.initialize = function() {
	try {
		// get the random index if random default is activated
		var randomIndex = this.doRandomDefault ? this.getRandomNumber() : 0;

		// go through all the menu
		var accordion = this;
		for(var i=0; i<this.menu.length; i++) {
			// no contentDiv, no content
			var thisMenu = this.menu[i];
			if(document.getElementById(thisMenu.contentId)) {
				// set the content div
				this.setContent(i);

				var makeOpen = false;
				if(this.doRandomDefault) {
					makeOpen = randomIndex == i;
				}
				else {
					makeOpen = thisMenu.isOpen === true;
				}
				
				var height = thisMenu.defaultHeight 
					? thisMenu.defaultHeight : this.getContentHeight(thisMenu.contentId);
				var contentDiv = document.getElementById(thisMenu.contentId);
				contentDiv.style.display = makeOpen ? 'block' : 'none';
				contentDiv.style.height = height + 'px';
				this.setMenu(i, makeOpen, height);
			}
			else if(this.isDebug) {
				alert("Invalid contentId at " + this.menu[i].menuId);
			}
		}
	}
	catch(e) {
		if(this.isDebug) {
			alert(e);
		}
	}
}

// set the open status, height and blind div
accordionMenu.prototype.setMenu = function(index, isOpen, height) {
	this.menu[index].isOpen = isOpen;
	if(height && (height > -1)) {
		this.menu[index].currentHeight = height;
	}

	var thisMenu = this.menu[index];

	// set the arrow direction if headIt is given
	var blindDiv = document.getElementById(thisMenu.menuId + this.blindIdSuffix);
		
	if(blindDiv) {
		blindDiv.className = this.blindCssPrefix + (isOpen ? '-on' : '-off');
	}
}

// returns the menu having the same menuId or contentId as the given id
accordionMenu.prototype.getMenu = function(id) {
	for(var i=0; i<this.menu.length; i++) {
		if(this.isSameMenu(this.menu[i].menuId, id)) {
			return this.menu[i];
		}
	}
	return null;
}

// returns the menu having the same menuId or contentId as the given id
accordionMenu.prototype.getMenuIndex = function(id) {
	for(var i=0; i<this.menu.length; i++) {
		if(this.isSameMenu(this.menu[i].menuId, id)) {
			return i;
		}
	}
	return null;
}

accordionMenu.prototype.isSameMenu = function(menuId, thisId) {
	return thisId.indexOf(menuId) > -1;
}

// returns the height of the content div when it is displayed with the content
accordionMenu.prototype.getContentHeight = function(contentId) {
	var height = 0;
	var contentDiv = document.getElementById(contentId);
	var content = contentDiv.innerHTML;
	var display = contentDiv.style.display;

	// make a temperally div to measure the height
	var div = document.createElement('div');
	contentDiv.innerHTML = '';
	contentDiv.style.display = 'block';
	contentDiv.appendChild(div);
	div.style.display = 'block';
	div.innerHTML = content;
	height = div.scrollHeight > 1 ? div.scrollHeight : div.offsetHeight;
	contentDiv.removeChild(div);
	contentDiv.style.display = display;
	contentDiv.innerHTML = content;
	
	return height;
}

// returns the content depending on the target mode
accordionMenu.prototype.setContent = function(index) {
	var thisMenu = this.menu[index];
	var contentDiv = document.getElementById(thisMenu.contentId);
	contentDiv.style.overflow = 'hidden';
	
	// do nothing if no target
	if(thisMenu.target) {
		contentDiv.innerHTML = this.spinner;
		switch(thisMenu.mode) {
			case 'url':
				this.setAjaxRequest(index);
				break;
			case 'rss':
				this.setAjaxRequest(index, 'rss');
				break;
			case 'json':
				this.setAjaxRequest(index, 'json');
				break;
			case 'text':
				contentDiv.innerHTML = thisMenu.target;
				break;
			case 'custom':
				eval(thisMenu.target + "('" + thisMenu.contentId + "');");
				break;
			default:
				if(document.getElementById(thisMenu.target)) {
					var targetDiv = document.getElementById(thisMenu.target);
					targetDiv.style.display = 'none';
					contentDiv.innerHTML = targetDiv.innerHTML;
				}
				break;
		}
	}
}

// update the contents and the height for the div
// get ajax crequest
accordionMenu.prototype.setAjaxRequest = function(index, type) {
	var thisMenu = this.menu[index];
	// no contentId or url, no ajx
	if((!thisMenu.contentId || !thisMenu.target) && this.isDebug) {
		alert("Invalid Ajax Call");
	}
	else {
		var request;
		var self = this;
		var url = thisMenu.target;
		
		// trick: if it is ie, put a tail with a random number so that it gets refreshed everytime
		if(self.isIe) {
			url = url
				+ (thisMenu.target.indexOf("?") > -1 ? "&" : "?")
				+ "randomeNumber=" + self.getRandomNumber(100000);
		}

		// create ajax
		try {
			request = new XMLHttpRequest();
		}
		catch (trymicrosoft) {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (othermicrosoft) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				}
				catch (failed) {
					request = false;
				}
			}
		}

		if (!request && self.isDebug) {
			alert("Invalid AJAX Call : Error initializing XMLHttpRequest!");
		}
		else {
			request.onreadystatechange = function() {
					if (request.readyState == 4) { // ok for 200
						if (request.status == 200) {
							var oldHeight = self.getContentHeight(thisMenu.contentId);
							
							document.getElementById(thisMenu.contentId).innerHTML = type == 'rss' 
								? self.getRssResult(request.responseXML) 
								: (type == 'json' ? self.getJsonResult(request.responseText) : request.responseText);
							
							// if the new content is shorter than the old one, which is spinner
							// close the slide then open again
							var newHeight = thisMenu.defaultHeight 
								? thisMenu.defaultHeight : self.getContentHeight(thisMenu.contentId);
							if(oldHeight > newHeight) {
								self = slideMenu(thisMenu.contentId, oldHeight, oldHeight, self, false);
								oldHeight = 1;
							}
							
							// hack: not sure why it's shorter in firefox 
							if(self.isFireFox) {
								newHeight += 20;
							}

							// open this menu from the previous height
							self = slideMenu(thisMenu.contentId, newHeight, oldHeight, self, true);
						}
						else if(self.isDebug) {
							alert("There was a problem retrieving data:\n" + request.status);
						}
					} 			
				}; 
			request.open("get", url, true);
			request.send(null); 
		}
	}
}

// return a list of the linked titles for the given rss
// the rss should have title and link element in item node
accordionMenu.prototype.getRssResult = function(rss) {
	var result = '';
	var rssDoc;
	
	// check if the source is already xml
	if(rss.firstChild && rss.firstChild.firstChild) {
		rssDoc = rss;
	}
	else {
		if (this.isFireFox) {
			rssDoc = document.implementation.createDocument("", "", null);
		}
		else if (this.isIe) {
			rssDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
		}
		else if(this.isDebug) {
			alert("Your browser can't handle this script.");
		}		
		rssDoc.async = false;
		rssDoc.load(rss);
	}

	// check if xml is loaded properly
	if((rssDoc.childNodes.length < 1) && this.isDebug) {
		alert("Invalid RSS");
	}
		
	var items = rssDoc.getElementsByTagName('item');

	if(items.length > 0) {
		result += '<ul>';
		var max = items.length > this.maxList ? this.maxList : items.length;
		if(items[0].getElementsByTagName('title')[0]) {
			for(var i=0; i<max; i++) {
				result += '<li><a href="' + items[i].getElementsByTagName('link')[0].firstChild.nodeValue 
					+ '">' + items[i].getElementsByTagName('title')[0].firstChild.nodeValue + '</a></li>';
			}
		}
		else if(this.isDebug) {
			alert("No title for rss");
		}
		result += '</ul>';
	}
	return result;
}

// return a list of the linked titles for the given json
// the json should have title and link element in item node
accordionMenu.prototype.getJsonResult = function(json) {
	var result = '';
	var jsonDoc;

	// check if the source is already xml
	if(json.value) {
		jsonDoc = json;
	}
	else {
		jsonDoc	= eval("(" + json + ")");
	}
	
	if(jsonDoc.count > 0) {
		result += '<ul>';
		var max = jsonDoc.count > this.maxList ? this.maxList : jsonDoc.count;

		if(jsonDoc.value.items[0].title || (jsonDoc.value.items[0].title === '')) {
			for(var i=0; i<max; i++) {
				result += '<li><a href="' + jsonDoc.value.items[i].link 
					+ '">' + jsonDoc.value.items[i].title + '</a></li>';
			}
		}
		else if(this.isDebug) {
			alert("No title for json");
		}
		result += '</ul>';
	}
	return result;
}

// returns a random number smaller than the given max number
// if no maximum is given, use the length of the menu as the default
accordionMenu.prototype.getRandomNumber = function(max) {
	return Math.round(100*Math.random()) % (max ? max : this.menu.length);
}

// parse the boolean for both boolean and string
accordionMenu.prototype.isTrue = function(value) {
	if(typeof(value) == 'boolean') {
		return value;
	}
	else if(typeof(value) == 'string') {
		return value == 'true';
	}
	else {
		return false;
	}
}

// do the actual accordion for all the menu
function playAccordionMenu(clickedId, accordion, autoUpdate) {
	// if no event, nothing to do
	if(!clickedId && accordion.isDebug) {
		alert("Invalid clickedId");
	}
	else {
		// go through all the menu
		var thisAccordion = accordion;

		try {
			for(var i=0; i<accordion.menu.length; i++) {
				var thisMenu = thisAccordion.menu[i];
			
				var height = thisMenu.currentHeight;
				if(thisAccordion.isSameMenu(thisMenu.menuId, clickedId)) {
					if(thisMenu.isOpen) {
						thisAccordion = slideMenu(thisMenu.contentId, height, height, thisAccordion, false);
						thisAccordion.setMenu(i, false);
					}
					else {
						if(autoUpdate && document.getElementById(thisMenu.contentId)) {
							thisAccordion.setContent(i);
							height = thisAccordion.getContentHeight(thisMenu.contentId);
						}
						thisAccordion = slideMenu(thisMenu.contentId, height, 1, thisAccordion, true);
						thisAccordion.setMenu(i, true, height);
					}
				}
				else if(thisMenu.isOpen) {
					thisAccordion = slideMenu(thisMenu.contentId, height, height, thisAccordion, false);
					thisAccordion.setMenu(i, false);
				}
			}
		}
		catch(e) {
			if(accordion.isDebug) {
				alert(e);
			}
		}
	}
	return false;
}

// do animation for the menu with the given contentId
function slideMenu(contentId, originalHeight, currentHeight, accordion, isOpening) {
	var thisAccordion = accordion;
	var contentDiv = document.getElementById(contentId);
	
	if(contentDiv) {
		// recurse only if the current height is between 0 and the original height
		if ((currentHeight >= 1) &&
			(currentHeight <= originalHeight)) {
			if(currentHeight == 1) {
		    	contentDiv.style.display = 'block';
		    }
			contentDiv.style.height = currentHeight + 'px';	
			var thisHeight = isOpening ? currentHeight+accordion.slideSpeed : currentHeight-accordion.slideSpeed;
			setTimeout(function() { thisAccordion = slideMenu(contentId, originalHeight, thisHeight, thisAccordion, isOpening); }, 
				accordion.timer);
		}
		else {
			if(currentHeight < 1) {
				contentDiv.style.height = '1px';
			}
			else if(currentHeight > originalHeight) {
				contentDiv.style.height = originalHeight + 'px';
			}
			if(currentHeight < 1) {
	 	    	contentDiv.style.display = 'none';
			}
		}
	}
	return thisAccordion;
}

function customFunction(contentId) {
	document.getElementById(contentId).innerHTML = 'This is parsed from a <font color="red"><b>custom function</b></font>.';
}

