'use client';
import { useState } from 'react';
interface Tab { label: string; content: React.ReactNode; }
export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 glass-dark rounded-2xl p-1 mb-4">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
              i === active ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">{tabs[active]?.content}</div>
    </div>
  );
}