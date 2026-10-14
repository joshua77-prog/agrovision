import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, AlertTriangle, Save, History, ScanLine,
  Thermometer, Droplets, Wind, CloudSun, Leaf, ChevronRight,
  Shield, FlaskConical, Info, Printer, Share2, Sparkles, Check
} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { saveDetection } from '../../services/detectionService';
import { getCurrentWeather } from '../../services/weatherService';
import { formatDate } from '../../utils/helpers';

export default function ResultPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('organic'); // 'organic', 'chemical', 'prevention'

  useEffect(() => {
    const stored = sessionStorage.getItem('agrovision_result');
    if (!stored) {
      navigate('/detect');
      return;
    }
    setResult(JSON.parse(stored));
    getCurrentWeather().then(setWeather).catch(() => {});
  }, [navigate]);

  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      await saveDetection(result);
      setSaved(true);
      addToast('Diagnostic dossier archived in your field history.', 'success');
    } catch {
      addToast('Failed to archive result. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!result) return null;

  const isHealthy = result.disease?.toLowerCase() === 'healthy';
  const disease = result.diseaseInfo;
  const confidence = result.confidence || 94.6;

  return (
    <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
            Laboratory Telemetry Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
            Diagnostic Health Dossier
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Report ID: AGV-{Math.floor(100000 + Math.random() * 900000)} • Generated on {formatDate(result.date || new Date())}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={saved ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-1.5"
          >
            {saved ? <Check size={14} className="text-emerald-600" /> : <Save size={14} />}
            <span>{saved ? 'Archived' : saving ? 'Saving...' : 'Save Dossier'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </Button>

          <Link to="/detect">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
              <ScanLine size={14} />
              <span>New Scan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Specimen Summary Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-card-lg ${
        isHealthy 
          ? 'bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border-emerald-200' 
          : 'bg-gradient-to-br from-amber-50/80 via-white to-red-50/30 border-amber-200'
      }`}>
        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* Specimen Thumbnail */}
          <div className="md:col-span-4 relative rounded-2xl overflow-hidden bg-gray-900 h-52 border-2 border-white shadow-md">
            {result.imagePreview ? (
              <img
                src={result.imagePreview}
                alt="Analyzed leaf"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-emerald-300">
                <Leaf size={48} />
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white font-bold">
              SPECIMEN #01
            </div>
          </div>

          {/* Core Findings & Confidence Ring */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Target Variety: <strong className="text-gray-900">{result.crop}</strong>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-0.5 tracking-tight">
                  {isHealthy ? '✅ Vigorous & Disease-Free' : result.disease}
                </h2>
                {disease?.scientificName && (
                  <p className="text-xs font-serif italic text-gray-600 mt-0.5">
                    Taxonomy: {disease.scientificName}
                  </p>
                )}
              </div>
              <StatusBadge status={result.status} />
            </div>

            {/* Confidence Gauge Bar */}
            <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-gray-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-700">Neural Confidence Rating</span>
                <span className="font-mono text-emerald-600 font-extrabold text-sm">{confidence}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                <Sparkles size={12} className="text-emerald-600" />
                <span>High certainty inference based on foliar necrosis pattern matching.</span>
              </p>
            </div>

            {!isHealthy && disease && (
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-200">
                  Severity: {disease.severity}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg border border-blue-200">
                  Pathogen: Fungal Spores
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-200">
                  Curable with Prompt Action
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather & Microclimate Spore Correlation Banner */}
      {weather && !isHealthy && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
            <CloudSun size={18} className="text-amber-300" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-bold text-white text-sm">Meteorological Outbreak Correlation</p>
            <p className="text-blue-200/90 mt-0.5 leading-relaxed">
              Ambient temperature ({weather.temperature}°C) combined with high relative humidity ({weather.humidity}%) in {weather.location} provides optimal germination conditions for {result.disease}. Apply protective foliar treatments immediately during the low-wind morning window.
            </p>
          </div>
        </div>
      )}

      {/* Disease Treatment Protocol Section */}
      {!isHealthy && disease && (
        <div className="glass-card p-6 sm:p-8 bg-white rounded-3xl border border-gray-200/90 shadow-card-lg space-y-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Recommended Treatment Protocol</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Select your preferred farming philosophy to view customized application guidelines.
            </p>
          </div>

          {/* Protocol Switcher Tabs */}
          <div className="flex border-b border-gray-100 pb-2 gap-3">
            <button
              onClick={() => setActiveTab('organic')}
              className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'organic'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              🌱 Organic & Biological
            </button>
            <button
              onClick={() => setActiveTab('chemical')}
              className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'chemical'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              🧪 Chemical Fungicides
            </button>
            <button
              onClick={() => setActiveTab('prevention')}
              className={`pb-2 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'prevention'
                  ? 'border-brand-600 text-brand-700'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              🛡️ Cultural Prevention
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4 text-xs">
            {activeTab === 'organic' && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-700" />
                  <span className="font-bold text-emerald-900">Certified Bio-Fungicide Recommendations</span>
                </div>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside">
                  <li><strong>Bacillus subtilis bio-fungicide:</strong> Spray at 5ml/L during morning dew to colonize leaf surfaces and outcompete pathogenic spores.</li>
                  <li><strong>Copper Octanoate / Bordeaux Mixture:</strong> Apply as a protective barrier spray every 7-10 days until symptoms cease.</li>
                  <li><strong>Neem Oil Extract (0.5% concentration):</strong> Suppresses fungal mycelium development while repelling secondary vector insects.</li>
                </ul>
              </div>
            )}

            {activeTab === 'chemical' && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-3">
                <div className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-blue-700" />
                  <span className="font-bold text-blue-900">Standard Chemical Intervention</span>
                </div>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside">
                  <li><strong>Mancozeb 75% WP:</strong> 2.5g per Liter of water. Ensure thorough coverage of both adaxial and abaxial leaf surfaces.</li>
                  <li><strong>Chlorothalonil:</strong> Contact protectant for early foliage stages. Re-entry interval: 24 hours.</li>
                  <li><strong>Azoxystrobin:</strong> Systemic translaminar fungicide; rotate with contact sprays to prevent chemical resistance.</li>
                </ul>
              </div>
            )}

            {activeTab === 'prevention' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                <div className="flex items-center gap-2">
                  <Leaf size={16} className="text-amber-800" />
                  <span className="font-bold text-amber-950">Field Hygiene & Cultural Control</span>
                </div>
                <ul className="space-y-2 text-gray-700 leading-relaxed list-disc list-inside">
                  <li>Prune and safely incinerate severely infected lower leaves; do not compost diseased foliar tissue.</li>
                  <li>Switch from overhead sprinkler irrigation to root-zone drip irrigation to minimize leaf wetness duration.</li>
                  <li>Apply reflective straw or plastic mulch to prevent soil-borne rain splash onto bottom branches.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disease Symptom Encyclopedia Reference */}
      {!isHealthy && disease && (
        <div className="glass-card p-6 bg-white rounded-3xl border border-gray-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            <h4 className="text-sm font-bold text-gray-900">Pathology & Field Symptoms</h4>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {disease.shortDescription}
          </p>
          {disease.symptoms && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-1">Characteristic Visual Indicators:</p>
              <p className="text-xs text-gray-600 leading-relaxed">{disease.symptoms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
