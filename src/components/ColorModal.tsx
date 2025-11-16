import React from 'react';
import { Circle } from '@uiw/react-color';

interface ColorModalProps {
  open: boolean;
  onClose: () => void;
  colors: string[];
  currColor: string;
  setCurrColor: (c: string) => void;
}

const ColorModal: React.FC<ColorModalProps> = ({ open, onClose, colors, currColor, setCurrColor }) => {
  if (!open) return null;
  return (
    <div className="color-modal-overlay" onClick={onClose}>
      <div className="color-modal" onClick={e => e.stopPropagation()}>
        <button className="color-modal-close" onClick={onClose}>&times;</button>
        <div className="color-modal-palette">
          {colors.map((v, idx) => (
            <div key={idx} className="color-choice" style={{ backgroundColor: v }} onClick={() => setCurrColor(v)} />
          ))}
          <div className="color-choice new">+</div>
        </div>
        <Circle
          style={{ margin: '20px auto 0', display: 'block' }}
          color={currColor}
          onChange={(color: any) => setCurrColor(color.hex)}
        />
      </div>
    </div>
  );
};

export default ColorModal;
