import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={categoryIcon} size={24} color="#fff" />
      </View>
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
      backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: categoryColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
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
      fontSize: 16,
      fontWeight: '700',
      color: '#4CAF50',
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
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
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

