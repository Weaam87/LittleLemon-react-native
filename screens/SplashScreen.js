import React, { useEffect} from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem('@onboardingCompleted');
        navigation.replace(onboardingCompleted === 'true' ? 'Home' : 'Welcome');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Handle the error or redirect to the onboarding screen in case of an error
        navigation.replace('Welcome');
      }
    };

    checkOnboardingStatus();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/Logo.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 250,
    height: 100,
  },
});

export default SplashScreen;
