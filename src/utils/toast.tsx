import React from 'react';
import { toast, ToastOptions } from 'react-toastify';

const DEFAULT_OPTS: ToastOptions = {
  autoClose: 3000,
  pauseOnHover: true,
  closeOnClick: true,
  draggable: true,
  theme: 'dark',
};

export function notifySuccess(message: React.ReactNode, opts?: ToastOptions) {
  return toast.success(message, { ...DEFAULT_OPTS, ...opts });
}

export function notifyError(message: React.ReactNode, opts?: ToastOptions) {
  return toast.error(message, { ...DEFAULT_OPTS, autoClose: 5000, ...opts });
}

export function notifyInfo(message: React.ReactNode, opts?: ToastOptions) {
  return toast.info(message, { ...DEFAULT_OPTS, ...opts });
}

export function notifyWithUndo(message: React.ReactNode, onUndo: () => void, undoLabel = 'Undo', opts?: ToastOptions) {
  let id: React.ReactText | undefined;
  const content = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1 }}>{message}</div>
      <button
        onClick={() => {
          try { onUndo(); } catch (e) { /* ignore */ }
          if (id) toast.dismiss(id);
        }}
        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'white', padding: '4px 8px', borderRadius: 6 }}
      >
        {undoLabel}
      </button>
    </div>
  );
  id = toast(content, { ...DEFAULT_OPTS, autoClose: 5000, ...opts });
  return id;
}

export default {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWithUndo,
};
