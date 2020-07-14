import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import List from './List'
import Details from './Details'
import FindList from './FindList';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barstyle="dark-content" backgroundColor="white" hidden={true} />
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: "#000" },
                    headerTintColor: "white",
                    headerTitleStyle: { fontWeight: "bold" },
                }}>
                <Stack.Screen
                    name="Home"
                    component={List}
                    options={{
                        title: 'My Movies',
                    }}
                />
                <Stack.Screen name="Details" component={Details} />
                <Stack.Screen name="Search Result" component={FindList} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
