import { AssetLoader } from "@/threesketch/alien-js/loaders/AssetLoader";

const LineEq = (
    y2,
    y1,
    x2,
    x1,
    currentVal
) => {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return m * currentVal + b;
};

const MathMap = (
    x,
    a,
    b,
    c,
    d
) => {
    return parseFloat((((x - a) * (d - c)) / (b - a) + c).toFixed(3));
};

const MathMapVector3 = (
    point,
    a,
    b,
    c,
    d
) => {
    return {
        x: MathMap(point, a, b, c.x, d.x),
        y: MathMap(point, a, b, c.y, d.y),
        z: MathMap(point, a, b, c.z, d.z),
    };
};

const MathLerp = (a, b, n) => {
    return parseFloat(((1 - n) * a + n * b).toFixed(3));
};

const RandomFloat = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};


const MathAround = (
    r,
    {x, y}
) => {
    const z = Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2));
    const sin = y / z;
    const cos = x / z;

    return {
        x: cos * r,
        y: sin * r,
    };
};

const Radians =
    (degrees) => {
        return degrees * Math.PI / 180;
    }

const Distance =
    (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

const GetOffsetThreeJs = ({left, top, width, height, winSize}) => {
    return {
        x: (left - winSize.x / 2 + width / 2),
        y: (-top + winSize.y / 2 - height / 2)
    }
}

const matrixMultiply = (matA, matB) => {
    let na = matA.length, ma = matA[0].length;
    let nb = matB.length, mb = matB[0].length;
    if (ma != nb) throw Error("error when matrix multiply")
    let res = []
    for (let i = 0; i < na; i++) {
        let tmp = []
        for (let j = 0; j < mb; j++) {
            tmp.push(0)
        }
        res.push(tmp)
    }
    for (let i = 0; i < na; i++) {
        for (let j = 0; j < mb; j++) {
            for (let k = 0; k < ma; k++) {
                res[i][j] += matA[i][k] * matB[k][j]
            }
        }
    }
    return res
}

function xRotate(x, y, z, angle) {
    const mat = [[1, 0, 0], [0, Math.cos(angle), -Math.sin(angle)], [0, Math.sin(angle), Math.cos(angle)]]
    const res = matrixMultiply([[x, y, z]], mat)
    return [res[0][0], res[0][1], res[0][2]]
}

function yRotate(x, y, z, angle) {
    const mat = [[Math.cos(angle), 0, Math.sin(angle)], [0, 1, 0], [-Math.sin(angle), 0, Math.cos(angle)]]
    const res = matrixMultiply([[x, y, z]], mat)
    return [res[0][0], res[0][1], res[0][2]]
}

function zRotate(x, y, z, angle) {
    const mat = [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0, 0, 1]]
    const res = matrixMultiply([[x, y, z]], mat)
    return [res[0][0], res[0][1], res[0][2]]
}

export {MathMap, MathMapVector3, MathLerp, RandomFloat, MathAround, LineEq, Radians, Distance, GetOffsetThreeJs, matrixMultiply, xRotate, yRotate, zRotate};
