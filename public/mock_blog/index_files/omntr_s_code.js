var o_account,s_site,s_section,s_subSection,s_subSection1,s_subSection2,s_subSection3,s_pageName,s_qpRSS,s_physurl;
var JS_SITE,JS_SECTION,JS_SUB_SECTION,JS_SUB_SECTION_1,JS_SUB_SECTION_2,JS_SUB_SECTION_3,JS_PAGE_RMURL,JS_OMNI_T1,JS_PAGE_COBRAND,JS_OMNI_TOOLS,JS_OMNI_INDEX;
var JS_BLOGID,JS_BLOGTITLE,JS_BLOGENTRYID,JS_BLOGENTRYTITLE,JS_PANOPTICQUERY,JS_PANOPTICTOTALMATCH,JS_MEMBERSHIP_IS_AUTHENTICATED,JS_MEMBERSHIP_NINEMSN_MEMBER;
var JS_OMNTR_SUITEID,JS_OMNTR_COMPANY,JS_OMNTR_CATEGORY,JS_OMNTR_SITE,JS_OMNTR_SECTION,JS_OMNTR_SUBSECTION,JS_OMNTR_PAGE,JS_OMNTR_ERRORPAGE;
var JS_OMNTR_PAGETYPEID,JS_OMNTR_PAGETYPENAME,JS_OMNTR_PAGETYPEIDENTIFIER,JS_OMNTR_PAGETYPEIDENTIFIER2,JS_OMNTR_LINKINTERNALFILTERS,JS_OMNTR_ENABLECLICKMAP;
var JS_OMNTR_EVARS,JS_OMNTR_EVENTS,JS_OMNTR_LINKTRACK_HLID,JS_OMNTR_FLASHVERS;
var JS_FLIGHT_VARIANT,JS_AssetId,JS_AssetDisplayTypeId;

/* Legacy functions from old libs -- start */
function OCLTracking(obj, CustomLinkName)
{
	SBKCustomLinkTracking(obj,CustomLinkName);
}
function flashTracking(strSite, strSection, strSubSection, strPage)
{
	OMNTRPageTracking(null,null,strSite,strSection,strSubSection,strPage);
}
/* Legacy functions from old libs -- end */
function fixVar(str,max)
{
	if(str!=null&&str!='')
	{
		str=str.replace(/>/g,'&gt;'); //no HTML tag
		str=str.replace(/</g,'&lt;'); //no HTML tag
		str=str.replace(/[\t\r\n]/g,''); //no tab, carriage return or newline
		str=str.replace(/[^\x00-\x7F]/g,''); //no ASCII code above 127
		str=str.toLowerCase(); //all lower case
		while(str.lastIndexOf('\\')==str.length-1&&(str.length>0))
		{
			str=str.slice(0,str.length-1);
		}
		// fix length
		if(max!=null&&max!=0)
		{
			if(str.length>max)
			{
				str=str.substring(0,max);
			}
		}
	}
	return str;
}
/* Omniture Custom Link Tracking */
function CustomLinkTracking(obj,cl_name,cl_info)
{
    if(JS_OMNTR_SUITEID!=null&&JS_OMNTR_SUITEID!='')
	{
		var s=s_gi(JS_OMNTR_SUITEID);
		s.linkTrackVars='prop8,events';
		s.events='event2';
		s.linkTrackEvents='event2';
		s.prop8=fixVar(cl_info,100);
		var clickMapOn=false;
		if(s.trackInlineStats)
		{
			clickMapOn=true;
			s.trackInlineStats=false;
		}
		s.tl(obj,'o',cl_name);
		if(clickMapOn)
		{
			s.trackInlineStats=true;
		}
        s.linkTrackVars='None';
        s.linkTrackEvents='None';
	}
}
function SBKCustomLinkFTrack(PageName){}
function SBKCustomLinkTracking(obj,CustomLinkName)
{
	var str='unknown';
	var cl_site=getSite();
	if(cl_site!=null&&cl_site!='')
	{
		str='i:'+cl_site;
		var cl_section=getSection();
		if(cl_section!=null&&cl_section!='')
		{
			str=str+'|e:'+cl_section;
			var cl_subSection=getSubSection();
			if(cl_subSection!=null&&cl_subSection!='')
			{
				str=str+'|u:'+cl_subSection;
			}
		}
	}
	CustomLinkTracking(obj,CustomLinkName,CustomLinkName+'|'+str);
}
function OMNTRLinkTracking(obj,cl_name,cl_info,arrEvar,arrEvt,account,arrProp,product)
{
	if(cl_name!=null&&cl_name!='')
	{
		var clinfo='unknown';
		var rsuite='msnportalaumisc';
		if(cl_info!=null&&cl_info!='')
		{
			clinfo=cl_info;
		}		
		if(JS_OMNTR_SUITEID!=null&&JS_OMNTR_SUITEID!='')
		{
			rsuite=JS_OMNTR_SUITEID.toLowerCase();
		}
		var strPropA='';
		var strPropB='';	
		var strEvarA='';
		var strEvarB='';
		var strProductA='';
		var strProductB='';
		var strEvt='event2';
		var s=s_gi(rsuite);
		s.visitorNamespace='msnportal';
		s.cookieDomainPeriods=((window.location.hostname.indexOf('.com.au')>-1||window.location.hostname.indexOf('.co.nz')>-1)?'3':'2');
		if(account!=null&&account!='')
		{
			s.sa(account);
		}
		var str="s.linkTrackVars='prop8";
		if(arrProp!=null&&arrProp!='')
		{
			for(var i=1;i<arrProp.length;i++)
			{
				if(arrProp[i]!=null&&arrProp[i]!='')
				{
					strPropA=strPropA+",prop"+(i);
					strPropB=strPropB+"s.prop"+(i)+"='"+((cl_name=='link_track_click')?arrProp[i]:fixVar(arrProp[i],100).replace( /'/g, "\\'" ))+"';";
				}
			}
		}
		if(arrEvar!=null&&arrEvar!='')
		{
			for(var i=1;i<arrEvar.length;i++)
			{
				if(arrEvar[i]!=null&&arrEvar[i]!='')
				{
					strEvarA=strEvarA+",eVar"+(i);
					strEvarB=strEvarB+"s.eVar"+(i)+"='"+((cl_name=='link_track_click')?arrEvar[i]:fixVar(arrEvar[i],100).replace( /'/g, "\\'" ))+"';";
				}
			}
		}
		if(product!=null&&product!='')
		{			
			strProductA=",products";
			strProductB="s.products='"+product+"';";
		}
		str=str+strPropA+strEvarA+strProductA;
		if(arrEvt!=null&&arrEvt!='')
		{
			for(var i=3;i<arrEvt.length;i++)
			{
				if(arrEvt[i])
				{
					strEvt=strEvt+",event"+(i);
				}
			}
		}
		str=str+",events';";
		str=str+"s.linkTrackEvents='"+strEvt+"';";
		str=str+"s.events='"+strEvt+"';";
		str=str+strPropB;
		str=str+strEvarB;
		str=str+strProductB;
		eval(str);
		s.prop8=fixVar(clinfo,100);
		var clickMapOn=false;
		if(s.trackInlineStats)
		{
			clickMapOn=true;
			s.trackInlineStats=false;
		}
		s.tl(obj,'o',cl_name);
		if(clickMapOn)
		{
			s.trackInlineStats=true;
		}
        s.linkTrackVars='None';
        s.linkTrackEvents='None';
	}
}
function FlashPageTracking(flaCompany,flaCategory,flaSite,flaSection,flaSubSection,flaPage)
{
	var s=s_gi(o_account);
	s.prop8=''; // flushing custom link info
	if(flaCategory==null||flaCategory=='')
	{
		flaCategory=getCategory();
	}
	s.prop4=fixVar(flaCategory.replace(/[:|]/g,''),100);
	if(flaCompany==null||flaCompany=='')
	{
		flaCompany=getCompany();
	}
	s.prop5=fixVar(flaCompany.replace(/[:|]/g,''),100);
	if(flaSite==null||flaSite=='')
	{
		flaSite=getSite();
	}
	s.channel=fixVar(s.prop4+':'+flaSite.replace(/[:|]/g,''),100);
	if(flaSection==null&&flaSection=='')
	{
		flaSection=getSection();
	}
	if(flaSection!=null&&flaSection!='')
	{
		s.prop1=fixVar(s.channel+':'+flaSection.replace(/[:|]/g,''),100);
		if(flaSubSection==null&&flaSubSection=='')
		{
			flaSubSection=getSubSection();
		}
		if(flaSubSection!=null&&flaSubSection!='')
		{
			s.prop3=fixVar(s.prop1+':'+flaSubSection.replace(/[:|]/g,''),100);
		}
	}
	if(flaPage==null||flaPage=='')
	{
		flaPage=getPageName();
	}
	if(flaSubSection!=null&&flaSubSection!='')
	{
		s.pageName=fixVar(s.prop3+':'+flaPage,100);
	}else if(flaSection!=null&&flaSection!='')
	{
		s.pageName=fixVar(s.prop1+':'+flaPage,100);
	}else
	{
		s.pageName=fixVar(s.channel+':'+flaPage,100);
	}
	if(flaSubSection!=null&&flaSubSection!='')
	{
		s.hier1=fixVar(s.prop4+'|'+flaSite+'|'+flaSection+'|'+flaSubSection,255);
	}else if(flaSection!=null&&flaSection!='')
	{
		s.hier1=fixVar(s.prop4+'|'+flaSite+'|'+flaSection,255);
	}else
	{
		s.hier1=fixVar(s.prop4+'|'+flaSite,255);
	}
	s.eVar2=((s.channel!=null&&s.channel!='')?s.channel:'');
	s.eVar3=((s.prop1!=null&&s.prop1!='')?s.prop1:'');
	s.eVar4=((s.prop3!=null&&s.prop3!='')?s.prop3:'');
	void(s.t());
}
function OMNTRCustomGlanceArticleTracking(flaCompany,flaCategory,flaSite,flaSection,flaSubSection,flaPage,articleId,articleTitle,blnTrackMostPopular,contentTypePrefix,contentType)
{
    var rsuite='msnportalaumisc';
	if(JS_OMNTR_SUITEID!=null&&JS_OMNTR_SUITEID!='')
	{		
		rsuite=JS_OMNTR_SUITEID.toLowerCase();
	}
	var s=s_gi(rsuite);
	var sContentType='article';
	var sPrefix='art';
	s.visitorNamespace='msnportal';
    s.cookieDomainPeriods=((window.location.hostname.indexOf('.com.au')>-1||window.location.hostname.indexOf('.co.nz')>-1)?'3':'2');
	if(contentTypePrefix!=null&&contentTypePrefix!='')
	{
		sContentType=fixVar(contentType.replace(/[:|]/g,''),100);
		sPrefix=fixVar(contentTypePrefix.replace(/[:|]/g,''),100);
	}
    if(blnTrackMostPopular==true)
    {
        var str=sPrefix+'~~'+articleId;
        str=str+((flaSite!=null&&flaSite!='')?'~~'+flaSite:'~~any');
	    str=str+((flaSection!=null&&flaSection!='')?'~~'+flaSection:'~~any');
	    str=str+((flaSubSection!=null&&flaSubSection!='')?'~~'+flaSubSection:'~~any');
	    s.prop9=fixVar(str,100);
    }else
    {
        s.prop9='';
    }
	s.prop21=sContentType;
	s.prop22=fixVar((articleId+'-'+articleTitle).replace(/[:|]/g,''),100);
	s.hier2=flaCategory+':'+flaSite+'|'+s.prop21+'|'+s.prop22;
	OMNTRPageTracking(flaCompany,flaCategory,flaSite,flaSection,flaSubSection,flaPage,null,null,null)
}
function OMNTRPageTracking(flaCompany,flaCategory,flaSite,flaSection,flaSubSection,flaPage,arrEvar,arrEvt,account)
{
	var rsuite='msnportalaumisc';
	var strEvt='';
	var str='';
	if(JS_OMNTR_SUITEID!=null&&JS_OMNTR_SUITEID!='')
	{		
		rsuite=JS_OMNTR_SUITEID.toLowerCase();
	}
	var s=s_gi(rsuite);
	s.visitorNamespace='msnportal';
    s.cookieDomainPeriods=((window.location.hostname.indexOf('.com.au')>-1||window.location.hostname.indexOf('.co.nz')>-1)?'3':'2');
	if(account!=null&&account!='')
	{
		s.sa(account);
	}
	s.prop8='';
	if(flaCategory==null||flaCategory=='')
	{
		flaCategory=getCategory();
	}
	s.prop4=fixVar(flaCategory.replace(/[:|]/g,''),100);
	if(flaCompany==null||flaCompany=='')
	{
		flaCompany=getCompany();
	}
	s.prop5=fixVar(flaCompany.replace(/[:|]/g,''),100);
	if(flaSite==null||flaSite=='')
	{
		flaSite=getSite();
	}
	s.channel=fixVar(s.prop4+':'+flaSite.replace(/[:|]/g,''),100);
	if(flaSection==null||flaSection==''||!flaSection)
	{
		s.prop1='';
		flaSubSection='';
		s.prop3='';
	}
	else if(flaSection!=null&&flaSection!='')
	{
		s.prop1=fixVar(s.channel+':'+flaSection.replace(/[:|]/g,''),100);
		if(flaSubSection==null||flaSubSection==''||!flaSubSection)
		{
			s.prop3='';
		}
		else if(flaSubSection!=null&&flaSubSection!='')
		{
			s.prop3=fixVar(s.prop1+':'+flaSubSection.replace(/[:|]/g,''),100);
		}
	}
	if(flaPage==null||flaPage=='')
	{
		flaPage=getPageName();
	}
	if(flaSubSection!=null&&flaSubSection!='')
	{
		s.pageName=fixVar(s.prop3+':'+flaPage,100);
		s.hier1=fixVar(s.prop4+'|'+flaSite+'|'+flaSection+'|'+flaSubSection,255);
	}else if(flaSection!=null&&flaSection!='')
	{
		s.pageName=fixVar(s.prop1+':'+flaPage,100);
		s.hier1=fixVar(s.prop4+'|'+flaSite+'|'+flaSection,255);
	}else
	{
		s.pageName=fixVar(s.channel+':'+flaPage,100);
		s.hier1=fixVar(s.prop4+'|'+flaSite,255);
	}
	s.eVar2=((s.channel!=null&&s.channel!='')?s.channel:'');
	s.eVar3=((s.prop1!=null&&s.prop1!='')?s.prop1:'');
	s.eVar4=((s.prop3!=null&&s.prop3!='')?s.prop3:'');
	if(arrEvar!=null&&arrEvar!='')
	{
		for(var i=5;i<arrEvar.length;i++)
		{
			if(arrEvar[i]!=null)
			{
				str=str+"s.eVar"+(i)+"='"+fixVar(arrEvar[i],100).replace( /'/g, "\\'" )+"';";
			}
		}
	}
	if(arrEvt!=null&&arrEvt!='')
	{
		for(var i=3;i<arrEvt.length;i++)
		{
			if(arrEvt[i])
			{
				strEvt=strEvt+",event"+(i);
			}
		}
	}
	str=str+"s.events='event1"+strEvt.substring(0,strEvt.length)+"';";
	eval(str);
	void(s.t());
}
function getCompany()
{
	var com='ninemsn';
	if(JS_OMNTR_COMPANY!=null&&JS_OMNTR_COMPANY!='')
	{
		com=JS_OMNTR_COMPANY.replace(/[:|]/g,'');
	}
	return com;
}
function getCategory()
{
	var cat='unknown';
	if(JS_OMNTR_CATEGORY!=null&&JS_OMNTR_CATEGORY!='')
	{
		cat=JS_OMNTR_CATEGORY.replace(/[:|]/g,'');
	}
	return cat;
}
function getSite()
{
	var site='unknown';
	if(JS_OMNTR_SITE!=null&&JS_OMNTR_SITE!='')
	{
		site=JS_OMNTR_SITE.replace(/[:|]/g,'');
	}else if(JS_SITE!=null&&JS_SITE!='')
	{
		site=JS_SITE.replace(/[:|]/g,'');
	}
	return site;
}
function getSection()
{
	var sect;
	if(JS_OMNTR_SECTION!=null&&JS_OMNTR_SECTION!='')
	{
		sect=JS_OMNTR_SECTION.replace(/[:|]/g,'');
	}else if(JS_SECTION!=null&&JS_SECTION!='')
	{
		sect=JS_SECTION.replace(/[:|]/g,'');
	}
	return sect;
}
function getSubSection()
{
	var ssect;
	if(JS_OMNTR_SUBSECTION!=null&&JS_OMNTR_SUBSECTION!='')
	{
		ssect=JS_OMNTR_SUBSECTION.replace(/[:|]/g,'');
	}else if(JS_SUB_SECTION!=null&&JS_SUB_SECTION!='')
	{
		ssect=JS_SUB_SECTION.replace(/[:|]/g,'');
	}
	return ssect;
}
function getPageName()
{
	var page='default';	
	if(JS_OMNTR_PAGE!=null&&JS_OMNTR_PAGE!='')
	{
		page=JS_OMNTR_PAGE;
	}else
	{
	    var file='';
        if(typeof(s_physurl)!='undefined')
	    {	    
            var arrUrl=s_physurl.split('?');
            if(arrUrl[0].lastIndexOf('.')>arrUrl[0].lastIndexOf('/'))
            {
                file=arrUrl[0].substring(arrUrl[0].lastIndexOf('/')+1,arrUrl[0].lastIndexOf('.'));
            }
	    }
	    if(file==''&&location.pathname.lastIndexOf('.')>location.pathname.lastIndexOf('/'))
        {
		    file=location.pathname.substring(location.pathname.lastIndexOf('/')+1,location.pathname.lastIndexOf('.'));
        }
	    if(file!=null&&file!='')
	    {
	        if(file.indexOf(';')!=-1)
	        {
		        page=file.substring(0,file.indexOf(';'));
	        }
	        else
	        {
	            page=file;    
	        }		    
	    }
    }
	if(JS_PAGE_RMURL!=null&&JS_PAGE_RMURL.toLowerCase().indexOf('mediapopup.aspx')!=-1)
	{
		page=page+'-'+JS_PAGE_RMURL.substring(28);
	}else if(JS_OMNTR_PAGETYPEID=='2002') // Page Type 2002 = article
	{
		page=page+'-'+document.title;
	}
	if(JS_OMNI_T1!=null&&JS_OMNI_T1!='')
	{
		page=page+'('+JS_OMNI_T1+')';
	}
	return page.replace(/[:|]/g,'');
}
function getFlashVersion()
{    //ie
    try
    {
        try
        {
            var axo=new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
            try
            {
                axo.AllowScriptAccess = 'always';
            }
            catch(e)
            {
                return('6.0.0');
            }
        }
        catch(e){}
        return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g,'.').match(/^.?(.+),?$/)[1];
    }
    // other browsers
    catch(e)
    {
        try
        {
            if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)
            {
                return (navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,".").match(/^.?(.+),?$/)[1];
            }
        }
        catch(e){}
    }
    return('0.0.0');
}
function OMNTRUGCTracking(obj,assettype,assetsubtype,assettitle,assetval,assetanswer)
{	
	var sscategory,ssite,ssec,ssubsec,stype,ssubtype,stitle,sproduct;
	var arrEvar=new Array(51);
	var arrEvent=new Array(21);
	try
	{
		sscategory=fixVar(getCategory(),100);
		ssite=getSite();
		if(ssite!=null&&ssite!='')
		{
			arrEvar[2]=fixVar(sscategory+':'+ssite,100);
		}
		ssec=getSection();
		if(ssec!=null&&ssec!='')
		{
			arrEvar[3]=fixVar(arrEvar[2]+':'+ssec,100);
			ssubsec=getSubSection();
			if(ssubsec!=null&&ssubsec!='')
			{
				arrEvar[4]=fixVar(arrEvar[3]+':'+ssubsec,100);
			}
		}
		stype=((assettype!=null&&assettype!='')?fixVar(assettype,100):'unknown');
		ssubtype=((assetsubtype!=null&&assetsubtype!='')?fixVar(assetsubtype,100):'unknown');
		stitle=((assettitle!=null&&assettitle!='')?fixVar(assettitle,100):'unknown');
		arrEvar[42]=stype;
		arrEvar[43]=ssubtype;
		arrEvar[44]=stitle;
		if(assetval!=null&&assetval!='')
		{			
			arrEvent[12]=true;
			arrEvent[13]=true;
			sproduct=';'+stitle+';;;event13='+assetval+';';
			OMNTRLinkTracking(obj,stype,stype+'-'+stitle,arrEvar,arrEvent,null,null,sproduct);
		}
		else
		{
			if(assetanswer!=null&&assetanswer!='')
			{				
				arrEvar[45]=fixVar(assetanswer,100);
				arrEvent[14]=true;
			}
			else
			{
				arrEvent[15]=true;
			}
			OMNTRLinkTracking(obj,stype,stype+'-'+stitle,arrEvar,arrEvent);
		}
	}
	catch(e){}	
}

/* Omniture S */
o_account='msnportalaumisc';
if(JS_OMNTR_SUITEID!=null&&JS_OMNTR_SUITEID!='')
{
	o_account=JS_OMNTR_SUITEID.toLowerCase();
}
var s=s_gi(o_account);
/*
 * Plugin: getQueryParam 2.1 - return query string parameter(s)
 */
s.getQueryParam=new Function("p","d","u",""
+"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t)v+=v?d+t:t;p=p.subs"
+"tring(i==p.length?i:i+1)}return v");
s.p_gpv=new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v");
s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return ''");
/*
 * Plugin: getValOnce 0.2 - get a value once per session or number of days
 */
s.getValOnce=new Function("v","c","e",""
+"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");
/*
 * Plugin: getTimeParting 2.0 - Set timeparting values based on time zone
 */
s.getTimeParting=new Function("t","z",""
+"var s=this,cy;dc=new Date('1/1/2000');"
+"if(dc.getDay()!=6||dc.getMonth()!=0){return'Data Not Available'}"
+"else{;z=parseFloat(z);var dsts=new Date(s.dstStart);"
+"var dste=new Date(s.dstEnd);fl=dste;cd=new Date();if(cd>dsts&&cd<fl)"
+"{z=z+1}else{z=z};utc=cd.getTime()+(cd.getTimezoneOffset()*60000);"
+"tz=new Date(utc + (3600000*z));thisy=tz.getFullYear();"
+"var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday',"
+"'Saturday'];if(thisy!=s.currentYear){return'Data Not Available'}else{;"
+"thish=tz.getHours();thismin=tz.getMinutes();thisd=tz.getDay();"
+"var dow=days[thisd];var ap='AM';var dt='Weekday';var mint='00';"
+"if(thismin>30){mint='30'}if(thish>=12){ap='PM';thish=thish-12};"
+"if (thish==0){thish=12};if(thisd==6||thisd==0){dt='Weekend'};"
+"var timestring=thish+':'+mint+ap;if(t=='h'){return timestring}"
+"if(t=='d'){return dow};if(t=='w'){return dt}}};"
);
s.getANID=new Function("var prefcookie=s.c_r('prefcookie');if(prefcookie!=null&&prefcookie!=''){s.prop23=true;}else{s.prop23=false;}");
s.getANID();
s.usePlugins=true;
function s_doPlugins(s) {
    if(s!=null){
    	s.plugins="";
    }
}
s.doPlugins=s_doPlugins;
s.visitorNamespace='msnportal';
s.server=location.hostname;
s.currencyCode=((location.hostname.indexOf('.co.nz')>-1)?'NZD':'AUD');
s.trackDownloadLinks=true;
s.trackExternalLinks=true;
s.trackInlineStats=((JS_OMNTR_ENABLECLICKMAP=='true')?true:false);
s.linkDownloadFileTypes='exe,zip,wav,mp3,mov,mpg,avi,wmv,doc,pdf,xls';
s.linkLeaveQueryString=false;
s.linkTrackVars='None';
s.linkTrackEvents='None';
if(JS_OMNTR_LINKINTERNALFILTERS!=null&&JS_OMNTR_LINKINTERNALFILTERS!='')
{
	s.linkInternalFilters='javascript:,'+JS_OMNTR_LINKINTERNALFILTERS;
}else
{
	s.linkInternalFilters='javascript:';
}
var oDate=new Date();
s.dstStart='10/03/2010';
s.dstEnd='04/03/2011';
s.currentYear=oDate.getFullYear();
s.prop26=s.getTimeParting('h','+10');
s.cookieDomainPeriods=((window.location.hostname.indexOf('.com.au')>-1||window.location.hostname.indexOf('.co.nz')>-1)?'3':'2');
s.prop2=((location.hostname.indexOf('.co.nz')>-1)?'en-nz':'en-au');
s.prop5=fixVar(getCompany(),100);
s.prop4=fixVar(getCategory(),100);
if (JS_FLIGHT_VARIANT!=null&&JS_FLIGHT_VARIANT!='')
{
    s.prop31=JS_FLIGHT_VARIANT;
}
if(typeof(JS_PHYSICAL_PAGE_URL)!='undefined')
{
    s_physurl = unescape(JS_PHYSICAL_PAGE_URL);
}

s_site=getSite();

if(s_site!=null&&s_site!='')
{
	s.channel=fixVar(s.prop4+':'+s_site,100);
}
s_section=getSection();
if(s_section!=null&&s_section!='')
{
	s.prop1=fixVar(s.channel+':'+s_section,100);
	s_subSection=getSubSection();
	if(s_subSection!=null&&s_subSection!='')
	{
		s.prop3=fixVar(s.prop1+':'+s_subSection,100);
		s_subSection1=JS_SUB_SECTION_1;
		if(s_subSection1!=null&&s_subSection1!='')
		{
			s_subSection1=s_subSection1.replace(/[:|]/g,'');
			s.prop17=fixVar(s.prop3+':'+s_subSection1,100);
			s_subSection2=JS_SUB_SECTION_2;
			if(s_subSection2!=null&&s_subSection2!='')
			{
				s_subSection2=s_subSection2.replace(/[:|]/g,'');
				s.prop18=fixVar(s.prop17+':'+s_subSection2,100);
				s_subSection3=JS_SUB_SECTION_3;
				if(s_subSection3!=null&&s_subSection3!='')
				{
					s_subSection3=s_subSection3.replace(/[:|]/g,'');
					s.prop19=fixVar(s.prop18+':'+s_subSection3,100);
				}
			}
		}		
	}
}
// pageName set to blank on errorPage
if(JS_OMNTR_ERRORPAGE=='true')
{
	s_pageName='';
	s.pageType='errorPage';
}else
{
	s_pageName=getPageName();
}
if(s_pageName!=null&&s_pageName!='')
{
	if(s_subSection3!=null&&s_subSection3!='')
	{
		s.pageName=fixVar(s.prop19+':'+s_pageName,100);
	}else if(s_subSection2!=null&&s_subSection2!='')
	{
		s.pageName=fixVar(s.prop18+':'+s_pageName,100);
	}else if(s_subSection1!=null&&s_subSection1!='')
	{
		s.pageName=fixVar(s.prop17+':'+s_pageName,100);
	}else if(s_subSection!=null&&s_subSection!='')
	{
		s.pageName=fixVar(s.prop3+':'+s_pageName,100);
	}else if(s_section!=null&&s_section!='')
	{
		s.pageName=fixVar(s.prop1+':'+s_pageName,100);
	}else
	{
		s.pageName=fixVar(s.channel+':'+s_pageName,100);
	}
}
if(JS_PAGE_COBRAND!=null&&JS_PAGE_COBRAND!='')
{
	s.prop6=fixVar(JS_PAGE_COBRAND,100);
}
s.prop7=fixVar(unescape(location.href.match('[^?;#]*')),100);
if(typeof(s_physurl)!='undefined')
{
    s_qpRSS=s.getQueryParam('rss','&',s_physurl);    
    if(s_qpRSS==null||s_qpRSS=='')
    {
        s_qpRSS=s.getQueryParam('rss');
    }
}else
{
    s_qpRSS=s.getQueryParam('rss');
}
if(s_qpRSS!=null&&s_qpRSS!='')
{
	s.prop11='yes';
}
if(JS_OMNI_TOOLS!=null&&JS_OMNI_TOOLS!='')
{
	var str=JS_OMNI_TOOLS;
	str=str+((s_site!=null&&s_site!='')?'~~'+s_site:'~~any');
	str=str+((s_section!=null&&s_section!='')?'~~'+s_section:'~~any');
	str=str+((s_subSection!=null&&s_subSection!='')?'~~'+s_subSection:'~~any');
	s.prop9=fixVar(str,100);
}
if(JS_OMNI_INDEX!=null&&JS_OMNI_INDEX!='')
{
	s.prop12=fixVar(JS_OMNI_INDEX,100);
}
if(JS_PANOPTICQUERY!=null&&JS_PANOPTICQUERY!='')
{
	s.prop13=fixVar(JS_PANOPTICQUERY,100);
}
if(s_subSection3!=null&&s_subSection3!='')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section+'|'+s_subSection+'|'+s_subSection1+'|'+s_subSection2+'|'+s_subSection3,255);
}else if(s_subSection2!=null&&s_subSection2!='')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section+'|'+s_subSection+'|'+s_subSection1+'|'+s_subSection2,255);
}else if(s_subSection1!=null&&s_subSection1!='')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section+'|'+s_subSection+'|'+s_subSection1,255);
}else if(s_subSection!=null&&s_subSection!=''&&s_section=='artistfeature')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section+'|'+s_subSection+'|'+s_pageName,255);
}else if(s_subSection!=null&&s_subSection!='')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section+'|'+s_subSection,255);
}else if(s_section!=null&&s_section!='')
{
	s.hier1=fixVar(s.prop4+'|'+s_site+'|'+s_section,255);
}else
{
	s.hier1=fixVar(s.prop4+'|'+s_site,255);
}
if (typeof(JS_AssetDisplayTypeId)!='undefined'&&JS_AssetDisplayTypeId!='')
{
	var parm='';
	if(typeof(JS_AssetId)!='undefined'&&JS_AssetId!='')
	{
		parm=JS_AssetId;
	}
	if(JS_AssetDisplayTypeId=='2') //new cms slideshow
	{
		s.prop21='slideshow';		
	}else if (JS_AssetDisplayTypeId=='3') //new cms glance
	{			
		s.prop21='glance';
	}
	s.prop22=fixVar((parm+'-'+document.title).replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22;
}else if(JS_OMNTR_PAGETYPEID=='1') //Page Type ID 1 = Standalone
{
	s.prop21='standalone';
	s.hier2=s.channel+'|'+s.prop21;
}else if(JS_OMNTR_PAGETYPEID=='2002') //Page Type ID 2002 = Article
{
    var parm='';
	if (typeof(s_physurl)!='undefined')
    {
        parm=s.getQueryParam('id','&',s_physurl);
        parm=parseInt(parm);
        if(isNaN(parm))
        {
            parm=s.getQueryParam('id');
        }
    }
    else
    {
        parm=s.getQueryParam('id');
    }
	s.prop21='article';
	s.prop22=fixVar((parm+'-'+document.title).replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22;
}else if(JS_OMNTR_PAGETYPEID=='2003') //Page Type ID 2003 = Slideshow
{
	var parm='';
	s.prop21='slideshow';
	var photo;
	if (typeof(s_physurl)!='undefined')
    {
        parm=s.getQueryParam('subsectionid','&',s_physurl);
        photo=s.getQueryParam('photo','&',s_physurl);
        if(parm==null||parm=='')
        {
            parm=s.getQueryParam('subsectionid');
        }
        if(photo==null||photo=='')
        {
            photo=s.getQueryParam('photo');
        }
    }else
    {
        parm=s.getQueryParam('subsectionid');
        photo=s.getQueryParam('photo');
    }
    s.prop22=fixVar(parm.replace(/[:|]/g,'')+'-'+s_subSection,100);
	s.prop25=fixVar(((photo!=null&&photo!='')?photo:'1').replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22+'|'+s.prop25;
}else if(JS_OMNTR_PAGETYPEID=='2004') //Page Type ID 2004 = Blog
{
	s.prop21='blog';
	s.prop22=((JS_BLOGID!=null&&JS_BLOGID!='')?fixVar((JS_BLOGID+'-'+JS_BLOGTITLE).replace(/[:|]/g,''),100):s.prop21);
	s.prop25=((JS_BLOGENTRYID!=null&&JS_BLOGENTRYID!='')?fixVar((JS_BLOGENTRYID+'-'+JS_BLOGENTRYTITLE).replace(/[:|]/g,''),100):s.prop22);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22+'|'+s.prop25;
}else if(JS_OMNTR_PAGETYPEID=='2005') //Page Type ID 2005 = Internal Search
{
	s.prop21='internal search';
	s.hier2=s.channel+'|'+s.prop21;
	if(JS_PANOPTICQUERY!=null&&JS_PANOPTICQUERY!='')
	{
		s.prop22=fixVar(JS_PANOPTICQUERY.replace(/[:|]/g,''),100);
		s.hier2=s.hier2+'|'+s.prop22;
	}
	if(JS_PANOPTICTOTALMATCH!=null&&JS_PANOPTICTOTALMATCH!='')
	{
		s.prop25=fixVar(JS_PANOPTICTOTALMATCH.replace(/[:|]/g,''),100);
		s.hier2=s.hier2+'|'+s.prop25;
	}
}else if(JS_OMNTR_PAGETYPEID=='2006') //Page Type ID 2006 = Newsletter
{
	s.prop21='newsletter';
	s.prop22=fixVar((unescape(location.href.match('[^?#]*'))).replace(/[:|]/g,''),100);
	s.prop25=fixVar(oDate.getDate()+'/'+oDate.getMonth()+1+'/'+oDate.getFullYear(),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22+'|'+s.prop25;
}else if(JS_OMNTR_PAGETYPEID=='4007') //Page Type ID 4007 = Competition
{
    var compid=s.getQueryParam('compid');
	s.prop21='competition';
	if(compid!=null&&compid!='')
	{
	    s.prop22=fixVar((compid+'-'+document.title).replace(/[:|]/g,''),100);
    }else
    {
        var frm = document.getElementById('frmForm');
	    if(frm!=null&&frm!='')
	    {            
            var url=document.getElementById('frmForm').action;
            if(url!=null&&url!='')
            {   
                if(url.toLowerCase().indexOf('compid')!=-1)
                {
                    var ia;
                    var ix=url.toLowerCase().indexOf('compid')+6;
                    var ib=url.indexOf('&',ix);                    
                    if(url.charAt(ix)=='=') //case of compId=8888
                    {
                        ia=ix+1;
                    }else if(url.charAt(ix)=='%') //case of compId%3d8888
                    {
                        ia=ix+3;
                    }
				    s.prop22=((ib!=-1)?url.substr(ia,(ib-ia)):url.substr(ia))+'-'+fixVar((document.title).replace(/[:|]/g,''),100);//scenario of 'compid=4562&amp' and 'compid=4562'
                }else
                {
                    s.prop22=fixVar((document.title).replace(/[:|]/g,''),100);
                }
            }else
            {
                s.prop22=fixVar((document.title).replace(/[:|]/g,''),100);
            }
        }else
        {
            s.prop22=fixVar((document.title).replace(/[:|]/g,''),100);
        }        
    }
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22;
}else if(JS_OMNTR_PAGETYPEID=='4008') //Page Type ID 4008 = Homepage
{
	s.prop21='homepage';
	s.hier2=s.channel+'|'+s.prop21;
}else if(JS_OMNTR_PAGETYPEID=='4009') //Page Type ID 4009 = quiz
{
    var parm='';
    if (typeof(s_physurl)!='undefined')
    {
        parm=s.getQueryParam('quizid','&',s_physurl);
        parm=parseInt(parm);
        if(isNaN(parm))
        {
            parm=s.getQueryParam('quizid');
        }
    }
    else
    {
        parm=s.getQueryParam('quizid');
    }
	s.prop21='quiz';
	s.prop22=parm;
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22;
}else if(JS_OMNTR_PAGETYPEID=='4010') //Page Type ID 4010 = tagging
{
    var tag='';
    var loc='';
    var dom='';
    if (typeof(s_physurl)!='undefined')
    {
        tag=s.getQueryParam('tags','&',s_physurl);
        loc=s.getQueryParam('tagdisplayname','&',s_physurl);
        if(loc.length==0)
        {
            loc=s.getQueryParam('location','&',s_physurl);
        }        
        dom=s.getQueryParam('domain','&',s_physurl);
    }
    else
    {
        tag=s.getQueryParam('tags');
        loc=s.getQueryParam('tagdisplayname');
        if(loc.length==0)
        {
            loc=s.getQueryParam('location');
        }
        dom=s.getQueryParam('domain');
    }
	s.prop21='tags';
	s.prop22=fixVar((dom+'-'+tag+'-'+loc).replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22;
}else if(JS_OMNTR_PAGETYPEID=='4011') //Page Type ID 4011 = faceoff
{
    var foid='';
    var fomode='';
    var fosort='';
    var foby='';
    if (typeof(s_physurl)!='undefined')
    {
        foid=s.getQueryParam('fo_id','&',s_physurl);
        fomode=s.getQueryParam('fo_mode','&',s_physurl);
        fosort=s.getQueryParam('fo_sort','&',s_physurl);
        foby=s.getQueryParam('fo_by','&',s_physurl);
    }
    else
    {
        foid=s.getQueryParam('fo_id');
        fomode=s.getQueryParam('fo_mode');
        fosort=s.getQueryParam('fo_sort');
        foby=s.getQueryParam('fo_by');
    }
    foid=(foid!=null&&foid!='')?foid:'unknown';
    fomode=(fomode!=null&&fomode!='')?fomode:'unknown';
    fosort=(fosort!=null&&fosort!='')?fosort:'unknown';
    foby=(foby!=null&&foby!='')?foby:'unknown';
    
	s.prop21='faceoff';
	s.prop22=fixVar(foid.replace(/[:|]/g,''),100);
	s.prop25=fixVar((fomode+'-'+fosort+'-'+foby).replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21+'|'+s.prop22+'|'+s.prop25;
}
if(JS_OMNTR_PAGETYPENAME!=null&&JS_OMNTR_PAGETYPENAME!='')
{
	s.prop21=fixVar(JS_OMNTR_PAGETYPENAME.replace(/[:|]/g,''),100);
	s.hier2=s.channel+'|'+s.prop21;
	if(JS_OMNTR_PAGETYPEIDENTIFIER!=null&&JS_OMNTR_PAGETYPEIDENTIFIER!='')
	{
		s.prop22=fixVar(JS_OMNTR_PAGETYPEIDENTIFIER.replace(/[:|]/g,''),100);
		s.hier2=s.hier2+'|'+s.prop22;
		if(JS_OMNTR_PAGETYPEIDENTIFIER2!=null&&JS_OMNTR_PAGETYPEIDENTIFIER2!='')
		{
			s.prop25=fixVar(JS_OMNTR_PAGETYPEIDENTIFIER2.replace(/[:|]/g,''),100);
			s.hier2=s.hier2+'|'+s.prop25;
		}
	}
}
if (JS_MEMBERSHIP_IS_AUTHENTICATED=='true')
{	
	if (JS_MEMBERSHIP_NINEMSN_MEMBER=='true')
	{
		s.prop27='1';
		s.eVar27='1';
	}
	else
	{
		s.prop27='2';
		s.eVar27='2';
	}
}
else
{
	s.prop27='0';
}
var ocid=s.getValOnce(s.getQueryParam('ocid',':','f'),'s_campaign',0);
var cmp=s.getValOnce(s.getQueryParam('cmp'),'s_cmp',0);
var mch=s.getQueryParam('mch');
if (cmp!=null&&cmp!=''&&mch!=null&&mch!='')
{
	s.campaign=fixVar(cmp,100);
	s.eVar1=s.campaign;
	s.prop40=s.campaign;
	s.prop41=fixVar(mch,100);
	s.eVar40=s.prop40;
	s.eVar41=s.prop41;
}
if (ocid!=null&&ocid!='')
{
    s.prop42=fixVar(ocid,100);
	s.campaign=s.prop42;
}
s.eVar2=((s.channel!=null&&s.channel!='')?s.channel:'');
s.eVar3=((s.prop1!=null&&s.prop1!='')?s.prop1:'');
s.eVar4=((s.prop3!=null&&s.prop3!='')?s.prop3:'');
var strEvar='';
if(JS_OMNTR_EVARS!=null&&JS_OMNTR_EVARS!='')
{
	for(i=5;i<JS_OMNTR_EVARS.length;i++)
	{
		if(JS_OMNTR_EVARS[i]!=null&&JS_OMNTR_EVARS[i]!='')
		{
			strEvar=strEvar+"s.eVar"+(i)+"='"+fixVar(JS_OMNTR_EVARS[i],100).replace("'","")+"';";
		}
	}
	eval(strEvar)
}
var strEvent='';
if(JS_OMNTR_EVENTS!=null&&JS_OMNTR_EVENTS!='')
{
	for(i=3;i<JS_OMNTR_EVENTS.length;i++)
	{
		if(JS_OMNTR_EVENTS[i]!=null&&JS_OMNTR_EVENTS[i]!='')
		{
			strEvent=strEvent+',event'+i;
		}
	}
}
s.events='event1'+strEvent;
if(JS_OMNTR_FLASHVERS=='1')
{
    s.prop10=getFlashVersion();
}
var autorf = s.getQueryParam('rf');
if (autorf.toLowerCase() == 'true') {
    s.prop16 = 'rf';
}
if(document.referrer.length>0)
{
	var sref=document.referrer.toLowerCase();
	var sdomain=sref.split(/\/+/g)[1];
	if(sref.indexOf('google.')>-1&&(sref.indexOf('?q=')>-1||sref.indexOf('&q=')>-1))
	{
		s.eVar5=s.getQueryParam('q','&',sref);
		s.eVar10=sdomain;
		s.prop30='google';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='google';
		}else
		{
			s.eVar30='';
		}
		if(sref.indexOf('?source=web')>-1||sref.indexOf('&source=web')>-1)
		{
			s.eVar9='google-web';
		}else if(sref.indexOf('?source=vgc')>-1||sref.indexOf('&source=vgc')>-1||sref.indexOf('?source=video')>-1||sref.indexOf('&source=video')>-1)
		{
			s.eVar9='google-video';
		}else if(sref.indexOf('news.google')>-1)
		{
			s.eVar9='google-news';
		}else
		{
			s.eVar9='google-other';
		}
	}else if(sref.indexOf('google.')>-1)
	{
		sref=unescape(sref);
		if(sref.indexOf('?prev=/images')>-1||sref.indexOf('&prev=/images')>-1)
		{
			if(s.channel=='homepage:portal')
			{
				s.eVar30='google';
			}else
			{
				s.eVar30='';
			}
			var prm='&prev=';
			var istart=sref.indexOf('&prev=/images');
			var qrystr=sref.substr((istart+prm.length));
			s.eVar5=s.getQueryParam('q','&',qrystr);
			s.eVar10=sdomain;
			s.prop30='google';
			s.eVar9='google-images';	
		}
	}else if(sref.indexOf('bing.')>-1&&(sref.indexOf('?q=')>-1||sref.indexOf('&q=')>-1))
	{
		s.eVar5=s.getQueryParam('q','&',sref);
		s.eVar9='bing';
		s.eVar10=sdomain;
		s.prop30='bing';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='bing';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('yahoo.')>-1&&(sref.indexOf('?p=')>-1||sref.indexOf('&p=')>-1))
	{
		s.eVar5=s.getQueryParam('p','&',sref);
		s.eVar9='yahoo';
		s.eVar10=sdomain;
		s.prop30='yahoo';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='yahoo';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('sensis.')>-1&&(sref.indexOf('?find=')>-1||sref.indexOf('&find=')>-1))
	{
		s.eVar5=s.getQueryParam('find','&',sref);
		s.eVar9='sensis';
		s.eVar10=sdomain;
		s.prop30='sensis';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='sensis';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('ask.')>-1&&(sref.indexOf('?q=')>-1||sref.indexOf('&q=')>-1))
	{
		s.eVar5=s.getQueryParam('q','&',sref);
		s.eVar9='ask';
		s.eVar10=sdomain;
		s.prop30='ask';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='ask';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('.facebook.')>-1)
	{
		s.eVar5='';
		s.eVar9='facebook';
		s.eVar10='';
		s.prop30='facebook';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='facebook';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('twitter.com')>-1)
	{
		s.eVar5='';
		s.eVar9='twitter';
		s.eVar10='';
		s.prop30='twitter';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='twitter';
		}else
		{
			s.eVar30='';
		}
	}else if(sref.indexOf('ninemsn.com')==-1)
	{
		s.eVar5='';
		s.eVar9='';
		s.eVar10='';
		s.prop30='all-other';
		if(s.channel=='homepage:portal')
		{
			s.eVar30='all-other';
		}else
		{
			s.eVar30='';
		}
	}
}else
{
	s.eVar5='';
	s.eVar9='';
	s.eVar10='';
	s.eVar30='';
}
/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s._c='s_c';s.wd=window;if(!s.wd.s_c_in){s.wd.s_c_il=new Array;s.wd.s_c_in=0;}s._il=s.wd.s_c_il;s._in=s.wd.s_c_in;s._il[s._in]=s;s.wd.s_c_in++;s"
+".an=s_an;s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}return y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=func"
+"tion(o){if(!o)return o;var n=new Object,x;for(x in o)if(x.indexOf('select')<0&&x.indexOf('filter')<0)n[x]=o[x];return n};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexO"
+"f(x.substring(p,p+1))<0)return 0;return 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3)"
+"return encodeURIComponent(x);else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.substring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%"
+"16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}return y}else{x=s.rep(escape(''+x),'+','%2B');if(c&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if"
+"(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00'+x.substring(i);i=x.indexOf('%',i)}}}}return x};s.epa=function(x){var s=this;if(x){x=''+x;return s.em==3?de"
+"codeURIComponent(x):unescape(s.rep(x,'+',' '))}return x};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r;z+=y+d.l"
+"ength;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);if(t.substring(0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.f"
+"sf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf',f);return s.fsg};s.si=function(){var s=this,i,k,v,c="
+"s_gi+'var s=s_gi(\"'+s.oun+'\");s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)=='string')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}"
+"c+=\"s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var"
+" s=this,d=s.wd.location.hostname,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('"
+".',p-1);n--}s.c_d=p>0&&s.pt(d,'.','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s."
+"epa(c.substring(i+2+k.length,e<0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NON"
+"E'){t=(v!=''?parseInt(l?l:0):-60);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()"
+"+';':'')+(d?' domain='+d+';':'');return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i]."
+"o==o&&l[i].e==e)n=i}if(n<0){n=i;l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv"
+">=5&&(!s.isopera||s.apv>=7)){tcf=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,"
+"'onerror',0,o);r=s[f](a);s.eh(s.wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s"
+".t();if(c)s.d.write(c);s.etfs=0;return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs="
+"p;return s.gtfsf(s.tfs)}return s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,"
+"l=s.rl[u],n,r;s.rl[u]=0;if(l)for(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,0,r.t,r.u)}};s.br=function(id,rs){var s=this;if(s.disableBufferedRequests||!s.c_w('s_br',rs))s.brl=rs};s.flushBufferedReques"
+"ts=function(){this.fbr(0)};s.fbr=function(id){var s=this,br=s.c_r('s_br');if(!br)br=s.brl;if(br){if(!s.disableBufferedRequests)s.c_w('s_br','');s.mr(0,0,br)}s.brl=0};s.mr=function(sess,q,rs,id,ta,u"
+"){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackingServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if"
+"(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase();else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s"
+".ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/H.22.1/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047);if(id){s.br(id,rs);return}}if(s.d.images&&s.apv>=3"
+"&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[un]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+']."
+"mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;return ''}imn+='_'+s.rc[un];s.rc[un]++}im=s.wd[imn];if(!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e',"
+"'this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nrs){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if((!ta||ta=='_self'||ta="
+"='_top'||(s.wd.name&&ta==s.wd.name))&&rs.indexOf('&pe=')>=0){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return ''}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0"
+" alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=='s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl="
+"function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,l,a,b='',c='',t;if(x){y=''+x;i=y.indexOf('?');if(i>0){a=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase()"
+";i=0;if(h.substring(0,7)=='http://')i+=7;else if(h.substring(0,8)=='https://')i+=8;h=h.substring(i);i=h.indexOf(\"/\");if(i>0){h=h.substring(0,i);if(h.indexOf('google')>=0){a=s.sp(a,'&');if(a.lengt"
+"h>1){l=',q,ie,start,search_key,word,kw,cd,';for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c){y+='?'+b+'&'"
+"+c;if(''+x!=y)x=y}}}}}}return x};s.hav=function(){var s=this,qs='',fv=s.linkTrackVars,fe=s.linkTrackEvents,mn,i;if(s.pe){mn=s.pe.substring(0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].tr"
+"ackVars;fe=s[mn].trackEvents}}fv=fv?fv+','+s.vl_l+','+s.vl_l2:'';for(i=0;i<s.va_t.length;i++){var k=s.va_t[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(v&&k!='linkName'&&k!='l"
+"inkType'){if(s.pe||s.lnk||s.eo){if(fv&&(','+fv+',').indexOf(','+k+',')<0)v='';if(k=='events'&&fe)v=s.fs(v,fe)}if(v){if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pa"
+"geURL'){q='g';v=s.fl(v,255)}else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&&s.visitorMigra"
+"tionServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1';else if(s.em="
+"=2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k=='currencyCode"
+"')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascriptVersion')q='j"
+"';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='homepage')q='hp'"
+";else if(k=='plugins')q='p';else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eVar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+q+'='+(k.substring(0,3)"
+"!='pev'?s.ape(v):v)}}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t"
+")return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLowerCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExt"
+"ernalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.substring(0,1)"
+"!='#'&&(lef||lif)&&(!lef||s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=s.co(this);s.t"
+"();s.lnk=0;if(b)return this[b](e);return true');s.bc=new Function('e','var s=s_c_il['+s._in+'],f,tcf;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;s.eo=e.srcElement?e.srcElement:e.target;tcf=new Functi"
+"on(\"s\",\"var e;try{if(s.eo&&(s.eo.tagName||s.eo.parentElement||s.eo.parentNode))s.t()}catch(e){}\");tcf(s);s.eo=0');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.inde"
+"xOf(':');j=h.indexOf('?');k=h.indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'"
+"')+(o.host?o.host:(l.host?l.host:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;t=t&&t.toUpperCase?t.toUpperCase():'';if(t=='SHAPE'"
+")t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=this,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p"
+"=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' '"
+",'');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100"
+");o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u+',').indexOf(','+un+',')>=0){if(u!=s.un&&"
+"s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)return s.pt(v,'&','rqf',un);return s.pt(un,'"
+",','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return 0};s.sqs=function(un,q){var s=this;s.squ[u"
+"n]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',q);v='';for(x in s.squ)if(x&&(!Object||!Ob"
+"ject.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq"
+"[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i<s.d.links.length;i++){o=s.d.links[i];oc=o"
+".onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=function(){var s=this;if(s.apv>3&&(!s.isie|"
+"|!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener)s.b.addEventListener('click',s.bc,false);else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=func"
+"tion(x){var s=this,v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e)"
+")return 0;n=x}if(n%10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.subst"
+"ring(0,i),x=t.substring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowe"
+"rCase();if(x&&l){if(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};"
+"s.sa=function(un){var s=this;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r,l,i;if(!s.m_l)s.m_"
+"l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s;m._n=n;m._l=new Ar"
+"ray('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l=m._l;for(i=0;i<l.le"
+"ngth;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c=s[g+\"_c\"],m,x,f=0"
+";if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if(x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf("
+"\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl."
+"length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexO"
+"f('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl,i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadMo"
+"dule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':');if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else "
+"g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],"
+"o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!"
+"o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s.d.createElement(\"script\");if(o){o.type=\"text/javas"
+"cript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,"
+"f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m=s.m_i(n);m._e=1}return m};s.vo1=function(t,a){if(a[t]"
+"||a['!'+t])this[t]=a[t]};s.vo2=function(t,a){if(!a[t]){a[t]=this[t];if(!a[t])a['!'+t]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=new Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.d"
+"ll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if(!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.d"
+"l=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.pt(s.vl_g,',','vo2',vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if(!s.maxDelay)s.maxDelay=250;s.dlt()};s.t=fun"
+"ction(vo,id){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*10000000000000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate("
+")+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds()+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Objec"
+"t;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i,x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1'"
+";if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try"
+"{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next)j='1.7'}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaEnabled()?'Y':'N';if(s.apv>=4){c="
+"screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){bw=s.d.documentElement.offsetWid"
+"th;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\":\"N\"}catch(e){}return hp');hp="
+"tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)while(pn<s.pl.length&&pn<30){ps=s.f"
+"l(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.browserHeight=bh;s.connectionType=c"
+"t;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.pt(s.vl_g,',','vo2',vb);s.pt(s.vl_g,',','vo1',vo)}if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);var l=s.wd.location,r=tfs.document.referrer"
+";if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s.eo:s.lnk;if(!o)return '';var p=s.pageName,w=1,t=s.ot(o)"
+",n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';t=s.ot(o);n=s.oid(o);x=o.s_oidt}oc=o.onclick?''+o.onclick:''"
+";if((oc.indexOf(\"s_gs(\")>=0&&oc.indexOf(\".s_oc(\")<0)||oc.indexOf(\".tl(\")>=0)return ''}if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h.substring(0,i);l=s.linkName"
+";t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l))q+='&pe=lnk_'+(t=='d'||t=='e'?s.ape(t):'o')+(h?'&pev1='+s.ape(h):'')+(l?'&pev2='+s.ape(l):'');else trk=0;if(s.trackInlineStats){if(!p){p="
+"s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+(x?'&oidt='+x:'')+'&ot="
+"'+s.ape(t)+(i?'&oi='+i:'')}}if(!trk&&!qs)return '';s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,id,ta);qs='';s.m_m('t');if(s.p_r)s.p_r("
+");s.referrer=''}s.sq(qs);}else{s.dl(vo);}if(vo)s.pt(s.vl_g,',','vo1',vb);s.lnk=s.eo=s.linkName=s.linkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_link"
+"Name=s.wd.s_linkType='';if(!id&&!s.tc){s.tc=1;s.flushBufferedRequests()}return code};s.tl=function(o,t,n,vo){var s=this;s.lnk=s.co(o);s.linkType=t;s.linkName=n;s.t(vo)};if(pg){s.wd.s_co=function(o)"
+"{var s=s_gi(\"_\",1,1);return s.co(o)};s.wd.s_gs=function(un){var s=s_gi(un,1,1);return s.t()};s.wd.s_dc=function(un){var s=s_gi(un,1);return s.t()}}s.ssl=(s.wd.location.protocol.toLowerCase().inde"
+"xOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElementsByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var ap"
+"n=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.isope"
+"ra=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv="
+"parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.em=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=="
+"'%U0100'?1:0))}s.sa(un);s.vl_l='dynamicVariablePrefix,visitorID,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLi"
+"fetime,pageName,pageURL,referrer,currencyCode';s.va_l=s.sp(s.vl_l,',');s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,events,products,linkName,"
+"linkType';for(var n=1;n<76;n++)s.vl_t+=',prop'+n+',eVar'+n+',hier'+n+',list'+n;s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browse"
+"rHeight,connectionType,homepage,plugins';s.vl_t+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests"
+",mobile,visitorSampling,visitorSamplingGroup,dynamicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadF"
+"ileTypes,linkExternalFilters,linkInternalFilters,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,_1_referrer';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);if(!ss)s.wds()",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,s;if(un){un=un.toLowerCase();if(l)for(i=0;i<l.length;i++){s=l[i];if(!s._c||s._c=='s_c'){if(s.oun==un)return s;else if(s.fs&&s.sa&&s.fs(s.oun,un)){s.sa(un);return s}}}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a>=5&&v.indexOf('Opera')<0&&u.indexOf('Opera')<0){w.s_c=new Function("un","pg","ss","var s=this;"+c);return new s_c(un,pg,ss)}else s=new Function("un","pg","ss","var s=new Object;"+s_ft(c)+";return s");return s(un,pg,ss)}

var s_code=s.t();if(s_code)document.write(s_code);

// Link Track
function omntrLinkProductCall(sProduct){
    var s=s_gi(o_account);
    s.visitorNamespace="msnportal";
    s.cookieDomainPeriods=((window.location.hostname.indexOf(".com.au")>-1||window.location.hostname.indexOf(".co.nz")>-1)?"3":"2");
    s.linkTrackVars="products,events";
    s.linkTrackEvents="event4";
    s.events="event4";
    s.products=sProduct;
    s.tl(true,"o","link_track_view");
    s.linkTrackVars='None';
    s.linkTrackEvents='None';
}

function omntrTrackHLLinks(){
    var arrHLID=JS_OMNTR_LINKTRACK_HLID.split(",");
    var arrLinkProduct=new Array;
    for(var i=0;i<arrHLID.length;i++){
        var hldiv=document.getElementById("cat_hl_"+arrHLID[i]);
        if(hldiv!=null){
            if(hldiv.innerHTML.toLowerCase().search(/adtrack/i)!=-1){
                var catName=hldiv.innerHTML.match(/adtrack[^)]*/i)[0].split(",")[1].replace(/;/g,"").replace(/|/g,"").replace(/\"/g,"").replace(/\'/g,"");
                var arrLink=hldiv.innerHTML.match(/<a\s[\s\S]*?<\/a>/gi);
                if(arrLink!=null){
                    for(var j=0;j<arrLink.length;j++){
                        var linkProduct=arrLink[j].substring(arrLink[j].indexOf(">")+1,arrLink[j].length-4);
                        if(linkProduct!=null&&linkProduct!=""){
                            if(linkProduct.search(/<img\s/i)==0&&linkProduct.match(/alt="[^"]*/i)!=null&&linkProduct.match(/alt="[^"]*/i)!='alt="'){
                                linkProduct=linkProduct.match(/alt="[^"]*/i)[0].substr(5);
                                linkProduct="img-"+linkProduct.replace(/[\x00-\x19]/g,"").replace(/[\x21-\x2F]/g,"").replace(/[\x3A-\x40]/g,"").replace(/[\x5B-\x60]/g,"").replace(/[\x7B-\xFF]/g,"");
                            }else if(linkProduct.search(/<img\s/i)==0&&linkProduct.match(/src="[^"]*/i)!=null){
                                linkProduct=linkProduct.match(/src="[^"]*/i)[0].substr(linkProduct.match(/src="[^"]*/i)[0].lastIndexOf("/")+1);
                                linkProduct="img-"+linkProduct.replace(/[\x00-\x19]/g,"").replace(/[\x21-\x2F]/g,"").replace(/[\x3A-\x40]/g,"").replace(/[\x5B-\x60]/g,"").replace(/[\x7B-\xFF]/g,"");
                            }else{
                                linkProduct=linkProduct.replace(/<[^>]+>/g,"").replace(/[\x00-\x19]/g,"").replace(/[\x21-\x2F]/g,"").replace(/[\x3A-\x40]/g,"").replace(/[\x5B-\x60]/g,"").replace(/[\x7B-\xFF]/g,"");
                            }
                            linkProduct=((linkProduct.length>50)?fixVar(linkProduct,48)+"..":fixVar(linkProduct,50));
                            arrLinkProduct.push(";"+linkProduct+";;;;evar11="+catName);
                        }
                    }
                }
            }
        }
    }
    var sProduct="";
    for(var i=0;i<arrLinkProduct.length;i++){
        if(sProduct.length<1000){
            sProduct=sProduct+arrLinkProduct[i]+",";
        }else{
            omntrLinkProductCall(sProduct+arrLinkProduct[i]);
            sProduct="";
        }
    }
    if(sProduct!="") {
        omntrLinkProductCall((sProduct.charAt(sProduct.length-1)==",")?sProduct.substr(0,sProduct.length-1):sProduct);
    }
    s.linkTrackVars="prop8,events";
    s.linkTrackEvents="event2";
}

if(JS_OMNTR_LINKTRACK_HLID!=null&&JS_OMNTR_LINKTRACK_HLID!=""){
    omntrTrackHLLinks();
}