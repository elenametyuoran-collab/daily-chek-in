'use client';

import { useEffect, useState, useCallback } from 'react';
import { checkinClient } from '@/lib/contracts';
import { shortenAddress } from '@/lib/stacks';
import type { LeaderboardEntry } from '@/lib/contracts';

interface Props {
  refreshKey?: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const REWARD_LABELS = ['5 STX', '4 STX', '3 STX', '2 STX', '1 STX'];

export default function Leaderboard({ refreshKey }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lb, total] = await Promise.all([
        checkinClient.getLeaderboard(20),
        checkinClient.getTotalUsers(),
      ]);
      setEntries(lb);
      setTotalUsers(total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <div className="glass rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold gradient-text">Leaderboard</h2>
          <p className="text-sm text-gray-400 mt-0.5">{totalUsers.toLocaleString()} total participants</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="glass-dark rounded-2xl px-4 py-2 hover:bg-white/60 transition-colors disabled:opacity-50"
          title="Refresh leaderboard"
        >
          <span className={`text-sm font-semibold text-gray-600 ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '…' : '↻ Refresh'}
          </span>
        </button>
      </div>

      {/* Reward banner */}
      <div className="glass-dark rounded-2xl p-4 mb-5 border border-yellow-100">
        <p className="text-xs font-semibold text-gray-500 mb-2">🏆 Periodic STX Rewards</p>
        <div className="flex gap-2 flex-wrap">
          {REWARD_LABELS.map((r, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full font-bold"
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                  : i === 1
                  ? 'linear-gradient(135deg, #d1d5db, #9ca3af)'
                  : i === 2
                  ? 'linear-gradient(135deg, #fb923c, #ea580c)'
                  : 'rgba(147,197,253,0.3)',
                color: i < 3 ? 'white' : '#3b82f6',
              }}
            >
              #{i + 1} — {r}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/40 animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-gray-400 animate-fade-in">
          <p className="text-5xl mb-3 animate-bounce-sm">🌱</p>
          <p className="font-semibold text-gray-500">No check-ins yet</p>
          <p className="text-sm mt-1">Connect your wallet and be the first!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div
              key={entry.user}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all hover:scale-[1.01] ${
                idx === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/60'
                  : idx === 1
                  ? 'bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/60'
                  : idx === 2
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60'
                  : 'glass-dark'
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center flex-shrink-0">
                {idx < 3 ? (
                  <span className="text-xl">{MEDALS[idx]}</span>
                ) : (
                  <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
                )}
              </div>

              {/* Avatar + address */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0"
                    style={{
                      background: `hsl(${parseInt(entry.user.slice(-4), 16) % 360}, 65%, 75%)`,
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {shortenAddress(entry.user)}
                  </span>
                </div>
              </div>

              {/* Streak */}
              <div className="text-center flex-shrink-0">
                <p className="text-sm font-bold text-orange-500">{entry.streak}🔥</p>
                <p className="text-[10px] text-gray-400">streak</p>
              </div>

              {/* Total */}
              <div className="text-center flex-shrink-0 w-14">
                <p className="text-sm font-bold gradient-text">{entry.totalCheckins}</p>
                <p className="text-[10px] text-gray-400">check-ins</p>
              </div>

              {/* Reward label (top 5) */}
              {idx < 5 && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-bold text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                    {REWARD_LABELS[idx]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
