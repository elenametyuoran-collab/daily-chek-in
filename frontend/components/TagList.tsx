interface Props { tags: string[]; color?: string; }
export default function TagList({ tags, color = 'bg-indigo-50 text-indigo-600' }: Props) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <span key={tag} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
          #{tag}
        </span>
      ))}
    </div>
  );
}