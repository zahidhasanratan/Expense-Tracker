import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import CategorySelector from '../components/CategorySelector';
import { formatDateTime } from '../utils/format';

/**
 * EditExpenseScreen Component
 * Form to edit an existing expense
 */
const EditExpenseScreen = ({ route, navigation }) => {
  const { expenseId } = route.params;
  const theme = useThemeStore((state) => state.theme);
  const categories = useExpenseStore((state) => state.categories);
  const getExpenseById = useExpenseStore((state) => state.getExpenseById);
  const updateExpense = useExpenseStore((state) => state.updateExpense);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  const isDark = theme === 'dark';

  const expense = getExpenseById(expenseId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const styles = getStyles(isDark);

  // Load expense data
  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(new Date(expense.date));
      setNotes(expense.notes || '');
    }
  }, [expense]);

  // Handle save changes
  const handleSave = () => {
    if (!expense) return;

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

    // Update expense
    updateExpense(expenseId, {
      title: title.trim(),
      amount: amountNum,
      category,
      date: date.getTime(),
      notes: notes.trim(),
    });

    // Navigate back
    navigation.goBack();
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(expenseId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!expense) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Expense not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F1F8E9',
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
      backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    textArea: {
      height: 100,
      paddingTop: 16,
    },
    dateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    dateText: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      marginLeft: 12,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 20,
      gap: 12,
    },
    saveButton: {
      flex: 1,
      backgroundColor: '#4CAF50',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#D32F2F',
      borderRadius: 12,
      padding: 16,
      minWidth: 100,
      gap: 8,
    },
    deleteButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    errorText: {
      fontSize: 16,
      color: '#D32F2F',
      textAlign: 'center',
      marginTop: 40,
    },
  });

export default EditExpenseScreen;

