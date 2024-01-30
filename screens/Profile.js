import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const handleTextPress = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('@userFirstName');
      await AsyncStorage.removeItem('@userEmail');
      // Remove profile image data
      await AsyncStorage.removeItem('profileImage');

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



  useEffect(() => {
    // Fetch the user data from AsyncStorage
    const fetchUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('@userFirstName');
        const storedEmail = await AsyncStorage.getItem('@userEmail');

        // Set the state with the retrieved data
        setFirstName(storedFirstName);
        setEmail(storedEmail);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the function to fetch user data
    fetchUserData();
  }, []); // Empty dependency array ensures useEffect runs only once, similar to componentDidMount

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <Text style={styles.data}>{firstName}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.data}>{email}</Text>

      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Press me to reset onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: '#495E57',
    marginVertical: 8,
  },
  data: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#495E57',
    marginVertical: 8,
    fontWeight: 'bold',
  },
});
