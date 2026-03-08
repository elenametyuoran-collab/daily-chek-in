import React from 'react';

interface ProgressBarProps { value: number; max?: number; label?: string }

export default function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-white/60 mb-1"><span>{label}</span><span>{pct}%</span></div>}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
