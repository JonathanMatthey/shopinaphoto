    //multi site enabled -- sid: community.mirror.co.uk 
    document.write("<link href='http://community.mirror.co.uk/ver1.0/SiteLifeCss?sid=community.mirror.co.uk' rel='stylesheet' type='text/css' />");
    document.write("<script type='text/javascript' src='http://community.mirror.co.uk/ver1.0/SiteLifeScripts?sid=community.mirror.co.uk'></script>");
	document.write("<link href='http://images.mirror.co.uk/css/m4/sitelife.css' rel='stylesheet' type='text/css' />");

///<summary>constructor to create a new SiteLifeProxy</summary>
function SiteLifeProxy(url) {
    // User Configurable Properties - these can be set at any time

    // your apiKey, this value must be set!
    this.apiKey = null;
    
    this.siteLifeDomainOverride = null;
    this.siteLifeServerBaseOverride = null;
    this.customerCSSOverride = null;
    this.customerForumPagePathOverride = null;
    this.gcid = "Widgets1.0";

    // sniff the browser for custom behaviors
    this.__isExplorer = navigator.userAgent.toLowerCase().indexOf('msie') != -1;
    this.__isSafari = navigator.userAgent.toLowerCase().indexOf('safari') != -1;
    this.__isMac = navigator.platform.toLowerCase().indexOf('mac') != -1;
    this.__isMacIE = this.__isMac && this.__isExplorer;
    
    // if enabled, spit out debug information through alert()
    this.debug = false;
    
    // used to track the id of the handler expecting the results from the immediately preceeding method invocation
    // this is used only for testing purposes
    this.lastHandlerId = "";
    
    // Methods You can Overide
    //
    // OnSuccess(returnValue) - is passed the return value at the end of a successful call, default does nothing
    // OnError(msg) - is passed an error message if a problem occurs
    // OnDebug(msg) - is called when debugging is enabled
     
    this.__baseUrl = url;
    this.__sendInvokeCount = 0;
    
    this.__eventHandlers = new Object();
};

SiteLifeProxy.prototype.AddEventHandler = function (event_name, callback) {
	var eventList = this.__eventHandlers[event_name];
	if (!eventList){
		eventList = new Array();
		this.__eventHandlers[event_name] = eventList;
	}
	eventList.push(callback);
};

SiteLifeProxy.prototype.FireEvent = function (event_name) {
    var func;
    var handlers;
    if(handlers = this.__eventHandlers[event_name]) {
        var A = new Array(); for (var i = 1; i <  this.FireEvent.arguments.length; i++){ A[i - 1] = this.FireEvent.arguments[i];}
        for(var x=0;x<handlers.length;x++){
			func = handlers[x];
			if (func.__Bound){
			   if (handlers.length == 1) return func();
			   func();
			}
			if (handlers.length == 1) return func.apply(this, A);
			func.apply(this, A);
    }
}
};

SiteLifeProxy.prototype.ScriptId = function() { return this.__scriptId = "_bb_script_" + this.__sendInvokeCount++; }

// Default error handler for the proxy object, simple alert
SiteLifeProxy.prototype.OnError = function(msg) {
   alert("OnError: " + msg);
}

// Default debug handler for the proxy object, simple alert
SiteLifeProxy.prototype.OnDebug = function(msg) {
    if (this.debug)
        alert("Debug: " + msg);
}

// fetch a named request parameter from the page URL
SiteLifeProxy.prototype.GetParameter = function(parameterName) {
    var key = parameterName + "=";
    var parameters = document.location.search.substring(1).split("&");
    for (var i = 0; i < parameters.length; i++)
    {
        if (parameters[i].indexOf(key) == 0)
            return parameters[i].substring(key.length);
    }
    return null;
};

// browser independent method to get elements by ID
SiteLifeProxy.prototype.GetElement = function(id) {
    this.OnDebug("GetElement " + id);
    if (document.getElementById)
        return document.getElementById(id);
    if (document.all)
        return document.all[id];
    this.OnError("No support for GetElement() in this browser");
    return null;
}

// browser independent method to get elements by tag name
SiteLifeProxy.prototype.GetTags = function(tagName) {
    this.OnDebug("GetTags " + tagName);
    if (document.getElementsByTagName)
        return document.getElementsByTagName(tagName);
    if (document.all)
       return document.tags(tagName);
    this.OnError("No support for GetTags() in this browser");
    return null;
}

SiteLifeProxy.prototype.Trim = function(s) {
	return s.replace(/^\s+|\s+$/g,"");

};

SiteLifeProxy.prototype.EscapeValue = function(s) {
    if (s == null) return null;
    return encodeURIComponent(s);
};

SiteLifeProxy.prototype.__ArrayValidation = function(s)
{
    if ((typeof s == 'undefined') || (s.length < 1))
    {
        return false;
    }
    return true;
}

SiteLifeProxy.prototype.__CheckErrorHandler = function(onError) {
    this.OnDebug("__CheckErrorHandler " + onError);
    if ((typeof onError == 'undefined') || (eval("window." + onError) == null))
    {
      return "gSiteLife.OnError";
    }
    return onError;
}
SiteLifeProxy.prototype.SetCookie = function SetCookie( name, value) {
    var today = new Date(); today.setTime( today.getTime() );
    
    var expires_date = new Date( today.getTime() + 126144000000 );
    
    document.cookie = name + "=" +escape( value ) +
    ";expires=" + expires_date.toGMTString() + 
    ";path=/" + ";domain=mirror.co.uk" ;
}
// validate and fetch arguments, if the argument is missing and optional, we return an empty string        
SiteLifeProxy.prototype.__GetArgument = function(variableName, variableValue, isRequired, isArray) {
    this.OnDebug("__GetArgument " + variableName + "," + variableValue + "," + isRequired + "," + isArray);
    if (typeof variableValue == "undefined" || variableValue == null || variableValue == "")
    {
        if (isRequired)
        {
            this.OnError("Missing required parameter " + variableName);
            this.__isValid = false;
            return "";
        }
        else
            return "";
    }
    if (isRequired && isArray) 
    {
        if (!this.__ArrayValidation(variableValue)) 
        {
            this.OnError("Invalid array parameter " + variableName);
            this.__isValid = false;
            return "";
        }
    }
    return "&" + variableName + "=" + this.EscapeValue(variableValue);
};

SiteLifeProxy.prototype.__StripAnchorFromUrl = function(url) {
    var aIdx = url.indexOf("#");
    return aIdx == -1 ? url : url.substring(0, aIdx);
}

SiteLifeProxy.prototype.__SafeAppendUrlValue = function(url, key, value) {
    url += url.indexOf("?") != -1 ? "&" : "?";
    return url + key + "=" + value;
}

SiteLifeProxy.prototype.__AppendUrlValues = function (url)
{
	time = new Date();
    url += this.__GetArgument("plckNoCache", time.getTime(), false, false);
    url += this.__GetArgument("plckApiKey", this.apiKey, true, false);
    		url += this.__GetArgument("pckgp", this["pckgp"], false, false);
    		url += this.__GetArgument("pckgpp", this["pckgpp"], false, false);
    		url += this.__GetArgument("pckvp", this["pckvp"], false, false);
    		url += this.__GetArgument("pckvd", this["pckvd"], false, false);
    		url += this.__GetArgument("pckvg", this["pckvg"], false, false);
    		url += this.__GetArgument("pckps", this["pckps"], false, false);
    		url += this.__GetArgument("pckcbu", this["pckcbu"], false, false);
    		url += this.__GetArgument("pckdt", this["pckdt"], false, false);
    		url += this.__GetArgument("pckcgp", this["pckcgp"], false, false);
    		url += this.__GetArgument("pckas", this["pckas"], false, false);
    		url += this.__GetArgument("pckli", this["pckli"], false, false);
    		url += this.__GetArgument("pcklo", this["pcklo"], false, false);
    		url += this.__GetArgument("pckr", this["pckr"], false, false);
    		url += this.__GetArgument("pckfp", this["pckfp"], false, false);
    		url += this.__GetArgument("pckov", this["pckov"], false, false);
    		url += this.__GetArgument("pckpm", this["pckpm"], false, false);
    		url += this.__GetArgument("pcksld", this["pcksld"], false, false);
    		url += this.__GetArgument("pcksbu", this["pcksbu"], false, false);
    		url += this.__GetArgument("pckcss", this["pckcss"], false, false);
    		url += this.__GetArgument("pckfpp", this["pckfpp"], false, false);
    		url += this.__GetArgument("pckppp", this["pckppp"], false, false);
                            url += this.__GetArgument("sid", gSiteLife.SID, false, false);
                
    return url;
}

SiteLifeProxy.prototype.ReloadPage = function(params) {
    var sSearch = window.location.search.substring(1);
    var sNVPs = sSearch.split('&');
    var newSearch = "";
    var anchorPoint = "";
    for(var k in params) {
        if(k == "extend") continue;
		if(k == "#") {
			anchorPoint = '#' + params[k];
			continue;
		}		
        if(newSearch == "") newSearch += "?"; else newSearch += "&";
        newSearch += k + '=' + params[k];
    }
    for (var i = 0; i < sNVPs.length; i++) {
        var kv = sNVPs[i].split('=');
        if(kv[0] && kv[0].indexOf('plck') != 0 && ! params[kv[0]]) {
            newSearch += "&" + sNVPs[i];        
        }
    }
            
    if(anchorPoint != ""){ 
        window.location.hash = anchorPoint;
    }
    window.location.search = newSearch;
}

function loadScript (url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.charset = 'utf-8';
	if (callback)
		script.onload = script.onreadystatechange = function() {
			if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete')
				return;
			script.onreadystatechange = script.onload = null;
			callback();
		};
	script.src = url;
	document.getElementsByTagName('head')[0].appendChild (script);
}

// Cookie and HTTP Param manipulations
// generates a list of user keys
function getCurrentUserFromCookie() {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        var eqIndex = c.indexOf("=");
        if (eqIndex > 0) {
            name = c.substring(0, eqIndex);
            value = c.substring(eqIndex + 1);
            if (name.toLowerCase() == 'hd') {
                value = unescape(value);
                value = value.split('|');
		            	
                return value[0];
            }
        }
    }
    return null;
}

function createSrcUrl(baseUrl, url, userId, gcid, currentTime) {
    return srcUrl = baseUrl + "/Stats/Tracker.gif" + "?plckUrl=" + encodeURIComponent(url) + "&plckUserId=" + userId + "&plckGcid=" + gcid + "&plckCurrentTime=" + currentTime;
}


SiteLifeProxy.prototype.__InsertTrackerNode = function(baseUrl, requestUrl, userIdTrckr, gcid, currentTime) {
	// add script node for tracker
	if (document.getElementById('slImgNodeTrckr') === null) {
	    var trackImgNode = document.createElement('img');
	    trackImgNode.setAttribute('id', "slImgNodeTrckr");
	    trackImgNode.setAttribute('src', createSrcUrl(gSiteLife.__baseUrl, requestUrl, userIdTrckr, gcid, currentTime));
	    if (trackImgNode.style.setAttribute) {
			trackImgNode.style.setAttribute('display', 'none');
		} else {
			trackImgNode.setAttribute('style', 'display:none');
		}
	    document.getElementsByTagName('body')[0].appendChild (trackImgNode);
	}
}

SiteLifeProxy.prototype.__Send = function(url, scriptToUse, callbackName, args) {
    this.OnDebug("_Send " + url);
    
    // setup some items for tracker
    var requestUrl = location.href;
    var userIdTrckr = getCurrentUserFromCookie();
    var me = this;
    
    function gLoadScript(url, callbackName) {
      var script = document.createElement('script');
        var baseUrl = gSiteLife.__baseUrl;
      script.setAttribute('type', 'text/javascript');
    	script.setAttribute('charset', 'utf-8');
    	script.setAttribute('src', url + (callbackName ? '&EVENT_ID=' + callbackName : ''));
    	document.getElementsByTagName('head')[0].appendChild (script);
    }
    
    function initializeTracking() {
    	var d = new Date();
		
		// We are using jQuery's object detection to determine if the browser is ready for us
		// to insert our stat tracker node.
		// Mozilla, Opera and webkit nightlies currently support this event
		if (document.addEventListener) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", function(){
				document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
				me.__InsertTrackerNode(gSiteLife.__baseUrl, requestUrl, userIdTrckr, me.gcid, d.getTime());
			}, false );
			
		// If IE event model is used
		} else if (document.attachEvent) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", function(){
				if ( document.readyState === "complete" ) {
					document.detachEvent( "onreadystatechange", arguments.callee );
					me.__InsertTrackerNode(gSiteLife.__baseUrl, requestUrl, userIdTrckr, me.gcid, d.getTime());
				}
			});

			// If IE and not an iframe
			// continually check to see if the document is ready
			if ( document.documentElement.doScroll && window == window.top ) (function(){

				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					document.documentElement.doScroll("left");
				} catch( error ) {
					setTimeout( arguments.callee, 0 );
					return;
				}

				// and execute any waiting functions
				me.__InsertTrackerNode(gSiteLife.__baseUrl, requestUrl, userIdTrckr, me.gcid, d.getTime());
			})();
		}	
    }
    
    function bind(_function, _this, _arguments) {
      var f = function() {
        _function.apply(_this, _arguments);
      };
      f['__Bound'] = true;
      return f;
    };
    var func;
    if ((typeof callbackName == 'string') && (func = this.__eventHandlers[callbackName]) && (typeof func == 'function') && !func['__Bound']) {
      this.__eventHandlers[callbackName] = bind(func, this, args);
    }
    
    //append our various parameters as necessary
    url = this.__AppendUrlValues(url);
    this.OnDebug("_Send (updated) " + url);
    // add the script node to the document
    if (document.createElement && ! this.__isMacIE) {
        gLoadScript(url, callbackName);
        initializeTracking();
        return;
    }

    // could fall back to sync at this point, but will bust if the page is already loaded

    this.OnError("No support for async in this browser");
}

SiteLifeProxy.prototype.Logout = function(ScriptToUse, IsRestPage) {
    var plckRest = IsRestPage ? true : false;
    this.__Send(this.__baseUrl + '/Utility/Logout?plckRedirectUrl=' + escape(window.location.href) + '&plckRest=' + plckRest, ScriptToUse);
    return false;
}

SiteLifeProxy.prototype.AddLoadEvent = function(func) {
if(window.addEventListener){
 window.addEventListener("load", func, false);
}else{
 if(window.attachEvent){
   window.attachEvent("onload", func);
 }else{
   if(document.getElementById){
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function() {
       if (oldonload) {
        oldonload();
       }
       func();
}}}}}}

SiteLifeProxy.prototype.AdInsertHelper = function() {
    for(var src in gSiteLife.__adsToInsert) {
        if(src == "extend") continue;
        var dest = gSiteLife.__adsToInsert[src];
        var parent = document.getElementById(dest);
		var newChild = document.getElementById(src);
		if( ! parent || ! newChild ) {continue; }
		parent.replaceChild( newChild, document.getElementById(dest + "Child"));
		newChild.style.display = "block"; parent.style.display = "block";
    }
}

SiteLifeProxy.prototype.InsertAds = function(source, destination) {
gSiteLife.__adsToInsert = new Object();
for(ii=0; ii< this.InsertAds.arguments.length; ii+=2) { gSiteLife.__adsToInsert[this.InsertAds.arguments[ii]] = this.InsertAds.arguments[ii+1];}
this.AddLoadEvent(gSiteLife.AdInsertHelper);
}

SiteLifeProxy.prototype.TitleTag = function() {
 var titleTag = document.getElementById("plckTitleTag");
 return titleTag ? titleTag.innerText || titleTag.textContent : null;
 }

SiteLifeProxy.prototype.WriteDiv = function(id, divClass) {
    var cssClass = divClass ? divClass : "";
    document.write('<div id="'+id+'" class="'+cssClass+'"></div>'); return id;
}

SiteLifeProxy.prototype.InnerHtmlWrite = function(elementId, innerContents ) {
    var el = document.createElement("div");
    try {
        if(document.location.href.indexOf("debug=true") > -1) {
            el.innerHTML += "<div style='border:1px solid red;'><span style='background-color:red; color:white; position:absolute; cursor:pointer; font-size:8pt;' onclick='DebugShowInnerHTML(\"${plckElementId}\",\"http://community.mirror.co.uk/ver1.0/Proxies/Default.rails\");'>&nbsp;?&nbsp;</span><div>" + innerContents + "</div></div>";
        } else {
            el.innerHTML += innerContents;
            el.style.display = "inline";
        }
        var destDiv = document.getElementById(elementId);
        while (destDiv.childNodes.length >= 1) {
             destDiv.removeChild(destDiv.childNodes[0]);
        }
        
        destDiv.appendChild(el);
    } catch (error) {
        alert(elementId + " Error "  + error.number + ": " + error.description);
    }
}

SiteLifeProxy.prototype.SortTimeStampDescending = "TimeStampDescending";
SiteLifeProxy.prototype.SortTimeStampAscending = "TimeStampAscending";
SiteLifeProxy.prototype.SortRecommendationsDescending = "RecommendationsDescending";
SiteLifeProxy.prototype.SortRecommendationsAscending = "RecommendationsAscending";
SiteLifeProxy.prototype.SortRatingDescending = "RatingDescending";
SiteLifeProxy.prototype.SortRatingAscending = "RatingAscending";
SiteLifeProxy.prototype.SortAlphabeticalAscending = "AlphabeticalAscending";
SiteLifeProxy.prototype.SortAlphabeticalDescending = "AlphabeticalDescending";
SiteLifeProxy.prototype.KeyTypeExternalResource = "ExternalResource";
        



SiteLifeProxy.prototype.PersonaHeaderRequest = function(UserId) {
    var url = this.__baseUrl + '/Persona/PersonaHeader?plckElementId=personaHDest&plckUserId='+ UserId;
    this.__Send(url, "personaHeaderScript", 'persona:header', arguments);
}
SiteLifeProxy.prototype.PersonaHeader = function(UserId) {
    this.WriteDiv("personaHDest", "Persona_Main");
        this.PersonaHeaderRequest(UserId);
}
SiteLifeProxy.prototype.PersonaHeaderInbox = function() {
	// if DAAPI proxy is not present, fail gracefully
	if (!document.getElementById('PrivateMessageInbox') || !window.RequestBatch || !window.PrivateMessageFolderList) {
		var pmContainer = document.getElementById('PersonaHeader_PrivateMessageContent');
		if (pmContainer) {
			pmContainer.style.display = 'none';
		}
		return;
	}

	var rb = new RequestBatch();
	rb.AddToRequest(new PrivateMessageFolderList());
	rb.BeginRequest(serverUrl,
		function(responseBatch) {
			var count = '';
			try {
				if (responseBatch && responseBatch.Messages && responseBatch.Messages.length && responseBatch.Messages[0].Message == 'ok') {
					var folders = responseBatch.Responses[0].PrivateMessageFolderList.FolderList;
					for (var i = 0; i < folders.length; i++) {
						var f = folders[i];
						if (f.FolderID == 'Inbox') { count = f.UnreadMessageCount; break; }
					}
				}
			} catch (e) {}
			var inboxStr = "Inbox ({0})";
			var idx = inboxStr.indexOf("{0}");
			if (inboxStr == '' || idx >= -1)
				inboxStr = inboxStr.substring(0, idx) + count + inboxStr.substring(idx+3);
			var inbox = document.getElementById('PrivateMessageInbox');
			inbox.innerHTML = inboxStr;
			if (count > 0) inbox.style.fontWeight = 'bold';
		});
}

SiteLifeProxy.prototype.Persona = function(UserId) {
    this.WriteDiv("personaDest", "Persona_Main");
    var action = this.GetParameter("plckPersonaPage");
    if(action && (typeof this[action] == 'function')) this[action](UserId);
             else this.PersonaHome(UserId);
    }
SiteLifeProxy.prototype.LoadPersonaPage = function(PageName, UserId) {
    var params = new Object(); params['plckPersonaPage'] = PageName; params['plckUserId'] = UserId;
            params['UID'] = UserId;
        for(ii=2; ii< this.LoadPersonaPage.arguments.length; ii+=2) { params[this.LoadPersonaPage.arguments[ii]] = this.LoadPersonaPage.arguments[ii+1];}
    this.ReloadPage(params);
    return false;
}

SiteLifeProxy.prototype.PersonaHome = function(UserId) {

    var me = this;
    this.AddEventHandler('persona:home:complete', function() {
		me.PopulateGroupsDiv(UserId, 1);
							me.ShowTwitterFeed(UserId)
			});
    return this.PersonaSend('PersonaHome', 'personaDest', 'personaScript', UserId, null, 'persona:home:complete');

}

SiteLifeProxy.htmlEncode = function(str){
	// Fix HTML
	var ret = str;
	var div = document.createElement('div');
	var text = document.createTextNode(str);
	div.appendChild(text);
	ret = new String(div.innerHTML);

	// The above doesn't take care of quotes.
	ret = ret.replace(/"/g, '&quot;');

	return ret;
};

SiteLifeProxy.prototype.PopulateGroupsDiv = function(UserId, OnPage) {
        // a utility function to compare two urls for purposes of determining site of origin
    var isFromThisSite = function(siteOfOrigin, currentHost) {
        // assume each url has periods in it
        var siteOfOriginDotIndex = siteOfOrigin.indexOf('.');
        var currentHostDotIndex = currentHost.indexOf('.')
        if (siteOfOriginDotIndex < 0 || currentHostDotIndex < 0) {
            return false;
        }
        else {
            return siteOfOrigin.slice(siteOfOriginDotIndex).toLowerCase() == currentHost.slice(currentHostDotIndex).toLowerCase();
        }
    }
        // check for DAAPI objects; if not there, fail gracefully
    if (window.RequestBatch && window.CommunityGroupMembershipPage && window.UserKey) {
        var requestBatch = new RequestBatch();
        requestBatch.AddToRequest(new CommunityGroupMembershipPage(new UserKey(UserId+""), 8, OnPage, "TimeStampAscending", "Member"));
        requestBatch.BeginRequest("http://community.mirror.co.uk/ver1.0/Direct/Process", function(responseBatch) {
            if (responseBatch.Responses.length > 0 && responseBatch.Responses[0].CommunityGroupMembershipPage) {
                // create the div that will house all this info
                var groupsDiv = document.createElement('div');
                groupsDiv.className = 'PersonaStyle_ItemContainer';
                var groupsContainer = document.getElementById('PersonaStyle_GroupsContainer');
                // Check groupsContainer is null because PersonaStyle_GroupContainer may be absent due to private persona files.
                if (groupsContainer != null) {
                    groupsContainer.appendChild(groupsDiv);

                    var groupBaseUrl = "http://www.mirror.co.uk/groups/CommunityGroup.html";
                    var groupMembershipPage = responseBatch.Responses[0].CommunityGroupMembershipPage;
                    var groupsHtml = "<div class=\"PersonaStyle_SectionHead\">Groups</div>";
                    groupsHtml += "<div class=\"PersonaStyle_GroupList\">";
                    for (var index = 0; index < groupMembershipPage.CommunityGroupMemberships.length; index++) {
                        var currentGroup = groupMembershipPage.CommunityGroupMemberships[index].CommunityGroup;
                        // if current group is private and user is non-member, don't display
                        var display = true;
                        if (currentGroup.CommunityGroupVisibility == 'Private') {
                            display = (currentGroup.RequestingUsersMembershipTier != 'NonMember' && currentGroup.RequestingUsersMembershipTier != 'Banned');
                        }
                        if (display) {
                            // Look for any query parameters that are already using ?
                            var groupUrlResults = groupBaseUrl.match(/\?/);
                            if (groupUrlResults != null) {
                                var groupUrl = groupBaseUrl + "&slGroupKey=" + currentGroup.CommunityGroupKey.Key;
                            }
                            else {
                                var groupUrl = groupBaseUrl + "?slGroupKey=" + currentGroup.CommunityGroupKey.Key;
                            }
                                                            if (!isFromThisSite(currentGroup.SiteOfOrigin, window.location.host)) {
                                    groupsHtml += "<img height=\"50\" width=\"50\" title=\"" + SiteLifeProxy.htmlEncode(currentGroup.Title) + "\" src=\"" + currentGroup.AvatarImageUrl + "\" />";
                                }
                                else {
                                    groupsHtml += "<a href=\"" + groupUrl + "\"><img height=\"50\" width=\"50\" title=\"" + SiteLifeProxy.htmlEncode(currentGroup.Title) + "\" src=\"" + currentGroup.AvatarImageUrl + "\" /></a>";
                                }
                                                    }
                    }
                    //Pagination for Group List
                    groupsHtml += "<p><ul class=\"PersonaStyle_GroupListPagination\">";

                    if (groupMembershipPage.OnPage > 1)                {
                        groupsHtml += "<li><a href='#PreviousGroup' onclick='gSiteLife.PopulateGroupsDiv(\"" + UserId + "\", " + (parseInt(groupMembershipPage.OnPage) - 1) + ");'>&lt;&lt;Previous</a></li>";
                    }

                    if (groupMembershipPage.NumberOfCommunityGroupMemberships > (groupMembershipPage.NumberPerPage * groupMembershipPage.OnPage))                {
                        groupsHtml += "<li><a href='#NextGroup' onclick='gSiteLife.PopulateGroupsDiv(\"" + UserId + "\", " + (parseInt(groupMembershipPage.OnPage) + 1) + ");'>Next&gt&gt;</a></li>";
                    }
                    groupsHtml += "</p>";

                    //End Pagination for Group List
                    groupsHtml += "</ul><div class=\"PersonaStyle_GroupListClear\"></div>";
                    groupsHtml += "</div>";
                    groupsDiv.innerHTML = groupsHtml;

                    while(groupsContainer.hasChildNodes()) {
                        groupsContainer.removeChild(groupsContainer.childNodes[0]);
                    }
                    groupsContainer.appendChild(groupsDiv);
                }
            }
        });
    }
    // fire any other events
    this.FireEvent('persona:home');
}

SiteLifeProxy.prototype.WatchItem = function(Controller,Method,WatchKey, targetDiv) {
    var url = this.__baseUrl + '/'+Controller+'/' + Method + '?' + 'plckWatchKey=' + WatchKey + '&plckElementId=' + targetDiv + '&plckWatchUrl=' + this.EscapeValue(window.location.href);
    this.__Send(url, "AddWatchScript");
    return false;
}
SiteLifeProxy.prototype.PersonaRemoveWatchItem= function(UserId, WatchKey, Div, View) {
   return this.PersonaSend('PersonaRemoveWatchItem', Div, 'personaScript', UserId, 'plckWatchView=' + View + '&plckWatchKey=' + WatchKey);
}
SiteLifeProxy.prototype.PersonaAddFriend= function(UserId) {
   return this.PersonaSend('PersonaAddFriend', 'personaHDest', 'personaScript', UserId);
}
SiteLifeProxy.prototype.PersonaConnectionAddFriend = function(UserId) {
   return this.PersonaSend('PersonaConnectionAddFriend', 'personaDest', 'personaScript', UserId, null, 'persona:connections');
}
SiteLifeProxy.prototype.PersonaRemoveFriend = function(UserId, Friend, Div, View, Expanded, confirmMsg) {
   if(!Expanded) Expanded = "false";
   if (confirm(confirmMsg) == true) {
    return this.PersonaSend('PersonaRemoveFriend', Div, 'personaScript', UserId, 'plckFriendView=' + View + '&plckFriend=' + Friend + '&plckExpanded=' + Expanded);
   }
   return false;
}
SiteLifeProxy.prototype.PersonaRemovePendingFriend = function(UserId, PendingFriend, Div, confirmMsg) {
   if (confirm(confirmMsg) == true) {
    return this.PersonaSend('PersonaRemovePendingFriend', Div, 'personaScript', UserId, 'plckPendingFriend=' + PendingFriend);
   }
   return false;
}
SiteLifeProxy.prototype.PersonaAddPendingFriend = function(UserId, PendingFriend, Div) {
    return this.PersonaSend('PersonaAddPendingFriend', Div, 'personaScript', UserId, 'plckPendingFriend=' + PendingFriend);
}
SiteLifeProxy.prototype.PersonaMessages = function(UserId) {
   var AdParams = this.GetParameter('plckCurrentPage') ? 'plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
   var scrl = this.GetParameter('plckScrollToAnchor');  if(scrl){ if(AdParams) {AdParams +='&';} AdParams += 'plckScrollToAnchor=' + scrl;}
   if(this.GetParameter('plckMessageSubmitted')){if(AdParams) {AdParams +='&';} AdParams += 'plckMessageSubmitted=' + this.GetParameter('plckMessageSubmitted');}
   return this.PersonaSend('PersonaMessages', 'personaDest', 'personaScript', UserId, AdParams, 'persona:messages');
}
SiteLifeProxy.prototype.PersonaComments = function(UserId) {
   var AdParams = this.GetParameter('plckCurrentPage') ? 'plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
   return this.PersonaSend('PersonaComments', 'personaDest', 'personaScript', UserId, AdParams, 'persona:comments');
}

SiteLifeProxy.prototype.PersonaBlog = function(UserId) {
   var AdParams = this.GetParameter('plckCurrentPage') ? 'plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
   if(AdParams) {AdParams +='&';} AdParams += 'plckBlogId=' + UserId;
   var url = this.__baseUrl + '/PersonaBlog/PersonaBlog?plckElementId=personaDest&plckUserId='+ UserId + '&' + AdParams;
   this.__Send(url, 'personaScript', 'persona:blog', arguments);
   return false;
}
SiteLifeProxy.prototype.PersonaProfile = function(UserId) {
    return this.PersonaSend('PersonaProfile', 'personaDest', 'personaScript', UserId, null, 'persona:profile');
}
SiteLifeProxy.prototype.PersonaWatchListPaginate = function(UserId, pageNum) {
    return this.PersonaPaginate('WatchList', pageNum, UserId);
}
SiteLifeProxy.prototype.PersonaFriendsPaginate = function(UserId, pageNum) {
	var AdParam = "plckFullFriendsList=true";
    return this.PersonaPaginate('Friends', pageNum, UserId, AdParam);
}

SiteLifeProxy.prototype.PersonaFriendsExpand= function(UserId) {
    var url = this.__baseUrl + '/Persona/PersonaFriends?plckFullFriendsList=true&plckFriendsPageNum=0&plckElementId=PersonaFriendsDest&plckUserId='+ UserId;
    this.__Send(url, 'PersonaFriendsScript');
    return false;
}
SiteLifeProxy.prototype.PersonaFriendsCollapse= function(UserId, pageNum) {
    var url = this.__baseUrl + '/Persona/PersonaFriends?plckFullFriendsList=false&plckFriendsPageNum=0&plckElementId=PersonaFriendsDest&plckUserId='+ UserId;
    this.__Send(url, 'PersonaFriendsScript');
    return false;
}

SiteLifeProxy.prototype.PersonaPendingFriendsPaginate = function(UserId, pageNum) {
    var AdParam = "plckPendingFriendsPageNum=" + pageNum;
    return this.PersonaPaginate('Friends', 0, UserId,AdParam);
}
SiteLifeProxy.prototype.PersonaMessagesPreviewPaginate = function(UserId, pageNum) {
    return this.PersonaPaginate('MessagesPreview', pageNum, UserId);
}
SiteLifeProxy.prototype.PersonaMessageRemove = function(UserId, pageNum, MessageKey, confirmMsg) {
   if (confirm(confirmMsg) == true) {
        return this.PersonaSend('PersonaRemoveMessage', 'personaDest', 'PersonaMessagesPageScript', UserId, 'plckCurrentPage='+ pageNum + '&plckMessageKey='+MessageKey);
   }
   return false;
}
SiteLifeProxy.prototype.PersonaSend = function(ApiName, DestDiv, ScriptName, UserId, AddParams, eventId){
    var url = this.__baseUrl + '/Persona/' + ApiName + '?plckElementId=' + DestDiv + '&plckUserId='+ UserId;
    if(AddParams) url += '&' + AddParams;
    this.__Send(url, ScriptName, eventId, arguments);
    return false;
}

SiteLifeProxy.prototype.PersonaPaginate = function(ApiName, PageNum, UserId, AddParams){
    var url = this.__baseUrl + '/Persona/Persona' + ApiName + '?plck' + ApiName + 'PageNum=' + PageNum + '&plckElementId=Persona' + ApiName + 'Dest&plckUserId='+ UserId;
    if(AddParams) url += '&' + AddParams;
    this.__Send(url, 'Persona'+ ApiName + 'Script');
    return false;
}

SiteLifeProxy.prototype.PersonaPhotoSend = function(ApiName, DestDiv, ScriptName, UserId, AddParams, eventId){
    var url = this.__baseUrl + '/PersonaPhoto/' + ApiName + '?plckElementId=' + DestDiv + '&plckUserId='+ UserId;
    if(AddParams) url += '&' + AddParams;
    this.__Send(url, ScriptName, eventId, arguments);
    return false;
}

SiteLifeProxy.prototype.PersonaMostRecent = function(UserId, PhotoID, DestDiv) {
   return this.PersonaPhotoSend('PersonaMostRecent', DestDiv, 'personaScript', UserId,'plckPhotoID=' + PhotoID);
}

SiteLifeProxy.prototype.PersonaCommunityGroupsPaginate = function(UserId, PageNum){
	return this.PersonaPaginate('CommunityGroups', PageNum, UserId);
}

SiteLifeProxy.prototype.PersonaCreateGallery = function(UserId) {
     return this.PersonaPhotoSend('UserGalleryCreate', 'personaDestPhoto', 'personaScript', UserId);
}

SiteLifeProxy.prototype.PersonaEditGallery = function(UserId,GalleryID) {
     return this.PersonaPhotoSend('UserGalleryEdit', 'userGalleryDest', 'personaScript', UserId,'plckGalleryID=' + GalleryID);
}

SiteLifeProxy.prototype.PersonaUploadToUserGallery = function(GalleryId) {
    var url = this.__baseUrl + '/Photo/PhotoUpload?plckElementId=userGalleryDest&plckGalleryID='+ GalleryId;
    this.__Send(url);
    return false;
}

SiteLifeProxy.prototype.PersonaPhotos = function(UserId) {
     return this.PersonaPhotoSend('PersonaPhotos', 'personaDest', 'personaScript', UserId, null, 'persona:photos');
}
SiteLifeProxy.prototype.PersonaAllPhotos = function(UserId) {
     return this.PersonaPhotoSend('PersonaAllPhotos', 'personaDest', 'personaScript', UserId);
}

SiteLifeProxy.prototype.PersonaGalleryPhoto = function(UserId, plckFindCommentKey) {
	var findCommentKey = gSiteLife.ReadFindCommentKey(findCommentKey, "widget:personaGalleryPhoto");

    return this.PersonaPhotoSend('PersonaGalleryPhoto', 'personaDest', 'personaScript', UserId, 'plckFindCommentKey=' + findCommentKey, "widget:personaGalleryPhoto");
}
SiteLifeProxy.prototype.PersonaMyRecentPhotos = function(UserId,ElementId, PageNum) {
     return this.PersonaPhotoSend('PersonaMyRecentPhotos', ElementId, 'personaScript', UserId,'plckPageNum=' + PageNum);
}

SiteLifeProxy.prototype.PersonaGallery = function(UserId,GalleryId,PageNum) {
     if(!PageNum){
        PageNum = gSiteLife.GetParameter("plckPageNum") ? gSiteLife.GetParameter("plckPageNum") : 0;
     }
     if(!GalleryId) {
        GalleryId = gSiteLife.GetParameter("plckGalleryID");
     }
     return this.PersonaPhotoSend('PersonaGallery', 'personaDest', 'personaScript', UserId,'plckGalleryID='+ GalleryId + '&plckPageNum=' + PageNum);
}

SiteLifeProxy.prototype.UserGalleryList = function(UserId,ElementId, PageNum) {
     return this.PersonaPhotoSend('UserGalleryList', ElementId, 'personaScript', UserId,'plckPageNum=' + PageNum);
}
SiteLifeProxy.prototype.PersonaGallerySubmissions = function(UserId,ElementId, PageNum){
     return this.PersonaPhotoSend('PersonaGallerySubmissions', ElementId, 'personaScript', UserId,'plckPageNum=' + PageNum);
}

SiteLifeProxy.prototype.PersonaGalleryPhoto = function(UserId, plckFindCommentKey) {
	var findCommentKey = gSiteLife.ReadFindCommentKey(findCommentKey, "widget:personaPhoto");

    var photoid = gSiteLife.GetParameter('plckPhotoID');
    return this.PersonaPhotoSend('PersonaGalleryPhoto', 'personaDest','personaScript', UserId,'&plckPhotoID=' +photoid + '&plckFindCommentKey=' +findCommentKey, "widget:personaPhoto");
}
SiteLifeProxy.prototype.PersonaRecentGalleryPhoto = function(UserId) {
    var photoid = gSiteLife.GetParameter('plckPhotoID');
    return this.PersonaPhotoSend('PersonaRecentGalleryPhoto', 'personaDest','personaScript', UserId,'&plckPhotoID=' +photoid);
}

SiteLifeProxy.prototype.LoadPersonaGalleryPage = function(UserId,GalleryID) {
    var params = new Object(); params['plckPersonaPage'] = 'PersonaGallery'; params['plckUserId'] = UserId;
            params['UID'] = UserId;
        params['plckGalleryID'] = GalleryID;
    this.ReloadPage(params);
    return false;
}
SiteLifeProxy.prototype.LoadPersonaPhotoPage = function(UserId,PhotoID) {
    var params = new Object(); params['plckPersonaPage'] = 'PersonaGalleryPhoto'; params['plckUserId'] = UserId;
            params['UID'] = UserId;
        params['plckPhotoID'] = PhotoID;
    this.ReloadPage(params);
    return false;
}
SiteLifeProxy.prototype.LoadPersonaRecentPhotoPage = function(UserId,PhotoID) {
    var params = new Object(); params['plckPersonaPage'] = 'PersonaRecentGalleryPhoto'; params['plckUserId'] = UserId;
            params['UID'] = UserId;
        params['plckPhotoID'] = PhotoID;
    this.ReloadPage(params);
    return false;
}

var fbHelpDialogTimeout;
SiteLifeProxy.prototype.ShowFacebookHelpDialog = function(icon){
	var x = 0;
	var y = icon.clientHeight/2;

	do {
		x += icon.offsetLeft;
		y += icon.offsetTop;
	}
	while(icon = icon.offsetParent);

	var fb_div = document.getElementById("Persona_FacebookHelpDialog");

	fb_div.style.position = "absolute";
	fb_div.style.display = "block";

	// position div to the left of icon.
	var newX = x - fb_div.clientWidth;
	var newY = y - Math.floor(fb_div.clientHeight/2);

	fb_div.style.left = newX + "px";
	fb_div.style.top = newY + "px";

	return false;
}

SiteLifeProxy.prototype.HideFacebookHelpDialog = function(){
	var fb_div = document.getElementById("Persona_FacebookHelpDialog");
	fb_div.style.display = "none";
}

SiteLifeProxy.prototype.CopyRssUrlToClipboard = function(){
	rssUrl = document.getElementById("rssUrl");
	copy(rssUrl);

	return false;
}

/* note: doesn't work with flash 10 */
function copy(inElement) {
  if (inElement.createTextRange) {
    var range = inElement.createTextRange();
    if (range)
      range.execCommand('Copy');
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="' + gSiteLife.__baseUrl + '/Content/swf/clipboard.swf" FlashVars="clipboard='+encodeURIComponent(inElement.value)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}

SiteLifeProxy.prototype.UpdateExternalUserId = function(ExternalSiteName, ExternalSiteUserId) {
	var adParam = this.BaseAdParam();
	adParam += "&externalSiteName=" + ExternalSiteName;
	adParam += "&externalSiteUserId=" + ExternalSiteUserId;
	return this.PersonaSend('UpdateExternalUserId', 'personaHDest', 'personaScript', '', adParam);
}




SiteLifeProxy.prototype.PersonaConnections = function(UserId){
   var AdParams = "";

   
   return this.PersonaSend('PersonaConnections', 'personaDest', 'personaScript', UserId, AdParams, 'persona:connections');
}

SiteLifeProxy.prototype.UpdateTwitterPrefs = function(UserId, tweetOnPersona, tweetComments) {
    return this.PersonaSend('UpdateTwitterPrefs', 'personaDest', 'personaScript', UserId, '?tweetMyComments=' + tweetComments + '&personaTwitterWidget=' + tweetOnPersona);
}

SiteLifeProxy.prototype.UpdateYahooPrefs = function(UserId, yahooComments) {
    return this.PersonaSend('UpdateYahooPrefs', 'personaDest', 'personaScript', UserId, '?yahooMyComments=' + yahooComments);
}

SiteLifeProxy.prototype.UpdateLinkedInPrefs = function(UserId, linkedInComments) {
    return this.PersonaSend('UpdateLinkedInPrefs', 'personaDest', 'personaScript', UserId, '?LinkedInMyComments=' + linkedInComments);
}



window.twitterAuthComplete = function(userName, userId) {
    setTimeout(function(){
	    gSiteLife.twitterLoginWindow.close();
	    if(window.focus){
	        window.focus();
	    }

	    gSiteLife.PersonaConnections(userId);
	}, 10);
};

SiteLifeProxy.prototype.BeginTwitterAuth = function(UserId){
    this.currentUserId = UserId;
	this.twitterLoginWindow = window.open("http://community.mirror.co.uk/ver1.0/Persona/BeginTwitterAuth",'twitterLoginWindow','');
	return false;
};

// Matches http://*, https://*
SiteLifeProxy.prototype.ReplaceUrlsWithLinks = function(msg){
	var linkRegex = new RegExp("(https?://[^\\s]*)", "g");
	return msg.replace(linkRegex, '<a href="$1">$1</a>');
};

SiteLifeProxy.prototype.ShowTwitterFeed = function(UserId){
	var permissionCheck = new RequestBatch();
	permissionCheck.AddToRequest(new UserExtendedPrefs(new UserKey(UserId)));
	permissionCheck.BeginRequest("http://community.mirror.co.uk/ver1.0/Direct/Process", function(responseBatch) {
		if(responseBatch.Responses && responseBatch.Responses[0] && responseBatch.Responses[0].UserExtendedPrefs
		   && responseBatch.Responses[0].UserExtendedPrefs.Prefs && responseBatch.Responses[0].UserExtendedPrefs.Prefs.PersonaTwitterWidget
		   && responseBatch.Responses[0].UserExtendedPrefs.Prefs.PersonaTwitterWidget == "True"){
			var request = new RequestBatch();
			request.AddToRequest(new UserTwitterStatus(new UserKey(UserId)));
			request.BeginRequest("http://community.mirror.co.uk/ver1.0/Direct/Process", function(responseBatch) {
				if(responseBatch.Responses && responseBatch.Responses[0] && responseBatch.Responses[0].UserTwitterStatus){
					var twitterStatus = responseBatch.Responses[0].UserTwitterStatus;

					var msg = gSiteLife.ReplaceUrlsWithLinks(twitterStatus.Status);

					//Replace @username with link to user as well...
					var userRegex = new RegExp("@([^\\s]*)", "g");
					var results = msg.match(userRegex);
					if (results != null) {
					    for (var i=0; i < results.length; i++) {
					        var emailExtension = /@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					        var checkExts = results[i].match(emailExtension);
					        if (checkExts != null && checkExts != "") {
					          // make sure we don't link email addresses
					          results[i] = results[i].replace(emailExtension, results[i]);
					          msg = msg.replace(emailExtension, results[i]);
					        }
					        else {
					          var linkedScreenName = results[i].replace(userRegex, '@<a href="http://www.twitter.com/$1">$1</a>');
					          msg = msg.replace(results[i], linkedScreenName);
					        }
					    }
					}

					var html = "";

					html += '<div class="PersonaStyle_SectionHead">';
					html += '	My Latest Tweet';
					html += '</div>';

					html += '	<table><tbody><tr>';
					html += '	<td class="slSocialAvatar"><a href="http://www.twitter.com/' + twitterStatus.ScreenName+ '" target="_blank"><img src="' + twitterStatus.AvatarUrl +'" /></a></td>';
					html += '	<td class="slSocialStatus">' + msg +'</td>';
					html += '	</tr></tbody></table>';

					var dest = document.getElementById("PersonaTwitterDest");
					if(dest){
						dest.innerHTML = html;
						dest.style.display = "block";
					}
				}
			});
		}
	});
}

SiteLifeProxy.prototype.InviteDialogInit = function(shortUserPersonaUrl) {
    gSiteLife.ShowSocialInviteDialog(shortUserPersonaUrl);
}

SiteLifeProxy.prototype.ShowSocialInviteDialog = function(inviteUrl) {
    var modalElem = document.getElementById('twitterInviteDialog');
    var parentElem = modalElem.parentNode;

    // Safari doesn't like it when you use documentElement to retrieve the value for scrollTop and scrollLeft.
	var scrollLeftVal = document.documentElement.scrollLeft > document.body.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
	var scrollTopVal = document.documentElement.scrollTop > document.body.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

	//Position box in the center of the screen horizontally and 200 px from top vertically.
	var isIE = /*@cc_on!@*/false;
	var clientWidth = isIE ? document.body.clientWidth : document.documentElement.clientWidth;
	var clientHeight = isIE ? document.body.clientHeight : document.documentElement.clientHeight;

    parentElem.style.display = 'block';
    var newLeft = Math.floor(scrollLeftVal + (clientWidth/2) - (modalElem.clientWidth/2));
    var newTop = Math.floor(scrollTopVal + (clientHeight/2) - (modalElem.clientHeight/2));

    if(newLeft < 0) newLeft = 0;
    if(newTop < 0) newTop = 0;
    else if (newTop > 200) newTop = 250;
    modalElem.style.left = newLeft + "px";
		modalElem.style.top = newTop + "px";

		if (document.getElementById('slSocialInviteMsg') === null) {
		    var textMsg = "Come join me" + " " + inviteUrl;
		    var charCnt = 140 - textMsg.length;

		    // Draw textarea
		    var container = document.getElementById('slTextAreaId');
		    var textAreaTag = document.createElement('textarea');
		    textAreaTag.className = "slSocialFormInputText";
		    textAreaTag.setAttribute("id", "slSocialInviteMsg");
		    // Subtract the length of the inviteMessageUrl from the total character count
		    var maxCharCnt = 140 - inviteUrl.length;
		    textAreaTag.onkeyup = function() { gSiteLife.TextCounter(this, 'count_display', 140, textMsg); };
		    textAreaTag.maxlength = 140;
    		textAreaTag.innerHTML = textMsg;
		    container.appendChild(textAreaTag);

		    // Draw character counter
		    var spanContainer = document.getElementById('slTextCounterId');
		    var spanTextCnt = document.createElement('span');
		    spanTextCnt.setAttribute("id", "count_display");
		    spanTextCnt.innerHTML = charCnt + " characters remaining";
		    spanContainer.appendChild(spanTextCnt);

		    // Store tinyurl in a hidden div.
		    var storeTinyUrl = document.getElementById('slTinyId');
			storeTinyUrl.innerHTML = inviteUrl;
		}

}

var selectedUsers = [];
SiteLifeProxy.prototype.ToggleTwitterFriendSelection = function(userKey) {
    var idx = selectedUsers.indexOf(userKey);
    if (idx > -1) {

        selectedUsers.splice(idx, 1);
        document.getElementById("friendListCheckbox_" + userKey).checked = false;
    }
    else {

        selectedUsers.push(userKey);
        document.getElementById("friendListCheckbox_" + userKey).checked = true;
    }
}

SiteLifeProxy.prototype.HideInviteTwitterDialog = function() {
    var modalElem = document.getElementById('twitterInviteDialog');
    modalElem.parentNode.style.display = 'none';
}

SiteLifeProxy.prototype.ConnectTwitterFriends = function() {
    for (var i=0; i < selectedUsers.length; i++) {
        gSiteLife.PersonaConnectionAddFriend(selectedUsers[i]);
    }
    window.location.reload();
}



SiteLifeProxy.prototype.SendTweetToTwitterFriends = function(msg, defaultMsg) {

    var request = new RequestBatch();
    request.AddToRequest( new SendTwitterMessageAction(msg, "", "") );
    request.BeginRequest("http://community.mirror.co.uk/ver1.0/Direct/Process", function(responseBatch) {
        if (responseBatch.Messages && responseBatch.Messages.length === 1 && responseBatch.Messages[0].Message === 'ok') {
            // Tweet was successfully posted.
            var twitterSuccessMsg = document.getElementById('slSocialSuccessId');
            var twitterTextArea = document.getElementById('slSocialInviteMsg');
            var cnt = document.getElementById('count_display');
			      if (twitterSuccessMsg) {
			          twitterSuccessMsg.style.display = "block";
				        setTimeout(function() {
				            twitterSuccessMsg.style.display = "none";
				            var inviteMessageUrl = document.getElementById('slTinyId').innerHTML;
		                var textMsg = "Come join me" + " " + inviteMessageUrl;
		                twitterTextArea.value = textMsg;
				            var currentCnt = 140 - textMsg.length;
				            cnt.innerHTML = currentCnt + " characters remaining";
				            gSiteLife.HideInviteTwitterDialog();
				        }, 5000);
			      }

        } else {
            // Error in sending tweet message occurred.
            var twitterErrorMsg = document.getElementById('slSocialErrorId');
            if (twitterErrorMsg) {
                twitterErrorMsg.style.display = "block";
                twitterErrorMsg.innerHTML = responseBatch.Messages[0].Message;
            }
        }
    });
}



SiteLifeProxy.prototype.TextCounter = function(textarea, counterID, maxLen, defaultMsg) {

    var cnt = document.getElementById(counterID);

    if (textarea.value.length > maxLen) {
        textarea.value = textarea.value.substring(0, maxLen);
        return false;
    }
    var currentCnt = maxLen - textarea.value.length;
    cnt.innerHTML = currentCnt + " characters remaining";
}




SiteLifeProxy.prototype.SolicitPhoto = function(galleryID) {
	var elementId = 'plcksolicit' + galleryID;
	this.WriteDiv(elementId);
    var url = this.__baseUrl + '/Photo/SolicitPhoto?plckElementId=' + elementId + '&plckGalleryID=' +galleryID;
    this.__Send(url);
    return false;
}

SiteLifeProxy.prototype.PhotoUpload = function() {
	var elementId = 'plcksubmit';
	this.WriteDiv(elementId);
    var galleryID = gSiteLife.GetParameter('plckGalleryID');

    var url = this.__baseUrl + '/Photo/PhotoUpload?plckElementId=' + elementId + '&plckGalleryID=' +galleryID;
    this.__Send(url);
    return false;
}

SiteLifeProxy.prototype.PublicGallery = function() {
    var elementId = 'plckgallery';
	this.WriteDiv(elementId);
	var galleryID = gSiteLife.GetParameter('plckGalleryID');
    var pageNum = gSiteLife.GetParameter('plckPageNum');
	
    var url = this.__baseUrl + '/Photo/PublicGallery?plckElementId=' + elementId + '&plckGalleryID=' +galleryID + '&plckPageNum=' +pageNum;
	this.__Send(url);
	return false;
}


SiteLifeProxy.prototype.GalleryPhoto = function() {
	var elementId = 'plckphoto';
	this.WriteDiv(elementId);
    var photoid = gSiteLife.GetParameter('plckPhotoID');
    var findCommentKey = gSiteLife.ReadFindCommentKey(null, "widget:galleryPhoto");

    var url = this.__baseUrl + '/Photo/GalleryPhoto?plckElementId=' + elementId + '&plckPhotoID=' +photoid + '&plckFindCommentKey=' + findCommentKey;
	this.__Send(url, null, "widget:galleryPhoto");
	return false;
}

SiteLifeProxy.prototype.PublicGalleries = function() {
	var elementId = 'plckgalleries';
	this.WriteDiv(elementId);
    var pageNum = gSiteLife.GetParameter('plckPageNum') ?  gSiteLife.GetParameter('plckPageNum') : "0";

    var url = this.__baseUrl + '/Photo/PublicGalleries?plckElementId=' + elementId + '&plckPageNum=' + pageNum;
    this.__Send(url);
    return false;
}

SiteLifeProxy.prototype.PhotoRecommend = function(targetid,recommendDiv,isGallery) {
    var url = this.__baseUrl + '/Photo/Recommend?plckElementId=' + recommendDiv + '&plckTargetid=' +targetid + '&plckIsGallery=' +isGallery ;
    this.__Send(url);
    return false;
}

//<script type="text/javascript">

//parentKeyType can be any gSiteLife.KeyType* value, but for including this widget on an article page the value is 
//typically gSiteLife.KeyTypeExternalResource
SiteLifeProxy.prototype.Comments = function(parentKeyType, parentKey, pageSize, sort, showTabs, tab, parentUrl, parentTitle, refreshPage, findCommentKey)
{
	return this.CommentsInternal(parentKeyType, parentKey, pageSize, sort, showTabs, tab, parentUrl, parentTitle, false, false, null, refreshPage, findCommentKey);
};

SiteLifeProxy.prototype.CommentsInput = function(parentKeyType, parentKey, redirectToUrl)
{    
    return this.CommentsInternal(parentKeyType, parentKey, null, "TimeStampDescending", null, null, null, null, true, false, redirectToUrl, false, null);
};

SiteLifeProxy.prototype.CommentsOutput = function(parentKeyType, parentKey, refreshPage, pageSize, sortOrder)
{
    sortOrder = sortOrder || "TimeStampDescending";
	return this.CommentsInternal(parentKeyType, parentKey, pageSize, sortOrder, null, null, null, null, false, true, null, refreshPage, null);
}

SiteLifeProxy.prototype.CommentsRefresh = function(parentKeyType, parentKey, pageSize, sortOrder)
{
    if (!parentKey || parentKey == "") throw "Must pass in value for parentKey!";
    return this.CommentsInternal(parentKeyType, parentKey, pageSize, sortOrder, null, null, null, null, false, false, null, true, null);
}

SiteLifeProxy.prototype.CommentsInternal = function(parentKeyType, parentKey, pageSize, sort, showTabs, tab, parentUrl, parentTitle, hideView, hideInput, redirectToUrl, refreshPage, findCommentKey)
{
    var divId = 'Comments_Container';
    if(this.numCommentsWidgets){ divId += this.numCommentsWidgets++; } else { this.numCommentsWidgets = 1; }
    
    document.write("<div id='" + divId + "'></div>");
    
    return this.GetComments(parentKeyType, parentKey, parentUrl, parentTitle, 0, pageSize, sort, showTabs, tab, hideView, hideInput, redirectToUrl, refreshPage, divId, findCommentKey);
}

SiteLifeProxy.prototype.ReadFindCommentKey = function(plckFindCommentKey, eventName){
	var findCommentKey = plckFindCommentKey || gSiteLife.GetParameter("plckFindCommentKey") || "";
    if(findCommentKey == "none"){
		findCommentKey = "";
    }
    
    if(findCommentKey != "" && eventName){
		this.AddEventHandler(eventName, function(){gSiteLife.ScrollToComment(findCommentKey)});
    }
    
    if(findCommentKey == "") {
                                var commentsScrollDiv = document.getElementById('Comments_OuterContainer');
                                if (commentsScrollDiv) {
                                                commentsScrollDiv.scrollIntoView(true);
                                }
    }
    
    return findCommentKey;
}

SiteLifeProxy.prototype.GetComments = function(parentKeyType, parentKey, parentUrl, parentTitle, page, pageSize, sort, showTabs, tab, hideView, hideInput, redirectTo, refreshPage, divId, findCommentKey)
{
    parentKeyType = parentKeyType || "ExternalResource";
    parentUrl = parentUrl || gSiteLife.__StripAnchorFromUrl(window.location.href);
    parentUrl = gSiteLife.EscapeValue(parentUrl);
    parentKey = parentKey || gSiteLife.__StripAnchorFromUrl(window.location.href);
    parentTitle = parentTitle || gSiteLife.EscapeValue(gSiteLife.Trim(document.title));
    page = page || gSiteLife.GetParameter('plckCurrentPage') || 0;
    pageSize = pageSize || 10;
    sort = sort || "TimeStampAscending";
    showTabs = showTabs || false;
    tab = tab || "MostRecent";
    hideView = hideView || false;
    hideInput = hideInput || false;
    redirectTo =gSiteLife.EscapeValue(redirectTo) || "";
    refreshPage = refreshPage || false;
    findCommentKey = gSiteLife.ReadFindCommentKey(findCommentKey, "widget:comments");
    
    var url = this.__baseUrl + 
        '/Comment/GetPage.rails?plckTargetKeyType='+ parentKeyType + 
        '&plckTargetKey=' + escape(parentKey) + 
        "&plckCurrentPage=" + page + 
        "&plckItemsPerPage=" + pageSize + 
        "&plckSort=" + sort + 
        "&plckElementId=" + divId +
        "&plckTargetUrl=" + parentUrl +
        "&plckTargetTitle=" + parentTitle +
        "&plckHideView=" + hideView +
        "&plckHideInput=" + hideInput +
        "&plckRefreshPage=" + refreshPage +
        "&plckRedirectToUrl=" + redirectTo +
        "&plckFindCommentKey=" + findCommentKey;

    if (showTabs) {
        url = url + "&plckShowTabs=true&plckTab=" + tab;
    }
    this.__Send(url, null, "widget:comments");
    return false;
};

SiteLifeProxy.prototype.WaitForImages = function(callback){
	var allImgs = document.images;
	
}

SiteLifeProxy.prototype.ScrollToComment = function(commentKey){
		setTimeout(function(){
		window.location.hash = "#" + commentKey;
	}, 300);
}

SiteLifeProxy.prototype.Blog = function(BlogId) {
    this.WriteDiv("blogDest", "Persona_Main");
    var action = this.GetParameter("plckBlogPage");
    // If BlogId was not explicitly stated, grab it from the URL parameter...
    if(!BlogId){
		BlogId = this.GetParameter('plckBlogId');
    }
    
        
	if(action && action != "Blog" && (typeof this[action] == 'function')){
	 return this[action](BlogId);
	}else{
	   var AdParams = this.GetParameter('plckCurrentPage') ? 'plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
	   return this.BlogSend('Blog', 'Blog', 'blogDest', 'blogScript', BlogId, AdParams);
	}
}
SiteLifeProxy.prototype.LoadBlogPage = function(PageName, BlogId) {
    var params = new Object(); params['plckBlogPage'] = PageName; params['plckBlogId'] = BlogId; 
    for(ii=2; ii< this.LoadBlogPage.arguments.length; ii+=2) { params[this.LoadBlogPage.arguments[ii]] = this.LoadBlogPage.arguments[ii+1];}
    this.ReloadPage(params);
    return false;
}

SiteLifeProxy.prototype.BlogViewEdit = function(blogId) {
   return this.BlogSend(null, 'BlogViewEdit', null, null, blogId);
}

SiteLifeProxy.prototype.BlogPostCreate = function(blogId) {
   return this.BlogSend(null, 'BlogPostCreate', null, null, blogId, 'plckRedirectUrl=' + this.GetParameter("plckRedirectUrl"));
}

SiteLifeProxy.prototype.BlogPendingComments = function(blogId, currentPage) {
   if( !currentPage) currentPage = 0;
   return this.BlogSend(null, 'BlogPendingComments', null, null, blogId, 'plckCurrentPage='+currentPage);
}

SiteLifeProxy.prototype.BlogSettings = function(blogId) {
   return this.BlogSend(null, 'BlogSettings', null, null, blogId);
}

SiteLifeProxy.prototype.BlogEditPost = function(blogId, controller, div, script, postId, selection, daysBack) {
	return this.BlogSend(controller, 'BlogPostEdit', div, script, blogId, 'plckPostId=' + postId + '&plckSelection=' + selection + '&plckDaysBack=' + daysBack + '&plckRedirectUrl=' + this.EscapeValue(window.location.href));
}

SiteLifeProxy.prototype.BlogRemovePost = function(blogId, controller, div, script, postId, selection, daysBack, confirmMsg) {
  if (confirm(confirmMsg) == true) {
    return this.BlogSend(controller, 'BlogRemovePost', div, script, blogId, 'plckPostId=' + postId + '&plckSelection=' + selection + '&plckDaysBack=' + daysBack );
  }
  return false;
}

SiteLifeProxy.prototype.BlogViewPost = function(blogId, postId, selection, daysBack) {
    if(!postId ) { postId = gSiteLife.GetParameter('plckPostId'); }
    var findCommentKey = gSiteLife.ReadFindCommentKey(null, "widget:blog");
	return this.BlogSend(null, 'BlogViewPost', null, null, blogId, 'plckPostId=' + postId + '&plckSelection=' + selection + '&plckDaysBack=' + daysBack + '&plckCommentSortOrder=' + this.GetParameter('plckCommentSortOrder') + '&plckFindCommentKey=' + findCommentKey);
}

SiteLifeProxy.prototype.BlogViewMonth = function(blogId, monthId) {
	if(!monthId ) { monthId = gSiteLife.GetParameter('plckMonthId'); }
	var AdParams = 'plckMonthId=' + monthId;
	AdParams += this.GetParameter('plckCurrentPage') ? '&plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
	return this.BlogSend(null, 'BlogViewMonth', null, null, blogId,  AdParams);
}

SiteLifeProxy.prototype.AddBlogWatchItem= function(blogId, controller, script, Url, WatchKey) {
   return this.BlogSend(controller, 'AddBlogWatch', 'plckBlogWatchDiv', script, blogId, 'plckWatchKey=' + WatchKey + '&plckWatchUrl=' + this.EscapeValue(Url));
}
SiteLifeProxy.prototype.RemoveBlogWatchItem= function(blogId, controller, script, WatchKey) {
   return this.BlogSend(controller, 'RemoveBlogWatch', 'plckBlogWatchDiv', script, blogId, 'plckWatchKey=' + WatchKey);
}

SiteLifeProxy.prototype.BlogViewTag = function(blogId, tag) {
	if(!tag ) { tag = gSiteLife.GetParameter('plckTag'); }
	var AdParams = 'plckTag=' + tag;
	AdParams += this.GetParameter('plckCurrentPage') ? '&plckCurrentPage=' + this.GetParameter('plckCurrentPage') : "";
	return this.BlogSend(null, 'BlogViewTag', null, null, blogId, AdParams );
}

SiteLifeProxy.prototype.BlogRefreshViewEditList= function(blogId, controller, div, script, selection, daysBack) {
	return this.BlogSend(controller, 'BlogRefreshViewEditList', div, script, blogId, 'plckSelection=' + selection + '&plckDaysBack=' + daysBack  );
}

SiteLifeProxy.prototype.BlogSend = function(controller, apiName, destDiv, scriptName, blogId, addParams){
    if(!controller) controller = this.GetParameter('plckController') || "Blog";
    if(!destDiv) destDiv = this.GetParameter('plckElementId') || "blogDest";
    if(!scriptName) scriptName = this.GetParameter('plckScript') || "blogScript";
    var url = this.__baseUrl + '/' + controller + '/' + apiName + '?plckElementId=' + destDiv + '&plckBlogId=' + blogId + '&' + addParams;
    this.__Send(url, scriptName, 'widget:blog');
    return false;
}

SiteLifeProxy.prototype.Recommend = function(controller, itemId, recommendDiv) {
    var url = this.__baseUrl + '/' + controller + '/Recommend?plckElementId=' + recommendDiv + '&plckItemId=' +itemId;
    this.__Send(url);
    return false;
}
SiteLifeProxy.prototype.BlogSelectPendingComments = function(formId, checked) {   
    var form = document.getElementById(formId);
    for (i=0; i<form.elements.length; i++) {
        var input = form.elements[i];        
        input.checked = checked;
    }
}



SiteLifeProxy.prototype.Forums = function(numPerPage, dontWriteDiv) {    
	if (!dontWriteDiv)
		this.WriteDiv("forumDest", "Forum_Main");
	
	var action = this.GetParameter("plckForumPage");

		
	
	
		
  var forumId = this.GetParameter('plckForumId');        
  if (forumId)
  {
    forumId = unescape(forumId);
    var i = forumId.indexOf('Forum:');
    forumId = forumId.substring(i).replace(':', '_');    
  }
  else
  {
    var discussionId = this.GetParameter('plckDiscussionId');
    if (discussionId)
    {                    
	    discussionId = unescape(discussionId);
	    var i = discussionId.indexOf('Forum:');
	    var j = discussionId.indexOf('Discussion:');
	    forumId = discussionId.substring(i, j).replace(':', '_');
    }
  }
	
    
	var categoryCurrentPage = this.GetParameter('plckCategoryCurrentPage');
	if(action && (typeof this[action] == 'function') && action != 'ForumCategories'){
		  this[action]();
	}
	else {    
	       
	    if( numPerPage == null ){
		      numPerPage = this.GetParameter('plckNumPerPage');
	    } 
		  this.ForumCategories(numPerPage, categoryCurrentPage);
	}
}

SiteLifeProxy.prototype.SetupCallbacks = function(){
	var adParam = "";
    var showFirstUnread = this.GetParameter('plckShowFirstUnread'); 
    var findPostKey = this.GetParameter('plckFindPostKey');
    if(showFirstUnread != null){
		adParam += "&plckShowFirstUnread=" + showFirstUnread;
		this.AddEventHandler("widget:forums", function(){gSiteLife.DiscussionScrollToPost()});
    }
    if(findPostKey != null && findPostKey != ""){
		adParam += "&plckFindPostKey=" + findPostKey;
		this.AddEventHandler("widget:forums", function(){gSiteLife.DiscussionScrollToPost()});
    }
    var showLatestPost = this.GetParameter('plckShowLatestPost'); 
    if(showLatestPost != null){
		adParam += "&plckShowLatestPost=" + showLatestPost;
		this.AddEventHandler("widget:forums", function(){gSiteLife.DiscussionScrollToPost()});
    }
    
    this.AddEventHandler("widget:forums", function(){
		gSiteLife.DiscussionScanForUnread();

		// insert poll widget if the discussion is a poll		

		var me = this;
		var insertPoll = function(retryCount) {
			if (retryCount > 10) {
				return;
			}
			if (typeof(retryCount) === 'undefined') {
				retryCount = 0;
			}
			var pollWidgetDiv = document.getElementById('Discussion_Poll_Container');
			if (pollWidgetDiv) {
				var discussionKey = document.getElementById('DiscussionKeyContainer').value;
				slGetDiscussionPollOnKey = function() {
					return discussionKey;
				}
				window.slPollWidgetDiv = document.getElementById('Discussion_Poll');
				var pollInsertionScript = document.createElement('script');
				pollInsertionScript.type = 'text/javascript';
				pollInsertionScript.src = 'http://community.mirror.co.uk/ver1.0/Forums/PollParams?plckDiscussionId=' + discussionKey;
				document.getElementsByTagName('head')[0].appendChild(pollInsertionScript);
			}
			else {
				setTimeout(function() {
					insertPoll(retryCount + 1);
				}, 100);
			}
		}
		insertPoll();

    	});

	// Hack for the anchor on the categories page...
	this.AddEventHandler("widget:forums", function(){
		if(document.location.hash){
			var foo = document.location.hash + "";
			document.location.hash = foo;
		}
	});
    
    return adParam;
}

SiteLifeProxy.prototype.ForumCategories = function(numPerPage, categoryCurrentPage) {
    var pageNum = this.GetParameter('plckCurrentPage'); if(pageNum == null) pageNum = 0;
    var urlPageInfoStr = '';
    urlPageInfoStr = '&plckNumPerPage=' + numPerPage;        
    urlPageInfoStr += '&plckCategoryCurrentPage=' + categoryCurrentPage;
    
    var categoryKey = this.GetUrlParts('plckCategoryId');
	 
	  if (categoryKey) {
	      this.ForumCategory(categoryKey);
	  } else {
        return this.ForumSend("ForumCategories", "forumDest", "ForumMain", 'plckCurrentPage=' + pageNum + urlPageInfoStr);
    }
}
SiteLifeProxy.prototype.Forum = function() {
    var forumId = this.GetParameter('plckForumId');
    var discussionCreatedSortOrder = this.GetParameter('plckDiscussionCreatedSortOrder');
    var categoryPageNum = this.GetParameter('plckCategoryCurrentPage');
    if(categoryPageNum == null) { categoryPageNum = 0; }
    var discussionPageNum = this.GetParameter('plckCurrentPage');
    if (discussionPageNum == null) { discussionPageNum = 0; }
    var numPerPage = this.GetParameter('plckNumPerPage');
    var urlPageInfoStr = '';
    if( numPerPage != null ){
        urlPageInfoStr = '&plckNumPerPage=' + numPerPage;
    }
   return this.ForumSend('Forum', 'forumDest', 'ForumMain', 'plckForumId=' + forumId + '&plckCurrentPage=' + discussionPageNum + '&plckCategoryCurrentPage=' + categoryPageNum + urlPageInfoStr + '&plckDiscussionCreatedSortOrder=' + discussionCreatedSortOrder);
}
SiteLifeProxy.prototype.ForumDiscussion = function() {
    var dId = this.GetParameter("plckDiscussionId");
    var adParam = "plckDiscussionId=" + dId;
    var showLast = this.GetParameter("plckShowLastPage"); if(showLast) adParam += "&plckShowLastPage=true";
    var pageNum = this.GetParameter('plckCurrentPage'); if(pageNum == null) pageNum = 0;
	adParam += this.SetupCallbacks(); 
    adParam += "&plckCurrentPage=" + pageNum;
    adParam += "&plckCategoryCurrentPage=" + this.GetParameter('plckCategoryCurrentPage');   
    
    return this.ForumSend("ForumDiscussion", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.DiscussionScanForUnread = function(discussionKey){
	var postDatesContainer = document.getElementById("PostDateInfoContainer");
	if(!postDatesContainer){
		return;
	}
	
	this.postDates = eval(postDatesContainer.value);
	this.latestPost = new Date(document.getElementById("LastReadContainer").value);
	this.screenBottom = 0;
	if(discussionKey){
		this.discussionKey = discussionKey;
	}
	else if (document.getElementById('DiscussionKeyContainer')){
		this.discussionKey = document.getElementById('DiscussionKeyContainer').value;
	}
	
	this.checkForReadInterval = setInterval(function(){gSiteLife.DiscussionCheckForLatestPost();}, 1000);
}

SiteLifeProxy.prototype.DiscussionScrollToPost = function(){
	if(!document.getElementById("Discussion_ScrollToPostKey")){
		return false;
	}
	
	var postKey = document.getElementById("Discussion_ScrollToPostKey").value;
	var post = document.getElementById(postKey);
	
	if(!post){
		return false;
	}
	
	var postTop = 0;
	if(post.offsetParent){
		obj = post;
		do{
			postTop += obj.offsetTop;
		}
		while(obj = obj.offsetParent);
		window.scrollBy(0, postTop);
	}
}

SiteLifeProxy.prototype.IsPostOnScreen = function(screenBottom, postIndex){
	var postId = "readIndicator_" + this.postDates[postIndex].Key;
	var post = document.getElementById(postId);
	if(post){
		var postTop = 0;
		if(post.offsetParent){
			obj = post;
			do{
				postTop += obj.offsetTop;
			}
			while(obj = obj.offsetParent);
		}
		var postBottom = postTop + post.offsetHeight;
		
		if(postBottom < screenBottom){
			return true;
		}
	}
	
	return false;
}

SiteLifeProxy.prototype.DiscussionCheckForLatestPost = function(){
	var screenTop = 0;
	if (typeof(window.pageYOffset) !== 'undefined') {
		screenTop = window.pageYOffset;
	}
	else if (typeof(document.documentElement) !== 'undefined' && typeof(document.documentElement.scrollTop) !== 'undefined' && document.documentElement.scrollTop > 0) {
		screenTop = document.documentElement.scrollTop;
	}
	else if (typeof(document.body.scrollTop) !== 'undefined' && document.body.scrollTop > 0) {
		screenTop = document.body.scrollTop;
	}
	
	var screenBottom = Math.pow(2,52); /*Supposing our browser can't get the height, we mark everything as read.*/
	if(window.innerHeight){
		screenBottom = screenTop + window.innerHeight;
	}
	else if(document.documentElement.clientHeight && document.documentElement.clientHeight != 0){
		screenBottom = screenTop + document.documentElement.clientHeight;
	}
	else if(document.body.clientHeight){
		screenBottom = screenTop + document.body.clientHeight;
	}
	
	/* Only update if we've scrolled down since last poll. */
	if(screenBottom <= this.screenBottom){
		return;
	}
	
	/* Just give up if there are no posts. */
	if(!this.postDates || this.postDates.length <= 0){
		clearInterval(this.checkForReadInterval);
		return;
	}
	
	/* If the last post is already marked read, don't bother polling. */
	if(this.postDates[(this.postDates.length - 1)].Timestamp <= this.latestPost){
		clearInterval(this.checkForReadInterval);
		return;
	}
	
	this.screenBottom = screenBottom;
	
	var latestKey = null;
	
	for(i=0; i < this.postDates.length; i++){
		if(this.IsPostOnScreen(screenBottom, i)){
			if(this.postDates[i].Timestamp >= this.latestPost){
				latestKey = this.postDates[i].Key;
				this.latestPost = this.postDates[i].Timestamp;
			}
		}
	}

	if(latestKey){
		this.ForumSetLastRead(this.discussionKey, latestKey);
	}
}

SiteLifeProxy.prototype.ForumCreateDiscussion = function() {
    var adParam = "plckRedirectUrl=" + this.GetParameter("plckRedirectUrl");
    var fId = this.GetParameter("plckForumId"); adParam += "&plckForumId=" + fId;
    var curView = this.GetParameter("plckCurrentView"); if(curView) adParam += "&plckCurrentView=" + curView;
    var curPage = this.GetParameter("plckCurrentPage"); if(curPage) adParam += "&plckCurrentPage=" + curPage;
    var dId = this.GetParameter("plckDiscussionId"); if(dId) adParam += "&plckDiscussionId=" + dId;
    adParam += "&plckCategoryCurrentPage=" + this.GetParameter('plckCategoryCurrentPage');    
    return this.ForumSend("ForumCreateDiscussion", "forumDest", "ForumMain", adParam);
}
SiteLifeProxy.prototype.ForumMain = function() {
    return this.ForumSend("ForumMain", "forumDest", "ForumMain");
}
SiteLifeProxy.prototype.ForumCreatePost = function() {
    var adParam = "plckDiscussionId=" + this.GetParameter("plckDiscussionId") + "&plckRedirectUrl=" + this.EscapeValue(window.location.href);
    var PostId = this.GetParameter("plckPostId"); if(PostId) adParam = adParam + "&plckPostId=" + PostId;
    var IsReply = this.GetParameter("plckIsReply"); if(IsReply) adParam = adParam + "&plckIsReply=" + IsReply;
    var curPage = this.GetParameter("plckCurrentPage"); if(curPage) adParam = adParam + "&plckCurrentPage=" + curPage;
    adParam += "&plckCategoryCurrentPage=" + this.GetParameter("plckCategoryCurrentPage"); 
    return this.ForumSend("ForumCreatePost", "forumDest", "ForumMain", adParam);
}
SiteLifeProxy.prototype.ForumEditPost = function() {
    var adParam = "plckDiscussionId=" + this.GetParameter("plckDiscussionId") + "&plckRedirectUrl=" + this.EscapeValue(window.location.href);
    var PostId = this.GetParameter("plckPostId"); if(PostId) adParam = adParam + "&plckPostId=" + PostId;
    var CurrPage = this.GetParameter("plckCurrentPage"); if(!CurrPage) CurrPage="0"; adParam = adParam + "&plckCurrentPage=" + CurrPage;
    adParam += "&plckCategoryCurrentPage=" + this.GetParameter('plckCategoryCurrentPage');    
    return this.ForumSend("ForumEditPost", "forumDest", "ForumMain", adParam);
}
SiteLifeProxy.prototype.ForumEditProfile = function() {
    return this.ForumSend("ForumEditProfile", "forumDest", "ForumMain", "plckRedirectUrl=" + this.EscapeValue(window.location.href));
}
SiteLifeProxy.prototype.ToggleExpand = function(imageId, tableId) {
  if (!this.collapsedCategories) {
    var cookie = document.cookie && document.cookie.match(/forumCatState=([^;]+)/); 
    cookie = (cookie ? cookie[1].replace(/^\s+|\s+$/g, '') : []); 
    this.collapsedCategories = (cookie.length ? unescape(cookie).split('|') : []);
  }
  var tableElem = document.getElementById(tableId), imgElem = document.getElementById(imageId),
      id = tableId.split(':')[1], cats = this.collapsedCategories, expire;
  if (tableElem.style.display == 'none') {
    tableElem.style.display = 'block';
    imgElem.src = this.__baseUrl + '/Content/images/forums/minus.gif';
    for (var i = 0, length = cats.length; i < length; i++) {
      if ((cats[i] == id) || (cats[i] === ''))
        cats.splice(i,1);
    }
  }
  else {
    tableElem.style.display = 'none';
    cats.push(id); 
    imgElem.src = this.__baseUrl + '/Content/images/forums/plus.gif';
  }
  this.SetCookie('forumCatState', cats.join('|'));
}

SiteLifeProxy.prototype.ForumSearch = function(suffix) {
    var searchText = document.getElementById('plckSearchText'+suffix).value;
    searchText = searchText.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if (searchText.length == 0) {
		    alert("Please enter a search term.");
    } else {
		    searchText = FixSearchString(searchText);
		    var searchArea = document.getElementById('plckSearchArea'+suffix).value;
        this.LoadForumPage("ForumSearchPaginate", "plckSearchText", searchText, "plckSearchArea", searchArea, "plckCurrentPage", "0");
    }
    return false;
}
SiteLifeProxy.prototype.ForumSearchKeyPress = function(event, suffix) {
    if(IsEnter(event)){return this.ForumSearch(suffix);}else{return true;}
}
SiteLifeProxy.prototype.ForumSearchPaginate = function() {	
    return this.ForumSend('ForumSearchPaginate', 'forumDest', 'ForumMain', 'plckSearchArea=' + this.GetParameter('plckSearchArea') + '&plckSearchText=' + this.GetParameter('plckSearchText') + '&plckCurrentPage=' + this.GetParameter('plckCurrentPage'));
}

SiteLifeProxy.prototype.ForumSpecificForumSearchKeyPress = function(event, suffix, forumId) {
    if(IsEnter(event)){return this.ForumSpecificForumSearch(suffix, forumId);}else{return true;}
}
SiteLifeProxy.prototype.ForumSpecificForumSearch = function(suffix, forumId) {
    var searchText = document.getElementById('plckSearchText'+suffix).value;
    searchText = searchText.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    if (searchText.length == 0) {
		alert("Please enter a search term.");
    } else {
		searchText = FixSearchString(searchText);
		this.LoadForumPage("ForumSearchSpecificForumPaginate", "plckSearchText", searchText, "plckForumId", forumId, "plckCurrentPage", "0");
    }
    return false;
}
SiteLifeProxy.prototype.ForumSearchSpecificForumPaginate = function(title) {	
    return this.ForumSend('ForumSearchSpecificForumPaginate', 'forumDest', 'ForumMain', 'plckForumId=' + this.GetParameter('plckForumId') + '&plckSearchText=' + this.GetParameter('plckSearchText') + '&plckCurrentPage=' + this.GetParameter('plckCurrentPage'));
}

SiteLifeProxy.prototype.LoadForumPage = function(PageName, paramName, paramVal) {
    var params = new Object(); 
    params['plckForumPage'] = PageName;
    for(ii=1; ii< this.LoadForumPage.arguments.length; ii+=2) { 
        params[this.LoadForumPage.arguments[ii]] = this.LoadForumPage.arguments[ii+1];
    }
    this.ReloadPage(params);
    return false;
}

SiteLifeProxy.prototype.ForumSend = function(ApiName, DestDiv, ScriptName, AddParams){
    var url = this.__baseUrl + '/Forums/' + ApiName + '?plckElementId=' + DestDiv;
    if(AddParams) url += '&' + AddParams;
    var plckPostSort = this.GetParameter('plckPostSort');
    if (plckPostSort != null){
		  url += "&plckPostSort=" + plckPostSort;
	  }
    this.__Send(url, ScriptName, 'widget:forums', arguments);
    return false;
}

SiteLifeProxy.prototype.ForumDiscussionEdit = function(discussionId, curView, curPage) {
    return this.ForumSend('ForumDiscussionEdit', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurrentView=' + curView + '&plckCurrentPage=' + curPage + '&plckRedirectUrl=' + this.EscapeValue(window.location.href));
}

SiteLifeProxy.prototype.ForumPostEdit = function(discussionId, postId, curView, curPage) {
    return this.ForumSend('ForumEditPost', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckPostId=' + postId + '&plckCurrentView=' + curView + '&plckCurrentPage=' + curPage + '&plckRedirectUrl=' + this.EscapeValue(window.location.href));
}

SiteLifeProxy.prototype.ForumDiscussionToggleIsSticky = function(discussionId, curView, curPage) {
  var plckDiscussionCreatedSortOrder = this.GetParameter('plckDiscussionCreatedSortOrder');
  if (plckDiscussionCreatedSortOrder != null) {
    return this.ForumSend('ForumDiscussionToggleIsSticky', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage + '&plckDiscussionCreatedSortOrder=' + plckDiscussionCreatedSortOrder);
  }
	return this.ForumSend('ForumDiscussionToggleIsSticky', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage);
}

SiteLifeProxy.prototype.ForumDiscussionToggleIsClosed = function(discussionId, curView, curPage) {
    var plckDiscussionCreatedSortOrder = this.GetParameter('plckDiscussionCreatedSortOrder');
    if (plckDiscussionCreatedSortOrder != null) {
      return this.ForumSend('ForumDiscussionToggleIsClosed', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage + '&plckDiscussionCreatedSortOrder=' + plckDiscussionCreatedSortOrder);
    }
    return this.ForumSend('ForumDiscussionToggleIsClosed', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage );
}

SiteLifeProxy.prototype.ForumDiscussionUpdateExcludeFromDiscoveryFlag = function(discussionId, curView, curPage, excludeFromDiscovery) {
    var plckDiscussionCreatedSortOrder = this.GetParameter('plckDiscussionCreatedSortOrder');
    if (plckDiscussionCreatedSortOrder != null) {
      return this.ForumSend('ForumDiscussionUpdateExcludeFromDiscoveryFlag', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage + '&plckExcludeFromDiscovery=' + excludeFromDiscovery + '&plckDiscussionCreatedSortOrder=' + plckDiscussionCreatedSortOrder);
    }
    return this.ForumSend('ForumDiscussionUpdateExcludeFromDiscoveryFlag', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage + '&plckExcludeFromDiscovery=' + excludeFromDiscovery);
}


SiteLifeProxy.prototype.ForumDiscussionDelete = function(discussionId, curPage, confirmMsg) {
  var plckDiscussionCreatedSortOrder = this.GetParameter('plckDiscussionCreatedSortOrder');
  if (confirm(confirmMsg) == true) {
    if (plckDiscussionCreatedSortOrder != null) {
      return this.ForumSend('ForumDiscussionDelete', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurrentPage=' + curPage + '&plckDiscussionCreatedSortOrder=' + plckDiscussionCreatedSortOrder);
    }
    return this.ForumSend('ForumDiscussionDelete', 'forumDest', 'ForumMain', 'plckDiscussionId=' + discussionId + '&plckCurrentPage=' + curPage );
  }
  else {
	return false;
  }
}

SiteLifeProxy.prototype.MoveDiscussion = function(discussionKey, toForum, curView, curPage) {
    return this.ForumSend('MoveDiscussion', 'forumDest', 'ForumMain', 'discussionKey=' + discussionKey + '&toForum=' + toForum + '&plckCurView=' + curView + '&plckCurrentPage=' + curPage );
}

SiteLifeProxy.prototype.ForumEdit = function(forumId, curPage) {
    return this.ForumSend('ForumEdit', 'forumDest', 'ForumMain', 'plckForumId=' + forumId + '&plckCurrentPage=' + curPage  );
}

SiteLifeProxy.prototype.ForumToggleIsClosed = function(forumId, curPage) {
    return this.ForumSend('ForumToggleIsClosed', 'forumDest', 'ForumMain', 'plckForumId=' + forumId + '&plckCurrentPage=' + curPage  );
}

SiteLifeProxy.prototype.ForumDelete = function(forumId, confirmMsg) {
  if (confirm(confirmMsg) == true) {
    return this.ForumSend('ForumDelete', 'forumDest', 'ForumMain', 'plckForumId=' + forumId );
  }
  else {
	return false;
  }
}

SiteLifeProxy.prototype.ForumPostDelete = function(postId, curPage, confirmMsg) {
  if (confirm(confirmMsg) == true) {
    return this.ForumSend('ForumPostDelete', 'forumDest', 'ForumMain', 'plckPostId=' + postId + '&plckCurPage=' + curPage);
  }
  else {
	return false;
  }
}

SiteLifeProxy.prototype.ForumBlockUser = function(postId, userId, value, curPage) {
    return this.ForumSend('ForumBlockUser', 'forumDest', 'ForumMain', 'plckPostId=' + postId + '&plckUserId=' + userId + '&plckValue=' + value + '&plckCurPage=' + curPage);
}

SiteLifeProxy.prototype.ForumMyDiscussionsPaginate = function(pageNum) {
    return this.ForumSend('ForumMyDiscussionsPaginate', 'ForumMyDiscussionsDiv', 'ForumMain', 'plckMyDiscussionsPage=' + pageNum);
}

SiteLifeProxy.prototype.ForumImage = function() {
    var adParam = "plckRedirectUrl=" + this.GetParameter("plckRedirectUrl");
    var pId = this.GetParameter("plckPhotoId"); adParam += "&plckPhotoId=" + pId;
    return this.ForumSend('ForumImage', 'forumDest', 'ForumMain', adParam);
}

SiteLifeProxy.prototype.BaseAdParam = function () {
    var adParam = "plckRedirectUrl=" + this.EscapeValue(window.location.href);
    var fId = this.GetParameter("plckForumId"); adParam += "&plckForumId=" + fId;
    var curView = this.GetParameter("plckCurrentView"); if(curView) adParam += "&plckCurrentView=" + curView;
    var curPage = this.GetParameter("plckCurrentPage"); if(curPage) adParam += "&plckCurrentPage=" + curPage;
    return adParam;
}

SiteLifeProxy.prototype.ForumJoinGroup = function() {
    var adParam = this.BaseAdParam();
    var dId = this.GetParameter("plckDiscussionId"); if(dId) adParam += "&plckDiscussionId=" + dId;
    return this.ForumSend("ForumJoinGroup", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumLeaveGroup = function() {
    var adParam = this.BaseAdParam();
    var dId = this.GetParameter("plckDiscussionId"); if(dId) adParam += "&plckDiscussionId=" + dId;
    return this.ForumSend("ForumLeaveGroup", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumGroupMemberList = function() {
    var adParam = this.BaseAdParam();
    return this.ForumSend("ForumGroupMemberList", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumInviteUser = function() {
    var adParam = this.BaseAdParam();
    return this.ForumSend("ForumInviteUser", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumGroupConfirm = function() {
    var adParam = this.BaseAdParam();
    var confirmType = this.GetParameter("plckConfirmType"); if (confirmType) adParam += "&plckConfirmType=" + confirmType;
    return this.ForumSend("ForumGroupConfirm", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumSendInviteToUser = function(user, mail) {
    var adParam = this.BaseAdParam()
		,username = user || this.GetParameter("plckUsername")
	    ,email = mail || this.GetParameter("plckUserEmail");
	if (username) adParam += "&plckUsername=" + username;
    if (email) adParam += "&plckUserEmail" + email;
    return this.ForumSend("ForumSendInviteToUser", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumAddEnemy = function(enemyKey) {
    var adParam = this.BaseAdParam();
    adParam += "&enemyKey=" + enemyKey;
    var dId = this.GetParameter("plckDiscussionId"); if(dId) adParam += "&plckDiscussionId=" + dId;
    return this.ForumSend("ForumAddEnemy", "forumDest", "ForumMain", adParam);
}

SiteLifeProxy.prototype.ForumRemoveEnemy = function(enemyKey) {
    var adParam = this.BaseAdParam();
    adParam += "&enemyKey=" + enemyKey;
    var dId = this.GetParameter("plckDiscussionId"); if(dId) adParam += "&plckDiscussionId=" + dId;
    return this.ForumSend("ForumRemoveEnemy", "forumDest", "ForumMain", adParam);
}

function slGetElementsByClassName(classname, node)  {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}

	function hideAllPostsFromUser(userKey){
	  var posts = slGetElementsByClassName("postVisibilityContainer_"+userKey, document);
	  var hiddenMessages = slGetElementsByClassName("postHiddenMessage_"+userKey, document);
	  
	  for(i=0; i < posts.length; i++){
	    posts[i].style.display = "none";
	    hiddenMessages[i].style.display = "block";
	  }
	  
	  gSiteLife.ForumAddEnemy(userKey);
	}
	
	function showAllPostsFromUser(userKey){
	  var posts = slGetElementsByClassName("postVisibilityContainer_"+userKey, document);
	  var hiddenMessages = slGetElementsByClassName("postHiddenMessage_"+userKey, document);
	  	  
	  for(i=0; i < posts.length; i++){
	    posts[i].style.display = "block";
	    hiddenMessages[i].style.display = "none";
	  }
	  
	  gSiteLife.ForumRemoveEnemy(userKey);
	}
	
SiteLifeProxy.prototype.ForumChangeSort = function(sortParamName, sortDirection) {
		var currentUrl = document.location.href;
		var newUrl;
		// replace the sort param in the url, if found
		var re = new RegExp("([?|&])" + sortParamName + "=.*?(&|$)","i");
		if (currentUrl.match(re)) {
			newUrl = currentUrl.replace(re, '$1' + sortParamName + "=" + sortDirection + '$2');
		}
		else {
			if(currentUrl.indexOf('?') >= 0){
				newUrl = currentUrl + '&' + sortParamName + "=" + sortDirection;
			}
			else{
				newUrl = currentUrl + '?' + sortParamName + "=" + sortDirection;
			}
		}
		document.location.href = newUrl;
}

SiteLifeProxy.prototype.ForumSetLastRead = function(discussionKey, postKey) {
    var adParam = this.BaseAdParam();
    adParam += "&discussionKey=" + discussionKey;
    if(postKey){
		adParam += "&postKey=" + postKey;
	}
    var ret = this.ForumSend("ForumSetLastRead", "forumDest", "ForumMain", adParam);
    
    if(!postKey){
		setTimeout("location.reload();", 10);
    }
    
    return ret;
} 

SiteLifeProxy.prototype.ForumSetAllRead = function(forumKey) {
    var adParam = this.BaseAdParam();
    adParam += "&forumKey=" + forumKey;
    var ret = this.ForumSend("ForumSetAllRead", "forumDest", "ForumMain", adParam);
	setTimeout("location.reload();", 10);
    return ret;
} 

SiteLifeProxy.prototype.CategorySetAllRead = function(categoryKey) {
    var adParam = this.BaseAdParam();
    adParam += "&categoryKey=" + categoryKey;
    var ret = this.ForumSend("CategorySetAllRead", "forumDest", "ForumMain", adParam);
	setTimeout("location.reload();", 10);
    return ret;
} 

SiteLifeProxy.prototype.ForumDiscussionSubscribe = function(discussionKey, targetDiv) {
    var url = this.__baseUrl + '/Forums/ForumDiscussionSubscribe?' + 'plckDiscussionId=' + discussionKey + '&plckElementId=' + targetDiv;
    this.__Send(url, "ForumDiscussionSubscribe");
    return false;
}

SiteLifeProxy.prototype.ForumDiscussionUnSubscribe = function(discussionKey, targetDiv) {
    var url = this.__baseUrl + '/Forums/ForumDiscussionUnSubscribe?' + 'plckDiscussionId=' + discussionKey + '&plckElementId=' + targetDiv;
    this.__Send(url, "ForumDiscussionUnSubscribe");
    return false;
}

SiteLifeProxy.prototype.ForumCategory = function(categoryKey) {
    this.WriteDiv("forumDest", "Forum_Main");
    var categoryId;
    if (typeof(categoryKey) == "undefined") {
        categoryId = this.GetParameter('plckCategoryId');
    }
    else {
        categoryId = escape(categoryKey);
    }
    
    return this.ForumSend('ForumCategory', 'forumDest', 'ForumMain', 'plckCategoryId=' + categoryId);
    
}

SiteLifeProxy.prototype.GetUrlParts = function(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null ) { 
        return ""; 
    }
    else {
        return results[1];
    }
}


SiteLifeProxy.prototype.Recommend = function(keyType, targetKey, parentUrl) {
    keyType = keyType || "ExternalResource";
    targetKey = targetKey || gSiteLife.__StripAnchorFromUrl(window.location.href);
    parentUrl = parentUrl || window.location.href;
    targetKey = targetKey;
    var divId = "Recommend" + new Date().getTime();
    this.WriteDiv(divId, "Recommend");
    var url = this.__baseUrl + 
        '/Recommend/Recommend?plckElementId=' + divId + 
        '&plckTargetKey=' + gSiteLife.EscapeValue(targetKey) + 
        '&plckTargetKeyType=' + keyType +
        '&plckTargetUrl=' + gSiteLife.EscapeValue(parentUrl);
    this.__Send(url);
    return false;   
}

SiteLifeProxy.prototype.PostRecommendation = function(keyType, targetKey, recommendDiv, parentTitle, parentUrl) {
    parentUrl = parentUrl || window.location.href;
    var url = this.__baseUrl + 
        '/Recommend/PostRecommendation?plckElementId=' + recommendDiv + 
        '&plckTargetKey=' + gSiteLife.EscapeValue(targetKey) + 
        '&plckTargetKeyType=' + keyType +
        '&plckTargetUrl=' + gSiteLife.EscapeValue(parentUrl);
    if(parentTitle) url += '&plckParentTitle=' + gSiteLife.EscapeValue(parentTitle);
    
    this.__Send(url);
    return false;
}


SiteLifeProxy.prototype.RateItem = function (itemId, itemType, rating, targetDiv, parentTitle, parentUrl) {
    var url = this.__baseUrl + '/Rating/Rate?plckElementId=' + targetDiv + 
        '&plckTargetKey=' + gSiteLife.EscapeValue(itemId) + 
        '&plckTargetKeyType=' + itemType + 
        '&plckRating=' + rating +
        '&plckTargetUrl=' + gSiteLife.EscapeValue(parentUrl);
        if(parentTitle) url += '&plckParentTitle=' + parentTitle;
    this.__Send(url);
    return false;
}

SiteLifeProxy.prototype.Rating = function(itemType, itemId, parentUrl) {
    itemType = itemType || "ExternalResource";
    itemId = itemId || gSiteLife.__StripAnchorFromUrl(window.location.href);
    parentUrl = parentUrl || window.location.href;
    var divId = itemId + "_plckRateDiv_" + new Date().getTime() + Math.floor(Math.random()*1000);
    this.WriteDiv(divId, "Rating");
    var url = this.__baseUrl + '/Rating/GetRating?plckElementId=' + divId +
        '&plckTargetKey=' + gSiteLife.EscapeValue(itemId) + 
        '&plckTargetKeyType=' + itemType +
        '&plckTargetUrl=' + gSiteLife.EscapeValue(parentUrl);
    this.__Send(url);
    return false;   
}

SiteLifeProxy.prototype.RatingClickStar = function (index, targetKey, targetKeyType, targetDiv, parentTitle, parentUrl) {
    gSiteLife.RateItem(targetKey, targetKeyType, index, targetDiv, parentTitle, parentUrl);
    
}

SiteLifeProxy.prototype.RatingFillStar = function(index, targetKey, lbl) {
    var stars = document.getElementsByName(targetKey+"Stars");
    var label = document.getElementById(targetKey + "Rating-label");
    var selectedIndex = parseInt(document.getElementById(targetKey+"Rating-value").value);
    
    if (index < 0 && selectedIndex >= 0) index = selectedIndex;
    for(i=1; i <= stars.length; i++) {
        if (index > 0 && i <= index) {
            stars[i-1].src = this.__baseUrl + "/Content/images/icons/fullstar.gif";
        }else {
            stars[i-1].src = this.__baseUrl + "/Content/images/icons/emptystar.gif";
        }
    }
    label.innerHTML = lbl;
}

SiteLifeProxy.prototype.Review = function(parentKeyType, parentKey, reviewedTitle, reviewCategory, pageSize, sort, currentPage) {
    
    var divId = "Reviews_Container";
    this.WriteDiv(divId);
    return this.GetReviews(parentKeyType, parentKey, reviewedTitle, reviewCategory, pageSize, sort, currentPage);
}

SiteLifeProxy.prototype.ReviewClickStar = function (index, targetKey) {
    document.getElementById(targetKey+"Rating-value").value = index;
}

SiteLifeProxy.prototype.GetReviews = function(parentKeyType, parentKey, reviewedTitle, reviewCategory, pageSize, sort, currentPage) {
    parentKeyType = parentKeyType || "ExternalResource";
    parentKey = gSiteLife.EscapeValue(parentKey) || gSiteLife.EscapeValue(gSiteLife.__StripAnchorFromUrl(window.location.href));
    reviewedTitle = gSiteLife.EscapeValue(reviewedTitle) || gSiteLife.EscapeValue(document.title);
    reviewCategory = reviewCategory || "Uncategorized";
    pageSize = pageSize || 10;
    sort = sort || "TimeStampAscending";
    currentPage = currentPage || 0;
    var url = this.__baseUrl + '/Review/Reviews?plckElementId=Reviews_Container' +
        '&plckTargetKey=' + parentKey + 
        '&plckTargetKeyType=' + parentKeyType +
        '&plckReviewedTitle=' + reviewedTitle +
        '&plckReviewCategory=' + reviewCategory +
        '&plckSort=' + sort + 
        '&plckParentUrl=' + gSiteLife.EscapeValue(gSiteLife.__StripAnchorFromUrl(window.location.href)) + 
        '&plckParentTitle=' + gSiteLife.EscapeValue(document.title) +
        '&plckCurrentPage=' + currentPage +
        '&plckPageSize=' + pageSize;
    this.__Send(url);
    return false;   
}

SiteLifeProxy.prototype.SummaryArticlesMostCommented = function(count) {
 return this.SummaryPanel("SummaryArticlesMostCommented", count); 
} 
SiteLifeProxy.prototype.SummaryArticlesMostRecommended = function(count) {
 return this.SummaryPanel("SummaryArticlesMostRecommended", count); 
} 
SiteLifeProxy.prototype.SummaryPhotosRecentPhotosByTag = function(count, tagFilter, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryPhotosRecentPhotosByTag", count, tagFilter, filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryPhotosRecentUserPhotos = function(count, tagFilter, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryPhotosRecentUserPhotos", count, tagFilter, filterBySiteOfOrigin);
} 
SiteLifeProxy.prototype.SummaryPhotosRecentPhotos = function(count, tagFilter, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryPhotosRecentPhotos", count, tagFilter, filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryPhotosMostRecommendedPhotos = function(count, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryPhotosMostRecommendedPhotos", count, "", filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryPhotosMostRecommendedUserPhotos = function(count, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryPhotosMostRecommendedUserPhotos", count, "", filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryPhotosMostRecommendedGalleries = function(count) {
 return this.SummaryPanel("SummaryPhotosMostRecommendedGalleries", count); 
} 
SiteLifeProxy.prototype.SummaryForumsRecentDiscussions = function(count, filterBySiteOfOrigin, parentIds) {
    var divId= "Summary_Container" + this.SID;
    if(this.numSummaryWidgets){ divId += this.numSummaryWidgets++; } else { this.numSummaryWidgets = 1; }
    this.WriteDiv(divId, divId);
    var methodName = "SummaryForumsRecentDiscussions";
    var tagFilter = "";
    return this.SummarySend(methodName, divId, divId + "Script", "plckCount", count, "plckTagFilter", tagFilter, "plckFilterBySiteOfOrigin", filterBySiteOfOrigin, "plckParentIds", parentIds);
} 
SiteLifeProxy.prototype.SummaryBlogsRecent = function(count, tagFilter) {
    return this.SummaryPanel("SummaryBlogsRecent", count, tagFilter);
}
SiteLifeProxy.prototype.SummaryBlogsRecentPostsByTag = function(count, tagFilter, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryBlogsRecentPostsByTag", count, tagFilter, filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryBlogsRecentPosts = function(count, tagFilter, filterBySiteOfOrigin) {
 return this.SummaryPanel("SummaryBlogsRecentPosts", count, tagFilter, filterBySiteOfOrigin); 
} 
SiteLifeProxy.prototype.SummaryBlogsMostRecommendedPosts = function(count, tagFilter, filterBySiteOfOrigin) {
    return this.SummaryPanel("SummaryBlogsMostRecommendedPosts", count, tagFilter, filterBySiteOfOrigin);
}
SiteLifeProxy.prototype.SummaryPersonaProfileRecent = function(count) {
    return this.SummaryPanel("SummaryPersonaProfileRecent", count);
}
SiteLifeProxy.prototype.SummaryPanel = function(methodName, count, tagFilter, filterBySiteOfOrigin) {
    var divId= "Summary_Container" + this.SID;
    if(this.numSummaryWidgets){ divId += this.numSummaryWidgets++; } else { this.numSummaryWidgets = 1; }
    this.WriteDiv(divId, divId);
    return this.SummarySend(methodName, divId, divId + "Script", "plckCount", count, "plckTagFilter", tagFilter, "plckFilterBySiteOfOrigin", filterBySiteOfOrigin);
}
SiteLifeProxy.prototype.SummarySend = function(ApiName, DestDiv, ScriptName) {
    var url = this.__baseUrl + '/Summary/' + ApiName + '?plckElementId=' + DestDiv;
    for(ii=3; ii< this.SummarySend.arguments.length; ii+=2) { if(this.SummarySend.arguments[ii+1]) { url += "&" + this.SummarySend.arguments[ii] + "=" + this.SummarySend.arguments[ii+1];} }
    this.__Send(url, ScriptName);
    return false;
}




var gSiteLife = new SiteLifeProxy("http://community.mirror.co.uk/ver1.0");
gSiteLife.apiKey = "${APIKey}";
gSiteLife.SID = "community.mirror.co.uk";



    // We need to return true here as our default behavior allowing normal link navigation
    gSiteLife.AddEventHandler('ExternalResourceLink', function() {return true;});

if(gSiteLife.GetParameter('plckPersonaPage') && gSiteLife.GetParameter('plckPersonaPage').indexOf('PersonaBlog') == 0) {
document.write("<link href=" + "'http://community.mirror.co.uk/ver1.0/blog/BlogRss?plckBlogId=" + gSiteLife.GetParameter('UID') + "' title='" + gSiteLife.GetParameter('UID') + " Blog'" + "rel='alternate' type='application/rss+xml' />"); }
