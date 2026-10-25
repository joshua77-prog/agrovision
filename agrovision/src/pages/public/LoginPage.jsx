import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import { login } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await login({ email: form.email, password: form.password });
      setUser(user);
      addToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Invalid email or password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const BENEFITS = [
    'AI-powered crop disease detection',
    'Real-time weather farming advisories',
    'Detailed treatment recommendations',
    'Complete detection history',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-700 flex-col p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-white/10 rounded-xl">
              <Leaf size={22} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">AGROVISION</span>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
              Smart Insights for<br />Healthier Crops
            </h2>
            <p className="text-brand-100 mb-10 leading-relaxed">
              Sign in to access your farming dashboard and start detecting crop diseases with AI precision.
            </p>

            <div className="space-y-3.5">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-brand-100">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <p className="text-sm text-brand-50 italic leading-relaxed mb-3">
              "AgroVision helped me identify late blight on my potato crop before it spread. I saved nearly 80% of my harvest."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Adebayo Okafor</p>
                <p className="text-xs text-brand-200">Potato Farmer, Plateau State</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel – Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo size="lg" linkTo="/" className="justify-center" />
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
              <p className="text-xs text-gray-500">Sign in to your AgroVision farm account</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ email: 'farmer@agrovision.ng', password: 'password123', remember: true })}
              className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200/80 px-2.5 py-1.5 rounded-xl border border-emerald-300/60 shadow-2xs transition-all active:scale-95"
            >
              ⚡ Fill Demo Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={{ minHeight: '44px' }}
                  className={`input input-has-left-icon ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label mb-0">Password</label>
                <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  style={{ minHeight: '44px' }}
                  className={`input input-has-left-icon input-has-right-icon ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors z-10 p-1 flex items-center"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              iconRight={!loading && <ArrowRight size={16} />}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
              Create account
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700 text-center">
              <strong>Demo:</strong> Enter any email and password to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
