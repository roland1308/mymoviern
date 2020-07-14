import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout } from '@ui-kitten/components';
import { default as theme } from './custom-theme.json';

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import HomeScreen from './src/HomeScreen'

const store = configureStore()

export default () => (
  <Provider store={store}>
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <HomeScreen />
    </ApplicationProvider>
  </Provider>
);