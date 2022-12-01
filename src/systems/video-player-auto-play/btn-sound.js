import {gsap} from "gsap";
import {MathAround, MathLerp} from "../../libs/math-utils";

export class BtnSound {
    constructor({el, btn}) {
        this.DOM = {el, btn};

        this.max = 40;
        this.offset = .5;

        this.DOM.bg = document.createElement('span');
        this.DOM.bg.classList.add('video_btnMute_bg');
        this.DOM.btn.append(this.DOM.bg);

        this.lastPosition = {x: 0, y: 0};
        this.currentPosition = {x: 0, y: 0};


        this.quickSetterX = gsap.quickSetter(this.DOM.bg, "x", "px");
        this.quickSetterY = gsap.quickSetter(this.DOM.bg, "y", "px");

        this.quickSetterBtnX = gsap.quickSetter(this.DOM.btn, "x", "px");
        this.quickSetterBtnY = gsap.quickSetter(this.DOM.btn, "y", "px");

        //this.bindEvent();
    }

    setValue(position) {

        const x = (position.x - this.prop.width);
        const y = (position.y - this.prop.height);

        const max = {
            x: Math.max(Math.min(x, this.max), (this.max * -1)),
            y: Math.max(Math.min(y, this.max), (this.max * -1))
        };

        const around = MathAround(this.max, {
            x: (max.x === 0 ? 1 : max.x),
            y: (max.y === 0 ? 1 : max.y)
        });
        return {
            x: Math.max(Math.min(x, Math.abs(around.x)), (Math.abs(around.x) * -1)),
            y: Math.max(Math.min(y, Math.abs(around.y)), (Math.abs(around.y) * -1))
        };
    }

    getProp() {
        const {width, height, left, top} = this.DOM.el.getBoundingClientRect();
        this.prop = {width: width / 2, height: height / 2, left, top};
    }

    mouseMoving(event) {
        this.getProp();
        this.lastPosition = this.setValue({
            x: event.clientX - this.prop.left,
            y: event.clientY - this.prop.top
        });
    }

    mouseLeave() {
        this.lastPosition = this.setValue({
            x: this.prop.width,
            y: this.prop.height
        });
    }

    render() {
        this.currentPosition.x = MathLerp(this.currentPosition.x, this.lastPosition.x, .1);
        this.currentPosition.y = MathLerp(this.currentPosition.y, this.lastPosition.y, .1);

        this.quickSetterX(this.currentPosition.x * this.offset);
        this.quickSetterY(this.currentPosition.y * this.offset);

        this.quickSetterBtnX(this.currentPosition.x * .3);
        this.quickSetterBtnY(this.currentPosition.y * .3);
    }

    bindEvent() {
        this.DOM.el.addEventListener('mousemove', (event) => this.mouseMoving(event));
        this.DOM.el.addEventListener('mouseleave', this.mouseLeave.bind(this));
    }
}
