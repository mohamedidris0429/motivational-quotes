import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastState { id: number; msg: string }
const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 sm:bottom-8 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-navy-900 dark:bg-lavender-600 px-5 py-3 text-sm font-medium text-white shadow-card animate-slideUp"
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
