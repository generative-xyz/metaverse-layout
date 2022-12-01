
export class TextureResolver {
    constructor() {
        this.type = 'texture'
    }

    resolve(item) {

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.addEventListener('load', function (event) {
                resolve(Object.assign(item, {data: new Uint16Array(event.target.response)}));
            }, false);

            request.addEventListener('error', function (event) {
                reject(event);
            }, false);

            if (this.crossOrigin !== undefined) request.crossOrigin = this.crossOrigin;
            request.open('GET', item.url, true);
            request.responseType = 'arraybuffer';
            request.send(null);
        });
    }

    get(item) {
        return item.data
    }
}
