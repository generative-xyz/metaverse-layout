export function generateRandomSphere(...params) {
    const numRocks = params[0]
    const maxDistance = params[1]
    const minDistance = params[2]
    const xoff = params[3] || 0
    const yoff = params[4] || 0
    const zoff = params[5] || 0
    const res = []
    let time = Date.now()
    while (res.length < numRocks) {
        let x = Math.random() * 2 - 1
        let y = Math.random() * 2 - 1
        let z = Math.random() * 2 - 1
        const curDis = Math.sqrt(x * x + y * y + z * z)
        if (curDis > 1) continue;
        const ratio = maxDistance
        x = x * ratio
        y = y * ratio
        z = z * ratio
        let overlapped = false;
        for (const coordinate of res) {
            let xx = coordinate[0] - x
            let yy = coordinate[1] - y
            let zz = coordinate[2] - z
            if (Math.sqrt(xx * xx + yy * yy + zz * zz) < minDistance) {
                overlapped = true
                break
            }            
        }
        if (!overlapped) res.push([x * ratio + xoff, y * ratio + yoff, z * ratio + zoff])        
        if (Date.now() - time > 1000) {
            time = Date.now()
            console.log(res.length)
        }
    }
    return res
}

export function generateMultiRandomSphere(rocksCount, numGalaxies, space) {
    let locations = []
    let radius = 1.55
    // split to 20 galaxies
    for (let glx = 0; glx < numGalaxies; glx++) {
        const xoff = Math.random() * space - space / 2;
        const yoff = Math.random() * space - space / 2;
        const zoff = Math.random() * space - space / 2;
        const tmpLocations = generateRandomSphere(rocksCount / numGalaxies, radius, 0.1, xoff, yoff, zoff)
        locations = locations.concat(tmpLocations)
    }  
    return locations
}

