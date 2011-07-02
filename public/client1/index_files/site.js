//comments javascript
function validateComment()
{
    setcookie(document.addcomment.remember.checked);

    var message = "You must correct the following errors before submitting your comment:\n\n";
    var errors = "";

    var nameVal = document.addcomment.name2.value;
    var emailVal = document.addcomment.email.value;
    var towncountryVal = document.addcomment.towncountry.value;
    var commentVal = document.addcomment.comment.value;

    var rtnVal = true;

    if (isEmpty(nameVal))
    {
        errors = errors + "name field may not be blank\n";
    }

    if (isEmpty(emailVal))
    {
        errors = errors + "email field may not be blank\n";
    } else if (emailVal.indexOf("@")==-1)
    {
        errors = errors + "you must enter a valid email address\n";
    }

    if (isEmpty(towncountryVal))
    {
        errors = errors + "town and country field may not be blank\n";
    }

    if (isEmpty(commentVal))
    {
        errors = errors + "comment field may not be blank\n";
    }

    if (errors!="")
    {
        rtnVal = false;
        alert (message+errors);
    }

    return rtnVal;
}

function isEmpty(val)
{
    if ((val==null) || (val==''))
    {
        return true;
    }

    for (var i=0;i<val.length;i++)
    {
        var c = val.charAt(i);
        if ((c!='') && (c!=' ') && (c!='\n') && (c!='\r'))
        {
            return false;
        }
    }
    return true;
}

function setreply(ID,FullName)
{
document.addcomment.commentID.value = ID;
document.getElementById('userreply').innerHTML='<strong>Replying to comment by '+FullName+'</strong> (<a href="#comment" onclick="cancelreply()">cancel</a>)';
document.getElementById('userreply').style.display='block'
document.getElementById('userreply').style.visibility = 'visible'
}
function cancelreply()
{
document.addcomment.commentID.value = '';
document.getElementById('userreply').innerHTML=''
document.getElementById('userreply').style.display='none'
document.getElementById('userreply').style.visibility = 'hidden'
}
 var myEffects = {
  fade: function(elid) {
	var opacs = ["0",".1",".2",".3",".4",".5",".6",".7",".8",".9","1"];
	if (document.getElementById(elid).style.display == 'none'){
		document.getElementById(elid).style.opacity = '0';
		document.getElementById(elid).style.display = 'block';
		for (var i = 0; i < 11; i++){
		setTimeout('document.getElementById(\''+elid+'\').style.opacity = "'+opacs[i]+'";', i * 40);
		}
	}else{
	opacs.reverse();
	for (var i = 0; i < 11; i++) {
	    setTimeout('document.getElementById(\''+elid+'\').style.opacity = "'+opacs[i]+'";', i * 40);
	}
	setTimeout('document.getElementById(\''+elid+'\').style.display = "none";', i * 40);
	}
    }
}
function showhidediv(divhide,divblock)
{
document.getElementById(divhide).style.display='none'
document.getElementById(divblock).style.display = 'block'
return false
}

var cookieName = "commentfields=";
var allcookies = document.cookie;
var loc = allcookies.indexOf(cookieName);
if (loc!=-1)
{

    var start = loc + cookieName.length;
    var end = allcookies.indexOf(";",start);
    if (end==-1)
    {
        end = allcookies.length;
    }
    var fieldVals = unescape(allcookies.substring(start, end));
    var sep = fieldVals.indexOf("&");
    var sep2 = fieldVals.indexOf("&",sep+1);
    document.addcomment.name.value = fieldVals.substring(0, sep);
    document.addcomment.email.value = fieldVals.substring(sep+1, sep2);
    document.addcomment.towncountry.value = fieldVals.substring(sep2+1, fieldVals.length);
    document.addcomment.remember.checked = true;
}


function setcookie(add)
{
    if (add)
    {
        var expyear = new Date();
        var fieldVals = escape(document.addcomment.name.value +
                        "&" + document.addcomment.email.value +
                        "&" + document.addcomment.towncountry.value);
        expyear.setFullYear(expyear.getFullYear()+10);
        document.cookie = cookieName+fieldVals+
                "; path=/"+
                "; expires="+expyear.toGMTString();
    } else
    {
        document.cookie = cookieName+
                          "; path=/"+
                          "; expires=Fri, 02-Jan-1970 00:00:00 GMT";
    }
}

function disableForm(theform) {
	if (document.all || document.getElementById) {
		for (i = 0; i < theform.length; i++) {
			var tempobj = theform.elements[i];
			if (tempobj.type.toLowerCase() == "submit" 
			|| tempobj.type.toLowerCase() == "reset")
			tempobj.disabled = true;
		}
	}
}

function addcomment(){
alert('here');
//document.myform.submit();
     var url = '/comments/confirmtest/yes';
     var pars = '';
     var target = '';
     var myAjax = new Ajax.Updater(target, url, {method: 'post', parameters: pars});
}

//end comments
