'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'from-green-400 to-emerald-500',
    error: 'from-red-400 to-rose-500',
    info: 'from-blue-400 to-indigo-500',
  };

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`glass rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 min-w-[260px] border border-white/50`}>
        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${colors[type]} flex items-center justify-center flex-shrink-0 shadow`}>
          <span className="text-sm">{icons[type]}</span>
        </div>
        <p className="text-sm font-medium text-gray-700 flex-1">{message}</p>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors ml-2">✕</button>
      </div>
    </div>
  );
}
