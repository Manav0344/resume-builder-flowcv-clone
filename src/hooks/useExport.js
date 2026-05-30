import { useCallback } from 'react';
import { exportResumePdf } from '../utils/pdfExport';

const download = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export function useExport({ appState, activeResume, previewRef, notify }) {
  const exportJson = useCallback(() => {
    download(`${activeResume.name || 'resume'}.json`, JSON.stringify(activeResume, null, 2), 'application/json');
    notify?.('Resume JSON downloaded');
  }, [activeResume, notify]);

  const exportWorkspaceJson = useCallback(() => {
    download('resume-workspace.json', JSON.stringify(appState, null, 2), 'application/json');
    notify?.('Workspace JSON downloaded');
  }, [appState, notify]);

  const exportPdf = useCallback(async () => {
    notify?.('Rendering high-resolution PDF…', 'info');
    await exportResumePdf(previewRef.current, activeResume.name || 'resume');
    notify?.('PDF export complete');
  }, [activeResume, previewRef, notify]);

  return { exportJson, exportWorkspaceJson, exportPdf };
}
