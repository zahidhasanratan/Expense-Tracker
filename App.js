import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import { useExpenseStore } from './src/store/useExpenseStore';
import { useThemeStore } from './src/store/useThemeStore';
import { useCurrencyStore } from './src/store/useCurrencyStore';
import { useBudgetStore } from './src/store/useBudgetStore';
import { useNotificationStore } from './src/store/useNotificationStore';

/**
 * Main App Component
 * Initializes stores and renders navigation
 */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const initializeExpenses = useExpenseStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initialize);
  const initializeCurrency = useCurrencyStore((state) => state.initialize);
  const initializeBudget = useBudgetStore((state) => state.initialize);
  const initializeNotifications = useNotificationStore((state) => state.initialize);
  const checkBudgetAlerts = useNotificationStore((state) => state.checkBudgetAlerts);
  const theme = useThemeStore((state) => state.theme);

  // Initialize stores on app start
  useEffect(() => {
    const init = async () => {
      await initializeExpenses();
      await initializeTheme();
      await initializeCurrency();
      await initializeBudget();
      await initializeNotifications();
      // Check budget alerts after a short delay
      setTimeout(() => {
        checkBudgetAlerts();
      }, 2000);
    };
    init();
  }, []);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <SplashScreen onFinish={() => setShowSplash(false)} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

