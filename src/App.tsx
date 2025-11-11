import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { exportSTL } from './utils/exportSTL';
import { flipHorizontal, flipVertical, rotateLeft, rotateRight } from './utils/constants';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './toast-theme.css';
import "./App.css";
import ToolBar from './components/ToolBar';
import ColorModal from './components/ColorModal';
import MenuBar from './components/MenuBar';
import FramesModal from './components/FramesModal';
import { useGlobalStore } from "./store/useGlobalStore";




function App() {
  // Firebase Auth state
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  async function handleSignIn() {
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in!');
    } catch (e) {
      toast.error('Sign in failed');
    }
  }
  async function handleSignOut() {
    try {
      await signOut(auth);
      toast.success('Signed out!');
    } catch (e) {
      toast.error('Sign out failed');
    }
  }
  // Export STL for current frame
  function handleExportSTL() {
    if (!plot) return;
    exportSTL(plot, voxelSizeMm, 'pixelart.stl');
    toast.success('STL file exported!');
  }

  // Export Blender script for current frame
  function handleExportBlender() {
    const blenderScript = generateBlenderScript();
    if (!blenderScript) {
      toast.error('No plot data');
      return;
    }
    try {
      const blob = new Blob([blenderScript], { type: 'text/x-python;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pixel_script.py';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Blender script downloaded');
    } catch (e) {
      toast.error('Download failed');
    }
  }
  // Cell size state for zoom (optional, default 20)
  const [cellSize, setCellSize] = useState<number>(20);
  // Dummy state to force re-render
  const [, forceUpdate] = useState(0);

  // All state selectors (declare only once, at the top)
  const frames = useGlobalStore((s) => s.frames);
  const currentFrame = useGlobalStore((s) => s.currentFrame);
  const addFrame = useGlobalStore((s) => s.addFrame);
  const removeFrame = useGlobalStore((s) => s.removeFrame);
  const setCurrentFrame = useGlobalStore((s) => s.setCurrentFrame);
  const setSize = useGlobalStore((s) => s.setSize);
  const size = useGlobalStore((s) => s.size);
  const currColor = useGlobalStore((s) => s.currColor);
  const setCurrColor = useGlobalStore((s) => s.setCurrColor);
  const currentPixel = useGlobalStore((s) => s.currentPixel);
  const setCurrentPixel = useGlobalStore((s) => s.setCurrentPixel);
  const plot = useGlobalStore((s) => s.frames[s.currentFrame]);
  const setPlot = useGlobalStore((s) => s.setPlot);
  const colorMenuOpen = useGlobalStore((s) => s.colorMenuOpen);
  const setColorMenuOpen = useGlobalStore((s) => s.setColorMenuOpen);
  // Use local state for mouse position for smooth custom cursor
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const showToolCursor = useGlobalStore((s) => s.showToolCursor);
  const setShowToolCursor = useGlobalStore((s) => s.setShowToolCursor);
  const shiftButtonEngaged = useGlobalStore((s) => s.shiftButtonEngaged);
  const setShiftButtonEngaged = useGlobalStore((s) => s.setShiftButtonEngaged);
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

  // MenuBar event handler
  useEffect(() => {
    function handleMenuBarAction(e: Event) {
      const custom = e as CustomEvent;
      const action = custom.detail?.action;
      switch (action) {
        case 'clear':
          handleClear(); break;
        case 'undo':
          undo(); break;
        case 'redo':
          redo(); break;
        case 'save':
          saveProject('save'); break;
        case 'saveAs':
          saveProject('saveAs'); break;
        case 'open':
          // Trigger file input for load
          document.getElementById('file-load-input')?.click();
          break;
        case 'export':
          exportPNG(); break;
        case 'exportSTL':
          handleExportSTL(); break;
        case 'exportBlender':
          handleExportBlender(); break;
        case 'cut':
          copyToClipboard();
          handleClear();
          break;
        case 'copy':
          copyToClipboard();
          break;
        case 'paste':
          pasteFromClipboard();
          break;
        case 'zoomIn':
          setCellSize((s: number) => Math.min(s + 2, 60));
          break;
        case 'zoomOut':
          setCellSize((s: number) => Math.max(s - 2, 6));
          break;
        case 'resetZoom':
          setCellSize(20);
          break;
        case 'Flip Horizontal':
          setPlot(flipHorizontal(plot));
          toast.success('Flipped horizontally');
          break;
        case 'Flip Vertical':
          setPlot(flipVertical(plot));
          toast.success('Flipped vertically');
          break;
        case 'Rotate Left':
          setPlot(rotateLeft(plot));
          toast.success('Rotated left');
          break;
        case 'Rotate Right':
          setPlot(rotateRight(plot));
          toast.success('Rotated right');
          break;
        default:
          break;
      }
    }
    window.addEventListener('pixel-app-action', handleMenuBarAction);
    return () => window.removeEventListener('pixel-app-action', handleMenuBarAction);
  }, [plot, size]);

  // Clipboard helpers
  function copyToClipboard() {
    if (!plot) return;
    navigator.clipboard.writeText(JSON.stringify(plot));
    toast.success('Copied to clipboard');
  }
  function pasteFromClipboard() {
    navigator.clipboard.readText().then(txt => {
      try {
        const arr = JSON.parse(txt);
        if (Array.isArray(arr) && Array.isArray(arr[0])) {
          setPlot(arr);
          toast.success('Pasted from clipboard');
        }
      } catch { toast.error('Clipboard data invalid'); }
    });
  }
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        // Cancel all current actions, but only reset tool if not in a shape tool
        setToolStart(null);
        setPreviewPixels([]);
        setCurrentPixel(undefined);
        setColorMenuOpen(false);
        if (tool !== 'line' && tool !== 'circle' && tool !== 'rectangle') {
          setTool('pencil');
        }
        // Close MenuBar if open
        window.dispatchEvent(new Event('pixel-app-close-menu'));
        // Force re-render to ensure ToolBar updates
        forceUpdate(n => n + 1);
      }
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [tool]);
  // Handle mouse movement for custom cursor (local state)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
    // Pantone-inspired swatch book: vibrant, pastel, and neutral
    // Vibrant primaries
    '#F44336', // Pantone Red
    '#E91E63', // Pantone Pink
    '#9C27B0', // Pantone Purple
    '#673AB7', // Pantone Violet
    '#3F51B5', // Pantone Blue
    '#2196F3', // Pantone Sky Blue
    '#03A9F4', // Pantone Light Blue
    '#00BCD4', // Pantone Cyan
    '#009688', // Pantone Teal
    '#4CAF50', // Pantone Green
    '#8BC34A', // Pantone Light Green
    '#CDDC39', // Pantone Lime
    '#FFEB3B', // Pantone Yellow
    '#FFC107', // Pantone Amber
    '#FF9800', // Pantone Orange
    '#FF5722', // Pantone Deep Orange
    '#795548', // Pantone Brown
    '#9E9E9E', // Pantone Gray
    '#607D8B', // Pantone Blue Gray
    '#FFFFFF', // White
    '#000000', // Black
    // Pastels
    '#FFD1DC', // Pastel Pink
    '#B5EAD7', // Pastel Mint
    '#C7CEEA', // Pastel Lavender
    '#FFDAC1', // Pastel Peach
    '#E2F0CB', // Pastel Green
    '#FFB7B2', // Pastel Coral
    '#B5B9FF', // Pastel Blue
    '#FFFACD', // Pastel Lemon
    '#F1CBFF', // Pastel Purple
    '#C1F0F6', // Pastel Aqua
    // Neutrals
    '#ECECEC', // Light Gray
    '#B0A990', // Taupe
    '#A9A9A9', // Dark Gray
    '#D7CCC8', // Warm Gray
    '#CFCFC4', // Cool Gray
    '#BDBDBD', // Silver Gray
    '#F5F5F5', // Off White
    '#D2B48C', // Tan
    '#A0522D', // Sienna
    '#8B4513', // Saddle Brown
    // Pantone brights
    '#FF6F61', // Living Coral
    '#6B5B95', // Ultra Violet
    '#88B04B', // Greenery
    '#F7CAC9', // Rose Quartz
    '#92A8D1', // Serenity
    '#955251', // Marsala
    '#B565A7', // Radiant Orchid
    '#009B77', // Emerald
    '#DD4124', // Tangerine Tango
    '#D65076', // Pink Yarrow
    '#45B8AC', // Turquoise
    '#EFC050', // Mimosa
    '#5B5EA6', // Classic Blue
    '#9B2335', // Chili Pepper
    '#DFCFBE', // Sand
    '#55B4B0', // Biscay Green
    '#E15D44', // Flame
    '#BC243C', // Jester Red
    '#C3447A', // Magenta Purple
    '#98B4D4', // Little Boy Blue
    '#C964CF', // Crocus Petal
    '#FFA756', // Mango Mojito
    '#BFD641', // Lime Punch
    '#00A591', // Arcadia
    '#F0EAD6', // Soybean
    '#D6CADD', // Lavender Gray
    '#EAE6DA', // Almond Oil
    '#B4835B', // Meerkat
    '#F3E96B', // Aspen Gold
    '#F7786B', // Peach Echo
    '#6C4F3D', // Rocky Road
    '#DEC7A6', // Sweet Corn
    '#BCB7B6', // Oyster Mushroom
    '#B2BEB5', // Quiet Gray
    '#EDE6DB', // Vanilla Custard
    '#EAE1DF', // Blanc de Blanc
    '#D8CAB8', // Crème de Pêche
    '#E5D3B3', // Lemon Meringue
    '#F6E3B4', // Golden Glow
    '#F9E076', // Sunlight
    '#F7C59F', // Apricot
    '#F5B895', // Coral Sands
    '#F6D155', // Primrose Yellow
    '#EFC7B7', // Rose Water
    '#F7CAC9', // Pale Dogwood
    '#BFD8B8', // Seafoam Green
    '#B5B9FF', // Periwinkle
    '#B7C9E2', // Powder Blue
    '#B2A1A1', // Mushroom
    '#B9B8B5', // Silver Lining
    '#B5B5B5', // Gray Violet
  ];
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
    // Haptic feedback: vibrate for 10ms if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
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
    } else if (tool === 'line' || tool === 'circle' || tool === 'rectangle') {
      if (!toolStart) {
        setToolStart(params)
      } else {
        pushUndo();
        if (tool === 'line') drawLine(toolStart, params, currColor || 'transparent')
        if (tool === 'circle') drawCircle(toolStart, params, currColor || 'transparent')
        if (tool === 'rectangle') drawRectangle(toolStart, params, currColor || 'transparent')
        setToolStart(null)
        setPreviewPixels([])
      }
    }
  }
  // Preview overlay for line/circle/rectangle
  function handlePreview(to: { x: number; y: number }) {
    if (!toolStart) return setPreviewPixels([])
    if (tool === 'line') {
      setPreviewPixels(getLinePixels(toolStart, to))
    } else if (tool === 'circle') {
      setPreviewPixels(getCirclePerimeterPixels(toolStart, to))
    } else if (tool === 'rectangle') {
      setPreviewPixels(getRectanglePerimeterPixels(toolStart, to))
    } else {
      setPreviewPixels([])
    }
  }

  function getRectanglePerimeterPixels(a: { x: number; y: number }, b: { x: number; y: number }) {
    // Get all four sides of the rectangle perimeter
    const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y), maxY = Math.max(a.y, b.y);
    const points: { x: number; y: number }[] = [];
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

  function drawRectangle(a: { x: number; y: number }, b: { x: number; y: number }, color: string) {
    // Draw only the perimeter, like the circle tool
    const points = getRectanglePerimeterPixels(a, b);
    if (!plot) return;
    const newPlot = plot.map(row => row.slice());
    points.forEach(p => {
      if (newPlot[p.x] && typeof newPlot[p.x][p.y] !== 'undefined') newPlot[p.x][p.y] = color;
    });
    setPlot(newPlot);
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
    if (!plot) return;
    const newPlot = plot.map((row: string[]) => row.slice());
    newPlot[params.x][params.y] = 'transparent';
    setPlot(newPlot);
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
  function saveProject(mode: 'save' | 'saveAs' = 'save') {
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
      let filename = 'pixel-project.json';
      if (mode === 'saveAs') {
        const userName = window.prompt('Enter file name:', 'pixel-project.json');
        if (userName && userName.trim()) {
          filename = userName.trim().endsWith('.json') ? userName.trim() : userName.trim() + '.json';
        }
      }
      a.href = url
      a.download = filename
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

  const [framesMenuOpen, setFramesMenuOpen] = useState(false)



  return (
    <div className="App">

      <ToastContainer
        toastClassName="toastify-theme-pixel"
        className="toastify-theme-pixel"
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <header>
        <MenuBar />
        <div style={{ position: 'absolute', top: 18, right: 24, zIndex: 100 }}>
          {user ? (
            <>
              <span style={{ color: '#ffb300', marginRight: 12 }}>Hi, {user.displayName || user.email}</span>
              <button onClick={handleSignOut} style={{ background: '#23272e', color: '#ffb300', border: '1px solid #444', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
            </>
          ) : (
            <button onClick={handleSignIn} style={{ background: '#23272e', color: '#ffb300', border: '1px solid #444', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}>Sign In</button>
          )}
        </div>
      </header>
      {/* <div className='mini-plot'>
        {plot?.map((val: string[], i: number) => {
          return <div key={i}>{val.map((v: string, j: number) => <div onClick={() => handleSetPixel({ x: i, y: j })} className="pixel" key={j} style={{ backgroundColor: v, width: 1, height: 1 }} />)}</div>
        })}
      </div> */}
      <div style={{ marginTop: '80px' }}>
        {/* Frame controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
          <button
            style={{
              fontWeight: 600,
              background: '#23272e',
              color: '#ffb300',
              border: '1px solid #444',
              borderRadius: 6,
              padding: '8px 18px',
              cursor: 'pointer',
              fontSize: 16
            }}
            onClick={() => setFramesMenuOpen(true)}
          >
            Frames
          </button>
          <span style={{ marginLeft: 24, fontWeight: 500 }}>Pixel Count:</span>
          <input
            type="number"
            min={2}
            max={64}
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="pixel-count-input"
          />
        </div>
        <FramesModal
          open={framesMenuOpen}
          onClose={() => setFramesMenuOpen(false)}
          frames={frames}
          currentFrame={currentFrame}
          setCurrentFrame={setCurrentFrame}
          addFrame={addFrame}
          removeFrame={removeFrame}
        />
        <div
          className='plot'
          onMouseEnter={() => setShowToolCursor(true)}
          onMouseLeave={() => setShowToolCursor(false)}
        >
          {plot?.map((val: string[], i: number) => {
            return <div key={i}>{val.map((v: string, j: number) => {
              const isPreview = previewPixels.some(p => p.x === i && p.y === j)
              return (
                <div
                  onMouseEnter={() => { handleMouseEnterPixel({ x: i, y: j }); if (toolStart && (tool === 'line' || tool === 'circle' || tool === 'rectangle')) handlePreview({ x: i, y: j }) }}
                  onMouseLeave={handleMouseLeavePixel}
                  onClick={() => handleSetPixel({ x: i, y: j })}
                  className={`pixel${isPreview ? ' preview' : ''}`}
                  key={j}
                  style={{ backgroundColor: isPreview ? currColor : v, opacity: isPreview ? 0.5 : 1, width: cellSize, height: cellSize }} />
              )
            })}</div>
          })}
        </div>
      </div>
      {showToolCursor && (
        <div
          id="cursor"
          className="custom-cursor filled-circle"
          style={{
            position: 'fixed',
            // Offset: 10px right, 10px down from pointer
            left: `${mousePos.x + 10}px`,
            top: `${mousePos.y + 10}px`,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <div className="cursor-color-indicator small" style={{ background: currColor }} />
        </div>
      )}
      <div id="picker" className='color'></div>
      <ToolBar
        setColorMenuOpen={setColorMenuOpen}
        handleClear={handleClear}
        fillFromCurrentPixel={fillFromCurrentPixel}
        handleErasePixel={handleErasePixel}
        getCode={getCode}
        downloadScript={downloadScript}
        tool={tool}
        setTool={setTool}
        saveProject={saveProject}
        undo={undo}
        redo={redo}
      />
      <ColorModal
        open={colorMenuOpen}
        onClose={() => setColorMenuOpen(false)}
        colors={colors}
        currColor={currColor}
        setCurrColor={setCurrColor}
      />
    </div>


  )
}



export default App