import { TemperatureUnit } from '@/types/weather';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return celsius;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const temp = convertTemperature(celsius, unit);
  const symbol = unit === 'celsius' ? '°C' : '°F';
  return `${temp}${symbol}`;
}
