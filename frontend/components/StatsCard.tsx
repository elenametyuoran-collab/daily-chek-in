'use client';

import { useEffect, useState } from 'react';
import { checkinClient } from '@/lib/contracts';
import type { NftCounts } from '@/lib/contracts';

interface Props {
  refreshKey?: number;
}

export default function StatsCard({ refreshKey }: Props) {
  const [nftCounts, setNftCounts] = useState<NftCounts | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [counts, total] = await Promise.all([
          checkinClient.getNftCounts(),
          checkinClient.getTotalUsers(),
        ]);
        setNftCounts(counts);
        setTotalUsers(total);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  const stats = [
    {
      label: 'Participants',
      value: loading ? '—' : totalUsers.toLocaleString(),
      icon: '👥',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      label: '7-Day Badges',
      value: loading ? '—' : (nftCounts?.streak7Total ?? 0).toLocaleString(),
      icon: '🏅',
      color: 'from-purple-400 to-violet-500',
    },
    {
      label: '30-Day Badges',
      value: loading ? '—' : (nftCounts?.streak30Total ?? 0).toLocaleString(),
      icon: '🏆',
      color: 'from-yellow-400 to-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass rounded-2xl p-5 text-center shadow-md hover:shadow-lg transition-shadow">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-3 shadow-md`}
          >
            <span className="text-lg">{s.icon}</span>
          </div>
          <p className="text-2xl font-black gradient-text">{s.value}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
