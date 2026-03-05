'use client';

import { useWallet } from '@/context/WalletContext';
import { shortenAddress } from '@/lib/stacks';

export default function Header() {
  const { isConnected, userAddress, connect, disconnect } = useWallet();

  return (
    <header className="relative z-10">
      <div className="glass border-b border-white/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-tight">Daily Check-in</h1>
              <p className="text-xs text-gray-400 font-medium">Stacks Blockchain</p>
            </div>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-3">
            {isConnected && userAddress ? (
              <div className="flex items-center gap-3">
                <div className="glass-dark rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-medium text-gray-700">
                    {shortenAddress(userAddress)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connect} className="btn-primary text-sm">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
