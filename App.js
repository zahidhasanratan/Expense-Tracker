import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useExpenseStore } from './src/store/useExpenseStore';
import { useThemeStore } from './src/store/useThemeStore';
import { useCurrencyStore } from './src/store/useCurrencyStore';
import { useBudgetStore } from './src/store/useBudgetStore';

/**
 * Main App Component
 * Initializes stores and renders navigation
 */
export default function App() {
  const initializeExpenses = useExpenseStore((state) => state.initialize);
  const initializeTheme = useThemeStore((state) => state.initialize);
  const initializeCurrency = useCurrencyStore((state) => state.initialize);
  const initializeBudget = useBudgetStore((state) => state.initialize);
  const theme = useThemeStore((state) => state.theme);

  // Initialize stores on app start
  useEffect(() => {
    const init = async () => {
      await initializeExpenses();
      await initializeTheme();
      await initializeCurrency();
      await initializeBudget();
    };
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

