import React from 'react';
import { IoIosColorPalette } from "react-icons/io";
import { MdClear, MdFormatColorFill } from "react-icons/md";
import { Circle } from '@uiw/react-color';
import { BsEraserFill } from "react-icons/bs";
import { FaCode, FaDownload, FaPencilAlt, FaFillDrip, FaSlash, FaRegCircle, FaEyeDropper, FaUndo, FaRedo } from "react-icons/fa";

type Tool = 'pencil' | 'fill' | 'eraser' | 'line' | 'circle' | 'picker' | 'rectangle' | 'color';

export interface ToolBarProps {
    setColorMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    colorMenuOpen: boolean;
    colors: string[];
    currColor: string;
    handleClear: () => void;
    fillFromCurrentPixel: () => void;
    handleErasePixel: (p: { x: number; y: number }) => void;
    setCurrColor: (c: string) => void;
    getCode: () => void;
    downloadScript: () => void;
    voxelSizeMm: number;
    setVoxelSizeMm: (n: number) => void;
    tool: Tool;
    setTool: (t: Tool) => void;
    saveProject: () => void;
    loadProject: (f: File | null) => void;
    exportPNG: () => void;
    undo: () => void;
    redo: () => void;
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
    const { setColorMenuOpen, colorMenuOpen, colors, currColor, handleClear, fillFromCurrentPixel, handleErasePixel, setCurrColor, getCode, downloadScript, voxelSizeMm, setVoxelSizeMm, tool, setTool, saveProject, loadProject, exportPNG, undo, redo } = props;
   
    
    return (
        <div className="toolbar">
            <div style={{ display: 'inline-flex', gap: 6, marginRight: 12 }}>
                <button onClick={() => setTool('pencil')} className={tool === 'pencil' ? 'active' : ''} title="Pencil"><FaPencilAlt /></button>
                <button onClick={() => setTool('fill')} className={tool === 'fill' ? 'active' : ''} title="Fill"><FaFillDrip /></button>
                <button onClick={() => setTool('line')} className={tool === 'line' ? 'active' : ''} title="Line"><FaSlash /></button>
                <button onClick={() => setTool('rectangle')} className={tool === 'rectangle' ? 'active' : ''} title="Rectangle">▭</button>
                <button onClick={() => setTool('circle')} className={tool === 'circle' ? 'active' : ''} title="Circle"><FaRegCircle /></button>
                <button onClick={() => setTool('eraser')} className={tool === 'eraser' ? 'active' : ''} title="Eraser"><BsEraserFill /></button>
                <button onClick={() => setTool('picker')} className={tool === 'picker' ? 'active' : ''} title="Picker"><FaEyeDropper /></button>
                <button onClick={undo} title="Undo"><FaUndo /></button>
                <button onClick={redo} title="Redo"><FaRedo /></button>
                <button onClick={() => setColorMenuOpen(!colorMenuOpen)} className={tool === 'color' ? 'active' : ''} title="Picker"><IoIosColorPalette /></button>
                <div className={`color-menu ${colorMenuOpen ? "open" : "hidden"}`}>
                    {colors.map((v: string, idx: number) => <div key={idx} className="color-choice" style={{ backgroundColor: v }} onClick={() => setCurrColor(v)} />)}
                    <div className="color-choice new">+</div>
                    <Circle
                        style={{ marginLeft: 20 }}
                        color={currColor}
                        onChange={(color: any) => {
                            setCurrColor(color.hex);
                        }}
                    />
            </div>
            </div>
            <button onClick={handleClear}><MdClear />Clear</button>
            <button onClick={fillFromCurrentPixel}><MdFormatColorFill />fill</button>
            <button onClick={() => handleErasePixel({ x: 0, y: 0 })}><BsEraserFill />Erase</button>
            <button onClick={getCode}><FaCode />Get Code</button>
            <button onClick={downloadScript}><FaDownload />Download .py</button>
            <button onClick={saveProject}>Save JSON</button>
            {/* <button onClick={exportPNG}>Export PNG</button> */}
            {/* <input type="file" accept="application/json" style={{ display: 'none' }} id="file-load-input" onChange={(e) => { const f = e.target.files?.[0] ?? null; loadProject(f); (e.target as HTMLInputElement).value = '' }} /> */}
            {/* <button onClick={() => { const el = document.getElementById('file-load-input') as HTMLInputElement | null; el?.click() }}>Load JSON</button> */}
            {/* <label style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12 }}>Voxel (mm)</span>
                <input type="number" value={voxelSizeMm} onChange={(e) => setVoxelSizeMm(Number(e.target.value))} step={0.5} min={0.1} style={{ width: 64 }} />
            </label>  */}
        </div>
    );
};

export default ToolBar;
