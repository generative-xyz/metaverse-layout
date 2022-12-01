import {gsap} from "gsap";

export class FadeTransition {
    constructor() {
        this.DOM = {main: document.querySelector('.js-page-transition')};
    }

    animationIn() {
        gsap.fromTo(this.DOM.main, {zIndex: 9, pointerEvents: "auto"}, {
            opacity: 1,
            ease: 'power3.out',
            duration: .5
        });
    }

    animationOut(onComplete) {
        gsap.to(this.DOM.main, {
            opacity: 0,
            ease: 'power3.out',
            duration: .5,
            onComplete: () => {
                this.DOM.main.style = null;
                onComplete();
            }
        });
    }
}