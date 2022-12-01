import {gsap} from "gsap";
import {checkDeviceMobile, getHasTag, isHasTag} from "../../libs/helper";
import {
    _EMIT_EVENT_,
    HT_RESIZE,
    HT_RESIZE_HEIGHT,
    HT_RESIZE_WIDTH,
    BEFORE_HT_RESIZE, PAGE_LOADED, PAGE_LEAVE, MOVE_TO, PAGE_ENTER
} from "../../libs/emit-event";
import {_SERVICES_} from "../../libs/services";

export class HtLayout {

    constructor() {
        this.idSetTimeoutWindowResize = null;
        this.onShowTimeout = false;
        this.callBeforeResize = false;
        this.init();
        this.timeoutWindowResize = this.timeoutWindowResize.bind(this);
        this.init = this.init.bind(this);
        this.getWin();
        this.bindingEvents();
    }

    init() {

        this.fix100VhOnPhone();
        this.contentFixed = [];
        this.contentFixed.push(document.querySelector('.header--site'));
        this.contentFixed.push(document.querySelector('#screen--content'));

        document.body.insertAdjacentHTML('beforeend', '<div id="layout-resize"></div>');
        this.layoutReize = document.querySelector('#layout-resize');

        this.bodyClass();
        this.getWin();
    }

    bodyClass() {
        if (checkDeviceMobile()) {
            document.body.classList.add('site__template-mobile');
            document.documentElement.classList.add('is-mobile');

        } else {
            document.body.classList.remove('site__template-mobile');
            document.documentElement.classList.remove('is-mobile');
        }

        document.querySelectorAll('a[href^="#"]:not(.has-tag-handle), a[href^="/#"]:not(.has-tag-handle)').forEach(anchor => {
            const href = getHasTag(anchor.getAttribute('href'));

            if (isHasTag(href) && document.querySelector(href)) {
                anchor.classList.add('has-tag-handle');
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    this._handleLocationHasTag(href);
                    window.history.pushState({}, '', href);
                });
            }
        });
    }

    fix100VhOnPhone() {
        const vh = window.innerHeight * .01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    getWin() {
        this.winSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    calcWin() {
        this.calcWinSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    timeoutWindowResize() {

        this.onShowTimeout = false;
        this.bodyClass();

        if (this.winSize.width !== this.calcWinSize.width) {
            this.winSize.width = this.calcWinSize.width;
            //HTHelper.events.emit('htResizeWidth');
            _EMIT_EVENT_.emit(HT_RESIZE_WIDTH);
        }
        if (this.winSize.height !== this.calcWinSize.height) {
            this.winSize.height = this.calcWinSize.height;
            //HTHelper.events.emit('htResizeHeight');
            _EMIT_EVENT_.emit(HT_RESIZE_HEIGHT);
        }

        //HTHelper.events.emit('htResize');

        _EMIT_EVENT_.emit(HT_RESIZE);
        this.callBeforeResize = false;

        gsap.to(this.layoutReize, {
            duration: .5,
            opacity: 0, ease: 'power3.out', onComplete: () => {
                this.layoutReize.style.zIndex = -1;
            }
        });
    }

    _handleLocationHasTag(hasTag) {

        const section = document.querySelector(hasTag);
        if (section) {
            const header = document.querySelector('.js-header_container');
            const scrollTop = Math.abs(_SERVICES_.smoothInstance_) + section.getBoundingClientRect().top - (header.getBoundingClientRect().height * 1.5);


            // smoothcroll has on mobile
           // if (!checkDeviceMobile()) {
                _EMIT_EVENT_.emit(MOVE_TO, {scrollTop: -scrollTop});
            // } else {
            //     gsap.to(window, {
            //         scrollTo: {y: section, offsetY: 0},
            //         duration: .7,
            //         ease: 'power3.inOut'
            //     });
            // }

        }
    }

    _pageEnter() {
        setTimeout(() => {
            const hash = window.location.hash;
            if (isHasTag(hash)) this._handleLocationHasTag(hash);
        }, 80);
    }


    bindingEvents() {
        let _this = this;

        window.addEventListener('load', () => {
            window.scrollTo(0, 0);
        });

        window.addEventListener('resize', function () {
            _this.calcWin();
            _this.fix100VhOnPhone();

            if (
                !checkDeviceMobile() ||
                (checkDeviceMobile() && _this.winSize.width !== _this.calcWinSize.width)
            ) {
                _this.winSize.width = _this.calcWinSize.width;
                if (!_this.onShowTimeout) {
                    _this.onShowTimeout = true;
                    _this.layoutReize.style.zIndex = 9999;
                    gsap.set(_this.layoutReize, {opacity: 1});
                }

                if (!_this.callBeforeResize) {
                    _this.callBeforeResize = true;
                    _EMIT_EVENT_.emit(BEFORE_HT_RESIZE);
                }

                _this.idSetTimeoutWindowResize && clearTimeout(_this.idSetTimeoutWindowResize);
                _this.idSetTimeoutWindowResize = setTimeout(_this.timeoutWindowResize, 250);
            }
        });

        _EMIT_EVENT_.on(PAGE_LOADED, this.bodyClass.bind(this));
        _EMIT_EVENT_.on(PAGE_ENTER, this._pageEnter.bind(this));

        _EMIT_EVENT_.on(PAGE_LEAVE, () => {
            if (checkDeviceMobile()) {
                window.scrollTo({left: 0, top: 0});
            }
        });
    }

    bodyOverHidden() {
        document.body.style.overflow = 'hidden';
        document.dispatchEvent(new CustomEvent('popup_opening'));
    }

    bodyOverVisible(timeout) {
        document.body.style.overflow = null;
        document.dispatchEvent(new CustomEvent('popup_closing'));
    }
}
