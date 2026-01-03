import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, CloudSun } from 'lucide-react';
import { WeatherCondition } from '@/types/weather';
import { cn } from '@/lib/utils';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-20 h-20',
};

export function WeatherIcon({ condition, size = 'md', className }: WeatherIconProps) {
  const iconClass = cn(sizeClasses[size], className);

  switch (condition) {
    case 'sunny':
      return <Sun className={cn(iconClass, 'text-sunny')} />;
    case 'partly-cloudy':
      return <CloudSun className={cn(iconClass, 'text-sunny')} />;
    case 'cloudy':
      return <Cloud className={cn(iconClass, 'text-cloudy')} />;
    case 'rainy':
      return <CloudRain className={cn(iconClass, 'text-rainy')} />;
    case 'stormy':
      return <CloudLightning className={cn(iconClass, 'text-stormy')} />;
    case 'snowy':
      return <CloudSnow className={cn(iconClass, 'text-rainy')} />;
    case 'foggy':
      return <CloudFog className={cn(iconClass, 'text-cloudy')} />;
    default:
      return <Cloud className={cn(iconClass, 'text-cloudy')} />;
  }
}
