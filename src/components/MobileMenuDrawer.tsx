export default function MobileMenuDrawer({
  open,
  onClose,
  width,
  height,
  setWidth,
  setHeight,
  title,
  setTitle,
  onSave,
  onSaveAs,
  onOpenCloud
}: {
  open: boolean;
  onClose: () => void;
  width: number;
  height: number;
  setWidth: (n: number) => void;
  setHeight: (n: number) => void;
  title: string;
  setTitle: (s: string) => void;
  onSave: () => void;
  onSaveAs: () => void;
  onOpenCloud: () => void;
}) {
  if (!open) return null;
  return (
    <div className="mobile-drawer-overlay" role="dialog" aria-modal="true">
      <div className="mobile-drawer">
        <div className="mobile-drawer-header">
          <h3 style={{ margin: 0 }}>Project</h3>
          <button onClick={onClose} className="menu-btn">Close</button>
        </div>
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#cfcfcf' }}>Width</label>
              <input type="number" min={2} max={256} value={width} onChange={e => setWidth(Number(e.target.value))} className="pixel-count-input" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: '#cfcfcf' }}>Height</label>
              <input type="number" min={2} max={256} value={height} onChange={e => setHeight(Number(e.target.value))} className="pixel-count-input" />
            </div>
          </div>
          <label style={{ fontSize: 12, color: '#cfcfcf' }}>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #333', background: '#121216', color: '#fff' }} />

          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <button onClick={onSave} className="frame-btn" style={{ flex: 1 }}>Save</button>
            <button onClick={onSaveAs} className="frame-btn" style={{ flex: 1 }}>Save As</button>
          </div>

          <button onClick={onOpenCloud} className="frame-btn" style={{ width: '100%' }}>Cloud Manager</button>
          <div style={{ color: '#9aa', fontSize: 13 }}>Advanced settings moved to the drawer on mobile.</div>
        </div>
      </div>
    </div>
  );
}
