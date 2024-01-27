import { StyleSheet, View,Image } from 'react-native';
import LittleLemonOnboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/Profile';
import React, { useState , useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout as needed
  }, []);
  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Welcome" component={LittleLemonOnboarding} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                headerTitle: () => (
                  <Image
                    source={require('./assets/Logo.png')}
                    style={styles.logo}
                  />
                ),
                headerTitleAlign: 'center',
              }}
            />
          </Stack.Navigator>
        </View>
      )}
    </NavigationContainer>
  );
  
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo:{
    aspectRatio: 4, // width:height ratio of the original image (200:50)
    width: 120,
  },
});