import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils/helpers';

const TOAST_STYLES = {
  success: {
    bg: 'bg-white border-brand-200',
    icon: <CheckCircle size={18} className="text-brand-600 shrink-0" />,
    bar: 'bg-brand-500',
  },
  error: {
    bg: 'bg-white border-red-200',
    icon: <AlertCircle size={18} className="text-red-600 shrink-0" />,
    bar: 'bg-red-500',
  },
  warning: {
    bg: 'bg-white border-amber-200',
    icon: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
    bar: 'bg-amber-500',
  },
  info: {
    bg: 'bg-white border-blue-200',
    icon: <Info size={18} className="text-blue-600 shrink-0" />,
    bar: 'bg-blue-500',
  },
};

function Toast({ id, message, type = 'success' }) {
  const { removeToast } = useToast();
  const style = TOAST_STYLES[type] || TOAST_STYLES.success;

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card-md min-w-[280px] max-w-sm animate-slide-up overflow-hidden',
        style.bg
      )}
    >
      {style.icon}
      <p className="text-sm text-gray-800 flex-1 pt-0.5">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      >
        <X size={15} />
      </button>
      {/* Progress bar */}
      <div className={cn('absolute bottom-0 left-0 h-0.5 animate-[shrink_4s_linear_forwards]', style.bar)} />
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  );
}
