import React from 'react';
import { IoIosColorPalette } from "react-icons/io";
// import { MdClear, MdFormatColorFill } from "react-icons/md";
import { BsEraserFill } from "react-icons/bs";
import { FaPencilAlt, FaFillDrip, FaSlash, FaRegCircle, FaEyeDropper, FaUndo, FaRedo, FaRegSquare, FaBorderNone } from "react-icons/fa";

import type { Tool } from '../store/useGlobalStore';


export interface ToolBarProps {
    setColorMenuOpen: (open: boolean) => void;
    handleClear: () => void;
    tool: Tool;
    setTool: (tool: Tool) => void;
    undo: () => void;
    redo: () => void;
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
    const { setColorMenuOpen, handleClear, tool, setTool, undo, redo } = props;


    return (

        <div className="toolbar">
            <div style={{ display: 'inline-flex', gap: 6, marginRight: 12 }}>
                <button aria-label="Pencil" aria-pressed={tool === 'pencil'} onClick={() => setTool('pencil')} className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`} title="Pencil"><FaPencilAlt /></button>
                <button aria-label="Fill" aria-pressed={tool === 'fill'} onClick={() => setTool('fill')} className={`tool-btn ${tool === 'fill' ? 'active' : ''}`} title="Fill"><FaFillDrip /></button>
                <button aria-label="Line" aria-pressed={tool === 'line'} onClick={() => setTool('line')} className={`tool-btn ${tool === 'line' ? 'active' : ''}`} title="Line"><FaSlash /></button>
                <button aria-label="Rectangle" aria-pressed={tool === 'rectangle'} onClick={() => setTool('rectangle')} className={`tool-btn ${tool === 'rectangle' ? 'active' : ''}`} title="Rectangle"><FaRegSquare /></button>
                <button aria-label="Circle" aria-pressed={tool === 'circle'} onClick={() => setTool('circle')} className={`tool-btn ${tool === 'circle' ? 'active' : ''}`} title="Circle"><FaRegCircle /></button>
                <button aria-label="Eraser" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')} className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} title="Eraser"><BsEraserFill /></button>
                <button aria-label="Picker" aria-pressed={tool === 'picker'} onClick={() => setTool('picker')} className={`tool-btn ${tool === 'picker' ? 'active' : ''}`} title="Picker"><FaEyeDropper /></button>
                <button aria-label="Undo" onClick={undo} className="tool-btn" title="Undo"><FaUndo /></button>
                <button aria-label="Redo" onClick={redo} className="tool-btn" title="Redo"><FaRedo /></button>
                <button aria-label="Palette" onClick={() => setColorMenuOpen(true)} className="tool-btn" title="Palette"><IoIosColorPalette /></button>
                <button aria-label="Clear" onClick={handleClear} className="tool-btn" title="Clear"><FaBorderNone /></button>

            </div>
            {/* ...existing code... */}
        </div>
    );
};

export default ToolBar;
