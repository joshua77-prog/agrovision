import {
  Sun, Cloud, CloudRain, CloudLightning, Wind, CloudDrizzle,
  Thermometer, Droplets, Umbrella
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const weatherIcons = {
  sun: Sun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
  wind: Wind,
  'cloud-drizzle': CloudDrizzle,
};

export function WeatherIcon({ icon, size = 24, className = '' }) {
  const Icon = weatherIcons[icon] || Sun;
  return <Icon size={size} className={className} />;
}

export default function WeatherCard({ weather, compact = false }) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50">
            <Thermometer size={16} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Temperature</p>
            <p className="text-sm font-semibold text-gray-800">{weather.temperature}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50">
            <Droplets size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Humidity</p>
            <p className="text-sm font-semibold text-gray-800">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50">
            <Umbrella size={16} className="text-sky-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rainfall</p>
            <p className="text-sm font-semibold text-gray-800">{weather.rainfall} mm</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gray-50">
            <Wind size={16} className="text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Wind</p>
            <p className="text-sm font-semibold text-gray-800">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-50">
          <WeatherIcon icon={weather.icon || 'sun'} size={32} className="text-amber-500" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{weather.temperature}°C</p>
          <p className="text-sm text-gray-500 mt-0.5">{weather.condition}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-xl bg-gray-50">
          <Droplets size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Humidity</p>
          <p className="text-sm font-semibold">{weather.humidity}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-50">
          <Umbrella size={18} className="text-sky-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Rainfall</p>
          <p className="text-sm font-semibold">{weather.rainfall} mm</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-gray-50">
          <Wind size={18} className="text-gray-500 mx-auto mb-1" />
          <p className="text-xs text-gray-500">Wind</p>
          <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
}
