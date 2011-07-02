/**
 * 
 * Loads site analytics for the website identified by website_id, as specified in Adops.
 *
 * Websites that reference this file by installing the siteanalytics initialization code need not 
 * change anything when this file's logic gets updated.
 * 
 */

if (typeof siteanalytics == 'undefined') {
	var siteanalytics = {};
}

// Requests url and executes callback when the script is fully loaded

siteanalytics.add_script = function(url, callback, run_callback_onerror) {

		// Create a new script element and set its source
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = url;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function(){
			if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
				if (typeof callback == 'function') {
						callback()
				}

				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
			}
		};

		script.onerror = function() {
			if (run_callback_onerror && typeof callback == 'function') {
				callback();
			}
		}

		head.appendChild(script);
	};

siteanalytics.load_default_values = function() {
	if (window.gn_tracking && gn_tracking.flags.initialised != true) { 
		gn_tracking.init(siteanalytics.gn_tracking_defaults);
	}
};

siteanalytics.load_generated_file = function() {
	// loads the hourly refreshed file containing recent site analytics values.
	siteanalytics.add_script('http://' + siteanalytics.cdn_hostname + '/js/gen/' + siteanalytics.website_id + '.php', siteanalytics.load_default_values,true);
};

siteanalytics.load_siteanalytics = function () {
	// expects siteanalytics.gn_tracking_defaults, siteanalytics.website_id, siteanalytics.cdn_hostname to be defined before this file is sourced.	
	

	siteanalytics.add_script('http://' + siteanalytics.cdn_hostname + '/js/gn_tracking.js', siteanalytics.load_generated_file);
};

siteanalytics.load_siteanalytics(); // run load_siteanalytics function defined above.

