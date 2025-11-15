import { create } from 'zustand';
import { getBudget, saveBudget } from '../storage/storage';

/**
 * Zustand store for budget management
 */
export const useBudgetStore = create((set, get) => ({
  // State
  budget: { monthly: 0, categories: {} },
  isLoading: false,

  // Initialize budget from storage
  initialize: async () => {
    try {
      const budget = await getBudget();
      set({ budget });
    } catch (error) {
      console.error('Error initializing budget:', error);
    }
  },

  // Set monthly budget
  setMonthlyBudget: (amount) => {
    const budget = { ...get().budget, monthly: amount };
    set({ budget });
    saveBudget(budget).catch((error) => {
      console.error('Error saving budget:', error);
    });
  },

  // Set category budget
  setCategoryBudget: (category, amount) => {
    const budget = { ...get().budget };
    budget.categories = { ...budget.categories, [category]: amount };
    set({ budget });
    saveBudget(budget).catch((error) => {
      console.error('Error saving budget:', error);
    });
  },

  // Remove category budget
  removeCategoryBudget: (category) => {
    const budget = { ...get().budget };
    delete budget.categories[category];
    set({ budget });
    saveBudget(budget).catch((error) => {
      console.error('Error saving budget:', error);
    });
  },

  // Get budget progress for current month
  getBudgetProgress: (totalSpent) => {
    const monthlyBudget = get().budget.monthly;
    if (monthlyBudget === 0) return { percentage: 0, remaining: 0, overBudget: false };
    
    const percentage = (totalSpent / monthlyBudget) * 100;
    const remaining = monthlyBudget - totalSpent;
    const overBudget = totalSpent > monthlyBudget;
    
    return { percentage, remaining, overBudget };
  },
}));
