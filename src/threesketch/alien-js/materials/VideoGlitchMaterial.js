import { GLSL3, NoBlending, RawShaderMaterial, Uniform } from 'three';

import vertexShader from '../shaders/VideoGlitchPass.vert.js';
import fragmentShader from '../shaders/VideoGlitchPass.frag.js';

export class VideoGlitchMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                tMap: new Uniform(null),
                uDistortion: new Uniform(1.43),
                uDistortion2: new Uniform(0.15),
                uSpeed: new Uniform(1),
                uTime: new Uniform(0)
            },
            vertexShader,
            fragmentShader,
            blending: NoBlending,
            depthWrite: false,
            depthTest: false
        });
    }
}
