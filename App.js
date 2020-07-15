import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { default as theme } from './custom-theme.json';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';

import HomeScreen from './src/HomeScreen'
import TopBar from './src/TopBar';
import Separator from './src/components/Separator';

const store = configureStore()

export default () => (
  <Provider store={store}>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
      <TopBar />
      <Separator />
      <HomeScreen />
    </ApplicationProvider>
  </Provider>
);