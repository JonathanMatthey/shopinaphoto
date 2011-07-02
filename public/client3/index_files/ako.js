function rsi_img(p,u,c){if(u.indexOf(location.protocol)==0){var i=new Image(2,3);if(c){i.onload=c;}
i.src=u;p[p.length]=i;}}
function rsi_simg(p,s,i){if(i<s.length){rsi_img(p,s[i],function(){rsi_simg(p,s,i+1);});}}
function rsi_req_pix(l,s){var w=window;if(typeof(w.rsi_imgs)=="undefined"){w.rsi_imgs=[];}
if(typeof(w.rsi_simgs)=="undefined"){w.rsi_simgs=[];}
var a=w.rsi_imgs;var b=w.rsi_simgs;var i;for(i=0;i<l.length;++i){if(s){b[b.length]=l[i];}else{rsi_img(a,l[i]);}}
if(s){rsi_simg(a,b,0);}}
rsi_req_pix([],0);rsi_req_pix(['http://ad.yieldmanager.com/pixel?id=56918&id=1215324&id=1010254&id=1347038&id=766944&id=703456&id=1010244&id=826418&id=1049817&id=1347127&id=1056896&id=1010092&id=1077946&id=1134866&id=1010284&id=617988&id=1077949&id=1049782&id=775595&id=1077940&id=672502&id=1233328&id=588118&id=731347&id=1058643&id=1238635&t=2','http://ads.revsci.net/adserver/ako?record_activation&rsi_dpr=56918-1215324-1010254-1347038-766944-703456-1010244-826418-1049817-1347127-1056896-1010092-1077946-1134866-1010284-617988-1077949-1049782-775595-1077940-672502-1233328-588118-731347-1058643-1238635'],1);