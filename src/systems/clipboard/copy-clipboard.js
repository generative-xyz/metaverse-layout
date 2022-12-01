import gsap from 'gsap';
import {isScreenMobile} from "../../libs/helper";

export class CopyClipBoard {
    constructor(el) {
        this.DOM_ = {el: el};
        this.timeClearMessage = null;
        this.positionMobile = this.DOM_.el.getAttribute('data-mobile');
        this.bindEvent();
    }

    handleMouseClick(event) {

        if (this.timeClearMessage) clearTimeout(this.timeClearMessage);

        const input = document.createElement('input');
        input.setAttribute('value', this.DOM_.el.getAttribute('href'));

        if (!this.DOM_.el.spanMessage) {
            this.DOM_.el.spanMessage = document.createElement('span');
            this.DOM_.el.spanMessage.textContent = 'Copied to clipboard';
            let position = this.DOM_.el.getAttribute('data-position');
            if (this.positionMobile && isScreenMobile()) position = this.positionMobile;
            this.DOM_.el.spanMessage.classList.add('link--copy-message', position);
            this.DOM_.el.appendChild(this.DOM_.el.spanMessage);
            gsap.fromTo(this.DOM_.el.spanMessage, {y: 5, opacity: 0}, {
                opacity: 1,
                y: 0,
                ease: 'power3.out',
                duration: .4,
                delay: .1
            });
        }

        input.style.zIndex = '-1';
        input.style.position = 'absolute';
        input.style.opacity = '0';

        document.body.appendChild(input);
        const selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;

        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        this.timeClearMessage = setTimeout(() => gsap.to(this.DOM_.el.spanMessage, {
            opacity: 0,
            ease: 'power3.out',
            duration: .3,
            onComplete: () => {
                this.DOM_.el.removeChild(this.DOM_.el.spanMessage);
                this.DOM_.el.spanMessage = null;
            }
        }), 1400);

        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }

        event.preventDefault();
    }

    _customCopy(){
        if (this.timeClearMessage) clearTimeout(this.timeClearMessage);

        const input = document.createElement('input');
        input.setAttribute('value', this.DOM_.el.getAttribute('data-clipboard'));

        input.style.zIndex = '-1';
        input.style.position = 'absolute';
        input.style.opacity = '0';

        document.body.appendChild(input);
        const selected =
            document.getSelection().rangeCount > 0
                ? document.getSelection().getRangeAt(0)
                : false;

        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        this.DOM_.el.querySelectorAll('.line--mask-element').forEach(item=>{
            item.textContent = 'Copied to clipboard';
        });

        this.timeClearMessage = setTimeout(() => {
            this.DOM_.el.querySelectorAll('.line--mask-element').forEach(item=>{
                item.textContent = 'Copy on clipboard';
            });
        }, 1400);

        if (selected) {
            document.getSelection().removeAllRanges();
            document.getSelection().addRange(selected);
        }

    }

    bindEvent() {
        this.DOM_.el.addEventListener('click', this._customCopy.bind(this));
    }
}
