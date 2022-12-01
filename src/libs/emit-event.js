import Emitter from "minivents"

export const SMOOTH_SCROLLING = 'SMOOTH_SCROLLING';
export const OBSERVER_HEIGHT_CHANGED = 'OBSERVER_HEIGHT_CHANGED';
export const SMOOTH_DISABLED = 'SMOOTH_DISABLED';
export const SMOOTH_ENABLED = 'SMOOTH_ENABLED';
export const APP_LOAED = 'APP_LOAED';
export const BEFORE_LOADING = 'BEFORE_LOADING';
export const HT_RESIZE_WIDTH = 'HT_RESIZE_WIDTH';
export const HT_RESIZE_HEIGHT = 'HT_RESIZE_HEIGHT';
export const BEFORE_HT_RESIZE = 'BEFORE_HT_RESIZE';
export const HT_RESIZE = 'HT_RESIZE';
export const SVG_DOCUMENT = 'SVG_DOCUMENT';
export const SVG_ELEMENT = 'SVG_ELEMENT';
export const AJAX_CONTENT_LOADED = 'AJAX_CONTENT_LOADED';
export const SMOOTH_SCROLLING_STOP = 'SMOOTH_SCROLLING_STOP';
export const WHEEL_SCROLLING = 'WHEEL_SCROLLING';
export const WHEEL_SCROLLING_LOCK = 'WHEEL_SCROLLING_LOCK';
export const MOVE_TO = 'MOVE_TO';
export const SKIP_TO = 'SKIP_TO';
export const GO_TO_SECTION = 'GO_TO_SECTION';
export const RESET_SCROLL = 'RESET_SCROLL';
//
export const REGISTER_LOADER = 'REGISTER_LOADER';
export const UN_REGISTER_LOADER = 'UN_REGISTER_LOADER';
export const AFTER_LOADER_INIT = 'AFTER_LOADER_INIT';
export const PAGE_ONE = 'PAGE_ONE';

//
export const PAGE_AJAX_RENDERED = 'PAGE_AJAX_RENDERED';
export const PAGE_AFTER = 'PAGE_AFTER';
export const WIN_PAGE_LOADED = 'WIN_PAGE_LOADED';
export const PAGE_LOADED = 'PAGE_LOADED';
export const PAGE_ENTER = 'PAGE_ENTER';
//
export const PAGE_BEFORE_LEAVE = 'PAGE_BEFORE_LEAVE';
export const PAGE_LEAVE = 'PAGE_LEAVE';

export const ANIMATION_TAB_CHANGE = 'ANIMATION_TAB_CHANGE';
export const TAB_CHANGED_ANIMATION = 'TAB_CHANGED_ANIMATION';

export const REMOVE_DOM_OUT = 'REMOVE_DOM_OUT';
export const ARTICLE_LOADED = 'ARTICLE_LOADED';

export const VIDEO_PAUSE = 'VIDEO_PAUSE';
export const VIDEO_PLAY = 'VIDEO_PLAY';
export const VIDEO_OUT = 'VIDEO_OUT';

export const CURSOR_EXPAND = 'CURSOR_EXPAND';

export const SET_NEXT_THUMBNAIL = 'SET_NEXT_THUMBNAIL';
export const NEXT_SCREEN = 'NEXT_SCREEN';
export const BACK_TOP = 'BACK_TOP';

export const HEADER_UPDATE_COLOR = 'HEADER_UPDATE_COLOR';
export const HEADER_LISTEN_COLOR = 'HEADER_LISTEN_COLOR';
export const NEXT_SCREEN_POPUP = 'NEXT_SCREEN_POPUP';
export const POPUP_ENTER = 'POPUP_ENTER';
export const POPUP_SMOOTH_SCROLLING = 'POPUP_SMOOTH_SCROLLING';

export const CUSTOM_HR_ROW_SCROLLING = 'CUSTOM_HR_ROW_SCROLLING';

class EmitEvent extends Emitter {
    constructor() {
        super();
    }
}

export const _EMIT_EVENT_ = new EmitEvent();