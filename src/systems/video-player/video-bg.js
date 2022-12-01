import {VideoBgItem} from "./video-bg-item";

export class VideoBg {

    constructor() {
        this.elements = [];
        document.querySelectorAll('.js-video__player').forEach(
            el => this.elements.push(new VideoBgItem({el})));
    }

    removeEvent() {
        this.elements.forEach(item => item.removeEvent());
    }
}
