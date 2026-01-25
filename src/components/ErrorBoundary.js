import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

/**
 * Error Boundary Component
 * Catches JavaScript errors and displays a user-friendly error screen
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} errorInfo={this.state.errorInfo} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

/**
 * Error Screen Component
 * Displays user-friendly error message
 */
const ErrorScreen = ({ error, errorInfo, onReset }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : ['#E8F5E9', '#C8E6C9', '#A5D6A7']
        }
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
            </View>
            
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Don't worry, your data is safe.
            </Text>

            {__DEV__ && error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>Error Details (Development Only):</Text>
                <Text style={styles.errorText}>{error.toString()}</Text>
                {errorInfo && (
                  <Text style={styles.errorStack}>{errorInfo.componentStack}</Text>
                )}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={onReset}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Need Help?</Text>
              <Text style={styles.helpText}>
                If this problem persists, try:
              </Text>
              <Text style={styles.helpBullet}>• Restarting the app</Text>
              <Text style={styles.helpBullet}>• Clearing app data (Settings → Apps → Expense Tracker → Clear Data)</Text>
              <Text style={styles.helpBullet}>• Reinstalling the app (your data will be lost unless exported first)</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      justifyContent: 'center',
      minHeight: '100%',
    },
    content: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    iconContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: isDark ? '#E0E0E0' : '#424242',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    errorDetails: {
      width: '100%',
      backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5',
      borderRadius: 8,
      padding: 16,
      marginBottom: 24,
      maxHeight: 200,
    },
    errorTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FF6B6B',
      marginBottom: 8,
    },
    errorText: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      fontFamily: 'monospace',
      marginBottom: 8,
    },
    errorStack: {
      fontSize: 10,
      color: isDark ? '#888888' : '#999999',
      fontFamily: 'monospace',
    },
    actions: {
      width: '100%',
      marginBottom: 24,
    },
    button: {
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 32,
    },
    buttonIcon: {
      marginRight: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    helpSection: {
      width: '100%',
      marginTop: 8,
    },
    helpTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 8,
    },
    helpText: {
      fontSize: 14,
      color: isDark ? '#E0E0E0' : '#424242',
      marginBottom: 8,
    },
    helpBullet: {
      fontSize: 14,
      color: isDark ? '#E0E0E0' : '#424242',
      marginLeft: 16,
      marginBottom: 4,
    },
  });

export default ErrorBoundary;

