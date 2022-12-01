import {gsap} from "gsap";
import {MathLerp} from "../../libs/math-utils";
import {ActionClick} from "../../animation/action-click/action-click";

export class BtnPlay {
    constructor({el}) {
        this.DOM = {el};

        this.DOM.play = this.DOM.el.querySelector('.js-btn_text__play');
        this.DOM.pause = this.DOM.el.querySelector('.js-btn_text__pause');
        this.DOM.resume = this.DOM.el.querySelector('.js-btn_text__resume');

        this.DOM.iconPlay = this.DOM.el.querySelector('.js-btn_icon__play')
        this.DOM.iconPause = this.DOM.el.querySelector('.js-btn_icon__pause')

        this.isPlay = false;
        this.isPause = false;
        this.sleeping = false;

        this.elPrimary = null;
        this.elSecondary = null;

        this.current = {x: 0, y: 0};
        this.last = {x: 0, y: 0};
        this.ease = .1;

        gsap.set([this.DOM.pause, this.DOM.resume], {y: "100%"});
    }

    getProp() {
        const {width, height} = this.DOM.el.getBoundingClientRect();
        this.prop = {
            width,
            height
        }
    }

    onOver(delay) {
        gsap.killTweensOf(this.elPrimary);
        gsap.fromTo(this.elPrimary, {y: "100%"}, {y: '0%', duration: .6, ease: 'power3.out', delay});
    }

    onLeave() {
        gsap.killTweensOf(this.elPrimary);
        gsap.to(this.elPrimary, {
            y: '-100%', duration: .4, ease: 'power3.out', onComplete: () => {
                this.DOM.el.style.visibility = 'hidden';
            }
        });
    }

    animationIn(delay) {
        gsap.to(this.DOM.el, {opacity: 1, delay, duration: .5, ease: 'power3.inOut'});
    }

    sleep() {
        gsap.to(this.DOM.el, {opacity: 0, duration: .4, ease: 'power3.out'});
    }

    onAnimationText() {

        gsap.killTweensOf(this.elPrimary);
        gsap.killTweensOf(this.elSecondary);

        gsap.fromTo(this.elPrimary, {y: "0%"}, {y: '-100%', duration: .5, ease: 'power3.out'});
        gsap.fromTo(this.elSecondary, {y: "100%"}, {
            y: '0%', duration: .5, delay: .05, ease: 'power3.out'
        });
    }

    pauseIcon() {
        gsap.to(this.DOM.iconPlay, {opacity: 0, ease: 'power3.out', duration: .4});
        gsap.to(this.DOM.iconPause, {opacity: 1, ease: 'power3.out', duration: .4});
    }

    playIcon() {
        gsap.to(this.DOM.iconPlay, {opacity: 1, ease: 'power3.out', duration: .4});
        gsap.to(this.DOM.iconPause, {opacity: 0, ease: 'power3.out', duration: .4});
    }

    onChange() {
        if (!this.isPlay) {
            this.elPrimary = this.DOM.play;
            this.elSecondary = this.DOM.pause;
            this.isPlay = true;
            this.pauseIcon();
        } else if (!this.isPause) {
            this.elPrimary = this.DOM.pause;
            this.elSecondary = this.DOM.resume;
            this.isPause = true;
            this.playIcon();
        } else {
            this.elPrimary = this.DOM.resume;
            this.elSecondary = this.DOM.pause;
            this.isPause = false;
            this.pauseIcon();
        }

        this.onAnimationText();
    }

    endVideo() {

        this.DOM.play.textContent = 'Replay';

        this.elPrimary = this.DOM.pause;
        this.elSecondary = this.DOM.play;
        this.isPlay = false;
        this.sleeping = false;
        this.isPause = false;
        this.playIcon();
        setTimeout(() => this.onAnimationText(), 300);
    }

    renderStyle(x, y) {
        this.DOM.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    onSet({x, y}) {
        this.current.x = this.last.x = x - this.prop.width / 2;
        this.current.y = this.last.y = y - this.prop.height / 2;
        this.renderStyle(this.current.x, this.current.y);
    }

    onMove({x, y}) {
        this.last.x = x - this.prop.width / 2;
        this.last.y = y - this.prop.height / 2;
    }

    handleResize() {
        this.getProp();
    }

    render() {
        this.current.x = MathLerp(this.current.x, this.last.x, this.ease);
        this.current.y = MathLerp(this.current.y, this.last.y, this.ease);
        this.renderStyle(this.current.x, this.current.y);
    }
}
