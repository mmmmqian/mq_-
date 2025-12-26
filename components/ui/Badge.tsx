import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'primary';

const styleMap: Record<StatusType, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
  error: 'bg-red-50 text-red-700 border-red-200/60',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200/60',
  info: 'bg-blue-50 text-blue-700 border-blue-200/60',
  primary: 'bg-primary-50 text-primary-700 border-primary-200/60',
};

const dotColorMap: Record<StatusType, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  neutral: 'bg-slate-400',
  info: 'bg-blue-500',
  primary: 'bg-primary-500',
};

export const Badge: React.FC<{ status: StatusType; children: React.ReactNode; showDot?: boolean }> = ({ status, children, showDot = true }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${styleMap[status]} whitespace-nowrap`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColorMap[status]}`}></span>
      )}
      {children}
    </span>
  );
};