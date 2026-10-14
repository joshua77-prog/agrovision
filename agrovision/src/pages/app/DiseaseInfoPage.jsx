import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, BookOpen, CheckCircle, FlaskConical, Shield, 
  AlertTriangle, ScanLine, Search, Sparkles, ArrowRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import DiseaseCard from '../../components/ui/DiseaseCard';
import Modal from '../../components/ui/Modal';
import { SeverityBadge } from '../../components/ui/StatusBadge';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import { getAllDiseases } from '../../services/diseaseService';
import { MOCK_CROPS } from '../../utils/mockData';

export default function DiseaseInfoPage() {
  const [loading, setLoading] = useState(true);
  const [diseases, setDiseases] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCrop, setActiveCrop] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllDiseases().then((data) => {
      setDiseases(data);
      setLoading(false);
    });
  }, []);

  const CROP_PILLS = ['All', 'Tomato', 'Potato', 'Corn', 'Apple', 'Grape', 'Pepper', 'Rice'];

  const filtered = diseases.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !search || d.name.toLowerCase().includes(q) || d.crop.toLowerCase().includes(q) || d.shortDescription?.toLowerCase().includes(q);
    const matchCrop = activeCrop === 'All' || d.crop.toLowerCase() === activeCrop.toLowerCase();
    return matchSearch && matchCrop;
  });

  if (loading) return <PageLoader message="Loading crop pathology knowledge library..." />;

  return (
    <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-gray-950 text-white shadow-card-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
            <BookOpen size={13} />
            <span>Pathology Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Foliar Disease Encyclopedia
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 leading-relaxed">
            Explore 30+ validated crop pathologies, characteristic leaf lesion symptoms, and verified bio-organic & chemical treatment protocols.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/detect">
            <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold border-none shadow-glow flex items-center gap-2">
              <ScanLine size={16} />
              Diagnose New Leaf
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Crop Filter Pills */}
      <div className="glass-card p-4 sm:p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pathogen name, crop variety, or symptom keyword (e.g. blight, rust, leaf spot)..."
            className="input pl-10 text-xs font-semibold rounded-2xl border-gray-200 bg-gray-50/70"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
            Crop:
          </span>
          {CROP_PILLS.map((crop) => (
            <button
              key={crop}
              onClick={() => setActiveCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCrop === crop
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200/70 text-gray-600'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="text-xs font-medium text-gray-400 flex items-center justify-between pt-1">
          <span>Showing {filtered.length} of {diseases.length} indexed pathologies</span>
          {(search || activeCrop !== 'All') && (
            <button
              onClick={() => { setSearch(''); setActiveCrop('All'); }}
              className="text-brand-600 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Disease Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No pathology matched your query"
          description="Try searching with a broader keyword or switch to 'All' crops."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((disease) => (
            <DiseaseCard
              key={disease.id}
              disease={disease}
              onViewDetails={setSelected}
            />
          ))}
        </div>
      )}

      {/* Deep-dive Detail Modal */}
      {selected && (
        <Modal
          isOpen={Boolean(selected)}
          onClose={() => setSelected(null)}
          title={selected.name}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Affects Crop: <strong className="text-gray-900">{selected.crop}</strong></p>
                {selected.scientificName && (
                  <p className="text-xs italic text-gray-500 font-serif">Taxon: {selected.scientificName}</p>
                )}
              </div>
              <SeverityBadge severity={selected.severity} />
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Overview</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                {selected.shortDescription || selected.description}
              </p>
            </div>

            {selected.symptoms && (
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">Visual Symptoms</h4>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 leading-relaxed">
                  {Array.isArray(selected.symptoms) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {selected.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{selected.symptoms}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                  <Shield size={14} />
                  <span>Bio-Organic Remedy</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selected.organicTreatment || 'Apply certified bio-fungicide Bacillus subtilis or copper soap spray every 7-10 days.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1">
                  <FlaskConical size={14} />
                  <span>Chemical Protocol</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {selected.chemicalTreatment || 'Apply contact protective fungicides (Mancozeb or Chlorothalonil) during early spore germination.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Link to="/detect" onClick={() => setSelected(null)}>
                <Button variant="primary" size="sm" className="flex items-center gap-1.5 font-bold">
                  <ScanLine size={14} />
                  Diagnose Leaf of {selected.crop}
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
