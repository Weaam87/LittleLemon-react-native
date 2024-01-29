import { StyleSheet, View,Image, TouchableOpacity , Alert } from 'react-native';
import LittleLemonOnboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/Profile';
import React, { useState , useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  // Request permission to access the camera roll when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access camera roll was denied');
      }
    })();
  }, []);

  useEffect(() => {
    // Load the saved profile image when the component mounts
    loadProfileImage();
  }, []);

  // Load the saved profile image URI from AsyncStorage
  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
       setProfileImage(savedImage);
     }
    } catch (error) {
     console.error('Error loading profile image:', error);
     }
  };

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
                headerRight: () => (
                  <View style={styles.headerRightContainer}>
                    {/* Display profile image if available, otherwise show a placeholder */}
                    {profileImage ? (
                      <TouchableOpacity onPress={pickImage}>
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={pickImage}>
                      <Image
                        source={require('./assets/icon.png')} // Provide a placeholder image
                        style={styles.profileImage}
                      />
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
    logo:{
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
  });