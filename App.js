// App.js (Updated)
import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import InvestmentsScreen from './src/screens/InvestmentsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import LoginScreen from './src/screens/LoginScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import BiometricSetupScreen from './src/screens/BiometricSetupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, AppContext } from './src/context/AppContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NativeWindStyleSheet } from "nativewind";

// Enable NativeWind for React Native
NativeWindStyleSheet.setOutput({
  default: "native"
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#4285F4',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: 'NetWorth Manager'
        }}
      />
      <Tab.Screen 
        name="Accounts" 
        component={AccountsScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ) 
        }}
      />
      <Tab.Screen 
        name="Investments" 
        component={InvestmentsScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ) 
        }}
      />
      <Tab.Screen 
        name="Add Transaction" 
        component={AddTransactionScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          tabBarLabel: 'Add'
        }}
      />
    </Tab.Navigator>
  );
}

// Loading screen component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#4285F4" />
    </View>
  );
}

function AppNavigator() {
  const { user, isFirstLogin } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Just a minimal delay to let context initialize
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen only during brief initialization
  if (initializing) {
    return <LoadingScreen />;
  }

  // Determine initial route based on context state
  // LoginScreen will handle all session checks and navigation
  const getInitialRoute = () => {
    if (!user) {
      return "Login";
    }
    if (isFirstLogin) {
      return "Welcome";
    }
    return "Main";
  };

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
      <Stack.Screen 
        name="Main" 
        component={MainTabs}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: 'Profile',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});