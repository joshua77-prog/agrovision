import { cn } from '../../utils/helpers';

export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'card',
        padding && 'p-5',
        hover && 'cursor-pointer hover:shadow-card-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-base font-semibold text-gray-900', className)}>{children}</h3>
  );
}
