'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import CheckInCard from '@/components/CheckInCard';
import StatsCard from '@/components/StatsCard';
import Leaderboard from '@/components/Leaderboard';

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCheckedIn = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2 mb-5 text-sm font-medium text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live on Stacks Mainnet
          </div>
          <h1 className="text-5xl md:text-6xl font-black gradient-text mb-4 leading-tight">
            Daily Check-in
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">
            Build your streak, collect NFT badges for 7 and 30-day streaks,
            and compete for weekly STX rewards.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: check-in + stats */}
          <div className="space-y-6">
            <CheckInCard onCheckedIn={handleCheckedIn} />

            {/* Reward info */}
            <div className="glass rounded-3xl p-6 shadow-md">
              <h3 className="font-bold text-gray-700 mb-4">How it works</h3>
              <div className="space-y-3">
                {[
                  { icon: '🔥', text: 'Check in once per day to build your streak' },
                  { icon: '🏅', text: 'Reach 7-day streak → claim your NFT badge' },
                  { icon: '🏆', text: 'Reach 30-day streak → claim elite NFT badge' },
                  { icon: '💰', text: 'Top 5 most active earn 5/4/3/2/1 STX rewards' },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Global stats */}
            <StatsCard refreshKey={refreshKey} />
          </div>

          {/* Right column: leaderboard */}
          <div>
            <Leaderboard refreshKey={refreshKey} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-14 pb-6 text-sm text-gray-400">
          <p>
            Built on{' '}
            <a
              href="https://stacks.co"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-text font-medium hover:opacity-80 transition-opacity"
            >
              Stacks
            </a>{' '}
            · Secured by Bitcoin
          </p>
        </footer>
      </main>
    </div>
  );
}
