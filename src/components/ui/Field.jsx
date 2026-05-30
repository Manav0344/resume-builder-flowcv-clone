import React from 'react';
import { cn } from '../../utils/cn';

const base = 'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] transition-all duration-300 ease-in-out focus:border-[var(--accent)]';

export function Label({ children, htmlFor, hint }) {
  return <label htmlFor={htmlFor} className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--muted)]"><span>{children}</span>{hint ? <span className="normal-case tracking-normal">{hint}</span> : null}</label>;
}

export function Input({ label, id, className, hint, ...props }) {
  const inputId = id || props.name || label;
  return <div><Label htmlFor={inputId} hint={hint}>{label}</Label><input id={inputId} className={cn(base, className)} {...props} /></div>;
}

export function Textarea({ label, id, className, hint, rows = 4, ...props }) {
  const inputId = id || props.name || label;
  return <div><Label htmlFor={inputId} hint={hint}>{label}</Label><textarea id={inputId} rows={rows} className={cn(base, 'resize-y leading-relaxed', className)} {...props} /></div>;
}

export function Select({ label, id, children, className, ...props }) {
  const inputId = id || props.name || label;
  return <div><Label htmlFor={inputId}>{label}</Label><select id={inputId} className={cn(base, className)} {...props}>{children}</select></div>;
}

export function Toggle({ label, checked, onChange, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 transition-theme">
      <span><span className="block text-sm font-medium text-[var(--text)]">{label}</span>{description ? <span className="text-xs text-[var(--muted)]">{description}</span> : null}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span aria-hidden="true" className={cn('relative h-6 w-11 rounded-full transition-theme', checked ? 'bg-[var(--accent)]' : 'bg-slate-300 dark:bg-slate-600')}><span className={cn('absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-300 ease-in-out', checked ? 'translate-x-6' : 'translate-x-1')} /></span>
    </label>
  );
}
