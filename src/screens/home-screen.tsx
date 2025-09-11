/* eslint-disable react/no-unstable-nested-components */
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
  Alert,
  Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { getWeather } from '../api/weather-api';
import { ForecastResponse } from '../types/weather';
import { getNews, NewsArticle } from '../api/news-api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../Redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShimmerPlaceholder } from '../component/shimmer-placeholder';

const buildQuery = ({
  weather,
  category,
}: {
  weather: ForecastResponse | null;
  category: string;
}) => {
  if (!weather) return category;
  let weatherQuery = 'General';
  if (weather.current.temp_c < 10) {
    weatherQuery = 'depression OR crisis OR sadness';
  } else if (weather.current.temp_c > 30) {
    weatherQuery = 'fear OR violence OR threat';
  } else {
    weatherQuery = 'happiness OR success OR victory';
  }
  return `${category} AND (${weatherQuery})`;
};

export default function HomeScreen() {
  const unit = useAppSelector(state => state.settings.unit);
  const category = useAppSelector(state => state.settings.category);
  const [weather, setWeather] = useState<ForecastResponse | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [retry, setRetry] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchWeather = useCallback(async () => {
    try {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const data = await getWeather(latitude, longitude, unit);
          setWeather(data);
        },
        error => {
          console.error('Location error:', error);

          if (error.code === 2) {
            setRetry(true);
            Alert.alert(
              'Location Disabled',
              'Please enable Location/GPS to fetch weather data.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Retry', onPress: () => fetchWeather() },
              ],
            );
            return;
          }

          if (error.code === 1) {
            Alert.alert('Location permission denied.');
            return;
          }

          Alert.alert('Unable to fetch location. Please try again.');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (err) {
      console.error(err);
    }
  }, [unit]);

  const fetchNews = useCallback(async () => {
    try {
      const query = buildQuery({ weather, category });
      if (!query) return;
      const data = await getNews(query);
      setNews(data.articles);
    } catch (err) {
      console.error(err);
    }
  }, [category, weather]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;
    try {
      setRefreshing(true);
      await fetchWeather();
      await fetchNews();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchNews, fetchWeather, refreshing]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (category) {
      setNews([]);
      fetchNews();
    }
  }, [category, fetchNews]);

  if (!weather) {
    return (
      <SafeAreaView style={{ flex: 1, paddingHorizontal: '16%', gap: 20 }}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
          Please Wait We Are Loading Data !
        </Text>
        {retry && (
          <Text
            maxFontSizeMultiplier={1.2}
            onPress={() => {
              Vibration.vibrate([0, 100, 200]);
              onRefresh();
            }}
            style={{
              alignSelf: 'center',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            Retry 🤓
          </Text>
        )}
        {Array.from({ length: 8 }).map((_, index) => (
          <ShimmerPlaceholder
            key={index}
            height={120}
            width={'100%'}
            borderRadius={12}
          />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F0F8FF' }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Current Weather */}
        <Text style={{ fontSize: 20, color: '#000', fontWeight: '600' }}>
          Current Temp:{' '}
          {unit === 'C' ? weather.current.temp_c : weather.current.temp_f}°
          {unit}
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
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                //alignItems: 'center',
                padding: 10,
                marginVertical: 6,
                backgroundColor: '#E6F7FF',
                borderRadius: 10,
                borderWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {item.date}
                </Text>
                <Image
                  source={{ uri: 'https:' + item.day.condition.icon }}
                  style={{ width: 40, height: 40 }}
                />
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600' }}>
                {unit === 'C' ? item.day.mintemp_c : item.day.mintemp_f}°{unit}-{' '}
                {unit === 'C' ? item.day.maxtemp_c : item.day.maxtemp_f}°{unit}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'blue' }}>
                {item.day.condition.text}
              </Text>
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
              <Text
                style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>
                {item.description}
              </Text>
              <Text style={{ fontSize: 12, color: '#007BFF' }}>
                Read more →
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => {
            return (
              <View style={{ gap: 20 }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  Please Wait We Are Loading Data !
                </Text>
                {Array.from({ length: 8 }).map((_, index) => (
                  <ShimmerPlaceholder
                    key={index}
                    height={120}
                    width={'100%'}
                    borderRadius={12}
                  />
                ))}
              </View>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
