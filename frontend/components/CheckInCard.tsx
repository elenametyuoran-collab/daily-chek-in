'use client';

import { useState, useEffect } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { useWallet } from '@/context/WalletContext';
import { checkinClient } from '@/lib/contracts';
import { canCheckIn, blocksToRelativeTime } from '@/lib/stacks';
import type { UserStats } from '@/lib/contracts';

const network = new StacksMainnet();

interface Props {
  onCheckedIn?: () => void;
}

export default function CheckInCard({ onCheckedIn }: Props) {
  const { isConnected, userAddress, connect } = useWallet();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  useEffect(() => {
    if (!userAddress) return;
    const load = async () => {
      setLoading(true);
      try {
        const [s, block] = await Promise.all([
          checkinClient.getUserStats(userAddress),
          fetchCurrentBlock(),
        ]);
        setStats(s);
        setCurrentBlock(block);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userAddress]);

  async function fetchCurrentBlock(): Promise<number> {
    try {
      const res = await fetch('https://api.mainnet.hiro.so/v2/info');
      const data = await res.json();
      return data.stacks_tip_height ?? 0;
    } catch {
      return 0;
    }
  }

  const eligible = stats && currentBlock > 0
    ? canCheckIn(stats.lastCheckinBlock, currentBlock)
    : true;

  async function handleCheckIn() {
    if (!isConnected) return connect();
    const txOptions = checkinClient.prepareCheckIn();
    setTxPending(true);
    try {
      await openContractCall({
        ...txOptions,
        network,
        onFinish: () => {
          setJustCheckedIn(true);
          setTxPending(false);
          onCheckedIn?.();
        },
        onCancel: () => setTxPending(false),
      });
    } catch {
      setTxPending(false);
    }
  }

  async function handleClaimNft(type: '7' | '30') {
    const txOptions = type === '7'
      ? checkinClient.prepareClaimStreak7Nft()
      : checkinClient.prepareClaimStreak30Nft();
    await openContractCall({
      ...txOptions,
      network,
      onFinish: () => onCheckedIn?.(),
    });
  }

  const streakColor =
    !stats || stats.streak === 0 ? 'text-gray-400'
    : stats.streak >= 30 ? 'text-yellow-500'
    : stats.streak >= 7 ? 'text-orange-500'
    : 'text-blue-500';

  return (
    <div className="glass rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-purple-200/30 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-200/30 blur-2xl" />

      <div className="relative z-10">
        {/* Streak display */}
        <div className="mb-6">
          <div className={`text-7xl font-black ${streakColor} animate-float`}>
            {loading ? '—' : (stats?.streak ?? 0)}
          </div>
          <p className="text-gray-500 font-medium mt-1">
            {stats?.streak === 1 ? 'day streak' : 'days streak'} 🔥
          </p>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold gradient-text">
              {loading ? '—' : (stats?.totalCheckins ?? 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total Check-ins</p>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-2xl font-bold gradient-text">
              {stats?.lastCheckinBlock && currentBlock > 0
                ? blocksToRelativeTime(stats.lastCheckinBlock, currentBlock)
                : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-1">Last Check-in</p>
          </div>
        </div>

        {/* Check-in button */}
        {justCheckedIn ? (
          <div className="py-3 text-green-600 font-semibold text-lg animate-pulse">
            ✅ Checked in! TX pending...
          </div>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={txPending || (isConnected && !eligible)}
            className="btn-primary w-full text-base"
          >
            {!isConnected
              ? 'Connect Wallet to Check In'
              : txPending
              ? 'Waiting for signature…'
              : !eligible
              ? '⏳ Come back tomorrow'
              : '✅ Check In Today'}
          </button>
        )}

        {/* NFT claim buttons */}
        {isConnected && stats && (
          <div className="flex gap-3 mt-4">
            {stats.streak >= 7 && !stats.nft7Claimed && (
              <button
                onClick={() => handleClaimNft('7')}
                className="flex-1 glass-dark rounded-2xl py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition-all"
              >
                🏅 Claim 7-Day NFT
              </button>
            )}
            {stats.streak >= 30 && !stats.nft30Claimed && (
              <button
                onClick={() => handleClaimNft('30')}
                className="flex-1 glass-dark rounded-2xl py-3 text-sm font-semibold text-yellow-600 hover:bg-yellow-50 transition-all"
              >
                🏆 Claim 30-Day NFT
              </button>
            )}
          </div>
        )}

        {/* NFT badges earned */}
        {stats && (stats.nft7Claimed || stats.nft30Claimed) && (
          <div className="flex justify-center gap-3 mt-4">
            {stats.nft7Claimed && (
              <span className="glass-dark rounded-full px-4 py-1.5 text-sm text-purple-600 font-medium">
                🏅 7-Day Badge
              </span>
            )}
            {stats.nft30Claimed && (
              <span className="glass-dark rounded-full px-4 py-1.5 text-sm text-yellow-600 font-medium">
                🏆 30-Day Badge
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
