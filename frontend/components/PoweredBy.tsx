export default function PoweredBy() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <a
        href="https://stacks.co"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-dark rounded-full px-4 py-1.5 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="text-sm">⚡</span>
        <span className="text-xs font-semibold text-gray-500">Powered by Stacks</span>
      </a>
      <a
        href="https://bitcoin.org"
        target="_blank"
        rel="noopener noreferrer"
        className="glass-dark rounded-full px-4 py-1.5 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="text-sm">₿</span>
        <span className="text-xs font-semibold text-gray-500">Secured by Bitcoin</span>
      </a>
    </div>
  );
}
