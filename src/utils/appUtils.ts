export type Point = { x: number; y: number };

export function multiplier(a: number, b: number): number {
  return a * b;
}

export function floodFill(plot: string[][], startX: number, startY: number, fillColor: string): string[][] {
  if (!plot) return plot;
  const rows = plot.length;
  const cols = plot[0]?.length ?? 0;
  if (startX < 0 || startX >= rows || startY < 0 || startY >= cols) return plot;
  const targetColor = plot[startX][startY];
  if (targetColor === fillColor) return plot;

  const newPlot: string[][] = plot.map(row => row.slice());
  const stack: Point[] = [{ x: startX, y: startY }];
  while (stack.length) {
    const { x, y } = stack.pop() as Point;
    if (x < 0 || x >= rows || y < 0 || y >= cols) continue;
    if (newPlot[x][y] !== targetColor) continue;
    newPlot[x][y] = fillColor;
    stack.push({ x: x + 1, y });
    stack.push({ x: x - 1, y });
    stack.push({ x, y: y + 1 });
    stack.push({ x, y: y - 1 });
  }
  return newPlot;
}

export function getRectanglePerimeterPixels(a: Point, b: Point): Point[] {
  const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
  const points: Point[] = [];
  for (let i = minX; i <= maxX; i++) {
    points.push({ x: i, y: minY });
    points.push({ x: i, y: maxY });
  }
  for (let j = minY + 1; j < maxY; j++) {
    points.push({ x: minX, y: j });
    points.push({ x: maxX, y: j });
  }
  return points;
}

export function drawRectanglePlot(plot: string[][], a: Point, b: Point, color: string): string[][] {
  const points = getRectanglePerimeterPixels(a, b);
  if (!plot) return plot;
  const newPlot = plot.map(row => row.slice());
  points.forEach(p => {
    if (newPlot[p.x] && typeof newPlot[p.x][p.y] !== 'undefined') newPlot[p.x][p.y] = color;
  });
  return newPlot;
}

export function getLinePixels(a: Point, b: Point): Point[] {
  const points: Point[] = [];
  let x0 = a.x, y0 = a.y, x1 = b.x, y1 = b.y;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    points.push({ x: x0, y: y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
  }
  return points;
}

export function drawLinePlot(plot: string[][], a: Point, b: Point, color: string): string[][] {
  if (!plot) return plot;
  const points = getLinePixels(a, b);
  const newPlot = plot.map(row => row.slice());
  points.forEach(p => {
    if (newPlot[p.x] && typeof newPlot[p.x][p.y] !== 'undefined') newPlot[p.x][p.y] = color;
  });
  return newPlot;
}

export function getCirclePerimeterPixels(center: Point, edge: Point): Point[] {
  const dx = edge.x - center.x;
  const dy = edge.y - center.y;
  const r = Math.sqrt(dx * dx + dy * dy);
  const minR = Math.max(0, r - 0.5);
  const maxR = r + 0.5;
  const imin = Math.floor(center.x - maxR);
  const imax = Math.ceil(center.x + maxR);
  const jmin = Math.floor(center.y - maxR);
  const jmax = Math.ceil(center.y + maxR);
  const result: Point[] = [];
  for (let i = imin; i <= imax; i++) {
    for (let j = jmin; j <= jmax; j++) {
      const ddx = i - center.x;
      const ddy = j - center.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (dist >= minR && dist <= maxR) result.push({ x: i, y: j });
    }
  }
  return result;
}

export function drawCirclePlot(plot: string[][], center: Point, edge: Point, color: string): string[][] {
  if (!plot) return plot;
  const points = getCirclePerimeterPixels(center, edge);
  const newPlot = plot.map(row => row.slice());
  points.forEach(p => {
    if (newPlot[p.x] && typeof newPlot[p.x][p.y] !== 'undefined') newPlot[p.x][p.y] = color;
  });
  return newPlot;
}

export function cssToRGBA(color: string): [number, number, number, number] {
  try {
    const cvs = document.createElement('canvas');
    cvs.width = cvs.height = 1;
    const ctx = cvs.getContext('2d');
    if (!ctx) return [0, 0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
  } catch {
    return [0, 0, 0, 1];
  }
}

export function generateBlenderScript(plot: string[][], voxelSizeMm: number): string | null {
  if (!plot) return null;
  const escapeSingle = (s: string) => s.replace(/'/g, "\\'");
  const TRANSPARENCY_THRESHOLD = 0.18;
  const isTransparent = (c: string) => {
    if (!c) return true;
    if (c === 'transparent') return true;
    const [, , , a] = cssToRGBA(c);
    return a <= TRANSPARENCY_THRESHOLD;
  };
  const processedPlot = plot.map(row => row.map(c => (isTransparent(c) ? 'transparent' : c)));
  const inUse = Array.from(new Set(processedPlot.flat())).filter(c => c !== 'transparent');
  const printOrder: string[] = ['#000000', '#FFFFFF', '#FF0000'];
  const missing = inUse.filter(c => !printOrder.includes(c));
  const orderedColors = [...printOrder.filter(c => inUse.includes(c)), ...missing];
  const colorIndices: Record<string, number> = {};
  orderedColors.forEach((c, idx) => (colorIndices[c] = idx));
  let materialsBlock = '';
  orderedColors.forEach(color => {
    const [r, g, b, a] = cssToRGBA(color);
    const esc = escapeSingle(color);
    materialsBlock += `materials['${esc}'] = bpy.data.materials.new(name='${esc}')\\n`;
    materialsBlock += `materials['${esc}'].use_nodes = True\\n`;
    materialsBlock += `bsdf = materials['${esc}'].node_tree.nodes.get('Principled BSDF')\\n`;
    materialsBlock += `if bsdf is not None:\\n    bsdf.inputs[0].default_value = (${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a.toFixed(3)})\\n`;
  });
  const pyPlot = JSON.stringify(processedPlot);
  const pyIndices = JSON.stringify(colorIndices);
  const layerThickness = Number((voxelSizeMm / 10).toFixed(6));
  const blenderScript = `# Blender Python script generated by pixel-app
# Paste into Blender's Text Editor and Run

import bpy

materials = {}
${materialsBlock}

LAYER_THICKNESS = ${layerThickness}  # ${voxelSizeMm} mm per layer
color_indices = ${pyIndices}
plot = ${pyPlot}

rows = len(plot)
cols = len(plot[0]) if rows>0 else 0

# Center in X/Y around origin; Z starts at 0
x_offset = (cols * LAYER_THICKNESS) / 2.0
y_offset = (rows * LAYER_THICKNESS) / 2.0

created = []

# For each pixel, create ONE cube and scale in Z so base sits at Z=0
for i, row in enumerate(plot):
    for j, color in enumerate(row):
        if color == 'transparent':
            continue
        idx = color_indices.get(color, 0)  # 0-based layer index
        height = (idx + 1) * LAYER_THICKNESS
        z_center = height / 2.0  # base at 0

        xpos = i * LAYER_THICKNESS - x_offset + (LAYER_THICKNESS / 2.0)
        ypos = -(j * LAYER_THICKNESS - y_offset + (LAYER_THICKNESS / 2.0))

        # Base cube is LAYER_THICKNESS in X/Y/Z; we scale Z to reach height
        bpy.ops.mesh.primitive_cube_add(size=LAYER_THICKNESS, location=(xpos, ypos, z_center))
        obj = bpy.context.active_object
        # scale Z by (idx+1) so total Z size = (idx+1)*LAYER_THICKNESS
        obj.scale[2] = (idx + 1)
        if color in materials:
            if len(obj.data.materials) == 0:
                obj.data.materials.append(materials[color])
            else:
                obj.data.materials[0] = materials[color]
        created.append(obj)

# Join all into ONE mesh
if created:
    bpy.ops.object.select_all(action='DESELECT')
    for o in created:
        o.select_set(True)
    bpy.context.view_layer.objects.active = created[0]
    bpy.ops.object.join()
    union_obj = bpy.context.active_object
    union_obj.name = "voxel_union"

    # Apply transforms so scales become real geometry
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    # Optional: Voxel Remesh to ensure watertight manifold (good for 3D printing)
    # Adjust voxel_size for quality vs speed
    mod = union_obj.modifiers.new(name="UnionVoxelRemesh", type='REMESH')
    mod.mode = 'VOXEL'
    mod.voxel_size = LAYER_THICKNESS / 20  # half a voxel for clean union
    bpy.ops.object.modifier_apply(modifier=mod.name)

    # Recenter to origin (Z base already at 0)
    union_obj.location.z = 0.4
`;
  return blenderScript;
}