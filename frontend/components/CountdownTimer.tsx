'use client';

import { useEffect, useState } from 'react';

interface Props {
  lastCheckinBlock: number;
  currentBlock: number;
}

const BLOCKS_PER_DAY = 144;
const MINS_PER_BLOCK = 10;

export default function CountdownTimer({ lastCheckinBlock, currentBlock }: Props) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (lastCheckinBlock === 0) {
      setTimeLeft('');
      return;
    }

    const blocksUntilNext = BLOCKS_PER_DAY - (currentBlock - lastCheckinBlock);
    if (blocksUntilNext <= 0) {
      setTimeLeft('');
      return;
    }

    const minsLeft = blocksUntilNext * MINS_PER_BLOCK;
    const hours = Math.floor(minsLeft / 60);
    const mins = minsLeft % 60;

    const tick = () => {
      setTimeLeft(hours > 0 ? `~${hours}h ${mins}m` : `~${mins}m`);
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [lastCheckinBlock, currentBlock]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
      <span className="text-base">⏱</span>
      <span>Next check-in available in <span className="font-semibold text-indigo-500">{timeLeft}</span></span>
    </div>
  );
}
