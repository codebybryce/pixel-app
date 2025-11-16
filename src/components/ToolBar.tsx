import React from 'react';
import { IoIosColorPalette } from "react-icons/io";
import { MdClear, MdFormatColorFill } from "react-icons/md";
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
                <button onClick={() => setTool('pencil')} className={tool === 'pencil' ? 'active' : ''} title="Pencil"><FaPencilAlt /></button>
                <button onClick={() => setTool('fill')} className={tool === 'fill' ? 'active' : ''} title="Fill"><FaFillDrip /></button>
                <button onClick={() => setTool('line')} className={tool === 'line' ? 'active' : ''} title="Line"><FaSlash /></button>
                <button onClick={() => setTool('rectangle')} className={tool === 'rectangle' ? 'active' : ''} title="Rectangle"><FaRegSquare /></button>
                <button onClick={() => setTool('circle')} className={tool === 'circle' ? 'active' : ''} title="Circle"><FaRegCircle /></button>
                <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'active' : ''} title="Eraser"><BsEraserFill /></button>
                <button onClick={() => setTool('picker')} className={tool === 'picker' ? 'active' : ''} title="Picker"><FaEyeDropper /></button>
                <button onClick={undo} title="Undo"><FaUndo /></button>
                <button onClick={redo} title="Redo"><FaRedo /></button>
                <button onClick={() => setColorMenuOpen(true)} title="Palette"><IoIosColorPalette /></button>
                <button onClick={handleClear}><FaBorderNone /></button>

            </div>
            {/* ...existing code... */}
        </div>
    );
};

export default ToolBar;
