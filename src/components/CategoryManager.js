import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { useThemeStore } from '../store/useThemeStore';
import { getCategoryColor, getCategoryIcon } from '../utils/categories';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * CategoryManager Component
 * Modal for managing categories (add, edit, delete)
 */
const CategoryManager = ({ visible, onClose }) => {
  const theme = useThemeStore((state) => state.theme);
  const categories = useExpenseStore((state) => state.categories) || [];
  const addCategory = useExpenseStore((state) => state.addCategory);
  const deleteCategory = useExpenseStore((state) => state.deleteCategory);
  const isDark = theme === 'dark';

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const styles = getStyles(isDark);

  // Refresh categories when modal opens
  useEffect(() => {
    if (visible) {
      // Force get fresh categories from store
      const storeCategories = useExpenseStore.getState().categories || [];
      console.log('CategoryManager - Modal opened');
      console.log('Categories from hook:', categories);
      console.log('Categories from store:', storeCategories);
      console.log('Categories count:', storeCategories.length);
      
      // If no categories, initialize
      if (storeCategories.length === 0 && categories.length === 0) {
        console.log('Initializing store to get default categories...');
        useExpenseStore.getState().initialize();
      }
    }
  }, [visible]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    const currentCategories = useExpenseStore.getState().categories || [];
    if (currentCategories.includes(newCategoryName.trim())) {
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

    const currentCategories = useExpenseStore.getState().categories || [];
    if (editCategoryName.trim() !== editingCategory && currentCategories.includes(editCategoryName.trim())) {
      Alert.alert('Error', 'This category name already exists.');
      return;
    }

    // Use updateCategory method from store
    const updateCategory = useExpenseStore.getState().updateCategory;
    if (updateCategory) {
      updateCategory(editingCategory, editCategoryName.trim());
    }

    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleDeleteCategory = (category) => {
    const currentCategories = useExpenseStore.getState().categories || [];
    if (currentCategories.length <= 1) {
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

  // Get categories to display - prefer store categories
  const categoriesToDisplay = categories && categories.length > 0 
    ? categories 
    : (useExpenseStore.getState().categories || []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalOverlay} edges={['bottom']}>
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

          {/* Categories List Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderTitle}>Your Categories</Text>
            <Text style={styles.listHeaderSubtitle}>
              {categoriesToDisplay.length} {categoriesToDisplay.length === 1 ? 'category' : 'categories'}
            </Text>
          </View>

          {/* Categories List */}
          <FlatList
            data={categoriesToDisplay}
            keyExtractor={(item, index) => `category-${item || 'cat'}-${index}`}
            style={styles.categoriesList}
            contentContainerStyle={[
              styles.categoriesListContent,
              categoriesToDisplay.length === 0 && styles.emptyContentContainer
            ]}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="folder-outline" size={48} color={isDark ? '#555555' : '#CCCCCC'} />
                <Text style={styles.emptyText}>No categories yet</Text>
                <Text style={styles.emptySubtext}>
                  Add your first category above
                </Text>
              </View>
            }
            renderItem={({ item: category, index }) => {
              if (!category) return null;
              const categoryColor = getCategoryColor(category);
              const categoryIcon = getCategoryIcon(category);
              const isEditing = editingCategory === category;

              return (
                <View style={styles.categoryItem}>
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
                          <Ionicons name={categoryIcon} size={22} color="#FFFFFF" />
                        </View>
                        <View style={styles.categoryTextContainer}>
                          <Text style={styles.categoryName}>{category}</Text>
                        </View>
                      </View>
                      <View style={styles.categoryActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.editButton]}
                          onPress={() => handleStartEdit(category)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="create-outline" size={20} color="#2196F3" />
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableOpacity>
                        {categoriesToDisplay.length > 1 && (
                          <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteCategory(category)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>
              );
            }}
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
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: SCREEN_HEIGHT * 0.85,
      flexDirection: 'column',
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
    listHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#3C3C3C' : '#E0E0E0',
      marginBottom: 8,
    },
    listHeaderTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 4,
    },
    listHeaderSubtitle: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
    },
    categoriesList: {
      flex: 1,
    },
    categoriesListContent: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 40,
    },
    emptyContentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    categoryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginVertical: 6,
      backgroundColor: isDark ? 'rgba(44, 44, 44, 0.5)' : 'rgba(245, 245, 245, 0.5)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
      minHeight: 60,
    },
    categoryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: 12,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryTextContainer: {
      flex: 1,
      flexShrink: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    categoryActions: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      flexShrink: 0,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      gap: 6,
      minWidth: 75,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    editButton: {
      backgroundColor: isDark ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.2)',
      borderWidth: 2,
      borderColor: '#2196F3',
    },
    deleteButton: {
      backgroundColor: isDark ? 'rgba(211, 47, 47, 0.3)' : 'rgba(211, 47, 47, 0.2)',
      borderWidth: 2,
      borderColor: '#D32F2F',
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#2196F3',
      letterSpacing: 0.3,
    },
    deleteButtonText: {
      color: '#D32F2F',
      fontWeight: '700',
      letterSpacing: 0.3,
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
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
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

export default CategoryManager;
