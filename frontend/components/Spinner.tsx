export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <div className={`${s} rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin`} role="status" aria-label="Loading" />
  );
}
