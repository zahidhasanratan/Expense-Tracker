import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency, formatDate, formatDateTime } from '../utils/format';
import { getCategoryColor, getCategoryIcon } from '../utils/categories';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

/**
 * ExpenseCard Component
 * Displays a single expense item in a card format
 */
const ExpenseCard = ({ expense, onPress, onDelete }) => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const isDark = theme === 'dark';
  const categoryColor = getCategoryColor(expense.category);
  const categoryIcon = getCategoryIcon(expense.category);

  const styles = getStyles(isDark, categoryColor);

  // Generate gradient colors for icon
  const getGradientColors = (baseColor) => {
    const colorMap = {
      '#FF6B6B': ['#FF8A80', '#FF6B6B', '#EF5350'],
      '#4ECDC4': ['#80DEEA', '#4ECDC4', '#26C6DA'],
      '#45B7D1': ['#64B5F6', '#45B7D1', '#42A5F5'],
      '#FFA07A': ['#FFB74D', '#FFA07A', '#FF9800'],
      '#98D8C8': ['#A5D6A7', '#98D8C8', '#81C784'],
    };
    return colorMap[baseColor] || ['#66BB6A', '#4CAF50', '#43A047'];
  };

  const gradientColors = getGradientColors(categoryColor);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={categoryIcon} size={26} color="#fff" />
      </LinearGradient>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {expense.title}
          </Text>
          <Text style={styles.amount}>{formatCurrency(expense.amount, currency.code)}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.categoryContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Text style={styles.categoryText}>{expense.category}</Text>
            </View>
          </View>
          <Text style={styles.date}>{formatDate(expense.date)}</Text>
        </View>
        {expense.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {expense.notes}
          </Text>
        )}
      </View>
      {onDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={isDark ? '#ff6b6b' : '#d32f2f'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (isDark, categoryColor) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: isDark 
        ? 'rgba(44, 44, 44, 0.9)' 
        : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: categoryColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
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
      shadowColor: categoryColor,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      flex: 1,
      marginRight: 8,
    },
    amount: {
      fontSize: 18,
      fontWeight: '800',
      color: '#4CAF50',
      letterSpacing: 0.3,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
    },
    categoryBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      shadowColor: categoryColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '500',
      color: '#FFFFFF',
    },
    date: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    notes: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 4,
      fontStyle: 'italic',
    },
    deleteButton: {
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ExpenseCard;

