/**
 * Format amount to currency string
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Optional currency code (uses store if not provided)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = null) => {
  try {
    let symbol = '₹';
    let formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (currencyCode) {
      const { getCurrencyByCode } = require('./currencies');
      const currency = getCurrencyByCode(currencyCode);
      symbol = currency.symbol;
    } else {
      // Try to get from store
      try {
        const { useCurrencyStore } = require('../store/useCurrencyStore');
        const store = useCurrencyStore.getState();
        const currency = store.currency || { symbol: '₹' };
        symbol = currency.symbol || '₹';
      } catch (e) {
        // Fallback to default
      }
    }
    
    // Some currencies put symbol after amount
    if (currencyCode && ['EUR', 'GBP'].includes(currencyCode)) {
      return `${formattedAmount} ${symbol}`;
    }
    
    return `${symbol}${formattedAmount}`;
  } catch (error) {
    // Fallback
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `₹${formattedAmount}`;
  }
};

/**
 * Format timestamp to readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  // Check if yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Format as DD MMM YYYY
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Format timestamp to date and time string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

/**
 * Get start of day timestamp
 * @param {Date} date - Date object
 * @returns {number} Timestamp at start of day
 */
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/**
 * Get end of day timestamp
 * @param {Date} date - Date object
 * @returns {number} Timestamp at end of day
 */
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

/**
 * Get start of week timestamp (Monday)
 * @param {Date} date - Date object
 * @returns {number} Timestamp at start of week
 */
export const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/**
 * Get end of week timestamp (Sunday)
 * @param {Date} date - Date object
 * @returns {number} Timestamp at end of week
 */
export const getEndOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust to Sunday
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

/**
 * Get start of month timestamp
 * @param {Date} date - Date object
 * @returns {number} Timestamp at start of month
 */
export const getStartOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/**
 * Get end of month timestamp
 * @param {Date} date - Date object
 * @returns {number} Timestamp at end of month
 */
export const getEndOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

/**
 * Generate unique ID for expenses
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

