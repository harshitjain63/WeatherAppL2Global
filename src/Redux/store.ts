import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settings-slice'; // adjust path if needed

export const store = configureStore({
  reducer: {
    settings: settingsReducer, // the key in store is 'settings'
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
