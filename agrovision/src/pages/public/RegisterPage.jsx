import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Leaf, Mail, Lock, User, MapPin, ArrowRight,
  CheckCircle, ShieldCheck, Sparkles, AlertCircle, Check
} from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import { register } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    agreeTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!form.location.trim()) e.location = 'Farm location is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agreeTerms) e.agreeTerms = 'Please agree to the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        location: form.location.trim(),
      });
      setUser(user);
      addToast(`Account created! Welcome to AgroVision, ${user.name || form.fullName}.`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDemoFill = () => {
    setForm({
      fullName: 'Amina Yusuf',
      email: 'amina.farmer@agrovision.ng',
      location: 'Ogun State, Nigeria',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreeTerms: true,
    });
    setErrors({});
  };

  const getPasswordStrength = () => {
    const pw = form.password;
    if (!pw) return null;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500', width: '33%' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600', width: '100%' };
  };

  const pwStrength = getPasswordStrength();

  const VALUE_PROPS = [
    {
      title: '98.4% AI Disease Accuracy',
      desc: 'Instant visual leaf diagnosis trained on 100,000+ crop samples',
    },
    {
      title: 'Hyperlocal Weather Advisories',
      desc: 'Real-time rainfall, humidity, and optimal spraying window alerts',
    },
    {
      title: 'Targeted Remediation Plans',
      desc: 'Both organic remedies and scientific chemical dosages per disease',
    },
    {
      title: 'Historical Field Analytics',
      desc: 'Track recurring infections across your farm seasons and plots',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left panel - Brand & Value Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-brand-900 via-brand-800 to-emerald-950 flex-col p-12 relative overflow-hidden text-white shrink-0">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Brand Tag */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/15 shadow-inner">
              <Leaf size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                AGRO<span className="text-brand-300">VISION</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-200 mt-1 block">
                Smart Farming Intelligence
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-brand-200 text-xs font-semibold mb-4">
              <Sparkles size={13} className="text-brand-300" />
              <span>Join 20,000+ Modern Farmers</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Smarter Insights.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-emerald-300">
                Healthier, Bumper Harvests.
              </span>
            </h2>
            <p className="text-brand-100/90 text-sm leading-relaxed max-w-md">
              Detect leaf diseases in seconds with AI, protect your acreage against outbreaks, and receive tailored weather farming advisories.
            </p>
          </div>

          {/* Key Value Propositions */}
          <div className="space-y-4 mb-10">
            {VALUE_PROPS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-500/20 border border-brand-400/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={14} className="text-brand-300 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-brand-100/80 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 mb-8">
            <div>
              <div className="text-xl font-extrabold text-white">98.4%</div>
              <div className="text-[11px] text-brand-200/80">AI Accuracy</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-white">120+</div>
              <div className="text-[11px] text-brand-200/80">Crop Diseases</div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-white">&lt; 2s</div>
              <div className="text-[11px] text-brand-200/80">Diagnosis Speed</div>
            </div>
          </div>
        </div>

        {/* Farmer Testimonial Card */}
        <div className="relative z-10 mt-auto pt-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-lg">
            <p className="text-xs text-brand-50 italic leading-relaxed mb-3">
              "AgroVision diagnosed early leaf blight on my tomato crop in seconds and recommended an immediate bio-fungicide treatment. It saved over 75% of my yield."
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-400/30 border border-brand-300/40 flex items-center justify-center font-bold text-xs text-white">
                AY
              </div>
              <div>
                <p className="text-xs font-bold text-white">Amina Yusuf</p>
                <p className="text-[10px] text-brand-200">Commercial Vegetable Grower, Ogun State</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Registration Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-10 bg-slate-50 min-h-screen">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Logo size="lg" linkTo="/" className="justify-center" />
          </div>

          {/* Header & Demo Autofill button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Create your account
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Start protecting your crops with AI-powered detection
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300/80 shadow-2xs transition-all active:scale-95"
              title="Click to automatically fill demo data for testing"
            >
              <span>⚡</span> Demo Autofill
            </button>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-card-md border border-gray-200/80 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                    <User size={18} />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={update('fullName')}
                    placeholder="e.g. John Farmer"
                    autoComplete="name"
                    style={{ minHeight: '44px' }}
                    className={`input input-has-left-icon ${errors.fullName ? 'input-error' : ''}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 font-medium">
                    <AlertCircle size={13} /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="label">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    style={{ minHeight: '44px' }}
                    className={`input input-has-left-icon ${errors.email ? 'input-error' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 font-medium">
                    <AlertCircle size={13} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Farm Location */}
              <div>
                <label htmlFor="location" className="label">
                  Farm Location <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                    <MapPin size={18} />
                  </div>
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={update('location')}
                    placeholder="e.g. Ogun State, Nigeria"
                    autoComplete="address-level1"
                    style={{ minHeight: '44px' }}
                    className={`input input-has-left-icon ${errors.location ? 'input-error' : ''}`}
                  />
                </div>
                {errors.location && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 font-medium">
                    <AlertCircle size={13} /> {errors.location}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="label">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    style={{ minHeight: '44px' }}
                    className={`input input-has-left-icon input-has-right-icon ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors z-10 p-1 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 font-medium">
                    <AlertCircle size={13} /> {errors.password}
                  </p>
                )}

                {/* Password strength indicator */}
                {pwStrength && (
                  <div className="mt-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="text-gray-500 font-medium">Password strength</span>
                      <span className={`font-bold ${pwStrength.textColor}`}>
                        {pwStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                        style={{ width: pwStrength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-gray-400 z-10 flex items-center">
                    <Lock size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    style={{ minHeight: '44px' }}
                    className={`input input-has-left-icon input-has-right-icon ${errors.confirmPassword ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors z-10 p-1 flex items-center"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Real-time match indicator */}
                {form.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {form.password === form.confirmPassword ? (
                      <>
                        <CheckCircle size={14} className="text-brand-600" />
                        <span className="text-xs font-semibold text-brand-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} className="text-red-500" />
                        <span className="text-xs font-medium text-red-500">Passwords do not match yet</span>
                      </>
                    )}
                  </div>
                )}
                {errors.confirmPassword && !form.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5 font-medium">
                    <AlertCircle size={13} /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms of Service Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={update('agreeTerms')}
                    className="mt-0.5 w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-gray-300"
                  />
                  <span className="text-xs text-gray-600 leading-snug">
                    I agree to AgroVision's{' '}
                    <a href="#" className="text-brand-600 font-semibold hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-brand-600 font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="flex items-center gap-1 text-xs text-red-500 mt-1 font-medium">
                    <AlertCircle size={13} /> {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 py-3 text-sm font-bold shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all rounded-xl"
                loading={loading}
                iconRight={!loading && <ArrowRight size={17} />}
              >
                {loading ? 'Creating your account...' : 'Create Account'}
              </Button>
            </form>

            {/* Link to login */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand-600 font-bold hover:text-brand-700 hover:underline transition-colors ml-1"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Security & Trust Footer */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-brand-600" />
              256-bit Secure Encryption
            </span>
            <span>•</span>
            <span>100% Free for Independent Farmers</span>
          </div>
        </div>
      </div>
    </div>
  );
}
