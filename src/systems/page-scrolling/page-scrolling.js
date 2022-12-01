import LocomotiveScroll from './locomotive-scroll';
import {_EMIT_EVENT_,PAGE_ENTER, SMOOTH_SCROLLING} from "../../libs/emit-event";

export class PageScrolling {
    constructor() {
        if (!document.querySelector('[data-scroll-container]')) return;
        this.scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            smoothMobile: false,
            multiplier: 1.4,
            firefoxMultiplier: 30,
            touchMultiplier: 4
        });

        this.bindEvent();
    }

    update() {
        this.scroll && this.scroll.update();
    }

    init() {
        this.scroll && this.scroll.init();
        this.scroll && this.scroll.update();
    }

    reload() {

    }

    scrollTo(id, offset) {
        this.scroll && this.scroll.scrollTo(document.querySelector('' + id), offset, 700, [0.49, 0.01, 0.51, 1.00]);
    }

    destroy() {
        this.scroll && this.scroll.destroy();
    }


    handlePageEnter() {
        this.update();
        this.scroll.on('scroll', (instance) =>
            _EMIT_EVENT_.emit(SMOOTH_SCROLLING, {instance: instance.scroll.y})
        );
    }

    handleScrollTo({sectionID, offset}) {
        this.scrollTo(sectionID, offset);
    }

    bindEvent() {
        //  HTHelper.events.on('pageEnter', this.handlePageEnter.bind(this));
        //   HTHelper.events.on('moveTo', this.handleScrollTo.bind(this));

        _EMIT_EVENT_.on(PAGE_ENTER, this.handlePageEnter.bind(this));
    }
}
