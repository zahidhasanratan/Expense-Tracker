import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  TRANSACTIONS: 'transactions',
  THEME: 'theme',
  CATEGORIES: 'categories',
  CURRENCY: 'currency',
  BUDGET: 'budget',
  ACCOUNTS: 'accounts',
  PAYMENT_METHODS: 'paymentMethods',
  MERCHANTS: 'merchants',
  TAGS: 'tags',
  RECURRING: 'recurringTransactions',
  GOALS: 'goals',
  TEMPLATES: 'templates',
  PIN: 'pin',
  BACKUP: 'backup',
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
 * Get transactions from storage
 */
export const getTransactions = async () => {
  try {
    const transactionsJson = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactionsJson ? JSON.parse(transactionsJson) : [];
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

/**
 * Save transactions to storage
 */
export const saveTransactions = async (transactions) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

/**
 * Get accounts from storage
 */
export const getAccounts = async () => {
  try {
    const accountsJson = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return accountsJson ? JSON.parse(accountsJson) : [];
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

/**
 * Save accounts to storage
 */
export const saveAccounts = async (accounts) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (error) {
    console.error('Error saving accounts:', error);
  }
};

/**
 * Get payment methods from storage
 */
export const getPaymentMethods = async () => {
  try {
    const methodsJson = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
    return methodsJson ? JSON.parse(methodsJson) : [];
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return [];
  }
};

/**
 * Save payment methods to storage
 */
export const savePaymentMethods = async (methods) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods));
  } catch (error) {
    console.error('Error saving payment methods:', error);
  }
};

/**
 * Get merchants from storage
 */
export const getMerchants = async () => {
  try {
    const merchantsJson = await AsyncStorage.getItem(STORAGE_KEYS.MERCHANTS);
    return merchantsJson ? JSON.parse(merchantsJson) : [];
  } catch (error) {
    console.error('Error getting merchants:', error);
    return [];
  }
};

/**
 * Save merchants to storage
 */
export const saveMerchants = async (merchants) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MERCHANTS, JSON.stringify(merchants));
  } catch (error) {
    console.error('Error saving merchants:', error);
  }
};

/**
 * Get tags from storage
 */
export const getTags = async () => {
  try {
    const tagsJson = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
    return tagsJson ? JSON.parse(tagsJson) : [];
  } catch (error) {
    console.error('Error getting tags:', error);
    return [];
  }
};

/**
 * Save tags to storage
 */
export const saveTags = async (tags) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  } catch (error) {
    console.error('Error saving tags:', error);
  }
};

/**
 * Get recurring transactions from storage
 */
export const getRecurringTransactions = async () => {
  try {
    const recurringJson = await AsyncStorage.getItem(STORAGE_KEYS.RECURRING);
    return recurringJson ? JSON.parse(recurringJson) : [];
  } catch (error) {
    console.error('Error getting recurring transactions:', error);
    return [];
  }
};

/**
 * Save recurring transactions to storage
 */
export const saveRecurringTransactions = async (recurring) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurring));
  } catch (error) {
    console.error('Error saving recurring transactions:', error);
  }
};

/**
 * Get goals from storage
 */
export const getGoals = async () => {
  try {
    const goalsJson = await AsyncStorage.getItem(STORAGE_KEYS.GOALS);
    return goalsJson ? JSON.parse(goalsJson) : [];
  } catch (error) {
    console.error('Error getting goals:', error);
    return [];
  }
};

/**
 * Save goals to storage
 */
export const saveGoals = async (goals) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals:', error);
  }
};

/**
 * Get templates from storage
 */
export const getTemplates = async () => {
  try {
    const templatesJson = await AsyncStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return templatesJson ? JSON.parse(templatesJson) : [];
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
};

/**
 * Save templates to storage
 */
export const saveTemplates = async (templates) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving templates:', error);
  }
};

/**
 * Get PIN from storage
 */
export const getPIN = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.PIN);
  } catch (error) {
    console.error('Error getting PIN:', error);
    return null;
  }
};

/**
 * Save PIN to storage
 */
export const savePIN = async (pin) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PIN, pin);
  } catch (error) {
    console.error('Error saving PIN:', error);
  }
};

/**
 * Export all data for backup
 */
export const exportAllData = async () => {
  try {
    const data = {
      transactions: await getTransactions(),
      accounts: await getAccounts(),
      categories: await getCategories(),
      budget: await getBudget(),
      recurring: await getRecurringTransactions(),
      goals: await getGoals(),
      templates: await getTemplates(),
      currency: await getCurrency(),
      theme: await getTheme(),
      exportDate: new Date().toISOString(),
    };
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

/**
 * Import data from backup
 */
export const importAllData = async (data) => {
  try {
    if (data.transactions) await saveTransactions(data.transactions);
    if (data.accounts) await saveAccounts(data.accounts);
    if (data.categories) await saveCategories(data.categories);
    if (data.budget) await saveBudget(data.budget);
    if (data.recurring) await saveRecurringTransactions(data.recurring);
    if (data.goals) await saveGoals(data.goals);
    if (data.templates) await saveTemplates(data.templates);
    if (data.currency) await saveCurrency(data.currency);
    if (data.theme) await saveTheme(data.theme);
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Clear all data from storage
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.EXPENSES);
    await AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    await AsyncStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    await AsyncStorage.removeItem(STORAGE_KEYS.BUDGET);
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
    await AsyncStorage.removeItem(STORAGE_KEYS.RECURRING);
    await AsyncStorage.removeItem(STORAGE_KEYS.GOALS);
    await AsyncStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    // Keep theme, currency, and PIN preferences
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

