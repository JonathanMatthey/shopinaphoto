function tabbing_skin_159338(super_cat_ids, super_titles, onclickcode)
{
    return tabbing_skin_Common(super_cat_ids, super_titles, onclickcode)
}


function tabbing_skin_Common(super_cat_ids, super_titles, onclickcode)
{
                var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] +'>';
	if(super_cat_ids)
	{
		for(var i=0; i<super_cat_ids.length; i++)
		{
			c = c + "<div class=tab-wrap><div class=tab-left></div><a " + (i==0? "class='first tab-selected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\"><div class=tab-link>" +
							super_titles[i].substring(0,1).toUpperCase() + super_titles[i].substring(1,super_titles[i].length)  + "</div></a><div class=tab-right></div></div>";
		}
	}
	c = c + '</span>';
	return c; 


}

function tabbing_skin_Common_Small(super_cat_ids, super_titles, onclickcode)
{
    var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] +'>';
	if(super_cat_ids)
	{
		for(var i=0; i<super_cat_ids.length; i++)
		{
			c = c + "<div class=tab-wrap-small>" +  "<div class=tab-left>"  + "&nbsp;" + "</div>" + "<span class=tab-link>" + "<a " + (i==0? "class='first tab-selected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\">" + "<img src='/img/global/empty.gif' id='img_" + super_cat_ids[i] + "'>" +
							super_titles[i].substring(0,1).toUpperCase() + super_titles[i].substring(1,super_titles[i].length)  +"</a>" + "</span>" + "<span class=tab-right>" + "&nbsp;" + "</span>" + "</div>";
		}
	}
	c = c + '</span>';
	return c; 


}

function tabbing_skin_ImgIcon(super_cat_ids, super_titles, onclickcode)
{
                var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] +'>';
	if(super_cat_ids)
	{
		for(var i=0; i<super_cat_ids.length; i++)
		{
			c = c + "<div class=tab-wrap>" +  "<div class=tab-left>"  + "&nbsp;" + "</div>" +  "<span class=tab-link>" + "<a " + (i==0? "class='first tab-selected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\">" + "<img src='/img/global/empty.gif' id='img_" + super_cat_ids[i] + "' />" + 
							super_titles[i].substring(0,1).toUpperCase() + super_titles[i].substring(1,super_titles[i].length)  +"</a>" + "</span>" + "<span class=tab-right>" + "&nbsp;" + "</span>" + "</div>";
		}
	}
	c = c + '</span>';
	return c; 


}

function tabbing_skin_NonTab(super_cat_ids, super_titles, onclickcode)
{
    var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] +'>';
	if(super_cat_ids)
	{
		for(var i=0; i<super_cat_ids.length; i++)
		{
			c = c + "<a " + (i==0? "class='first tab-selected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\">" +
							super_titles[i].substring(0,1).toUpperCase() + super_titles[i].substring(1,super_titles[i].length)  +"</a>";
		}
	}
	c = c + '</span>';
	return c; 


}


function tabbing_skin_LargeImgOnly(super_cat_ids, super_titles, onclickcode)
{
    var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] +'>';
    
	if(super_cat_ids)
	{
		for(var i=0; i<super_cat_ids.length; i++)
		{
		    var imgfile = '<img src=/img/global/"' + super_titles[i].replace(' ' , '').toLowerCase() + '.gif" />'
			c = c + "<a " + (i==0? "class='first tab-selected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\">" + "<img src='/img/global/emptylarge.gif' id='img_" + super_cat_ids[i] + "' />" +  "</a>";



		}
	}
	c = c + '</span>';
	return c; 


}





