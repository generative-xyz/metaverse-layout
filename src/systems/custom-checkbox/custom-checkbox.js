class CustomCheckbox {
    constructor(target) {
        this.target = target;
        this.CustomCheckboxs = document.querySelectorAll(target);
        this.htInputs = [];
        this.init();
        this.bindEvents();
    }

    init() {

        let _this = this;
        this.CustomCheckboxs.forEach(function (el, key) {

            let parent = el.parentElement;
            let htmlBox = '';
            let classBox = '';
            if (el.checked) {
                classBox = 'checked';
            }
            if (el.classList.contains('is-dark-theme')) {
                classBox += ' is-dark-theme';
            }

            if (el.getAttribute('disabled') !== null) {
                classBox += ' disabled';
                parent.classList.add('disabled');
            }
            if (el.getAttribute('type') === 'radio') {
                htmlBox = '<span class="element-ht-check ht-radio ' + classBox + '"></span>';
            } else {
                htmlBox = '<span class="element-ht-check ht-checkbox ' + classBox + '"></span>';
            }


            parent.insertAdjacentHTML('afterbegin', htmlBox);

            if (!parent.classList.contains('form-check-label'))
                parent.classList.add('form-check-label');

            el.triggerChecked = function () {
                this.checked = true;
                this.parentElement.querySelector('.element-ht-check').classList.add('checked');
            };
            _this.htInputs.push({
                input: el,
                parentInput: parent,
                boxCheck: parent.querySelector('.element-ht-check'),
                label: parent.querySelector('.check-label--text')
            });
        });
    }

    boxCheckClick(object, position) {
        let input = null, parent = null;

        if (position && position === 'parent') {
            parent = object.querySelector('.element-ht-check');
            input = object.querySelector(this.target);
        } else {
            parent = object;
            input = object.parentElement.querySelector(this.target);
        }

        if (input.checked && input.getAttribute('type') !== 'radio') {
            parent.classList.remove('checked');
        } else {
            parent.classList.add('checked');
        }

        document.querySelectorAll('input[name="' + input.getAttribute('name') + '"]').forEach(function (el) {
            if ((el.checked || el.getAttribute('checked')) && input !== el) {
                el.checked = false;
                let parent = el.parentElement;
                parent.querySelector('.element-ht-check').classList.remove('checked');
            }
        });

        if (input.getAttribute('type') === 'radio') {
            input.checked = true;
        } else {
            input.checked = !input.checked;
        }

        input.dispatchEvent(new CustomEvent('htChange', {detail: input.value}));
    }

    boxCheckReset() {

        this.htInputs.forEach(function (htInput) {
            if (htInput.input.getAttribute('checked') !== null) {
                htInput.boxCheck.classList.add('checked');
            }
        });
    }

    bindEvents() {

        let _this = this;
        this.htInputs.forEach(function (objectInput, key) {

            if (objectInput.input.getAttribute('disabled') !== null) return;
            if (objectInput.parentInput.tagName === 'LABEL') {
                objectInput.parentInput.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    _this.boxCheckClick(this, 'parent');
                });

                objectInput.parentInput.addEventListener('mouseenter', function () {
                    this.querySelector('.element-ht-check').classList.add('hover');
                });
                objectInput.parentInput.addEventListener('mouseleave', function () {
                    this.querySelector('.element-ht-check').classList.remove('hover');
                });
            }
            objectInput.boxCheck.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                _this.boxCheckClick(this);
            });

            objectInput.label.addEventListener('click', function (event) {
                objectInput.boxCheck.dispatchEvent(new Event('click'));
            });

            const parentInput = objectInput.boxCheck.parentElement;
            parentInput.addEventListener('mouseenter', function () {
                objectInput.boxCheck.classList.add('hover');
            });
            parentInput.addEventListener('mouseleave', function () {
                objectInput.boxCheck.classList.remove('hover');
            });
        });

        document.querySelectorAll('form').forEach(function (el, key) {
            el.addEventListener('reset', function () {
                el.querySelectorAll('.form-check-input').forEach(function (el) {
                    if (el.checked && !el.getAttribute('checked')) {
                        el.checked = false;
                        let parent = el.parentElement;
                        parent.querySelector('.element-ht-check').classList.remove('checked');
                    } else if (el.getAttribute('checked') && !el.checked) {
                        _this.boxCheckClick(el);
                    }
                });
            });
        });
    }
}

new CustomCheckbox('.form-check-input');