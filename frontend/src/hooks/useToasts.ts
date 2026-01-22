import { useContext, useMemo } from 'react';

import {
  ToastsContext,
  type AddToastPayload,
  type ToastItem,
} from '../providers/ToastProvider';
import type { ToastType } from '../components/atoms/Toast';

export type UseToastsResult = {
  toasts: ToastItem[];
  addToast: (payload: AddToastPayload) => string;
  removeToast: (id: string) => void;
  clear: () => void;
  toast: Record<ToastType, (message: string, options?: Omit<AddToastPayload, 'type' | 'message'>) => string>;
};

export const useToasts = (): UseToastsResult => {
  const ctx = useContext(ToastsContext);
  if (!ctx) {
    throw new Error('useToasts must be used within ToastProvider');
  }

  const toast = useMemo(() => {
    const make = (type: ToastType) =>
      (message: string, options?: Omit<AddToastPayload, 'type' | 'message'>) =>
        ctx.addToast({
          type,
          message,
          title: options?.title,
          duration: options?.duration,
        });

    return {
      primary: make('primary'),
      info: make('info'),
      success: make('success'),
      danger: make('danger'),
      warning: make('warning'),
    };
  }, [ctx]);

  return {
    toasts: ctx.toasts,
    addToast: ctx.addToast,
    removeToast: ctx.removeToast,
    clear: ctx.clear,
    toast,
  };
};
