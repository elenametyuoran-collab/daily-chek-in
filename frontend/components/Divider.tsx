export default function Divider({ label }: { label?: string }) {
  if (!label) return <div className="h-px bg-gradient-to-r from-transparent via-purple-200/60 to-transparent my-4" />;
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-200/60" />
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-200/60" />
    </div>
  );
}
