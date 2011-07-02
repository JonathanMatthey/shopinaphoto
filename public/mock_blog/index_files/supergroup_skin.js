function tabbing_skin_174065(super_cat_ids, super_titles, onclickcode) {
    return tabbing_skin_Common_Small(super_cat_ids, super_titles, onclickcode)
}

function tabbing_skin_Common_Small(super_cat_ids, super_titles, onclickcode) {
    var c = '<span id=slider_items_' + super_cat_ids[0] + ' class=slider_items_' + super_cat_ids[0] + '>';
    if (super_cat_ids) {
        for (var i = 0; i < super_cat_ids.length; i++) {
            c = c + "<div class=tab-wrap-small>" + "<div class=tab-left>" + "&nbsp;" + "</div>" + "<span class=tab-link>" + "<a " + (i == 0 ? "class='first tab-selected' " : "") + (i == 1 ? "class='tab-unselected' " : "") + "href=javascript:void(0); id=link_" + i + "_" + super_cat_ids[i] +
							" onclick=\"" + onclickcode + ";\">" + (i == 2 ? "<img src='/img/rhs_three_tab/tab_twitter.gif' id='img_"+ super_cat_ids[i] + "'" : "") +
							(i == 2 ? '' : super_titles[i].substring(0, 1).toUpperCase() + super_titles[i].substring(1, super_titles[i].length)) + "</a>" + "</span>" + "<span class=tab-right>" + "&nbsp;" + "</span>" + "</div>";
        }
    }
    c = c + '</span>';
    return c;


}






