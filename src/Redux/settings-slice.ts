import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TemperatureUnit = 'C' | 'F';

interface SettingsState {
  unit: TemperatureUnit; // Celsius or Fahrenheit
  category: string; // Single category
}

const initialState: SettingsState = {
  unit: 'C',
  category: 'General', // Default category
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.unit = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
  },
});

export const { setUnit, setCategory } = settingsSlice.actions;
export default settingsSlice.reducer;
