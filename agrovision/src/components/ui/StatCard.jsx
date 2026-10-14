import { cn } from '../../utils/helpers';

export default function StatCard({ title, value, icon, trend, trendLabel, color = 'green' }) {
  const colorMap = {
    green: 'bg-brand-50 text-brand-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="stat-card">
      <div className={cn('p-2.5 rounded-xl shrink-0', colorMap[color])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium mb-0.5 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
        {trendLabel && (
          <p className={cn('text-xs mt-1 font-medium', trend === 'up' ? 'text-brand-600' : trend === 'down' ? 'text-red-500' : 'text-gray-400')}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}
