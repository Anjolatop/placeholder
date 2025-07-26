import PushNotification from 'react-native-push-notification';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm, AlarmHistory } from '../types';
import AIVoiceService from './aiVoiceService';
import NotificationService from './notificationService';

class AlarmService {
  constructor() {
    this.alarms = [];
    this.activeAlarm = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Load alarms from storage
      const alarmsData = await AsyncStorage.getItem('alarms');
      if (alarmsData) {
        this.alarms = JSON.parse(alarmsData);
      }

      // Configure push notifications
      this.configurePushNotifications();

      // Schedule existing alarms
      await this.scheduleAllAlarms();

      this.isInitialized = true;
      console.log('AlarmService initialized successfully');
    } catch (error) {
      console.error('Error initializing AlarmService:', error);
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
          this.handleAlarmNotification(notification);
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

    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'wakeytalky-alarms',
        channelName: 'WakeyTalky Alarms',
        channelDescription: 'Wake-up alarm notifications',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }

  async scheduleAlarm(alarm: Alarm) {
    try {
      const alarmId = `alarm_${alarm.id}`;
      
      // Schedule for each day
      alarm.days.forEach(day => {
        const scheduleTime = this.getScheduleTime(alarm.time, day);
        
        PushNotification.localNotificationSchedule({
          id: `${alarmId}_${day}`,
          channelId: 'wakeytalky-alarms',
          title: `WakeyTalky - ${alarm.label}`,
          message: `Time to wake up! ${alarm.purpose}`,
          date: scheduleTime,
          repeatType: 'week',
          allowWhileIdle: true,
          userInfo: {
            alarmId: alarm.id,
            alarm: JSON.stringify(alarm),
          },
        });
      });

      console.log(`Alarm scheduled: ${alarm.label} at ${alarm.time}`);
    } catch (error) {
      console.error('Error scheduling alarm:', error);
    }
  }

  async scheduleAllAlarms() {
    for (const alarm of this.alarms) {
      if (alarm.isActive) {
        await this.scheduleAlarm(alarm);
      }
    }
  }

  async addAlarm(alarm: Alarm) {
    try {
      // Add to local array
      this.alarms.push(alarm);
      
      // Save to storage
      await AsyncStorage.setItem('alarms', JSON.stringify(this.alarms));
      
      // Schedule if active
      if (alarm.isActive) {
        await this.scheduleAlarm(alarm);
      }

      return alarm;
    } catch (error) {
      console.error('Error adding alarm:', error);
      throw error;
    }
  }

  async updateAlarm(alarm: Alarm) {
    try {
      // Update in local array
      const index = this.alarms.findIndex(a => a.id === alarm.id);
      if (index !== -1) {
        this.alarms[index] = alarm;
        
        // Save to storage
        await AsyncStorage.setItem('alarms', JSON.stringify(this.alarms));
        
        // Cancel existing notifications
        await this.cancelAlarm(alarm.id);
        
        // Reschedule if active
        if (alarm.isActive) {
          await this.scheduleAlarm(alarm);
        }
      }

      return alarm;
    } catch (error) {
      console.error('Error updating alarm:', error);
      throw error;
    }
  }

  async deleteAlarm(alarmId: string) {
    try {
      // Remove from local array
      this.alarms = this.alarms.filter(a => a.id !== alarmId);
      
      // Save to storage
      await AsyncStorage.setItem('alarms', JSON.stringify(this.alarms));
      
      // Cancel notifications
      await this.cancelAlarm(alarmId);

      return true;
    } catch (error) {
      console.error('Error deleting alarm:', error);
      throw error;
    }
  }

  async cancelAlarm(alarmId: string) {
    try {
      // Cancel all notifications for this alarm
      const alarm = this.alarms.find(a => a.id === alarmId);
      if (alarm) {
        alarm.days.forEach(day => {
          PushNotification.cancelLocalNotifications({
            id: `alarm_${alarmId}_${day}`,
          });
        });
      }
    } catch (error) {
      console.error('Error canceling alarm:', error);
    }
  }

  getScheduleTime(timeString: string, dayOfWeek: number): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const scheduleTime = new Date();
    
    // Set to next occurrence of the specified day
    const currentDay = scheduleTime.getDay();
    const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    
    scheduleTime.setDate(scheduleTime.getDate() + daysUntilTarget);
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for next week
    if (scheduleTime <= new Date()) {
      scheduleTime.setDate(scheduleTime.getDate() + 7);
    }
    
    return scheduleTime;
  }

  async handleAlarmNotification(notification) {
    try {
      const alarmData = JSON.parse(notification.userInfo.alarm);
      const alarmId = notification.userInfo.alarmId;
      
      // Set as active alarm
      this.activeAlarm = alarmData;
      
      // Generate AI voice message
      const voiceMessage = await this.generateAlarmVoice(alarmData);
      
      // Start alarm sequence
      await this.startAlarmSequence(alarmData, voiceMessage);
      
    } catch (error) {
      console.error('Error handling alarm notification:', error);
    }
  }

  async generateAlarmVoice(alarm: Alarm) {
    try {
      // Get user profile from storage
      const userData = await AsyncStorage.getItem('userProfile');
      const userProfile = JSON.parse(userData);
      
      // Get alarm history for context
      const historyData = await AsyncStorage.getItem('alarmHistory');
      const alarmHistory = historyData ? JSON.parse(historyData) : [];
      
      const recentHistory = alarmHistory
        .filter(h => h.alarmId === alarm.id)
        .slice(-5); // Last 5 occurrences
      
      const request = {
        userId: userProfile.id,
        alarmId: alarm.id,
        userProfile,
        alarm,
        context: {
          snoozeCount: recentHistory.reduce((sum, h) => sum + h.snoozeCount, 0),
          previousMessages: [],
          timeOfDay: this.getTimeOfDay(),
          dayOfWeek: new Date().getDay(),
        },
      };
      
      return await AIVoiceService.generateWakeUpMessage(request);
    } catch (error) {
      console.error('Error generating alarm voice:', error);
      return null;
    }
  }

  async startAlarmSequence(alarm: Alarm, voiceMessage) {
    try {
      // Play voice message
      if (voiceMessage && alarm.useWakeUpVoice) {
        await this.playVoiceMessage(voiceMessage);
      }
      
      // Start background timer for snooze functionality
      this.startSnoozeTimer(alarm);
      
    } catch (error) {
      console.error('Error starting alarm sequence:', error);
    }
  }

  async playVoiceMessage(voiceMessage) {
    try {
      // Generate audio using ElevenLabs or other TTS service
      const audioUrl = await AIVoiceService.generateVoiceAudio(voiceMessage, 'default-voice-id');
      
      // Play the audio
      // This would integrate with react-native-sound or expo-av
      console.log('Playing voice message:', audioUrl);
      
    } catch (error) {
      console.error('Error playing voice message:', error);
    }
  }

  startSnoozeTimer(alarm: Alarm) {
    if (!alarm.snoozeEnabled) return;
    
    const snoozeInterval = alarm.snoozeInterval * 60 * 1000; // Convert to milliseconds
    
    BackgroundTimer.runBackgroundTimer(() => {
      // Check if alarm is still active
      if (this.activeAlarm && this.activeAlarm.id === alarm.id) {
        this.handleSnooze(alarm);
      }
    }, snoozeInterval);
  }

  async handleSnooze(alarm: Alarm) {
    try {
      // Generate new voice message with increased urgency
      const voiceMessage = await this.generateSnoozeVoice(alarm);
      
      // Play snooze message
      await this.playVoiceMessage(voiceMessage);
      
      // Update alarm history
      await this.updateAlarmHistory(alarm.id, { snoozeCount: 1 });
      
    } catch (error) {
      console.error('Error handling snooze:', error);
    }
  }

  async generateSnoozeVoice(alarm: Alarm) {
    try {
      const userData = await AsyncStorage.getItem('userProfile');
      const userProfile = JSON.parse(userData);
      
      const request = {
        userId: userProfile.id,
        alarmId: alarm.id,
        userProfile,
        alarm,
        context: {
          snoozeCount: 1, // This is a snooze
          previousMessages: [],
          timeOfDay: this.getTimeOfDay(),
          dayOfWeek: new Date().getDay(),
        },
      };
      
      return await AIVoiceService.generateWakeUpMessage(request);
    } catch (error) {
      console.error('Error generating snooze voice:', error);
      return null;
    }
  }

  async stopAlarm() {
    try {
      // Stop background timer
      BackgroundTimer.stopBackgroundTimer();
      
      // Clear active alarm
      this.activeAlarm = null;
      
      // Cancel all notifications
      PushNotification.cancelAllLocalNotifications();
      
    } catch (error) {
      console.error('Error stopping alarm:', error);
    }
  }

  async updateAlarmHistory(alarmId: string, updates: Partial<AlarmHistory>) {
    try {
      const historyData = await AsyncStorage.getItem('alarmHistory');
      let alarmHistory = historyData ? JSON.parse(historyData) : [];
      
      const existingIndex = alarmHistory.findIndex(h => 
        h.alarmId === alarmId && 
        h.scheduledTime.toDateString() === new Date().toDateString()
      );
      
      if (existingIndex !== -1) {
        alarmHistory[existingIndex] = { ...alarmHistory[existingIndex], ...updates };
      } else {
        const newHistory = {
          id: Date.now().toString(),
          alarmId,
          userId: 'current-user', // Get from context
          scheduledTime: new Date(),
          snoozeCount: 0,
          wasSkipped: false,
          createdAt: new Date(),
          ...updates,
        };
        alarmHistory.push(newHistory);
      }
      
      await AsyncStorage.setItem('alarmHistory', JSON.stringify(alarmHistory));
      
    } catch (error) {
      console.error('Error updating alarm history:', error);
    }
  }

  getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'noon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  // Getter methods
  getAlarms(): Alarm[] {
    return this.alarms;
  }

  getActiveAlarm(): Alarm | null {
    return this.activeAlarm;
  }

  isAlarmActive(): boolean {
    return this.activeAlarm !== null;
  }
}

export default new AlarmService(); 