import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';

/**
 * Temporary Debug Panel for OAuth Troubleshooting
 * Add this to your LoginScreen to debug OAuth issues
 * 
 * Usage:
 * import DebugPanel from '../components/DebugPanel';
 * <DebugPanel />
 */
export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const initialUrl = await Linking.getInitialURL();
      const canOpenExp = await Linking.canOpenURL('exp://');
      const canOpenNetworth = await Linking.canOpenURL('networth://');
      
      const { userData, tokens } = await AuthService.getUserSession();
      const biometricAvailable = await AuthService.isBiometricAvailable();
      const biometricEnabled = await AuthService.isBiometricEnabled();
      
      const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
      
      setDebugInfo({
        initialUrl: initialUrl || 'None',
        canOpenExp,
        canOpenNetworth,
        hasUserSession: !!userData,
        userEmail: userData?.email || 'None',
        hasTokens: !!tokens,
        biometricAvailable: biometricAvailable.available,
        biometricEnabled,
        hasOpenedBefore: hasOpenedBefore === 'true',
        backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL || 'Not set',
      });
    } catch (error) {
      console.error('Debug info load failed:', error);
    }
  };

  const testDeepLink = async () => {
    const testUrl = 'exp://192.168.0.101:19000/--/auth?token=test123';
    Alert.alert(
      'Test Deep Link',
      `Attempting to open:\n${testUrl}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: async () => {
            const canOpen = await Linking.canOpenURL(testUrl);
            if (canOpen) {
              Linking.openURL(testUrl);
            } else {
              Alert.alert('Error', 'Cannot open this URL');
            }
          },
        },
      ]
    );
  };

  const clearSession = async () => {
    Alert.alert(
      'Clear Session',
      'This will log you out and clear all stored data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AuthService.clearUserSession();
            await AsyncStorage.clear();
            Alert.alert('Success', 'Session cleared. Please restart the app.');
            loadDebugInfo();
          },
        },
      ]
    );
  };

  const copyToClipboard = (text) => {
    // Note: expo-clipboard needed for this
    Alert.alert('Debug Info', JSON.stringify(debugInfo, null, 2));
  };

  if (!visible) {
    return (
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.debugButtonText}>🐛 Debug</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🐛 Debug Panel</Text>
        <TouchableOpacity onPress={() => setVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Network & URLs</Text>
        <DebugItem label="Backend URL" value={debugInfo.backendUrl} />
        <DebugItem label="Initial URL" value={debugInfo.initialUrl} />
        <DebugItem label="Can Open exp://" value={debugInfo.canOpenExp ? '✅ Yes' : '❌ No'} />
        <DebugItem label="Can Open networth://" value={debugInfo.canOpenNetworth ? '✅ Yes' : '❌ No'} />

        <Text style={styles.sectionTitle}>User Session</Text>
        <DebugItem label="Has Session" value={debugInfo.hasUserSession ? '✅ Yes' : '❌ No'} />
        <DebugItem label="Email" value={debugInfo.userEmail} />
        <DebugItem label="Has Tokens" value={debugInfo.hasTokens ? '✅ Yes' : '❌ No'} />
        <DebugItem label="Opened Before" value={debugInfo.hasOpenedBefore ? 'Yes' : 'No'} />

        <Text style={styles.sectionTitle}>Biometric</Text>
        <DebugItem label="Available" value={debugInfo.biometricAvailable ? '✅ Yes' : '❌ No'} />
        <DebugItem label="Enabled" value={debugInfo.biometricEnabled ? 'Yes' : 'No'} />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={testDeepLink}>
            <Text style={styles.actionButtonText}>Test Deep Link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={clearSession}>
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Clear Session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={loadDebugInfo}>
            <Text style={styles.actionButtonText}>Refresh Info</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => copyToClipboard(debugInfo)}>
            <Text style={styles.actionButtonText}>Show Full Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>📖 Quick Fixes:</Text>
          <Text style={styles.instructionsText}>
            1. Check Metro bundler for your IP{'\n'}
            2. Update api/auth/callback.js with that IP{'\n'}
            3. Deploy to Vercel{'\n'}
            4. Run: npx expo start --clear{'\n'}
            5. Test OAuth login again
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const DebugItem = ({ label, value }) => (
  <View style={styles.debugItem}>
    <Text style={styles.debugLabel}>{label}:</Text>
    <Text style={styles.debugValue}>{String(value)}</Text>
  </View>
);

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  debugButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#fff',
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 16,
    marginBottom: 8,
  },
  debugItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  debugLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    flex: 1,
  },
  debugValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  dangerButton: {
    backgroundColor: '#EF4444',
  },
  dangerButtonText: {
    color: '#fff',
  },
  instructions: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#D1D5DB',
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
