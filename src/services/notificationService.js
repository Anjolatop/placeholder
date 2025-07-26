import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import { NotificationConfig } from '../types';

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
      if (Platform.OS === 'ios') {
        // iOS permissions are handled by PushNotification.configure
        return true;
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'WakeyTalky Notifications',
            message: 'WakeyTalky needs notification permissions to wake you up with personalized messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        this.hasPermissions = granted === PermissionsAndroid.RESULTS.GRANTED;
        return this.hasPermissions;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  configurePushNotifications() {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        // Handle notification tap
        if (notification.userInteraction) {
          this.handleNotificationTap(notification);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Create notification channels for Android
    this.createNotificationChannels();
  }

  createNotificationChannels() {
    // Main alarm channel
    PushNotification.createChannel(
      {
        channelId: 'wakeytalky-alarms',
        channelName: 'WakeyTalky Alarms',
        channelDescription: 'Wake-up alarm notifications with voice messages',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
        vibration: 1000,
      },
      (created) => console.log(`Alarm channel created: ${created}`)
    );

    // Challenge mode channel
    PushNotification.createChannel(
      {
        channelId: 'wakeytalky-challenges',
        channelName: 'WakeyTalky Challenges',
        channelDescription: 'Challenge mode notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
        vibration: 500,
      },
      (created) => console.log(`Challenge channel created: ${created}`)
    );

    // Achievement channel
    PushNotification.createChannel(
      {
        channelId: 'wakeytalky-achievements',
        channelName: 'WakeyTalky Achievements',
        channelDescription: 'Achievement unlock notifications',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
        vibration: 300,
      },
      (created) => console.log(`Achievement channel created: ${created}`)
    );

    // Reminder channel
    PushNotification.createChannel(
      {
        channelId: 'wakeytalky-reminders',
        channelName: 'WakeyTalky Reminders',
        channelDescription: 'General reminder notifications',
        playSound: true,
        soundName: 'default',
        importance: 2,
        vibrate: false,
      },
      (created) => console.log(`Reminder channel created: ${created}`)
    );
  }

  scheduleNotification(config: NotificationConfig) {
    try {
      const notificationConfig = {
        id: config.id,
        channelId: config.channelId,
        title: config.title,
        message: config.body,
        date: config.scheduledTime,
        soundName: config.sound || 'default',
        priority: config.priority,
        userInfo: config.data || {},
        allowWhileIdle: config.priority === 'high',
        repeatType: 'week', // Default to weekly repeat
        ...this.getNotificationStyle(config),
      };

      PushNotification.localNotificationSchedule(notificationConfig);
      
      console.log(`Notification scheduled: ${config.title}`);
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  scheduleAlarmNotification(alarmId: string, alarm: any, scheduledTime: Date) {
    const config: NotificationConfig = {
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

  scheduleChallengeNotification(alarmHistoryId: string, objectToFind: string) {
    const config: NotificationConfig = {
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

  scheduleAchievementNotification(achievement: any) {
    const config: NotificationConfig = {
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

  scheduleReminderNotification(title: string, message: string, scheduledTime: Date) {
    const config: NotificationConfig = {
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

  cancelNotification(notificationId: string) {
    try {
      PushNotification.cancelLocalNotifications({
        id: notificationId,
      });
      console.log(`Notification cancelled: ${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling notification:', error);
      return false;
    }
  }

  cancelAllNotifications() {
    try {
      PushNotification.cancelAllLocalNotifications();
      console.log('All notifications cancelled');
      return true;
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
      return false;
    }
  }

  cancelAlarmNotifications(alarmId: string) {
    try {
      // Cancel all notifications for this alarm
      PushNotification.cancelLocalNotifications({
        id: `alarm_${alarmId}`,
      });
      console.log(`Alarm notifications cancelled: ${alarmId}`);
      return true;
    } catch (error) {
      console.error('Error cancelling alarm notifications:', error);
      return false;
    }
  }

  getNotificationStyle(config: NotificationConfig) {
    // Customize notification appearance based on type
    switch (config.channelId) {
      case 'wakeytalky-alarms':
        return {
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
          bigText: config.body,
          subText: 'WakeyTalky',
          color: '#e07a5f',
          vibrate: true,
          vibration: 1000,
          playSound: true,
          soundName: 'alarm_sound',
        };
      
      case 'wakeytalky-challenges':
        return {
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
          bigText: config.body,
          subText: 'Challenge Mode',
          color: '#55786f',
          vibrate: true,
          vibration: 500,
          playSound: true,
          soundName: 'challenge_sound',
        };
      
      case 'wakeytalky-achievements':
        return {
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
          bigText: config.body,
          subText: 'Achievement Unlocked',
          color: '#d8c5f3',
          vibrate: true,
          vibration: 300,
          playSound: true,
          soundName: 'achievement_sound',
        };
      
      default:
        return {
          largeIcon: 'ic_launcher',
          smallIcon: 'ic_notification',
          bigText: config.body,
          subText: 'WakeyTalky',
          color: '#a6c3dc',
          vibrate: false,
          playSound: true,
          soundName: 'default',
        };
    }
  }

  handleNotificationTap(notification: any) {
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
  isInitialized(): boolean {
    return this.isInitialized;
  }

  hasNotificationPermissions(): boolean {
    return this.hasPermissions;
  }

  // Test notification
  sendTestNotification() {
    const config: NotificationConfig = {
      id: 'test_notification',
      title: 'WakeyTalky Test',
      body: 'This is a test notification from WakeyTalky!',
      channelId: 'wakeytalky-reminders',
      priority: 'default',
      scheduledTime: new Date(Date.now() + 5000), // 5 seconds from now
      data: {
        type: 'test',
      },
    };

    return this.scheduleNotification(config);
  }
}

export default new NotificationService(); 