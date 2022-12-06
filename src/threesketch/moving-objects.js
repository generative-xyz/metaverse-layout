import {
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  Clock,
  ACESFilmicToneMapping,
  AmbientLight,
  PointLight,
  HemisphereLight,
  DirectionalLight,
  CubeCamera,
  WebGLCubeRenderTarget,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  sRGBEncoding,
  SphereGeometry,
  MeshStandardMaterial,
  DirectionalLightHelper,
} from 'three'

function rand(l, r) {
  return Math.random() * (r - l) + l
}

// ODE stands for Ordinary differential equation
// Coord is generated by Explicit Euler Method
class ODEMovingObject {
  constructor(dx, dy, dz, x, y, z) {
    this.dx = dx
    this.dy = dy
    this.dz = dz
    this.x = x
    this.y = y
    this.z = z
    this.w_speed = rand(1, 1)
  }

  // apply=true if you want to update new coordinates for object
  updatePos(dt, apply = false) {
    dt = this.w_speed * dt
    if (apply) {
      this.x = this.x + this.dx(this.x, this.y, this.z, dt)
      this.y = this.y + this.dy(this.x, this.y, this.z, dt)
      this.z = this.z + this.dz(this.x, this.y, this.z, dt)
      return { x: this.x, y: this.y, z: this.z }
    }
    return {
      x: this.x + this.dx(this.x, this.y, this.z, dt),
      y: this.y + this.dy(this.x, this.y, this.z, dt),
      z: this.z + this.dz(this.x, this.y, this.z, dt),
    }
  }

  getPos() {
    return { x: this.x, y: this.y, z: this.z }
  }
}

export class ODEObjectSystem {
  constructor() {}

  init(numMovingObjects) {
    this.numMovingObjects = numMovingObjects
    this.movingObjects = genODEMovingObjects(numMovingObjects)
    this.startTime = Date.now()
    this.lastTime = Date.now()
  }

  update() {
    const curTime = Date.now()
    for (let i = 0; i < this.numMovingObjects; i++) {
      let dt = (curTime - this.lastTime) / 500
      if (dt > 0.02) dt = 0.02
      this.movingObjects[i].updatePos(dt, true)
    }

    this.lastTime = curTime
  }
}

const MIN_DIS = 0.0003

export class GravityMovingSystem {
  constructor() {}

  init(numMovingObjects) {
    this.numMovingObjects = numMovingObjects
    this.movingObjects = []
    for (let i = 0; i < numMovingObjects; i++) {
      const x = rand(-1, 1)
      const y = rand(-1, 1)
      const z = rand(-1, 1)
      const vx = rand(-0.2, 0.2)
      const vy = rand(-0.2, 0.2)
      const vz = rand(-0.2, 0.2)
      const m = rand(0.05, 0.2)
      this.movingObjects.push(new GravityMovingObject(x, y, z, vx, vy, vz, m))
    }
  }

  update() {
    const dx = [],
      dy = [],
      dz = [],
      dvx = [],
      dvy = [],
      dvz = []
    for (let i = 0; i < this.numMovingObjects; i++) {
      
      dx.push(this.movingObjects[i].vx * dt)
      dy.push(this.movingObjects[i].vy * dt)
      dz.push(this.movingObjects[i].vz * dt)
      // calculate f
      for (int j = 0; j < this.numMovingObjects; j++) {
        if (this.movingObjects[j])
      }
    }
  }
}

class GravityMovingObject {
  constructor(x, y, z, vx, vy, vx, m) {
    this.x = x
    this.y = y
    this.z = z
    this.vx = vx
    this.vy = vy
    this.vz = vz
    this.m = m
    this.deleted = false
  }

  updateV(vx, vy, vz) {
    this.vx = vx
    this.vy = vy
    this.vz = vz
  }

  updatePos(dt) {
    this.x += dt * this.vx
    this.y += dt * this.vy
    this.z += dt * this.vz
  }

  getPos() {
    return { x: this.x, y: this.y, z: this.z }
  }
}

export function genODEMovingObjects(numMovingObjects) {
  const a = 0.44,
    b = 1.1,
    c = 1
  // ODEs
  let dx = (x, y, z, dt) => y * dt
  let dy = (x, y, z, dt) => z * dt
  let dz = (x, y, z, dt) => (-c * x - b * y - a * z + x * x) * dt

  const res = []
  // init random particles in cube (-0.2, -0.2, -0.2) to (0.2, 0.2, 0.2)
  for (let i = 0; i < numMovingObjects; i++) {
    res.push(
      new ODEMovingObject(
        dx,
        dy,
        dz,
        rand(-0.2, 0.2),
        rand(-0.2, 0.2),
        rand(-0.2, 0.2),
      ),
    )
  }
  return res
}