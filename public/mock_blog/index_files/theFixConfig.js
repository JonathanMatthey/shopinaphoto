//Work out which protocol to use
var HTTP_PROTOCOL = (location.protocol.indexOf('https') > -1 ? "https://" : "http://");

var InlineSearchBoxConfiguration =
{
	"configURL" : HTTP_PROTOCOL + "services.ninemsn.com.au/share/external/search/config/theFixConfig.js",
	"adsUrl" : HTTP_PROTOCOL + "xml.sj.msn.overture.com/d/search/p/msn/js/news/au/pm/?Partner=msn_au_js_searchbox&mkt=au&adultFilter=any&maxCount=6",
	"altOptusAdsUrl" : HTTP_PROTOCOL + "xml.sj.msn.overture.com/d/search/p/msn/js/news/au/pm/?Partner=msn_au_js_searchbox&mkt=au&adultFilter=any&maxCount=6",
	"adTextLen" : 70,
	"formCode" : "MICBG3",
	"width" : "275px",
	"resultsWidth" : "750px",
	"resultsHeight" : "300px",
	"count" : 10,
	"searchMkt" : "en-au",
	"tryOnLiveLink" : true,
	"linksTarget" : "",
	"themeBtnBg" : "#F32943",
	"themeBorder" : "#C1C1C1",
	"themeHighlight" : "#f994a1",
	"themeResBtnBg" : "#f994a1",
	"themeResBarBg" : "#f994a1",
	"alignCorner" : "right",
	"adsTarget" : "",
	"isInline" : true,
	"scopes" :
	[
		{
			"caption" : "The Fix",
			"searchParam" : escape("(site:yourmovies.com.au OR site:yourtv.com.au OR site:celebrities.ninemsn.com.au OR site:music.ninemsn.com.au OR site:thefix.ninemsn.com.au)"),
			"defaultText" : "Search The Fix"
		},
		{
			"caption" : "Movie Fix",
			"searchParam" : "site:yourmovies.com.au",
			"defaultText" : "Search Movie Fix"
		},
		{
			"caption" : "Music Fix",
			"searchParam" : "site:music.ninemsn.com.au",
			"defaultText" : "Search Music Fix"
		},
		{
			"caption" : "TV Fix",
			"searchParam" : "site:yourtv.com.au",
			"defaultText" : "Search TV Fix"
		},
		{
			"caption" : "Celebrity Fix",
			"searchParam" : "site:celebrities.ninemsn.com.au",
			"defaultText" : "Search Celebrity Fix"
		}
	],
	"liveSearchURL" : "http://bing.com/search",
	"liveSearchImageURL" : "http://bing.com/images/search",    
	"prevButtonSrc" : "http://bing.com/s/siteowner/glyph_back_rest.gif",
	"prevPageLink" : "http://bing.com/s/siteowner/glyph_back_hover.gif",
    "nextButtonSrc" : "http://bing.com/s/siteowner/glyph_next_rest.gif",
    "nextPageLink" : "http://bing.com/s/siteowner/glyph_next_hover.gif",
    "liveSearchWatermark" : "-", //"services.ninemsn.com.au/share/external/search/img/logo_watermark.gif",
    "liveSearchButton" : "services.ninemsn.com.au/share/external/search/img/btn_search.png",
    "webResultFooterLiveLink" : "http://bing.com/?FORM=LSBTOL",
    "webResultFooterLiveText" : "Try Bing",
    "liveJsonUrl" : "http://bing.com/json.aspx?q=",
    "liveLinkText" : "Try this on Bing",
    "liveLogoPng" : "services.ninemsn.com.au/share/img/brand/logo.png", //"services.ninemsn.com.au/share/external/search/img/logo_live.png",
    "liveAltText" : "bing.com",
    "liveCloseButton" : "services.ninemsn.com.au/share/external/search/img/btn_close.gif",
    "liveSearchPrefix" : "results by",
    "liveLink" : "bing.com/?form=MSNN27&mkt=en-au"
}

//download supporting libraries
document.write("<script type='text/JavaScript' src='" + HTTP_PROTOCOL + "services.ninemsn.com.au/share/js/global/Ninemsn.Global/NinemsnComm.js'></script>");
document.write("<script type='text/JavaScript' src='" + HTTP_PROTOCOL + "services.ninemsn.com.au/share/js/global/Ninemsn.Global/ContentMgr.js'></script>");