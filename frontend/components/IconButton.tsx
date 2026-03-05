'use client';

interface Props {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function IconButton({ icon, label, onClick, disabled }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="w-9 h-9 glass-dark rounded-xl flex items-center justify-center hover:bg-white/60 transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-base">{icon}</span>
    </button>
  );
}
