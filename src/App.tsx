import { useEffect } from 'react';
import "./App.css";
import { IoIosColorPalette } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { MdFormatColorFill } from "react-icons/md";
import { Circle } from '@uiw/react-color';
import { BsEraserFill } from "react-icons/bs";
import { FaCode, FaDownload, FaPencilAlt, FaFillDrip, FaSlash, FaRegCircle, FaEyeDropper, FaUndo, FaRedo } from "react-icons/fa";
import ToolBar from './components/ToolBar';
import MenuBar from './components/MenuBar';
import { useGlobalStore } from "./store/useGlobalStore";
// import type { Tool } from "./store/useGlobalStore";

function App() {
  // Frame management
  const frames = useGlobalStore((s) => s.frames);
  const currentFrame = useGlobalStore((s) => s.currentFrame);
  const addFrame = useGlobalStore((s) => s.addFrame);
  const setCurrentFrame = useGlobalStore((s) => s.setCurrentFrame);
  const setSize = useGlobalStore((s) => s.setSize);
  const size = useGlobalStore((s) => s.size);
  // const setSize = useGlobalStore((s) => s.setSize); // Remove if unused
  const currColor = useGlobalStore((s) => s.currColor);
  const setCurrColor = useGlobalStore((s) => s.setCurrColor);
  const currentPixel = useGlobalStore((s) => s.currentPixel);
  const setCurrentPixel = useGlobalStore((s) => s.setCurrentPixel);
  const plot = useGlobalStore((s) => s.frames[s.currentFrame]);
  const setPlot = useGlobalStore((s) => s.setPlot);
  const colorMenuOpen = useGlobalStore((s) => s.colorMenuOpen);
  const setColorMenuOpen = useGlobalStore((s) => s.setColorMenuOpen);
  const mousePos = useGlobalStore((s) => s.mousePos);
  const setMousePos = useGlobalStore((s) => s.setMousePos);
  const showToolCursor = useGlobalStore((s) => s.showToolCursor);
  const setShowToolCursor = useGlobalStore((s) => s.setShowToolCursor);
  const shiftButtonEngaged = useGlobalStore((s) => s.shiftButtonEngaged);
  const setShiftButtonEngaged = useGlobalStore((s) => s.setShiftButtonEngaged);
  const pixelMultiplier = useGlobalStore((s) => s.pixelMultiplier);
  // const setPixelMultiplier = useGlobalStore((s) => s.setPixelMultiplier); // Remove if unused
  const voxelSizeMm = useGlobalStore((s) => s.voxelSizeMm);
  const setVoxelSizeMm = useGlobalStore((s) => s.setVoxelSizeMm);
  const tool = useGlobalStore((s) => s.tool);
  const setTool = useGlobalStore((s) => s.setTool);
  const toolStart = useGlobalStore((s) => s.toolStart);
  const setToolStart = useGlobalStore((s) => s.setToolStart);
  const previewPixels = useGlobalStore((s) => s.previewPixels);
  const setPreviewPixels = useGlobalStore((s) => s.setPreviewPixels);
  const undoStack = useGlobalStore((s) => s.undoStack);
  const setUndoStack = useGlobalStore((s) => s.setUndoStack);
  const redoStack = useGlobalStore((s) => s.redoStack);
  const setRedoStack = useGlobalStore((s) => s.setRedoStack);
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')
        setTool('pencil');
    });

  }, [])
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftButtonEngaged(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftButtonEngaged(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])


  function handleClear() {
    // Clear the current board using the current size (pixel count)
    const dsMap: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => "transparent"));
    setPlot(dsMap);
    toast.success("Board cleared");
  }
  function floodFill(startX: number, startY: number, color?: string) {
    const fillColor = color ?? currColor
    if (!plot) return
    const rows = plot.length
    const cols = plot[0]?.length ?? 0
    if (startX < 0 || startX >= rows || startY < 0 || startY >= cols) return

    const targetColor = plot[startX][startY]
    if (targetColor === fillColor) return

    // Use functional set to avoid mutating current state
    interface FloodFillStackItem {
      x: number;
      y: number;
    }

    if (!plot) return;
    const r = plot.length;
    const c = plot[0]?.length ?? 0;
    const newPlot: string[][] = plot.map(row => row.slice());
    const stack: FloodFillStackItem[] = [{ x: startX, y: startY }];
    while (stack.length) {
      const { x, y } = stack.pop() as FloodFillStackItem;
      if (x < 0 || x >= r || y < 0 || y >= c) continue;
      if (newPlot[x][y] !== targetColor) continue;
      newPlot[x][y] = fillColor;
      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }
    setPlot(newPlot);

    toast.success('Fill applied')
  }

  function fillFromCurrentPixel() {
    console.log(currentPixel)
    if (!currentPixel) {
      toast.error('No pixel selected')
      return
    }
    floodFill(currentPixel.x, currentPixel.y, currColor)
  }
  // (handleFill removed — not used)



  function multiplier(a: number, b: number): number {
    return a * b
  }


  // extended palette
  // Added more colors for a richer palette
  // Basic + extended web colors + some nice extras
  let colors: string[] = [
    '#000000', '#222222', '#444444', '#666666', '#888888', '#AAAAAA', '#CCCCCC', '#EEEEEE', '#FFFFFF',
    '#FF0000', '#FF7F00', '#FFFF00', '#7FFF00', '#00FF00', '#00FF7F', '#00FFFF', '#007FFF', '#0000FF', '#7F00FF', '#FF00FF',
    '#FFC0CB', '#FF69B4', '#FF1493', '#C71585', '#8B008B', // pinks/magentas
    '#8B4513', '#A0522D', '#D2691E', '#FFD700', '#FFA500', // browns/oranges/yellow
    '#00CED1', '#20B2AA', '#008080', '#4682B4', '#1E90FF', // teals/blues
    '#B22222', '#DC143C', '#800000', '#A52A2A', // reds/browns
    '#228B22', '#006400', '#32CD32', '#ADFF2F', // greens
    '#F5F5DC', '#FFF8DC', '#F0E68C', '#E6E6FA', // light/neutral
    '#F0FFFF', '#F5FFFA', '#FFE4E1', '#FAEBD7', // pastel/white variants
    '#808000', '#BDB76B', '#DAA520', '#D2B48C', // olives/tans
    '#2F4F4F', '#708090', '#778899', '#B0C4DE', // grays/blues
    '#191970', '#00008B', '#000080', '#483D8B', // dark blues
    '#9400D3', '#8A2BE2', '#9932CC', '#BA55D3', // violets
    '#FF4500', '#FF6347', '#FF8C00', '#FFDAB9', // oranges/peach
    '#7CFC00', '#00FA9A', '#40E0D0', '#48D1CC', // greens/teals
    '#C0C0C0', '#D3D3D3', '#A9A9A9', // silvers/grays
  ]
  useEffect(() => {
    if (!plot) {
      const rows = multiplier(size, 10)
      const cols = multiplier(size, 10)
      let dsMap: string[][] = Array.from({ length: rows }, () => Array.from({ length: cols }, () => "hsl(0deg 0% 100% / 16%)"));
      setPlot(dsMap)
    }
  }, [])
  // initialize a 10x10 grid of color strings (avoid shared references)
  useEffect(() => {
    //  setPlot()
  }, [currentPixel, plot])


  function pushUndo() {
    if (plot) setUndoStack([...undoStack, plot.map(row => [...row])]);
    setRedoStack([]);
  }

  function undo() {
    if (undoStack.length === 0) return;
    setRedoStack([plot!.map(row => [...row]), ...redoStack]);
    setPlot(undoStack[undoStack.length - 1]);
    setUndoStack(undoStack.slice(0, -1));
    setPreviewPixels([]);
    setToolStart(null);
  }

  function redo() {
    if (redoStack.length === 0) return;
    setUndoStack([...undoStack, plot!.map(row => [...row])]);
    setPlot(redoStack[0]);
    setRedoStack(redoStack.slice(1));
    setPreviewPixels([]);
    setToolStart(null);
  }

  function setPixelAt(params: { x: number; y: number }, color: string) {
    pushUndo();
    setCurrentPixel(params);
    if (!plot) return;
    const newPlot = plot.map(row => row.slice());
    if (newPlot[params.x] && typeof newPlot[params.x][params.y] !== 'undefined') {
      newPlot[params.x][params.y] = color;
    }
    setPlot(newPlot);
  }

  function handleSetPixel(params: { x: number; y: number }) {
    if (tool === 'pencil') {
      setPixelAt(params, currColor || 'transparent')
      setPreviewPixels([])
    } else if (tool === 'eraser') {
      setPixelAt(params, 'transparent')
      setPreviewPixels([])
    } else if (tool === 'fill') {
      pushUndo();
      floodFill(params.x, params.y, currColor)
      setPreviewPixels([])
    } else if (tool === 'picker') {
      const c = plot?.[params.x]?.[params.y]
      if (c) setCurrColor(c)
      setPreviewPixels([])
    } else if (tool === 'line' || tool === 'circle') {
      if (!toolStart) {
        setToolStart(params)
      } else {
        pushUndo();
        if (tool === 'line') drawLine(toolStart, params, currColor || 'transparent')
        if (tool === 'circle') drawCircle(toolStart, params, currColor || 'transparent')
        setToolStart(null)
        setPreviewPixels([])
      }
    }
  }
  // Preview overlay for line/circle
  function handlePreview(to: { x: number; y: number }) {
    if (!toolStart) return setPreviewPixels([])
    if (tool === 'line') {
      setPreviewPixels(getLinePixels(toolStart, to))
    } else if (tool === 'circle') {
      setPreviewPixels(getCirclePerimeterPixels(toolStart, to))
    } else {
      setPreviewPixels([])
    }
  }

  function getLinePixels(a: { x: number; y: number }, b: { x: number; y: number }) {
    const points: { x: number; y: number }[] = []
    let x0 = a.x, y0 = a.y, x1 = b.x, y1 = b.y
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx - dy
    while (true) {
      points.push({ x: x0, y: y0 })
      if (x0 === x1 && y0 === y1) break
      const e2 = 2 * err
      if (e2 > -dy) { err -= dy; x0 += sx }
      if (e2 < dx) { err += dx; y0 += sy }
    }
    return points
  }

  function getCirclePerimeterPixels(center: { x: number; y: number }, edge: { x: number; y: number }) {
    const dx = edge.x - center.x
    const dy = edge.y - center.y
    const r = Math.sqrt(dx * dx + dy * dy)
    const minR = Math.max(0, r - 0.5)
    const maxR = r + 0.5
    const imin = Math.floor(center.x - maxR)
    const imax = Math.ceil(center.x + maxR)
    const jmin = Math.floor(center.y - maxR)
    const jmax = Math.ceil(center.y + maxR)
    const result: { x: number; y: number }[] = []
    for (let i = imin; i <= imax; i++) {
      for (let j = jmin; j <= jmax; j++) {
        const ddx = i - center.x
        const ddy = j - center.y
        const dist = Math.sqrt(ddx * ddx + ddy * ddy)
        if (dist >= minR && dist <= maxR) {
          result.push({ x: i, y: j })
        }
      }
    }
    return result
  }

  // Bresenham line algorithm
  function drawLine(a: { x: number; y: number }, b: { x: number; y: number }, color: string) {
    const points: { x: number; y: number }[] = []
    let x0 = a.x, y0 = a.y, x1 = b.x, y1 = b.y
    const dx = Math.abs(x1 - x0)
    const dy = Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx - dy
    while (true) {
      points.push({ x: x0, y: y0 })
      if (x0 === x1 && y0 === y1) break
      const e2 = 2 * err
      if (e2 > -dy) { err -= dy; x0 += sx }
      if (e2 < dx) { err += dx; y0 += sy }
    }
    if (!plot) return;
    const newPlot = plot.map(row => row.slice());
    points.forEach(p => {
      if (newPlot[p.x] && typeof newPlot[p.x][p.y] !== 'undefined') newPlot[p.x][p.y] = color;
    });
    setPlot(newPlot);
  }

  // Draw filled circle (raster) centered at a with radius determined by distance to b
  function drawCircle(center: { x: number; y: number }, edge: { x: number; y: number }, color: string) {
    // Draw only the perimeter: mark cells whose distance to center is within 0.5 of radius
    const dx = edge.x - center.x
    const dy = edge.y - center.y
    const r = Math.sqrt(dx * dx + dy * dy)
    const minR = Math.max(0, r - 0.5)
    const maxR = r + 0.5
    const imin = Math.floor(center.x - maxR)
    const imax = Math.ceil(center.x + maxR)
    const jmin = Math.floor(center.y - maxR)
    const jmax = Math.ceil(center.y + maxR)
    if (!plot) return;
    const newPlot = plot.map(row => row.slice());
    for (let i = imin; i <= imax; i++) {
      for (let j = jmin; j <= jmax; j++) {
        const ddx = i - center.x;
        const ddy = j - center.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
        if (dist >= minR && dist <= maxR) {
          if (newPlot[i] && typeof newPlot[i][j] !== 'undefined') newPlot[i][j] = color;
        }
      }
    }
    setPlot(newPlot);
  }

  function handleMouseEnterPixel(params: { x: number; y: number }) {
    if (shiftButtonEngaged) {
      handleSetPixel(params)
    }
  }

  function handleMouseLeavePixel() {

  }

  function handleErasePixel(params: { x: number; y: number }) {
    setCurrentPixel(params)
    setPlot(prev => {
      if (!prev) return prev
      const newPlot = prev.map(row => row.slice())
      newPlot[params.x][params.y] = 'transparent'
      return newPlot
    })
  }

  function generateBlenderScript() {
    if (!plot) return null;

    // --- Helpers ---
    function cssToRGBA(color: string): [number, number, number, number] {
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
    const escapeSingle = (s: string) => s.replace(/'/g, "\\'");

    // Treat low-alpha as transparent (your grid init uses low-alpha HSL)
    const TRANSPARENCY_THRESHOLD = 0.18;
    const isTransparent = (c: string) => {
      if (!c) return true;
      if (c === 'transparent') return true;
      const [, , , a] = cssToRGBA(c);
      return a <= TRANSPARENCY_THRESHOLD;
    };

    // Normalize plot
    const processedPlot = plot.map(row => row.map(c => (isTransparent(c) ? 'transparent' : c)));
    const inUse = Array.from(new Set(processedPlot.flat())).filter(c => c !== 'transparent');

    // ---- Choose stack order (BOTTOM -> TOP) ----
    // Edit this to enforce your desired order (e.g., black, then white, then red):
    const printOrder: string[] = ['#000000', '#FFFFFF', '#FF0000']; // <-- customize
    // Keep colors not listed in printOrder in their first-seen order:
    const missing = inUse.filter(c => !printOrder.includes(c));
    const orderedColors = [...printOrder.filter(c => inUse.includes(c)), ...missing];

    // Map each color to a height index (0-based)
    const colorIndices: Record<string, number> = {};
    orderedColors.forEach((c, idx) => (colorIndices[c] = idx));

    // Python materials block
    let materialsBlock = '';
    orderedColors.forEach(color => {
      const [r, g, b, a] = cssToRGBA(color);
      const esc = escapeSingle(color);
      materialsBlock += `materials['${esc}'] = bpy.data.materials.new(name='${esc}')\n`;
      materialsBlock += `materials['${esc}'].use_nodes = True\n`;
      materialsBlock += `bsdf = materials['${esc}'].node_tree.nodes.get('Principled BSDF')\n`;
      materialsBlock += `if bsdf is not None:\n    bsdf.inputs[0].default_value = (${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a.toFixed(3)})\n`;
    });

    const pyPlot = JSON.stringify(processedPlot);
    const pyIndices = JSON.stringify(colorIndices);
    const layerThickness = Number((voxelSizeMm / 10).toFixed(6)); // mm -> meters

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



  function getCode() {
    if (!plot) {
      toast.error('No plot data')
      return
    }

    const blenderScript = generateBlenderScript()
    if (!blenderScript) {
      toast.error('No plot data')
      return
    }

    // Copy to clipboard with a fallback
    navigator.clipboard.writeText(blenderScript).then(() => {
      toast.success('Blender script copied to clipboard!')
    }).catch(() => {
      // fallback: create temporary textarea and use execCommand
      try {
        const ta = document.createElement('textarea')
        ta.value = blenderScript
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        toast.success('Blender script copied to clipboard (fallback)!')
      } catch (e) {
        toast.error('Unable to copy Blender script to clipboard')
      }
    })
  }

  function downloadScript() {
    const blenderScript = generateBlenderScript()
    if (!blenderScript) {
      toast.error('No plot data')
      return
    }
    try {
      const blob = new Blob([blenderScript], { type: 'text/x-python;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pixel_script.py'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Blender script downloaded')
    } catch (e) {
      toast.error('Download failed')
    }
  }

  // Save project JSON to file and localStorage
  function saveProject() {
    if (!plot) {
      toast.error('No plot to save')
      return
    }
    try {
      const data = { plot, voxelSizeMm }
      const txt = JSON.stringify(data)
      const blob = new Blob([txt], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pixel-project.json'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      // also save to localStorage
      try { localStorage.setItem('pixel-app-save', txt); } catch (e) { /* ignore */ }
      toast.success('Project saved')
    } catch (e) {
      toast.error('Save failed')
    }
  }

  // Load project from a File object
  function loadProjectFile(file: File | null) {
    if (!file) {
      toast.error('No file selected')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const txt = String(reader.result ?? '')
        const parsed = JSON.parse(txt)
        if (parsed.plot) setPlot(parsed.plot)
        if (typeof parsed.voxelSizeMm === 'number') setVoxelSizeMm(parsed.voxelSizeMm)
        toast.success('Project loaded')
      } catch (e) {
        toast.error('Failed to parse project file')
      }
    }
    reader.readAsText(file)
  }

  // Export PNG image of the plot (scale pxPerCell)
  function exportPNG() {
    if (!plot) {
      toast.error('No plot to export')
      return
    }
    const rows = plot.length
    const cols = plot[0]?.length ?? 0
    const pxPerCell = 20
    const cvs = document.createElement('canvas')
    cvs.width = cols * pxPerCell
    cvs.height = rows * pxPerCell
    const ctx = cvs.getContext('2d')
    if (!ctx) {
      toast.error('Export failed')
      return
    }
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const c = plot[i][j]
        if (!c || c === 'transparent') continue
        ctx.fillStyle = c
        ctx.fillRect(j * pxPerCell, i * pxPerCell, pxPerCell, pxPerCell)
      }
    }
    cvs.toBlob((blob) => {
      if (!blob) { toast.error('Export failed'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pixel-export.png'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('PNG exported')
    })
  }

  // Load autosave from localStorage on mount
  useEffect(() => {
    try {
      const s = localStorage.getItem('pixel-app-save')
      if (s) {
        const parsed = JSON.parse(s)
        if (parsed.plot) setPlot(parsed.plot)
        if (typeof parsed.voxelSizeMm === 'number') setVoxelSizeMm(parsed.voxelSizeMm)
      }
    } catch (e) { }
  }, [])

  const menu = ['File', 'Edit', 'View', 'Help']


  return (
    <div className="App">

      <ToastContainer />
      <header>

        <MenuBar menu={menu} />

      </header>
      {/* <div className='mini-plot'>
        {plot?.map((val: string[], i: number) => {
          return <div key={i}>{val.map((v: string, j: number) => <div onClick={() => handleSetPixel({ x: i, y: j })} className="pixel" key={j} style={{ backgroundColor: v, width: 1, height: 1 }} />)}</div>
        })}
      </div> */}
      <div style={{ marginTop: '80px' }}>
        {/* Frame controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
          <span style={{ fontWeight: 500 }}>Frame:</span>
          {frames.map((_, idx) => (
            <button
              key={idx}
              style={{
                background: idx === currentFrame ? '#ffb300' : '#23272e',
                color: idx === currentFrame ? '#23272e' : '#f5f5f7',
                border: '1px solid #444',
                borderRadius: 4,
                padding: '2px 10px',
                marginRight: 4,
                cursor: 'pointer',
                fontWeight: idx === currentFrame ? 700 : 400
              }}
              onClick={() => setCurrentFrame(idx)}
            >{idx + 1}</button>
          ))}
          <button
            style={{ background: '#23272e', color: '#ffb300', border: '1px dashed #ffb300', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontWeight: 700 }}
            onClick={addFrame}
          >+ Add Frame</button>
          <span style={{ marginLeft: 24, fontWeight: 500 }}>Pixel Count:</span>
          <input
            type="number"
            min={2}
            max={64}
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            style={{ width: 60, background: '#23272e', color: '#f5f5f7', border: '1px solid #444', borderRadius: 4, padding: '2px 6px', fontSize: 15, marginLeft: 4 }}
          />
        </div>
        <div className='plot' onMouseEnter={() => setShowToolCursor(true)} onMouseLeave={() => setShowToolCursor(false)}>
          {plot?.map((val: string[], i: number) => {
            return <div key={i}>{val.map((v: string, j: number) => {
              const isPreview = previewPixels.some(p => p.x === i && p.y === j)
              return (
                <div
                  onMouseEnter={() => { handleMouseEnterPixel({ x: i, y: j }); if (toolStart && (tool === 'line' || tool === 'circle')) handlePreview({ x: i, y: j }) }}
                  onMouseLeave={handleMouseLeavePixel}
                  onClick={() => handleSetPixel({ x: i, y: j })}
                  className={`pixel${isPreview ? ' preview' : ''}`}
                  key={j}
                  style={{ backgroundColor: isPreview ? currColor : v, opacity: isPreview ? 0.5 : 1, width: 20, height: 20 }} />
              )
            })}</div>
          })}
        </div>
      </div>
      {/* <div className="plot">
        <input type="text" />
      </div> */}
      {showToolCursor && <div
        id="cursor"
        className={tool}
        style={{
          position: 'fixed',
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          // expose color as CSS variable for styling
          ['--c' as any]: currColor
        }}
      />}
      <div id="picker" className='color'></div>
      <ToolBar
        setColorMenuOpen={setColorMenuOpen}
        colorMenuOpen={colorMenuOpen}
        colors={colors} currColor={currColor}
        handleClear={handleClear} fillFromCurrentPixel={fillFromCurrentPixel}
        handleErasePixel={handleErasePixel}
        setCurrColor={setCurrColor}
        getCode={getCode}
        downloadScript={downloadScript}
        voxelSizeMm={voxelSizeMm}
        setVoxelSizeMm={setVoxelSizeMm}
        tool={tool}
        setTool={setTool}
        saveProject={saveProject}
        loadProject={loadProjectFile}
        exportPNG={exportPNG}
        undo={undo}
        redo={redo} />
    </div>


  )
}

// interface ToolBarProps {
//   setColorMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
//   colorMenuOpen: boolean
//   colors: string[]
//   currColor: string
//   handleClear: () => void
//   fillFromCurrentPixel: () => void
//   handleErasePixel: (p: { x: number; y: number }) => void
//   setCurrColor: (c: string) => void
//   getCode: () => void
//   downloadScript: () => void
//   voxelSizeMm: number
//   setVoxelSizeMm: (n: number) => void
//   tool: Tool
//   setTool: (t: Tool) => void
//   saveProject: () => void
//   loadProject: (f: File | null) => void
//   exportPNG: () => void
//   undo: () => void
//   redo: () => void
// }

// const ToolBar = (props: ToolBarProps) => {
//   const { setColorMenuOpen, colorMenuOpen, colors, currColor, handleClear, fillFromCurrentPixel, handleErasePixel, setCurrColor, getCode, downloadScript, voxelSizeMm, setVoxelSizeMm, tool, setTool, saveProject, loadProject, exportPNG, undo, redo } = props
//   return (
//       <div className="toolbar">
//         <div style={{ display: 'inline-flex', gap: 6, marginRight: 12 }}>
//           <button onClick={() => setTool('pencil')} className={tool === 'pencil' ? 'active' : ''} title="Pencil"><FaPencilAlt /></button>
//           <button onClick={() => setTool('fill')} className={tool === 'fill' ? 'active' : ''} title="Fill"><FaFillDrip /></button>
//           <button onClick={() => setTool('line')} className={tool === 'line' ? 'active' : ''} title="Line"><FaSlash /></button>
//           <button onClick={() => setTool('circle')} className={tool === 'circle' ? 'active' : ''} title="Circle"><FaRegCircle /></button>
//           <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'active' : ''} title="Eraser"><BsEraserFill /></button>
//           <button onClick={() => setTool('picker')} className={tool === 'picker' ? 'active' : ''} title="Picker"><FaEyeDropper /></button>
//           <button onClick={undo} title="Undo"><FaUndo /></button>
//           <button onClick={redo} title="Redo"><FaRedo /></button>
//         </div>
//       <button onClick={() => setColorMenuOpen(!colorMenuOpen)}><IoIosColorPalette />Color</button>
//       <div className={`color-menu ${colorMenuOpen ? "open" : "hidden"}`}>
//         {colors.map((v: string, idx: number) => <div key={idx} className="color-choice" style={{ backgroundColor: v }} onClick={() => setCurrColor(v)} />)}
//         <div className="color-choice new">+</div>
//         <Circle
//           style={{ marginLeft: 20 }}
//           color={currColor}
//           onChange={(color: any) => {
//             setCurrColor(color.hex);
//           }}
//         />
//       </div>
//       <button onClick={handleClear}><MdClear />Clear</button>
//       <button onClick={fillFromCurrentPixel}><MdFormatColorFill />fill</button>
//       <button onClick={() => handleErasePixel({ x: 0, y: 0 })}><BsEraserFill />Erase</button>
//       <button onClick={getCode}><FaCode />Get Code</button>
//       <button onClick={downloadScript}><FaDownload />Download .py</button>
//   <button onClick={saveProject}>Save JSON</button>
//   <button onClick={exportPNG}>Export PNG</button>
//   <input type="file" accept="application/json" style={{ display: 'none' }} id="file-load-input" onChange={(e) => { const f = e.target.files?.[0] ?? null; loadProject(f); (e.target as HTMLInputElement).value = '' }} />
//   <button onClick={() => { const el = document.getElementById('file-load-input') as HTMLInputElement | null; el?.click() }}>Load JSON</button>
//       <label style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
//         <span style={{ fontSize: 12 }}>Voxel (mm)</span>
//         <input type="number" value={voxelSizeMm} onChange={(e) => setVoxelSizeMm(Number(e.target.value))} step={0.5} min={0.1} style={{ width: 64 }} />
//       </label>
//     </div>
//   )
// }

export default App