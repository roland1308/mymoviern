import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import List from './List'
import MovieDetails from './MovieDetails'
import TvDetails from './TvDetails'
import FindList from './FindList';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer
            documentTitle={{
                enabled: 'false'
            }}>
            <StatusBar hidden={true} />
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen
                    name="Home"
                    component={List}
                />
                <Stack.Screen name="Movie Details" component={MovieDetails} />
                <Stack.Screen name="Tv Details" component={TvDetails} />
                <Stack.Screen name="Search Result" component={FindList} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
