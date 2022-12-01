import {getScrollTop} from "Libs/helper";
import {gsap} from 'gsap';
import {MathLerp} from "../../libs/math-utils";
import {_EMIT_EVENT_,SMOOTH_DISABLED, SMOOTH_ENABLED, SMOOTH_SCROLLING} from '../../libs/emit-event';

class SmoothScrollNative {
    DOM;
    scrollTopLast;
    scrollTopCurrent;
    scrollEase;
    isResizeObserver;
    isLoop = false;
    isStop = false;

    constructor() {
        this.DOM = {main: document.querySelector('[data-scroll-container]')};
        this.scrollTopLast = 0;
        this.scrollTopCurrent = 0;
        this.scrollEase = .1;
        this.isResizeObserver = !!window.ResizeObserver;

        this.loop = this.loop.bind(this);
        this.handleScrolling = this.handleScrolling.bind(this);

        this.bindEvent();
    }

    handleScrolling(event) {

        if (this.isStop) {
            event.preventDefault();
            event.stopPropagation();
            window.scrollTo(0, 0);
            return false;
        }
        this.scrollTopLast = -getScrollTop();
        if (!this.isResizeObserver) this.updateScrollHeight();
        if (!this.isLoop) {
            this.isLoop = true;
            gsap.ticker.add(this.loop);
        }
    }

    loop() {
        this.scrollTopCurrent = MathLerp(this.scrollTopCurrent, this.scrollTopLast, this.scrollEase).toFixed(1);
        if (Math.abs(this.scrollTopLast - this.scrollTopCurrent) > 0.1) {
            this.DOM.main.style.transform = `matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, ${this.scrollTopCurrent}, 0, 1)`;
            _EMIT_EVENT_.emit(SMOOTH_SCROLLING, {instance: this.scrollTopCurrent});
        }
    }

    updateScrollHeight() {
        const {height} = this.DOM.main.getBoundingClientRect();
        document.body.style.height = `${height}px`;
    }

    bindEvent() {
        window.addEventListener('scroll', this.handleScrolling);
        _EMIT_EVENT_.on(SMOOTH_DISABLED, () => this.isStop = true);
        _EMIT_EVENT_.on(SMOOTH_ENABLED, () => this.isStop = false);
        if (this.isResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                this.updateScrollHeight();
            });
            resizeObserver.observe(this.DOM.main);
        }
    }
}

export default SmoothScrollNative;
