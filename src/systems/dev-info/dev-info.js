class DevInfo {
    constructor(status) {
        this.status = status;
        this.devInfo = {
            Email: 'dev.hontran@gmail.com',
            website: 'https://hontran.dev',
            Facebook: 'https://www.facebook.com/dev.hontran',
            Twitter: 'https://twitter.com/DevHontran',
            Linkedin: 'https://www.linkedin.com/in/hon-tran-0218a1174',
            Copyright: 2022
        };
        this.init();
        this.bindEvent();
    }

    init() {
        if (this.status !== 'dev') {
            console.log("\n\n%cSTOP!!!!!! \n\n%cYou're now officially part of our family, thank you for using \nour services and for having trust in us. We look forward \nto seeing you again. \n\nSincerely, \n%cThe Team @Thinkfuture \n\n\n", "color: #fff000; font-size:25px;", "", "font-weight: bold;");
            console.log = () => {
            };
        }
    }

    showDevInfo() {
        for (let key in this.devInfo) {
            console.log(key.toString(), this.devInfo[key]);
        }
    }

    bindEvent() {
        document.addEventListener('devInfo', () => this.showDevInfo());
    }
}

export default DevInfo;
