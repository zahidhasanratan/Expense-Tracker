/**
 * Default categories for expenses
 */
export const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];

/**
 * Get category color for UI
 * @param {string} category - Category name
 * @returns {string} Hex color code
 */
export const getCategoryColor = (category) => {
  const colors = {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Bills: '#45B7D1',
    Shopping: '#FFA07A',
    Others: '#98D8C8',
  };
  return colors[category] || '#98D8C8';
};

/**
 * Get category icon name for Expo vector icons
 * @param {string} category - Category name
 * @returns {string} Icon name
 */
export const getCategoryIcon = (category) => {
  const icons = {
    Food: 'restaurant',
    Transport: 'car',
    Bills: 'document-text',
    Shopping: 'cart',
    Others: 'ellipse',
  };
  return icons[category] || 'ellipse';
};

