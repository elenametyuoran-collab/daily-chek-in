'use client';

import { useState } from 'react';

export default function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy full address"
      className="text-xs text-gray-400 hover:text-indigo-500 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50 flex items-center gap-1"
    >
      {copied ? '✅ Copied' : '📋 Copy'}
    </button>
  );
}
