export class LoadingCss {

    DOM;
    options

    constructor(el, {color = 'white'}) {
        this.DOM = {el};
        this.options = {color};

        this.init();
    }

    init() {
        this.DOM.el.classList.add('cssLoading__parent');
        this.DOM.el.insertAdjacentHTML('beforeend', `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`);
        setTimeout(() => {
            this.DOM.item = this.DOM.el.querySelector('.lds-ellipsis');
            this.DOM.item.classList.add(`color-${this.options.color}`);
        });
    }

    show() {
        this.DOM.item.classList.add('show');
    }

    hide() {
        this.DOM.item.classList.remove('show');
    }

}