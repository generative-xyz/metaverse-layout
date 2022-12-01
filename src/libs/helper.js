import isTouchDevice from 'is-touch-device';
import isMobile from 'ismobilejs';
import {_SERVICES_} from './services';
import Splitting from "splitting";

//
//
// class HTHelper {
//
//     static offsetResponsive = {xl: 1600, lg: 1320, md: 1024, sm: 768};
//     static scrollPosition = 0;
//
//     static getOffsetResponsive() {
//         return HTHelper.offsetResponsive;
//     }
//
//     static iPad() {
//         if (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
//             return true;
//         }
//         return false;
//     }
//
//     static checkDeviceTouch() {
//         return isTouchDevice();
//     }
//
//     static checkDeviceMobile() {
//         if (isMobile(navigator.userAgent).any || HTHelper.iPad())
//             return true;
//         return false;
//     }
//
//     static getElementAnimateOffset(obElement) {
//         if (obElement.offsetResponsive && obElement.offsetResponsive.length) {
//             for (let i = (obElement.offsetResponsive.length - 1); i >= 0; i--) {
//                 if (obElement.offsetResponsive[i].screen < window.innerWidth) {
//                     return parseFloat(obElement.offsetResponsive[i].offset);
//                 }
//             }
//         }
//         return 0;
//     }
//
//     static isPhone() {
//         return window.innerWidth < HTHelper.offsetResponsive.sm;
//     }
//
//     static getElementAnimationScreenOffset(obElement) {
//         return (obElement.onscreenOffset) || 0;
//     }
//
//     static setElementAnimateOffsetResponsive(obElement) {
//
//         let DOM = obElement.DOM.el;
//         obElement.offsetResponsive = [];
//         obElement.onscreenOffset = (DOM.getAttribute('data-screen_offset') && window.innerHeight > obElement.DOM.el.getBoundingClientRect().top) ? DOM.getAttribute('data-screen_offset') : 0;
//
//         if (DOM.getAttribute('data-xl-offset')) {
//             obElement.offsetResponsive.push({
//                 screen: HTHelper.offsetResponsive.xl,
//                 offset: DOM.getAttribute('data-xl-offset')
//             });
//         }
//         if (DOM.getAttribute('data-lg-offset')) {
//             obElement.offsetResponsive.push({
//                 screen: HTHelper.offsetResponsive.lg,
//                 offset: DOM.getAttribute('data-lg-offset')
//             });
//         }
//         if (DOM.getAttribute('data-md-offset')) {
//             obElement.offsetResponsive.push({
//                 screen: HTHelper.offsetResponsive.md,
//                 offset: DOM.getAttribute('data-md-offset')
//             });
//         }
//         if (DOM.getAttribute('data-sm-offset')) {
//             obElement.offsetResponsive.push({
//                 screen: HTHelper.offsetResponsive.sm,
//                 offset: DOM.getAttribute('data-sm-offset')
//             });
//         }
//         if (DOM.getAttribute('data-offset')) {
//             obElement.offsetResponsive.push({screen: 0, offset: DOM.getAttribute('data-offset')});
//         } else {
//             obElement.offsetResponsive.push({screen: 0, offset: 0});
//         }
//     }
//
//     static squeLerp(a, b, mount) {
//         return (Math.abs(Math.abs(a) - Math.abs(b)) <= mount);
//     }
//
//     static getElementAnimateDelay(obElement) {
//         return parseFloat(window.htDatas.animationType === 'contentLoaded' ? HTHelper.getElementAnimationScreenOffset(obElement) : HTHelper.getElementAnimateOffset(obElement));
//     }
//
//     static colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
//         let channelA = colorChannelA * amountToMix;
//         let channelB = colorChannelB * (1 - amountToMix);
//         return parseInt(channelA + channelB);
//     }
//
//     static colorMixer(rgbA, rgbB, amountToMix) {
//         let r = HTHelper.colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
//         let g = HTHelper.colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
//         let b = HTHelper.colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
//         return "rgb(" + r + "," + g + "," + b + ")";
//     }
//
//     static disableScrollIphone() {
//         HTHelper.scrollPosition = window.pageYOffset;
//         let bodyElement = document.body;
//         bodyElement.style.overflow = 'hidden';
//         bodyElement.style.position = 'fixed';
//         bodyElement.style.top = `-${HTHelper.scrollPosition}px`;
//         bodyElement.style.width = '100%';
//     }
//
//     static enableScrollIphone() {
//         let bodyElement = document.body;
//         bodyElement.style.removeProperty('overflow');
//         bodyElement.style.removeProperty('position');
//         bodyElement.style.removeProperty('top');
//         bodyElement.style.removeProperty('width');
//         window.scrollTo(0, HTHelper.scrollPosition);
//     }
//
//     static getScrollbarWidth() {
//
//         // Creating invisible container
//         const outer = document.createElement('div');
//         outer.style.visibility = 'hidden';
//         outer.style.overflow = 'scroll'; // forcing scrollbar to appear
//         outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
//         document.body.appendChild(outer);
//
//         // Creating inner element and placing it in the container
//         const inner = document.createElement('div');
//         outer.appendChild(inner);
//
//         const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
//
//         // Removing temporary elements from the DOM
//         outer.parentNode.removeChild(outer);checkDeviceMobilecheckDeviceMobile
//
//         return scrollbarWidth;
//
//     }
//
//
//     static extractSrcImage(imageDOM) {
//
//         const srcSet = imageDOM.getAttribute('data-srcset');
//         const arraySrcs = srcSet.replace(/ /g, '').split(',');
//
//         const objectSrcs = {};
//         const regExtract = new RegExp(/\d+w/i);
//         const regMatch = new RegExp(/\d+w/g);
//
//         let srcLarge = null;
//         const rect = imageDOM.getBoundingClientRect();
//
//         arraySrcs.forEach(item => {
//             const extract = regExtract.exec(item);
//             if (extract) {
//                 objectSrcs[extract[0]] = extract.input.replace(regMatch, '').trim();
//             }
//         });
//
//
//         let sizes = srcSet.match(regMatch).map(function (item) {
//             return parseInt(item.replace('w', ''));
//         }).sort(function (a, b) {
//             return a - b
//         });
//
//         for (const size of sizes) {
//             if ((size / rect.width) > window.devicePixelRatio) {
//                 imageDOM.sizeActive = size;
//                 srcLarge = objectSrcs[imageDOM.sizeActive + 'w'];
//                 break;
//             }
//         }
//         if (!srcLarge) {
//             imageDOM.sizeActive = (sizes[(sizes.length - 1)]);
//             srcLarge = objectSrcs[imageDOM.sizeActive + 'w'];
//         }
//
//         return srcLarge;
//     }
//
//     static checkAHasTag(el) {
//         const rex = /^#.*$/g;
//         return (rex.test(el.getAttribute('href').toString()) && el.getAttribute('href').toString().length > 1);
//     }
//
// }
//
// export default HTHelper;

const getElementAnimationScreenOffset = (onscreenOffset) => {
    return onscreenOffset || 0;
}

const getElementAnimateOffset = (offsetResponsive) => {
    for (let i = 0; i < offsetResponsive.length; i++) {
        for (let j = (offsetResponsive.length - 1); j >= i; j--) {
            if (offsetResponsive[j].screen > offsetResponsive[i].screen) {
                const tmp = offsetResponsive[i];
                offsetResponsive[i] = offsetResponsive[j];
                offsetResponsive[j] = tmp;
            }
        }
    }

    if (offsetResponsive && offsetResponsive.length) {
        for (let i = 0; i < offsetResponsive.length; i++) {
            if (offsetResponsive[i].screen < _SERVICES_.winSize.width) {
                return parseFloat(offsetResponsive[i].offset);
            }
        }
    }
}


const getElementAnimateDelay = ({onscreenOffset, offsetResponsive}) => {
    return parseFloat(_SERVICES_.scrollingType === 'contentLoaded' ? getElementAnimationScreenOffset(onscreenOffset) : getElementAnimateOffset(offsetResponsive));
}

const setElementAnimateOffsetResponsive = ({
                                               DOM,
                                               delayScreen = 0
                                           }) => {

    const offsetResponsive = [];
    let onscreenOffset = (DOM.getAttribute('data-screen-offset') && _SERVICES_.winSize.height > DOM.getBoundingClientRect().top) ? DOM.getAttribute('data-screen-offset') : (delayScreen);
    if (DOM.getAttribute('data-offset-xl')) {
        offsetResponsive.push({
            screen: _SERVICES_.offsetResponsive.xl,
            offset: DOM.getAttribute('data-offset-xl')
        });
    }
    if (DOM.getAttribute('data-offset-lg')) {
        offsetResponsive.push({
            screen: _SERVICES_.offsetResponsive.lg,
            offset: DOM.getAttribute('data-offset-lg')
        });
    }
    if (DOM.getAttribute('data-offset-md')) {
        offsetResponsive.push({
            screen: _SERVICES_.offsetResponsive.md,
            offset: DOM.getAttribute('data-offset-md')
        });
    }
    if (DOM.getAttribute('data-offset-sm')) {
        offsetResponsive.push({
            screen: _SERVICES_.offsetResponsive.sm,
            offset: DOM.getAttribute('data-offset-sm')
        });
    }
    if (DOM.getAttribute('data-offset')) {
        offsetResponsive.push({screen: 0, offset: DOM.getAttribute('data-offset')});
    } else {
        offsetResponsive.push({screen: 0, offset: 0});
    }

    if (checkDeviceMobile()) {
        const {top} = DOM.getBoundingClientRect();
        onscreenOffset = top / _SERVICES_.winSize.height;
    }

    return {
        offsetResponsive,
        onscreenOffset
    }
}


const getScrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop || 0;
}

const checkDeviceTouch = () => {
    return isTouchDevice();
}

const isFacebookApp = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

const checkDeviceMobile = () => {
    const iPad = () => {
        return !!(navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    return isMobile(navigator.userAgent).any || iPad() || isFacebookApp();
}

const isScreenMobile = () => {
    return window.innerWidth < 768;
}

const isScreenTabletWide = () => {
    return window.innerWidth < 1120;
}

const isScreenTablet = () => {
    return window.innerWidth < 1024;
}

const isScreenPcLarge = () => {
    return window.innerWidth >= 1440;
}

const isScreenPc = () => {
    return window.innerWidth >= 1200;
}

const isHasTag = (text) => {
    const hastag = new RegExp(/^#.+/);
    return hastag.test(text);
}

export const getHasTag = (href) => {
    return href.replace('/', '');
}

const isHasPaged = (text) => {
    const regPaged = new RegExp(/page\/[0-9]+/);
    return regPaged.test(text);
}

const replacePaged = (text, number) => {
    const regPaged = new RegExp(/page\/[0-9]+/);
    return text.replace(regPaged, `page/${number}`);
}

const wordByWord = (lines) => {
    lines.forEach((words, key) => {
        words.forEach((word, __key) => {
            const spanEl = document.createElement('span');
            spanEl.innerHTML = word.innerHTML;
            word.innerHTML = '';
            word.append(spanEl);
            word.classList.add('word--parent');
            spanEl.classList.add('word--element');
            lines[key][__key] = spanEl
        });
    });
}

const CharByLine = (lines) => {

    lines.forEach((line, key) => {
        let linesChars = [];
        line.forEach((word, __key) => {
            const chars = Splitting({
                target: word,
                by: 'chars'
            });

            word.innerHTML = '';
            chars[0].chars.forEach(char => {
                word.append(char);
            });

            linesChars = [...linesChars, ...chars[0].chars];
        });
        lines[key] = linesChars;
    });
}

const charByChar = (chars) => {

    chars.forEach((char, key) => {
        const spanEl = document.createElement('span');
        spanEl.textContent = char.textContent;
        char.innerHTML = '';
        char.append(spanEl);
        char.classList.add('char--parent');
        spanEl.classList.add('char--element');
        chars[key] = spanEl
    });
}

const resetSplittingResetSplitting = (ob) => {
    if (ob.inner) {
        ob.DOM.el.innerHTML = ob.inner;
        ob.inner = null;
    }
}

const onlyLineMask = (ob) => {
    const target = ob.DOM.el;
    target.innerHTML = `<span class="d-block line--mask-element">${target.innerHTML}</span>`;
    ob.DOM.elemntMask = target.querySelector('.line--mask-element');
    target.classList.add('only--line-mask');
}

const detectLeftButton = (evt) => {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons === 1;
    }
    const button = evt.which || evt.button;
    return button === 1;
}

const inViewPointerMobile = (el) => {
    if (checkDeviceMobile()) {
        const {top} = el.getBoundingClientRect();
        if (top > _SERVICES_.winSize.height) {
            return false;
        }
    }
    return true;
}

const ImageLoads = (paths = [], onLoaded) => {
    const images = [];
    let loading = 0;
    paths.forEach((path, key) => {
        const image = new Image();
        images.push({path, image});
        image.onload = () => {
            loading++;
            if (loading === paths.length) {
                onLoaded(images);
            }
        }

        image.src = path;
    });
}

const imgSrcOriginal = (img) => {
    if (window.devicePixelRatio >= 2) {
        return img.getAttribute('data-original');
    }
    return img.getAttribute('data-original-1x');
}

const radians = (degrees) => {
    return degrees * Math.PI / 180;
}

const distance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

const ThreeJsGetX = (left, width) => {
    return (left - _SERVICES_.winSize.width / 2 + width / 2);
}

const ThreeJsGetY = (top, height) => {
    return (-top + _SERVICES_.winSize.height / 2 - height / 2);
}

const Parabola = (x, k) => {
    return Math.pow(4.0 * x * (1.0 - x), k);
}

const disableScrollIphone = () => {
    _SERVICES_.lerScrollTop = _SERVICES_.smoothInstance_;
    let bodyElement = document.body;
    bodyElement.style.overflow = 'hidden';
    bodyElement.style.position = 'fixed';
    bodyElement.style.top = `${Math.abs(_SERVICES_.lerScrollTop)}px`;
    bodyElement.style.width = '100%';
}

const enableScrollIphone = () => {
    let bodyElement = document.body;
    bodyElement.style.removeProperty('overflow');
    bodyElement.style.removeProperty('position');
    bodyElement.style.removeProperty('top');
    bodyElement.style.removeProperty('width');
}

const removeWarrEventTouch = () => {
    let supportsPassive = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
    } catch (e) {
    }
}

export const objectToQueryString = (obj) => {
    const str = [];
    for (const p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export {
    getScrollTop,
    checkDeviceMobile,
    checkDeviceTouch,
    isScreenMobile,
    isScreenTabletWide,
    isScreenTablet,
    isScreenPcLarge,
    getElementAnimateDelay,
    setElementAnimateOffsetResponsive,
    isHasTag,
    onlyLineMask,
    resetSplittingResetSplitting,
    wordByWord,
    charByChar,
    CharByLine,
    isHasPaged,
    replacePaged,
    detectLeftButton,
    inViewPointerMobile,
    isScreenPc,
    ImageLoads,
    ThreeJsGetX,
    ThreeJsGetY,
    Parabola,
    disableScrollIphone,
    enableScrollIphone,
    imgSrcOriginal,
    removeWarrEventTouch,
};