interface Props { icon: string; title: string; description: string; }
export default function FeatureItem({ icon, title, description }: Props) {
  return (
    <div className="flex gap-4 p-4 glass rounded-2xl card-hover">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow">
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="font-semibold text-gray-700 text-sm">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}