import { API_URL, WEATHER_API_KEY } from '@env';
import { client } from './axios-instance';
import { TemperatureUnit } from '../Redux/settings-slice';

export const getWeather = async (
  lat: number,
  lon: number,
  unit: TemperatureUnit,
) => {
  try {
    const response = await client.get(`${API_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: `${lat},${lon}`, // q can be "city" or "lat,lon"
        days: 5, // 5 days forecast
      },
    });
    console.log('Weather Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};
