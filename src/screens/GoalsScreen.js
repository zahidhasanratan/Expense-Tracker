import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { getGoals, saveGoals } from '../storage/storage';
import { formatCurrency } from '../utils/format';

/**
 * Goals Management Screen
 * Set and track financial goals
 */
const GoalsScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const transactions = useTransactionStore((state) => state.getActiveTransactions()) || [];
  const accounts = useTransactionStore((state) => state.accounts) || [];
  const getAccountsBalance = useTransactionStore((state) => state.getAccountsBalance);
  
  const isDark = theme === 'dark';
  const [goals, setGoals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalType, setGoalType] = useState('save'); // save, pay_off

  const styles = getStyles(isDark);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const savedGoals = await getGoals();
    setGoals(savedGoals || []);
  };

  const saveGoalsData = async (newGoals) => {
    await saveGoals(newGoals);
    setGoals(newGoals);
  };

  const handleSave = () => {
    if (!goalTitle.trim() || !goalAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(goalAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newGoal = {
      id: editingGoal?.id || Date.now().toString(),
      title: goalTitle.trim(),
      targetAmount: amount,
      type: goalType,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      completed: false,
    };

    const updatedGoals = editingGoal
      ? goals.map(g => g.id === editingGoal.id ? newGoal : g)
      : [...goals, newGoal];

    saveGoalsData(updatedGoals);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingGoal(null);
    setGoalTitle('');
    setGoalAmount('');
    setGoalType('save');
  };

  const handleDelete = (goal) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedGoals = goals.filter(g => g.id !== goal.id);
            saveGoalsData(updatedGoals);
          },
        },
      ]
    );
  };

  const getCurrentProgress = (goal) => {
    if (goal.type === 'save') {
      const totalBalance = accounts.reduce((sum, acc) => sum + (getAccountsBalance(acc.id) || 0), 0);
      return Math.min(totalBalance, goal.targetAmount);
    } else {
      // For pay_off goals, calculate from transactions
      return 0; // Simplified - can be enhanced
    }
  };

  const getProgressPercentage = (goal) => {
    const current = getCurrentProgress(goal);
    return goal.targetAmount > 0 ? (current / goal.targetAmount) * 100 : 0;
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Financial Goals</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add-circle" size={28} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {goals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="flag-outline" size={64} color={isDark ? '#555555' : '#CCCCCC'} />
              <Text style={styles.emptyText}>No goals set</Text>
              <Text style={styles.emptySubtext}>
                Set financial goals to track your progress
              </Text>
            </View>
          ) : (
            goals.map((goal) => {
              const current = getCurrentProgress(goal);
              const percentage = getProgressPercentage(goal);
              const isCompleted = percentage >= 100;
              
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={[
                      styles.goalIconContainer,
                      { backgroundColor: isCompleted ? '#4CAF5020' : '#FF980020' }
                    ]}>
                      <Ionicons
                        name={isCompleted ? 'checkmark-circle' : 'flag'}
                        size={24}
                        color={isCompleted ? '#4CAF50' : '#FF9800'}
                      />
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalType}>
                        {goal.type === 'save' ? 'Save Goal' : 'Pay Off Goal'}
                      </Text>
                    </View>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>✓ Done</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: isCompleted ? '#4CAF50' : '#FF9800',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>

                  <View style={styles.goalStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Current</Text>
                      <Text style={styles.statValue}>
                        {formatCurrency(current, currency.code)}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Target</Text>
                      <Text style={styles.statValue}>
                        {formatCurrency(goal.targetAmount, currency.code)}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Remaining</Text>
                      <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                        {formatCurrency(Math.max(0, goal.targetAmount - current), currency.code)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {
                        setEditingGoal(goal);
                        setGoalTitle(goal.title);
                        setGoalAmount(goal.targetAmount.toString());
                        setGoalType(goal.type);
                        setShowAddModal(true);
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color="#2196F3" />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(goal)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                      <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Add/Edit Modal */}
        <Modal
          visible={showAddModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingGoal ? 'Edit Goal' : 'Add Goal'}
                </Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                contentContainerStyle={styles.modalScrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Goal Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Save $5,000, Pay off credit card"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                    value={goalTitle}
                    onChangeText={setGoalTitle}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Goal Type</Text>
                  <View style={styles.typeToggle}>
                    <TouchableOpacity
                      style={[styles.typeButton, goalType === 'save' && styles.typeButtonActive]}
                      onPress={() => setGoalType('save')}
                    >
                      <Text style={[styles.typeButtonText, goalType === 'save' && styles.typeButtonTextActive]}>
                        Save Money
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.typeButton, goalType === 'pay_off' && styles.typeButtonActive]}
                      onPress={() => setGoalType('pay_off')}
                    >
                      <Text style={[styles.typeButtonText, goalType === 'pay_off' && styles.typeButtonTextActive]}>
                        Pay Off Debt
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Target Amount *</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0.00"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={goalAmount}
                      onChangeText={setGoalAmount}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#45a049']}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>
                      {editingGoal ? 'Update Goal' : 'Add Goal'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    addButton: {
      padding: 4,
    },
    goalCard: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.15)',
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    goalIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    goalInfo: {
      flex: 1,
    },
    goalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    goalType: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    completedBadge: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    completedText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
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
    goalStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
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
    goalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      padding: 8,
    },
    actionText: {
      fontSize: 14,
      color: '#2196F3',
      fontWeight: '500',
    },
    deleteText: {
      color: '#FF6B6B',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
      paddingTop: 24,
    },
    modalScrollView: {
      flex: 1,
    },
    modalScrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
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
    input: {
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    typeToggle: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 4,
    },
    typeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    typeButtonActive: {
      backgroundColor: '#4CAF50',
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
    },
    amountInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    currencySymbol: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4CAF50',
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    saveButton: {
      borderRadius: 16,
      marginTop: 20,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    saveButtonGradient: {
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });

export default GoalsScreen;

