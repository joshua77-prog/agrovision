import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, Bell, ChevronDown, ScanLine, Sparkles, 
  Check, CloudRain, ShieldAlert, CheckCircle2, User, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Topbar({ onMenuToggle, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Optimal Spray Window Today',
      desc: 'Low wind & clear skies between 7:00 AM - 11:00 AM in your region.',
      time: '12m ago',
      type: 'info',
      unread: true,
    },
    {
      id: 2,
      title: 'High Blight Risk Detected',
      desc: 'Elevated humidity in Edo State increases fungal spore dispersal.',
      time: '1h ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 3,
      title: 'Detection Saved',
      desc: 'Tomato Early Blight scan logged successfully with 94.6% confidence.',
      time: '3h ago',
      type: 'success',
      unread: false,
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 md:px-8 h-16 flex items-center justify-between transition-all">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {title ? (
          <h1 className="text-base font-bold text-gray-900 tracking-tight hidden md:block">{title}</h1>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50/80 border border-emerald-200/70 rounded-full text-xs font-semibold text-emerald-800 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono">AgroVision Neural Engine v3.4</span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 bg-emerald-200/60 rounded text-emerald-900 font-bold">Online</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2.5">
        {/* Instant Scan Quick Action */}
        <Link
          to="/detect"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-glow transition-all active:scale-95"
        >
          <ScanLine size={15} />
          <span>Scan Crop</span>
        </Link>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-card-lg border border-gray-100 z-30 overflow-hidden animate-slide-up">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-emerald-50/30">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-brand-600" />
                    <span className="text-sm font-bold text-gray-900">Crop Health Alerts</span>
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-brand-700 hover:text-brand-800 flex items-center gap-1 hover:underline"
                    >
                      <Check size={13} />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3.5 hover:bg-gray-50/80 transition-colors ${item.unread ? 'bg-brand-50/20' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          item.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                          item.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type === 'warning' ? <ShieldAlert size={15} /> :
                           item.type === 'success' ? <CheckCircle2 size={15} /> :
                           <CloudRain size={15} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 flex items-center justify-between">
                            <span className="truncate">{item.title}</span>
                            <span className="text-[10px] text-gray-400 font-normal shrink-0 ml-2">{item.time}</span>
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 text-center border-t border-gray-100 bg-gray-50/50">
                  <Link 
                    to="/weather" 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                  >
                    View All Advisories & Reports →
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-gray-100/80 border border-transparent hover:border-gray-200 transition-all active:scale-98"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {user?.name?.charAt(0).toUpperCase() || 'F'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-gray-800 block leading-tight max-w-[110px] truncate">
                {user?.name || 'Farmer'}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium block leading-tight">
                {user?.cropFocus || 'Farm Pro'}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-card-lg border border-gray-100 z-30 py-1.5 animate-slide-up">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50/20">
                  <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100/80 text-emerald-800 text-[10px] font-semibold rounded-md">
                    {user?.location || 'Verified Agronomist'}
                  </span>
                </div>
                
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <User size={15} className="text-gray-400" />
                    Profile & Farm Settings
                  </button>
                  <button
                    onClick={() => { navigate('/history'); setShowDropdown(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <Sparkles size={15} className="text-gray-400" />
                    Diagnostic Logs
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={15} className="text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
