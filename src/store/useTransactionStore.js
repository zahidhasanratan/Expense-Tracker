import { create } from 'zustand';
import { 
  getTransactions, 
  saveTransactions,
  getAccounts,
  saveAccounts,
  getPaymentMethods,
  savePaymentMethods,
  getMerchants,
  saveMerchants,
  getTags,
  saveTags,
} from '../storage/storage';
import { generateId } from '../utils/format';

/**
 * Enhanced Transaction Store
 * Supports expenses, income, transfers, and all advanced features
 */
export const useTransactionStore = create((set, get) => {
  // Initialize from expense store for backward compatibility
  const migrateExpenses = async () => {
    try {
      const { useExpenseStore } = await import('./useExpenseStore');
      const expenses = useExpenseStore.getState().expenses;
      if (expenses && expenses.length > 0) {
        const transactions = expenses.map(exp => ({
          ...exp,
          type: 'expense',
          account: exp.account || 'cash',
          paymentMethod: exp.paymentMethod || 'cash',
          merchant: exp.merchant || '',
          tags: exp.tags || [],
          subcategory: exp.subcategory || '',
          receiptPhoto: exp.receiptPhoto || null,
          isRecurring: false,
          recurringId: null,
          splitTransactions: [],
        }));
        await saveTransactions(transactions);
        return transactions;
      }
    } catch (error) {
      console.error('Migration error:', error);
    }
    return [];
  };

  return {
    // State
    transactions: [],
    accounts: [],
    paymentMethods: [],
    merchants: [],
    tags: [],
    isLoading: false,

    // Initialize store
    initialize: async () => {
      set({ isLoading: true });
      try {
        let transactions = await getTransactions();
        if (!transactions || transactions.length === 0) {
          transactions = await migrateExpenses();
        }
        
        // Initialize default accounts and payment methods
        let accounts = await getAccounts();
        let paymentMethods = await getPaymentMethods();
        let merchants = await getMerchants();
        let tags = await getTags();
        
        // Set defaults if empty
        if (!accounts || accounts.length === 0) {
          accounts = [
            { id: 'cash', name: 'Cash', type: 'cash', balance: 0 },
            { id: 'checking', name: 'Checking Account', type: 'bank', balance: 0 },
            { id: 'savings', name: 'Savings Account', type: 'bank', balance: 0 },
            { id: 'credit', name: 'Credit Card', type: 'credit', balance: 0 },
          ];
          await saveAccounts(accounts);
        }
        if (!paymentMethods || paymentMethods.length === 0) {
          paymentMethods = ['cash', 'debit', 'credit', 'wallet'];
          await savePaymentMethods(paymentMethods);
        }
        
        set({ 
          transactions, 
          accounts,
          paymentMethods,
          merchants: merchants || [],
          tags: tags || [],
          isLoading: false 
        });
      } catch (error) {
        console.error('Error initializing transaction store:', error);
        set({ isLoading: false });
      }
    },

    // Add transaction (expense or income)
    addTransaction: (transaction) => {
      const newTransaction = {
        ...transaction,
        id: generateId(),
        type: transaction.type || 'expense',
        date: transaction.date || Date.now(),
        account: transaction.account || 'cash',
        paymentMethod: transaction.paymentMethod || 'cash',
        merchant: transaction.merchant || '',
        tags: transaction.tags || [],
        subcategory: transaction.subcategory || '',
        receiptPhoto: transaction.receiptPhoto || null,
        isRecurring: transaction.isRecurring || false,
        recurringId: transaction.recurringId || null,
        splitTransactions: transaction.splitTransactions || [],
        createdAt: Date.now(),
      };
      const transactions = [...get().transactions, newTransaction];
      set({ transactions });
      saveTransactions(transactions).catch(console.error);
      return newTransaction.id;
    },

    // Update transaction
    updateTransaction: (id, updates) => {
      const transactions = get().transactions.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
      );
      set({ transactions });
      saveTransactions(transactions).catch(console.error);
    },

    // Delete transaction (move to trash)
    deleteTransaction: (id) => {
      const transactions = get().transactions.map(t =>
        t.id === id ? { ...t, deletedAt: Date.now(), isDeleted: true } : t
      );
      set({ transactions });
      saveTransactions(transactions).catch(console.error);
    },

    // Permanently delete from trash
    permanentDelete: (id) => {
      const transactions = get().transactions.filter(t => t.id !== id);
      set({ transactions });
      saveTransactions(transactions).catch(console.error);
    },

    // Restore from trash
    restoreTransaction: (id) => {
      const transactions = get().transactions.map(t =>
        t.id === id ? { ...t, deletedAt: null, isDeleted: false } : t
      );
      set({ transactions });
      saveTransactions(transactions).catch(console.error);
    },

    // Get active transactions (not deleted)
    getActiveTransactions: () => {
      return get().transactions.filter(t => !t.isDeleted);
    },

    // Get expenses only
    getExpenses: () => {
      return get().getActiveTransactions().filter(t => t.type === 'expense');
    },

    // Get income only
    getIncome: () => {
      return get().getActiveTransactions().filter(t => t.type === 'income');
    },

    // Get transfers only
    getTransfers: () => {
      return get().getActiveTransactions().filter(t => t.type === 'transfer');
    },

    // Account management
    addAccount: (account) => {
      const accounts = [...get().accounts, { ...account, id: account.id || generateId() }];
      set({ accounts });
      saveAccounts(accounts).catch(console.error);
    },

    updateAccount: (id, updates) => {
      const accounts = get().accounts.map(a =>
        a.id === id ? { ...a, ...updates } : a
      );
      set({ accounts });
      saveAccounts(accounts).catch(console.error);
    },

    deleteAccount: (id) => {
      const accounts = get().accounts.filter(a => a.id !== id);
      set({ accounts });
      saveAccounts(accounts).catch(console.error);
    },

    /**
     * Get current balance for an account.
     * Uses the account's stored opening balance plus all active transactions.
     *
     * - income: increases balance
     * - expense: decreases balance
     * - transfer: decreases "fromAccount", increases "toAccount"
     */
    getAccountsBalance: (accountId) => {
      const account = get().accounts.find(a => a.id === accountId);
      const openingBalance = Number(account?.balance) || 0;

      const transactions = get().getActiveTransactions();
      const delta = transactions.reduce((sum, t) => {
        if (!t) return sum;

        // Transfers
        if (t.type === 'transfer') {
          const amount = Number(t.amount) || 0;
          if (t.fromAccount === accountId) return sum - amount;
          if (t.toAccount === accountId) return sum + amount;
          return sum;
        }

        // Regular income/expense attached to `account`
        if (t.account !== accountId) return sum;
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') return sum + amount;
        return sum - amount; // expense default
      }, 0);

      return openingBalance + delta;
    },

    // Merchant management
    addMerchant: (merchant) => {
      const merchants = [...get().merchants];
      if (!merchants.includes(merchant)) {
        merchants.push(merchant);
        set({ merchants });
        saveMerchants(merchants).catch(console.error);
      }
    },

    // Get merchant suggestions
    getMerchantSuggestions: (query) => {
      const merchants = get().merchants;
      if (!query || !query.trim()) return merchants.slice(0, 5);
      const lowerQuery = query.toLowerCase();
      return merchants
        .filter(m => m.toLowerCase().includes(lowerQuery))
        .slice(0, 5);
    },

    // Tag management
    addTag: (tag) => {
      const tags = [...get().tags];
      if (!tags.includes(tag)) {
        tags.push(tag);
        set({ tags });
        saveTags(tags).catch(console.error);
      }
    },

    // Search transactions
    searchTransactions: (query) => {
      const transactions = get().getActiveTransactions();
      if (!query || !query.trim()) return transactions;
      
      const lowerQuery = query.toLowerCase();
      return transactions.filter(t => {
        return (
          t.title?.toLowerCase().includes(lowerQuery) ||
          t.category?.toLowerCase().includes(lowerQuery) ||
          t.merchant?.toLowerCase().includes(lowerQuery) ||
          t.notes?.toLowerCase().includes(lowerQuery) ||
          t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      });
    },

    // Filter transactions
    filterTransactions: (filters) => {
      let transactions = get().getActiveTransactions();
      
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type);
      }
      if (filters.category) {
        transactions = transactions.filter(t => t.category === filters.category);
      }
      if (filters.account) {
        transactions = transactions.filter(t => t.account === filters.account);
      }
      if (filters.paymentMethod) {
        transactions = transactions.filter(t => t.paymentMethod === filters.paymentMethod);
      }
      if (filters.tags && filters.tags.length > 0) {
        transactions = transactions.filter(t =>
          t.tags?.some(tag => filters.tags.includes(tag))
        );
      }
      if (filters.startDate) {
        transactions = transactions.filter(t => t.date >= filters.startDate);
      }
      if (filters.endDate) {
        transactions = transactions.filter(t => t.date <= filters.endDate);
      }
      
      return transactions;
    },
  };
});

