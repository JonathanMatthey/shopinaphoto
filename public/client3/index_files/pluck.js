// Plugin to contain scripts frequently used across multiple widgets
// Minipersona, report abuse, that sort of thing.

pluckAppProxy.registerPlugin("pluck/pluck.js",
	// init function, called first time plugin is loaded:
	function($, jQuery, dmJQuery){
		// Pull CSS.
		if (typeof(pluckAppProxy.pluck_load_css) === 'undefined') {
			pluckAppProxy.pluck_load_css = function(callback) {
				pluckAppProxy.loadCss("pluck/pluck.css", "pluck-css-loaded", function() {
					if(isIE6){
						pluckAppProxy.loadCss("pluck/pluck.ie6.css", "pluck-ie6-css-loaded", callback);
					} else if (callback) {
						callback();
					}
				});
			};
		}
		pluckAppProxy.pluck_load_css(function(){
			if (isIE6 && typeof(DD_belatedPNG) == 'object') {
				DD_belatedPNG.fix('.pluck-reactions-recommend-like, .pluck-reactions-recommend-liked');
			}
    });

		if (typeof(pluckAppProxy.pluck_dialog_register) === 'undefined') {
			pluckAppProxy.pluck_dialog_cache = {};
			pluckAppProxy.pluck_dialog_register = function(type, parentId, dialogId) {
				var obj = pluckAppProxy.pluck_dialog_cache;
				if (!obj[type]) {
					obj[type] = {};
				}
				obj[type][parentId] = dialogId;
			};
			pluckAppProxy.pluck_find_dialog = function(type, obj) {
				var list = pluckAppProxy.pluck_dialog_cache[type];
				if (!list) return null;
				while (obj && obj.length > 0) {
					var id = obj.attr("id");
					if (id && list["#" + id]) {
						var retval = $(list["#" + id], obj);
						if (retval.length == 0) return null;
						else return retval;
					}
					obj = obj.parent();
				}
				return null;
			};
			pluckAppProxy.pluck_clipboard_cache = {};
			pluckAppProxy.pluck_clipboard_register = function(dialogId, clipboard) {
				pluckAppProxy.pluck_clipboard_cache[dialogId] = clipboard;
			};
			pluckAppProxy.pluck_find_clipboard = function(dialogId) {
				return pluckAppProxy.pluck_clipboard_cache["#" + dialogId];
			};
		}


		/**************************************
		 *
		 * pluck/user/miniPersona/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_user_miniPersona_dialog) === 'undefined') {
			pluckAppProxy.pluck_user_miniPersona_cache = {};
			pluckAppProxy.pluck_user_miniPersona_cbs = { setFriend: [], setPendingFriend: [], unsetFriend: [], setEnemy: [], unsetEnemy: [], recommend: [], reportAbuse: [] };
			pluckAppProxy.pluck_user_miniPersona_addCallback = function(type, func) { 
				var list = pluckAppProxy.pluck_user_miniPersona_cbs[type];
				if (!list) return;
				list.push(func);
			};
			pluckAppProxy.pluck_user_miniPersona_callbacks = function(type, userId) { 
				var userCacheObj = pluckAppProxy.pluck_user_miniPersona_cache[userId];
				if (userCacheObj) {
					if (type == "setFriend") userCacheObj.isFriend = true;
					else if (type == "setPendingFriend") userCacheObj.isPendingFriend = true;
					else if (type == "unsetFriend") { userCacheObj.isFriend = false; userCacheObj.isPendingFriend = false; }
					else if (type == "setEnemy") userCacheObj.isEnemy = true;
					else if (type == "unsetEnemy") userCacheObj.isEnemy = false;
					else if (type == "recommend") userCacheObj.hasRecommended = true;
					else if (type == "reportAbuse") userCacheObj.hasAbuse = true;
				}
				var list = pluckAppProxy.pluck_user_miniPersona_cbs[type];
				if (!list) return;
				for (var i = 0; i < list.length; i++) list[i](userId);
			};

			pluckAppProxy.pluck_user_miniPersona_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("miniPersona", parentId, dialogId);

				prefs = prefs ? prefs : {};
				var dialog = $(dialogId);
				var wait = $(".pluck-user-mp-wait", dialog);
				var msgs = $(".pluck-error-message, .pluck-confirm-message", dialog);
				var activity = $(".pluck-user-mp-activity-area", dialog);
				var messaging = $(".pluck-user-mp-message-area", dialog);
				var abuse = $(".pluck-user-mp-abuse-area", dialog);
				var actions = $(".pluck-user-mp-action-items", dialog)
				var actionBtns = $(".pluck-user-mp-action-items-btns", dialog);
				var actionWait = $(".pluck-user-mp-action-wait", dialog);

				var switchArea = function(hidearea, showarea, showActions) {
					$(".qtip").hide();
					msgs.hide();
					wait.hide();
					pluckAppProxy.slideUp(hidearea, function() { 
						if (!showActions) {
							actions.hide();
							pluckAppProxy.pluck_user_miniPersona_lock(true);
						}
						pluckAppProxy.slideDown(showarea, function() {
							if (showActions) {
								actions.show();
								pluckAppProxy.pluck_user_miniPersona_lock(false);
							}
						});
					});
				};

				$(".pluck-user-mp-message-link", dialog).click(function() {
					$("input[name='plckSubject'], textarea[name='plckMessage']", dialog).val('');
					switchArea(activity, messaging, false);
					return false;
				});
				$(".pluck-user-mp-message-cancel", dialog).click(function() {
					switchArea(messaging, activity, true);
					return false;
				});
				$(".pluck-user-mp-message-submit", dialog).click(function() {
					var form = $(this);
					msgs.hide();
					var ok = true;
					var subject = $.trim($("input[name='plckSubject']").val());
					var message = $.trim($("textarea[name='plckMessage']").val());
					var type = $("input.pluck-user-mp-message-type", dialog).val();
					var isPrivate = type == "private";
					if (isPrivate && !subject) {
						$(".pluck-user-mp-message-no-subject", dialog).show();
						ok = false;
					}
					if (!message) {
						$(".pluck-user-mp-message-no-message", dialog).show();
						ok = false;
					} else if (message.length > 1000) {
						$(".pluck-user-mp-message-too-long", dialog).show();
						ok = false;
					}
					if (ok) {
						pluckAppProxy.displayWait(wait);
						var userId = dialog.attr("userid");
						var params = { contentType: "Json", plckAction: "send", plckUserKey: userId, plckSubject: subject, plckMessage: message };
						var app = "pluck/user/personaMessages/actions.app";
						if (type == "private") app = "pluck/user/privateMessages/actions.app";
						pluckAppProxy.callApp(app, params, function(data) {
							wait.hide();
							data = eval('(' + data + ')');
							if (data.success) {
								$("input[name='plckSubject'], textarea[name='plckMessage']", dialog).val('');
								switchArea(messaging, activity, true);
							} else {
								msgs.hide();
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
								if (results.status == 6 || results.status == 4 || results.status == 3 || results.status == 2) {
									pluckAppProxy.fadeIn($(".pluck-user-mp-message-general-error", form));
								} else if (results.status == 5) {
									pluckAppProxy.fadeIn($(".pluck-user-mp-message-security-error", form));
								} else if (results.status == 1) {
									$(".pluck-user-message-badword-list", form).html(results.dirtyWordsMsg);
									pluckAppProxy.fadeIn($(".pluck-user-mp-message-badword-error", form));
								}
							}
						});
					}
					return false;
				});

				$(".pluck-user-mp-reportAbuse-link", dialog).click(function() {
					$("textarea[name='plckAbuseComment']", dialog).val('');
					switchArea(activity, abuse, false);
					return false;
				});
				$(".pluck-user-mp-report-abuse-submit", dialog).click(function() {
					var form = $(this);
					var ok = true;
					var reason = $("select[name='plckAbuseReason']", form).val();
					var comment = $.trim($("textarea[name='plckAbuseComment']", form).val());
					if (comment.length > 1500) {
						$(".pluck-user-mp-abuse-too-long", dialog).show();
						ok = false;
					}
					if (ok) {
						msgs.hide();
						pluckAppProxy.displayWait(wait);
						var userId = dialog.attr("userid");
						var params = { contentType: "Json", plckAction: "report", plckReason: reason, plckDescription: comment, plckAbuseOnKey: userId, plckAbuseOnKeyType: "user" };
						pluckAppProxy.callApp("pluck/reactions/abuse/actions.app", params, function(data) {
							wait.hide();
							data = eval('(' + data + ')');
							if (data.success) {
								$("textarea[name='plckAbuseComment']", dialog).val('');
								$('.pluck-user-mp-reportAbuse-link', dialog).hide();
								$('.pluck-user-mp-abuseReported-link', dialog).show();
								pluckAppProxy.pluck_user_miniPersona_callbacks("reportAbuse", userId);
								switchArea(abuse, activity, true);
							} else {
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								$(".pluck-user-mp-error-detail", form).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
								if (results.status == 6 || results.status == 4 || results.status == 3 || results.status == 2) {
									pluckAppProxy.fadeIn($(".pluck-user-mp-abuse-general-error", form));
								} else if (results.status == 5) {
									pluckAppProxy.fadeIn($(".pluck-user-mp-abuse-security-error", form));
								} else if (results.status == 1) {
									$(".pluck-user-mp-abuse-badword-list", form).html(results.dirtyWordsMsg);
									pluckAppProxy.fadeIn($(".pluck-user-mp-abuse-badword-error", form));
								}
							}
						});
					}
					return false;
				});
				$(".pluck-user-mp-report-abuse-cancel", dialog).click(function() {
					switchArea(abuse, activity, true);
					return false;
				});

				var startAction = function() {
					$(".qtip").hide();
					actionBtns.hide();
					actionWait.show();
					return dialog.attr("userid");
				};

				var reportAction = function(msg) {
					msg = $(msg, dialog);
					actionWait.hide();
					pluckAppProxy.fadeIn(msg, function() {
						setTimeout(function() {
							pluckAppProxy.fadeOut(msg, function() {
								pluckAppProxy.fadeIn(actionBtns);
							});
						}, 2500);
					});
				};

				$(".pluck-user-mp-friend-link", dialog).click(function() {
					var userId = startAction();
					var params = { contentType: "Json", plckAction: "add", plckUserKey: userId };
					pluckAppProxy.callApp("pluck/user/friends/actions.app", params, function(data) {
						var msg;
						data = eval('(' + data + ')');
						if (data.success) {
							msg = '.pluck-user-mp-friend-confirm-message';
							$('.pluck-user-mp-friend-link', dialog).hide();
							if (data.pending) {
								$('.pluck-user-mp-pending-friend-link', dialog).show();
								pluckAppProxy.pluck_user_miniPersona_callbacks("setPendingFriend", userId);
							} else {
								$('.pluck-user-mp-unfriend-link', dialog).show();
								pluckAppProxy.pluck_user_miniPersona_callbacks("setFriend", userId);
							}
						} else {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
							if (results.status == 5)
								msg = '.pluck-user-mp-friend-permission-message';
							else
								msg = '.pluck-user-mp-friend-error-message';
						}
						reportAction(msg);
					});
					return false;
				});
				$(".pluck-user-mp-unfriend-link", dialog).click(function() {
					var userId = startAction();
					var params = { contentType: "Json", plckAction: "remove", plckUserKey: userId };
					pluckAppProxy.callApp("pluck/user/friends/actions.app", params, function(data) {
						var msg;
						data = eval('(' + data + ')');
						if (data.success) {
							msg = '.pluck-user-mp-unfriend-confirm-message';
							$('.pluck-user-mp-friend-link', dialog).show();
							$('.pluck-user-mp-unfriend-link', dialog).hide();
							pluckAppProxy.pluck_user_miniPersona_callbacks("unsetFriend", userId);
						} else {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
							if (results.status == 5)
								msg = '.pluck-user-mp-unfriend-permission-message';
							else
								msg = '.pluck-user-mp-unfriend-error-message';
						}
						reportAction(msg);
					});
					return false;
				});
				$(".pluck-user-mp-enemy-link", dialog).click(function() {
					var userId = startAction();
					var params = { contentType: "Json", plckAction: "add", plckUserKey: userId };
					pluckAppProxy.callApp("pluck/user/enemies/actions.app", params, function(data) {
						var msg;
						data = eval('(' + data + ')');
						if (data.success) {
							msg = '.pluck-user-mp-enemy-confirm-message';
							$('.pluck-user-mp-enemy-link', dialog).hide();
							$('.pluck-user-mp-unenemy-link', dialog).show();
							pluckAppProxy.pluck_user_miniPersona_callbacks("setEnemy", userId);
						} else {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
							if (results.status == 5)
								msg = '.pluck-user-mp-enemy-permission-message';
							else
								msg = '.pluck-user-mp-enemy-error-message';
						}
						reportAction(msg);
					});
					return false;
				});
				$(".pluck-user-mp-unenemy-link", dialog).click(function() {
					var userId = startAction();
					var params = { contentType: "Json", plckAction: "remove", plckUserKey: userId };
					pluckAppProxy.callApp("pluck/user/enemies/actions.app", params, function(data) {
						var msg;
						data = eval('(' + data + ')');
						if (data.success) {
							msg = '.pluck-user-mp-unenemy-confirm-message';
							$('.pluck-user-mp-unenemy-link', dialog).hide();
							$('.pluck-user-mp-enemy-link', dialog).show();
							pluckAppProxy.pluck_user_miniPersona_callbacks("unsetEnemy", userId);
						} else {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
							if (results.status == 5)
								msg = '.pluck-user-mp-unenemy-permission-message';
							else
								msg = '.pluck-user-mp-unenemy-error-message';
						}
						reportAction(msg);
					});
					return false;
				});
				$(".pluck-user-mp-recommend-link", dialog).click(function() {
					var userId = startAction();
					var params = { contentType: "Json", plckAction: "set", plckRecommendOnKey: userId, plckRecommendOnKeyType: "user" };
					pluckAppProxy.callApp("pluck/reactions/recommend/actions.app", params, function(data) {
						var msg;
						data = eval('(' + data + ')');
						if (data.success) {
							msg = '.pluck-user-mp-recommend-confirm-message';
							$('.pluck-user-mp-recommend-link', dialog).hide();
							$('.pluck-user-mp-recommended-link', dialog).show();
							pluckAppProxy.pluck_user_miniPersona_callbacks("recommend", userId);
						} else {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							$(".pluck-user-mp-error-detail", dialog).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
							if (results.status == 5)
								msg = '.pluck-user-mp-recommend-permission-message';
							else
								msg = '.pluck-user-mp-recommend-error-message';
						}
						reportAction(msg);
					});
					return false;
				});
				dialog.hover(function() {}, function() { pluckAppProxy.pluck_user_miniPersona_hide($(parentId), false); });
				if (typeof(pluckAppProxy.pluck_reactions_abuse_dialog_link) !== "undefined") pluckAppProxy.pluck_reactions_abuse_dialog_link(dialogId);
			};

			pluckAppProxy.pluck_user_miniPersona_show = function(obj, userId, isFeatured) {
				if (pluckAppProxy.pluck_user_miniPersona_timer) clearTimeout(pluckAppProxy.pluck_user_miniPersona_timer);
				pluckAppProxy.pluck_user_miniPersona_info = { obj: obj, userId: userId, isFeatured: isFeatured };
				pluckAppProxy.pluck_user_miniPersona_timer = setTimeout(function() { pluckAppProxy.pluck_user_miniPersona_display(obj); }, 250);
			};

			pluckAppProxy.pluck_user_miniPersona_show_stop = function(obj, userId) {
				var o = pluckAppProxy.pluck_user_miniPersona_info;
				if (o && o.userId == userId && pluckAppProxy.pluck_user_miniPersona_timer) clearTimeout(pluckAppProxy.pluck_user_miniPersona_timer);
				pluckAppProxy.pluck_user_miniPersona_info = null;
			};

			pluckAppProxy.pluck_user_miniPersona_display = function(obj) {
				var o = pluckAppProxy.pluck_user_miniPersona_info;
				if (!o || !o.userId) return;
				var obj = $(o.obj);
				var userId = o.userId;
				var isFeatured = o.isFeatured;
				var isIE6 = $.browser.msie && $.browser.version < 7;

				var dialog = pluckAppProxy.pluck_find_dialog("miniPersona", obj);
				if (!dialog) {
					alert("miniPersona not found");
					return;
				}

				var loading = $('.pluck-user-mp-loading', dialog);
				var wait = $('.pluck-user-mp-wait', dialog);
				var sidebar = $('.pluck-user-mp-sidebar', dialog);
				var content = $('.pluck-user-mp-content', dialog);
				var actions = $('.pluck-user-mp-action-items', dialog);

				pluckAppProxy.pluck_user_miniPersona_hide(obj, true);

				var user = pluckAppProxy.pluck_user_miniPersona_cache[userId];

				if (!user) {
					pluckAppProxy.displayWait(loading);
					wait.hide();
					sidebar.hide();
					content.hide();
					
					var params = { contentType: "Json", plckAction: "get", plckUserKey: userId };
					pluckAppProxy.callApp("pluck/user/miniPersona.app", params, function(data) {
						data = eval('(' + data + ')');
						if (data.success) {
							pluckAppProxy.pluck_user_miniPersona_cache[userId] = data.user;
							pluckAppProxy.pluck_user_miniPersona_initialize(dialog, data.user, isFeatured);
							loading.hide();
							wait.hide();
							sidebar.show();
							content.show();
							pluckAppProxy.pluck_user_miniPersona_dialog_display(dialog, obj);
						} else {
							alert(data.errorMsg);
						}
					});
				} else {
					pluckAppProxy.pluck_user_miniPersona_initialize(dialog, user, isFeatured);
					loading.hide();
					wait.hide();
					sidebar.show();
					content.show();
					pluckAppProxy.pluck_user_miniPersona_dialog_display(dialog, obj);
				}
			};

			pluckAppProxy.pluck_user_miniPersona_locked = 0;
			pluckAppProxy.pluck_user_miniPersona_lock = function(lockIt) {
				pluckAppProxy.pluck_user_miniPersona_locked = lockIt;
			};

			pluckAppProxy.pluck_user_miniPersona_hide = function(obj, force) {
				if (!force && pluckAppProxy.pluck_user_miniPersona_locked) return;
				pluckAppProxy.pluck_user_miniPersona_locked = false;
				var dialog = pluckAppProxy.pluck_find_dialog("miniPersona", obj);
				if (!dialog) return;

				var isIE6 = $.browser.msie && $.browser.version < 7;
				if (force) {
					dialog.stop(false, true).hide();
					$('.pluck-user-mp-loading', dialog).hide();
					$('.pluck-user-mp-wait', dialog).hide();
					$('.pluck-user-mp-sidebar', dialog).show();
   					$('.pluck-user-mp-content', dialog).show();
					$('.pluck-user-mp-activity-area', dialog).show();
					$('.pluck-user-mp-message-area', dialog).hide();
   					$('.pluck-user-mp-abuse-area', dialog).hide();
   					$('.pluck-user-mp-action-items', dialog).hide();
   					$('.pluck-user-mp-action-items', dialog).css("visibility", "hidden");
					$('.pluck-error-message, .pluck-confirm-message', dialog).hide();
					if (isIE6) dialog.height("");
				} else
					pluckAppProxy.fadeOut(dialog, function() {
		    				$('.pluck-user-mp-loading', dialog).hide();
			    			$('.pluck-user-mp-wait', dialog).hide();
						$('.pluck-user-mp-sidebar', dialog).show();
    						$('.pluck-user-mp-content', dialog).show();
	    					$('.pluck-user-mp-activity-area', dialog).show();
						$('.pluck-user-mp-message-area', dialog).hide();
						$('.pluck-user-mp-abuse-area', dialog).hide();
	   					$('.pluck-user-mp-action-items', dialog).hide();
	  					$('.pluck-user-mp-action-items', dialog).css("visibility", "hidden");
						$('.pluck-error-message, .pluck-confirm-message', dialog).hide();
						if (isIE6) dialog.height("");
					});
			};

			pluckAppProxy.pluck_user_miniPersona_initialize = function(dialog, user, isFeatured) {
				var isBlocked = !user.isMe && user.isBlocked;
				var isAbusive = !user.isMe && user.abuseExceedsThreshold;
				var isPrivate = dialog.attr("nopriv") != "1" && !user.isMe && (user.isFriendsMode && user.privacyMode == "Private") && !user.abuseExceedsThreshold && !user.isBlocked;
				var isSharedWithFriends = dialog.attr("nopriv") != "1" && !user.isMe && (user.isFriendsMode && user.privacyMode == "SharedWithFriends") && !user.iAmAFriend && !user.abuseExceedsThreshold && !user.isBlocked;
				dialog.attr("userId", user.userId);
				$('.pluck-user-mp-avatarimg', dialog).attr("src", user.avatarImgUrl);
				setTimeout(function() {
					$('.pluck-user-mp-avatar-seethrough a', dialog).attr("href", user.profileUrl);
					$('.pluck-user-mp-username a', dialog).attr("href", user.profileUrl);
					$('.pluck-user-mp-no-bio a', dialog).attr("href", user.editProfileUrl);
				}, 10);
				$('.pluck-user-mp-username span.pluck-user-mp-username-value', dialog).html(user.fullName);
				if (isPrivate || isSharedWithFriends || isAbusive || isBlocked) {
					$('.pluck-user-mp-asl', dialog).html("");
					$('.pluck-user-mp-bio', dialog).html("");
					$('.pluck-user-mp-rank', dialog).html("");
				} else {
					$('.pluck-user-mp-asl', dialog).toggleClass("pluck-user-mp-isEmpty", !user.asl);
					$('.pluck-user-mp-bio', dialog).parent().toggleClass("pluck-user-mp-isEmpty", !user.description);
					$('.pluck-user-mp-rank', dialog).parent().toggleClass("pluck-user-mp-isEmpty", !user.ranking);
					$('.pluck-user-mp-asl', dialog).html(user.asl);
					$('.pluck-user-mp-bio', dialog).html(user.description);
					$('.pluck-user-mp-rank', dialog).html(user.ranking);
				}
				$('.pluck-user-mp-no-bio', dialog).parent().toggle(user.isMe && !user.description);
				dialog.toggleClass("pluck-user-isFeaturedUser", isFeatured);
				dialog.toggleClass("pluck-user-mp-isPublic", !isPrivate && !isSharedWithFriends && !isAbusive && !isBlocked);
				dialog.toggleClass("pluck-user-mp-isBlocked", isBlocked);
				dialog.toggleClass("pluck-user-mp-isAbusive", isAbusive);
				dialog.toggleClass("pluck-user-mp-isPrivate", isPrivate);
				dialog.toggleClass("pluck-user-mp-isSharedWithFriends", isSharedWithFriends);
				dialog.toggleClass("pluck-user-isMe", user.isMe);
				dialog.toggleClass("pluck-user-isFriend", user.isFriend && user.isFriendsMode);
				dialog.toggleClass("pluck-user-isFollowing", user.isFriend && !user.isFriendsMode);
				dialog.toggleClass("pluck-user-isIgnored", user.isEnemy);
				dialog.toggleClass("pluck-user-isAnonTier", user.userTier == "Anonymous");
				dialog.toggleClass("pluck-user-isStandardTier", user.userTier == "Standard");
				dialog.toggleClass("pluck-user-isTrustedTier", user.userTier == "Trusted");
				dialog.toggleClass("pluck-user-isFeaturedTier", user.userTier == "Featured");
				dialog.toggleClass("pluck-user-isStaffTier", user.userTier == "Staff");
				dialog.toggleClass("pluck-user-isEditorTier", user.userTier == "Editor");
				dialog.toggleClass("pluck-user-isPortfolioAdmin", user.administrativeTier == "Administrator");
				dialog.toggleClass("pluck-user-isSiteManager", user.administrativeTier == "SiteManager");
				dialog.toggleClass("pluck-user-isSiteAdmin", user.administrativeTier == "SiteAdministrator");
				dialog.toggleClass("pluck-user-isSystemEditor", user.isSystemAdmin);

				if (!user.isMe && user.userTier != "Anonymous") {
					$('.pluck-user-mp-action-items', dialog).show()
  					$('.pluck-user-mp-action-items', dialog).css("visibility", "visible");
				} else {
					$('.pluck-user-mp-action-items', dialog).hide()
  					$('.pluck-user-mp-action-items', dialog).css("visibility", "hidden");
				}
				$('.pluck-user-mp-message-link', dialog).show();
				$('.pluck-user-mp-friend-link', dialog).toggle(!user.isFriend && !user.isPendingFriend);
				$('.pluck-user-mp-pending-friend-link', dialog).toggle(user.isPendingFriend);
				$('.pluck-user-mp-unfriend-link', dialog).toggle(user.isFriend);
				$('.pluck-user-mp-enemy-link', dialog).toggle(!user.isEnemy);
				$('.pluck-user-mp-unenemy-link', dialog).toggle(user.isEnemy);
				$('.pluck-user-mp-recommend-link', dialog).toggle(!user.hasRecommended);
				$('.pluck-user-mp-recommended-link', dialog).toggle(user.hasRecommended);
				$('.pluck-user-mp-reportAbuse-link', dialog).toggle(!user.hasAbuse);
				$('.pluck-user-mp-abuseReported-link', dialog).toggle(user.hasAbuse);

				$('.pluck-user-mp-badge', dialog).hide();
				// Remove all badge classes.
				var classes = dialog.attr("class").split(" ");
				for (var i = 0; i < classes.length; i++) {
					if (classes[i].indexOf("pluck-hasBadge") == 0)
						dialog.removeClass(classes[i]);
				}

				if (!isPrivate && !isAbusive && !isSharedWithFriends && user.badges) {
					var j = 0;
					for (var i = user.badges.length - 1; i >= 0; i--) {
						var badge = user.badges[i];
						dialog.addClass("pluck-user-hasBadge-" + badge.badgeFamilyId.toLowerCase());
						if (badge.badgeId != "_") dialog.addClass("pluck-user-hasBadge-" + badge.badgeFamilyId.toLowerCase() + "-" + badge.badgeId.toLowerCase());

						var img = $('.pluck-user-mp-badge-' + j++, dialog);
						img.attr("src", badge.badgeAvatar);
						var desc = badge.badgeFamilyName;
						if (badge.badgeName != desc) desc = badge.badgeName + " from " + desc;
		//				desc += "<br/>" + badge.description;
						img.attr("title", desc);
						img.show();
					}
				}

				var sel = $("select[name='plckAbuseReason']", dialog);
				if (sel.length > 0) sel.get(0).selectedIndex = 0;
				$("textarea[name='plckAbuseComment']", dialog).val('');
				$("input[name='plckSubject']", dialog).val('');
				$("textarea[name='plckMessage']", dialog).val('');
			};
		}

		/**************************************
		 *
		 * pluck/util/email/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_util_email_dialog) === 'undefined') {
			pluckAppProxy.pluck_util_email_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("email", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
					$("input[name='plckEmailKey']", $(id)).val('');
				});

				prefs = prefs ? prefs : {};
				var dialog = $(dialogId);
				$(".pluck-email-message-submit", dialog).click(function() {
					var form = $(".pluck-email-form", dialog);
					$('.pluck-error-message', form).hide();
					var ok = true;
					var recipients = $("input[name='plckEmailRecipient']", form).val();
					var subject = $("input[name='plckEmailSubject']", form).val();
					var comment = $('textarea', form).val();
					recipients = $.trim(recipients);
					subject = $.trim(subject);
					comment = $.trim(comment);
					if (recipients == "") {
						$('.pluck-email-recipient-error', form).show();
						$("input[name='plckEmailRecipient']", form).focus();
						ok = false;
					} else {
						recipients = recipients.replace(/\s/g, ',');
						recipients = recipients.replace(/\;/g, ',');
						recipients = recipients.replace(/\,\,/g, ',');
						var ems = recipients.split(",");
						var emails = [];
						for (var i = 0; i < ems.length; i++) {
							if (ems[i]) emails.push(ems[i]);
						}

						if (emails.length == 0) {
							$('.pluck-email-recipient-error', form).show();
							$("input[name='plckEmailRecipient']", form).focus();
							ok = false;
						} else if (emails.length > 5) {
							$('.pluck-email-too-many-recipients-error', form).show();
							$("input[name='plckEmailRecipient']", form).focus();
							ok = false;
						} else {
							var emailRegex = /^([a-zA-Z0-9_\-])+(\.([a-zA-Z0-9_\-])+)*@((\[(((([0-1])?([0-9])?[0-9])|(2[0-4][0-9])|(2[0-5][0-5])))\.(((([0-1])?([0-9])?[0-9])|(2[0-4][0-9])|(2[0-5][0-5])))\.(((([0-1])?([0-9])?[0-9])|(2[0-4][0-9])|(2[0-5][0-5])))\.(((([0-1])?([0-9])?[0-9])|(2[0-4][0-9])|(2[0-5][0-5]))\]))|((([a-zA-Z0-9])+(([\-])+([a-zA-Z0-9])+)*\.)+([a-zA-Z])+(([\-])+([a-zA-Z0-9])+)*))$/;
							for (var i = 0; i < emails.length; i++) {
								if (!emails[i].match(emailRegex)) {
									$('.pluck-email-invalid-address', form).html(emails[i]);
									$('.pluck-email-invalid-address-error', form).show();
									$("input[name='plckEmailRecipient']", form).focus();
									ok = false;
									break;
								}
							}
							recipients = emails.join(",");
						}
					}

					if (subject == "") {
						$('.pluck-email-subject-error', form).show();
						if (ok) $("input[name='plckEmailSubject']", form).focus();
						ok = false;
					}

					if (ok) {
						var form_top = $(this).parents('div.pluck-email-dialog');
						pluckAppProxy.displayWait($('.pluck-email-wait', form_top));
						var params = { contentType: "Json", plckAction: "email", plckRecipients: recipients, plckSubject: subject, plckComment: comment };
						$('input:hidden', form).each(function() {	params[this.name] = this.value; });
						pluckAppProxy.callApp("pluck/util/email/actions.app", params, function(data) {
							$('.pluck-email-wait', form_top).hide();
							data = eval('(' + data + ')');
							if (data.success) {
								$("input[name='plckEmailKey']", dialog).val("");
								$("input[name='plckEmailRecipient']", dialog).val("");
								$("input[name='plckEmailSubject']", dialog).val("");
								$("textarea", dialog).val("");
								pluckAppProxy.fadeOut(dialog);
							} else {
								$(".pluck-error-message", dialog).hide();
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								if (results.status == 4) {
									$(".pluck-email-comment-removed-error", dialog).show();
								} else {
									$(".pluck-email-send-error", dialog).show();
								}
							}
						});
					}
					return false;
				});

				$(".pluck-email-message-cancel", dialog).click(function() {
					$("input[name='plckEmailKey']", dialog).val('');
					$("input[name='plckEmailRecipient']", dialog).val("");
					$("input[name='plckEmailSubject']", dialog).val("");
					$("textarea", dialog).val("");
					dialog.attr("lastid", "");
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_util_email_dialog_link(parentId);
			};
			pluckAppProxy.pluck_util_email_dialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-email-set", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_util_email_dialog_show($(this));
						return false;
					});
				});
			};
			pluckAppProxy.pluck_util_email_dialog_show = function (obj) {
				var dialog = pluckAppProxy.pluck_find_dialog("email", obj);
				if (!dialog) return;

				$('.pluck-error-message', dialog).hide();
				var oldID = $("input[name='plckEmailKey']", dialog).val();
				var newID = obj.attr("emailkey");
				if (oldID == newID) {
					pluckAppProxy.fadeOut(dialog);
					$("input[name='plckEmailKey']", dialog).val('');
				} else {
					pluckAppProxy.closeDialogs();
					$("input[name='plckEmailKey']", dialog).val(newID);
					$("input[name='plckEmailKeyType']", dialog).val(obj.attr("emailkeytype"));
					if (dialog.attr("lastid") != newID) {
						$("input[name='plckEmailRecipient']", dialog).val("");
						$("input[name='plckEmailSubject']", dialog).val("");
						$("textarea", dialog).val("");
						dialog.attr("lastid", newID);
					}
					$('.pluck-email-header-type').html(obj.attr("emailobjecttype"));
					pluckAppProxy.pluck_util_email_dialog_display(dialog, obj);
				}
			};
		}

		/**************************************
		 *
		 * pluck/util/permalink/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_util_permalink_dialog) === 'undefined') {
			pluckAppProxy.pluck_util_permalink_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("permalink", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
					$(id).attr("permalink", '');
					if (pluckAppProxy.pluck_find_clipboard(dialogId)) {
						pluckAppProxy.pluck_find_clipboard(dialogId).hide();
					}
				});

				prefs = prefs ? prefs : {};
				var dialog = $(dialogId);
				$(".pluck-permalink-share-link", dialog).click(function() {
					var permalink = dialog.attr("permalink");
					if (window.clipboardData) {
						window.clipboardData.setData("Text", permalink);
					}
					return false;
				});
				pluckAppProxy.pluck_util_permalink_dialog_link(parentId);

			};
			pluckAppProxy.pluck_util_permalink_dialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				if (!pluckAppProxy.hasFlash) return;
				$(".pluck-permalink-set, .pluck-permalink-action-link", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						var obj = $(this);
						obj.attr("registered", "true");
						var dialog = pluckAppProxy.pluck_find_dialog("permalink", obj);
						if (!dialog) {
							return false;
						}

						var oldID = dialog.attr("permalink");
						var newID = obj.attr("href");
						if (oldID == newID) {
							pluckAppProxy.fadeOut(dialog);
							if (pluckAppProxy.pluck_find_clipboard(dialog.attr("id")))
								pluckAppProxy.pluck_find_clipboard(dialog.attr("id")).hide();
							dialog.attr("permalink", "");
						} else {
							pluckAppProxy.closeDialogs();
							dialog.attr("permalink", newID);
							pluckAppProxy.pluck_util_permalink_dialog_display(dialog, obj);
						}
						return false;
					});
				});
			};
		}

		/**************************************
		 *
		 * pluck/util/share/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_util_share_dialog) === 'undefined') {
			pluckAppProxy.pluck_util_share_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("share", parentId, dialogId);
				pluckAppProxy.registerDialog(dialogId, function(id) {
					$(id).attr("permalink", '');
					pluckAppProxy.pluck_util_share_dialog_isFocused = false;
					if (pluckAppProxy.pluck_find_clipboard(dialogId)) {
						pluckAppProxy.pluck_find_clipboard(dialogId).hide();
					}
				});

				prefs = prefs ? prefs : {};
				var dialog = $(dialogId);
				$(".pluck-share-link-clipboard", dialog).click(function() {
					var permalink = dialog.attr("permalink");
					if (window.clipboardData) {
						window.clipboardData.setData("Text", permalink);
					}
					return false;
				});
				$(".pluck-share-link-email", dialog).click(function() {
					pluckAppProxy.pluck_util_email_dialog_show(pluckAppProxy.pluck_util_share_object);
					return false;
				});
				$("a.pluck-share-link-close", dialog).click(function() {
					if ($(this).attr("href") == "#") return false;
					dialog.attr("permalink", "");
					pluckAppProxy.fadeOut(dialog);
					pluckAppProxy.pluck_util_share_dialog_isFocused = false;
					return true;
				});
				pluckAppProxy.pluck_util_share_dialog_link(parentId);

				pluckAppProxy.pluck_util_share_dialog_isFocused = false;
				$("a.pluck-share-link", dialog).focus(function() {
					pluckAppProxy.pluck_util_share_dialog_isFocused = true;
				});
				$("a.pluck-share-link", dialog).blur(function() {
					pluckAppProxy.pluck_util_share_dialog_isFocused = false;
					setTimeout(function() {
						if (!pluckAppProxy.pluck_util_share_dialog_isFocused) {
							pluckAppProxy.fadeOut(dialog);
							if (pluckAppProxy.pluck_find_clipboard(dialog.attr("id"))) {
								pluckAppProxy.pluck_find_clipboard(dialog.attr("id")).hide();
							}
							dialog.attr("permalink", "");
						}
					}, 500);
				}); 
			};
			pluckAppProxy.pluck_util_share_dialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-share-set, .pluck-share-action-link", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						var obj = $(this);
						var dialog = pluckAppProxy.pluck_find_dialog("share", obj);
						if (!dialog) return false;

						var oldID = dialog.attr("permalink");
						var newID = obj.attr("permalink");
						if (oldID == newID) {
							pluckAppProxy.fadeOut(dialog);
							if (pluckAppProxy.pluck_find_clipboard(dialog.attr("id"))) {
								pluckAppProxy.pluck_find_clipboard(dialog.attr("id")).hide();
							}
							dialog.attr("permalink", "");
							pluckAppProxy.pluck_util_share_dialog_isFocused = false;
						} else {
							pluckAppProxy.closeDialogs();
							pluckAppProxy.pluck_util_share_dialog_isFocused = true;
							pluckAppProxy.pluck_util_share_object = obj;
							var title = obj.attr("parenttitle");
							dialog.attr("permalink", newID);
							dialog.attr("parenttitle", title);
							var smallUrl = obj.attr("smallurl");
							$('.pluck-share-link-email', dialog).parent().toggle(obj.attr("includeemail") == "true");
							$('.pluck-share-link-clipboard', dialog).parent().toggle(obj.attr("includeclipboard") == "true");
							$('.pluck-share-link-delicious', dialog).get(0).href = "http://delicious.com/save?jump=yes&url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-facebook', dialog).get(0).href = "http://www.facebook.com/share.php?u=" + escape(newID) + "&t=" + escape(title);
							$('.pluck-share-link-friendfeed', dialog).get(0).href = "http://friendfeed.com/share?url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-linkedin', dialog).get(0).href = "http://www.linkedin.com/shareArticle?mini=true&url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-myspace', dialog).get(0).href = "http://www.myspace.com/Modules/PostTo/Pages/?l=3&u=" + escape(newID) + "&t=" + escape(title) + "&c=%3Cp%3EPowered+by+%3Ca+href%3D%22http%3A%2F%2Fsharethis.com%22%3EShareThis%3C%2Fa%3E%3C%2Fp%3E";
							$('.pluck-share-link-reddit', dialog).get(0).href = "http://reddit.com/submit?url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-slashdot', dialog).get(0).href = "http://slashdot.org/bookmark.pl?url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-stumbleupon', dialog).get(0).href = "http://www.stumbleupon.com/submit?url=" + escape(newID) + "&title=" + escape(title);
							$('.pluck-share-link-tumbler', dialog).get(0).href = "http://www.tumblr.com/share?s=&v=3&t=" + escape(title) + "&u=" + escape(newID);
							$('.pluck-share-link-yahoobuzz', dialog).get(0).href = "http://buzz.yahoo.com/buzz?targetUrl=" + escape(newID) + "&headline=" + escape(title);
							$('.pluck-share-link-digg', dialog).attr("href", "http://digg.com/submit?phase=2&url=" + escape(newID) + "&title=" + escape(title));
							
							var disCl = "pluck-share-disabled-link";
							var twitterLink = $('.pluck-share-link-twitter', dialog);
							if (!smallUrl) {
								twitterLink.attr("href", "#");
								twitterLink.addClass(disCl);
								var params = { contentType: "Json", plckAction: "shortenUrl", plckUrl: dialog.attr("permalink") };
								pluckAppProxy.callApp("pluck/util/share/actions.app", params, function(data) {
									data = eval('(' + data + ')');
									if (data.success) {
										obj.attr("smallurl", data.shortUrl);
										var title = dialog.attr("parenttitle");
										twitterLink.attr("href", "http://twitter.com/home?status=" + escape(title + " " + data.shortUrl));
										twitterLink.removeClass(disCl);
									} else {
										debugger;
										alert(data.errorMsg);
									}
								});
							} else {
								twitterLink.attr("href", "http://twitter.com/home?status=" + escape(title + " " + smallUrl));
								twitterLink.removeClass(disCl);
							}
							pluckAppProxy.pluck_util_share_dialog_display(dialog, obj);
						}
						return false;
					});
				});
			};
		}

		/**************************************
		 *
		 * pluck/reactions/score/submit
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_reactions_score_submit) === 'undefined') {
			pluckAppProxy.pluck_reactions_score_submit = function (parentDiv) {
				if (!parentDiv) parentDiv = $(document);
				$('.pluck-thumb-down-link', parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.closeDialogs();
						var me = $(this);
						var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
						var commentId = comment_top.eq(0).attr("commentId");
						if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
						$(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function() {
							var ct = $(this);
							$('.pluck-thumb-up, .pluck-thumb-up-action, .pluck-thumb-down, .pluck-thumb-down-action', ct).css('display', 'none');
							$('.pluck-thumb-voted', ct).addClass('pluck-voted-down');
							$('.pluck-voted-down-img', ct).show();
							$('.pluck-voted-up-img', ct).hide();
							$('.pluck-thumb-voted', ct).css('display', 'block');
							$('.pluck-thumb-voted-action', ct).show();
							var vol = $('.pluck-score-volume', ct);
							vol.attr("downvotes", "" + (parseInt(vol.attr("downvotes")) + 1));
							vol.attr("activity", "" + (parseInt(vol.attr("activity")) + 1));
							var volume = parseInt(vol.attr("volume")) - 1;
							vol.attr("volume", "" + volume);
							$('.pluck-score-volume-display', vol).html("" + volume);
						});
						var params = { contentType: "Json", plckAction: "setScore", plckScoreOnParentKeyType: me.attr("scoreonparentkeytype"), plckScoreOnParentKey: me.attr("scoreonparentkey"), plckScoreOnTargetKeyType: me.attr("scoreontargetkeytype"), plckScoreOnTargetKey: me.attr("scoreontargetkey"), plckScoreId: me.attr("scoreid"), plckActivityKey: me.attr("activityKey"), plckScoreValue: "-1" };
						pluckAppProxy.callApp("pluck/reactions/score/actions.app", params, function(data) {
							data = eval('(' + data + ')');
							if (!data.success) {
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								if (results.status == 4) data.success = true;
							}
						});
						return false;
					});
				});
				$('.pluck-thumb-up-link', parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.closeDialogs();
						var me = $(this);
						var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
						var commentId = comment_top.eq(0).attr("commentId");
						if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
						$(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function() {
							var ct = $(this);
							$('.pluck-thumb-up, .pluck-thumb-up-action, .pluck-thumb-down, .pluck-thumb-down-action', ct).css('display', 'none');
							$('.pluck-voted-down-img', ct).hide();
							$('.pluck-voted-up-img', ct).show();
							$('.pluck-thumb-voted', ct).addClass('pluck-voted-up');
							$('.pluck-thumb-voted', ct).css('display', 'block');
							$('.pluck-thumb-voted-action', ct).show();
							var vol = $('.pluck-score-volume', ct);
							vol.attr("upvotes", "" + (parseInt(vol.attr("upvotes")) + 1));
							vol.attr("activity", "" + (parseInt(vol.attr("activity")) + 1));
							var volume = parseInt(vol.attr("volume")) + 1;
							vol.attr("volume", "" + volume);
							$('.pluck-score-volume-display', vol).html("" + volume);
						});
						var params = { contentType: "Json", plckAction: "setScore", plckScoreOnParentKeyType: me.attr("scoreonparentkeytype"), plckScoreOnParentKey: me.attr("scoreonparentkey"), plckScoreOnTargetKeyType: me.attr("scoreontargetkeytype"), plckScoreOnTargetKey: me.attr("scoreontargetkey"), plckScoreId: me.attr("scoreid"), plckActivityKey: me.attr("activityKey"), plckScoreValue: "1" };
						pluckAppProxy.callApp("pluck/reactions/score/actions.app", params, function(data) {
							data = eval('(' + data + ')');
							if (!data.success) {
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								if (results.status == 4) data.success = true;
							}
						});
						return false;
					});
				});
			};
		}

		/**************************************
		 *
		 * pluck/reactions/score/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_reactions_score_dialog) === 'undefined') {
			pluckAppProxy.pluck_reactions_score_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("score", parentId, dialogId);
				prefs = prefs ? prefs : {};
				pluckAppProxy.registerDialog(dialogId);
				var dialog = $(dialogId);
				pluckAppProxy.pluck_reactions_score_dialog_link(parentId);
			};
			pluckAppProxy.pluck_reactions_score_dialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-score-has-info", parentDiv).live("mouseover", function() {
					pluckAppProxy.pluck_reactions_score_show($(this));
				});
				$(".pluck-score-has-info", parentDiv).live("mouseout", function() {
					pluckAppProxy.pluck_reactions_score_hide();
				});
			};
			pluckAppProxy.pluck_reactions_score_show = function(obj) {
				if (pluckAppProxy.pluck_reactions_score_timer) clearTimeout(pluckAppProxy.pluck_reactions_score_timer);
				pluckAppProxy.pluck_reactions_score_obj = { obj: obj, targetkey: obj.attr("scoreontargetkey") };
				pluckAppProxy.pluck_reactions_score_timer = setTimeout(pluckAppProxy.pluck_reactions_score_display, 250);
			};
			pluckAppProxy.pluck_reactions_score_display = function() {
				var obj = pluckAppProxy.pluck_reactions_score_obj;
				if (!obj) return;
				obj = obj.obj;

				var upvotes = obj.attr("upvotes");
				var downvotes = obj.attr("downvotes");
				var dialog = pluckAppProxy.pluck_find_dialog("score", obj);
				if (!dialog) return;


				$('.pluck-score-volume-value', dialog).html(obj.attr("volume"));
				$('.pluck-score-upvotes-value', dialog).html(upvotes);
				$('.pluck-score-upvote-label', dialog).toggle(upvotes == "1");
				$('.pluck-score-upvotes-label', dialog).toggle(upvotes != "1");
				$('.pluck-score-downvotes-value', dialog).html(downvotes);
				$('.pluck-score-downvote-label', dialog).toggle(downvotes == "1");
				$('.pluck-score-downvotes-label', dialog).toggle(downvotes != "1");
				pluckAppProxy.pluck_reactions_score_dialog_display(dialog, obj);
			};
			pluckAppProxy.pluck_reactions_score_hide = function() {
				if (pluckAppProxy.pluck_reactions_score_timer) clearTimeout(pluckAppProxy.pluck_reactions_score_timer);
				pluckAppProxy.pluck_reactions_score_timer = setTimeout(pluckAppProxy.pluck_reactions_score_dismiss, 250);
			};
			pluckAppProxy.pluck_reactions_score_dismiss = function() {
				var obj = pluckAppProxy.pluck_reactions_score_obj;
				if (!obj) return;
				obj = obj.obj;

				pluckAppProxy.pluck_reactions_score_obj = null;
				var dialog = pluckAppProxy.pluck_find_dialog("score", obj);
				if (!dialog) return;

				pluckAppProxy.fadeOut(dialog)
				// Special IE6 fix for comments...
				if (isIE6) {
					$(".pluck-comm-comment-filters").css('visibility', 'visible');
				}
			};

		}

		/**************************************
		 *
		 * pluck/reactions/abuse/dialog
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_reactions_abuse_dialog) === 'undefined') {
			pluckAppProxy.pluck_reactions_abuse_dialog = function (dialogId, parentId, prefs) {
				pluckAppProxy.pluck_dialog_register("abuse", parentId, dialogId);
				prefs = prefs ? prefs : {};
				pluckAppProxy.registerDialog(dialogId, function(id) {
					$("input[name='plckAbuseOnKey']", $(id)).val('');
				});

				var dialog = $(dialogId);
				$(".pluck-report-abuse-submit", dialog).click(function() {
					var form = $(".pluck-abuse-posting-form", dialog);
					$('.pluck-abuse-error', form).hide();
					var ok = true;
					var reason = $('select', form).val();
					var comment = $('textarea', form).val();
					comment = $.trim(comment);
					if (typeof(prefs.maxLength) !== 'undefined' && prefs.maxLength < comment.length) {
						pluckAppProxy.fadeIn($('.pluck-abuse-err-too-long', form));
						ok = false;
					}

					if (ok) {
						var form_top = $(this).parents('div.pluck-abuse-dialog');
						$('.pluck-abuse-error', form).hide();
						pluckAppProxy.displayWait($('.pluck-abuse-wait', form_top));
						var params = { contentType: "Json", plckAction: "report", plckReason: reason, plckDescription: comment };
						$('input:hidden', form).each(function() {	params[this.name] = this.value; });
						pluckAppProxy.callApp("pluck/reactions/abuse/actions.app", params, function(data) {
							$('.pluck-abuse-wait', form_top).hide();
							data = eval('(' + data + ')');
							var update = pluckAppProxy.pluck_reactions_abuse_object;
							if (!update.hasClass("pluck-abuse-report")) update = update.parents(".pluck-abuse-report");
							update = update.parent();
							if (data.success) {
								$(".pluck-abuse-report", update).hide();
								$(".pluck-abuse-reported", update).show();
								if (params.plckAbuseOnKeyType == "user") {
									pluckAppProxy.pluck_user_miniPersona_callbacks("reportAbuse", params.plckAbuseOnKey);
								}
								pluckAppProxy.fadeOut(dialog);
							} else {
								$(".pluck-error-message", dialog).hide();
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								if (results.status == 4) {
									$(".pluck-abuse-report", update).hide();
									$(".pluck-abuse-reported", update).show();
									pluckAppProxy.fadeOut(dialog);
								} else {
									$(".pluck-abuse-report-error", dialog).show();
								}
							}
						});
					}
					return false;
				});
				$(".pluck-report-abuse-cancel", dialog).click(function() {
					$("input[name='plckAbuseOnKey']", dialog).val('');
					$(".pluck-error-message", dialog).hide();
					pluckAppProxy.fadeOut(dialog);
					return false;
				});
				pluckAppProxy.pluck_reactions_abuse_dialog_link(parentId);
			};
			pluckAppProxy.pluck_reactions_abuse_dialog_link = function (parentId) {
				var parentDiv = parentId ? $(parentId) : $(document);
				$(".pluck-abuse-report-link", parentDiv).each(function() {
					var obj = $(this);
					if (obj.attr("registered") == "true") return;
					obj.attr("registered", "true");
					obj.click(function() {
						pluckAppProxy.pluck_reactions_abuse_object = obj;
						var dialog = pluckAppProxy.pluck_find_dialog("abuse", obj);
						if (!dialog) return false;

						var oldID = $("input[name='plckAbuseOnKey']", dialog).val();
						var newID = obj.attr("abuseOnKey");
						if (oldID == newID) {
							pluckAppProxy.fadeOut(dialog);
							$("input[name='plckAbuseOnKey']", dialog).val('');
						} else {
							pluckAppProxy.closeDialogs();
							$("input[name='plckAbuseOnKeyType']", dialog).val(obj.attr("abuseOnKeyType")); 
							$("input[name='plckAbuseOnKey']", dialog).val(obj.attr("abuseOnKey")); 
							$('textarea', dialog).val('');
							$('select', dialog).get(0).selectedIndex = 0;
							$('.pluck-error-message', dialog).hide();
							pluckAppProxy.pluck_reactions_abuse_dialog_display(dialog, obj);
						}
						return false;
					});
				});
			};
		}
		
		/**************************************
		 *
		 * pluck/reactions/recommend/submit
		 *
		 **************************************/
		if (typeof (pluckAppProxy.pluck_reactions_recommend_submit) === 'undefined') {
			pluckAppProxy.pluck_reactions_recommend_submit = function(recommendOnKey, recommendOnKeyType) {
				var params = { contentType: "Json", plckAction: "set", plckRecommendOnKey: recommendOnKey, plckRecommendOnKeyType: recommendOnKeyType };
				pluckAppProxy.callApp("pluck/reactions/recommend/actions.app", params, function(data) {
					var msg;
					data = eval('(' + data + ')');
					//alert(data.success)
				});
			}
		}
		
		/**************************************
		 *
		 * pluck/reactions/recommend/init
		 *
		 **************************************/
		if (typeof (pluckAppProxy.pluck_reactions_recommend_init) === 'undefined') {
			pluckAppProxy.pluck_reactions_recommend_init = function(parentID, userHasRecommended, recommendOnKey, recommendOnKeyType, fbRecommendUrl, useFbLike, fbLikeId) {
				$('a.pluck-reactions-recommend-like', "#"+parentID).click(function() {
					pluckAppProxy.pluck_reactions_recommend_submit(recommendOnKey, recommendOnKeyType);
					$('a.pluck-reactions-recommend-like', "#"+parentID).hide();
					$('span.pluck-reactions-recommend-liked', "#"+parentID).show();
					return false;
				});
				var facebook_status = function(status) {
					if (!facebook_status.called) {
						facebook_status.called = true;
						var watchEvent = true;
						if (!useFbLike) {
							if (status == "unknown") {
								if (userHasRecommended) {
									$("span.pluck-reactions-recommend-liked", "#"+parentID).show();
								} else {
									$("a.pluck-reactions-recommend-like", "#"+parentID).show();
									$("a.pluck-reactions-recommend-like,a.pluck-reactions-recommend-like-recommend", "#"+parentID).show();
								}
								watchEvent = false;
							} else {
								$('#'+fbLikeId).show();
							}
						}
						if (watchEvent) {
							FB.Event.subscribe('edge.create', function(response) {
								if (response == fbRecommendUrl) {
									pluckAppProxy.pluck_reactions_recommend_submit(recommendOnKey, recommendOnKeyType);
								}
							});
						}
					}
				};
				facebook_status.called = false;
				pluckAppProxy.pluck_social_facebook_init(function(response){
					facebook_status(response.status);
				});
				setTimeout(function() {
					facebook_status('unknown');
				}, 5000);
			}
		}
		
	},
	
	
	// ---------------------------------------------------------------------------------------------------
	// eachTime function .  Called whenever the plugin is asked for.  Decides if/when to invoke callbacks.
	function($, jQuery, dmJQuery, callback){
		if(callback){
			callback();
		}
	}
);