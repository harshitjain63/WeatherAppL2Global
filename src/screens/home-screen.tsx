/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  useColorScheme,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { getWeather } from '../api/weather-api';
import { ForecastResponse } from '../types/weather';
import { ShimmerPlaceholder } from '../component/shimmer-placeholder';

export default function HomeScreen() {
  const [weather, setWeather] = useState<ForecastResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const fetchWeather = async () => {
    try {
      setWeather(null);
      setRefreshing(true);
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude);
          setWeather(data);
          setRefreshing(false);
        },
        error => {
          console.error('Location error:', error);
          setRefreshing(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const grantedPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to fetch weather data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (grantedPermission === PermissionsAndroid.RESULTS.GRANTED) {
          fetchWeather();
        } else {
          console.log('Location permission denied');
        }
      } else {
        fetchWeather();
      }
    };

    requestLocationPermission();
  }, []);

  if (!weather) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F8FF', padding: 16 }}>
      <Text style={{ fontSize: 20, color: '#000', fontWeight: '600' }}>
        Current Temp: {weather.current.temp_c}°C
      </Text>
      <Text>Condition: {weather.current.condition.text}</Text>

      <Text style={{ fontSize: 18, marginTop: 16, fontWeight: '600' }}>
        5-Day Forecast
      </Text>
      <FlatList
        data={weather.forecast.forecastday}
        keyExtractor={item => item.date}
        ListEmptyComponent={() => {
          if (refreshing) {
            return (
              <View
                style={{
                  flex: 1,
                  // backgroundColor:
                  //   isDarkMode === 'dark' ? 'black' : '#EFF7FE',
                  paddingTop: 5,
                  gap: 20,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Please Wait, we are working on it
                </Text>
                {Array.from({ length: 8 }).map((_, index) => (
                  <ShimmerPlaceholder
                    key={index}
                    borderRadius={14}
                    height={80}
                    width={'100%'}
                  />
                ))}
              </View>
            );
          }
          return (
            <View
              style={{
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: 'red',
                }}
              >
                No Data Found !!
              </Text>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchWeather} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              marginVertical: 6,
              backgroundColor: '#E6F7FF',
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.date}</Text>
            <Image
              source={{ uri: 'https:' + item.day.condition.icon }}
              style={{ width: 40, height: 40 }}
            />
            <Text>
              {item.day.mintemp_c}°C - {item.day.maxtemp_c}°C
            </Text>
            <Text>{item.day.condition.text}</Text>
          </View>
        )}
      />
    </View>
  );
}
