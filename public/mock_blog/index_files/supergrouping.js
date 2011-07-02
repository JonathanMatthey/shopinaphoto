function fetchMe(id,_oArrCats,_oArrGroups,_oArrAnid)
{
	var arrTemp = id.split('_'); 
	var idx = arrTemp[1]; 
	var js_date = '1/11/2007'; 
	var js_pageurl ='any'; 
	if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
	{
		writeToANID(_oArrAnid[0], _oArrCats[idx], idx); 
	}
	var _oSwap = function(obj){if(obj && obj != null){ var cat = 'SuperGroup_' + _oArrCats[0]; var oDiv = document.getElementById(cat); oDiv.innerHTML = obj.responseText; }};
	try
	{ 
		var _oPropList = new Ninemsn.Global.ContentManager.AjaxProp('GET', null , parseInt(eval('_cacheDuration_' + _oArrCats[0])*60*1000)); 
		var fetchUrl='/share/com/highlights/hl_template.aspx?supermode=1&mode=preview&category='+ _oArrCats[idx] +'&group=' + _oArrGroups[idx] + '&date=' + js_date+ '&HLGROUP=' + _oArrGroups[idx] + '&HLDATE=' + js_date + '&siteid=' + JS_SITEID +'&sectionid=' + JS_SECTIONID+ '&subsectionid=' + JS_SUB_SECTIONID+ '&PAGEURL=' + js_pageurl; 
		Ninemsn.Global.ContentManager.GetContent(fetchUrl,_oSwap,_oPropList); 
	} 
	catch(e)
	{	
	}	
}

function showMe(id,_oArr,_oArrAnid)
{
	var arrTemp = id.split('_'); 
	var idx = arrTemp[1]; 
	if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
	{
		writeToANID(_oArrAnid[0], _oArr[idx], idx); 
	}
	var nodeToShow = document.getElementById('cat_hl_' + _oArr[idx]);
	if(!nodeToShow) //cant find node to show
		return false;
	var sgNode = document.getElementById('SuperGroup_' + _oArr[0]);
	if(nodeToShow.parentNode == sgNode)
		return false;//do nothing.  We have selected the node that is already the one showing

	if(sgNode)
	{
		for(var currNode = sgNode.firstChild; currNode != undefined; currNode = currNode.nextSibling)
		{
			if(currNode.id && currNode.id.match("cat_hl_"))
				break;//found the current node
		}
		
		if(currNode)//swap the current node with the node to show
		{
			var nextSibling = currNode.nextSibling;
			var parentNode = currNode.parentNode;
			nodeToShow.parentNode.replaceChild(currNode, nodeToShow);
			parentNode.insertBefore(nodeToShow, nextSibling);
		}
		else//no current node found. append to the supergroup
			sgNode.appendChild(nodeToShow);
	}
	
	//loop through each tab and set appropriate style depending on if this tab is selected.
	for(var i = 0; i < _oArr.length; i++)
	{
		var tab = document.getElementById("link_" + i + "_" + _oArr[i]);
		var tabOnClass = "tab-selected";
		var tabOffClass = "tab-unselected";

		if(tab)
		{
			if(i == idx)
			{//set to selected
				if(tab.className.length == 0)
					tab.className = tabOnClass;
				else if(tab.className.match(tabOffClass))
					tab.className = tab.className.replace(tabOffClass, tabOnClass);
				else
					tab.className += " " + tabOnClass;
			}
			else
			{//set to unselected
				if(tab.className.length == 0)
					tab.className = tabOffClass;
				else if(tab.className.match(tabOnClass))
					tab.className = tab.className.replace(tabOnClass, tabOffClass);
				else
					tab.className += " " + tabOffClass;
			}
		}
	}
}

function execMe(_oArrMode,_oArrCats,_oArrGroups,objectId,_oArrAnid, flag)
{ 
	var _oArrMode = _oArrMode.split(',');
	var _oArrCats = _oArrCats.split(',');
	var _oArrGroups = _oArrGroups.split(',');
	var _oArrAnid = _oArrAnid.split(',');
	var _oArrObjectId = objectId.split('_');

	if(_oArrMode[0]=='0')
	{
		fetchMe(objectId,_oArrCats,_oArrGroups,_oArrAnid);
	}
	if(_oArrMode[0]=='1')
	{
		showMe(objectId,_oArrCats,_oArrAnid);
	}
	if(_oArrMode[0]=='2' && _oArrObjectId[1] =='0')
	{
		expandAll(_oArrCats,_oArrAnid);
	}
	if(_oArrMode[0]=='2' && _oArrObjectId[1] =='1')
	{
		collapseAll(_oArrCats,_oArrAnid);
	}
	if(_oArrMode[0]=='3' && _oArrObjectId[1] =='0')
	{
		expandInc(0,_oArrCats,_oArrAnid);
	}
	if(_oArrMode[0]=='3' && _oArrObjectId[1] =='1')
	{
		collapseInc(_oArrCats,_oArrAnid);
	}
}

function expandInc(expandLevel,_oArr,_oArrAnid)
{
    var _lcBlnExpand = eval('_blnExpand_' + _oArr[0]);
    var _lcIdx = parseInt(eval('_int_ex_idx_' + _oArr[0]));
	if(expandLevel && parseInt(expandLevel) > 0)
	{
		for(var cnt = 0; cnt < parseInt(expandLevel); cnt++)
		{
			if(document.getElementById('SuperGroup_' + _oArr[cnt]))
		    {
			    var ex_obj_div = document.getElementById('SuperGroup_' + _oArr[cnt]); 
			    ex_obj_div.style.display  = 'inline'; 
			    ex_obj_div.style.visibility = 'visible' 
			} 
		}
		eval('_int_ex_idx_' + _oArr[0] + ' = parseInt(expandLevel)');
	}
	else
	{
		if(_lcBlnExpand == false)
		{
		    if(document.getElementById('SuperGroup_' + _oArr[1]))
		    {		
			    var ex_obj_div = document.getElementById('SuperGroup_' + _oArr[1]); 
			    ex_obj_div.style.display  = 'inline'; 
			    ex_obj_div.style.visibility = 'visible'; 
			} 
			eval('_int_ex_idx_' + _oArr[0] + ' = 2');
		    eval('_blnExpand_' + _oArr[0] + ' = true'); 
		}
		else if(_lcBlnExpand = true && (parseInt(_lcIdx) < _oArr.length))
		{
		    if(document.getElementById('SuperGroup_' + _oArr[_lcIdx]))
		    {
			    var ex_obj_div = document.getElementById('SuperGroup_' + _oArr[_lcIdx]); 
			    ex_obj_div.style.display  = 'inline'; 
			    ex_obj_div.style.visibility = 'visible'; 
			} 
            eval('_int_ex_idx_' + _oArr[0] + ' = parseInt(_lcIdx + 1)');
		}
		eval('_blnExpand_' + _oArr[0] + ' = true'); 
		if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
		{
			writeToANID(_oArrAnid[0], eval('_int_ex_idx_' + _oArr[0]), -1);
		}
	}
}

function collapseInc(_oArr,_oArrAnid)
{
    var _lcIdx = parseInt(eval('_int_ex_idx_' + _oArr[0]));
	if(_lcIdx > 1)
	{
	    if(document.getElementById('SuperGroup_' + _oArr[_lcIdx -1]))
	    {
		    var cl_obj_div = document.getElementById('SuperGroup_' + _oArr[_lcIdx -1]); 
		    cl_obj_div.style.display  = 'none'; 
		    cl_obj_div.style.visibility = 'hidden'; 
		}
		eval('_int_ex_idx_' + _oArr[0] + ' = parseInt(_lcIdx - 1)');
		if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
		{
			writeToANID(_oArrAnid[0], eval('_int_ex_idx_' + _oArr[0]), -1);
		}
	}
}

function expandAll(_oArr,_oArrAnid)
{
    var _lcBlnExpand = eval('_blnExpand_' + _oArr[0]);
	if(_lcBlnExpand == false)
	{
		for(var cnt = 0; cnt < _oArr.length; cnt++)
		{
		    if(document.getElementById('SuperGroup_' + _oArr[cnt]))
		    {
			    var ex_obj_div = document.getElementById('SuperGroup_' + _oArr[cnt]); 
			    ex_obj_div.style.display  = 'inline'; 
			    ex_obj_div.style.visibility = 'visible'; 
			} 
		} 
		eval('_blnExpand_' + _oArr[0] + ' = true'); 
		if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
		{
			writeToANID(_oArrAnid[0], 1, -1);
		}
	}
}

function collapseAll(_oArr,_oArrAnid)
{
    var _lcBlnExpand = eval('_blnExpand_' + _oArr[0]);
	if(_lcBlnExpand == true)
	{
		for(var cnt = _oArr.length -1; cnt > 0 ; cnt--)
		{
		    if(document.getElementById('SuperGroup_' + _oArr[cnt]))
		    {
			    var ex_obj_div = document.getElementById('SuperGroup_' + _oArr[cnt]); 
			    ex_obj_div.style.display  = 'none'; 
			    ex_obj_div.style.visibility = 'hidden'; 
		    } 
		}
		eval('_blnExpand_' + _oArr[0] + ' = false'); 
		if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
		{
			writeToANID(_oArrAnid[0], -1, -1);
		}
	}
} 

function writeToANID(ANID_KEY, ANID_VALUE, IDX) 
{
	try
	{
		if(IDX != '-1')
		{
			Ninemsn.Site.NH.Profile.Set(ANID_KEY,ANID_VALUE + '_' + IDX);
		}
		else
		{
			Ninemsn.Site.NH.Profile.Set(ANID_KEY,ANID_VALUE);
		}
	}
	catch(e)
	{
	
	}
}

function getTabSkin(_oArrCats,_oArrTitles,_oArrMode,_oArrGroups,_oArrAnid)
{
   var _onClickCode = "execMe('" + _oArrMode + "','" + _oArrCats + "','" + _oArrGroups + "',this.id,'" + _oArrAnid+ "')";
	var swpDiv = document.getElementById('cat_hl_' + _oArrCats[0] + '_stage'); 
	swpDiv.innerHTML = eval('tabbing_skin_' + _oArrCats[0] + '(_oArrCats,_oArrTitles,_onClickCode)');  
	document.getElementById('cat_hl_' + _oArrCats[0] + '_tabLoc').innerHTML = swpDiv.innerHTML; 
	setTimeout("getANIDData('" + _oArrCats +"','" + _oArrMode + "','" + _oArrAnid + "','" + _oArrGroups + "')",100);
}

function getANIDData(_oArrCats,_oArrMode,_oArrAnid,_oArrGroups)
{
	try
	{
		var _oArrCats = _oArrCats.split(',');
		var _oArrMode = _oArrMode.split(',');
		var _oArrAnid = _oArrAnid.split(',');
		var _oArrGroups = _oArrGroups.split(',');
		
		var _oCallBack = function(obj){
		if(obj && obj != null)
		{
			var __oArrCats = _oArrCats;
			var __oArrMode = _oArrMode;
			var __oArrAnid = _oArrAnid;
			var __oArrGroups = _oArrGroups;
		
			var _value = obj.ProfileResult; 
			if(_value != null)
			{
				if(__oArrMode[0] == '0')
				{
					var _idx = _value.split('_');  
					var id = 'link_' + _idx[1]; 
					fetchMe(id,__oArrCats,__oArrGroups);
				}
				else if(__oArrMode[0] == '1')
				{
					var _idx = _value.split('_'); 
					var id = 'link_' + _idx[1]; 
					showMe(id,__oArrCats);
				}
				else if(__oArrMode[0] == '2' && _value == '1')
				{
					expandAll(__oArrCats); 
				}
				else if(__oArrMode[0] == '3' && parseInt(_value) > 0)
				{
					expandInc(_value,__oArrCats); 
					eval('_int_ex_idx_' + _oArrCats[0] + ' = parseInt(_value)'); 
					eval('_blnExpand_' + _oArrCats[0] + ' = true'); 
				}
			}
		}
	    }		
		if(_oArrAnid && _oArrAnid != null && _oArrAnid != 'null')
		{
			Ninemsn.Site.NH.Profile.Get(_oArrAnid[0],_oCallBack); 
		}
	}
	catch(e)
	{
	}
}

