export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherCondition;
  wind_mph: number;
  wind_kph: number;
  humidity: number;
  feelslike_c: number;
  feelslike_f: number;
}

export interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    condition: WeatherCondition;
    maxtemp_f: number;
    mintemp_f: number;
  };
}

export interface Forecast {
  forecastday: ForecastDay[];
}

export interface LocationInfo {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface ForecastResponse {
  location: LocationInfo;
  current: CurrentWeather;
  forecast: Forecast;
}
