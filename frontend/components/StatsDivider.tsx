export default function StatsDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      {label && <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
    </div>
  );
}
