import React, { useContext, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  Switch, Image, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser, setIsFirstLogin } = useContext(AppContext);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  React.useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const enabled = await AuthService.isBiometricEnabled();
    setBiometricEnabled(enabled);
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all stored data
              await AuthService.logout();
              await AsyncStorage.removeItem('hasOpenedBefore');
              
              // Reset context
              setUser(null);
              setIsFirstLogin(true);
              
              // Navigate to Login
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const toggleBiometric = async (value) => {
    if (value) {
      // Enable biometric
      const result = await AuthService.authenticateWithBiometrics();
      if (result.success) {
        await AuthService.enableBiometric();
        setBiometricEnabled(true);
        Alert.alert('Success', 'Biometric authentication enabled');
      } else {
        Alert.alert('Failed', 'Could not enable biometric authentication');
      }
    } else {
      // Disable biometric
      Alert.alert(
        'Disable Biometric',
        'Are you sure you want to disable biometric login?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await AuthService.disableBiometric();
              setBiometricEnabled(false);
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user?.profilePic ? (
            <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.profileName}>
          {user?.name ? capitalizeFirstLetter(user.name) : 'User'}
        </Text>
        <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <MenuItem 
          icon="person-outline"
          title="Personal Information"
          onPress={handleEditProfile}
        />
        <MenuItem 
          icon="wallet-outline"
          title="Currency Settings"
          subtitle={user?.currency || 'INR'}
          onPress={() => navigation.navigate('CurrencySettings')}
        />
        <MenuItem 
          icon="shield-checkmark-outline"
          title="Security"
          onPress={() => navigation.navigate('Security')}
        />
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <MenuItemWithSwitch 
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Enable dark theme"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <MenuItemWithSwitch 
          icon="notifications-outline"
          title="Notifications"
          subtitle="Push notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <MenuItemWithSwitch 
          icon="finger-print"
          title="Biometric Login"
          subtitle="Use fingerprint or face ID"
          value={biometricEnabled}
          onValueChange={toggleBiometric}
        />
      </View>

      {/* Data & Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        
        <MenuItem 
          icon="download-outline"
          title="Export Data"
          onPress={() => Alert.alert('Export Data', 'Feature coming soon')}
        />
        <MenuItem 
          icon="trash-outline"
          title="Delete Account"
          onPress={() => Alert.alert('Delete Account', 'This feature is not yet available')}
          isDestructive
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <MenuItem 
          icon="information-circle-outline"
          title="App Version"
          subtitle="1.0.0"
        />
        <MenuItem 
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms', 'Terms of Service')}
        />
        <MenuItem 
          icon="shield-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy', 'Privacy Policy')}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

function MenuItem({ icon, title, subtitle, onPress, isDestructive = false }) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons 
          name={icon} 
          size={22} 
          color={isDestructive ? '#DC2626' : '#6B7280'} 
        />
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, isDestructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );
}

function MenuItemWithSwitch({ icon, title, subtitle, value, onValueChange }) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color="#6B7280" />
        <View style={styles.menuItemText}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Switch 
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
        thumbColor={value ? '#3B82F6' : '#F3F4F6'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  destructiveText: {
    color: '#DC2626',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});