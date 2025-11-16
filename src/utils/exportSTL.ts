// exportSTL.ts
// Utility to export a 3D voxel grid as an STL file (binary or ASCII)
// Usage: exportSTL(plot, voxelSizeMm, fileName)

/**
 * Export a 3D voxel grid (single frame) as an STL file and trigger download.
 * @param plot 2D array of color strings ("transparent" = empty)
 * @param voxelSizeMm Size of each voxel in mm
 * @param fileName Name for the STL file
 */
export function exportSTL(plot: string[][], voxelSizeMm: number, fileName = 'model.stl') {
  // Only export filled voxels
  const triangles: string[] = [];
  const size = plot.length;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (plot[x][y] && plot[x][y] !== 'transparent') {
        // Each voxel is a cube at (x, y, 0)
        triangles.push(...cubeTriangles(x * voxelSizeMm, y * voxelSizeMm, 0, voxelSizeMm));
      }
    }
  }
  const stl = `solid pixelart\n${triangles.join('\n')}\nendsolid pixelart`;
  const blob = new Blob([stl], { type: 'application/sla' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}

// Return STL facet strings for a cube at (x, y, z) with given size
function cubeTriangles(x: number, y: number, z: number, s: number): string[] {
  // 8 vertices
  const v = [
    [x, y, z],
    [x + s, y, z],
    [x + s, y + s, z],
    [x, y + s, z],
    [x, y, z + s],
    [x + s, y, z + s],
    [x + s, y + s, z + s],
    [x, y + s, z + s],
  ];
  // 12 triangles (2 per face)
  const faces = [
    [0, 1, 2, 3], // bottom
    [4, 5, 6, 7], // top
    [0, 1, 5, 4], // front
    [2, 3, 7, 6], // back
    [1, 2, 6, 5], // right
    [3, 0, 4, 7], // left
  ];
  const tris: string[] = [];
  for (const f of faces) {
    tris.push(...quadToTriangles(v[f[0]], v[f[1]], v[f[2]], v[f[3]]));
  }
  return tris;
}

// Convert quad to two STL triangles
function quadToTriangles(a: number[], b: number[], c: number[], d: number[]): string[] {
  return [facet(a, b, c), facet(a, c, d)];
}

// Create STL facet string for triangle
function facet(a: number[], b: number[], c: number[]): string {
  // Calculate normal (not strictly needed for most slicers)
  const n = normal(a, b, c);
  return `  facet normal ${n.join(' ')}\n    outer loop\n      vertex ${a.join(' ')}\n      vertex ${b.join(' ')}\n      vertex ${c.join(' ')}\n    endloop\n  endfacet`;
}

// Calculate normal vector for triangle
function normal(a: number[], b: number[], c: number[]): number[] {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const nx = u[1] * v[2] - u[2] * v[1];
  const ny = u[2] * v[0] - u[0] * v[2];
  const nz = u[0] * v[1] - u[1] * v[0];
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return [nx / len, ny / len, nz / len];
}
