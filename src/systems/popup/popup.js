import gsap from 'gsap';
// import PerfectScrollbar from "perfect-scrollbar";
import {
    _EMIT_EVENT_,
    SMOOTH_DISABLED,
    SMOOTH_ENABLED,
} from "../../libs/emit-event";

class Popup {
    DOM;
    animationConfig;
    options;
    scroller

    constructor(popup, options) {
        this.DOM = {main: popup};
        this.DOM.btnClose = this.DOM.main.querySelector('.js-btn--close');
        this.DOM.rollBack = this.DOM.main.querySelector('.popup--main-rollback');
        this.DOM.popupContent = this.DOM.main.querySelector('.popup--main-body');
        this.DOM.popupBodyContent = this.DOM.main.querySelector('.popup--main-body-content');
        this.options = Object.assign({}, {
            hasRollBack: true
        }, options);

        this.animationConfig = {
            main: {
                ease: 'power3.out',
                duration: .3
            },
            body: {
                ease: 'power3.out',
                duration: .6,
                yFrom: 40
            }
        };
        this.init();
        this.bindEvent();
    }

    init() {
        gsap.set(this.DOM.main, {opacity: 0, pointerEvents: 'none'});
        // this.scroller = new PerfectScrollbar(this.DOM.main);
        //viet lai 1 cai dung right
    }

    show() {

        this.isOpen = true;
        gsap.fromTo(this.DOM.main, {visibility: 'visible', pointerEvents: 'auto'}, {
            opacity: 1,
            ease: this.animationConfig.main.ease,
            duration: this.animationConfig.main.duration
        });
        if (this.DOM.popupBodyContent) {
            gsap.fromTo(this.DOM.popupBodyContent, {y: this.animationConfig.body.yFrom, opacity: 0}, {
                opacity: 1,
                y: 0,
                ease: this.animationConfig.main.ease,
                duration: this.animationConfig.main.duration
            });

            // let bodyPopupRect = this.DOM.popupContent.getBoundingClientRect();
            // if (bodyPopupRect.height < window.innerHeight) {
            //     const disCenter = (window.innerHeight / 2) - (bodyPopupRect.height / 2);
            //     gsap.set(this.DOM.popupContent, {y: disCenter});
            // } else {
            //     gsap.set(this.DOM.popupContent, {y: 0});
            // }
        } else {
            this.DOM.popupContent.style.paddingTop = `${document.querySelector('.js-header').getBoundingClientRect().height}px`;
        }

        _EMIT_EVENT_.emit(STICKY_HEADER);
        setTimeout(() => _EMIT_EVENT_.emit(SMOOTH_DISABLED), 300);
        document.body.classList.add('popup--opening');

    }

    hide() {
        this.isOpen = false;
        gsap.to(this.DOM.main, {
            opacity: 0,
            ease: this.animationConfig.main.ease,
            duration: this.animationConfig.main.duration,
            onComplete: () => {
                this.DOM.main.style.visibility = 'hidden';
                this.DOM.main.style.pointerEvents = 'none';
                this.options.onClose && this.options.onClose();
            },
        });

        // this.app.layout.bodyOverVisible(400);
        // _EMIT_EVENT_.emit(STICKY_HEADER_REMOVE);
        _EMIT_EVENT_.emit(SMOOTH_ENABLED);
        document.body.classList.remove('popup--opening');
    }

    handleResize() {
        if (this.isOpen) {
            let bodyPopupRect = this.DOM.popupContent.getBoundingClientRect();
            if (bodyPopupRect.height < window.innerHeight) {
                const disCenter = (window.innerHeight / 2) - (bodyPopupRect.height / 2);
                gsap.set(this.DOM.popupContent, {y: disCenter});
            } else {
                gsap.set(this.DOM.popupContent, {y: 0});
            }
        }
    }

    update() {
        // this.scroller.update();
    }

    bindEvent() {
        this.DOM.btnClose && this.DOM.btnClose.addEventListener('click', this.hide.bind(this));
        this.options.hasRollBack && this.DOM.rollBack.addEventListener('click', this.hide.bind(this));
        document.addEventListener('htResize', this.handleResize.bind(this));
        this.DOM.main.addEventListener('touchmove', (event) => {
            let bodyPopupRect = this.DOM.popupContent.getBoundingClientRect();
            if (this.isOpen && bodyPopupRect.height < window.innerHeight) {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

}

export default Popup;
