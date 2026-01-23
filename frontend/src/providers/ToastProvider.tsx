import type React from 'react';
import { createContext, useCallback, useMemo, useState } from 'react';

import { Toast, type ToastType } from '../components/atoms/Toast';

export type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  isClosing?: boolean;
};

export type AddToastPayload = Omit<ToastItem, 'id'>;

export type ToastsContextValue = {
  toasts: ToastItem[];
  addToast: (payload: AddToastPayload) => string;
  removeToast: (id: string) => void;
  clear: () => void;
};

export const ToastsContext = createContext<ToastsContextValue | null>(null);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const exitDelayMs = 250;

  const beginCloseToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isClosing: true } : toast))
    );
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, exitDelayMs);
  }, []);

  const removeToast = useCallback(
    (id: string) => {
      beginCloseToast(id);
    },
    [beginCloseToast]
  );

  const addToast = useCallback(
    (payload: AddToastPayload) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: ToastItem = {
        id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        duration: payload.duration ?? 3500,
        isClosing: false,
      };
      setToasts((prev) => [toast, ...prev]);

      if (toast.duration && toast.duration > 0) {
        window.setTimeout(() => {
          beginCloseToast(id);
        }, toast.duration);
      }

      return id;
    },
    [beginCloseToast]
  );

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, clear }),
    [toasts, addToast, removeToast, clear]
  );

  return (
    <ToastsContext.Provider value={value}>
      {children}
      <div className="fixed top-32 right-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            isClosing={toast.isClosing}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastsContext.Provider>
  );
};
