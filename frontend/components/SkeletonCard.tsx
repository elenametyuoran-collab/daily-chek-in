export default function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="glass rounded-3xl p-6 shadow-md animate-pulse space-y-4">
      <div className="h-4 bg-white/50 rounded-full w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-white/40 rounded-full w-full" />
          <div className="h-3 bg-white/30 rounded-full w-4/5" />
        </div>
      ))}
    </div>
  );
}
