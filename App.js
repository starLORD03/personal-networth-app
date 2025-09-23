import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from './src/screens/DashboardScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import InvestmentsScreen from './src/screens/InvestmentsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { NativeWindStyleSheet } from "nativewind";
// Enable NativeWind for React Native
NativeWindStyleSheet.setOutput({
  default: "native"
});

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: true }}>
            <Tab.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />) }}
            />
            <Tab.Screen 
              name="Accounts" 
              component={AccountsScreen} 
              options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="wallet" size={size} color={color} />) }}
            />
            <Tab.Screen 
              name="Investments" 
              component={InvestmentsScreen} 
              options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="stats-chart" size={size} color={color} />) }}
            />
            <Tab.Screen 
              name="Add Transaction" 
              component={AddTransactionScreen} 
              options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="add-circle" size={size} color={color} />) }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    </ErrorBoundary>
  );
}
