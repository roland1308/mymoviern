import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { createStackNavigator } from '@react-navigation/stack';

import List from './List'
import MovieDetails from './MovieDetails'
import TvDetails from './TvDetails'
import FindList from './FindList';
import UserLists from './UserLists';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer
            ref={navigationRef}
            documentTitle={{
                enabled: 'false'
            }}>
            <StatusBar hidden={true} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Home" component={List} />
                <Stack.Screen name="Movie Details" component={MovieDetails} />
                <Stack.Screen name="Tv Details" component={TvDetails} />
                <Stack.Screen name="Find List" component={FindList} />
                <Stack.Screen name="User Lists" component={UserLists} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
