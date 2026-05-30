import React from 'react';
import { GripVertical } from 'lucide-react';
import { EditorPanel } from '../editor/EditorPanel';
import { PreviewPanel } from '../preview/PreviewPanel';
import { cn } from '../../utils/cn';

export function SplitPane({ previewRef, mobileTab }) {
  const [width, setWidth] = React.useState(() => Number(localStorage.getItem('flowcv-editor-width')) || 430);
  const dragging = React.useRef(false);

  React.useEffect(() => {
    const move = (event) => {
      if (!dragging.current) return;
      const next = Math.min(640, Math.max(360, event.clientX));
      setWidth(next);
    };
    const up = () => {
      if (dragging.current) localStorage.setItem('flowcv-editor-width', String(width));
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [width]);

  return (
    <main className="app-main flex min-h-0 flex-1 overflow-hidden bg-[var(--bg)] transition-theme">
      <div className={cn('h-full shrink-0 w-full lg:block lg:w-[var(--editor-width)]', mobileTab === 'editor' ? 'block' : 'hidden')} style={{ '--editor-width': `${width}px` }}><EditorPanel /></div>
      <button type="button" aria-label="Resize editor and preview" className="resize-handle hidden w-2 shrink-0 cursor-col-resize place-items-center border-x border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-theme hover:bg-[var(--accent-soft)] lg:grid" onMouseDown={() => { dragging.current = true; document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; }}><GripVertical className="h-4 w-4" /></button>
      <div className={cn('min-w-0 flex-1 lg:block', mobileTab === 'preview' ? 'block' : 'hidden')}><PreviewPanel previewRef={previewRef} /></div>
    </main>
  );
}
