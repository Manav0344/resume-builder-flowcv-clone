import React from 'react';
import { cn } from '../../utils/cn';

const positions = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

export function Tooltip({ label, children, side = 'top' }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className={cn('pointer-events-none absolute z-[9999] rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 whitespace-nowrap', positions[side] || positions.top)}>
        {label}
      </span>
    </span>
  );
}
