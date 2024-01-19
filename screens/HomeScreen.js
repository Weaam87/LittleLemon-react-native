import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleTextPress = async () => {
    try {
      // Set onboardingCompleted to false
      await AsyncStorage.setItem('@onboardingCompleted', 'false');

      // Reset navigation stack and navigate to the Welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Press me to reset onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});
