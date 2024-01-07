import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function LittleLemonOnboarding() {

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  

  // validate the email input
  const validateEmail = () => {
    // use a simple regex to check the email format
    let regex = /\S+@\S+\.\S+/;
    // test the input value against the regex
    let isValid = regex.test(email);
    // if the email is not valid, set the error message
    if (!isValid) {
      setEmailError('Please enter a valid email address');
    } else {
      // if the email is valid, clear the error message
      setEmailError('');
    }
  };

  // validate the first name input
  const validateFirstName = () => {
    // check if the input is empty
    if (firstName === '') {
      setFirstNameError('First name is required');
      return;
    }
    // check if the input contains only letters
    let regex = /^[A-Za-z]+$/;
    if (!regex.test(firstName)) {
      setFirstNameError('First name must contain only letters');
      return;
    }
    // if no error, clear the error message
    setFirstNameError('');
  };

  const handleNext = () => {
    // Validate inputs before proceeding
    validateFirstName();
    validateEmail();

    // Check if there are any errors before proceeding
    if (!firstNameError && !emailError) {
      // do something with firstName and email
      console.log('First Name:', firstName);
      console.log('Email:', email);
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
          onChange={validateFirstName}
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
          onChange={validateEmail}
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
    fontSize: 30,
    color: '#F4CE14',
    marginTop:20,
  },
  input: {
    margin: 10,
    width: '80%',
  },
  label: {
    fontSize: 18,
    color: '#F4CE14',
    margin: 8,
  },
  textInput: {
    backgroundColor: '#b9b9b9',
    borderRadius: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#495E57',
    borderRadius: 10,
    padding: 10,
    marginTop: 70,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#F4CE14',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 14,
  },
});