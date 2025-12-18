import React from 'react';
import Button from './button/Button';

interface FramesModalProps {
  open: boolean;
  onClose: () => void;
  frames: string[][][];
  currentFrame: number;
  setCurrentFrame: (idx: number) => void;
  addFrame: () => void;
  removeFrame: (idx: number) => void;
}

const previewSize = 5;

const FramesModal: React.FC<FramesModalProps> = ({ open, onClose, frames, currentFrame, setCurrentFrame, addFrame, removeFrame }) => {
  if (!open) return null;

  return (
    <div className="color-modal-overlay" onClick={onClose}>
      {/* <button onClick={onClose} style={{ marginTop: 8, padding: '6px 18px', borderRadius: 6, background: '#23272e', color: '#ffb300', border: '1px solid #444', cursor: 'pointer' }}>Close</button> */}
      <div className="color-modal frames-modal" onClick={e => e.stopPropagation()}>
        <button className="color-modal-close" onClick={onClose}>&times;</button>
        <h2 style={{ marginBottom: 16 }}>Frames</h2>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {
            frames.map((frame, i) => (
              <div key={i} style={{ display: 'inline-block', marginRight: 8, border: i === currentFrame ? '2px solid #ffb300' : '1px solid #444', cursor: 'pointer', padding: 2 }}
                onClick={() => setCurrentFrame(i)}
              >
                {Array.from({ length: frame[0]?.length || 0 }).map((_, ri) => (
                  <div key={ri} style={{ display: 'flex' }}>
                    {frame.map((col, ci) => (
                      <div
                        key={ci}
                        style={{
                          width: previewSize,
                          height: previewSize,
                          background: col[ri],
                          border: '1px solid #222'
                        }}
                      />
                    ))}
                  </div>
                ))}
                <Button onClickAction={e => {
                  e.stopPropagation();
                  removeFrame(i);
                }}
                  title="Remove"
                />
                <button
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#23272e',
                    color: '#ffb300',
                    border: '1px solid #444',
                    cursor: 'pointer'
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    removeFrame(i);
                  }}
                  disabled={frames.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))
          }
        </div>
        <button
          className="frame-btn add-frame"
          onClick={addFrame}
          style={{ height: 32 }}
        >+ Add Frame</button>

      </div>
    </div>
  );
};

export default FramesModal;
