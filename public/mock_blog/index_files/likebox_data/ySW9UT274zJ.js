/*1308538489,169775556*/

if (window.CavalryLogger) { CavalryLogger.start_js(["pzflD"]); }

function send_error_signal(a,b){if(window.Env&&window.Env.error_uri){var c=b?b.substr(0,b.indexOf(':')):undefined;if(a&&a=='async_error'&&c&&c in {'1004':1,'12029':1,'12031':1,'12152':1}&&b.indexOf('scribe_endpoint.php')==-1){new AsyncRequest().setURI('/ajax/chat/scribe_endpoint.php').setData({c:'async_error',m:b}).setMethod('GET').setReadOnly(true).setOption('suppressEvaluation',true).setOption('suppressErrorAlerts',true).setHandler(bagofholding).setErrorHandler(bagofholding).send(true);}else new AsyncSignal(window.Env.error_uri,{c:a,m:b}).send();}}