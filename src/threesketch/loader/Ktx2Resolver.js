
import {KTX2Loader} from "three/examples/jsm/loaders/KTX2Loader";

export class Ktx2Resolver {
    constructor(renderer) {
        this.type = 'gltf'
        this.loader = new KTX2Loader();
        this.loader.setTranscoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/basis/' );
        this.loader.detectSupport( renderer );
    }

    resolve(item) {

        return new Promise(resolve => {
            this.loader.load(item.url, texture => {
                resolve(Object.assign(item, { texture }))
            });
        })
    }

    get(item) {
        return item.scene
    }
}
