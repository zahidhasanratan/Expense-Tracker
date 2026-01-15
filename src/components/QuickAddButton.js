import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';

/**
 * Quick Add Button Component
 * 1-tap expense entry from home screen
 */
const QuickAddButton = ({ navigation }) => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const categories = useTransactionStore((state) => state.categories) || ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];
  const accounts = useTransactionStore((state) => state.accounts) || [];
  
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Food');
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  const handleQuickAdd = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    addTransaction({
      type: 'expense',
      title: `${selectedCategory} Expense`,
      amount: amountNum,
      category: selectedCategory,
      account: accounts[0]?.id || 'cash',
      paymentMethod: 'cash',
      date: Date.now(),
    });

    setAmount('');
    setShowModal(false);
    Alert.alert('Success', 'Expense added quickly!');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.quickAddButton}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF6B6B', '#FF5252', '#FF1744']}
          style={styles.quickAddGradient}
        >
          <Ionicons name="flash" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalOverlay} edges={['top']}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Add Expense</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
              </TouchableOpacity>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>{currency.symbol}</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.slice(0, 5).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      selectedCategory === cat && styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === cat && styles.categoryChipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleQuickAdd}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add Expense</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailedButton}
              onPress={() => {
                setShowModal(false);
                navigation.navigate('AddExpense');
              }}
            >
              <Text style={styles.detailedButtonText}>Add with Details</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    quickAddButton: {
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
    quickAddGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
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
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: '#4CAF50',
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: '700',
      color: '#4CAF50',
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 32,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryContainer: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 12,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    categoryChipSelected: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    },
    categoryChipText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryChipTextSelected: {
      color: '#FFFFFF',
    },
    addButton: {
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    addButtonGradient: {
      padding: 18,
      borderRadius: 16,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    detailedButton: {
      padding: 12,
      alignItems: 'center',
    },
    detailedButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#4CAF50',
    },
  });

export default QuickAddButton;

