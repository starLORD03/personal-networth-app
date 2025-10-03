import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import AuthService from '../services/AuthService';

export default function WelcomeScreen() {
  const { setIsFirstLogin, user } = useContext(AppContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const capitalizeFirstLetter = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleContinue = async () => {
    try {
      setLoading(true);
      // Mark that user has completed first login
      await AsyncStorage.setItem('hasOpenedBefore', 'true');
      setIsFirstLogin(false);
      
      // Navigate to main app using replace to prevent back navigation
      navigation.replace('Main');
    } catch (error) {
      console.error('Navigation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupBiometric = async () => {
    try {
      // Check if biometric is available
      const biometricInfo = await AuthService.isBiometricAvailable();

      if (!biometricInfo.available) {
        Alert.alert('Not Supported', 'Biometric authentication is not supported on this device');
        return;
      }

      if (!biometricInfo.enrolled) {
        Alert.alert(
          'No Biometrics Enrolled',
          'Please enroll your fingerprint or face in app settings first'
        );
        return;
      }

      // Test biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to enable biometric login',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await AuthService.enableBiometric();
        Alert.alert(
          'Success!',
          'Biometric login has been enabled. You can now use it to login quickly.',
          [
            {
              text: 'OK',
              onPress: handleContinue,
            }
          ]
        );
      } else {
        Alert.alert('Failed', 'Biometric authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Biometric setup error:', error);
      Alert.alert('Error', 'Failed to setup biometric login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Personal Net Worth!</Text>
      <Text style={styles.subtitle}>Track your assets, transactions, and goals in one place.</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Hi, {capitalizeFirstLetter(user.name)}!
          </Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get Started</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={handleSetupBiometric}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Setup Biometric Login (Optional)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#F9FAFB' 
  },
    title: { 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 16, 
    textAlign: 'center',
    color: '#111827',
    letterSpacing: 0.3,
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 32,
    color: '#6B7280',
    lineHeight: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
    welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emailText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: { 
    backgroundColor: '#4285F4', 
    borderRadius: 12, 
    paddingVertical: 16, 
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  secondaryButtonText: {
    color: '#4285F4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
