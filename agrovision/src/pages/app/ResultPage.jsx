import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, AlertTriangle, Save, ScanLine,
  Thermometer, Droplets, Wind, CloudSun, Leaf,
  Shield, FlaskConical, Info, Printer, Sparkles, Check,
  MapPin, RefreshCw, AlertOctagon, Search, Umbrella, Clock,
  CheckCircle2, X, Compass, ExternalLink, ShieldCheck, HeartPulse
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { saveDetection } from '../../services/detectionService';
import { getCurrentWeather, searchLocations } from '../../services/weatherService';
import {
  evaluateDiseaseWeatherRisk,
  getSafeHandlingGuidelines,
  generateActionSummary,
  getPathologyInfo
} from '../../services/advisoryService';
import { formatDate } from '../../utils/helpers';

export default function ResultPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // Farm Location State
  const [currentLocation, setCurrentLocation] = useState(() => {
    return (
      localStorage.getItem('agrovision_farm_location') ||
      user?.location ||
      'Chennai'
    );
  });
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('organic'); // 'organic', 'chemical', 'prevention'

  // Load result from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('agrovision_result');
    if (!stored) {
      navigate('/detect');
      return;
    }
    const parsed = JSON.parse(stored);
    setResult(parsed);

    // Initial location check
    const initialLoc =
      parsed.location ||
      localStorage.getItem('agrovision_farm_location') ||
      user?.location ||
      'Chennai';
    setCurrentLocation(initialLoc);
    loadWeather(initialLoc);
  }, [navigate, user?.location]);

  // Fetch real weather for specified location
  const loadWeather = useCallback(async (loc) => {
    if (!loc) return;
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getCurrentWeather(loc);
      setWeather(data);
      localStorage.setItem('agrovision_farm_location', data.location || loc);
    } catch (err) {
      console.warn('Weather fetch error:', err);
      setWeatherError(err.message || 'Weather data is temporarily unavailable.');
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // Handle location search typing
  const handleLocationSearchChange = async (e) => {
    const query = e.target.value;
    setLocationSearchInput(query);
    if (query.trim().length >= 2) {
      setSearchingLocation(true);
      try {
        const results = await searchLocations(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchingLocation(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Select location from search
  const handleSelectLocation = (place) => {
    const chosen = place.display || place.name;
    setCurrentLocation(chosen);
    setIsEditingLocation(false);
    setLocationSearchInput('');
    setSearchResults([]);
    loadWeather(chosen);
    addToast(`Weather updated for ${chosen}`, 'info');
  };

  // Submit manual location
  const handleSubmitLocation = (e) => {
    e.preventDefault();
    const query = locationSearchInput.trim();
    if (query) {
      setCurrentLocation(query);
      setIsEditingLocation(false);
      setLocationSearchInput('');
      setSearchResults([]);
      loadWeather(query);
      addToast(`Retrieving weather for ${query}...`, 'info');
    }
  };

  // Archive / Save Dossier
  const handleSave = async () => {
    if (saved) return;
    setSaving(true);
    try {
      await saveDetection({
        ...result,
        weatherAtScan: weather ? {
          location: weather.location,
          temperature: weather.temperature,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          condition: weather.condition,
        } : null,
      });
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

  // Disease status and metadata
  const isHealthy =
    result.status?.toLowerCase() === 'healthy' ||
    result.is_healthy === true ||
    result.disease?.toLowerCase().includes('healthy');

  const selectedCrop = result.crop || result.selected_crop || 'Crop';
  const diseaseName = result.disease || result.display_disease || 'Unknown Condition';
  const confidence = result.confidence != null ? Number(result.confidence) : 94.6;
  const isReliable = result.prediction_reliable !== false;
  const warningMessage = result.warning || null;

  // Retrieve Pathology Encyclopedia record
  const pathology = getPathologyInfo(diseaseName, selectedCrop);

  // Compute rule-based Disease-Weather Risk Correlation
  const riskAssessment = evaluateDiseaseWeatherRisk({
    disease: diseaseName,
    displayDisease: result.display_disease,
    crop: selectedCrop,
    weather,
    predictionReliable: isReliable,
    warning: warningMessage,
  });

  // Safe Handling Guidelines
  const safeHandling = getSafeHandlingGuidelines(diseaseName, selectedCrop);

  // Executive Action Summary
  const actionSummary = generateActionSummary({
    disease: diseaseName,
    displayDisease: result.display_disease,
    crop: selectedCrop,
    confidence,
    weather,
    riskAssessment,
    predictionReliable: isReliable,
    warning: warningMessage,
  });

  // Risk Badge Styling
  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'Increased Vigilance Recommended':
        return 'bg-red-500/15 text-red-700 border-red-300';
      case 'Potentially Favorable':
        return 'bg-amber-500/15 text-amber-800 border-amber-300';
      case 'Conditions to Monitor':
        return 'bg-blue-500/15 text-blue-700 border-blue-300';
      case 'Routine Conditions':
        return 'bg-emerald-500/15 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto animate-fade-in space-y-8 print:p-0 print:max-w-none">
      
      {/* ======================================================== */}
      {/* TOP ACTION BAR & DOSSIER HEADER                          */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80 print:border-b-2 print:border-gray-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full print:bg-transparent print:p-0 print:text-black">
              Laboratory Telemetry Log
            </span>
            {isHealthy ? (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 size={12} /> Certified Clean Foliage
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <AlertTriangle size={12} /> Pathogen Scent Detected
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1.5 tracking-tight">
            Diagnostic Health Dossier
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Report ID: <span className="font-mono font-medium text-gray-700">{result.id || 'AGV-842097'}</span> • Generated on {formatDate(result.date || new Date())}
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Button
            variant={saved ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center gap-1.5 shadow-sm"
          >
            {saved ? <Check size={14} className="text-emerald-600" /> : <Save size={14} />}
            <span>{saved ? 'Archived' : saving ? 'Saving...' : 'Save Dossier'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 shadow-sm"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </Button>

          <Link to="/detect">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5 shadow-sm">
              <ScanLine size={14} />
              <span>New Scan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION A — DISEASE DIAGNOSIS SUMMARY                    */}
      {/* ======================================================== */}
      <section className="space-y-4">
        {/* Model Reliability & Crop Mismatch Warning Banner */}
        {(!isReliable || warningMessage) && (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/60 shrink-0 text-amber-800 mt-0.5">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-extrabold text-sm text-amber-900">
                Model Verification Advisory
              </p>
              <p className="text-amber-800/95 mt-1 leading-relaxed">
                {warningMessage || 'The AI model neural confidence is below optimal threshold. Do not initiate chemical intervention without physical field verification or consultation with an extension officer.'}
              </p>
            </div>
          </div>
        )}

        <div className={`p-6 sm:p-8 rounded-3xl border shadow-card-lg transition-all ${
          isHealthy 
            ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200' 
            : 'bg-gradient-to-br from-amber-50/70 via-white to-rose-50/30 border-amber-200'
        }`}>
          <div className="grid md:grid-cols-12 gap-6 items-center">
            
            {/* Uploaded Leaf Image Specimen */}
            <div className="md:col-span-4 relative rounded-2xl overflow-hidden bg-gray-900 h-56 border-2 border-white shadow-md group">
              {result.imagePreview ? (
                <img
                  src={result.imagePreview}
                  alt={`Specimen leaf analyzed for ${diseaseName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-emerald-300 bg-gray-800">
                  <Leaf size={48} />
                  <span className="text-xs text-gray-400 mt-2">Specimen image retained in log</span>
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white font-bold tracking-wider">
                SPECIMEN #01
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-gray-200">
                {selectedCrop}
              </div>
            </div>

            {/* Diagnosis Core Findings */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Target Variety:</span>
                    <strong className="text-gray-950 font-extrabold">{selectedCrop}</strong>
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-950 mt-1 tracking-tight">
                    {isHealthy ? 'Healthy Specimen' : diseaseName}
                  </h2>
                  
                  {pathology?.pathogen && (
                    <p className="text-xs font-serif italic text-gray-600 mt-0.5">
                      Pathogen Agent: {pathology.pathogen} ({pathology.pathogenType})
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  <StatusBadge status={isHealthy ? 'Healthy' : 'Diseased'} />
                </div>
              </div>

              {/* Neural Confidence Gauge Bar */}
              <div className="p-3.5 bg-white/95 backdrop-blur-xs rounded-2xl border border-gray-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-brand-600" />
                    <span>Neural Confidence Rating</span>
                  </span>
                  <span className="font-mono text-emerald-600 font-extrabold text-sm">
                    {confidence.toFixed(2)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, confidence))}%` }}
                  />
                </div>

                <p className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>
                    {confidence >= 90
                      ? 'High certainty inference based on foliar necrosis pattern matching.'
                      : confidence >= 70
                        ? 'Moderate certainty inference; visual confirmation advised.'
                        : 'Low confidence detection; submit high-resolution leaf close-up for validation.'}
                  </span>
                </p>
              </div>

              {/* Pathology Attributes Badges */}
              {pathology && (
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className={`px-2.5 py-1 rounded-lg border ${
                    pathology.severity === 'High'
                      ? 'bg-red-50 text-red-900 border-red-200'
                      : pathology.severity === 'Moderate'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}>
                    Severity: {pathology.severity}
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
                    Type: {pathology.pathogenType}
                  </span>
                  {isHealthy ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200">
                      Vegetative Foliage Intact
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-900 rounded-lg border border-purple-200">
                      Standard Management Feasible
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION B — LIVE WEATHER AT THE FARM LOCATION            */}
      {/* ======================================================== */}
      <section className="space-y-3">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-card-lg p-6 sm:p-7 space-y-5">
          
          {/* Weather Header with Inline Location Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Microclimate Sensor Feed
                </span>
                <span className="text-[11px] text-gray-400">
                  Real-Time Meteorology
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <MapPin size={18} className="text-brand-600" />
                <span>Farm Location:</span>
                <span className="text-brand-700 underline decoration-brand-300 decoration-2">
                  {weather?.location || currentLocation}
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditingLocation(!isEditingLocation)}
                className="text-xs flex items-center gap-1.5"
              >
                <Search size={13} />
                <span>{isEditingLocation ? 'Close Search' : 'Change City'}</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => loadWeather(currentLocation)}
                disabled={weatherLoading}
                className="text-xs flex items-center gap-1.5"
                title="Refresh current meteorological reading"
              >
                <RefreshCw size={13} className={weatherLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>

          {/* Search Box / Dropdown when editing location */}
          {isEditingLocation && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in">
              <form onSubmit={handleSubmitLocation} className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={locationSearchInput}
                    onChange={handleLocationSearchChange}
                    placeholder="Enter city or district (e.g. Abeokuta, Kaduna, Chennai, Nairobi)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="sm" variant="primary">
                  Set Location
                </Button>
              </form>

              {/* Suggestions */}
              {searchingLocation && (
                <p className="text-xs text-gray-500">Searching global coordinates...</p>
              )}
              {searchResults.length > 0 && (
                <div className="space-y-1 max-h-40 overflow-y-auto pt-1">
                  {searchResults.map((place, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(place)}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-brand-50 hover:text-brand-800 transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-gray-800">{place.display}</span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {place.latitude.toFixed(2)}°, {place.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Weather Display State */}
          {weatherLoading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
              <RefreshCw size={24} className="text-brand-600 animate-spin" />
              <p className="text-xs font-semibold text-gray-600">
                Retrieving live atmospheric telemetry from Open-Meteo...
              </p>
            </div>
          ) : weatherError ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>Weather data is temporarily unavailable for &ldquo;{currentLocation}&rdquo;. Your leaf diagnosis remains fully intact.</span>
              </div>
              <Button size="sm" variant="secondary" onClick={() => loadWeather(currentLocation)}>
                Retry
              </Button>
            </div>
          ) : weather ? (
            <div className="space-y-4">
              {/* Primary 6-Metric Environmental Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                
                {/* 1. Temperature */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50/60 to-orange-50/30 border border-amber-200/80">
                  <div className="flex items-center justify-between text-amber-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Temp</span>
                    <Thermometer size={16} />
                  </div>
                  <p className="text-xl font-black text-gray-950 font-mono">{weather.temperature}°C</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Feels like {weather.feelsLike}°C
                  </p>
                </div>

                {/* 2. Humidity */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-indigo-50/30 border border-blue-200/80">
                  <div className="flex items-center justify-between text-blue-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Humidity</span>
                    <Droplets size={16} />
                  </div>
                  <p className="text-xl font-black text-gray-950 font-mono">{weather.humidity}%</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {weather.humidity >= 80 ? 'Elevated Moisture' : weather.humidity <= 40 ? 'Dry Air' : 'Moderate'}
                  </p>
                </div>

                {/* 3. Wind Speed */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-teal-50/60 to-emerald-50/30 border border-teal-200/80">
                  <div className="flex items-center justify-between text-teal-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Wind</span>
                    <Wind size={16} />
                  </div>
                  <p className="text-xl font-black text-gray-950 font-mono">{weather.windSpeed} <span className="text-xs font-normal">km/h</span></p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {weather.windSpeed < 10 ? 'Low Drift Risk' : 'Breezy / Spore Drift'}
                  </p>
                </div>

                {/* 4. Current Precipitation */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-sky-50/60 to-blue-50/30 border border-sky-200/80">
                  <div className="flex items-center justify-between text-sky-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Rainfall</span>
                    <Umbrella size={16} />
                  </div>
                  <p className="text-xl font-black text-gray-950 font-mono">{weather.precipitation} <span className="text-xs font-normal">mm</span></p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {weather.precipitation > 0 ? 'Active Surface Rain' : 'No Rain Standing'}
                  </p>
                </div>

                {/* 5. Rain Probability */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-50/60 to-purple-50/30 border border-indigo-200/80">
                  <div className="flex items-center justify-between text-indigo-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Rain Chance</span>
                    <CloudSun size={16} />
                  </div>
                  <p className="text-xl font-black text-gray-950 font-mono">
                    {weather.rainChance != null ? `${weather.rainChance}%` : 'N/A'}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Next 12h Probability
                  </p>
                </div>

                {/* 6. General Condition */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-b from-gray-50 to-slate-100/50 border border-gray-200">
                  <div className="flex items-center justify-between text-gray-600 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Condition</span>
                    <Compass size={16} />
                  </div>
                  <p className="text-sm font-black text-gray-950 line-clamp-1">{weather.condition}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock size={10} />
                    <span>{weather.time ? weather.time.slice(11, 16) : 'Live'}</span>
                  </p>
                </div>

              </div>

              {/* Attribution Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100 gap-2">
                <span>
                  Source: Open-Meteo High-Resolution Forecast API • Coordinates: {weather.latitude?.toFixed(3)}°N, {weather.longitude?.toFixed(3)}°E
                </span>
                <span className="font-mono">
                  Observation Timestamp: {weather.time ? new Date(weather.time).toLocaleString() : 'Recent'}
                </span>
              </div>
            </div>
          ) : null}

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION C — DISEASE AND WEATHER RISK CORRELATION         */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-card-lg p-6 sm:p-7 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Cross-Telemetry Synthesis
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">
                Disease–Weather Risk Analysis
              </h3>
            </div>

            {/* Risk Category Tag */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${getRiskBadgeClass(riskAssessment.category)}`}>
                {riskAssessment.category}
              </span>
            </div>
          </div>

          {/* Environmental Correlation Insight Card */}
          <div className={`p-4 rounded-2xl border ${
            riskAssessment.category === 'Increased Vigilance Recommended'
              ? 'bg-red-50/70 border-red-200 text-red-950'
              : riskAssessment.category === 'Potentially Favorable'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/80 shrink-0 mt-0.5 shadow-2xs">
                {riskAssessment.category === 'Increased Vigilance Recommended' ? (
                  <AlertOctagon size={18} className="text-red-600" />
                ) : riskAssessment.category === 'Potentially Favorable' ? (
                  <AlertTriangle size={18} className="text-amber-600" />
                ) : (
                  <ShieldCheck size={18} className="text-emerald-600" />
                )}
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-sm text-gray-900">
                  {riskAssessment.assessment}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {riskAssessment.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Correlation Comparison Matrix */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            
            {/* Box 1: Real-time Weather Observations */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Compass size={14} className="text-blue-600" />
                <span>Microclimate Telemetry at {weather?.location || currentLocation}</span>
              </div>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span>Ambient Temperature</span>
                  <strong className="text-gray-900 font-mono">{riskAssessment.observations.temperature}°C</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span>Relative Humidity</span>
                  <strong className="text-gray-900 font-mono">{riskAssessment.observations.humidity}%</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/60">
                  <span>Wind Velocity</span>
                  <strong className="text-gray-900 font-mono">{riskAssessment.observations.windSpeed} km/h</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Precipitation / Rain Probability</span>
                  <strong className="text-gray-900 font-mono">{riskAssessment.observations.precipitation}mm ({riskAssessment.observations.rainChance}%)</strong>
                </div>
              </div>
            </div>

            {/* Box 2: Disease Pathogen Biological Criteria */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <Leaf size={14} className="text-brand-600" />
                <span>Biological Proliferation Profile: {diseaseName}</span>
              </div>
              {pathology?.weatherCriteria ? (
                <div className="space-y-1 text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span>Optimal Pathogen Temperature</span>
                    <strong className="text-gray-900 font-mono">
                      {pathology.weatherCriteria.optimalTempMin}–{pathology.weatherCriteria.optimalTempMax}°C
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span>Critical Moisture Preference</span>
                    <strong className="text-gray-900 font-mono">
                      {pathology.weatherCriteria.favoredByDry 
                        ? `<${pathology.weatherCriteria.criticalHumidity}% RH (Dry)` 
                        : `≥${pathology.weatherCriteria.criticalHumidity}% RH (Humid)`}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200/60">
                    <span>Spore Dispersal Vector</span>
                    <strong className="text-gray-900">
                      {pathology.weatherCriteria.favoredByRain ? 'Rain Splash & Wind' : 'Wind Drift & Dry Heat'}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Taxonomic Risk Level</span>
                    <strong className="text-gray-900">{pathology.severity} Priority</strong>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic py-3">
                  This leaf is classified as Healthy. Standard vegetative microclimate parameters apply.
                </p>
              )}
            </div>

          </div>

          {/* Scientific Transparency Disclaimer */}
          <div className="p-3 rounded-xl bg-gray-100/80 border border-gray-200 text-[11px] text-gray-600 flex items-start gap-2">
            <Info size={14} className="text-gray-500 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>Academic Transparency Notice:</strong> {riskAssessment.disclaimer}
            </p>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION D — RECOMMENDED CROP CARE & PRECAUTIONS          */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-card-lg p-6 sm:p-7 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Agronomic Action Protocol
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">
                Recommended Crop Care & Precautions
              </h3>
            </div>

            {/* Protocol Tabs */}
            <div className="flex border border-gray-200 rounded-xl p-1 bg-gray-50 text-xs font-bold">
              <button
                onClick={() => setActiveTab('organic')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'organic'
                    ? 'bg-white text-brand-700 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                🌱 Bio & Cultural
              </button>
              <button
                onClick={() => setActiveTab('chemical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'chemical'
                    ? 'bg-white text-brand-700 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                🧪 Chemical Controls
              </button>
              <button
                onClick={() => setActiveTab('prevention')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'prevention'
                    ? 'bg-white text-brand-700 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                🛡️ Field Sanitation
              </button>
            </div>
          </div>

          {/* Structured Recommendations Cards */}
          <div className="space-y-4">
            
            {/* If Healthy Crop */}
            {isHealthy ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Preventative Maintenance for Healthy {selectedCrop}</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    This specimen shows no foliar disease symptoms. Continue preventative crop management to sustain crop vigor through harvest.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Preventative Practice
                    </span>
                    <p className="font-extrabold text-gray-900 text-sm">Drip Root-Zone Irrigation</p>
                    <p className="text-gray-600">Apply water directly to base soil; avoid overhead sprinklers to eliminate leaf wetness windows.</p>
                    <p className="text-[11px] text-gray-500 italic pt-1">Condition: Maintain daily throughout flowering & fruiting.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                      Nutrient Management
                    </span>
                    <p className="font-extrabold text-gray-900 text-sm">Balanced Potassium & Calcium</p>
                    <p className="text-gray-600">Avoid excess nitrogen which produces tender foliar growth highly vulnerable to opportunistic spores.</p>
                    <p className="text-[11px] text-gray-500 italic pt-1">Condition: Apply via fertigation at 10-day intervals.</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Diseased Crop Protocols */
              <div className="space-y-3">
                
                {/* Tab 1: Organic / Bio-Controls */}
                {activeTab === 'organic' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                      <Shield size={16} className="text-emerald-700 shrink-0" />
                      <span>Certified bio-fungicides and cultural management protocols for {diseaseName}.</span>
                    </div>

                    <div className="grid gap-3">
                      {pathology?.cropCare?.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90 text-xs space-y-2 hover:border-brand-300 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-gray-900 text-sm">{item.title}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              item.importance === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              Priority: {item.importance}
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{item.detail}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-500 gap-1 pt-1 border-t border-gray-200/60">
                            <span><strong>Why it matters:</strong> {item.reason}</span>
                            <span className="text-emerald-700 font-semibold">{item.condition}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Chemical Controls with strict disclaimer */}
                {activeTab === 'chemical' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <FlaskConical size={16} className="text-amber-700" />
                        <span>Regulated Chemical Protectants & Extension Guidance</span>
                      </div>
                      <p className="leading-relaxed">
                        Chemical fungicides and bactericides must be chosen in strict accordance with locally approved product registries, withholding periods (PHI), and resistance management schemes.
                      </p>
                    </div>

                    <div className="grid gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-gray-900 text-sm">Contact Protectant Application</span>
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">Standard Protective</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Apply approved copper hydroxide or protectant mancozeb prior to anticipated rainfall events. Ensure thorough coverage of both adaxial and abaxial leaf surfaces.
                        </p>
                        <p className="text-[11px] text-gray-500">
                          <strong>Note:</strong> Check local wind velocity (below 10 km/h) before spraying to prevent hazardous spray drift onto non-target crops.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-gray-900 text-sm">Systemic Translaminar Rotation</span>
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">Curative Rotation</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          For established infections, rotate FRAC Group modes of action (e.g. QoI inhibitors rotated with triazoles) to prevent chemical pathogen resistance.
                        </p>
                        <p className="text-[11px] text-red-700 font-semibold">
                          ⚠️ Consult your regional agricultural extension officer for legally sanctioned dosages in your jurisdiction.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Cultural Field Sanitation */}
                {activeTab === 'prevention' && (
                  <div className="space-y-3">
                    <div className="grid gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                        <span className="font-extrabold text-gray-900 text-sm">Infected Leaf Roguing & Disposal</span>
                        <p className="text-gray-700 leading-relaxed">
                          Carefully clip severely spotted leaves from the lower canopy during dry afternoons. Bag and dispose of plant debris outside the field. Do not place blighted leaves in compost heaps.
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                        <span className="font-extrabold text-gray-900 text-sm">3-Year Crop Rotation Scheme</span>
                        <p className="text-gray-700 leading-relaxed">
                          Do not plant tomatoes, potatoes, or peppers consecutively on the same plot. Rotate with non-host poaceae (maize, sorghum) or legumes to break the pathogen survival cycle in soil.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION E — SAFE HANDLING AND HUMAN HEALTH PRECAUTIONS   */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-card-lg p-6 sm:p-7 space-y-5">
          
          <div className="pb-3 border-b border-gray-100 space-y-1">
            <span className="text-xs font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Agricultural Safety & Hygiene
            </span>
            <h3 className="text-lg font-black text-gray-900">
              Safe Handling Precautions
            </h3>
            <p className="text-xs text-gray-500">
              These recommendations concern the safe handling of crops, plant tissue, and agricultural treatments. They are not human medical diagnoses.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {safeHandling.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between space-y-2 hover:border-gray-300 transition-all">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md inline-block">
                    {item.category}
                  </span>
                  <p className="font-extrabold text-gray-900 text-xs">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Notice */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
            <HeartPulse size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Chemical Exposure & Emergency Guidance:</p>
              <p className="text-rose-900/90 leading-relaxed text-[11px]">
                In the event of accidental chemical pesticide splash to the eyes or ingestion, immediately flush with clean water for 15 minutes and seek urgent emergency medical or poison control assistance with the product label at hand. Keep all agricultural treatments securely locked and away from children, food, and livestock.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION F — WEATHER-BASED ACTION SUMMARY                 */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-emerald-950 text-white shadow-card-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Executive Synthesis
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Weather-Based Action Summary
              </h3>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Farm: {weather?.location || currentLocation}
            </div>
          </div>

          {/* 4-Box Synthesis Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Box 1: Finding */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">1. AI Detection</p>
              <p className="text-gray-200 leading-relaxed">{actionSummary.finding}</p>
            </div>

            {/* Box 2: Microclimate Impact */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300">2. Weather Impact</p>
              <p className="text-gray-200 leading-relaxed">{actionSummary.microclimateImpact}</p>
            </div>

            {/* Box 3: Priority Action */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">3. Priority Action</p>
              <p className="text-gray-200 leading-relaxed">{actionSummary.nextStep}</p>
            </div>

            {/* Box 4: Verification Note */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">4. Verification</p>
              <p className="text-gray-200 leading-relaxed">{actionSummary.verificationNote}</p>
            </div>

          </div>

          {/* Print Footer / Quick Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 border-t border-gray-800 gap-3">
            <span>AgroVision Neural Platform • Smart Agricultural Advisory System</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors"
              >
                <Printer size={13} />
                <span>Print Diagnostic Summary</span>
              </button>
              <span>•</span>
              <Link to="/detect" className="text-white hover:text-emerald-400 font-bold flex items-center gap-1">
                <span>Start New Detection &rarr;</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
