///////////////////////////////////////////////////////////////////////////////
//
// Helper Functions
//
///////////////////////////////////////////////////////////////////////////////
String.prototype.format = function()
{
    var s = this;

    for (var i=0; i < arguments.length; i++)
    {
        s = (arguments[i] == null) ? s.replace("{" + (i) + "}", "") : s.replace("{" + (i) + "}", arguments[i]);
    }

    return(s);
};

///////////////////////////////////////////////////////////////////////////////
//
// namespace mobilise.ninemsn.gomobile
//
///////////////////////////////////////////////////////////////////////////////
if (mobilise == undefined) { var mobilise = function () {}; }
if (mobilise.ninemsn == undefined) { mobilise.ninemsn = function () {}; }

///////////////////////////////////////////////////////////////////////////////
//
// AJAX Wrapper Class
//
///////////////////////////////////////////////////////////////////////////////
if (mobilise.ninemsn.ajax == undefined) {
mobilise.ninemsn.ajax = function ()
{
    this.loadDoc = function(url, fnc)
    {
    	var xmlhttp;

    	if (window.XMLHttpRequest)
    	{
            var instance = this;
    		xmlhttp=new XMLHttpRequest();
    		xmlhttp.onreadystatechange = function() { instance.xmlhttpChange(xmlhttp, fnc); };
    		xmlhttp.open("GET",url,true);
    		xmlhttp.send(null);
    	}
    	else if (window.ActiveXObject)
    	{
    		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
    		if (xmlhttp)
    		{
    			var instance = this;
    			xmlhttp.onreadystatechange = function() { instance.xmlhttpChange(xmlhttp, fnc); }
    			xmlhttp.open("GET",url,true);
    			xmlhttp.send();
    		}
    	}
    }

    this.createCallback = function(fnc)
    {
    	var args = [];

    	for(var i=1; i < arguments.length; i++)
    	{
    		args.push(arguments[i]);
    	}		

    	return function()
    	{
    		for(var i=0; i < arguments.length; i++)
    		{
    			args.push(arguments[i]);
    		}			

            return fnc.apply(undefined, args);
    	}
    }

    this.xmlhttpChange = function(xmlhttp, fnc)
    {
    	if (xmlhttp.readyState == 4)
    	{
    		if (xmlhttp.status == 200)
    		{
    			fnc(xmlhttp.responseText);
    		}
    		else
    		{
    			fnc();
    		}
    	}
    }
}
}

var mobiliseAjaxObj = new mobilise.ninemsn.ajax();

if (mobilise.ninemsn.gomobile == undefined) {

mobilise.ninemsn.gomobile = function ()
{
    // node ids
    var _ID_ENTER = "gmw-panel-enter";
    var _ID_THANK = "gmw-panel-thank";
    var _ID_SORRY = "gmw-panel-sorry";
    var _ID_BTNSENDSMS = "gmw-btn-sendsms";
    var _ID_TXTBXSENDSMS = "gmw-txtbx-sendsms";
	var _ID_ENTERLINK = "gmw-panel-enter-morelink";
    var _ID_THANKLINK = "gmw-panel-thank-morelink";
    var _ID_SORRYLINK = "gmw-panel-sorry-morelink";

    var _CODE_FAIL = "fail";
    var _CODE_UNDEFINED = "undefined";
    var _CODE_NONE = "none";
    var _CODE_INLINE = "inline";
    var _CODE_VALID_MOBNO = "valid mobile number";

	// default gomobile delivery page
    var _GOMOBILE_URL = "/gomobile/gomobiledelivery.aspx?_mnum={0}&_msite={1}&z={2}";
	var _gomobileURL = _GOMOBILE_URL;

    // regular expression for phone number
    var _MOBILENO_REG = new RegExp(/^(0|(\+)?61)?4[0-9]{8}$/);

    var _VAR_HOSTSITE = "_mhost";
    var _VAR_TARGETSITE = "_msite";
    var _DEFAULT_HOSTSITE = "mobilise";
    var _DEFAULT_TARGETSITE = "mobilise";

    var _siteNameProductMap = {
    "bars"         : ["yourtime bars", "bars"],
	"beijing2008"  : ["beijing2008", "beijing2008"],
    "cleo"         : ["cleo", "cleo"],
    "celebrityfix" : ["celebrityfix", "celebrityfix"],
    "gigs"         : ["yourtime gigs", "gigs"],
    "news"         : ["national nine news", "news"],
    "ralph"        : ["ralph", "ralph"],
    "hotmail"      : ["windows live hotmail", "hotmail"],
    "messenger"    : ["windows live messenger", "messenger"],
    "livesearch"   : ["windows live search", "livesearch"],
    "movies"       : ["yourtime movies", "moviefix"],
    "mobilise"     : ["mobilise", "mobilise"],
    "restaurants"  : ["yourtime restaurants", "restaurants"],
    "spaces"       : ["windows live spaces", "spaces"],
    "tv"           : ["yourtime tv", "tvfix"],
    "sixtyminutes"           : ["sixtyminutes", "sixtyminutes"],
    "wwos"         : ["wwos", "wwos"]};

    var _MAP_IND_SMSNAME = 0;
    var _MAP_IND_TRACK = 1;

    var _PNL_ENTER = 0;
    var _PNL_THANK = 1;
    var _PNL_SORRY = 2;
    var _panelArray = [_ID_ENTER, _ID_THANK, _ID_SORRY];
    var _mobiliseAjaxObj = null;

    var _hostName = "";    // the host that shows the gomobile widget
    var _siteName = "";    // the logical name of the site
    var _smsSiteName = ""; // the name of the site understood by the SMS delivery page
    var _trackName = "";   // the code used for tracking this site

    this.processSendSms = function(txtBoxHandle)
    {
        var phoneNo = "";

        if (!txtBoxHandle) { return true; }

        phoneNo = txtBoxHandle.value;

        if (!phoneNo || !phoneNo.match(_MOBILENO_REG))
        {
            this.activateSmsPanel(_PNL_SORRY);
        }
        else
        {
            // in future, if the advertisement media need to be tracked, assign
            // code to this variable
            var adParam = ""

            var goMobileUrl = _gomobileURL.format(phoneNo, _smsSiteName, adParam);
            var instance = this;
            _mobiliseAjaxObj.loadDoc(goMobileUrl, function(xHtml) { instance.sendSmsCallBack(_hostName, _smsSiteName, xHtml); });
        }

        return false;
    }

	this.redirectPage = function(handleId)
	{
		var handle = document.getElementById(handleId);

		if (handle && handle.href)
		{
			window.parent.location.href = handle.href.toString();
		}

		return false;
	}

    this.activateSmsPanel = function(panelId)
    {
        if (typeof (_panelArray[panelId]) == _CODE_UNDEFINED) { return; }

        var handle = null;

        for (var i = 0; i < _panelArray.length; i++)
        {
            handle = document.getElementById(_panelArray[i]);
            
            if (handle) { handle.style.display = _CODE_NONE; }
        }

        handle = document.getElementById(_panelArray[panelId]);

        if (handle) 
        { 
            handle.style.display = _CODE_INLINE; 
        }
    }

    // attach onclick events to the required button/links
    this.init = function()
    {
        var handle = document.getElementById(_ID_BTNSENDSMS);
        var txtbxHandle = document.getElementById(_ID_TXTBXSENDSMS);
        var instance = this;

        this.addEvent(txtbxHandle, "keypress", function(event) { return instance.keyHandler(event, txtbxHandle); });
        //this.addKeyEvent(txtbxHandle, function(event) { return instance.keyHandler(event, txtbxHandle); });

        this.addEvent(handle, "click", function() { instance.processSendSms(txtbxHandle) });

		handle = document.getElementById(_ID_ENTERLINK);

		if (handle)
		{
			this.addEvent(handle, "click", function() { instance.redirectPage(_ID_ENTERLINK) });
		}	

        handle = document.getElementById(_ID_THANKLINK);
        this.addEvent(handle, "click", function() { instance.activateSmsPanel(0) });

        handle = document.getElementById(_ID_SORRYLINK);
        this.addEvent(handle, "click", function() { instance.activateSmsPanel(0) });
		
        var requestMap = this.getRequestMap();
        _hostName = ((requestMap[_VAR_HOSTSITE] != undefined) && (requestMap[_VAR_HOSTSITE].length > 0)) ? requestMap[_VAR_HOSTSITE] : _DEFAULT_HOSTSITE;
        _siteName = ((requestMap[_VAR_TARGETSITE] != undefined) && (requestMap[_VAR_TARGETSITE].length > 0)) ? requestMap[_VAR_TARGETSITE] : _DEFAULT_TARGETSITE;

        this.setSiteName(_siteName)

        _mobiliseAjaxObj = (typeof (window.mobiliseAjaxObj) != null) ? window.mobiliseAjaxObj : new mobilise.ninemsn.ajax();
    }

	this.setSiteName = function(siteName)
	{
		if (!siteName || (typeof (_siteNameProductMap[siteName]) == _CODE_UNDEFINED))
		{
			_siteName = _DEFAULT_TARGETSITE;
		} else
		{
			_siteName = siteName;
		}

        _smsSiteName = _siteNameProductMap[_siteName][_MAP_IND_SMSNAME];
        _trackName = _siteNameProductMap[_siteName][_MAP_IND_TRACK];
	}

	this.setGoMobileURL = function(gomobileURL)
	{
		if (!gomobileURL)
		{
			return;
		}

		_gomobileURL = gomobileURL;
	}

    this.testUrlParser = function()
    {
        //this.debug("hostName = {0}, siteName = {1}".format(hostName, siteName));
        alert("hostName = {0}, siteName = {1}, smsSiteName = {2}, trackName = {3}".format(_hostName, _siteName, _smsSiteName, _trackName));
    }

    this.getRequestMap = function()
    {
        var returnVal = new Object();
        var urlStr = (location.href == null) ? "" : location.href.toString().toLowerCase();
        var paramStartIndex = urlStr.indexOf("?");

        if (paramStartIndex == -1) { return returnVal; }

        urlStr = urlStr.substr(paramStartIndex + 1);

        var paramValArray = urlStr.split("&"); // parse out name/value pairs separated via &
        
    	// split out each name = value pair
    	for (var i = 0; i < paramValArray.length; i++)
    	{
    		var pair = paramValArray[i].split("=");

    		// fix broken unescaping
    		var temp = unescape(pair[0]).split('+');
    		var name = temp.join(' ');
    		temp = unescape(pair[1]).split('+');
    		var value = temp.join(' ');
    		returnVal[name] = value;
    	}

        return returnVal;
    }

    this.sendSmsCallBack = function(hostName, siteName, xHtml)
    {
        if (typeof (xHtml) == _CODE_UNDEFINED) { return; }

        if (!xHtml || (xHtml.indexOf(_CODE_FAIL) > -1))
        {
            this.activateSmsPanel(_PNL_SORRY);
        } 
        else
        {
            this.activateSmsPanel(_PNL_THANK);
        }
    }
    
    this.keyHandler = function(e, txtbxHandle)
    {
        var keyCodeVal = 0;

        if (e && e.which) 
        {
            e = e;
            keyCodeVal = e.which;
        } else
        {
            if ((typeof (event) != _CODE_UNDEFINED) && (typeof (event.keyCode) != _CODE_UNDEFINED))
            {
                e = event
                keyCodeVal = e.keyCode;
            }
        }
        
        if (keyCodeVal == 13)
        {
            e.cancelBubble = true;
            e.cancel = true;

            if (typeof e["preventDefault"] != "undefined")
            {
                e.preventDefault();
            }

           return this.processSendSms(txtbxHandle);
        }
        else
        {
            return true;
        }
    }

///////////////////////////////////////////////////////////////////////////////
//
// Helper Functions
//
///////////////////////////////////////////////////////////////////////////////
    /**
     * X-browser event handler attachment and detachment
     * @argument obj - the object to attach event to
     * @argument evType - name of the event - DONT ADD "on", pass only "mouseover", etc
     * @argument fn - function to call
     */
    this.addEvent = function(obj, evType, fn)
    {
        if (obj == undefined) { return; }

    	if (obj.addEventListener)
    	{
    		obj.addEventListener(evType, fn, false);
    		return true;
    	} else if (obj.attachEvent)
    	{
    		var r = obj.attachEvent("on" + evType, fn);
    		return r;
    	} else 
    	{
    		return false;
    	}
    }
    
    this.addEvent2 = function(obj, evType, fn, useCapture) 
    {
        // General function for adding an event listener
        if (obj.addEventListener) 
        {
            obj.addEventListener(evType, fn, useCapture);
            return true;
        }
        else if (obj.attachEvent) 
        {
            var r = obj.attachEvent("on" + evType, fn);
            return r;
        } 
        else 
        {
            alert(evType + " handler could not be attached");
        }
    }

    this.addKeyEvent = function(handle, keyEventHandler) 
    {
        // Specific function for this particular browser
        var e = (handle.addEventListener) ? "keypress" : "keydown";
        this.addEvent2(handle, e, keyEventHandler, false);
    }

///////////////////////////////////////////////////////////////////////////////
//
// Debug Functions
//
///////////////////////////////////////////////////////////////////////////////
    this.debug = function(str)
    {
        var handle = document.getElementById("debug");

        if (!handle) { return; }

        handle.innerHTML = str + "<br />";
    }

///////////////////////////////////////////////////////////////////////////////

    this.init();
}
} // if (mobilise.ninemsn.gomobile == undefined) end

if (mobilise.ninemsn.vars == undefined) {
    mobilise.ninemsn.vars = {};
}

mobilise.ninemsn.vars["gomobileObj"] = new mobilise.ninemsn.gomobile();

