import AnimationHelper from "../../libs/animation-helper";
import {_SERVICES_} from "../../libs/services";
import {
    checkDeviceMobile,
    inViewPointerMobile,
} from "../../libs/helper";
import {gsap} from "gsap";
import {ActionClick} from "../../animation/action-click/action-click";
import {BtnSound} from "./btn-sound";
import {_SERVICES_} from "../../libs/services";

export class VideoBgItem {
    constructor({el}) {
        this.DOM = {el};
        this.DOM.videoWrap = this.DOM.el.querySelector('.js-video__wrap');
        this.DOM.over = this.DOM.el.querySelector('.js-video__over');
        this.DOM.thumb = this.DOM.el.querySelector('.js-videoThumb');
        this.DOM.player = this.DOM.el.querySelector('.js-videoPlayer');

        this.DOM.btnSound = {
            wrap: this.DOM.el.querySelector('.js-video_sound'),
            btn: this.DOM.el.querySelector('.js-video_btnMute'),
            iconSound: this.DOM.el.querySelector('.js-video_btnMute_icon__sound'),
            iconMuted: this.DOM.el.querySelector('.js-video_btnMute_icon__mute'),
        };


        // this.btnPlay = new BtnPlay({el: this.DOM.el.querySelector('.js-video__player_btn')});
        this.timeOutHide = null;
        this.btnSoundEffect = new BtnSound({el: this.DOM.btnSound.wrap, btn: this.DOM.btnSound.btn});
      // this.soundActionClick = new ActionClick({el: this.DOM.btnSound.btn, wrapEffect: this.btnSoundEffect.DOM.bg});

        this.isAutoPlay = this.DOM.el.classList.contains('is-autoplay');
        this.isAnimated = false;
        this.isPageEnter = false;
        this.isPlay = this.DOM.thumb ? false : true;
        this.isPlayerPlay = false;
        this.animationHelper = new AnimationHelper(
            {
                el: this.DOM.el,
                animationIn: () => {
                    if (this.isAutoPlay) {
                        this.DOM.btnSound.btn.classList.add('is-ready');
                        this.DOM.player.play();
                    }
                    this.animationIn();
                }, //this.animationIn.bind(this),
                options: {
                    _to: {y: 70}
                },
                outScreen: this.removeEvent.bind(this),
                inScreen: this.emitEvent.bind(this),
            }
        );

        this.handleScroll = this.handleScroll.bind(this);
        this.onMoving = this.onMoving.bind(this);
        // this.loop = this.loop.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.bindEvent();

        if (checkDeviceMobile()) return;
         gsap.set(this.DOM.over, {opacity: 0, scale: 1.2});

    }

    animationIn(delay = 0) {
        if (checkDeviceMobile()) return;
        if (this.isAnimated) return;
        this.isAnimated = true;
        if (this.animationHelper) {
            delay += this.animationHelper.getDelayAnimation();
        }
        gsap.to(this.DOM.over, {opacity: 1, ease: 'power3.inOut', scale: 1, duration: 1.2, delay});
        //this.btnPlay.animationIn(delay + .3);
    }

    handleScroll() {
        if (this.animationHelper.isVisible && this.DOM.player.readyState) {
            const {top, bottom} = this.DOM.el.getBoundingClientRect();

            let disTop = top < (Services.winSize.height * .8) || bottom < Services.winSize.height
            let disBottom = bottom > (Services.winSize.height * .2) || top > 0

            if (Services.winSize.height > top && !this.isPageEnter) {
                this.isPageEnter = true;
                disTop = top < Services.winSize.height || bottom < Services.winSize.height
                disBottom = bottom > 40 || top > 0
            }

            if (this.DOM.thumb) {
                if (disTop && disBottom) {
                    if (!this.isPlay && !this.isPlayerPlay) {
                        this.DOM.thumb.play();
                        this.isPlay = true;
                    }
                } else if (this.DOM.thumb.played) {
                    this.pauseVideoLoop();
                }
            } else { // cho nhung component khong co video loop
                if (!disTop || !disBottom) {
                    this.DOM.player.pause();
                    this.btnWakup();
                }
            }
        }
    }

    pauseVideoLoop() {

        if (!this.DOM.player.paused) {
            //   this.btnPlay.onChange();
        }
        if (!this.isPlayerPlay) {
            this.DOM.thumb.pause();
            this.isPlay = false;
            gsap.to(this.DOM.thumb, {opacity: 1, ease: 'power3.out', duration: .4});
        }

        this.DOM.player.pause();
        this.btnWakup();
    }

    pauseVideo() {

        // this.DOM.thumb.play();
        // gsap.to(this.DOM.thumb, {opacity: 1, ease: 'power3.ou', duration: .4});

        //  this.btnPlay.onChange();
        this.DOM.player.pause();
        this.btnWakup();
    }

    playVideo() {
        if (!this.isPlayerPlay && this.DOM.thumb) {
            gsap.to(this.DOM.thumb, {opacity: 0, ease: 'power3.out', duration: .4});
            this.DOM.thumb.pause();
        }

        if (!this.isPlayerPlay) {
            this.DOM.btnSound.btn.classList.add('is-ready');
            this.isPlayerPlay = true;
        }

        //   this.btnPlay.onChange();
        this.DOM.player.play();
        this.btnSleeping();
    }

    onMoving(event) {
        if (checkDeviceMobile()) return;
        const x = event.clientX - this.prop.left;
        const y = event.clientY - (this.prop.top - Math.abs(Services.smoothInstance_));
        //  this.btnPlay.onMove({x, y});
        this.btnSleeping();
    }

    btnWakup() {
        if (this.timeOutHide) clearTimeout(this.timeOutHide);
        //   this.btnPlay.sleeping = false;
        //   this.btnPlay.animationIn(0);
    }

    btnSleeping() {
        if (!this.DOM.player.paused) {
            if (this.timeOutHide) clearTimeout(this.timeOutHide);
            this.timeOutHide = setTimeout(() => {
                //        this.btnPlay.sleep();
                //       this.btnPlay.sleeping = true;
            }, 800);
        }

        // if (this.btnPlay.sleeping) {
        //     this.btnPlay.sleeping = false;
        //     this.btnPlay.animationIn(0);
        // }
    }

    onMouseLeave() {
        // this.btnPlay.onMove({x: this.prop.width / 2, y: this.prop.height / 2});
    }

    muted() {
        // this.soundActionClick.mouseDown();
        gsap.killTweensOf([this.DOM.btnSound.iconSound, this.DOM.btnSound.iconMuted]);
        if (this.DOM.player.muted) {
            gsap.to(this.DOM.btnSound.iconSound, {opacity: 1, ease: 'power3.out', duration: .5});
            gsap.to(this.DOM.btnSound.iconMuted, {opacity: 0, ease: 'power3.out', duration: .5});
        } else {
            gsap.to(this.DOM.btnSound.iconSound, {opacity: 0, ease: 'power3.out', duration: .5});
            gsap.to(this.DOM.btnSound.iconMuted, {opacity: 1, ease: 'power3.out', duration: .5});
        }

        this.DOM.player.muted = !this.DOM.player.muted;
    }

    bindEvent() {
        // this.DOM.player.addEventListener('click', () => {
        //     if (!this.isPlay) return;
        //     if (this.timOutPlay) clearTimeout(this.timOutPlay);
        //     this.timOutPlay = setTimeout(() => {
        //         if (this.DOM.player.paused) {
        //             this.playVideo();
        //         } else {
        //             this.pauseVideo();
        //         }
        //     }, 300);
        // });
        // this.DOM.player.addEventListener('ended', () => {
        //     //gsap.to(this.DOM.thumb, {opacity: 1, ease: 'power3.ou', duration: .4});
        //     this.btnWakup();
        //     // this.btnPlay.endVideo();
        // });
        //this.DOM.videoWrap.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        //this.DOM.videoWrap.addEventListener('mousemove', this.onMoving);
        this.DOM.btnSound.btn.addEventListener('click', this.muted.bind(this));
    }


    getProp() {
        const scrollTop = Math.abs(services.smoothInstance_);
        const {width, height, left, top} = this.DOM.el.getBoundingClientRect();
        this.prop = {
            width,
            height,
            left,
            top: top + scrollTop
        }
    }

    loop() {
        //this.btnPlay.render();
        this.btnSoundEffect.render();
    }

    handleResize() {
        this.getProp();
        // this.btnPlay.handleResize();
    }

    emitEvent() {
        this.DOM.player.play();
       // this.getProp();
        // this.btnPlay.getProp();
        //   this.btnPlay.onSet({x: this.prop.width / 2, y: this.prop.height / 2});
        //  gsap.ticker.add(this.loop);
      //  _EMIT_EVENT_.on(SMOOTH_SCROLLING, this.handleScroll);
      //  _EMIT_EVENT_.on(PAGE_ENTER, this.handleScroll);
       // _EMIT_EVENT_.on(HT_RESIZE, this.handleResize);
    }

    removeEvent() {
        this.DOM.player.pause();
        // gsap.ticker.remove(this.loop);
       // _EMIT_EVENT_.off(SMOOTH_SCROLLING, this.handleScroll);
       // _EMIT_EVENT_.off(PAGE_ENTER, this.handleScroll);
       // _EMIT_EVENT_.off(HT_RESIZE, this.handleResize);
    }
}
