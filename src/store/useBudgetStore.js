import { create } from 'zustand';
import { getBudget, saveBudget } from '../storage/storage';
import { getStartOfMonth, getEndOfMonth } from '../utils/format';

/**
 * Enhanced Budget Store
 * Supports monthly budgets, category budgets, rollover, and alerts
 */
export const useBudgetStore = create((set, get) => ({
  // State
  monthlyBudget: 0,
  categoryBudgets: {},
  rolloverEnabled: false,
  alertsEnabled: true,
  alertThreshold: 0.8, // Alert at 80% of budget

  // Initialize
  initialize: async () => {
    try {
      const budget = await getBudget();
      set({
        monthlyBudget: budget.monthly || 0,
        categoryBudgets: budget.categories || {},
        rolloverEnabled: budget.rolloverEnabled || false,
        alertsEnabled: budget.alertsEnabled !== false,
        alertThreshold: budget.alertThreshold || 0.8,
      });
    } catch (error) {
      console.error('Error initializing budget:', error);
    }
  },

  // Set monthly budget
  setMonthlyBudget: (amount) => {
    const budget = {
      monthly: amount,
      categories: get().categoryBudgets,
      rolloverEnabled: get().rolloverEnabled,
      alertsEnabled: get().alertsEnabled,
      alertThreshold: get().alertThreshold,
    };
    set({ monthlyBudget: amount });
    saveBudget(budget).catch(console.error);
  },

  // Set category budget
  setCategoryBudget: (category, amount) => {
    const categoryBudgets = { ...get().categoryBudgets, [category]: amount };
    const budget = {
      monthly: get().monthlyBudget,
      categories: categoryBudgets,
      rolloverEnabled: get().rolloverEnabled,
      alertsEnabled: get().alertsEnabled,
      alertThreshold: get().alertThreshold,
    };
    set({ categoryBudgets });
    saveBudget(budget).catch(console.error);
  },

  // Remove category budget
  removeCategoryBudget: (category) => {
    const categoryBudgets = { ...get().categoryBudgets };
    delete categoryBudgets[category];
    const budget = {
      monthly: get().monthlyBudget,
      categories: categoryBudgets,
      rolloverEnabled: get().rolloverEnabled,
      alertsEnabled: get().alertsEnabled,
      alertThreshold: get().alertThreshold,
    };
    set({ categoryBudgets });
    saveBudget(budget).catch(console.error);
  },

  // Toggle rollover
  setRolloverEnabled: (enabled) => {
    const budget = {
      monthly: get().monthlyBudget,
      categories: get().categoryBudgets,
      rolloverEnabled: enabled,
      alertsEnabled: get().alertsEnabled,
      alertThreshold: get().alertThreshold,
    };
    set({ rolloverEnabled: enabled });
    saveBudget(budget).catch(console.error);
  },

  // Get current month spending
  getCurrentMonthSpending: (transactions = []) => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'expense' && t.date >= start && t.date <= end && !t.isDeleted)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  },

  // Get category spending for current month
  getCategorySpending: (category, transactions = []) => {
    const start = getStartOfMonth(new Date());
    const end = getEndOfMonth(new Date());
    return transactions
      .filter(t => t.type === 'expense' && t.category === category && t.date >= start && t.date <= end && !t.isDeleted)
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  },

  // Get remaining monthly budget
  getRemainingMonthlyBudget: (transactions = []) => {
    const spent = get().getCurrentMonthSpending(transactions);
    return get().monthlyBudget - spent;
  },

  // Get remaining category budget
  getRemainingCategoryBudget: (category, transactions = []) => {
    const budget = get().categoryBudgets[category] || 0;
    const spent = get().getCategorySpending(category, transactions);
    return budget - spent;
  },

  // Get daily budget remaining
  getDailyBudgetRemaining: (transactions = []) => {
    const remaining = get().getRemainingMonthlyBudget(transactions);
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - today.getDate() + 1;
    return daysRemaining > 0 ? remaining / daysRemaining : 0;
  },

  // Check if over budget
  isOverBudget: (transactions = []) => {
    return get().getRemainingMonthlyBudget(transactions) < 0;
  },

  // Check if category over budget
  isCategoryOverBudget: (category, transactions = []) => {
    return get().getRemainingCategoryBudget(category, transactions) < 0;
  },

  // Check if near budget (for alerts)
  isNearBudget: (transactions = []) => {
    if (!get().alertsEnabled) return false;
    const remaining = get().getRemainingMonthlyBudget(transactions);
    const threshold = get().monthlyBudget * get().alertThreshold;
    return remaining <= threshold && remaining > 0;
  },

  // Check if category near budget
  isCategoryNearBudget: (category, transactions = []) => {
    if (!get().alertsEnabled) return false;
    const budget = get().categoryBudgets[category] || 0;
    if (budget === 0) return false;
    const remaining = get().getRemainingCategoryBudget(category, transactions);
    const threshold = budget * get().alertThreshold;
    return remaining <= threshold && remaining > 0;
  },
}));
