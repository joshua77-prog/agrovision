
import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Droplets,
  Umbrella,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Search,
  Thermometer,
} from 'lucide-react';

import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import AdvisoryCard from '../../components/ui/AdvisoryCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

import {
  getCurrentWeather,
  getWeatherForecast,
  getFarmingAdvisories,
} from '../../services/weatherService';

import { cn } from '../../utils/helpers';

const DEFAULT_LOCATION = 'Chennai';

const WeatherIconMap = {
  sun: Sun,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
};

function ForecastDay({ day }) {
  const Icon = WeatherIconMap[day.icon] || Cloud;

  return (
    <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-brand-300 hover:bg-brand-50/30 transition-all flex-1 min-w-[85px]">
      <p className="text-xs font-bold text-gray-700">{day.day}</p>

      <div className="p-2 rounded-xl bg-white shadow-2xs">
        <Icon
          size={22}
          className={cn(
            day.icon === 'sun' && 'text-amber-500',
            day.icon === 'cloud' && 'text-gray-400',
            day.icon === 'cloud-rain' && 'text-blue-500',
            day.icon === 'cloud-lightning' && 'text-purple-500'
          )}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-black text-gray-900">
          {day.high ?? '--'}°
        </p>
        <p className="text-xs text-gray-400">
          {day.low ?? '--'}°
        </p>
      </div>

      <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold bg-blue-50/80 px-2 py-0.5 rounded-md">
        <Umbrella size={11} />
        <span>{day.rainChance ?? 0}%</span>
      </div>
    </div>
  );
}

function createActivities(weather, forecast) {
  if (!weather) return [];

  const windSpeed = Number(weather.windSpeed ?? 0);
  const humidity = Number(weather.humidity ?? 0);
  const rainChance = Math.max(
    0,
    ...forecast.map((day) => Number(day.rainChance ?? 0))
  );

  const activities = [];

  // Wind-based spraying guidance
  activities.push(
    windSpeed < 10
      ? {
        name: 'Foliar Spraying',
        status: 'Potentially Suitable',
        detail:
          `Current wind speed is ${windSpeed} km/h. Check the product label and local conditions before spraying.`,
        color: 'emerald',
        icon: ShieldCheck,
      }
      : {
        name: 'Foliar Spraying',
        status: 'Use Caution',
        detail:
          `Current wind speed is ${windSpeed} km/h. Wind may increase spray drift. Check conditions before spraying.`,
        color: 'amber',
        icon: AlertTriangle,
      }
  );

  // Rain forecast-based irrigation guidance
  activities.push(
    rainChance >= 60
      ? {
        name: 'Field Irrigation',
        status: 'Review Before Irrigating',
        detail:
          `Forecast rain chance reaches ${rainChance}%. Check soil moisture and crop needs before irrigating.`,
        color: 'amber',
        icon: AlertTriangle,
      }
      : {
        name: 'Field Irrigation',
        status: 'Check Soil Moisture',
        detail:
          'Use soil moisture and crop requirements to decide whether irrigation is needed.',
        color: 'emerald',
        icon: CheckCircle2,
      }
  );

  // Humidity-based monitoring
  activities.push(
    humidity >= 80
      ? {
        name: 'Crop Disease Monitoring',
        status: 'Monitor Closely',
        detail:
          `Relative humidity is ${humidity}%. Inspect leaves for disease symptoms, especially in susceptible crops.`,
        color: 'amber',
        icon: AlertTriangle,
      }
      : {
        name: 'Crop Disease Monitoring',
        status: 'Routine Monitoring',
        detail:
          'Continue checking leaves and stems for unusual spots, discoloration or wilting.',
        color: 'emerald',
        icon: CheckCircle2,
      }
  );

  activities.push({
    name: 'Harvesting',
    status: 'Check Local Conditions',
    detail:
      'Review the local rain forecast, crop maturity and field conditions before harvesting.',
    color: 'blue',
    icon: Clock,
  });

  return activities;
}

export default function WeatherPage() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [advisories, setAdvisories] = useState([]);

  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [searchValue, setSearchValue] = useState(DEFAULT_LOCATION);

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (requestedLocation) => {
    const selectedLocation = requestedLocation?.trim();

    if (!selectedLocation) {
      setError('Please enter a city or farm location.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Every request uses the same selected location.
      const [weatherData, forecastData, advisoryData] =
        await Promise.all([
          getCurrentWeather(selectedLocation),
          getWeatherForecast(selectedLocation),
          getFarmingAdvisories(selectedLocation),
        ]);

      if (!weatherData) {
        throw new Error('No weather data was returned for this location.');
      }

      // Use the resolved location returned by the weather API.
      const resolvedLocation =
        weatherData.location || selectedLocation;

      setWeather(weatherData);
      setForecast(Array.isArray(forecastData) ? forecastData : []);
      setAdvisories(Array.isArray(advisoryData) ? advisoryData : []);

      setLocation(resolvedLocation);
      setSearchValue(resolvedLocation);
    } catch (err) {
      console.error('Weather loading error:', err);

      setError(
        err.message ||
        'Unable to load weather for this location. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(DEFAULT_LOCATION);
  }, [fetchData]);

  function handleSearch(event) {
    event.preventDefault();

    const requestedLocation = searchValue.trim();

    if (requestedLocation) {
      fetchData(requestedLocation);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    fetchData(location);
  }

  if (loading && !weather) {
    return (
      <PageLoader message="Fetching weather information..." />
    );
  }

  const activities = createActivities(weather, forecast);

  return (
    <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
            Microclimate Radar
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Agricultural Weather Intelligence
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Weather information and farming guidance for your selected location.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5"
        >
          <RefreshCw
            size={14}
            className={refreshing ? 'animate-spin' : ''}
          />
          <span>{refreshing ? 'Syncing...' : 'Sync Radar'}</span>
        </Button>
      </div>

      {/* Location Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Enter a city, state or farm location..."
            className="input pl-10 text-xs font-semibold rounded-2xl border-gray-200 bg-white"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={loading}
          className="rounded-2xl px-5 font-bold"
        >
          <span className="flex items-center gap-2">
            <Search size={14} />
            Search
          </span>
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-bold">Unable to update weather</p>
          <p className="mt-1">{error}</p>
          <p className="mt-2 text-xs">
            Check the location and make sure the weather API is running.
          </p>
        </div>
      )}

      {loading && weather && (
        <p className="text-sm text-gray-500">
          Updating weather for {searchValue}...
        </p>
      )}

      {/* Current Weather */}
      {weather && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-gray-950 text-white shadow-card-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-2">
                <MapPin size={14} />
                <span>{weather.location || location}</span>
                <span className="text-blue-400">
                  • Current Weather
                </span>
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-5xl sm:text-6xl font-black tracking-tight">
                  {weather.temperature ?? '--'}°C
                </p>
                <span className="text-lg font-bold text-blue-200">
                  {weather.condition || 'Current conditions'}
                </span>
              </div>

              <p className="text-xs text-gray-300 mt-2">
                Weather data for {weather.location || location}.
                Use local crop and soil conditions when making farm decisions.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Droplets size={14} className="text-blue-300" />
                  <span>Humidity</span>
                </div>
                <p className="text-lg font-extrabold text-white">
                  {weather.humidity ?? '--'}%
                </p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Wind size={14} className="text-teal-300" />
                  <span>Wind Speed</span>
                </div>
                <p className="text-lg font-extrabold text-white">
                  {weather.windSpeed ?? '--'} km/h
                </p>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-gray-300 text-xs mb-1">
                  <Umbrella size={14} className="text-indigo-300" />
                  <span>Rain Chance</span>
                </div>
                <p className="text-lg font-extrabold text-white">
                  {weather.rainChance ?? '--'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          7-Day Meteorological Outlook
        </h3>

        {forecast.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {forecast.map((day, index) => (
              <ForecastDay
                key={`${day.day}-${index}`}
                day={day}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No forecast data is available for this location.
          </p>
        )}
      </div>

      {/* Weather-Based Farming Activities */}
      <div className="glass-card p-6 bg-white border border-gray-200/80 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-brand-600" />
          <h3 className="text-base font-bold text-gray-900">
            Farm Activity Suitability Matrix
          </h3>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Based on current weather and forecast data for{' '}
          {weather?.location || location}. These are general indicators,
          not guarantees of safe working conditions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.name}
                className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 ${activity.color === 'emerald'
                    ? 'bg-emerald-100 text-emerald-700'
                    : activity.color === 'amber'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  <Icon size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-xs font-bold text-gray-900">
                      {activity.name}
                    </p>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activity.color === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activity.color === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {activity.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {activity.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crop Health Advisories */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">
          Active Crop Health Advisories
        </h3>

        {advisories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advisories.map((advisory, index) => (
              <AdvisoryCard
                key={advisory.id ?? index}
                advisory={advisory}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No crop health advisories are available for this location.
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Weather conditions can change quickly. Verify local conditions
        before making spraying, irrigation or harvesting decisions.
      </p>
    </div>
  );
}
