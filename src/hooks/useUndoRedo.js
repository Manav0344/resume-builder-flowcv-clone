import { useEffect } from 'react';

export function useUndoRedo({ undo, redo, onSaveJson, onExportPdf }) {
  useEffect(() => {
    const handler = (event) => {
      const mod = event.ctrlKey || event.metaKey;
      if (!mod) return;
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
        event.preventDefault();
        redo();
      } else if (key === 's') {
        event.preventDefault();
        onSaveJson?.();
      } else if (key === 'p') {
        event.preventDefault();
        onExportPdf?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, onSaveJson, onExportPdf]);
}
