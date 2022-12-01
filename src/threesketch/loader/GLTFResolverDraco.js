import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";

export class GLTFResolverDraco {
  constructor() {
    this.type = 'gltf'
    this.loader = new GLTFLoader()
  }

  resolve(item) {

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/' );
    this.loader.setDRACOLoader( dracoLoader );

    return new Promise(resolve => {
      this.loader.load(item.url, scene => {
        resolve(Object.assign(item, { scene }))
      })
    })
  }

  get(item) {
    return item.scene
  }
}
