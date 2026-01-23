import React, { useEffect, useState } from 'react';

export type ToastType = 'primary' | 'info' | 'success' | 'danger' | 'warning';

export type ToastProps = {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isClosing?: boolean;
  onClose?: () => void;
};

const typeStyles: Record<ToastType, { ring: string; accent: string; text: string; progress: string }> = {
  primary: {
    ring: 'ring-indigo-100 border-indigo-200',
    accent: 'bg-indigo-500',
    text: 'text-indigo-700',
    progress: 'bg-indigo-500',
  },
  info: {
    ring: 'ring-sky-100 border-sky-200',
    accent: 'bg-sky-500',
    text: 'text-sky-700',
    progress: 'bg-sky-500',
  },
  success: {
    ring: 'ring-emerald-100 border-emerald-200',
    accent: 'bg-emerald-500',
    text: 'text-emerald-700',
    progress: 'bg-emerald-500',
  },
  danger: {
    ring: 'ring-rose-100 border-rose-200',
    accent: 'bg-rose-500',
    text: 'text-rose-700',
    progress: 'bg-rose-500',
  },
  warning: {
    ring: 'ring-amber-100 border-amber-200',
    accent: 'bg-amber-500',
    text: 'text-amber-800',
    progress: 'bg-amber-500',
  },
};

export const Toast: React.FC<ToastProps> = ({ type, title, message, duration, isClosing, onClose }) => {
  const styles = typeStyles[type];
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setIsShown(true), 10);
    return () => window.clearTimeout(id);
  }, []);

  const isVisible = isShown && !isClosing;

  return (
    <div
      className={`pointer-events-auto relative w-full max-w-sm rounded-lg border bg-white p-4 shadow-lg ring-1 transition-all duration-200 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      } ${styles.ring}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${styles.accent}`} />
        <div className="min-w-0 flex-1">
          {title && <div className={`text-sm font-semibold ${styles.text}`}>{title}</div>}
          <div className="text-sm text-slate-700 break-words">{message}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="-m-1 rounded-full p-1 text-slate-400 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Закрыть"
          >
            ✕
          </button>
        )}
      </div>
      {typeof duration === 'number' && duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-xl">
          <div
            className={`h-full origin-left ${styles.progress}`}
            style={{ animation: `toast-progress ${duration}ms linear forwards` }}
          />
        </div>
      )}
    </div>
  );
};
