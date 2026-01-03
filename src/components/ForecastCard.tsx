import { ForecastDay, TemperatureUnit } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';
import { formatTemperature } from '@/lib/temperature';
import { format } from 'date-fns';

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: TemperatureUnit;
}

export function ForecastCard({ forecast, unit }: ForecastCardProps) {
  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div
            key={day.date.toISOString()}
            className="flex items-center justify-between py-3 border-b border-glass-border last:border-0"
            style={{ animationDelay: `${0.1 + index * 0.05}s` }}
          >
            <div className="flex items-center gap-3 flex-1">
              <p className="text-sm font-medium w-24">
                {format(day.date, 'EEE d MMM')}
              </p>
              <WeatherIcon condition={day.condition} size="sm" />
              <p className="text-sm text-muted-foreground hidden sm:block">
                {day.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{formatTemperature(day.tempMax, unit)}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{formatTemperature(day.tempMin, unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
