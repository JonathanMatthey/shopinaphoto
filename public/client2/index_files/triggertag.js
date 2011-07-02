
function getTrigger(id, isDynamic) {	
	  var gn_country = ""; 
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf("gn_country=") == 0)  {
				gn_country = c.substring(11,c.length);
				break;
			}
		}
		
	  document.write('<script src="http://cdn.assets.craveonline.com/js/tracking/gn_tracking.js" type="text/javascript"><\/script>');		
	  
	  if (gn_country == "") {
		document.write('<script src="http://geo.gorillanation.com/geo.php?dynamic='+parseInt(0|isDynamic)+'&website_id=' + id + '" type="text/javascript"><\/script>');
	  }
	  else 
	  {
	  	if (typeof(isDynamic)=='undefined' || isDynamic == false) {
			document.write('<script src="http://cdn.triggertag.gorillanation.com/js/' + id + '_' + gn_country + '.php" type="text/javascript"><\/script>');		  	
	  	}
		else {
			document.write('<script src="http://cdn.triggertag.gorillanation.com/js/' + id + '_' + gn_country + '_manifest.php" type="text/javascript"><\/script>');	  
		} 	  
	  }	  		
}
