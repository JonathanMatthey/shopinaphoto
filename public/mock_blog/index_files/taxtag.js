var hl_ft_taxtag = '';
taxtag_name_array  = new Array(6);
taxtag_value_array = new Array(6);

taxtag_name_array[0]   = 'finance'; 	taxtag_value_array[0]  = 'PS=10437&amp;DI=4749';			
taxtag_name_array[1]   = 'lifestyle'; 	taxtag_value_array[1]  = 'PS=10513&amp;DI=4751';			
taxtag_name_array[2]   = 'news'; 	taxtag_value_array[2]  = 'PS=10321&amp;DI=4754';			
taxtag_name_array[3]   = 'sports'; 	taxtag_value_array[3]  = 'PS=10300&amp;DI=4753';			
taxtag_name_array[4]   = 'travel'; 	taxtag_value_array[4]  = 'PS=10324&amp;DI=4756';			
taxtag_name_array[5]   = 'entertainment'; 	taxtag_value_array[5]  = 'PS=10128&amp;DI=4748';			

if(JS_SITE=='portal'){
	hl_ft_taxtag='PS=10274&amp;DI=812';
	}
else if(JS_SITE == 'nz-portal') {
 hl_ft_taxtag='DI=239';
}	
else{
	hl_ft_taxtag='DI=12678';
	}
	

if(JS_NETNAV_TAB_GROUP!=''){			
	for(var hl_ft_counter=0; hl_ft_counter<taxtag_name_array.length; hl_ft_counter++) {		
		if(taxtag_name_array[hl_ft_counter]==JS_NETNAV_TAB_GROUP.toLowerCase()){	
			hl_ft_taxtag=taxtag_value_array[hl_ft_counter];
		}	
	}		
}			

hl_ft_taxtag+='&amp;PI=33480';

if(hl_ft_taxtag!=''){			
	document.write('<img alt="" height="1" width="1" src="http://c.ninemsn.com.au/c.gif?' + hl_ft_taxtag + '">')	

	
}			
