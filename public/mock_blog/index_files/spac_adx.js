// ------------------------------------------------------------------------------------------------
// SPAC.JS (NineMSN Australia) - Copyright (c) 2009 Engage, Inc. All Rights Reserved.// 
// ------------------------------------------------------------------------------------------------
var spac_adServer = "http://direct.ninemsn.com.au";
var spac_autoPageID = true;
var spac_pageID = spac_getUniqueValue();
var spac_Keyword1 = "google";
var spac_SpeedThreshold = 112;
var spac_cookie_speed = GetCookie('ConnectionSpeedText');
var spac_referral = document.referrer;
var spac_useragent = navigator.userAgent;
var spac_has_sbk_header;
var spac_page_url;
var xMoz = (typeof document.implementation != 'undefined') && (typeof document.implementation.createDocument != 'undefined') && (typeof HTMLDocument != 'undefined');
var xFF = navigator.userAgent.toLowerCase().indexOf("firefox") != -1;
var xSaf = navigator.userAgent.toLowerCase().indexOf("safari") != -1;
var xChrome = navigator.userAgent.toLowerCase().indexOf("chrome") != -1;
var fIE = !xMoz && !xSaf && !xFF;
var xHttp = window.location.protocol.toLowerCase().indexOf('http:') != -1;

function spac_getVersion() {
    return ("$Id: spac_adx.js,v35 2009/02/17 Lakshmi.Nemali Exp $");
} 
var spacQS = new
function() {
    this.getQueryStringParam = function(parameterName, queryString, delimiter) {
        if (typeof(queryString) == 'undefined') {
            var queryString = window.location.search.substring(1).toLowerCase();
        } else {
            queryString = queryString.toLowerCase();
        }
        if (queryString.length == 0) {
            return null;
        }
        var parameters = new Array();
        if (typeof(delimiter) == 'undefined') {
            delimiter = '&';
        }
        parameters = queryString.split(delimiter);
        for (var i = 0; i < parameters.length; i++) {
            if (parameters[i].indexOf(parameterName.toLowerCase()) >= 0) {
                var parameterValue = new Array();
                parameterValue = parameters[i].substring(parameters[i].indexOf('=') + 1);
                return parameterValue.toUpperCase();
            }
        }
        return null;
    }
    this.adx_pg = this.getQueryStringParam('ADX_PG');
    this.adx_ap = this.getQueryStringParam('ADX_AP');
    this.adx_tag = this.getQueryStringParam('ADX_TAG');
    this.adx_adType = this.getQueryStringParam('ADX_TYPE');
    this.adx_env = this.getQueryStringParam('ADX_ENV');
    this.adx_enabled = this.getQueryStringParam('ADX_ENABLED');
    this.adx_mode = this.getQueryStringParam('ADX_MODE');
    this.adx_useWS = this.getQueryStringParam('ADX_USEWS');
}
function SpacMgr() {
    this.wsCallbackTargetParams;
    this.isAdExpertWsReturned = false;
    this.Site;
    this.Section;
    this.Subsection;
    this.AdxGetAdUrl = 'http://rad.msn.com/ADSAdClient31.dll?GetAd?';
    this.AdxGetSAdUrl = 'http://rad.msn.com/ADSAdClient31.dll?GetSAd=';
    this.AdxServiceUrl = 'http://data.ninemsn.com.au/Services/Service.axd?ServiceName=AdExpert&ServiceAction=GetAdCalls&AttributeStyle=True&ServiceFormat=JSON';
    this.DapJs ='http://Ads1.msn.com/library/dap.js';
    this.AdxJSON;
    this.OverridePg = false;
    this.getAdXAdKey = function(aTargetParams) {
        var loc = spac_getParamValue("LOC", aTargetParams);
        if (loc == '') {
            loc = 'TOP';
        }            
        var adkey = spac_getParamValue("AAMSZ", aTargetParams) + "_" + loc;
        return adkey;
    }
    this.getCustomDiv = function(aTargetParams) {
        return 'DIV_SPAC_ADX_' + this.getAdXAdKey(aTargetParams);
    }
    this.getAdCallFromClientKey = function(aTargetParams) {
        var adKey = spacMgr.getAdXAdKey(aTargetParams);
        var adCall = null;
        var jsVar = window["JS_ADX_" + adKey.replace('.', '__')];
        if (typeof(jsVar) != 'undefined') {
            adCall = jsVar;
        } else {
            var adType = new AdType(spac_getParamValue("AAMSZ", aTargetParams));
            adCall = adType.defaultAdXAdCall;
        }
        if (this.OverridePg && typeof(JS_ADX_PG_OVERRIDE) != 'undefined') {
            adCall = spacQS.getQueryStringParam(adKey, JS_ADX_PG_OVERRIDE, ',');
        }
        return adCall;
    }
    this.load = function() {
        if (spacQS.adx_env == 'INT') {
          this.DapJs = 'http://Ads.msn-int.com/library/dap.js'; // INTEGRATION
          this.AdxGetSAdUrl = 'http://rad.msn-int.com/ADSAdClient31.dll?GetSAd=';
          this.AdxGetAdUrl = 'http://rad.msn-int.com/ADSAdClient31.dll?GetAd?';
        }
        if (typeof(JS_ADX_ENABLED) != 'undefined') {
            JS_ADX_ENABLED = JS_ADX_ENABLED.toUpperCase();
            if (spacQS.adx_enabled == 'TRUE') {
                JS_ADX_ENABLED = 'TRUE';
            } else if (spacQS.adx_enabled == 'FALSE') {
                JS_ADX_ENABLED = 'FALSE';
            }    
        }
    }
}
if (typeof(spacMgr) == 'undefined') {
    var spacMgr = new SpacMgr();
    spacMgr.load();
}
try {
    spac_page_url = window.top.location.href;
} catch(exception) {}
if (spac_referral == null) {
    spac_referral = "";
} else {
    spac_referral = spac_referral.toLowerCase();
}
if (spac_useragent == null) {
    spac_useragent = "";
} else {
    spac_useragent = spac_useragent.toLowerCase();
}
function getMediaOneAdcode(adcode) {
    var aamszRegEx = /AAMSZ=BANNER/i;
    var mo_adcode = adcode.replace(aamszRegEx, "AAMSZ=PLATFORMNINE");
    var moRegEx = /AAMSZ=PLATFORMNINE/i;
    if ((spac_has_sbk_header == undefined || spac_has_sbk_header == null || spac_has_sbk_header == false) && moRegEx.test(mo_adcode)) {
        return spac_getAdHTML(mo_adcode);
    } else {
        return "";
    }
}
function spac_writeAd(aTargetParams) {
    
    if (spac_getParamValue("ENABLED", aTargetParams) == 'FALSE') {
        return;
    }
    if (spac_cookie_speed != null) {
        if (parseInt(spac_cookie_speed) >= spac_SpeedThreshold) {
            aTargetParams = aTargetParams + "/speed=broadband";
        } else if (parseInt(spac_cookie_speed) < spac_SpeedThreshold) {
            aTargetParams = aTargetParams + "/speed=modem";
        }
    }
    if (spac_referral.match(spac_Keyword1)) {
        aTargetParams = aTargetParams + "/referral=" + spac_Keyword1;
    } else if (spac_useragent.match(spac_Keyword1)) {
        aTargetParams = aTargetParams + "/referral=" + spac_Keyword1;
    }
    if (spacQS.adx_enabled != 'FALSE' && (typeof(JS_ADX_ENABLED) == 'undefined' || JS_ADX_ENABLED == 'TRUE')) {
        spacMgr.Site = spac_getParamValue("SITE", aTargetParams).toUpperCase();
        spacMgr.Section = spac_getParamValue("AREA", aTargetParams).toUpperCase();
        spacMgr.Subsection = spac_getParamValue("SUBSECTION", aTargetParams).toUpperCase();
        var divId = spacMgr.getCustomDiv(aTargetParams);
        document.write('<div id="' + divId + '"></div>');
        if (spacMgr.getAdXAdKey(aTargetParams) == "BANNER_TOP") {
            var div = document.getElementById(divId);
            div.style.cssText = "margin:0 auto;width:728px;";
        }
        if (xFF && spac_getParamValue("AAMSZ", aTargetParams) == "BANNER2") {
            var div = document.getElementById(divId);
            div.style.cssText = "margin:0 auto;width:727px;";
        }
        if (typeof(JS_ADX_ENABLED) == 'undefined' || (spacQS.adx_pg != null && spacQS.adx_adType != null) || spacQS.adx_useWS == 'TRUE') {
            getAdXAdCallString(aTargetParams);
            return;
        } else if (JS_ADX_ENABLED == 'TRUE') {
            var adKey = spacMgr.getAdXAdKey(aTargetParams);
            var adCall = spacMgr.getAdCallFromClientKey(aTargetParams);
            if (adCall != null) {
                renderAdExpert(adKey, adCall, aTargetParams);
                return;
            }
        }
    }
    renderAccipter(aTargetParams);
}
function GetCookie(name) {
    var spac_offset = name.length + 1;
    var startstr = document.cookie.indexOf(name, 0);
    if (startstr == -1) {
        return null;
    } else {
        var endstr = document.cookie.indexOf(";", startstr);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(startstr + spac_offset, endstr));
    }
}
function spac_returnAd(aTargetParams) {
    if (typeof(JS_ADX_ENABLED) != 'undefined' && JS_ADX_ENABLED == 'TRUE') {
        var adCall = spacMgr.getAdCallFromClientKey(aTargetParams);
        if (spac_getParamValue("METHOD", aTargetParams) == "JSCRIPT") {
            return '<scr' + 'ipt type="text/javascript" src="' + spacMgr.AdxGetSAdUrl + adCall + '"></scr' + 'ipt>';
        } else {
            var adType = new AdType(spac_getParamValue("AAMSZ", aTargetParams));
            return '<iframe src="' + spacMgr.AdxGetAdUrl + adCall.substring(1, adCall.length) + '" width="' + adType.width + '" height="' + adType.height + '" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
        }
    } else {
        return spac_getAdHTML(aTargetParams);
    }
}
function spac_getAdHTML(aTargetParams) {
    var targetParams, adServer, method, frameWidth, frameHeight, frameTarget, i, sM = '';
    targetParams = aTargetParams.toUpperCase();
    if (targetParams.charAt(0) != "/") {
        targetParams = "/" + targetParams;
    }
    if ((adServer = ((spac_getParamValue("ADSERVER", targetParams)))) == "") {
        adServer = spac_adServer;
    }
    if ((method = spac_getParamValue("METHOD", targetParams)) == "") {
        method = "AUTO";
    }
    if ((frameTarget = spac_getParamValue("FRAMETARGET", targetParams)) == "") {
        frameTarget = "_new";
    } else {
        frameTarget = frameTarget.toLowerCase();
    }
    var frameWidth = "468";
    var frameHeight = "60";
    if ((frameSize = ((spac_getParamValue("FRAMESIZE", targetParams)))) == "") {
        frameSize = spac_getParamValue("AAMSZ", targetParams);
        var AdSize = frameSize;
        if ("0123456789".indexOf(frameSize.substring(0, 1)) == -1) {
            var adFrameSize = new AdType(frameSize);
            frameSize = adFrameSize.frameSize;
            sM = adFrameSize.sM;
        }
        if (method == "AUTO" && sM != "") {
            method = sM
        }
    }
    if (frameSize != "") {
        var i = frameSize.indexOf("X");
        if (i >= 0) {
            var adFrameSize = new AdType(frameSize);
            frameWidth = adFrameSize.width;
            frameHeight = adFrameSize.height;
        }
    }
    var uniqueValue = spac_getUniqueValue();
    if (true == spac_autoPageID) {
        var autoPageID = spac_getParamValue("AUTOPAGEID", targetParams);
        if ("" == autoPageID || "TRUE" == autoPageID) {
            targetParams = targetParams + "/PAGEID=" + spac_pageID;
        }
    }
    if (method == "AUTO") {
        method = spac_getMethod();
    }
    targetParams = targetParams + "/ACC_RANDOM=" + uniqueValue;
    if (spac_page_url) {
        var URLParam = spac_page_url.replace(/&/gi, "/");
        URLParam = URLParam.toLowerCase();
        var URLAdSize = spac_getParamValue("adsize", URLParam);
        var CCID = spac_getParamValue("ccid", URLParam);
        if (URLAdSize != "" && CCID != "") {
            if (URLAdSize.toUpperCase() == AdSize.toUpperCase()) {
                targetParams += "/CCID=" + CCID;
            }
        }
    }
    if (method == "IFRAME" || method == "JSCRIPT") {
        if (method == "IFRAME") {
            return ("<iframe src=\"" + adServer + "/hserver" + targetParams + "?\" width=\"" + frameWidth + "\" height=\"" + frameHeight + "\" frameborder=\"0\" marginwidth=\"0\" marginheight=\"0\" scrolling=\"no\"></iframe>");
        } else if (method == "JSCRIPT") {
            return ("<script src=\"" + adServer + "/jnserver" + targetParams + "?\"></script>");
        }
    } else if (method == "STREAM") {
        return ("<a href=\"" + adServer + "/xtserver" + targetParams + "?\"></a>");
    } else if (method == "POPUP") {
        var windowName = aTargetParams;
        len = windowName.length;
        for (i = 0; i < len; i++) {
            ch = windowName.charAt(i);
            if (ch == "/" || ch == "=" || ch == "." || ch == "_" || ch == "-") {
                windowName = windowName.substring(0, i) + "_" + windowName.substring(i + 1);
            }
        }
        var features = "width=" + frameWidth + ",height=" + frameHeight;
        var winPos;
        if ((winPos = ((spac_getParamValue("POPUPPOS", targetParams)))) != "") {
            i = winPos.indexOf("X");
            if (i >= 0) {
                j = winPos.indexOf("Y", i + 1);
                if (j < 0) {
                    j = winPos.length;
                }
                features += ",left=" + winPos.substring(i + 1, j);
            }
            i = winPos.indexOf("Y");
            if (i >= 0) {
                j = winPos.indexOf("X", i + 1);
                if (j < 0) {
                    j = winPos.length;
                }
                features += ",top=" + winPos.substring(i + 1, j);
            }
        }
        var adwin = window.open(adServer + "/hserver" + targetParams + "?", windowName, features);
        adwin.focus();
        return ("");
    } else {
        if (frameTarget != "") {
            frameTarget = " target=\"" + frameTarget + "\"";
        }
        return ("<a href=\"" + adServer + "/adclick" + targetParams + "?\" " + frameTarget + ">" + "<img src=\"" + adServer + "/adserver" + targetParams + "?\" border=\"0\" width=\"" + frameWidth + "\" height=\"" + frameHeight + "\"></a>");
    }
}
function spac_getMethod() {
    var agt = navigator.userAgent;
    var ver = parseInt(navigator.appVersion);
    var isMoz = (((agt.indexOf("Mozilla") != -1) && (agt.indexOf("spoofer") == -1) && (agt.indexOf("compatible") == -1) && (agt.indexOf("opera") == -1) && (agt.indexOf("webtv") == -1)));
    var isIE3Up = ((agt.indexOf("MSIE") != -1) && (ver >= 3));
    if (isIE3Up || (isMoz && ver >= 5)) {
        return ("IFRAME");
    } else if (isMoz && ver >= 3) {
        return ("JSCRIPT");
    } else {
        return ("IMG");
    }
}
function spac_getParamValue(aName, aParam) {
    var retVal = "";
    aName = aName.toUpperCase();
    aParam = aParam.toUpperCase();
    var p = aParam.indexOf(aName + '=');
    if (p != -1) {
        p = aParam.indexOf("=", p);
        if (p != -1) {
            p++;
            while (p < aParam.length && aParam.charAt(p) == " ") {
                p++;
            }
            var p2 = aParam.indexOf(";", p);
            if (p2 != -1) {
                retVal = (aParam.substring(p, p2));
            } else {
                p2 = aParam.indexOf("/", p);
                if (p2 != -1) {
                    retVal = (aParam.substring(p, p2));
                } else {
                    retVal = (aParam.substring(p, aParam.length));
                }
            }
            p = retVal.length - 1;
            while (p > 0 && retVal.charAt(p) == " ") {
                p--;
            }
            if (p > 0) {
                retVal = retVal.substring(0, p + 1);
            }
        }
    }
    return (retVal);
}
function spac_getUniqueValue() {
    var now;
    now = new Date();
    return now.getTime();
}

//////////////////////////////////////////////////////////////////////////////////////////////
//Post ad calls - Used for returning ads to a page in one go depending on the divs detected //
//Authored: AMontaser/JDepenha //
//Date Created: 09/06/2006	 //
//Date Modified: 20/06/2006 AMontaser //
//////////////////////////////////////////////////////////////////////////////////////////////
var coldone = 'off';
var collen;
var funccount = 0;
var arrx = new Array();
var adstring;
function genpostadcall(adstring) { //remove LOC= and AAMSZ= from ad string provided by site settings
    adstring = stripadstring(adstring); //Generic post ad call
    getAdElements();
    if (collen > 0 && funccount < collen) { //make the ad call from the array depending on the function counter
        var divnumber = arrx[funccount][0];
        var adsize = arrx[funccount][1];
        var locstr = arrx[funccount][2];
        postadcall(divnumber, adsize, locstr, adstring);
    } //increment the function count
    funccount = funccount + 1;
}
function genmovepostad() {
    var divsource = "msnadsource_" + funccount;
    var divdestination = "msnaddestination_" + funccount;
    var objdivsource = document.getElementById(divsource);
    var objdestination = document.getElementById(divdestination);
    if (objdivsource != null && objdestination != null) {
        objdestination.appendChild(objdivsource);
        document.getElementById(divsource).style.visibility = "visible";
        document.getElementById(divdestination).style.visibility = "visible";
    }
}
function getAdElements() { //Find all ad div tags on the page that conform to naming convention for post page ad calls.
    //Creates an array of all the ad calls that will need to be made.
    if (coldone == 'off') {
        var objTypes = new Object();
        var objdestinationdiv;
        var count = 0;
        for (count = 0; count < 50; count++) {
            var count2 = count + 1;
            var locstr;
            objdestinationdiv = window.document.getElementById("msnaddestination_" + count2);
            if (objdestinationdiv == null) {
                break
            } else {
                var type = objdestinationdiv.getAttribute("adsize");
                var location = (objdestinationdiv.getAttribute("adloc"));
                var typelocation = type + location;
                if (isNaN(objTypes[typelocation])) {
                    objTypes[typelocation] = 0;
                }
                objTypes[typelocation] = objTypes[typelocation] + 1;
                if (location != null && location != '') {
                    locstr = location + '.' + objTypes[typelocation];
                } else {
                    locstr = '';
                } // Arrays within arrays:
                var arry = new Array(count2, type, locstr); //single row of the array
                //adding single array to an array to make multidimensional array
                arrx[count] = arry; //test array added
                collen = count2;
            }
        }
        coldone = 'on';
    }
}
function postadcall(divnumber, adsize, locstr, adstring) {
    if (location.protocol.indexOf('https') == -1) {
        var divsource = "msnadsource_" + divnumber;
        var divdestination = "msnaddestination_" + divnumber;
        adstring = adstring + "/AAMSZ=" + adsize + "/LOC=" + locstr + "/METHOD=JSCRIPT";
        spac_writeAd(adstring);
    }
}
function stripadstring(adstring) { //remove LOC= and AAMSZ= from ad string
    var regstr = /LOC=[\w]+[\.\]+[0-9]+\/+/gi;
    adstring = adstring.replace(regstr, '');
    var regstr = /AAMSZ=[\w]+\/+/gi;
    adstring = adstring.replace(regstr, '');
    return adstring;
}
function renderAccipter(targetParams) {
    var div = document.getElementById(spacMgr.getCustomDiv(targetParams));
    if (div != null) {
        div.style.cssText = "display:none;";
    }
    var mediaOneAdCode = getMediaOneAdcode(targetParams);
    document.write(mediaOneAdCode);
    document.write(spac_getAdHTML(targetParams));
    return;
}
function renderAdExpert(adKey, adCall, aTargetParams) {
    var aamsz = spac_getParamValue("AAMSZ", aTargetParams);

    if (aamsz == 'NETPROMO') {
        var url = spacMgr.AdxGetSAdUrl + adCall;
        if(spacQS.adx_mode == 'TEST') {
            url = url + '&NMSNADKEY=' + aTargetParams;
        }
        document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"></scr' + 'ipt>');
    } else {
        var html = '<div id="' + adKey + '" name="' + adKey + '"></div>';
        document.getElementById(spacMgr.getCustomDiv(aTargetParams)).innerHTML = html;
        adCall = adCall.replace(/&amp;/gi, "&");
        if(spacQS.adx_mode == 'TEST') {
            adCall = adCall + '&NMSNADKEY=' + aTargetParams;
        }
        var frameSize = new AdType(aamsz);
        NineMSN.Dap.Ad(adKey, adCall.toUpperCase(), frameSize.width, frameSize.height);
    }
}
function getAdXAdCallString(aTargetParams) {
    aTargetParams = aTargetParams.toUpperCase();
    var adKey = spacMgr.getAdXAdKey(aTargetParams);
    var adCall;
    if (spacQS.adx_pg != null && spacQS.adx_adType != null) {
        if (spacQS.adx_adType == spac_getParamValue("AAMSZ", aTargetParams).toUpperCase()) {
            adCall = "&PG=" + spacQS.adx_pg + "&AP=" + spacQS.adx_ap;
            if (spacQS.adx_tag != null) {
                adCall = adCall + spacQS.adx_tag;
            }
            renderAdExpert(adKey, adCall, aTargetParams);
            return;
        }
    }
    if (spacMgr.isAdExpertWsReturned != true) {
        getAdXCallFromWs(aTargetParams);
        return;
    }
    var adExpert = null;
    if (typeof spacMgr.AdxJSON != 'undefined' && spacMgr.AdxJSON.AdExpertList != null) {
        if (typeof spacMgr.AdxJSON.AdExpertList.AdExpert.length == 'undefined') {
            var adx = spacMgr.AdxJSON.AdExpertList.AdExpert;
            if (adx.AdKey.toUpperCase() == adKey) {
                if (adx.SectionName == '') {
                    adExpert = adx;
                }
                if (adx.SectionName.toUpperCase() == spacMgr.Section) {
                    if (adx.SubsectionName == '') {
                        adExpert = adx;
                    }
                    if (adx.SubsectionName.toUpperCase() == spacMgr.Subsection) {
                        adExpert = adx;
                    }
                }
            }
        } else {
            for (var i = 0; i < spacMgr.AdxJSON.AdExpertList.AdExpert.length; i++) {
                var adx = spacMgr.AdxJSON.AdExpertList.AdExpert[i];
                if (adx.AdKey.toUpperCase() != adKey) {
                    continue;
                }
                if (adx.SectionName == '') {
                    adExpert = adx;
                }
                if (adx.SectionName.toUpperCase() == spacMgr.Section) {
                    if (adx.SubsectionName == '') {
                        adExpert = adx;
                    }
                    if (adx.SubsectionName.toUpperCase() == spacMgr.Subsection) {
                        adExpert = adx;
                        break;
                    }
                }
            }
        }
        if (adExpert != null) {
            adCall = adExpert.AdCall;
        } else {
            var adType = new AdType(spac_getParamValue("AAMSZ", aTargetParams));
            adCall = adType.defaultAdXAdCall;
        }
        if (adCall != null) {
            renderAdExpert(adKey, adCall, aTargetParams);
            return;
        }
    }
    renderAccipter(aTargetParams);
}
function getAdXCallFromWs(aTargetParams) {
    var version;
    if (typeof JS_ADX_JSON_VERSION != 'undefined' && JS_ADX_JSON_VERSION != '') {
        version = JS_ADX_JSON_VERSION;
    } else {
        var date = new Date();
        version = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString();
    }
    var url = spacMgr.AdxServiceUrl + "&site=" + spacMgr.Site + "&v=" + version + "&callback=onAdXJsonCallback";
    if (spacQS.adx_enabled == 'TRUE') {
        url = url + "&AdxEnabled=true";
    } else {
        url = url + "&AdxEnabled=false";
    } 
    spacMgr.wsCallbackTargetParams = aTargetParams;
    document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"></scr' + 'ipt>');
}
function onAdXJsonCallback(json) {
    spacMgr.AdxJSON = json;
    spacMgr.isAdExpertWsReturned = true;
    getAdXAdCallString(spacMgr.wsCallbackTargetParams);
}
function AdType(frameSize) {
    var frameSize = frameSize.toUpperCase();
    var sM = '';
    this.width = 480;
    this.height = 60;
    this.defaultAdXAdCall;
    if (frameSize == "AGTVERTICAL") {
        frameSize = "132X331";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
     } else if (frameSize == "BANNER") {
        frameSize = "728X90";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAA&AP=1390';
    } else if (frameSize == "BANNER2") {
        frameSize = "728X90";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAB&AP=1390';
    } else if (frameSize == "BUTTON") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "CATEGORYTILE") {
        frameSize = "290X220";
        //this.defaultAdXAdCall = '&PG=AUXXAC&AP=0000';
    } else if (frameSize == "FLUTTER") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "HALFBANNER") {
        frameSize = "234X60";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAD&AP=1007';        
    } else if (frameSize == "HALFPAGE") {
        frameSize = "300X600";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAE&AP=1457';    
    } else if (frameSize == "HOCKEYSTICK") {
        frameSize = "180X280";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "LARGEBANNER") {
        frameSize = "380X51";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "LOCALTILE") {
        frameSize = "610X30";
        //this.defaultAdXAdCall = '&PG=AUXXAF&AP=0000';
    } else if (frameSize == "LOGO") {
        frameSize = "100X30";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAG&AP=1013';
    } else if (frameSize == "MBANNER") {
        frameSize = "1X1";
        this.defaultAdXAdCall = '&PG=AUXXAH&AP=1485';  
    } else if (frameSize == "MEDIABAR") {
        frameSize = "126X110";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "MEDIACLOSER") {
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';              
    } else if (frameSize == "MEDIAOPENER") {
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "MEDIUM") {
        frameSize = "300X250";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAI&AP=1089';
    } else if (frameSize == "MEDIUMRECTANGLE") {
        frameSize = "350X250";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "MESSENGERBOX") {
        frameSize = "134X54";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "MIDSTRIP") {
        frameSize = "620X45";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAJ&AP=0000';        
    } else if (frameSize.substring(0, 4) == "MINI") {
        frameSize = "120X60";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "MTEXTLINK") {
        frameSize = "1X1";
        this.defaultAdXAdCall = '&PG=AUXXAK&AP=1484';   
    } else if (frameSize == "OTP") {
        frameSize = "0x0";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=1376';
    } else if (frameSize == "PANEAD") {
        frameSize = "224X33";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "PART") {
        frameSize = "120X60";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAL&AP=1026';
    } else if (frameSize == "PARTINT") {
        frameSize = "460X85";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "PIXEL") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=1376';
    } else if (frameSize == "PLATFORMNINE") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAM&AP=0000';
    } else if (frameSize == "POPUNDER") {
        frameSize = "300X250";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "PREMIUM") {
        frameSize = "122X92";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "PROMOCLIP") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAN&AP=1376';        
    } else if (frameSize == "SKYSCRAPER") {
        frameSize = "160X600";
        this.defaultAdXAdCall = '&PG=AUXXAO&AP=1090';
    } else if (frameSize == "SMALLRECTANGLE") {
        frameSize = "180X150";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAP&AP=1419';
    } else if (frameSize == "SPOTLIGHT") {
        frameSize = "300X60";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAQ&AP=1455';   
    } else if (frameSize == "TAKEOVER") {
        frameSize = "1X1";
        sM = "JSCRIPT";
        this.defaultAdXAdCall = '&PG=AUXXAR&AP=0000';
    } else if (frameSize == "TEXT") {
        frameSize = "50X10";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "TEXTLINK") {
        frameSize = "468X20";
        this.defaultAdXAdCall = '&PG=AUXXAS&AP=1389';
    } else if (frameSize == "TICKER") {
        frameSize = "50X10";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "TILE") {
        frameSize = "140X250";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXAT&AP=0000';
    } else if (frameSize == "TOOLBOX") {
        frameSize = "110X260";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "VERTICALBANNER") {
        frameSize = "120X240";
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=1164';
    } else if (frameSize == "VIDEOAD") {
        sM = "JSCRIPT";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    } else if (frameSize == "WAP") {
        frameSize = "28X30";
        //this.defaultAdXAdCall = '&PG=AUXXXX&AP=0000';
    }else if (frameSize == "SIDEPANEL") {
        frameSize = "1X1";
    }
    else {
        frameSize = "1X1";
    }
    
    
    this.frameSize = frameSize;
    this.sM = sM;
    if ("0123456789".indexOf(frameSize.substring(0, 1)) > -1) {
        var i = frameSize.indexOf("X");
        if (i >= 0) {
            this.width = frameSize.substring(0, i);
            this.height = frameSize.substring(i + 1);
        }
    }
}


/* async fix for mozilla - supplied by MS, they have copied in part of their async framework and created the NineMSN.Dap.Ad call which handles a call to the dapMgr */

NineMSN = {
   Page : {
      DapUrl : spacMgr.DapJs, DapReg :/((MSIE\s+([6-9]|\d\d)\.))/, Timeout : 10000}
   }; 

String.prototype.format = function() {
   var b = this, a = 0; 
   for(; a < arguments.length; ++a)b = b.replace(new RegExp("\\{" + a + "\\}", "g"), arguments[a]); 
   return b}; 

Function.prototype.addMethod = function(b, c) {
   var a = this.prototype; 
   if(!a[b])a[b] = c; 
   return this}; 

Function.prototype.as = function(i, j) {
   var b = window, e = 0, a, f, c, d, g = i ? i.split(".") : [], h = g.length; 
   if(h--) {
      for(; e < h && (a = g[e]); ++e)if(a) {
         if(!b[a])b[a] = {
            }; 
         b = b[a]}
      a = g[e]; 
      c = b[a]; 
      f = b[a] = j ? new this : this; 
      if(c)for(d in c)if(typeof f[d] == "undefined")f[d] = c[d]}
   return this}; 
   
Function.prototype.ns = function(a) { this.as(a, 1)}; 
  
Array.addMethod("push", function(a) { this[this.length] = a; return this.length}); 

Array.addMethod("splice", function(c, d) {
   var b, e = arguments.length - 2; if(c > this.length)c = this.length; if(c + d > this.length)d = this.length - c; var f = []; for(var a = 0; a < d; ++a)f.push(this[c + a]); if(e > d) {
      b = e - d; for(a = this.length + b - 1; a >= c + b; --a)this[a] = this[a - b]}
   else if(e < d) {
      b = d - e; for(a = c + e; a < this.length - b; ++a)this[a] = this[a + b]; for(; a < this.length - 1; ++a)delete this[a]; this.length -= b}
   for(a = 0; a < e; ++a)this[c + a] = arguments[2 + a]; return f}
); 

(function() {
   var e = this, i = 100, g = document, a = {
      }
   , c = []; Function.addMethod("JS", function(e, j, o) {
      var i = this, p = g.getElementsByTagName("HEAD")[0]; if(j) {
         var m = b(j); if(d(m)) {
            f(i, m); return i}
         }
      if(e) {
         var l = new h(j, i, o); if(a[e])a[e].push(l); else {
            a[e] = [l]; var c = g.createElement("script"); c.type = "text/javascript"; c.onreadystatechange = n; c.onerror = c.onload = k; c.src = e; p.appendChild(c)}
         }
      function k() {
         c.onreadystatechange = c.onload = c.onerror = null; var b = 0, d = a[e]; delete a[e]; for(; d[b]; ++b)d[b].Poll()}
      function n() {
         var a = c.readyState; if(a == "loaded" || a == "complete")k()}
      return i}
   ); function h(g, a, e) {
      var h = (new Date).getTime(); this.Func = a; this.Poll = function() {
         if(g)c(); else a(1)}; function c() {
         var j = b(g); if(d(j) || e && (new Date).getTime() - h > e)f(a, j); else setTimeout(c, i)}
      }
   function b(c) {
      var a, f = 0, e = c ? c.split(".") : [], b = e.length; if(b) {
         a = window; while(f < b && d(a = a[e[f++]])); }
      return a}
      
   e.GetObj = b; function f(d, b) {
      d(b); for(var a = 0; a < c.length; a++)c[a](b)}
      
   e.AddDoneEvent = function(a) {
      if(typeof a == "function")c.push(a)}; function d(a) {
      return typeof a != "undefined"}
      
   e.Callback = function(a) {
      if(typeof a == "function")a()}
   }
).ns("NineMSN.Async"); 

(function() {
   var a = [], b = NineMSN.Async.GetObj, c = 0; this.DomComplete = function() {
      return c}; this.Add = function(e, d, f, g) {
      var c; if(g && (c = b(e)))c.bind(d, f); else a.push( {
         bind : e, sel : d, args : f}
      )}; function d(g) {
      if(g)c = g; var f, d, e = 0; while(d = a[e]) {
         d = a[e]; f = b(d.bind); if(f) {
            f.bind(d.sel, d.args); a.splice(e, 1)}
         else++e}
      }
   this.Bind = d; NineMSN.Async.AddDoneEvent(function() {
      d()}
   )}
).ns("NineMSN.Async.Bindings"); 

(function() {
    var a = NineMSN.Page.DapUrl, c = NineMSN.Page.DapReg.exec(navigator.userAgent);
    if (!c) b();
    else if ((spacQS.adx_enabled == 'TRUE' || typeof (JS_ADX_ENABLED) == 'undefined' || JS_ADX_ENABLED == 'TRUE') && typeof (dapMgr) == 'undefined' && xHttp) (function() { }).JS(a);

    this.Ad = function(d, e, g, f) {
       
        if (c && d) (function(a) {
            if (a) { a.enableACB(d, 0); a.renderAd(d, e, g, f) }
        }).JS(a, "dapMgr", NineMSN.Page.Timeout);
        else { if (typeof dap != "function") b(); window.dap(e, g, f) }
    };

    function b() {
      
        if ((spacQS.adx_enabled == 'TRUE' || typeof (JS_ADX_ENABLED) == 'undefined' || JS_ADX_ENABLED == 'TRUE') && typeof (dapMgr) == 'undefined' && xHttp) {
            document.write('<scr' + 'ipt type="text/javascript" src="' + a + '"></scr' + 'ipt>')
        }
    }
}).ns("NineMSN.Dap");