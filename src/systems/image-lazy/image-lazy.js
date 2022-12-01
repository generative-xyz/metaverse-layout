import {_EMIT_EVENT_, AJAX_CONTENT_LOADED, PAGE_LOADED, WIN_PAGE_LOADED} from "../../libs/emit-event";
import ImageItemDataSrcset from "./image-item-data-srcset";
import {checkDeviceMobile} from "../../libs/helper";

export class ImageLazy {

    constructor() {

        this.DOM = {imagesLazy: document.querySelectorAll('.js-image--lazy')};
        this.handleAjaxContentLoaded = this.handleAjaxContentLoaded.bind(this);

        this.bindEvent();
        this.emitEvent();
    }

    handleAjaxContentLoaded({classWrapContent}) {
        document.querySelectorAll(`${classWrapContent} .js-image--lazy:not(.is-handle)`).forEach(lazy => {
            new ImageItemDataSrcset(lazy);
        });


        if (checkDeviceMobile()) {
            document.querySelectorAll(`${classWrapContent} .js-lazy__webgl-image:not(.is-handle)`).forEach(lazy => {
                new ImageItemDataSrcset(lazy);
            });

            document.querySelectorAll(`${classWrapContent} .js-webgl-team--image:not(.is-handle)`).forEach(lazy => {
                new ImageItemDataSrcset(lazy);
            });
        }

    }

    init() {
        this.DOM.imagesLazy.forEach(lazy => {
            new ImageItemDataSrcset(lazy);
        });

        if (checkDeviceMobile()) {
            document.querySelectorAll(`.js-lazy__webgl-image`).forEach(lazy => {
                new ImageItemDataSrcset(lazy);
            });

            document.querySelectorAll(`.js-webgl-team--image`).forEach(lazy => {
                new ImageItemDataSrcset(lazy);
            });
        }
    }

    bindEvent() {
        this.init = this.init.bind(this);
        _EMIT_EVENT_.on(WIN_PAGE_LOADED, this.init);
    }

    emitEvent() {
        _EMIT_EVENT_.on(AJAX_CONTENT_LOADED, this.handleAjaxContentLoaded);
    }
}
