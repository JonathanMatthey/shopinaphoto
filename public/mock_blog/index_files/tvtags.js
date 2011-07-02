function replaceTags(tvprogId) {
    var url = 'http://data.ninemsn.com.au/Services/Service.axd?ServiceFormat=JSON&ServiceName=Tagging&ServiceAction=TvProgramsByIdsGet&Ids=' + tvprogId + '&callback=?';
    //alert(url);
    $.getJSON(url, renderResult);
}

function renderResult(data) {
    //alert('Prog List Prog 1 name value:' + data.ProgramList.Program[1].Name.value);
    if (data.ProgramList.Program.length) {
    //more than 1 program is returned, array structure
        for (var i = 0; i < data.ProgramList.Program.length; i++) {
            var prog = data.ProgramList.Program[i];
            //try to replace the More About Tags link
            var href = jQuery('#tvtag_' + prog.Id).attr("href");
            href = href + '&showname=' + prog.Name.value;
            jQuery('#tvtag_' + prog.Id).html(prog.Name.value).attr("href", href).css('display', 'block');
            //alert(href);
            //try to replace the Bing Search Tags link

            var href = jQuery('#bingTVtag_' + prog.Id).attr("href");
            if (typeof href != 'undefined') {
                href = href.replace('q=' + prog.Id + '&', 'q=' + prog.Name.value + '&');
                var title = jQuery('#bingTVtag_' + prog.Id).attr("title");
                title = title.replace(prog.Id, prog.Name.value);
                jQuery('#bingTVtag_' + prog.Id).html(prog.Name.value).attr('href', href).attr('title', title).css('display', 'block');                
            }
        }
    } else {
    //only 1 program is returned, flat object structure
    //alert('Prog List Prog name value:' + data.ProgramList.Program.Name.value);
        var prog = data.ProgramList.Program;
        //try to replace the More About Tag link
        var href = jQuery('#tvtag_' + prog.Id).attr("href");
        href = href + '&showname=' + prog.Name.value;
        jQuery('#tvtag_' + prog.Id).html(prog.Name.value).attr('href', href).css('display', 'block');

        //try to replace the Bing search Tag link
        var href = jQuery('#bingTVtag_' + prog.Id).attr("href");
        if (typeof href != 'undefined') {
            href = href.replace('q=' + prog.Id + '&', 'q=' + prog.Name.value + '&');
            var title = jQuery('#bingTVtag_' + prog.Id).attr("title");
            title = title.replace(prog.Id, prog.Name.value);
            jQuery('#bingTVtag_' + prog.Id).html(prog.Name.value).attr('href', href).attr('title', title).css('display', 'block');
        }
    }
}