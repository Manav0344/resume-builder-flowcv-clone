import React from 'react';

export function ProgressBar({ value, label }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[var(--muted)]"><span>{label}</span><span>{value}%</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    </div>
  );
}
