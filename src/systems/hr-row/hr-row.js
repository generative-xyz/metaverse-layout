import {HrRowItem} from "./hr-row-item";

export class HrRow {
    constructor() {
        this.hrRows_ = [];
        document.querySelectorAll('.js-hr-scroller').forEach(hrRow => {
            this.hrRows_.push(new HrRowItem({el: hrRow}));
        });
    }
}