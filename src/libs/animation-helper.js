import {_SERVICES_} from './services';
import {
    _EMIT_EVENT_,
    ANIMATION_TAB_CHANGE,
    PAGE_ENTER,
    PAGE_LOADED,
    POPUP_ENTER,
    POPUP_SMOOTH_SCROLLING,
    SMOOTH_SCROLLING
} from "./emit-event";
import {checkDeviceMobile, getElementAnimateDelay, setElementAnimateOffsetResponsive} from "./helper";

class AnimationHelper {

    animationOb;
    timeOutAnimationIn;
    isVisible;
    isHandleScrolling;

    /**
     *
     * @param el
     * @param elObServer
     * @param options
     * @param animationIn
     * @param inScreen
     * @param outScreen
     * @param isLockHandleScroll
     * @param overrideWinScrolling
     */
    constructor({
                    el,
                    elObServer = null,
                    options,
                    animationIn = null,
                    inScreen = null,
                    outScreen = null,
                    isLockHandleScroll = false,
                    overrideWinScrolling = null
                }) {
        this.isHandleScrolling = false;
        this.animated = false;
        this.animationOb = {
            el,
            elObServer,
            options,
            animationIn,
            outScreen,
            inScreen,
            isLockHandleScroll,
            overrideWinScrolling,
        };

        el.classList.add('is-handler');
        el.classList.add('is-animation-handler');

        this.prop = {top: 0, height: 0};

        this.handleScrolling();
        this.winScrolling = this.winScrolling.bind(this);
        this.pageLoaded = this.pageLoaded.bind(this);
        this.resize = this.resize.bind(this);
        this.bindEvent();

    }

    setOffsetAnimation() {
        const {el, options} = this.animationOb;
        const {offsetResponsive, onscreenOffset} = setElementAnimateOffsetResponsive({
            DOM: el,
            delayScreen: (options && options.delayScreen) || 0
        });
        this.animationOffset = {offsetResponsive, onscreenOffset};
    }

    getDelayAnimation() {
        return this.animationOffset ? getElementAnimateDelay(this.animationOffset) : 0;
    }

    handleScrolling() {

        const {el, elObServer} = this.animationOb;
        this.OBServer = new IntersectionObserver(entries => {

            this.isVisible = entries[0].isIntersecting;
            const {outScreen, inScreen} = this.animationOb;

            if (!this.isVisible) {
                if (outScreen) outScreen();
            } else {
                if (inScreen) inScreen()
            }

        });
        if (elObServer)
            this.OBServer.observe(elObServer);
        else
            this.OBServer.observe(el);
    }

    addObServer() {
        const {el} = this.animationOb;
        this.animated = false;
        this.bindEvent();
        this.handleScrolling();
        el.classList.add('is-handler');
        el.classList.add('is-animation-handler');
    }

    removeHandleScrolling() {
        if (!this.OBServer) return;
        const {el} = this.animationOb;
        this.OBServer.unobserve(el);
        this.OBServer.disconnect();
        this.OBServer = null;
        this.isVisible = false;
        this.removeEvent();
    }

    isInViewPointer() {
        return this.isVisible;
    }

    winScrolling(scroll = {instance: 0}) {

        const {instance} = scroll;
        const {el, animationIn, options, inScreen, overrideWinScrolling} = this.animationOb;

        if (overrideWinScrolling) {
            overrideWinScrolling(instance);
            return;
        }

        if (this.animated || !this.isVisible || this.animationOb.isLockHandleScroll) return;

        // if (this.isVisible) {
        //     inScreen && inScreen();
        // }

        const top = this.prop.top - Math.abs(instance);
        const height = this.prop.height;

        let triggerAnimation = !checkDeviceMobile() ? Math.min(120, _SERVICES_.winSize.height * .2) : 0;

        if (!checkDeviceMobile()) {
            if (height < triggerAnimation) {
                triggerAnimation = (height * 1.2);
            }

            if (_SERVICES_.isPageEnter) {
                triggerAnimation = 40;
            }

            if (_SERVICES_.smoothInstance_ < (_SERVICES_.maxScrollHeight_ - _SERVICES_.winSize.height)) {
                triggerAnimation = 10;
            }
        }

        if (options && options._from && options._from.y && typeof options._from.y === "number") {
            triggerAnimation -= options._from.y;
        }

        const disTop = _SERVICES_.winSize.height - top;
        if (disTop > triggerAnimation) {
            if (_SERVICES_.isPageEnter) {
                this.setOffsetAnimation();
                if (animationIn) {
                    animationIn();
                }
                this.animated = true;
            }
        }
    }

    pageLoaded() {
        const {el} = this.animationOb;
        const {top, height} = el.getBoundingClientRect();
        this.prop = {top: top + Math.abs(_SERVICES_.smoothInstance_), height};
        if (!document.body.contains(el)) {
            this.removeHandleScrolling();
            this.removeEvent();
        }
    }

    resize() {
        const {el} = this.animationOb;
        const {top, height} = el.getBoundingClientRect();
        this.prop = {top: top + Math.abs(_SERVICES_.smoothInstance_), height};
    }

    bindEvent() {
        _EMIT_EVENT_.on(PAGE_LOADED, this.pageLoaded);
        _EMIT_EVENT_.on(POPUP_ENTER, this.winScrolling);
        _EMIT_EVENT_.on(PAGE_ENTER, this.winScrolling);
        _EMIT_EVENT_.on(ANIMATION_TAB_CHANGE, this.winScrolling);
        const {isLockHandleScroll} = this.animationOb;
        window.addEventListener('resize', this.resize);
        if (!isLockHandleScroll) {
            _EMIT_EVENT_.on(SMOOTH_SCROLLING, this.winScrolling);
            _EMIT_EVENT_.on(POPUP_SMOOTH_SCROLLING, this.winScrolling);
        }
    }

    removeEvent() {

        _EMIT_EVENT_.off(PAGE_LOADED, this.pageLoaded);
        _EMIT_EVENT_.off(POPUP_ENTER, this.winScrolling);
        _EMIT_EVENT_.off(PAGE_ENTER, this.winScrolling);
        _EMIT_EVENT_.off(ANIMATION_TAB_CHANGE, this.winScrolling);
        window.removeEventListener('resize', this.resize);

        const {isLockHandleScroll} = this.animationOb;
        if (!isLockHandleScroll) {
            _EMIT_EVENT_.off(SMOOTH_SCROLLING, this.winScrolling);
            _EMIT_EVENT_.off(POPUP_SMOOTH_SCROLLING, this.winScrolling);
        }
    }
}

export default AnimationHelper;