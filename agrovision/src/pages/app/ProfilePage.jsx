import { useState } from 'react';
import {
  User, Mail, MapPin, Bell, Globe, Lock, LogOut, Camera, Save,
  Eye, EyeOff, Thermometer, Check
} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { updateProfile, changePassword } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const TABS = ['Profile', 'Preferences', 'Security'];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
  });
  const [prefs, setPrefs] = useState({
    temperatureUnit: user?.preferences?.temperatureUnit || 'celsius',
    notifications: user?.preferences?.notifications ?? true,
    language: user?.preferences?.language || 'en',
  });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      updateUser(profileForm);
      addToast('Profile updated successfully.', 'success');
    } catch {
      addToast('Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePrefs = async () => {
    setSavingPrefs(true);
    try {
      await updateProfile({ preferences: prefs });
      updateUser({ preferences: prefs });
      addToast('Preferences saved.', 'success');
    } catch {
      addToast('Failed to save preferences.', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleChangePassword = async () => {
    const e = {};
    if (!pwForm.current) e.current = 'Current password required';
    if (!pwForm.newPw || pwForm.newPw.length < 6) e.newPw = 'Minimum 6 characters';
    if (pwForm.newPw !== pwForm.confirm) e.confirm = 'Passwords do not match';
    setPwErrors(e);
    if (Object.keys(e).length > 0) return;

    setSavingPw(true);
    try {
      await changePassword({ current: pwForm.current, new: pwForm.newPw });
      addToast('Password changed successfully.', 'success');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch {
      addToast('Failed to change password.', 'error');
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="px-4 md:px-6 py-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title">Profile & Settings</h1>
          <p className="section-subtitle">Manage your account information and preferences.</p>
        </div>

        {/* Avatar card */}
        <Card className="mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-700">
                  {user?.name?.charAt(0).toUpperCase() || 'F'}
                </span>
              </div>
              <button
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center shadow-card hover:bg-brand-700 transition-colors"
                aria-label="Change avatar"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">📍 {user?.location}</p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-card'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'Profile' && (
          <Card>
            <CardTitle className="mb-5">Personal Information</CardTitle>
            <div className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="input pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="label">Farm Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="input pl-9"
                    placeholder="e.g. Ogun State, Nigeria"
                  />
                </div>
              </div>
              <Button
                variant="primary"
                icon={<Save size={15} />}
                onClick={handleSaveProfile}
                loading={savingProfile}
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        )}

        {/* Preferences tab */}
        {activeTab === 'Preferences' && (
          <Card>
            <CardTitle className="mb-5">App Preferences</CardTitle>
            <div className="space-y-5">
              {/* Temperature unit */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <Thermometer size={14} className="text-gray-400" /> Temperature Unit
                </label>
                <div className="flex gap-2">
                  {['celsius', 'fahrenheit'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setPrefs({ ...prefs, temperatureUnit: unit })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                        prefs.temperatureUnit === unit
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                      }`}
                    >
                      {unit === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive farming alerts and disease warnings</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrefs({ ...prefs, notifications: !prefs.notifications })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    prefs.notifications ? 'bg-brand-600' : 'bg-gray-200'
                  }`}
                  aria-label="Toggle notifications"
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    prefs.notifications ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Language */}
              <div>
                <label className="label flex items-center gap-1.5">
                  <Globe size={14} className="text-gray-400" /> Language
                </label>
                <select
                  value={prefs.language}
                  onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
                  className="input"
                >
                  <option value="en">English</option>
                  <option value="yo">Yoruba</option>
                  <option value="ha">Hausa</option>
                  <option value="ig">Igbo</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <Button
                variant="primary"
                icon={<Save size={15} />}
                onClick={handleSavePrefs}
                loading={savingPrefs}
              >
                {savingPrefs ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </Card>
        )}

        {/* Security tab */}
        {activeTab === 'Security' && (
          <div className="space-y-4">
            <Card>
              <CardTitle className="mb-5">Change Password</CardTitle>
              <div className="space-y-4">
                {[
                  { id: 'current', label: 'Current Password', key: 'current' },
                  { id: 'newPw', label: 'New Password', key: 'new' },
                  { id: 'confirm', label: 'Confirm New Password', key: 'confirm' },
                ].map(({ id, label, key }) => (
                  <div key={id}>
                    <label className="label">{label}</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPw[key] ? 'text' : 'password'}
                        value={pwForm[id]}
                        onChange={(e) => setPwForm({ ...pwForm, [id]: e.target.value })}
                        className={`input pl-9 pr-10 ${pwErrors[id] ? 'input-error' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {pwErrors[id] && <p className="text-xs text-red-500 mt-1">{pwErrors[id]}</p>}
                  </div>
                ))}
                <Button
                  variant="primary"
                  icon={<Lock size={15} />}
                  onClick={handleChangePassword}
                  loading={savingPw}
                >
                  {savingPw ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </Card>

            {/* Logout */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sign Out</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sign out from your AgroVision account</p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<LogOut size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
