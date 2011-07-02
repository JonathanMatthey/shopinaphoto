// Plugin to contain scripts frequently used across multiple widgets
// Minipersona, report abuse, that sort of thing.
pluckAppProxy.registerPlugin("pluck/comments/comments.js",
// init function, called first time plugin is loaded:
	function($, jQuery, dmJQuery) {
		// Pull CSS.
		if (typeof (pluckAppProxy.pluck_comments_load_css) === 'undefined') {
			pluckAppProxy.pluck_comments_load_css = function(callback) {
				pluckAppProxy.pluck_load_css(function() {
					pluckAppProxy.loadCss("pluck/comments/comments.css", "pluck-comments-css-loaded", function() {
						if (isIE6) {
							pluckAppProxy.loadCss("pluck/comments/comments.ie6.css", "pluck-comments-ie6-css-loaded", callback);
						} else if (callback) {
							callback();
						}
					});
				});
			};
		}
		pluckAppProxy.pluck_comments_load_css(function() {
			if (isIE6 && typeof (DD_belatedPNG) == 'object') {
				DD_belatedPNG.fix('.pluck-comm .pluck-png,.pluck-comm .pluck-primary-button,.pluck-comm .pluck-primary-button-text');
			}
		});

		/**************************************
		 *
		 * pluck/login/comments
		 *
		 **************************************/
		if (typeof(pluckAppProxy.pluck_login_comment) === 'undefined') {
			pluckAppProxy.pluck_login_comment = function (topId, parentId, prefs) {
				if ($.browser.msie && $.browser.version < 8 && $.browser.version >= 7) {
					$(topId).addClass("pluck-login-comment-input-ie7");
				}
				
				var top = $(topId);
				var parentTop = $(parentId);
				
				// If user is logged into facebook and not our site, let's show him a generic comment dialog.
				var fbWelcome = $(".pluck-comm-submit-autoLoggedInFacebookUser", parentTop);
				if (fbWelcome.length > 0){
					pluckAppProxy.loadPlugins(["pluck/social/social.js"], function(){
						pluckAppProxy.pluck_social_facebook_init(function(){
							FB.getLoginStatus(function(response){
								// If user exists but is not connected, show a generic "your facebook account" input box for now.
								if(response.status == "notConnected"){
									$(".pluck-comm-comment-input-fb-auto", parentTop).show();
									$(".pluck-login-comment-input", parentTop).hide();
									
									// Yes, that's right.  The login URL is stored in the prefs for login widget,
									// but now we also have a login link in the submit widget
									// So we're filling that one in dynamically with JS
									$('.pluck-comm-submit-login-link', parentTop).attr("href", $('.pluck-login-comment-submit-button', parentTop).attr("href"));
									$('.pluck-comm-submit-login-link', parentTop).click($('.pluck-login-comment-submit-button', parentTop).get(0).onclick);
								}
								// if user exists and is connected, force a login as the pluck user and reload the widget.
								else if (response.status == "connected"){
									// put up a throbber:
									var throbber = $(".pluck-comments-wait", parentTop).clone();
									$(".pluck-comm-wait-msg-txt", throbber).html($(".pluck-login-comment-fb-login-msg", parentTop).html());
									throbber.insertAfter($(".pluck-comments-wait", parent));
									pluckAppProxy.displayWait(throbber);
									
									// Cleanup other UI elements
									$(".pluck-comm-comment-input-fb-auto", parentTop).hide();
									$(".pluck-login-comment-links-wrapper", parentTop).hide();
									$(".pluck-login-comment-calltoaction", top).css("margin-bottom", "0px"); // Just hide some common goofiness.
									$(".pluck-login-comment-input", parentTop).show();
								
									// Login the user
									pluckAppProxy.pluck_social_facebook_import_user(function(){
										// Refresh the comments widget
										pluckAppProxy.pluck_comments_refresh(parentId, null, null, null, null, null, false, true, $(".pluck-login-comment-fb-login-msg", parentTop).html());
									});
								}
								// User not logged into facebook, business as usual.
								// Should only end up here when anonymous commenting is enabled.
								// Otherwise fbWelcome won't exist.
								else{
									// If there's a "make anon" link, we know the user is anonymous, so hide the login box in this case and let him comment anonymously.
									var anon = $(".pluck-comm-submit-make-anon-link", fbWelcome);
									if(anon.length > 0){
										$(".pluck-comm-comment-input-fb-auto", parentTop).show();
										$(".pluck-login-comment-input", parentTop).hide();
										fbWelcome.remove();
									}
									// If the user is not anon, show the login dialog, not the submit dialog.
									else{
										$(".pluck-comm-comment-input-fb-auto", parentTop).hide();
										$(".pluck-login-comment-input", parentTop).show();
									}
								}
							});
						});
					});
					
					// If anonymous commenting is enabled, there will be a link to comment anonymously.
					// Removing the pluck-comm-submit-autoLoggedInFacebookUser element will cause later on scripts 
					// to know that the user would NOT like to use his FB account.
					$(".pluck-comm-submit-make-anon-link", fbWelcome).click(function(){
						fbWelcome.remove();
					});
				}
			};
		}

		/**************************************
		 *
		 * pluck/comments/submit
		 *
		 **************************************/
		if (typeof (pluckAppProxy.pluck_comments_submit) === 'undefined') {
			pluckAppProxy.pluck_comments_submit = function(formId, parentId, prefs) {
				var parentTop = $(parentId);
				prefs = prefs ? prefs : {};
				if ($.browser.msie) {
					$(".pluck-comm-socialoptions label", $(formId)).addClass("isie");
				}
				
				var doSubmit = function(){
					var form = $(formId);
					$('.pluck-error-message, .pluck-confirm-message', form).hide();
					var comment = $('textarea', form).val();
					comment = $.trim(comment);
					if (!comment) {
						pluckAppProxy.fadeIn($('.pluck-comm-err-no-comment', form));
					} else if (typeof (prefs.plckCommentMaxLength) !== 'undefined' && prefs.plckCommentMaxLength < comment.length) {
						pluckAppProxy.fadeIn($('.pluck-comm-err-too-long', form));
					} else {
						var form_top = $(this).parents('div.pluck-comm-input-content');
						pluckAppProxy.displayWait($('.pluck-comm-submit-wait', form_top));
						var params = { contentType: "Json", plckAction: "create", plckCommentBody: comment, plckPageTitle: window.document.title };
						$('input:hidden', form).each(function() {	params[this.name] = this.value; });
						var twitter = $("input[name='plckTwitterLink']:checked", form).val();
						if (twitter) params["plckTwitterLink"] = "true";
						var linkedin = $("input[name='plckLinkedInLink']:checked", form).val();
						if (linkedin) params["plckLinkedInLink"] = "true";
						pluckAppProxy.callApp("pluck/comments/actions.app", params, function(data) {
							var parentComment = $("input[name='plckParentCommentKey']", form).val();
							data = eval('(' + data + ')');
							if (data.success) {
								$('textarea', form).val("");
								if (data.moderating) {
									pluckAppProxy.fadeIn($(".pluck-comm-info-moderating", form));
								}
								if (twitter && !data.twitter) {
									$(".pluck-comm-twitter-option", form).hide();
									pluckAppProxy.fadeIn($(".pluck-comm-twitter-error", form));
								}
								if (linkedin && !data.linkedIn) {
									$(".pluck-comm-linkedin-option", form).hide();
									pluckAppProxy.fadeIn($(".pluck-comm-linkedIn-error", form));
								}
								var updateKids = function() {
									var comment_top = form.parents('div.pluck-comm-single-comment-main');
									var reply_top = form_top.parents('div.pluck-comm-reply-input');
									pluckAppProxy.fadeOut(reply_top);
									pluckAppProxy.pluck_comments_submit_current = "";
									pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, "2", "1", data.commentId, true);
								};
								var updateList = function() {
									var parentTop = $(parentId);
									$(".pluck-nocomm-logo", parentTop).hide();
									$(".pluck-comm-first-to-comment", parentTop).hide();
									pluckAppProxy.pluck_comments_refresh(parentId, null, null, $('.pluck-comm-comment-filters').val(), null, data.commentId);
								};
								if (parentComment) {
									$(".pluck-score-volume[scoreontargetkey='" + parentComment + "']").each(function(i) {
										var vol = $(this);
										vol.attr("activity", "" + (parseInt(vol.attr("activity")) + 1));
									});
								}
								$('.pluck-comm-submit-wait', form_top).hide();
								var facebook = $('.pluck-comm-facebook-option input', form);
								if (facebook.length >= 1 && facebook.get(0).checked) {
									pluckAppProxy.displayWait($('.pluck-comm-submit-wait-fb', form_top));
									var url = $("input[name='clientUrl']", form).val();
									if (!data.moderating) url = data.commentUrl;
									pluckAppProxy.pluck_social_facebook_submitArticleComment($(".pluck-comm-submit-option", form),
										document.title, url, "", comment, [], 'Read the full article', null,
										function() {
											$('.pluck-comm-submit-wait-fb', form_top).hide();
											if (!data.moderating) {
												$('textarea', form).focus();
												setTimeout(parentComment ? updateKids : updateList, 1);
											}
										}, function() {
											$('.pluck-comm-submit-wait-fb', form_top).hide();
											$('textarea', form).focus();
											if (!data.moderating) {
												setTimeout(parentComment ? updateKids : updateList, 1);
											}
										});
								} else {
									if (!data.moderating) {
										setTimeout(parentComment ? updateKids : updateList, 1);
									}
								}
							} else {
								$('.pluck-comm-submit-wait', form_top).hide();
								var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
								$(".pluck-comm-submit-error-detail", form).html("errorCode: " + results.errorCode + ", errorMsg: " + results.errorMsg + ", fieldName: " + results.fieldName + ", fieldValue: " + results.fieldValue);
								if (results.errorCode == "FloodControlTriggered") {
									pluckAppProxy.fadeIn($(".pluck-comm-submit-flood-error", form));
								} else if (results.status == 6 || results.status == 3 || results.status == 2) {
									pluckAppProxy.fadeIn($(".pluck-comm-submit-general-error", form));
								} else if (results.status == 5) {
									pluckAppProxy.fadeIn($(".pluck-comm-submit-security-error", form));
								} else if (results.status == 4) {
									pluckAppProxy.fadeIn($(".pluck-comm-submit-deleted-error", form));
								} else if (results.status == 1) {
									$(".pluck-comm-submit-badword-list", form).html(results.dirtyWordsMsg);
									pluckAppProxy.fadeIn($(".pluck-comm-submit-badword-error", form));
								}
							}
						});
					}
					return false;
				};
				
				$(formId).submit(function(){
					// If is anonymous facebook user, import him as a pluck user before posting.
					var fbWelcome = $(".pluck-comm-submit-autoLoggedInFacebookUser", parentTop);
					if (fbWelcome.length > 0){
						pluckAppProxy.loadPlugins(["pluck/social/social.js"], function(){
							pluckAppProxy.pluck_social_facebook_import_user(doSubmit);
						});
					}
					else{
						doSubmit();
					}
				});
				
				// Wire up minipersona around avatar:
				$(".pluck-comm-sc-avatar-active", $(formId)).hover(function() {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show) != "function") return;
					var userId = $(this).attr("userId");
					pluckAppProxy.closeDialogs();
					pluckAppProxy.pluck_user_miniPersona_show(this, userId, false);
				}, function() {
					if (typeof (pluckAppProxy.pluck_user_miniPersona_show_stop) != "function") return;
					var userId = $(this).attr("userId");
					pluckAppProxy.pluck_user_miniPersona_show_stop(this, userId);
				});

				$(".pluck-comm-submit", $(formId)).click(function() {
					$(formId).submit();
					return false;
				});
				$(".pluck-comm-cancel", $(formId)).click(function() {
					var reply = $(formId).parents(".pluck-comm-comment-input").eq(0);
					pluckAppProxy.fadeOut(reply);
					pluckAppProxy.pluck_comments_submit_current = "";
					$('.pluck-error-message, .pluck-confirm-message', reply).hide();
					return false;
				});
				$(".pluck-comm-comment-connect-twitter-cancel", $(formId)).click(function() {
					var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
					$('.pluck-comm-join-twitter-confirm', comment_top).hide();
					return false;
				});
				$(".pluck-comm-comment-connect-linkedin-cancel", $(formId)).click(function() {
					var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
					$('.pluck-comm-join-linkedin-confirm', comment_top).hide();
					return false;
				});
				$(".pluck-comm-comment-connect-twitter-yes", $(formId)).click(function() {
					var me = this;
					pluckAppProxy.pluck_social_twitter_startAuth($("input[name='plckUserId']", $(formId)).val(), null, null, function(success, msg, status) {
						$("input[name='plckTwitterLink']", $(formId)).removeClass('pluck-comm-twitter-link-connect').addClass('pluck-comm-twitter-link');
						var comment_top = $(me).parents('div.pluck-comm-input-rounded-wrap');
						$('.pluck-comm-join-twitter-confirm', comment_top).hide();
						$("input[name='plckTwitterLink']", $(formId)).attr('checked', true);
					});
					return false;
				});
				$(".pluck-comm-comment-connect-linkedin-yes", $(formId)).click(function() {
					var me = this;
					pluckAppProxy.pluck_social_linkedIn_startAuth($("input[name='plckUserId']", $(formId)).val(), null, null, function(success, msg, status) {
						$("input[name='plckLinkedInLink']", $(formId)).removeClass('pluck-comm-linkedin-link-connect').addClass('pluck-comm-linkedin-link');
						var comment_top = $(me).parents('div.pluck-comm-input-rounded-wrap');
						$('.pluck-comm-join-linkedin-confirm', comment_top).hide();
						$("input[name='plckLinkedInLink']", $(formId)).attr('checked', true);
					});
					return false;
				});
				$(".pluck-comm-twitter-link-connect", $(formId)).click(function() {
					if ($(".pluck-comm-twitter-link-connect", $(formId)).is(':checked')) {
						pluckAppProxy.closeDialogs();
						var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
						pluckAppProxy.displayWait($('.pluck-comm-join-twitter-confirm', comment_top));
						return false;	
					}
					return true;
						});
				$(".pluck-comm-linkedin-link-connect", $(formId)).click(function() {
					if ($(".pluck-comm-linkedin-link-connect", $(formId)).is(':checked')) {
						pluckAppProxy.closeDialogs();
						var comment_top = $(this).parents('div.pluck-comm-input-rounded-wrap');
						pluckAppProxy.displayWait($('.pluck-comm-join-linkedin-confirm', comment_top));
						return false;
					}
					return true;
				});
				$(".pluck-comm-facebook-link-connect", $(formId)).click(function() {
					if ($(".pluck-comm-facebook-link-connect", $(formId)).is(':checked')) {
						pluckAppProxy.closeDialogs();
						var form_top = $(this).parents('div.pluck-comm-input-content');
						pluckAppProxy.displayWait($('.pluck-comm-submit-wait-fb', form_top));
						pluckAppProxy.pluck_social_facebook_connect($(formId), function(uid) {
							var params = { contentType: "Json", plckAction: "updateExternalUserId", plckUserKey: $("input[name='plckUserId']", $(formId)).val(),
										plckKey: "Facebook", plckValue: uid };
							pluckAppProxy.callApp("pluck/user/actions.app", params, function(data) {
								//document.location.reload();
								$('.pluck-comm-submit-wait-fb', form_top).hide();
								$("input[name='plckFacebookLink']", $(formId)).attr('checked', true);
								$("input[name='plckFacebookLink']", $(formId)).removeClass('pluck-comm-facebook-link-connect').addClass('pluck-comm-facebook-link');
							});
						}, function() {
							$('.pluck-comm-submit-wait-fb', form_top).hide();
							$("input[name='plckFacebookLink']", $(formId)).attr('checked', false);
						});
						return true;
					}
					return true;
				});
				var lastKeyTimeout = null;
				$("textarea.pluck-comment-input-box").keyup(function() {
					if (lastKeyTimeout) clearTimeout(lastKeyTimeout);
					var me = $(this);
					lastKeyTimeout = setTimeout(function() {
						var remaining = parseInt(prefs.plckCommentMaxLength) - me.val().length;
						var tp = me.parents(".pluck-comm-posting-form");
						$(".pluck-comm-counter-wrapper .pluck-comm-counter-count", tp).html(remaining < 0 ? remaining * -1 : remaining);
						$(".pluck-comm-counter-wrapper .pluck-comm-counter-50", tp).toggle(remaining == 0 || remaining > 1);
						$(".pluck-comm-counter-wrapper .pluck-comm-counter-1", tp).toggle(remaining == 1);
						$(".pluck-comm-counter-wrapper .pluck-comm-over-counter-1", tp).toggle(remaining == -1);
						$(".pluck-comm-counter-wrapper .pluck-comm-over-counter-50", tp).toggle(remaining < -1);
						$(".pluck-comm-counter-wrapper", tp).toggle(remaining < 50);
						$('.pluck-comm-err-no-comment',tp).hide();
						$('.pluck-comm-err-too-long',tp).hide();
					}, 500);
				});
				
				$("span.pluck-comm-max-comment-length").html(prefs.plckCommentMaxLength);
			};
		}

		/**************************************
		 *
		 * pluck/comments/list
		 *
		 **************************************/
		if (typeof (pluckAppProxy.pluck_comments_list) === 'undefined') {
			pluckAppProxy.pluck_comments_list = function(listId, parentId, prefs, levelNum, displayComment, findCommentNextLevel, isShort) {
				levelNum = levelNum ? levelNum : 1;
				prefs = prefs ? prefs : {};
				var list = $(listId);
				var parentDiv = parentId ? $(parentId) : $(document);
				var isIE6 = $.browser.msie && $.browser.version < 7;
				var isIE76 = $.browser.msie && $.browser.version < 8;

				var fadeCommentIn = function(p) {
					if (isIE76) {
						$(".pluck-comm-comment-action-group", p).hide();
						$(".pluck-comm-avatarimg", p).hide();
						setTimeout(function() {
							p.show();
						}, 100);
						setTimeout(function() {
							$(".pluck-comm-comment-action-group", p).show();
							$(".pluck-comm-avatarimg", p).show();
						}, 125);
					} else {
						pluckAppProxy.fadeIn(p);
					}
				};

				var updateCommentState = function(p, state) {
					pluckAppProxy.fadeOut(p, function() {
						p.removeClass("pluck-comm-isBlocked");
						p.removeClass("pluck-user-isHidden");
						p.removeClass("pluck-user-isIgnored");
						p.removeClass("pluck-comm-isUnderReview");
						p.removeClass("pluck-comm-isVisible");
						if (state == "deleted")	p.addClass("pluck-comm-isDeleted");
						else if (p.hasClass("pluck-comm-isBlockedOrig")) p.addClass("pluck-comm-isBlocked");
						else if (p.hasClass("pluck-user-isHiddenOrig")) p.addClass("pluck-user-isHidden");
						else if (p.hasClass("pluck-comm-isUnderReviewOrig")) p.addClass("pluck-comm-isUnderReview");
						else if (p.hasClass("pluck-user-isIgnoredOrig")) p.addClass("pluck-user-isIgnored");
						else p.addClass("pluck-comm-isVisible");
						fadeCommentIn(p);
					});
				};

				var updateShowHiddenInfo = function(p, showIt) {
					pluckAppProxy.fadeOut(p, function() {
						if (showIt) p.addClass("pluck-comm-showHiddenInfo");
						else p.removeClass("pluck-comm-showHiddenInfo");
						fadeCommentIn(p);
					});
				};

				var updateFriendInfo = function(p, isFriend) {
					pluckAppProxy.fadeOut(p, function() {
						if (isFriend) p.addClass("pluck-user-isFriend");
						else p.removeClass("pluck-user-isFriend");
						fadeCommentIn(p);
					});
				};

				var showErrorMessage = function(msgDivClass, comment_top) {
					$(".pluck-comm-edit-controls", comment_top).hide();
					pluckAppProxy.fadeIn($(msgDivClass, comment_top), function() {
						setTimeout(function() {
							pluckAppProxy.fadeOut($(msgDivClass, comment_top), function() {
								$(".pluck-comm-edit-controls", comment_top).css('display', 'block');
							});
						}, 5000);
					});
				};

		// DJL - to disable IE6
				if (!isIE6) {
					var actives = $(".pluck-comm-single-comment-top:not(.pluck-comm-isAnonymousTier)", list);
					$(".pluck-comm-sc-avatar-active", actives).hover(function() {
						if (typeof (pluckAppProxy.pluck_user_miniPersona_show) != "function") return;
						var comment_top = $(this).parents('div.pluck-comm-single-comment-main').eq(0).parent();
						var isFeatured = comment_top.hasClass("pluck-user-isFeatured");
						var userId = $(this).attr("userId");
						pluckAppProxy.closeDialogs();
						pluckAppProxy.pluck_user_miniPersona_show(this, userId, isFeatured);
					}, function() {
						if (typeof (pluckAppProxy.pluck_user_miniPersona_show_stop) != "function") return;
						var userId = $(this).attr("userId");
						pluckAppProxy.pluck_user_miniPersona_show_stop(this, userId);
					});
		// DJL - to disable IE6
				}
				$(".pluck-comm-comment-delete-yes", list).click(function() {
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
					pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
					$('.pluck-comm-comment-delete-confirm', comment_top).hide();
					pluckAppProxy.pluck_comments_list_collapse_replies(comment_top, parentId);
					var commentId = comment_top.eq(0).attr("commentId");
					if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
					var params = { contentType: "Json", plckAction: "delete", plckCommentKey: commentId };
					pluckAppProxy.callApp("pluck/comments/actions.app", params, function(data) {
						data = eval('(' + data + ')');
						$('.pluck-comm-wait', comment_top).hide();
						if (!data.success) {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							if (results.status == 4) data.success = true;
						}
						if (data.success) {
							$(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function() {
								pluckAppProxy.pluck_comments_list_collapse_replies($(this), parentId);
								updateCommentState($(this).parent(), "deleted");
							});
						} else {
							showErrorMessage(".pluck-comm-delete-error", comment_top);
						}
					});
					return false;
				});
				$(".pluck-comm-comment-delete-no", list).click(function() {
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
					$('.pluck-comm-wait', comment_top).hide();
					return false;
				});
				$(".pluck-comm-delete", list).click(function() {
					pluckAppProxy.closeDialogs();
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
					pluckAppProxy.displayWait($('.pluck-comm-comment-delete-confirm', comment_top));
					return false;
				});
				$(".pluck-comm-block", list).click(function() {
					pluckAppProxy.closeDialogs();
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
					pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
					pluckAppProxy.pluck_comments_list_collapse_replies(comment_top, parentId);
					var commentId = comment_top.eq(0).attr("commentId");
					if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
					var params = { contentType: "Json", plckAction: "block", plckBlock: "1", plckCommentKey: commentId };
					pluckAppProxy.callApp("pluck/comments/actions.app", params, function(data) {
						$('.pluck-comm-working', comment_top).hide();
						data = eval('(' + data + ')');
						if (!data.success) {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							if (results.status == 4) data.success = true;
						}
						if (data.success) {
							$(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function() {
								$(this).parent().addClass("pluck-comm-isBlockedOrig");
								updateCommentState($(this).parent(), "reset");
							});
						} else {
							showErrorMessage('.pluck-comm-block-error', comment_top);
						}
					});
					return false;
				});
				$(".pluck-comm-unblock", list).click(function() {
					pluckAppProxy.closeDialogs();
					var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
					pluckAppProxy.displayWait($('.pluck-comm-working', comment_top));
					var commentId = comment_top.eq(0).attr("commentId");
					if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
					var params = { contentType: "Json", plckAction: "block", plckBlock: "0", plckCommentKey: commentId };
					pluckAppProxy.callApp("pluck/comments/actions.app", params, function(data) {
						$('.pluck-comm-working', comment_top).hide();
						data = eval('(' + data + ')');
						if (!data.success) {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							if (results.status == 4) data.success = true;
						}
						if (!data.success) {
							var results = pluckAppProxy.analyzeError(data.status, data.errorMsg);
							if (results.status == 4) data.success = true;
						}
						if (data.success) {
							$(".pluck-comm-single-comment-main[commentId='" + commentId + "'], .pluck-comm-single-comment-main[commentId='F:" + commentId + "']").each(function() {
								$(this).parent().removeClass("pluck-comm-isBlockedOrig");
								updateCommentState($(this).parent(), "reset");
							});
						} else {
							showErrorMessage('.pluck-comm-unblock-error', comment_top);
						}
					});
					return false;
				});
				$("a.pluck-comm-show-hidden-info", list).click(function() {
					updateShowHiddenInfo($(this).parents('div.pluck-comm-single-comment-main').parent(), true);
					return false;
				});
				$("a.pluck-comm-hide-hidden-info", list).click(function() {
					updateShowHiddenInfo($(this).parents('div.pluck-comm-single-comment-main').parent(), false);
					return false;
				});

				if (levelNum == 1) {
					pluckAppProxy.pluck_comments_submit_current = "";
					$("a.pluck-comm-reply-button-ref", list).click(function() {
						pluckAppProxy.closeDialogs();
						var comment_top = $(this).parents('div.pluck-comm-single-comment-main');
						var commentId = comment_top.eq(0).attr("commentId");
						if (commentId.indexOf("F:") != -1) commentId = commentId.substring(2);
						var reply = $(".pluck-comm-reply-input", parentDiv);
						if (commentId == pluckAppProxy.pluck_comments_submit_current) {
							pluckAppProxy.fadeOut(reply);
							pluckAppProxy.pluck_comments_submit_current = "";
							$('.pluck-error-message, .pluck-confirm-message', reply).hide();
						} else {
							$('textarea', reply).val('');
							if (pluckAppProxy.pluck_comments_submit_current) reply.hide();
							$('.pluck-error-message, .pluck-confirm-message', reply).hide();
							pluckAppProxy.pluck_comments_submit_current = commentId;
							$("input[name='plckParentCommentKey']", reply).val(pluckAppProxy.pluck_comments_submit_current);
							pluckAppProxy.pluck_comments_submit_reply_display(reply, comment_top);
						}
						return false;
					});
					$("select.pluck-comm-comment-filters", list).change(function() { pluckAppProxy.pluck_comments_refresh(parentId, "", "", $(this).val(), "", ""); });
					$("a.pluck-comm-featuredfilter-link", list).click(function() { pluckAppProxy.pluck_comments_refresh(parentId, "", "", "", "featured", ""); return false; });
					$("a.pluck-comm-allfilter-link", list).click(function() { pluckAppProxy.pluck_comments_refresh(parentId, "", "", "", "all", ""); return false; });
					$("a.pluck-comm-friendsfilter-link", list).click(function() { pluckAppProxy.pluck_comments_refresh(parentId, "", "", "", "friends", ""); return false; });
					$("a.pluck-comm-pagination-first, a.pluck-comm-pagination-prev, a.pluck-comm-pagination-next, a.pluck-comm-pagination-last", list).click(function() {
						pluckAppProxy.pluck_comments_refresh(parentId, $(this).attr("pageno"), "", "", "", ""); return false;
					});
					$("a.pluck-comm-show-reply-link", list).click(function() {
						pluckAppProxy.pluck_comments_list_expand_replies($(this).parents('div.pluck-comm-single-comment-main'), parentId, "2");
						return false;
					});
					$("a.pluck-comm-hide-reply-link", list).click(function() {
						pluckAppProxy.pluck_comments_list_collapse_replies($(this).parents('div.pluck-comm-single-comment-main'), parentId);
						return false;
					});
					pluckAppProxy.pluck_user_miniPersona_addCallback("setFriend", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							updateFriendInfo($(this).parents(".pluck-comm-single-comment-main").parent(), true);
						});
					});
					pluckAppProxy.pluck_user_miniPersona_addCallback("unsetFriend", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							updateFriendInfo($(this).parents(".pluck-comm-single-comment-main").parent(), false);
						});
					});
					pluckAppProxy.pluck_user_miniPersona_addCallback("setEnemy", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							var p = $(this).parents(".pluck-comm-single-comment-main").parent();
							p.addClass("pluck-user-isIgnoredOrig");
							updateCommentState(p, "reset");
						});
					});
					pluckAppProxy.pluck_user_miniPersona_addCallback("unsetEnemy", function(userId) {
						$(".pluck-comm-sc-avatar-active[userId='" + userId + "']").each(function() {
							var p = $(this).parents(".pluck-comm-single-comment-main").parent();
							p.removeClass("pluck-user-isIgnoredOrig");
							updateCommentState(p, "reset");
						});
					});
					if (displayComment) {
						var interval = window.setInterval(function() {
							if (parentDiv.css("display") != 'none') {
								var l = $(".pluck-comm-single-comment-main[commentId='" + displayComment + "']", list);
								if (l && l.length > 0) l.get(0).scrollIntoView(true);
								if (findCommentNextLevel) {
									pluckAppProxy.pluck_comments_list_refresh_replies(l, parentId, "2", "1", findCommentNextLevel);
								}
								window.clearInterval(interval);
							}
						}, 200);
					} else if (isShort.toLowerCase() != "true") {
						var u = document.location.href;
						var idx = u.indexOf("#");
						if (idx != -1) {
							var anchor = u.substring(idx + 1);
							if (anchor && anchor == "pluck_comments_list") {
								var interval = window.setInterval(function() {
									if (parentDiv.css("display") != 'none') {
										$(listId).get(0).scrollIntoView(true);
										window.clearInterval(interval);
									}
								}, 200);
							}
						}
					}
				} else {
					if (typeof (pluckAppProxy.pluck_reactions_abuse_dialog_link) == "function") pluckAppProxy.pluck_reactions_abuse_dialog_link(list);
					if (typeof (pluckAppProxy.pluck_util_email_dialog_link) == "function") pluckAppProxy.pluck_util_email_dialog_link(list);
					if (typeof (pluckAppProxy.pluck_util_permalink_dialog_link) == "function") pluckAppProxy.pluck_util_permalink_dialog_link(list);
					if (typeof (pluckAppProxy.pluck_util_share_dialog_link) == "function") pluckAppProxy.pluck_util_share_dialog_link(list);
					$("a.pluck-comm-pagination-first, a.pluck-comm-pagination-prev, a.pluck-comm-pagination-next, a.pluck-comm-pagination-last", list).click(function() {
						var lnk = $(this);
						var pageno = lnk.attr("pageno");
						var list_top = lnk.parents('div.pluck-comm-pagination-wrapper').eq(0).parent();
						var comment_top = $("div.pluck-comm-single-comment-main", list_top.prev());
						$(".pluck-comm-show-hide-replies", comment_top).get(0).scrollIntoView(true);
						pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, levelNum, pageno, "");
						return false;
					});
				}
				if (typeof (pluckAppProxy.pluck_reactions_score_submit) == "function") pluckAppProxy.pluck_reactions_score_submit(list);
			};

			pluckAppProxy.pluck_comments_list_expand_replies = function(comment_top, parentId, level, pageno, replyCommentId) {
				pageno = pageno ? pageno : "1";
				replyCommentId = replyCommentId ? replyCommentId : "";
				var parent = $(".pluck-comm-show-hide-replies", comment_top);
				var listId = parent.attr("childlist");
				if (listId) {
					pluckAppProxy.slideDown($(listId));
					$("a.pluck-comm-show-reply-link", parent).hide();
					$("a.pluck-comm-hide-reply-link", parent).show();
				} else {
					pluckAppProxy.pluck_comments_list_refresh_replies(comment_top, parentId, level, pageno, replyCommentId);
				}
			};

			pluckAppProxy.pluck_comments_list_collapse_replies = function(comment_top, parentId) {
				var parent = $(".pluck-comm-show-hide-replies", comment_top);
				var listId = parent.attr("childlist");
				if (listId) {
					pluckAppProxy.closeDialogs();
					pluckAppProxy.slideUp($(listId));
				}
				$("a.pluck-comm-hide-reply-link", parent).hide();
				$("span.pluck-comm-wait-reply-link", parent).hide();
				$("a.pluck-comm-show-reply-link", parent).show();
			};

			pluckAppProxy.pluck_comments_list_refresh_replies = function(comment_top, parentId, level, pageno, replyCommentId, isGlobal) {
				pageno = pageno ? pageno : "1";
				level = level ? level : "2";
				replyCommentId = replyCommentId ? replyCommentId : "";
				var parent = $(".pluck-comm-show-hide-replies", comment_top);
				var listId = parent.attr("childlist");
				pluckAppProxy.closeDialogs();
				if (listId) {
					pluckAppProxy.slideUp($(listId), function() { $(listId).remove(); });
				}
				$("a.pluck-comm-show-reply-link", parent).hide();
				$("a.pluck-comm-hide-reply-link", parent).hide();
				$("span.pluck-comm-wait-reply-link", parent).show();
				parent.show();
				var commentPath = comment_top.attr("threadpath");

				var matchCommentId = comment_top.attr("commentId");
				if (matchCommentId.indexOf("F:") == 0) {
					matchCommentId = matchCommentId.substring(2);
				} else {
					matchCommentId = "F:" + matchCommentId;
				}
				var matchComment = $(".pluck-comm-single-comment-main[commentId='" + matchCommentId + "']");

				var params = {
					contentType: "Html",
					plckCommentOnKeyType: parent.attr("commentOnKeyType"),
					plckCommentOnKey: parent.attr("commentOnKey"),
					plckParentCommentPath: commentPath,
					plckSort: "TimeStampAscending",
					plckOnPage: pageno,
					plckItemsPerPage: parent.attr("itemsPerPage"),
					plckFilter: "",
					plckLevel: level,
					plckParentHtmlId:	parentId.substring(1),
					plckFindCommentKey: replyCommentId,
					clientUrl: document.location.href
				};
				if (pluckAppProxy.debugLevel) {
					params["debug"] = pluckAppProxy.debugLevel;
				}
				if ($('.pluck-comm-ReplyLevel-1', $(parentId)).hasClass("pluck-comm-narrow")) params.plckCommentListType = "narrow";
				pluckAppProxy.callApp("pluck/comments/list.app", params, function(data) {
					comment_top.parent().after(data);
					var childList = comment_top.parent().next();
					parent.attr("childlist", "#" + childList.attr("id"));
					var totalcount = childList.attr("totalcount");
					$('span.pluck-comm-child-count', comment_top).html(totalcount);
					$('span.pluck-comm-child-count-multiple', comment_top).toggle(totalcount != "1");
					$('span.pluck-comm-child-count-single', comment_top).toggle(totalcount == "1");
					matchComment.each(function() {
						var ct = $(this);
						var p1 = $(".pluck-comm-show-hide-replies", ct);
						var listId = p1.attr("childlist");
						if (isGlobal && listId) {
							pluckAppProxy.pluck_comments_list_refresh_replies(ct, parentId, level, pageno, "");
						} else {
							$('span.pluck-comm-child-count', ct).html(totalcount);
							$('span.pluck-comm-child-count-multiple', ct).toggle(totalcount != "1");
							$('span.pluck-comm-child-count-single', ct).toggle(totalcount == "1");
							p1.show();
						}
					});
					pluckAppProxy.slideDown(childList, function() {
						$("span.pluck-comm-wait-reply-link", parent).hide();
						$("a.pluck-comm-show-reply-link", parent).hide();
						$("a.pluck-comm-hide-reply-link", parent).show();
						if (replyCommentId) {
							var l = $(".pluck-comm-single-comment-main[commentId='" + replyCommentId + "']", childList);
							if (l && l.length > 0) l.get(0).scrollIntoView(true);
						}
					});
				});
			};


			// pluck_comments_refresh
			// Refreshes the comments widget.
			// params:
			//    - parentId - jQuery style ID or jQuery object for the comments widget (i.e. "#comments012341")
			//    - pageno - (same as standard pas: tag parameter)
			//    - itemsPerPage - (same as standard pas: tag parameter)
			//    - sort - (same as standard pas: tag parameter)
			//    - filter - (same as standard pas: tag parameter)
			//    - findCommentId - (same as standard pas: tag parameter)
			//    - forcePageRefresh - by default, we'll try to do an ajax refresh of just the comments widget (based on prefs).  
			//      If this is set, we'll always do a full page reload.
			//    - noScroll - by default, we scroll to the top of the comments widget while it refreshes.  Set this to prevent scrolling (i.e. auto-login that happens while the user is reading the article).
			//    - waitMsg - Overrides the default throbber message with a given string.
			pluckAppProxy.pluck_comments_refresh = function(parentId, pageno, itemsPerPage, sort, filter, findCommentId, forcePageRefresh, noScroll, waitMsg) {
				var parent = $(parentId);
				var params = {};
				params.plckOnPage = pageno ? pageno : "1";
				params.plckItemsPerPage = itemsPerPage ? itemsPerPage : parent.attr("itemsperpage");
				params.plckSort = sort ? sort : (findCommentId ? "" : parent.attr("sort"));
				params.plckFilter = filter ? filter : (findCommentId ? "" : parent.attr("filter"));
				params.plckFindCommentKey = findCommentId ? findCommentId : "";

				if (parent.attr("pagerefresh") == "true" || forcePageRefresh) {
					var u = document.location.href;
					var idx = u.indexOf("#");
					if (idx != -1) u = u.substring(0, idx);
					idx = u.indexOf("?");
					if (idx != -1) {
						var query = u.substring(idx + 1);
						u = u.substring(0, idx + 1);
						var query = query.split("&");
						for (var i = 0; i < query.length; i++) {
							var idx = query[i].indexOf("=");
							if (idx != 1) {
								var key = query[i].substring(0, idx);
								var lkey = key.toLowerCase();
								var val = query[i].substring(idx + 1);
								if (lkey != "plckonpage" && lkey != "plckitemsperpage" && lkey != "plcksort" && lkey != "plckfilter" && lkey != "plckfindcommentkey") {
									u += key + "=" + val + "&";
								}
							}
						}
					} else u += "?";
					if (params.plckOnPage != "1")	u += "plckOnPage=" + params.plckOnPage + "&";
					if (params.plckItemsPerPage != "") u += "plckItemsPerPage=" + params.plckItemsPerPage + "&";
					if (params.plckSort != "") u += "plckSort=" + params.plckSort + "&";
					if (params.plckFilter != "") u += "plckFilter=" + params.plckFilter + "&";
					if (params.plckFindCommentKey != "") u += "plckFindCommentKey=" + params.plckFindCommentKey + "&";
					if (u.substring(u.length - 1) == "&") u = u.substring(0, u.length - 1);
					
					if (document.location.href.indexOf(u) >= 0){
						u += "#pluck_comments_list"
						document.location.href = u;
					}
					else {
						document.location.reload();
					}
					return;
				}

				pluckAppProxy.closeDialogs();
				
				var throbber = $(".pluck-comments-wait", parent);
				pluckAppProxy.displayWait(throbber, waitMsg);
				
				
				pluckAppProxy.pluck_comments_submit_current = "";
				var reply = $(".pluck-comm-reply-input", parent);
				reply.hide();
				reply.appendTo(parent);

				parent.attr("onpage", params.plckOnPage);
				parent.attr("itemsperpage", params.plckItemsPerPage);
				parent.attr("sort", params.plckSort);
				parent.attr("filter", params.plckFilter);

				var list_parent = $(".pluck-comm-wrapper", parent);

				params.contentType = "Html";
				params.plckCommentOnKeyType = parent.attr("commentOnKeyType");
				params.plckCommentOnKey = parent.attr("commentOnKey");
				params.plckLevel = "1";
				params.plckParentHtmlId = parentId.substring(1);
				params.clientUrl = document.location.href;
				params.plckCommentListType = parent.attr("listtype");

				if (pluckAppProxy.debugLevel) params.debug = pluckAppProxy.debugLevel;
				
				if(!noScroll){
					list_parent.get(0).scrollIntoView(true);
				}

				pluckAppProxy.callApp("pluck/comments", params, function(data) {
					parent.html(" ");
					//$(".pluck-comm-ReplyLevel-1", list_parent).each(function() { $(this).remove(); });
					parent.append(data);
					if ($.browser.msie) {
						setTimeout(function() {
							$(".pluck-comments-wait", parent).hide();
						}, 500);
					} else {
						$(".pluck-comments-wait", parent).hide();
					}
					
					var list_parent = $(".pluck-comm-wrapper", parent);
					if(!noScroll){
						list_parent.get(0).scrollIntoView(true);
					}
						
					/*
					pluckAppProxy.fadeIn(list_parent, function() {
						var lists = $(".pluck-comm-ReplyLevel-1", list_parent);
						if (typeof (pluckAppProxy.pluck_reactions_abuse_dialog_link) == "function") pluckAppProxy.pluck_reactions_abuse_dialog_link(lists);
						if (typeof (pluckAppProxy.pluck_util_email_dialog_link) == "function") pluckAppProxy.pluck_util_email_dialog_link(lists);
						if (typeof (pluckAppProxy.pluck_util_permalink_dialog_link) == "function") pluckAppProxy.pluck_util_permalink_dialog_link(lists);
						if (typeof (pluckAppProxy.pluck_util_share_dialog_link) == "function") pluckAppProxy.pluck_util_share_dialog_link(lists);
					});
					*/
				});
			};
		}

		/**************************************
		 *
		 * pluck/comments
		 *
		 **************************************/
		if (typeof (pluckAppProxy.pluck_comments) === 'undefined') {
			pluckAppProxy.pluck_comments = function(topId) {
				pluckAppProxy.registerCssCallback(isIE6 ? "pluck/comments/comments.ie6.css" : "pluck/comments/comments.css", function() {
					$.pluckCornerComplete($(topId), function() {
						$(topId).prev().hide();
						if ($.browser.msie && $.browser.version < 8) {
							$(topId).show();
							pluckAppLogger.log("Completed I6/7 Show");
						} else {
							pluckAppProxy.fadeIn($(topId));
						}
					});
				});
			};
		}
	},

// eachTime function.  Called whenever the plugin is requested, responsible for executing callbacks.
	function($, jQuery, dmJQuery, callback) {
		if (callback) {
			callback();
		}
	}
);