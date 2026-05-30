import React from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Field';
import { cn } from '../../utils/cn';

export function ItemCard({ title, children, onDelete }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm transition-theme">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="truncate text-sm font-semibold text-[var(--text)]">{title || 'Untitled item'}</h4>
        {onDelete ? <Button aria-label="Delete item" variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button> : null}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function TwoCols({ children }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

export function BulletEditor({ bullets = [], onChange }) {
  const update = (index, value) => onChange(bullets.map((bullet, i) => (i === index ? value : bullet)));
  const remove = (index) => onChange(bullets.filter((_, i) => i !== index));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Bullet points</p><Button size="sm" variant="ghost" onClick={() => onChange([...bullets, ''])}><Plus className="h-3.5 w-3.5" /> Add bullet</Button></div>
      {bullets.map((bullet, index) => (
        <div className="flex gap-2" key={`bullet-${index}`}>
          <Textarea label={`Bullet ${index + 1}`} value={bullet} rows={2} onChange={(e) => update(index, e.target.value)} />
          <Button aria-label="Remove bullet" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-6 shrink-0 text-red-500"><X className="h-4 w-4" /></Button>
        </div>
      ))}
    </div>
  );
}

export function TagInput({ label, tags = [], onChange, placeholder = 'Type and press Enter' }) {
  const [value, setValue] = React.useState('');
  const add = () => {
    const next = value.trim();
    if (!next || tags.includes(next)) return;
    onChange([...tags, next]);
    setValue('');
  };
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</p>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 transition-theme">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => <button type="button" key={tag} onClick={() => onChange(tags.filter((item) => item !== tag))} className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs text-[var(--text)]">{tag} ×</button>)}
        </div>
        <input className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]" value={value} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} onBlur={add} />
      </div>
    </div>
  );
}

export function Chip({ children, tone = 'default' }) {
  return <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', tone === 'expert' ? 'bg-emerald-100 text-emerald-700' : tone === 'intermediate' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600')}>{children}</span>;
}
