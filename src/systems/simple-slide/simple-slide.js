import gsap from 'gsap';
import {_EMIT_EVENT_, PAGE_ENTER} from "../../libs/emit-event";
import {_SERVICES_} from "../../libs/services";
import AnimationHelper from "../../libs/animation-helper";
import {Drag} from "../drag/drag";

export class SimpleSlide {
    /**
     *
     * @param container
     * @param el
     * @param btnNext
     * @param btnPrev
     * @returns {boolean}
     */
    constructor({el, elSlide, btnNext, btnPrev, elItem}) {

        this.DOM_ = {el, elSlide, elItem};
        this.DOM_.btns = {
            next: btnNext,
            prev: btnPrev
        };

        this.layout_ = {};
        this.props_ = {currentSlide: 0};

        this._onDragRender = this._onDragRender.bind(this);
        this.drag_ = new Drag({
            el: this.DOM_.el,
            tran: this.DOM_.elSlide,
            updateDragValue: this._onDragRender,
            updateProp: this._layout.bind(this)
        });

        this._bindEvent();
    }

    _onDragRender(x) {
        this.DOM_.elSlide.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    _layout() {

        const rectContainer = this.DOM_.el.getBoundingClientRect();
        this.drag_.style.transition.maxDrag = this.DOM_.elSlide.scrollWidth - rectContainer.width;
        this.drag_.style.bonus = (_SERVICES_.winSize.width * .3);
    }

    _nextSlide() {
        const {width} = this.DOM_.elItem.getBoundingClientRect();
        const dragLast_ = this.drag_.style.transition.last - (width + 2);
        this.drag_._setLastVal(dragLast_);
    }

    _prevSlide() {
        alert('dis con me');
        const {width} = this.DOM_.elItem.getBoundingClientRect();
        const dragLast_ = this.drag_.style.transition.last + (width + 2);
        this.drag_._setLastVal(dragLast_);
    }

    _pageEnter() {
        this._layout();
    }

    _bindEvent() {

        this._pageEnter = this._pageEnter.bind(this);

        this.DOM_.btns.next.addEventListener('click', this._nextSlide.bind(this));
        this.DOM_.btns.prev.addEventListener('click', this._prevSlide.bind(this));

        _EMIT_EVENT_.on(PAGE_ENTER, this._pageEnter);
        _SERVICES_._addClearEvent(this._clear.bind(this));
    }

    _clear() {
        _EMIT_EVENT_.off(PAGE_ENTER, this._pageEnter);
    }

}

export default SimpleSlide;
