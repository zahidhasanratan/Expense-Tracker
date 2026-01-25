import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export const requestPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }

    // Android specific: set notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Expense Tracker',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a notification
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body
 * @param {Date|number} options.trigger - Date object or timestamp for when to show
 * @param {Object} options.data - Additional data to pass
 * @returns {Promise<string>} Notification identifier
 */
export const scheduleNotification = async ({ title, body, trigger, data = {} }) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return null;
    }

    let triggerConfig;
    if (trigger instanceof Date) {
      const now = new Date();
      if (trigger <= now) {
        console.warn('Cannot schedule notification in the past');
        return null;
      }
      triggerConfig = { date: trigger };
    } else if (typeof trigger === 'number') {
      const now = Date.now();
      if (trigger <= now) {
        console.warn('Cannot schedule notification in the past');
        return null;
      }
      triggerConfig = { date: new Date(trigger) };
    } else {
      triggerConfig = trigger;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: triggerConfig,
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

/**
 * Cancel a scheduled notification
 * @param {string} identifier - Notification identifier
 */
export const cancelNotification = async (identifier) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications
 */
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Schedule a daily reminder
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.body
 * @param {number} options.hour - Hour (0-23)
 * @param {number} options.minute - Minute (0-59)
 * @param {Object} options.data
 */
export const scheduleDailyReminder = async ({ title, body, hour = 20, minute = 0, data = {} }) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return null;
  }
};

/**
 * Schedule a weekly reminder
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.body
 * @param {number} options.weekday - Day of week (1-7, Sunday = 1)
 * @param {number} options.hour
 * @param {number} options.minute
 * @param {Object} options.data
 */
export const scheduleWeeklyReminder = async ({ title, body, weekday, hour = 20, minute = 0, data = {} }) => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return null;

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: {
        weekday,
        hour,
        minute,
        repeats: true,
      },
    });

    return identifier;
  } catch (error) {
    console.error('Error scheduling weekly reminder:', error);
    return null;
  }
};

