
// radius = 101
// stars = 1000
// depth = 3
// randomness = 100

// for index in range(stars):
// 	i = Mathutils.Rand()
// 	j = Mathutils.Rand()
// 	k = i * j
// 	xoff = Mathutils.Rand() * randomness
// 	yoff = Mathutils.Rand() * randomness
// 	length = k * radius
// 	angle = Mathutils.Rand() * 2 * math.pi
// 	x = length * math.cos(angle)
// 	y = length * math.sin(angle)
// 	z = Mathutils.Rand() * depth - (depth / 2)
// 	newVert = NMesh.Vert(x,y,z)
// 	mesh.verts.append(newVert)
	
// NMesh.PutRaw(mesh)

import { xRotate, yRotate, zRotate } from '@/libs/math-utils'


export function generateGalaxyMetaverse(rocksCount, radius, depth, xoff=0, yoff=0, zoff=0) {
    const locations = []
    for (let i = 0; i < rocksCount; i++) {
        let ii = Math.random()
        let jj = Math.random()
        let k = ii + jj;
        let length = k * radius
        let angle = Math.random() * 2 * Math.PI;
        let x = length * Math.cos(angle)
        let y = length * Math.sin(angle)
        let z = Math.random() * depth - (depth / 2)
        locations.push([x, z, y])
    }
    const angleX = Math.random() * 2 * Math.PI;
    const angleY = Math.random() * 2 * Math.PI;
    const angleZ = Math.random() * 2 * Math.PI;
    for (let i = 0; i < rocksCount; i++) {
        let rotated = xRotate(...locations[i], angleX)
        rotated = yRotate(...rotated, angleY)
        rotated = zRotate(...rotated, angleZ)
        locations[i] = [rotated[0] + xoff, rotated[1] + yoff, rotated[2] + zoff]
    }
    return locations
}

export function generateMultiGalaxyMetaverse(rocksCount, numGalaxies, space, depth) {
    let locations = []
    let radius = 2.8
    // split to 20 galaxies
    for (let glx = 0; glx < numGalaxies; glx++) {
        const xoff = Math.random() * space - space / 2;
        const yoff = Math.random() * space - space / 2;
        const zoff = Math.random() * space - space / 2;
        const tmpLocations = generateGalaxyMetaverse(rocksCount / numGalaxies, radius, depth, xoff, yoff, zoff)
        locations = locations.concat(tmpLocations)
    }  
    return locations
}
