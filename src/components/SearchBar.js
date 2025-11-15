import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';

/**
 * SearchBar Component
 * Search input for filtering expenses
 */
const SearchBar = ({ value, onChangeText, onClear }) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={isDark ? '#B0B0B0' : '#757575'}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder="Search expenses..."
        placeholderTextColor={isDark ? '#666666' : '#999999'}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={20}
            color={isDark ? '#B0B0B0' : '#757575'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? '#3C3C3C' : '#E0E0E0',
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#212121',
      paddingVertical: 12,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
  });

export default SearchBar;

