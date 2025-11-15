import { create } from 'zustand';
import { getCurrency, saveCurrency } from '../storage/storage';
import { getCurrencyByCode } from '../utils/currencies';

/**
 * Zustand store for currency management
 */
export const useCurrencyStore = create((set) => ({
  // State
  currencyCode: 'BDT',
  currency: getCurrencyByCode('BDT'),

  // Initialize currency from storage
  initialize: async () => {
    try {
      const code = await getCurrency();
      const currency = getCurrencyByCode(code);
      set({ currencyCode: code, currency });
    } catch (error) {
      console.error('Error initializing currency:', error);
    }
  },

  // Set currency
  setCurrency: (code) => {
    const currency = getCurrencyByCode(code);
    saveCurrency(code).catch((error) => {
      console.error('Error saving currency:', error);
    });
    set({ currencyCode: code, currency });
  },
}));
