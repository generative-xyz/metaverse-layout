import {VideoBgItem} from "./video-bg-item";

export class VideoBgAutoPlay {

    constructor() {
        this.elements = [];
        document.querySelectorAll('.js-video__player').forEach(
            el => this.elements.push(new VideoBgItem({el})));
    }

    removeEvent() {
        if (!this.elements.length) return;
        this.elements.forEach(item => item.removeEvent());
    }
}
