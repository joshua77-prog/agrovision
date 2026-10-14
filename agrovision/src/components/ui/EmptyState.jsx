import { Leaf, WifiOff } from 'lucide-react';
import Button from './Button';

export function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
        {icon || <Leaf size={28} className="text-gray-400" />}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">{description}</p>}
      </div>
      {action && actionLabel && (
        <Button variant="primary" onClick={action}>{actionLabel}</Button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-2">
        <WifiOff size={28} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">{description}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
}
