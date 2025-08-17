'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2 } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ToastContextValue {
  showToast: (message: string, options?: Partial<Omit<Toast, 'id' | 'message'>>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (options: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const SexyToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions | null>(null);

  const showToast = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message'>>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { 
      id, 
      message, 
      type: 'info', 
      duration: 4000, 
      ...options 
    };
    setToasts(prev => [...prev, toast]);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'success', title, duration: 3000 });
  }, [showToast]);

  const showError = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'error', title, duration: 5000 });
  }, [showToast]);

  const showWarning = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'warning', title, duration: 4000 });
  }, [showToast]);

  const showInfo = useCallback((message: string, title?: string) => {
    showToast(message, { type: 'info', title, duration: 3000 });
  }, [showToast]);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    setConfirmDialog(options);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  useEffect(() => {
    const timers = toasts.map(toast => {
      if (toast.duration && toast.duration > 0) {
        return setTimeout(() => removeToast(toast.id), toast.duration);
      }
      return null;
    }).filter(Boolean);

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
    }
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success': 
        return 'bg-gradient-to-r from-emerald-500 to-green-500 border-l-4 border-emerald-400 text-white shadow-emerald-500/25';
      case 'error': 
        return 'bg-gradient-to-r from-red-500 to-rose-500 border-l-4 border-red-400 text-white shadow-red-500/25';
      case 'warning': 
        return 'bg-gradient-to-r from-amber-500 to-orange-500 border-l-4 border-amber-400 text-white shadow-amber-500/25';
      case 'info': 
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 border-l-4 border-blue-400 text-white shadow-blue-500/25';
    }
  };

  const getConfirmStyles = (type: ConfirmOptions['type']) => {
    switch (type) {
      case 'danger':
        return {
          gradient: 'from-red-500 to-rose-500',
          confirmButton: 'bg-red-600 hover:bg-red-700',
          icon: <Trash2 className="w-6 h-6 text-red-400" />
        };
      case 'warning':
        return {
          gradient: 'from-amber-500 to-orange-500',
          confirmButton: 'bg-amber-600 hover:bg-amber-700',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />
        };
      default:
        return {
          gradient: 'from-blue-500 to-indigo-500',
          confirmButton: 'bg-blue-600 hover:bg-blue-700',
          icon: <Info className="w-6 h-6 text-blue-400" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ 
      showToast, 
      showSuccess, 
      showError, 
      showWarning, 
      showInfo, 
      showConfirm 
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
        {toasts.map(toast => {
          const styles = getToastStyles(toast.type);
          const icon = getToastIcon(toast.type);
          
          return (
            <div
              key={toast.id}
              className={`${styles} rounded-xl p-4 shadow-2xl backdrop-blur-xl transform transition-all duration-500 ease-out animate-in slide-in-from-right-full`}
              style={{
                animation: 'slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <div className="font-semibold text-sm mb-1">
                      {toast.title}
                    </div>
                  )}
                  <div className="text-sm opacity-95">
                    {toast.message}
                  </div>
                  {toast.action && (
                    <button
                      onClick={toast.action.onClick}
                      className="mt-2 text-xs font-medium underline hover:no-underline opacity-90 hover:opacity-100"
                    >
                      {toast.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              confirmDialog.onCancel?.();
              closeConfirm();
            }}
          />
          
          {/* Dialog */}
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl shadow-2xl border border-white/20 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 animate-in zoom-in-95">
            <div className={`bg-gradient-to-r ${getConfirmStyles(confirmDialog.type).gradient} p-6 rounded-t-2xl`}>
              <div className="flex items-center gap-4">
                {getConfirmStyles(confirmDialog.type).icon}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {confirmDialog.title || 'Confirm Action'}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-white/90 mb-6 leading-relaxed">
                {confirmDialog.message}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    confirmDialog.onCancel?.();
                    closeConfirm();
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  {confirmDialog.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm();
                    closeConfirm();
                  }}
                  className={`flex-1 px-4 py-3 ${getConfirmStyles(confirmDialog.type).confirmButton} text-white rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg`}
                >
                  {confirmDialog.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useSexyToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useSexyToast must be used within a SexyToastProvider');
  }
  return context;
}

// Global replacements for window.alert and window.confirm
export const replaceNativeDialogs = () => {
  if (typeof window !== 'undefined') {
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;

    // Override window.alert
    window.alert = (message: string) => {
      // Try to use the toast context if available
      const event = new CustomEvent('sexyToast', {
        detail: { type: 'info', message }
      });
      window.dispatchEvent(event);
    };

    // Override window.confirm
    window.confirm = (message?: string): boolean => {
      // Since confirm is synchronous but our modal is async,
      // we'll show a warning and return false
      const event = new CustomEvent('sexyToast', {
        detail: { 
          type: 'warning', 
          message: `Please use useSexyToast().showConfirm() instead of confirm(). Original message: ${message || 'No message'}` 
        }
      });
      window.dispatchEvent(event);
      return false;
    };

    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
    };
  }
};

// CSS for animations
const toastAnimations = `
  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-in {
    animation-fill-mode: both;
  }
  
  .slide-in-from-right-full {
    animation: slideInFromRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .zoom-in-95 {
    animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  @keyframes zoomIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('sexy-toast-styles')) {
  const style = document.createElement('style');
  style.id = 'sexy-toast-styles';
  style.textContent = toastAnimations;
  document.head.appendChild(style);
}
