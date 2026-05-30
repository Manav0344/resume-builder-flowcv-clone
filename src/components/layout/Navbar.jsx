import React from 'react';
import { Copy, Download, FileDown, FileJson, Moon, Plus, Printer, Redo2, Sun, Trash2, Undo2, Upload, Wand2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../utils/cn';

export function Navbar({ onExportPdf, onExportJson, onExportWorkspace, onMobileTab, mobileTab }) {
  const { appState, activeResume, switchResume, renameResume, createResume, duplicateResume, deleteResume, importResumeJson, canUndo, canRedo, undo, redo, saveStatus } = useResume();
  const { theme, toggleTheme } = useTheme();
  const { notify } = useToast();
  const inputRef = React.useRef(null);
  const [name, setName] = React.useState(activeResume.name);

  React.useEffect(() => setName(activeResume.name), [activeResume.name]);

  const importFile = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const type = importResumeJson(text);
      notify(type === 'workspace' ? 'Workspace imported' : 'Resume imported');
    } catch {
      notify('Could not import JSON file', 'warning');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <header className="app-navbar z-30 border-b border-[var(--border)] bg-[var(--surface)] shadow-sm transition-theme">
      <div className="flex min-h-[66px] items-center gap-3 px-3 lg:px-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--accent)] text-white shadow-sm"><Wand2 className="h-5 w-5" /></div>
          <div className="hidden sm:block"><p className="text-sm font-black leading-none text-[var(--text)]">ResumeFlow</p><p className="text-[11px] text-[var(--muted)]">FlowCV-style builder</p></div>
        </div>
        <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto lg:flex scrollbar-thin" role="tablist" aria-label="Resumes">
          {appState.resumes.map((resume) => (
            <button key={resume.id} role="tab" aria-selected={resume.id === activeResume.id} onClick={() => switchResume(resume.id)} className={cn('max-w-[180px] truncate rounded-xl border px-3 py-2 text-sm font-medium transition-theme', resume.id === activeResume.id ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text)]' : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--accent-soft)]')}>{resume.name}</button>
          ))}
          <Tooltip side="bottom" label="Create resume"><Button size="icon" variant="ghost" onClick={() => { createResume(); notify('New resume created'); }} aria-label="Create resume"><Plus className="h-4 w-4" /></Button></Tooltip>
        </div>
        <div className="min-w-[150px] flex-1 lg:max-w-[260px]">
          <input aria-label="Resume name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => renameResume(activeResume.id, name)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} className="w-full rounded-xl border border-transparent bg-[var(--bg)] px-3 py-2 text-sm font-bold text-[var(--text)] transition-theme focus:border-[var(--accent)]" />
          <p className="px-1 text-[11px] text-[var(--muted)]">{saveStatus}</p>
        </div>
        <div className="mobile-tabs flex rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-1 lg:hidden">
          <Button size="sm" variant={mobileTab === 'editor' ? 'primary' : 'ghost'} onClick={() => onMobileTab('editor')}>Editor</Button>
          <Button size="sm" variant={mobileTab === 'preview' ? 'primary' : 'ghost'} onClick={() => onMobileTab('preview')}>Preview</Button>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Tooltip side="bottom" label="Undo"><Button size="icon" variant="ghost" disabled={!canUndo} onClick={undo} aria-label="Undo"><Undo2 className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Redo"><Button size="icon" variant="ghost" disabled={!canRedo} onClick={redo} aria-label="Redo"><Redo2 className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Duplicate resume"><Button size="icon" variant="ghost" onClick={() => { duplicateResume(activeResume.id); notify('Resume duplicated'); }} aria-label="Duplicate resume"><Copy className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Delete resume"><Button size="icon" variant="ghost" disabled={appState.resumes.length === 1} onClick={() => { deleteResume(activeResume.id); notify('Resume deleted'); }} aria-label="Delete resume"><Trash2 className="h-4 w-4 text-red-500" /></Button></Tooltip>
          <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => importFile(e.target.files?.[0])} />
          <Tooltip side="bottom" label="Import JSON"><Button size="icon" variant="ghost" onClick={() => inputRef.current?.click()} aria-label="Import JSON"><Upload className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Export JSON"><Button size="icon" variant="ghost" onClick={onExportJson} aria-label="Export JSON"><FileJson className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Backup workspace"><Button size="icon" variant="ghost" onClick={onExportWorkspace} aria-label="Export workspace JSON"><Download className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Print"><Button size="icon" variant="ghost" onClick={() => window.print()} aria-label="Print resume"><Printer className="h-4 w-4" /></Button></Tooltip>
          <Tooltip side="bottom" label="Toggle theme"><Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle light and dark theme">{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</Button></Tooltip>
          <Tooltip side="bottom" label="Export PDF"><Button variant="primary" onClick={onExportPdf} className="hidden sm:inline-flex"><FileDown className="h-4 w-4" /> Export PDF</Button></Tooltip>
        </div>
      </div>
    </header>
  );
}
