import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { clearAllData } from '../storage/storage';
import { formatDateTime } from '../utils/format';
import CurrencySelector from '../components/CurrencySelector';
import CategoryManager from '../components/CategoryManager';

/**
 * SettingsScreen Component
 * App settings including theme toggle, export, and reset
 */
const SettingsScreen = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const expenses = useExpenseStore((state) => state.expenses);
  const initialize = useExpenseStore((state) => state.initialize);
  const currency = useCurrencyStore((state) => state.currency);
  const isDark = theme === 'dark';

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const styles = getStyles(isDark);

  // Handle export to CSV
  const handleExportCSV = async () => {
    try {
      if (expenses.length === 0) {
        Alert.alert('No Data', 'There are no expenses to export.');
        return;
      }

      // Create CSV content
      let csvContent = 'ID,Title,Amount,Category,Date,Notes\n';
      expenses.forEach((expense) => {
        const date = formatDateTime(expense.date);
        const notes = expense.notes ? expense.notes.replace(/,/g, ';') : '';
        csvContent += `${expense.id},${expense.title},${expense.amount},${expense.category},${date},${notes}\n`;
      });

      // Create file
      const fileName = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Expenses',
        });
        Alert.alert('Success', 'Expenses exported successfully!');
      } else {
        Alert.alert(
          'Export Complete',
          `File saved to: ${fileUri}\nSharing is not available on this device.`
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export expenses. Please try again.');
    }
  };

  // Handle reset all data
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all expenses? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await initialize();
            Alert.alert('Success', 'All data has been reset.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Ionicons name="wallet" size={48} color="#4CAF50" />
            <Text style={styles.appName}>Expense Tracker</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {/* Currency Selection */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowCurrencyModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cash-outline" size={24} color="#4CAF50" />
              <View>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingDescription}>
                  {currency ? `${currency.flag} ${currency.name} (${currency.code})` : 'Select currency'}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
            />
          </TouchableOpacity>

          {/* Category Management */}
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowCategoryModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="list-outline" size={24} color="#FF9800" />
              <View>
                <Text style={styles.settingLabel}>Manage Categories</Text>
                <Text style={styles.settingDescription}>
                  Add, edit, or delete expense categories
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
            />
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={isDark ? '#81C784' : '#FF9800'}
              />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#81C784' }}
              thumbColor={isDark ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportCSV}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color="#2196F3" />
              <View>
                <Text style={styles.settingLabel}>Export to CSV</Text>
                <Text style={styles.settingDescription}>
                  Export all expenses to a CSV file
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetData}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-outline" size={24} color="#D32F2F" />
              <View>
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Reset All Data
                </Text>
                <Text style={styles.settingDescription}>
                  Delete all expenses permanently
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? '#B0B0B0' : '#757575'}
            />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.statValue}>{expenses.length}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with Expo & React Native
          </Text>
        </View>
        </ScrollView>

        {/* Currency Selector Modal */}
        <CurrencySelector
          visible={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
        />

        {/* Category Manager Modal */}
        <CategoryManager
          visible={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
        />
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
    section: {
      marginBottom: 24,
    },
    appInfo: {
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 28,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    appName: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#212121',
      marginTop: 12,
    },
    appVersion: {
      fontSize: 14,
      color: isDark ? '#B0B0B0' : '#757575',
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#B0B0B0' : '#757575',
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 18,
      marginBottom: 12,
      shadowColor: isDark ? '#000' : '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.15)',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
      marginLeft: 12,
    },
    settingDescription: {
      fontSize: 12,
      color: isDark ? '#B0B0B0' : '#757575',
      marginLeft: 12,
      marginTop: 2,
    },
    dangerText: {
      color: '#D32F2F',
    },
    statItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.95)',
      borderRadius: 16,
      padding: 18,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(76, 175, 80, 0.2)',
    },
    statLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#212121',
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4CAF50',
    },
    footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    footerText: {
      fontSize: 12,
      color: isDark ? '#555555' : '#9E9E9E',
    },
  });

export default SettingsScreen;

