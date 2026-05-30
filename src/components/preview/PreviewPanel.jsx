import React from 'react';
import { CheckCircle2, FileText, SearchCheck, ZoomIn, ZoomOut } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { getAtsScore } from '../../utils/atsScore';
import { getCompleteness } from '../../utils/completeness';
import { countWords } from '../../utils/text';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressRing';
import { Tooltip } from '../ui/Tooltip';
import { ResumeTemplate } from './ResumeTemplates';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { A4_PAGE_HEIGHT_PX, A4_PAGE_WIDTH_PX, applyResumePagination } from '../../utils/pagination';

const zooms = [0.5, 0.75, 1, 1.25];

export function PreviewPanel({ previewRef }) {
  const { activeResume } = useResume();
  const debouncedResume = useDebouncedValue(activeResume, 200);
  const [zoom, setZoom] = React.useState(0.75);
  const [pageCount, setPageCount] = React.useState(1);
  const visiblePageRefs = React.useRef([]);
  const ats = React.useMemo(() => getAtsScore(debouncedResume), [debouncedResume]);
  const complete = React.useMemo(() => getCompleteness(debouncedResume), [debouncedResume]);
  const words = React.useMemo(() => countWords(debouncedResume), [debouncedResume]);
  const pageLayout = debouncedResume.settings.page || {};
  const pageTopMargin = pageLayout.topMargin ?? 64;
  const pageBottomMargin = pageLayout.bottomMargin ?? 64;
  const pageGap = pageLayout.pageGap ?? 56;

  const paginateRoot = React.useCallback((root) => {
    if (!root) return 1;
    return applyResumePagination(root, { newPageTopSpace: pageTopMargin, bottomSafeSpace: pageBottomMargin });
  }, [pageTopMargin, pageBottomMargin]);

  React.useLayoutEffect(() => {
    const el = previewRef.current;
    if (!el) return undefined;

    let frame = 0;
    const update = () => {
      frame = window.requestAnimationFrame(() => {
        const pages = paginateRoot(el);
        setPageCount((current) => (current === pages ? current : pages));
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [previewRef, debouncedResume, paginateRoot]);

  React.useLayoutEffect(() => {
    visiblePageRefs.current.length = pageCount;
    visiblePageRefs.current.forEach((root) => paginateRoot(root));
  }, [pageCount, debouncedResume, paginateRoot]);

  const setVisiblePageRef = React.useCallback((index) => (node) => {
    if (node) visiblePageRefs.current[index] = node;
  }, []);

  return (
    <section className="preview-shell flex h-full min-w-0 flex-1 flex-col bg-[var(--bg)] transition-theme" aria-label="Resume preview">
      <div className="preview-toolbar flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-theme">
        <div className="grid min-w-[280px] flex-1 grid-cols-2 gap-3 md:grid-cols-4">
          <Metric icon={CheckCircle2} label="Completeness" value={`${complete.score}%`} />
          <Metric icon={SearchCheck} label="ATS score" value={`${ats.score}%`} />
          <Metric icon={FileText} label="Words" value={words} />
          <Metric icon={FileText} label="Pages" value={pageCount} />
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-1 transition-theme">
          <Tooltip label="Zoom out"><Button size="icon" variant="ghost" aria-label="Zoom out" onClick={() => setZoom((z) => zooms[Math.max(0, zooms.indexOf(z) - 1)] || 0.5)}><ZoomOut className="h-4 w-4" /></Button></Tooltip>
          {zooms.map((z) => <Button key={z} size="sm" variant={zoom === z ? 'primary' : 'ghost'} onClick={() => setZoom(z)}>{Math.round(z * 100)}%</Button>)}
          <Tooltip label="Zoom in"><Button size="icon" variant="ghost" aria-label="Zoom in" onClick={() => setZoom((z) => zooms[Math.min(zooms.length - 1, zooms.indexOf(z) + 1)] || 1.25)}><ZoomIn className="h-4 w-4" /></Button></Tooltip>
        </div>
      </div>

      <div className="preview-canvas flex-1 overflow-auto p-6 transition-theme scrollbar-thin">
        <HiddenExportResume resume={debouncedResume} previewRef={previewRef} />

        <div className="mx-auto flex w-max flex-col items-center transition-all duration-300 ease-in-out" style={{ gap: `${pageGap * zoom}px` }}>
          {Array.from({ length: pageCount }, (_, index) => (
            <div key={index} className="relative transition-all duration-300 ease-in-out" style={{ height: `${A4_PAGE_HEIGHT_PX * zoom}px`, width: `${A4_PAGE_WIDTH_PX * zoom}px` }}>
              <div className="relative overflow-hidden bg-white shadow-paper transition-transform duration-300 ease-in-out will-change-transform" style={{ width: A4_PAGE_WIDTH_PX, height: A4_PAGE_HEIGHT_PX, transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                <div className="absolute left-0 top-0" style={{ transform: `translateY(-${A4_PAGE_HEIGHT_PX * index}px)`, width: A4_PAGE_WIDTH_PX }}>
                  <ResumeTemplate resume={debouncedResume} forwardedRef={setVisiblePageRef(index)} />
                </div>
              </div>
              <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)] shadow-sm">
                Page {index + 1} of {pageCount}
              </div>
            </div>
          ))}

          <div className="preview-toolbar mb-8 mt-8 grid w-[794px] max-w-full grid-cols-1 gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm shadow-sm transition-theme md:grid-cols-2">
            <div className="space-y-2"><ProgressBar label="Completeness" value={complete.score} /><div className="grid grid-cols-1 gap-1 text-xs text-[var(--muted)]">{complete.items.slice(0, 7).map((item) => <span key={item.id}>{item.done ? '✓' : '○'} {item.title}</span>)}</div></div>
            <div className="space-y-2"><ProgressBar label="ATS score" value={ats.score} /><div className="space-y-1 text-xs text-[var(--muted)]">{ats.checks.map((check) => <p key={check.label}>{check.pass ? '✓' : '○'} {check.label}</p>)}<p>Keywords: {ats.keywords.join(', ') || 'Add action verbs'}</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HiddenExportResume({ resume, previewRef }) {
  return (
    <div className="pointer-events-none fixed left-[-12000px] top-0 opacity-0" aria-hidden="true" style={{ width: A4_PAGE_WIDTH_PX }}>
      <ResumeTemplate resume={resume} forwardedRef={previewRef} />
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 transition-theme"><div className="flex items-center gap-2 text-xs text-[var(--muted)]"><Icon className="h-3.5 w-3.5 text-[var(--accent)]" /> {label}</div><p className="mt-0.5 text-lg font-bold text-[var(--text)]">{value}</p></div>;
}
