import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-date-picker';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useExpenseStore } from '../store/useExpenseStore';

/**
 * AdvancedFilter Component
 * Advanced search and filter UI for transactions
 */
const AdvancedFilter = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const theme = useThemeStore((state) => state.theme);
  const transactionStore = useTransactionStore();
  const expenseStore = useExpenseStore();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  const [type, setType] = useState(initialFilters.type || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [account, setAccount] = useState(initialFilters.account || '');
  const [paymentMethod, setPaymentMethod] = useState(initialFilters.paymentMethod || '');
  const [tags, setTags] = useState(initialFilters.tags || []);
  const [startDate, setStartDate] = useState(initialFilters.startDate ? new Date(initialFilters.startDate) : null);
  const [endDate, setEndDate] = useState(initialFilters.endDate ? new Date(initialFilters.endDate) : null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [amountMin, setAmountMin] = useState(initialFilters.amountMin || '');
  const [amountMax, setAmountMax] = useState(initialFilters.amountMax || '');

  const categories = expenseStore.categories || [];
  const accounts = transactionStore.accounts || [];
  const paymentMethods = transactionStore.paymentMethods || [];
  const allTags = transactionStore.tags || [];

  const styles = getStyles(isDark);

  useEffect(() => {
    if (visible) {
      setSearchQuery(initialFilters.searchQuery || '');
      setType(initialFilters.type || '');
      setCategory(initialFilters.category || '');
      setAccount(initialFilters.account || '');
      setPaymentMethod(initialFilters.paymentMethod || '');
      setTags(initialFilters.tags || []);
      setStartDate(initialFilters.startDate ? new Date(initialFilters.startDate) : null);
      setEndDate(initialFilters.endDate ? new Date(initialFilters.endDate) : null);
      setAmountMin(initialFilters.amountMin || '');
      setAmountMax(initialFilters.amountMax || '');
    }
  }, [visible, initialFilters]);

  const handleApply = () => {
    const filters = {
      searchQuery: searchQuery.trim() || undefined,
      type: type || undefined,
      category: category || undefined,
      account: account || undefined,
      paymentMethod: paymentMethod || undefined,
      tags: tags.length > 0 ? tags : undefined,
      startDate: startDate ? startDate.getTime() : undefined,
      endDate: endDate ? endDate.getTime() : undefined,
      amountMin: amountMin ? parseFloat(amountMin) : undefined,
      amountMax: amountMax ? parseFloat(amountMax) : undefined,
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setSearchQuery('');
    setType('');
    setCategory('');
    setAccount('');
    setPaymentMethod('');
    setTags([]);
    setStartDate(null);
    setEndDate(null);
    setAmountMin('');
    setAmountMax('');
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const hasActiveFilters = searchQuery || type || category || account || paymentMethod || tags.length > 0 || startDate || endDate || amountMin || amountMax;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={isDark ? ['#1a1a2e', '#16213e'] : ['#FFFFFF', '#F5F5F5']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Advanced Filter</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* Search */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Search</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="search" size={20} color={isDark ? '#B0B0B0' : '#757575'} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Search by title, merchant, notes..."
                    placeholderTextColor={isDark ? '#666666' : '#999999'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>

              {/* Type */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Type</Text>
                <View style={styles.buttonRow}>
                  {['', 'expense', 'income', 'transfer'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.filterButton, type === t && styles.filterButtonActive]}
                      onPress={() => setType(t)}
                    >
                      <Text style={[styles.filterButtonText, type === t && styles.filterButtonTextActive]}>
                        {t || 'All'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Category */}
              {categories.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    <TouchableOpacity
                      style={[styles.filterButton, !category && styles.filterButtonActive]}
                      onPress={() => setCategory('')}
                    >
                      <Text style={[styles.filterButtonText, !category && styles.filterButtonTextActive]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.filterButton, category === cat && styles.filterButtonActive]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text style={[styles.filterButtonText, category === cat && styles.filterButtonTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Account */}
              {accounts.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Account</Text>
                  <View style={styles.selectContainer}>
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={() => {
                        // Simple selection - can be enhanced with modal
                        const currentIndex = account ? accounts.findIndex(a => a.id === account) : -1;
                        const nextIndex = (currentIndex + 1) % (accounts.length + 1);
                        setAccount(nextIndex === 0 ? '' : accounts[nextIndex - 1].id);
                      }}
                    >
                      <Text style={styles.selectText}>
                        {account ? accounts.find(a => a.id === account)?.name || 'Unknown' : 'All Accounts'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Payment Method */}
              {paymentMethods.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Payment Method</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.filterButton, !paymentMethod && styles.filterButtonActive]}
                      onPress={() => setPaymentMethod('')}
                    >
                      <Text style={[styles.filterButtonText, !paymentMethod && styles.filterButtonTextActive]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    {paymentMethods.map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[styles.filterButton, paymentMethod === method && styles.filterButtonActive]}
                        onPress={() => setPaymentMethod(method)}
                      >
                        <Text style={[styles.filterButtonText, paymentMethod === method && styles.filterButtonTextActive]}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Amount Range */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Amount Range</Text>
                <View style={styles.amountRow}>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.amountLabel}>Min</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="0"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={amountMin}
                      onChangeText={setAmountMin}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={styles.amountSeparator}>-</Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={styles.amountLabel}>Max</Text>
                    <TextInput
                      style={styles.amountInput}
                      placeholder="∞"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={amountMax}
                      onChangeText={setAmountMax}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Date Range */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Date Range</Text>
                <View style={styles.dateRow}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
                    <Text style={styles.dateText}>
                      {startDate ? startDate.toLocaleDateString() : 'Start Date'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.dateSeparator}>to</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Ionicons name="calendar-outline" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
                    <Text style={styles.dateText}>
                      {endDate ? endDate.toLocaleDateString() : 'End Date'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tags */}
              {allTags.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Tags</Text>
                  <View style={styles.tagsContainer}>
                    {allTags.map((tag) => (
                      <TouchableOpacity
                        key={tag}
                        style={[styles.tagButton, tags.includes(tag) && styles.tagButtonActive]}
                        onPress={() => toggleTag(tag)}
                      >
                        <Text style={[styles.tagText, tags.includes(tag) && styles.tagTextActive]}>
                          {tag}
                        </Text>
                        {tags.includes(tag) && (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" style={styles.tagCheck} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.applyButton, !hasActiveFilters && styles.applyButtonDisabled]}
                onPress={handleApply}
                disabled={!hasActiveFilters}
              >
                <LinearGradient
                  colors={hasActiveFilters ? ['#4CAF50', '#45a049'] : ['#CCCCCC', '#AAAAAA']}
                  style={styles.applyGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Date Pickers */}
        <DatePicker
          modal
          open={showStartDatePicker}
          date={startDate || new Date()}
          mode="date"
          onConfirm={(date) => {
            setStartDate(date);
            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
        />
        <DatePicker
          modal
          open={showEndDatePicker}
          date={endDate || new Date()}
          mode="date"
          onConfirm={(date) => {
            setEndDate(date);
            setShowEndDatePicker(false);
          }}
          onCancel={() => setShowEndDatePicker(false)}
        />
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
      height: '90%',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: 'hidden',
    },
    gradient: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    closeButton: {
      padding: 4,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      paddingVertical: 12,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    filterButtonActive: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    horizontalScroll: {
      marginHorizontal: -20,
      paddingHorizontal: 20,
    },
    selectContainer: {
      marginTop: 8,
    },
    selectButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    selectText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    amountRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    amountInputContainer: {
      flex: 1,
    },
    amountLabel: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 8,
    },
    amountInput: {
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    amountSeparator: {
      fontSize: 18,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 20,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    dateButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    dateText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    dateSeparator: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    tagButtonActive: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    },
    tagText: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    tagTextActive: {
      color: '#FFFFFF',
    },
    tagCheck: {
      marginLeft: 4,
    },
    footer: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    actionButton: {
      flex: 1,
      borderRadius: 12,
      overflow: 'hidden',
    },
    resetButton: {
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      padding: 16,
      alignItems: 'center',
    },
    resetButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    applyButton: {
      overflow: 'hidden',
    },
    applyButtonDisabled: {
      opacity: 0.5,
    },
    applyGradient: {
      padding: 16,
      alignItems: 'center',
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

export default AdvancedFilter;

