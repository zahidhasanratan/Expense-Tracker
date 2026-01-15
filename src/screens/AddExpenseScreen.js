import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import DatePicker from 'react-native-date-picker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import CategorySelector from '../components/CategorySelector';
import { formatDateTime } from '../utils/format';

/**
 * AddExpenseScreen Component
 * Form to add a new expense
 */
const AddExpenseScreen = ({ navigation }) => {
  const theme = useThemeStore((state) => state.theme);
  const categories = useExpenseStore((state) => state.categories);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Food');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const styles = getStyles(isDark);

  // Handle save expense
  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for the expense.');
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

    // Add expense
    addExpense({
      title: title.trim(),
      amount: amountNum,
      category,
      date: date.getTime(),
      notes: notes.trim(),
    });

    // Reset form
    setTitle('');
    setAmount('');
    setCategory(categories[0] || 'Food');
    setDate(new Date());
    setNotes('');

    // Navigate back
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
        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter expense title"
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor={isDark ? '#666666' : '#999999'}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Category Selector */}
        <CategorySelector
          selectedCategory={category}
          onSelectCategory={setCategory}
        />

        {/* Date Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date & Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
            />
            <Text style={styles.dateText}>{formatDateTime(date.getTime())}</Text>
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
            onCancel={() => {
              setShowDatePicker(false);
            }}
          />
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
            colors={['#4CAF50', '#45a049', '#66BB6A']}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Save Expense</Text>
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
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
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
    textArea: {
      height: 100,
      paddingTop: 16,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    dateText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      marginLeft: 12,
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

export default AddExpenseScreen;

