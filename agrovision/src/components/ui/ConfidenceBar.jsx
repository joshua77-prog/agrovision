import { getConfidenceColor } from '../../utils/helpers';
import { cn } from '../../utils/helpers';

export default function ConfidenceBar({ value, showLabel = true, className = '' }) {
  const color = getConfidenceColor(value);
  const width = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">Confidence</span>
          <span className={cn('text-sm font-bold', {
            'text-brand-600': value >= 80,
            'text-amber-600': value >= 60 && value < 80,
            'text-red-600': value < 60,
          })}>
            {value.toFixed(1)}%
          </span>
        </div>
      )}
      <div className="confidence-bar">
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', color)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
