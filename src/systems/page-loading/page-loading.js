import gsap from 'gsap';
import {
    _EMIT_EVENT_, AFTER_LOADER_INIT,
    BEFORE_LOADING,
    PAGE_ENTER,
    PAGE_LOADED,
    PAGE_ONE,
    REGISTER_LOADER, UN_REGISTER_LOADER, WIN_PAGE_LOADED
} from "../../libs/emit-event";
import lottie from "lottie-web";

import {MathMap} from "../../libs/math-utils";

class PageLoading {
    constructor() {

        this.DOM_ = {main: document.querySelector('.js-page-loading')};
        this.DOM_.wrap = this.DOM_.main.querySelector('.js-page-loading_container');

        document.body.classList.add('js-ready');
        _EMIT_EVENT_.emit(BEFORE_LOADING);

        this._processingLoading = this._processingLoading.bind(this);
        this._registerLoader = this._registerLoader.bind(this);
        this._unRegisterLoader = this._unRegisterLoader.bind(this);

        this.isReady_ = false;
        this.registerLoader_ = 0;

        this._bindEvent();
    }

    _init() {


        this.windowLoaded = false;
        this.runWidth = 0;

        this.anim = lottie.loadAnimation({
            container: this.DOM_.wrap,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: `${wpData.media}json/loading.json`
        });

        this.anim.addEventListener('DOMLoaded', () => {
            this._handleWinLoad();
            _EMIT_EVENT_.emit(AFTER_LOADER_INIT);
        });

        this.idAnimationLoop = requestAnimationFrame(this._processingLoading);
    }

    _handleWinLoad() {
        this.isReady_ = true;
    }

    _processingLoading() {
        if (this.isReady_) {
            this.runWidth += 1.5;
            const frames = MathMap(Math.min(this.runWidth, 100), 0, 100, 0, this.anim.getDuration(true));
            this.anim.goToAndStop(frames, true);
            if (!this.windowLoaded || !this.isReady_ || this.registerLoader_ > 0) {
                this.runWidth *= .965;
            }
        }

        if (parseInt(this.runWidth) >= 100) {
            if (!this.runAnimation) {
                this.runAnimation = true;
                this._pageLoaded();
            }
            cancelAnimationFrame(this.idAnimationLoop);
            this.idAnimationLoop = null;
        } else if (!(document.readyState === 'complete' && !this.windowLoaded)) {
            this.idAnimationLoop = requestAnimationFrame(this._processingLoading);
        }

    }

    _hideLoading() {
        this.windowLoaded = true;
    }

    _hide() {
        this.DOM_.main.style.visibility = 'hidden';
        this.DOM_.main.style.zIndex = -999;
        this.DOM_.main.style.clipPath = null;
    }

    _pageLoaded() {

        cancelAnimationFrame(this.idAnimationLoop);
        document.body.classList.add('is-loaded');
        _EMIT_EVENT_.emit(WIN_PAGE_LOADED);
        _EMIT_EVENT_.emit(PAGE_LOADED);

        gsap.to([this.DOM_.wrap, this.DOM_.main], {
            opacity: 0, ease: "power3.inOut", duration: .6,
            stagger: .1,
            onComplete: () => {
                _EMIT_EVENT_.emit(PAGE_ENTER);
                _EMIT_EVENT_.emit(PAGE_ONE);
                this._hide();
            }
        });
    }

    _registerLoader() {
        this.registerLoader_++;
    }

    _unRegisterLoader() {
        this.registerLoader_--;
    }

    _bindEvent() {
        _EMIT_EVENT_.on(REGISTER_LOADER, this._registerLoader);
        _EMIT_EVENT_.on(UN_REGISTER_LOADER, this._unRegisterLoader);
        window.addEventListener('load', this._hideLoading.bind(this));
    }
}

export const _PAGE_LOADING_ = new PageLoading();
