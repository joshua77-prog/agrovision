import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfidenceBar from '../../components/ui/ConfidenceBar';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { getDetectionHistory } from '../../services/detectionService';
import { formatDate, formatConfidence } from '../../utils/helpers';

const CROP_OPTIONS = ['Tomato', 'Potato', 'Apple', 'Corn', 'Grape', 'Pepper'].map((c) => ({ value: c, label: c }));
const STATUS_OPTIONS = [
  { value: 'Healthy', label: 'Healthy' },
  { value: 'Diseased', label: 'Diseased' },
  { value: 'Attention Required', label: 'Attention Required' },
];

// Mobile card view of a single detection
function DetectionCard({ det }) {
  return (
    <div className="card p-4 flex items-start gap-3 hover:shadow-card-md transition-all">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 text-xl">
        🌿
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900">{det.crop}</span>
          <StatusBadge status={det.status} />
        </div>
        <p className="text-sm text-gray-600 mb-1 truncate">{det.disease}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {formatDate(det.date)}
          </span>
          <span className="font-medium text-gray-600">{formatConfidence(det.confidence)}</span>
        </div>
        <div className="mt-2">
          <ConfidenceBar value={det.confidence} showLabel={false} className="h-1" />
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [detections, setDetections] = useState([]);
  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getDetectionHistory(filters);
      setDetections(data);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filter
  const filtered = detections.filter((d) => {
    const matchSearch = !search || d.crop.toLowerCase().includes(search.toLowerCase()) || d.disease.toLowerCase().includes(search.toLowerCase());
    const matchCrop = !cropFilter || d.crop === cropFilter;
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchCrop && matchStatus;
  });

  if (loading) return <PageLoader message="Loading detection history..." />;

  return (
    <div className="px-4 md:px-6 py-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="section-title">Detection History</h1>
            <p className="section-subtitle">{detections.length} total detections across all crops.</p>
          </div>
          <Link to="/detect">
            <Button variant="primary" size="sm" icon={<Leaf size={14} />}>
              New Detection
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-5">
          <div className="flex flex-wrap gap-3">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search crop or disease..."
              className="flex-1 min-w-[200px]"
            />
            <FilterDropdown
              label="All Crops"
              options={CROP_OPTIONS}
              value={cropFilter}
              onChange={setCropFilter}
              className="min-w-[140px]"
            />
            <FilterDropdown
              label="All Statuses"
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="min-w-[160px]"
            />
            {(search || cropFilter || statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearch(''); setCropFilter(''); setStatusFilter(''); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
          {filtered.length !== detections.length && (
            <p className="text-xs text-gray-500 mt-2">
              Showing {filtered.length} of {detections.length} detections
            </p>
          )}
        </Card>

        {filtered.length === 0 ? (
          <EmptyState
            title="No detections found"
            description={
              search || cropFilter || statusFilter
                ? 'No detections match your current filters. Try adjusting your search.'
                : 'No detection history yet. Start by analyzing your first crop image.'
            }
            action={() => window.location.href = '/detect'}
            actionLabel="Start Detection"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th className="th">Date</th>
                    <th className="th">Crop</th>
                    <th className="th">Image</th>
                    <th className="th">Predicted Disease</th>
                    <th className="th">Confidence</th>
                    <th className="th">Status</th>
                    <th className="th">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((det) => (
                    <tr key={det.id} className="tr">
                      <td className="td text-gray-500">{formatDate(det.date)}</td>
                      <td className="td font-medium text-gray-900">{det.crop}</td>
                      <td className="td">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          🌿
                        </div>
                      </td>
                      <td className="td">{det.disease}</td>
                      <td className="td">
                        <div className="w-28">
                          <ConfidenceBar value={det.confidence} />
                        </div>
                      </td>
                      <td className="td">
                        <StatusBadge status={det.status} />
                      </td>
                      <td className="td">
                        <button className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((det) => (
                <DetectionCard key={det.id} det={det} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
