import React from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { useAutoSave } from './hooks/useAutoSave';
import { useExport } from './hooks/useExport';
import { useUndoRedo } from './hooks/useUndoRedo';
import { Navbar } from './components/layout/Navbar';
import { SplitPane } from './components/layout/SplitPane';

function AppShell() {
  const previewRef = React.useRef(null);
  const [mobileTab, setMobileTab] = React.useState('editor');
  const [isExporting, setIsExporting] = React.useState(false);
  const resume = useResume();
  const { notify } = useToast();
  const { appState, activeResume, saveNow, setSaveStatus, undo, redo } = resume;
  useAutoSave(appState, saveNow, setSaveStatus, 500);
  const exports = useExport({ appState, activeResume, previewRef, notify });

  const exportPdfWithAnimation = React.useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    try {
      await exports.exportPdf();
    } finally {
      window.setTimeout(() => setIsExporting(false), 450);
    }
  }, [exports, isExporting]);

  useUndoRedo({ undo, redo, onSaveJson: exports.exportJson, onExportPdf: exportPdfWithAnimation });

  return (
    <div className="app-root flex h-full flex-col overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-theme">
      <Navbar onExportPdf={exportPdfWithAnimation} onExportJson={exports.exportJson} onExportWorkspace={exports.exportWorkspaceJson} mobileTab={mobileTab} onMobileTab={setMobileTab} />
      <SplitPane previewRef={previewRef} mobileTab={mobileTab} />
      <ExportOverlay show={isExporting} />
    </div>
  );
}

function ExportOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-slate-950/35 backdrop-blur-sm animate-fadeIn" role="status" aria-live="polite">
      <div className="w-[min(360px,calc(100vw-2rem))] rounded-[28px] border border-white/20 bg-[var(--surface)] p-6 text-center shadow-2xl transition-theme">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-[var(--accent-soft)] text-[var(--accent)]">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-black text-[var(--text)]">Preparing your PDF</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Applying A4 page margins, page breaks, links and high-resolution rendering.</p>
        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent)]">
          <Loader2 className="h-5 w-5 animate-spin" /> Exporting...
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent)]" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ResumeProvider>
          <AppShell />
        </ResumeProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
