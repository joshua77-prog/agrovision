import api from './api';
import { MOCK_WEATHER, MOCK_ADVISORIES } from '../utils/mockData';

const USE_MOCK = true;
const delay = (ms = 700) => new Promise((res) => setTimeout(res, ms));

/**
 * Get current weather data for a location
 * GET /api/weather?location=<location>
 */
export async function getCurrentWeather(location = '') {
  if (USE_MOCK) {
    await delay();
    return { ...MOCK_WEATHER, location: location || MOCK_WEATHER.location };
  }

  const response = await api.get('/weather', { params: { location } });
  return response.data;
}

/**
 * Get 7-day weather forecast
 * GET /api/weather/forecast?location=<location>
 */
export async function getWeatherForecast(location = '') {
  if (USE_MOCK) {
    await delay();
    return MOCK_WEATHER.forecast;
  }

  const response = await api.get('/weather/forecast', { params: { location } });
  return response.data;
}

/**
 * Get farming advisories based on weather
 * GET /api/advisory
 */
export async function getFarmingAdvisories(filters = {}) {
  if (USE_MOCK) {
    await delay();
    let results = [...MOCK_ADVISORIES];
    if (filters.type) {
      results = results.filter((a) => a.type === filters.type);
    }
    return results;
  }

  const response = await api.get('/advisory', { params: filters });
  return response.data;
}

/**
 * Get weather-based advisory for a specific disease + weather combination
 * POST /api/advisory/disease
 */
export async function getDiseaseWeatherAdvisory(disease, weather) {
  if (USE_MOCK) {
    await delay(500);
    return {
      advisory: 'High humidity conditions detected. Monitor crops closely for signs of fungal disease and avoid overhead irrigation.',
      riskLevel: 'Medium',
    };
  }

  const response = await api.post('/advisory/disease', { disease, weather });
  return response.data;
}
