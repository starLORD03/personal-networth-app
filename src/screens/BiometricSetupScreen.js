import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/AuthService';

export default function BiometricSetupScreen({ navigation }) {
  const [isSetup, setIsSetup] = useState(false);

  const enableBiometric = async () => {
    setIsSetup(true);
    try {
      const result = await AuthService.authenticateWithBiometrics();
      if (result.success) {
        await AuthService.setBiometricEnabled(true);
        Alert.alert(
          'Success!',
          'Biometric authentication has been enabled.',
          [{ text: 'Continue', onPress: () => navigation.replace('Main') }]
        );
      } else {
        Alert.alert('Setup Failed', result.error || 'Could not enable biometric authentication');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to setup biometric authentication');
    }
    setIsSetup(false);
  };

  const skipBiometric = async () => {
    await AuthService.setBiometricEnabled(false);
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="finger-print" size={80} color="#4285F4" />
        </View>
        
        <Text style={styles.title}>Secure Your Financial Data</Text>
        <Text style={styles.description}>
          Enable biometric authentication to add an extra layer of security to your personal financial information.
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            <Text style={styles.featureText}>Enhanced Security</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="flash" size={24} color="#10B981" />
            <Text style={styles.featureText}>Quick Access</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="lock-closed" size={24} color="#10B981" />
            <Text style={styles.featureText}>Private & Secure</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.enableButton}
          onPress={enableBiometric}
          disabled={isSetup}
        >
          {isSetup ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.enableButtonText}>Enable Biometric Security</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={skipBiometric}
          disabled={isSetup}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  features: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
  },
  enableButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  enableButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});