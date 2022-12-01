import {checkDeviceMobile, isScreenMobile} from "../../libs/helper";
import {_EMIT_EVENT_,HT_RESIZE} from "../../libs/emit-event";

class ImageItemDataSrcset {
    DOM;
    rendered;
    isVisible;
    isLoaded;
    timeOnScreen;

    constructor(el) {
        this.DOM = {el: el};
        this.rendered = false;
        this.isVisible = false;
        this.isLoaded = false;
        this.timeOnScreen = null;
        this.htResize = this.htResize.bind(this);
        this.addObServer();
        this.bindEvent();
    }

    addObServer() {
        this.DOM.el.parentElement.classList.add('js-image--lazy__wrapper');
        this.DOM.el.parentElement.classList.add('js-lazy__webgl-image__wrapper');
        this.DOM.el.classList.add('is-handle');
        this.DOM.el.style = {};

        if (!('IntersectionObserver' in window) ||
            !('IntersectionObserverEntry' in window) ||
            !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
            setTimeout(() => {
                this.render();
            }, 10);
        } else {
            this.obServer = new IntersectionObserver(entries => {
                this.isVisible = entries[0].isIntersecting;
                if (this.isVisible) {
                    this.timeOnScreen = setTimeout(this.render.bind(this), 10);
                } else {
                    clearTimeout(this.timeOnScreen);
                }
            });
            this.obServer.observe(this.DOM.el);
        }
    }

    render() {
        if (this.isLoaded) return;
        this.isLoaded = true;

        const {width} = this.DOM.el.getBoundingClientRect();

        const image = this.DOM.el.cloneNode();
        image.classList.add('is-clone');
        image.setAttribute('sizes', `(max-width: ${width}px) 100vw, ${width}px`);

        const srcsetMobile = this.DOM.el.getAttribute('data-srcset-mobile');
        if (srcsetMobile && (checkDeviceMobile() || isScreenMobile())) {
            image.setAttribute('srcset', srcsetMobile)
        } else {
            image.setAttribute('srcset', this.DOM.el.getAttribute('data-srcset'));
        }

        this.DOM.el.parentElement.insertBefore(image, this.DOM.el);
        this.htResize();

        image.addEventListener('load', () => {

            this.DOM.el.classList.add('is-loaded');
            this.DOM.el.removeAttribute('data-srcset');
            this.DOM.el.removeAttribute('data-srcset-mobile');

            image.removeAttribute('data-srcset');
            image.removeAttribute('data-srcset-mobile');
        });

        this.destroy();
    }

    htResize() {
        if (this.DOM.el) {
            const attrWidth = this.DOM.el.getAttribute('width').replace('px', '');
            const {width} = this.DOM.el.getBoundingClientRect();
            const image = this.DOM.el.parentElement.querySelector('.is-clone');

            let fW = width > attrWidth ? attrWidth : width;
            fW = fW < attrWidth / 2 ? attrWidth / 2 : fW;

            if (image) {
                image.setAttribute('sizes', `(max-width: ${fW}px) 100vw, ${fW}px`);
            }
        }
    }

    bindEvent() {
        _EMIT_EVENT_.on(HT_RESIZE, this.htResize);
    }

    destroy() {
        this.obServer.unobserve(this.DOM.el);
        this.obServer.disconnect();
        this.obServer = null;
    }
}

export default ImageItemDataSrcset;
