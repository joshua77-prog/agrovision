import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine, CloudSun, Activity, CheckCircle, ArrowRight,
  TrendingUp, Eye, AlertTriangle, Leaf, Sparkles, Droplets,
  Wind, ShieldCheck, Clock, Download, PlusCircle
} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfidenceBar from '../../components/ui/ConfidenceBar';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { getDetectionStats, getDetectionHistory } from '../../services/detectionService';
import { getCurrentWeather, getFarmingAdvisories } from '../../services/weatherService';
import { formatDate, getGreeting } from '../../utils/helpers';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CHART_DATA_7D = [
  { day: 'Mon', healthy: 4, diseased: 1 },
  { day: 'Tue', healthy: 6, diseased: 2 },
  { day: 'Wed', healthy: 5, diseased: 0 },
  { day: 'Thu', healthy: 8, diseased: 3 },
  { day: 'Fri', healthy: 7, diseased: 1 },
  { day: 'Sat', healthy: 9, diseased: 2 },
  { day: 'Sun', healthy: 11, diseased: 1 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [weather, setWeather] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [chartRange, setChartRange] = useState('7d');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, d, w, a] = await Promise.all([
          getDetectionStats(),
          getDetectionHistory(),
          getCurrentWeather(),
          getFarmingAdvisories(),
        ]);
        setStats(s);
        setRecentDetections(d.slice(0, 5));
        setWeather(w);
        setAdvisories(a.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <PageLoader message="Initializing your precision farm telemetry..." />;

  const greeting = getGreeting();

  return (
    <div className="px-4 md:px-8 py-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Dynamic Header & Farm Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-950 via-emerald-950 to-teal-950 p-6 rounded-3xl text-white shadow-card-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Field Telemetry Active
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">• {weather?.location || 'Ovia North-East'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {greeting}, {user?.name?.split(' ')[0] || 'Farmer'} 👋
          </h1>
          <p className="text-xs md:text-sm text-emerald-200/80 mt-1 max-w-xl">
            AI Crop Health Index is currently at <strong className="text-white">92.4% Optimal</strong>. 1 spraying advisory requires attention before 11:30 AM.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/detect">
            <Button variant="primary" size="md" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold shadow-glow border-none flex items-center gap-2">
              <ScanLine size={17} />
              Scan Crop Leaf
            </Button>
          </Link>
          <Link to="/weather" className="hidden sm:block">
            <Button variant="secondary" size="md" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <CloudSun size={17} />
              Advisory Hub
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-card p-4 sm:p-5 bg-white border border-gray-200/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Scans</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-700">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stats?.totalDetections || 12}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} /> +14.2% from last week
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-4 sm:p-5 bg-white border border-gray-200/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Healthy Crop Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-gray-900">
              {stats?.totalDetections ? `${Math.round((stats.healthyCrops / stats.totalDetections) * 100)}%` : '83%'}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck size={12} /> Vigorous vegetative state
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card p-4 sm:p-5 bg-white border border-gray-200/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pathogen Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{stats?.diseasedCrops || 2}</p>
            <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
              Early Blight & Rust monitored
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card p-4 sm:p-5 bg-white border border-gray-200/80 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spray Condition</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CloudSun size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{weather?.temperature || 29}°C</p>
              <span className="text-xs font-semibold text-gray-500 truncate">{weather?.condition || 'Partly Cloudy'}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              ● Safe spray window open
            </p>
          </div>
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Chart & Recent Scans */}
        <div className="lg:col-span-8 space-y-6">
          {/* Outbreak Trend Chart Card */}
          <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Crop Health & Pathogen Activity</h3>
                <p className="text-xs text-gray-500">Scanned specimens breakdown over the last 7 days</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-600 ml-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Diseased
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA_7D} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="diseasedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                    }}
                  />
                  <Area type="monotone" dataKey="healthy" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#healthyGrad)" />
                  <Area type="monotone" dataKey="diseased" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#diseasedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Detections List */}
          <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Recent Foliar Scans</h3>
                <p className="text-xs text-gray-500">Latest diagnoses recorded on your fields</p>
              </div>
              <Link to="/history" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
                Full Log <ArrowRight size={14} />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentDetections.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/80 p-2 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.crop} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-700">
                          <Leaf size={18} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.disease}</p>
                      <p className="text-[11px] text-gray-500">
                        {item.crop} · <span className="text-gray-400">{formatDate(item.date)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-gray-700 hidden sm:inline">
                      {item.confidence}%
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Scanner Trigger & Weather Hub */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Scanner Action Bento */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 text-white shadow-card-lg overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-md group-hover:scale-125 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-4">
                <ScanLine size={20} className="text-white" />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">Instant AI Diagnosis</span>
              <h4 className="text-xl font-black mt-1 mb-2">Notice Spotted Foliage?</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed mb-5">
                Snap a photo or drop a leaf image to trigger instant neural inference and recommended bio-remedies.
              </p>
              <Link to="/detect">
                <Button variant="primary" size="md" className="w-full bg-white text-emerald-950 hover:bg-gray-100 font-extrabold shadow-md border-none">
                  Open Diagnostic Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Microclimate Spray & Weather Widget */}
          <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Spraying & Weather</h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Live Sensor
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/30 border border-blue-100 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-600">Today's Spray Window</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  Optimal
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Low winds (&lt; 10 km/h) & humidity at 72% until 11:30 AM. Favorable for fungicide adhesion.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Wind size={14} className="text-teal-600" />
                  <span>Wind Speed</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{weather?.windSpeed || '8 km/h'}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                  <Droplets size={14} className="text-blue-600" />
                  <span>Humidity</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{weather?.humidity || '72%'}</p>
              </div>
            </div>

            {/* Farm Advisories List */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Field Alerts</p>
              {advisories.map((adv) => (
                <div key={adv.id} className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs">
                  <p className="font-bold text-amber-900">{adv.title}</p>
                  <p className="text-amber-800/80 mt-0.5 text-[11px] leading-tight line-clamp-2">{adv.advice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
