import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import SummaryBox from '../components/SummaryBox';
import ExpenseCard from '../components/ExpenseCard';
import SearchBar from '../components/SearchBar';
import {
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
} from '../utils/format';

const screenWidth = Dimensions.get('window').width;

/**
 * HomeScreen Component
 * Main dashboard showing summaries, charts, and recent expenses
 */
const HomeScreen = ({ navigation }) => {
  const theme = useThemeStore((state) => state.theme);
  const expenses = useExpenseStore((state) => state.expenses);
  const getTotalByDateRange = useExpenseStore((state) => state.getTotalByDateRange);
  const getExpensesByCategory = useExpenseStore((state) => state.getExpensesByCategory);
  const getRecentExpenses = useExpenseStore((state) => state.getRecentExpenses);
  const searchExpenses = useExpenseStore((state) => state.searchExpenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');

  const styles = getStyles(isDark);

  // Calculate totals
  const todayTotal = useMemo(() => {
    const start = getStartOfDay(new Date());
    const end = getEndOfDay(new Date());
    return getTotalByDateRange(start, end);
  }, [expenses, getTotalByDateRange]);

  const weekTotal = useMemo(() => {
    const start = getStartOfWeek(new Date());
    const end = getEndOfWeek(new Date());
    return getTotalByDateRange(start, end);
  }, [expenses, getTotalByDateRange]);

  const monthTotal = useMemo(() => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return getTotalByDateRange(start, end);
  }, [expenses, getTotalByDateRange]);

  // Get category breakdown for current month
  const categoryData = useMemo(() => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return getExpensesByCategory(start, end);
  }, [expenses, getExpensesByCategory]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const categories = Object.keys(categoryData);
    const colors = {
      Food: '#FF6B6B',
      Transport: '#4ECDC4',
      Bills: '#45B7D1',
      Shopping: '#FFA07A',
      Others: '#98D8C8',
    };
    return categories.map((cat) => ({
      name: cat,
      amount: categoryData[cat],
      color: colors[cat] || '#98D8C8',
      legendFontColor: isDark ? '#FFFFFF' : '#7F7F7F',
      legendFontSize: 12,
    }));
  }, [categoryData, isDark]);

  // Get recent expenses (filtered by search if active)
  const recentExpenses = useMemo(() => {
    const expensesList = searchQuery 
      ? searchExpenses(searchQuery).sort((a, b) => b.date - a.date).slice(0, 10)
      : getRecentExpenses(10);
    return expensesList;
  }, [expenses, searchQuery, getRecentExpenses, searchExpenses]);

  // Handle delete expense
  const handleDelete = (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(expenseId),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Summary Boxes */}
        <View style={styles.summaryContainer}>
          <SummaryBox
            title="Today"
            amount={todayTotal}
            icon="today-outline"
            color="#4CAF50"
          />
          <SummaryBox
            title="This Week"
            amount={weekTotal}
            icon="calendar-outline"
            color="#2196F3"
          />
          <SummaryBox
            title="This Month"
            amount={monthTotal}
            icon="stats-chart-outline"
            color="#FF9800"
          />
        </View>

        {/* Category Breakdown Chart */}
        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
                backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Recent Expenses */}
        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Recent Expenses'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity onPress={() => {
                navigation.navigate('ReportsMain');
              }}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onPress={() => navigation.navigate('EditExpense', { expenseId: expense.id })}
                onDelete={() => handleDelete(expense.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="receipt-outline"
                size={64}
                color={isDark ? '#555555' : '#CCCCCC'}
              />
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first expense
              </Text>
            </View>
          )}
        </View>
        </ScrollView>

        {/* Floating Action Buttons */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddTransaction', { type: 'expense' })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049', '#66BB6A']}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Quick Add Button (1-tap expense) */}
        <TouchableOpacity
          style={styles.quickFab}
          onPress={() => {
            // Quick add - navigate to AddTransaction with quick mode
            navigation.navigate('AddTransaction', { type: 'expense', quick: true });
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF5252']}
            style={styles.quickFabGradient}
          >
            <Ionicons name="flash" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
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
      paddingBottom: 100,
    },
    summaryContainer: {
      marginBottom: 20,
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
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
    },
    recentContainer: {
      marginTop: 8,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    viewAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4CAF50',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#757575' : '#9E9E9E',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: isDark ? '#555555' : '#BDBDBD',
      marginTop: 8,
      textAlign: 'center',
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 30,
      width: 64,
      height: 64,
      borderRadius: 32,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    fabGradient: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickFab: {
      position: 'absolute',
      left: 20,
      bottom: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      shadowColor: '#FF6B6B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 8,
    },
    quickFabGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default HomeScreen;

