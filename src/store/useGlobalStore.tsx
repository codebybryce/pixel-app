import { create } from "zustand";

export type Tool = 'pencil' | 'fill' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'picker' | 'select' | 'paste';
export interface Pixel {
  x: number;
  y: number;
}
const currentEnv = window.location.href.includes('localhost')
export interface GlobalStore {
  [key: string]: any;
  inDev: boolean;
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
  removeFrame: (idx: number) => void;
  setCurrentFrame: (idx: number) => void;
  setFramePlot: (plot: string[][]) => void;
  // For backward compatibility
  plot?: string[][];
  setPlot: (plot: string[][] | undefined) => void;
  colorMenuOpen: boolean;
  setColorMenuOpen: (open: boolean) => void;

  // clipboard & edit helpers
  clipboard: string[][] | null;
  setClipboard: (clipboard: string[][] | null) => void;
  copy: () => void;
  paste: (offsetX?: number, offsetY?: number) => void;
  flipHorizontal: () => void;
  flipVertical: () => void;
  // mobile paste nudging
  pasteOffsetRow?: number;
  pasteOffsetCol?: number;
  setPasteOffset?: (row: number, col: number) => void;
  // mobile toolbar visibility
  mobileToolOpen?: boolean;
  setMobileToolOpen?: (open: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>()((set, get) => ({
  inDev: currentEnv,
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
  removeFrame: (idx) => {
    const { frames, currentFrame } = get();
    if (frames.length <= 1) return; // Always keep at least one frame
    const newFrames = frames.filter((_, i) => i !== idx);
    let newCurrent = currentFrame;
    if (currentFrame > idx) newCurrent = currentFrame - 1;
    if (currentFrame === idx) newCurrent = Math.max(0, currentFrame - 1);
    set({ frames: newFrames, currentFrame: newCurrent });
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
  selectionRegion: null,
  setSelectionRegion: (selectionRegion) => set({ selectionRegion }),
  clipboard: null,
  setClipboard: (clipboard) => set({ clipboard }),

  // Paste offset for mobile paste nudge (row, col)
  pasteOffsetRow: 0,
  pasteOffsetCol: 0,
  setPasteOffset: (pasteOffsetRow: number, pasteOffsetCol: number) => set({ pasteOffsetRow, pasteOffsetCol }),

  toolBoxOpen: false,
  setToolBoxOpen: (toolBoxOpen) => set({ toolBoxOpen }),

  // mobile toolbar visibility (for swipe open/close)
  mobileToolOpen: true,
  setMobileToolOpen: (mobileToolOpen: boolean) => set({ mobileToolOpen }),

  // copy: clone the current frame into clipboard
  copy: () => {
    const store = get();
    const plot = store.frames[store.currentFrame];
    const clip = plot.map(row => row.slice());
    set({ clipboard: clip });
  },

  // paste: overlay clipboard onto current frame at optional offsets (defaults to 0,0)
  paste: (offsetX = 0, offsetY = 0) => {
    const store = get();
    const clip = store.clipboard;
    if (!clip) return;
    const frames = store.frames.map((f, idx) => idx === store.currentFrame ? f.map(r => r.slice()) : f);
    const target = frames[store.currentFrame];
    const height = Math.min(clip.length, target.length - offsetY);
    for (let y = 0; y < height; y++) {
      const row = clip[y];
      const width = Math.min(row.length, target[0].length - offsetX);
      for (let x = 0; x < width; x++) {
        target[y + offsetY][x + offsetX] = row[x];
      }
    }
    set({ frames });
  },

  // flipHorizontal: reverse each row (mirror horizontally) for current frame
  flipHorizontal: () => {
    const store = get();
    const frames = store.frames.map((f, idx) => {
      if (idx !== store.currentFrame) return f;
      return f.map(row => row.slice().reverse());
    });
    set({ frames });
  },

  // flipVertical: reverse row order (mirror vertically) for current frame
  flipVertical: () => {
    const store = get();
    const frames = store.frames.map((f, idx) => {
      if (idx !== store.currentFrame) return f;
      return f.slice().reverse().map(r => r.slice());
    });
    set({ frames });
  },

  isDarkmode: false,
  setIsDarkMode: (theme) => set({ theme })
}));