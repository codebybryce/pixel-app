import style from "./mobilePixelGrid.module.css";
import { useState, useEffect } from "react";
import { useGlobalStore } from '../../../store/useGlobalStore';

type MobilePixelGridProps = {
  columns: number;
  rows: number;
};

const renderPixels = (columns: number, rows: number): (number | string)[][] => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => 0)
  );
};

const MobilePixelGrid = ({ columns, rows }: MobilePixelGridProps) => {
  const [activePixelCanvas, setActivePixelCanvas] = useState<
    (number | string)[][]
  >(() => renderPixels(columns, rows));

  // Use global plot if available
  const plot = useGlobalStore((s) => s.frames[s.currentFrame]);

  useEffect(() => {
    // If no saved project, default to a smaller mobile grid
    const c = localStorage.getItem('lastProject') ? columns : 8;
    const r = localStorage.getItem('lastProject') ? rows : 8;
    setActivePixelCanvas(renderPixels(c, r));
  }, [columns, rows]);

  return (
    <div
      className={style.mobilePixelGrid}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {(plot || activePixelCanvas).map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className={style.pixel}
            style={{
              backgroundColor: typeof cell === "string" ? cell : undefined,
            }}
            data-row={rowIndex}
            data-col={colIndex}
            onClick={() => window.dispatchEvent(new CustomEvent('pixel-app-click', { detail: { x: rowIndex, y: colIndex } }))}
          />
        ))
      )}
    </div>
  );
};

export default MobilePixelGrid;
