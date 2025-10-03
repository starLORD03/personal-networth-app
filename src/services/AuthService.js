// services/AuthService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

class AuthService {
  constructor() {
    this.STORAGE_KEYS = {
      USER_TOKEN: 'user_token',
      USER_DATA: 'user_data',
      BIOMETRIC_ENABLED: 'biometric_enabled',
      FIRST_LOGIN: 'first_login',
      APP_PIN: 'app_pin'
    };
  }

  // Check if biometric authentication is available
  async isBiometricAvailable() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      return {
        available: hasHardware && isEnrolled,
        types: supportedTypes,
        hasHardware,
        isEnrolled
      };
    } catch (error) {
      console.error('Biometric check failed:', error);
      return { available: false, types: [], hasHardware: false, isEnrolled: false };
    }
  }

  // Authenticate with biometrics
  async authenticateWithBiometrics() {
    try {
      const biometricInfo = await this.isBiometricAvailable();
      
      if (!biometricInfo.available) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your financial data',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: true,
      });

      if (result.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || 'Authentication failed',
          warning: result.warning 
        };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Store sensitive data securely
  async storeSecureData(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      await SecureStore.setItemAsync(key, jsonData);
      return true;
    } catch (error) {
      console.error('Secure storage failed:', error);
      return false;
    }
  }

  // Retrieve sensitive data securely
  async getSecureData(key) {
    try {
      const data = await SecureStore.getItemAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      return null;
    }
  }

  // Store user session
  async storeUserSession(userData, tokens) {
    try {
      await this.storeSecureData(this.STORAGE_KEYS.USER_DATA, userData);
      await this.storeSecureData(this.STORAGE_KEYS.USER_TOKEN, tokens);
      return true;
    } catch (error) {
      console.error('Session storage failed:', error);
      return false;
    }
  }

  // Get stored user session
  async getUserSession() {
    try {
      const userData = await this.getSecureData(this.STORAGE_KEYS.USER_DATA);
      const tokens = await this.getSecureData(this.STORAGE_KEYS.USER_TOKEN);
      
      return { userData, tokens };
    } catch (error) {
      console.error('Session retrieval failed:', error);
      return { userData: null, tokens: null };
    }
  }

  // Clear user session
  async clearUserSession() {
    try {
      await SecureStore.deleteItemAsync(this.STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(this.STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.FIRST_LOGIN);
      return true;
    } catch (error) {
      console.error('Session clear failed:', error);
      return false;
    }
  }

  // Enable/Disable biometric authentication
  async setBiometricEnabled(enabled) {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
      return true;
    } catch (error) {
      console.error('Biometric setting failed:', error);
      return false;
    }
  }

  // Check if biometric is enabled
  async isBiometricEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  // **NEW METHODS BELOW**

  // Enable biometric authentication
  async enableBiometric() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      return true;
    } catch (error) {
      console.error('Enable biometric failed:', error);
      return false;
    }
  }

  // Disable biometric authentication
  async disableBiometric() {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
      return true;
    } catch (error) {
      console.error('Disable biometric failed:', error);
      return false;
    }
  }

  // Logout - clears all user data
  async logout() {
    try {
      await SecureStore.deleteItemAsync(this.STORAGE_KEYS.USER_DATA);
      await SecureStore.deleteItemAsync(this.STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.BIOMETRIC_ENABLED);
      await AsyncStorage.removeItem(this.STORAGE_KEYS.FIRST_LOGIN);
      await AsyncStorage.removeItem('hasOpenedBefore');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Update user data
  async updateUserData(userData) {
    try {
      await this.storeSecureData(this.STORAGE_KEYS.USER_DATA, userData);
      return true;
    } catch (error) {
      console.error('Update user data failed:', error);
      return false;
    }
  }

  // Validate Google user data
  validateGoogleUserData(userData) {
    const required = ['id', 'name', 'email'];
    const missing = required.filter(field => !userData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      profilePic: userData.picture || null,
      currency: 'INR',
      loginMethod: 'google',
      createdAt: new Date().toISOString()
    };
  }
}

export default new AuthService();