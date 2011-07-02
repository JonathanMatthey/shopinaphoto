// setup commonly used elements
var urlShared = (window.location.href.indexOf('prev01.ninemsn') > -1 || window.location.href.indexOf('syd.ninemsn') > -1) ? "" : "http://shared.9msn.com.au";
var hd_1 = document.getElementById("hd_1");
var hd_1_width = 0;
if (!hd_1.currentStyle)
{
    if(window.getComputedStyle)
    {
        hd_1_width = parseInt(document.defaultView.getComputedStyle(hd_1, null).getPropertyValue("width"));
    }
}
else
{
    hd_1_width = parseInt(hd_1.currentStyle.width);
}
var hd_links_ul = document.getElementById("hd_links").getElementsByTagName('ul')[0];

// adjust header style if banner ad disabled
var JS_NETNAV_DISABLE_BANNER;
if (JS_NETNAV_DISABLE_BANNER.toUpperCase() == 'TRUE')
{
    document.write('<style type="text/css">');
    document.write('#msnlogo_div{display:none}');
    document.write((hd_1_width > 779)?'#hd_links ul li{margin:5px 6px 0px}':'');
    document.write('#hd_links #hd_li_1{background:transparent url('+urlShared+'/share/img/hd2008/ninemsn_logo_nrw.gif) no-repeat;padding:9px 0px 6px 100px;margin:0px 8px 0px 0px}');
    document.write('#hd_links #hd_li_1 a{position:relative;top:-1px}');
    document.write('#hd_ad{display:none}');
    document.write('</style>');
    document.getElementById('hd_links').getElementsByTagName('a')[0].innerHTML = 'Home';
}

// replace promo link with breaking news
var breaking_news = false;
if (typeof newsObj != 'undefined')
{
    var breaking_news = '<span class="breaking_news"><b>'+newsObj.Title+'</b><span class="hd_strip_arw"><img src="'+urlShared+'/share/img/hd2008/hd_strip_arw.gif" alt="" /></span><a href="'+newsObj.Links[0].Url+'">'+newsObj.Links[0].Title+'</a></span>';
    var hd_strip_l = document.getElementById('hd_strip_l');
    hd_strip_l.innerHTML = breaking_news;
    var brk_news_a = hd_strip_l.getElementsByTagName('a')[0]
    brk_news_a.onclick = TrackIt.Bind(null,brk_news_a,"NHD_PRI_Breaking_News");brk_news_a
    breaking_news = true;
}

// adjust search input width
var hd_links_ul_width = 0;
if (hd_links_ul.offsetWidth)
{
    hd_links_ul_width = hd_links_ul.offsetWidth;
}
var hd_links_hrz_pad = 20;
var hd_sch_width = 20; // was 59 on 29/5/08
var hd_sch_rht_mgn = 12;
var hd_delta = hd_links_ul_width + hd_links_hrz_pad + hd_sch_width + hd_sch_rht_mgn;

var isBackCompat = (document.compatMode && document.compatMode == "BackCompat");
if (typeof(isBackCompat) == "undefined")
{
    hd_delta += 2; // Safari fix - search box width
}
var isNarrowSize = (hd_1_width <= 790);

var w = hd_1_width - hd_delta - (isBackCompat? 0 : 2) - 60;
var hd_1_input_css = "width:" + w + "px;" + (isBackCompat? "height:23px;" : "");
if (typeof(isBackCompat) == "undefined")
{
    hd_1_input_css += "padding:1px;height:18px;top:-8px} #hd_links ul{padding-top:2px;} body #nw_ft #ft_src_div #ft_ms_input{width:130px;"; // Safari fix - search boxes and div
}

document.write("<style type=\"text/css\">");
document.write("#hd_src_div #hd_ms_input{" + hd_1_input_css + "}");
if (isBackCompat) {
    document.write("#hd_src_div #hd_ms_input{_left:9px;}");
    document.write(".hd_ms_img_rebrand{_padding:0px;_border:solid white 2px;_border-left:none;_left:6px;}");
    document.write("#hd_src_div{_width:" + (w + 100) + "px;_left:4px;}");
}
document.write("</style>");
document.write("<!--[if IE]><style type=\"text/css\">#hd_links #hd_li_14.tabsel span{padding-top:10px}</style><![endif]-->"); // IE fix - more tab select

if (navigator.userAgent.indexOf("Firefox") > -1 && navigator.userAgent.indexOf("Macintosh") > -1) // Firefox on Mac fix
{
    document.write("<style type=\"text/css\">#hd_src_div #hd_ms_input{height:18px} #hd_links ul{padding-top:2px}</style>");
}

// more dropdown - common
var navObj;
var morePos;
var more_populated = false;

function downloadMore()
{
    var script = document.createElement('script');
    script.src = moreFeed;
    document.getElementsByTagName('head')[0].appendChild(script);
}

function more_callback(obj)
{
    if (!more_populated)
    {
        navObj = obj;
        populateMore(hd_more_div, 'NHD');
        if (typeof ft_more_div != 'undefined')
        {
            populateMore(ft_more_div, 'NFT');
        }
        more_populated = true;
        (morePos == 'h') ? toggleHdrMore() : toggleFtrMore();
    }
}

function populateMore(more_div, OCLpre)
{
    var more_list = navObj.Links;
    var more_link_per_col = 5;
    var more_cols = Math.floor(more_list.length/more_link_per_col)
    if (more_list.length % more_link_per_col > 0)
    {
        more_cols++;
    }

    for(var i=1; i <= more_cols; i++)
    {
        var more_ul = document.createElement("ul");
        more_div.appendChild(more_ul);

        var ul_class = "more_col" + i;
        more_ul.className = ul_class;

        for(var l=0; l < more_link_per_col; l++)
        {
            var more_li = document.createElement("li");
            more_ul.appendChild(more_li);
            var link_seq = (i-1) * more_link_per_col + l

            if(more_list[link_seq].Url)
            {
                var more_li_a = document.createElement("a");
                more_li_a.href = more_list[link_seq].Url;
                more_li_a.innerHTML = more_list[link_seq].Title;

                more_li.appendChild(more_li_a);
            }
            else
            {
                var more_li_span = document.createElement("span");
                more_li_span.innerHTML = more_list[link_seq].Title;

                more_li.appendChild(more_li_span);
            }
        }
    }
    // add omniture custom link tracking
    var hd_sec_links = more_div.getElementsByTagName("a");
    for (i=0; i<hd_sec_links.length; i++)
    {
        var l = hd_sec_links[i];
        var lc = l.childNodes[0];
        while(lc.nodeType != 3) lc = lc.childNodes[0];
        var s = OCLpre+"_SEC_" + lc.nodeValue.replace(/ /g, "_");
        l.onclick = TrackIt.Bind(null,l,s);
        l = null;
    }
    
    var clear_div = document.createElement("div");
    more_div.appendChild(clear_div);
    clear_div.style.clear = "both";
}

// more dropdown - header
function toggleHdrMore()
{
    if (hd_more_div.className == "hd_more_hide")
    {
        hd_more_div.className = "hd_more_show";
        window.setTimeout('OCLTracking(true, "NHD_PRI_More_Open_INT");', 100);
    }
    else
    {
        hd_more_div.className = "hd_more_hide";
        window.setTimeout('OCLTracking(true, "NHD_PRI_More_Shut_INT");', 100);
    }
    if(hd_more_link.parentNode)
    {
        hd_more_link.parentNode.className = (hd_more_link.parentNode.className == "tabsel"? "" : "tabsel");
    }
    else
    {
        hd_more_link.parentElement.className = (hd_more_link.parentElement.className == "tabsel"? "" : "tabsel");
    }
    if (hd_li_tabsel)
    {
        hd_li_tabsel.className = (hd_li_tabsel.className == "tabsel"? "" : "tabsel");
    }
}

var hd_more_div = document.getElementById("hd_more_sites");
var hd_more_link = document.getElementById("hd_moreLink");
var hd_li_sel;
if (hd_li_sel)
{
    var hd_li_tabsel = document.getElementById(hd_li_sel);
}
if(hd_more_link)
{
    hd_more_link.onclick = function(e)
    {
        if (!more_populated)
        {
            morePos = 'h';
            downloadMore();
        }
        else
        {
            toggleHdrMore();
        }
    
        if (!e)
        {
            var e = window.event;
        }
        e.cancelBubble = true;
        if (e.stopPropagation)
        {
            e.stopPropagation();
        }
        return false;
    }
}

// sign-in/out script
var JS_TRACK_SWITCH_LOCAL; var JS_TRACK_SWITCH; var JS_SITEID; var JS_SECTIONID; var JS_SUB_SECTIONID;
JS_TRACK_SWITCH_LOCAL = JS_TRACK_SWITCH;
if (JS_TRACK_SWITCH_LOCAL == undefined || JS_TRACK_SWITCH_LOCAL == '' || JS_TRACK_SWITCH_LOCAL.toLowerCase() == 'off')
{
    JS_TRACK_SWITCH_LOCAL = 'False';
}
else if (JS_TRACK_SWITCH_LOCAL.toLowerCase() == 'on')
{
    JS_TRACK_SWITCH_LOCAL = 'True';
}
document.write("<scr"+"ipt type=\"text/javascript\" src=\"http://ninemsn.com.au/share/com/header_v10/renderPersonalisation.aspx?hd_signinLink=MEMBERSHIPSIGNINLINK&mr="+encodeURIComponent(window.location.href)+"&_p="+JS_SITEID+"_"+JS_SECTIONID+"_"+JS_SUB_SECTIONID+"&_m=SIGNIN&_x=1&_l=0&ts="+JS_TRACK_SWITCH_LOCAL+"&"+(new Date()).getTime()+"\"></scr"+"ipt>");

// search box script
var hd_input = document.getElementById("hd_ms_input");
var hd_search_hint = "Search the web";
if(hd_input)
{
    hd_input.onkeydown = function(e)
    {
        if(hd_input.value == hd_search_hint)
        {
            hd_input.value = "";
        }
        keyNum = (window.event) ? event.keyCode : e.which;
        if (keyNum == 40 || keyNum == 38 || keyNum == 33 || keyNum == 34 || (keyNum == 32 && hd_input.value.length == 0))
        {
            document.getElementById('hd_ms_input').blur();
            window.focus();
        }
    }

    hd_input.onblur = function()
    {
        if(hd_input.value == '')
        {
            hd_input.value = hd_search_hint;
        }
    }
    
    hd_input.onclick = function()
    {
        if(hd_input.value == hd_search_hint)
        {
            hd_input.value = '';
        }
    }
}

function hd_input_focus()
{
    if (window.location.href.indexOf('#') < 0 && (document.body.scrollTop ==  0 && document.documentElement.scrollTop == 0))
    {
        if (navigator.appName == "Microsoft Internet Explorer")
        {
            hd_input.setActive();
        }
        else
        {
            hd_input.focus();
        }
    }
}

var JS_HEADER_AUTO_FOCUS;
if (JS_HEADER_AUTO_FOCUS == undefined || JS_HEADER_AUTO_FOCUS == '' || JS_HEADER_AUTO_FOCUS.toLowerCase() == 'true') {
    hd_input_focus();
    if (!window.onload) {
        window.onload = hd_input_focus;
    }
} 

// omniture custom tracking script for primary (navigation) links
var hd_list_links = hd_links_ul.getElementsByTagName("a");
for(i=0; i<hd_list_links.length-1; i++)
{
    var l = hd_list_links[i];
    var lc = l.childNodes[0];
    if (i == 0)
    {
        var s = "NHD_PRI_Home"
    }
    else
    {
        var s = "NHD_PRI_" + lc.nodeValue.replace(/ /g, "_");
    }
    l.onclick = TrackIt.Bind(null,l,s);
    l = null;
}

// omniture custom tracking script for strip links (promo and services)
if (!breaking_news)
{
    var promo_links = document.getElementById('hd_strip_l').getElementsByTagName('a')
    for (i=0; i<promo_links.length; i++)
    {
    	if (promo_links[i].id != "makehomelink")
        promo_links[i].onclick = TrackIt.Bind(null,promo_links[i],"NHD_Promo_"+(i+1));
    }
}

// Temp Hack - Get rid of first separator
try 
{
    $("#hd_strip_l .promo_sep").eq(1).html("");
}
catch (err) 
{
    var spanEles = document.getElementById("hd_strip_l").getElementsByTagName("span");
    var eleCount = 0;
    for (var i = 0; i < spanEles.length; i++) 
    {
        if (spanEles.item(i).hasAttribute("class") && spanEles.item(i).getAttribute("class") == "promo_sep") 
        {
            eleCount++;
            if (eleCount == 2) 
            {
                spanEles.item(i).innerHTML = "";
            }
        }
    }
}


var hd_srv_links = document.getElementById('hd_strip_r').getElementsByTagName('a');
for(i=0; i<hd_srv_links.length; i++)
{
    var l = hd_srv_links[i];
    var lc = l.childNodes[(i==3)?0:1];
    if (i<3)
    {
        lc = lc.childNodes[0];
    }
    var s = "NHD_PRI_"+lc.nodeValue.replace(/ /g, "_");
    l.onclick = TrackIt.Bind(null,l,s);
    l = null;
}

function TrackSearch(hd_form)
{
    hd_form.href = "http://www.bing.com/search";
    TrackIt(hd_form, 'NHD_PRI_Search_box');
        
}

function TrackIt(l,s)
{
    OCLTracking(l,s);
}



function submit_hd_src()
{
    var strDefaultQuery;
    var tabgroup;
    var strInput = document.getElementById('hd_ms_input').value;
    var strFormCode = document.getElementById('hd_ms_formcode').value;

	if(strFormCode == null || strFormCode == '') 
	{ 
		strFormCode = "MSNMH1";
	}
    
    if (typeof JS_NETNAV_TAB_GROUP != "undefined")
    {
        var tabgroup = JS_NETNAV_TAB_GROUP.toLowerCase();
    }
    switch (tabgroup)
    {
        case "news" : strDefaultQuery = "news"; break;
        case "sports" : strDefaultQuery = "sports"; break;
        case "money" : strDefaultQuery = "finance news"; break;
        case "lifestyle" : strDefaultQuery = "beauty"; break;
        case "entertainment" : strDefaultQuery = "entertainment gossip"; break;
        case "video" : strDefaultQuery = "ninemsn videos"; break;
        case "travel" : strDefaultQuery = "travel deals"; break;
        default : strDefaultQuery = "ninemsn";
    }

    if (strInput == null || strInput == '' || strInput == 'Search the web') 
    {
        strInput = "?";
    }
    else 
    {
        strInput = "search?q=" + strInput + "&";
    }

    window.location.href = "http://www.bing.com/" + strInput + "form=" + strFormCode + "&mkt=en-au";
	
    return false;
}
