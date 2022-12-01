import SelectItem from "./select-item";

class CustomSelect {
    constructor() {
        this.DOM = {selects: document.querySelectorAll('select.custom--select:not(.has__render)')};
        this.obSelects = [];
        this.init();
    }

    init() {
        this.DOM.selects.forEach(select => this.obSelects.push(new SelectItem(select)));
    }

    htResize() {
        this.obSelects.forEach(select => select.resizeSelectCustom());
    }

}

new CustomSelect;