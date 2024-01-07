import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import LittleLemonOnboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name='Welcome' component={LittleLemonOnboarding} />
            <Stack.Screen name='Home' component={HomeScreen}/>
          </Stack.Navigator>
        </View>
    </NavigationContainer>
   );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
