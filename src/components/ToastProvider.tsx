'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface Toast {
  id: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContextValue {
  show: (message: string, options?: Partial<Omit<Toast, 'id' | 'message'>>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, options?: Partial<Omit<Toast, 'id' | 'message'>>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { id, message, type: 'info', duration: 3500, ...options };
    setToasts(prev => [...prev, toast]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map(t => setTimeout(() => {
      setToasts(prev => prev.filter(p => p.id !== t.id));
    }, t.duration));
    return () => { timers.forEach(clearTimeout); };
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3 w-80">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-lg shadow-md px-4 py-3 text-sm text-white flex items-start gap-3 animate-fade-in-down
            ${t.type === 'success' ? 'bg-green-600' : ''}
            ${t.type === 'error' ? 'bg-red-600' : ''}
            ${t.type === 'warning' ? 'bg-yellow-600' : ''}
            ${t.type === 'info' ? 'bg-gray-800' : ''}`}
          >
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(p => p.id !== t.id))} className="text-white/70 hover:text-white">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// Basic animation utility styles could be placed in globals.css:
// .animate-fade-in-down { animation: fade-in-down 0.25s ease-out; }
// @keyframes fade-in-down { from { opacity:0; transform:translateY(-8px);} to {opacity:1; transform:translateY(0);} }
