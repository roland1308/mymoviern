import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, SafeAreaView, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import List from './src/List'
import Details from './src/Details'
import FindList from './src/FindList';

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
            headerRight: () => (
              <Button
                onPress={() => alert("menu")}
                title="Info"
                color="#fff"
              />
            ),
          }}
        />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Search Result" component={FindList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
