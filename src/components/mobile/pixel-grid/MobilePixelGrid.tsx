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
    if (!localStorage.getItem('lastProject')) {
      columns = 8;
      rows = 8
    }
    setActivePixelCanvas(renderPixels(columns, rows));
  }, [columns, rows]);

  return (

    <div
      className={style.mobilePixelGrid}
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
          >
          </button>
        ))
      )}
    </div>

  );
};

export default MobilePixelGrid;