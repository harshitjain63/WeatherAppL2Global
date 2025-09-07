import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import HomeScreen from '../screens/home-screen';
import SettingsScreen from '../screens/settings-screen';
import NewsDetailsScreen from '../screens/news-details-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const renderTabIcon =
  (routeName: string) =>
  ({ color, size }: { color: string; size: number }) => {
    const icons: Record<string, string> = {
      Home: 'home',
      Settings: 'cog',
    };

    return <FontAwesome name={icons[routeName]} size={size} color={color} />;
  };

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: renderTabIcon(route.name),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsDetails"
          component={NewsDetailsScreen}
          options={{ title: 'News Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
