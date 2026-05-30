import React from 'react';

export function EmptyState({ title = 'Nothing here yet', description = 'Add an item to make this section shine.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--accent-soft)] p-4 text-center transition-theme">
      <svg viewBox="0 0 120 80" className="mx-auto mb-2 h-16 w-24" aria-hidden="true">
        <rect x="18" y="14" width="84" height="52" rx="12" fill="var(--surface)" stroke="var(--border)" />
        <circle cx="42" cy="38" r="10" fill="var(--accent)" opacity="0.24" />
        <rect x="58" y="30" width="28" height="6" rx="3" fill="var(--accent)" opacity="0.5" />
        <rect x="34" y="52" width="52" height="5" rx="2.5" fill="var(--muted)" opacity="0.35" />
      </svg>
      <p className="text-sm font-semibold text-[var(--text)]">{title}</p>
      <p className="text-xs text-[var(--muted)]">{description}</p>
    </div>
  );
}
