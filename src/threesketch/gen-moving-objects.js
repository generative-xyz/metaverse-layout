class TimeMovingObject {
  constructor(fx, fy, fz) {
    this.fx = fx;
    this.fy = fy;
    this.fz = fz;
  }

  getPos(t) {
    return {
        x: this.fx(t),
        y: this.fy(t),
        z: this.fz(t),
    }
  }
}

class DiffrentialMovingObject {
  constructor(dx, dy, dz, x, y, z) {
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w_speed = rand(1, 1);
  }

  getPos(dt, apply=false) {
    dt = this.w_speed * dt;
    if (apply) {
      this.x = this.x + this.dx(this.x, this.y, this.z, dt);
      this.y = this.y + this.dy(this.x, this.y, this.z, dt);
      this.z = this.z + this.dz(this.x, this.y, this.z, dt);
      return {x : this.x, y : this.y, z : this.z}
    }
    return {
      x: this.x + this.dx(this.x, this.y, this.z, dt),
      y: this.y + this.dy(this.x, this.y, this.z, dt),
      z: this.z + this.dz(this.x, this.y, this.z, dt),
    }
  }
}

function rand(l, r) {
  return Math.random() * (r - l) + l
}


export function genDMovingObjects(numMovingObjects) {
  const dt = 0.0020
  const numToGet = 1000
  const a = 0.44, b = 1.1, c = 1, e = 0.65, f = 20, k = 55;
  let dx = (x, y, z, dt) => y * dt;
  let dy = (x, y, z, dt) => z * dt;
  let dz = (x, y, z, dt) => (-c * x - b * y - a * z + x * x) * dt;
  let x0 = 0.01, y0 = 0.2, z0 = 0.01;
  // const curObj = new DiffrentialMovingObject(dx, dy, dz, x0, y0, z0);
  const res = []
  for (let i = 0; i < numMovingObjects; i++) {
    // for (let j = 0; j < numToGet; j++) {
    //   curObj.getPos(dt, true);
    // }
    res.push(new DiffrentialMovingObject(dx, dy, dz, rand(-0.2, 0.2), rand(-0.2, 0.2), rand(-0.2, 0.2)))
    // console.log("Done rock", i)
  }
  return res
}


// gen a function with 2*PI period
function genFunction() {
  let angle = Math.random() * 2 * Math.PI
  let len = rand(0.2, 1)
  let a = Math.cos(angle) * len
  let b = Math.sin(angle) * len
  let o = Math.random() * 2 * Math.PI
  return (t) => {
      return a * Math.cos(t + o) + b * Math.sin(t + o)
  }
}

export function genTimeMovingObjects(numMovingObjects) {
  const res = []
  for (let i = 0; i < numMovingObjects; i++) {
    const fx = genFunction()
    const fy = genFunction()
    const fz = genFunction()
    res.push(new TimeMovingObject(fx, fy, fz))
  }
  return res
}
