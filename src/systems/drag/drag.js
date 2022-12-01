import {gsap} from "gsap";
import AnimationHelper from "../../libs/animation-helper";
import {checkDeviceMobile, removeWarrEventTouch} from "../../libs/helper";
import {MathLerp} from "../../libs/math-utils";
import {_SERVICES_} from "../../libs/services";

export class Drag {
    /**
     *
     * @param el
     * @param updateDragValue
     * @param animationIn
     * @param updateProp
     * @param onMouseMoving
     * @param onHold
     * @param onUp
     * @param elDrager
     * @param tran
     */
    constructor({
                    el,
                    updateDragValue,
                    animationIn,
                    updateProp,
                    onMouseMoving = null,
                    onHold = null,
                    onUp = null,
                    elDrager = null,
                    tran = null
                }) {

        this.DOM_ = {el, elDrager};
        this.isRendered_ = false;
        this.readyDrag_ = false;
        this.isMouseDown = false;
        this.maxAnimation = {value: 0};
        this.updateDragValue = updateDragValue;
        this.updateProp = updateProp;
        this.callBackMouseDown = onHold;
        this.callBackMouseup = onUp;
        this.onRealMouseMoving = onMouseMoving;

        this.DOM_.dragged = elDrager || el;
        this.DOM_.dragged.classList.add('is-drag-handler');

        tran && tran.classList.add('is-trans');

        this.style = {
            tran: 0,
            ease: .1,
            transition: {
                current: 0,
                last: 0,
                maxDrag: 0,
            },
            locker: {
                isLocked: false,
                isStopMoving: false,
                start: {
                    x: 0,
                    y: 0
                },
                move: {
                    x: 0,
                    y: 0
                }
            }
        };

        this.timeOutHold = null;

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.renderDrag = this.renderDrag.bind(this);
        this._inScreen = this._inScreen.bind(this);
        this._outScreen = this._outScreen.bind(this);


        this.readyDrag_ = !animationIn;

        this.animHelper_ = new AnimationHelper({
            el: this.DOM_.dragged,
            animationIn: animationIn || (() => {
                this.readyDrag_ = true
            }),
            inScreen: this._inScreen,
            outScreen: this._outScreen,
            isLockHandleScroll: checkDeviceMobile()
        });


        this._dragEvent();
    }

    _inScreen() {
        if (!this.isRendered_) {
            this.isRendered_ = true;
            gsap.ticker.add(this.renderDrag);
            if (checkDeviceMobile()) this.readyDrag_ = true;
        }

    }

    _outScreen() {
        if (this.isRendered_) {
            this.isRendered_ = false;
            gsap.ticker.remove(this.renderDrag);
        }
    }

    renderDrag() {
        if (this.readyDrag_) {
            this.style.transition.current = MathLerp(this.style.transition.current, this.style.transition.last, this.style.ease);
            this.updateDragValue(this.style.transition.current, Math.abs(this.style.transition.last - this.style.transition.current));
            // this.DOM_.container.style.transform = `translate3d(${this.style.transition.current}px, 0, 0)`;
        }
    }

    checkOverDrag() {
        return (this.style.transition.maxDrag > 2 || (this.style.transition.maxDrag === -1))
    }

    mouseDown(event) {
        if (!this.readyDrag_ || !this.checkOverDrag()) return;

        this.timeOutHold && clearTimeout(this.timeOutHold);
        this.timeOutHold = setTimeout(() => {
            this.updateProp();
            this.style.locker.isStopMoving = false;
            this.style.locker.isLocked = false;

            if (event.changedTouches) {
                this.style.tran = event.changedTouches[0].pageX;
                this.style.locker.start.x = event.changedTouches[0].pageX;
                this.style.locker.start.y = event.changedTouches[0].pageY;
            } else {
                this.style.tran = event.clientX;
                this.style.locker.start.x = event.clientX;
                this.style.locker.start.y = event.clientY;
            }

            this.isMouseDown = true;
            this.callBackMouseDown && this.callBackMouseDown();
        }, 100);
    }

    mouseUp(event) {

        if (this.timeOutHold) {
            clearTimeout(this.timeOutHold);
            this.timeOutHold = null;
        }

        this.DOM_.dragged.children[0].style.pointerEvents = null;
        if (!this.isMouseDown) return;
        this.style.locker.isLocked = false;
        this.style.locker.isStopMoving = false;
        this.isMouseDown = false;
        if (this.style.transition.maxDrag !== -1) {
            this.style.transition.last = Math.min(Math.max(this.style.transition.last, -this.style.transition.maxDrag), 0);
        }

        this.callBackMouseup && this.callBackMouseup();
    }

    mouseMove(event) {

        if (!this.isMouseDown) return;
        this.DOM_.dragged.children[0].style.pointerEvents = "none";
        if (event.changedTouches) {
            this.style.locker.move.x = event.changedTouches[0].pageX;
            this.style.locker.move.y = event.changedTouches[0].pageY;
        } else {
            this.style.locker.move.x = event.clientX;
            this.style.locker.move.y = event.clientY;
        }
        let disLockerX = this.style.locker.move.x - this.style.locker.start.x;
        let disLockerY = this.style.locker.move.y - this.style.locker.start.y;

        if (!checkDeviceMobile() || ((Math.abs(disLockerX) >= Math.abs(disLockerY) || this.style.locker.isLocked) && !this.style.locker.isStopMoving)) {
            this.style.locker.isLocked = true;
            if (event.cancelable) event.preventDefault();
            if (event && checkDeviceMobile()) {
                event.stopPropagation();
            }

            if (this.isMouseDown) {
                let moveX = event.clientX;
                if (event.changedTouches) {
                    moveX = event.changedTouches[0].pageX
                }

                const disMove = moveX - this.style.tran;
                this.style.transition.last += (disMove * (checkDeviceMobile() ? 2 : 1.5));

                if (this.style.transition.maxDrag !== -1) {
                    this.style.transition.last = Math.min(Math.max(this.style.transition.last, -this.style.transition.maxDrag - this.style.bonus), this.style.bonus);
                }

                this.onRealMouseMoving && this.onRealMouseMoving(this.style.transition.last);
                this.style.tran = moveX;
            }
        } else {
            this.style.locker.isStopMoving = true;
        }
    }

    _setLastVal(last) {
        this.style.transition.last = Math.min(Math.max(last, -this.style.transition.maxDrag), 0);
    }

    _dragEvent() {

        if (checkDeviceMobile()) {
            this.DOM_.dragged.addEventListener('touchstart', this.mouseDown, removeWarrEventTouch ? {passive: true} : false);
            this.DOM_.dragged.addEventListener('touchend', this.mouseUp, removeWarrEventTouch ? {passive: true} : false);
            this.DOM_.dragged.addEventListener('touchmove', this.mouseMove, removeWarrEventTouch ? {passive: true} : false);
        } else {

            this.DOM_.dragged.addEventListener('mousedown', this.mouseDown, false);
            this.DOM_.dragged.addEventListener('mouseup', this.mouseUp, false);
            this.DOM_.dragged.addEventListener('mouseleave', this.mouseUp, false);
            this.DOM_.dragged.addEventListener('mousemove', this.mouseMove, false);
            window.addEventListener('mouseup', this.mouseUp, false);
        }
    }

    removeEvent() {
        this._outScreen();
        if (!checkDeviceMobile()) {
            window.removeEventListener('mouseup', this.mouseUp, false);
        }
        if (this.animHelper_) this.animHelper_.removeHandleScrolling();
    }
}
