import barba from '@barba/core';
import gsap from "gsap";
import ImageLoaded from 'imagesloaded';
import {
    _EMIT_EVENT_,
    AJAX_CONTENT_LOADED, PAGE_AFTER, PAGE_AJAX_RENDERED,
    PAGE_BEFORE_LEAVE,
    PAGE_ENTER,
    PAGE_LEAVE,
    PAGE_LOADED, REGISTER_LOADER, UN_REGISTER_LOADER,
} from "../../libs/emit-event";
import {FadeTransition} from "./fade-transition";
import {_SERVICES_} from "../../libs/services";
import {_API_TRANSITION_} from "../../../api/api-transition";

export class PageTransition {
    constructor() {
        this.DOM = {
            styleWpBakery: document.querySelector('style[data-type="vc_shortcodes-custom-css"]'),
            menuItems: document.querySelectorAll('.menu-item')
        }
        this.fadeTrasition = new FadeTransition();
        this.isOne = false;
        this.timeout = ms => new Promise(res => setTimeout(res, ms));
        this.template = 'default';
        this.registerLoadCounter_ = 0;
        this.postType = '';

        this._loopCheckLoader = this._loopCheckLoader.bind(this);
        this._registerLoader = this._registerLoader.bind(this);
        this._unRegisterLoader = this._unRegisterLoader.bind(this);
        this._bindEvent();
        this.init();
    }

    get winSize() {
        return {
            height: window.innerHeight,
            width: window.innerWidth
        }
    }

    init() {
        if (!this.DOM.styleWpBakery) {
            this.DOM.styleWpBakery = document.createElement('style');
            this.DOM.styleWpBakery.setAttribute('type', 'text/css');
            this.DOM.styleWpBakery.setAttribute('data-type', 'vc_shortcodes-custom-css');
            document.head.appendChild(this.DOM.styleWpBakery);
        }
        this.barbaInit();
    }

    pageAnimationIn(type = 'default') {
        this.fadeTrasition.animationIn();
    }

    pageAnimationOut(type = 'default') {
        _EMIT_EVENT_.emit(PAGE_LOADED);
        // if (type === 'default') {
        this.fadeTrasition.animationOut(() => {
            _EMIT_EVENT_.emit(PAGE_ENTER)
        });
        //  }

    }

    reloadImages(dom) {
        return new Promise((resolve, reject) => {
            ImageLoaded(dom.querySelectorAll('img'), {'src': true}, resolve);
        });
    }

    checkDataTarget(data) {
        return (data.trigger && typeof data.trigger.tagName !== "undefined");
    }

    _loopCheckLoader() {
        if (this.registerLoadCounter_ <= 0) {
            this.pageAnimationOut(this.postType ? this.postType : 'default');
            gsap.ticker.remove(this._loopCheckLoader);
        }

    }

    barbaInit() {
        const _this = this;
        try {
            barba.init({
                debug: false,
                logLevel: 'error',
                sync: true,
                timeout: 30000,
                // views: [{
                //     namespace: 'default',
                //     beforeLeave(data) {
                //         _this.template = 'default';
                //     }
                // }, {
                //     namespace: 'product',
                //     beforeLeave(data) {
                //         _this.template = 'product';
                //     },
                //     beforeEnter(data) {
                //         _this.template = 'productdsdsds';
                //     }
                // }],
                transitions: [{

                    async beforeLeave(data) {
                        this.registerLoadCounter_ = 0;
                        _API_TRANSITION_._detectNextPage(data.next.url.path);
                        const postType = _this.checkDataTarget(data) ? data.trigger.getAttribute('data-type') : false;
                        _SERVICES_.pageTransition = postType ? postType : 'default';
                        _EMIT_EVENT_.emit(PAGE_BEFORE_LEAVE, data.current.url);
                    },

                    async leave(data) {
                        const postType = _this.checkDataTarget(data) ? data.trigger.getAttribute('data-type') : false;
                        const done = this.async();
                        _this.pageAnimationIn(postType ? postType : 'default');
                        // if (postType === 'product') {
                        //     await _this.timeout(2000);
                        // } else {
                        await _this.timeout(500);
                        // }

                        _EMIT_EVENT_.emit(PAGE_LEAVE);
                        done();

                    },
                    enter: async function (data) {

                        const htmlBody = document.createElement('html');
                        htmlBody.innerHTML = data.next.html.match(/<html[^>]*>(.+?)<\/html>/gs)[0];

                        document.body.classList = htmlBody.querySelector('body').classList;
                        _this.updateWpBackeryStyle(htmlBody);
                        _this.updateMenuItemActive(htmlBody);

                        setTimeout(() => htmlBody.remove(), 3000);
                        _EMIT_EVENT_.emit(PAGE_AJAX_RENDERED);
                    },
                    async once(data) {
                        // _EMIT_EVENT_.emit(PAGE_ONE);
                        // console.log('PAGE_ONE');
                    },
                    async after(data) {
                        _EMIT_EVENT_.emit(PAGE_AFTER);
                        if (typeof ga === 'function') {
                            ga('set', 'page', window.location.pathname);
                            ga('send', 'pageview');
                        }

                        if (typeof gtag === 'function') {
                            gtag('event', 'page_view', {
                                page_location: window.location.href,
                                page_path: window.location.pathname,
                            })
                        }

                        if (typeof window.fbq === 'function') {
                            window.fbq('track', 'PageView')
                        }

                        _EMIT_EVENT_.emit(AJAX_CONTENT_LOADED, {classWrapContent: `[data-barba="container"]`});
                        this.postType = _this.checkDataTarget(data) ? data.trigger.getAttribute('pageTransition-type') : false;
                        _this.reloadImages(data.next.container).then(() => {
                            gsap.ticker.add(_this._loopCheckLoader);
                        });
                    }
                }]
            });
        } catch (e) {
            console.log(e);
        }

    }

    updateMenuItemActive(htmlBody) {
        htmlBody.querySelectorAll('.menu-item').forEach((item, key) => {
            this.DOM.menuItems[key].classList = item.classList;
        });
    }

    updateWpBackeryStyle(htmlBody) {
        let wpBakeryCss = htmlBody.querySelector('style[data-type="vc_shortcodes-custom-css"]');
        if (wpBakeryCss) {
            this.DOM.styleWpBakery.innerHTML = wpBakeryCss.innerHTML;
        }
    }

    _registerLoader() {
        this.registerLoadCounter_ += 1;
    }

    _unRegisterLoader() {
        this.registerLoadCounter_ -= 1;
    }

    _bindEvent() {
        _EMIT_EVENT_.on(REGISTER_LOADER, this._registerLoader);
        _EMIT_EVENT_.on(UN_REGISTER_LOADER, this._unRegisterLoader);
    }
}
