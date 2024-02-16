import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import LittleLemonOnboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import ProfileScreen from './screens/Profile';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState('');

  // Update the first name state asynchronously
  const updateFirstName = async (newFirstName) => {
    // Set the new first name in the component's state
    setFirstName(newFirstName);
  };

  // Update the profile image asynchronously
  const updateProfileImage = async (newProfileImage) => {
    // Set the new first name in the component's state
    setProfileImage(newProfileImage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('@userFirstName');

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
  }, []); // Empty dependency array to run once on mount


  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

            {/*Pass the function as children to 'Screen' instead of using the 'component' prop.
                This prevents the component from being recreated on every render, improving performance.
                component={(props) => <LittleLemonOnboarding {...props} updateFirstName={updateFirstName} />}
                .............................................................................................
                Render the LittleLemonOnboarding component with necessary props:
                  - props: navigation and other route-related properties
                  - updateFirstName: callback function to update the first name in App.js state*/}
            <Stack.Screen name="Welcome">
              {(props) => <LittleLemonOnboarding {...props} updateFirstName={updateFirstName} />}
            </Stack.Screen>

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerTitle: () => (
                  <Image
                    source={require('./assets/Logo.png')}
                    style={styles.logo}
                  />
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <View style={styles.headerContainer}>
                    {/* Display profile image if available, otherwise show the first and second letters of the user's first name */}
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={styles.profileImage}>
                        <Text style={styles.imageText}>
                          {firstName ? firstName.charAt(0) + (firstName.length > 1 ? firstName.charAt(1) : '') : 'NN'}
                        </Text>
                      </View>
                    )}
                  </View>
                ),
                headerBackVisible: false,
              }}
            />

            <Stack.Screen
              name="Profile"
              options={({ navigation }) => ({
                headerTitle: () => (
                  <Image
                    source={require('./assets/Logo.png')}
                    style={styles.logo}
                  />
                ),
                headerTitleAlign: 'center',
                headerRight: () => (
                  <View style={styles.headerContainer}>
                    {/* Display profile image if available, otherwise show the first and second letters of the user's first name */}
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <View style={styles.profileImage}>
                        <Text style={styles.imageText}>
                          {firstName ? firstName.charAt(0) + (firstName.length > 1 ? firstName.charAt(1) : '') : 'NN'}
                        </Text>
                      </View>
                    )}
                  </View>
                ),
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.headerContainer}>
                      <View style={styles.imageText}>
                        <Image
                          source={require('./assets/arrow.png')}
                          style={styles.arrow}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ),
                headerBackVisible: false, // This will hide the default back button
              })}
            >
              {/* UpdateProfileImage: Callback function to update the profile image in App.js state*/}
              {props => <ProfileScreen {...props} updateProfileImage={updateProfileImage} />}
            </Stack.Screen>
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
    width: 160,
  },
  headerContainer: {
    margin: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  imageText: {
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
  arrow: {
    width: 40,
    height: 40,
  }

});