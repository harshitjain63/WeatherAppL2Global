/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { setCategory, setUnit, TemperatureUnit } from '../Redux/settings-slice';

const categories = [
  'General',
  'World',
  'Nation',
  'Business',
  'Technology',
  'Entertainment',
  'Sports',
  'Science',
  'Health',
];

const SettingsScreen = () => {
  const dispatch = useAppDispatch();
  const unit = useAppSelector(state => state.settings.unit);
  const category = useAppSelector(state => state.settings.category);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text maxFontSizeMultiplier={1.2} style={styles.title}>
        Temperature Unit
      </Text>
      <View style={styles.buttonRow}>
        {(['C', 'F'] as TemperatureUnit[]).map(u => (
          <TouchableOpacity
            key={u}
            onPress={() => {
              Vibration.vibrate([0, 100, 200]);
              dispatch(setUnit(u));
            }}
            style={[
              styles.button,
              { backgroundColor: unit === u ? 'blue' : 'gray' },
            ]}
          >
            <Text style={styles.buttonText}>
              {u === 'C' ? 'Celsius' : 'Fahrenheit'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text maxFontSizeMultiplier={1.2} style={styles.title}>
        News Category
      </Text>
      <View style={styles.categoriesContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              Vibration.vibrate([0, 100, 200]);
              dispatch(setCategory(cat));
            }}
            style={[
              styles.categoryButton,
              { backgroundColor: category === cat ? 'blue' : 'gray' },
            ]}
          >
            <Text maxFontSizeMultiplier={1.2} style={styles.buttonText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.currentSelection}>
        <Text
          maxFontSizeMultiplier={1.2}
          style={{
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Selected Unit: {unit}
        </Text>
        <Text
          maxFontSizeMultiplier={1.2}
          style={{
            fontSize: 14,
            fontWeight: '400',
          }}
        >
          Selected Category: {category}
        </Text>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    padding: 10,
    borderRadius: 8,
    margin: 4,
    minWidth: '45%',
    alignItems: 'center',
  },
  currentSelection: {
    marginTop: 24,
  },
});
