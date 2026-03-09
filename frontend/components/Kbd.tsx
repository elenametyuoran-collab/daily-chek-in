export default function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-2 py-0.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-mono text-gray-600 shadow-sm">
      {children}
    </kbd>
  );
}