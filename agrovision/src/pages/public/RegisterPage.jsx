import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Leaf, Mail, Lock, User, MapPin, ArrowRight, CheckCircle
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
    fullName: '', email: '', password: '', confirmPassword: '', location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.location.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user } = await register(form);
      setUser(user);
      addToast(`Account created! Welcome to AgroVision, ${user.name}.`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const getPasswordStrength = () => {
    const pw = form.password;
    if (!pw) return null;
    if (pw.length < 6) return { label: 'Weak', color: 'bg-red-400', width: '33%' };
    if (pw.length < 10 || !/[A-Z]/.test(pw)) return { label: 'Fair', color: 'bg-amber-400', width: '66%' };
    return { label: 'Strong', color: 'bg-brand-500', width: '100%' };
  };

  const pwStrength = getPasswordStrength();

  const fields = [
    { id: 'fullName', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Farmer', autocomplete: 'name' },
    { id: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com', autocomplete: 'email' },
    { id: 'location', label: 'Farm Location', type: 'text', icon: MapPin, placeholder: 'e.g. Ogun State, Nigeria', autocomplete: 'off' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo size="lg" linkTo="/" className="justify-center mb-3" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500">Start protecting your crops with AI-powered detection</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Text fields */}
            {fields.map(({ id, label, type, icon: Icon, placeholder, autocomplete }) => (
              <div key={id}>
                <label htmlFor={id} className="label">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id={id}
                    type={type}
                    value={form[id]}
                    onChange={update(id)}
                    placeholder={placeholder}
                    autoComplete={autocomplete}
                    className={`input pl-9 ${errors[id] ? 'input-error' : ''}`}
                  />
                </div>
                {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
              </div>
            ))}

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className={`input pl-9 pr-10 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

              {/* Strength bar */}
              {pwStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={`text-xs font-medium ${
                      pwStrength.label === 'Weak' ? 'text-red-500' :
                      pwStrength.label === 'Fair' ? 'text-amber-500' : 'text-brand-600'
                    }`}>{pwStrength.label}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                      style={{ width: pwStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={`input pl-9 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Match indicator */}
              {form.confirmPassword && !errors.confirmPassword && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CheckCircle size={13} className={form.password === form.confirmPassword ? 'text-brand-500' : 'text-gray-300'} />
                  <span className={`text-xs ${form.password === form.confirmPassword ? 'text-brand-600' : 'text-gray-400'}`}>
                    {form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              loading={loading}
              iconRight={!loading && <ArrowRight size={16} />}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
