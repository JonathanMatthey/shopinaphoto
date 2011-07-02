function mycarousel_initCallback(carousel) {
	
	jQuery('.btnNum').bind('click', function() {
        carousel.scroll(jQuery.jcarousel.intval(jQuery(this).text()));
        return false;
    });

    jQuery('#btnNext').bind('click', function() {
        carousel.next();
        return false;
    });

    jQuery('#btnPrev').bind('click', function() {
        carousel.prev();
        return false;
    });
	
};

// Ride the carousel...
jQuery(document).ready(function() {
								
    jQuery("#celebrityCarousel").jcarousel({
        scroll: 4,
		visible: 4,
        initCallback: mycarousel_initCallback,
        // This tells jCarousel NOT to autobuild prev/next buttons
        buttonNextHTML: null,
        buttonPrevHTML: null
    });
	
	jQuery('.boxLatestNewsScroll').jScrollPane();
	jQuery("ul li:last-child, ol li:last-child, .comment:last, .searchItem:last").addClass("last");
	jQuery('#popularTabs').tabs({});
	
	jQuery('#sliderInner') 
		.before('<div class="controls">') 
		.cycle({ 
		fx:     'fade', 
		speed:  300, 
		timeout: 5000, 
		pager:  '.controls' 
	});
		
	jQuery('#profileContent').truncate({max_length: 370});
	
	$('.searchForm input[type=text]').each(function() {

		var default_value = this.value;
		
		jQuery(this).focus(function() {
			if(this.value == default_value) {
				this.value = '';
			}
		});
		
		jQuery(this).blur(function() {
			if(this.value == '') {
				this.value = default_value;
			}
		});
	
	});
	
	
	jQuery(".tv-box-item").hover(function () {
		
		jQuery(this).attr('id', 'tv-box-item-current').siblings().removeAttr('id');
		
		jQuery('#tv-box-image-current').removeAttr('id');
		jQuery('.tv-box-image').eq( jQuery(this).index() ).attr('id', 'tv-box-image-current');
	
	}, function () {
	
	
	
	});

	
	
	
});
