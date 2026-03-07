interface Props { type?: 'info' | 'warning' | 'success' | 'error'; message: string; }
const STYLES = {
  info:    'bg-blue-50/80 border-blue-200 text-blue-700',
  warning: 'bg-yellow-50/80 border-yellow-200 text-yellow-700',
  success: 'bg-green-50/80 border-green-200 text-green-700',
  error:   'bg-red-50/80 border-red-200 text-red-700',
};
const ICONS = { info: 'ℹ️', warning: '⚠️', success: '✅', error: '❌' };
export default function Alert({ type = 'info', message }: Props) {
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border text-sm font-medium ${STYLES[type]}`}>
      <span className="flex-shrink-0">{ICONS[type]}</span>
      <p>{message}</p>
    </div>
  );
}