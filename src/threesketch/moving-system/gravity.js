import { rand } from "@ThreeSketch/utils/rand";
import { Vec3 } from "@ThreeSketch/utils/vec3";

const EPSILON = 1e-9;
const G = 6.6743e-11;

export class GravityMovingSystem {
  constructor() {}

  init(numMovingObjects, speed, mergeOnImpact) {
    this.numMovingObjects = numMovingObjects;
    this.speed = speed;
    this.mergeOnImpact = mergeOnImpact;

    this.movingObjects = [];
    for (let i = 0; i < numMovingObjects; i++) {
      let p = Vec3.rand(-1, 1);
      let v = Vec3.rand(-0.5, 0.5);
      let m = rand(1e6, 5e6);
      if (i == 0) {
        p = Vec3.rand(0, 0);
        v = Vec3.rand(0, 0);
        m = 1e10;
      }
      this.movingObjects.push(new GravityMovingObject(p, v, m));
    }
    this.startTime = Date.now();
    this.lastTime = Date.now();
  }

  // Get gravity force of b acting on a
  getGravityForce(a, b) {
    // f = ab * m_a * m_b / |ab|^3 where ab = p_a - p_b
    let vec_ab = Vec3.sub(b.p, a.p);
    return Vec3.mul(
      vec_ab,
      (G * a.m * b.m) / (Math.pow(vec_ab.length(), 3) + EPSILON)
    );
  }

  update() {
    // calculate gravitational force
    for (let i = 1; i < this.numMovingObjects; i++) {
      let vec_f = new Vec3(0, 0, 0);
      for (let j = 0; j < this.numMovingObjects; j++) {
        if (i == j) continue;
        vec_f.add(
          this.getGravityForce(this.movingObjects[i], this.movingObjects[j])
        );
      }
      this.movingObjects[i].setForce(vec_f);
    }

    // timeleap system
    const curTime = Date.now();
    for (let i = 0; i < this.numMovingObjects; i++) {
      let dt = (curTime - this.lastTime) / 1000;
      if (dt > 0.02) dt = 0.02;
      this.movingObjects[i].update(dt * this.speed);
    }
    this.lastTime = curTime;

    // merge colliding object
    for (let i = 0; i < this.numMovingObjects; i++) {
      for (let j = i + 1; j < this.numMovingObjects; j++) {
        if (this.movingObjects[i].isCollidedWith(this.movingObjects[j])) {
          this.movingObjects[i].merge(this.movingObjects[j]);
          this.movingObjects.splice(j, 1);
          --j;
        }
      }
    }
  }
}

class GravityMovingObject {
  constructor(p, v, m) {
    this.p = p;
    this.v = v;
    this.a = Vec3.zero();
    this.updateMass(m);
    this.deleted = false;
  }

  updateMass(m) {
    this.m = m;
    this.r = Math.pow(this.m, 1.0 / 3) / 1000;
  }

  isCollidedWith(other) {
    return Vec3.sub(this.p, other.p).length() <= this.r + other.r;
  }

  // merge other into this
  merge(other) {
    // position: copy more massive object
    this.p = this.m > other.m ? this.p : other.p;

    // conservation of momentum: m1 * v1 + m2 * v2 = M * V
    let M = this.m + other.m;
    let totMomentum = Vec3.add(
      Vec3.mul(this.v, this.m),
      Vec3.mul(other.v, other.m)
    );
    this.v = Vec3.div(totMomentum, M);

    this.updateMass(M);

    other.deleted = true;
  }

  setForce(f) {
    // a = f/m
    this.a = Vec3.div(f, this.m);
  }

  update(dt) {
    // dv = a * dt
    // dp = a * dt^2 / 2 + v * dt
    let dv = Vec3.mul(this.a, dt);
    let dp = Vec3.add(Vec3.mul(this.a, (dt * dt) / 2), Vec3.mul(this.v, dt));
    this.v.add(dv);
    this.p.add(dp);
  }

  getPos = () => this.p;

  getRadius = () => this.r;
}
