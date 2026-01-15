import { create } from 'zustand';
import { getExpenses, saveExpenses, getCategories, saveCategories } from '../storage/storage';
import { generateId } from '../utils/format';

/**
 * Zustand store for expense management
 */
export const useExpenseStore = create((set, get) => ({
  // State
  expenses: [],
  categories: [],
  isLoading: false,

  // Initialize store from storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const expenses = await getExpenses();
      let categories = await getCategories();
      // Ensure categories is always an array
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        categories = ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];
        await saveCategories(categories);
      }
      set({ expenses, categories, isLoading: false });
    } catch (error) {
      console.error('Error initializing store:', error);
      // Set default categories on error
      const defaultCategories = ['Food', 'Transport', 'Bills', 'Shopping', 'Others'];
      set({ expenses: [], categories: defaultCategories, isLoading: false });
    }
  },

  // Add new expense
  addExpense: (expense) => {
    const newExpense = {
      ...expense,
      id: generateId(),
      date: expense.date || Date.now(),
    };
    const expenses = [...get().expenses, newExpense];
    set({ expenses });
    saveExpenses(expenses).catch((error) => {
      console.error('Error saving expense:', error);
    });
    return newExpense.id;
  },

  // Update existing expense
  updateExpense: (id, updatedExpense) => {
    const expenses = get().expenses.map((exp) =>
      exp.id === id ? { ...exp, ...updatedExpense } : exp
    );
    set({ expenses });
    saveExpenses(expenses).catch((error) => {
      console.error('Error updating expense:', error);
    });
  },

  // Delete expense
  deleteExpense: (id) => {
    const expenses = get().expenses.filter((exp) => exp.id !== id);
    set({ expenses });
    saveExpenses(expenses).catch((error) => {
      console.error('Error deleting expense:', error);
    });
  },

  // Get expense by ID
  getExpenseById: (id) => {
    return get().expenses.find((exp) => exp.id === id);
  },

  // Get expenses filtered by date range
  getExpensesByDateRange: (startDate, endDate) => {
    return get().expenses.filter(
      (exp) => exp.date >= startDate && exp.date <= endDate
    );
  },

  // Get total amount for date range
  getTotalByDateRange: (startDate, endDate) => {
    const expenses = get().getExpensesByDateRange(startDate, endDate);
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  },

  // Get expenses grouped by category
  getExpensesByCategory: (startDate, endDate) => {
    const expenses = get().getExpensesByDateRange(startDate, endDate);
    const grouped = {};
    expenses.forEach((exp) => {
      if (grouped[exp.category]) {
        grouped[exp.category] += exp.amount;
      } else {
        grouped[exp.category] = exp.amount;
      }
    });
    return grouped;
  },

  // Get recent expenses (last N)
  getRecentExpenses: (limit = 10) => {
    const expenses = [...get().expenses];
    return expenses
      .sort((a, b) => b.date - a.date)
      .slice(0, limit);
  },

  // Add custom category
  addCategory: (category) => {
    const categories = [...get().categories];
    if (!categories.includes(category)) {
      categories.push(category);
      set({ categories });
      saveCategories(categories).catch((error) => {
        console.error('Error saving category:', error);
      });
    }
  },

  // Delete category
  deleteCategory: (category) => {
    const categories = get().categories.filter((cat) => cat !== category);
    set({ categories });
    saveCategories(categories).catch((error) => {
      console.error('Error deleting category:', error);
    });
  },

  // Set categories
  setCategories: (categories) => {
    set({ categories });
    saveCategories(categories).catch((error) => {
      console.error('Error setting categories:', error);
    });
  },

  // Update all expenses (for category renaming)
  updateExpenses: (expenses) => {
    set({ expenses });
    saveExpenses(expenses).catch((error) => {
      console.error('Error updating expenses:', error);
    });
  },

  // Update category name
  updateCategory: (oldName, newName) => {
    const categories = get().categories.map((cat) =>
      cat === oldName ? newName : cat
    );
    // Update expenses with old category name
    const expenses = get().expenses.map((exp) =>
      exp.category === oldName ? { ...exp, category: newName } : exp
    );
    set({ categories, expenses });
    saveCategories(categories).catch((error) => {
      console.error('Error updating category:', error);
    });
    saveExpenses(expenses).catch((error) => {
      console.error('Error updating expenses:', error);
    });
  },

  // Search expenses
  searchExpenses: (query) => {
    const expenses = get().expenses;
    if (!query || query.trim() === '') return expenses;
    
    const lowerQuery = query.toLowerCase();
    return expenses.filter((exp) => {
      return (
        exp.title.toLowerCase().includes(lowerQuery) ||
        exp.category.toLowerCase().includes(lowerQuery) ||
        (exp.notes && exp.notes.toLowerCase().includes(lowerQuery))
      );
    });
  },

  // Filter expenses by category
  filterExpensesByCategory: (category) => {
    if (!category) return get().expenses;
    return get().expenses.filter((exp) => exp.category === category);
  },

  // Get monthly expenses for chart data
  getMonthlyChartData: (year, month) => {
    const startDate = new Date(year, month, 1).getTime();
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
    const expenses = get().getExpensesByDateRange(startDate, endDate);
    
    // Group by day
    const dailyData = {};
    expenses.forEach((exp) => {
      const day = new Date(exp.date).getDate();
      if (dailyData[day]) {
        dailyData[day] += exp.amount;
      } else {
        dailyData[day] = exp.amount;
      }
    });

    // Convert to array format for chart
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const chartData = [];
    for (let day = 1; day <= daysInMonth; day++) {
      chartData.push({
        date: day.toString(),
        amount: dailyData[day] || 0,
      });
    }
    return chartData;
  },
}));

