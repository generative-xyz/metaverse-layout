import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {GLTFResolver} from "./GLTFResolver";
import {Cache} from "three";

export class FBXResolver {
    constructor() {
        this.type = 'fbx'
        Cache.enabled = true;
        this.loader = new FBXLoader();
        this.loader.setPath('./public/character/');
    }

    resolve(item) {
        return new Promise(resolve => {
            this.loader.load(item.url, scene => {
                resolve(Object.assign(item, {scene}))
            })
        })
    }

    resolveWithAnimation(item) {

        const glb = new GLTFResolver();
        glb.loader.setPath('./public/character/');

        return new Promise(resolve => {

            const animations = [glb.resolve(item.model)];
            for (const key in item.animations) {
                animations.push(this.resolve(item.animations[key]));
            }

            Promise.all(animations).then(res => {
                resolve(item)
            });
        })
    }

    getModel(name, models) {

    }

    getAnimation(name, models) {

    }

    get(item) {
        return item.scene
    }
}
