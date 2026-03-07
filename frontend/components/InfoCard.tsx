import React from 'react';

interface InfoCardProps { label: string; value: string | number; icon?: string; className?: string }

export default function InfoCard({ label, value, icon, className = '' }: InfoCardProps) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-2 ${className}`}>
      {icon && <span className="text-2xl">{icon}</span>}
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  );
}
