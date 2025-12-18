import React, { useEffect, useRef, useState } from 'react';
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

    const [isToolBarExpanded, setIsToolBarExpanded] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const touchStartY = useRef<number | null>(null)
    const touchMoved = useRef(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
            setIsTouchDevice(Boolean(touch))
        }
    }, [])

    const onTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length !== 1) return
        touchStartY.current = e.touches[0].clientY
        touchMoved.current = false
    }

    const onTouchMove = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return
        const currentY = e.touches[0].clientY
        const delta = (touchStartY.current - currentY)
        // small movement threshold for responsiveness
        if (Math.abs(delta) > 6) touchMoved.current = true
    }

    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return
        if (!touchMoved.current) {
            // treat as tap
            setIsToolBarExpanded(prev => !prev)
            touchStartY.current = null
            return
        }
        const endY = e.changedTouches[0].clientY
        const delta = (touchStartY.current - endY)
        const threshold = 40
        if (delta > threshold) {
            // swiped up
            setIsToolBarExpanded(true)
        } else if (delta < -threshold) {
            // swiped down
            setIsToolBarExpanded(false)
        }
        touchStartY.current = null
        touchMoved.current = false
    }


    return (

        <div className={`toolbar ${isToolBarExpanded ? 'expanded' : 'collapsed'}`} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            {/* Thumb indicator for mobile / toggle handle for desktop */}
            <div
                role="button"
                tabIndex={0}
                className="toolbar-thumb"
                onClick={() => { if (!isTouchDevice) setIsToolBarExpanded(v => !v) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!isTouchDevice) setIsToolBarExpanded(v => !v) } }}
                aria-label={isToolBarExpanded ? 'Collapse tools' : 'Expand tools'}
            >
                <div className="thumb-bar" />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
                marginRight: '12px',
                flexDirection: 'column',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'inline-flex', gap: 10, marginRight: 12, marginBottom: 12 }}>
                    <button aria-label="Pencil" aria-pressed={tool === 'pencil'} onClick={() => setTool('pencil')} className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`} title="Pencil"><FaPencilAlt /></button>
                    <button aria-label="Eraser" aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')} className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`} title="Eraser"><BsEraserFill /></button>
                    <button aria-label="Fill" aria-pressed={tool === 'fill'} onClick={() => setTool('fill')} className={`tool-btn ${tool === 'fill' ? 'active' : ''}`} title="Fill"><FaFillDrip /></button>
                    <button aria-label="Line" aria-pressed={tool === 'line'} onClick={() => setTool('line')} className={`tool-btn ${tool === 'line' ? 'active' : ''}`} title="Line"><FaSlash /></button>
                    <button aria-label="Rectangle" aria-pressed={tool === 'rectangle'} onClick={() => setTool('rectangle')} className={`tool-btn ${tool === 'rectangle' ? 'active' : ''}`} title="Rectangle"><FaRegSquare /></button>
                    <button aria-label="Palette" onClick={() => setColorMenuOpen(true)} className="tool-btn" title="Palette"><IoIosColorPalette /></button>
                </div>
                <div style={{ display: 'inline-flex', gap: 10, marginRight: 12 }}>
                    <button aria-label="Circle" aria-pressed={tool === 'circle'} onClick={() => setTool('circle')} className={`tool-btn ${tool === 'circle' ? 'active' : ''}`} title="Circle"><FaRegCircle /></button>
                    <button aria-label="Picker" aria-pressed={tool === 'picker'} onClick={() => setTool('picker')} className={`tool-btn ${tool === 'picker' ? 'active' : ''}`} title="Picker"><FaEyeDropper /></button>
                    <button aria-label="Undo" onClick={undo} className="tool-btn" title="Undo"><FaUndo /></button>
                    <button aria-label="Redo" onClick={redo} className="tool-btn" title="Redo"><FaRedo /></button>
                    <button aria-label="Clear" onClick={handleClear} className="tool-btn" title="Clear"><FaBorderNone /></button>

                </div>


            </div>
            {/* ...existing code... */}
        </div>
    );
};

export default ToolBar;
