export const IMAGE_MENU = [
    'Flip Horizontal',
    'Flip Vertical',
    'Rotate Left',
    'Rotate Right',
];
// Image manipulation functions for IMAGE_MENU
/**
 * Flip a 2D array horizontally
 */
export function flipHorizontal(arr) {
    return arr.map(row => [...row].reverse());
}

/**
 * Flip a 2D array vertically
 */
export function flipVertical(arr) {
    return [...arr].reverse();
}

/**
 * Rotate a 2D array 90 degrees left (counterclockwise)
 */
export function rotateLeft(arr) {
    const N = arr.length;
    return arr[0].map((_, i) => arr.map(row => row[i])).reverse();
}

/**
 * Rotate a 2D array 90 degrees right (clockwise)
 */
export function rotateRight(arr) {
    const N = arr.length;
    return arr[0].map((_, i) => arr.map(row => row[N - 1 - i]));
}
export const MENU_ITEMS = ['File', 'Edit', 'View', 'Image', 'Help'];

export const FILE_MENU = [
    'New',
    'Open',
    'Save',
    'Save As',
    'Export PNG',
    'Export STL',
    'Export Blender',
]

export const EDIT_MENU = [
    'Undo',
    'Redo',
    'Cut',
    'Copy',
    'Paste',
]

export const VIEW_MENU = [
    'Zoom In',
    'Zoom Out',
    'Reset Zoom',
]

export const HELP_MENU = [
    'Documentation',
    'About',
]   
