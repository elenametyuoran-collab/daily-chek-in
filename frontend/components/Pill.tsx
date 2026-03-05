interface Props {
  label: string;
  active?: boolean;
}

export default function Pill({ label, active }: Props) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
      active
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
        : 'glass-dark text-gray-500'
    }`}>
      {label}
    </span>
  );
}
