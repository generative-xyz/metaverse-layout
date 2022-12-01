import {gsap} from "gsap";

export class CursorDrag {
    constructor({el}) {
        this.DOM = {el};

        this.DOM.arrow = this.DOM.el.querySelector('.js-cursor_drag_arrows');
        this.DOM.text = this.DOM.el.querySelector('.js-cursor_drag_text');

        this.styles = {
            clip: 50,
            clipEl: 0
        }

        this.styleEl = {
            clipEl: 0
        }

        this.isHover = false;
        this.init();
    }

    clipEl(val) {
        this.DOM.el.style.clipPath = `circle(${val}% at 50% 50%)`;
        this.DOM.el.style.webkitClipPath = `circle(${val}% at 50% 50%)`;
    }

    clipArrow(val) {
        this.DOM.arrow.style.clipPath = `circle(${val}% at 50% 50%)`;
        this.DOM.arrow.style.webkitClipPath = `circle(${val}% at 50% 50%)`;
    }

    init() {
        this.clipArrow(50);
        this.clipEl(0);
        gsap.set(this.DOM.text, {scale: .9});
    }

    onOver() {
        this.isHover = true;
        gsap.killTweensOf([this.styleEl]);
        gsap.to(this.styleEl, {
            clipEl: 50, ease: 'power3.out', duration: .8, onUpdate: () => {
                this.clipEl(this.styleEl.clipEl);
            }
        });
    }

    onLeave() {
        this.isHover = false;
        gsap.killTweensOf([this.styleEl]);
        gsap.to(this.styleEl, {
            clipEl: 0, ease: 'power3.out', duration: .8, onUpdate: () => {
                this.clipEl(this.styleEl.clipEl);
            }
        });
        this.onUp();
    }

    onDown() {
        gsap.killTweensOf([this.styles, this.DOM.text]);
        gsap.to(this.styles, {
            clip: 0, ease: 'power3.out', duration: .4, onUpdate: () => {
                this.clipArrow(this.styles.clip);
            }
        });

        gsap.fromTo(this.DOM.text, {opacity: 1}, {scale: 1, ease: 'power3.out', duration: .3});
    }

    onUp() {
        gsap.killTweensOf([this.styles, this.DOM.text]);
        gsap.to(this.styles, {
            clip: 50, ease: 'power3.out', duration: .4, onUpdate: () => {
                this.clipArrow(this.styles.clip);
            }
        });
        gsap.to(this.DOM.text, {
            scale: .9, ease: 'power3.out', duration: .3, onComplete: () => {
                this.DOM.text.style.opacity = '0';
            }
        });
    }
}
