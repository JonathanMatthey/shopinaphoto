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
createNamespace("Ninemsn.Global");
createNamespace("Ninemsn.Global.Communicator_WorkSpace");
createNamespace("Ninemsn.Global.Communicator_Pkg");

/**
  *  Ninemsn.Global.Communicator is a base-level API that executes in the client side
  *
  *	 b = default time out 
  */
Ninemsn.Global.Communicator_Class = function(glob_Timeout)
{
	/**
	  *  Communicator request state flags
	  */
	var READY_STATE_UNINITIALIZED="uninitialized";
	var READY_STATE_LOADING="loading";
	var READY_STATE_LOADED="loaded";
	var READY_STATE_INTERACTIVE="interactive";
	var READY_STATE_COMPLETE="complete";
	var READY_STATE_ABORTED="aborted";
	var READY_STATE_TIMEOUT="timeout";
	var READY_STATE_ERROR="error";
	
	/**
	  *  Mask for Communicator request customisation.
	  *
	  *	 0 0 1 = REQUEST_FLAG_SERIALIZED
	  *  0 1 0 = REQUEST_FLAG_AVOID_CACHE
	  *  1 0 0 = REQUEST_FLAG_REMOVE_SCRIPT
	  *
	  */
	var REQUEST_FLAG_SERIALIZED = 1;		// Sequential: One Communicator call per domain only.
	var REQUEST_FLAG_AVOID_CACHE = 2;		// Caching:	avoid Communicator request from obtaining server-cached content. 
	var REQUEST_FLAG_REMOVE_SCRIPT = 4;		// Header script removal: should usually be ON, otherwise script tag remains inside the header. 
	
	/**
	  *  Unique Identifier of Communicator request
	  */
	var requestID=0;
	
	/**
	  *  Default Communicator request time-out
	  */
	var defaultTimeout=-1;
	
	/**
	  *  List of domains. Each domain object contains its own Communicator request Pool
	  */
	var domainList = new Object();
	
	var regExpHost = new RegExp("(http|https)://([^\\/]*).*","ig");
	var regExpProtocolHost = new RegExp("((http|https|ftp)://[^\\/]*).*","ig");
	
	/**
	  *	 Compare the data type of specified object with type name
	  *  at the 2nd argument.
	  *
	  *	 obj = object
	  *  dtype = data type (string)
	  */
	function cmp(obj,dtype)
	{
		if(obj==null||typeof obj=="undefined")
			return false;
			
		if(dtype!=null&&typeof dtype=="string")
			return typeof obj==dtype;
		
		return true;
	}
	
	/** 
	  *  If the first argument of this Communicator object is number,
	  *  assign it as default time out
	  */
	if(cmp(glob_Timeout,"number")) 
	{
		defaultTimeout = glob_Timeout;
	}
	
	/**
	  *  Obtain domain of a URL
	  *
	  *  o_fullurl = full URL
	  */
	function getDomainFromURL(o_fullurl)
	{
		var rMatch=null;
		regExpHost.lastIndex=0;
		rMatch=regExpHost.exec(o_fullurl);
		return rMatch?rMatch[2]:"".toLowerCase();
	}
	
	/**
	  *  Obtain baseURL
	  *
	  *  o_fullurl = full URL
	  */
	function getBaseFromURL(o_fullurl)
	{
		var rMatch=null;
		regExpProtocolHost.lastIndex=0;
		rMatch=regExpProtocolHost.exec(o_fullurl);
		return rMatch?rMatch[1]:"".toLowerCase();
	}
	
	/**
	  *  Construct absolute URL
	  *
	  *  o_fullurl = full URL (can be relative)
	  */
	function getAbsoluteURL(o_fullurl)
	{
		var strLowerUrl=o_fullurl.toLowerCase();
		if(strLowerUrl.substr(0,7)=="http://" || strLowerUrl.substr(0,8)=="https://")
		{
			return o_fullurl;
		}
		var strBase=location.href.substring(0,location.href.lastIndexOf("/")+1);
		var objBases=document.getElementsByTagName("base");
		if(objBases.length>0&&objBases[0].href!="")
		{
			strBase=objBases[0].href;
		}
		if(strBase.charAt(strBase.length-1)!="/")
		{
			strBase+="/";
		}
		if(o_fullurl.charAt(0)=="/")
		{
			return getBaseFromURL(strBase)+o_fullurl;
		} else { 
			return strBase+o_fullurl;
		}
	}
	
	/**
	  *  Hash code generator
	  */
	Ninemsn.Global.Communicator_Pkg.Hash=function()
	{
		var hexcase = 0;		/* hex output format. 0 - lowercase; 1 - uppercase */
		var chrsz   = 8;		/* bits per input character. 8 - ASCII; 16 - Unicode */
		function hex_md5(s){ 
			return binl2hex(core_md5(str2binl(s), s.length * chrsz));
		}
		
		/*
		 *  This function generates the hash code of a given string
		 */
		this.Get = function(s) 
		{
			return hex_md5(s);
		}
		
		/*
		 *	Calculate the MD5 of an array of little-endian words, and a bit length
		 */
		function core_md5(x, len)
		{
			/* append padding */
			x[len >> 5] |= 0x80 << ((len) % 32);
			x[(((len + 64) >>> 9) << 4) + 14] = len;

			var a =  1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =  271733878;

			for(var i = 0; i < x.length; i += 16)
			{
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;

				a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
				d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
				b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
				c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
				d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
				b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
				d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
				c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

				a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
				b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
				a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
				c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
				b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
				d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
				a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
				b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
				b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
				a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
				c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
				d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
				c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
				a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
				c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
				b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
				d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
				c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
				d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
				b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
				d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
				c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
				a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
				b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = safe_add(a, olda);
				b = safe_add(b, oldb);
				c = safe_add(c, oldc);
				d = safe_add(d, oldd);
			} // end for
			return Array(a, b, c, d);
		} // end function
		
		/*
		 * These functions implement the four basic operations the algorithm uses.
		 */
		function md5_cmn(q, a, b, x, s, t)
		{
			return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
		}
		function md5_ff(a, b, c, d, x, s, t)
		{
			return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		}
		function md5_gg(a, b, c, d, x, s, t)
		{
			return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		}
		function md5_hh(a, b, c, d, x, s, t)
		{
			return md5_cmn(b ^ c ^ d, a, b, x, s, t);
		}
		function md5_ii(a, b, c, d, x, s, t)
		{
			return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		}		

		function safe_add(x, y)
		{
			var lsw = (x & 0xFFFF) + (y & 0xFFFF);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
		}

		function bit_rol(num, cnt)
		{
			return (num << cnt) | (num >>> (32 - cnt));
		}

		function str2binl(str)
		{
			var bin = Array();
			var mask = (1 << chrsz) - 1;
			for(var i = 0; i < str.length * chrsz; i += chrsz)
					bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
			return bin;
		}

		function binl2hex(binarray)
		{
			var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var str = "";
			for(var i = 0; i < binarray.length * 4; i++)
			{
				str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
						hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
			}
			return str;
		}
		
	} // end Hash
	
	/**
	  *  Request object
	  *
	  *  o_domain = domain
	  *  o_fullurl = full url
	  *  o_context = context
	  *  o_callback = callback function for Communicator request
	  *  o_requestFlag = request flag
	  *  o_timeout = customised timeout of the Communicator request
	  *  o_commOption = Ajax / Json
	  *  o_propList = property list
	  */
	Ninemsn.Global.Communicator_Pkg.Request=function(o_domain,o_fullurl,o_context,o_callback,o_requestFlag,o_timeout,o_commOption,o_propList)
	{
		this.domain=o_domain;
		this.url=o_fullurl;
		this.context=o_context;
		this.callback=o_callback;
		this.requestFlag=o_requestFlag;
		this.timeout=o_timeout;
		this.readyState=READY_STATE_UNINITIALIZED;
		this.requestID=-1;
		this.commOption=o_commOption;
		this.propList=o_propList;
	};
	
	/**
	  *  Request Pool object
	  *  
	  *  1. requestList = queue of pending requests.
	  *  2. serialQueue = used in "SERIALIZED" mode, requests in the same domain are
	  *                   enforced to be sent sequentially.
	  *  3. parallelPool = used in "PARALLEL" mode, requests in the same domain can
	  *                    be sent synchronously.
	  */
	Ninemsn.Global.Communicator_Pkg.RequestPool=function(objDomain)
	{
		var regDomain = objDomain;
		
		var requestList = new Object();				// List of request
		var serialQueue = new Array();				// Serial request queue
		var parallelPool = new Object();			// Parallel request Pool
		var parallelActiveStack = new Array();		// Parallel active request Stack
		
		/**
		  *  Function to append version info to a URL to avoid it
		  *  from getting server cached content.
		  */
		function addVersion(url,symbol,value)
		{
			if(url.indexOf("?")==-1) {
				return url+"?"+symbol+"="+escape(value);
			} else {
				return url+"&"+symbol+"="+escape(value);
			}
		}
		
		/**
		  *  Add symbol and value into the specified url
		  */
		function addSymbolValue(url,symbol,value)
		{
			if (url=="") 
			{
				return url;
			}	
			var indexQstMark = url.indexOf("?");
			var newURL = "";
			if (indexQstMark < 0 || indexQstMark == url.length-1) 
			{
				var xtraStr = "";
				if (indexQstMark < 0) 
				{
					xtraStr += "?";
				}
				xtraStr += symbol + "=" + value;
				newURL += url + xtraStr;
			} else {
				var s1 = url.substr(0,indexQstMark);
				var s2 = url.substr(indexQstMark+1,url.length-s1.length-1);
				newURL += s1 + "?" + symbol + "=" + value + "&" + s2;
			}
			return newURL;		
		}
		
		/**
		  *  Generate version number according to the value
		  *  and cache duration
		  */
		function getCacheVersionNumber(value,cacheDuration)
		{
			var multiplier = Math.floor(value/cacheDuration);
			var versionNumber = multiplier * cacheDuration;
			return versionNumber;
		}		
		
		/**
		  *  Create unique SCRIPT ID
		  *
		  *  id = numeric Id of script request
		  */
		function getScriptID(id)
		{
			return "Ninemsn_Global_Communicator_"+id;
		}
		
		/**  
		  *  Function to close a finished request.
		  *
		  *  ** extension = retry mechanism will be supported
		  *  
		  *  o_request = Request object
		  */
		function requestRemove(o_request)
		{		
			if(cmp(requestList["A_"+o_request.requestID]))
			{
				delete requestList["A_"+o_request.requestID];
			}
			
			if(o_request.requestFlag&REQUEST_FLAG_SERIALIZED) 
			{
				for(var i=0;i<serialQueue.length;i++)
				{
					if(serialQueue[i].requestID==o_request.requestID)
					{
						serialQueue.splice(i,1);
					}
				}
			} else {
				for(var i=0;i<parallelActiveStack.length;i++)
				{
					if(parallelActiveStack[i].requestID==o_request.requestID)
					{
						parallelActiveStack.splice(i,1);
					}
				}				
				delete parallelPool["A_"+o_request.requestID];
			}
			
			if(o_request.requestFlag&REQUEST_FLAG_REMOVE_SCRIPT)
			{
			    var objHeader=document.getElementsByTagName("head").item(0);
			    var objScript=document.getElementById(getScriptID(o_request.requestID));
			    if(objScript!=null){
			        objHeader.removeChild(objScript);
			        objScript.onreadystatechange=null;
			        objScript.onload=null;
			        objScript.onerror=null;
			    }
			}
			
			window.setTimeout(processQueue,1);
	    }
	    
	    /**
	      *  Function to trigger Communicator request call
	      *
	      *  o_request = Request object
	      */
	    function requestAdd(o_request) 
	    {
			if (o_request.commOption==CommOptions.Ajax)
			{
				var objAjax = new Ninemsn.Global.Communicator_Pkg.AjaxReq(o_request,requestRemove);
				objAjax.Execute();
			} else if (o_request.commOption==CommOptions.Json) {
				var objJson = new Ninemsn.Global.Communicator_Pkg.JsonReq(o_request,requestRemove);
				objJson.Execute();
			}
	    }
	    
	    /**
	      *  Traffic controller function
	      *
	      *  Parallel requests:
	      *    Traverse the parallel request pool and trigger each request if it is idle.
	      *
	      *  Serial requests: (in order)
	      *    Only attempt to examine the request status of the first item in the 
	      *    serial queue.
	      */
	    function processQueue()
	    {
	        for(var id in parallelPool)
	        {
				if(parallelPool[id].readyState==READY_STATE_UNINITIALIZED && 
					parallelActiveStack.length < 2) 
	            {	                
	                parallelActiveStack.push(parallelPool[id]);
	                requestAdd(parallelPool[id]);
	            }
				if (parallelActiveStack.length >= 2) 
				{
					break;
				} 
	        }
	        if(serialQueue.length>0)
	        {
	            if(serialQueue[0].readyState==READY_STATE_UNINITIALIZED) 
	            {
	                requestAdd(serialQueue[0]);
	            }
	        }
	     }
	     
	     /**
		   *  Add a new Request object into this Request Pool
		   *
	       *  o_request = Request Object
	       */
	     this.Add=function(o_request)
	     {
	        if(o_request.readyState!=READY_STATE_UNINITIALIZED)
	        {
	            return false;
	        }
	        o_request.requestID=requestID++;
      
	        if(o_request.requestFlag&REQUEST_FLAG_SERIALIZED)
	        {
				serialQueue.push(o_request);
	        } else {
				parallelPool["A_"+o_request.requestID]=o_request;
	        }
	        
	        requestList["A_"+o_request.requestID]=o_request;
	        
	        processQueue();
	        
	        return true;
	     };
	     
	     
	     /**
		   *  Remove Request object from this Request Pool
		   *
	       *  o_request = Request Object
	       */	     
	     this.Abort=function(o_request)
	     {
	        if(o_request.readyState==READY_STATE_ABORTED)return false;
	        o_request.readyState=READY_STATE_ABORTED;
	        if(cmp(o_request.callback,"function"))
	        {
	            o_request.callback(o_request.context,o_request.readyState);
	            o_request.callback=null;
	        }
	        requestRemove(o_request);
	        return true;
	    };
	    
	    /**
	      *  Remove all requests from this Request Pool
	      */
	    this.AbortAll=function()
	    {
	        for(var prop in requestList) 
	        {
	            this.Abort(requestList[prop]);
	        }
	    };

		/**
		  *  Ajax class
		  */
		Ninemsn.Global.Communicator_Pkg.AjaxReq = function(D,o_reqRmv) 
		{
			function GetXMLHttpIE(idList, dft) {
				var bFound = false;
				var o2Store;
				for(var i=0; i < idList.length && !bFound; i++){
					try {
					var oDoc = new ActiveXObject(idList[i]);
					o2Store = idList[i];
					bFound = true;
					} catch (objException) {};
				};
				idList = null;
				if (o2Store == undefined || o2Store == null) {
					o2Store = dft;
				}
				return o2Store;
			};
			
			this.Execute = function()
			{		
				var xmlhttp;
				if(window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else {
					var msxmlClass = GetXMLHttpIE(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], "Microsoft.XMLHTTP");
					xmlhttp = new ActiveXObject(msxmlClass);
					
				};

				xmlhttp.onreadystatechange = function()
				{
					try
					{
						if (xmlhttp.readyState == 4)
						{
							if (xmlhttp.status == 200) {
								D.callback(xmlhttp,D.propList.params);
							}
							o_reqRmv(D);
						} 
					} catch (e) {
						D.callback(xmlhttp,D.propList.params);
						D.callback = null;
					}
				};

				D.readyState=READY_STATE_LOADING;
				
				var targetURL;
				if(D.requestFlag&REQUEST_FLAG_AVOID_CACHE) {
					var dtRef=new Date();
					targetURL = addSymbolValue(D.url,"ngcVer",dtRef.getTime());
				} else {
					var dtRef=new Date();
					var cacheVersionNum = getCacheVersionNumber(dtRef.getTime(),D.propList.cacheDuration);
					targetURL = addSymbolValue(D.url,"ngcVer",cacheVersionNum);
				}

				xmlhttp.open(D.propList.method,targetURL,true);
				if (D.propList.method=="POST") 
				{					
					xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				}
				else 
				{
					xmlhttp.setRequestHeader("Content-Type", "text/xml");
				}
				xmlhttp.send((D.propList.method=="POST") ? ((D.propList.body.length > 0) ? D.propList.body : null) : null);

				if(D.timeout!=-1) 
				{ 
					window.setTimeout(
							function() {
								if(xmlhttp.readyState < 4){
									xmlhttp.abort();
									D.readyState=READY_STATE_TIMEOUT;
									if(cmp(D.callback,"function")){
										D.callback(xmlhttp,D.propList.params);
										D.callback=null;
									}
									o_reqRmv(D);
								}
							},D.timeout);
				}
			}
		};
	    
		/**
		  *  Json class
		  */
		Ninemsn.Global.Communicator_Pkg.JsonReq = function(D,o_reqRmv) 
		{
			this.Execute = function()
			{				
				var scriptID=getScriptID(D.requestID);
				var objHeader=document.getElementsByTagName("head").item(0);
				var objScript=document.getElementById(scriptID);
				if(objScript!=null)objHeader.removeChild(objScript);
				objScript=document.createElement("script");
				objScript.setAttribute("id",scriptID);

		        var reqURL = D.url;
		        var cacheVersionNum;
		        
		        if(D.propList.responseFcnOpt!=Json.ResponseFunction.Disabled)
		        {
				    if(D.requestFlag&REQUEST_FLAG_AVOID_CACHE)
				    {
					    var dtRef=new Date();
					    cacheVersionNum = dtRef.getTime()+"_"+D.requestID;
					    reqURL = addSymbolValue(reqURL,"ngcVer",cacheVersionNum);
				    } else {
					    var dtRef=new Date();
					    var cacheVersionNum = getCacheVersionNumber(dtRef.getTime(),D.propList.cacheDuration);
					    reqURL = addSymbolValue(reqURL,"ngcVer",cacheVersionNum);
				    }
    	       
		            if (D.propList.responseFcnOpt==Json.ResponseFunction.Unique) 
		            {
					    var responseFcnSuffix = "_" + (new Ninemsn.Global.Communicator_Pkg.Hash()).Get(reqURL) // cacheVersionNum;
					    D.propList.responseFcn = D.propList.responseFcn + responseFcnSuffix;
		            }

				    reqURL = addSymbolValue(reqURL,"ngcResFcn",D.propList.responseFcn);
                }
                
				if(navigator.userAgent.indexOf(" Safari/")>-1)
				{		
					eval("Ninemsn.Global.Communicator_WorkSpace."+D.propList.responseFcn+" = {}");
					var objSafariResponseHandler = eval("Ninemsn.Global.Communicator_WorkSpace."+D.propList.responseFcn);
					objSafariResponseHandler.ResValidUntil = (new Date()).getTime()+D.timeout;
					objSafariResponseHandler.ResFcn = function()
					{
						var objSafariResponseHandler = eval("Ninemsn.Global.Communicator_WorkSpace."+D.propList.responseFcn);	
						if ((new Date()).getTime() <= objSafariResponseHandler.ResValidUntil)
						{	
							var hasResponse = (eval("window."+D.propList.responseFcn)!=null) ? true : false;														
							if (hasResponse)
							{					
								objScript.readyState=READY_STATE_LOADED;            
								if(D.readyState==READY_STATE_LOADING) 
								{                
									D.readyState=READY_STATE_LOADED;
								}
								if(cmp(D.callback,"function")) 
								{              
									D.callback(D.context,D.readyState,D.propList.responseFcn,D.propList.params);
								}
								if(D.readyState==READY_STATE_LOADED) 
								{                
									D.readyState=READY_STATE_COMPLETE;
								}	                
								o_reqRmv(D);
								eval("Ninemsn.Global.Communicator_WorkSpace."+D.propList.responseFcn+" = null");
							}
							else
							{
								window.setTimeout(
										objSafariResponseHandler.ResFcn
										,100);
							}							
						}
						else
						{
							eval("Ninemsn.Global.Communicator_WorkSpace."+D.propList.responseFcn+" = null");
						}
					};
					
					window.setTimeout(
								objSafariResponseHandler.ResFcn
								,100);
				}
				else
				{
					objScript.onreadystatechange=function()
					{
						if(objScript.readyState==READY_STATE_LOADED || objScript.readyState==READY_STATE_COMPLETE)
						{	            

							if(D.readyState==READY_STATE_LOADING) 
							{                
								D.readyState=READY_STATE_LOADED;
							}
							if(cmp(D.callback,"function")) 
							{              
								D.callback(D.context,D.readyState,D.propList.responseFcn,D.propList.params);
							}
							if(D.readyState==READY_STATE_LOADED) 
							{                
								D.readyState=READY_STATE_COMPLETE;
							}	                
							o_reqRmv(D);
						}
					};
			        
					objScript.onload=function()
					{
						objScript.readyState=READY_STATE_LOADED;
						objScript.onreadystatechange();
					};
			        
					objScript.onerror=function()
					{
						D.readyState=READY_STATE_ERROR;
						if(cmp(D.callback,"function"))
						{
							D.callback(D.context,D.readyState,D.propList.responseFcn,D.propList.params);
							D.callback=null;
						}
						o_reqRmv(D);
					};
				}				

		        D.readyState=READY_STATE_LOADING;

		        objScript.setAttribute("src",reqURL);
	         
				objHeader.appendChild(objScript);

				if(D.timeout!=-1) 
				{ 
					window.setTimeout(
							function() {
								if(D.readyState==READY_STATE_LOADING){
									D.readyState=READY_STATE_TIMEOUT;
									if(cmp(D.callback,"function")){
										D.callback(D.context,D.readyState,D.propList.responseFcn,D.propList.params);
										D.callback=null;
									}
									o_reqRmv(D);
								}
							},D.timeout);
				}
			};
		};

    };
   
    
	/**
	  *  Add a new Request object into Request Pool.
	  *
	  *  o_request = Request object
	  */    
	function addRequestToPool(o_request)
	{
		// Create new request pool for this domain if not existed.
	    if(!cmp(domainList[o_request.domain]))
	    {
			domainList[o_request.domain] = new Ninemsn.Global.Communicator_Pkg.RequestPool(o_request.domain);
		}		
	    return domainList[o_request.domain].Add(o_request);
	}
	
	/**
	  *  Remove a Request object from the Request Pool.
	  *
	  *  o_request = Request object
	  */
	function removeRequestFromPool(o_request)
	{
	    if(!cmp(domainList[o_request.domain]))
			return false;
	    
	    return domainList[o_request.domain].Abort(o_request);
	}
	
	/**
	  *  Remove all Request objects across all Domains.
	  */
	this.AbortAll=function()
	{
	    for(var prop in domainList)
	    {
	        domainList[prop].AbortAll();
	    }
	};
	
	/**
	  *  Create new Ajax request
	  *  
	  *  o_url = Query URL
	  *  o_context = Context
	  *  o_callback = Callback Function Object
	  *  o_requestFlag = Request Flag
	  *  o_timeout = customised timeout period in milli-sec
	  *  o_propList = property list
	  */	
	this.CreateAjaxRequest=function(o_url,o_context,o_callback,o_requestFlag,o_timeout,o_propList)
	{
		return CreateRequest_priv(o_url,
								  o_context,
								  o_callback,
								  o_requestFlag,
								  o_timeout,
								  CommOptions.Ajax,
								  o_propList);
	};

	/**
	  *  Create new Json request
	  *  	
	  *  o_url = Query URL
	  *  o_context = Context
	  *  o_callback = Callback Function Object
	  *  o_requestFlag = Request Flag
	  *  o_timeout = customised timeout period in milli-sec
	  *  o_propList = property list	  
	  */	
	this.CreateJsonRequest=function(o_url,o_context,o_callback,o_requestFlag,o_timeout,o_propList)
	{
		return CreateRequest_priv(o_url,
								  o_context,
								  o_callback,
								  o_requestFlag,
								  o_timeout,
								  CommOptions.Json,
								  o_propList);
	};
	
	/**
	  *  Create new Request object
	  *
	  *  o_url = Query URL
	  *  o_context = Context
	  *  o_callback = Callback Function Object
	  *  o_requestFlag = Request Flag
	  *  o_timeout = customised timeout period
	  *  o_commOption = Ajax OR Json
	  *  o_propList = property list
	  */
	this.CreateRequest=function(o_url,o_context,o_callback,o_requestFlag,o_timeout,o_commOption,o_propList)	
	{
		return CreateRequest_priv(o_url,o_context,o_callback,o_requestFlag,o_timeout,o_commOption,o_propList);
	};
	
	/**
	  *  o_url = Query URL
	  *  o_context = Context
	  *  o_callback = Callback Function Object
	  *  o_requestFlag = Request Flag
	  *  o_timeout = customised timeout period
	  *  o_commOption = Ajax OR Json
	  *  o_propList = property list
	  */
	function CreateRequest_priv(o_url,o_context,o_callback,o_requestFlag,o_timeout,o_commOption,o_propList) {
		if(!cmp(o_url,"string")||!cmp(o_callback,"function"))return null;
	    o_url=getAbsoluteURL(o_url);								// absolute URL
	    var strDomain=getDomainFromURL(o_url);		// domain for request pooling
	    if(strDomain=="")return null;
	    if(!cmp(o_timeout,"number"))o_timeout=defaultTimeout;
	    if(!cmp(o_requestFlag,"number"))o_requestFlag=0;
	    var objRequest=new Ninemsn.Global.Communicator_Pkg.Request(strDomain,o_url,o_context,o_callback,o_requestFlag,o_timeout,o_commOption,o_propList);
	    objRequest.Execute=function(){return addRequestToPool(objRequest);};
	    objRequest.Abort=function(){return removeRequestFromPool(objRequest);};
	    return objRequest;
	}
	
	/**
	  *  Create a new instance of this class
	  */
	this.GetInstance=function() 
	{
		return new Ninemsn.Global.Communicator_Class
					(
						(arguments.length > 0)? arguments[0] : 10000
					);
	};

	/**
	  *  CommOptions enumerations
	  */		
	var CommOptions = {
		Ajax:"AJAX",
		Json:"JSON"
	};

	/**
	  *  Ajax enumerations
	  */	
	var Ajax = {
		Method : {
			Get:"GET",
			Post:"POST"
		}
	};

	/**
	  *  Json enumerations
	  */
	var Json = {
		ResponseFunction : {
			Unique:"UNIQUE",
			Identical:"IDENTICAL",
			Disabled:"DISABLED"
		}
	};
};

Ninemsn.Global.Communicator = new Ninemsn.Global.Communicator_Class(10000);
