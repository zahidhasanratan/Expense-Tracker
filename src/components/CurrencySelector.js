import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useThemeStore } from '../store/useThemeStore';
import { CURRENCIES } from '../utils/currencies';

/**
 * CurrencySelector Component
 * Modal for selecting currency
 */
const CurrencySelector = ({ visible, onClose }) => {
  const theme = useThemeStore((state) => state.theme);
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  // Filter currencies based on search
  const filteredCurrencies = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return CURRENCIES;
    }
    const query = searchQuery.toLowerCase().trim();
    return CURRENCIES.filter(
      (currency) =>
        currency.name.toLowerCase().includes(query) ||
        currency.country.toLowerCase().includes(query) ||
        currency.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCurrency = (code) => {
    setCurrency(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search currency or country..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={isDark ? '#B0B0B0' : '#757575'}
                />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView 
            style={styles.currencyList}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => {
              const isSelected = currencyCode === currency.code;
              return (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyItem,
                    isSelected && styles.selectedCurrencyItem,
                  ]}
                  onPress={() => handleSelectCurrency(currency.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyFlag}>{currency.flag}</Text>
                    <View style={styles.currencyDetails}>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                      <Text style={styles.currencyCountry}>{currency.country}</Text>
                    </View>
                  </View>
                  <View style={styles.currencyRight}>
                    <Text style={styles.currencyCode}>{currency.code}</Text>
                    <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#4CAF50"
                        style={styles.checkIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={isDark ? '#555555' : '#CCCCCC'}
                />
                <Text style={styles.emptyText}>No currencies found</Text>
                <Text style={styles.emptySubtext}>
                  Try searching with a different term
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    closeButton: {
      padding: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      margin: 16,
      marginBottom: 8,
      borderRadius: 12,
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      paddingVertical: 12,
    },
    clearButton: {
      padding: 4,
    },
    currencyList: {
      flex: 1,
    },
    currencyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    selectedCurrencyItem: {
      backgroundColor: isDark ? '#2C2C2C' : '#F1F8E9',
    },
    currencyInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    currencyFlag: {
      fontSize: 32,
      marginRight: 12,
    },
    currencyDetails: {
      flex: 1,
    },
    currencyName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    currencyCountry: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    currencyRight: {
      alignItems: 'flex-end',
      marginLeft: 12,
    },
    currencyCode: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 4,
    },
    currencySymbol: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4CAF50',
      marginBottom: 4,
    },
    checkIcon: {
      marginTop: 4,
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
  });

export default CurrencySelector;
