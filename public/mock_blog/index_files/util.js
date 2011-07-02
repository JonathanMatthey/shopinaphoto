//Callback for returned video data.  Renders the results in the right column
function vidJSONCallback(jsonResult)
{
	var contentDiv = document.getElementById("rightJSONContent");
	contentDiv.innerHTML = "";
	for(var i = 0; i < jsonResult.video.length && i < 3; i++)
	{
		var itemDiv = contentDiv.appendChild(document.createElement("div"));
		if(i < jsonResult.video.length - 1 && i < 2)
			itemDiv.className = "vidItem";
		var vidItem = jsonResult.video[i];
		
		var videoThumbnailSrc = "";
		for(var j = 0; j < vidItem.files.file.length; j++)
		{
			if(vidItem.files.file[j].$formatCode == "2001")
			{
				videoThumbnailSrc = vidItem.files.file[j].uri.$;
				break;
			}
		}
		
		var url = "/video.aspx?tab=1&sectionid=5924&sectionname=enews&videoid=" + vidItem.uuid.$;
		//var url = "/videov3.aspx?tab=1&sectionid=5924&sectionname=enews";
		
		var imgA = itemDiv.appendChild(document.createElement("a"));
		imgA.href = url;
		//imgA.onclick = playRightVideo;
		imgA.vidUuid = vidItem.uuid.$;
		imgA.className = "image";
		
		var img = imgA.appendChild(document.createElement("img"));
		img.src = "http://images.ninemsn.com.au/resizer.aspx?width=92&url=" + videoThumbnailSrc;
		
		var titleA = itemDiv.appendChild(document.createElement("a"));
		titleA.href = url;
		//titleA.onclick = playRightVideo;
		titleA.vidUuid = vidItem.uuid.$;
		
		var title = titleA.appendChild(document.createElement("span"));
		title.title = vidItem.title.$;
		title.innerHTML = vidItem.title.$.truncate(40);
		
		var description = itemDiv.appendChild(document.createElement("div"));
		description.title = vidItem.description.$;
		description.innerHTML = vidItem.description.$.truncate(120);
		description.className = "description";

		var clearDiv = itemDiv.appendChild(document.createElement("div"));
		clearDiv.style.clear = "both";
		clearDiv.style.height = "0";
		clearDiv.style.fontSize = "0";
	}
}

function playRightVideo()
{
 window.open('http://ninemsn.video.msn.com/v/en-au/v.htm?g=' + this.vidUuid);
}

//Makes JSON call to retreive data for right video
function renderRightVideo()
{
	//Ninemsn.Global.ContentManager.GetContent("http://catalog.video.msn.com/videoByTag.aspx?mk=en-au&ns=MSNVideo_Top_Cat&tag=AUEOnline_AUENews&responseEncoding=json&callbackName=vidJSONCallback&cache=" + parseInt((new Date()).getTime()/1000/60/60*10), function(){});
	injectJSONInRightCol("http://edge1.catalog.video.msn.com/videoByTag.aspx?mk=en-au&ns=MSNVideo_Top_Cat&tag=AUEOnline_AUENews&responseEncoding=json&callbackName=vidJSONCallback");
}

//Truncates the AUTO news links on the home page so that they don't wrap onto 2 lines
function truncateHomeAutoNews()
{
	var newsDiv = document.getElementById("cat_hl_84142");
	if(newsDiv)
	{
		var links = newsDiv.getElementsByTagName("a");
		for(var i = 0; i < links.length - 1; i++)
			links[i].innerHTML = links[i].innerHTML.truncate(31);
	}
	
}

//Truncates a given string to a given length
String.prototype.truncate = function(len)
{
	if(this.length > len +3)
		return this.substring(0, len) + "...";
	else
		return this;
}

function injectJSONInRightCol(url)
{
	var scriptId = "jsonScriptInRightCol";
	var oldScript = document.getElementById(scriptId);
	if(oldScript)
	{
		document.getElementsByTagName('head')[0].removeChild(oldScript);
	}
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.id = scriptId;
	document.getElementsByTagName('head')[0].appendChild(script);
}









