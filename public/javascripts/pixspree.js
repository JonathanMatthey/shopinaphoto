var pixspree_key = 'perezhilton.com';
var pixspree_api = 'http://www.pixspree.com/api/widget/image';
var pixspree_host = 'http://widget.pixspree.com';
var pixspree_refer = '';
var pixspree_cache = true;
var pixspree_config = {
    x: 2,
    y: 2,
    square_zid: '21',
    banner_zid: '22',
    publisher_id: '5',
    selector: '.entry p > img:not(.wp-smiley)',
    img_active: false,
    like_btn: false,
    valid_page: function () {
        var url = document.location.href;
        var url = url.split('/');
        if (parseInt(url[url.length - 1]) > 5 || parseInt(url[url.length - 2]) > 5) return true;
        else return false;
    }
};

var _gaq = _gaq || [];
var tracker = function () {
        this.widgets = [];
        this.domain = document.domain.replace("www.", "");
        this.init();
    };
tracker.prototype = {
    init: function () {
        if (this.domain.indexOf('google') > -1) return;
        _gaq.push(['pixspree._setAccount', 'UA-18858165-1'], ['pixspree._setDomainName', this.domain], ['pixspree._setAllowLinker', true], ['pixspree._trackPageview'], ['pixspree._trackEvent', this.domain, 'Init', 'Widget is loaded into page - ' + this.domain]);
        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    },
    save: function (action, label) {
        if (this.domain.indexOf('google') > -1) return;
        _gaq.push(['pixspree._setAccount', 'UA-18858165-1'], ['pixspree._setDomainName', this.domain], ['pixspree._setAllowLinker', true], ['pixspree._trackEvent', this.domain, action, label]);
    }
};
var pixazza = {
    showCallout: function () {}
};
var widget = function () {
        this.widgets = [];
        this.stars = [];
        this.init();
    };
widget.prototype = {
    imgs: [],
    init: function () {
        if (dom.get('pixspree-css') || pixspree_config == null || pixspree_config == undefined) return;
        dom.cleanswf();
        this.tracker = new tracker();
        var style = document.createElement('link')
        style.href = pixspree_host + '/assets/css/widget.css';
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.setAttribute('id', 'pixspree-css');
        document.getElementsByTagName('head')[0].appendChild(style);
        var scripts = dom.grab('script'),
            fb_exists = false;
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src && src.indexOf('connect.facebook.net/en_US/all.js') > -1) fb_exists == true;
        }
        if (!fb_exists) {
            if (!document.getElementById('fb-root')) {
                var fb_root = document.createElement('div');
                fb_root.id = 'fb-root';
                document.body.appendChild(fb_root);
            }(function () {
                var e = document.createElement('script');
                e.async = true;
                e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
                document.getElementById('fb-root').appendChild(e);
            }());
        }
        var imgs = dom.grab((pixspree_config != null) ? pixspree_config.selector : 'img');
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].className.indexOf('no-pixspree') == -1) this.imgs.push(imgs[i]);
        }
        for (var i = 0; i < this.imgs.length; i++) {
            if (this.pre_requisites(this.imgs[i]) !== false) {
                if (pixspree_config.layover_ad === true && i == (this.imgs.length / 2)) {
                    var coords = this.getXY(this.imgs[i]);
                    var imgTop = coords.y;
                    var imgLeft = coords.x;
                    var close = document.createElement('div');
                    close.className = 'pixspree-layover-close';
                    close.style.top = coords.y + parseInt((this.imgs[i].height - 248) / 2) + 'px';
                    close.style.left = parseInt(coords.x + parseInt(this.imgs[i].width - 298) / 2) + 246 + 'px';
                    close.innerHTML = 'Close [X]';
                    close.style.opacity = 0;
                    document.body.appendChild(close);
                    var layover = document.createElement('iframe');
                    layover.src = 'http://ad4.revfusion.net/servlet/view/banner/html/zone?zid=' + pixspree_config.layover_zid + '&pid=' + pixspree_config.publisher_id;
                    layover.target = '_blank';
                    layover.className = 'pixspree-layover';
                    layover.frameBorder = 0;
                    layover.width = this.imgs[i].width;
                    layover.height = '250px';
                    layover.style.position = 'absolute';
                    layover.style.top = coords.y + parseInt((this.imgs[i].height - 250) / 2) + 'px';
                    layover.style.left = coords.x + 'px'
                    layover.scrolling = 'NO';
                    layover.allowTransparency = "true";
                    layover.style.opacity = 0;
                    document.body.appendChild(layover);
                    new fx(layover, {
                        'opacity': {
                            from: 0,
                            to: 1
                        }
                    }, 2, function () {
                        new fx(close, {
                            'opacity': {
                                from: 0,
                                to: 1
                            }
                        }, .5).start();
                    }).start();
                    close.onclick = function () {
                        new fx(close, {
                            'opacity': {
                                from: 1,
                                to: 0
                            }
                        }, 2, function () {
                            close.style.display = 'none';
                        }).start();
                        new fx(layover, {
                            'opacity': {
                                from: 1,
                                to: 0
                            }
                        }, 2, function () {
                            layover.style.display = 'none';
                        }).start();
                    };
                }
                var star = this.star(this.imgs[i], i);
                this.imgs[i].setAttribute('rel', i);
                var thisObj = this;
                this.imgs[i].onmouseover = function (e) {
                    if (this.className.indexOf('pixspreed') == -1 && pixspree_config.img_active !== false) {
                        remote.check(this, this.getAttribute('rel'));
                        thisObj.tracker.save('API Call', this.src);
                    }
                };
                star.onmouseover = function (e) {
                    if (thisObj.imgs[this.getAttribute('rel')].className.indexOf('pixspreed') == -1) {
                        remote.check(thisObj.imgs[this.getAttribute('rel')], this.getAttribute('rel'));
                        thisObj.tracker.save('API Call', thisObj.imgs[this.getAttribute('rel')].src);
                    }
                };
            }
        }
    },
    pre_requisites: function (img) {
        if (img.className.indexOf('no-pixspree') > -1) return false;
        if (typeof (pixspree_config.valid_page) == 'function' && pixspree_config.valid_page() == false) return false;
        return true;
    },
    star: function (img, i) {
        var thisObj = this;
        var coords = this.getXY(img);
        var imgTop = coords.y;
        var imgLeft = coords.x;
        var star = document.createElement('img');
        star.src = pixspree_host + '/assets/images/star-fs8.png';
        star.className = 'pixspree-star';
        star.style.top = parseInt(imgTop + coords.h) - 56 + 'px';
        star.style.left = parseInt(imgLeft + coords.w) - 85 + 'px';
        star.style.display = 'none';
        star.setAttribute('rel', i);
        if (pixspree_config != null) document.body.appendChild(star);
        this.stars.push(star);
        dom.setStyle(star, 'display', 'block');
        setInterval(function () {
            var xcoords = thisObj.getXY(img);
            if (xcoords.y != coords.y || xcoords.x != coords.x) {
                star.style.top = parseInt(xcoords.y + xcoords.h) - 56 + 'px';
                star.style.left = parseInt(xcoords.x + xcoords.w) - 85 + 'px';
                coords = xcoords;
            }
        }, 100);
        return star;
    },
    setup: function (json) {
        var thisObj = this;
        var img = this.imgs[parseInt(json.widget)];
        var star = this.stars[parseInt(json.widget)];
        this.tracker.save('API Response', img.src);
        if (json.show_widget == false) {
            new fx(star, {
                'opacity': {
                    from: 1,
                    to: 0
                }
            }, 1, function () {}).start();
            return;
        }
        var widget = this.make(img, json);
        this.widgets.push(widget);
        if (FB != undefined && FB.XFBML != undefined && FB.XFBML.parse != undefined) FB.XFBML.parse(widget.tag);
        var coords = this.getXY(img);
        var imgTop = coords.y;
        var imgLeft = coords.x;
        setInterval(function () {
            var xcoords = thisObj.getXY(img);
            if (xcoords.y != coords.y || xcoords.x != coords.x) {
                widget.top = xcoords.y;
                widget.panel.style.top = xcoords.y + 'px';
                widget.panel.style.left = xcoords.x + 'px';
                if (closed(widget) || xcoords.y != coords.y) widget.tag.style.top = parseInt(xcoords.y + xcoords.h) + 'px';
                widget.tag.style.left = xcoords.x + 'px';
                coords = xcoords;
            }
        }, 100);
        this.show_tag(false, img, widget);
        var open = function (widget) {
                return (widget.tag.getAttribute('rel') == 'open' && parseInt(dom.getStyle(widget.panel, 'height')) == 125);
            };
        var closed = function (widget) {
                return (widget.tag.getAttribute('rel') == 'closed' && parseInt(dom.getStyle(widget.tag, 'height')) == 1);
            };
        if (pixspree_config.img_active === true) {
            img.onmouseover = function (e) {
                if (closed(widget)) thisObj.show_tag.apply(thisObj, [e, img, widget]);
            };
        }
        img.onmouseout = function (e) {
            if (open(widget)) thisObj.hide_panel.apply(thisObj, [e, img, widget]);
        };
        star.onmouseover = function (e) {
            if (closed(widget)) thisObj.show_tag.apply(thisObj, [e, img, widget]);
        };
        star.onmouseout = function (e) {
            if (open(widget)) thisObj.hide_panel.apply(thisObj, [e, img, widget]);
        };
        widget.tag.onmouseover = function (e) {
            if (closed(widget)) thisObj.show_panel.apply(thisObj, [e, img, widget]);
        };
        widget.tag.onmouseout = function (e) {
            if (open(widget)) thisObj.hide_panel.apply(thisObj, [e, img, widget]);
        };
        widget.panel.onmouseout = function (e) {
            if (open(widget)) thisObj.hide_panel.apply(thisObj, [e, img, widget]);
        };
    },
    show_tag: function (e, img, widget) {
        if (window.attachEvent) var e = window.event;
        var rel = (!e) ? false : e.relatedTarget || e.toElement;
        if (rel && rel.className.indexOf('pixspree') > -1 && rel != img && rel != widget.star) return;
        dom.setStyle(widget.tag, 'display', 'block');
        var thisObj = this;
        new fx(widget.tag, {
            'height': {
                from: 0,
                to: 30
            }
        }, .5, function () {}).start();
        this.show_panel(e, img, widget);
        this.tracker.save('Tag Shown', img.src);
    },
    hide_tag: function (e, img, widget) {
        if (window.attachEvent) var e = window.event;
        var rel = (!e) ? false : e.relatedTarget || e.toElement;
        if (rel && rel.className.indexOf('pixspree') > -1 || rel && rel.className.indexOf('fb_ltr') > -1 || rel && rel == img) return;
        new fx(widget.tag, {
            'height': {
                from: parseInt(widget.tag.style.height),
                to: 1
            }
        }, .4, function () {
            this.style.display = 'none';
            this.setAttribute('rel', 'closed');
        }, widget.tag).start();
        this.tracker.save('Tag Hidden', img.src);
    },
    show_panel: function (e, img, widget) {
        if (window.attachEvent) var e = window.event;
        var rel = (!e) ? false : e.relatedTarget || e.toElement;
        if (rel && rel.className.indexOf('pixspree') > -1 && rel != img && rel != widget.star) return;
        dom.setStyle(widget.panel, 'display', 'block');
        if (widget.iframe && e != false) widget.iframe.src = widget.iframe.src;
        new fx(widget.panel, {
            'height': {
                from: 0,
                to: 125
            }
        }, .5).start();
        if (window.attachEvent) {
            var to = (widget.cpm) ? parseInt(widget.top) + 100 : parseInt(widget.top) + 120;
        } else {
            var to = (widget.cpm) ? parseInt(widget.top) + 105 : parseInt(widget.top) + 125;
        }
        new fx(widget.tag, {
            'top': {
                to: to
            }
        }, .5, function () {
            this.setAttribute('rel', 'open');
        }, widget.tag).start();
        this.tracker.save('Panel Shown', img.src);
    },
    hide_panel: function (e, img, widget) {
        if (window.attachEvent) var e = window.event;
        var rel = (!e) ? false : e.relatedTarget || e.toElement;
        if (rel && rel.className.indexOf('pixspree') > -1 || rel && rel.className.indexOf('fb_ltr') > -1 || rel && rel == img && pixspree_config.img_active == true) return;
        new fx(widget.panel, {
            'height': {
                from: parseInt(widget.panel.style.height),
                to: 1
            }
        }, .5, function () {
            this.style.display = 'none';
        }, widget.panel).start();
        var to = parseInt(widget.top)
        new fx(widget.tag, {
            'top': {
                to: to
            }
        }, .5).start();
        var thisObj = this;
        setTimeout(function () {
            thisObj.hide_tag(rel, img, widget);
        }, 1000, this);
        this.tracker.save('Panel Hidden', img.src);
    },
    scrollRight: function (widget, img, json) {
        if (parseInt(dom.getStyle(widget, 'left')) > 0) return;
        new fx(widget, {
            'left': {
                to: parseInt(dom.getStyle(widget, 'left')) + 100
            }
        }, .5).start();
        this.tracker.save('Panel Scrolled Right', img.src);
    },
    scrollLeft: function (widget, img, json) {
        var diff = parseInt(dom.getStyle(widget.parentNode, 'width')) - parseInt(dom.getStyle(widget, 'width'));
        if (diff > (parseInt(dom.getStyle(widget, 'left')))) return;
        new fx(widget, {
            'left': {
                to: parseInt(dom.getStyle(widget, 'left')) - 100
            }
        }, .5).start();
        this.tracker.save('Panel Scrolled Left', img.src);
    },
    getXY: function (img) {
        var height = (pixspree_config.top != undefined) ? pixspree_config.top : img.height;
        var width = (pixspree_config.left != undefined) ? pixspree_config.left : img.width;
        var borderTop = (isNaN(parseInt(img.style.borderTopWidth))) ? 0 : parseInt(img.style.borderTopWidth);
        var borderBottom = (isNaN(parseInt(img.style.borderBottomWidth))) ? 0 : parseInt(img.style.borderBottomWidth);
        var borderLeft = (isNaN(parseInt(img.style.borderLeftWidth))) ? 0 : parseInt(img.style.borderTopWidth);
        var borderRight = (isNaN(parseInt(img.style.borderRightWidth))) ? 0 : parseInt(img.style.borderRightWidth);
        var paddingTop = (isNaN(parseInt(img.style.paddingTop))) ? 0 : parseInt(img.style.paddingTop);
        var paddingBottom = (isNaN(parseInt(img.style.paddingBottom))) ? 0 : parseInt(img.style.paddingBottom);
        var paddingLeft = (isNaN(parseInt(img.style.paddingLeft))) ? 0 : parseInt(img.style.paddingLeft);
        var paddingRight = (isNaN(parseInt(img.style.paddingRight))) ? 0 : parseInt(img.style.paddingRight);
        var pos_y = parseInt(dom.getPosition(img).y);
        var pos_x = parseInt(dom.getPosition(img).x);
        if (!document.attachEvent) {
            pos_y = pos_y + parseInt(borderTop + paddingTop);
            pos_x = pos_x + parseInt(borderLeft + paddingLeft)
        } else {
            pos_y = pos_y + parseInt(borderTop + paddingTop);
            pos_x = pos_x + parseInt(borderLeft + paddingLeft)
            width = width - parseInt(borderLeft + paddingLeft + paddingRight);
            height = height - parseInt(borderTop + paddingTop + paddingBottom);
        }
        var imgTop = parseInt(pos_y)
        var imgLeft = parseInt(pos_x);
        if (pixspree_config != null) {
            imgTop = imgTop + pixspree_config.y;
            imgLeft = imgLeft + pixspree_config.x;
        }
        return {
            x: imgLeft,
            y: imgTop,
            h: height,
            w: width
        };
    },
    make: function (img, json) {
        var thisObj = this;
        var coords = this.getXY(img);
        var imgTop = coords.y;
        var imgLeft = coords.x;
        var square_zid = (pixspree_config.square_zid) ? pixspree_config.square_zid : 10;
        var banner_zid = (pixspree_config.banner_zid) ? pixspree_config.banner_zid : 12;
        var publisher_id = (pixspree_config.publisher_id) ? pixspree_config.publisher_id : 0;
        var panel = document.createElement('div');
        panel.className = 'pixspree-panel';
        panel.style.width = coords.w + 'px';
        panel.style.top = parseInt(imgTop + coords.h) + 'px';
        panel.style.left = imgLeft + 'px';
        document.body.appendChild(panel);
        var wrap = document.createElement('div');
        wrap.className = 'pixspree-wrap';
        wrap.style.width = coords.w + 'px';
        panel.appendChild(wrap);
        var info = document.createElement('div');
        info.className = 'pixspree-info';
        info.style.width = coords.w + 'px';
        panel.appendChild(info);
        var tag = document.createElement('div');
        tag.className = 'pixspree-tag'
        tag.style.top = parseInt(imgTop + coords.h) + 'px';
        tag.style.left = imgLeft + 'px';
        tag.style.width = coords.w + 'px';
        tag.setAttribute('rel', 'closed');
        tag.innerHTML = "<span class='pixspree-disclaimer'>No endorsment or sponsorship implied by any person.</div>";
        document.body.appendChild(tag);
        if (pixspree_config.like_btn === undefined || pixspree_config.like_btn === true) {
            var like_btn = document.createElement('div');
            like_btn.className = 'pixspree-like-btn';
            like_btn.id = 'pixspree-like-btn';
            like_btn.style.border = "none";
            like_btn.style.overflow = "hidden";
            like_btn.style.width = "75px";
            like_btn.style.height = "21px";
            like_btn.style.position = "absolute";
            like_btn.style.right = "95px";
            like_btn.style.top = "5px";
            like_btn.innerHTML = "<fb:like class='pixspree-like-btn' href='http://facebook.com/pixspree#" + parseInt(json.widget) + "' layout='button_count'></fb:like>";
            like_btn.allowTransparency = "true";
            tag.appendChild(like_btn);
        }
        var products = document.createElement('div');
        products.className = 'pixspree-products';
        products.style.width = coords.w + 'px';
        wrap.appendChild(products);
        var x = 0;
        if (json.persons.length > 0 && document.location.href.indexOf('pixspree-banner-override') == -1) {
            info.innerHTML = "Get the same style as <strong class='pixspree'>" + json.persons[0].name + "</strong>";
            for (var i = 0; i < json.persons.length; i++) {
                for (var j = 0; j < json.persons[i].apparels.length; j++) {
                    var pdata = json.persons[i].apparels[j];
                    var product = document.createElement('a');
                    product.href = pdata.affiliatePageUrl;
                    product.target = '_blank';
                    product.className = 'pixspree-product';
                    product.setAttribute('rel', pdata.name + ' from ' + pdata.affiliateName + ' - <strong class="pixspree-price">Price: $' + pdata.price + '</strong>');
                    products.appendChild(product);
                    product.onmouseover = function () {
                        this.className = 'pixspree-product pixspree-product-active';
                        this.style.borderColor = '#00a8fe';
                        info.innerHTML = this.rel;
                    };
                    product.onmouseout = function () {
                        this.className = 'pixspree-product';
                        this.style.borderColor = '#fff';
                    };
                    var thisObj = this;
                    product.onclick = function (e) {
                        if (!e) var e = window.event;
                        e.cancelBubble = true;
                        if (e.stopPropagation) e.stopPropagation();
                        thisObj.tracker.save('Product clicked', pdata.name);
                    };
                    var pzoom = document.createElement('img');
                    pzoom.src = pixspree_host + '/assets/images/zoom.png';
                    pzoom.className = 'pixspree-product-zoom';
                    product.appendChild(pzoom);
                    var pimg = document.createElement('img');
                    pimg.src = pdata.affiliateImageUrl;
                    pimg.className = 'pixspree-product-image';
                    product.appendChild(pimg);
                    if (i == 0 && j == 1) {
                        var product = document.createElement('div');
                        product.className = 'pixspree-product';
                        products.appendChild(product);
                        var iframe = document.createElement('iframe');
                        iframe.src = 'http://ad4.revfusion.net/servlet/view/banner/html/zone?zid=' + square_zid + '&pid=' + publisher_id;
                        iframe.target = '_blank';
                        iframe.className = 'pixspree-cpm';
                        iframe.frameBorder = 0;
                        iframe.width = 85;
                        iframe.height = 85;
                        iframe.scrolling = 'NO';
                        product.appendChild(iframe);
                        product.onmouseover = function () {
                            this.className = 'pixspree-product pixspree-product-active';
                            this.style.borderColor = '#00a8fe';
                            info.innerHTML = '';
                        };
                        product.onmouseout = function () {
                            this.className = 'pixspree-product';
                            this.style.borderColor = '#fff';
                        };
                        x++;
                    }
                    x++;
                }
            }
        } else {
            var product = document.createElement('div');
            product.className = 'pixspree-banner'
            product.style.width = coords.w + 'px';
            products.appendChild(product);
            var iframe = document.createElement('iframe');
            iframe.src = 'http://ad4.revfusion.net/servlet/view/banner/html/zone?zid=' + banner_zid + '&pid=' + publisher_id;
            iframe.target = '_blank';
            iframe.className = 'pixspree-cpm';
            iframe.frameBorder = 0;
            iframe.height = 85;
            iframe.width = coords.w + 'px';
            iframe.scrolling = 'NO';
            product.appendChild(iframe);
            product.onmouseover = function () {
                this.className = 'pixspree-banner pixspree-product-active';
                this.style.borderColor = '#00a8fe';
                info.innerHTML = '';
            };
            product.onmouseout = function () {
                this.className = 'pixspree-banner';
                this.style.borderColor = '#fff';
            };
            x = 5;
        }
        if ((x * 100) > parseInt(dom.getStyle(wrap, 'width')) && json.persons.length > 0 && document.location.href.indexOf('pixspree-banner-override') == -1) {
            products.style.width = parseInt((x * 100) + 20) + 'px';
            var left = document.createElement('div');
            left.className = 'pixspree-arrow-left';
            panel.insertBefore(left, panel.childNodes[panel.childNodes.length - 1]);
            left.onclick = function (e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                thisObj.scrollRight(products, img, json);
            };
            var right = document.createElement('div');
            right.className = 'pixspree-arrow-right';
            panel.insertBefore(right, panel.childNodes[panel.childNodes.length - 1]);
            right.onclick = function (e) {
                if (!e) var e = window.event;
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                thisObj.scrollLeft(products, img, json);
            };
        }
        return {
            panel: panel,
            tag: tag,
            products: products,
            star: this.stars[parseInt(json.widget)],
            iframe: iframe,
            top: parseInt(imgTop + coords.h),
            cpm: (json.persons.length == 0)
        };
    }
};
var remote = {
    check: function (img, i) {
        img.rel = 'loaded';
        img.className = img.className + ' pixspreed'
        var script = document.createElement('script');
        script.src = pixspree_api + '/?apiKey=' + pixspree_key + '&imageUrl=' + img.src + '&widget=' + i;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};
var dom = {
    get: function (id) {
        return (typeof id == "string") ? document.getElementById(id) : id;
    },
    grab: function (id) {
        return Sizzle(id);
    },
    getPosition: function (el) {
        if (!el) {
            return {
                "x": 0,
                "y": 0
            };
        }
        var xy = {
            "x": el.offsetLeft,
            "y": el.offsetTop
        }
        var par = this.getPosition(el.offsetParent);
        for (var key in par) {
            xy[key] += par[key];
        }
        return xy;
    },
    getStyle: function (el, prop) {
        prop = toCamelCase(prop);
        var view = document.defaultView;
        if (view && view.getComputedStyle) {
            return el.style[prop] || view.getComputedStyle(el, "")[prop] || null;
        } else {
            if (prop == 'opacity') {
                var opacity = el.filters('alpha').opacity;
                return isNaN(opacity) ? 1 : (opacity ? opacity / 100 : 0);
            }
            return el.style[prop] || el.currentStyle[prop] || null;
        }
    },
    setStyle: function (el, prop, value) {
        if (prop == 'opacity') {
            el.style.filter = "alpha(opacity=" + value * 100 + ")";
            el.style.opacity = value;
        } else {
            prop = toCamelCase(prop);
            el.style[prop] = value;
        }
    },
    cleanswf: function () {
        var embeds = document.getElementsByTagName('embed');
        for (i = 0; i < embeds.length; i++) {
            embed = embeds[i];
            var new_embed;
            if (embed.outerHTML) {
                var html = embed.outerHTML;
                if (html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i)) new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'");
                else new_embed = html.replace(/<embed\s/i, "<embed wmode='transparent' ");
                if (html.toLowerCase().indexOf('opaque') == -1 && html.toLowerCase().indexOf('transparent') == -1) {
                    embed.insertAdjacentHTML('beforeBegin', new_embed);
                    embed.parentNode.removeChild(embed);
                }
            } else {
                new_embed = embed.cloneNode(true);
                if (!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase() == 'window') {
                    new_embed.setAttribute('wmode', 'transparent');
                    embed.parentNode.replaceChild(new_embed, embed);
                }
            }
        }
        return;
        var objects = document.getElementsByTagName('object');
        for (i = 0; i < objects.length; i++) {
            object = objects[i];
            var new_object;
            if (object.outerHTML) {
                var html = object.outerHTML;
                if (html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i)) new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />");
                else new_object = html.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>");
                var children = object.childNodes;
                for (j = 0; j < children.length; j++) {
                    if (children[j].getAttribute && children[j].getAttribute('name') != null && children[j].getAttribute('name').match(/flashvars/i)) {
                        new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + children[j].getAttribute('value') + "' />");
                    }
                }
                if (html.toLowerCase().indexOf('wmode') == -1 || (html.toLowerCase().indexOf('wmode') > -1 && html.toLowerCase().indexOf('opaque') == -1 && html.toLowerCase().indexOf('transparent') == -1)) {
                    object.insertAdjacentHTML('beforeBegin', new_object);
                    object.parentNode.removeChild(object);
                }
            }
        }
    }
};
var fx = function (el, attributes, duration, callback, ctx) {
        this.el = dom.get(el);
        this.attributes = attributes;
        this.duration = duration || 0.7;
        this.callback = callback ||
        function () {};
        this.ctx = ctx || window;
        this.frame = {}, this.endAttr = {}, this.startAttr = {};
    };
fx.prototype = {
    start: function () {
        var fx = this;
        this.getAttributes();
        this.duration = this.duration * 1000;
        this.time = new Date().getTime();
        this.animating = true;
        this.timer = setInterval(function () {
            var time = new Date().getTime();
            if (time < (fx.time + fx.duration)) {
                fx.elapsed = time - fx.time;
                fx.setCurrentFrame();
            } else {
                fx.frame = fx.endAttr;
                fx.complete();
            }
            fx.setAttributes();
        }, 1)
    },
    ease: function (start, end) {
        return start + ((1 - Math.cos((this.elapsed / this.duration) * Math.PI)) / 2) * (end - start);
    },
    complete: function () {
        clearInterval(this.timer);
        this.timer = null;
        this.animating = false;
        this.callback.call(this.ctx);
    },
    setCurrentFrame: function () {
        for (attr in this.startAttr) {
            if (this.startAttr[attr] instanceof Array) {
                this.frame[attr] = [];
                for (var i = 0; i < this.startAttr[attr].length; i++) {
                    this.frame[attr][i] = this.ease(this.startAttr[attr][i], this.endAttr[attr][i]);
                }
            } else {
                this.frame[attr] = this.ease(this.startAttr[attr], this.endAttr[attr]);
            }
        }
    },
    getAttributes: function () {
        for (var attr in this.attributes) {
            switch (attr) {
            case 'color':
            case 'background-color':
                this.startAttr[attr] = parseColor(this.attributes[attr].from || dom.getStyle(this.el, attr));
                this.endAttr[attr] = parseColor(this.attributes[attr].to);
                break;
            case 'scrollTop':
            case 'scrollLeft':
                var el = (this.el == document.body) ? (document.documentElement || document.body) : this.el;
                this.startAttr[attr] = this.attributes[attr].from || el[attr];
                this.endAttr[attr] = this.attributes[attr].to;
                break;
            default:
                this.startAttr[attr] = this.attributes[attr].from || (parseFloat(dom.getStyle(this.el, attr)) || 0);
                this.endAttr[attr] = this.attributes[attr].to;
                break;
            }
        }
    },
    setAttributes: function () {
        for (var attr in this.frame) {
            switch (attr) {
            case 'opacity':
                dom.setStyle(this.el, attr, this.frame[attr]);
                break;
            case 'scrollLeft':
            case 'scrollTop':
                var el = (this.el == document.body) ? (document.documentElement || document.body) : this.el;
                el[attr] = this.frame[attr];
                break;
            case 'color':
            case 'background-color':
                var rgb = 'rgb(' + Math.floor(this.frame[attr][0]) + ',' + Math.floor(this.frame[attr][1]) + ',' + Math.floor(this.frame[attr][2]) + ')';
                dom.setStyle(this.el, attr, rgb);
                break;
            default:
                dom.setStyle(this.el, attr, this.frame[attr] + 'px');
                break;
            }
        }
    }
};
var toCamelCase = (function () {
    var cache = {};
    return function (str) {
        if (!cache[str]) {
            return cache[str] = str.replace(/-([a-z])/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        } else {
            return cache[str];
        }
    }
})();
var parseColor = function (str) {
        var rgb = str.match(/^#?(\w{2})(\w{2})(\w{2})$/);
        if (rgb && rgb.length == 4) {
            return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
        }
        rgb = str.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
        if (rgb && rgb.length == 4) {
            return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
        }
        rgb = str.match(/^#?(\w{1})(\w{1})(\w{1})$/);
        if (rgb && rgb.length == 4) {
            return [parseInt(rgb[1] + rgb[1], 16), parseInt(rgb[2] + rgb[2], 16), parseInt(rgb[3] + rgb[3], 16)];
        }
    };
var pixspree = false;
var _timer;
if (/Chrome|WebKit/i.test(navigator.userAgent)) {
    var init = function () {
            if (_timer) clearInterval(_timer);
            setTimeout(function () {
                pixspree = new widget();
            }, 1000)
        };
} else if (document.addEventListener) {
    var init = function () {
            setTimeout(function () {
                pixspree = new widget();
            }, 1000)
        };
} else if (document.attachEvent) {
    var init = function () {
            if (document.readyState === 'complete') {
                setTimeout(function () {
                    pixspree = new widget();
                }, 1000)
            }
        };
} else {
    var init = function () {
            setTimeout(function () {
                pixspree = new widget();
            }, 1000)
        };
}
if (/Chrome|WebKit/i.test(navigator.userAgent)) {
    _timer = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
            clearInterval(_timer);
            init();
        }
    }, 10);
} else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", init, false);
} else if (document.attachEvent) {
    document.attachEvent("onreadystatechange", init);
} else {
    window.onload = init;
}(function () {
    var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
        done = 0,
        toString = Object.prototype.toString,
        hasDuplicate = false,
        baseHasDuplicate = true;
    [0, 0].sort(function () {
        baseHasDuplicate = false;
        return 0;
    });
    var Sizzle = function (selector, context, results, seed) {
            results = results || [];
            context = context || document;
            var origContext = context;
            if (context.nodeType !== 1 && context.nodeType !== 9) {
                return [];
            }
            if (!selector || typeof selector !== "string") {
                return results;
            }
            var parts = [],
                m, set, checkSet, extra, prune = true,
                contextXML = Sizzle.isXML(context),
                soFar = selector,
                ret, cur, pop, i;
            do {
                chunker.exec("");
                m = chunker.exec(soFar);
                if (m) {
                    soFar = m[3];
                    parts.push(m[1]);
                    if (m[2]) {
                        extra = m[3];
                        break;
                    }
                }
            } while (m);
            if (parts.length > 1 && origPOS.exec(selector)) {
                if (parts.length === 2 && Expr.relative[parts[0]]) {
                    set = posProcess(parts[0] + parts[1], context);
                } else {
                    set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
                    while (parts.length) {
                        selector = parts.shift();
                        if (Expr.relative[selector]) {
                            selector += parts.shift();
                        }
                        set = posProcess(selector, set);
                    }
                }
            } else {
                if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
                    ret = Sizzle.find(parts.shift(), context, contextXML);
                    context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
                }
                if (context) {
                    ret = seed ? {
                        expr: parts.pop(),
                        set: makeArray(seed)
                    } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
                    set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
                    if (parts.length > 0) {
                        checkSet = makeArray(set);
                    } else {
                        prune = false;
                    }
                    while (parts.length) {
                        cur = parts.pop();
                        pop = cur;
                        if (!Expr.relative[cur]) {
                            cur = "";
                        } else {
                            pop = parts.pop();
                        }
                        if (pop == null) {
                            pop = context;
                        }
                        Expr.relative[cur](checkSet, pop, contextXML);
                    }
                } else {
                    checkSet = parts = [];
                }
            }
            if (!checkSet) {
                checkSet = set;
            }
            if (!checkSet) {
                Sizzle.error(cur || selector);
            }
            if (toString.call(checkSet) === "[object Array]") {
                if (!prune) {
                    results.push.apply(results, checkSet);
                } else if (context && context.nodeType === 1) {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
                            results.push(set[i]);
                        }
                    }
                } else {
                    for (i = 0; checkSet[i] != null; i++) {
                        if (checkSet[i] && checkSet[i].nodeType === 1) {
                            results.push(set[i]);
                        }
                    }
                }
            } else {
                makeArray(checkSet, results);
            }
            if (extra) {
                Sizzle(extra, origContext, results, seed);
                Sizzle.uniqueSort(results);
            }
            return results;
        };
    Sizzle.uniqueSort = function (results) {
        if (sortOrder) {
            hasDuplicate = baseHasDuplicate;
            results.sort(sortOrder);
            if (hasDuplicate) {
                for (var i = 1; i < results.length; i++) {
                    if (results[i] === results[i - 1]) {
                        results.splice(i--, 1);
                    }
                }
            }
        }
        return results;
    };
    Sizzle.matches = function (expr, set) {
        return Sizzle(expr, null, null, set);
    };
    Sizzle.matchesSelector = function (node, expr) {
        return Sizzle(expr, null, null, [node]).length > 0;
    };
    Sizzle.find = function (expr, context, isXML) {
        var set;
        if (!expr) {
            return [];
        }
        for (var i = 0, l = Expr.order.length; i < l; i++) {
            var type = Expr.order[i],
                match;
            if ((match = Expr.leftMatch[type].exec(expr))) {
                var left = match[1];
                match.splice(1, 1);
                if (left.substr(left.length - 1) !== "\\") {
                    match[1] = (match[1] || "").replace(/\\/g, "");
                    set = Expr.find[type](match, context, isXML);
                    if (set != null) {
                        expr = expr.replace(Expr.match[type], "");
                        break;
                    }
                }
            }
        }
        if (!set) {
            set = context.getElementsByTagName("*");
        }
        return {
            set: set,
            expr: expr
        };
    };
    Sizzle.filter = function (expr, set, inplace, not) {
        var old = expr,
            result = [],
            curLoop = set,
            match, anyFound, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
        while (expr && set.length) {
            for (var type in Expr.filter) {
                if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
                    var filter = Expr.filter[type],
                        found, item, left = match[1];
                    anyFound = false;
                    match.splice(1, 1);
                    if (left.substr(left.length - 1) === "\\") {
                        continue;
                    }
                    if (curLoop === result) {
                        result = [];
                    }
                    if (Expr.preFilter[type]) {
                        match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
                        if (!match) {
                            anyFound = found = true;
                        } else if (match === true) {
                            continue;
                        }
                    }
                    if (match) {
                        for (var i = 0;
                        (item = curLoop[i]) != null; i++) {
                            if (item) {
                                found = filter(item, match, i, curLoop);
                                var pass = not ^ !! found;
                                if (inplace && found != null) {
                                    if (pass) {
                                        anyFound = true;
                                    } else {
                                        curLoop[i] = false;
                                    }
                                } else if (pass) {
                                    result.push(item);
                                    anyFound = true;
                                }
                            }
                        }
                    }
                    if (found !== undefined) {
                        if (!inplace) {
                            curLoop = result;
                        }
                        expr = expr.replace(Expr.match[type], "");
                        if (!anyFound) {
                            return [];
                        }
                        break;
                    }
                }
            }
            if (expr === old) {
                if (anyFound == null) {
                    Sizzle.error(expr);
                } else {
                    break;
                }
            }
            old = expr;
        }
        return curLoop;
    };
    Sizzle.error = function (msg) {
        throw "Syntax error, unrecognized expression: " + msg;
    };
    var Expr = Sizzle.selectors = {
        order: ["ID", "NAME", "TAG"],
        match: {
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
            TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
            CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+\-]*)\))?/,
            POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
            PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
        },
        leftMatch: {},
        attrMap: {
            "class": "className",
            "for": "htmlFor"
        },
        attrHandle: {
            href: function (elem) {
                return elem.getAttribute("href");
            }
        },
        relative: {
            "+": function (checkSet, part) {
                var isPartStr = typeof part === "string",
                    isTag = isPartStr && !/\W/.test(part),
                    isPartStrNotTag = isPartStr && !isTag;
                if (isTag) {
                    part = part.toLowerCase();
                }
                for (var i = 0, l = checkSet.length, elem; i < l; i++) {
                    if ((elem = checkSet[i])) {
                        while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}
                        checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
                    }
                }
                if (isPartStrNotTag) {
                    Sizzle.filter(part, checkSet, true);
                }
            },
            ">": function (checkSet, part) {
                var isPartStr = typeof part === "string",
                    elem, i = 0,
                    l = checkSet.length;
                if (isPartStr && !/\W/.test(part)) {
                    part = part.toLowerCase();
                    for (; i < l; i++) {
                        elem = checkSet[i];
                        if (elem) {
                            var parent = elem.parentNode;
                            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                        }
                    }
                } else {
                    for (; i < l; i++) {
                        elem = checkSet[i];
                        if (elem) {
                            checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
                        }
                    }
                    if (isPartStr) {
                        Sizzle.filter(part, checkSet, true);
                    }
                }
            },
            "": function (checkSet, part, isXML) {
                var doneName = done++,
                    checkFn = dirCheck,
                    nodeCheck;
                if (typeof part === "string" && !/\W/.test(part)) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }
                checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
            },
            "~": function (checkSet, part, isXML) {
                var doneName = done++,
                    checkFn = dirCheck,
                    nodeCheck;
                if (typeof part === "string" && !/\W/.test(part)) {
                    part = part.toLowerCase();
                    nodeCheck = part;
                    checkFn = dirNodeCheck;
                }
                checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
            }
        },
        find: {
            ID: function (match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m && m.parentNode ? [m] : [];
                }
            },
            NAME: function (match, context) {
                if (typeof context.getElementsByName !== "undefined") {
                    var ret = [],
                        results = context.getElementsByName(match[1]);
                    for (var i = 0, l = results.length; i < l; i++) {
                        if (results[i].getAttribute("name") === match[1]) {
                            ret.push(results[i]);
                        }
                    }
                    return ret.length === 0 ? null : ret;
                }
            },
            TAG: function (match, context) {
                return context.getElementsByTagName(match[1]);
            }
        },
        preFilter: {
            CLASS: function (match, curLoop, inplace, result, not, isXML) {
                match = " " + match[1].replace(/\\/g, "") + " ";
                if (isXML) {
                    return match;
                }
                for (var i = 0, elem;
                (elem = curLoop[i]) != null; i++) {
                    if (elem) {
                        if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0)) {
                            if (!inplace) {
                                result.push(elem);
                            }
                        } else if (inplace) {
                            curLoop[i] = false;
                        }
                    }
                }
                return false;
            },
            ID: function (match) {
                return match[1].replace(/\\/g, "");
            },
            TAG: function (match, curLoop) {
                return match[1].toLowerCase();
            },
            CHILD: function (match) {
                if (match[1] === "nth") {
                    var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
                    match[2] = (test[1] + (test[2] || 1)) - 0;
                    match[3] = test[3] - 0;
                }
                match[0] = done++;
                return match;
            },
            ATTR: function (match, curLoop, inplace, result, not, isXML) {
                var name = match[1].replace(/\\/g, "");
                if (!isXML && Expr.attrMap[name]) {
                    match[1] = Expr.attrMap[name];
                }
                if (match[2] === "~=") {
                    match[4] = " " + match[4] + " ";
                }
                return match;
            },
            PSEUDO: function (match, curLoop, inplace, result, not) {
                if (match[1] === "not") {
                    if ((chunker.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
                        match[3] = Sizzle(match[3], null, null, curLoop);
                    } else {
                        var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
                        if (!inplace) {
                            result.push.apply(result, ret);
                        }
                        return false;
                    }
                } else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
                    return true;
                }
                return match;
            },
            POS: function (match) {
                match.unshift(true);
                return match;
            }
        },
        filters: {
            enabled: function (elem) {
                return elem.disabled === false && elem.type !== "hidden";
            },
            disabled: function (elem) {
                return elem.disabled === true;
            },
            checked: function (elem) {
                return elem.checked === true;
            },
            selected: function (elem) {
                elem.parentNode.selectedIndex;
                return elem.selected === true;
            },
            parent: function (elem) {
                return !!elem.firstChild;
            },
            empty: function (elem) {
                return !elem.firstChild;
            },
            has: function (elem, i, match) {
                return !!Sizzle(match[3], elem).length;
            },
            header: function (elem) {
                return (/h\d/i).test(elem.nodeName);
            },
            text: function (elem) {
                return "text" === elem.type;
            },
            radio: function (elem) {
                return "radio" === elem.type;
            },
            checkbox: function (elem) {
                return "checkbox" === elem.type;
            },
            file: function (elem) {
                return "file" === elem.type;
            },
            password: function (elem) {
                return "password" === elem.type;
            },
            submit: function (elem) {
                return "submit" === elem.type;
            },
            image: function (elem) {
                return "image" === elem.type;
            },
            reset: function (elem) {
                return "reset" === elem.type;
            },
            button: function (elem) {
                return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
            },
            input: function (elem) {
                return (/input|select|textarea|button/i).test(elem.nodeName);
            }
        },
        setFilters: {
            first: function (elem, i) {
                return i === 0;
            },
            last: function (elem, i, match, array) {
                return i === array.length - 1;
            },
            even: function (elem, i) {
                return i % 2 === 0;
            },
            odd: function (elem, i) {
                return i % 2 === 1;
            },
            lt: function (elem, i, match) {
                return i < match[3] - 0;
            },
            gt: function (elem, i, match) {
                return i > match[3] - 0;
            },
            nth: function (elem, i, match) {
                return match[3] - 0 === i;
            },
            eq: function (elem, i, match) {
                return match[3] - 0 === i;
            }
        },
        filter: {
            PSEUDO: function (elem, match, i, array) {
                var name = match[1],
                    filter = Expr.filters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                } else if (name === "contains") {
                    return (elem.textContent || elem.innerText || Sizzle.getText([elem]) || "").indexOf(match[3]) >= 0;
                } else if (name === "not") {
                    var not = match[3];
                    for (var j = 0, l = not.length; j < l; j++) {
                        if (not[j] === elem) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    Sizzle.error("Syntax error, unrecognized expression: " + name);
                }
            },
            CHILD: function (elem, match) {
                var type = match[1],
                    node = elem;
                switch (type) {
                case 'only':
                case 'first':
                    while ((node = node.previousSibling)) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    if (type === "first") {
                        return true;
                    }
                    node = elem;
                case 'last':
                    while ((node = node.nextSibling)) {
                        if (node.nodeType === 1) {
                            return false;
                        }
                    }
                    return true;
                case 'nth':
                    var first = match[2],
                        last = match[3];
                    if (first === 1 && last === 0) {
                        return true;
                    }
                    var doneName = match[0],
                        parent = elem.parentNode;
                    if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
                        var count = 0;
                        for (node = parent.firstChild; node; node = node.nextSibling) {
                            if (node.nodeType === 1) {
                                node.nodeIndex = ++count;
                            }
                        }
                        parent.sizcache = doneName;
                    }
                    var diff = elem.nodeIndex - last;
                    if (first === 0) {
                        return diff === 0;
                    } else {
                        return (diff % first === 0 && diff / first >= 0);
                    }
                }
            },
            ID: function (elem, match) {
                return elem.nodeType === 1 && elem.getAttribute("id") === match;
            },
            TAG: function (elem, match) {
                return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
            },
            CLASS: function (elem, match) {
                return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
            },
            ATTR: function (elem, match) {
                var name = match[1],
                    result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name),
                    value = result + "",
                    type = match[2],
                    check = match[4];
                return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
            },
            POS: function (elem, match, i, array) {
                var name = match[2],
                    filter = Expr.setFilters[name];
                if (filter) {
                    return filter(elem, i, match, array);
                }
            }
        }
    };
    var origPOS = Expr.match.POS,
        fescape = function (all, num) {
            return "\\" + (num - 0 + 1);
        };
    for (var type in Expr.match) {
        Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
        Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
    }
    var makeArray = function (array, results) {
            array = Array.prototype.slice.call(array, 0);
            if (results) {
                results.push.apply(results, array);
                return results;
            }
            return array;
        };
    try {
        Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
    } catch (e) {
        makeArray = function (array, results) {
            var ret = results || [],
                i = 0;
            if (toString.call(array) === "[object Array]") {
                Array.prototype.push.apply(ret, array);
            } else {
                if (typeof array.length === "number") {
                    for (var l = array.length; i < l; i++) {
                        ret.push(array[i]);
                    }
                } else {
                    for (; array[i]; i++) {
                        ret.push(array[i]);
                    }
                }
            }
            return ret;
        };
    }
    var sortOrder, siblingCheck;
    if (document.documentElement.compareDocumentPosition) {
        sortOrder = function (a, b) {
            if (a === b) {
                hasDuplicate = true;
                return 0;
            }
            if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
                return a.compareDocumentPosition ? -1 : 1;
            }
            return a.compareDocumentPosition(b) & 4 ? -1 : 1;
        };
    } else {
        sortOrder = function (a, b) {
            var ap = [],
                bp = [],
                aup = a.parentNode,
                bup = b.parentNode,
                cur = aup,
                al, bl;
            if (a === b) {
                hasDuplicate = true;
                return 0;
            } else if (aup === bup) {
                return siblingCheck(a, b);
            } else if (!aup) {
                return -1;
            } else if (!bup) {
                return 1;
            }
            while (cur) {
                ap.unshift(cur);
                cur = cur.parentNode;
            }
            cur = bup;
            while (cur) {
                bp.unshift(cur);
                cur = cur.parentNode;
            }
            al = ap.length;
            bl = bp.length;
            for (var i = 0; i < al && i < bl; i++) {
                if (ap[i] !== bp[i]) {
                    return siblingCheck(ap[i], bp[i]);
                }
            }
            return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
        };
        siblingCheck = function (a, b, ret) {
            if (a === b) {
                return ret;
            }
            var cur = a.nextSibling;
            while (cur) {
                if (cur === b) {
                    return -1;
                }
                cur = cur.nextSibling;
            }
            return 1;
        };
    }
    Sizzle.getText = function (elems) {
        var ret = "",
            elem;
        for (var i = 0; elems[i]; i++) {
            elem = elems[i];
            if (elem.nodeType === 3 || elem.nodeType === 4) {
                ret += elem.nodeValue;
            } else if (elem.nodeType !== 8) {
                ret += Sizzle.getText(elem.childNodes);
            }
        }
        return ret;
    };
    (function () {
        var form = document.createElement("div"),
            id = "script" + (new Date()).getTime();
        form.innerHTML = "<a name='" + id + "'/>";
        var root = document.documentElement;
        root.insertBefore(form, root.firstChild);
        if (document.getElementById(id)) {
            Expr.find.ID = function (match, context, isXML) {
                if (typeof context.getElementById !== "undefined" && !isXML) {
                    var m = context.getElementById(match[1]);
                    return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
                }
            };
            Expr.filter.ID = function (elem, match) {
                var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return elem.nodeType === 1 && node && node.nodeValue === match;
            };
        }
        root.removeChild(form);
        root = form = null;
    })();
    (function () {
        var div = document.createElement("div");
        div.appendChild(document.createComment(""));
        if (div.getElementsByTagName("*").length > 0) {
            Expr.find.TAG = function (match, context) {
                var results = context.getElementsByTagName(match[1]);
                if (match[1] === "*") {
                    var tmp = [];
                    for (var i = 0; results[i]; i++) {
                        if (results[i].nodeType === 1) {
                            tmp.push(results[i]);
                        }
                    }
                    results = tmp;
                }
                return results;
            };
        }
        div.innerHTML = "<a href='#'></a>";
        if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
            Expr.attrHandle.href = function (elem) {
                return elem.getAttribute("href", 2);
            };
        }
        div = null;
    })();
    if (document.querySelectorAll) {
        (function () {
            var oldSizzle = Sizzle,
                div = document.createElement("div");
            div.innerHTML = "<p class='TEST'></p>";
            if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
                return;
            }
            Sizzle = function (query, context, extra, seed) {
                context = context || document;
                if (!seed && !Sizzle.isXML(context)) {
                    if (context.nodeType === 9) {
                        try {
                            return makeArray(context.querySelectorAll(query), extra);
                        } catch (qsaError) {}
                    } else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        var old = context.id,
                            id = context.id = "__sizzle__";
                        try {
                            return makeArray(context.querySelectorAll("#" + id + " " + query), extra);
                        } catch (pseudoError) {} finally {
                            if (old) {
                                context.id = old;
                            } else {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
                return oldSizzle(query, context, extra, seed);
            };
            for (var prop in oldSizzle) {
                Sizzle[prop] = oldSizzle[prop];
            }
            div = null;
        })();
    }(function () {
        var html = document.documentElement,
            matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
            pseudoWorks = false;
        try {
            matches.call(document.documentElement, ":sizzle");
        } catch (pseudoError) {
            pseudoWorks = true;
        }
        if (matches) {
            Sizzle.matchesSelector = function (node, expr) {
                try {
                    if (pseudoWorks || !Expr.match.PSEUDO.test(expr)) {
                        return matches.call(node, expr);
                    }
                } catch (e) {}
                return Sizzle(expr, null, null, [node]).length > 0;
            };
        }
    })();
    (function () {
        var div = document.createElement("div");
        div.innerHTML = "<div class='test e'></div><div class='test'></div>";
        if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
            return;
        }
        div.lastChild.className = "e";
        if (div.getElementsByClassName("e").length === 1) {
            return;
        }
        Expr.order.splice(1, 0, "CLASS");
        Expr.find.CLASS = function (match, context, isXML) {
            if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
                return context.getElementsByClassName(match[1]);
            }
        };
        div = null;
    })();

    function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1 && !isXML) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }
                    if (elem.nodeName.toLowerCase() === cur) {
                        match = elem;
                        break;
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }

    function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
        for (var i = 0, l = checkSet.length; i < l; i++) {
            var elem = checkSet[i];
            if (elem) {
                elem = elem[dir];
                var match = false;
                while (elem) {
                    if (elem.sizcache === doneName) {
                        match = checkSet[elem.sizset];
                        break;
                    }
                    if (elem.nodeType === 1) {
                        if (!isXML) {
                            elem.sizcache = doneName;
                            elem.sizset = i;
                        }
                        if (typeof cur !== "string") {
                            if (elem === cur) {
                                match = true;
                                break;
                            }
                        } else if (Sizzle.filter(cur, [elem]).length > 0) {
                            match = elem;
                            break;
                        }
                    }
                    elem = elem[dir];
                }
                checkSet[i] = match;
            }
        }
    }
    Sizzle.contains = document.documentElement.contains ?
    function (a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
    } : function (a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
    };
    Sizzle.isXML = function (elem) {
        var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    var posProcess = function (selector, context) {
            var tmpSet = [],
                later = "",
                match, root = context.nodeType ? [context] : context;
            while ((match = Expr.match.PSEUDO.exec(selector))) {
                later += match[0];
                selector = selector.replace(Expr.match.PSEUDO, "");
            }
            selector = Expr.relative[selector] ? selector + "*" : selector;
            for (var i = 0, l = root.length; i < l; i++) {
                Sizzle(selector, root[i], tmpSet);
            }
            return Sizzle.filter(later, tmpSet);
        };
    window.Sizzle = Sizzle;
})();