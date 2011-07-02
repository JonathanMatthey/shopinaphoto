var numUploads = 1;
var maxUploads = 4;


function VerifyTOS() {
    if(!document.getElementById("plckTermsOfPhotoService").checked) {
        alert("Please agree to the terms of service before submitting.");
        return false;
    }
    return true;
}

// use to generate more photo submission divs
function AddAnotherPhoto(parentDivID,uploadButtonID, parentFrame){
    divNode = document.createElement('div');
    divNode.id = 'PhotoUpload' + ++numUploads;
    divNode.innerHTML = "<input type='file' name='image" + numUploads + "' value='Get' size=40/><br/><br/>"

    document.getElementById(parentDivID).appendChild(divNode);
    if(numUploads > maxUploads) document.getElementById(uploadButtonID).style.display = 'none';
    setTimeout(function(){autofitIframe(parentFrame, true);}, 100);
    return false;
}


// Returns the value of the radio button that is set in a group of buttons.
function getCheckedValue(radioObj) {
	var radioLength = radioObj.length;
	if(radioLength == undefined) {
		if(radioObj.checked) {
			return radioObj.value;
		}
		else {
			return "";
		}
	}
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}

// this trim was suggested by Tobias Hinnerup
String.prototype.trim = function() {
    return(this.replace(/^\s+/,'').replace(/\s+$/,''));
}

function IsEnter(e)  {
var kc = e.which;
if(kc == null) kc = e.keyCode;
if (e && kc == 13) return true;
return false;
}
function TrimEnd(ct, c) {
    while((ct.length > 0) && (ct.lastIndexOf(c) == (ct.length - 1))){
        if(ct.length > 1 ) {
            ct = ct.substring(0, ct.length - 1);
        }else{ 
            return "";
        }
    }
    return ct;
}
function FixSearchString(str) {
    var ct = str.replace(/[\%\&\/\<\>\\\|]+/g,"");
    ct = ct.replace(/[\.]{2,}/g, ".");
        
    ct = TrimEnd(ct,".");
    if( ct == "" ) return "";
    ct = TrimEnd(ct," ");
    if( ct == "") return "";

    ct = escape(ct);
    // JavaScript's built-in escape() skips plus signs, but we need them for Lucene
    ct = ct.replace(/\+/g, "%2B");
    return ct;
}

var nextGroupID = 1;

function autofitIframe(id, heightOnly){
    if(document.getElementById) {
        if(this.document.body.scrollHeight == 0 || ( !heightOnly && this.document.body.scrollWidth == 0)) {
            //Onload fired, DOM assembled, but scrollHeight/Width is zero. This should not be... Go to
            //sleep and try again
            setTimeout(function(){autofitIframe(id, heightOnly);}, 150);
            return;
        }
        window.parent.document.getElementById(id).style.height=this.document.body.scrollHeight+"px";
        if(!heightOnly)window.parent.document.getElementById(id).style.width=this.document.body.scrollWidth+"px";
    }
}

//Determines if the string being tested is a Url.
function isUrl(s) {
	var regexp = /(ftp|https?|file):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function ValidateLogin() {
    function $(id) { return document.getElementById(id) };
    if($("plckUserName").value == '' && $("plckPassword").value == '') {
        alert("You must provide a UserName and Password");
        return false;
    }
    if($("plckUserName").value == '') {
        alert("You must provide a UserName");
        return false;
    }
    if($("plckPassword").value == '') {
        alert("You must provide a Password");
        return false;
    }
}   

function onSearchSubmit(qroupID) {
    if($(qroupID  + "_Search").value == '') {
        alert("You must provide some query text");
        return false;
    }    
}

function LimitLength(control, limitToLength) {
  var str = control.value;
  if(! str || str.length == 0) return false;
  
  var matches = str.match(/\r|\n/g);
  if(! matches) return false;
  
  var offSet = matches.length;
  if (str.length > (limitToLength + offSet)) {
    control.value = str.substring(0, limitToLength + offSet);
  }
  return false;
} 
/* this document is for visual dhtml features */
function mouseX(evt) {
    if (evt.pageX) return evt.pageX;
    else if (evt.clientX)
       return evt.clientX + (document.documentElement.scrollLeft ?
       document.documentElement.scrollLeft :
       document.body.scrollLeft);
    else return null;
}
function mouseY(evt) {
    if (evt.pageY) return evt.pageY;
    else if (evt.clientY)
       return evt.clientY + (document.documentElement.scrollTop ?
       document.documentElement.scrollTop :
       document.body.scrollTop);
    else return null;
}
function HideDiv(id){
    document.getElementById(id).style.display = "none";
}

function ShowDivAtMouse(evt, id) {
    posx = mouseX(evt) - 170;    
    posy = mouseY(evt);
    //normalize to make sure we at least appear on the screen
    if(posx < 0) posx = 10;
    if(posy < 0) posy = 10;
    
    document.getElementById(id).style.left = posx + "px";
	document.getElementById(id).style.top = posy + "px";
	document.getElementById(id).style.display = "block";
}
function ShowReportAbuse(evt, url, command) {
    var doc = document;
    doc.getElementById("ReportAbuse_Url").value = url; 
    doc.getElementById("ReportAbuse_Command").value = command;
    doc.getElementById("ReportAbuse_CommentText").value = "";
    doc.getElementById("ReportAbuse_Reason").selectedIndex = 0;
    ShowDivAtMouse(evt, "ReportAbuse_Menu");
    doc.getElementById('ReportAbuse_CommentText').focus();
}
function ReportAbuse() {
    var url = document.getElementById("ReportAbuse_Url").value; 
    var command = document.getElementById("ReportAbuse_Command").value;
    var text = document.getElementById("ReportAbuse_CommentText").value;
    var reason = document.getElementById("ReportAbuse_Reason").value;
    document.getElementById("ReportAbuse_Menu").style.display='none';
    var sendUrl = command+'&plckReason='+gSiteLife.EscapeValue(reason)+'&plckURL=' + gSiteLife.EscapeValue(url)
    if(text) sendUrl += "&plckAbuseDetail=" + gSiteLife.EscapeValue(text);
    gSiteLife.__Send(sendUrl);
}

function SiteLifeShowHide(id1, id2){
    document.getElementById(id1).style.display = "none";
    document.getElementById(id2).style.display = "block";
    return false;
}

function DebugShowInnerHTML(id, url) {
    var el = document.getElementById(id);
    var floatDiv = document.createElement("div");
      
    floatDiv.style.position = "absolute";    
    floatDiv.style.zIndex='1000';
    floatDiv.innerHTML = "<span style='background-color:red; color:white; cursor:pointer;' onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>[close]</span>";    
    floatDiv.innerHTML += "<div style='background-color:black; color:white;'>" + url + "</div><textarea rows='20' cols='80'>" + el.childNodes[0].childNodes[1].innerHTML + "</textarea>";
    el.insertBefore(floatDiv, el.childNodes[0]);
}


function ToggleState() {
    function $(id) { return document.getElementById(id) };
    var radio1 = $("plckCommentApprovalEveryOne");
    var radio2 = $("plckCommentApprovalNoBody");
    var table = $("commentSettings"); 
    if(radio1.disabled  == true) {
        radio1.disabled  = false;
        radio2.disabled  = false;
        table.className = "";
    }
    else {
        radio1.disabled  = true;
        radio2.disabled  = true;
        table.className = "BlogSettings_Disabled";
    }
}

function getElementsByClassName(classname, node)  {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for(var i=0,j=els.length; i<j; i++)
        if(re.test(els[i].className))a.push(els[i]);
    return a;
}


