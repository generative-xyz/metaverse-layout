import AnimationChars from "../../animation/chars/chars";
import AnimationFade from "../../animation/fade/fade";
import AnimationLines from "../../animation/lines/lines";
import {checkDeviceMobile} from "../../libs/helper";
import {AnimationScrollLine} from "../../animation/scroll-line/scroll-line";
import {
    _EMIT_EVENT_,
    AJAX_CONTENT_LOADED,
    PAGE_LOADED,
    TAB_CHANGED_ANIMATION,
    WIN_PAGE_LOADED
} from "../../libs/emit-event";
import {AnimationSimpleLine} from "../../animation/simple-line/simple-line";
import {_SERVICES_} from "../../libs/services";
import LottieIcon from "../../animation/lottie-icon/lottie-icon";

export class PageAnimations {
    constructor() {
        if (!checkDeviceMobile()) {
            this.type = 'default';
            this.page = window.location.pathname;
            this.isServicePages = document.querySelector('.js-serviceCategory_lists');
            if (this.isServicePages) {
                this.animationList = {service: [], project: []};
            }
        }

        this.documentInit = this.documentInit.bind(this);
        _EMIT_EVENT_.on(WIN_PAGE_LOADED, this.documentInit);

        this.emitEvent();

    }

    documentInit() {
        this.init('document');
    }

    init(classWrapContent) {
        let Element = classWrapContent === 'document' ? document : document.querySelector(classWrapContent);

        Element.querySelectorAll('.js-animation--chars:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationChars(item, {
                handleScrolling: true,
            }))
        });

        Element.querySelectorAll('.js-animation--chars__simple:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationChars(item, {
                handleScrolling: true,
                type: 'simple'
            }))
        });

        Element.querySelectorAll('.js-animation--fade:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationFade(item, {
                handleScrolling: true,
                type: 'fade_tran'
            }))
        });

        Element.querySelectorAll('.js-animation--lottie:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new LottieIcon({el: item}))
        });

        Element.querySelectorAll('.js-animation--fade--none:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationFade(item, {
                handleScrolling: true,
            }))
        });

        Element.querySelectorAll('.js-animation--lines:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationLines(item, {
                handleScrolling: true,
                type: 'mask_bottom'
            }))
        });

        Element.querySelectorAll('.js-animation--lines--chars:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationLines(item, {
                handleScrolling: true,
                type: 'lines--chars'
            }))
        });

        Element.querySelectorAll('.js-animation--lines--sim:not(.is-handler)').forEach(item => {
            this.addAnimationInTab(new AnimationSimpleLine(item, {
                handleScrolling: true,
                type: 'lines--chars'
            }))
        });

        const scrollLineEl = Element.querySelector('.scroll_line:not(.is-handler)');
        scrollLineEl && new AnimationScrollLine(scrollLineEl, {handleScrolling: true, delayScreen: 1.2});

        if (_SERVICES_.pageTransition === 'default') {
            const singleProjectHero = Element.querySelector('.js-productSingle_header_thumbnail');
            if (singleProjectHero) {
                new AnimationFade(singleProjectHero, {
                    handleScrolling: true,
                    _to: {duration: .8, ease: 'power3.inOut'}
                })
            }
        }

    }

    addAnimationInTab(ani) {
        if (checkDeviceMobile()) return;
        if (this.type === 'tab') {
            this.animationList.project.push(ani);
        } else if (this.animationList && this.animationList.service) {
            this.animationList.service.push(ani);
        }
    }

    tabChanged({classWrapContent}) {

        const listAnimationOfTab = [];
        if (classWrapContent === 'js-serviceCategory_lists') {
            this.animationList.service.forEach(item => {
                if (!item.DOM.el.classList.contains('is-handler')) {
                    listAnimationOfTab.push(item);
                }
            });

            setTimeout(() => {
                listAnimationOfTab.forEach(item => item.resetAnimation())
            }, 100);
        } else {

            this.animationList.project.forEach(item => {
                if (!item.DOM.el.classList.contains('is-handler')) {
                    listAnimationOfTab.push(item);
                }
            });

            setTimeout(() => {
                listAnimationOfTab.forEach(item => item.resetAnimation())
            }, 100);
        }
    }

    emitEvent() {
        _EMIT_EVENT_.on(AJAX_CONTENT_LOADED, ({classWrapContent, type = ''}) => {
            if (!checkDeviceMobile()) {
                this.type = type;
                if (this.page !== '' && this.page !== window.location.pathname) {
                    this.animationList = {service: [], project: []};
                    this.page = window.location.pathname;
                }
            }
            if (type === 'tab') return;
            this.init(classWrapContent);
        });
        if (!checkDeviceMobile()) {
            _EMIT_EVENT_.on(TAB_CHANGED_ANIMATION, this.tabChanged.bind(this));
        }
    }
}
