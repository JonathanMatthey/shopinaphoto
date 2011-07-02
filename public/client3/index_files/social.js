// Plugin to contain scripts frequently used across multiple widgets
// Minipersona, report abuse, that sort of thing.
pluckAppProxy.registerPlugin("pluck/social/social.js",
	// init function, called first time plugin is loaded:
	function ($, jQuery, dmJQuery){
		// Pull CSS.

		if (typeof(pluckAppProxy.pluck_social_load_css) === 'undefined') {
			pluckAppProxy.pluck_social_load_css = function(callback) {
				pluckAppProxy.pluck_load_css(function() {
					pluckAppProxy.loadCss("pluck/social/social.css", "pluck-social-css-loaded", function() {
						if(isIE6){
							pluckAppProxy.loadCss("pluck/social/social.ie6.css", "pluck-social-ie6-css-loaded", callback);
						} else if (callback) {
							callback();
						}
					});
				});
			};
		}
		pluckAppProxy.pluck_social_load_css();

		/**************************************
		 *
		 * pluck/social/facebook
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_facebook) === 'undefined') {
			pluckAppProxy.pluck_social_facebook_status = null;
			pluckAppProxy.pluck_social_facebook_dialog_callback = null;
			pluckAppProxy.pluck_social_facebook_featureloader_included = false;
			pluckAppProxy.pluck_social_facebook = function (dialogId, parentId, opts) {
				opts = opts ? opts : {};
				opts.connectStatus = null;
				opts.connectUid = null;
				pluckAppProxy.pluck_social_facebook_status = opts;

				pluckAppProxy.registerDialog(dialogId, function(id) {
				});
				pluckAppProxy.pluck_dialog_register("facebook", parentId, dialogId);
			};

			// Loads the facebook API and inits it.
			// params:
			//     callback : Function to call after successfully loaded.  See documentation for FB.getLoginStatus : http://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus
			//     failCallback : Facebook times out and does nothing in some edge cases.  Callback for when that happens.
			//     failTimeout : In miliseconds, the max amount of time to wait for facebook to get status.  Defaults to 5 seconds.
			//     iterCount : (don't worry about this).  Work around a race condition by re-checking iterCount number of times to see if FB is defined.  This is just used in the recursive calls, not for you.)
			pluckAppProxy.pluck_social_facebook_init = function(callback, failCallback, failTimeout, iterCount) {
				var opts = pluckAppProxy.pluck_social_facebook_status;
				// If no API key or user is Anonymous, do nothing, call callback immediately.
				if(!opts.ApiKey || opts.ApiKey == "") {
					if(callback) callback();
					return;
				}
				if (!iterCount) iterCount = 0;
				if (iterCount > 10){ 
					// Too many iterations waiting for facebook to init.  Hit the fail callback.
					if(failCallback){
						failCallback();
					}
					return;
				}

				//Crazy hack for removing document.write
				if ($("#fb-root").length == 0) {
					$("body").prepend('<div id="fb-root"></div>');
				}

				// Race condition where Fb isn't loaded yet...
				if (!window.FB) {
					if (pluckAppProxy.pluck_social_facebook_featureloader_included) {
						setTimeout(function() {
							pluckAppProxy.pluck_social_facebook_init(callback, failCallback, failTimeout, ++iterCount);
						}, 10 * (iterCount+1));
					} else {
						pluckAppProxy.pluck_social_facebook_featureloader_included = true;
						pluckAppProxy.loadScript(document.location.protocol + '//connect.facebook.net/en_US/all.js', function() {
							pluckAppProxy.pluck_social_facebook_init(callback, failCallback, failTimeout, ++iterCount);
						});
					}
					return;
				}

				if (!opts.initialized) {
					opts.initialized = true;
					FB.init({appId: opts.ApiKey, status: true, cookie: true, xfbml: true});
				}
				
				// Mostly for legacy purposes, store some session info.
				// Generally, we should just ask FB's API when we need this, to make sure we're getting the most up to date version.
				FB.Event.subscribe("auth.sessionChange", function(response){
					pluckAppProxy.pluck_social_facebook_status.connectStatus = response.status;
					pluckAppProxy.pluck_social_facebook_status.connectUid = response.session ? response.session.uid : null;
					pluckAppProxy.pluck_social_facebook_status.FacebookUid = pluckAppProxy.pluck_social_facebook_status.connectUid;
				});
				
				// Setup a timeout incase the facebook call fails.
				var failTimer = null;
				var callFailed = false;
				if(failCallback){
					if(!failTimeout){
						failTimeout = 5000;
					}
					failTimer = setTimeout(function(){
						failCallback();
						callFailed = true;	
					}, failTimeout);
				}
				
				FB.getLoginStatus(function(response){
					// If we've already passed the fail timeout, just bail.
					if(callFailed){
						return;
					}
					
					// Clear any pending fail callbacks before it's too late.
					if(failTimeout){
						clearTimeout(failTimer);
						failTimer = null;
					}
					
					if(callback){
						callback(response)
					}
				});
			};

			pluckAppProxy.pluck_social_facebook_private_requireSession = function(callback, cancelCallback) {
				pluckAppProxy.pluck_social_facebook_init(function(){				
					FB.login(function(response){
						if(response.session){
							if(callback){
								callback(response.session.uid, response.session);
							}
						}
						else{
							if(cancelCallback){
								cancelCallback();
							}
						}
					});
				});
			};

			pluckAppProxy.pluck_social_facebook_connect = function(target, callback, cancelCallback) {
				pluckAppProxy.pluck_social_facebook_init(function() {
					pluckAppProxy.pluck_social_facebook_private_requireSession(function(uid) {
						if (callback) callback(uid);
					}, function() {
						if (cancelCallback) cancelCallback();
					}, true);
				});
			};

			pluckAppProxy.pluck_social_facebook_logout = function(callback) {
				pluckAppProxy.pluck_social_facebook_init(function() {
					FB.logout(callback);
				});
			};

			// variables: a list of valid facebook variables. See http://wiki.developers.facebook.com/index.php/Attachment_(Streams)
			// actionLinks: a list of valid facebook actionLinks. See http://wiki.developers.facebook.com/index.php/Action_Links
			pluckAppProxy.pluck_social_facebook_streamPublish = function(target, userComment, variables, actionLinks, shareText, callback, cancelCallback) {
				pluckAppProxy.pluck_social_facebook_init(function() {
					pluckAppProxy.pluck_social_facebook_private_requireSession(function() {
						FB.ui({
							method: "stream.publish",
							message: userComment,
							attachment: variables,
							action_links: actionLinks,
							user_prompt_message: shareText
						}, function(response){
							if(response && response.post_id){
								if(callback) callback(response.post_id);
							}
							else{
								if(cancelCallback) cancelCallback();
							}
						});
					}, cancelCallback);
				});
			};

			pluckAppProxy.pluck_social_facebook_submitArticleComment = function(target, title, url, excerpt, comment_body, images, actionText, shareText, callback, cancelCallback) {
				if (excerpt && excerpt.length > 200) {
					excerpt = excerpt.substring(0, 200) + "...";
				}
				var variables = {
					'name' : title,
					'caption' : '',
					'href' : url,
					'description' : excerpt
				}
	
				// setup images if there are any...
				if(images && images.length > 0){
					variables['media'] = [];
					for (var i = 0; i < images.length; i++) {
						variables['media'].push({'type' : 'image', 'src' : images[i], 'href' : url});
					}
				}
				var actionLinks = [];
				if (actionText) actionLinks.push({'text': actionText, 'href' : url});
				pluckAppProxy.pluck_social_facebook_streamPublish(target, comment_body, variables, actionLinks, shareText, callback, cancelCallback);
			};
			
			pluckAppProxy.pluck_social_facebook_import_user = function(successCallback, failCallback, force_update){
				pluckAppProxy.pluck_social_facebook_init(function() {
					FB.login(function(response){
						if(response.session){
							params = {"access_token": response.session.access_token};
							if(force_update){
								params["force_update"] = "true";
							}
							// Add the FB API Key so our script can read it.
							pluckAppProxy.callApp("pluck/login/fbconnect/auth", 
								params, 
								function(resp){
									resp = eval("(" + resp + ")");
									if(resp.success){
										if(successCallback){
											successCallback(response);
										}
									}
									else{
										if(failCallback){
											failCallback(response);
										}
									}
								}
							);
						}
						else{
							alert("Facebook login failed.");
						}
					});
				});
			};
			
			// Redraw fbml.  Optionally pass in a jQuery or DOM object to only render children of that object.
			pluckAppProxy.pluck_social_facebook_redraw_fbml = function(parent){
				var targ = parent;
				try{
					targ = parent.get(0);
				}
				catch(e){
				}
				FB.XFBML.parse(targ);
			};
		}


		/**************************************
		 *
		 * pluck/social/twitter
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_twitter) === 'undefined') {
			pluckAppProxy.pluck_social_twitter_status = null;
			pluckAppProxy.pluck_social_twitter = function (opts) {
				opts = opts ? opts : {};
				pluckAppProxy.pluck_social_twitter_status = opts;
			};

			pluckAppProxy.pluck_social_twitter_startAuth = function(userKey, errorDiv, errorMsgDiv, callback) {
				pluckAppProxy.pluck_social_twitter_status.loginCallback = callback;
				var url = pluckAppProxy.baseUrl + "pluck/social/twitter/connect.app?plckUserKey=" + userKey;
				pluckAppProxy.pluck_social_twitter_status.loginWindow = window.open(url, 'twitterLoginWindow', '');
			};

			pluckAppProxy.pluck_social_twitter_completeAuth = function(success, errorCode, errorMessage) {
				if (pluckAppProxy.pluck_social_twitter_status.loginWindow) {
					pluckAppProxy.pluck_social_twitter_status.loginWindow.close();
					if (window.focus) {
						try {
					            window.focus();
						} catch (e) {}
					}
					pluckAppProxy.pluck_social_twitter_status.loginWindow = null;
				}
				var callback = pluckAppProxy.pluck_social_twitter_status.loginCallback;
				pluckAppProxy.pluck_social_twitter_status.loginCallback = null;
				if (callback) {
					callback(success, errorCode, errorMessage);
				}
			};

			// This is for use with backward compatibility to old twitter apps.
			window.twitterAuthComplete = function(screenName, userKey) {
				pluckAppProxy.pluck_social_twitter_completeAuth(true);
			};
		}

		/**************************************
		 *
		 * pluck/social/twitter/inviteDialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_twitter_inviteDialog) === 'undefined') {
			pluckAppProxy.pluck_social_twitter_inviteDialog = function (dialogId, parentId, twitterUrl) {
				pluckAppProxy.pluck_dialog_register("twitterInvite", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
				});

				var dialog = $(dialogId);
				var lastKeyTimeout = null;
				$("textarea", dialog).keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var remaining = 140 - me.val().length;
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-1", dialog).toggle(remaining == 1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-1", dialog).toggle(remaining == -1);
						$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-50", dialog).toggle(remaining < -1);
						$(".pluck-twitter-invite-counter-wrapper", dialog).toggle(remaining < 50);
					}, 500);
				});

				$(".pluck-twitter-invite-submit", dialog).click(function() {
					var form = $(".pluck-twitter-invite-form", dialog);
					var tweet = $('textarea', form).val();
					tweet = $.trim(tweet);
					if (tweet.length > 140) return false;

					$('.pluck-error-message', form).hide();
					var form_top = $(this).parents('div.pluck-twitter-invite-dialog');
					pluckAppProxy.displayWait($('.pluck-twitter-invite-wait', form_top));
					var params = { contentType: "Json", plckAction: "sendTweet", plckTweet: tweet };
					pluckAppProxy.callApp("pluck/social/twitter/actions.app", params, function(data) {
						$('.pluck-twitter-invite-wait', form_top).hide();
						data = eval('(' + data + ')');
						if (data.success) {
							pluckAppProxy.fadeOut(dialog);
						} else {
							$(".pluck-error-message", dialog).hide();
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-twitter-invite-tweet-error", dialog).show();
						}
					});
					return false;
				});

				$(".pluck-twitter-invite-cancel", dialog).click(function() {
					$("textarea", dialog).val($("input.pluck-twitter-invite-default-message", dialog).val());
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_social_twitter_inviteDialog_link(parentId);
				if (twitterUrl) {
					var params = { contentType: "Json", plckAction: "shortenUrl", plckUrl: twitterUrl };
					pluckAppProxy.callApp("pluck/util/share/actions.app", params, function(data) {
						data = eval('(' + data + ')');
						if (data.success) {
							var defVal = $("input.pluck-twitter-invite-default-message", dialog).val();
							defVal = defVal + " " + data.shortUrl;
							$("input.pluck-twitter-invite-default-message", dialog).val(defVal);
						}
					});
				}
			};

			pluckAppProxy.pluck_social_twitter_inviteDialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-social-twitter-inviteDialog-set", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_social_twitter_inviteDialog_show($(this));
						return false;
					});
				});
			};
			pluckAppProxy.pluck_social_twitter_inviteDialog_show = function (obj) {
				var img = $("img", obj);
				if (img.length > 0) {
					obj = img.eq(0);
				}

				var dialog = pluckAppProxy.pluck_find_dialog("twitterInvite", obj);
				if (!dialog) return;
				$('.pluck-error-message', dialog).hide();
				$("textarea", dialog).val($("input.pluck-twitter-invite-default-message", dialog).val());
				var remaining = 140 - $("textarea", dialog).val().length;
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-counter-1", dialog).toggle(remaining == 1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-1", dialog).toggle(remaining == -1);
				$(".pluck-twitter-invite-counter-wrapper .pluck-twitter-invite-over-counter-50", dialog).toggle(remaining < -1);
				$(".pluck-twitter-invite-counter-wrapper", dialog).toggle(remaining < 50);

				var displayType = obj.attr("dialogdisplay");
				var offsets = "";
				if (displayType == "baseline") {
					offsets = { top: 9, left: (obj.width() + 10) * -1 };
				} else {
					offsets = { top: ($.browser.msie && $.browser.version < 8 ? dialog.outerHeight() : dialog.height()), left: Math.round((dialog.width() - obj.width()) / 2) };
				}
				pluckAppProxy.displayDialog(dialog, obj, offsets, function() {
					$("textarea", dialog).focus();
				});
			};
		}

		/**************************************
		 *
		 * pluck/social/linkedIn
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_linkedIn) === 'undefined') {
			pluckAppProxy.pluck_social_linkedIn_status = null;
			pluckAppProxy.pluck_social_linkedIn = function (opts) {
				opts = opts ? opts : {};
				pluckAppProxy.pluck_social_linkedIn_status = opts;
			};

			pluckAppProxy.pluck_social_linkedIn_startAuth = function(userKey, errorDiv, errorMsgDiv, callback) {
				pluckAppProxy.pluck_social_linkedIn_status.loginCallback = callback;
				var url = pluckAppProxy.baseUrl + "pluck/social/linkedIn/connect.app?plckUserKey=" + userKey;
				pluckAppProxy.pluck_social_linkedIn_status.loginWindow = window.open(url, 'linkedInLoginWindow', '');
			};

			pluckAppProxy.pluck_social_linkedIn_completeAuth = function(success, errorCode, errorMessage) {
				if (pluckAppProxy.pluck_social_linkedIn_status.loginWindow) {
					pluckAppProxy.pluck_social_linkedIn_status.loginWindow.close();
					if (window.focus) {
						try {
					            window.focus();
						} catch (e) {}
					}
					pluckAppProxy.pluck_social_linkedIn_status.loginWindow = null;
				}
				var callback = pluckAppProxy.pluck_social_linkedIn_status.loginCallback;
				pluckAppProxy.pluck_social_linkedIn_status.loginCallback = null;
				if (callback) {
					callback(success, errorCode, errorMessage);
				}
			};

			// This is for use with backward compatibility to old twitter apps.
			window.linkedInAuthComplete = function(profileName, userKey) {
				pluckAppProxy.pluck_social_linkedIn_completeAuth(true);
			};
		}

		/**************************************
		 *
		 * pluck/social/linkedIn/inviteDialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_social_linkedIn_inviteDialog) === 'undefined') {
			pluckAppProxy.pluck_social_linkedIn_inviteDialog = function (dialogId, parentId, linkedInUrl) {
				pluckAppProxy.pluck_dialog_register("linkedInInvite", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
				});

				var dialog = $(dialogId);
				var lastKeyTimeout = null;
				$("textarea", dialog).keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var remaining = 1000 - me.val().length;
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-1", dialog).toggle(remaining == 1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-1", dialog).toggle(remaining == -1);
						$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-50", dialog).toggle(remaining < -1);
						$(".pluck-linkedIn-invite-counter-wrapper", dialog).toggle(remaining < 50);
					}, 500);
				});

				$(".pluck-linkedIn-invite-submit", dialog).click(function() {
					var form = $(".pluck-linkedIn-invite-form", dialog);
					var message = $('textarea', form).val();
					message = $.trim(message);
					if (message.length > 1000) return false;

					$('.pluck-error-message', form).hide();
					var form_top = $(this).parents('div.pluck-linkedIn-invite-dialog');
					pluckAppProxy.displayWait($('.pluck-linkedIn-invite-wait', form_top));
					var params = { contentType: "Json", plckAction: "sendLinkedIn", plckMessage: message };
					pluckAppProxy.callApp("pluck/social/linkedIn/actions.app", params, function(data) {
						$('.pluck-linkedIn-invite-wait', form_top).hide();
						data = eval('(' + data + ')');
						if (data.success) {
							pluckAppProxy.fadeOut(dialog);
						} else {
							$(".pluck-error-message", dialog).hide();
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-linkedIn-invite-tweet-error", dialog).show();
						}
					});
					return false;
				});

				$(".pluck-linkedIn-invite-cancel", dialog).click(function() {
					$("textarea", dialog).val($("input.pluck-linkedIn-invite-default-message", dialog).val());
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_social_linkedIn_inviteDialog_link(parentId);
				if (linkedInUrl) {
					var params = { contentType: "Json", plckAction: "shortenUrl", plckUrl: linkedInUrl };
					pluckAppProxy.callApp("pluck/util/share/actions.app", params, function(data) {
						data = eval('(' + data + ')');
						if (data.success) {
							var defVal = $("input.pluck-linkedIn-invite-default-message", dialog).val();
							defVal = defVal + " " + data.shortUrl;
							$("input.pluck-linkedIn-invite-default-message", dialog).val(defVal);
						}
					});
				}
			};

			pluckAppProxy.pluck_social_linkedIn_inviteDialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-social-linkedIn-inviteDialog-set", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_social_linkedIn_inviteDialog_show($(this));
						return false;
					});
				});
			};
			pluckAppProxy.pluck_social_linkedIn_inviteDialog_show = function (obj) {
				var img = $("img", obj);
				if (img.length > 0) {
					obj = img.eq(0);
				}

				var dialog = pluckAppProxy.pluck_find_dialog("linkedInInvite", obj);
				if (!dialog) return;
				$('.pluck-error-message', dialog).hide();
				$("textarea", dialog).val($("input.pluck-linkedIn-invite-default-message", dialog).val());
				var remaining = 1000 - $("textarea", dialog).val().length;
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-count", dialog).html(remaining < 0 ? remaining * -1 : remaining);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-50", dialog).toggle(remaining == 0 || remaining > 1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-counter-1", dialog).toggle(remaining == 1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-1", dialog).toggle(remaining == -1);
				$(".pluck-linkedIn-invite-counter-wrapper .pluck-linkedIn-invite-over-counter-50", dialog).toggle(remaining < -1);
				$(".pluck-linkedIn-invite-counter-wrapper", dialog).toggle(remaining < 50);

				var displayType = obj.attr("dialogdisplay");
				var offsets = "";
				if (displayType == "baseline") {
					offsets = { top: 9, left: (obj.width() + 10) * -1 };
				} else {
					offsets = { top: ($.browser.msie && $.browser.version < 8 ? dialog.outerHeight() : dialog.height()), left: Math.round((dialog.width() - obj.width()) / 2) };
				}
				pluckAppProxy.displayDialog(dialog, obj, offsets, function() {
					$("textarea", dialog).focus();
				});
			};
		}
	},
	
	// eachTime function.  Called whenever the plugin is requested, responsible for executing callbacks.
	function ($, jQuery, dmJQuery, callback){
		if(callback){
			callback();
		}
	}
);