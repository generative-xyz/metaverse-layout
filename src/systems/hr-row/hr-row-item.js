import {
    _EMIT_EVENT_, CUSTOM_HR_ROW_SCROLLING,
    HT_RESIZE,
    OBSERVER_HEIGHT_CHANGED,
    PAGE_ENTER,
    PAGE_LOADED, SMOOTH_SCROLLING
} from "../../libs/emit-event";
import gsap from "gsap";
import {_SERVICES_} from "../../libs/services";
import {MathMap} from "../../libs/math-utils";
import {checkDeviceMobile, isScreenPc} from "../../libs/helper";
import AnimationHelper from "../../libs/animation-helper";

export class HrRowItem {

    constructor({el}) {
        this.DOM_ = {el};

        this.DOM_.hrRow = this.DOM_.el.querySelector('.js-hr-row');
        this.DOM_.fixed = this.DOM_.el.querySelector('.js-hr-scroller_fixed');

        this.prop_ = {};
        this.animHelper_ = new AnimationHelper({
            el: this.DOM_.el,
            isLockHandleScroll: true,
        })

        this._bindEvent();
    }

    _render({instance}) {
        if (!this.animHelper_.isVisible) return;
        const disTop_ = this.prop_.top + instance;

        const y_ = Math.abs(Math.max(Math.min(disTop_, 0), -this.prop_.maxScroll));
        const x_ = MathMap(y_, 0, this.prop_.maxScroll, 0, this.prop_.maxScrollWidth);
        const line_ = MathMap(y_, 0, this.prop_.maxScroll, 0, this.prop_.maxScrollLine);

        this.DOM_.hrRow.style.transform = `translate3d(${-x_}px, 0, 0)`;
        this.DOM_.el.dispatchEvent(new CustomEvent(CUSTOM_HR_ROW_SCROLLING, {detail: {line_}}));
        // if (!checkDeviceMobile()) {
        this.DOM_.fixed.style.transform = `translate3d(0, ${y_}px, 0)`;
        //}
    }

    _pageLoad() {

        const scrollTop_ = Math.abs(_SERVICES_.smoothInstance_);
        const {top} = this.DOM_.el.getBoundingClientRect();
        this.prop_.top = top + scrollTop_;
        this.prop_.maxScroll = (this.DOM_.hrRow.scrollWidth - _SERVICES_.winSize.height);
        this.prop_.maxScrollWidth = this.DOM_.hrRow.scrollWidth - _SERVICES_.winSize.width;
        this.prop_.maxScrollLine = this.DOM_.hrRow.scrollWidth;

        this.isScroll_ = this.DOM_.hrRow.scrollWidth > _SERVICES_.winSize.width;

        if (this.isScroll_) {
            this.DOM_.el.style.height = `${this.DOM_.hrRow.scrollWidth}px`;
        }
    }

    _htResize() {
        this._pageLoad();
        if (!this.isScroll_) {
            this.isScroll_ = false;
            this.DOM_.hrRow.style.transform = null;
            this.DOM_.el.style.height = null;

            // if (!checkDeviceMobile()) {
            this.DOM_.fixed.style.transform = null;
            // }
        }
    }

    _bindEvent() {

        this._pageLoad = this._pageLoad.bind(this);
        this._render = this._render.bind(this);
        this._htResize = this._htResize.bind(this);

        _EMIT_EVENT_.on(SMOOTH_SCROLLING, this._render);
        _EMIT_EVENT_.on(HT_RESIZE, this._htResize);
        _EMIT_EVENT_.on(OBSERVER_HEIGHT_CHANGED, this._htResize);
        _EMIT_EVENT_.on(PAGE_ENTER, this._pageLoad);

        _SERVICES_._addClearEvent(this._clear.bind(this));
    }

    _clear() {

        _EMIT_EVENT_.off(HT_RESIZE, this._htResize);
        _EMIT_EVENT_.off(OBSERVER_HEIGHT_CHANGED, this._htResize);
        _EMIT_EVENT_.off(PAGE_ENTER, this._pageLoad);

        this.animHelper_ && this.animHelper_.removeHandleScrolling();
        // !checkDeviceMobile() && gsap.ticker.remove(this._render);
        gsap.ticker.remove(this._render);
    }
}
