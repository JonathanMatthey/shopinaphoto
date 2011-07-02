var createNamespace;
if (!createNamespace || typeof createNamespace != "function") 
{
	createNamespace = function(str) {
		var a = str.split(".");
		var o = window;
		for(var i=0; i < a.length; i++)
		{
			if (!o[a[i]])
			{
				o[a[i]] = {};
	        }   
			o = o[a[i]];
		}	
	}
}
createNamespace("Ninemsn.Global.Serialization.JavaScriptSerializer");

Ninemsn.Global.Serialization.JavaScriptSerializer._stringRegEx = new RegExp('["\b\f\n\r\t\\\\\x00-\x1F]',"i");
Ninemsn.Global.StringBuilder=function(a)
{
	this._parts=typeof a!=="undefined"&&a!==null&&a!==""?[a.toString()]:[];
	this._value={}
};
Ninemsn.Global.StringBuilder.prototype=
{
	append:function(a)
	{
		if(typeof a!=="undefined"&&a!==null&&a!=="")
		{
			this._parts[this._parts.length]=a.toString();
			this._value={}
		}
	},
	appendLine:function(a)
	{
		if(typeof a!=="undefined"&&a!==null&&a!=="")
		{
			this._parts[this._parts.length]=a.toString();
		}
		this._parts[this._parts.length]="\r\n";
		this._value={}
	},
	clear:function()
	{
		this._parts=[];
		this._value={}
	},
	isEmpty:function()
	{
		return this._parts.length===0
	},
	toString:function(a)
	{
		a=a||"";
		if(typeof this._value[a]==="undefined")
		{
			this._value[a]=this._parts.join(a);
		}
		return this._value[a]
	}
};
Ninemsn.Global.Serialization.JavaScriptSerializer._serializeWithBuilder=function(b,a,h)
{
	var c;
	switch(typeof b)
	{
		case "object":	
			if(b) 
			{
				if(b instanceof Array)
				{		
					a.append("[");
					for(c=0;c<b.length;++c)
					{
						if(c>0)
						{
							a.append(",");
						}
						Ninemsn.Global.Serialization.JavaScriptSerializer._serializeWithBuilder(b[c],a)
					}
					a.append("]")
				}
				else
				{				
					if(b instanceof Date)
					{
						a.append('"@');
						a.append(b.getTime());
						a.append('@"');break
					}
					var e=[],i=0;
					for(var g in b)
					{								
						if(g.substr(0,1)==="$")
						{
							continue;
						}						
						e[i++]=g
					}
					if(h)
					{
						e.sort();
					}
					a.append("{");
					var j=false;
					for(c=0;c<i;c++)
					{
						var f=b[e[c]];
						if(typeof f!=="undefined"&&typeof f!=="function")
						{
							if(j)
							{
								a.append(",");
							}
							else 
							{
								j=true;
							}
							Ninemsn.Global.Serialization.JavaScriptSerializer._serializeWithBuilder(e[c],a,h);
							a.append(":");
							Ninemsn.Global.Serialization.JavaScriptSerializer._serializeWithBuilder(f,a,h)
						}
					}
					a.append("}")
				}
			} 
			else 
			{ 
				a.append("null");
				break;
			}
		case "number":
			if(isFinite(b))
			{
				a.append(String(b));
			}
			break;
		case "string":
			a.append('"');
			if(navigator.userAgent.indexOf(" Safari/")>-1 || 
			   Ninemsn.Global.Serialization.JavaScriptSerializer._stringRegEx.test(b))
			{
				var k=b.length;
				for(c=0;c<k;++c)
				{
					var d=b.charAt(c);
					if(d>=" ")
					{
						if(d==="\\"||d==='"')
						{
							a.append("\\");
						}
						a.append(d)
					}
					else 
					{
						switch(d)
						{
							case "\b":a.append("\\b");break;
							case "\f":a.append("\\f");break;
							case "\n":a.append("\\n");break;
							case "\r":a.append("\\r");break;
							case "\t":a.append("\\t");break;
							default:
								a.append("\\u00");
								if(d.charCodeAt()<16)
								{
									a.append("0");
								}
								a.append(d.charCodeAt().toString(16))
						}
					}
				}
			}
			else 
			{
				a.append(b);
			}
			a.append('"');
			break;
		case "boolean":
			a.append(b.toString());
			break;
		default:
			a.append("null");
			break
	}
};
Ninemsn.Global.Serialization.JavaScriptSerializer.serialize=function(b)
{
	var a=new Ninemsn.Global.StringBuilder;
	Ninemsn.Global.Serialization.JavaScriptSerializer._serializeWithBuilder(b,a,false);
	return a.toString()
};
Ninemsn.Global.Serialization.JavaScriptSerializer.deserialize=function(data)
{
	if(data.length===0) {return null;}
	var exp=data.replace(new RegExp('\\"@(-?[0-9]+)@\\"',"g"),"new Date($1)");
	return eval("("+exp+")");
};