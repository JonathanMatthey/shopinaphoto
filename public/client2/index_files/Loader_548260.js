
function loadjscssfile(filename,filetype,where){var fileref;if(filetype=="js"){fileref=document.createElement("script");fileref.setAttribute("type","text/javascript");fileref.setAttribute("src",filename);}
else if(filetype=="css"){fileref=document.createElement("link");fileref.setAttribute("rel","stylesheet");fileref.setAttribute("type","text/css");fileref.setAttribute("href",filename);}
if(typeof fileref!="undefined"){if(where=="head"){document.getElementsByTagName("head")[0].appendChild(fileref);}
else{document.getElementsByTagName("body")[0].appendChild(fileref);}}}
function CheckJQueryLoader(toolbarId)
{if(typeof jQuery=="function"){$wibilib=jQuery;clearTimeout(wibiyaToolbar.wibiyaTimeoutId);SetToolbarLoad();}
else{wibiyaToolbar.wibiyaTimeoutId=setTimeout("CheckJQueryLoader("+toolbarId+");",200);}}
function getQueryParam(name){var qString=window.location.search.substring(1).split("&");var params=new Array();var p;for(var i=0;i<qString.length;i++){p=qString[i].split("=");params[p[0]]=p[1];}
return params[name];}
function wbpad(number,length){var str=''+number;while(str.length<length){str='0'+str;}
return str;}
function altToolbarUrl(altToolbar){var cdn=getQueryParam("cdn");cdn=(typeof cdn=="undefined")?"cdn.wibiya.com":cdn;if(!cdn.match(/^(st)?cdn\.wibiya\.(com|local)$/)){cdn="cdn.wibiya.com";}
var toolbarId=altToolbar.match(/\d+/);var dir=wbpad(Math.floor(toolbarId/1000),4);var toolbarUrl='http://'+cdn+'/Toolbars/dir_'+dir+'/Toolbar_'+toolbarId+'/'+altToolbar;return toolbarUrl;}
function loadWibiyaToolbar(src){var bodyRef=document.getElementsByTagName("body");if(bodyRef.length==0){window.wiBodyWaitRetry=window.wiBodyWaitRetry||0;window.wiBodyWaitRetry++;if(window.wiBodyWaitRetry<=10){window.wiBodyWait=setTimeout("loadWibiyaToolbar('"+src+"');",500);}
else{console.log("Could not find body tag and unable to load "+src);return;}}
else{loadjscssfile(src,"js","body");}}
function SetToolbarLoad(){var wibiya_mobiles=["iphone","ipod","ipad","series60","symbian","android","windows ce","blackberry","palm","avantgo","docomo","vodafone","j-phone","xv6850","htc","lg;","lge","mot","nintendo","nokia","samsung","sonyericsson"];wibiyaToolbar.wibiya_isMobile=false;wibiyaToolbar.wibiya_uAgent=navigator.userAgent.toLowerCase();for(var i=0;i<wibiya_mobiles.length;i++){if(wibiyaToolbar.wibiya_uAgent.match(wibiya_mobiles[i])!=null){if(wibiyaToolbar.wibiya_uAgent.match("iphone")){WIBIYA.agent="iphone3";}
wibiyaToolbar.wibiya_isMobile=true;var img=new Image(1,1);img.src="http://wstat.wibiya.com/m.jpg?t="+wibiyaToolbar.id;break;}}
if(($wibilib.browser.msie&&parseInt($wibilib.browser.version)==6)||(wibiyaToolbar.wibiya_isMobile==true&&typeof(WIBIYA.agent)!="undefined"&&WIBIYA.agent!="iphone3"&&WIBIYA.agent!="iphone4")){}
else{if(wibiyaToolbar.flashFix===true){wibiyaToolbar.rewriteFlash=0;wibiyaToolbar.framework.FlashFix();wibiyaToolbar.rewriteFlashInterval=setInterval("wibiyaToolbar.framework.FlashFix();",3333);}
wibiyadomain="http://cdn.wibiya.com/Toolbars/dir_0548/Toolbar_548260/";wibiyaScriptSrc="";var altToolbar=getQueryParam("toolbarObjId");var isIphone=(WIBIYA.agent=="iphone3")||(WIBIYA.agent=="iphone4");var isMobileFileExist=".js"!="";var isAlt=typeof altToolbar!="undefined";if(!isAlt&&!wibiyaToolbar.wibiya_isMobile){wibiyaScriptSrc=wibiyadomain+"toolbar_548260_4e0cc314c8eb6.js";}
else if(isMobileFileExist&&wibiyaToolbar.wibiya_isMobile&&isIphone&&wibiyaToolbar.mobile==true)
{wibiyaScriptSrc=wibiyadomain+"mobile/.js";}
else if(!wibiyaToolbar.wibiya_isMobile&&isAlt)
{wibiyaScriptSrc=altToolbarUrl(altToolbar);}
else
{wibiyaScriptSrc="";}
if(typeof(startGallery)=="function"||$wibilib.browser.msie||wibiyaToolbar.pl=="true"){var wibiyaScriptSrc;$wibilib(document).ready(function(){loadWibiyaToolbar(wibiyaScriptSrc);});}
else{loadWibiyaToolbar(wibiyaScriptSrc);}}}
if(!window.wibiyaToolbar){window.wibiyaToolbar={};window.WIBIYA=window.WIBIYA||{};WIBIYA.Mobile=WIBIYA.Mobile||{};wibiyaToolbar.pl="false";wibiyaToolbar.nc="true";wibiyaToolbar.mobile=true;wibiyaToolbar.flashFix=false;wibiyaToolbar.runMode="standard";wibiyaToolbar.wibiyaTimeoutId=null;wibiyaToolbar.preventLoad=(typeof prevent_wibiya_load!="undefined")?prevent_wibiya_load:false;if(!wibiyaToolbar.preventLoad){if(wibiyaToolbar.runMode!="debug"||typeof getQueryParam('widebug')!="undefined"){if(wibiyaToolbar.runMode!="hide"||typeof getQueryParam('showbar')!="undefined"){if(typeof jQuery!="function"){loadjscssfile("http://cdn.wibiya.com/Scripts/jquery-1.4.2.min.js","js","head");}
wibiyaToolbar.framework={};wibiyaToolbar.id="548260";wibiyaToolbar.referrer=document.referrer;CheckJQueryLoader(wibiyaToolbar.id);}}}}