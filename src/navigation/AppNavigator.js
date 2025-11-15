import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import Sidebar from '../components/Sidebar';

// Screens
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';

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
      case 'AddExpense':
        return 'Add Expense';
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
              backgroundColor: isDark ? '#1E1E1E' : '#4CAF50',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '700',
            },
            headerLeft: showMenu ? () => (
              <TouchableOpacity
                onPress={() => setSidebarVisible(true)}
                style={{ marginLeft: 16, padding: 8 }}
              >
                <Ionicons name="menu" size={28} color="#FFFFFF" />
              </TouchableOpacity>
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

