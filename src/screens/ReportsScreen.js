import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';
import { getStartOfMonth, getEndOfMonth } from '../utils/format';
import { getCategoryColor } from '../utils/categories';

const screenWidth = Dimensions.get('window').width;

/**
 * ReportsScreen Component
 * Monthly reports with charts and category breakdown
 */
const ReportsScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const expenses = useExpenseStore((state) => state.expenses);
  const getTotalByDateRange = useExpenseStore((state) => state.getTotalByDateRange);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getMonthlyChartData = useExpenseStore((state) => state.getMonthlyChartData);
  const isDark = theme === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());

  const styles = getStyles(isDark);

  // Get current month/year
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate monthly total
  const monthlyTotal = useMemo(() => {
    const start = getStartOfMonth(currentDate);
    const end = getEndOfMonth(currentDate);
    return getTotalByDateRange(start, end);
  }, [expenses, currentDate, getTotalByDateRange]);

  // Get category breakdown
  const categoryBreakdown = useMemo(() => {
    const start = getStartOfMonth(currentDate);
    const end = getEndOfMonth(currentDate);
    return getExpensesByCategory(start, end);
  }, [expenses, currentDate, getExpensesByCategory]);

  // Get chart data
  const chartData = useMemo(() => {
    return getMonthlyChartData(currentYear, currentMonth);
  }, [expenses, currentYear, currentMonth, getMonthlyChartData]);

  // Prepare line chart data
  const lineChartData = useMemo(() => {
    const labels = chartData.map((item) => item.date);
    const amounts = chartData.map((item) => item.amount);

    return {
      labels: labels.length > 0 ? labels : ['1'],
      datasets: [
        {
          data: amounts.length > 0 ? amounts : [0],
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }, [chartData]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Format month/year display
  const monthYearDisplay = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryBreakdown)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

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
          showsVerticalScrollIndicator={false}
        >
        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={goToPreviousMonth}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDark ? '#FFFFFF' : '#212121'}
            />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthYearDisplay}</Text>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={goToNextMonth}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={isDark ? '#FFFFFF' : '#212121'}
            />
          </TouchableOpacity>
        </View>

        {/* Total Monthly Spending */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Monthly Spending</Text>
          <Text style={styles.totalAmount}>{formatCurrency(monthlyTotal, currency.code)}</Text>
        </View>

        {/* Daily Spending Line Chart */}
        {chartData.length > 0 && chartData.some((item) => item.amount > 0) && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Daily Spending</Text>
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#4CAF50',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        )}

        {/* Category Breakdown Table */}
        <View style={styles.categoryContainer}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          {sortedCategories.length > 0 ? (
            sortedCategories.map(({ category, amount }, index) => {
              const percentage = ((amount / monthlyTotal) * 100).toFixed(1);
              const categoryColor = getCategoryColor(category);
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View
                      style={[styles.categoryDot, { backgroundColor: categoryColor }]}
                    />
                    <Text style={styles.categoryName}>{category}</Text>
                  </View>
                  <View style={styles.categoryAmountContainer}>
                    <Text style={styles.categoryAmount}>{formatCurrency(amount, currency.code)}</Text>
                    <Text style={styles.categoryPercentage}>{percentage}%</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="bar-chart-outline"
                size={64}
                color={isDark ? '#555555' : '#CCCCCC'}
              />
              <Text style={styles.emptyText}>No expenses for this month</Text>
            </View>
          )}
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
      paddingBottom: 40,
    },
    monthSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 18,
      marginBottom: 20,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    monthButton: {
      padding: 8,
    },
    monthText: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    totalContainer: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 28,
      marginBottom: 20,
      alignItems: 'center',
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 8,
    },
    totalAmount: {
      fontSize: 32,
      fontWeight: '700',
      color: '#4CAF50',
    },
    chartContainer: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 16,
    },
    categoryContainer: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    categoryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryAmountContainer: {
      alignItems: 'flex-end',
    },
    categoryAmount: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryPercentage: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 2,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#757575' : '#9E9E9E',
      marginTop: 16,
    },
  });

export default ReportsScreen;

