'use client';

import { useState, useEffect, useCallback } from 'react';
import { checkinClient } from '@/lib/contracts';
import { fetchCurrentBlock } from '@/lib/stacks';
import type { UserStats } from '@/lib/contracts';

interface UseUserStatsResult {
  stats: UserStats | null;
  currentBlock: number;
  loading: boolean;
  refresh: () => void;
}

export function useUserStats(userAddress: string | null): UseUserStatsResult {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!userAddress) {
      setStats(null);
      setCurrentBlock(0);
      return;
    }
    setLoading(true);
    try {
      const [s, block] = await Promise.all([
        checkinClient.getUserStats(userAddress),
        fetchCurrentBlock(),
      ]);
      setStats(s);
      setCurrentBlock(block);
    } catch (e) {
      console.error('useUserStats error:', e);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    setStats(null);
    setCurrentBlock(0);
    load();
  }, [load]);

  return { stats, currentBlock, loading, refresh: load };
}
