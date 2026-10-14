import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, CloudSun, History, BookOpen,
  User, Settings, LogOut, X, Sparkles, ChevronRight, Droplets, Thermometer
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentWeather } from '../../services/weatherService';
import { cn } from '../../utils/helpers';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { to: '/detect', icon: ScanLine, label: 'Crop Detection', badge: 'AI' },
  { to: '/weather', icon: CloudSun, label: 'Weather & Advisory', badge: null },
  { to: '/history', icon: History, label: 'Detection Logs', badge: null },
  { to: '/diseases', icon: BookOpen, label: 'Disease Database', badge: '30+' },
  { to: '/profile', icon: User, label: 'Farm Profile', badge: null },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getCurrentWeather().then(setWeather).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200/70 flex flex-col z-50',
          'transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {/* Header with Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Logo size="md" linkTo="/dashboard" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Launch Diagnose Card */}
        <div className="p-3.5 pb-1">
          <div 
            onClick={() => { navigate('/detect'); if (onClose) onClose(); }}
            className="relative overflow-hidden group cursor-pointer p-3.5 rounded-2xl bg-gradient-to-br from-brand-600 via-emerald-600 to-teal-700 text-white shadow-md hover:shadow-glow transition-all duration-300 active:scale-98"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-sm group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
                <Sparkles size={11} className="text-amber-300 animate-pulse" />
                Quick Scan
              </span>
              <ScanLine size={16} className="text-white/80 group-hover:rotate-12 transition-transform" />
            </div>
            <p className="text-xs font-semibold text-white mt-1">Diagnose Crop Leaf</p>
            <p className="text-[10px] text-emerald-100/80">AI Disease Detection in 2s</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
            Platform Menu
          </p>
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-600 text-white shadow-xs font-bold'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={17}
                      className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-600 transition-colors'}
                    />
                    <span>{label}</span>
                  </div>
                  {badge && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-md font-bold',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Micro-Telemetry Widget + User */}
        <div className="p-3 border-t border-gray-100 space-y-2 bg-gradient-to-b from-transparent to-gray-50/70">
          {/* Micro Weather Bar */}
          {weather && (
            <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <CloudSun size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-800 leading-none">
                    {weather.temperature}°C · {weather.condition}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-none">{weather.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <Droplets size={11} className="text-blue-500" />
                <span>{weather.humidity}%</span>
              </div>
            </div>
          )}

          {/* User profile card in sidebar */}
          {user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/80 border border-gray-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate leading-tight">{user.location || 'AgroVision Pro'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
