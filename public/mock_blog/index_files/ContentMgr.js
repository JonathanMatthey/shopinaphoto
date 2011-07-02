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

/**
  *  Ninemsn.Global.ContentManager:
  *
  *  A class that provides interfaces to retrieve data from a specified location
  */
Ninemsn.Global.ContentManager_Class = function(t)
{
	var defaultTimeout = t;
	
	/**
	  *	 Retrieves content from specified url
	  *
	  *  o_url = target URL
	  *  o_callback = callback function
	  *  o_propList = generic property list
	  */
	this.GetContent = function(o_url,o_callback,o_propList) 
	{
		var commOption = (o_propList) ? (o_propList.commOption || CommOptions.Json) : CommOptions.Json;
		var v_method = (o_propList) ? (o_propList.method || Ajax.Get) : Ajax.Get;
		var v_timeout = (o_propList) ? (o_propList.timeout || 10000) : 10000;
		var v_cacheDuration = (o_propList) ? (o_propList.cacheDuration || 5 * 60 * 1000) : 5 * 60 * 1000;
		var v_params = (o_propList) ? (o_propList.params || []) : [];
		var v_body = (o_propList) ? (o_propList.body || "") : "";
		var v_responseFcn = (o_propList) ? (o_propList.responseFcn || "ContentMgr_JSONResult") : "ContentMgr_JSONResult";
		var v_responseFcnOpt = (o_propList) ? (o_propList.responseFcnOpt || Json.ResponseFunction.Unique) : Json.ResponseFunction.Unique;		
		
		/**
		  *  Make JSON request
		  */
		if (commOption == CommOptions.Json)
		{
			var objCallback = function(o_context,o_readyState,o_responseFcn,o_params) 
			{
				var readyState = o_readyState;
				var responseObject = null;
				try
				{					
					if ((o_readyState=="loaded" || o_readyState=="complete") && v_responseFcnOpt != Json.ResponseFunction.Disabled)
					{		
						responseObject = eval(o_responseFcn+"()");
						eval("window."+o_responseFcn+" = null;");
					}
				} catch (e) {
					readyState = "error";
				} finally {
					if (o_params.length==0) 
					{
						o_callback(responseObject);
					} else {
						o_callback(responseObject,o_params);
					}
				}
			};

			var objJsonPropList = 
			{
				cacheDuration: v_cacheDuration,
				params: v_params,
				responseFcn: v_responseFcn,
				responseFcnOpt: v_responseFcnOpt
			};
			
			var objJsonRequest = new Ninemsn.Global.Communicator.CreateJsonRequest
								(
									o_url,
									"",
									objCallback,
									4 | ((objJsonPropList.cacheDuration <= 0) ? 2 : 0) | 0,
									v_timeout,
									objJsonPropList
								);
								
			objJsonRequest.Execute();
		}
		/**
		  *  Make AJAX request
		  */ 
		else if (commOption == CommOptions.Ajax) 
		{			
			var objCallback = function(xmlhttp,o_params) 
			{
				var readyState = null;
				var responseObject = null;
				try
				{
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
					{
						responseObject = xmlhttp;
					}
				} catch (e) {
					readyState = "error"
				} finally {
					if (o_params.length==0) 
					{
						o_callback(responseObject);
					} else {
						o_callback(responseObject,o_params);
					}				
				}
			};
		
			var objAjaxPropList = 
			{
				method: v_method,
				cacheDuration: v_cacheDuration,
				params: v_params,
				body: v_body				
			};		
			
			var objAjaxRequest = new Ninemsn.Global.Communicator.CreateAjaxRequest
								(
									o_url,
									"",
									objCallback,
									4 | ((objAjaxPropList.cacheDuration <= 0) ? 2 : 0) | 1,
									v_timeout,
									objAjaxPropList								
								);
			
			objAjaxRequest.Execute();
		}
	};

	/**
	  *  Create an Ajax property list
	  *    o_method = Ajax.Get || Ajax.Post
	  *    o_timeout = Http fetch timeout, default 10 seconds
	  *    o_cache = milliseconds
	  *    o_params = array (parameter list for callback function to execute with)
	  *    o_body = body to be used with post-method send()
	  */
	this.AjaxProp = function(o_method,o_timeout,o_cache,o_params,o_body) {
		var obj = {
			commOption: CommOptions.Ajax,
			method: o_method,
			timeout: o_timeout,
			cacheDuration: o_cache || 5 * 60 * 1000,
			params: o_params || [],
			body: o_body || ""
		};
		return obj;
	};

	/**
	  *  Create a Json property list
	  *    o_timeout = Http fetch timeout, default 10 seconds	  
	  *    o_cache = milliseconds
	  *    o_params = array (parameter list for callback function to execute with)  
	  *    o_responseFcn = response function
	  *    o_responseFcnOpt = response function option
	  */
	this.JsonProp = function(o_timeout,o_cache,o_params,o_responseFcn,o_responseFcnOpt) {
		var obj = {
			commOption: CommOptions.Json,
			timeout: o_timeout,
			cacheDuration: o_cache || 5 * 60 * 1000,
			params: o_params || [],
			responseFcn: o_responseFcn || "ContentMgr_JSONResult",
			responseFcnOpt: o_responseFcnOpt || Json.ResponseFunction.Unique
		};
		return obj;
	};

	/**
	  *  Communication options, either Ajax or Json
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
	
	this.GetInstance = function() 
	{
		return new Ninemsn.Global.ContentManager_Class
					(
						(arguments.length > 0)? arguments[0] : 10000
					);
	};
};

Ninemsn.Global.ContentManager = new Ninemsn.Global.ContentManager_Class();

Ninemsn.Global.ContentManager.Json = 
{
	ResponseFunction : {
		Unique:"UNIQUE",
		Identical:"IDENTICAL",
		Disabled:"DISABLED"
	}
};

Ninemsn.Global.ContentManager.Ajax =
{
	Method : {
		Get:"GET",
		Post:"POST"
	}
};

Ninemsn.Global.ContentManager.CommOptions = 
{
	Ajax:"AJAX",
	Json:"JSON"
};
