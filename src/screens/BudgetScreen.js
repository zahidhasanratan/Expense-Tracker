import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBudgetStore } from '../store/useBudgetStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';
import { getStartOfMonth, getEndOfMonth } from '../utils/format';

/**
 * Budget Management Screen
 * Set monthly and category budgets with alerts
 */
const BudgetScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const categories = useTransactionStore((state) => state.categories) || [];
  const transactions = useTransactionStore((state) => state.getActiveTransactions()) || [];
  
  const monthlyBudget = useBudgetStore((state) => state.monthlyBudget);
  const categoryBudgets = useBudgetStore((state) => state.categoryBudgets);
  const rolloverEnabled = useBudgetStore((state) => state.rolloverEnabled);
  const alertsEnabled = useBudgetStore((state) => state.alertsEnabled);
  const alertThreshold = useBudgetStore((state) => state.alertThreshold);
  
  const setMonthlyBudget = useBudgetStore((state) => state.setMonthlyBudget);
  const setCategoryBudget = useBudgetStore((state) => state.setCategoryBudget);
  const removeCategoryBudget = useBudgetStore((state) => state.removeCategoryBudget);
  const setRolloverEnabled = useBudgetStore((state) => state.setRolloverEnabled);
  
  const isDark = theme === 'dark';

  const [monthlyBudgetInput, setMonthlyBudgetInput] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryBudgetInput, setCategoryBudgetInput] = useState('');

  const styles = getStyles(isDark);

  // Calculate current month spending
  const currentSpending = useMemo(() => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'expense' && t.date >= start && t.date <= end && !t.isDeleted)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  // Calculate remaining budget
  const remainingBudget = monthlyBudget - currentSpending;
  const budgetPercentage = monthlyBudget > 0 ? (currentSpending / monthlyBudget) * 100 : 0;

  // Get category spending
  const getCategorySpending = (category) => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'expense' && t.category === category && t.date >= start && t.date <= end && !t.isDeleted)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  // Daily budget remaining
  const dailyBudget = useMemo(() => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - today.getDate() + 1;
    return daysRemaining > 0 ? remainingBudget / daysRemaining : 0;
  }, [remainingBudget]);

  // Handle save monthly budget
  const handleSaveMonthlyBudget = () => {
    const amount = parseFloat(monthlyBudgetInput);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }
    setMonthlyBudget(amount);
    setMonthlyBudgetInput('');
    Alert.alert('Success', 'Monthly budget updated!');
  };

  // Handle save category budget
  const handleSaveCategoryBudget = () => {
    const amount = parseFloat(categoryBudgetInput);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount.');
      return;
    }
    setCategoryBudget(selectedCategory, amount);
    setCategoryBudgetInput('');
    setShowCategoryModal(false);
    Alert.alert('Success', 'Category budget updated!');
  };

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
          {/* Monthly Budget Card */}
          <View style={styles.budgetCard}>
            <View style={styles.budgetCardHeader}>
              <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
              <Text style={styles.budgetCardTitle}>Monthly Budget</Text>
            </View>
            
            <View style={styles.budgetInputContainer}>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder={monthlyBudget.toString()}
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                value={monthlyBudgetInput}
                onChangeText={setMonthlyBudgetInput}
                keyboardType="decimal-pad"
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveMonthlyBudget}
              >
                <Text style={styles.saveButtonText}>Set</Text>
              </TouchableOpacity>
            </View>

            {monthlyBudget > 0 && (
              <>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(budgetPercentage, 100)}%`,
                          backgroundColor: budgetPercentage > 100 ? '#FF6B6B' : budgetPercentage > 80 ? '#FFA726' : '#4CAF50',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {budgetPercentage.toFixed(1)}% used
                  </Text>
                </View>

                <View style={styles.budgetStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Spent</Text>
                    <Text style={styles.statValue}>{formatCurrency(currentSpending, currency.code)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Remaining</Text>
                    <Text style={[styles.statValue, remainingBudget < 0 && styles.statValueNegative]}>
                      {formatCurrency(remainingBudget, currency.code)}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Daily Budget</Text>
                    <Text style={styles.statValue}>{formatCurrency(dailyBudget, currency.code)}</Text>
                  </View>
                </View>

                {remainingBudget < 0 && (
                  <View style={styles.alertBanner}>
                    <Ionicons name="warning" size={20} color="#FFFFFF" />
                    <Text style={styles.alertText}>You're over budget!</Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Settings */}
          <View style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Budget Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="repeat-outline" size={20} color="#4CAF50" />
                <Text style={styles.settingLabel}>Budget Rollover</Text>
                <Text style={styles.settingDescription}>
                  Unused budget carries to next month
                </Text>
              </View>
              <Switch
                value={rolloverEnabled}
                onValueChange={setRolloverEnabled}
                trackColor={{ false: '#767577', true: '#81C784' }}
                thumbColor={rolloverEnabled ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Category Budgets */}
          <View style={styles.categoryBudgetsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Category Budgets</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setSelectedCategory('');
                  setCategoryBudgetInput('');
                  setShowCategoryModal(true);
                }}
              >
                <Ionicons name="add-circle" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {Object.keys(categoryBudgets).length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="pie-chart-outline" size={48} color={isDark ? '#555555' : '#CCCCCC'} />
                <Text style={styles.emptyText}>No category budgets set</Text>
                <Text style={styles.emptySubtext}>
                  Set budgets for specific categories to track spending
                </Text>
              </View>
            ) : (
              Object.entries(categoryBudgets).map(([category, budget]) => {
                const spent = getCategorySpending(category);
                const remaining = budget - spent;
                const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                
                return (
                  <View key={category} style={styles.categoryBudgetItem}>
                    <View style={styles.categoryBudgetHeader}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Remove Budget',
                            `Remove budget for ${category}?`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Remove',
                                style: 'destructive',
                                onPress: () => removeCategoryBudget(category),
                              },
                            ]
                          );
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: percentage > 100 ? '#FF6B6B' : percentage > 80 ? '#FFA726' : '#4CAF50',
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <View style={styles.categoryBudgetStats}>
                      <Text style={styles.categoryBudgetText}>
                        {formatCurrency(spent, currency.code)} / {formatCurrency(budget, currency.code)}
                      </Text>
                      <Text style={[styles.categoryBudgetText, remaining < 0 && styles.statValueNegative]}>
                        {remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                        {formatCurrency(Math.abs(remaining), currency.code)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Category Budget Modal */}
        <Modal
          visible={showCategoryModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Set Category Budget</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category</Text>
                <ScrollView style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        selectedCategory === cat && styles.categoryOptionSelected,
                      ]}
                      onPress={() => setSelectedCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryOptionText,
                          selectedCategory === cat && styles.categoryOptionTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                      {selectedCategory === cat && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Budget Amount</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                    value={categoryBudgetInput}
                    onChangeText={setCategoryBudgetInput}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveCategoryBudget}
                disabled={!selectedCategory || !categoryBudgetInput}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.modalSaveButtonGradient}
                >
                  <Text style={styles.modalSaveButtonText}>Save Budget</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    budgetCard: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    budgetCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    budgetCardTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    budgetInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      gap: 8,
    },
    currencySymbol: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4CAF50',
    },
    budgetInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    saveButton: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressBar: {
      height: 8,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      textAlign: 'right',
    },
    budgetStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16,
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    statValueNegative: {
      color: '#FF6B6B',
    },
    alertBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF6B6B',
      padding: 12,
      borderRadius: 8,
      marginTop: 12,
      gap: 8,
    },
    alertText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    settingsCard: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 16,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingInfo: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginTop: 4,
    },
    settingDescription: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 4,
    },
    categoryBudgetsCard: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    addButton: {
      padding: 4,
    },
    categoryBudgetItem: {
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    categoryBudgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryBudgetStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    categoryBudgetText: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#757575' : '#9E9E9E',
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 12,
      color: isDark ? '#555555' : '#BDBDBD',
      marginTop: 8,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
    },
    categoryList: {
      maxHeight: 200,
    },
    categoryOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 8,
      marginBottom: 8,
    },
    categoryOptionSelected: {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderWidth: 1,
      borderColor: '#4CAF50',
    },
    categoryOptionText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryOptionTextSelected: {
      fontWeight: '700',
      color: '#4CAF50',
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 12,
      gap: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    modalSaveButton: {
      borderRadius: 16,
      marginTop: 20,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    modalSaveButtonGradient: {
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
    },
    modalSaveButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });

export default BudgetScreen;

