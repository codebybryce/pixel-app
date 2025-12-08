import style from './mobileToolBar.module.css'
import { ICON_MAP } from '../../../utils/icons'
import { useGlobalStore } from '../../../store/useGlobalStore'
import Button from '../../button/Button'
import { useRef, useState, useEffect } from 'react'

// Tweak these constants to change sensitivity and animation
const SWIPE_THRESHOLD = 40 // pixels to consider a swipe
const TRANSITION_MS = 200 // animation duration ms when snapping

export default function MobileToolBar() {
  const setColorMenuOpen = useGlobalStore(s => s.setColorMenuOpen)
  const setTool = useGlobalStore(s => (s as any).setTool)
  const mobileToolOpen = useGlobalStore(s => (s as any).mobileToolOpen ?? true)
  const setMobileToolOpen = useGlobalStore(s => (s as any).setMobileToolOpen)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const touchStartY = useRef<number | null>(null)
  const startTranslate = useRef<number>(0)
  const [translateY, setTranslateY] = useState<number>(0)
  const isDraggingRef = useRef(false)

  function triggerAppAction(action: string, detail?: any) {
    window.dispatchEvent(new CustomEvent('pixel-app-action', { detail: { action, ...detail } }));
  }
  function handleTouchStart(e: React.TouchEvent) {
    const y = e.touches?.[0]?.clientY ?? null
    if (y == null) return
    touchStartY.current = y
    startTranslate.current = translateY
    isDraggingRef.current = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartY.current == null) return
    const y = e.touches?.[0]?.clientY ?? null
    if (y == null) return
    const delta = y - touchStartY.current
    const containerHeight = containerRef.current?.offsetHeight ?? 0
    // when open, translateY=0; when closed translateY=containerHeight (move down)
    const newTranslate = Math.min(Math.max(startTranslate.current + delta, 0), containerHeight)
    setTranslateY(newTranslate)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current == null) return
    const endY = e.changedTouches?.[0]?.clientY ?? null
    if (endY == null) return
    const delta = endY - touchStartY.current
    const containerHeight = containerRef.current?.offsetHeight ?? 0
    // if swipe enough up -> close; enough down -> open; otherwise snap based on halfway
    if (delta < -SWIPE_THRESHOLD) {
      setMobileToolOpen && setMobileToolOpen(false)
      setTranslateY(containerHeight)
    } else if (delta > SWIPE_THRESHOLD) {
      setMobileToolOpen && setMobileToolOpen(true)
      setTranslateY(0)
    } else {
      // snap
      if (translateY > containerHeight * 0.5) {
        setMobileToolOpen && setMobileToolOpen(false)
        setTranslateY(containerHeight)
      } else {
        setMobileToolOpen && setMobileToolOpen(true)
        setTranslateY(0)
      }
    }
    touchStartY.current = null
    isDraggingRef.current = false
  }

  // Pointer (mouse/pen) handlers for desktop
  function handlePointerDown(e: React.PointerEvent) {
    // only respond to primary button
    if ((e as any).button && (e as any).button !== 0) return
    const y = e.clientY
    touchStartY.current = y
    startTranslate.current = translateY
    isDraggingRef.current = true
    // capture pointer so we continue to receive events (if available)
    const targetEl = e.target as any
    if (targetEl && typeof targetEl.setPointerCapture === 'function') {
      targetEl.setPointerCapture((e as any).pointerId)
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (touchStartY.current == null) return
    const y = e.clientY
    const delta = y - touchStartY.current
    const containerHeight = containerRef.current?.offsetHeight ?? 0
    const newTranslate = Math.min(Math.max(startTranslate.current + delta, 0), containerHeight)
    setTranslateY(newTranslate)
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (touchStartY.current == null) return
    const endY = e.clientY
    const delta = endY - touchStartY.current
    const containerHeight = containerRef.current?.offsetHeight ?? 0
    if (delta < -SWIPE_THRESHOLD) {
      setMobileToolOpen && setMobileToolOpen(false)
      setTranslateY(containerHeight)
    } else if (delta > SWIPE_THRESHOLD) {
      setMobileToolOpen && setMobileToolOpen(true)
      setTranslateY(0)
    } else {
      if (translateY > containerHeight * 0.5) {
        setMobileToolOpen && setMobileToolOpen(false)
        setTranslateY(containerHeight)
      } else {
        setMobileToolOpen && setMobileToolOpen(true)
        setTranslateY(0)
      }
    }
    touchStartY.current = null
    isDraggingRef.current = false
  }

  // allow closing/opening programmatically from the browser via custom events
  useEffect(() => {
    function handleOpen() { setMobileToolOpen && setMobileToolOpen(true) }
    function handleClose() { setMobileToolOpen && setMobileToolOpen(false) }
    function handleToggle() { setMobileToolOpen && setMobileToolOpen(!(mobileToolOpen)) }
    function handleClickOutside(ev: MouseEvent) {
      const target = ev.target as Node
      if (!containerRef.current) return
      if (!containerRef.current.contains(target)) {
        setMobileToolOpen && setMobileToolOpen(false)
      }
    }
    window.addEventListener('pixel-app-open-mobile-tool', handleOpen)
    window.addEventListener('pixel-app-close-mobile-tool', handleClose)
    window.addEventListener('pixel-app-toggle-mobile-tool', handleToggle)
    window.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('pixel-app-open-mobile-tool', handleOpen)
      window.removeEventListener('pixel-app-close-mobile-tool', handleClose)
      window.removeEventListener('pixel-app-toggle-mobile-tool', handleToggle)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [mobileToolOpen, setMobileToolOpen])

  // keep translateY in sync when mobileToolOpen toggles externally
  useEffect(() => {
    const h = containerRef.current?.offsetHeight ?? 0
    setTranslateY(mobileToolOpen ? 0 : h)
  }, [mobileToolOpen])

  return (
    <>
      <div>
        <div
          ref={containerRef}
          className={`${style.mobileToolContainer} ${mobileToolOpen ? '' : style.closed}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            transform: `translateY(${translateY}px)`,
            transition: isDraggingRef.current ? 'none' : `transform ${TRANSITION_MS}ms ease-in-out`,
          }}
        >
          {/* visible handle when closed */}
          <div className={style.handle} onClick={() => setMobileToolOpen && setMobileToolOpen(!mobileToolOpen)} />
          <div className={style.clear}>
            <Button title="Clear" content="" buttonAction={() => triggerAppAction('clear')}>{ICON_MAP['CLEAR']}</Button>

          </div>
          <div className={style.undo}>
            <Button title="Undo" content="" buttonAction={() => triggerAppAction('undo')}>{ICON_MAP['UNDO']}</Button>
          </div>
          <div className={style.redo}>
            <Button title="Redo" content="" buttonAction={() => triggerAppAction('redo')}>{ICON_MAP['REDO']}</Button>

          </div>
          <div className={style.copy}>
            <Button title="Copy" content="" buttonAction={() => triggerAppAction('copy')}>{ICON_MAP['COPY']}</Button>

          </div>
          <div className={style.paste}>
            <Button title="Paste" content="" buttonAction={() => triggerAppAction('paste')}>{ICON_MAP['PASTE']}</Button>

          </div>
          <div className={style.rotateLeft}>
            <Button title="Rotate L" content="" buttonAction={() => triggerAppAction('Rotate Left')}>{ICON_MAP['ROTATE_LEFT']}</Button>

          </div>
          <div className={style.rotateR}>
            <Button title="Rotate R" content="" buttonAction={() => triggerAppAction('Rotate Right')}>{ICON_MAP['ROTATE_RIGHT']}</Button>

          </div>
          <div className={style.moveUp}>
            <Button title="Up" content="" buttonAction={() => triggerAppAction('moveUp')}>{ICON_MAP['FLIP_VERTICAL']}</Button>

          </div>
          <div className={style.moveDown}><Button title="Down" content="" buttonAction={() => triggerAppAction('moveDown')}>{ICON_MAP['FLIP_VERTICAL']}</Button></div>
          <div className={style.moveLeft}><Button title="Left" content="" buttonAction={() => triggerAppAction('moveLeft')}>{ICON_MAP['FLIP_HORIZONTAL']}</Button></div>
          <div className={style.moveRight}><Button title="Right" content="" buttonAction={() => triggerAppAction('moveRight')}>{ICON_MAP['FLIP_HORIZONTAL']}</Button></div>
          <div className={style.line}></div>
          <div className={style.line}><Button title="Line" content="" buttonAction={() => setTool('line')}>{ICON_MAP['LINE']}</Button></div>
          <div className={style.circle}><Button title="Circle" content="" buttonAction={() => setTool('circle')}>{ICON_MAP['CIRCLE']}</Button></div>
          <div className={style.square}><Button title="Rectangle" content="" buttonAction={() => setTool('rectangle')}>{ICON_MAP['RECTANGLE']}</Button></div>
          <div className={style.colorPick}><Button title="Picker" content="" buttonAction={() => setTool('picker')}>{ICON_MAP['PICKER']}</Button></div>
          <div className={style.selectTool}><Button title="Select" content="" buttonAction={() => setTool('select')}>{ICON_MAP['SELECT']}</Button></div>
          <div className={style.colorSelect}>
            <Button title="Color" content="" buttonAction={() => setColorMenuOpen(true)}>{ICON_MAP['PALETTE']}</Button>

          </div>
        </div>
      </div>
    </>
  )
}