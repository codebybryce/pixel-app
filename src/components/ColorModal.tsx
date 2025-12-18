import React from 'react';
import { Circle } from '@uiw/react-color';

interface ColorModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
// TODO: Refactor to general Modal Component name
const ColorModal: React.FC<ColorModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="color-modal-overlay" onClick={onClose}>
      <div className="color-modal" onClick={e => e.stopPropagation()}>
        <button className="color-modal-close" onClick={onClose}>&times;</button>
        {children}
        {/* <div className="color-modal-palette">
          {colors.map((v, idx) => (
            <div key={idx} className="color-choice" style={{ backgroundColor: v }} onClick={() => setCurrColor(v)} />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ColorModal;
