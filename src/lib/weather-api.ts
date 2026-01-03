import { WeatherData, GeoLocation, WeatherCondition, ForecastDay } from '@/types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Map WMO weather codes to our conditions
function mapWeatherCode(code: number): { condition: WeatherCondition; description: string } {
  if (code === 0) return { condition: 'sunny', description: 'Clear sky' };
  if (code === 1) return { condition: 'sunny', description: 'Mainly clear' };
  if (code === 2) return { condition: 'partly-cloudy', description: 'Partly cloudy' };
  if (code === 3) return { condition: 'cloudy', description: 'Overcast' };
  if (code >= 45 && code <= 48) return { condition: 'foggy', description: 'Foggy' };
  if (code >= 51 && code <= 55) return { condition: 'rainy', description: 'Drizzle' };
  if (code >= 56 && code <= 57) return { condition: 'rainy', description: 'Freezing drizzle' };
  if (code >= 61 && code <= 65) return { condition: 'rainy', description: 'Rain' };
  if (code >= 66 && code <= 67) return { condition: 'rainy', description: 'Freezing rain' };
  if (code >= 71 && code <= 77) return { condition: 'snowy', description: 'Snow' };
  if (code >= 80 && code <= 82) return { condition: 'rainy', description: 'Rain showers' };
  if (code >= 85 && code <= 86) return { condition: 'snowy', description: 'Snow showers' };
  if (code >= 95 && code <= 99) return { condition: 'stormy', description: 'Thunderstorm' };
  return { condition: 'cloudy', description: 'Unknown' };
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    const data = await response.json();

    if (!data.results) return [];

    return data.results.map((result: any) => ({
      name: result.name,
      country: result.country || '',
      lat: result.latitude,
      lon: result.longitude,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

export async function fetchWeatherData(lat: number, lon: number, locationName: string, country: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`
    );
    const data = await response.json();

    const currentWeather = mapWeatherCode(data.current.weather_code);

    const forecast: ForecastDay[] = data.daily.time.slice(1, 6).map((date: string, index: number) => {
      const weatherInfo = mapWeatherCode(data.daily.weather_code[index + 1]);
      return {
        date: new Date(date),
        tempMax: Math.round(data.daily.temperature_2m_max[index + 1]),
        tempMin: Math.round(data.daily.temperature_2m_min[index + 1]),
        condition: weatherInfo.condition,
        description: weatherInfo.description,
      };
    });

    return {
      location: {
        name: locationName,
        country: country,
        lat,
        lon,
      },
      current: {
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: getWindDirection(data.current.wind_direction_10m),
        pressure: Math.round(data.current.surface_pressure),
        condition: currentWeather.condition,
        description: currentWeather.description,
      },
      forecast,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchWeatherByGeolocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=&latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return {
        name: data.results[0].name,
        country: data.results[0].country || '',
        lat,
        lon,
      };
    }

    // Fallback - return coordinates as name
    return {
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      country: '',
      lat,
      lon,
    };
  } catch (error) {
    return {
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      country: '',
      lat,
      lon,
    };
  }
}
