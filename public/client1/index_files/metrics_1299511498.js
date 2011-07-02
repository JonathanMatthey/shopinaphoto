/* This source code is Copyright (c) Vibrant Media 2001-2011 and forms part of the patented Vibrant Media product "IntelliTXT" (sm). */ 
$iTXT.js.loader["$iTXT.metrics.Events"]=true;$iTXT.metrics.Events_Load=function(){var undefined;$iTXT.metrics.Events=$iTXT.core.Class.create({cOut:true,eventQueue:null,init:function()
{this.eventQueue={};$iTXT.subscribe("$iTXT:metrics:evt",$iTXT.core.Event.bind(this,this._event));$iTXT.subscribe("$iTXT:adlogger:before:log",$iTXT.core.Event.bind(this,this._adlog));},_event:function(e)
{var opts=e.data||{};if(opts.n&&""!=opts.n)
{var evt=this.eventQueue[opts.n];if(null==evt)
{evt=this._createEvt(opts.n,opts.t);this.eventQueue[opts.n]=evt;}
this._updateEvt(evt,opts);}},_updateEvt:function(evt,opts)
{if(evt.t&&"interval"==evt.t)
{if(evt.st)
{evt.et=(new Date()).getTime();evt.done=true;this._log("Interval: "+this._pname(evt.n)+" "+(evt.et-evt.st)+"ms");}
else
{evt.st=(new Date()).getTime();}}
else
{evt.st=this._timeSinceLoad();evt.done=true;this._log("TimeSinceLoad: "+this._pname(evt.n)+" "+(evt.tsl)+"ms");}},_createEvt:function(name,evtType)
{evtType=evtType||"timesince";var evt={n:name,t:evtType,done:false};return evt;},_timeSinceLoad:function()
{return(new Date()).getTime()-$iTXT.js.startTime;},_log:function(msg)
{$iTXT.debug.debug($iTXT.debug.Category.MONITOR,msg);},_pname:function(n)
{var a={'ll':'Libraries Loaded','tl':'Templates Loaded','intl':'Initialiser Loaded','contl':'Contextualiser Loaded','advl':'Advertiser Loaded','contint':'Contextualiser Interval','advint':'Advertiser Interval'};return a[n];},getEvents:function()
{var retObj={};for(var ename in this.eventQueue)
{var evt=this.eventQueue[ename];if(evt&&evt.done)
{this.eventQueue[ename]=undefined;var evtVal=evt.st;if(evt.et&&""!=evt.et)
{evtVal=evt.et-evt.st;}
retObj[ename]=evtVal;}}
return retObj;},_adlog:function(e)
{var cb=e.data||null;if('function'==typeof cb)
{var evts=this.getEvents(),pEvts=[];for(var n in evts)
{pEvts[pEvts.length]=n+':'+evts[n];}
pEvts=pEvts.join('|');cb({prf:pEvts});}}});}
$iTXT.js.loader["$iTXT.metrics.Context"]=true;$iTXT.metrics.Context_Load=function(){var undefined;var $itxtUtil=$iTXT.core.Util;$iTXT.metrics.Context={nodeMetrics:{_lastInst:0,_lastNode:'',_intervals:[],_metrics:{},_events:{},_nodes:{},reset:function()
{this._lastInst=0;this._intervals=[];this._events={};this._metrics={};this._nodes={};},tick:function(mId,node)
{if('string'!=typeof mId)
{return;}
var inst=new Date().getTime();this._events[mId]=[];this._metrics[inst]=mId;var interval=inst-this._lastInst;if(this._lastInst>0&&interval>0)
{this._intervals.push(interval);}
this._lastInst=inst;if(node)
{var nT=node.nodeType;if(nT)
{if($itxtUtil.ELEMENT_NODE==nT)
{node=$itxtUtil.serialiseJSON($iTXT.data.Dom.parseElement(node,null));}
else if($itxtUtil.ATTRIBUTE_NODE==nT)
{node=node.nodeName+'@'+node.nodeValue;}
else if($itxtUtil.TEXT_NODE==nT)
{node=$itxtUtil.cleanString(node.nodeValue);if(""==node)
{node=null;}}
else
{node=null;}
if(node)
{this._nodes[mId]=node.substr(0,70);}}}},tock:function(mId,evt)
{if('string'!=typeof mId||'string'!=typeof evt)
{return;}
var inst=new Date().getTime();var obj={};obj[evt]=inst;this._events[mId].push(obj);},dumpEvents:function()
{var count=0;var out="<tt>";for(var dt in this._metrics)
{var metric=this._metrics[dt];var title=this._nodes[metric]||metric;if('function'!=typeof metric)
{out+=$itxtUtil.sizeString('',53,false,'-');out+=' ';out+=$itxtUtil.sizeString('',14,false,'-');out+=' ';out+=$itxtUtil.sizeString('',9,false,'-');out+='<br />'+(count++)+': '+title+'<br />';}
var evts=this._events[metric];var lastDT=0;for(var i=0;i<evts.length;i++)
{var thisEvt=evts[i];for(var eName in thisEvt)
{if('function'!=typeof thisEvt[eName])
{var thisDT=thisEvt[eName];var dur=(lastDT==0)?0:thisDT-lastDT;out+=$itxtUtil.sizeString(eName,53,false,'&nbsp;');out+=$itxtUtil.sizeString(thisDT,15,true,'&nbsp;');out+=$itxtUtil.sizeString(dur,10,true,'&nbsp;');out+='<br />';lastDT=thisDT;}}}}
out+=$itxtUtil.sizeString('',53,false,'-');out+=' ';out+=$itxtUtil.sizeString('',14,false,'-');out+=' ';out+=$itxtUtil.sizeString('',9,false,'-');out+='</tt><br />';return out;},getMax:function()
{return $iTXT.core.Math.arrayMax(this._intervals);},getMin:function()
{return $iTXT.core.Math.arrayMin(this._intervals);},getMean:function(rnd)
{return $iTXT.core.Math.arrayMean(this._intervals,rnd);},getMedian:function()
{return $iTXT.core.Math.arrayMedian(this._intervals);},getTotal:function()
{return this._intervals.length;}}};}