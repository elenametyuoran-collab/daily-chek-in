'use client';

interface Props {
  streak: number;
  nft7Claimed: boolean;
  nft30Claimed: boolean;
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function NftProgress({ streak, nft7Claimed, nft30Claimed }: Props) {
  return (
    <div className="glass-dark rounded-2xl p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-500 mb-1">NFT Badge Progress</p>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">🏅 7-Day Badge</span>
          <span className="text-xs font-bold text-purple-500">
            {nft7Claimed ? 'Claimed!' : `${Math.min(streak, 7)}/7`}
          </span>
        </div>
        <ProgressBar value={streak} max={7} color="from-blue-400 to-purple-500" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">🏆 30-Day Badge</span>
          <span className="text-xs font-bold text-yellow-500">
            {nft30Claimed ? 'Claimed!' : `${Math.min(streak, 30)}/30`}
          </span>
        </div>
        <ProgressBar value={streak} max={30} color="from-yellow-400 to-amber-500" />
      </div>
    </div>
  );
}
