import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as notificationService from '../services/notifications';
import { useBudgetStore } from './useBudgetStore';
import { useTransactionStore } from './useTransactionStore';

const STORAGE_KEY = 'notification_settings';
const REMINDERS_KEY = 'reminders';

/**
 * Notification Store
 * Manages notification settings and reminders
 */
export const useNotificationStore = create((set, get) => ({
  // State
  enabled: true,
  budgetAlerts: true,
  dailyReminders: false,
  dailyReminderTime: { hour: 20, minute: 0 },
  weeklySummary: false,
  weeklySummaryDay: 1, // Sunday
  reminders: [],
  notificationIds: {},

  // Initialize
  initialize: async () => {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const remindersJson = await AsyncStorage.getItem(REMINDERS_KEY);
      
      const settings = settingsJson ? JSON.parse(settingsJson) : {};
      const reminders = remindersJson ? JSON.parse(remindersJson) : [];

      set({
        enabled: settings.enabled !== false,
        budgetAlerts: settings.budgetAlerts !== false,
        dailyReminders: settings.dailyReminders || false,
        dailyReminderTime: settings.dailyReminderTime || { hour: 20, minute: 0 },
        weeklySummary: settings.weeklySummary || false,
        weeklySummaryDay: settings.weeklySummaryDay || 1,
        reminders,
        notificationIds: settings.notificationIds || {},
      });

      // Request permissions and schedule notifications
      await get().setupNotifications();
    } catch (error) {
      console.error('Error initializing notification store:', error);
    }
  },

  // Save settings
  saveSettings: async () => {
    try {
      const state = get();
      const settings = {
        enabled: state.enabled,
        budgetAlerts: state.budgetAlerts,
        dailyReminders: state.dailyReminders,
        dailyReminderTime: state.dailyReminderTime,
        weeklySummary: state.weeklySummary,
        weeklySummaryDay: state.weeklySummaryDay,
        notificationIds: state.notificationIds,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  },

  // Save reminders
  saveReminders: async () => {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(get().reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  },

  // Setup notifications based on settings
  setupNotifications: async () => {
    const state = get();
    if (!state.enabled) {
      await notificationService.cancelAllNotifications();
      return;
    }

    // Cancel existing notifications
    await notificationService.cancelAllNotifications();
    const newIds = {};

    // Daily reminders
    if (state.dailyReminders) {
      const id = await notificationService.scheduleDailyReminder({
        title: 'Expense Reminder',
        body: 'Don\'t forget to log your expenses today!',
        hour: state.dailyReminderTime.hour,
        minute: state.dailyReminderTime.minute,
        data: { type: 'daily_reminder' },
      });
      if (id) newIds.dailyReminder = id;
    }

    // Weekly summary
    if (state.weeklySummary) {
      const id = await notificationService.scheduleWeeklyReminder({
        title: 'Weekly Summary',
        body: 'Check your weekly expense summary',
        weekday: state.weeklySummaryDay,
        hour: 9,
        minute: 0,
        data: { type: 'weekly_summary' },
      });
      if (id) newIds.weeklySummary = id;
    }

    // Schedule reminders
    for (const reminder of state.reminders) {
      if (reminder.enabled && reminder.date) {
        const reminderDate = new Date(reminder.date);
        if (reminderDate > new Date()) {
          const id = await notificationService.scheduleNotification({
            title: reminder.title || 'Reminder',
            body: reminder.description || 'Don\'t forget!',
            trigger: reminderDate,
            data: { type: 'reminder', reminderId: reminder.id },
          });
          if (id) newIds[`reminder_${reminder.id}`] = id;
        }
      }
    }

    set({ notificationIds: newIds });
    await get().saveSettings();
  },

  // Toggle notifications
  setEnabled: async (enabled) => {
    set({ enabled });
    await get().saveSettings();
    await get().setupNotifications();
  },

  // Toggle budget alerts
  setBudgetAlerts: async (enabled) => {
    set({ budgetAlerts: enabled });
    await get().saveSettings();
  },

  // Set daily reminders
  setDailyReminders: async (enabled, time = null) => {
    set({
      dailyReminders: enabled,
      dailyReminderTime: time || get().dailyReminderTime,
    });
    await get().saveSettings();
    await get().setupNotifications();
  },

  // Set weekly summary
  setWeeklySummary: async (enabled, day = null) => {
    set({
      weeklySummary: enabled,
      weeklySummaryDay: day || get().weeklySummaryDay,
    });
    await get().saveSettings();
    await get().setupNotifications();
  },

  // Add reminder
  addReminder: async (reminder) => {
    const reminders = [...get().reminders, { ...reminder, id: Date.now().toString() }];
    set({ reminders });
    await get().saveReminders();
    await get().setupNotifications();
  },

  // Update reminder
  updateReminder: async (id, updates) => {
    const reminders = get().reminders.map(r =>
      r.id === id ? { ...r, ...updates } : r
    );
    set({ reminders });
    await get().saveReminders();
    await get().setupNotifications();
  },

  // Delete reminder
  deleteReminder: async (id) => {
    const reminder = get().reminders.find(r => r.id === id);
    if (reminder) {
      const notificationId = get().notificationIds[`reminder_${id}`];
      if (notificationId) {
        await notificationService.cancelNotification(notificationId);
      }
    }
    const reminders = get().reminders.filter(r => r.id !== id);
    set({ reminders });
    await get().saveReminders();
    const newIds = { ...get().notificationIds };
    delete newIds[`reminder_${id}`];
    set({ notificationIds: newIds });
    await get().saveSettings();
  },

  // Check and send budget alerts
  checkBudgetAlerts: async () => {
    const state = get();
    if (!state.enabled || !state.budgetAlerts) return;

    try {
      const budgetStore = useBudgetStore.getState();
      const transactionStore = useTransactionStore.getState();
      const transactions = transactionStore.getExpenses();

      // Check monthly budget
      if (budgetStore.monthlyBudget > 0) {
        const isOver = budgetStore.isOverBudget(transactions);
        const isNear = budgetStore.isNearBudget(transactions);
        const remaining = budgetStore.getRemainingMonthlyBudget(transactions);

        if (isOver) {
          await notificationService.scheduleNotification({
            title: 'Budget Exceeded!',
            body: `You've exceeded your monthly budget by ${Math.abs(remaining).toFixed(2)}`,
            trigger: new Date(Date.now() + 1000), // Show immediately
            data: { type: 'budget_alert', alertType: 'over' },
          });
        } else if (isNear) {
          await notificationService.scheduleNotification({
            title: 'Budget Warning',
            body: `You're approaching your monthly budget. ${remaining.toFixed(2)} remaining.`,
            trigger: new Date(Date.now() + 1000),
            data: { type: 'budget_alert', alertType: 'near' },
          });
        }
      }

      // Check category budgets
      const categoryBudgets = budgetStore.categoryBudgets;
      for (const [category, budget] of Object.entries(categoryBudgets)) {
        if (budget > 0) {
          const isOver = budgetStore.isCategoryOverBudget(category, transactions);
          const isNear = budgetStore.isCategoryNearBudget(category, transactions);
          const remaining = budgetStore.getRemainingCategoryBudget(category, transactions);

          if (isOver) {
            await notificationService.scheduleNotification({
              title: `${category} Budget Exceeded`,
              body: `You've exceeded your ${category} budget by ${Math.abs(remaining).toFixed(2)}`,
              trigger: new Date(Date.now() + 1000),
              data: { type: 'budget_alert', category, alertType: 'over' },
            });
          } else if (isNear) {
            await notificationService.scheduleNotification({
              title: `${category} Budget Warning`,
              body: `You're approaching your ${category} budget. ${remaining.toFixed(2)} remaining.`,
              trigger: new Date(Date.now() + 1000),
              data: { type: 'budget_alert', category, alertType: 'near' },
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking budget alerts:', error);
    }
  },
}));

