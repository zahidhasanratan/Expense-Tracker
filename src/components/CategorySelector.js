import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryColor, getCategoryIcon } from '../utils/categories';
import { useThemeStore } from '../store/useThemeStore';
import { useExpenseStore } from '../store/useExpenseStore';

/**
 * CategorySelector Component
 * Displays selectable category buttons
 */
const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  const theme = useThemeStore((state) => state.theme);
  const categories = useExpenseStore((state) => state.categories);
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const categoryColor = getCategoryColor(category);
          const categoryIcon = getCategoryIcon(category);

          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                isSelected && { backgroundColor: categoryColor },
                isSelected && styles.selectedButton,
              ]}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={categoryIcon}
                size={20}
                color={isSelected ? '#FFFFFF' : (isDark ? '#B0B0B0' : '#757575')}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#212121',
      marginBottom: 12,
    },
    scrollContent: {
      paddingRight: 20,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: isDark ? '#3C3C3C' : '#F5F5F5',
      marginRight: 10,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedButton: {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#B0B0B0' : '#757575',
      marginLeft: 6,
    },
    selectedText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

export default CategorySelector;

