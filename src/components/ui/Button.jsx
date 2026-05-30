import React from 'react';
import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-[var(--accent)] text-white hover:opacity-90 border-transparent',
  secondary: 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--accent-soft)]',
  ghost: 'border-transparent text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]',
  danger: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300',
};
const sizes = { sm: 'h-8 px-2.5 text-xs', md: 'h-10 px-3 text-sm', icon: 'h-9 w-9 p-0' };

export const Button = React.forwardRef(function Button({ className, variant = 'secondary', size = 'md', type = 'button', ...props }, ref) {
  return <button ref={ref} type={type} className={cn('inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
});
