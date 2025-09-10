/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  // useColorScheme,
  PermissionsAndroid,
  Platform,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { getWeather } from '../api/weather-api';
import { ForecastResponse } from '../types/weather';
// import { ShimmerPlaceholder } from '../component/shimmer-placeholder';
import { getNews, NewsArticle } from '../api/news-api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../Redux/hooks';

export default function HomeScreen() {
  const unit = useAppSelector(state => state.settings.unit); // 'C' or 'F'
  const category = useAppSelector(state => state.settings.category); // e.g., 'General'

  const [weather, setWeather] = useState<ForecastResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // const isDarkMode = useColorScheme() === 'dark';
  let weatherQuery = 'general'; // fallback

  if (weather && weather.current.temp_c < 10) {
    weatherQuery = 'depression OR crisis OR sadness';
  } else if (weather && weather.current.temp_c > 30) {
    weatherQuery = 'fear OR violence OR threat';
  } else {
    weatherQuery = 'happiness OR success OR victory';
  }

  // Combine Redux category + weather query
  const finalQuery = `${category} AND (${weatherQuery})`;

  const fetchWeather = useCallback(async () => {
    try {
      setWeather(null);
      setRefreshing(true);
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude, unit);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const data = await getNews(finalQuery); // change query if needed
      setNews(data.articles);
    } catch (err) {
      console.error(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchWeather(), fetchNews()]);
    setRefreshing(false);
  }, [fetchNews, fetchWeather]);

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
          onRefresh();
        } else {
          console.log('Location permission denied');
        }
      } else {
        onRefresh();
      }
    };

    requestLocationPermission();
  }, [onRefresh]);

  if (!weather) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F0F8FF' }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Current Weather */}
      <Text style={{ fontSize: 20, color: '#000', fontWeight: '600' }}>
        Current Temp: {weather.current.temp_c}°C
      </Text>
      <Text>Condition: {weather.current.condition.text}</Text>

      {/* 5-Day Forecast */}
      <Text style={{ fontSize: 18, marginTop: 16, fontWeight: '600' }}>
        5-Day Forecast
      </Text>
      <FlatList
        data={weather.forecast.forecastday}
        keyExtractor={item => item.date}
        scrollEnabled={false} // disable nested scrolling
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
              {item.day.mintemp_c}°{unit} - {item.day.maxtemp_c}°{unit}
            </Text>
            <Text>{item.day.condition.text}</Text>
          </View>
        )}
      />

      {/* News Section */}
      <Text style={{ fontSize: 18, marginTop: 24, fontWeight: '600' }}>
        Latest News
      </Text>
      <FlatList
        data={news}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NewsDetails', { articleUrl: item.url })
            }
            style={{
              backgroundColor: '#fff',
              marginVertical: 8,
              padding: 12,
              borderRadius: 8,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={{ height: 160, borderRadius: 8, marginBottom: 8 }}
                resizeMode="cover"
              />
            ) : null}
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>
              {item.description}
            </Text>
            <Text style={{ fontSize: 12, color: '#007BFF' }}>Read more →</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}
