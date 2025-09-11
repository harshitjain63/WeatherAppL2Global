import { API_URL, WEATHER_API_KEY } from '@env';
import { client } from './axios-instance';
import { TemperatureUnit } from '../Redux/settings-slice';
import { AxiosError } from 'axios';
import { ToastAndroid } from 'react-native';

export const getWeather = async (
  lat: number,
  lon: number,
  unit: TemperatureUnit,
) => {
  try {
    const response = await client.get(`${API_URL}/forecast.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: `${lat},${lon}`,
        days: 5,
      },
    });

    const data = response.data;
    console.log('weatherdata', data);

    const currentTemp =
      unit === 'C' ? data.current.temp_c : data.current.temp_f;

    return {
      ...data,
      currentTemp,
    };
  } catch (error) {
    const axioserror = error as AxiosError<{ message?: string }>;
    const message =
      axioserror.response?.data?.message ||
      axioserror.message ||
      'Something went wrong while fetching weather';

    ToastAndroid.show(String(message), ToastAndroid.SHORT);
    console.error('Error fetching weather:', error);
    throw error;
  }
};
