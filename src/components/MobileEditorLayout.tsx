import { useEffect, useState, ReactNode } from 'react';
import MobileMenuDrawer from './MobileMenuDrawer';

export default function MobileEditorLayout({
  children,
  width,
  height,
  setWidth,
  setHeight,
  title,
  setTitle,
  onSave,
  onSaveAs,
  onOpenCloud,
  setColorMenuOpen,
  cellSize,
  setCellSize,
}: {
  children: ReactNode;
  width: number;
  height: number;
  setWidth: (n: number) => void;
  setHeight: (n: number) => void;
  title: string;
  setTitle: (s: string) => void;
  onSave: () => void;
  onSaveAs: () => void;
  onOpenCloud: () => void;
  setColorMenuOpen: (b: boolean) => void;
  cellSize: number;
  setCellSize: (n: number) => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function handleToggleMobile() {
      setMobileMenuOpen((o) => !o);
    }
    window.addEventListener('pixel-app-toggle-mobile-menu', handleToggleMobile as EventListener);
    function onResize() { setIsMobile(window.innerWidth < 600); }
    onResize();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('pixel-app-toggle-mobile-menu', handleToggleMobile as EventListener); window.removeEventListener('resize', onResize); };
  }, []);

  // touch handlers for pinch-to-zoom and double-tap
  useEffect(() => {
    let lastTap = 0;
    let pinchStartDist = 0;
    let startCellSize = cellSize;
    function dist(a: Touch, b: Touch) { const dx = a.clientX - b.clientX; const dy = a.clientY - b.clientY; return Math.hypot(dx, dy); }
    function onTouchStart(e: TouchEvent) {
      if (!isMobile) return;
      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTap < 300) setCellSize(20);
        lastTap = now;
      } else if (e.touches.length === 2) {
        pinchStartDist = dist(e.touches[0], e.touches[1]);
        startCellSize = cellSize;
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (!isMobile) return;
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const ratio = d / (pinchStartDist || d);
        const newSize = Math.max(6, Math.min(60, Math.round(startCellSize * ratio)));
        setCellSize(newSize);
      }
    }
    const el = document.querySelector('.plot');
    if (el) {
      el.addEventListener('touchstart', onTouchStart as any, { passive: false });
      el.addEventListener('touchmove', onTouchMove as any, { passive: false });
    }
    return () => {
      if (el) {
        el.removeEventListener('touchstart', onTouchStart as any);
        el.removeEventListener('touchmove', onTouchMove as any);
      }
    };
  }, [cellSize, isMobile, setCellSize]);

  return (
    <div className="mobile-editor-layout">
      {children}

      <MobileMenuDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={width}
        height={height}
        setWidth={setWidth}
        setHeight={setHeight}
        title={title}
        setTitle={setTitle}
        onSave={onSave}
        onSaveAs={onSaveAs}
        onOpenCloud={onOpenCloud}
      />

      {isMobile && (
        <button aria-label="Open color picker" className="fab" onClick={() => setColorMenuOpen(true)} title="Color Picker">
          🎨
        </button>
      )}
    </div>
  );
}
