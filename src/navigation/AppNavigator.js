import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import AccountsScreen from '../screens/AccountsScreen';
import InvestmentsScreen from '../screens/InvestmentsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
// Import Lucide icons for tabs
import { Home, Wallet, TrendingUp, List, PlusCircle } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') return <Home color={color} size={size} />;
            if (route.name === 'Accounts') return <Wallet color={color} size={size} />;
            if (route.name === 'Investments') return <TrendingUp color={color} size={size} />;
            if (route.name === 'Transactions') return <List color={color} size={size} />;
            if (route.name === 'Add Transaction') return <PlusCircle color={color} size={size} />;
            return null;
          },
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
        })}
      >
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Accounts" component={AccountsScreen} />
        <Tab.Screen name="Investments" component={InvestmentsScreen} />
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="Add Transaction" component={AddTransactionScreen} options={{ tabBarButton: () => null }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
