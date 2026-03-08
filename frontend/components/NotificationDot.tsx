interface Props { count?: number; children: React.ReactNode; }
export default function NotificationDot({ count, children }: Props) {
  return (
    <div className="relative inline-flex">
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center px-1 shadow-md">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </div>
  );
}