import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { AppDispatch, RootState } from '../Redux/store';
import { setCategory, setUnit } from '../Redux/settings-slice';
import { useSelector, useDispatch } from 'react-redux';

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
  const dispatch: AppDispatch = useDispatch();

  // Read values from Redux
  const unit = useSelector((state: RootState) => state.settings.unit);
  const category = useSelector((state: RootState) => state.settings.category);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Temperature Unit</Text>
      <View style={styles.buttonRow}>
        <Button
          title="Celsius"
          onPress={() => dispatch(setUnit('C'))}
          color={unit === 'C' ? 'blue' : 'gray'}
        />
        <Button
          title="Fahrenheit"
          onPress={() => dispatch(setUnit('F'))}
          color={unit === 'F' ? 'blue' : 'gray'}
        />
      </View>

      <Text style={styles.title}>News Category</Text>
      <View style={styles.categoriesContainer}>
        {categories.map(cat => (
          <Button
            key={cat}
            title={cat}
            onPress={() => dispatch(setCategory(cat))}
            color={category === cat ? 'blue' : 'gray'}
          />
        ))}
      </View>

      <View style={styles.currentSelection}>
        <Text>Selected Unit: {unit}</Text>
        <Text>Selected Category: {category}</Text>
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  currentSelection: {
    marginTop: 24,
  },
});
