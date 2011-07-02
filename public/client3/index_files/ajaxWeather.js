/*

	$Id: ajaxWeather.js 41793 2008-09-15 15:11:52Z abirchall $
	$URL: http://nvdweb1/svn/CodeDB/branches/stable/webroot/images/js/m4/ajaxWeather.js $

*/


// generic getCookie() function
// name - name of the cookie 
// * return string containing value 
// of specified cookie or null if cookie 
// does not exist 


function getCookie(name){var prefix=name+"=";var cookieStartIndex=document.cookie.indexOf(prefix);if(cookieStartIndex==-1){return null}
var cookieEndIndex=document.cookie.indexOf(";",cookieStartIndex+prefix.length);if(cookieEndIndex==-1){cookieEndIndex=document.cookie.length}
return unescape(document.cookie.substring(cookieStartIndex+prefix.length,cookieEndIndex));}
$(function(){currentTownID=parseInt(getCookie('WEATHER_TOWN_ID'));if((!isNaN(currentTownID))&&(currentTownID!=defaultTownID)){tmp=Math.random();$ajaxURL='/_services/ajax/ajaxWeather.cfm?sharedDatasource='+escape(sharedDatasource)+'&weatherSourceID='+weatherSourceId+'&tmp='+tmp.toString();$.ajax({url:$ajaxURL,type:'GET',dataType:'html',error:function(){},success:function(strResponse){$arrResponse=strResponse.split("~");$townId=$arrResponse[1];$arrContent=$arrResponse[2].split("|");$arrWeatherURL=$("#id_weather_link").attr("href").split("=");$weatherURL=$arrWeatherURL[0]+'='+$townId;$("#id_weather_link").attr("href",$weatherURL);$("#weather_town_name").html($arrContent[0]);$("#weather_condition").html('<img src="'+publicImageServer+'/collections/m4_general/'+$arrContent[1]+'.gif " width="17" height="17" border="0" alt="'+$arrContent[2]+'" title="'+$arrContent[2]+'" align="middle" />');$("#weather_min").html('Min: '+$arrContent[3]+'&#176;C');$("#weather_max").html('Max: '+$arrContent[4]+'&#176;C');}});};});