import isEmail from "validator/es/lib/isEmail";
import isEmpty from "validator/es/lib/isEmpty";

export class ValidationInput {
    constructor({el, error}) {

        this.DOM_ = {el};
        this.error_ = error;
        this.DOM_.wrap = this.DOM_.el.parentElement;

        this.DOM_.elError = document.createElement('span');
        this.DOM_.elError.classList.add('input-label-error');

        this._bindEvent();
    }

    _onValidate() {
        let error_ = '';
        for (const key in this.error_) {
            switch (key) {
                case 'empty':
                    error_ = isEmpty(this.DOM_.el.value) ? this.error_[key] : '';
                    break;
                case 'email':
                    error_ = !isEmail(this.DOM_.el.value) ? this.error_[key] : '';
                    break;
            }
        }

        if (!isEmpty(error_)) {
            this._hasError(error_);
            return true;
        } else {
            this._removeError();
            return false;
        }

    }

    _hasError(error) {

        this.DOM_.el.classList.add('is-error');
        this.DOM_.wrap.classList.add('has--error');

        this.DOM_.elError.textContent = error;
        this.DOM_.wrap.append(this.DOM_.elError);
    }

    _removeError() {

        this.DOM_.el.classList.remove('is-error');
        this.DOM_.wrap.classList.remove('has--error', 'focus');

        this.DOM_.wrap.contains(this.DOM_.elError) && this.DOM_.wrap.removeChild(this.DOM_.elError);
    }

    _getEl() {
        return this.DOM_.el;
    }

    _onFocus() {
        this._removeError();
    }

    _bindEvent() {
        this.DOM_.el.addEventListener('focus', this._onFocus.bind(this));
    }
}