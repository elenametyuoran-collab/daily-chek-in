'use client';

interface Props {
  streak: number;
}

const MILESTONES = [
  { min: 0,  label: 'New',       color: 'from-gray-300 to-gray-400',    icon: '🌱' },
  { min: 3,  label: 'Getting Started', color: 'from-blue-300 to-blue-500', icon: '💧' },
  { min: 7,  label: 'On Fire',   color: 'from-orange-400 to-red-500',   icon: '🔥' },
  { min: 14, label: 'Unstoppable', color: 'from-purple-400 to-violet-600', icon: '⚡' },
  { min: 30, label: 'Legend',    color: 'from-yellow-400 to-amber-500', icon: '👑' },
];

export default function StreakBadge({ streak }: Props) {
  const milestone = [...MILESTONES].reverse().find(m => streak >= m.min) ?? MILESTONES[0];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${milestone.color} shadow-md`}>
      <span className="text-sm">{milestone.icon}</span>
      <span className="text-xs font-bold text-white">{milestone.label}</span>
    </div>
  );
}
