import {
    Box3,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Texture,
    Vector3,
    DoubleSide, LinearFilter,
    Object3D,
    Sphere,
    BufferAttribute,
    Matrix4, Vector2, Skeleton, MeshStandardMaterial,
} from 'three'


export const modelGetSize = (model) => {
    //size model
    const mSize = new Box3().setFromObject(model);
    return mSize.getSize(new Vector3());
};

export const modelGetCentroid = (model) => {
    //size model
    const mSize = new Box3().setFromObject(model);
    return mSize.getCenter(new Vector3());
};


export const getFov = (camera) => {
    return Math.floor(
        (2 *
            Math.atan(camera.getFilmHeight() / 2 / camera.getFocalLength()) *
            180) /
        Math.PI
    );
};

//qua xin xo luon
export const fitCameraToObject = (camera, object, offset, controls) => {
    offset = offset || 1.5;
    const size = new Vector3();
    const center = new Vector3();
    const box = new Box3();

    box.makeEmpty();
    box.expandByObject(object);

    box.getSize(size);
    box.getCenter(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target.clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance);

    controls.maxDistance = distance * 10;
    controls.target.copy(center);

    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    camera.position.copy(controls.target).sub(direction);

    controls.update();

};

export const meshGetSize = (mesh) => {
    if (mesh.geometry.boundingBox) {

        const size = new Vector3();
        const box = new Box3();
        box.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
        box.getSize(size);

        return {box, size};
    }

    return null;
};

export const formatBytes = (bytes, decimals) => {

    if (bytes === 0) return '0 bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'KB', 'MB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

};

/**
 *
 * @param txt
 * @param hWorldTxt
 * @param hWorldAll
 * @param hPxTxt
 * @param fgcolor
 * @param bgcolor
 * @returns {Mesh}
 */
export const createTextTexture = (txt, hWorldTxt, hWorldAll, hPxTxt, fgcolor, bgcolor = undefined) => {

    const kPxToWorld = hWorldTxt / hPxTxt;                // Px to World multplication factor
    const hPxAll = Math.ceil(hWorldAll / kPxToWorld);     // hPxAll: height of the whole texture canvas

    const txtcanvas = document.createElement('canvas'); // create the canvas for the texture
    const ctx = txtcanvas.getContext('2d');
    ctx.font = hPxTxt + 'px sans-serif';
    // now get the widths
    const wPxTxt = ctx.measureText(txt).width;         // wPxTxt: width of the text in the texture canvas
    const wWorldTxt = wPxTxt * kPxToWorld;               // wWorldTxt: world width of text in the plane
    const wWorldAll = wWorldTxt + (hWorldAll - hWorldTxt); // wWorldAll: world width of the whole plane
    const wPxAll = Math.ceil(wWorldAll / kPxToWorld);    // wPxAll: width of the whole texture canvas

    txtcanvas.width = wPxAll;
    txtcanvas.height = hPxAll;

    if (bgcolor !== undefined) { // fill background if desired (transparent if none)
        ctx.fillStyle = '#' + bgcolor.toString(16).padStart(6, '0');
        ctx.fillRect(0, 0, wPxAll, hPxAll);
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#' + fgcolor.toString(16).padStart(6, '0'); // fgcolor
    ctx.font = hPxTxt + 'px sans-serif';   // needed after resize
    ctx.fillText(txt, wPxAll / 2, hPxAll / 2.3); // the deed is done

    const texture = new Texture(txtcanvas); // now make texture
    texture.minFilter = LinearFilter;     // eliminate console message
    texture.needsUpdate = true;                 // duh

    const geometry = new PlaneGeometry(wWorldAll, hWorldAll);
    const material = new MeshBasicMaterial(
        {map: texture, color: 0xffffff});

    const mesh = new Mesh(geometry, material);
    mesh.wWorldTxt = wWorldTxt; // return the width of the text in the plane
    mesh.wWorldAll = wWorldAll; //    and the width of the whole plane
    mesh.wPxTxt = wPxTxt;       //    and the width of the text in the texture canvas

    mesh.wPxAll = wPxAll;       //    and the width of the whole texture canvas
    mesh.hPxAll = hPxAll;       //    and the height of the whole texture canvas
    mesh.ctx = ctx;             //    and the 2d texture context, for any glitter
    return mesh;

};


export const createBoundingSphere = (object3d, out) => {

    const boundingSphere = out;
    const center = boundingSphere.center;
    const _box3A = new Box3();
    const _v3A = new Vector3();

    _box3A.makeEmpty();
    // find the center
    object3d.traverseVisible((object) => {

        if (!object.isMesh)
            return;
        _box3A.expandByObject(object);
    });
    _box3A.getCenter(center);

    // find the radius
    let maxRadiusSq = 0;
    object3d.traverseVisible((object) => {

        if (!(object).isMesh)
            return;

        const mesh = (object);
        const geometry = mesh.geometry.clone();
        geometry.applyMatrix4(mesh.matrixWorld);

        if (geometry.isBufferGeometry) {

            const bufferGeometry = geometry;
            const position = bufferGeometry.attributes.position

            for (let i = 0, l = position.count; i < l; i++) {

                _v3A.fromBufferAttribute(position, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_v3A));

            }

        } else {

            // for old three.js, which supports both BufferGeometry and Geometry
            // this condition block will be removed in the near future.
            const position = geometry.attributes.position;
            const vector = new Vector3();

            for (let i = 0, l = position.count; i < l; i++) {

                vector.fromBufferAttribute(position, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));

            }

        }

    });

    boundingSphere.radius = Math.sqrt(maxRadiusSq);
    return boundingSphere;

};

export const resetPositionChildrenOfModel = (object) => {
    if (object.isMesh) {
        const positionCube = new Vector3();
        positionCube.setFromMatrixPosition(object.matrixWorld);

        return positionCube;

    }
    return false;
};


export const calcCoverTexture = (tex, contentMode = 'AspectFit') => {

    const u_fit = new Vector2(1, 1);
    const textureAspect = tex.image.width / tex.image.height;
    const frameAspect = 1;
    const textureFrameRatio = textureAspect / frameAspect;
    // const portraitTexture = textureAspect < 1;
    const portraitFrame = frameAspect < 1;

    if (contentMode === 'AspectFill') {
        if (portraitFrame)
            u_fit.x = 1 / textureFrameRatio;
        else
            u_fit.y = textureFrameRatio;
    } else if (contentMode === 'AspectFit') {
        if (portraitFrame)
            u_fit.y = textureFrameRatio;
        else
            u_fit.x = 1 / textureFrameRatio;
    }

    return u_fit;
}


export const fixTexture = (planeWidth, planeHeight, texture) => {

    const planeAspect = planeWidth / planeHeight;
    const imageAspect = (texture.image.width || texture.image.videoWidth) / (texture.image.height || texture.image.videoHeight);
    const aspect = imageAspect / planeAspect;

    texture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    texture.repeat.x = aspect > 1 ? 1 / aspect : 1;

    texture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    texture.repeat.y = aspect > 1 ? 1 : aspect;

    return texture;
}

export const StringToColour = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

export const cloneGltf = (gltf) => {
    const clone = {
        animations: gltf.animations,
        scene: gltf.scene.clone(true)
    };

    const skinnedMeshes = {};

    gltf.scene.traverse((node) => {
        if (node.isSkinnedMesh) {
            skinnedMeshes[node.name] = node;
        }
    });

    const cloneBones = {};
    const cloneSkinnedMeshes = {};

    clone.scene.traverse((node) => {
        if (node.isBone) {
            cloneBones[node.name] = node;
        }

        if (node.isSkinnedMesh) {
            cloneSkinnedMeshes[node.name] = node;
        }
    });

    for (const name in skinnedMeshes) {
        const skinnedMesh = skinnedMeshes[name];
        const skeleton = skinnedMesh.skeleton;
        const cloneSkinnedMesh = cloneSkinnedMeshes[name];

        const orderedCloneBones = [];

        for (let i = 0; i < skeleton.bones.length; ++i) {
            const cloneBone = cloneBones[skeleton.bones[i].name];
            orderedCloneBones.push(cloneBone);
        }

        cloneSkinnedMesh.bind(
            new Skeleton(orderedCloneBones, skeleton.boneInverses),
            cloneSkinnedMesh.matrixWorld);
    }

    return clone;
}
