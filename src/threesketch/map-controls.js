import CameraControls from 'camera-controls';

import {
    Box3,
    MathUtils,
    Matrix4,
    MOUSE,
    Quaternion,
    Raycaster,
    Sphere,
    Spherical,
    Vector2,
    Vector3,
    Vector4
} from 'three';
import {createBoundingSphere, modelGetCentroid} from './three-helper';

const subsetOfTHREE = {
    MOUSE: MOUSE,
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    Quaternion: Quaternion,
    Matrix4: Matrix4,
    Spherical: Spherical,
    Box3: Box3,
    Sphere: Sphere,
    Raycaster: Raycaster,
    MathUtils: {
        DEG2RAD: MathUtils.DEG2RAD,
        clamp: MathUtils.clamp,
    },
};

CameraControls.install({THREE: subsetOfTHREE});

export class MapControl {

    constructor(camera, renderDom, onCameraUpdate = null, onCameraStart = null, onCameraControl = null) {

        this.controls = new CameraControls(camera, renderDom);
        this.controls.enabled = false;
        this.controls.verticalDragToForward = true;
        this.controls.enableDamping = true;
        this.controls.enableRotate = false;

        this.controls.dampingFactor = 1.05;
        this.controls.draggingDampingFactor = 0.05;

        this.controls.enableZoom = false;
        this.controls.screenSpacePanning = false;

        this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE;

        this.controls.mouseButtons.left = CameraControls.ACTION.TRUCK;
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;

        this.controls.touches.one = CameraControls.ACTION.TOUCH_TRUCK;
        this.controls.touches.tow = CameraControls.ACTION.NONE;
        this.controls.touches.three = CameraControls.ACTION.NONE;

        this.isReadySave = true;

        // this.createPanel();
        this.onCameraControl = onCameraControl;
        this.onCameraUpdate = onCameraUpdate;
        this.onCameraStart = onCameraStart;

        this.onCameraControl && this.controls.addEventListener('update', this.onCameraUpdate);
        this.onCameraControl && this.controls.addEventListener('control', this.onCameraControl);
        this.onCameraStart && this.controls.addEventListener('controlstart', this.onCameraStart);
        this.onCameraUpdate && this.controls.addEventListener('sleep', this.onCameraUpdate);
    }

    update(delta) {
        this.controls.update(delta);
    }


    fitToSphere(sphereOrMesh, enableTransition, isCenter = false) {

        const promises = [];
        const isSphere = sphereOrMesh instanceof Sphere;
        const _sphere = new Sphere();

        const boundingSphere_1 = isSphere ?
            _sphere.copy(sphereOrMesh) :
            createBoundingSphere(sphereOrMesh, _sphere);

        const bbox = new Box3().setFromObject(sphereOrMesh);
        const center = new Vector3();
        bbox.getCenter(center);

        const boundingSphere = bbox.getBoundingSphere(new Sphere(center));
        boundingSphere.radius = boundingSphere_1.radius

        if (this.isTopView) {
            this.controls.minPolarAngle = Math.PI / 2.6;
            this.controls.maxPolarAngle = Math.PI / 2.1;
            promises.push(
                this.controls.rotateTo(this.controls.azimuthAngle, Math.PI / 2.3, true)
            );
        }


        promises.push(
            this.controls.moveTo(
                boundingSphere.center.x,
                boundingSphere.center.y + (boundingSphere.radius / 3),
                boundingSphere.center.z,
                enableTransition,
            )
        );


        if (this.controls._camera.isPerspectiveCamera) {

            const distanceToFit = this.controls.getDistanceToFitSphere(boundingSphere.radius);
            promises.push(this.controls.dollyTo(distanceToFit, enableTransition));

        } else if (this.controls._camera.isOrthographicCamera) {

            const width = this.controls._camera.right - this.controls._camera.left;
            const height = this.controls._camera.top - this.controls._camera.bottom;
            const diameter = 1.8 * boundingSphere.radius;
            const zoom = Math.min(width / diameter, height / diameter);
            promises.push(this.controls.zoomTo(zoom, enableTransition));

        }

        if (!isCenter) {
            const xChange = window.innerWidth < 768 ? 0 : (boundingSphere.radius / 3);
            promises.push(this.controls.setFocalOffset(xChange, 0, 0, enableTransition));
        } else {
            promises.push(this.controls.setFocalOffset(0, 0, 0, enableTransition));
        }

        return Promise.all(promises);

    }

    fitToSphereNotZoom(sphereOrMesh, enableTransition) {

        const promises = [];
        const isSphere = sphereOrMesh instanceof Sphere;
        const _sphere = new Sphere();
        let boundingSphere_1 = null;

        if (!sphereOrMesh.isMesh) {
            boundingSphere_1 = isSphere ?
                _sphere.copy(sphereOrMesh) :
                createBoundingSphere(sphereOrMesh, _sphere);
        } else {
            boundingSphere_1 = sphereOrMesh.geometry.boundingSphere;
        }

        const bbox = new Box3().setFromObject(sphereOrMesh);
        const center = new Vector3();
        bbox.getCenter(center);

        const boundingSphere = bbox.getBoundingSphere(new Sphere(center));
        boundingSphere.radius = boundingSphere_1.radius

        promises.push(
            this.controls.moveTo(
                boundingSphere.center.x,
                boundingSphere.center.y + (boundingSphere.radius / 4),
                boundingSphere.center.z,
                enableTransition,
            )
        );

        promises.push(this.controls.setFocalOffset(0, 0, 0, enableTransition));
        return Promise.all(promises);

    }

    clear() {
        this.controls.reset(false);
        this.onCameraUpdate && this.controls.removeEventListener('update', this.onCameraUpdate);
        this.onCameraControl && this.controls.removeEventListener('control', this.onCameraControl);
        this.onCameraStart && this.controls.removeEventListener('controlstart', this.onCameraStart);
        this.controls.dispose();
    }
}