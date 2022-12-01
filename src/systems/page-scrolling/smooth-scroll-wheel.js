import {MathLerp} from "../../libs/math-utils";
import VirtualScroll from 'virtual-scroll'
import {gsap} from "gsap";
import {
    _EMIT_EVENT_,
    BACK_TOP, GO_TO_SECTION, HEADER_LISTEN_COLOR,
    HT_RESIZE, MOVE_TO, NEXT_SCREEN,
    OBSERVER_HEIGHT_CHANGED, PAGE_BEFORE_LEAVE, PAGE_ENTER, PAGE_LEAVE, RESET_SCROLL, SKIP_TO,
    SMOOTH_DISABLED,
    SMOOTH_ENABLED,
    SMOOTH_SCROLLING, SMOOTH_SCROLLING_STOP, WHEEL_SCROLLING, WHEEL_SCROLLING_LOCK
} from "../../libs/emit-event";
import {_SERVICES_} from '../../libs/services';
import {checkDeviceMobile, isHasTag, isScreenPc, removeWarrEventTouch} from "../../libs/helper";

export class SmoothScrollWheel {

    constructor() {
        this.DOM = {main: document.querySelector('[data-scroll-container]')};
        this.scrollTopLast = 0;
        this.scrollTopCurrent = 0;
        this.scrollEase = checkDeviceMobile() ? .08 : .1;
        this.idRequestAnimation = null;
        this.scrollSpeed = checkDeviceMobile() ? 2.5 : 1;
        this.scrollDelta_ = 0;
        this.scrollFixTouch_ = 0;
        this.scrollTopLastOld = 0;

        this.isStop = true;
        this.isPause = false;
        this.isLockWheel = false;
        this.fakeScroller = {value: 0};
        this.loop = this.loop.bind(this);

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);

        this.virtualScroll = this.virtualScroll.bind(this);
        this.updateScrollHeight();
        this.bindEvent();
        this.emitEvent();
    }

    _mainRender(y) {
        this.DOM.main.style.transform = ` matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${y}, 0, 1)`;
    }

    loop() {
        if (this.isStop) return;
        this.scrollTopCurrent = MathLerp(this.scrollTopCurrent, this.scrollTopLast, this.scrollEase);
        if (Math.abs(this.scrollTopLast - this.scrollTopCurrent) > 0.1) {

            _SERVICES_.handleScrolling({instance: this.scrollTopCurrent});
            _EMIT_EVENT_.emit(SMOOTH_SCROLLING, {instance: this.scrollTopCurrent});
            this._mainRender(this.scrollTopCurrent);
            this.isPause = false;

        } else {

            _SERVICES_.handleScrolling({instance: this.scrollTopCurrent});
            _EMIT_EVENT_.emit(SMOOTH_SCROLLING_STOP, {instance: this.scrollTopCurrent});
            this._mainRender(Math.round(this.scrollTopCurrent));

            this.isPause = true;
        }

        this.scrollDelta_ *= (.95 - this.scrollFixTouch_);
        this.scrollFixTouch_ *= .85;
    }

    moveTop() {
        this._mainRender(this.scrollTopCurrent);
    }

    virtualScroll(event) {
        if (this.isStop || this.isLockWheel) return;
        gsap.killTweensOf(this.fakeScroller);

        if ((this.scrollDelta_ * event.deltaY) < 0) this.scrollDelta_ = 0;
        this.scrollDelta_ += event.deltaY / 4;

        this.scrollFixTouch_ += .01;
        this.scrollTopLast += (this.scrollDelta_ * this.scrollSpeed);

        this.scrollTopLast = Math.min(Math.max(this.scrollTopLast, -this.scrollHeight), 0);
        _EMIT_EVENT_.emit(WHEEL_SCROLLING, {instance: this.scrollTopLast});
        if (!_SERVICES_.isResizeObserver) this.updateScrollHeight();
        _EMIT_EVENT_.emit(HEADER_LISTEN_COLOR);
    }

    updateScrollHeight() {

        this.scrollHeight = (this.DOM.main.scrollHeight - _SERVICES_.winSize.height);
        _SERVICES_.maxScrollHeight_ = this.scrollHeight;

        if (_SERVICES_.isPageEnter && this.isPause) {
            this.scrollTopLast = Math.min(Math.max(this.scrollTopLast, -this.scrollHeight), 0);
            this.scrollTopCurrent = this.scrollTopLast;
        }

        if (Math.abs(this.scrollTopCurrent) > 0) {
            _EMIT_EVENT_.emit(SMOOTH_SCROLLING, {instance: this.scrollTopCurrent});
        }
    }

    scrollToLock({top}) {
        this.isStop = true;
        this.scrollTopLast -= top;
    }

    backTop() {
        const fake = {value: this.scrollTopLast};
        gsap.to(fake, {
            value: 0, ease: 'power3.inOut', duration: .8, onUpdate: () => {
                this.scrollTopLast = fake.value;
            }
        });
    }

    _moveTo({scrollTop}) {
        setTimeout(() => {
            this.fakeScroller.value = this.scrollTopCurrent;
            gsap.to(this.fakeScroller, {
                value: Math.min(Math.max(-Math.abs(scrollTop), -this.scrollHeight), 0),
                ease: 'power3.inOut',
                duration: .5,
                onUpdate: () => {
                    this.scrollTopLast = this.fakeScroller.value;
                }
            });
        }, 30);
    }

    _skipTo({scrollTop}) {
        this.isStop = false;
        this.scrollTopLast = this.scrollTopCurrent = scrollTop;
        this.updateScrollHeight();
        this.loop();
    }

    _resetScroll() {
        window.scrollTo(0, 0);
        this.scrollTopLast = this.scrollTopCurrent = 0;
        this.loop();
    }

    _pageEnter() {
        window.scrollTo(0, 0);
        setTimeout(() => {
            gsap.ticker.add(this.loop);
            this.scroller && this.scroller.on(this.virtualScroll);
            this.isStop = false;
            this.isLockWheel = false;
        }, 15);
    }


    mouseDown(event){
        this.scrollTopLastOld = event.changedTouches[0].pageY;
    }
    mouseMove(event) {

        if (this.isStop || this.isLockWheel) return;
        this.scrollTopLast += (event.changedTouches[0].pageY - this.scrollTopLastOld) * this.scrollSpeed;
        this.scrollTopLast = Math.min(Math.max(this.scrollTopLast, -this.scrollHeight), 0);

        this.scrollTopLastOld = event.changedTouches[0].pageY;

        _EMIT_EVENT_.emit(WHEEL_SCROLLING, {instance: this.scrollTopLast});
        if (!_SERVICES_.isResizeObserver) this.updateScrollHeight();
        _EMIT_EVENT_.emit(HEADER_LISTEN_COLOR);
    }

    bindEvent() {

        if (checkDeviceMobile()) {
            document.body.addEventListener('touchstart', this.mouseDown, removeWarrEventTouch ? {passive: true} : false);
            document.body.addEventListener('touchmove', this.mouseMove, removeWarrEventTouch ? {passive: true} : false);
        } else {
            this.scroller = new VirtualScroll({
                el: document.body,
                mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.15,
                firefoxMultiplier: 30,
                touchMultiplier: 1,
                passive: true,
            });
        }
    }

    emitEvent() {

        _EMIT_EVENT_.on(HT_RESIZE, this.updateScrollHeight.bind(this));
        _EMIT_EVENT_.on(WHEEL_SCROLLING_LOCK, this.scrollToLock.bind(this));
        _EMIT_EVENT_.on(SMOOTH_DISABLED, () => this.isStop = true);
        _EMIT_EVENT_.on(SMOOTH_ENABLED, () => this.isStop = false);
        _EMIT_EVENT_.on(OBSERVER_HEIGHT_CHANGED, () => {
            this.updateScrollHeight();
        });
        _EMIT_EVENT_.on(PAGE_BEFORE_LEAVE, () => {
            this.isLockWheel = true;
            this.scroller && this.scroller.off(this.virtualScroll);
        })

        _EMIT_EVENT_.on(PAGE_LEAVE, () => {
            this.scrollDelta_ = 0;
            this.scrollTopLast = this.scrollTopCurrent = 0;
            setTimeout(() => {
                gsap.ticker.remove(this.loop);
                this.isStop = true;
            }, 10);
        });

        _EMIT_EVENT_.on(PAGE_ENTER, this._pageEnter.bind(this));
        _EMIT_EVENT_.on(MOVE_TO, this._moveTo.bind(this));
        _EMIT_EVENT_.on(SKIP_TO, this._skipTo.bind(this));
        _EMIT_EVENT_.on(RESET_SCROLL, this._resetScroll.bind(this));
        _EMIT_EVENT_.on(BACK_TOP, this.backTop.bind(this));
    }
}
