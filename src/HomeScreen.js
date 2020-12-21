import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigation';
import {createStackNavigator} from '@react-navigation/stack';

import List from './List';
import MovieDetails from './MovieDetails';
import MovieDetailsRemove from './MovieDetailsRemove';
import TvDetails from './TvDetails';
import TvDetailsRemove from './TvDetailsRemove';
import FindList from './FindList';
import UserLists from './UserLists';
import TheOthersList from './TheOthersList';
import SuggestionsList from './SuggestionsList';
import SendSuggestion from './SendSuggestion';
import * as RootNavigation from './RootNavigation';

const Stack = createStackNavigator();

export default function HomeScreen() {
  if (RootNavigation.navigationRef.current) {
    let index = RootNavigation.navigationRef.current.getCurrentRoute().name;
    // console.log(index);
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      documentTitle={{
        enabled: 'false',
      }}
    >
      <StatusBar hidden={true} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name='Home' component={List} />
        <Stack.Screen name='Movie Details' component={MovieDetails} />
        <Stack.Screen
          name='Movie Details Remove'
          component={MovieDetailsRemove}
        />
        <Stack.Screen name='Tv Details' component={TvDetails} />
        <Stack.Screen name='Tv Details Remove' component={TvDetailsRemove} />
        <Stack.Screen name='Find List' component={FindList} />
        <Stack.Screen name='User Lists' component={UserLists} />
        <Stack.Screen name='The Other List' component={TheOthersList} />
        <Stack.Screen name='Suggestions List' component={SuggestionsList} />
        <Stack.Screen name='Send Suggestion' component={SendSuggestion} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
