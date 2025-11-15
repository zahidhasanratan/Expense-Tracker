import { create } from 'zustand';
import { getTheme, saveTheme } from '../storage/storage';

/**
 * Zustand store for theme management
 */
export const useThemeStore = create((set) => ({
  // State
  theme: 'light',

  // Initialize theme from storage
  initialize: async () => {
    try {
      const theme = await getTheme();
      set({ theme });
    } catch (error) {
      console.error('Error initializing theme:', error);
    }
  },

  // Toggle theme
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(newTheme).catch((error) => {
        console.error('Error saving theme:', error);
      });
      return { theme: newTheme };
    });
  },

  // Set theme
  setTheme: (theme) => {
    saveTheme(theme).catch((error) => {
      console.error('Error saving theme:', error);
    });
    set({ theme });
  },

  // Check if dark mode
  isDark: () => {
    return useThemeStore.getState().theme === 'dark';
  },
}));

