// exportSTL.ts
// Utility to export a 3D voxel grid as an STL file (binary or ASCII)
// Usage: exportSTL(plot, voxelSizeMm, fileName)

/**
 * Export a 3D voxel grid (single frame) as an STL file and trigger download.
 * @param plot 2D array of color strings ("transparent" = empty)
 * @param voxelSizeMm Size of each voxel in mm
 * @param fileName Name for the STL file
 */
export function exportSTL(plotOrFrames: string[][] | string[][][], voxelSizeMm: number, fileName = 'model.stl') {
  // Support either a single 2D plot or an array of frames (3D stack)
  const triangles: string[] = [];

  // Helper to add cube faces for a voxel at integer coordinates (ix, iy, iz)
  function addVoxelIfExposed(ix: number, iy: number, iz: number, isFilledFn: (x: number, y: number, z: number) => boolean) {
    const x = ix * voxelSizeMm;
    const y = iy * voxelSizeMm;
    const z = iz * voxelSizeMm;
    const s = voxelSizeMm;
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
    // check neighbors
    const nxPos = isFilledFn(ix + 1, iy, iz);
    const nxNeg = isFilledFn(ix - 1, iy, iz);
    const nyPos = isFilledFn(ix, iy + 1, iz);
    const nyNeg = isFilledFn(ix, iy - 1, iz);
    const nzPos = isFilledFn(ix, iy, iz + 1);
    const nzNeg = isFilledFn(ix, iy, iz - 1);

    // faces definitions (quads) with winding matching original
    const faces: Array<{ cond: boolean; quad: number[] } > = [
      { cond: !nzNeg, quad: [0, 1, 2, 3] }, // bottom (z-)
      { cond: !nzPos, quad: [4, 5, 6, 7] }, // top (z+)
      { cond: !nyNeg, quad: [0, 1, 5, 4] }, // front (y-)
      { cond: !nyPos, quad: [2, 3, 7, 6] }, // back (y+)
      { cond: !nxPos, quad: [1, 2, 6, 5] }, // right (x+)
      { cond: !nxNeg, quad: [3, 0, 4, 7] }, // left (x-)
    ];

    for (const f of faces) {
      if (f.cond) {
        triangles.push(...quadToTriangles(v[f.quad[0]], v[f.quad[1]], v[f.quad[2]], v[f.quad[3]]));
      }
    }
  }

  // Detect 3D frames (array of 2D plots)
  // Build a unified isFilled function whether input is 2D plot or 3D frames
  if (Array.isArray(plotOrFrames) && Array.isArray(plotOrFrames[0]) && Array.isArray((plotOrFrames as any)[0][0])) {
    const frames = plotOrFrames as string[][][];
    const zCount = frames.length;
    const rows = frames[0]?.length ?? 0;
    const cols = frames[0]?.[0]?.length ?? 0;
    function isFilled(x: number, y: number, z: number) {
      if (z < 0 || z >= zCount) return false;
      if (x < 0 || x >= rows) return false;
      if (y < 0 || y >= cols) return false;
      const v = frames[z][x][y];
      return Boolean(v && v !== 'transparent');
    }
    for (let z = 0; z < zCount; z++) {
      const plot = frames[z];
      const r = plot.length;
      const c = plot[0]?.length ?? 0;
      for (let x = 0; x < r; x++) {
        for (let y = 0; y < c; y++) {
          if (isFilled(x, y, z)) addVoxelIfExposed(x, y, z, isFilled);
        }
      }
    }
  } else {
    const plot = plotOrFrames as string[][];
    const rows = plot.length;
    const cols = plot[0]?.length ?? 0;
    function isFilled2(x: number, y: number, z: number) {
      if (z !== 0) return false;
      if (x < 0 || x >= rows) return false;
      if (y < 0 || y >= cols) return false;
      const v = plot[x][y];
      return Boolean(v && v !== 'transparent');
    }
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (isFilled2(x, y, 0)) addVoxelIfExposed(x, y, 0, isFilled2);
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
