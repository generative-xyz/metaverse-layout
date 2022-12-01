import {load} from "recaptcha-v3";

class GgCaptcha {

    static ggCaptchaKey = '6Lf_R60gAAAAANVKLI0a_JSIejeEbFwcN8AIdFcn'; //SITE KEY

    createGGToken(callback) {
        load(GgCaptcha.ggCaptchaKey).then((recaptcha) => {
            recaptcha.execute('contact').then((token) => {
                callback(token);
            });
        });
    }
}

export const _GG_CAPTCHA_ = new GgCaptcha();