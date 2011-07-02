// Common functions used by UGC components
var ugcEnvironment;

///<summary>
/// Creates the given namespace in the global context.
///</summary>
var createNamespace;
if (!createNamespace || typeof createNamespace != "function") 
{
	createNamespace = function(str) {
		var a = str.split(".");
		var o = window;
		for(var i=0; i < a.length; i++)
		{
			if (!o[a[i]])
				o[a[i]] = {};
	            
			o = o[a[i]];
		}	
	}
}

//Create the global UGC namespace used by all ugc components
createNamespace("UGC");

///<summary>
/// Global UGC Environment business entity used by all ugc components.
///</summary>
UGC.Environment = function()
{
	this.hostType = "live";
	this.jsonRequestUrlBase = "http://data.ninemsn.com.au/ugc/";
	
	this.toString = function()
	{
		return "hostType: " + this.hostType +
			", jsonRequestUrlBase: " + this.jsonRequestUrlBase
	}
}

function renderAjaxUGCControl(ugcControlType, objectId, contentTypeId, divId)
{
    var callbackFunction = function (responseElement)
    {
		try
		{
	        if (responseElement && (typeof(responseElement.UGCControl) != "undefined"))
	        {
	            
	            var mRatingMarkup = responseElement.UGCControl.Markup;
	            var mRatingScript = responseElement.UGCControl.Script;
	            var ratingDiv = document.getElementById(divId);
		        if (ratingDiv)
		        {
		            if (!isNullOrEmpty(mRatingMarkup))
		            {
			            ratingDiv.innerHTML = mRatingMarkup;
			        }
			        if (!isNullOrEmpty(mRatingScript))
		            {
			            evalGlobalJavaScript(mRatingScript);
			        }	
		        }
	            
	        }
		}
		catch (err) {
			//throw "renderAjaxUGCControl('" + ugcControlType + "'," + objectId + "," + contentTypeId + ",'" + divId + "') failed with error: " + e
		}
    }
    
    //Get the markup and script to render for rating attached to the given Revver Media										
    var fetchUrl = UGC.GetSharedAppServerUGCUrl() + "/share/com/ugc/ajaxcontrols/ugccontrol.aspx?" +
        "ugccontrol=" + ugcControlType + "&objectid=" + objectId + "&contentTypeId=" + contentTypeId;
    var jsonPropList = new Ninemsn.Global.ContentManager.JsonProp (10000, -1, null, 
        "JSONResult", Ninemsn.Global.ContentManager.Json.ResponseFunction.Unique);	
    Ninemsn.Global.ContentManager.GetContent(fetchUrl, callbackFunction, jsonPropList);
}
            

///<summary>
/// Constructs server specific URL's for Asynchronous Requests.
///</summary>
UGC.constructAsyncRequestURL = function(asyncRequestMethod, resource, queryString)
{
	//validate params
	if (!asyncRequestMethod || !resource)
	{
		return null;
	}
	
	//default query string to an empty string if needed
	if (!queryString || queryString == null)
	{
		queryString = "";
	}
	
	//construct the url
	var requestURL = "";
	var randomNumber = Math.random(); //to bypass ninemsn URL page output caching		
	if (asyncRequestMethod == "json")
	{
		requestURL = ugcEnvironment.jsonRequestUrlBase + resource + "?" + queryString + "&reset=" + randomNumber;
	}
	else if (asyncRequestMethod == "ajax")
	{
		requestURL = "/share/com/ugc/" + resource + "?" + queryString + "&reset=" + randomNumber;
	}
	else
	{
		throw "Uknown Async Request Method '" + asyncRequestMethod + "'. Valid methods include 'json', and 'ajax'."
	}
	return requestURL;
}

UGC.GetSharedAppServerUGCUrl = function()
{
	var _hostName = window.location.hostname;
	if(_hostName.indexOf("syd") != -1 || _hostName.indexOf("sbkprod") != -1 || _hostName.indexOf("paddington") != -1)
	{
		return "http://data.syd.ninemsn.com.au";
	}
	else if(_hostName.indexOf("devprev01") != -1)
	{
		return "http://data.devprev01.ninemsn.com.au";
	}
	else if(_hostName.indexOf("prev01") != -1)
	{
		return "http://data.prev01.ninemsn.com.au";
	}
	else if(_hostName.indexOf("dev-sandeepk-d") != -1)
	{
		return "http://data.dev-sandeepk-d.ninemsn.com.au";
	}
	else
	{
		return "http://data.ninemsn.com.au";
	}
}

function isNullOrEmpty(s)
{
	return (trim(s) == "");
}

function arrayContains(arr, obj)
{
    for(var i=0; i < arr.length; i++)
    {
        if(arr[i]==obj)
        {
            return true;
        }
    }
    return false;
}

function removeArrayItem(array, item)
{
	var i = 0;
	while (i < array.length)
	{
		if (array[i] == item)
		{
			array.splice(i, 1);
		}
		else
		{
			i++;
		}
	}
	
	return array;
}

function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++)
	{
		var pair = vars[i].split("=");
		if (pair[0] == variable)
		{
			return pair[1];
		}
	}

	return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function isNumericWholeNumber(sText)
{
   var ValidChars = "0123456789";
   var IsNumber=true;
   var Char;

   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
}

function hideElement(div)
{
	try
	{
		div.style.display = "none";
	}
	catch (err) {}
}

function showElement(div)
{
	try
	{
		div.style.display = "";
	}
	catch (err) {}
}

///<summary>
/// Trims the given string by removing leading and trailing white space.
///</summary>
function trim(s)
{
	//convert input to string
	s += '';
	
	//trim string
	return s.replace(/^\s+|\s+$/g, '');
}

// Render Icons

function showIcons(title, abstract)
{
	var _strReturnValue = "";

	title = EscapeHTMLAttributeString(EscapeHTMLString(EscapeJavaScriptString(title)));
    abstract = EscapeHTMLAttributeString(EscapeHTMLString(EscapeJavaScriptString(abstract)));

	_strReturnValue = renderSendToFriendIcon() + renderSendToIMThisIcons() + renderSendToSpaceIcons(title, abstract) + renderDiggThisIcons(title, abstract) + renderDeliciousIcons(title);

	return _strReturnValue;


}


// render send to friend icon
function renderSendToFriendIcon()
{

	return "<span id='icnsendfriend'><a href='/sendtoafriend.aspx' class='padA'><img src='/img/icn_email.gif' border='0' alt='Email this'></a></span>";

}

// render send to IMthis icon
function renderSendToIMThisIcons()
{
	return "<span id='icnImthis'><a href='#' class='padA' onclick='IMThis();return false;'><img src='/img/icn_msngr.gif' border='0' alt='IM this'></a></span>";
}

// render send to space icon
function renderSendToSpaceIcons(title, abstract)
{
	var url='';
    
	return "<span id='icnBlogthis'><a href='#' class='padA' onclick='javascript:blogThis(\"" + url + "\",\"" + title + "\", \"" + abstract + "\");'><img src='/img/icn_spaces.gif' border='0' alt='Add to spaces'></a>&nbsp;</span>";

}

function blogCheck()
{

	if((navigator.userAgent.indexOf('MSIE')>0)&&(navigator.userAgent.indexOf('Win')>0))
	{ 
		document.getElementById('blogThis').style.display='';
	}
}

// render digg this icon
function renderDiggThisIcons(title, abstract)
{
    	
	return "<span id='icnDiggthis'><a href='#' class='padB' onclick='javascript:diggThis(\"" + title + "\",\"" + abstract + "\");'><img src='/img/icn_digg.gif' border='0' alt='Digg this'></a></span>";

}


function diggThis(title, abstract)
{
	var diggThisApi='http://digg.com/submit';
	var topic = (typeof(JS_BLOG_TOPIC) == 'undefined' || JS_BLOG_TOPIC == '') ? 'television' : JS_BLOG_TOPIC;

	window.open('http://digg.com/submit?phase=2&url='+encodeURIComponent(location.href)+'&title=' + encodeURIComponent(title) + '&bodytext=' + escape(abstract) + '&topic=' + escape(topic));

}


// render DeliciousIcons icon
function renderDeliciousIcons(title)
{
    	
	return "<span id='icnDelicious'><a href='#' class='padB' onclick='javascript:delicious(\"" + title + "\");'><img src='/img/icn_delicious.gif' border='0' alt='Add to del.icio.us favourites'></a></span>";
}



function delicious(title)
{
	window.open('http://del.icio.us/post?v=4&noui&jump=close&url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(title), 'delicious','toolbar=no,width=700,height=400');

}

// render add to windows live
function AddToWindowsLive()
{
	window.open('http://www.live.com/?add=http://' + window.location.host + '/blog/');
}

///<summary>
/// Escapes special/illegal characters that are used by JavaScript parser. 
///</summary>
function EscapeJavaScriptString(strInput)
{
	//convert input to string
	strInput += "";
	
	//replace Backslash			with \\
    //replace Single quote		with \'
    //replace Double quote		with \"
    //replace Backspace			with \b
    //replace Form feed			with \f
    //replace Line feed	        with \n
    //replace Carriage return	with \r
    //replace New line			with \n
    //replace Horizontal tab	with \t
    //replace Vertical tab		with \u000B
    //replace Null character	with \0
	strInput = strInput.replace(/\\/g,"\\\\");
	strInput = strInput.replace(/\'/g,"\\\'");
	strInput = strInput.replace(/\"/g,"\\\"");
	strInput = strInput.replace(/\u0008/g,"\\b");
	strInput = strInput.replace(/\f/g,"\\f");
	strInput = strInput.replace(/\r/g,"\\r");
	strInput = strInput.replace(/\n/g,"\\n");
	strInput = strInput.replace(/\t/g,"\\t");
	strInput = strInput.replace(/\v/g,"\\u000B");
	strInput = strInput.replace(/\0/g,"\\0");
	
	return(strInput);
}

///<summary>
/// Escapes special/illegal characters that are used by the HTML parser.
///</summary>
function EscapeHTMLString(strInput)
{
	//convert input to string
	strInput += "";
	
	//replace & with &amp;
	strInput = strInput.replace(/&/g,"&amp;");
	
	//replace < with &lt;
	strInput = strInput.replace(/</g,"&lt;");
	
	//replace > with &gt;
	strInput = strInput.replace(/>/g,"&gt;");
	
	//replace " with &quot;
	strInput = strInput.replace(/"/g,"&quot;");
	
	//replace ' with &#39;
	strInput = strInput.replace(/'/g,"&#039;");
	
	//replace \ with &#092;
	strInput = strInput.replace(/\\/g,"&#092;");

	return(strInput);
}

///<summary>
/// Escapes special/illegal characters used in a HTML attribute (i.e. onclick) by the HTML parser.
///</summary>
function EscapeHTMLAttributeString(strInput)
{
	//convert input to string
	strInput += "";
	
	//replace new line with empty string
	strInput = strInput.replace("\n", "");
	
	//replace carriage reutrn with empty string
	strInput = strInput.replace("\r", "");
	
	// replace tab with empty string
	strInput = strInput.replace("\t", "");
	
	// replace back space with empty string
	strInput = strInput.replace("\b", "");
	
	// replace form feed with emptry string
	strInput = strInput.replace("\f", "");
	
	return(strInput);
	
}

// Evaluates the given JavaScript code within a global scope.
function evalGlobalJavaScript(code)
{
	if (window.execScript)
	{
		//run code in IE global scope
		window.execScript(code);
		return null;
	}
	
	//run code in global scope in other browsers
	var globalScopeRef = this;
	return globalScopeRef.eval ? globalScopeRef.eval(code) : eval(code);
}
