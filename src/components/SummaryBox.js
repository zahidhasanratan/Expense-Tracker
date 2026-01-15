import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils/format';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

/**
 * SummaryBox Component
 * Displays a summary card with title, amount, and icon
 */
const SummaryBox = ({ title, amount, icon, color = '#4CAF50' }) => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const isDark = theme === 'dark';

  const styles = getStyles(isDark, color);

  // Generate gradient colors based on the base color
  const getGradientColors = (baseColor) => {
    const colorMap = {
      '#4CAF50': ['#66BB6A', '#4CAF50', '#43A047'],
      '#2196F3': ['#42A5F5', '#2196F3', '#1E88E5'],
      '#FF9800': ['#FFB74D', '#FF9800', '#FB8C00'],
      '#9C27B0': ['#BA68C8', '#9C27B0', '#8E24AA'],
      '#F44336': ['#EF5350', '#F44336', '#E53935'],
    };
    return colorMap[baseColor] || ['#66BB6A', '#4CAF50', '#43A047'];
  };

  const gradientColors = getGradientColors(color);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isDark 
          ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
          : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.95)']
        }
        style={styles.gradientContainer}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={icon} size={28} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>{formatCurrency(amount, currency.code)}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const getStyles = (isDark, color) =>
  StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    gradientContainer: {
      flexDirection: 'row',
      borderRadius: 16,
      padding: 18,
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 4,
    },
    amount: {
      fontSize: 22,
      fontWeight: '800',
      color: isDark ? '#FFFFFF' : '#212121',
      letterSpacing: 0.5,
    },
  });

export default SummaryBox;

