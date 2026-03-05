interface Props {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ title, subtitle, center }: Props) {
  return (
    <div className={`mb-5 ${center ? 'text-center' : ''}`}>
      <h2 className="text-xl font-bold gradient-text">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}
