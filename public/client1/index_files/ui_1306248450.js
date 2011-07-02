/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.ui.TooltipShadow"]=true;$iTXT.ui.TooltipShadow_Load=function(){var undefined;$iTXT.ui.TooltipShadow=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,contentWidth:0,contentHeight:0,whAdjust:0,transparentTooltip:false,init:function(_options,$super)
{this.updateAdjust();this.componentParams=$iTXT.core.Util.extend({'tt.shadow.img':'${tt.img.dir}lg_shadow_sprite.png'},this.componentParams);var defOpts=$iTXT.core.Util.extend({id:"itxtshadow",size:6,ps:$iTXT.ui.TooltipPosition.AR,tailWidth:58,tailHeight:36,showTail:true,shadowImage:"${tt.shadow.img}"},_options);this.lastPS=$iTXT.ui.TooltipPosition.AR;$super(defOpts);var o=this.options;$iTXT.core.Util.cacheImages([o.shadowImage]);var b=$iTXT.core.Builder;this.spriteImages=[b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641}),b.make("APNG",{src:o.shadowImage,width:765,height:641})];this.spriteHolders=[b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[0]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[1]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[2]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[3]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[4]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[5]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[6]]),b.make("DIV",{style:"width: 765px; height: 641px;"},[this.spriteImages[7]])];this.divTL=b.make("DIV",{className:"itxtshdw itxttl"},[this.spriteHolders[0]]);this.divBL=b.make("DIV",{className:"itxtshdw itxtbl"},[this.spriteHolders[1]]);this.divTR=b.make("DIV",{className:"itxtshdw itxttr"},[this.spriteHolders[2]]);this.divBR=b.make("DIV",{className:"itxtshdw itxtbr"},[this.spriteHolders[3]]);this.divTM=b.make("DIV",{className:"itxtshdw itxttm"},[this.spriteHolders[4]]);this.divBM=b.make("DIV",{className:"itxtshdw itxtbm"},[this.spriteHolders[5]]);this.divFILL=b.make("DIV",{className:"itxtshdw itxtfill"},[this.spriteHolders[6]]);this.divTAIL=b.make("DIV",{className:"itxtshdw itxttail"},[this.spriteHolders[7]]);this.rootElement.itxtAppendChildren([this.divTL,this.divBL,this.divTR,this.divBR,this.divTM,this.divBM,this.divFILL,this.divTAIL]);this.rootElement.itxtBatchSubscribe([["mouseover",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:shdw:mouse:over",e);e.stop();}],["mouseout",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:shdw:mouse:out",e);e.stop();}]],this.evtDspFuncs);},_refresh:function()
{},setPositionState:function(ps)
{this.options.ps=ps;if(this.divTAIL.firstChild)
{this.divTAIL.firstChild.itxtAddClass(this.options.ps,this.lastPS);}
if(this.divFILL.firstChild)
{this.divFILL.firstChild.itxtAddClass(this.options.ps,this.lastPS);}
this.lastPS=ps;this.setSize(this.contentWidth,this.contentHeight);},setSize:function(w,h)
{this.contentWidth=w;this.contentHeight=h;var ttps=$iTXT.ui.TooltipPosition;var tailW=58;var tailH=36;var tailOff=22;var tailInd=tailH-tailOff;var tMarg=((ttps.BR==this.options.ps)||(ttps.BL==this.options.ps))?tailOff:0;this.width=w+(this.options.size*2);this.height=h+(this.options.size*2);var intHght=h+(this.options.size*2)-tailOff;this.rootElement.itxtSetStyle({width:this.width+"px",height:this.height+"px"});var tH=Math.ceil(intHght/2);var bH=intHght-tH;var mW=this.width-100;var tMW=this.options.showTail?(mW-tailW):mW;var tML=this.options.showTail?(tailW+50):50;this.divBL.firstChild.itxtSetStyle({top:(-(512-bH))+"px"});this.divBR.firstChild.itxtSetStyle({top:(-(512-bH))+"px"});this.divBM.firstChild.itxtSetStyle({top:(-(512-bH))+"px"});this.divFILL.firstChild.itxtSetStyle({top:""});var leftW=(50-this.whAdjust);this.divTL.itxtSetStyle({top:tMarg+"px",left:"0px",width:leftW+"px",height:(tH-this.whAdjust)+"px"});this.divBL.itxtSetStyle({top:(tH+tMarg)+"px",left:"0px",width:leftW+"px",height:bH+"px"});this.divTR.itxtSetStyle({top:tMarg+"px",left:(mW+50)+"px",width:"50px",height:(tH-this.whAdjust)+"px"});this.divBR.itxtSetStyle({top:(tH+tMarg)+"px",left:(mW+50)+"px",width:"50px",height:bH+"px"});if(ttps.AR==this.options.ps)
{this.divTM.itxtSetStyle({top:tMarg+"px",left:"50px",width:(mW-this.whAdjust)+"px",height:(tH-this.whAdjust)+"px"});this.divBM.itxtSetStyle({top:(tH+tMarg)+"px",left:tML+"px",width:(tMW-this.whAdjust)+"px",height:bH+"px"});this.divFILL.itxtSetStyle({top:(tH+tMarg)+"px",left:"50px",width:(tailW-this.whAdjust)+"px",height:(bH-tailInd)+"px"});this.divTAIL.itxtSetStyle({top:(intHght-tailInd)+"px",left:"50px",width:(tailW-this.whAdjust)+"px",height:tailH+"px"});this.divFILL.firstChild.itxtSetStyle({top:(-(512-bH))+"px"});}
else if(ttps.AL==this.options.ps)
{this.divTM.itxtSetStyle({top:tMarg+"px",left:"50px",width:(mW-this.whAdjust)+"px",height:(tH-this.whAdjust)+"px"});this.divBM.itxtSetStyle({top:(tH+tMarg)+"px",left:"50px",width:(tMW-this.whAdjust)+"px",height:bH+"px"});this.divFILL.itxtSetStyle({top:(tH+tMarg)+"px",left:(mW-tailW+50)+"px",width:(tailW-this.whAdjust)+"px",height:(bH-tailInd)+"px"});this.divTAIL.itxtSetStyle({top:(intHght-tailInd)+"px",left:(mW-tailW+50)+"px",width:(tailW-this.whAdjust)+"px",height:tailH+"px"});this.divFILL.firstChild.itxtSetStyle({top:(-(512-bH))+"px"});}
else if(ttps.BR==this.options.ps)
{this.divTM.itxtSetStyle({top:tMarg+"px",left:tML+"px",width:(tMW-this.whAdjust)+"px",height:(tH-this.whAdjust)+"px"});this.divBM.itxtSetStyle({top:(tH+tMarg)+"px",left:"50px",width:(mW-this.whAdjust)+"px",height:bH+"px"});this.divFILL.itxtSetStyle({top:tailH+"px",left:"50px",width:(tailW-this.whAdjust)+"px",height:(tH-tailInd-this.whAdjust)+"px"});this.divTAIL.itxtSetStyle({top:"0px",left:"50px",width:(tailW-this.whAdjust)+"px",height:(tailH-this.whAdjust)+"px"});}
else if(ttps.BL==this.options.ps)
{this.divTM.itxtSetStyle({top:tMarg+"px",left:"50px",width:(tMW-this.whAdjust)+"px",height:(tH-this.whAdjust)+"px"});this.divBM.itxtSetStyle({top:(tH+tMarg)+"px",left:"50px",width:(mW-this.whAdjust)+"px",height:bH+"px"});this.divFILL.itxtSetStyle({top:tailH+"px",left:(mW-tailW+50)+"px",width:(tailW-this.whAdjust)+"px",height:(tH-tailInd-this.whAdjust)+"px"});this.divTAIL.itxtSetStyle({top:"0px",left:(mW-tailW+50)+"px",width:(tailW-this.whAdjust)+"px",height:(tailH-this.whAdjust)+"px"});}
this.divTAIL.itxtSetStyle({display:(this.options.showTail?"":"none")});this.divFILL.itxtSetStyle({display:(this.options.showTail?"":"none")});},getShadowSize:function()
{return this.options.size;},fadeIn:function()
{$iTXT.core.$(document).itxtFire("$iTXT:tts:before:fade:in");var fadeTo=1;if(window.ActiveXObject)
{fadeTo=0.45;}
var fadeFrom=0;if(window.ActiveXObject)
{fadeFrom=0.02;}
this.show();for(var i=0;i<this.spriteHolders.length;i++)
{this.spriteHolders[i].itxtOpacity(0);}
var t=this;new $iTXT.fx.Fade({to:fadeTo,delay:100,target:this.rootElement,start:true,duration:400,notifyOnly:true,afterUpdate:function(o)
{for(var i=0;i<t.spriteHolders.length;i++)
{t.spriteHolders[i].itxtOpacity(o);}},afterFinish:function()
{$iTXT.core.$(document).itxtFire("$iTXT:tts:after:fade:in");}});},showTail:function()
{if(!this.options.showTail)
{this.options.showTail=true;this.setSize(this.contentWidth,this.contentHeight);}},hideTail:function()
{if(this.options.showTail)
{this.options.showTail=false;this.setSize(this.contentWidth,this.contentHeight);}},setAdvert:function(ad,$super)
{if(this.advert==ad)
return;var adopts=ad.params;var tmpl=ad.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};this.transparentTooltip=tmplopts.transparentTooltip||false;this.updateAdjust();var oldSprite=this.options.shadowImage;$super(ad);if(oldSprite!=this.options.shadowImage)
{for(var i=0;i<this.spriteImages.length;i++)
{this.spriteImages[i].itxtChangeSrc(this.options.shadowImage);}}},updateAdjust:function()
{if(this.transparentTooltip&&($iTXT.core.Browser.is("Explorer",8)||$iTXT.core.Browser.ie8CompatMode||$iTXT.core.Browser.quirksMode||($iTXT.core.Browser.is("Explorer",7)&&!$iTXT.core.Browser.ie8CompatMode)))
{this.whAdjust=1;}
else
{this.whAdjust=0;}}});}
$iTXT.js.loader["$iTXT.ui.TooltipDrawer"]=true;$iTXT.ui.TooltipDrawer_Load=function(){var undefined;$iTXT.ui.TooltipDrawer=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,isOpen:false,parent:null,contentWidth:0,contentHeight:0,init:function(_options,$super)
{this.componentParams=$iTXT.core.Util.extend({'DRAWERNAME':'${TITLE}','DRAWERTITLEOPEN':'Click to close ${DRAWERNAME}','DRAWERTITLECLOSED':'Click to open ${DRAWERNAME}','DRAWERICON':'http://images.intellitxt.com/ast/adTypes/3b.gif'},this.componentParams);var defOpts=$iTXT.core.Util.extend({id:"itxtdrawer",height:21,margins:[1,1,2,2,4,6],colors:["#aaaaaa","#b6b6b6","#a7a7a7","#979797","#888888","#797979","#6b6b6b","#5f5f5f","#545454","#4b4b4b","#010101","#010101","#060606","#0d0d0d","#161616","#202020","#2b2b2b","#363636","#414141","#4b4b4b","#525252"],onColors:[],drawerTitleOpen:"${DRAWERTITLEOPEN}",drawerTitleClosed:"${DRAWERTITLECLOSED}",drawerIcon:"${DRAWERICON}"},_options);$super(defOpts);this.height=this.options.height;if(!this.options.lastDrawer)
{this.options.margins=[];}
this._build();this.rootElement.itxtBatchSubscribe([["click",$iTXT.core.Event.bind(this,this._mouseClick)],["mouseover",$iTXT.core.Event.bind(this,this._mouseOver)],["mouseout",$iTXT.core.Event.bind(this,this._mouseOut)]],this.evtDspFuncs);this.parent=this.options.parent||{};$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:element:loaded",$iTXT.core.Event.bind(this,this._checkLoaded)]],this.evtDspFuncs);$iTXT.core.$(document).itxtFire("$iTXT:tt:content:drawer:add",this);},setSize:function(w,h,$super)
{$super(w,this.height);},_build:function()
{var childNodes=[];this.bgDiv=$iTXT.core.Builder.make("DIV",{className:"itxtbg"});childNodes.push(this.bgDiv);for(var i=0;i<this.options.height;i++)
{var bgCol=this.options.colors[i]||"black";var m=(i>(this.options.height-6))?this.options.margins[i-(this.options.height-6)]:0;this.bgDiv.appendChild(this._createDiv(m,m,bgCol));}
this.statusIcon=$iTXT.core.Builder.make("IMG",{className:"itxtstatusicon",src:"http://mymachine.intellitxt.com/testpages/wb678/imgs/drawers_open.gif"});this.typeIcon=$iTXT.core.Builder.make("IMG",{className:"itxticon",src:this.options.drawerIcon});this.textSpan=$iTXT.core.Builder.make("SPAN",{className:"itxtcontentout"},[this.options.drawerTitleClosed]);this.contentDiv=$iTXT.core.Builder.make("DIV",{className:"itxtcontentoff"},[this.typeIcon,this.textSpan,this.statusIcon]);childNodes.push(this.contentDiv);this.rootElement.itxtAppendChildren(childNodes);this.drawerContent=$iTXT.core.Builder.make("DIV",{className:"itxtdrawercontent"});},_createDiv:function(lm,rm,bgc)
{return $iTXT.core.Builder.make("DIV",{className:"itxtftr",style:"background-color: "+bgc+"; margin-left: "+(lm||0)+"px; margin-right:"+(rm||0)+"px"});},setStatus:function(b)
{this.isOpen=b;if(this.isOpen)
{this.toggleGradient(false);this.contentDiv.itxtAddClass("itxtcontenton","itxtcontentoff");this.statusIcon.src="http://mymachine.intellitxt.com/testpages/wb678/imgs/drawers_close.gif";this.textSpan.innerHTML=this.options.drawerTitleOpen;this.createDrawerContent();$iTXT.core.$(document).itxtFire("$iTXT:tt:content:drawer:open",this);}
else
{this.toggleGradient(true);this.contentDiv.itxtAddClass("itxtcontentoff","itxtcontenton");this.statusIcon.src="http://mymachine.intellitxt.com/testpages/wb678/imgs/drawers_open.gif";this.textSpan.innerHTML=this.options.drawerTitleClosed;$iTXT.core.$(document).itxtFire("$iTXT:tt:content:drawer:close",this);}},_mouseClick:function()
{this.setStatus(!this.isOpen);if(this.parent.setActive)
{this.parent.setActive(this,this.isOpen);}},_mouseOver:function()
{this.textSpan.itxtAddClass("itxtcontentover","itxtcontentout");},_mouseOut:function()
{this.textSpan.itxtAddClass("itxtcontentout","itxtcontentover");},toggleGradient:function(b)
{for(var i=0;i<this.bgDiv.children.length;i++)
{var c=this.bgDiv.children[i];if(b)
{var bgCol=this.options.colors[i]||"black";c.itxtSetStyle({backgroundColor:bgCol});}
else
{var bgCol="black";c.itxtSetStyle({backgroundColor:bgCol});}}},finishShow:function()
{this.template.rootElement.style.visibility="visible";},startHide:function()
{},setSize:function(w,h)
{this.drawerContent.itxtSetStyle({width:w+"px",height:h+"px"});this.contentWidth=w;this.contentHeight=h;},createDrawerContent:function()
{if(!this.template)
{this.template=this.options.advert.getTemplate();if(this.template)
{this.template.beforeBuild();this.templateRoot=this.template.build(this.options.advert);this.drawerContent.appendChild(this.templateRoot);this.template.afterBuild();var bgcol=this.template.options.bgcol||this.options.advert.params.get("ttbg",this.template.options.ttbg||"#fbfbfb")
this.drawerContent.itxtSetStyle({backgroundColor:bgcol});}}
this.template.resize(this.contentWidth,this.contentHeight,true);this.template.rootElement.style.visibility="visible";},_checkLoaded:function(e)
{if(e.data&&e.data==this.options.advert&&this.template&&this.template.checkLoaded())
{this.template.resize(this.contentWidth,this.contentHeight,true);}}});}
$iTXT.js.loader["$iTXT.ui.TooltipDrawerFooter"]=true;$iTXT.ui.TooltipDrawerFooter_Load=function(){var undefined;$iTXT.ui.TooltipDrawerFooter=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,drawers:[],init:function(_options,$super)
{var defOpts=$iTXT.core.Util.extend({id:"itxtdrawerfooter",height:21,margins:[1,1,2,2,4,6]},_options);$super(defOpts);this.bgColor=this.options.bgcol;this._build();this.height=0;},setSize:function(w,h,$super)
{$super(w,this.height);},_build:function()
{},_createDrawer:function(i,ad,last)
{var d=new $iTXT.ui.TooltipDrawer({lastDrawer:last,margins:this.options.margins,parent:this,advert:ad});this.drawers.push(d);var t=this.options.height*i;d.rootElement.itxtSetStyle({top:t+"px"});this.rootElement.appendChild(d.rootElement);},setAdvert:function(a,$super)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:content:drawers:reset");if(this.drawers.length>0)
{for(var i=0;i<this.drawers.length;i++)
{this.drawers[i].dispose();}
this.drawers=[];}
var drwAds=a.params.get("DRAWERADVERTS");if(null!=drwAds)
{for(var i=0;i<drwAds.length;i++)
{var dad=drwAds[i];this._createDrawer(i,dad,(i==(drwAds.length-1)));}}
if(this.drawers.length==0)
{this.rootElement.itxtHide();}
else
{this.rootElement.itxtShow();this.height=this.drawers.length*this.options.height;}
$super(a);},hasDrawers:function()
{return this.drawers.length>0;},setActive:function(drawer,isActive)
{for(var i=0;i<this.drawers.length;i++)
{var d=this.drawers[i];if(d!=drawer)
{d.setStatus(false);}}}});}
$iTXT.js.loader["$iTXT.ui.TooltipTail"]=true;$iTXT.ui.TooltipTail_Load=function(){var undefined;$iTXT.ui.TooltipTail=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,init:function(_options,$super)
{var defOpts=$iTXT.core.Util.extend({id:"itxttail",height:22,bgcol:[],transparent:false},_options);$super(defOpts);this.width=46;this.height=22;this._build();this.resize();$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:tail:change:bgcol",$iTXT.core.Event.bind(this,this._changeBGCol)],["$iTXT:tt:tail:set:bgcol",$iTXT.core.Event.bind(this,this._setBGCol)],["$iTXT:tt:tail:set:hvcol",$iTXT.core.Event.bind(this,this._setHVCol)]],this.evtDspFuncs);},setPositionState:function(ps)
{this.options.ps=ps;if($iTXT.ui.TooltipPosition.BL==ps||$iTXT.ui.TooltipPosition.BR==ps)
{var tmpl=this.advert.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};this.options.transparent=(tmplopts.transparenttoptail===true);}
else
{this.options.transparent=false;}
this._build();this.resize();this._ubg();},_build:function()
{this.rootElement.innerHTML="";var ttps=$iTXT.ui.TooltipPosition;var marginArray1=[10,10,9,9,8,8,7,7,6,6,5,5,4,4,3,3,2,2,1,1,0,0];var marginArray2=[2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44];var arrayLength=22;var leftArray=marginArray1;var rightArray=marginArray2;if((ttps.BL==this.options.ps)||(ttps.AL==this.options.ps))
{leftArray=marginArray2;rightArray=marginArray1;}
var tailChildren=[];if((ttps.BR==this.options.ps)||(ttps.BL==this.options.ps))
{for(var i=(arrayLength-1);i>=0;i--)
{tailChildren.push(this._createDiv(leftArray[i],rightArray[i],this.options.bgcol[i]||'#ffffff'));}}
else
{for(var i=0;i<arrayLength;i++)
{tailChildren.push(this._createDiv(leftArray[i],rightArray[i],this.options.bgcol[i]||'#ffffff'));}}
this.rootElement.itxtAppendChildren(tailChildren);},_createDiv:function(lm,rm,bgc)
{return $iTXT.core.Builder.make("DIV",{style:"background-color: "+bgc+"; margin-left: "+lm+"px; margin-right:"+rm+"px"});},_ubg:function(c)
{var bgCol=this.options.bgcol;var defBg='#ffffff';if($iTXT.ui.tt.isMouseOver)
{bgCol=this.options.hbgcol;}
if(undefined!=this.customBgCol)
{bgCol=this.customBgCol;}
var template=this.advert.getTemplate();if(template&&template.options.dontColorTailTop&&(this.options.ps==$iTXT.ui.TooltipPosition.BR||this.options.ps==$iTXT.ui.TooltipPosition.BL))
{bgCol=[];}
if(this.options.transparent)
{bgCol=[];defBg='transparent';}
for(var i=0;i<this.rootElement.childNodes.length;i++)
{this.rootElement.childNodes[i].itxtSetStyle({backgroundColor:(bgCol[i]||defBg)});}},setAdvert:function(ad,$super)
{this.customBgCol=undefined;$super(ad);var adopts=ad.params;var tmpl=this.advert.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};this.options.bgcol=$iTXT.core.Util.parseColorArray(tmplopts.tttailcol||adopts.parse(adopts.get("tt.tail.col",$iTXT.ui.tt.options.bgcol)),this.options.height,"$$");this.options.hbgcol=$iTXT.core.Util.parseColorArray(tmplopts.tttailhcol||adopts.parse(adopts.get("tt.tail.h.col",$iTXT.ui.tt.options.hbgcol)),this.options.height,"$$");this._ubg();},_changeBGCol:function(e)
{if(e.data&&'string'==typeof e.data)
{this.customBgCol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");}
else
{this.customBgCol=undefined;}
this._ubg();},_setBGCol:function(e)
{if(this.advert)
{var template=this.advert.getTemplate();if(template&&template.options.dontColorTailTop&&(this.options.ps==$iTXT.ui.TooltipPosition.BR||this.options.ps==$iTXT.ui.TooltipPosition.BL))
{return;}
this.options.bgcol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");this._ubg();}},_setHVCol:function(e)
{if(this.advert)
{var template=this.advert.getTemplate();if(template&&template.options.dontColorTailTop&&(this.options.ps==$iTXT.ui.TooltipPosition.BR||this.options.ps==$iTXT.ui.TooltipPosition.BL))
{return;}
this.options.hbgcol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");this._ubg();}},tooltipOver:function()
{this._ubg();},tooltipOut:function()
{this._ubg();}});}
$iTXT.js.loader["$iTXT.ui.ComponentBase"]=true;$iTXT.ui.ComponentBase_Load=function(){var undefined;$iTXT.ui.ComponentBase=$iTXT.core.Class.create({options:null,rootElement:null,width:undefined,height:undefined,left:undefined,top:undefined,componentParams:{},evtDspFuncs:null,init:function(_options)
{this.evtDspFuncs=[];this.options=$iTXT.core.Util.extend({id:"itxtcomponent",className:""},_options);this.defaultOptions=$iTXT.core.Util.cloneObject(this.options);this.advert=this.options.advert;this.children=[];this.rootElement=$iTXT.core.Builder.make("DIV",{id:this.options.id,className:this.options.className});this.params=new $iTXT.data.Param(undefined,undefined,undefined,this.options.id);this.params.set(this.componentParams,null,$iTXT.cnst.WEIGHTING_DEFAULT_COMPONENT);this._tokenizeOptions();},dispose:function()
{if(this.rootElement.parentNode)
{this.rootElement.parentNode.removeChild(this.rootElement);}
for(var i=0;i<this.evtDspFuncs.length;i++)
{var f=this.evtDspFuncs[i];if('function'==typeof f)
{f.call();}}
this.evtDspFuncs=[];},resize:function()
{this.setSize(this.width,this.height);},setSize:function(w,h)
{this.width=w;this.height=h;this.rootElement.itxtSetStyle({width:this.width+"px",height:this.height+"px"});},setPosition:function(l,t)
{this.left=l;this.top=t;this.rootElement.itxtSetStyle({left:this.left+"px",top:this.top+"px"});},getWidth:function()
{return this.width||this.rootElement.offsetWidth;},getHeight:function()
{return this.height||this.rootElement.offsetHeight;},getLeft:function()
{return this.left||this.rootElement.offsetLeft;},getTop:function()
{return this.top||this.rootElement.offsetTop;},addChild:function(childComp)
{if(childComp&&childComp.rootElement)
{this.children.push(childComp);this.rootElement.appendChild(childComp.rootElement);}},addChildren:function(children)
{if(!children)
return;for(childComp in children)
{this.addChild(children[childComp]);}},removeChild:function(childComp)
{$iTXT.core.Util.without(this.children,childComp);this.rootElement.removeChild(childComp.rootElement);},show:function()
{var re=$iTXT.core.$(this.rootElement);if(re){re.itxtShow()};},hide:function()
{var re=$iTXT.core.$(this.rootElement);if(re){re.itxtHide()};},getHTML:function()
{if(this.rootElement)
{return $iTXT.core.Builder.make("DIV",{},[this.rootElement]).innerHTML;}
return"";},setBackgroundColor:function(c)
{this.rootElement.itxtSetStyle({backgroundColor:c});},setAdvert:function(a)
{this.advert=a;this._tokenizeOptions();},changeAdvert:function(a)
{this.advert=a;this._tokenizeOptions();},_tokenizeOptions:function()
{if(null!=this.advert&&this.advert.params)
{this.params.setParent(this.advert.params);}
else if($iTXT.glob.params)
{this.params.setParent($iTXT.glob.params);}
this.options=$iTXT.core.Util.cloneObject(this.defaultOptions);this.options=this.params.tokenize(this.options);},tooltipOver:function()
{},tooltipOut:function()
{}});}
$iTXT.js.loader["$iTXT.ui.TooltipContent"]=true;$iTXT.ui.TooltipContent_Load=function(){var undefined;var loadingImage="http://images.intellitxt.com/ast/tt/09/loading.gif";$iTXT.core.Util.cacheImage(loadingImage);$iTXT.ui.TooltipContent=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,template:null,loading:false,ccTS:null,advert:null,heightOverlap:0,drawers:null,init:function(_options,$super)
{this.componentParams=$iTXT.core.Util.extend({'tt.loading.img':'${tt.img.dir}loading.gif'},this.componentParams);var defOpts=$iTXT.core.Util.extend({id:"itxtcontent",loadingImage:"${tt.loading.img}"},_options);$super(defOpts);var o=this.options;$iTXT.core.Util.cacheImages([o.loadingImage]);this.width=300;this.height=100;this.rootElement.itxtSetStyle({overflow:"hidden"});this.loadingImg=$iTXT.core.Builder.make("IMG",{src:o.loadingImage,id:this.options.id+"LdgImg",style:"position: absolute; left: 50%; top: 50%;"});this.loadingDiv=$iTXT.core.Builder.make("DIV",{id:this.options.id+"Ldg",style:"position: absolute; display: none;"},[this.loadingImg]);this.rootElement.appendChild(this.loadingDiv);this.resize();this.rootElement.itxtBatchSubscribe([["mouseover",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:cnt:mouse:over",e);}],["mouseout",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:cnt:mouse:out",e);}]],this.evtDspFuncs);$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:content:drawer:add",$iTXT.core.Event.bind(this,this._addDrawerContent)],["$iTXT:tt:content:drawer:open",$iTXT.core.Event.bind(this,this._showDrawerContent)],["$iTXT:tt:content:drawer:close",$iTXT.core.Event.bind(this,this._hideDrawerContent)],["$iTXT:tt:content:drawers:reset",$iTXT.core.Event.bind(this,this._resetDrawers)],["$iTXT:tt:close:btn:click",$iTXT.core.Event.bind(this,this._hdrCloseClk)],["$iTXT:tt:what:btn:click",$iTXT.core.Event.bind(this,this._hdrWhatsClk)],["$iTXT:tt:vmlogo:click",$iTXT.core.Event.bind(this,this._hdrVMLogoClk)],["$iTXT:function:setClickThrough",$iTXT.core.Event.bind(this,this._setClickThrough)],["$iTXT:tt:content:change:ad",$iTXT.core.Event.bind(this,this.changeAdvert)]],this.evtDspFuncs);this.drawers=[];},setSize:function(w,h,$super)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"TooltipContent.setSize("+w+", "+h+")");$super(w,h);this.loadingDiv.itxtSetStyle({width:w+"px",height:h+"px"});this.loadingImg.itxtSetStyle({marginLeft:-(this.loadingImg.offsetWidth/2)+"px",marginTop:-(this.loadingImg.offsetHeight/2)+"px"});},resize:function(w,h,force)
{if(null!=this.template)
{var nW=w||this.currentWidth||this.template.defaultWidth;var nH=h||this.currentHeight||this.template.defaultHeight;this.setSize(nW,nH);var dim=this.template.resize(nW,nH,force);if(!force)
{this.width=dim[0];this.height=dim[1];}}
this.setSize(this.width,this.height);this._resizeDrawers();},hideContent:function()
{if(null!=this.template&&null!=this.template.rootElement)
{this.template.rootElement.style.visibility="hidden";}},showContent:function()
{if(null!=this.template&&null!=this.template.rootElement)
{this.template.rootElement.style.visibility="visible";if(this.template.afterShow)
{this.template.afterShow();}}},tryResize:function(w,h)
{if(null!=this.template)
{var nW=w||this.currentWidth||this.template.defaultWidth;var nH=h||this.currentHeight||this.template.defaultHeight;var dim=this.template.resize(nW,nH);this.width=dim[0];this.height=dim[1];}
return[this.width,this.height];},setContentSize:function(w,h,hO)
{if(hO)
{this.heightOverlap=hO;}
$iTXT.debug.debug($iTXT.debug.Category.UI,"setContentSize("+w+", "+h+")");this.currentWidth=w;this.currentHeight=h;this.resize(null,null,true);},setAdvert:function(ad,$super)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Set New Tooltip Advert");$super(ad);this.ccTS=(new Date()).getTime();this._changeAdvert(ad);},changeAdvert:function(e,$super)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Update Tooltip Advert");$super(e.data);this._changeAdvert(e.data);},_changeAdvert:function(ad,$super)
{if(!ad)
{return;}
this.loadingImg.src=this.options.loadingImage;this.heightOverlap=0;var h=this.advert.params.get("FTROVERLAP");if(null!=h)
{this.heightOverlap=h;}
this.currentWidth=undefined;this.currentHeight=undefined;if(this.template)
{this.template.remove();this.template=null;}
this.template=this.advert.getTemplate();if(null!=this.template)
{this.rootElement.appendChild(this.template.rootElement);window.setTimeout($iTXT.core.Event.bind(this,this._handleAdvert),1);if(!this.advert.template.fullyBuilt)
{this.setLoading(true);}}},_handleAdvert:function()
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Calling the templates advert handler");var adHandler=this.template.getAdvertHandler();adHandler.handle($iTXT.core.Event.bind(this,this._handleAdvertCallback));},_handleAdvertCallback:function()
{this.template.buildTemplate($iTXT.core.Event.bind(this,this._templateLoadCallback));},_templateLoadCallback:function(templateNode)
{$iTXT.debug.info($iTXT.debug.Category.UI,"All Template Content Loaded");var td=(new Date()).getTime()-this.ccTS;var tout=Math.max(250-td,0);$iTXT.debug.info($iTXT.debug.Category.UI,"Sleeping Template Display For: "+tout+"ms");window.setTimeout($iTXT.core.Event.bind(this,this._allLoaded),tout);},beforeOpen:function()
{if(null!=this.template)
{this.template.beforeOpen();}},afterOpen:function()
{if(null!=this.template)
{this.template.afterOpen();}},beforeClose:function()
{if(null!=this.template)
{this.template.beforeClose();}},afterClose:function()
{if(null!=this.template)
{this.template.afterClose();this.template.remove();this.template=null;}},getTemplateDefaultWidth:function()
{return this.template?this.template.defaultWidth:0;},getTemplateDefaultHeight:function()
{return this.template?this.template.defaultHeight:0;},getExpandedWidth:function()
{return this.template?(this.template.expandedWidth||this.template.defaultWidth):0;},getExpandedHeight:function()
{return this.template?(this.template.expandedHeight||this.template.defaultHeight):0;},setLoading:function(b)
{this.loading=b;if(this.loading)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Tooltip Loading: <b>true</b>");if(""!=this.options.loadingImage)
{this.loadingDiv.itxtShow();}
if(this.template)
{this.template.onHide();}
this.hideContent();}
else
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Tooltip Loading: <b>false</b>");this.loadingDiv.itxtHide();if(this.template)
{this.template.onShow();}
this.showContent();}},_allLoaded:function()
{$iTXT.core.$(document).itxtFire("$iTXT:tt:resize:smooth",$iTXT.core.Event.bind(this,this._finishSmoothRs));},_finishSmoothRs:function()
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Tooltip smooth resize finished!");this.setLoading(false);},getWidth:function()
{return parseInt(this.width);},getHeight:function()
{return parseInt(this.height);},_addDrawerContent:function(e)
{var d=e.data||null;if(null!=d)
{this.rootElement.itxtAppendChild(d.drawerContent);d.setSize(this.width,this.height);d.drawerContent.itxtSetStyle({left:"0px",top:this.height+"px"});this.drawers.push(d);}},_showDrawerContent:function(e)
{var openDrawer=e.data||null;var closeDrawer;for(var i=0;i<this.drawers.length;i++)
{var dr=this.drawers[i];if(openDrawer!=dr&&dr.isOpen)
{closeDrawer=dr;break;}}
if(openDrawer&&closeDrawer)
{new $iTXT.fx.Queue(new $iTXT.fx.Move({target:dr.drawerContent,dX:0,y:this.height,duration:150,afterFinish:function(){closeDrawer.startHide();}})).push(new $iTXT.fx.Move({target:openDrawer.drawerContent,dX:0,y:0,duration:150,afterFinish:function(){openDrawer.finishShow();}}));}
else if(openDrawer)
{new $iTXT.fx.Move({start:true,target:openDrawer.drawerContent,dX:0,y:0,duration:150,afterFinish:function(){openDrawer.finishShow();}})}},_hideDrawerContent:function(e)
{var closeDrawer=e.data||null;if(null!=closeDrawer)
{closeDrawer.startHide();new $iTXT.fx.Move({start:true,target:closeDrawer.drawerContent,dX:0,y:this.height,duration:150})}},_resetDrawers:function()
{if(this.drawers)
{for(var i=0;i<this.drawers.length;i++)
{var d=this.drawers[i];this.rootElement.removeChild(d.drawerContent);}}
this.drawers=[];},_resizeDrawers:function()
{if(!this.drawers)
return;for(var i=0;i<this.drawers.length;i++)
{var d=this.drawers[i];d.setSize(this.width,this.height);if(!d.isOpen)
{d.drawerContent.itxtSetStyle({top:this.height+"px"});}}},_hdrCloseClk:function(e)
{if(this.template&&this.template.onCloseClick&&this.template.onCloseClick())
{e.closeSource=$iTXT.data.TTCloseSource.CLOSECLICK;$iTXT.core.$(document).itxtFire("$iTXT:tt:close",e);}},_hdrWhatsClk:function()
{if(this.template&&this.template.onWhatsThisClick&&this.template.onWhatsThisClick())
{this._defWhatsThisClk();}},_hdrVMLogoClk:function()
{if(this.template&&this.template.onVibrantLogoClick&&this.template.onVibrantLogoClick())
{this._defWhatsThisClk();}},_defWhatsThisClk:function()
{var adPms=this.advert.params;var wtcl=adPms.get("wtcl");if(wtcl&&"template"==wtcl)
{var opts={mt:20,mv:adPms.get("A.AT"),ipid:adPms.get("IPID")};$iTXT.fire("$iTXT:data:log:monitor",opts);}},_setClickThrough:function(e)
{var opts=e.data||{};if(opts.url){if(opts.did!=this.advert.did){$iTXT.debug.debug($iTXT.debug.Category.UI,"opts.did ("+opts.did+") does not match advert.did ("+this.advert.did+"), ignoring");return;}
this.advert.params.set("CLICKTAG",opts.url,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}},clearContent:function()
{if(this.template)
{this.template.remove();this.template=null;}}});}
$iTXT.js.loader["$iTXT.ui.Hook"]=true;$iTXT.ui.Hook_Load=function(){var undefined;$iTXT.ui.HookManager={id:0,hookedCounter:0,textNodes:[],hooks:[],startIndex:0,unHookedHooks:[],initSkip:0,maxKWNode:5,maxKWPara:5,keywordPadding:0,keywordInterval:0,placePerParagraph:0,paragraphCounts:{},nodeID:1,add:function(hook)
{if(hook)
{hook.id=this.id++;this.hooks.push(hook);}},get:function(id)
{for(var i=1;i<this.hooks.length;i++)
{var hk=this.hooks[i];if(hk.id==id)
{return hk;}}
return null;},list:function()
{return this.hooks;},execute:function(tn)
{this.setDefaultHookParameters();this.maxKWNode=Math.max(1,$iTXT.glob.params.getInt("kwpn",this.maxKWNode));this.maxKWPara=Math.max(1,$iTXT.glob.params.getInt("kwpp",this.maxKWPara));this.keywordPadding=$iTXT.glob.params.getInt("kwp",this.keywordPadding);this.keywordInterval=$iTXT.glob.params.getInt("hk.interval",this.keywordInterval);this.placePerParagraph=$iTXT.glob.params.getInt("ppp",this.placePerParagraph);this.initSkip=$iTXT.glob.params.getInt("skip",this.initSkip);$iTXT.debug.info($iTXT.debug.Category.HOOK,"Execute Hooking");$iTXT.debug.info($iTXT.debug.Category.HOOK,"ppp: "+this.placePerParagraph+", kwpn: "+this.maxKWNode+", kwpp: "+this.maxKWPara+", kwp: "+this.keywordPadding+", hk.interval: "+this.keywordInterval);if(!tn)
{if(this.placePerParagraph&&$iTXT.data.Context.paragraphNodes.length>0)
{tn=$iTXT.core.$A($iTXT.data.Context.paragraphNodes);$iTXT.debug.info($iTXT.debug.Category.HOOK,"Hooking in Paragraph Mode");}
else
{if(this.placePerParagraph)
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"No Paragraphs, Falling Back To Node Mode");}
else
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"Hooking in Node Mode");}
this.placePerParagraph=0;tn=$iTXT.core.$A($iTXT.data.Context.textNodes);}}
tn=$iTXT.core.$A(tn);if(this.initSkip>0)
{var sn=tn.splice(0,this.initSkip);var i=sn.length;$iTXT.debug.debug($iTXT.debug.Category.HOOK,'Skipping initial '+i+' out of '+(sn.length+tn.length)+((this.placePerParagraph)?' paragraphs':' nodes')+' (skip was '+this.initSkip+')');while(i--)
{var sTn=($iTXT.core.Util.isArray(sn[i]))?sn[i]:[sn[i]];var j=sTn.length;while(j--)
{$iTXT.debug.Util.hilite(sTn[j],$iTXT.debug.Util.HL_COL_INIT,null,true);}}}
this.textNodes=$iTXT.core.$A(tn);this._findAllHooks();if(this.hooks.length>0)
{this.textNodes.itxtEach(function(n)
{if(this.placePerParagraph)
{$iTXT.core.$A(n).itxtEach(function(pn)
{var hks=this._getHooks(pn);if(hks.length>0)
{this._hookNode(pn,hks);}},this);}
else
{var hks=this._getHooks(n);if(hks.length>0)
{this._hookNode(n,hks);}}},this);}
$iTXT.fire("$iTXT:hooks:loaded",this.hooks);},_findAllHooks:function()
{this.unHookedHooks=this.hooks;this.hooks=[];if(this.unHookedHooks.length>0)
{var track=$iTXT.glob.params.get("ti");if(null!=track)
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,"Dropping Channel Hook Tracking Image (ti): "+track);$iTXT.core.Util.dropImage(track);}
if(this.placePerParagraph)
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"Finding Hooks: "+this.unHookedHooks.length+" hooks to find in "+this.textNodes.length+" hookable paragraphs.");}
else
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"Finding Hooks: "+this.unHookedHooks.length+" hooks to find in "+this.textNodes.length+" hookable nodes.");}
var nodesSinceHook=this.keywordInterval;var extraMask=0;this.textNodes.itxtEach(function(o)
{if(this.placePerParagraph)
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"Searching Paragraph Containing "+o.length+" text nodes.");var pHookCount=0;$iTXT.core.$A(o).itxtEach(function(pn)
{var sd=this._searchNode(pn,pHookCount,this.maxKWPara,extraMask,nodesSinceHook);var nc=sd.nc;extraMask=sd.lo;$iTXT.debug.info($iTXT.debug.Category.HOOK,"Found "+nc+" hooks in paragraph node.");pHookCount+=nc;},this);if(pHookCount>0)
{nodesSinceHook=1;}
else
{nodesSinceHook++;}}
else
{var sd=this._searchNode(o,0,this.maxKWNode,extraMask,nodesSinceHook);var nc=sd.nc;$iTXT.debug.info($iTXT.debug.Category.HOOK,"Found "+nc+" hooks in node.");extraMask=sd.lo;if(nc>0)
{nodesSinceHook=1;}
else
{nodesSinceHook++;}}},this);}
else
{$iTXT.debug.error($iTXT.debug.Category.HOOK,"No Hooks!!!!");}},_searchNode:function(n,nc,maxHooks,extraMask,nodesSinceLastHook)
{if(nodesSinceLastHook<this.keywordInterval)
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,"Not hooking in Node as we hooked "+nodesSinceLastHook+" node(s)/paragraph(s) ago, and keyword node interval is "+this.keywordInterval);return{nc:0,lo:0};}
var nodeHookCount=nc;var thisNC=0;var stillUnHooked=[];var nodeText=$iTXT.core.Util.getNodeText(n);$iTXT.debug.trace($iTXT.debug.Category.HOOK,"Searching Node: "+nodeText);var leftOverMask=0;extraMask=extraMask||0;if(extraMask>0)
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,extraMask+" characters extra masking carried over from previous node: ");var mask=this._maskHookText(0,extraMask,nodeText);nodeText=mask.text;leftOverMask=mask.leftover;}
for(var i=0;i<this.unHookedHooks.length;i++)
{var hk=this.unHookedHooks[i];if(null==hk.childSpans)
{var found=false;$iTXT.debug.debug($iTXT.debug.Category.HOOK,"Looking For Hook: "+hk.options.value);if(nodeHookCount<maxHooks)
{found=this._findHookByNode(hk,nodeText,n);}
if(found)
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,"<b style='color: red'>Found Hook: "+hk.options.value+"</b>");this.hooks.push(hk);var mask=this._maskHookText(hk.details.s-this.keywordPadding,hk.details.e+this.keywordPadding,nodeText);nodeText=mask.text;leftOverMask=mask.leftover;nodeHookCount++;thisNC++;}
else
{stillUnHooked.push(hk);}}}
this.unHookedHooks=stillUnHooked;return{nc:thisNC,lo:leftOverMask};},_maskHookText:function(s,e,text)
{var maskStart=s;if(maskStart<0)
maskStart=0;var maskEnd=e;var leftover=0;if(maskEnd>text.length)
{leftover=maskEnd-text.length;maskEnd=text.length;}
var rs=text.substring(0,maskStart);rs+=$iTXT.core.Util.strRepeat("#",maskEnd-maskStart);rs+=text.substring(maskEnd);$iTXT.debug.trace($iTXT.debug.Category.HOOK,"<b style='color: green'>Masking Text: '"+rs+"'</b> (from: '"+text+"')");return{text:rs,leftover:leftover};},_findHookByNode:function(hk,t,n)
{var kw=hk.options.value;kw=kw.replace(/(\+|\(|\.|\[|\-|\$|\<|\{|\%|\!|\)|\]|\?)/g,'\\$1');kw=kw.replace(/\ /g,'\\s+');var flags="gm";if(!hk.options.cs)
{flags+="i";}
var leftREChars="(\\b|\u201C|\u2018|\\s)",rightREChars="(\\b|\u201D|\\s|\\.|\\,|\\?|\\!)"
plauralChars="(?:[\x27\u2019]s?)?";var kwRegEx=new RegExp(leftREChars+kw+rightREChars+plauralChars,flags);var match,foundHk=false,offset=0;while((match=kwRegEx.exec(t))&&!foundHk)
{var kwMatch=match[0];if(kwMatch.length>0)
{foundHk=true;}
var he=(typeof(match.lastIndex)=='undefined'?kwRegEx.lastIndex:match.lastIndex);var kwl=kwMatch.length;var hs=he-kwl;if(1==$iTXT.glob.params.get('hk.cap.subterm',0))
{var kwS=hs,kwE=he;for(kwS=hs;kwS<kwE;kwS++)
{if(!t.substr(kwS,1).match(/\s/))
{break;}}
if(this._isCapitalisedSubTerm(t,kwS,kwE))
{foundHk=false;}}
if(foundHk)
{var hkLc=kwMatch.charAt(0);var hkRc=kwMatch.charAt(kwMatch.length-1);if(this._isNonBorderChar(hkLc))
{hs++;kwl--;kwMatch=kwMatch.substring(1,kwMatch.length);}
if(this._isNonBorderChar(hkRc))
{he--;kwl--;kwMatch=kwMatch.substring(0,kwMatch.length-1);}
var lc=t.substring(hs-1,hs);var rc=t.substring(he,he+1);if((lc=='-')||(lc.charCodeAt(0)==92)||(lc=='$')||(lc=='£')||(lc=='€')||(lc=='/')||(lc=='@')||(rc=='-'))
{foundHk=false;}
if(((lc.charCodeAt(0)>127)&&(lc.charCodeAt(0)!=0x201C)&&(lc.charCodeAt(0)!=0x2018)&&(lc.charCodeAt(0)!=160))||((rc.charCodeAt(0)>127)&&(rc.charCodeAt(0)!=0x201D)&&(rc.charCodeAt(0)!=0x2019)&&(rc.charCodeAt(0)!=39)&&(rc.charCodeAt(0)!=8230)&&(rc.charCodeAt(0)!=160))||(/[a-z\u0600-\u06ff]/.test(lc)))
{foundHk=false;}}
if(foundHk)
{hk.details={n:n,s:hs+offset,e:he+offset,kw:kwMatch};}
t=t.substring(he);offset+=he;kwRegEx.lastIndex=0;}
return foundHk;},_hookNode:function(n,hks)
{var newNodes=[];var pos=0;var text=$iTXT.core.Util.getNodeText(n);var followingText=text;hks.sort(function(a,b)
{if(a.details&&b.details)
{return(a.details.s-b.details.s);}
return 0;});for(var i=0;i<hks.length;i++)
{var hk=hks[i];hk.options.id=this.hookedCounter;hk.setKeyword(hk.details.kw);if(hk.details)
{$iTXT.fire("$iTXT:hook:hooked",hk);$iTXT.debug.info($iTXT.debug.Category.HOOK,"Creating Hook: {0} (HTML_id: {1}, id:{2}, idh: {3}, start: {4})",hk.options.value,hk.options.id,hk.options.uid,hk.options.uidh,hk.options.s);var leadingText=document.createTextNode(text.substring(pos,hk.details.s));$iTXT.debug.debug($iTXT.debug.Category.HOOK,"Leading Text: "+leadingText.nodeValue);followingText=text.substring(hk.details.e,text.length);$iTXT.debug.debug($iTXT.debug.Category.HOOK,"Following Text: "+followingText);newNodes.push(leadingText);newNodes.push(hk.getHook());pos=hk.details.e;this.hookedCounter++;}}
if(newNodes.length>0)
{newNodes.push(document.createTextNode(followingText));var pNode=n.parentNode;if(pNode)
{for(var i=0;i<newNodes.length;i++)
{pNode.insertBefore(newNodes[i],n);}
pNode.removeChild(n);}}},_getHooks:function(n)
{var newArr=[];for(var i=0;i<this.hooks.length;i++)
{var hk=this.hooks[i];if(hk.details.n==n)
{newArr.push(hk);}}
return newArr;},_isNonBorderChar:function(c)
{return c==' '||c=='\n'||c=='\r'||c=='?'||c=='!'||c==','||c=='.'||c=='\u201C'||c=='\u2018';},_isCapitalisedSubTerm:function(t,s,e)
{var kw=t.substring(s,e);if(!$iTXT.core.Util.hasCapitals(kw.substring(0,1)))
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,'<b>PASSED</b> keyword <b>"'+kw+'"</b> as it is itself not capitalised.');return false;}
var ssS=Math.max(0,t.lastIndexOf(' ',s-2)+1);var ssE=Math.min(t.indexOf(' ',e+2),t.length);var bef=(s>ssS)?$iTXT.core.Util.cleanString(t.substring(ssS,s)):null;var aft=(ssE>e)?$iTXT.core.Util.cleanString(t.substring(e,ssE)):null;if(bef&&$iTXT.core.Util.hasPunctuation(bef.substr((bef.length-1),1)))
{bef=null;}
if(aft&&$iTXT.core.Util.hasPunctuation(aft.substr(0,1)))
{aft=null;}
var subT=t.substring(((s>ssS)?ssS:s),((ssE>e)?ssE:e));if((bef&&$iTXT.core.Util.hasCapitals(bef.substring(0,1)))||(aft&&$iTXT.core.Util.hasCapitals(aft.substring(0,1))))
{$iTXT.debug.debug($iTXT.debug.Category.HOOK,'<b>REJECTED</b> keyword <b>"'+kw+'"</b> as containing text <b>"'+subT+'"</b> has capitalised terms.');return true;}
$iTXT.debug.debug($iTXT.debug.Category.HOOK,'<b>PASSED</b> keyword <b>"'+kw+'"</b> against containing text <b>"'+subT+'"</b>.');return false;},getNodeTag:function(o)
{if(o&&o.nodeType)
{var nT=o.nodeType;if($iTXT.core.Util.ELEMENT_NODE==nT)
{if(o.ndPar)
{return o.ndPar['this'];}
o.ndPar=new Object();}
else
{var pn=o.parentNode;if($iTXT.core.Util.TEXT_NODE==nT)
{if(o.parentNode.ndPar)
{return o.parentNode.ndPar[$iTXT.core.Util.nodeIndex(o)];}}}}
return null;},setDefaultHookParameters:function()
{if($iTXT.glob.params)
{var gps=$iTXT.glob.params;var wdb=$iTXT.cnst.WEIGHTING_DEFAULT_DATABASE;gps.set("hk.class","itxthook",wdb);gps.set("hk.class.active","itxthookactive",wdb);gps.set("hk.icon","",wdb);gps.set("hk.icon.active","",wdb);gps.set("hk.icon.path","http://images.intellitxt.com/ast/adTypes/",wdb);gps.set("fg","#006400",wdb);gps.set("bg","transparent",wdb);gps.set("hk.fg.col","${fg}",wdb);gps.set("hk.fg.h.col","#006400",wdb);gps.set("hk.bg.col","transparent",wdb);gps.set("hk.bg.h.col","${bg}",wdb);gps.set("hk.def.style","text-decoration: underline; border-bottom: 1px solid ${hk.fg.col}; border-top: none; color: ${hk.fg.col}; background-color: ${hk.bg.col}",wdb);gps.set("hk.def.h.style","text-decoration: underline; border-bottom: 0.2em solid ${hk.fg.h.col}; border-top: none; color: ${hk.fg.h.col}; background-color: ${hk.bg.h.col}",wdb);gps.set("hk.style","${hk.def.style}",wdb);gps.set("hk.h.style","${hk.def.h.style}",wdb);}}}
$iTXT.ui.Hook=$iTXT.core.Class.create({options:null,isActive:false,childSpans:null,mouseOver:false,mouseOutFireTID:-1,mouseOverTS:null,mouseOverPos:null,delayedOverTO:-1,init:function(_options)
{this.defaultOptions=this.options=$iTXT.core.Util.extend({id:0,uid:"id",uidh:"idh",clickUrl:"#",className:"${hk.class}",activeClassName:"${hk.class.active}",hookIconPath:'${hk.icon.path}',hookIconSrc:"${hk.icon}",activeHookIconSrc:"${hk.icon.active}",hookIconStyle:"${hk.icon.style}",value:"hook",hookStyle:"${hk.style}",hookActiveStyle:"${hk.h.style}"},_options);$iTXT.ui.HookManager.add(this);this.keyword=this.options.value;this.setAdvert(this.options.advert||new $iTXT.data.Advert($iTXT.tmpl.TestTemplate,{title:"Hello World!",link:"http://www.google.com",ttthbg:"yellow"}));},setAdvert:function(ad)
{this.ad=ad;this.ad.params.set("H.ID",this.options.uid,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.ad.params.set("H.IDH",this.options.uidh,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);this.ad.processAdvert();},setKeyword:function(kw)
{this.keyword=kw;this._buildHook();},setHookId:function(id)
{this.rootElement.id=id;},_buildHook:function()
{if(!this.ad)
return;this.ad.createTemplate();var adps=this.ad.params;var w=$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN;var at=this.ad.$A.at;var showIcon=adps.getBool("hk.has.icon",false);var p=new $iTXT.data.Param(adps);var eati=p.getBool("eati",false);if(eati||showIcon)
{if(at)
{var icon=p.get("atig"+at,p.get("atig"));if("none"==icon)
{p.set("hk.icon","",w);p.set("hk.icon.active","",w);}
else if(null!=icon)
{p.set("hk.icon",icon,w);p.set("hk.icon.active",icon,w);}
var atis=p.get("atis");if(null!=atis)
{p.set("hk.icon.style",atis,w);}}}
if(at)
{var ul=p.get("ul"+at);if(null!=ul)
{p.set("hk.style",ul,w);}
var hv=p.get("hv"+at);if(null!=hv)
{p.set("hk.h.style",hv,w);}}
var hks=p.get("hk.style");if(null!=hks&&""!=hks&&"${hk.def.style}"!=hks)
{var hkhs=p.get("hk.h.style");if(hkhs==null||""==hkhs||"${hk.def.h.style}"==hkhs)
{p.set("hk.h.style","${hk.style};background-color:${hk.bg.h.col};",$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}}else{p.set("hk.style","${hk.def.style};padding-bottom:1px;",$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);p.set("hk.h.style","${hk.def.h.style};padding-bottom:1px;",$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}
this.ad.template.onBuildHookStyle(this.defaultOptions);this.options=$iTXT.core.Util.cloneObject(this.defaultOptions);this.options=p.tokenize(this.options);if(this.rootElement)
{}
var b=$iTXT.core.Builder;this.childSpans=[];var wordsNoSpaces=this.keyword.split(/\s/);var hookWords=[];for(var wi=0;wi<wordsNoSpaces.length;wi++)
{var w=wordsNoSpaces[wi];if(wi>0)
{hookWords.push(" ");}
if(-1!=w.indexOf("-"))
{if("-"==w.charAt(0))
{hookWords.push("-");}
var hyPts=w.split("-");for(var hi=0;hi<hyPts.length;hi++)
{if(hi>0)
{hookWords.push("-");}
hookWords.push(hyPts[hi]);}
if("-"==w.charAt(w.length-1))
{hookWords.push("-");}}
else
{hookWords.push(w);}}
var kwID=0;var spanStyle="background:transparent; font-size:inherit; font-color:inherit;font-weight:inherit;";if($iTXT.core.Browser.is("Chrome")||$iTXT.core.Browser.is("Safari"))
{spanStyle+="padding-bottom: 2px";}
for(var i=0;i<hookWords.length;i++)
{var txt=hookWords[i];if(" "==txt)
{txt=document.createTextNode(" ");}
else if(txt.indexOf("&")!=-1)
{txt=txt.replace("&","&amp;");}
var hkw=b.make("SPAN",{id:("itxthook"+this.options.id+"w"+kwID),className:"itxthookspan",style:spanStyle},[txt]);if(i==(hookWords.length-1)&&""!=this.options.hookIconSrc)
{this.hookIcon=b.make("IMG",{className:"itxthookicon",id:("itxthook"+this.options.id+"icon"),src:(this.options.hookIconPath+this.options.hookIconSrc),style:this.options.hookIconStyle});var nobr=b.make("NOBR",{id:("itxthook"+this.options.id+"w"+kwID+"nobr"),className:"itxthooknobr"},[hkw,this.hookIcon]);this.childSpans.push(nobr);}
else
{this.childSpans.push(hkw);}
kwID++;}
this.rootElement=b.make("A",{href:this.options.clickUrl,id:"itxthook"+this.options.id,rel:"nofollow"},this.childSpans);this.rootElement.itxtSetStyle(this.options.hookStyle);this.rootElement.itxtSubscribe("mouseover",$iTXT.core.Event.bind(this,this._onMouseOver));this.rootElement.itxtSubscribe("mouseout",$iTXT.core.Event.bind(this,this._onMouseOut));this.rootElement.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._onClick));this.ad.setHook(this);this.updateHookStyle();},updateHookStyle:function()
{if(this.isActive)
{this.rootElement.itxtAddClass(this.options.activeClassName,this.options.className);if(""!=this.options.hookIconSrc&&""!=this.options.activeHookIconSrc)
{this.hookIcon.src=this.options.hookIconPath+this.options.activeHookIconSrc;}
this.rootElement.style.cssText=this.options.hookActiveStyle;}
else
{this.rootElement.itxtAddClass(this.options.className,this.options.activeClassName);if(""!=this.options.hookIconSrc)
{this.hookIcon.src=this.options.hookIconPath+this.options.hookIconSrc;}
this.rootElement.style.cssText=this.options.hookStyle;}
this._updateSpanCol();},getHook:function()
{return this.rootElement;},isWrapped:function()
{if(this.childSpans.length==1)
return false;var span1Off=this.childSpans[0].itxtTotalOffset();var span2Off=this.childSpans[this.childSpans.length-1].itxtTotalOffset();return(span1Off.top!=span2Off.top);},_onMouseOver:function(e)
{var target=e.srcElement||e.target;if(this.mouseOutFireTID!=-1)
{window.clearTimeout(this.mouseOutFireTID);this.mouseOutFireTID=-1;}
if(target==this.rootElement)
{$iTXT.core.$(document).itxtFire("$iTXT:hook:in",{hookid:this.options.id,hook:this});return;}
if(!this.mouseOver)
{$iTXT.debug.info($iTXT.debug.Category.HOOK,"Mouse over hook: "+this.options.value);this.mouseOverTS=(new Date()).getTime();var doc=document.documentElement;this.mouseOverPos={x:e.clientX+doc.scrollLeft,y:e.clientY+doc.scrollTop};var t=this;this.delayedOverTO=setTimeout(function(){t.fireMouseOver(target);},10);}},fireMouseOver:function(target)
{this.mouseOver=true;target.itxtSetStyle({position:"relative"});var tOff=$iTXT.core.$(target).itxtTotalOffset();target.itxtSetStyle({position:""});var bb={left:tOff.left,top:tOff.top,width:target.offsetWidth,height:target.offsetHeight};$iTXT.core.$(document).itxtFire("$iTXT:hook:over",{bounds:bb,hookid:this.options.id,hook:this});},_onMouseOut:function(e)
{if(this.delayedOverTO!=-1)
{clearTimeout(this.delayedOverTO);}
if(this.mouseOver)
{var t=this;this.mouseOutFireTID=window.setTimeout(function(){t._mouseOutFire(e)},20);}},_mouseOutFire:function(e)
{this.mouseOver=false;var len=(new Date()).getTime()-this.mouseOverTS;$iTXT.core.$(document).itxtFire("$iTXT:hook:out",{hookid:this.options.id,hook:this,len:len});},_onClick:function(e)
{var src=(e.target==this.hookIcon)?$iTXT.data.ClickSource.ICON:$iTXT.data.ClickSource.KEYWORD;$iTXT.core.$(document).itxtFire("$iTXT:hook:click",{source:src,hookid:this.options.id,hook:this});return false;},setState:function(s)
{this.isActive=s;this.updateHookStyle();},getPosition:function()
{return this.rootElement.itxtTotalOffset();},setHookStyle:function(s,as)
{if(s)
{this.options.hookStyle=s;}
if(as)
{this.options.hookActiveStyle=as;}
this.updateHookStyle();},_updateSpanCol:function()
{var c=this.rootElement.style.color;for(var i=0;i<this.childSpans.length;i++)
{this.childSpans[i].style.color=c;}}});}
$iTXT.js.loader["$iTXT.ui.TooltipSlideOut"]=true;$iTXT.ui.TooltipSlideOut_Load=function(){var undefined;$iTXT.ui.TooltipSlideOutDirection={LEFT:'L',RIGHT:'R',UP:'U',DOWN:'D'};$iTXT.ui.TooltipSlideOut=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{css3Mode:false,open:false,opening:false,ttWidth:0,ttHeight:0,offsetLeft:0,offsetTop:0,closeDX:0,closeDY:0,ison:false,init:function(_options,$super)
{this.css3Mode=$iTXT.core.Browser.supportsFeature('cssgradients','cssborderradius');this.componentParams={'tt.so.width':300,'tt.so.height':250,'tt.so.img.dir':'http://images.intellitxt.com/ast/vmimages/ttso/','tt.so.btn.off':'${tt.so.img.dir}close_off.gif','tt.so.btn.on':'${tt.so.img.dir}close_on.gif','iefh':'','tt.so.content':'${iefh}'};var defOpts=$iTXT.core.Util.extend({id:"itxtslideout",headerHeight:21,margins:[6,4,2,2,1,1],background:"#545454",opacity:0.85,title:"${sspl}",direction:"L",padding:10,content:"${tt.so.content}",duration:500,width:'${tt.so.width}',height:'${tt.so.height}',btnOff:'${tt.so.btn.off}',btnOn:'${tt.so.btn.on}'},_options);$super(defOpts);this.rootElement.itxtSetStyle({position:'absolute'});if(this.css3Mode)
{this.rootElement.appendChild(this._buildBgCSS3());}
else
{this.rootElement.appendChild(this._buildBg());}
this.rootElement.appendChild(this._buildHeader());this.rootElement.appendChild(this._buildContent());$iTXT.core.$(document).itxtSubscribe("$iTXT:tt:open",$iTXT.core.Event.bind(this,this.ttOpen));},setSize:function(w,h)
{var d=$iTXT.ui.TooltipSlideOutDirection;var o=this.options;this.ttWidth=w;this.ttHeight=h;this.width=parseInt(o.width)+(2*o.padding);this.height=parseInt(o.height)+o.padding+o.headerHeight;if(d.RIGHT==o.direction||d.LEFT==o.direction)
{this.height=this.ttHeight;this.width=Math.min(this.ttWidth,this.width);}
else
{this.width=this.ttWidth;this.height=Math.min(this.ttHeight,this.height);}
this._sizeContent();},setOffset:function(l,t)
{this.offsetLeft=l;this.offsetTop=t;},ttOpen:function()
{if(this.open||this.opening)
{return;}
if(this.ison)
{var d=$iTXT.ui.TooltipSlideOutDirection;var o=this.options;var ttl=$iTXT.ui.tt.getLeft();var winSize=$iTXT.core.Util.getWindowSize();var winW=winSize.width;var rightSpace=winW-ttl-this.ttWidth;var rightPercent=rightSpace/this.width;var leftSpace=ttl;var leftPercent=leftSpace/this.width;if(rightPercent>leftPercent)
{o.direction=d.RIGHT;}
else
{o.direction=d.LEFT;}
var startX=0,startY=0,moveX=0,moveY=0;if(d.RIGHT==o.direction)
{var diff=this.ttWidth-this.width;startX=diff;moveX=this.width-o.padding;this.headerTitle.itxtSetStyle({marginLeft:(o.padding*2)+"px"});this.headerBtn.itxtSetStyle({marginRight:"4px"});}
else if(d.LEFT==o.direction)
{var diff=this.ttWidth-this.width;moveX=-(this.width-o.padding);this.headerTitle.itxtSetStyle({marginLeft:(o.padding)+"px"});this.headerBtn.itxtSetStyle({marginRight:(o.padding+4)+"px"});}
else if(d.UP==o.direction)
{}
else if(d.DOWN==o.direction)
{}
this.rootElement.itxtSetStyle({left:(startX+this.offsetLeft)+"px",top:(startY+this.offsetTop)+"px",width:this.width+"px",height:this.height+"px"});this.content.itxtHide();this.show();this.closeDX=-moveX;this.closeDY=-moveY;var t=this;this.opening=true;var opts={target:this.rootElement,start:true,dX:moveX,dY:moveY,duration:this.options.duration,afterFinish:function()
{t.open=true;t.opening=false;t.content.innerHTML=o.content;t.content.itxtShow();}};new $iTXT.fx.Move(opts);}
else
{this.hide();}},close:function()
{var t=this;this.opening=true;var opts={target:this.rootElement,start:true,dX:this.closeDX,dY:this.closeDY,duration:this.options.duration,afterFinish:function()
{t.open=false;t.opening=false;t.hide();}};new $iTXT.fx.Move(opts);},setAdvert:function(ad,$super)
{$super(ad);this.open=this.opening=false;this.ison=ad.params.getBool("iesoa",false)&&ad.params.getBool("tmpl.soa.enabled",false);var o=this.options;this.headerTitle.innerHTML=o.title;var opts={ll:'0',llip:'0',hbll:'0',uf:null,ur:null};opts.so=$iTXT.data.ClickSource.LOGO;this.params.set('stub.tu',$iTXT.data.al.getClickURL(this,opts),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);opts.so=$iTXT.data.ClickSource.ICON;this.params.set('stub.t',$iTXT.data.al.getClickURL(this,opts),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);opts.so='0',opts.av=1;this.params.set('stub.av',$iTXT.data.al.getClickURL(this,opts,$iTXT.data.al.avPrms,true),$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);},_buildBgCSS3:function()
{var b=$iTXT.core.Builder;var o=this.options;this.bgElement=b.make("DIV");this.bgElement.itxtSetStyle({width:'100%',height:'100%',backgroundColor:o.background,opacity:o.opacity,filter:'alpha(opacity='+(o.opacity*100)+')','borderRadius':'7px','WebkitBorderRadius':'7px','MozBorderRadius':'7px'});return this.bgElement;},_buildBg:function()
{var b=$iTXT.core.Builder;var o=this.options;var topCorners=b.make("DIV");topCorners.itxtSetStyle({width:'100%',height:'6px'});for(var i=0;i<6;i++)
{topCorners.appendChild(this._createDiv(i));}
var bottomCorners=b.make("DIV");bottomCorners.itxtSetStyle({width:'100%',height:'6px'});for(var i=0;i<6;i++)
{bottomCorners.appendChild(this._createDiv(5-i));}
this.bgContent=b.make("DIV");this.bgContent.itxtSetStyle({backgroundColor:o.background,width:'100%',height:'100%'});this.bgElement=b.make("DIV",{},[topCorners,this.bgContent,bottomCorners]);this.bgElement.itxtSetStyle({width:'100%',height:'100%',opacity:o.opacity,filter:'alpha(opacity='+(o.opacity*100)+')'});return this.bgElement;},_createDiv:function(i)
{var lm=this.options.margins[i];var rm=this.options.margins[i];var d=$iTXT.core.Builder.make("DIV",{width:'auto',style:"overflow:hidden;padding:0;line-height:0;height:1px;font-size:1px;padding:0;background-color: "+this.options.background+";margin:0;margin-left:"+lm+"px;margin-right:"+rm+"px;"});return d;},_buildHeader:function()
{var b=$iTXT.core.Builder;var o=this.options;this.headerBtn=b.make("IMG",{src:o.btnOff,style:'vertical-align:middle;float:right;margin-right:4px;margin-top:4px;'});this.headerBtn.itxtSubscribe('mouseover',function(){this.src=o.btnOn;});this.headerBtn.itxtSubscribe('mouseout',function(){this.src=o.btnOff;});this.headerBtn.itxtSubscribe('click',$iTXT.core.Event.bind(this,this.close));this.headerTitle=b.make("SPAN",{style:'margin-left: '+o.padding*2+'px;line-height:'+o.headerHeight+'px;'},[o.title]);this.header=b.make("DIV",{style:'position:absolute;left:0;top:0;width:100%;height:'+o.headerHeight+'px;line-height:'+o.headerHeight+'px;color:white;font-size:11px;font-weight:bold;'},[this.headerBtn,this.headerTitle]);return this.header;},_buildContent:function()
{var b=$iTXT.core.Builder;var o=this.options;var ch=this.height-o.headerHeight-o.padding;var w=this.width-(o.padding*3);var l=o.padding*2;this.content=b.make("DIV",{style:'overflow:hidden;position:absolute;left:'+l+'px;top:'+o.headerHeight+'px;width:100%;height:'+ch+'px;width:'+w+'px;'});return this.content;},_sizeContent:function()
{var o=this.options;var h=this.height-o.headerHeight-o.padding;var w=this.width-(o.padding*3);var l=o.padding*2;var t=o.headerHeight;this.content.itxtSetStyle({left:l+'px',top:t+'px',width:w+'px',height:h+'px'});if(this.bgContent)
{this.bgContent.style.height=(this.height-12)+"px";}}});}
$iTXT.js.loader["$iTXT.ui.Tooltip"]=true;$iTXT.ui.Tooltip_Load=function(){var undefined;$iTXT.ui.TooltipPosition={AR:"AR",AL:"AL",BR:"BR",BL:"BL"};$iTXT.ui.SnapMode={Mouse:1,Text:0};$iTXT.ui.Tooltip=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,currentHook:null,currentHookBB:null,hideTID:-1,openTID:-1,isOpen:false,fixedOpen:false,openTS:null,hdrDown:false,hdrDownX:0,hdrDownY:0,loading:false,isMouseOver:false,mouseOutTID:-1,mouseOverTS:null,defaultBgCol:"#fbfbfb",defaultHoverBgCol:"#f6f6f6",defaultImageDirectory:'http://images.intellitxt.com/ast/tt/09/',mouseOutLogged:false,init:function(_options,$super)
{var defOpts=$iTXT.core.Util.extend({id:"itxttt",ps:$iTXT.ui.TooltipPosition.AR,bgcol:"#fbfbfb",hbgcol:'#f6f6f6',ftrbgcol:'#fbfbfb',tailbgcol:'#fbfbfb',minShowTime:0,tthd:1500,mintthd:0,openDelay:100,draggable:true,invisible:false,fadeShadow:true},_options);$iTXT.glob.dbParams.set('tt.img.dir',this.defaultImageDirectory,$iTXT.cnst.WEIGHTING_DEFAULT_DEFAULT);$iTXT.debug.info($iTXT.debug.Category.UI,"Creating Tooltip");$super(defOpts);this.shadow=new $iTXT.ui.TooltipShadow({ps:this.options.ps,bgcol:this.options.bgcol});this.addChild(this.shadow);this.chrome=new $iTXT.ui.TooltipChrome({ps:this.options.ps,bgcol:this.options.bgcol,draggable:this.options.draggable});this.addChild(this.chrome);this.content=new $iTXT.ui.TooltipContent({ps:this.options.ps,bgcol:this.options.bgcol});this.chrome.rootElement.appendChild(this.content.rootElement);var t=this;var evt=$iTXT.core.Event;this.rootElement.itxtBatchSubscribe([["mouseover",$iTXT.core.Event.bind(this,this._onMouseOver)],["mouseout",$iTXT.core.Event.bind(this,this._onMouseOut)],["mouseup",$iTXT.core.Event.bind(this,this._onMouseDownUp)],["mousedown",$iTXT.core.Event.bind(this,this._onMouseDownUp)],["contextmenu",$iTXT.core.Event.bind(this,this._onMouseDownUp)]],this.evtDspFuncs);$iTXT.core.$(document.body).itxtBatchSubscribe([["mouseover",$iTXT.core.Event.bind(this,this._bodyOver)],["mouseup",$iTXT.core.Event.bind(this,this._hdrUp)]],this.evtDspFuncs);$iTXT.core.$(document.body).itxtSubscribe("mouseup",evt.bind(this,this._hdrUp));$iTXT.core.$(document).itxtBatchSubscribe([["mousemove",evt.bind(this,this._onBodyMouseMove)],["$iTXT:tt:close",evt.bind(this,this.close)],["$iTXT:tt:expand",evt.bind(this,this._expand)],["$iTXT:hook:over",evt.bind(this,this._hookOver)],["$iTXT:hook:in",evt.bind(this,this._hookIn)],["$iTXT:hook:out",evt.bind(this,this._hookOut)],["$iTXT:hook:click",evt.bind(this,this._hookClick)],["$iTXT:tt:hdr:mouse:down",evt.bind(this,this._hdrDown)],["$iTXT:tt:hdr:mouse:up",evt.bind(this,this._hdrUp)],["$iTXT:tt:resize",evt.bind(this,this._resizeTooltip)],["$iTXT:tt:resize:smooth",evt.bind(this,this._smoothResizeTooltip)],["$iTXT:tt:set:fixed:open",evt.bind(this,this._setFixedOpen)],["$iTXT:tt:over",evt.bind(this,this._ttOver)],["$iTXT:tt:out",evt.bind(this,this._ttOut)],["$iTXT:tt:content:change:ad",evt.bind(this,this._changeAdvert)],["$iTXT:function:mvuExpand",evt.bind(this,this._mvuExpand)],["$iTXT:function:fExp",evt.bind(this,this._fExp)],["$iTXT:function:fClick",evt.bind(this,this._fClick)],["$iTXT:tt:iframe:out",evt.bind(this,this._iframeOut)],["$iTXT:tt:global:set:bgcol",$iTXT.core.Event.bind(this,this._setBGCol)],["$iTXT:tt:global:set:hvcol",$iTXT.core.Event.bind(this,this._setHVCol)]],this.evtDspFuncs);this.hide();},setPositionState:function(ps)
{if(ps)
{$iTXT.debug.info($iTXT.debug.Category.UI,"Setting Tooltip Position State: "+ps);this.ps=ps;this.shadow.setPositionState(ps);this.chrome.setPositionState(ps);}},setSize:function(w,h,resizeContent,$super)
{$iTXT.debug.info($iTXT.debug.Category.UI,"Setting Tooltip Size (width: "+w+", height: "+h+")");var shadSize=this.shadow.getShadowSize();$iTXT.debug.debug($iTXT.debug.Category.UI,"shadow size:"+shadSize+"px");this.chrome.setPosition(shadSize,shadSize);if(resizeContent)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"resizing content");this.content.resize(null,null,false);}
var contentW=this.content.getWidth();var contentH=this.content.getHeight();var contentOverlap=this.content.heightOverlap;$iTXT.debug.debug($iTXT.debug.Category.UI,"content w/h: "+contentW+"px/"+contentH+"px");$iTXT.debug.debug($iTXT.debug.Category.UI,"overlap: "+contentOverlap);this.chrome.setSize(contentW,contentH-contentOverlap,contentOverlap);this.shadow.setSize(this.chrome.getWidth(),this.chrome.getHeight());var contentOff=this.chrome.getContentOffset();this.content.setPosition(contentOff[0],contentOff[1]);var thisHeight=Math.max(this.shadow.getHeight(),this.chrome.getOverlappedHeight());$super(this.shadow.getWidth(),thisHeight);},open:function(l,t,state)
{$iTXT.debug.info($iTXT.debug.Category.UI,"Start Tooltip Open l: "+l+"px, t: "+t+"px, state: "+state);$iTXT.core.$(document).itxtFire("$iTXT:tt:before:open");this.hide();this.content.hide();this.shadow.hide();this.chrome.hide();this.setPositionState(state);this.rootElement.itxtRemoveClass("minimise");this.setPosition(l,t);this.setSize(null,null,false);if(!this.options.invisible)
{this.content.show();this.chrome.show();if(!this.options.fadeShadow)
{this.shadow.show();}
$iTXT.debug.info($iTXT.debug.Category.UI,"<b>Show Tooltip</b>");this.show();}
else
{$iTXT.debug.info($iTXT.debug.Category.UI,"<b>Invisible Tooltip Shown</b>");}
$iTXT.core.$(document).itxtFire("$iTXT:tt:after:open");if(!this.options.invisible&&this.options.fadeShadow)
{this.shadow.fadeIn();}
this.isOpen=true;this.openTS=(new Date).getTime();},close:function(e)
{var opts=e.data||{};$iTXT.core.$(document).itxtFire("$iTXT:tt:before:close");this.content.beforeClose();if(this.currentHookBB!=null&&opts.closeSource!=$iTXT.data.TTCloseSource.OVERNEWHOOK)
{var ttOff=this.rootElement.itxtTotalOffset();var dX=(this.currentHookBB.left-ttOff.left)+(this.currentHookBB.width/2);var dY=this.currentHookBB.top-ttOff.top;this.rootElement.itxtAddClass("minimise");this.content.hide();this.shadow.hide();this.chrome.hide();var t=this;var combOpts={start:true,duration:150,effects:[new $iTXT.fx.Move({target:this.rootElement,dX:dX,dY:dY}),new $iTXT.fx.Size({target:this.rootElement,width:5,height:5})],afterFinish:function()
{t.hideTooltip();$iTXT.core.$(document).itxtFire("$iTXT:tt:after:minimise");}};$iTXT.core.$(document).itxtFire("$iTXT:tt:before:minimise");$iTXT.debug.debug($iTXT.debug.Category.UI,"Starting Tooltip Minimize Effect (dX: "+dX+", dY: "+dY+")");new $iTXT.fx.Combination(combOpts);}
else
{this.hideTooltip();}},hideTooltip:function()
{$iTXT.debug.info($iTXT.debug.Category.UI,"Hiding Tooltip");if(this.hideTID!=-1)
{window.clearTimeout(this.hideTID);this.hideTID=-1;}
this.hide();this.rootElement.itxtSetStyle({left:"-1000px",top:"-1000px",width:"300px",height:"300px"});this.isOpen=false;this.fixedOpen=false;this.openTS=null;this.isMouseOver=false;if(this.currentHook!=null)
{this.currentHook.setState(false);this.currentHook=null;this.currentHookBB=null;}
$iTXT.core.$(document).itxtFire("$iTXT:tt:after:close");this.content.afterClose();},queueHide:function(t)
{if(this.isMouseOver)
{$iTXT.debug.info($iTXT.debug.Category.UI,"Queue Hide Ignored: Mouse is still over!");return;}
if(this.currentAdvert&&this.currentAdvert.params&&this.currentAdvert.params.get("tt.disable.hide"))
{$iTXT.debug.info($iTXT.debug.Category.UI,"Queue Hide Failed: tt.disable.hide Parameter Set");return;}
if(this.hideTID!=-1)
{window.clearTimeout(this.hideTID);this.hideTID=-1;}
if(!this.fixedOpen)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:queue:hide");var toAdjustment=0;if(this.options.mintthd>0)
{var timeOpenFor=this.openTS?(new Date).getTime()-this.openTS:0;var timeLeft=this.options.mintthd-timeOpenFor;if(timeLeft>0)
{toAdjustment=timeLeft;}}
var hideTO=parseInt(this.options.tthd)+toAdjustment;if(this.openTS!=null)
{var tSO=((new Date()).getTime()-this.openTS);hideTO+=Math.max(this.options.minShowTime-tSO,0);}
$iTXT.debug.debug($iTXT.debug.Category.UI,"Queing Tooltip Hide: "+(t||hideTO)+"ms (tthd: "+this.options.tthd+"ms, mintthd: "+this.options.mintthd+"ms)");this.hideTID=window.setTimeout(function(){$iTXT.core.$(document).itxtFire("$iTXT:tt:close",{closeSource:$iTXT.data.TTCloseSource.MOUSEOUT});},(t||hideTO));}},_hookIn:function(e)
{if(this.hideTID!=-1&&e.data&&e.data.hook&&e.data.hook==this.currentHook)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Clear Tooltip Hide Timeout (Hook In)");window.clearTimeout(this.hideTID);this.hideTID=-1;}},_hookOver:function(e)
{if(this.hideTID!=-1&&e.data&&e.data.hook&&e.data.hook==this.currentHook)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Clear Tooltip Hide Timeout (Hook Over)");window.clearTimeout(this.hideTID);this.hideTID=-1;}
var hookSnapTo=$iTXT.glob.params.get('hk.snapmode');if(hookSnapTo==$iTXT.ui.SnapMode.Mouse)
{e.data.bounds.left=e.data.hook.mouseOverPos.x;e.data.bounds.top=e.data.hook.mouseOverPos.y;}
if(e.data&&e.data.hook&&e.data.hook!=this.currentHook)
{var t=this;var adParams=e.data.hook.ad.params;var tooltipDelay=adParams.getInt("tt.open.delay",adParams.getInt("ttd",100));$iTXT.debug.debug($iTXT.debug.Category.UI,"Getting tooltip open delay (tt.open.delay/ttd): "+tooltipDelay);if(tooltipDelay>1000)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Tooltip open delay was >1000, reducing to 750");tooltipDelay=750;}
this.options.mintthd=e.data.hook.ad.params.get("mintthd",0);this.openTID=window.setTimeout(function(){t._showOnHook(e.data.hook,e.data.bounds);},tooltipDelay);}},_hookOut:function(e)
{if(this.openTID!=-1&&(e.data&&e.data.hook&&e.data.hook!=this.currentHook))
{var ittc=$iTXT.glob.params.getBool("tt.stop.pending.open",$iTXT.glob.params.getBool("ittc",0));if(ittc)
{$iTXT.debug.info($iTXT.debug.Category.UI,"<b>Mouse out of hook, pending tooltip open cancelled as tt.stop.pending.open/ittc=1<b/>");window.clearTimeout(this.openTID);}
else
{$iTXT.debug.info($iTXT.debug.Category.UI,"<b>Mouse out of hook, pending tooltip open will continue as tt.stop.pending.open/ittc=0</b>");}}
if(e.data&&e.data.hook&&e.data.hook==this.currentHook&&!this.isMouseOver)
{this.queueHide();}
else if(this.openTID!=-1)
{this.queueHide();}},_hookClick:function(e)
{this.hideTail();this.fixedOpen=true;},_showOnHook:function(hk,bb)
{try
{if(this.isOpen)
{$iTXT.debug.info($iTXT.debug.Category.UI,"Close Tooltip (Show On Another Hook)");$iTXT.core.$(document).itxtFire("$iTXT:tt:close",{closeSource:$iTXT.data.TTCloseSource.OVERNEWHOOK,tso:this.getTimeSinceOpen()});}
$iTXT.debug.info($iTXT.debug.Category.UI,"Show Tooltip On Hook: "+hk.options.value+" (id: "+hk.id+")");this.showTail();this.currentHook=hk;this.currentAdvert=hk.ad;this.currentHookBB=bb;this.currentHook.setState(true);if(undefined!=hk.ad)
{this.setAdvert(hk.ad);}
this.show();this.content.show();this.shadow.show();this.chrome.show();this.setSize(null,null,true);this.hide();this.content.hide();this.shadow.hide();this.chrome.hide();var placeOpts={bb:bb,tt:$iTXT.ui.tt};this.content.beforeOpen();if(this.options.invisible)
{this.onTooltipOpen({left:-1000,top:-1000,state:$iTXT.ui.TooltipPosition.AR});}
else
{this.onTooltipOpen($iTXT.ui.TooltipPlacer.place(placeOpts));}
this.content.afterOpen();$iTXT.core.$(document).itxtFire("$iTXT:tt:open",{advert:hk.ad});}
catch(e)
{$iTXT.debug.error($iTXT.debug.Category.GENERAL,e);throw(e);}},openWithAdvert:function(advert,leftPos,topPos,posState)
{this.showTail();this.currentAdvert=advert;this.currentHook=null;this.currentHookBB=null;this.setAdvert(advert);this.show();this.content.show();this.shadow.show();this.chrome.show();this.setSize(null,null,true);this.hide();this.content.hide();this.shadow.hide();this.chrome.hide();this.content.beforeOpen();this.onTooltipOpen({left:leftPos,top:topPos,state:posState});this.content.afterOpen();$iTXT.core.$(document).itxtFire("$iTXT:tt:open",{advert:advert});},_onMouseOver:function(e)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"tooltip._onMouseOver "+e.target.tagName+", "+e.target.id);this.mouseOutLogged=false;if(this.mouseOutTID!=-1)
{window.clearTimeout(this.mouseOutTID);}
if((e.target!=this.rootElement)&&(e.target!=this.chrome.rootElement))
{if(this.mouseOutTID!=-1)
{window.clearTimeout(this.mouseOutTID);this.mouseOutTID=-1;}
if(!this.isMouseOver)
{this.isMouseOver=true;this.tooltipOver();this.mouseOverTS=(new Date()).getTime();$iTXT.core.$(document).itxtFire("$iTXT:tt:mouse:over",e);}
if(this.hideTID!=-1)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Clear Tooltip Hide Timeout (Tooltip Over)");window.clearTimeout(this.hideTID);this.hideTID=-1;}}
e.stop();},_ttOver:function()
{this.isMouseOver=true;if(this.mouseOutTID!=-1)
{window.clearTimeout(this.mouseOutTID);}
if(this.hideTID!=-1)
{$iTXT.debug.debug($iTXT.debug.Category.UI,"Clear Tooltip Hide Timeout (Tooltip Over Component)");window.clearTimeout(this.hideTID);this.hideTID=-1;}},_ttOut:function()
{if(!this.mouseOutLogged){$iTXT.debug.debug($iTXT.debug.Category.UI,"Tooltip Out (Component)");this.mouseOutLogged=true;}
this._onMouseOut();},_onMouseOut:function(e)
{var t=this;this.mouseOutTID=window.setTimeout(function(){t._ttMouseOut(e)},50);},_onMouseDownUp:function(e)
{var rc=false;if(e.which)rc=(e.which==3);else if(e.button)rc=(e.button==2);if(rc)
{return false;}
return true;},_ttMouseOut:function(e)
{if(this.isMouseOver)
{this.isMouseOver=false;this.tooltipOut();var len=(new Date()).getTime()-this.mouseOverTS;$iTXT.core.$(document).itxtFire("$iTXT:tt:mouse:out",{len:len});this.queueHide();}},showTail:function()
{this.shadow.showTail();this.chrome.showTail();},hideTail:function()
{this.shadow.hideTail();this.chrome.hideTail();},setLoading:function(l)
{},_onBodyMouseMove:function(e)
{if(this.hdrDown&&this.options.draggable)
{this.hideTail();this.fixedOpen=true;this.setPosition(e.clientX-this.hdrDownX,e.clientY-this.hdrDownY);}},_setFixedOpen:function()
{this.fixedOpen=true;},_hdrDown:function(e)
{this.hdrDown=true;var thisOff=this.rootElement.itxtTotalOffset();this.hdrDownX=e.data.clientX-thisOff.left;this.hdrDownY=e.data.clientY-thisOff.top;},_hdrUp:function()
{this.hdrDown=false;},_expand:function(e)
{var opts=e.data||{};if(opts.disableClose)
{this._setFixedOpen();}
if(opts.hideTail)
{this.hideTail();}
var hOffset=0;var oHOffset=this.content.heightOverlap;if(opts.hOffset)
{hOffset=opts.hOffset;}
var oW=(undefined!=opts.oW)?opts.oW:this.content.getWidth();var oH=(undefined!=opts.oH)?opts.oH:this.content.getHeight();var eW=(undefined!=opts.eW)?opts.eW:this.content.getExpandedWidth();var eH=(undefined!=opts.eH)?opts.eH:this.content.getExpandedHeight();var wD=eW-oW;var hD=eH-oH;if(undefined!=opts.dX)
{wD=opts.dX;}
if(undefined!=opts.dY)
{hD=opts.dY;}
if(0==wD&&0==hD)
{if(opts.afterFinish)
{opts.afterFinish.apply(t);}
return;}
var dX=0;var dY=0;var ttps=$iTXT.ui.TooltipPosition;if(this.ps==ttps.AR)
{dY=-hD+hOffset;}
else if(this.ps==ttps.AL)
{dY=-hD+hOffset;dX=-wD;}
else if(this.ps==ttps.BR)
{}
else if(this.ps==ttps.BL)
{dX=-wD;}
var duration=200;if($iTXT.core.Browser.performance<60)
{duration=0;}
$iTXT.debug.info($iTXT.debug.Category.UI,"<b style='color:blue;'>Expand Tooltip</b>");$iTXT.debug.debug($iTXT.debug.Category.UI,"Start: "+oW+"px/"+oH+"px");$iTXT.debug.debug($iTXT.debug.Category.UI,"Change: "+wD+"px/"+hD+"px");$iTXT.debug.debug($iTXT.debug.Category.UI,"Duration: "+duration+"ms");var t=this;var moveOpts={start:true,duration:duration,target:this.rootElement,dX:dX,dY:dY,afterUpdate:function(p)
{var nW=Math.round(oW+(wD*p));var nH=Math.round(oH+(hD*p));var hO=Math.round(oHOffset+(hOffset*p));t._setContentSize(nW,nH,hO);if(opts.afterUpdate)
{opts.afterUpdate.apply(t,[p]);}},afterFinish:function()
{if(opts.afterFinish)
{opts.afterFinish.apply(t);}}};new $iTXT.fx.Move(moveOpts);},_setContentSize:function(w,h,hO)
{this.content.setContentSize(w,h,hO);this.setSize(null,null,false);},setAdvert:function(ad)
{var adopts=ad.params;var nott=adopts.get("nott",false);if(nott)
{adopts.set("scmh",1,$iTXT.cnst.WEIGHTING_DEFAULT_CAMPAIGN);}
this.options.invisible=nott;var tmpl=ad.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};if(tmplopts.disableShadowFade)
{this.options.fadeShadow=false;}
else
{this.options.fadeShadow=true;}
var adBgCol=adopts.parse(adopts.get("tt.bg.col","#fbfbfb"));adBgCol=(adBgCol.length>0)?adBgCol:"#fbfbfb";if("#F0F0F0"==adBgCol.toUpperCase())
{adBgCol="#ffffff";}
this.options.bgcol=$iTXT.core.Util.validHexColor(tmplopts.ttbgcol||adBgCol);var adHvBgColor=adopts.parse(adopts.get("tt.bg.h.col",adBgCol));adHvBgColor=(adHvBgColor.length>0)?adHvBgColor:"#f6f6f6";if("#FBFBFB"==adHvBgColor.toUpperCase())
{adHvBgColor="#f6f6f6";}
this.options.hbgcol=$iTXT.core.Util.validHexColor(tmplopts.ttbghcol||adHvBgColor);this.options.tthd=adopts.getInt("tthd",this.defaultOptions.tthd);this.chrome.setAdvert(ad);this.shadow.setAdvert(ad);if(this.options.invisible)
{this.content.clearContent();}
else
{this.content.setAdvert(ad);}},onTooltipOpen:function(opts)
{if(undefined==opts.left||undefined==opts.top||!opts.state)
return;this.options.ps=opts.state;$iTXT.ui.tt.open(opts.left,opts.top,opts.state);},_resizeTooltip:function()
{this.setSize(null,null,true);},_smoothResizeTooltip:function(e)
{var dX=0,dY=0,sW=this.content.getWidth(),sH=this.content.getHeight();var newSize=this.content.tryResize(null,null);$iTXT.debug.info($iTXT.debug.Category.UI,"<b style='color:red;'>Smooth Resize Tooltip</b>");$iTXT.debug.debug($iTXT.debug.Category.UI,"Initial Start: "+sW+"px/"+sH+"px");if(isNaN(sW))
{sW=newSize[0];$iTXT.debug.debug($iTXT.debug.Category.UI,"Invalid start width, setting to: "+sW+"px");}
if(isNaN(sH))
{sH=newSize[1];$iTXT.debug.debug($iTXT.debug.Category.UI,"Invalid start height, setting to: "+sH+"px");}
dX=newSize[0]-sW;dY=newSize[1]-sH;$iTXT.debug.debug($iTXT.debug.Category.UI,"Finish: "+newSize[0]+"px/"+newSize[1]+"px");$iTXT.debug.debug($iTXT.debug.Category.UI,"Change: "+dX+"px/"+dY+"px");var expe={data:{dX:dX,dY:dY,oW:sW,oH:sH,afterFinish:function()
{if(e.data&&'function'==typeof e.data)
{window.setTimeout(function(){e.data();},150);}}}}
this._expand(expe);},_iframeOut:function()
{this.mouseOutTID=window.setTimeout($iTXT.core.Event.bind(this,this._ttMouseOut),20);},getTimeSinceOpen:function()
{if(this.isOpen)
{return(new Date).getTime()-this.openTS;}
return null;},_changeAdvert:function(e)
{if(e.data)
{this.currentAdvert=e.data;}},tooltipOver:function()
{this.chrome.tooltipOver();},tooltipOut:function()
{this.chrome.tooltipOver();},_mvuExpand:function(e)
{var opts=e.data||{};$iTXT.debug.info($iTXT.debug.Category.UI,"mvuExpand called: "+$iTXT.core.Util.serialiseJSON(opts));if(opts.rt==1)
{this._expand({data:{eW:opts.w,eH:opts.h}});}
else if(opts.rt==0)
{this._expand({data:{eW:this.content.getTemplateDefaultWidth(),eH:this.content.getTemplateDefaultHeight()}});}},_fExp:function(e)
{$iTXT.debug.info($iTXT.debug.Category.UI,"fExp called");this._expand({});},_fClick:function(e)
{$iTXT.debug.info($iTXT.debug.Category.UI,"fClick called");this.hideTooltip();},_setBGCol:function(e)
{this.options.bgcol=$iTXT.core.Util.validHexColor(e.data);},_setHVCol:function(e)
{this.options.hbgcol=$iTXT.core.Util.validHexColor(e.data);},_bodyOver:function(e)
{this._ttOut(e);}});}
$iTXT.js.loader["$iTXT.ui.TooltipChrome"]=true;$iTXT.ui.TooltipChrome_Load=function(){var undefined;$iTXT.ui.TooltipChrome=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,w:0,h:0,overlappedHeight:0,init:function(_options,$super)
{var defOpts=$iTXT.core.Util.extend({id:"itxtchrome",ps:$iTXT.ui.TooltipPosition.AR},_options);$super(defOpts);this.slideOut=new $iTXT.ui.TooltipSlideOut({});this.contentBG=$iTXT.core.Builder.make("DIV",{backgroundColor:this.options.bgcol,id:"itxtcontentbg"});this.contentBG.itxtSetStyle({backgroundColor:this.options.bgcol});this.rootElement.appendChild(this.contentBG);this.defaultHeader=this.header=new $iTXT.ui.TooltipHeader({ps:this.options.ps,bgcol:this.options.bgcol,draggable:this.options.draggable});this.defaultFooter=this.footer=new $iTXT.ui.TooltipFooter({ps:this.options.ps,bgcol:this.options.bgcol});this.defaultTail=this.tail=new $iTXT.ui.TooltipTail({ps:this.options.ps,bgcol:this.options.bgcol});this.drawersFooter=new $iTXT.ui.TooltipDrawerFooter({ps:this.options.ps});this.addChildren([this.slideOut,this.header,this.footer,this.tail,this.drawersFooter]);$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:global:set:bgcol",$iTXT.core.Event.bind(this,this._setBGCol)],["$iTXT:tt:global:set:hvcol",$iTXT.core.Event.bind(this,this._setHVCol)]],this.evtDspFuncs);},setPositionState:function(ps)
{this.options.ps=ps;this.tail.setPositionState(ps);this.resize(this.w,this.h);},setSize:function(w,h,overlap)
{overlap=overlap||0;var ttps=$iTXT.ui.TooltipPosition;this.width=w;var headerAndContentHeight=h+this.header.getHeight();this.height=headerAndContentHeight+this.footer.getHeight()+this.tail.getHeight()+this.drawersFooter.getHeight();this.overlappedHeight=Math.max(headerAndContentHeight+overlap,this.height);this.rootElement.itxtSetStyle({width:this.width+"px",height:this.overlappedHeight+"px"});this.contentBG.itxtSetStyle({width:this.width+"px",height:h+"px"});if((ttps.AR==this.options.ps)||(ttps.AL==this.options.ps))
{this.header.setPosition(0,0);this.header.setSize(this.width,this.height);this.footer.setPosition(0,h+this.header.getHeight());this.footer.setSize(this.width,this.height);this.drawersFooter.setPosition(0,h+this.header.getHeight()+this.footer.getHeight());this.drawersFooter.setSize(this.width,this.height);var tailLeft=(ttps.AR==this.options.ps)?50:(this.width-50-this.tail.getWidth());this.tail.setPosition(tailLeft,h+this.header.getHeight()+this.footer.getHeight()+this.drawersFooter.getHeight());this.contentBG.itxtSetStyle({top:this.header.getHeight()+"px"});}
else
{this.header.setPosition(0,this.tail.getHeight());this.header.setSize(this.width,this.height);this.footer.setPosition(0,h+this.header.getHeight()+this.tail.getHeight());this.footer.setSize(this.width,this.height);this.drawersFooter.setPosition(0,h+this.header.getHeight()+this.tail.getHeight()+this.footer.getHeight());this.drawersFooter.setSize(this.width,this.height);var tailLeft=(ttps.BR==this.options.ps)?50:(this.width-50-this.tail.getWidth());this.tail.setPosition(tailLeft,0);this.contentBG.itxtSetStyle({top:(this.header.getHeight()+this.tail.getHeight())+"px"});}
var ttsoH=h+this.header.getHeight()+this.footer.getHeight()+this.drawersFooter.getHeight();var ttsoOffH=0;if((ttps.BR==this.options.ps)||(ttps.BL==this.options.ps))
{ttsoOffH=this.tail.getHeight();}
this.slideOut.setSize(this.width,ttsoH);this.slideOut.setOffset(0,ttsoOffH);},getOverlappedHeight:function()
{return this.overlappedHeight;},getContentOffset:function()
{var ttps=$iTXT.ui.TooltipPosition;var h=this.header.getHeight();if((ttps.BR==this.options.ps)||(ttps.BL==this.options.ps))
{h+=this.tail.getHeight();}
return[0,h];},showTail:function()
{this.tail.show();},hideTail:function()
{this.tail.hide();},getTTHeight:function()
{return((ttps.AR==this.options.ps)||(ttps.AL==this.options.ps))?0:this.tail.getHeight();},setAdvert:function(ad,$super)
{var tmpl=ad.getTemplate();if(tmpl.options.customFooter)
{if(this.footer&&this.defaultFooter!=this.footer)
{this.removeChild(this.footer);this.footer.dispose();}
this.footer=new tmpl.options.customFooter({ps:this.options.ps,bgcol:this.options.bgcol});this.addChild(this.footer);this.defaultFooter.hide();}
else if(this.defaultFooter!=this.footer)
{if(this.footer)
{this.removeChild(this.footer);this.footer.dispose();}
this.footer=this.defaultFooter;this.addChild(this.defaultFooter);this.footer.show();}
if(tmpl.options.customHeader)
{if(this.header&&this.defaultHeader!=this.header)
{this.removeChild(this.header);this.header.dispose();}
this.header=new tmpl.options.customHeader({ps:this.options.ps,bgcol:this.options.bgcol,draggable:this.options.draggable});if(this.header.build)
{this.header.build();}
this.addChild(this.header);this.defaultHeader.hide();}
else if(this.defaultHeader!=this.header)
{if(this.header)
{this.removeChild(this.header);this.header.dispose();}
this.header=this.defaultHeader;this.addChild(this.defaultHeader);this.header.show();}
this.header.setAdvert(ad);this.footer.setAdvert(ad);this.tail.setAdvert(ad);this.slideOut.setAdvert(ad);this.drawersFooter.setAdvert(ad);if(this.drawersFooter.hasDrawers())
{this.footer.setDrawers(true);}
$super(ad);var adopts=ad.params;var tmpl=this.advert.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};var chromeCol=adopts.parse(adopts.get("tt.chrome.col",$iTXT.ui.tt.options.bgcol||$iTXT.ui.tt.defaultOptions.bgcol));var chromeHCol=adopts.parse(adopts.get("tt.chrome.h.col",$iTXT.ui.tt.options.hbgcol||$iTXT.ui.tt.defaultOptions.hbgcol));chromeCol=(chromeCol.length>0)?chromeCol:$iTXT.ui.tt.options.bgcol||$iTXT.ui.tt.defaultOptions.bgcol;chromeHCol=(chromeHCol.length>0)?chromeHCol:$iTXT.ui.tt.options.hbgcol||$iTXT.ui.tt.defaultOptions.hbgcol;this.options.bgcol=tmplopts.ttchromecol||chromeCol;this.options.hbgcol=tmplopts.ttchromehcol||chromeHCol;this._ubg();},_setBGCol:function(e)
{this.options.bgcol=$iTXT.core.Util.validHexColor(e.data);$iTXT.fire("$iTXT:tt:ftr:set:bgcol",e.data);$iTXT.fire("$iTXT:tt:tail:set:bgcol",e.data);this._ubg();},_setHVCol:function(e)
{this.options.hbgcol=$iTXT.core.Util.validHexColor(e.data);$iTXT.fire("$iTXT:tt:ftr:set:hvcol",e.data);$iTXT.fire("$iTXT:tt:tail:set:hvcol",e.data);this._ubg();},_ubg:function(c)
{var bgCol=this.options.bgcol;if($iTXT.ui.tt.isMouseOver)
{bgCol=this.options.hbgcol;}
if(undefined!=this.customBgCol)
{bgCol=this.customBgCol;}
this.contentBG.itxtSetStyle({backgroundColor:bgCol});},tooltipOver:function()
{this.header.tooltipOver();this.footer.tooltipOver();this.tail.tooltipOver();this._ubg();},tooltipOut:function()
{this.header.tooltipOut();this.footer.tooltipOut();this.tail.tooltipOut();this._ubg();}});}
$iTXT.js.loader["$iTXT.ui.TooltipFooter"]=true;$iTXT.ui.TooltipFooter_Load=function(){var undefined;$iTXT.ui.TooltipFooter=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,init:function(_options,$super)
{var defOpts=$iTXT.core.Util.extend({id:"itxtfooter",height:6,margins:[1,1,2,2,4,6],bgcol:[]},_options);$super(defOpts);this._build();this.height=this.options.height;$iTXT.core.$(document).itxtBatchSubscribe([["$iTXT:tt:ftr:change:bgcol",$iTXT.core.Event.bind(this,this._changeBGCol)],["$iTXT:tt:ftr:set:bgcol",$iTXT.core.Event.bind(this,this._setBGCol)],["$iTXT:tt:ftr:set:hvcol",$iTXT.core.Event.bind(this,this._setHVCol)]],this.evtDspFuncs);},setSize:function(w,h,$super)
{$super(w,this.height);},_build:function()
{var childNodes=[];for(var i=0;i<this.options.height;i++)
{childNodes.push(this._createDiv(this.options.margins[i],this.options.margins[i],(this.options.bgcol[i]||'#ffffff')));}
this.rootElement.itxtAppendChildren(childNodes);this.rootElement.itxtSubscribe("mouseover",$iTXT.core.Event.bind(this,this._onMouseOver));this.rootElement.itxtSubscribe("mouseout",$iTXT.core.Event.bind(this,this._onMouseOut));this.rootElement.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._onMouseClick));},_createDiv:function(lm,rm,bgc)
{return $iTXT.core.Builder.make("DIV",{className:"itxtftr",style:"background-color: "+bgc+"; margin-left: "+(lm||0)+"px; margin-right:"+(rm||0)+"px"});},_ubg:function(c)
{var bgCol=this.options.bgcol;if($iTXT.ui.tt.isMouseOver)
{bgCol=this.options.hbgcol;}
if(undefined!=this.customBgCol)
{bgCol=this.customBgCol;}
for(var i=0;i<this.rootElement.childNodes.length;i++)
{this.rootElement.childNodes[i].itxtSetStyle({backgroundColor:(bgCol[i]||'#ffffff')});}},setAdvert:function(ad,$super)
{this.customBgCol=undefined;this.hasDrawers=true;var h=ad.params.get("FTRHIGHT");if(null!=h)
{this.height=h;}
else
{this.height=this.options.height;}
this.rootElement.itxtSetStyle({backgroundColor:"transparent"});$super(ad);var adopts=ad.params;var tmpl=this.advert.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};this.options.bgcol=$iTXT.core.Util.parseColorArray(tmplopts.ttftrcol||adopts.parse(adopts.get("tt.ftr.col",$iTXT.ui.tt.options.bgcol)),this.options.height,"$$");this.options.hbgcol=$iTXT.core.Util.parseColorArray(tmplopts.ttftrhcol||adopts.parse(adopts.get("tt.ftr.h.col",$iTXT.ui.tt.options.hbgcol)),this.options.height,"$$");this._ubg();},_onMouseOver:function(e)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:ftr:mouse:over",e);},_onMouseOut:function(e)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:ftr:mouse:out",e);},_onMouseClick:function(e)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:ftr:mouse:click",e);},setDrawers:function(b)
{this.hasDrawers=b;this.height=0;},_changeBGCol:function(e)
{if(e.data&&'string'==typeof e.data)
{this.customBgCol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");}
else
{this.customBgCol=undefined;}
this._ubg();},_setBGCol:function(e)
{this.options.bgcol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");this._ubg();},_setHVCol:function(e)
{this.options.hbgcol=$iTXT.core.Util.parseColorArray(e.data,this.options.height,"$$");this._ubg();},tooltipOver:function()
{this._ubg();},tooltipOut:function()
{this._ubg();}});}
$iTXT.js.loader["$iTXT.ui.TooltipPlacer"]=true;$iTXT.ui.TooltipPlacer_Load=function(){var undefined;$iTXT.ui.TooltipPlacer={ttOffX:50,ttOffY:5,TOPOFFSCREENWEIGHT:20,EXPTOPOFFSCREENWEIGHT:20,OFFSCREENWEIGHT:15,EXPOFFSCREENWEIGHT:2,place:function(opts)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:before:position");$iTXT.debug.info($iTXT.debug.Category.PLACER,"Placing Tooltip");if(opts.bb&&opts.tt)
{var ttW=opts.tt.width;var ttH=opts.tt.height;var bbL=opts.bb.left;var bbT=opts.bb.top;var bbR=opts.bb.left+opts.bb.width;var bbB=opts.bb.top+opts.bb.height;var ttps=$iTXT.ui.TooltipPosition;var posArr={};posArr[ttps.AR]={left:bbR-this.ttOffX,top:bbT-ttH-this.ttOffY,width:ttW,height:ttH,weight:0};posArr[ttps.AL]={left:bbL-ttW+this.ttOffX,top:bbT-ttH-this.ttOffY,width:ttW,height:ttH,weight:0};posArr[ttps.BR]={left:bbR-this.ttOffX,top:bbB+this.ttOffY,width:ttW,height:ttH,weight:0};posArr[ttps.BL]={left:bbL-ttW+this.ttOffX,top:bbB+this.ttOffY,width:ttW,height:ttH,weight:0};$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Possible Tooltip Placements:");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Right: "+$iTXT.core.Util.serialiseJSON(posArr[ttps.AR]));$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Left: "+$iTXT.core.Util.serialiseJSON(posArr[ttps.AL]));$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Right: "+$iTXT.core.Util.serialiseJSON(posArr[ttps.BR]));$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Left: "+$iTXT.core.Util.serialiseJSON(posArr[ttps.BL]));var sSize=$iTXT.core.Util.getWindowSize();var dScroll=$iTXT.core.Util.getPageScroll();var sb={left:dScroll[0],top:dScroll[1],width:sSize[0],height:sSize[1]};$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| SCREEN OVERLAP TEST a)");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Screen Bounds: "+$iTXT.core.Util.serialiseJSON(sb));posArr[ttps.AR].weight-=100*(1-$iTXT.core.Math.intersectsPercentage(posArr[ttps.AR],sb));posArr[ttps.AL].weight-=100*(1-$iTXT.core.Math.intersectsPercentage(posArr[ttps.AL],sb));posArr[ttps.BR].weight-=100*(1-$iTXT.core.Math.intersectsPercentage(posArr[ttps.BR],sb));posArr[ttps.BL].weight-=100*(1-$iTXT.core.Math.intersectsPercentage(posArr[ttps.BL],sb));$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Right Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.AR],sb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Left Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.AL],sb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Right Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.BR],sb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Left Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.BL],sb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Right Weight: "+posArr[ttps.AR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Left Weight: "+posArr[ttps.AL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Right Weight: "+posArr[ttps.BR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Left Weight: "+posArr[ttps.BL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| SCREEN OVERLAP TEST b)");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");var artd=((posArr[ttps.AR].top-sb.top));if(artd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip off screen on top edge when Above Right by "+artd+"px");posArr[ttps.AR].weight+=this.TOPOFFSCREENWEIGHT*(artd/posArr[ttps.AR].height);}
var artdExp=((posArr[ttps.AR].top-sb.top)-posArr[ttps.AR].height);if(artdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip off screen on top edge when Above Right by "+artdExp+"px");posArr[ttps.AR].weight+=this.EXPTOPOFFSCREENWEIGHT*(artdExp/posArr[ttps.AR].height);}
var arrd=(((sb.left+sb.width)-(posArr[ttps.AR].left+posArr[ttps.AR].width)));if(arrd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip off screen on right edge when Above Right by "+arrd+"px");posArr[ttps.AR].weight+=this.OFFSCREENWEIGHT*(arrd/posArr[ttps.AR].width);}
var arrdExp=(((sb.left+sb.width)-(posArr[ttps.AR].left+posArr[ttps.AR].width))-posArr[ttps.AR].width);if(arrdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded Tooltip off screen on right edge when Above Right by "+arrdExp+"px");posArr[ttps.AR].weight+=this.EXPOFFSCREENWEIGHT*(arrdExp/posArr[ttps.AR].width);}
var altd=((posArr[ttps.AL].top-sb.top));if(altd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip off screen on top edge when Above Left by "+altd+"px");posArr[ttps.AL].weight+=this.TOPOFFSCREENWEIGHT*(altd/posArr[ttps.AL].height);}
var altdExp=((posArr[ttps.AL].top-sb.top)-posArr[ttps.AL].height);if(altdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip off screen on top edge when Above Left by "+altdExp+"px");posArr[ttps.AL].weight+=this.EXPTOPOFFSCREENWEIGHT*(altdExp/posArr[ttps.AL].height);}
var alld=((posArr[ttps.AL].left-sb.left));if(alld<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip off screen on left edge when Above Left by "+alld+"px");posArr[ttps.AL].weight+=this.OFFSCREENWEIGHT*(alld/posArr[ttps.AL].width);}
var alldExp=((posArr[ttps.AL].left-sb.left)-posArr[ttps.AL].width);if(alldExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip off screen on left edge when Above Left by "+alldExp+"px");posArr[ttps.AL].weight+=this.EXPOFFSCREENWEIGHT*(alldExp/posArr[ttps.AL].width);}
var brbd=(((sb.top+sb.height)-(posArr[ttps.BR].top+posArr[ttps.BR].height)));if(brbd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip off screen on bottom edge when Below Right by "+brbd+"px");posArr[ttps.BR].weight+=this.OFFSCREENWEIGHT*(brbd/posArr[ttps.BR].height);}
var brbdExp=(((sb.top+sb.height)-(posArr[ttps.BR].top+posArr[ttps.BR].height))-posArr[ttps.BR].height);if(brbdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip offscreen on bottom edge when Below Right by "+brbdExp+"px");posArr[ttps.BR].weight+=this.EXPOFFSCREENWEIGHT*(brbdExp/posArr[ttps.BR].height);}
var brrd=(((sb.left+sb.width)-(posArr[ttps.BR].left+posArr[ttps.BR].width)));if(brrd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip offscreen on right edge when Below Right by "+brrd+"px");posArr[ttps.BR].weight+=this.OFFSCREENWEIGHT*(brrd/posArr[ttps.BR].width);}
var brrdExp=(((sb.left+sb.width)-(posArr[ttps.BR].left+posArr[ttps.BR].width))-posArr[ttps.BR].width);if(brrdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip offscreen on right edge when Below Right by "+brrdExp+"px");posArr[ttps.BR].weight+=this.EXPOFFSCREENWEIGHT*(brrdExp/posArr[ttps.BR].width);}
var blbd=(((sb.top+sb.height)-(posArr[ttps.BL].top+posArr[ttps.BL].height)));if(blbd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip offscreen on bottom edge when Below Left by "+blbd+"px");posArr[ttps.BL].weight+=this.OFFSCREENWEIGHT*(blbd/posArr[ttps.BL].height);}
var blbdExp=(((sb.top+sb.height)-(posArr[ttps.BL].top+posArr[ttps.BL].height))-posArr[ttps.BL].height);if(blbdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip offscreen on bottom edge when Below Left by "+blbdExp+"px");posArr[ttps.BL].weight+=this.EXPOFFSCREENWEIGHT*(blbdExp/posArr[ttps.BL].height);}
var blrd=((posArr[ttps.BL].left-sb.left));if(blrd<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip offscreen on left edge when Below Left by "+blrd+"px");posArr[ttps.BL].weight+=this.OFFSCREENWEIGHT*(blrd/posArr[ttps.BL].width);}
var blrdExp=((posArr[ttps.BL].left-sb.left)-posArr[ttps.BL].width);if(blrdExp<0)
{$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Expanded tooltip offscreen on left edge when Below Left by "+blrdExp+"px");posArr[ttps.BL].weight+=this.EXPOFFSCREENWEIGHT*(blrdExp/posArr[ttps.BL].width);}
$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Right Weight: "+posArr[ttps.AR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Left Weight: "+posArr[ttps.AL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Right Weight: "+posArr[ttps.BR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Left Weight: "+posArr[ttps.BL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| SCREEN OVERLAP TEST c)");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");var scpos=$iTXT.core.Util.getPageScroll();var arTop=posArr[ttps.AR].top-sb.top+scpos[1];if(arTop<0)
{posArr[ttps.AR].weight-=500;$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip header is off the top of the page when Above Right!!!");}
var alTop=posArr[ttps.AL].top-sb.top+scpos[1];if(alTop<0)
{posArr[ttps.AL].weight-=500;$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Tooltip header is off the top of the page when Above Left!!!");}
$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Right Weight: "+posArr[ttps.AR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Left Weight: "+posArr[ttps.AL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Right Weight: "+posArr[ttps.BR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Left Weight: "+posArr[ttps.BL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Avoidance Nodes Test");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");var avList=[{w:10,n:"IFRAME"},{w:10,n:"OBJECT"},{w:10,n:"EMBED"}];for(var i=0;i<avList.length;i++)
{var avN=avList[i];var nLst=document.getElementsByTagName(avN.n);var nLstLen=nLst.length;$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Found "+nLstLen+" "+avN.n+" nodes");for(var i2=0;i2<nLstLen;i2++)
{var nd=nLst[i2];var nbb=$iTXT.core.$(nd).itxtBounds();$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,avN.n+" node "+i2+" bounds: "+$iTXT.core.Util.serialiseJSON(nbb));posArr[ttps.AR].weight-=avN.w*($iTXT.core.Math.intersectsPercentage(posArr[ttps.AR],nbb));posArr[ttps.AL].weight-=avN.w*($iTXT.core.Math.intersectsPercentage(posArr[ttps.AL],nbb));posArr[ttps.BR].weight-=avN.w*($iTXT.core.Math.intersectsPercentage(posArr[ttps.BR],nbb));posArr[ttps.BL].weight-=avN.w*($iTXT.core.Math.intersectsPercentage(posArr[ttps.BL],nbb));$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Right Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.AR],nbb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Above Left Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.AL],nbb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Right Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.BR],nbb)*100)+"%");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"Below Left Screen Overlap: "+($iTXT.core.Math.intersectsPercentage(posArr[ttps.BL],nbb)*100)+"%");}}
$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Right Weight: "+posArr[ttps.AR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Above Left Weight: "+posArr[ttps.AL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Right Weight: "+posArr[ttps.BR].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"| Below Left Weight: "+posArr[ttps.BL].weight);$iTXT.debug.debug($iTXT.debug.Category.PLACER,"------------------------------");var posState=ttps.AR;$iTXT.debug.info($iTXT.debug.Category.PLACER,"Choose Above Right position by default");if(posArr[ttps.AL].weight>posArr[posState].weight)
{$iTXT.debug.info($iTXT.debug.Category.PLACER,"Above Left Has a Greater Weight");posState=ttps.AL;}
if(posArr[ttps.BR].weight>posArr[posState].weight)
{$iTXT.debug.info($iTXT.debug.Category.PLACER,"Below Right Has a Greater Weight");posState=ttps.BR;}
if(posArr[ttps.BL].weight>posArr[posState].weight)
{$iTXT.debug.info($iTXT.debug.Category.PLACER,"Below Left Has a Greater Weight");posState=ttps.BL;}
if($iTXT.glob.params)
{var dbgTTPS=$iTXT.glob.params.get("tt.pos.state");if(null!=dbgTTPS)
{$iTXT.debug.info($iTXT.debug.Category.PLACER,"Forcing position state: "+dbgTTPS);posState=dbgTTPS;}}
var returnOptions={left:posArr[posState].left,top:posArr[posState].top,state:posState};$iTXT.debug.info($iTXT.debug.Category.PLACER,"Return Position State: "+posState);$iTXT.debug.info($iTXT.debug.Category.PLACER,"Return Left Position: "+returnOptions.left);$iTXT.debug.info($iTXT.debug.Category.PLACER,"Return Top Position: "+returnOptions.top);return returnOptions;}}}}
$iTXT.js.loader["$iTXT.ui.TooltipHeader"]=true;$iTXT.ui.TooltipHeader_Load=function(){var undefined;$iTXT.ui.TooltipHeader=$iTXT.core.Class.create($iTXT.ui.ComponentBase,{options:null,closeBtn:null,whatBtn:null,vmLogo:null,init:function(_options,$super)
{this.componentParams=$iTXT.core.Util.extend({'hdr.wt.alt':'${swti}','hdr.close.alt':'${scls}','hdr.img.dir':'http://images.intellitxt.com/ast/tt/09/','hdr.brand':'','hdr.brand.txt':'','hdr.txt':'${SSPL}','hdr.logo':'${hdr.img.dir}vm_logo2009.gif','hdr.close.on':'${hdr.img.dir}close_on.gif','hdr.close.off':'${hdr.img.dir}close_off.gif','hdr.what.on':'${hdr.img.dir}what_on.gif','hdr.what.off':'${hdr.img.dir}what_off.gif'},this.componentParams);var defOpts=$iTXT.core.Util.extend({id:"itxtheader",height:21,margins:[6,4,2,2,1,1],defbgcol:"#FDFEFF$$#F6F6F6$$#F4F4F4$$#F1F0F0$$#EEEDEE$$#ECECEC$$#EBEBEA$$#EBEBEB$$#EBEBEB$$#E7E7E6$$#CFCFCF$$#D1D1D2$$#D3D3D3$$#D8D7D5$$#DDDDD9$$#E1E0D9$$#E5E4DB$$#E9E9DC$$#EBEBDC$$#EDECDD$$#E4E4E4",hdrTxt:"${hdr.txt}",whtTxt:"${hdr.wt.alt}",clsTxt:"${hdr.close.alt}",vmLogoSrc:"${hdr.logo}",clsSrcOn:"${hdr.close.on}",clsSrc:"${hdr.close.off}",whtSrcOn:"${hdr.what.on}",whtSrc:"${hdr.what.off}",custLogoSrc:"${hdr.brand}",custLogoTxt:"${hdr.brand.txt}"},_options);$super(defOpts);var o=this.options;$iTXT.core.Util.cacheImages([o.vmLogoSrc,o.clsSrcOn,o.clsSrc,o.whtSrcOn,o.whtSrc]);this.options.bgcolours=$iTXT.core.Util.parseColorArray(this.options.defbgcol,this.options.height,"$$");this._build();this.height=this.options.height;this.rootElement.itxtBatchSubscribe([["mouseover",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:hdr:mouse:over",e);}],["mouseout",function(e){$iTXT.core.$(document).itxtFire("$iTXT:tt:hdr:mouse:out",e);}]],this.evtDspFuncs);},setSize:function(w,h,$super)
{$super(w,this.options.height);},_build:function()
{var b=$iTXT.core.Builder;var t=this;this.rootElement.ondragstart=function(){return false;};this.rootElement.onselectstart=function(){return false;};if(!this.options.draggable)
{this.rootElement.className="fixed";}
var logoBtnArr=[];this.vmLogo=b.make("APNG",{className:"itxtvmlogo",src:this.options.vmLogoSrc});this.vmLogo.ondragstart=function(){return false;};this.vmLogo.itxtSubscribe("mousedown",function(e){$iTXT.core.Event.preventDefault(e);});this.vmLogo.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._vmLogoBtnClk));this.vmLogoWrapper=$iTXT.core.Builder.make("A",{target:'_blank'},[this.vmLogo]);logoBtnArr.push(this.vmLogoWrapper);this.whatBtn=b.make("APNG",{className:"itxtwhat",src:this.options.whtSrc,alt:this.options.whtTxt,title:this.options.whtTxt});this.whatBtn.itxtSubscribe("mouseover",function(){t.whatBtn.src=t.options.whtSrcOn;});this.whatBtn.itxtSubscribe("mouseout",function(){t.whatBtn.src=t.options.whtSrc;});this.whatBtn.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._whatBtnClk));this.whatBtnWrapper=$iTXT.core.Builder.make("A",{target:'_blank'},[this.whatBtn]);logoBtnArr.push(this.whatBtnWrapper);this.closeBtn=b.make("APNG",{className:"itxtclose",src:this.options.clsSrc,alt:this.options.clsTxt,title:this.options.clsTxt});this.closeBtn.itxtSubscribe("mouseover",function(){t.closeBtn.src=t.options.clsSrcOn;});this.closeBtn.itxtSubscribe("mouseout",function(){t.closeBtn.src=t.options.clsSrc;});this.closeBtn.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._closeBtnClk));logoBtnArr.push(this.closeBtn);var trCont=b.make("DIV",{className:"itxttrc"},logoBtnArr);this.rootElement.appendChild(trCont);if(""!=this.options.custLogoSrc)
{this._createCustomLogo();this.customLogo.itxtShow();}
this.hdrTxtCont=b.make("DIV",{className:"itxtadv"},[this.options.hdrTxt]);this.topLeftDiv=b.make("DIV",{className:"itxttlc"},[this.hdrTxtCont]);this.rootElement.appendChild(this.topLeftDiv);if(""==this.options.hdrTxt)
{this.topLeftDiv.itxtHide();}
var cornerNodes=[];for(var i=0;i<this.options.height;i++)
{var bgcol=this.options.bgcolours[i]||"black";cornerNodes.push(this._createDiv(this.options.margins[i],this.options.margins[i],bgcol));}
this.cornerHolder=$iTXT.core.Builder.make("DIV",{className:"itxtcrnhldr"},cornerNodes);this.rootElement.appendChild(this.cornerHolder);this.rootElement.itxtSubscribe("mousedown",$iTXT.core.Event.bind(this,this._hdrDown));this.rootElement.itxtSubscribe("mouseup",$iTXT.core.Event.bind(this,this._hdrUp));},_createCustomLogo:function()
{if(!this.customLogo)
{this.customLogo=$iTXT.core.Builder.make("APNG",{className:"itxtcustlogo",style:"display:none",src:this.options.custLogoSrc,alt:this.options.custLogoTxt,title:this.options.custLogoTxt});this.rootElement.appendChild(this.customLogo);this.customLogo.itxtSubscribe("click",$iTXT.core.Event.bind(this,this._customLogoBtnClk));}},_createDiv:function(lm,rm,bgcol)
{return $iTXT.core.Builder.make("DIV",{className:"itxtcrn",style:"background-color: "+(bgcol||this.options.bgcol)+"; margin-left: "+(lm||0)+"px; margin-right:"+(rm||0)+"px;"});},_hdrDown:function(e)
{if(this._hdrTarget(e.target))
{$iTXT.core.$(document).itxtFire("$iTXT:tt:hdr:mouse:down",e);}},_hdrUp:function(e)
{if(this._hdrTarget(e.target))
{$iTXT.core.$(document).itxtFire("$iTXT:tt:hdr:mouse:up",e);}},_hdrTarget:function(t)
{return((t!=this.closeBtn)&&(t!=this.whatBtn)&&(t!=this.vmLogo));},_closeBtnClk:function(e)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:close:btn:click");},_whatBtnClk:function(e)
{$iTXT.core.$(document).itxtFire("$iTXT:tt:what:btn:click");},_vmLogoBtnClk:function()
{$iTXT.core.$(document).itxtFire("$iTXT:tt:vmlogo:click");},_customLogoBtnClk:function()
{$iTXT.core.$(document).itxtFire("$iTXT:tt:logo:click");},setAdvert:function(ad,$super)
{if(this.advert==ad)
return;var adopts=ad.params;var tmpl=ad.getTemplate();var tmplopts=(null!=tmpl)?(tmpl.options||{}):{};$super(ad);var wtUrl=this.advert.params.parse("${tt.wturl}");var logoAT=ad.params.get("hdr.logo"+ad.$A.at);if(null!=logoAT&&""!=logoAT)
{this.options.vmLogoSrc=logoAT;}
this.vmLogo.itxtChangeSrc(this.options.vmLogoSrc);if(""==this.options.vmLogoSrc)
{this.vmLogo.itxtHide();}
else
{this.vmLogo.itxtShow();this.vmLogoWrapper.href=wtUrl;}
if(this.hdrTxtCont)
{this.hdrTxtCont.innerHTML=this.options.hdrTxt;var hdts=this.advert.params.get("hdr.txt.style");if(hdts)
{this.hdrTxtCont.itxtSetStyle(hdts);}}
if(this.closeBtn)
{this.closeBtn.alt=this.closeBtn.title=this.options.clsTxt;this.closeBtn.itxtChangeSrc(this.options.clsSrc);if(""==this.options.clsSrc)
{this.closeBtn.itxtHide();}
else
{this.closeBtn.itxtShow();}}
if(this.whatBtn)
{this.whatBtn.alt=this.whatBtn.title=this.options.whtTxt;this.whatBtn.itxtChangeSrc(this.options.whtSrc);if(""==this.options.whtSrc)
{this.whatBtn.itxtHide();}
else
{this.whatBtn.itxtShow();this.whatBtnWrapper.href=wtUrl;}}
if(""!=this.options.custLogoSrc)
{this._createCustomLogo();this.customLogo.itxtShow();this.customLogo.alt=this.customLogo.title=this.options.custLogoTxt;this.customLogo.itxtChangeSrc(this.options.custLogoSrc);}
else if(this.customLogo)
{this.customLogo.itxtHide();}
if(""==this.options.hdrTxt)
{this.topLeftDiv.itxtHide();}
else
{this.topLeftDiv.itxtShow();}
this.options.bgcolours=$iTXT.core.Util.parseColorArray(tmplopts.tthdrcol||adopts.get("tt.hdr.col",this.options.defbgcol),this.options.height,"$$");this._ubg();},_ubg:function(c)
{var bgCol=this.options.bgcolours;for(var i=0;i<this.cornerHolder.childNodes.length;i++)
{this.cornerHolder.childNodes[i].itxtSetStyle({backgroundColor:(bgCol[i]||'#ffffff')});}}});}