class ObServerApi {

    constructor({el, inScreen, outScreen}) {
        this.animationOb = {
            el,
            inScreen,
            outScreen
        };
        this.isVisible = false;
        this.init();
    }

    init() {
        const {el} = this.animationOb;
        this.OBServer = new IntersectionObserver(entries => {
            this.isVisible = entries[0].isIntersecting;
            const {outScreen, inScreen} = this.animationOb;
            if (!this.isVisible) {
                if (outScreen) outScreen();
            } else {
                if (inScreen) inScreen()
            }
        });
        this.OBServer.observe(el);
    }

    removeOb() {
        if (!this.OBServer) return;
        const {el} = this.animationOb;
        this.OBServer.unobserve(el);
        this.OBServer.disconnect();
        this.isVisible = false;
    }

    isInViewPointer() {
        return this.isVisible;
    }
}

export default ObServerApi;