interface BadgeProps {
  label: string;
  color?: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
}

const COLORS = {
  blue:   'bg-blue-50 text-blue-600 border-blue-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  green:  'bg-green-50 text-green-600 border-green-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  red:    'bg-red-50 text-red-600 border-red-100',
};

export default function Badge({ label, color = 'blue' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${COLORS[color]}`}>
      {label}
    </span>
  );
}
