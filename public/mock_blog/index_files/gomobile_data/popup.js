//This function is the network wide popup window handler for windows media and vote
//arrArgs[0] = 'slideshow', 'media', 'vote', 'hlvote' or target url
//arrArgs[1] = mediaid (when arg0=media), voteid (when arg(0)=vote or hlvote) or window name, sectionid when slideshow
//arrArgs[2] = vote question id (when arg(0)=hlvote) or window width, subsectionid when slideshow
//arrArgs[3] = window height
//arrArgs[1] = other params e.g. toolbar=0 etc.
function launch_popup() 
{var arrArgs = launch_popup.arguments;
var winPopUp;
var strParam;
if (arrArgs.length <= 3 || (arrArgs.length <= 6 && arrArgs[0].toLowerCase() == 'slideshow')) 
	{var strType = arrArgs[0];

	if (strType.toLowerCase() == 'slideshow') 
	{
	    //arrArgs[1] = section id
	    //arrArgs[2] = subsection id
	    //arrArgs[3] = section name
	    //arrArgs[4] = subsection name
	    //arrArgs[5] = Absolute URL
	    var strURL = (arrArgs[5]==null) ? "" : arrArgs[5];
	    
		winPopUp = window.open(strURL + '/slideshow.aspx?sectionid='+arrArgs[1] + '&subsectionid=' + arrArgs[2] + '&sectionname=' + arrArgs[3] + '&subsectionname=' + arrArgs[4],'_blank','height=750,width=785,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=1,toolbar=0');
	}

	else if (strType.toLowerCase() == 'media') 
	{		
		var pHeight, pWidth, sUrl;
		if(JS_SITEID && JS_SITEID !='' && (JS_SITEID == 261  || JS_SITEID == 187))
		{
			pHeight = 525;
			pWidth = 810;
		}
		else
		{
			pHeight = 470;
			pWidth = 690;		
		}	
		winPopUp = window.open('/mediapopup.aspx?'+arrArgs[1],'media','height=' + pHeight + ',width=' + pWidth + ',channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=1,toolbar=0');}
	else if (strType.toLowerCase() == 'vote') 
		{winPopUp = window.open('/vote.aspx?voteID='+arrArgs[1],'_blank','resizable=0,menubar=0,scrollbars=0,status=0,toolbar=0,width=300,height=300');}
	else if (strType.toLowerCase() == 'hlvote') 
		{winPopUp = window.open('/vote.aspx?v='+arrArgs[1] + '&q=' + arrArgs[2],'_blank','resizable=0,menubar=0,scrollbars=0,status=0,toolbar=0,width=300,height=300');}
	else
		{winPopUp = window.open(arrArgs[0],'_blank','resizable=0,menubar=0,scrollbars=0,status=0,toolbar=0,width=600,height=600');}
	}
	else if (arrArgs.length == 5 || arrArgs.length == 4) 
		{strParam = 'width=' + arrArgs[2] + ',height=' + arrArgs[3]
		if (arrArgs.length == 5) 
			{strParam += ',' + arrArgs[4];}
		winPopUp = window.open(arrArgs[0],arrArgs[1],strParam);
	}
	return false;
}


//This function encodes the input URL context and returns it
function encodeURL(str)
{if (encodeURIComponent) 
	{str = encodeURIComponent(str);}
else 
	{str = escape(str);
	 str = str.replace(/:/g, "%3A").replace(/ /g, "%20").replace(/-/g,"%2D").replace(/_/g,"%5F").replace(/\./g, "%2E").replace(/\//g, "%2F").replace(/\?/g,"%3F").replace(/=/g,"%3D").replace(/&/g,"%26").replace(/\+/g,"%2B").replace(/\|/g,"%A6").replace(/\|/g,"%7C").replace(/,/g,"%2C");			
	}
	return str;
}

