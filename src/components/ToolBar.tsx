import React from 'react';
import { ICON_MAP } from '../utils/icons';

import type { Tool } from '../store/useGlobalStore';
import { useGlobalStore } from '../store/useGlobalStore';


export interface ToolBarProps {
    setColorMenuOpen: (open: boolean) => void;
    handleClear: () => void;
    tool: Tool;
    setTool: (tool: Tool) => void;
    undo: () => void;
    redo: () => void;
    copy: () => void;
    paste: (offsetX?: number, offsetY?: number) => void;
    flipHorizontal: () => void;
    flipVertical: () => void;
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
    const { setColorMenuOpen, handleClear, tool, setTool, undo, redo } = props;
    const { copy, paste, flipHorizontal, flipVertical } = props;

    const toolBoxOpen = useGlobalStore((s) => s.toolBoxOpen);
    const setToolBoxOpen = useGlobalStore((s) => s.setToolBoxOpen);
    const TOOL_MAP = new Set(['pencil', 'line', 'rectangle', 'circle', 'fill', 'eraser', 'picker', 'select', 'paste', 'undo', 'redo', 'clear', 'flip_horizontal', 'flip_vertical', 'copy']);

    function MobileToolBar({ setTool }: { setTool: (tool: Tool) => void }) {
        return (
            <div className="fixed bottom-1/12 left-1/2 transform -translate-x-1/2 z-50 bg-gray-100 dark:bg-gray-800 rounded-full shadow-lg flex space-x-4 px-4 py-2">
                {Array.from(TOOL_MAP).map((t) => (
                    <button key={t} className={`flex flex-col items-center justify-center text-md ${tool === t ? 'text-blue-500' : 'text-gray-600 dark:text-gray-300'}`} onClick={() => setTool(t as Tool)} title={t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')} data-tip={t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')} aria-label={t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}>
                        {ICON_MAP[t.toUpperCase() as keyof typeof ICON_MAP]}
                    </button>
                ))}
            </div>
        );

    }


    return (
        <>
            {/* {toolBoxOpen && */}
            <>
                <div className="grid grid-cols-1 gap-4 bg-gray-200 border-b border-gray-300 absolute h-[calc(100svh-3rem)] right-0 w-100% top-3rem z-10 border-r-4 p-4">
                    {TOOL_MAP.entries().map(([t]) => (
                        <button key={t} className='text-black h-[1rem] flex gap-4' onClick={() => setTool(t as Tool)} title={t.charAt(0).toUpperCase() + t.slice(1)} data-tip={t.charAt(0).toUpperCase() + t.slice(1)} aria-label={t.charAt(0).toUpperCase() + t.slice(1)}>
                            {ICON_MAP[t.toUpperCase() as keyof typeof ICON_MAP]} {t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}
                        </button>
                    ))}

                </div >
                <div className=' z-9 bg-black-50 fixed top-0 left-0' onClick={() => setToolBoxOpen(false)} />
            </>
            <MobileToolBar setTool={setTool} />
            {/* } */}
        </>
    );
};

export default ToolBar;
