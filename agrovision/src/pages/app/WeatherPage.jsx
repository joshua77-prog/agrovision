import { useState, useEffect } from 'react';
import {
  MapPin, Thermometer, Droplets, Umbrella, Wind,
  Sun, Cloud, CloudRain, CloudLightning, Search, RefreshCw,
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Clock
} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import AdvisoryCard from '../../components/ui/AdvisoryCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { getCurrentWeather, getWeatherForecast, getFarmingAdvisories } from '../../services/weatherService';
import { cn } from '../../utils/helpers';

const WeatherIconMap = { 
  sun: Sun, 
  cloud: Cloud, 
  'cloud-rain': CloudRain, 
  'cloud-lightning': CloudLightning 
};

function ForecastDay({ day }) {
  const Icon = WeatherIconMap[day.icon] || Sun;
  return (
    <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-brand-300 hover:bg-brand-50/30 transition-all flex-1 min-w-[85px]">
      <p className="text-xs font-bold text-gray-700">{day.day}</p>
      <div className="p-2 rounded-xl bg-white shadow-2xs">
        <Icon size={22} className={cn(
          day.icon === 'sun' && 'text-amber-500',
          day.icon === 'cloud' && 'text-gray-400',
          day.icon === 'cloud-rain' && 'text-blue-500',
          day.icon === 'cloud-lightning' && 'text-purple-500',
        )} />
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-gray-900">{day.high}°</p>
        <p className="text-xs text-gray-400">{day.low}°</p>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold bg-blue-50/80 px-2 py-0.5 rounded-md">
        <Umbrella size={11} />
        <span>{day.rainChance}%</span>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [location, setLocation] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (loc = '') => {
    setLoading(true);
    try {
      const [w, f, a] = await Promise.all([
        getCurrentWeather(loc),
        getWeatherForecast(loc),
        getFarmingAdvisories(),
      ]);
      setWeather(w);
      setForecast(f);
      setAdvisories(a);
      setLocation(w.location);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) fetchData(searchValue.trim());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(location);
  };

  if (loading && !refreshing) return <PageLoader message="Fetching satellite meteorological data..." />;

  // Farm Activity Matrix
  const ACTIVITIES = [
    {
      name: 'Foliar Spraying',
      status: 'Optimal Window',
      detail: 'Wind < 10 km/h until 11:30 AM. Perfect adhesion conditions.',
      color: 'emerald',
      icon: ShieldCheck,
    },
    {
      name: 'Field Irrigation',
      status: 'Postpone Recommended',
      detail: '80% rain forecast within 24h. Save water and prevent waterlogging.',
      color: 'amber',
      icon: AlertTriangle,
    },
    {
      name: 'Soil Tillage',
      status: 'Favorable',
      detail: 'Topsoil moisture level ideal for bed preparation.',
      color: 'emerald',
      icon: CheckCircle2,
    },
    {
      name: 'Harvesting',
      status: 'Fair Window',
      detail: 'High midday humidity. Conclude grain harvest before 2:00 PM.',
      color: 'blue',
      icon: Clock,
    }
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
            Microclimate Radar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Agricultural Weather Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Synchronized with regional sensors for actionable spray windows and pest alerts.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>Sync Radar</span>
        </Button>
      </div>

      {/* Location Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search farm coordinates or city (e.g., Edo State, Nairobi, Kaduna)..."
            className="input pl-10 text-xs font-semibold rounded-2xl border-gray-200 bg-white"
          />
        </div>
        <Button type="submit" variant="primary" size="sm" className="rounded-2xl px-5 font-bold">
          Search
        </Button>
      </form>

      {/* Hero Weather Card */}
      {weather && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-950 text-white shadow-card-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-2">
                <MapPin size={14} />
                <span>{weather.location}</span>
                <span className="text-blue-400">• Current Field Telemetry</span>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl sm:text-6xl font-black tracking-tight">{weather.temperature}°C</p>
                <span className="text-lg font-bold text-blue-200">{weather.condition}</span>
              </div>
              <p className="text-xs text-gray-300 mt-2">
                Feels like {weather.temperature + 2}°C • High spore dispersal threshold alert
              </p>
            </div>

            {/* Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Droplets size={14} className="text-blue-300" />
                  <span>Humidity</span>
                </div>
                <p className="text-lg font-extrabold text-white">{weather.humidity}%</p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Wind size={14} className="text-teal-300" />
                  <span>Wind Speed</span>
                </div>
                <p className="text-lg font-extrabold text-white">{weather.windSpeed}</p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Umbrella size={14} className="text-indigo-300" />
                  <span>Rain Chance</span>
                </div>
                <p className="text-lg font-extrabold text-white">{weather.rainChance || '15%'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Precision Forecast */}
      <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
        <h3 className="text-base font-bold text-gray-900 mb-4">7-Day Meteorological Outlook</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {forecast.map((day, idx) => (
            <ForecastDay key={idx} day={day} />
          ))}
        </div>
      </div>

      {/* Agricultural Operations Suitability Matrix */}
      <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-brand-600" />
          <h3 className="text-base font-bold text-gray-900">Farm Activity Suitability Matrix</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ACTIVITIES.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  act.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                  act.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">{act.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      act.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                      act.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{act.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advisory Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">Active Crop Health Advisories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advisories.map((advisory) => (
            <AdvisoryCard key={advisory.id} advisory={advisory} />
          ))}
        </div>
      </div>
    </div>
  );
}
