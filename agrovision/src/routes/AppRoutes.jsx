import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AppLayout from '../layouts/AppLayout';

// Public pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// App pages
import DashboardPage from '../pages/app/DashboardPage';
import DetectionPage from '../pages/app/DetectionPage';
import ResultPage from '../pages/app/ResultPage';
import WeatherPage from '../pages/app/WeatherPage';
import HistoryPage from '../pages/app/HistoryPage';
import DiseaseInfoPage from '../pages/app/DiseaseInfoPage';
import ProfilePage from '../pages/app/ProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/detect" element={<DetectionPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/diseases" element={<DiseaseInfoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
