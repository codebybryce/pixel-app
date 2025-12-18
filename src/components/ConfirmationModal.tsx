import { useEffect, useRef } from 'react';

export default function ConfirmationModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}: {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastActive = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    // focus the confirm button when opened
    setTimeout(() => firstButtonRef.current?.focus(), 0);

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
      if (e.key === 'Tab') {
        // basic focus trap
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // restore focus
      try { (lastActive.current as HTMLElement | null)?.focus(); } catch (e) { }
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={dialogRef} style={{ width: 'min(480px, 94vw)', background: '#181a20', padding: 18, borderRadius: 10, border: '1px solid #333' }}>
        {title && <h3 style={{ margin: 0, color: '#f5f5f7' }}>{title}</h3>}
        {message && <p style={{ color: '#ddd' }}>{message}</p>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
          <button onClick={onCancel} style={{ background: 'transparent', color: '#f5f5f7', border: '1px solid #444', padding: '8px 12px', borderRadius: 8 }}>{cancelLabel}</button>
          <button ref={firstButtonRef} onClick={onConfirm} style={{ background: '#ff4d4f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
