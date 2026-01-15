import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRecurringStore } from '../store/useRecurringStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';

/**
 * Recurring Transactions Screen
 * Manage recurring expenses and income
 */
const RecurringScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const categories = useTransactionStore((state) => state.categories) || [];
  const accounts = useTransactionStore((state) => state.accounts) || [];
  const recurringTransactions = useRecurringStore((state) => state.recurringTransactions) || [];
  const addRecurringTransaction = useRecurringStore((state) => state.addRecurringTransaction);
  const updateRecurringTransaction = useRecurringStore((state) => state.updateRecurringTransaction);
  const deleteRecurringTransaction = useRecurringStore((state) => state.deleteRecurringTransaction);
  
  const isDark = theme === 'dark';
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');

  const styles = getStyles(isDark);

  const frequencies = [
    { id: 'daily', name: 'Daily', icon: 'calendar-outline' },
    { id: 'weekly', name: 'Weekly', icon: 'calendar-outline' },
    { id: 'monthly', name: 'Monthly', icon: 'calendar-outline' },
    { id: 'yearly', name: 'Yearly', icon: 'calendar-outline' },
  ];

  const handleSave = () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const data = {
      type,
      amount: parseFloat(amount),
      category,
      account: account || accounts[0]?.id || 'cash',
      description: description.trim(),
      frequency,
    };

    if (editingItem) {
      updateRecurringTransaction(editingItem.id, data);
    } else {
      addRecurringTransaction(data);
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingItem(null);
    setAmount('');
    setCategory('');
    setAccount('');
    setFrequency('monthly');
    setDescription('');
    setType('expense');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setAmount(item.amount.toString());
    setCategory(item.category);
    setAccount(item.account);
    setFrequency(item.frequency);
    setDescription(item.description || '');
    setType(item.type);
    setShowAddModal(true);
  };

  const handleDelete = (item) => {
    Alert.alert(
      'Delete Recurring Transaction',
      `Are you sure you want to delete this recurring ${item.type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecurringTransaction(item.id),
        },
      ]
    );
  };

  const getFrequencyName = (freq) => {
    return frequencies.find(f => f.id === freq)?.name || freq;
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
            <Text style={styles.sectionTitle}>Recurring Transactions</Text>
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

          {recurringTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="repeat-outline" size={64} color={isDark ? '#555555' : '#CCCCCC'} />
              <Text style={styles.emptyText}>No recurring transactions</Text>
              <Text style={styles.emptySubtext}>
                Add recurring expenses or income (rent, salary, subscriptions)
              </Text>
            </View>
          ) : (
            recurringTransactions.map((item) => {
              const isExpense = item.type === 'expense';
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={[
                      styles.typeIndicator,
                      { backgroundColor: isExpense ? '#FF6B6B20' : '#4CAF5020' }
                    ]}>
                      <Ionicons
                        name={isExpense ? 'arrow-down' : 'arrow-up'}
                        size={20}
                        color={isExpense ? '#FF6B6B' : '#4CAF50'}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      <Text style={styles.itemDescription}>
                        {item.description || getFrequencyName(item.frequency)}
                      </Text>
                    </View>
                    <View style={styles.itemAmount}>
                      <Text style={[
                        styles.amountText,
                        { color: isExpense ? '#FF6B6B' : '#4CAF50' }
                      ]}>
                        {isExpense ? '-' : '+'}{formatCurrency(item.amount, currency.code)}
                      </Text>
                      <Text style={styles.frequencyText}>
                        {getFrequencyName(item.frequency)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEdit(item)}
                    >
                      <Ionicons name="create-outline" size={18} color="#2196F3" />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(item)}
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
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingItem ? 'Edit Recurring' : 'Add Recurring'}
                </Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>

              {/* Type Toggle */}
              <View style={styles.typeToggle}>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
                  onPress={() => setType('expense')}
                >
                  <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
                  onPress={() => setType('income')}
                >
                  <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Amount *</Text>
                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Category *</Text>
                <ScrollView style={styles.categoryList} nestedScrollEnabled={true}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        category === cat && styles.categoryOptionSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        category === cat && styles.categoryOptionTextSelected,
                      ]}>
                        {cat}
                      </Text>
                      {category === cat && (
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.frequencyGrid}>
                  {frequencies.map((freq) => (
                    <TouchableOpacity
                      key={freq.id}
                      style={[
                        styles.frequencyOption,
                        frequency === freq.id && styles.frequencyOptionSelected,
                      ]}
                      onPress={() => setFrequency(freq.id)}
                    >
                      <Ionicons
                        name={freq.icon}
                        size={24}
                        color={frequency === freq.id ? '#4CAF50' : (isDark ? '#B0B0B0' : '#757575')}
                      />
                      <Text style={[
                        styles.frequencyOptionText,
                        frequency === freq.id && styles.frequencyOptionTextSelected,
                      ]}>
                        {freq.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Netflix subscription, Salary"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  value={description}
                  onChangeText={setDescription}
                />
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
                    {editingItem ? 'Update' : 'Add'} Recurring
                  </Text>
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
    itemCard: {
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
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    typeIndicator: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    itemInfo: {
      flex: 1,
    },
    itemCategory: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    itemAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 4,
    },
    frequencyText: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    itemActions: {
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
      padding: 24,
      maxHeight: '90%',
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
    typeToggle: {
      flexDirection: 'row',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
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
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
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
    categoryList: {
      maxHeight: 150,
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
    frequencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    frequencyOption: {
      width: '22%',
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    frequencyOptionSelected: {
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    frequencyOptionText: {
      fontSize: 12,
      marginTop: 8,
      color: isDark ? '#B0B0B0' : '#757575',
      textAlign: 'center',
    },
    frequencyOptionTextSelected: {
      color: '#4CAF50',
      fontWeight: '700',
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

export default RecurringScreen;

