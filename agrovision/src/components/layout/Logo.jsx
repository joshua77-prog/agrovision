import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

export default function Logo({ size = 'md', linkTo = '/', className = '' }) {
  const sizes = {
    sm: { icon: 16, text: 'text-base' },
    md: { icon: 20, text: 'text-lg' },
    lg: { icon: 28, text: 'text-2xl' },
    xl: { icon: 36, text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <Link to={linkTo} className={cn('flex items-center gap-2 shrink-0 group', className)}>
      <div className="relative">
        <div className="p-1.5 bg-brand-600 rounded-lg group-hover:bg-brand-700 transition-colors">
          <Leaf size={s.icon} className="text-white" strokeWidth={2.5} />
        </div>
        {/* Small AI dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
      </div>
      <div className="leading-none">
        <span className={cn('font-extrabold tracking-tight text-gray-900', s.text)}>
          AGRO<span className="text-brand-600">VISION</span>
        </span>
      </div>
    </Link>
  );
}
