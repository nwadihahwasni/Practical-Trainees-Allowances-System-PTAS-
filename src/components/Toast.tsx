import React from 'react';

interface ToastProps {
  toast: {
    message: string;
    icon?: string;
  } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200 border border-surface-container-high/20 max-w-md">
      <span className="material-symbols-outlined text-primary-container text-[20px]">
        {toast.icon || 'check_circle'}
      </span>
      <span className="font-label-md text-[13px] leading-snug">
        {toast.message}
      </span>
    </div>
  );
};
