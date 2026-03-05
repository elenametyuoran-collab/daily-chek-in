interface Props {
  icon?: string;
  title: string;
  description?: string;
}

export default function EmptyState({ icon = '🔍', title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl mb-3 animate-float">{icon}</span>
      <p className="font-semibold text-gray-600">{title}</p>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
