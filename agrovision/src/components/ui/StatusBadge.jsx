import { cn } from '../../utils/helpers';
import { getStatusBadge } from '../../utils/helpers';

export default function StatusBadge({ status, className = '' }) {
  return (
    <span className={cn(getStatusBadge(status), className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function SeverityBadge({ severity, className = '' }) {
  const classes = {
    High: 'badge-red',
    Medium: 'badge-yellow',
    Low: 'badge-green',
  };
  return (
    <span className={cn(classes[severity] || 'badge-gray', className)}>
      {severity}
    </span>
  );
}
