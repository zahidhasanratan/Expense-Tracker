import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import Sidebar from '../components/Sidebar';
import HamburgerMenu from '../components/HamburgerMenu';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BudgetScreen from '../screens/BudgetScreen';

const Stack = createStackNavigator();

/**
 * Main App Navigator
 * Stack navigation with header menu button
 */
const AppNavigator = () => {
  const theme = useThemeStore((state) => state.theme);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Home');
  const isDark = theme === 'dark';

  const navigationRef = React.useRef();

  const getHeaderTitle = (routeName) => {
    switch (routeName) {
      case 'Home':
        return 'Dashboard';
      case 'Reports':
        return 'Monthly Reports';
      case 'Settings':
        return 'Settings';
      case 'Budget':
        return 'Budget';
      case 'AddExpense':
        return 'Add Expense';
      case 'AddTransaction':
        return 'Add Transaction';
      case 'EditExpense':
        return 'Edit Expense';
      default:
        return 'Expense Tracker';
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const route = navigationRef.current?.getCurrentRoute();
        if (route) {
          const routeName = route.name === 'HomeMain' ? 'Home' : 
                          route.name === 'ReportsMain' ? 'Reports' :
                          route.name === 'SettingsMain' ? 'Settings' : route.name;
          setCurrentRoute(routeName);
        }
      }}
    >
      <Stack.Navigator
        screenOptions={({ navigation, route }) => {
          const routeName = route.name === 'HomeMain' ? 'Home' : 
                          route.name === 'ReportsMain' ? 'Reports' :
                          route.name === 'SettingsMain' ? 'Settings' : route.name;
          const showMenu = ['HomeMain', 'ReportsMain', 'SettingsMain'].includes(route.name);
          
          return {
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerBackground: () => (
              <LinearGradient
                colors={isDark 
                  ? ['#1a1a2e', '#16213e', '#0f3460']
                  : ['#4CAF50', '#45a049', '#66BB6A']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            ),
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 20,
              letterSpacing: 0.5,
            },
            headerLeft: showMenu ? () => (
              <HamburgerMenu
                onPress={() => setSidebarVisible(true)}
                isOpen={sidebarVisible}
              />
            ) : () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ marginLeft: 16, padding: 8 }}
              >
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            ),
            title: getHeaderTitle(routeName),
          };
        }}
      >
        <Stack.Screen
          name="HomeMain"
          component={HomeScreen}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
        />
        <Stack.Screen
          name="EditExpense"
          component={EditExpenseScreen}
        />
        <Stack.Screen
          name="ReportsMain"
          component={ReportsScreen}
        />
        <Stack.Screen
          name="SettingsMain"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="BudgetMain"
          component={BudgetScreen}
        />
      </Stack.Navigator>

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        navigation={navigationRef.current}
        currentRoute={currentRoute}
      />
    </NavigationContainer>
  );
};

export default AppNavigator;

