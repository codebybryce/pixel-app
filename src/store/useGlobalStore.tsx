import { create } from "zustand";

export type Tool = 'pencil' | 'fill' | 'eraser' | 'line' | 'circle' | 'picker';

export interface Pixel {
  x: number;
  y: number;
}

export interface GlobalStore {
  size: number;
  setSize: (size: number) => void;
  currColor: string;
  setCurrColor: (color: string) => void;
  currentPixel?: Pixel;
  setCurrentPixel: (pixel: Pixel | undefined) => void;
  // Frame management
  frames: string[][][]; // Array of plots (frames)
  currentFrame: number; // Index of current frame
  addFrame: () => void;
  setCurrentFrame: (idx: number) => void;
  setFramePlot: (plot: string[][]) => void;
  // For backward compatibility
  plot?: string[][];
  setPlot: (plot: string[][] | undefined) => void;
  colorMenuOpen: boolean;
  setColorMenuOpen: (open: boolean) => void;
  mousePos: Pixel;
  setMousePos: (pos: Pixel) => void;
  showToolCursor: boolean;
  setShowToolCursor: (show: boolean) => void;
  shiftButtonEngaged: boolean;
  setShiftButtonEngaged: (engaged: boolean) => void;
  pixelMultiplier: number;
  setPixelMultiplier: (mult: number) => void;
  voxelSizeMm: number;
  setVoxelSizeMm: (mm: number) => void;
  tool: Tool;
  setTool: (tool: Tool) => void;
  toolStart: Pixel | null;
  setToolStart: (start: Pixel | null) => void;
  previewPixels: Pixel[];
  setPreviewPixels: (pixels: Pixel[]) => void;
  undoStack: string[][][];
  setUndoStack: (stack: string[][][]) => void;
  redoStack: string[][][];
  setRedoStack: (stack: string[][][]) => void;
}

export const useGlobalStore = create<GlobalStore>()((set, get) => ({
  size: 20,
  setSize: (size) => {
    set({ size });
    // When size changes, resize current frame, preserving as much data as possible
    const { currentFrame, frames } = get();
    const oldPlot = frames[currentFrame] || [];
    const oldRows = oldPlot.length;
    const oldCols = oldPlot[0]?.length || 0;
    const newPlot = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) =>
        (i < oldRows && j < oldCols) ? oldPlot[i][j] : "transparent"
      )
    );
    const newFrames = frames.map((f, i) => i === currentFrame ? newPlot : f);
    set({ frames: newFrames });
  },
  currColor: "",
  setCurrColor: (currColor) => set({ currColor }),
  currentPixel: undefined,
  setCurrentPixel: (currentPixel) => set({ currentPixel }),
  frames: [Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => "transparent"))],
  currentFrame: 0,
  addFrame: () => {
    const { frames, size } = get();
    const newFrame = Array.from({ length: size }, () => Array.from({ length: size }, () => "transparent"));
    set({ frames: [...frames, newFrame], currentFrame: frames.length });
  },
  setCurrentFrame: (idx) => set({ currentFrame: idx }),
  setFramePlot: (plot) => {
    const { frames, currentFrame } = get();
    const newFrames = frames.map((f, i) => i === currentFrame ? plot : f);
    set({ frames: newFrames });
  },
  // For backward compatibility
  get plot() {
    return get().frames[get().currentFrame];
  },
  setPlot: (plot) => {
    if (!plot) return;
    const { frames, currentFrame } = get();
    const newFrames = frames.map((f, i) => i === currentFrame ? plot : f);
    set({ frames: newFrames });
  },
  colorMenuOpen: false,
  setColorMenuOpen: (colorMenuOpen) => set({ colorMenuOpen }),
  mousePos: { x: 0, y: 0 },
  setMousePos: (mousePos) => set({ mousePos }),
  showToolCursor: false,
  setShowToolCursor: (showToolCursor) => set({ showToolCursor }),
  shiftButtonEngaged: false,
  setShiftButtonEngaged: (shiftButtonEngaged) => set({ shiftButtonEngaged }),
  pixelMultiplier: 10,
  setPixelMultiplier: (pixelMultiplier) => set({ pixelMultiplier }),
  voxelSizeMm: 2,
  setVoxelSizeMm: (voxelSizeMm) => set({ voxelSizeMm }),
  tool: 'pencil',
  setTool: (tool) => set({ tool }),
  toolStart: null,
  setToolStart: (toolStart) => set({ toolStart }),
  previewPixels: [],
  setPreviewPixels: (previewPixels) => set({ previewPixels }),
  undoStack: [],
  setUndoStack: (undoStack) => set({ undoStack }),
  redoStack: [],
  setRedoStack: (redoStack) => set({ redoStack }),
}));