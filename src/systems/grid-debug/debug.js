class GridDebug {

    constructor() {
        this.DOM = {main: document.querySelector('.js-grid-debug')};
        if (!this.DOM.main) return;
        this.countTouch = 0;
        this.enabled = localStorage.getItem("isGrid");
        this.layout();
        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener('touchstart', this.handleTouchStart.bind(this));
    }

    handleTouchStart() {
        if (this.timeClear) clearTimeout(this.timeClear);
        this.countTouch++;
        if (this.countTouch >= 3) {
            this.countTouch = 0;
            this.enabled = (this.enabled === 'false') ? 'true' : 'false';
            this.layout();
            localStorage.setItem("isGrid", String(this.enabled));
        } else {
            this.timeClear = setTimeout(() => {
                this.countTouch = 0;
            }, 200);
        }
    }

    handleKeyDown(ev) {
        const key = ev.which || ev.keyCode;
        const isShift = !!ev.shiftKey;
        if (isShift && key === 71) {
            this.enabled = (this.enabled === 'false') ? 'true' : 'false';
            this.layout();
            localStorage.setItem("isGrid", String(this.enabled));
        }
    }

    layout() {
        if (this.enabled !== 'false') {
            this.DOM.main.style.display = 'block';
        } else {
            this.DOM.main.style.display = 'none';
        }
    }
}

export default GridDebug;
