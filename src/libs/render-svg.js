import axios from 'axios';
import {parse} from 'node-html-parser';
import {_EMIT_EVENT_, SVG_DOCUMENT, SVG_ELEMENT} from "./emit-event";

class RenderSVG {
    
    constructor() {
        this.DOM_ = {}
        this.filterSvgLoader_ = [];
    }

    handleSVGRender(type) {
        if (type === 'Document') {
            _EMIT_EVENT_.emit(SVG_DOCUMENT);
        } else {
            _EMIT_EVENT_.emit(SVG_ELEMENT);
        }
    }

    checkFilterSvgExits(src) {
        for (let i = 0; i < this.filterSvgLoader_.length; i++) {
            if (this.filterSvgLoader_[i] && this.filterSvgLoader_[i].src === src) return i;
        }
        return false;
    }

    filterList(parent) {

        this.DOM_.svgs = parent.querySelectorAll('img.svg');
        this.DOM_.svgs.forEach((el, k) => {

            const svg_regex = new RegExp('([a-z\-_0-9\/\:\.]*\.svg)');
            const src = el.getAttribute('src');

            if (!svg_regex.test(src)) return;

            const keyExits = this.checkFilterSvgExits(src);
            if (keyExits === false) {

                const tmp_ = {src, elements: []};
                tmp_.elements.push(el);

                this.filterSvgLoader_.push(tmp_);
            } else {
                this.filterSvgLoader_[keyExits].elements.push(el);
            }
        });
    }

    renderSvg(parent, type) {

        const loadSvgs_ = [];
        const wrapSvg_ = document.createElement('div');
        this.filterList(parent);

        setTimeout(() => {
            for (let i = 0; i < this.filterSvgLoader_.length; i++) {
                const obLoadSvg_ = this.filterSvgLoader_[i];
                loadSvgs_.push(new Promise((resolve, reject) => {
                    axios.get(obLoadSvg_.src).then((response) => {
                        try {

                            const xml = parse(response.data);
                            wrapSvg_.innerHTML = xml.childNodes[0].toString();
                            const svg = wrapSvg_.children[0];

                            obLoadSvg_.elements.forEach(el => {
                                svg.setAttribute('class', el.getAttribute('class'));

                                const widthEl_ = parseInt(el.getAttribute('width'), 10);
                                const heightEl_ = parseInt(el.getAttribute('height'), 10);

                                if (!svg.getAttribute('viewBox_')) {
                                    const wBox_ = svg.offsetWidth || widthEl_;
                                    const hBox_ = svg.offsetHeight || heightEl_;
                                    svg.setAttribute('viewBox_', '0 0 ' + wBox_ + ' ' + hBox_);
                                }

                                if (heightEl_) svg.setAttribute('height', heightEl_);
                                if (widthEl_) svg.setAttribute('width', widthEl_);

                                if (el.parentElement) {
                                    el.outerHTML = svg.outerHTML;
                                }
                            });

                            resolve();

                        } catch (e) {
                            reject();
                            console.log(e);
                        }
                    });
                }));
            }

            Promise.all(loadSvgs_).then(() => {
                this.handleSVGRender(type);
            });

        }, 10);
    }

    initRenderSVG() {
        this.renderSvg(document, 'Document');
    }

    renderSvgElement(element) {
        this.renderSvg(element, 'Element');
    }
}

export const _RENDER_SVG_ = new RenderSVG();