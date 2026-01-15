import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useThemeStore } from '../store/useThemeStore';
import { CURRENCIES } from '../utils/currencies';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * CurrencySelector Component
 * Modal for selecting currency with working search
 */
const CurrencySelector = ({ visible, onClose }) => {
  const theme = useThemeStore((state) => state.theme);
  const currencyCode = useCurrencyStore((state) => state.currencyCode);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  // Reset search when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  // Filter currencies based on search
  const filteredCurrencies = React.useMemo(() => {
    // If no search query, return all currencies
    if (!searchQuery || searchQuery.trim().length === 0) {
      return CURRENCIES;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Filter currencies with comprehensive matching
    return CURRENCIES.filter((currency) => {
      try {
        const name = String(currency.name || '').toLowerCase();
        const country = String(currency.country || '').toLowerCase();
        const code = String(currency.code || '').toLowerCase();
        const symbol = String(currency.symbol || '').toLowerCase();
        
        // Direct substring matches
        if (name.includes(query)) return true;
        if (country.includes(query)) return true;
        if (code.includes(query)) return true;
        if (symbol.includes(query)) return true;
        
        // Word-based matching
        const nameWords = name.split(/\s+/).filter(w => w.length > 0);
        const countryWords = country.split(/\s+/).filter(w => w.length > 0);
        
        for (const word of nameWords) {
          if (word.startsWith(query) || word.includes(query)) return true;
        }
        for (const word of countryWords) {
          if (word.startsWith(query) || word.includes(query)) return true;
        }
        
        // Match without spaces
        const countryNoSpaces = country.replace(/\s+/g, '');
        const queryNoSpaces = query.replace(/\s+/g, '');
        if (countryNoSpaces.includes(queryNoSpaces)) return true;
        
        // Match simplified country name
        const countrySimplified = country
          .replace(/\b(united|republic|kingdom|states|arab|emirates|of|the)\b/g, '')
          .trim();
        if (countrySimplified.length > 0 && countrySimplified.includes(query)) return true;
        
        // Match initials
        if (countryWords.length > 0) {
          const countryInitials = countryWords.map(w => w[0] || '').join('');
          if (countryInitials.includes(query)) return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error filtering currency:', error);
        return true;
      }
    });
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
      <SafeAreaView style={styles.modalOverlay} edges={['bottom']}>
        <View style={styles.modalContent}>
          {/* Header */}
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
              placeholder="Search by country, currency, or code..."
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery && searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={isDark ? '#B0B0B0' : '#757575'}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Results count */}
          {searchQuery && searchQuery.trim().length > 0 && (
            <View style={styles.resultsCount}>
              <Text style={styles.resultsCountText}>
                {filteredCurrencies.length} {filteredCurrencies.length === 1 ? 'result' : 'results'} found
              </Text>
            </View>
          )}

          {/* Currency List */}
          <FlatList
            data={filteredCurrencies}
            keyExtractor={(item) => item.code}
            style={styles.currencyList}
            contentContainerStyle={styles.currencyListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            renderItem={({ item: currency }) => {
              const isSelected = currencyCode === currency.code;
              return (
                <TouchableOpacity
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
            }}
            ListEmptyComponent={
              searchQuery && searchQuery.trim().length > 0 ? (
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
              ) : null
            }
          />
        </View>
      </SafeAreaView>
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
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: SCREEN_HEIGHT * 0.85,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 10,
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
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      margin: 16,
      marginBottom: 12,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    resultsCount: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 224, 224, 0.5)',
    },
    resultsCountText: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      fontWeight: '500',
    },
    currencyList: {
      flex: 1,
    },
    currencyListContent: {
      paddingBottom: 20,
    },
    currencyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(60, 60, 60, 0.5)' : 'rgba(224, 224, 224, 0.5)',
    },
    selectedCurrencyItem: {
      backgroundColor: isDark ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
      borderLeftWidth: 3,
      borderLeftColor: '#4CAF50',
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
      paddingVertical: 60,
      paddingHorizontal: 20,
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
