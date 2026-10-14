import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, CloudSun, History, BookOpen, User
} from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 flex items-center justify-around px-2 py-1.5 lg:hidden safe-area-inset-bottom shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150',
            isActive ? 'text-brand-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          )
        }
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] mt-0.5">Home</span>
      </NavLink>

      <NavLink
        to="/weather"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150',
            isActive ? 'text-brand-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          )
        }
      >
        <CloudSun size={20} />
        <span className="text-[10px] mt-0.5">Weather</span>
      </NavLink>

      {/* Raised Floating Center Scan Button */}
      <NavLink
        to="/detect"
        className="relative -top-5 flex flex-col items-center group"
      >
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-glow-lg border-4 border-white active:scale-95 transition-transform">
          <ScanLine size={24} className="group-hover:rotate-12 transition-transform" />
        </div>
        <span className="text-[10px] font-bold text-brand-700 mt-0.5">Scan AI</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150',
            isActive ? 'text-brand-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          )
        }
      >
        <History size={20} />
        <span className="text-[10px] mt-0.5">Logs</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150',
            isActive ? 'text-brand-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          )
        }
      >
        <User size={20} />
        <span className="text-[10px] mt-0.5">Profile</span>
      </NavLink>
    </nav>
  );
}
