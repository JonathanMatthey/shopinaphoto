///////////////////////////////////////////////////////////////////////////////
//
// namespace mobilise.ninemsn.gomobile
//
///////////////////////////////////////////////////////////////////////////////
if (mobilise == undefined) { var mobilise = function () {}; }
if (mobilise.ninemsn == undefined) { mobilise.ninemsn = function () {}; }

///////////////////////////////////////////////////////////////////////////////
//
// GoMobile Bootstrap Loader
//
///////////////////////////////////////////////////////////////////////////////
if (mobilise.ninemsn.bootstrap == undefined) {
mobilise.ninemsn.bootstrap = function ()
{
    var _CODE_UNDEFINED = "undefined";
    var _USER_HOSTSITE = "_M_HOSTSITE";
    var _USER_TARGETSITE = "_M_TARGETSITE";
    var _USER_WIDGETFORMAT = "_M_WIDGET";

    var _FORMAT_LARGE = "2"
    var _FORMAT_MEDIUM = "1"
    var _DEFAULT_FORMAT = "0"
    var _DEFAULT_SECTION = "sectionid=5994&subsectionid=77278"
    var _DEFAULT_SITE = "mobilise"
    var _BASEURL = "http://mobilise.ninemsn.com.au/";

    var _formatMap = [
                     { "page" : "gomobile/gomobile.aspx", "css" : "css/gomobile/small/gomobile_{0}.css" },
                     { "page" : "gomobile/gomobilemedium.aspx", "css" : "css/gomobile/medium/gomobile_{0}.css" },
                     { "page" : "gomobile/gomobilelarge.aspx", "css" : "css/gomobile/large/gomobile_{0}.css" }
                     ];

    var _siteNameCatalog = {"bars"        : "sectionid=5994&subsectionid=77283",
                            "cleo"        : "sectionid=5994&subsectionid=77286",
                            "gigs"        : "sectionid=5994&subsectionid=77281",
                            "hotmail"     : "sectionid=5994&subsectionid=77293",
                            "livesearch"  : "sectionid=5994&subsectionid=77294",
                            "messenger"   : "sectionid=5994&subsectionid=77295",
                            "mobilise"    : "sectionid=5994&subsectionid=77278",
                            "movies"      : "sectionid=5994&subsectionid=77280",
                            "news"        : "sectionid=5994&subsectionid=77279",
                            "ralph"       : "sectionid=5994&subsectionid=77285",
                            "restaurants" : "sectionid=5994&subsectionid=77282",
                            "spaces"      : "sectionid=5994&subsectionid=77296",
                            "tv"          : "sectionid=5994&subsectionid=77284",
                            "wwos"        : "sectionid=5994&subsectionid=77292",
                            "celebrityfix" : "sectionid=5994&subsectionid=80246",
	            "beijing2008" : "sectionid=5994&subsectionid=81560",
                            "sixtyminutes" : "sectionid=5994&subsectionid=154434"
};

    this.renderGoMobile = function()
    {
        var format = _formatMap[_DEFAULT_FORMAT];
        var pageUrl = "";
        var cssUrl = "";
        var sectionInfo = "";
        var hostSite = "";
        var site = "";
		var gomobileFrameId = "gomobileframe";
       
        window[_USER_HOSTSITE] = (typeof window[_USER_HOSTSITE] != "string") ? "" : window[_USER_HOSTSITE].toLowerCase();
        window[_USER_TARGETSITE] = (typeof window[_USER_TARGETSITE] != "string") ? "" : window[_USER_TARGETSITE].toLowerCase();

        if ((typeof window[_USER_WIDGETFORMAT] != "undefined") && ((window[_USER_WIDGETFORMAT] + "") == _FORMAT_LARGE))
        {
			gomobileFrameId = gomobileFrameId + "large";
            format = _formatMap[_FORMAT_LARGE];
        }
        else if ((typeof window[_USER_WIDGETFORMAT] != "undefined") && ((window[_USER_WIDGETFORMAT] + "") == _FORMAT_MEDIUM))
        {
            format = _formatMap[_FORMAT_MEDIUM];
        }

        if (typeof _siteNameCatalog[window[_USER_TARGETSITE]] != "undefined")
        {
            site = window[_USER_TARGETSITE];
            sectionInfo = _siteNameCatalog[window[_USER_TARGETSITE]];
        } 
        else
        {
            site = _DEFAULT_SITE;
            sectionInfo = _DEFAULT_SECTION;
        }

        hostSite = (typeof _siteNameCatalog[window[_USER_HOSTSITE]] != "undefined") ?
                   window[_USER_HOSTSITE] : _DEFAULT_SITE;

        pageUrl = _BASEURL + format["page"];
        cssUrl = _BASEURL + format["css"].replace("{0}", hostSite);

        var param = new Array("");

        param.push(sectionInfo);
        param.push("&");
        param.push("_mhost=");
        param.push(window[_USER_HOSTSITE]);
        param.push("&");
        param.push("_msite=");
        param.push(window[_USER_TARGETSITE]);
        param.push("&");

        var gomobileFrame = new Array("");

        gomobileFrame.push('<iframe scrolling="no" frameborder="0" name="gomobileframe" id="' + gomobileFrameId + '" ');
        gomobileFrame.push('src="' + pageUrl + '?' + param.join("") + '"> </iframe>');

        document.write("<link href=\"" + cssUrl + "\" type=\"text/css\" rel=\"stylesheet\" />");
        document.write(gomobileFrame.join(""));
    }
}
} // end of namespace mobilise.ninemsn.bootstrap


if (mobilise.ninemsn.vars == undefined) {
    mobilise.ninemsn.vars = {};
}

mobilise.ninemsn.vars["bootObj"] = new mobilise.ninemsn.bootstrap();
mobilise.ninemsn.vars.bootObj.renderGoMobile();







