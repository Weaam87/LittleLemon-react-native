import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
      <View style={styles.rowContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/profile_icon.png')} style={styles.profileImage} />
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.text}>Personal information</Text>
      <Text style={styles.label}>First Name:</Text>
      <View style={styles.rectangularFrame}>
        <Text style={styles.data}>{firstName}</Text>
      </View>
      <Text style={styles.label}>Email:</Text>
      <View style={styles.rectangularFrame}>
        <Text style={styles.data}>{email}</Text>
      </View>

      <TouchableOpacity onPress={handleTextPress}>
        <Text style={styles.text}>Press me to reset onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start', // Align items to the left
    justifyContent: 'flex-start', // Align content at the top
    padding: 16, // Add padding for spacing
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 30,
    width: 100,
    height: 100,
    borderRadius: 50, // To make it a circle
    overflow: 'hidden', // Ensure the image stays within the circular container
  },
  profileImage: {
    resizeMode: 'contain',
    width: '90%',
    height: '100%', // Ensure the image takes the full height of the container
  },
  label: {
    fontSize: 18,
    color: '#495E57',
    marginVertical: 8,
  },
  data: {
    fontSize: 16,
    color: '#808080',
    margin: 8,
  },
  text: {
    fontSize: 24,
    color: '#333333',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  rectangularFrame: {
    width: '100%',
    paddingHorizontal: 8,
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 8,
  },
  changeButton: {
    backgroundColor: '#495E57',
    padding: 10,
    marginRight: 20,
    borderRadius: 5,
  },
  removeButton: {
    borderColor: '#F4CE14',
    borderWidth: 1,
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#F4CE14',
    textAlign: 'center',
    margin: 4,
  },
  removeButtonText: {
    color: '#495E57',
    textAlign: 'center',
    margin: 4,
  },
});