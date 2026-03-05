'use client';

import { useState, useEffect, useCallback } from 'react';
import { checkinClient } from '@/lib/contracts';
import type { LeaderboardEntry } from '@/lib/contracts';

interface UseLeaderboardResult {
  entries: LeaderboardEntry[];
  totalUsers: number;
  loading: boolean;
  refresh: () => void;
}

export function useLeaderboard(maxEntries = 20): UseLeaderboardResult {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lb, total] = await Promise.all([
        checkinClient.getLeaderboard(maxEntries),
        checkinClient.getTotalUsers(),
      ]);
      setEntries(lb);
      setTotalUsers(total);
    } catch (e) {
      console.error('useLeaderboard error:', e);
    } finally {
      setLoading(false);
    }
  }, [maxEntries]);

  useEffect(() => { load(); }, [load]);

  return { entries, totalUsers, loading, refresh: load };
}
