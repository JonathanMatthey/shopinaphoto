<!--
	//OPERATING SYSTEM DETECTION
	var detect = navigator.userAgent.toLowerCase();
	var OS;
	
	function checkIt(string) 
	{
		place = detect.indexOf(string) + 1;
		thestring = string;
		return place;
	}
	
	if (!OS) 
	{
		if (checkIt('mac')) 
		{
			OS = 'Mac';
		} 
		else if (checkIt('win')) 
		{
			OS = 'Windows';
		} 
		else 
		{
			OS = 'Other';
		}
	}
	
	// render this if OS not Mac and type is not foldout
	if (OS != 'Mac' & JS_NAV_TYPE != 'foldout') 
	{
		document.write('<STYLE type=text/css> #' + nav_div_id + ' .float {float:left;} #' + nav_div_id + ' .whitespace {white-space:nowrap;} #' + nav_div_id + ' .display {display:block;} ' + ' </STYLE>');
	}
			
	function countLevels(obj, direction, stopAtObject)
	{
		var sumLevels = 0;
		
		if(direction == 'up')
		{          
			while(obj.parentNode && (obj.parentNode != stopAtObject))
			{
				obj = obj.parentNode;
				if(obj.tagName == 'UL')
				{
					sumLevels = sumLevels + 1;
				}
			}          
			return sumLevels;
		}          
		
		if(direction == 'down')
		{
			var subObjects = obj.getElementsByTagName('LI');
			
			for(var no = 0; no < subObjects.length; no++)
			{
				sumLevels = Math.max(sumLevels, countLevels(subObjects[no], "up", obj));							
			}
			return sumLevels;
		}     
	}
		
	// recursive function to open up the foldout nav	
	var nav_flg = false;
	var nav_flg2 = false;
	function OpenRecursiveMenus(obj)
	{		
		var el = document.getElementById(obj);		//get the element 		
		if (el) 
		{
			var elClassName = el.className;				//get the element classname 
			//var elIndent = elClassName.substring(3);	//get the element indent
			if (elClassName == 'lvl1 float') 
			{
				el.className = 'lvl1_selected';	
				document.getElementById('navimg_' + obj).src =  '/img/img_pnav_selected.gif'; //change the image to be selected style
				if (countLevels(document.getElementById(obj), 'down') > 0) 
				{				
					el.childNodes[2].className = 'secondlevelgroup_show float'; // set the child UL classname
				}				
			} 
			else if (elClassName == 'lvl2 float')
			{
				el.className = 'lvl2_selected';
				
				if (countLevels(document.getElementById(obj), 'down') > 0) 
				{				
					el.childNodes[2].className = 'thirdlevelgroup_show float'; // set the child UL classname
				}
				
				var elParentUL = el.parentNode;							//get the parent UL 
				elParentUL.className = 'secondlevelgroup_show float';	//set the parent UL classname
				var elParentLI = elParentUL.parentNode;					//get the parent LI
				var elParentLIID = elParentLI.id;						//get the parent LI Id
				OpenRecursiveMenus(elParentLIID);						//run the function for parent LI until the indent is 1
			}
			else if (elClassName == 'lvl3 float') 
			{
				el.className = 'lvl3_selected';				
				var elParentUL = el.parentNode;							//get the parent UL 
				elParentUL.className = 'thirdlevelgroup_show float';	//set the parent UL classname
				var elParentLI = elParentUL.parentNode;					//get the parent LI
				var elParentLIID = elParentLI.id;						//get the parent LI Id
				OpenRecursiveMenus(elParentLIID);						//run the function for parent LI until the indent is 1				
			}
		} 
		else 
		{
			// if the element can't be found, then try to look the closest match with subsection name
			if (JS_SUB_SECTION != '' && JS_SUB_SECTION.indexOf('_') != -1 && nav_flg2 == false) 
			{
				nav_flg2 = true;
				var ii = 0; 
				var sN;
				
				for (var i = 0; i < JS_SUB_SECTION.length; i++) 
				{
					if (JS_SUB_SECTION.charAt(i) == "_" ) 
					{
						ii = i;						
					}					
				}
				
				if (ii == 0) 
				{
					sN = JS_SUB_SECTION;
				} 
				else 
				{
					sN = JS_SUB_SECTION.substring(0,ii);
				}
				
				var all_li = document.getElementsByTagName("LI");
				
				for (var i=0; i<all_li.length; i++) 
				{
					if (all_li[i].attributes["name"] && all_li[i].attributes["name"].value == sN) 
					{ 
						//if the subsection id is found, run the function with subsection id
						JS_SUB_SECTIONID = all_li[i].attributes["id"].value;
						OpenRecursiveMenus(JS_SUB_SECTIONID);				
					}
				}
			}		
			// if no match for subsection, try with the section
			if (nav_flg == false) 
			{
				nav_flg = true;
				OpenRecursiveMenus(JS_SECTIONID);				
			}
		}		
	}
	
	if (JS_NAV_TYPE == 'foldout')
	{			
		if (JS_SUB_SECTIONID != '0') 
		{
			OpenRecursiveMenus('sub' + JS_SUB_SECTIONID);
		} 
		else if (JS_SECTIONID != '0') 
		{
			OpenRecursiveMenus(JS_SECTIONID);
		}					
	} 
	else 
	{
		/*
		 * Modified: 02/04/08 (Domagoj Filipovic)
		 * Change:	Modified to apply the sfhover class at runtime rather than onload.
		 *			This is to allow the hover menu to be shown immediately on the page,
		 *			rather than waiting for all elements to load first (including ads)
		 */
		<!--//--><![CDATA[//><!--
		var sfEls = document.getElementById(nav_div_id).getElementsByTagName("LI");
		for (var i = 0; i < sfEls.length; i++) 
		{
			sfEls[i].onmouseover = function() 
			{
				this.className += " sfhover";
			}
			sfEls[i].onmouseout = function() 
			{
				this.className = this.className.replace(new RegExp(" sfhover\\b"), "");
			}
		}
		//--><!]]>
	}
-->