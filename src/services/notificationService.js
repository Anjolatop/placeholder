import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.hasPermissions = false;
  }

  async initialize() {
    try {
      // Request permissions
      await this.requestPermissions();
      
      // Configure push notifications
      this.configurePushNotifications();
      
      this.isInitialized = true;
      console.log('NotificationService initialized successfully');
    } catch (error) {
      console.error('Error initializing NotificationService:', error);
    }
  }

  async requestPermissions() {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        this.hasPermissions = finalStatus === 'granted';
        return this.hasPermissions;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  configurePushNotifications() {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Set up notification listeners
    Notifications.addNotificationReceivedListener(this.handleNotificationReceived.bind(this));
    Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse.bind(this));
  }

  handleNotificationReceived(notification) {
    console.log('Notification received:', notification);
  }

  handleNotificationResponse(response) {
    console.log('Notification response:', response);
    this.handleNotificationTap(response);
  }

  createNotificationChannels() {
    // Create notification categories for iOS
    Notifications.setNotificationCategoryAsync('alarm', [
      {
        identifier: 'SNOOZE',
        buttonTitle: '⏰ Snooze',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: 'DISMISS',
        buttonTitle: '✅ Dismiss',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);

    // Create notification categories for challenges
    Notifications.setNotificationCategoryAsync('challenge', [
      {
        identifier: 'START_CHALLENGE',
        buttonTitle: '🎯 Start Challenge',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);
  }

  async scheduleNotification(config) {
    try {
      const notificationConfig = {
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: config.sound || 'default',
          categoryIdentifier: config.categoryId || 'default',
        },
        trigger: {
          date: config.scheduledTime,
        },
      };

      await Notifications.scheduleNotificationAsync(notificationConfig);
      
      console.log(`Notification scheduled: ${config.title}`);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  scheduleAlarmNotification(alarmId, alarm, scheduledTime) {
    const config = {
      id: `alarm_${alarmId}`,
      title: `WakeyTalky - ${alarm.label}`,
      body: `Time to wake up! ${alarm.purpose}`,
      channelId: 'wakeytalky-alarms',
      priority: 'high',
      scheduledTime,
      data: {
        type: 'alarm',
        alarmId,
        alarm: JSON.stringify(alarm),
      },
    };

    return this.scheduleNotification(config);
  }

  scheduleChallengeNotification(alarmHistoryId, objectToFind) {
    const config = {
      id: `challenge_${alarmHistoryId}`,
      title: 'Challenge Mode Activated!',
      body: `Find your ${objectToFind} to stop the alarm`,
      channelId: 'wakeytalky-challenges',
      priority: 'high',
      scheduledTime: new Date(),
      data: {
        type: 'challenge',
        alarmHistoryId,
        objectToFind,
      },
    };

    return this.scheduleNotification(config);
  }

  scheduleAchievementNotification(achievement) {
    const config = {
      id: `achievement_${achievement.id}`,
      title: 'Achievement Unlocked! 🎉',
      body: `${achievement.name} - ${achievement.description}`,
      channelId: 'wakeytalky-achievements',
      priority: 'default',
      scheduledTime: new Date(),
      data: {
        type: 'achievement',
        achievementId: achievement.id,
      },
    };

    return this.scheduleNotification(config);
  }

  scheduleReminderNotification(title, message, scheduledTime) {
    const config = {
      id: `reminder_${Date.now()}`,
      title,
      body: message,
      channelId: 'wakeytalky-reminders',
      priority: 'default',
      scheduledTime,
      data: {
        type: 'reminder',
      },
    };

    return this.scheduleNotification(config);
  }

  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`Notification cancelled: ${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }

  async cancelAlarmNotifications(alarmId) {
    try {
      // Cancel all notifications for this alarm
      await Notifications.cancelScheduledNotificationAsync(`alarm_${alarmId}`);
      console.log(`Alarm notifications cancelled: ${alarmId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling alarm notifications:', error);
      return false;
    }
  }



  handleNotificationTap(notification) {
    try {
      const data = notification.userInfo;
      
      switch (data.type) {
        case 'alarm':
          // Navigate to alarm screen or start alarm sequence
          console.log('Alarm notification tapped:', data.alarmId);
          break;
        
        case 'challenge':
          // Navigate to challenge mode
          console.log('Challenge notification tapped:', data.alarmHistoryId);
          break;
        
        case 'achievement':
          // Navigate to achievements screen
          console.log('Achievement notification tapped:', data.achievementId);
          break;
        
        case 'reminder':
          // Handle reminder tap
          console.log('Reminder notification tapped');
          break;
        
        default:
          console.log('Unknown notification type tapped');
      }
    } catch (error) {
      console.error('Error handling notification tap:', error);
    }
  }

  // Getter methods
  isInitialized() {
    return this.isInitialized;
  }

  hasNotificationPermissions() {
    return this.hasPermissions;
  }

  // Test notification
  async sendTestNotification() {
    const config = {
      id: 'test_notification',
      title: 'WakeyTalky Test',
      body: 'This is a test notification from WakeyTalky!',
      categoryId: 'default',
      scheduledTime: new Date(Date.now() + 5000), // 5 seconds from now
      data: {
        type: 'test',
      },
    };

    return await this.scheduleNotification(config);
  }
}

export default new NotificationService(); 