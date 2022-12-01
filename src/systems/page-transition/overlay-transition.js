import gsap from "gsap";

export class OverlayTransition {
    constructor() {
        this.DOM_ = {main: document.querySelector('.js-pageTransition')};
        this.DOM_.pageHeading = this.DOM_.main.querySelector('.js-pageTransition_heading');
    }

    _animationIn() {
        gsap.fromTo(this.DOM_.main, {zIndex: 9, pointerEvents: "auto"}, {
            opacity: 1,
            ease: 'power3.out',
            duration: .6
        });
    }

    _animationOut(onComplete) {
        gsap.to(this.DOM_.main, {
            opacity: 0,
            ease: 'power3.out',
            duration: .6,
            onComplete: () => {
                this.DOM_.main.style = null;
                onComplete();
            }
        });
    }
}