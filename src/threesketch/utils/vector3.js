import { randFloat }  from "three/src/math/MathUtils"

export class Vector3 {
    constructor(x, y, z) { 
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        this.x += v.x
        this.y += v.y
        this.z += v.z
    }

    sub(v) {
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
    }

    mul(k) {
        this.x *= k
        this.y *= k
        this.z *= k
    }

    div(k) {
        this.x /= 1.0*k
        this.y /= 1.0*k
        this.z /= 1.0*k
    }

    length = () => Math.hypot(this.x, this.y, this.z)

    toString = () => `(${this.x}, ${this.y}, ${this.z})`

    static zero = () => new Vector3(0, 0, 0)
    static rand = (l, r) => new Vector3(randFloat(l, r), randFloat(l, r), randFloat(l, r))

    static add = (a, b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
    static sub = (a, b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
    static mul = (a, k) => new Vector3(a.x * k, a.y * k, a.z * k)
    static div = (a, k) => new Vector3(a.x / k, a.y / k, a.z / k)
}