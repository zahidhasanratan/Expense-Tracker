import { create } from 'zustand';
import { getRecurringTransactions, saveRecurringTransactions } from '../storage/storage';
import { generateId } from '../utils/format';

/**
 * Recurring Transactions Store
 * Manages recurring expenses and income
 */
export const useRecurringStore = create((set, get) => ({
  // State
  recurringTransactions: [],

  // Initialize
  initialize: async () => {
    try {
      const recurring = await getRecurringTransactions();
      set({ recurringTransactions: recurring });
    } catch (error) {
      console.error('Error initializing recurring transactions:', error);
    }
  },

  // Add recurring transaction
  addRecurring: (recurring) => {
    const newRecurring = {
      ...recurring,
      id: generateId(),
      createdAt: Date.now(),
    };
    const recurringTransactions = [...get().recurringTransactions, newRecurring];
    set({ recurringTransactions });
    saveRecurringTransactions(recurringTransactions).catch(console.error);
    return newRecurring.id;
  },

  // Update recurring transaction
  updateRecurring: (id, updates) => {
    const recurringTransactions = get().recurringTransactions.map(r =>
      r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r
    );
    set({ recurringTransactions });
    saveRecurringTransactions(recurringTransactions).catch(console.error);
  },

  // Delete recurring transaction
  deleteRecurring: (id) => {
    const recurringTransactions = get().recurringTransactions.filter(r => r.id !== id);
    set({ recurringTransactions });
    saveRecurringTransactions(recurringTransactions).catch(console.error);
  },

  // Process recurring transactions (should be called daily)
  processRecurringTransactions: () => {
    const { useTransactionStore } = require('./useTransactionStore');
    const addTransaction = useTransactionStore.getState().addTransaction;
    const recurring = get().recurringTransactions;
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    recurring.forEach(recurringItem => {
      if (!recurringItem.isActive) return;
      
      const lastProcessed = recurringItem.lastProcessed || recurringItem.startDate;
      const lastProcessedDate = new Date(lastProcessed);
      
      // Check if it's time to process
      let shouldProcess = false;
      
      switch (recurringItem.frequency) {
        case 'daily':
          shouldProcess = todayStart > lastProcessedDate.getTime();
          break;
        case 'weekly':
          const daysDiff = Math.floor((todayStart - lastProcessedDate.getTime()) / (1000 * 60 * 60 * 24));
          shouldProcess = daysDiff >= 7;
          break;
        case 'monthly':
          const monthsDiff = (today.getFullYear() - lastProcessedDate.getFullYear()) * 12 +
                            (today.getMonth() - lastProcessedDate.getMonth());
          shouldProcess = monthsDiff >= 1;
          break;
        case 'yearly':
          const yearsDiff = today.getFullYear() - lastProcessedDate.getFullYear();
          shouldProcess = yearsDiff >= 1;
          break;
        default:
          break;
      }
      
      if (shouldProcess) {
        // Create transaction
        addTransaction({
          type: recurringItem.type,
          title: recurringItem.title,
          amount: recurringItem.amount,
          category: recurringItem.category,
          account: recurringItem.account,
          paymentMethod: recurringItem.paymentMethod,
          notes: recurringItem.notes,
          isRecurring: true,
          recurringId: recurringItem.id,
        });
        
        // Update last processed date
        get().updateRecurring(recurringItem.id, { lastProcessed: todayStart });
      }
    });
  },
}));

