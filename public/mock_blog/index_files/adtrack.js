//  JS_OMNTR_LINKTRACKSWITCH 
//      null|empty|'' only call AdTrack
//      1   both AdTrack and Omni
//      2   only call Omni

var JS_SITEID;
var JS_SECTIONID;
var JS_SUBSECTIONID;
var JS_TRACK_SWITCH;
var JS_OMNTR_SUITEID;
var JS_OMNTR_LINKTRACKSWITCH;
var JS_FLIGHT_VARIANT;

function AdTrack() { };

AdTrack.trackPath = "/share/com/adtrack/d.aspx";

AdTrack.GetXMLHttpIE = function(idList, dft) {
    var bFound = false;
    var o2Store;
    for (var i = 0; i < idList.length && !bFound; i++) {
        try {
            var oDoc = new ActiveXObject(idList[i]);
            o2Store = idList[i];
            bFound = true;
        } catch (objException) {
            // trap error
        };
    };
    idList = null;
    if (o2Store == undefined || o2Store == null) {
        o2Store = dft;
    }
    return o2Store;
};

AdTrack.encode = function() {
    var str = arguments[0];
    if (encodeURIComponent) {
        str = encodeURIComponent(str);
    } else {
        str = escape(str);
        str = str.replace(/:/g, "%3A").replace(/ /g, "%20").replace(/-/g, "%2D").replace(/_/g, "%5F").replace(/\./g, "%2E").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/=/g, "%3D").replace(/&/g, "%26").replace(/\+/g, "%2B").replace(/\|/g, "%A6").replace(/\|/g, "%7C").replace(/,/g, "%2C");
    }
    return str;
};

AdTrack.sendTrack = function() {
    var targetURL = arguments[0];
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        var msxmlClass = AdTrack.GetXMLHttpIE(["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], "Microsoft.XMLHTTP");
        xmlhttp = new ActiveXObject(msxmlClass);
    };
    try {
        xmlhttp.open("GET", targetURL, true);
        xmlhttp.send(null);
    } catch (objException) {
        // trap error
    };
};

AdTrack.t = function() {
    if (JS_TRACK_SWITCH != undefined && JS_TRACK_SWITCH.toUpperCase() != 'ON') { 	// * track if no GCPC!
        return 0;
    }
    var siteid, sectionid, subsectionid;
    var targetURL;
    var moduleName = '';
    var location = '';
    var transID = '';
    var referral = '';
    var _x = '0';
    var _others = '';
    if (JS_SITEID == undefined) {
        siteid = 0;
    } else {
        siteid = JS_SITEID;
    }
    if (JS_SECTIONID == undefined) {
        sectionid = 0;
    } else {
        sectionid = JS_SECTIONID;
    }
    if (JS_SUBSECTIONID == undefined) {
        subsectionid = 0;
    } else {
        subsectionid = JS_SUBSECTIONID;
    }
    if (arguments[0].href != undefined) {
        targetURL = arguments[0].href;
    } else {
        targetURL = arguments[0];
    }
    if (arguments.length >= 2) {
        moduleName = arguments[1];
    }
    if (arguments.length >= 3) {
        location = arguments[2];
    }
    if (arguments.length >= 4) {
        transID = arguments[3];
    }
    if (arguments.length >= 5) {
        referral = arguments[4];
    }
    if (arguments.length >= 6) {
        _x = arguments[5];
        if (_x == '')
            _x = '0';
    }
    if (arguments.length >= 7) {
        _others = arguments[6];
    }
    if (JS_OMNTR_LINKTRACKSWITCH != '2') {
        var finalURL = this.trackPath + "?REFERER=" + this.encode(window.location.href) +
				       "&URL=" + this.encode(targetURL) +
				       "&_p=" + this.encode(siteid) + "_" + this.encode(sectionid) + "_" + this.encode(subsectionid) +
				       "&_m=" + this.encode(moduleName) +
				       "&_l=" + this.encode(location) +
				       "&_t=" + this.encode(transID) +
				       "&_r=" + this.encode(referral) +
				       "&_x=" + this.encode(_x) +
				       this.encode(_others) +
				       "&_async=true";

        AdTrack.sendTrack(finalURL);
    }
    if (JS_OMNTR_LINKTRACKSWITCH != null && (JS_OMNTR_LINKTRACKSWITCH == "1" || JS_OMNTR_LINKTRACKSWITCH == "2")) {
        var arrEvar = new Array(51);
        var arrProp = new Array(51);
        var arrEvt = new Array(21);
        var sproduct;
        var linkProduct;
        var eventStr = "";
        arrEvar[12] = targetURL;
        arrEvar[13] = moduleName;
        arrEvar[14] = location;
        arrEvar[15] = transID;
        arrEvar[16] = referral;
        arrEvar[17] = siteid + '_' + sectionid + '_' + subsectionid;
        arrProp[32] = JS_FLIGHT_VARIANT;
        arrProp[34] = moduleName;
        arrProp[36] = location;
        arrEvt[5] = true;
        if (arguments[0].innerHTML != undefined) {
            linkProduct = arguments[0].innerHTML;
            if (linkProduct.search(/<img\s/i) == 0 && linkProduct.match(/alt="[^"]*/i) != null && linkProduct.match(/alt="[^"]*/i) != 'alt="') {
                linkProduct = linkProduct.match(/alt="[^"]*/i)[0].substr(5);
                linkProduct = "img-" + linkProduct.replace(/[\x00-\x19]/g, "").replace(/[\x21-\x2F]/g, "").replace(/[\x3A-\x40]/g, "").replace(/[\x5B-\x60]/g, "").replace(/[\x7B-\xFF]/g, "");
            } else if (linkProduct.search(/<img\s/i) == 0 && linkProduct.match(/src="[^"]*/i) != null) {
                linkProduct = linkProduct.match(/src="[^"]*/i)[0].substr(linkProduct.match(/src="[^"]*/i)[0].lastIndexOf("/") + 1);
                linkProduct = "img-" + linkProduct.replace(/[\x00-\x19]/g, "").replace(/[\x21-\x2F]/g, "").replace(/[\x3A-\x40]/g, "").replace(/[\x5B-\x60]/g, "").replace(/[\x7B-\xFF]/g, "");
            } else {
                linkProduct = linkProduct.replace(/<[^>]+>/g, "").replace(/[\x00-\x19]/g, "").replace(/[\x21-\x2F]/g, "").replace(/[\x3A-\x40]/g, "").replace(/[\x5B-\x60]/g, "").replace(/[\x7B-\xFF]/g, "");
            }
        } else if (typeof (arguments[0]) == "string") {
            linkProduct = arguments[0];
            linkProduct = linkProduct.replace(/[;|]/g, "");
        }
        if (linkProduct != null && linkProduct != "") {
            linkProduct = ((linkProduct.length > 50) ? linkProduct.substr(0, 48) + ".." : linkProduct);
            sproduct = ';' + linkProduct + ';;;;evar11=' + ((arguments.length >= 2) ? arguments[1] : 'unknown');
            arrProp[35] = linkProduct;
        }
        OMNTRLinkTracking(true, 'link_track_click', 'ltc_Info', arrEvar, arrEvt, null, arrProp, sproduct);

        // get the events to pass through to TNT
        for (var i = 0, len = arrEvt.length; i < len; ++i) {
            if (arrEvt[i] == true) {
                eventStr = eventStr + 'event' + i + ',';
            }
        }

        // Test and Target code that should only be used for portal and portal11
        if (JS_SITEID == '6670367' || JS_SITEID == '282') {
            // if its an interactive click the call mBoxTrack
            if (moduleName.indexOf('_INT') != -1) {
                mboxTrack('ninemsn_onClick', 'moduleName=' + moduleName);
            }
            else {
                // if its an exit click the call mBoxTrack
                mboxTrackLink('ninemsn_onClick', 'clickEvent=' + eventStr + '&targetUrl=' + targetURL + '&moduleName=' + moduleName, targetURL);
            }
        }
    }
    return 1;
};