'use client';

interface Props {
  streak: number;
}

export default function WeeklyProgress({ streak }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => i < (streak % 7 || (streak > 0 && streak % 7 === 0 ? 7 : 0)));

  return (
    <div className="glass-dark rounded-2xl px-4 py-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">This Week</p>
      <div className="flex gap-1.5 justify-center">
        {Array.from({ length: 7 }, (_, i) => {
          const filled = streak > 0 && i < (streak >= 7 ? 7 : streak % 7 || (streak === 7 ? 7 : 0));
          return (
            <div
              key={i}
              className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                filled
                  ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-sm'
                  : 'bg-white/40'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1.5">
        {streak >= 7 ? '🔥 Full week!' : `${streak % 7 || 0}/7 days`}
      </p>
    </div>
  );
}
