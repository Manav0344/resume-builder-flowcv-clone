import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from '../utils/cn';

const ToastContext = createContext(null);
const icons = { success: CheckCircle2, info: Info, warning: AlertTriangle };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID?.() || `${Date.now()}${Math.random()}`;
    setToasts((list) => [...list, { id, message, type }]);
    window.setTimeout(() => setToasts((list) => list.filter((toast) => toast.id !== id)), 3200);
  }, []);
  const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-host pointer-events-none fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          return (
            <div key={toast.id} className={cn('pointer-events-auto flex items-start gap-3 rounded-2xl border bg-[var(--surface)] p-3 text-sm shadow-lg animate-toastIn transition-theme', toast.type === 'warning' ? 'border-amber-300' : 'border-[var(--border)]')}>
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', toast.type === 'warning' ? 'text-amber-500' : 'text-[var(--accent)]')} aria-hidden="true" />
              <p className="flex-1 text-[var(--text)]">{toast.message}</p>
              <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)} className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--accent-soft)]">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
