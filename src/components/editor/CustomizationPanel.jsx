import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Check, Palette, SlidersHorizontal } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { accentSwatches, fontOptions } from '../../data/defaultResume';
import { templateDefinitions } from '../../templates/templateDefinitions';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Field';
import { cn } from '../../utils/cn';

export function TemplateSelector() {
  const { activeResume, updateSettings } = useResume();
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><Palette className="h-4 w-4 text-[var(--accent)]" /> Resume templates</div>
      <div className="grid grid-cols-2 gap-2">
        {templateDefinitions.map((template) => (
          <button key={template.id} type="button" onClick={() => updateSettings('template', template.id)} className={cn('rounded-2xl border p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md', activeResume.settings.template === template.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)] bg-[var(--surface)]')}>
            <span className="mb-2 block h-16 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
              <span className={cn('block h-3 rounded', template.id === 'executive' ? 'bg-slate-900' : 'bg-[var(--accent)]')} />
              <span className="mt-2 block h-1.5 w-3/4 rounded bg-slate-200" />
              <span className="mt-1 block h-1.5 w-1/2 rounded bg-slate-200" />
              {template.id === 'modern' ? <span className="float-left mt-2 block h-6 w-4 rounded bg-[var(--accent)] opacity-60" /> : null}
            </span>
            <span className="block text-xs font-semibold text-[var(--text)]">{template.name}</span>
            <span className="text-[10px] text-[var(--muted)]">{template.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CustomizationPanel() {
  const { activeResume, updateSettings } = useResume();
  const s = activeResume.settings;
  const spacing = s.spacing || {};
  const page = s.page || {};
  return (
    <div className="design-shell space-y-4" aria-label="Resume design panel">
      <div className="mb-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-theme">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Design Panel</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--text)]">Templates, colors & spacing</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Templates, colors, fonts and spacing are here in the left panel.</p>
      </div>

      <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-theme">
        <TemplateSelector />
        <div className="h-px bg-[var(--border)]" />
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--text)]">Design customization</p>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Accent color</p>
            <div className="mb-3 grid grid-cols-10 gap-1.5">
              {accentSwatches.map((color) => <button key={color} type="button" aria-label={`Use ${color}`} onClick={() => updateSettings('accent', color)} className="grid h-7 w-7 place-items-center rounded-full border border-white shadow" style={{ backgroundColor: color }}>{s.accent.toLowerCase() === color.toLowerCase() ? <Check className="h-4 w-4 text-white" /> : null}</button>)}
            </div>
            <HexColorPicker color={s.accent} onChange={(color) => updateSettings('accent', color)} className="!h-28 !w-full" />
            <Input label="Custom hex" value={s.accent} onChange={(e) => updateSettings('accent', e.target.value)} />
          </div>
          <Select label="Font family" value={s.fontFamily} onChange={(e) => updateSettings('fontFamily', e.target.value)}>{fontOptions.map((font) => <option key={font.label} value={font.value}>{font.label}</option>)}</Select>
          <Segment label="Font size" value={s.fontScale} options={['compact', 'normal', 'comfortable']} onChange={(value) => updateSettings('fontScale', value)} />
          <Segment label="Page margins" value={s.margins} options={['narrow', 'normal', 'wide']} onChange={(value) => updateSettings('margins', value)} />
          <Segment label="Line spacing" value={s.lineSpacing} options={['tight', 'normal', 'relaxed']} onChange={(value) => updateSettings('lineSpacing', value)} />
          <Select label="Heading style" value={s.headingStyle} onChange={(e) => updateSettings('headingStyle', e.target.value)}>{['underline', 'box', 'minimal', 'bold'].map((style) => <option key={style} value={style}>{style}</option>)}</Select>
          <Segment label="Profile photo" value={s.photoShape} options={['round', 'square', 'hidden']} onChange={(value) => updateSettings('photoShape', value)} />
        </div>
      </div>

      <div className="mt-4 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-theme">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" /> A4 page layout</div>
        <p className="text-xs text-[var(--muted)]">MS Word-style page controls. These margins apply to every page in preview and PDF export.</p>
        <Range label="Top margin every page" value={page.topMargin ?? 64} min={24} max={120} onChange={(value) => updateSettings('page.topMargin', value)} />
        <Range label="Bottom margin every page" value={page.bottomMargin ?? 64} min={24} max={120} onChange={(value) => updateSettings('page.bottomMargin', value)} />
        <Range label="Preview gap between pages" value={page.pageGap ?? 56} min={28} max={120} onChange={(value) => updateSettings('page.pageGap', value)} />
      </div>

      <div className="mt-4 space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-theme">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]"><SlidersHorizontal className="h-4 w-4 text-[var(--accent)]" /> Custom spacing</div>
        <p className="text-xs text-[var(--muted)]">These are global defaults. Every section also has its own custom spacing controls inside its accordion.</p>
        <Range label="Before section" value={spacing.beforeGap ?? 0} min={0} max={40} onChange={(value) => updateSettings('spacing.beforeGap', value)} />
        <Range label="After section" value={spacing.sectionGap ?? 16} min={0} max={48} onChange={(value) => updateSettings('spacing.sectionGap', value)} />
        <Range label="Between items" value={spacing.itemGap ?? 12} min={0} max={36} onChange={(value) => updateSettings('spacing.itemGap', value)} />
        <Range label="Heading to content" value={spacing.headingGap ?? 8} min={0} max={28} onChange={(value) => updateSettings('spacing.headingGap', value)} />
        <Range label="Paragraph/details gap" value={spacing.paragraphGap ?? 6} min={0} max={28} onChange={(value) => updateSettings('spacing.paragraphGap', value)} />
        <Range label="Bullet gap" value={spacing.bulletGap ?? 2} min={0} max={18} onChange={(value) => updateSettings('spacing.bulletGap', value)} />
        <Range label="Link gap" value={spacing.linkGap ?? 12} min={0} max={32} onChange={(value) => updateSettings('spacing.linkGap', value)} />
        <Range label="Tag/chip gap" value={spacing.tagGap ?? 6} min={0} max={24} onChange={(value) => updateSettings('spacing.tagGap', value)} />
      </div>
    </div>
  );
}

function Segment({ label, value, options, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-1 transition-theme">
        {options.map((option) => <Button key={option} variant={value === option ? 'primary' : 'ghost'} size="sm" onClick={() => onChange(option)} className="capitalize">{option}</Button>)}
      </div>
    </div>
  );
}

function Range({ label, value, min, max, onChange }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"><span>{label}</span><span>{value}px</span></div>
      <input aria-label={label} type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
    </div>
  );
}
