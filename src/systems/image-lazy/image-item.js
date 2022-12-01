import {_EMIT_EVENT_,HT_RESIZE_WIDTH} from "../../libs/emit-event";

class ImageItem {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.el.classList.add('is-handle');
        this.rendered = false;
        this.srcSet = this.DOM.el.getAttribute('data-srcset');
        this.arraySrcs = this.srcSet.replace(/ /g, '').split(',');
        this.objectSrcs = {};
        this.srcLarge = null;
        this.isLoaded = false;
        this.regExtract = new RegExp(/\d+w/i);
        this.regMatch = new RegExp(/\d+w/g);
        this.addObServer();
        this.bindEvent();
    }

    addObServer() {
        this.DOM.el.parentElement.classList.add('js-image--lazy__wrapper');
        this.arraySrcs.forEach(item => {
            const extract = this.regExtract.exec(item);
            if (extract) {
                this.objectSrcs[extract[0]] = extract.input.replace(this.regMatch, '').trim();
            }
        });

        this.getSrc();
        if (!('IntersectionObserver' in window) ||
            !('IntersectionObserverEntry' in window) ||
            !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
            setTimeout(() => {
                this.render();
            }, 100);
        } else {
            this.obServer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting > 0) {
                    this.timeOnScreen = setTimeout(this.render.bind(this), 100);
                } else {
                    clearTimeout(this.timeOnScreen);
                }
            });
            this.obServer.observe(this.DOM.el);
        }
    }

    resize() {

        if (!this.rendered) return;
        this.rect = this.DOM.el.getBoundingClientRect();
        this.sizes = this.srcSet.match(this.regMatch).map(function (item) {
            return parseInt(item.replace('w', ''));
        }).sort();

        for (const size of this.sizes) {
            if ((size / this.rect.width) > window.devicePixelRatio) {
                if (size > this.sizeActive) {
                    this.sizeActive = size;
                    this.imageLazyLarge.src = this.objectSrcs[this.sizeActive + 'w'];
                }
                return;
            }
        }
    }

    getSrc() {

        this.rendered = true;
        this.rect = this.DOM.el.getBoundingClientRect();

        this.sizes = this.srcSet.match(this.regMatch).map(function (item) {
            return parseInt(item.replace('w', ''));
        }).sort(function (a, b) {
            return a - b
        });

        const ratio = parseInt(window.devicePixelRatio);
        for (const size of this.sizes) {
            if (parseInt((size / Math.round(this.rect.width))) >= ratio) {
                this.sizeActive = size;
                this.srcLarge = this.objectSrcs[this.sizeActive + 'w'];
                break;
            }
        }
        if (!this.srcLarge) {
            this.sizeActive = (this.sizes[(this.sizes.length - 1)]);
            this.srcLarge = this.objectSrcs[this.sizeActive + 'w'];
        }
    }

    render() {
        if (this.isLoaded) return;
        this.isLoaded = true;

        const image = this.DOM.el.cloneNode();
        image.src = this.srcLarge;
        image.classList.add('is-clone');
        image.removeAttribute('data-srcset');

        image.addEventListener('load', () => {
            this.DOM.el.parentElement.insertBefore(image, this.DOM.el);
            this.DOM.el.classList.add('is-loaded');
        });
        this.destroy();
    }

    destroy() {
        this.obServer.unobserve(this.DOM.el);
        _EMIT_EVENT_.off(HT_RESIZE_WIDTH, this.resize.bind(this));
    }

    bindEvent() {
        _EMIT_EVENT_.on(HT_RESIZE_WIDTH, this.resize.bind(this));
    }
}

export default ImageItem;
