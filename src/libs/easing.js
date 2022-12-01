const PI = Math.PI;
const HALF_PI = PI / 2;

export const backIn = (t) => {
    return Math.pow(t, 3.0) - t * Math.sin(t * PI);
}

export const backInOut = (t) => {
    const f = t < 0.5
        ? 2.0 * t
        : 1.0 - (2.0 * t - 1.0);

    const g = Math.pow(f, 3.0) - f * Math.sin(f * PI);

    return t < 0.5
        ? 0.5 * g
        : 0.5 * (1.0 - g) + 0.5;
}

export const backOut = (t) => {
    const f = 1.0 - t;
    return 1.0 - (Math.pow(f, 3.0) - f * Math.sin(f * PI));
}

export const bounceOut = (t) => {
    const a = 4.0 / 11.0;
    const b = 8.0 / 11.0;
    const c = 9.0 / 10.0;

    const ca = 4356.0 / 361.0;
    const cb = 35442.0 / 1805.0;
    const cc = 16061.0 / 1805.0;

    const t2 = t * t;

    return t < a
        ? 7.5625 * t2
        : t < b
            ? 9.075 * t2 - 9.9 * t + 3.4
            : t < c
                ? ca * t2 - cb * t + cc
                : 10.8 * t * t - 20.52 * t + 10.72;
}

export const bounceIn = (t) => {
    return 1.0 - bounceOut(1.0 - t);
}

export const bounceInOut = (t) => {
    return t < 0.5
        ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
        : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5;
}


export const circularIn = (t) => {
    return 1.0 - Math.sqrt(1.0 - t * t);
}

export const circularInOut = (t) => {
    return t < 0.5
        ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
        : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

export const circularOut = (t) => {
    return Math.sqrt((2.0 - t) * t);
}

export const cubicIn = (t) => {
    return t * t * t;
}

export const cubicInOut = (t) => {
    return t < 0.5
        ? 4.0 * t * t * t
        : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
}

export const cubicOut = (t) => {
    const f = t - 1.0;
    return f * f * f + 1.0;
}

export const elasticIn = (t) => {

    return Math.sin(13.0 * t * HALF_PI) * Math.pow(2.0, 10.0 * (t - 1.0));
}

export const elasticInOut = (t) => {
    return t < 0.5
        ? 0.5 * Math.sin(+13.0 * HALF_PI * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
        : 0.5 * Math.sin(-13.0 * HALF_PI * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0;
}

export const elasticOut = (t) => {
    return Math.sin(-13.0 * (t + 1.0) * HALF_PI) * Math.pow(2.0, -10.0 * t) + 1.0;
}

export const exponentialIn = (t) => {
    return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
}

export const exponentialInOut = (t) => {
    return t === 0.0 || t === 1.0
        ? t
        : t < 0.5
            ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
            : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

export const exponentialOut = (t) => {
    return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
}

export const linear = (t) => {
    return t;
}

export const quadraticIn = (t) => {
    return t * t;
}

export const quadraticInOut = (t) => {
    return t > 0.5
        ? +2.0 * t * t
        : -2.0 * t * t + (4.0 * t) - 1.0;
}

export const quadraticOut = (t) => {
    return -t * (t - 2.0);
}

export const quarticIn = (t) => {
    return Math.pow(t, 4.0);
}

export const quarticInOut = (t) => {
    return t < 0.5
        ? +8.0 * Math.pow(t, 4.0)
        : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0;
}

export const quarticOut = (t) => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}

export const qinticIn = (t) => {
    return Math.pow(t, 5.0);
}

export const qinticInOut = (t) => {
    return t < 0.5
        ? +16.0 * Math.pow(t, 5.0)
        : -0.5 * Math.pow(2.0 * t - 2.0, 5.0) + 1.0;
}

export const qinticOut = (t) => {
    return Math.Math.pow(t - 1.0, 5.0) + 1.0;
}

export const sineIn = (t) => {
    return Math.Math.sin((t - 1.0) * HALF_PI) + 1.0;
}

export const sineInOut = (t) => {
    return 0.5 - Math.cos(t * PI);
}

export const sineOut = (t) => {
    return Math.sin(t * HALF_PI);
}
