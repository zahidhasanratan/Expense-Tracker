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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';

/**
 * Accounts Management Screen
 * Manage accounts (cash, bank, credit cards)
 */
const AccountsScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const accounts = useTransactionStore((state) => state.accounts) || [];
  const addAccount = useTransactionStore((state) => state.addAccount);
  const updateAccount = useTransactionStore((state) => state.updateAccount);
  const deleteAccount = useTransactionStore((state) => state.deleteAccount);
  const getAccountsBalance = useTransactionStore((state) => state.getAccountsBalance);
  
  const isDark = theme === 'dark';
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('cash');
  const [initialBalance, setInitialBalance] = useState('');

  const styles = getStyles(isDark);

  const accountTypes = [
    { id: 'cash', name: 'Cash', icon: 'wallet-outline', color: '#4CAF50' },
    { id: 'bank', name: 'Bank Account', icon: 'card-outline', color: '#2196F3' },
    { id: 'credit', name: 'Credit Card', icon: 'card', color: '#FF9800' },
    { id: 'savings', name: 'Savings', icon: 'wallet-outline', color: '#9C27B0' },
    { id: 'investment', name: 'Investment', icon: 'trending-up-outline', color: '#00BCD4' },
  ];

  const handleSave = () => {
    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    const balance = parseFloat(initialBalance) || 0;
    
    if (editingAccount) {
      updateAccount(editingAccount.id, {
        name: accountName.trim(),
        type: accountType,
        balance: balance,
      });
    } else {
      addAccount({
        name: accountName.trim(),
        type: accountType,
        balance: balance,
      });
    }

    setShowAddModal(false);
    setEditingAccount(null);
    setAccountName('');
    setAccountType('cash');
    setInitialBalance('');
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setAccountName(account.name);
    setAccountType(account.type);
    setInitialBalance(account.balance?.toString() || '0');
    setShowAddModal(true);
  };

  const handleDelete = (account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAccount(account.id),
        },
      ]
    );
  };

  const getAccountIcon = (type) => {
    const typeInfo = accountTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.icon : 'wallet-outline';
  };

  const getAccountColor = (type) => {
    const typeInfo = accountTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.color : '#4CAF50';
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (getAccountsBalance(acc.id) || 0), 0);

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
          {/* Total Balance Card */}
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Balance</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalBalance, currency.code)}
            </Text>
            <Text style={styles.totalSubtext}>
              Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
            </Text>
          </View>

          {/* Accounts List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Accounts</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setEditingAccount(null);
                  setAccountName('');
                  setAccountType('cash');
                  setInitialBalance('');
                  setShowAddModal(true);
                }}
              >
                <Ionicons name="add-circle" size={28} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {accounts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="wallet-outline" size={64} color={isDark ? '#555555' : '#CCCCCC'} />
                <Text style={styles.emptyText}>No accounts yet</Text>
                <Text style={styles.emptySubtext}>
                  Add your first account to start tracking
                </Text>
              </View>
            ) : (
              accounts.map((account) => {
                const balance = getAccountsBalance(account.id);
                const color = getAccountColor(account.type);
                return (
                  <View key={account.id} style={styles.accountCard}>
                    <View style={styles.accountHeader}>
                      <View style={[styles.accountIconContainer, { backgroundColor: `${color}20` }]}>
                        <Ionicons name={getAccountIcon(account.type)} size={24} color={color} />
                      </View>
                      <View style={styles.accountInfo}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountType}>
                          {accountTypes.find(t => t.id === account.type)?.name || account.type}
                        </Text>
                      </View>
                      <View style={styles.accountBalance}>
                        <Text style={[styles.balanceAmount, { color }]}>
                          {formatCurrency(balance, currency.code)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.accountActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEdit(account)}
                      >
                        <Ionicons name="create-outline" size={18} color="#2196F3" />
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(account)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                        <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Add/Edit Account Modal */}
        <Modal
          visible={showAddModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAccount ? 'Edit Account' : 'Add Account'}
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
                  <Text style={styles.label}>Account Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., My Wallet, Chase Bank"
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                    value={accountName}
                    onChangeText={setAccountName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Account Type</Text>
                  <View style={styles.typeGrid}>
                    {accountTypes.map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.typeOption,
                          accountType === type.id && styles.typeOptionSelected,
                          { borderColor: type.color },
                        ]}
                        onPress={() => setAccountType(type.id)}
                      >
                        <Ionicons
                          name={type.icon}
                          size={24}
                          color={accountType === type.id ? type.color : (isDark ? '#B0B0B0' : '#757575')}
                        />
                        <Text
                          style={[
                            styles.typeOptionText,
                            accountType === type.id && { color: type.color, fontWeight: '700' },
                          ]}
                        >
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Initial Balance</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0.00"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={initialBalance}
                      onChangeText={setInitialBalance}
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
                      {editingAccount ? 'Update Account' : 'Add Account'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
              </View>
            </KeyboardAvoidingView>
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
    totalCard: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.3)',
    },
    totalLabel: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 8,
    },
    totalAmount: {
      fontSize: 36,
      fontWeight: '700',
      color: '#4CAF50',
      marginBottom: 4,
    },
    totalSubtext: {
      fontSize: 12,
      color: isDark ? '#757575' : '#9E9E9E',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    addButton: {
      padding: 4,
    },
    accountCard: {
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
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    accountIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    accountType: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    accountBalance: {
      alignItems: 'flex-end',
    },
    balanceAmount: {
      fontSize: 20,
      fontWeight: '700',
    },
    accountActions: {
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
    deleteButton: {
      // Additional styling if needed
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
    keyboardAvoidingView: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '90%',
      minHeight: 300,
      paddingTop: 24,
      alignSelf: 'stretch',
    },
    modalScrollView: {
      flexGrow: 0,
      flexShrink: 1,
    },
    modalScrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      flexGrow: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      paddingHorizontal: 24,
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
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    typeOption: {
      width: '30%',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
    },
    typeOptionSelected: {
      backgroundColor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
    },
    typeOptionText: {
      fontSize: 12,
      marginTop: 8,
      color: isDark ? '#B0B0B0' : '#757575',
      textAlign: 'center',
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

export default AccountsScreen;

