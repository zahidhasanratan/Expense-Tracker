import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { formatCurrency } from '../utils/format';

/**
 * Transfer Screen
 * Transfer funds between accounts
 */
const TransferScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const accounts = useTransactionStore((state) => state.accounts) || [];
  const transferFunds = useTransactionStore((state) => state.transferFunds);
  const getAccountsBalance = useTransactionStore((state) => state.getAccountsBalance);
  
  const isDark = theme === 'dark';
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const styles = getStyles(isDark);

  const handleTransfer = () => {
    if (!fromAccount || !toAccount) {
      Alert.alert('Error', 'Please select both accounts');
      return;
    }

    if (fromAccount === toAccount) {
      Alert.alert('Error', 'Cannot transfer to the same account');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const fromBalance = getAccountsBalance(fromAccount);
    if (transferAmount > fromBalance) {
      Alert.alert('Insufficient Funds', `Available balance: ${formatCurrency(fromBalance, currency.code)}`);
      return;
    }

    transferFunds(fromAccount, toAccount, transferAmount, notes.trim());
    
    Alert.alert('Success', 'Transfer completed successfully', [
      {
        text: 'OK',
        onPress: () => {
          setFromAccount('');
          setToAccount('');
          setAmount('');
          setNotes('');
        },
      },
    ]);
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
          <Text style={styles.title}>Transfer Funds</Text>
          <Text style={styles.subtitle}>Move money between your accounts</Text>

          {/* From Account */}
          <View style={styles.section}>
            <Text style={styles.label}>From Account *</Text>
            <View style={styles.accountsGrid}>
              {accounts.map((account) => {
                const balance = getAccountsBalance(account.id);
                const isSelected = fromAccount === account.id;
                return (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountCard,
                      isSelected && styles.accountCardSelected,
                    ]}
                    onPress={() => setFromAccount(account.id)}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={24}
                      color={isSelected ? '#4CAF50' : (isDark ? '#B0B0B0' : '#757575')}
                    />
                    <Text style={[
                      styles.accountName,
                      isSelected && styles.accountNameSelected,
                    ]}>
                      {account.name}
                    </Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(balance, currency.code)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Transfer Arrow */}
          <View style={styles.arrowContainer}>
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.arrowCircle}
            >
              <Ionicons name="arrow-down" size={24} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* To Account */}
          <View style={styles.section}>
            <Text style={styles.label}>To Account *</Text>
            <View style={styles.accountsGrid}>
              {accounts.filter(acc => acc.id !== fromAccount).map((account) => {
                const balance = getAccountsBalance(account.id);
                const isSelected = toAccount === account.id;
                return (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountCard,
                      isSelected && styles.accountCardSelected,
                    ]}
                    onPress={() => setToAccount(account.id)}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={24}
                      color={isSelected ? '#4CAF50' : (isDark ? '#B0B0B0' : '#757575')}
                    />
                    <Text style={[
                      styles.accountName,
                      isSelected && styles.accountNameSelected,
                    ]}>
                      {account.name}
                    </Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(balance, currency.code)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount *</Text>
            <View style={styles.amountContainer}>
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
            {fromAccount && (
              <Text style={styles.balanceHint}>
                Available: {formatCurrency(getAccountsBalance(fromAccount), currency.code)}
              </Text>
            )}
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add a note about this transfer"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Transfer Button */}
          <TouchableOpacity
            style={styles.transferButton}
            onPress={handleTransfer}
            disabled={!fromAccount || !toAccount || !amount}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.transferButtonGradient}
            >
              <Ionicons name="swap-horizontal" size={24} color="#FFFFFF" />
              <Text style={styles.transferButtonText}>Transfer Funds</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 32,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
    },
    accountsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    accountCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    accountCardSelected: {
      borderColor: '#4CAF50',
      backgroundColor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
    },
    accountName: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginTop: 8,
      marginBottom: 4,
      textAlign: 'center',
    },
    accountNameSelected: {
      color: '#4CAF50',
    },
    accountBalance: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      textAlign: 'center',
    },
    arrowContainer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    arrowCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: '700',
      color: '#4CAF50',
      marginRight: 12,
    },
    amountInput: {
      flex: 1,
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    balanceHint: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 8,
      marginLeft: 4,
    },
    notesInput: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.15)',
      minHeight: 100,
      textAlignVertical: 'top',
    },
    transferButton: {
      borderRadius: 16,
      marginTop: 20,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    transferButtonGradient: {
      borderRadius: 16,
      padding: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    transferButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });

export default TransferScreen;

