import { useContext, useEffect, useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, Image
} from 'react-native';
import { AppContext } from '../context/AppContext';
import AuthService from '../services/AuthService';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ||
  'https://networth-auth-backend.vercel.app';

// IMPORTANT: Complete WebBrowser session when auth is done
WebBrowser.maybeCompleteAuthSession();

import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUser, setIsFirstLogin } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const authInProgress = useRef(false);
  const loadingTimeout = useRef(null);

useEffect(() => {
  const initialize = async () => {
    const isBiometricAvail = await checkBiometricAvailability();
    await checkExistingSession(isBiometricAvail);
    
    // Auto-trigger biometric if enabled and available
    if (isBiometricAvail && hasExistingSession) {
      const biometricEnabled = await AuthService.isBiometricEnabled();
      if (biometricEnabled) {
        // Wait a bit for UI to render, then prompt
        setTimeout(() => {
          handleBiometricLogin();
        }, 800);
      }
    }
  };
  
  initialize();
  
  const subscription = Linking.addEventListener('url', handleDeepLink);
  
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('Initial URL:', url);
      handleDeepLink({ url });
    }
  });
  
  return () => {
    subscription.remove();
    if (loadingTimeout.current) {
      clearTimeout(loadingTimeout.current);
    }
  };
}, [hasExistingSession]); 


const handleDeepLink = async (event) => {
  const url = event.url;
  console.log('Deep link received:', url);
  
  if (loadingTimeout.current) {
    clearTimeout(loadingTimeout.current);
    loadingTimeout.current = null;
  }

  if (authInProgress.current && !url.includes('token=')) {
    console.log('Auth already in progress, ignoring duplicate event');
    return;
  }

  try {
    // Parse URL - handle both formats: networth://auth?token=... and exp://...--/auth?token=...
    let token = null;
    let error = null;

    // Try to parse with Linking
    const parsed = Linking.parse(url);
    console.log('Parsed URL:', parsed);

    if (parsed.queryParams?.token) {
      token = parsed.queryParams.token;
    } else if (parsed.queryParams?.error) {
      error = parsed.queryParams.error;
    }

    // Fallback: manual parsing if Linking.parse didn't work
    if (!token && !error) {
      const urlObj = new URL(url.replace('networth://', 'https://'));
      token = urlObj.searchParams.get('token');
      error = urlObj.searchParams.get('error');
    }

    // Another fallback: regex extraction
    if (!token && !error && url.includes('token=')) {
      const tokenMatch = url.match(/token=([^&]+)/);
      if (tokenMatch) token = tokenMatch[1];
    }

    if (!token && !error && url.includes('error=')) {
      const errorMatch = url.match(/error=([^&]+)/);
      if (errorMatch) error = decodeURIComponent(errorMatch[1]);
    }

    console.log('Extracted token:', token ? 'present' : 'missing');
    console.log('Extracted error:', error);

    if (token) {
      authInProgress.current = true;
      await handleAuthSuccess(token);
    } else if (error) {
      setLoading(false);
      authInProgress.current = false;
      Alert.alert('Authentication Error', error);
    } else {
      console.log('Deep link received but no token or error found');
      setLoading(false);
      authInProgress.current = false;
    }
  } catch (error) {
    console.error('Deep link handling error:', error);
    setLoading(false);
    authInProgress.current = false;
    Alert.alert('Error', 'Failed to process authentication');
  }
};
  //     const handleDeepLink = async (event) => {
  //   const url = event.url;
  //   console.log('Deep link received:', url);

  //   // Clear any loading timeout
  //   if (loadingTimeout.current) {
  //     clearTimeout(loadingTimeout.current);
  //     loadingTimeout.current = null;
  //   }

  //   // Prevent duplicate processing
  //   if (authInProgress.current && !url.includes('token=')) {
  //     console.log('Auth already in progress, ignoring duplicate event');
  //     return;
  //   }

  //   try {
  //     // Parse the URL to extract parameters
  //     const parsed = Linking.parse(url);
  //     console.log('Parsed URL:', parsed);

  //     // Check if this is an auth callback
  //     if (parsed.path === 'auth' || url.includes('/--/auth')) {
  //       const params = parsed.queryParams || {};
        
  //       // Extract token from URL (handle different formats)
  //       let token = params.token;
  //       if (!token && url.includes('token=')) {
  //         token = url.split('token=')[1].split('&')[0];
  //       }

  //               if (token) {
  //         authInProgress.current = true;
  //         await handleAuthSuccess(token);
  //       } else if (params.error || url.includes('error=')) {
  //         const error = params.error || decodeURIComponent(url.split('error=')[1].split('&')[0]);
  //         setLoading(false);
  //         authInProgress.current = false;
  //         Alert.alert('Authentication Error', error);
  //       } else {
  //         console.log('Deep link received but no token or error found');
  //         setLoading(false);
  //         authInProgress.current = false;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Deep link handling error:', error);
  //     setLoading(false);
  //     authInProgress.current = false;
  //     Alert.alert('Error', 'Failed to process authentication');
  //   }
  // };

  const handleAuthSuccess = async (token) => {
  try {
    console.log('Processing auth success...');
    setLoading(true);
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    
    // Decode JWT payload
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    console.log('Token payload:', payload);
    
    const validatedUserData = {
      id: payload.userId,
      name: payload.name,
      email: payload.email,
      profilePic: payload.picture,
      currency: 'INR',
      loginMethod: 'google',
    };
    
    // Store session
    await AuthService.storeUserSession(validatedUserData, { token });
    
    console.log('User data stored, checking first login status...');
    
    // Check if first login
    const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
    const isFirstLogin = !hasOpenedBefore;
    
    console.log('First login check:', { hasOpenedBefore, isFirstLogin });
    
    // Update context first
    setUser(validatedUserData);
    setIsFirstLogin(isFirstLogin);
    
    // Wait a bit for state to propagate
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Navigate based on first login status
    if (isFirstLogin) {
      console.log('First login - navigating to Welcome');
      navigation.replace('Welcome');
    } else {
      console.log('Returning user - navigating to Main');
      navigation.replace('Main');
    }
    
    authInProgress.current = false;
    setLoading(false);
    
  } catch (error) {
    console.error('Auth success handling failed:', error);
    setLoading(false);
    authInProgress.current = false;
    Alert.alert('Error', `Failed to complete authentication: ${error.message}`);
  }
};


const checkExistingSession = async (isBiometricAvailable) => {
  try {
    const { userData, tokens } = await AuthService.getUserSession();
    console.log('Existing session check:', { 
      hasUser: !!userData, 
      hasTokens: !!tokens,
      biometricAvailable: isBiometricAvailable 
    });
    
    if (userData && tokens) {
      // IMPORTANT: Set this state so biometric button appears
      setHasExistingSession(true);
      
      // Check if biometric is enabled
      const biometricEnabled = await AuthService.isBiometricEnabled();
      console.log('Biometric enabled:', biometricEnabled);
      
      if (biometricEnabled && isBiometricAvailable) {
        // DON'T auto-login, show the biometric button
        console.log('Session exists with biometric enabled - showing biometric button');
        return; // Stop here, let user tap biometric button
      }
      
      // Only auto-login if biometric is NOT enabled
      console.log('Auto-logging in existing user (no biometric)');
      const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
      setUser(userData);
      setIsFirstLogin(!hasOpenedBefore);
      
      // Navigate immediately
      if (hasOpenedBefore === 'true') {
        navigation.replace('Main');
      } else {
        navigation.replace('Welcome');
      }
    } else {
      console.log('No existing session found');
      setHasExistingSession(false); // Make sure it's false
    }
  } catch (error) {
    console.error('Session check failed:', error);
    setHasExistingSession(false);
  }
};
// const checkExistingSession = async (isBiometricAvailable) => {
//   try {
//     const { userData, tokens } = await AuthService.getUserSession();
//     console.log('Existing session check:', { hasUser: !!userData, hasTokens: !!tokens });
    
//     if (userData && tokens) {
//       setHasExistingSession(true);
      
//       // Check if biometric is enabled
//       const biometricEnabled = await AuthService.isBiometricEnabled();
//       console.log('Biometric enabled:', biometricEnabled);
      
//       if (biometricEnabled && isBiometricAvailable) {
//         // DON'T auto-login, just show the biometric button
//         console.log('Session exists with biometric enabled - user must authenticate');
//         // Optionally, auto-trigger biometric prompt
//         // Uncomment the next line if you want automatic biometric prompt on app open
//         // setTimeout(() => handleBiometricLogin(), 500);
//         return;
//       }
      
//       // Only auto-login if biometric is NOT enabled
//       console.log('Auto-logging in existing user (no biometric)');
//       const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
//       setUser(userData);
//       setIsFirstLogin(!hasOpenedBefore);
      
//       // Navigate immediately
//       if (hasOpenedBefore === 'true') {
//         navigation.replace('Main');
//       } else {
//         navigation.replace('Welcome');
//       }
//     } else {
//       console.log('No existing session found');
//     }
//   } catch (error) {
//     console.error('Session check failed:', error);
//   }
// };

const handleBiometricLogin = async () => {
  if (loading) return;
  
  try {
    setLoading(true);
    console.log('Attempting biometric authentication...');
    
    const result = await AuthService.authenticateWithBiometrics();
    if (result.success) {
      console.log('Biometric auth successful');
      const { userData } = await AuthService.getUserSession();
      
      if (userData) {
        console.log('User session found, logging in...');
        const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
        setUser(userData);
        setIsFirstLogin(!hasOpenedBefore);
        
        // Navigate to Main (biometric users have already completed welcome)
        navigation.replace('Main');
        setLoading(false);
      } else {
        Alert.alert('Error', 'No user session found. Please login with Google.');
        setLoading(false);
      }
    } else {
      Alert.alert('Authentication Failed', result.error || 'Biometric authentication failed');
      setLoading(false);
    }
  } catch (error) {
    console.error('Biometric auth error:', error);
    Alert.alert('Error', 'Biometric authentication error');
    setLoading(false);
  }
};
    const checkBiometricAvailability = async () => {
    try {
      const biometricInfo = await AuthService.isBiometricAvailable();
      console.log('Biometric availability:', biometricInfo);
      setBiometricAvailable(biometricInfo.available);
      return biometricInfo.available;
    } catch (error) {
      console.error('Biometric check failed:', error);
      setBiometricAvailable(false);
      return false;
    }
  };




const handleGoogleLogin = async () => {
  if (loading || authInProgress.current) {
    console.log('Login already in progress');
    return;
  }

  try {
    setLoading(true);
    console.log('Starting Google login...');
    
    // Detect if running in Expo Go or standalone
    const redirectUrl = Linking.createURL('auth');
    console.log('Generated redirect URL:', redirectUrl);
    
    // Check if it's an exp:// URL (Expo Go) or custom scheme (production)
    const isExpoGo = redirectUrl.startsWith('exp://');
    console.log('Running in Expo Go:', isExpoGo);

    const state = 'mobile|' + Math.random().toString(36).substring(2, 10);
    const params = new URLSearchParams({
      redirect_uri: redirectUrl,
      state: state,
      scope: 'profile email openid',
    });

    const authUrl = `${BACKEND_URL}/api/auth/google?${params}`;
    console.log('Opening auth URL:', authUrl);

    // Open browser for OAuth
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      redirectUrl
    );

    console.log('WebBrowser result:', result);

    if (result.type === 'cancel') {
      console.log('User cancelled login');
      setLoading(false);
      authInProgress.current = false;
    } else if (result.type === 'dismiss') {
      console.log('Browser dismissed - waiting for deep link callback');
      loadingTimeout.current = setTimeout(() => {
        console.log('Deep link timeout - clearing loading state');
        setLoading(false);
        authInProgress.current = false;
        
        // In production, the callback might have worked but not been detected
        if (!isExpoGo) {
          Alert.alert(
            'Authentication Status',
            'The browser has closed. If you completed sign-in, the app should open automatically. If not, please try again.',
            [{ text: 'OK' }]
          );
        }
      }, 8000);
    } else if (result.type === 'success' && result.url) {
      console.log('Success URL:', result.url);
      await handleDeepLink({ url: result.url });
    }
  } catch (error) {
    console.error('Login failed:', error);
    setLoading(false);
    authInProgress.current = false;
    Alert.alert('Error', `Failed to initiate login: ${error.message}`);
  }
};
  // const handleGoogleLogin = async () => {
  //   if (loading || authInProgress.current) {
  //     console.log('Login already in progress');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     console.log('Starting Google login...');

  //     // Create the redirect URL that matches Expo's current URL
  //     const redirectUrl = Linking.createURL('auth');
  //     console.log('Redirect URL created:', redirectUrl);

  //     const state = 'mobile|' + Math.random().toString(36).substring(2, 10);
  //     const params = new URLSearchParams({
  //       redirect_uri: redirectUrl,
  //       state: state,
  //       scope: 'profile email openid',
  //     });

  //     const authUrl = `${BACKEND_URL}/api/auth/google?${params}`;
  //     console.log('Opening auth URL:', authUrl);

  //     // Open browser for OAuth
  //     const result = await WebBrowser.openAuthSessionAsync(
  //       authUrl,
  //       redirectUrl // Pass the same redirect URL
  //     );

  //     console.log('WebBrowser result:', result);

  //           // Handle the result
  //     if (result.type === 'cancel') {
  //       console.log('User cancelled login');
  //       setLoading(false);
  //       authInProgress.current = false;
  //           } else if (result.type === 'dismiss') {
  //       console.log('Browser dismissed - waiting for deep link callback');
  //       // Set a timeout to clear loading if deep link doesn't arrive
  //       loadingTimeout.current = setTimeout(() => {
  //         console.log('Deep link timeout - clearing loading state');
  //         setLoading(false);
  //         authInProgress.current = false;
  //         Alert.alert('Info', 'Please check if the browser redirected properly. Try clicking the link on the success page.');
  //       }, 10000); // 10 second timeout
  //     } else if (result.type === 'success' && result.url) {
  //       // Handle success with URL
  //       console.log('Success URL:', result.url);
  //       await handleDeepLink({ url: result.url });
  //     }
  //     // If browser dismissed, the deep link handler will take over and clear loading
  //   } catch (error) {
  //     console.error('Login failed:', error);
  //     setLoading(false);
  //     authInProgress.current = false;
  //     Alert.alert('Error', `Failed to initiate login: ${error.message}`);
  //   }
  // };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Personal Net Worth</Text>
        <Text style={styles.subtitle}>Secure Personal Finance Tracking</Text>
      </View>

      <View style={styles.loginSection}>
        <TouchableOpacity
          style={[styles.googleButton, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleGoogleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        {biometricAvailable && hasExistingSession && (
          <>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.biometricButton, loading && styles.buttonDisabled]}
              disabled={loading}
              onPress={handleBiometricLogin}
            >
              <Ionicons name="finger-print" size={20} color="#4285F4" style={styles.buttonIcon} />
              <Text style={styles.biometricButtonText}>Use Biometric Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your financial data is encrypted and stored securely
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 24, paddingVertical: 40 },
  header: { flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 32 },
  loginSection: { marginBottom: 40 },
  googleButton: { backgroundColor: '#4285F4', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: '#4285F4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8, minHeight: 56 },
  biometricButton: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#4285F4', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 4, minHeight: 56 },
  buttonDisabled: { opacity: 0.6 },
  buttonIcon: { marginRight: 12 },
  googleButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  biometricButtonText: { color: '#4285F4', fontWeight: 'bold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 16, color: '#6B7280', fontSize: 14, fontWeight: '500' },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: 12, lineHeight: 18 },
});
