// lightweight modal for listing/loading cloud projects

type Project = {
  id: string;
  title?: string;
  size?: number;
  updatedAt?: any;
};

export default function CloudProjectsModal({
  open,
  onClose,
  projects,
  onLoad,
  onDelete,
  onSelect,
  selectedId,
  onUpdateSelection,
  onUpdate,
  loading
}: {
  open: boolean;
  onClose: () => void;
  projects: Project[];
  onLoad: (p: Project) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  onUpdateSelection: (id: string | null) => void;
  onUpdate?: (id: string | null) => void;
  loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 'min(720px, 96vw)', maxHeight: '86vh', overflow: 'auto', background: '#181a20', borderRadius: 12, padding: 18, border: '1px solid #23272e' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, color: '#f5f5f7' }}>Cloud Projects</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading && <div className="spinner-small" style={{ width: 18, height: 18 }} />}
            <button onClick={onClose} style={{ background: 'none', border: '1px solid #333', color: '#f5f5f7', padding: '6px 10px', borderRadius: 8 }}>Close</button>
          </div>
        </div>
        {projects.length === 0 ? (
          <div style={{ color: '#bbb' }}>No projects found in your cloud workspace.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {projects.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: 'rgba(36,37,42,0.6)', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input type="radio" name="cloud-selected" checked={selectedId === p.id} onChange={() => onSelect(p.id)} />
                  <div>
                    <div style={{ color: '#f5f5f7', fontWeight: 600 }}>{p.title || 'Untitled'}</div>
                    <div style={{ color: '#aaa', fontSize: 12 }}>{p.size ?? '?'} px</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onLoad(p)} style={{ background: '#23272e', color: '#ffb300', borderRadius: 8, padding: '6px 10px', border: '1px solid #444' }}>Load</button>
                  <button onClick={() => onDelete(p.id)} style={{ background: 'transparent', color: '#f5f5f7', borderRadius: 8, padding: '6px 10px', border: '1px solid #444' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
          <button onClick={() => onUpdateSelection(selectedId)} style={{ background: '#23272e', color: '#ffb300', borderRadius: 8, padding: '8px 12px', border: '1px solid #444' }}>Set Selected</button>
          <button disabled={!selectedId || loading} onClick={() => onUpdate && onUpdate(selectedId)} style={{ background: '#23272e', color: '#f5f5f7', borderRadius: 8, padding: '8px 12px', border: '1px solid #444' }}>{loading ? 'Working...' : 'Update Selected'}</button>
        </div>
      </div>
    </div>
  );
}
