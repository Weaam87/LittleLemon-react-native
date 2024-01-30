import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import LittleLemonOnboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/Profile';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('@userFirstName');
        console.log('Stored first name:', storedFirstName);

        // Set the state with the retrieved data
        setFirstName(storedFirstName);

        // Load the saved profile image URI from AsyncStorage
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }

        // Set loading to false only after getting all data from AsyncStorage
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle errors appropriately, e.g., show an error message to the user
        setIsLoading(false); // Set loading to false even if there's an error
      }
    };

    // Call the function to fetch user data and load profile image
    fetchData();
  }, []);


  // Save the provided image URI to AsyncStorage
  const saveProfileImage = async (imageUri) => {
    try {
      if (imageUri) {
        await AsyncStorage.setItem('profileImage', imageUri);
      } else {
        await AsyncStorage.removeItem('profileImage');
      }
    } catch (error) {
      console.error('Error saving profile image:', error);
    }
  };

  // Launch the image picker and update the profile image if an image is chosen
  const pickImage = async () => {
    // Check if the user already has a profile image
    if (profileImage) {
      // Display a confirmation dialog before proceeding
      Alert.alert(
        'Delete Profile Image',
        'Are you sure you want to delete your profile image?',
        [
          {
            text: 'Cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.canceled) {
                // If a new image is chosen, update the profile image and save it to AsyncStorage
                setProfileImage(result.assets[0].uri);
                saveProfileImage(result.assets[0].uri);
              } else {
                // If the user cancels and chooses to delete the image, set the default image
                setProfileImage(null);
                saveProfileImage(null);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // If the user doesn't have a profile image, proceed with choosing a new image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // If a new image is chosen, update the profile image and save it to AsyncStorage
        setProfileImage(result.assets[0].uri);
        saveProfileImage(result.assets[0].uri);
      }
    }
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
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
                headerRight: () => (
                  <View style={styles.headerRightContainer}>
                    {/* Display profile image if available, otherwise show the first and second letters of the user's first name */}
                    {profileImage ? (
                      <TouchableOpacity onPress={pickImage}>
                        <Image
                          source={{ uri: profileImage }}
                          style={styles.profileImage}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={pickImage}>
                        <View style={styles.profileImage}>
                          <Text style={styles.profileImageText}>
                            {firstName ? firstName.charAt(0) + (firstName.length > 1 ? firstName.charAt(1) : '') : 'NN'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                ),
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
  logo: {
    aspectRatio: 4, // width:height ratio of the original image (200:50)
    width: 120,
  },
  headerRightContainer: {
    margin: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  profileImageText: {
    fontSize: 18,
    color: '#F4CE14',
    textAlign: 'center',
    lineHeight: 50, // Line height to vertically center the text in the circle
    fontWeight: 'bold',
    width: 50,
    height: 50,
    borderRadius: 25, // Half of the width and height to make a perfect circle
    backgroundColor: '#495E57', // Color of the circle
    justifyContent: 'center', // Center the Text component vertically
    alignItems: 'center',
  },

});