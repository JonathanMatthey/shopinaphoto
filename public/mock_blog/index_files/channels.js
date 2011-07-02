// new code should use embed.js; old code should be rewritten to use embed.js
Msn = window.Msn || {};
Msn.Video = window.Msn.Video = {};

// inject embed.js onto the page
if(document.createElement && document.getElementsByTagName)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('src',"http://img.widgets.video.s-msn.com/js/embed.js");
    head.appendChild(script);
}
else
{
    document.write('<script type="text/javascript" src= "http://img.widgets.video.s-msn.com/js/embed.js"></' + 'script>');
}

// deprecated functions, implemented in terms of embed.js for backwards compatibility

Msn.Video.Build = function (id, dl, fv, w, h)
{
    // this ensures all div's are built before the main functionality of BuildPlayer runs --
    // which also means that any downlevel experience may be briefly visible;
    // to remove this behavior, recode in terms of embed.js rather than using these methods.
    var param =
    {
        divId: id,
        src: "playerad",
        w: w,
        h: h,
        flashvars: fv,
        downlevel: dl
    };

    Msn.Video.exec(Msn.Video.BuildPlayer2, param);
}

Msn.Video.BuildPlayer = function (id, fv, w, h)
{
    // this ensures all div's are built before the main functionality of BuildPlayer runs --
    // which also means that any downlevel experience may be briefly visible;
    // to remove this behavior, recode in terms of embed.js rather than using these methods.

    fv.adDivs = (("undefined" != typeof (fv.adDivs)) ? (fv.adDivs + ";") : "") + id + "_a,300,60";

    var param =
    {
        divId: id,
        src: "player",
        w: w,
        h: h,
        flashvars: fv
    };

    Msn.Video.exec(Msn.Video.BuildPlayer2, param);
}

Msn.Video.BuildPlayer2 = function (param)
{
    var id = param.divId;
    var flashvars = param.flashvars;

    var fvv = {
        ifs: "true",
        playlistmin: "2",
        mode: "inline",
        ch: "true",
        cbprefix: "Msn.Video.",
        cbdata: param.divId
    };

    for (i in flashvars)
    {
        fvv[i] = flashvars[i];
    }

    // verify we have the divs we need
    var container = document.getElementById(id);
    var contentDiv = document.getElementById(id + "_p");

    if (!checkDefined(container)) // we don't have a div with the passed in id
    {
        if (checkDefined(contentDiv)) // but we do have a div with id+"_p"
        {
            param.divId = id + "_p";
            contentDiv.setAttribute("id", id + "_content"); // reset the id on this content div

            var oldContent = contentDiv.innerHTML || "";
            contentDiv.innerHTML = '<div id="' + param.divId + '"></div>' + oldContent; // nest a new player div with id+"_p" div inside the content div
        }
    }

    param.flashvars = fvv;

    Msn.Video.createWidget2(param);
}

// deferred execution until embed.js is loaded and parsed.
Msn.Video._extQueue = [];

Msn.Video.exec = function(func,arg)
{
    if(Msn.Video._loaded)
    {
        try
        {
            func(arg);
        }
        catch(e) { }
    }
    else
    {
        Msn.Video._extQueue.push({ func: func, arg: arg });
        setTimeout(Msn.Video.execQueuedCommands,100);
    }
}

Msn.Video.execQueuedCommands = function()
{
    if(Msn.Video._extQueue.length > 0)
    {
        var queue = [];
        queue.push.apply(queue,Msn.Video._extQueue);
        Msn.Video._extQueue.splice(0,Msn.Video._extQueue.length);

        for(var i = 0;i < queue.length;i++)
        {
            Msn.Video.exec(queue[i].func,queue[i].arg);
        }
    }
}