import AnimationHelper from "../../libs/animation-helper";
import {_SERVICES_} from "../../libs/services";
import {
    checkDeviceMobile,
    getElementAnimateDelay,
    inViewPointerMobile,
    setElementAnimateOffsetResponsive
} from "../../libs/helper";
import {gsap} from "gsap";
import {
    _EMIT_EVENT_,
    HT_RESIZE,
    PAGE_ENTER,
    SMOOTH_SCROLLING,
} from "../../libs/emit-event";
import {BtnPlay} from "./btn-play";
import {ActionClick} from "../../animation/action-click/action-click";
import {BtnSound} from "./btn-sound";

export class VideoBgItem {
    constructor({el}) {
        this.DOM_ = {el};
        this.DOM_.videoWrap = this.DOM_.el.querySelector('.js-video__wrap');
        this.DOM_.over = this.DOM_.el.querySelector('.js-video__over');
        this.DOM_.thumb = this.DOM_.el.querySelector('.js-videoThumb');
        this.DOM_.player = this.DOM_.el.querySelector('.js-videoPlayer');
        this.DOM_.btnSound = {
            wrap: this.DOM_.el.querySelector('.js-video_sound'),
            btn: this.DOM_.el.querySelector('.js-video_btnMute'),
            iconSound: this.DOM_.el.querySelector('.js-video_btnMute_icon__sound'),
            iconMuted: this.DOM_.el.querySelector('.js-video_btnMute_icon__mute'),
        };


        this.btnPlay = new BtnPlay({el: this.DOM_.el.querySelector('.js-video__player_btn')});
        this.timeOutHide = null;
        this.btnSoundEffect = new BtnSound({el: this.DOM_.btnSound.wrap, btn: this.DOM_.btnSound.btn});
        //this.soundActionClick = new ActionClick({el: this.DOM_.btnSound.btn, wrapEffect: this.btnSoundEffect.DOM.bg});

        this.isAnimated = false;
        this.isPageEnter = false;
        this.isPlay = this.DOM_.thumb ? false : true;
        this.isPlayerPlay = false;
        this.animationHelper = new AnimationHelper(
            {
                el: this.DOM_.el,
                animationIn: this.animationIn.bind(this),
                options: {
                    _to: {y: 70}
                },
                outScreen: () => {
                    this.pauseVideoLoop();
                },
                inScreen: () => {

                    this.getProp();
                    this.btnPlay.getProp();
                    this.btnPlay.onSet({x: this.prop.width / 2, y: this.prop.height / 2});

                    if (this.isPlayerPlay) {
                        this.playVideo();
                    } else {
                        this.DOM_.thumb && this.DOM_.thumb.play();
                        this.isPlay = true;
                    }
                },
            }
        );

        this.handleScroll = this.handleScroll.bind(this);
        this.onMoving = this.onMoving.bind(this);
        this.loop = this.loop.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.bindEvent();

        if (!inViewPointerMobile(this.DOM_.over) || checkDeviceMobile()) return;
        // gsap.set(this.DOM_.over, {opacity: 0, scale: 1.2});

    }

    animationIn(delay = 0) {
        if (!inViewPointerMobile(this.DOM_.over)) return;
        if (this.isAnimated) return;
        this.isAnimated = true;

        if (!checkDeviceMobile()) {
            if (this.animationHelper) {
                delay += this.animationHelper.getDelayAnimation();
            }
            // gsap.to(this.DOM_.over, {opacity: 1, ease: 'power3.inOut', scale: 1, duration: 1.2, delay});
            this.btnPlay.animationIn(delay + .3);
        } else {
            this.btnPlay.animationIn();
        }
    }

    handleScroll() {
        if (this.animationHelper.isVisible && this.DOM_.player.readyState) {
            const {top, bottom} = this.DOM_.el.getBoundingClientRect();

            let disTop = top < (Services.winSize.height * .8) || bottom < Services.winSize.height;
            let disBottom = bottom > (Services.winSize.height * .2) || top > 0;

            if (Services.winSize.height > top && !this.isPageEnter) {
                this.isPageEnter = true;
                disTop = top < Services.winSize.height || bottom < Services.winSize.height
                disBottom = bottom > 40 || top > 0
            }

            if (this.DOM_.thumb) {
                if (disTop && disBottom) {
                    if (!this.isPlay && !this.isPlayerPlay) {
                        this.DOM_.thumb.play();
                        this.isPlay = true;
                    }
                } else if (this.DOM_.thumb.played) {
                    this.pauseVideoLoop();
                }
            } else { // cho nhung component khong co video loop
                if (!disTop || !disBottom) {
                    this.DOM_.player.pause();
                    this.btnWakup();
                }
            }
        }
    }

    pauseVideoLoop() {

        if (!this.DOM_.player.paused) {
            this.btnPlay.onChange();
        }
        if (!this.isPlayerPlay) {

            this.isPlay = false;
            if (this.DOM_.thumb) {
                this.DOM_.thumb.pause();
                gsap.to(this.DOM_.thumb, {opacity: 1, ease: 'power3.out', duration: .4});
            }
        }

        this.DOM_.player.pause();
        this.btnWakup();
    }

    pauseVideo() {

        if (this.DOM_.thumb) {
            this.DOM_.thumb.play();
            gsap.to(this.DOM_.thumb, {opacity: 1, ease: 'power3.ou', duration: .4});
        }

        this.isPlayerPlay = false;
        this.btnPlay.onChange();
        this.DOM_.player.pause();
        this.btnWakup();
    }

    playVideo() {
        if (!this.isPlayerPlay && this.DOM_.thumb) {
            gsap.to(this.DOM_.thumb, {opacity: 0, ease: 'power3.out', duration: .4});
            this.DOM_.thumb.pause();
        }

        if (!this.isPlayerPlay) {
            this.DOM_.btnSound.btn.classList.add('is-ready');
            this.isPlayerPlay = true;
        }

        this.btnPlay.onChange();
        this.DOM_.player.play();
        this.btnSleeping();
    }

    onMoving(event) {
        if (checkDeviceMobile()) return;
        const x = event.clientX - this.prop.left;
        const y = event.clientY - (this.prop.top - Math.abs(Services.smoothInstance_));
        this.btnPlay.onMove({x, y});
        this.btnSleeping();
    }

    btnWakup() {
        if (this.timeOutHide) clearTimeout(this.timeOutHide);
        this.btnPlay.sleeping = false;
        this.btnPlay.animationIn(0);
    }

    btnSleeping() {
        if (!this.DOM_.player.paused) {
            if (this.timeOutHide) clearTimeout(this.timeOutHide);
            this.timeOutHide = setTimeout(() => {
                this.btnPlay.sleep();
                this.btnPlay.sleeping = true;
            }, 800);
        }

        if (this.btnPlay.sleeping) {
            this.btnPlay.sleeping = false;
            this.btnPlay.animationIn(0);
        }
    }

    onMouseLeave() {
        this.btnPlay.onMove({x: this.prop.width / 2, y: this.prop.height / 2});
    }

    muted() {
        // this.soundActionClick.mouseDown();
        gsap.killTweensOf([this.DOM_.btnSound.iconSound, this.DOM_.btnSound.iconMuted]);
        if (this.DOM_.player.muted) {
            gsap.to(this.DOM_.btnSound.iconSound, {opacity: 1, ease: 'power3.out', duration: .5});
            gsap.to(this.DOM_.btnSound.iconMuted, {opacity: 0, ease: 'power3.out', duration: .5});
        } else {
            gsap.to(this.DOM_.btnSound.iconSound, {opacity: 0, ease: 'power3.out', duration: .5});
            gsap.to(this.DOM_.btnSound.iconMuted, {opacity: 1, ease: 'power3.out', duration: .5});
        }

        this.DOM_.player.muted = !this.DOM_.player.muted;
    }

    bindEvent() {
        this.DOM_.player.addEventListener('click', () => {
            if (!this.isPlay) return;
            if (this.timOutPlay) clearTimeout(this.timOutPlay);
            this.timOutPlay = setTimeout(() => {
                if (this.DOM_.player.paused) {
                    this.playVideo();
                } else {
                    this.pauseVideo();
                }
            }, 300);
        });
        this.DOM_.player.addEventListener('ended', () => {
            gsap.to(this.DOM_.thumb, {opacity: 1, ease: 'power3.ou', duration: .4});
            this.btnWakup();
            this.btnPlay.endVideo();
        });
        //  this.DOM_.videoWrap.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        // this.DOM_.videoWrap.addEventListener('mousemove', this.onMoving);
        this.DOM_.btnSound.btn.addEventListener('click', this.muted.bind(this));
    }


    getProp() {
        const {width, height, left, top} = this.DOM_.el.getBoundingClientRect();
        this.prop = {
            width,
            height,
            left,
            top: top + Math.abs(_SERVICES_.smoothInstance_)
        }
    }

    loop() {
        this.btnPlay.render();
        this.btnSoundEffect.render();
    }

    handleResize() {
        this.getProp();
        this.btnPlay.handleResize();
    }

    emitEvent() {
        this.getProp();
        this.btnPlay.getProp();
        this.btnPlay.onSet({x: this.prop.width / 2, y: this.prop.height / 2});
        //  gsap.ticker.add(this.loop);
        // _EMIT_EVENT_.on(SMOOTH_SCROLLING, this.handleScroll);
        _EMIT_EVENT_.on(PAGE_ENTER, this.handleScroll);
        _EMIT_EVENT_.on(HT_RESIZE, this.handleResize);
    }

    removeEvent() {
        // gsap.ticker.remove(this.loop);
        // _EMIT_EVENT_.off(SMOOTH_SCROLLING, this.handleScroll);
        _EMIT_EVENT_.off(PAGE_ENTER, this.handleScroll);
        _EMIT_EVENT_.off(HT_RESIZE, this.handleResize);
    }
}
