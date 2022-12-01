import {gsap} from "gsap";
import {_EMIT_EVENT_,
    CURSOR_EXPAND, PAGE_BEFORE_LEAVE,
    PAGE_ENTER,
} from "../../libs/emit-event";
import {MathLerp} from "../../libs/math-utils";
import {CursorDrag} from "./cursor-drag";

export class Cursor {
    constructor() {
        this.DOM = {main: document.querySelector('.js-cursor')};
        this.DOM.main.classList.add('is-ready');
        this.cursors = {
            drag: new CursorDrag({el: this.DOM.main.querySelector('.js-cursor_drag')}),
        }

        this.isVisible = false;
        this.moving = {};
        this.cursorType = null;
        this.elOnHover = null;
        this.layout();
        this.render = this.render.bind(this);
        this.checkPoints = this.checkPoints.bind(this);
        this.bindEvent();
        this.emitEvent();
    }

    scanElementIsHandler() {
        this.DOM.handlerDrags = document.querySelectorAll('.js-handler-cursor--drag');
    }

    detectLeftButton(evt) {
        evt = evt || window.event;
        if ("buttons" in evt) {
            return evt.buttons === 1;
        }
        const button = evt.which || evt.button;
        return button === 1;
    }

    layout() {

    }

    cursorShow() {
        this.isVisible = true;
    }

    cursorHide() {
        this.isVisible = false;
    }


    handleMouseEnterDrag(handle) {
        this.cursorShow();
        this.cursorType = 'drag';
        this.elOnHover = handle;
        this.cursors.drag.onOver();
    }

    handleMouseLeaveDrag() {
        this.cursorHide();
        this.cursorType = null;
        this.cursors.drag.onLeave();
    }

    getCursorIsValible() {
        return (this.DOM.handlerDrags.length);
    }

    pageEnter() {
        this.scanElementIsHandler();
        if (this.getCursorIsValible()) {
            const {width, height} = this.DOM.main.getBoundingClientRect();
            this.prop = {width, height};
            const disX = window.innerWidth / 2 - this.prop.width / 2;
            const disY = window.innerHeight / 2 - this.prop.height / 2
            this.moving.last = {
                x: disX,
                y: disY
            };
            this.moving.current = {
                x: disX,
                y: disY
            };
            gsap.ticker.add(this.render);
            this.elementBind();
        }

        if (this.cursors.expand) this.cursors.expand.clear();
    }

    handleMouseMove(e) {
        if (this.prop) {

            const disX = e.clientX - this.prop.width / 2;
            const disY = e.clientY - this.prop.height / 2
            this.moving.last = {x: disX, y: disY};
        }
    }

    render() {
        this.moving.current.x = MathLerp(this.moving.current.x, this.moving.last.x, .1);
        this.moving.current.y = MathLerp(this.moving.current.y, this.moving.last.y, .1);
        this.DOM.main.style.transform = `translate3d(${this.moving.current.x}px,${this.moving.current.y}px, 0)`;
    }

    cursorDown(event) {
        if (this.isVisible && this.detectLeftButton(event)) {
            if (this.cursorType === 'drag') {
                this.cursors.drag.onDown();
            }
        }
    }

    cursorUp() {
        if (this.isVisible) {
            if (this.cursorType === 'drag') {
                this.cursors.drag.onUp();
            }
        }
    }

    bindEvent() {
        window.addEventListener('mousedown', this.cursorDown.bind(this));
        window.addEventListener('mouseup', this.cursorUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    elementBind() {


        this.DOM.handlerDrags.forEach(handle => {
            handle.classList.add('cursor-none');
            handle.addEventListener('mouseenter', this.handleMouseEnterDrag.bind(this, handle));
            handle.addEventListener('mouseleave', this.handleMouseLeaveDrag.bind(this));
        });
    }

    pageLeave() {
        gsap.ticker.remove(this.render);
        switch (this.cursorType) {
            case 'drag':
                this.handleMouseLeaveDrag();
                break;
        }
    }

    checkPoints() {
        if (!this.elOnHover) return;
        const elements = document.elementsFromPoint(this.moving.last.x, this.moving.last.y);
        for (let i = 0; i < elements.length; i++) {

            if (elements[i] === this.elOnHover) {
                break;
            } else if (elements[i].localName === 'section') {

                const tmp = this.elOnHover;
                this.elOnHover.style.pointerEvents = 'none';
                this.elOnHover = null;
                setTimeout(() => {
                    tmp.style.pointerEvents = null;
                }, 100);
                switch (this.cursorType) {
                    case 'drag':
                        this.handleMouseLeaveDrag();
                        break;
                }
                break;
            }
        }
    }

    emitEvent() {

        //_EMIT_EVENT_.on(WHEEL_SCROLLING, this.checkPoints);
        _EMIT_EVENT_.on(CURSOR_EXPAND, () => this.cursors.expand.onDown());
        _EMIT_EVENT_.on(PAGE_ENTER, this.pageEnter.bind(this));
        // _EMIT_EVENT_.on(PAGE_LEAVE, this.pageLeave.bind(this));
        _EMIT_EVENT_.on(PAGE_BEFORE_LEAVE, this.pageLeave.bind(this));
    }
}
