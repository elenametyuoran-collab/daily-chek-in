'use client';
import { useEffect } from 'react';
interface Props { open: boolean; onClose: () => void; title?: string; children: React.ReactNode; }
export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="relative glass rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
        {title && <h3 className="text-lg font-bold gradient-text mb-4">{title}</h3>}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all">✕</button>
        {children}
      </div>
    </div>
  );
}