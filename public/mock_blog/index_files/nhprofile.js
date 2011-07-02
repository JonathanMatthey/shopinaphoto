/* 
 *  GCPC: ANID Switch, if "on", access ANID; if "off", access cookies; if key is undefined, uses ANID. 
 */
var JS_SBK_ANID_SWITCH;

/*
 *  GCPC: The baseurl of the ANID  
 */
var JS_SBK_ANID_BASEURL;

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
createNamespace("Ninemsn.Site.NH");

/* Base URL for the web service */
Ninemsn.Site.NH.Profile_ServiceBase = (JS_SBK_ANID_BASEURL != undefined && JS_SBK_ANID_BASEURL != null) ? JS_SBK_ANID_BASEURL : "http://data.ninemsn.com.au/NHProfile/";

/* Determine callback sensitivity, period in milliseconds. */
Ninemsn.Site.NH.Profile_WaitPeriod = 500;

/* Get profile page */
Ninemsn.Site.NH.Profile_GetPage = "GetNHProfile.aspx";

/* Set profile page */
Ninemsn.Site.NH.Profile_SetPage = "SetNHProfile.aspx";

/* Response function name */
Ninemsn.Site.NH.Profile_ResponseFcn = "NHProfile_JSONResult";

/**
  *  Ninemsn.NH.Profile:
  *
  *  A class that provides interfaces to get and set profile data
  */ 
Ninemsn.Site.NH.Profile_ServerCallOn = false;
Ninemsn.Site.NH.Profile_ServerCallCompleted = false;
Ninemsn.Site.NH.Profile_SetCallBuffer = new Array();	// Any set call made before server call is completed, is buffered.
Ninemsn.Site.NH.Profile_CacheOfAllModules = null;
Ninemsn.Site.NH.Profile_CookiesDomain = "ninemsn.com.au";
Ninemsn.Site.NH.Profile_Class = function(t,b)
{
	var defaultTimeout = t;
	var serviceBase = b;
	
	/**
	  *  readCookie: Read the value from a specified cookie name
	  */
	function readCookie(name) 
	{ 
		var cookieValue = ""; 
		var search = name + "="; 
		if(document.cookie.length > 0) 
		{  
			offset = document.cookie.indexOf(search); 
			if (offset != -1) 
			{  
				offset += search.length; 
				end = document.cookie.indexOf(";", offset); 
				if (end == -1) 
				{
					end = document.cookie.length;
				}
				cookieValue = unescape(document.cookie.substring(offset, end)) 
			} 
		} 
		return cookieValue; 
	} 

	function writeCookie(name, value, objDomain, GMT) 
	{
		var expire = ""; 
		var domain = "";
		if(objDomain != null) 
		{ 
			domain = "; domain=" + objDomain; 
		} 
		if(GMT != null) 
		{ 
			expire = "; expires=" + GMT; 
		} 	
		document.cookie = name + "=" + escape(value) + domain + expire; 
	} 
	
	function deleteCookie(name, domain)
	{
		var currCookieVal = readCookie(name);
		if (currCookieVal != "")
		{
			writeCookie(name, " ", domain, "Thu, 01-Jan-1970 00:00:01 GMT");
		}
	}
	
	/**
	  *  ANID mode switch
	  */
	function ANID_ON()
	{
		var isANIDOn = JS_SBK_ANID_SWITCH == undefined || JS_SBK_ANID_SWITCH.toLowerCase()=="on";
		/* When ANID is on, always remove the PersonalisationAndPreferences Cookie. */
		if (isANIDOn)
		{
			deleteCookie("PersonalisationAndPreferences",Ninemsn.Site.NH.Profile_CookiesDomain);
		}
		return isANIDOn;
	}
	
	/**
	  *  Get: Retrieves the value of a specified property
	  */	
	this.Get = function()
	{	
		var propertyName = "";
		var callback = null;		
		if (arguments.length > 0)
		{
			if (typeof arguments[0] == "function") 
			{
				callback = arguments[0];
			} 
			else 
			{
				propertyName = arguments[0];
				if (arguments.length > 1)
				{
					callback = arguments[1];
				}				
			}
		}

		/* 
		 * ANID MODE: 
		 * COOKIE MODE: 
		 */
		if ((ANID_ON() && readCookie("prefcookie").length==0) || 
			(!ANID_ON() && readCookie("PersonalisationAndPreferences").length==0)) 
		{
			if (callback != null) 
			{
				callback();
			}
			return false;
		}

		/* Executes user callback when response comes back */
		var executeCallBack = function(responseElement) 
		{
			if (responseElement != null && responseElement.ProfileGroupResult != null)
			{
				if (propertyName=="")
				{
					callback(responseElement.ProfileGroupResult);
				} 
				else 
				{
					var returnNull = true;
					for(var k in responseElement.ProfileGroupResult)
					{
						if (k==propertyName) 
						{
							returnNull = false;
							var profileResultObj = new Object();
							profileResultObj["ProfileResult"] = responseElement.ProfileGroupResult[k];
							callback(profileResultObj);
							break;
						}
					}
					if (returnNull)
					{
						callback(null);
					}
				}
			} 
			else if (responseElement != null) 
			{
				callback(responseElement);
			} 
			else 
			{
				callback(null);
			}		
		};		
		if (Ninemsn.Site.NH.Profile_CacheOfAllModules == null) 
		{
			if (!Ninemsn.Site.NH.Profile_ServerCallOn) 
			{
				Ninemsn.Site.NH.Profile_ServerCallOn = true;
				var AllModulesSetup_Callback = function(responseElement) 
				{
					Ninemsn.Site.NH.Profile_CacheOfAllModules = responseElement;
					Ninemsn.Site.NH.Profile_ServerCallCompleted = true;		// Flags the all modules server call is completed.
					/* If there is any buffered set calls, execute all of them */
					while(Ninemsn.Site.NH.Profile_SetCallBuffer.length > 0)
					{
						var oSet = Ninemsn.Site.NH.Profile_SetCallBuffer[0];
						Ninemsn.Site.NH.Profile_SetCallBuffer.splice(0,1);
						MakeSetCall(oSet.o_prop, oSet.o_value, oSet.o_callback, []);
					}			
					executeCallBack(responseElement);
				};				
				MakeGetCall("", AllModulesSetup_Callback, []);	// Retrieves all modules
			} 
			else 
			{
				var Singular_Callback = function()
				{
					if (Ninemsn.Site.NH.Profile_CacheOfAllModules != null)
					{
						var responseElement = Ninemsn.Site.NH.Profile_CacheOfAllModules;
						executeCallBack(responseElement);
					} 
					else
					{
						window.setTimeout(Singular_Callback,Ninemsn.Site.NH.Profile_WaitPeriod);	// Modules not retrieved, check again after wait period.
					}
				};
				Singular_Callback();				
			}
		} 
		else 
		{
			var responseElement = Ninemsn.Site.NH.Profile_CacheOfAllModules;
			executeCallBack(responseElement);
		}
	};

	/**
	  *  MakeGetCall: Make a request via the content manager to retrieve property values from the profile service
	  */	
	function MakeGetCall(propertyName, callback, params) 
	{
		if (ANID_ON())
		{	
			var url = Ninemsn.Site.NH.Profile_ServiceBase + Ninemsn.Site.NH.Profile_GetPage + "?name=" + propertyName;
			var jsonPropList = new Ninemsn.Global.ContentManager.JsonProp (
									defaultTimeout,
									-1,
									params,
									Ninemsn.Site.NH.Profile_ResponseFcn,
									Ninemsn.Global.ContentManager.Json.ResponseFunction.Unique
								);
			Ninemsn.Global.ContentManager.GetContent(url,callback,jsonPropList);
		}
		else
		{
			/* Since ANID is off, retrieves the pref from the cookies */
			var pp_cookie = readCookie("PersonalisationAndPreferences");
			var objPP = Ninemsn.Global.Serialization.JavaScriptSerializer.deserialize(pp_cookie);
			callback(objPP);	
		}
	}
	
	/**
	  *  Set: Update the value of a specified profile property
	  */		
	this.Set = function(o_prop,o_value,o_callback)
	{
		var propertyName = o_prop || "";
		var propertyValue = o_value || "";
		var callback = o_callback || function(){};
		/* If ANID existed, the set operation must be specified with a property to set value with */
		if (propertyName=="" && readCookie("prefcookie").length>0)
		{
			if (callback != null) 
			{
				callback();
			}		
			return false;
		}
		/* If all-modules get call not yet returned, buffer the set call */
		if (Ninemsn.Site.NH.Profile_ServerCallCompleted == false && 
			Ninemsn.Site.NH.Profile_ServerCallOn == true)
		{
			var setObj = new Object();
			setObj.o_prop = o_prop;
			setObj.o_value = o_value;
			setObj.o_callback = callback;
			Ninemsn.Site.NH.Profile_SetCallBuffer.push(setObj);
		} 
		else
		{
			/* There hasn't been attempt to make a get call */
			if (Ninemsn.Site.NH.Profile_ServerCallCompleted == false && 
				Ninemsn.Site.NH.Profile_ServerCallOn == false)
			{
				/* Check if the cache copy already created, if not then initiates it (not obtaining it via get call) */
				if (Ninemsn.Site.NH.Profile_CacheOfAllModules == null)
				{
					Ninemsn.Site.NH.Profile_CacheOfAllModules = new Object();
					Ninemsn.Site.NH.Profile_CacheOfAllModules["ProfileGroupResult"] = new Object();
				}
			}	
			MakeSetCall(propertyName, propertyValue, callback, []);
		}
	};

	/**
	  *  MakeSetCall: Set a property value to the profile
	  */
	MakeSetCall = function(propertyName, propertyValue, callback, params) 
	{
		/* Update the local cached copy with the property and value */
		if (Ninemsn.Site.NH.Profile_CacheOfAllModules != null && 
			Ninemsn.Site.NH.Profile_CacheOfAllModules.ProfileGroupResult != null)
		{
			var hasMatch = false;
			for(var k in Ninemsn.Site.NH.Profile_CacheOfAllModules.ProfileGroupResult)
			{
				/* There is a match of the property in the cache copy, so update the property value in the copy. */
				if (k == propertyName)
				{
					Ninemsn.Site.NH.Profile_CacheOfAllModules.ProfileGroupResult[k] = propertyValue;
					hasMatch = true;
					break;
				}
			}
			/* If there is no match in the property traversal and the property name is not empty, create it in cache. */
			if (hasMatch == false && propertyName != "")
			{
				Ninemsn.Site.NH.Profile_CacheOfAllModules.ProfileGroupResult[propertyName] = propertyValue;
			}
		}
		if (ANID_ON())
		{
			/* Update the profile backend */		
			var url = Ninemsn.Site.NH.Profile_ServiceBase + Ninemsn.Site.NH.Profile_SetPage + "?name=" + propertyName + "&value=" + propertyValue;
			var jsonPropList = new Ninemsn.Global.ContentManager.JsonProp (
									defaultTimeout,
									-1,
									params,
									Ninemsn.Site.NH.Profile_ResponseFcn,
									Ninemsn.Global.ContentManager.Json.ResponseFunction.Unique
								);
			Ninemsn.Global.ContentManager.GetContent(url,callback,jsonPropList);
		}
		else
		{
			var objPP = Ninemsn.Site.NH.Profile_CacheOfAllModules;
			var pp_string = Ninemsn.Global.Serialization.JavaScriptSerializer.serialize(objPP);
			writeCookie("PersonalisationAndPreferences", pp_string, Ninemsn.Site.NH.Profile_CookiesDomain, (new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365 * 20)).toGMTString());
		}
	};
	
	/**
	  *  GetInstance: get a new instance of the NHProfile class
	  */		
	this.GetInstance = function() 
	{
		return new Ninemsn.Site.NH.Profile_Class
					(
						(arguments.length > 0)? arguments[0] : 10000
					);
	};
};

Ninemsn.Site.NH.Profile = new Ninemsn.Site.NH.Profile_Class(30000,Ninemsn.Site.NH.Profile_ServiceBase);
