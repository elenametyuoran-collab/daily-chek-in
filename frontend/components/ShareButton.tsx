'use client';

interface Props {
  streak: number;
  totalCheckins: number;
}

export default function ShareButton({ streak, totalCheckins }: Props) {
  const handleShare = () => {
    const text = `🔥 I'm on a ${streak}-day streak on Daily Check-in!\n✅ ${totalCheckins} total check-ins on @Stacks blockchain.\nJoin me 👇`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleShare}
      className="glass-dark rounded-2xl px-4 py-2.5 text-sm font-semibold text-sky-500 hover:bg-sky-50 transition-all flex items-center gap-2 hover:scale-105"
    >
      <span>𝕏</span>
      Share Streak
    </button>
  );
}
