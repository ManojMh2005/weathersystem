import { WeatherData, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '@/lib/temperature';
import { Droplets, Wind, Gauge, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface CurrentWeatherProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function CurrentWeather({ weather, unit }: CurrentWeatherProps) {
  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in">
      {/* Location & Time */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="font-medium text-foreground">{weather.location.name}</span>
          {weather.location.country && (
            <span>, {weather.location.country}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Updated: {format(weather.lastUpdated, 'HH:mm')}</span>
        </div>
      </div>

      {/* Main Temperature Display */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <WeatherIcon condition={weather.current.condition} size="xl" />
          <div>
            <p className="text-6xl md:text-7xl font-light tracking-tight">
              {formatTemperature(weather.current.temperature, unit)}
            </p>
            <p className="text-lg text-muted-foreground capitalize mt-1">
              {weather.current.description}
            </p>
          </div>
        </div>
        <div className="md:ml-auto text-muted-foreground">
          <p>Feels like {formatTemperature(weather.current.feelsLike, unit)}</p>
        </div>
      </div>

      {/* Weather Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Droplets className="w-5 h-5 text-rainy" />}
          label="Humidity"
          value={`${weather.current.humidity}%`}
        />
        <StatCard
          icon={<Wind className="w-5 h-5 text-cloudy" />}
          label="Wind"
          value={`${weather.current.windSpeed} km/h`}
          sublabel={weather.current.windDirection}
        />
        <StatCard
          icon={<Gauge className="w-5 h-5 text-muted-foreground" />}
          label="Pressure"
          value={`${weather.current.pressure} hPa`}
        />
        <StatCard
          icon={<WeatherIcon condition={weather.current.condition} size="sm" />}
          label="Condition"
          value={weather.current.description}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
}

function StatCard({ icon, label, value, sublabel }: StatCardProps) {
  return (
    <div className="bg-secondary/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="font-semibold">{value}</p>
      {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
    </div>
  );
}
