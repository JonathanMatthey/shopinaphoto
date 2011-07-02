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
createNamespace("Ninemsn.Site.NH.FeedReader");

/**
  *  Retrieves feed content from a specified location
  */
Ninemsn.Site.NH.FeedReader.Get = function(url,callback) {
	var jsonPropList = new Ninemsn.Global.ContentManager.JsonProp (
							30000,
							5000,
							[],
							"HTTPTransfer_JSONResult",
							Ninemsn.Global.ContentManager.Json.ResponseFunction.Unique
						);	
	Ninemsn.Global.ContentManager.GetContent(url,callback,jsonPropList);
};