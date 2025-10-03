// App.js (Fixed)
import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet, StatusBar, Platform } from 'react-native';
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
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native"
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: true,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
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

function LoadingScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}

function AppNavigator() {
  const { user, isFirstLogin } = useContext(AppContext);
  const { theme, isDarkMode } = useTheme();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (initializing) {
    return <LoadingScreen />;
  }

  const getInitialRoute = () => {
    if (!user) {
      return "Login";
    }
    if (isFirstLogin) {
      return "Welcome";
    }
    return "Main";
  };

    // Navigation theme with proper font configuration
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
    fonts: {
      regular: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        fontWeight: '400',
      },
      medium: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
        fontWeight: '500',
      },
      bold: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        fontWeight: '800',
      },
    },
  };

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: theme.colors.background },
          }}
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
      </NavigationContainer>
    </>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});