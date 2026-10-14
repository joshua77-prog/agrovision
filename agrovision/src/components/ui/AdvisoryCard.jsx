import { cn } from '../../utils/helpers';
import {
  CloudRain, Shield, Sprout, Droplets, Wheat, AlertTriangle, Info, Bell
} from 'lucide-react';

const ICON_MAP = {
  'cloud-rain': CloudRain,
  'shield-alert': Shield,
  'sprout': Sprout,
  'droplets': Droplets,
  'wheat': Wheat,
  'alert-triangle': AlertTriangle,
  'info': Info,
  'bell': Bell,
};

const PRIORITY_STYLES = {
  high: 'border-l-red-400 bg-red-50/30',
  medium: 'border-l-amber-400 bg-amber-50/20',
  low: 'border-l-brand-400 bg-brand-50/20',
};

const ICON_COLORS = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-600',
  low: 'bg-brand-100 text-brand-600',
};

export default function AdvisoryCard({ advisory }) {
  const Icon = ICON_MAP[advisory.icon] || Info;
  const priorityStyle = PRIORITY_STYLES[advisory.priority] || PRIORITY_STYLES.low;
  const iconColor = ICON_COLORS[advisory.priority] || ICON_COLORS.low;

  return (
    <div className={cn('card p-4 border-l-4', priorityStyle)}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg shrink-0', iconColor)}>
          <Icon size={16} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{advisory.title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{advisory.message}</p>
        </div>
      </div>
    </div>
  );
}
