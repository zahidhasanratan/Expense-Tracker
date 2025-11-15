import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import { getCategoryColor, getCategoryIcon } from '../utils/categories';

/**
 * CategoryManager Component
 * Modal for managing categories (add, edit, delete)
 */
const CategoryManager = ({ visible, onClose }) => {
  const theme = useThemeStore((state) => state.theme);
  const categories = useExpenseStore((state) => state.categories);
  const addCategory = useExpenseStore((state) => state.addCategory);
  const deleteCategory = useExpenseStore((state) => state.deleteCategory);
  const isDark = theme === 'dark';

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const styles = getStyles(isDark);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    if (categories.includes(newCategoryName.trim())) {
      Alert.alert('Error', 'This category already exists.');
      return;
    }

    addCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category);
  };

  const handleSaveEdit = () => {
    if (!editCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    if (editCategoryName.trim() !== editingCategory && categories.includes(editCategoryName.trim())) {
      Alert.alert('Error', 'This category name already exists.');
      return;
    }

    // Use updateCategory method from store
    useExpenseStore.getState().updateCategory(editingCategory, editCategoryName.trim());

    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (category) => {
    if (categories.length <= 1) {
      Alert.alert('Error', 'You must have at least one category.');
      return;
    }

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category}"? Expenses with this category will be moved to "Others".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Move expenses to "Others"
            const expenses = useExpenseStore.getState().expenses;
            const updatedExpenses = expenses.map((exp) =>
              exp.category === category ? { ...exp, category: 'Others' } : exp
            );
            useExpenseStore.getState().updateExpenses(updatedExpenses);

            // Remove category
            deleteCategory(category);
          },
        },
      ]
    );
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
            <Text style={styles.modalTitle}>Manage Categories</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#212121'} />
            </TouchableOpacity>
          </View>

          {/* Add New Category */}
          <View style={styles.addCategoryContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new category name"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              onSubmitEditing={handleAddCategory}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCategory}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          <ScrollView style={styles.categoriesList}>
            {categories.map((category) => {
              const categoryColor = getCategoryColor(category);
              const categoryIcon = getCategoryIcon(category);
              const isEditing = editingCategory === category;

              return (
                <View key={category} style={styles.categoryItem}>
                  {isEditing ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={styles.editInput}
                        value={editCategoryName}
                        onChangeText={setEditCategoryName}
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveEdit}
                      >
                        <Ionicons name="checkmark" size={20} color="#4CAF50" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setEditingCategory(null);
                          setEditCategoryName('');
                        }}
                      >
                        <Ionicons name="close" size={20} color="#D32F2F" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <View style={styles.categoryInfo}>
                        <View
                          style={[styles.categoryIcon, { backgroundColor: categoryColor }]}
                        >
                          <Ionicons name={categoryIcon} size={20} color="#FFFFFF" />
                        </View>
                        <Text style={styles.categoryName}>{category}</Text>
                      </View>
                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleStartEdit(category)}
                        >
                          <Ionicons name="pencil" size={20} color="#2196F3" />
                        </TouchableOpacity>
                        {categories.length > 1 && (
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteCategory(category)}
                          >
                            <Ionicons name="trash" size={20} color="#D32F2F" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              );
            })}
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
    addCategoryContainer: {
      flexDirection: 'row',
      padding: 16,
      gap: 8,
    },
    input: {
      flex: 1,
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
    },
    editContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    editInput: {
      flex: 1,
      backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5',
      borderRadius: 8,
      padding: 8,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
    },
    saveButton: {
      padding: 8,
    },
    cancelButton: {
      padding: 8,
    },
  });

export default CategoryManager;
