import { TemperatureUnit } from '@/types/weather';
import { cn } from '@/lib/utils';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="glass-card inline-flex p-1 gap-1">
      <button
        onClick={() => onToggle('celsius')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          unit === 'celsius'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        °C
      </button>
      <button
        onClick={() => onToggle('fahrenheit')}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          unit === 'fahrenheit'
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        °F
      </button>
    </div>
  );
}
