import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit, GeoLocation } from '@/types/weather';
import { fetchWeatherData, fetchWeatherByGeolocation, reverseGeocode } from '@/lib/weather-api';
import { SearchBar } from './SearchBar';
import { UnitToggle } from './UnitToggle';
import { CurrentWeather } from './CurrentWeather';
import { ForecastCard } from './ForecastCard';
import { Loader2, CloudOff } from 'lucide-react';
import { toast } from 'sonner';

export function WeatherDashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load default city on mount
  useEffect(() => {
    loadWeatherForCity({ name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 });
  }, []);

  const loadWeatherForCity = async (location: GeoLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(location.lat, location.lon, location.name, location.country);
      setWeather(data);
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      toast.error('Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    setIsLoadingLocation(true);
    setError(null);
    try {
      const coords = await fetchWeatherByGeolocation();
      const location = await reverseGeocode(coords.lat, coords.lon);
      await loadWeatherForCity(location);
      toast.success(`Location set to ${location.name}`);
    } catch (err) {
      setError('Could not get your location. Please enable location services or search for a city.');
      toast.error('Could not get your location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🌤️ Weather Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time weather updates for any city
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-12">
          <SearchBar
            onLocationSelect={loadWeatherForCity}
            onUseMyLocation={handleUseMyLocation}
            isLoadingLocation={isLoadingLocation}
          />
          <UnitToggle unit={unit} onToggle={setUnit} />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 glass-card max-w-md mx-auto">
            <CloudOff className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">{error}</p>
          </div>
        ) : weather ? (
          <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            <CurrentWeather weather={weather} unit={unit} />
            <ForecastCard forecast={weather.forecast} unit={unit} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
