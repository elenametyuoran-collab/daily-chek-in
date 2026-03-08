interface Props { label: string; value: string | number; icon?: string; }
export default function StatRow({ label, value, icon }: Props) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/20 last:border-0">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <span className="text-sm font-bold gradient-text">{value}</span>
    </div>
  );
}