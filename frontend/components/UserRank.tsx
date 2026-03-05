'use client';

import { useEffect, useState } from 'react';
import { checkinClient } from '@/lib/contracts';

interface Props {
  userAddress: string;
}

export default function UserRank({ userAddress }: Props) {
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const lb = await checkinClient.getLeaderboard(100);
        const idx = lb.findIndex(e => e.user === userAddress);
        setRank(idx >= 0 ? idx + 1 : null);
      } catch { /* silent */ }
    };
    load();
  }, [userAddress]);

  if (rank === null) return null;

  const label = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <div className="glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-2">
      <span className="text-base">{rank <= 3 ? label : '📊'}</span>
      <div>
        <p className="text-xs text-gray-400">Your Rank</p>
        <p className="text-sm font-bold gradient-text">{rank <= 3 ? label : `#${rank}`}</p>
      </div>
    </div>
  );
}
