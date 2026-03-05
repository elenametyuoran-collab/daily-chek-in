'use client';

import { CONTRACT_ADDRESS, CONTRACT_NAME } from '@/lib/stacks';

export default function ContractInfo() {
  const explorerUrl = `https://explorer.hiro.so/address/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=mainnet`;

  return (
    <div className="glass-dark rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Contract</p>
        <p className="text-xs font-mono text-gray-600 truncate">
          {CONTRACT_ADDRESS.slice(0, 8)}…{CONTRACT_ADDRESS.slice(-4)}.{CONTRACT_NAME}
        </p>
      </div>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors glass px-3 py-1.5 rounded-xl"
      >
        Explorer ↗
      </a>
    </div>
  );
}
