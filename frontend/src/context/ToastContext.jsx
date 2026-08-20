import React, { createContext, useContext, useState, useCallback } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all transform animate-float ${
              toast.type === 'success'
                ? 'bg-rosewood-50/95 border-rosewood-200 text-rosewood-900 dark:bg-warmgray-900/95 dark:border-rosewood-800 dark:text-rosewood-100'
                : toast.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-900 dark:bg-warmgray-900/95 dark:border-red-900 dark:text-red-200'
                : 'bg-warmgray-100/95 border-warmgray-200 text-warmgray-900 dark:bg-warmgray-900/95 dark:border-warmgray-700 dark:text-warmgray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <div className="p-1.5 bg-rosewood-100 dark:bg-rosewood-950/60 rounded-full text-rosewood-600 dark:text-rosewood-400">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : toast.type === 'error' ? (
                <div className="p-1.5 bg-red-100 dark:bg-red-950/60 rounded-full text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 bg-warmgray-200 dark:bg-warmgray-800 rounded-full text-warmgray-700 dark:text-warmgray-300">
                  <Info className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-warmgray-400 hover:text-warmgray-700 dark:hover:text-warmgray-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
