
const WEATHER_API = '/ml-api/weather';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = await response.json();
      message = body.detail || body.reason || message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function resolveLocation(location = 'Chennai') {
  const query = (location || '').trim() || 'Chennai';

  let data = await fetchJSON(
    `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );

  // If multi-part string with comma fails (e.g. "Abeokuta, Ogun State, Nigeria"), fallback to the primary city name
  if (!data.results?.length && query.includes(',')) {
    const primaryCity = query.split(',')[0].trim();
    if (primaryCity) {
      data = await fetchJSON(
        `${GEOCODING_API}?name=${encodeURIComponent(primaryCity)}&count=1&language=en&format=json`
      );
    }
  }

  if (!data.results?.length) {
    throw new Error(`Location "${query}" was not found. Try another city.`);
  }

  return data.results[0];
}

export async function searchLocations(query = '') {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  try {
    const data = await fetchJSON(
      `${GEOCODING_API}?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    );
    if (!data.results?.length && q.includes(',')) {
      const primaryCity = q.split(',')[0].trim();
      if (primaryCity && primaryCity.length >= 2) {
        const fallback = await fetchJSON(
          `${GEOCODING_API}?name=${encodeURIComponent(primaryCity)}&count=5&language=en&format=json`
        );
        return (fallback.results || []).map(r => ({
          name: r.name,
          admin1: r.admin1,
          country: r.country,
          display: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
          latitude: r.latitude,
          longitude: r.longitude,
        }));
      }
    }
    return (data.results || []).map(r => ({
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      display: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  } catch {
    return [];
  }
}

function getCondition(code) {
  if (code === 0) return 'Clear Sky';
  if ([1, 2].includes(code)) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snow';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';

  return 'Conditions Unavailable';
}

function getWeatherIcon(code) {
  if (code === 0) return 'sun';
  if ([1, 2, 3, 45, 48].includes(code)) return 'cloud';
  if ([95, 96, 99].includes(code)) return 'cloud-lightning';

  return 'cloud-rain';
}

function toDisplayLocation(place) {
  return [place.name, place.admin1, place.country]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(', ');
}

// Current weather: uses the same Open-Meteo data source
// as the seven-day forecast.
export async function getCurrentWeather(location = 'Chennai') {
  const place = await resolveLocation(location);

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    hourly: 'precipitation_probability',
    timezone: 'auto',
    forecast_days: '7',
  });

  const data = await fetchJSON(`${FORECAST_API}?${params}`);
  const current = data.current;

  if (!current) {
    throw new Error('Current weather data is unavailable.');
  }

  // Find the nearest available hourly precipitation probability.
  const hourlyTimes = data.hourly?.time || [];
  const probabilities = data.hourly?.precipitation_probability || [];
  const currentHour = current.time?.slice(0, 13);

  let nearestIndex = hourlyTimes.findIndex(
    (time) => time.slice(0, 13) === currentHour
  );

  if (nearestIndex < 0) nearestIndex = 0;

  const rainProbability = probabilities[nearestIndex];

  return {
    location: toDisplayLocation(place),
    city: place.name,
    country: place.country || '',
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(
      current.apparent_temperature ?? current.temperature_2m
    ),
    condition: getCondition(current.weather_code),
    weatherCode: current.weather_code,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
    rainChance: rainProbability ?? null,
    time: current.time,
    latitude: place.latitude,
    longitude: place.longitude,
    source: 'Open-Meteo',
  };
}

// Seven-day forecast for the exact same selected location.
export async function getWeatherForecast(location = 'Chennai') {
  const place = await resolveLocation(location);

  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const data = await fetchJSON(`${FORECAST_API}?${params}`);
  const daily = data.daily;

  if (!daily?.time) {
    throw new Error('The seven-day forecast is unavailable.');
  }

  return daily.time.map((date, index) => {
    const dayDate = new Date(`${date}T12:00:00`);

    return {
      day: new Intl.DateTimeFormat('en', {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(dayDate),
      date,
      high: Math.round(daily.temperature_2m_max[index]),
      low: Math.round(daily.temperature_2m_min[index]),
      rainChance: daily.precipitation_probability_max[index] ?? 0,
      icon: getWeatherIcon(daily.weather_code[index]),
      condition: getCondition(daily.weather_code[index]),
    };
  });
}

// Generate simple farming advisories using actual current weather.
// These are general indicators, not crop-specific diagnoses.
export async function getFarmingAdvisories(location = 'Chennai') {
  const weather = await getCurrentWeather(location);
  const forecast = await getWeatherForecast(location);

  const advisories = [];
  const maxRainChance = Math.max(
    0,
    ...forecast.map((day) => Number(day.rainChance ?? 0))
  );

  if (weather.humidity >= 80) {
    advisories.push({
      id: 'high-humidity',
      type: 'disease',
      title: 'High Humidity Alert',
      severity: 'medium',
      description:
        `Humidity is ${weather.humidity}% in ${weather.location}. Inspect susceptible crops for signs of fungal disease.`,
      recommendation:
        'Monitor leaves and follow crop-specific disease prevention guidance.',
    });
  }

  if (maxRainChance >= 60) {
    advisories.push({
      id: 'rain-forecast',
      type: 'weather',
      title: 'Rain Forecast',
      severity: 'medium',
      description:
        `Rain probability may reach ${maxRainChance}% in the forecast for ${weather.location}.`,
      recommendation:
        'Check field drainage and soil moisture before deciding whether to irrigate.',
    });
  }

  if (weather.windSpeed >= 10) {
    advisories.push({
      id: 'wind-alert',
      type: 'weather',
      title: 'Wind Advisory',
      severity: 'low',
      description:
        `Current wind speed is ${weather.windSpeed} km/h in ${weather.location}.`,
      recommendation:
        'Check local wind conditions and pesticide label instructions before spraying.',
    });
  }

  if (weather.temperature >= 35) {
    advisories.push({
      id: 'heat-alert',
      type: 'weather',
      title: 'High Temperature',
      severity: 'medium',
      description:
        `Current temperature is ${weather.temperature}°C in ${weather.location}.`,
      recommendation:
        'Monitor soil moisture and crop water needs during hot conditions.',
    });
  }

  if (advisories.length === 0) {
    advisories.push({
      id: 'routine-monitoring',
      type: 'general',
      title: 'Routine Crop Monitoring',
      severity: 'low',
      description:
        `No threshold-based weather alerts were triggered for ${weather.location}.`,
      recommendation:
        'Continue routine crop inspections and make irrigation decisions based on soil moisture.',
    });
  }

  return advisories;
}

// Preserve the existing disease + weather advisory function.
export async function getDiseaseWeatherAdvisory(disease, weather) {
  const humidity = Number(weather?.humidity ?? 0);
  const temperature = Number(weather?.temperature ?? 0);

  const highHumidity = humidity >= 80;
  const highTemperature = temperature >= 35;

  return {
    advisory: highHumidity
      ? 'High humidity conditions detected. Monitor susceptible crops for fungal disease and follow crop-specific prevention guidance.'
      : highTemperature
        ? 'High temperature conditions detected. Monitor crop water needs and soil moisture.'
        : 'Continue routine crop monitoring and follow recommendations specific to the identified disease.',
    riskLevel: highHumidity || highTemperature ? 'Medium' : 'Low',
    disease,
    source: 'Rule-based weather advisory',
  };
}
