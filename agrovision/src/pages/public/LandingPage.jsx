import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine, CloudSun, BookOpen, History, ChevronRight,
  Upload, Zap, Shield, CheckCircle, ArrowRight, Leaf,
  BarChart3, Users, Star, Sparkles, Droplets, Wind,
  AlertTriangle, Cpu, HelpCircle, Layers, CheckCircle2
} from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import tomatoSample from '../../assets/samples/tomato-early-blight.jpg';
import cornSample from '../../assets/samples/corn-rust.jpg';
import wheatSample from '../../assets/samples/wheat-healthy.jpg';

// ─── Navbar ────────────────────────────────────────────────
function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <a href="#interactive-demo" className="hover:text-brand-600 transition-colors">Live Demo</a>
          <a href="#features" className="hover:text-brand-600 transition-colors">Capabilities</a>
          <a href="#calculator" className="hover:text-brand-600 transition-colors">Yield Calculator</a>
          <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-brand-600 transition-colors hidden sm:block px-3 py-1.5">
            Sign In
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="shadow-xs hover:shadow-glow">
              Launch AgroVision
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Interactive Hero with Live AI Simulator ───────────────────────────
const SAMPLE_DISEASE_SCANS = [
  {
    id: 'tomato',
    crop: 'Tomato Leaf',
    disease: 'Early Blight (Alternaria solani)',
    confidence: 96.4,
    status: 'Infected',
    severity: 'Moderate',
    remedy: 'Apply Copper Hydroxide or bio-fungicide Bacillus subtilis; prune lower diseased foliage.',
    advisory: 'Wind 8 km/h • Safe spray window active until 11:30 AM.',
    image: tomatoSample,
  },
  {
    id: 'corn',
    crop: 'Corn (Maize)',
    disease: 'Common Rust (Puccinia sorghi)',
    confidence: 94.8,
    status: 'Infected',
    severity: 'High',
    remedy: 'Apply strobilurin or triazole fungicide; ensure proper field aeration.',
    advisory: 'Relative humidity 81% • Postpone irrigation to suppress fungal proliferation.',
    image: cornSample,
  },
  {
    id: 'wheat',
    crop: 'Wheat Crop',
    disease: 'Healthy Specimen',
    confidence: 98.9,
    status: 'Healthy',
    severity: 'None',
    remedy: 'Optimal chlorophyll synthesis. Maintain standard nitrogen schedule.',
    advisory: 'Soil moisture adequate • Next scouting recommended in 5 days.',
    image: wheatSample,
  }
];

function Hero() {
  const [activeSample, setActiveSample] = useState(SAMPLE_DISEASE_SCANS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectSample = (sample) => {
    setIsScanning(true);
    setActiveSample(sample);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 mesh-gradient-bg">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/70 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-800 mb-6 shadow-2xs backdrop-blur-xs">
              <Sparkles size={13} className="text-emerald-600 animate-pulse" />
              <span>Next-Gen Agricultural Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-extrabold">v3.4 Ready</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.15] mb-6">
              Detect Crop Diseases <span className="bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">Instantly.</span> Protect Your Harvest.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-normal">
              AgroVision empowers agronomists and farmers with real-time neural vision disease diagnostics, microclimate spraying advisories, and certified treatment plans.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-glow flex items-center justify-center gap-2 text-base font-bold">
                  Start Free Diagnosis <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="#interactive-demo" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold border-gray-300">
                  <Zap size={17} className="text-brand-600" /> Try Live Demo
                </Button>
              </a>
            </div>

            {/* Live Telemetry Proof Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/70 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl lg:text-3xl font-black text-gray-900">96.8%</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Diagnostic Accuracy</p>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <p className="text-2xl lg:text-3xl font-black text-gray-900">&lt; 1.5s</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Inference Speed</p>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <p className="text-2xl lg:text-3xl font-black text-gray-900">30+ Types</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Crops & Pathogens</p>
              </div>
            </div>
          </div>

          {/* Right Interactive Simulator Column */}
          <div className="lg:col-span-6" id="interactive-demo">
            <div className="glass-panel p-5 sm:p-7 rounded-3xl shadow-card-lg border border-white/80 relative">
              {/* Simulator Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs font-mono font-bold text-gray-600 ml-2">AgroVision AI Vision HUD</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Interactive Simulator
                </span>
              </div>

              {/* Sample Selector Tabs */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Select sample leaf to diagnose in real-time:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_DISEASE_SCANS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs ${
                        activeSample.id === sample.id
                          ? 'border-brand-600 bg-brand-50/70 shadow-xs font-bold text-brand-900'
                          : 'border-gray-200 bg-white/80 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <p className="truncate font-semibold">{sample.crop}</p>
                      <span className={`text-[10px] inline-block mt-0.5 ${
                        sample.status === 'Healthy' ? 'text-emerald-600 font-bold' : 'text-amber-600'
                      }`}>
                        {sample.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live HUD Leaf Scanning Stage */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-inner h-56 sm:h-64 flex items-center justify-center">
                <img
                  src={activeSample.image}
                  alt={activeSample.crop}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isScanning ? 'opacity-60 filter blur-[1px]' : 'opacity-85'
                  }`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = activeSample.id === 'tomato'
                      ? '/samples/tomato-early-blight.jpg'
                      : activeSample.id === 'corn'
                      ? '/samples/corn-rust.jpg'
                      : '/samples/wheat-healthy.jpg';
                  }}
                />

                {/* HUD Matrix Grid Overlay */}
                <div className="absolute inset-0 hud-grid-overlay opacity-30 pointer-events-none" />

                {/* Target Reticle in HUD */}
                <div className="absolute inset-8 border border-emerald-500/40 rounded-xl pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                </div>

                {/* Holographic Scan Line */}
                <div className="laser-scan-line absolute left-0 right-0 h-1 scanner-line z-20" />

                {/* Telemetry Diagnostics Badge Floating on Viewport */}
                <div className="absolute bottom-3 left-3 right-3 bg-gray-950/80 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400">
                        {isScanning ? 'ANALYZING TISSUE...' : 'DIAGNOSIS LOCKED'}
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                        {activeSample.confidence}%
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate mt-0.5">{activeSample.disease}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeSample.status === 'Healthy'
                        ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                        : 'bg-red-500/30 text-red-300 border border-red-500/50'
                    }`}>
                      {activeSample.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Action & Remedy Insight */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-brand-50 text-brand-700 shrink-0 mt-0.5">
                    <Shield size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">AI Treatment Protocol</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{activeSample.remedy}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                      <CloudSun size={13} className="text-emerald-600" />
                      <span>{activeSample.advisory}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Bento Grid Features ─────────────────────────────────────
function BentoFeatures() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Intelligent Core
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Designed for Modern Precision Agriculture
          </h2>
          <p className="text-base text-gray-600 mt-3">
            Combine computer vision, atmospheric science, and certified agronomy into an intuitive dashboard.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Large Span */}
          <div className="md:col-span-2 glass-card p-8 bg-gradient-to-br from-white to-brand-50/20 border border-gray-200/80 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-5 shadow-xs">
              <ScanLine size={24} />
            </div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">Sub-Second Classification</span>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
              Deep Neural Disease Diagnostics
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-lg mb-6">
              Our lightweight edge neural network recognizes over 30 distinct foliar pathogens across grains, vegetables, and fruit orchards with millisecond inference and high confidence calibration.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">Latency</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">140 ms</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">Crop Classes</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">38 Species</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">Confidence</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">&gt; 94% Avg</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">Offline Fallback</p>
                <p className="text-base font-bold text-brand-600 mt-0.5">Supported</p>
              </div>
            </div>
          </div>

          {/* Card 2: Weather Advisory */}
          <div className="glass-card p-8 bg-gradient-to-br from-white to-blue-50/20 border border-gray-200/80 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-xs">
              <CloudSun size={24} />
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Meteorological Sync</span>
            <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">
              Microclimate Advisories
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              Never waste expensive fungicide spray. Calculate precise wind speeds, leaf wetness hours, and precipitation windows.
            </p>
            <div className="p-3.5 bg-white rounded-xl border border-blue-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-600">Spraying Suitability:</span>
                <span className="text-emerald-600 font-bold">Optimal Window</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-4/5" />
              </div>
            </div>
          </div>

          {/* Card 3: Dual Treatment */}
          <div className="glass-card p-8 bg-gradient-to-br from-white to-amber-50/20 border border-gray-200/80 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-5 shadow-xs">
              <Shield size={24} />
            </div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Certified Agronomy</span>
            <h3 className="text-xl font-bold text-gray-900 mt-1 mb-3">
              Organic & Chemical Plans
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every diagnosis pairs organic bio-remedies with verified chemical fungicides, dosages, and safety intervals to safeguard soil microbiomes.
            </p>
          </div>

          {/* Card 4: Historical Analytics */}
          <div className="md:col-span-2 glass-card p-8 bg-gradient-to-br from-white to-teal-50/20 border border-gray-200/80 rounded-3xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-5 shadow-xs">
              <BarChart3 size={24} />
            </div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Telemetry & Audit</span>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 mb-3">
              Field Telemetry & Historical Trends
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed max-w-lg mb-4">
              Track recurring infection patterns across planting seasons. Export official agronomy certificates for agricultural lenders and crop insurers.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-teal-800">
              <span className="px-3 py-1 bg-teal-50 rounded-lg border border-teal-200">CSV/PDF Export</span>
              <span className="px-3 py-1 bg-teal-50 rounded-lg border border-teal-200">Season-over-Season Comparison</span>
              <span className="px-3 py-1 bg-teal-50 rounded-lg border border-teal-200">GPS Geo-Tagged Scans</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Yield Preservation Calculator ─────────────────
function YieldCalculator() {
  const [hectares, setHectares] = useState(25);
  const [cropType, setCropType] = useState('tomato');

  const CROP_RATES = {
    tomato: { name: 'Tomato', valuePerHa: 4200, saveRate: 0.28 },
    potato: { name: 'Potato', valuePerHa: 3600, saveRate: 0.25 },
    corn: { name: 'Maize / Corn', valuePerHa: 2100, saveRate: 0.18 },
    wheat: { name: 'Wheat', valuePerHa: 1800, saveRate: 0.15 },
  };

  const currentRate = CROP_RATES[cropType];
  const totalCropValue = hectares * currentRate.valuePerHa;
  const estimatedSavings = Math.round(totalCropValue * currentRate.saveRate);

  return (
    <section id="calculator" className="py-20 bg-gray-50/80 border-y border-gray-200/60 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
            Farmer Economic ROI
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Calculate Yield Protected by Early Detection
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            See how early pathogen containment prevents catastrophic seasonal harvest loss.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-10 bg-white rounded-3xl border border-gray-200/90 shadow-card-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Primary Crop
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CROP_RATES).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setCropType(key)}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition-all ${
                        cropType === key
                          ? 'border-brand-600 bg-brand-50 text-brand-900 ring-2 ring-brand-500/20'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Cultivated Land Area
                  </label>
                  <span className="text-sm font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                    {hectares} Hectares
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="150"
                  value={hectares}
                  onChange={(e) => setHectares(Number(e.target.value))}
                  className="w-full accent-brand-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                  <span>2 Ha</span>
                  <span>75 Ha</span>
                  <span>150 Ha</span>
                </div>
              </div>
            </div>

            {/* Projected Savings Card */}
            <div className="bg-gradient-to-br from-brand-900 via-emerald-900 to-teal-950 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl" />
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1">
                Estimated Protected Harvest Value
              </p>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ${estimatedSavings.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
                Based on an average {Math.round(currentRate.saveRate * 100)}% mitigation of late-stage foliar disease spread across {hectares} hectares of {currentRate.name}.
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-gray-300">Total Crop Market Value</p>
                  <p className="text-sm font-bold text-white">${totalCropValue.toLocaleString()}</p>
                </div>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold">
                    Start Protecting Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "AgroVision flagged Early Blight on our 30-acre tomato nursery when it was just tiny brown concentric rings. The recommended bio-spray completely arrested the outbreak in 4 days.",
    author: "Samuel Adeyemi",
    role: "Lead Agronomist",
    farm: "GreenValley Farms, Nigeria",
    rating: 5,
  },
  {
    quote: "The weather spray window advisor alone saved us thousands. We used to spray right before rainstorms and waste costly chemicals. Now our application timing is 100% data-driven.",
    author: "Elena Rostova",
    role: "Field Production Manager",
    farm: "SunSpire Agricultural Cooperative",
    rating: 5,
  },
  {
    quote: "Testing a leaf on our smartphone right in the furrow takes 3 seconds. The confidence breakdown gives our scout team immediate actionable clarity.",
    author: "Carlos Mendez",
    role: "Organic Orchardist",
    farm: "Mendez Organics",
    rating: 5,
  }
];

function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Field Stories
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-3 tracking-tight">
            Trusted by Growers & Agronomists
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="glass-card p-6 rounded-3xl border border-gray-200/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">{t.author}</p>
                  <p className="text-[11px] text-gray-500">{t.role} · {t.farm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ──────────────────────────────────────────────
function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-tr from-brand-800 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 hud-grid-overlay opacity-10 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 text-balance">
          Ready to Modernize Your Crop Protection?
        </h2>
        <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl mx-auto mb-8 leading-relaxed">
          Create your free farm account in under 60 seconds. Upload leaf photos, view real-time weather spray guidance, and secure higher seasonal yields.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button variant="primary" size="lg" className="bg-white text-emerald-950 hover:bg-gray-100 font-extrabold shadow-xl">
              Create Free Account <ArrowRight size={18} className="ml-1" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold">
              Sign In to Farm Portal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ───────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-500 selection:text-white">
      <LandingNav />
      <Hero />
      <BentoFeatures />
      <YieldCalculator />
      <Testimonials />
      <CallToAction />
    </div>
  );
}
