import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ updateProfileImage }) {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [isNewPhoneNumber, setIsNewPhoneNumber] = useState(false);



  const handleTextPress = async () => {
    try {
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('@userFirstName');
      await AsyncStorage.removeItem('@userEmail');
      // Remove profile image data
      await AsyncStorage.removeItem('profileImage');
      // Remove phone number data
      await AsyncStorage.removeItem('@userPhoneNumber');

      // Set onboardingCompleted to false
      await AsyncStorage.setItem('@onboardingCompleted', 'false');

      // Update the profile image in App.js using the provided callback
      updateProfileImage(null);

      // Reset navigation stack and navigate to the Welcome screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  // Save the user's profile image URI to AsyncStorage
  const saveProfileImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('profileImage', imageUri || ''); // Use empty string if imageUri is falsy
    } catch (error) {
      // Handle any errors that may occur during the AsyncStorage operations
      console.error('Error saving profile image:', error);
    }
  };


  // Launch the image picker and update the profile image if an image is chosen
  const pickImage = async () => {
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
      // Update the profile image in App.js using the provided callback
      updateProfileImage(result.assets[0].uri);
    }
  };


  const handleRemoveImage = async () => {
    if (profileImage) {
      Alert.alert(
        'Remove Image',
        'Are you sure you want to remove your profile image?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: async () => {
              // Set the profile image to default
              setProfileImage(null);
              // Remove the profile image from AsyncStorage
              await AsyncStorage.removeItem('profileImage');
              // Update the profile image in App.js using the provided callback
              updateProfileImage(null);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // Display a message to the user that there is no profile image to remove
      Alert.alert('No Profile Image', 'There is no profile image to remove.');
    }
  };

  // Save the user's phone number to AsyncStorage
  const savePhoneNumber = async (phoneNumber) => {
    try {
      await AsyncStorage.setItem('@userPhoneNumber', phoneNumber || '');
    } catch (error) {
      console.error('Error saving phone number:', error);
    }
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    setIsNewPhoneNumber(true); // Set to true when the user starts entering a new phone number
  };

  const handleEditPhoneNumber = () => {
    setIsEditingPhoneNumber(true);
    setIsNewPhoneNumber(false); // Set to false when the user starts editing an existing phone number
  };

  const handleSavePhoneNumber = () => {
    // Check if the phone number is null or contains non-numeric characters
    if (phoneNumber == null || !/^\d+$/.test(phoneNumber)) {
      // Display an alert notifying the user
      Alert.alert('Error', 'Please enter a valid numeric phone number before saving.');
      return;
    }

    // Check if the phone number meets the minimum length requirement
    if (phoneNumber.length < 6) {
      // Display an alert notifying the user
      Alert.alert('Error', 'Please enter a phone number with a minimum length of 6 digits.');
      return;
    }

    // Check if the phone number meets the maximum length requirement
    if (phoneNumber.length > 15) {
      // Display an alert notifying the user
      Alert.alert('Error', 'Please enter a phone number with a maximum length of 15 digits.');
      return;
    }

    // Save phone number to AsyncStorage
    savePhoneNumber(phoneNumber);
    setIsEditingPhoneNumber(false);
    setIsNewPhoneNumber(false);
  };


  const handleDeletePhoneNumber = async () => {
    Alert.alert(
      'Delete Phone Number',
      'Are you sure you want to delete your phone number?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // Remove the phone number from AsyncStorage
            await AsyncStorage.removeItem('@userPhoneNumber');
            setPhoneNumber('');

            // Check if the phone number is deleted, then hide the delete button
            setIsEditingPhoneNumber(false);
            setIsNewPhoneNumber(true);
          },
        },
      ],
      { cancelable: true }
    );
  };

// Function to render the buttons based on isNewPhoneNumber and isEditingPhoneNumber states
const renderPhoneNumberButtons = () => {
  // Check if it's a new phone number
  if (isNewPhoneNumber) {
    // Render the button to save or edit the phone number
    return (
      <TouchableOpacity style={styles.changeButton} onPress={handleSavePhoneNumber}>
        <Text style={styles.changeButtonText}>
          {isEditingPhoneNumber ? 'Save Phone Number' : 'Add Phone Number'}
        </Text>
      </TouchableOpacity>
    );
  } else {
    // Render buttons for editing and deleting existing phone number
    return (
      <>
        <TouchableOpacity style={styles.changeButton} onPress={handleEditPhoneNumber}>
          <Text style={styles.changeButtonText}>
            {phoneNumber ? 'Edit Phone Number' : 'Add Phone Number'}
          </Text>
        </TouchableOpacity>

        {/* Render the "Delete Phone Number" button only if editing an existing phone number */}
        {isEditingPhoneNumber && (
          <TouchableOpacity style={styles.removeButton} onPress={handleDeletePhoneNumber}>
            <Text style={styles.removeButtonText}>Delete Phone Number</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
};

  useEffect(() => {
    // Fetch the user data from AsyncStorage
    const fetchUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('@userFirstName');
        const storedEmail = await AsyncStorage.getItem('@userEmail');
        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        const storedPhoneNumber = await AsyncStorage.getItem('@userPhoneNumber');

        // Set the state with the retrieved data
        setFirstName(storedFirstName);
        setEmail(storedEmail);
        setProfileImage(storedProfileImage); // Set the profile image from AsyncStorage
        setPhoneNumber(storedPhoneNumber); // Set the phone number from AsyncStorage

        // Set isNewPhoneNumber to true if there is no existing phone number
        setIsNewPhoneNumber(!storedPhoneNumber);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false whether data is fetched or not
      }
    };

    // Call the function to fetch user data
    fetchUserData();
  }, []); // Empty dependency array ensures useEffect runs only once, similar to componentDidMount


  // Display loading indicator based on the loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#495E57" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Personal information</Text>
      <View style={styles.rowContainer}>
        <View style={styles.imageContainer}>
          {/* Conditional rendering for profile image */}
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image source={require('../assets/profile_icon.png')} style={styles.placeholderImage} />
          )}
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.changeButtonText}>
              {profileImage ? 'Change' : 'Add Image'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>First Name:</Text>
      <View style={styles.rectangularFrame}>
        <Text style={styles.data}>{firstName}</Text>
      </View>
      <Text style={styles.label}>Email:</Text>
      <View style={styles.rectangularFrame}>
        <Text style={styles.data}>{email}</Text>
      </View>

      <Text style={styles.label}>Phone Number:</Text>
      <View style={styles.rectangularFrame}>
        <TextInput
          style={styles.data}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="Enter phone number"
          keyboardType="numeric" // Accepts only numeric input
          editable={isNewPhoneNumber || isEditingPhoneNumber || phoneNumber === ''}
        // Make TextInput editable in new number entry, editing mode, or when the phone number is empty
        />
      </View>

      <View style={styles.buttonsContainer}>{renderPhoneNumberButtons()}</View>
      
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
    padding: 8, // Add padding for spacing
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  imageContainer: {
    marginRight: 20,
    width: 100,
    height: 120,
  },
  profileImage: {
    resizeMode: 'center',
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  placeholderImage: {
    resizeMode: 'contain',
    borderRadius: 50,
    width: '90%',
    height: '100%',
  },
  label: {
    fontSize: 18,
    color: '#495E57',
    marginHorizontal: 8,
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
    paddingLeft: 8,
  },
  rectangularFrame: {
    width: '95%',
    borderColor: '#333333',
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 8,
  },
  changeButton: {
    backgroundColor: '#495E57',
    padding: 10,
    marginRight: 24,
    borderRadius: 10,
  },
  removeButton: {
    borderColor: '#F4CE14',
    borderWidth: 1,
    padding: 10,
    marginLeft: 5,
    borderRadius: 10,
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