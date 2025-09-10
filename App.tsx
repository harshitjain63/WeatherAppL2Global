// App.tsx or index.tsx
import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/app-navigator';
import { store } from './src/Redux/store';

export default function Root() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
