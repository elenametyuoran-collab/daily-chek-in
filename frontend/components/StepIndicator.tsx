import React from 'react';

interface StepIndicatorProps { steps: string[]; current: number }

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${i < current ? 'bg-violet-600 text-white' : i === current ? 'bg-violet-500/30 text-violet-300 ring-2 ring-violet-500' : 'bg-white/10 text-white/40'}`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < steps.length - 1 && <div className={`flex-1 h-px ${i < current ? 'bg-violet-600' : 'bg-white/10'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}
