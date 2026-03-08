'use client';
import { useState } from 'react';
interface Item { question: string; answer: string; }
export default function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
            <span>{item.question}</span>
            <span className={`transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-500 animate-slide-up">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}