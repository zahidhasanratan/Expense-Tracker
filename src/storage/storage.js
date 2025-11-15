import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  THEME: 'theme',
  CATEGORIES: 'categories',
  CURRENCY: 'currency',
  BUDGET: 'budget',
};

/**
 * Get expenses from storage
 * @returns {Promise<Array>} Array of expense objects
 */
export const getExpenses = async () => {
  try {
    const expensesJson = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
    return expensesJson ? JSON.parse(expensesJson) : [];
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

/**
 * Save expenses to storage
 * @param {Array} expenses - Array of expense objects
 */
export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};

/**
 * Get theme preference from storage
 * @returns {Promise<string>} 'light' or 'dark'
 */
export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
};

/**
 * Save theme preference to storage
 * @param {string} theme - 'light' or 'dark'
 */
export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

/**
 * Get categories from storage
 * @returns {Promise<Array>} Array of category strings
 */
export const getCategories = async () => {
  try {
    const categoriesJson = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categoriesJson ? JSON.parse(categoriesJson) : ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];
  }
};

/**
 * Save categories to storage
 * @param {Array} categories - Array of category strings
 */
export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

/**
 * Get currency preference from storage
 * @returns {Promise<string>} Currency code
 */
export const getCurrency = async () => {
  try {
    const currency = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY);
    return currency || 'BDT';
  } catch (error) {
    console.error('Error getting currency:', error);
    return 'BDT';
  }
};

/**
 * Save currency preference to storage
 * @param {string} currencyCode - Currency code
 */
export const saveCurrency = async (currencyCode) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, currencyCode);
  } catch (error) {
    console.error('Error saving currency:', error);
  }
};

/**
 * Get budget from storage
 * @returns {Promise<Object>} Budget object
 */
export const getBudget = async () => {
  try {
    const budgetJson = await AsyncStorage.getItem(STORAGE_KEYS.BUDGET);
    return budgetJson ? JSON.parse(budgetJson) : { monthly: 0, categories: {} };
  } catch (error) {
    console.error('Error getting budget:', error);
    return { monthly: 0, categories: {} };
  }
};

/**
 * Save budget to storage
 * @param {Object} budget - Budget object
 */
export const saveBudget = async (budget) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (error) {
    console.error('Error saving budget:', error);
  }
};

/**
 * Clear all data from storage
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.EXPENSES);
    await AsyncStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    await AsyncStorage.removeItem(STORAGE_KEYS.BUDGET);
    // Keep theme and currency preferences
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

