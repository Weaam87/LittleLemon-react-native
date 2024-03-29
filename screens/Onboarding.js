import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//updateFirstName - Callback function to update the first name in the parent component.
export default function LittleLemonOnboarding({ updateFirstName }) {

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigation = useNavigation();

  // validate the email input
  const validateEmail = () => {
    let regex = /\S+@\S+\.\S+/;
    let isValid = regex.test(email);
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
    return isValid; // Return the validation result
  };

  // validate the first name input
  const validateFirstName = () => {
    if (firstName === '') {
      setFirstNameError('First name is required');
      return false;
    }
    let regex = /^[A-Za-z]+$/;
    if (!regex.test(firstName)) {
      setFirstNameError('First name must contain only letters');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const handleNext = async () => {
    const isFirstNameValid = validateFirstName();
    const isEmailValid = validateEmail();

    if (isFirstNameValid && isEmailValid) {
      // Save data to AsyncStorage if needed
      try {
        await AsyncStorage.setItem('@userFirstName', firstName);
        await AsyncStorage.setItem('@userEmail', email);
        await AsyncStorage.setItem('@onboardingCompleted', 'true');
      } catch (error) {
        console.error('Error saving data:', error);
      }

      // Update the firstName in the App.js component using the provided callback
      updateFirstName(firstName);

      // Navigate to the Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };




  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/Logo.png')} />
      </View>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Let us get to know you</Text>
      </View>
      <View style={styles.input}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.textInput}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          onBlur={validateFirstName}
        />
        {/* display the error message */}
        <Text style={styles.errorText}>{firstNameError}</Text>
      </View>
      <View style={styles.input}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          onBlur={validateEmail}
        />
        {/* display the error message */}
        <Text style={styles.errorText}>{emailError}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#808080',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    backgroundColor: '#b9b9b9',
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    resizeMode: 'contain',
    width: 250,
    height: 100,
  },
  heading: {
    margin: 10,
  },
  headingText: {
    fontSize: 40,
    color: '#F4CE14',
    marginTop: 20,
    fontFamily: 'markaziBold',
  },
  input: {
    margin: 10,
    width: '80%',
  },
  label: {
    fontSize: 24,
    color: '#495E57',
    margin: 4,
    fontFamily: 'KarlaBold',
  },
  textInput: {
    backgroundColor: '#b9b9b9',
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Karla',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#495E57',
    borderRadius: 10,
    padding: 8,
    marginTop: 70,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#F4CE14',
    fontFamily: 'markaziBold',
  },
  errorText: {
    color: '#EE9972',
    fontSize: 14,
    fontFamily: 'KarlaBold',
    padding: 4,
  },
});