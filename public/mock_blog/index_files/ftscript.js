// search input styling
var isBackCompat = (document.compatMode && document.compatMode == "BackCompat" && navigator.appName == "Microsoft Internet Explorer");
if (isBackCompat)
{
    var ft_src_div_wrap_mid = document.getElementById("ft_src_div_wrap_mid");

    var ft_ms_input = ft_src_div_wrap_mid.childNodes[0];
    ft_ms_input.style.top = "-8px";
    ft_ms_input.style.height = "22px";

    var ft_ms_img_rebrand = ft_src_div_wrap_mid.childNodes[1];
    ft_ms_img_rebrand.style.height = "20px";
}

// more dropdown - footer
function toggleFtrMore()
{
    if (ft_more_div.className == "ft_more_hide")
    {
        ft_more_div.className = "ft_more_show";
        window.setTimeout('OCLTracking(true, "NFT_PRI_More_Open_INT");', 100);
    }
    else
    {
        ft_more_div.className = "ft_more_hide";
        window.setTimeout('OCLTracking(true, "NFT_PRI_More_Shut_INT");', 100);
    }
    ft_more_link.className = (ft_more_link.className == "sel_prdgrp"? "" : "sel_prdgrp");
    if (ft_li_tabsel)
    {
        ft_li_tabsel.className = (ft_li_tabsel.className == "sel_prdgrp"? "" : "sel_prdgrp");
    }
    window.scrollBy(0,150);
}

var ft_more_div = document.getElementById("ft_more_sites");
var ft_more_link = document.getElementById("ft_moreLink");
var hd_li_sel;
if (hd_li_sel)
{
    var ft_li_tabsel = document.getElementById(hd_li_sel.replace(/hd/gi,'ft')).getElementsByTagName('a')[0];
}
if(ft_more_link)
{
    ft_more_link.onclick = function(e)
    {
        if (!more_populated)
	    {
	        morePos = 'f';
	        downloadMore();
	    }
	    else
	    {
            toggleFtrMore();
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

// footer search box script
var ft_input = document.getElementById("ft_ms_input");
var ft_search_hint = " Search the web";
if(ft_input)
{
	ft_input.onfocus = function()
	{
		if(ft_input.value == ft_search_hint)
		{
			ft_input.value = "";
		}
	}
	
	ft_input.onblur = function()
	{
		if(ft_input.value == "")
		{
			ft_input.value = ft_search_hint;
		}
	}
}

// footer search functions
function enter_ft_src(e)
{
    var keycode;
    if (window.event)
    {
        keycode = window.event.keyCode;
    }
    else if (e)
    {
        keycode = e.which;
    }
    else
    {
        return true;
    }
    if (keycode == 13) {
        submit_ft_src();
        return false;
    }
    else
    {
        return true;
    }
}            

var JS_NETNAV_TAB_GROUP;
function submit_ft_src()
{
    var strDefaultQuery;
    var strFormCode;
    var tabgroup;
    var strInput = document.getElementById('ft_ms_input').value;
    if (typeof JS_NETNAV_TAB_GROUP != "undefined")
    {
        var tabgroup = JS_NETNAV_TAB_GROUP.toLowerCase();
    }
    switch (tabgroup)
    {
        case "news" : strFormCode = "MSNNFS"; break;
        case "sports" : strFormCode = "MSNN18"; break;
        case "money" : strFormCode = "MSNN06"; break;
        case "lifestyle" : strFormCode = "MSNLFS"; break;
        case "entertainment" : strFormCode = "MSNEFS"; break;
        case "video" : strFormCode = "MSNVFS"; break;
        case "travel" : strFormCode = "MSNN02"; break;
        default : strFormCode = "MSNN07";
    }
    
    
    TrackIt(document.getElementById('ft_src_div'), 'NFT_PRI_Search_box');
    
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

    if (strInput == null || strInput == '' || strInput == ' Search the web') 
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

// omniture custom link tracking for category-specific footer links
var ft_cat_links = document.getElementById('ft_cat_als_lks').getElementsByTagName('a');
var lk_type = (ft_cat_links.length > 11)?'CAT':'NET';
for (i=0; i<ft_cat_links.length; i++)
{
    var l = ft_cat_links[i];
    var lc = l.childNodes[0];
    if (i == 15)
    {
        lk_type = "NET";
    }
    var s = "NFT_"+lk_type+"_"+lc.nodeValue.replace(/ /g, "_");
    l.onclick = TrackIt.Bind(null,l,s);
    l = null; 
}

// omniture custom link tracking for product footer links
var ft_prd_links = document.getElementById('ft_prd_lks').getElementsByTagName('a');
for (i=0; i<ft_prd_links.length-1; i++)
{
    var l = ft_prd_links[i];
    var lc = l.childNodes[0];
    if (i == 0)
    {
        var s = "NFT_PRI_Home";
    }
    else
    {
        var s = "NFT_PRI_"+lc.nodeValue.replace(/ /g, "_");
    }
    l.onclick = TrackIt.Bind(null,l,s);
    l = null; 
}

// omniture custom link tracking for about ninemsn links
var ft_abt_links = document.getElementById('ft_abt_lks').getElementsByTagName('a');
for (i=0; i<ft_abt_links.length; i++)
{
    var l = ft_abt_links[i];
    var lc = l.childNodes[0];
    var s = "NFT_PRI_"+lc.nodeValue.replace(/ /g, "_");
    l.onclick = TrackIt.Bind(null,l,s);
    l = null; 
}


// omniture custom link tracking for services footer links
var ft_srv_links = document.getElementById('ft_srv_lks').getElementsByTagName('a');
for (i=0; i<ft_srv_links.length; i++)
{
    var l = ft_srv_links[i];
    var lc = l.childNodes[(i==3)?0:1];
    if (i<3)
    {
        lc = lc.childNodes[0];
    }
    var s = "NFT_PRI_"+lc.nodeValue.replace(/ /g, "_");
    l.onclick = TrackIt.Bind(null,l,s);
    l = null; 
}

// omniture custom link tracking for other ninemsn businesses links
var ft_oth_links = document.getElementById('nw_ft_oth').getElementsByTagName('a');
for (i=0; i<ft_oth_links.length; i++)
{
    var l = ft_oth_links[i];
    var lc = l.childNodes[0];
    var s = "NFT_PRI_"+lc.nodeValue.replace(/ /g, "_");
    l.onclick = TrackIt.Bind(null,l,s);
    l = null;
}

// determine whether to show the make ninemsn your homepage banner or not
if (document.getElementById('set_promo') !== null) {
    if( typeof showPromoTop == 'function')
    {   
        showPromoTop(); // show the intercept promo
    } 
} 