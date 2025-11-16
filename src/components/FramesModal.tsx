import React from 'react';

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
          {frames.map((frame, idx) => {
            const rows = frame.length;
            const cols = frame[0]?.length || 0;
            const rowIdxs = Array.from({ length: previewSize }, (_, i) => Math.floor(i * rows / previewSize));
            const colIdxs = Array.from({ length: previewSize }, (_, j) => Math.floor(j * cols / previewSize));
            return (
              <div key={idx} style={{
                display: 'inline-block',
                border: idx === currentFrame ? '2px solid #ffb300' : '1px solid #444',
                borderRadius: 4,
                background: '#181a20',
                boxShadow: idx === currentFrame ? '0 2px 8px rgba(0,0,0,0.18)' : undefined,
                position: 'relative',
                cursor: 'pointer',
                padding: 2
              }}>
                <div onClick={() => setCurrentFrame(idx)} style={{ display: 'grid', gridTemplateColumns: `repeat(${previewSize}, 1fr)`, width: 28, height: 28, gap: 0 }}>
                  {rowIdxs.map((i) =>
                    colIdxs.map((j) => {
                      const color = frame[i]?.[j] || 'transparent';
                      return <div key={i + '-' + j} style={{ width: 5, height: 5, background: color, border: '1px solid #23272e', borderRadius: 1 }} />
                    })
                  )}
                </div>
                {frames.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); removeFrame(idx); }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffb300',
                      border: 'none',
                      borderRadius: '0 4px 0 4px',
                      width: 14,
                      height: 14,
                      fontSize: 10,
                      cursor: 'pointer',
                      lineHeight: '12px',
                      padding: 0
                    }}
                    title="Remove frame"
                  >×</button>
                )}
              </div>
            );
          })}
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
