import { cn } from '../../utils/helpers';
import { SeverityBadge } from './StatusBadge';
import { truncate } from '../../utils/helpers';

export default function DiseaseCard({ disease, onViewDetails }) {
  return (
    <div className="card p-5 hover:shadow-card-md transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-0.5">{disease.crop}</p>
          <h3 className="text-base font-semibold text-gray-900">{disease.name}</h3>
        </div>
        <SeverityBadge severity={disease.severity} />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{truncate(disease.shortDescription, 120)}</p>
      <div className="pt-1 border-t border-gray-50">
        <button
          onClick={() => onViewDetails(disease)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}
