import {
  _EMIT_EVENT_,
  ANIMATION_TAB_CHANGE,
  OBSERVER_HEIGHT_CHANGED, PAGE_BEFORE_LEAVE,
  PAGE_ENTER, PAGE_LEAVE,
  PAGE_LOADED, RESET_SCROLL,
  SMOOTH_SCROLLING,
} from './emit-event'
import { getScrollTop } from './helper'

class Services {


  constructor() {

    this.offsetResponsive = { xl: 1600, lg: 1320, md: 1024, sm: 768 }
    this.maxScrollHeight_ = 0
    this.isSmoothScrolling = true
    this.isPageEnter = false
    this.scrollingType = 'contentLoaded'
    this.pageTransition = 'default'
    this.pageName_ = 'Loading'
    this.scrollHistory_ = []

    this.smoothInstance_ = 0
    // this.DOM = { main: document.querySelector('[data-scroll-container]') }
    this.DOM = { main: document.body }
    this.isResizeObserver = window.ResizeObserver
    this.clearEvents_ = []

    this.handleResize()
    this.handleScrolling = this.handleScrolling.bind(this)
    this.bindEvent()
    this.emitEvent()

  }

  handleScrolling({ instance }) {
    this.smoothInstance_ = instance
    if (this.scrollingType !== 'contentScrolling') this.scrollingType = 'contentScrolling'
  }

  handleWinScrolling() {
    this.scrollingType = 'contentScrolling'
    this.smoothInstance_ = getScrollTop()
  }

  handleResize() {
    this.winSize = { width: window.innerWidth, height: window.innerHeight }
    this.winSize.aspectRatio = this.winSize.width / this.winSize.height
    this.winSize.devicePixelRatio = window.devicePixelRatio
  }

  bindEvent() {
    window.addEventListener('resize', this.handleResize.bind(this))
    if (this.isResizeObserver) {
      const resizeObserver = new ResizeObserver(() => _EMIT_EVENT_.emit(OBSERVER_HEIGHT_CHANGED))
      resizeObserver.observe(this.DOM.main)
    }
  }

  _addClearEvent(func) {
    this.clearEvents_.push(func)
  }

  _runClearEvents() {
    for (let i = 0; i < this.clearEvents_.length; i++) {
      this.clearEvents_[i]()
    }
    this.clearEvents_ = []
  }

  _pageBeforeLeave({ path }) {
    if (this.scrollHistory_.length === 0) {
      this.scrollHistory_[0] = { path, scrollTop: this.smoothInstance_ }
    } else if (this.scrollHistory_.length === 1) {
      this.scrollHistory_[1] = { path, scrollTop: this.smoothInstance_ }
    } else {
      this.scrollHistory_[0] = this.scrollHistory_[1]
      this.scrollHistory_[1] = { path, scrollTop: this.smoothInstance_ }
    }
  }

  _resetScroll() {
    this.smoothInstance_ = 0
  }

  emitEvent() {

    _EMIT_EVENT_.on(SMOOTH_SCROLLING, this.handleScrolling)
    _EMIT_EVENT_.on(PAGE_ENTER, () => {
      this.isPageEnter = true
      this.scrollingType = 'contentLoaded'
    })

    _EMIT_EVENT_.on(ANIMATION_TAB_CHANGE, () => this.scrollingType = 'contentScrolling')
    _EMIT_EVENT_.on(PAGE_LOADED, () => {
      this.scrollingType = 'contentLoaded'
    })

    _EMIT_EVENT_.on(PAGE_LEAVE, () => {
      this.smoothInstance_ = 0
      this.isPageEnter = false
      this._runClearEvents()
    })

    _EMIT_EVENT_.on(PAGE_BEFORE_LEAVE, this._pageBeforeLeave.bind(this))
    _EMIT_EVENT_.on(RESET_SCROLL, this._resetScroll.bind(this))
  }
}

export const _SERVICES_ = new Services()
