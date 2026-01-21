import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-date-picker';
// Image picker - optional, will check if available
let ImagePicker = null;
try {
  ImagePicker = require('expo-image-picker');
} catch (e) {
  console.log('expo-image-picker not available');
}
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '../store/useTransactionStore';
import { useThemeStore } from '../store/useThemeStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import CategorySelector from '../components/CategorySelector';
import { formatDateTime } from '../utils/format';

/**
 * Enhanced Add Transaction Screen
 * Supports expenses, income, accounts, payment methods, merchants, tags, etc.
 */
const AddTransactionScreen = ({ navigation, route }) => {
  const { type: initialType = 'expense' } = route?.params || {};
  
  const theme = useThemeStore((state) => state.theme);
  const currency = useCurrencyStore((state) => state.currency);
  const categories = useTransactionStore((state) => state.categories) || [];
  const accounts = useTransactionStore((state) => state.accounts) || [];
  const paymentMethods = useTransactionStore((state) => state.paymentMethods) || [];
  const merchants = useTransactionStore((state) => state.merchants) || [];
  const tags = useTransactionStore((state) => state.tags) || [];
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const addMerchant = useTransactionStore((state) => state.addMerchant);
  const addTag = useTransactionStore((state) => state.addTag);
  const getMerchantSuggestions = useTransactionStore((state) => state.getMerchantSuggestions);
  
  const isDark = theme === 'dark';

  const [transactionType, setTransactionType] = useState(initialType); // 'expense' or 'income'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  const [subcategory, setSubcategory] = useState('');
  const [account, setAccount] = useState(accounts[0]?.id || 'cash');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [merchant, setMerchant] = useState('');
  const [merchantSuggestions, setMerchantSuggestions] = useState([]);
  const [showMerchantSuggestions, setShowMerchantSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [newTag, setNewTag] = useState('');

  const styles = getStyles(isDark);

  // Update merchant suggestions
  useEffect(() => {
    if (merchant.length > 0) {
      const suggestions = getMerchantSuggestions(merchant);
      setMerchantSuggestions(suggestions);
      setShowMerchantSuggestions(suggestions.length > 0);
    } else {
      setShowMerchantSuggestions(false);
    }
  }, [merchant, getMerchantSuggestions]);

  // Handle merchant selection
  const handleMerchantSelect = (merchantName) => {
    setMerchant(merchantName);
    setShowMerchantSuggestions(false);
    if (!merchants.includes(merchantName)) {
      addMerchant(merchantName);
    }
  };

  // Handle tag toggle
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      addTag(newTag.trim());
      setSelectedTags([...selectedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Pick receipt photo
  const handlePickReceipt = async () => {
    if (!ImagePicker) {
      Alert.alert('Feature Unavailable', 'Image picker is not installed. Please install expo-image-picker to use this feature.');
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to attach receipts.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setReceiptPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Handle save transaction
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid positive amount.');
      return;
    }

    if (!category) {
      Alert.alert('Validation Error', 'Please select a category.');
      return;
    }

    if (!account) {
      Alert.alert('Validation Error', 'Please select an account.');
      return;
    }

    // Add transaction
    addTransaction({
      type: transactionType,
      title: title.trim(),
      amount: amountNum,
      category,
      subcategory: subcategory.trim() || undefined,
      account,
      paymentMethod,
      merchant: merchant.trim() || undefined,
      tags: selectedTags,
      date: date.getTime(),
      notes: notes.trim() || undefined,
      receiptPhoto: receiptPhoto || undefined,
    });

    // Save merchant if new
    if (merchant.trim() && !merchants.includes(merchant.trim())) {
      addMerchant(merchant.trim());
    }

    Alert.alert('Success', `${transactionType === 'income' ? 'Income' : 'Expense'} added successfully!`);
    navigation.goBack();
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
          {/* Transaction Type Toggle */}
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => setTransactionType('expense')}
            >
              <LinearGradient
                colors={transactionType === 'expense' ? ['#FF6B6B', '#FF5252'] : ['transparent', 'transparent']}
                style={styles.typeButtonGradient}
              >
                <Ionicons 
                  name="arrow-down-circle" 
                  size={20} 
                  color={transactionType === 'expense' ? '#FFFFFF' : (isDark ? '#B0B0B0' : '#757575')} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'expense' && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                transactionType === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => setTransactionType('income')}
            >
              <LinearGradient
                colors={transactionType === 'income' ? ['#4CAF50', '#45a049'] : ['transparent', 'transparent']}
                style={styles.typeButtonGradient}
              >
                <Ionicons 
                  name="arrow-up-circle" 
                  size={20} 
                  color={transactionType === 'income' ? '#FFFFFF' : (isDark ? '#B0B0B0' : '#757575')} 
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    transactionType === 'income' && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
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
          </View>

          {/* Category Selector */}
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={setCategory}
          />

          {/* Subcategory Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subcategory (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Groceries, Gas, Rent"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={subcategory}
              onChangeText={setSubcategory}
            />
          </View>

          {/* Account Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowAccountPicker(true)}
            >
              <Ionicons name="wallet-outline" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
              <Text style={styles.pickerButtonText}>
                {accounts.find(a => a.id === account)?.name || 'Select Account'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
            </TouchableOpacity>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Payment Method</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowPaymentMethodPicker(true)}
            >
              <Ionicons name="card-outline" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
              <Text style={styles.pickerButtonText}>
                {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
              </Text>
              <Ionicons name="chevron-down" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
            </TouchableOpacity>
          </View>

          {/* Merchant Input with Auto-suggestions */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Merchant (Optional)</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="e.g., Walmart, Starbucks"
                placeholderTextColor={isDark ? '#666666' : '#999999'}
                value={merchant}
                onChangeText={setMerchant}
              />
              {showMerchantSuggestions && merchantSuggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {merchantSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionItem}
                      onPress={() => handleMerchantSelect(suggestion)}
                    >
                      <Ionicons name="storefront-outline" size={16} color="#4CAF50" />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Tags */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Tags (Optional)</Text>
              <TouchableOpacity onPress={() => setShowTagPicker(true)}>
                <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            {selectedTags.length > 0 && (
              <View style={styles.tagsContainer}>
                {selectedTags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tagChip}
                    onPress={() => handleTagToggle(tag)}
                  >
                    <Text style={styles.tagChipText}>{tag}</Text>
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={isDark ? '#B0B0B0' : '#757575'} />
              <Text style={styles.pickerButtonText}>{formatDateTime(date.getTime())}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={showDatePicker}
              date={date}
              mode="datetime"
              onConfirm={(selectedDate) => {
                setShowDatePicker(false);
                setDate(selectedDate);
              }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          {/* Receipt Photo */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Receipt Photo (Optional)</Text>
            <TouchableOpacity style={styles.receiptButton} onPress={handlePickReceipt}>
              <Ionicons name="camera-outline" size={24} color="#4CAF50" />
              <Text style={styles.receiptButtonText}>
                {receiptPhoto ? 'Change Photo' : 'Attach Receipt'}
              </Text>
            </TouchableOpacity>
            {receiptPhoto && (
              <Text style={styles.receiptPath} numberOfLines={1}>
                {receiptPhoto.split('/').pop()}
              </Text>
            )}
          </View>

          {/* Notes Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any additional notes"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={transactionType === 'income' 
                ? ['#4CAF50', '#45a049', '#66BB6A']
                : ['#FF6B6B', '#FF5252', '#FF1744']
              }
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                Save {transactionType === 'income' ? 'Income' : 'Expense'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Account Picker Modal */}
        <Modal
          visible={showAccountPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAccountPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Account</Text>
                <TouchableOpacity onPress={() => setShowAccountPicker(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={accounts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      account === item.id && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setAccount(item.id);
                      setShowAccountPicker(false);
                    }}
                  >
                    <Ionicons
                      name={item.type === 'cash' ? 'wallet-outline' : item.type === 'credit' ? 'card-outline' : 'wallet-outline'}
                      size={24}
                      color={account === item.id ? '#4CAF50' : (isDark ? '#B0B0B0' : '#757575')}
                    />
                    <Text style={[
                      styles.modalItemText,
                      account === item.id && styles.modalItemTextSelected,
                    ]}>
                      {item.name}
                    </Text>
                    {account === item.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Payment Method Picker Modal */}
        <Modal
          visible={showPaymentMethodPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPaymentMethodPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>
                <TouchableOpacity onPress={() => setShowPaymentMethodPicker(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={paymentMethods}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      paymentMethod === item && styles.modalItemSelected,
                    ]}
                    onPress={() => {
                      setPaymentMethod(item);
                      setShowPaymentMethodPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalItemText,
                      paymentMethod === item && styles.modalItemTextSelected,
                    ]}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                    {paymentMethod === item && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Tag Picker Modal */}
        <Modal
          visible={showTagPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTagPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Tags</Text>
                <TouchableOpacity onPress={() => setShowTagPicker(false)}>
                  <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
                </TouchableOpacity>
              </View>
              <View style={styles.newTagContainer}>
                <TextInput
                  style={styles.newTagInput}
                  placeholder="Add new tag"
                  placeholderTextColor={isDark ? '#666666' : '#999999'}
                  value={newTag}
                  onChangeText={setNewTag}
                  onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={tags}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      selectedTags.includes(item) && styles.modalItemSelected,
                    ]}
                    onPress={() => handleTagToggle(item)}
                  >
                    <Text style={[
                      styles.modalItemText,
                      selectedTags.includes(item) && styles.modalItemTextSelected,
                    ]}>
                      {item}
                    </Text>
                    {selectedTags.includes(item) && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                )}
              />
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
    typeContainer: {
      flexDirection: 'row',
      marginBottom: 24,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 4,
    },
    typeButton: {
      flex: 1,
      borderRadius: 12,
      overflow: 'hidden',
    },
    typeButtonActive: {
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    typeButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 14,
      gap: 8,
    },
    typeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 8,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 14,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '700',
      color: '#4CAF50',
      marginRight: 8,
    },
    amountInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    pickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
      gap: 12,
    },
    pickerButtonText: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    suggestionsContainer: {
      marginTop: 8,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
      maxHeight: 150,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      gap: 8,
    },
    suggestionText: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    tagChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    tagChipText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    textArea: {
      height: 100,
      paddingTop: 16,
    },
    receiptButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 14,
      padding: 16,
      borderWidth: 2,
      borderColor: '#4CAF50',
      borderStyle: 'dashed',
      gap: 8,
    },
    receiptButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4CAF50',
    },
    receiptPath: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 4,
      fontStyle: 'italic',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '70%',
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    modalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      gap: 12,
    },
    modalItemSelected: {
      backgroundColor: isDark ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.1)',
    },
    modalItemText: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    modalItemTextSelected: {
      fontWeight: '700',
      color: '#4CAF50',
    },
    newTagContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 8,
    },
    newTagInput: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(245, 245, 245, 0.95)',
      borderRadius: 12,
      padding: 12,
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    addTagButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 12,
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default AddTransactionScreen;

