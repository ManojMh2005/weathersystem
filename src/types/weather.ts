export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    condition: WeatherCondition;
    description: string;
  };
  forecast: ForecastDay[];
  lastUpdated: Date;
}

export interface ForecastDay {
  date: Date;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  description: string;
}

export type WeatherCondition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';

export interface GeoLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
