import gsap from 'gsap';
import {_EMIT_EVENT_,SMOOTH_SCROLLING} from "../../libs/emit-event";

class SelectItem {
    constructor(select) {
        this.DOM = {select: select};
        this.isOpen = false;
        this.iClose = true;
        this.init();
        this.bindEvent();
    }

    init() {

        this.DOM.select.classList.add('has__render');
        const _this = this;
        this.DOM.select.style.opacity = '0';
        this.DOM.select.style.zIndex = '-9999';
        this.DOM.select.style.pointerEvents = 'none';
        this.DOM.select.style.position = 'absolute';
        this.DOM.select.style.visibility = 'hidden';
        this.DOM.select.style.tabindex = '-1';
        this.DOM.select.selectedIndex = '-1';


        this.DOM.parentSelect = this.DOM.select.parentElement;
        this.DOM.textActive = document.createElement('span');
        this.DOM.ul = document.createElement('ul');
        this.DOM.wrap = document.createElement('div');
        this.DOM.wrapFix = document.createElement('div');
        this.DOM.selectRollback = document.createElement('div');
        this.DOM.wrapFix.classList.add('custom--select-drop-fix');
        this.DOM.selectRollback.classList.add('custom--select-drop-rollback');
        this.DOM.iconDrop = document.createElement('span');
        this.DOM.iconDrop.innerHTML = `<svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26 1.14062L13.5 14.2812L0.999999 1.14062" stroke-width="2"/>
</svg>
`;

        if (this.DOM.select.getAttribute('data-placeholder')) {
            this.DOM.textActive.textContent = this.DOM.select.getAttribute('data-placeholder');
        }

        if (this.DOM.select.getAttribute('data-search')) {
            this.DOM.inputSearch = document.createElement('input');
            this.DOM.inputSearch.classList.add('input--search-key', 'form-control');

            this.DOM.inputSearch.setAttribute('autocomplete', 'none');
            this.DOM.inputSearch.setAttribute('type', 'text');

            //this.DOM.parentSelect.append(this.DOM.inputSearch);
            this.DOM.parentSelect.classList.add('custom--select-search');
        }

        this.DOM.iconDrop.classList.add('icon--dropdown');
        this.DOM.textActive.classList.add('custom--select-text', 'form-control');
        this.DOM.parentSelect.append(this.DOM.textActive);
        this.DOM.parentSelect.append(this.DOM.iconDrop);
        this.DOM.wrap.classList.add('custom--select-drop-wrap');
        this.DOM.parentSelect.classList.add('form-group--custom-select', 'form-group--select');

        this.DOM.wrap.append(this.DOM.ul);

        this.DOM.wrapFix.append(this.DOM.wrap);
        this.DOM.wrapFix.append(this.DOM.selectRollback);

        for (let index = 0; index < this.DOM.select.options.length; index++) {
            const option = this.DOM.select.options[index];
            const li = document.createElement('li');
            li.setAttribute('option-index', index);
            li.textContent = option.textContent;
            li.addEventListener('click', function () {

                const liActive = _this.DOM.ul.querySelector('li.active');
                if (liActive) {
                    liActive.classList.remove('active');
                }

                _this.DOM.select.selectedIndex = this.getAttribute('option-index');
                li.classList.add('active');
                _this.DOM.textActive.textContent = _this.DOM.select.options[_this.DOM.select.selectedIndex].value;
                _this.closeSelectCustom();

            });
            this.DOM.ul.append(li);
        }

    }

    openSelectCustom() {

        if (!this.isOpen) {
            this.isOpen = true;
            const selectRect = this.DOM.parentSelect.getBoundingClientRect();
            document.body.append(this.DOM.wrapFix);
            this.DOM.wrap.style.top = `${selectRect.bottom}px`;
            this.DOM.wrap.style.left = `${selectRect.left}px`;
            this.DOM.wrap.style.width = `${selectRect.width}px`;
            this.DOM.parentSelect.classList.add('focus');
        }
        this.iClose = true;
        gsap.killTweensOf(this.DOM.wrap);
        gsap.to(this.DOM.wrap, {height: this.DOM.wrap.scrollHeight, ease: 'power3.out', duration: .6});
    }

    closeSelectCustom() {
        if (this.iClose) {
            this.iClose = false;
            gsap.to(this.DOM.wrap, {
                height: 0, ease: 'power3.out', duration: .6, onComplete: () => {
                    document.body.removeChild(this.DOM.wrapFix);
                    this.isOpen = false;
                }
            });

            this.DOM.parentSelect.classList.remove('focus');
            if (this.DOM.select.selectedIndex !== -1 && this.DOM.ul.querySelector('li.active')) {
                this.DOM.parentSelect.classList.add('has--value');
            } else {
                this.DOM.select.selectedIndex = -1;
            }
        }
    }

    hideSelectCustom() {
        if (this.iClose && this.isOpen) {
            this.iClose = false;
            this.isOpen = false;
            document.body.removeChild(this.DOM.wrapFix);
            gsap.set(this.DOM.wrap, {
                height: 0
            });

            this.DOM.parentSelect.classList.remove('focus');
            if (this.DOM.select.selectedIndex !== -1 && this.DOM.ul.querySelector('li.active')) {
                this.DOM.parentSelect.classList.add('has--value');
            } else {
                this.DOM.select.selectedIndex = -1;
            }
        }
    }

    resizeSelectCustom() {
        if (this.isOpen) {
            const selectRect = this.DOM.parentSelect.getBoundingClientRect();
            this.DOM.wrap.style.top = `${selectRect.bottom}px`;
            this.DOM.wrap.style.left = `${selectRect.left}px`;
            this.DOM.wrap.style.width = `${selectRect.width}px`;
        }
    }

    resetSelect() {
        const liActive = this.DOM.ul.querySelector('li.active');
        if (liActive) {
            liActive.classList.remove('active');
        }
        this.DOM.select.selectedIndex = -1;
        if (this.DOM.select.getAttribute('data-placeholder')) {
            this.DOM.textActive.textContent = this.DOM.select.getAttribute('data-placeholder');
        } else {
            this.DOM.textActive.textContent = '';
        }
        this.DOM.parentSelect.classList.remove('focus', 'has--value');

    }

    bindEvent() {

        this.DOM.parentSelect.addEventListener('click', this.openSelectCustom.bind(this));
        this.DOM.selectRollback.addEventListener('click', this.closeSelectCustom.bind(this));
        this.DOM.select.addEventListener('reset', this.resetSelect.bind(this));
        //window.addEventListener('scroll', this.hideSelectCustom.bind(this));
        _EMIT_EVENT_.on(SMOOTH_SCROLLING, this.hideSelectCustom.bind(this));
    }

}

export default SelectItem;
