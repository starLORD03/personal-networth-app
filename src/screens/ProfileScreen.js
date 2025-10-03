import React, { useContext, useState, useEffect } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  Switch, Image, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import AuthService from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser, setIsFirstLogin } = useContext(AppContext);
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
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

    const styles = createStyles(theme);

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
          theme={theme}
        />
        <MenuItem 
          icon="wallet-outline"
          title="Currency Settings"
          subtitle={user?.currency || 'INR'}
          onPress={() => navigation.navigate('CurrencySettings')}
          theme={theme}
        />
        <MenuItem 
          icon="shield-checkmark-outline"
          title="Security"
          onPress={() => navigation.navigate('Security')}
          theme={theme}
        />
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
                <MenuItemWithSwitch 
          icon="moon-outline"
          title="Dark Mode"
          subtitle="Enable dark theme"
          value={isDarkMode}
          onValueChange={toggleTheme}
          theme={theme}
        />
                <MenuItemWithSwitch 
          icon="notifications-outline"
          title="Notifications"
          subtitle="Push notifications"
          value={notifications}
          onValueChange={setNotifications}
          theme={theme}
        />
        <MenuItemWithSwitch 
          icon="finger-print"
          title="Biometric Login"
          subtitle="Use fingerprint or face ID"
          value={biometricEnabled}
          onValueChange={toggleBiometric}
          theme={theme}
        />
      </View>

      {/* Data & Privacy Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        
                <MenuItem 
          icon="download-outline"
          title="Export Data"
          onPress={() => Alert.alert('Export Data', 'Feature coming soon')}
          theme={theme}
        />
        <MenuItem 
          icon="trash-outline"
          title="Delete Account"
          onPress={() => Alert.alert('Delete Account', 'This feature is not yet available')}
          isDestructive
          theme={theme}
        />
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
                <MenuItem 
          icon="information-circle-outline"
          title="App Version"
          subtitle="1.0.0"
          theme={theme}
        />
        <MenuItem 
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms', 'Terms of Service')}
          theme={theme}
        />
        <MenuItem 
          icon="shield-outline"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy', 'Privacy Policy')}
          theme={theme}
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

function MenuItem({ icon, title, subtitle, onPress, isDestructive = false, theme }) {
  const styles = createStyles(theme);
  
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
          color={isDestructive ? theme.colors.error : theme.colors.textSecondary} 
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
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

function MenuItemWithSwitch({ icon, title, subtitle, value, onValueChange, theme }) {
  const styles = createStyles(theme);
  
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={theme.colors.textSecondary} />
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
        trackColor={{ 
          false: theme.colors.border, 
          true: theme.colors.primaryLight 
        }}
        thumbColor={value ? theme.colors.primary : theme.colors.surface}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
        borderColor: theme.colors.primary,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
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
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
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
    backgroundColor: theme.colors.card,
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
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
    borderBottomColor: theme.colors.borderLight,
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
    color: theme.colors.text,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
    destructiveText: {
    color: theme.colors.error,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    marginTop: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.errorContainer,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});