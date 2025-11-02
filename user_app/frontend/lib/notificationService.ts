import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Conditional import for notifications (not available in Expo Go)
let Notifications: any = null;
let Device: any = null;

// Check if we're in Expo Go or development build
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    // Only import if available (development build)
    Notifications = require('expo-notifications');
    Device = require('expo-device');
  } catch (error) {
    console.log('Notifications not available:', error);
  }
} else {
  console.log('Running in Expo Go - Notifications disabled. Use development build for full functionality.');
}

const NOTIFICATION_PREFS_KEY = '@careerguide_notification_prefs';
const PUSH_TOKEN_KEY = '@careerguide_push_token';

export interface NotificationPreferences {
  enabled: boolean;
  jobAlerts: boolean;
  articleUpdates: boolean;
  dsaChallenge: boolean;
  roadmapReminders: boolean;
  careerToolUpdates: boolean;
}

const DEFAULT_PREFS: NotificationPreferences = {
  enabled: true,
  jobAlerts: true,
  articleUpdates: true,
  dsaChallenge: true,
  roadmapReminders: true,
  careerToolUpdates: true,
};

// Configure notification handler (only if available)
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})
};

// Register for push notifications
export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    // Check if notifications are available
    if (!Notifications || !Device) {
      console.log('Notifications not available in Expo Go - use development build');
      return null;
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for push notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted for push notifications');
      return null;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
      });
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

// Get push token
export const getPushToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Schedule local notification
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: any,
  trigger?: any
): Promise<string | null> => {
  try {
    if (!Notifications) {
      console.log('Notifications not available in Expo Go');
      return null;
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: trigger || null,
    });
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

// Cancel notification
export const cancelNotification = async (notificationId: string): Promise<void> => {
  try {
    if (!Notifications) return;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    if (!Notifications) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

// Get notification preferences
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const prefs = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    return prefs ? JSON.parse(prefs) : DEFAULT_PREFS;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return DEFAULT_PREFS;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  prefs: Partial<NotificationPreferences>
): Promise<void> => {
  try {
    const current = await getNotificationPreferences();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating notification preferences:', error);
  }
};

// Send daily DSA challenge notification
export const scheduleDailyDSAChallenge = async (): Promise<void> => {
  try {
    const prefs = await getNotificationPreferences();
    if (!prefs.enabled || !prefs.dsaChallenge) return;

    // Schedule for 9 AM daily
    await scheduleLocalNotification(
      '🧠 Daily DSA Challenge',
      'Ready to solve today\'s coding problem? Let\'s keep the streak going!',
      { type: 'dsa_challenge' },
      {
        hour: 9,
        minute: 0,
        repeats: true,
      }
    );
  } catch (error) {
    console.error('Error scheduling DSA challenge:', error);
  }
};

// Send job alert notification
export const sendJobAlert = async (jobTitle: string, company: string): Promise<void> => {
  try {
    const prefs = await getNotificationPreferences();
    if (!prefs.enabled || !prefs.jobAlerts) return;

    await scheduleLocalNotification(
      '💼 New Job Posted',
      `${jobTitle} at ${company} - Check it out now!`,
      { type: 'job_alert' }
    );
  } catch (error) {
    console.error('Error sending job alert:', error);
  }
};

// Send article notification
export const sendArticleNotification = async (articleTitle: string, category: string): Promise<void> => {
  try {
    const prefs = await getNotificationPreferences();
    if (!prefs.enabled || !prefs.articleUpdates) return;

    await scheduleLocalNotification(
      '📚 New Article Published',
      `${articleTitle} - ${category}`,
      { type: 'article_update' }
    );
  } catch (error) {
    console.error('Error sending article notification:', error);
  }
};

// Send roadmap reminder
export const sendRoadmapReminder = async (roadmapTitle: string): Promise<void> => {
  try {
    const prefs = await getNotificationPreferences();
    if (!prefs.enabled || !prefs.roadmapReminders) return;

    await scheduleLocalNotification(
      '🗺️ Roadmap Reminder',
      `Continue your progress on ${roadmapTitle}`,
      { type: 'roadmap_reminder' }
    );
  } catch (error) {
    console.error('Error sending roadmap reminder:', error);
  }
};
