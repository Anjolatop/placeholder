import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import aiVoiceService from './aiVoiceService';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class AlarmService {
  constructor() {
    this.alarms = new Map();
    this.sound = null;
    this.isPlaying = false;
    this.snoozeCount = 0;
    this.currentAlarm = null;
    this.onShowSnoozeModal = null; // Callback to show snooze modal
  }

  // Initialize the service
  async initialize() {
    await this.requestPermissions();
    await this.loadAlarms();
    this.setupNotificationListeners();
    this.setupNotificationCategories();
    await aiVoiceService.initialize();
  }

  // Request notification permissions
  async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
    }
  }

  // Setup notification listeners
  setupNotificationListeners() {
    Notifications.addNotificationReceivedListener(this.handleNotificationReceived.bind(this));
    Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse.bind(this));
  }

  // Setup notification categories with action buttons
  async setupNotificationCategories() {
    try {
      await Notifications.setNotificationCategoryAsync('alarm', [
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
      console.log('🔔 Notification categories set up successfully');
    } catch (error) {
      console.log('⚠️ Could not set up notification categories:', error);
    }
  }

  // Handle notification received
  handleNotificationReceived(notification) {
    console.log('Notification received:', notification);
    const alarmData = notification.request.content.data;
    
    // Check if this is a snooze notification
    if (alarmData.isSnooze) {
      console.log('🎤 Snooze time up - starting AI voice sequence');
      console.log('🎤 Snooze alarm data:', alarmData);
      
      // Set the current alarm data for AI voice sequence
      this.currentAlarm = alarmData;
      
      // Start AI voice sequence (no alarm sound)
      this.startAIVoiceSequence();
    } else {
      // Initial alarm - just play ringtone
      console.log('🔔 Initial alarm triggered - playing ringtone only');
      this.startAlarmSequence(alarmData);
    }
  }

  // Handle notification response (user interaction)
  handleNotificationResponse(response) {
    const { actionIdentifier } = response;
    const alarmData = response.notification.request.content.data;

    console.log('🔔 Notification response received:', actionIdentifier);
    console.log('🔔 Alarm data:', alarmData);

    // Always show snooze modal when notification is tapped
    console.log('🔔 Notification tapped - showing snooze options');
    this.showSnoozeOptions(alarmData);
  }

  // Schedule an alarm
  async scheduleAlarm(alarmData) {
    const { time, purpose, repeatDays, snoozeEnabled, snoozeInterval, useWakeUpVoice, includeSinging, ringtoneType } = alarmData;
    
    // Create unique identifier
    const alarmId = `alarm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate next trigger time
    const triggerTime = this.calculateNextTriggerTime(time, repeatDays);
    
    if (!triggerTime) {
      throw new Error('No valid trigger time found');
    }

    // Schedule notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'WakeyTalky Alarm',
        body: purpose,
        data: {
          alarmId,
          purpose,
          useWakeUpVoice,
          includeSinging,
          ringtoneType,
          snoozeEnabled,
          snoozeInterval,
          originalTime: time.toISOString(),
          repeatDays,
        },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'alarm',
      },
      trigger: {
        date: triggerTime,
        repeats: repeatDays.length > 0,
      },
    });

    // Store alarm data
    const alarm = {
      id: alarmId,
      notificationId,
      ...alarmData,
      triggerTime: triggerTime.toISOString(),
      isActive: true,
    };

    this.alarms.set(alarmId, alarm);
    await this.saveAlarms();

    return alarm;
  }

  // Calculate next trigger time based on repeat schedule
  calculateNextTriggerTime(time, repeatDays) {
    const now = new Date();
    let targetTime;
    
    // Handle different time input formats
    if (time instanceof Date) {
      targetTime = time;
    } else if (typeof time === 'string') {
      targetTime = new Date(time);
    } else {
      console.log('⚠️ Invalid time format:', time);
      return null;
    }
    
    console.log('🕐 Scheduling alarm for:', targetTime.toLocaleString());
    console.log('🕐 Current time:', now.toLocaleString());
    
    // Set the target time for today
    const today = new Date();
    today.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);

    // If no repeat days, schedule for next occurrence
    if (!repeatDays || repeatDays.length === 0) {
      if (today <= now) {
        today.setDate(today.getDate() + 1);
        console.log('🕐 Time passed today, scheduling for tomorrow:', today.toLocaleString());
      } else {
        console.log('🕐 Scheduling for today:', today.toLocaleString());
      }
      return today;
    }

    // Find next occurrence based on repeat days
    const currentDay = now.getDay();
    let daysToAdd = 0;

    // Find the next day in the repeat schedule
    for (let i = 1; i <= 7; i++) {
      const checkDay = (currentDay + i) % 7;
      if (repeatDays.includes(checkDay)) {
        daysToAdd = i;
        break;
      }
    }

    // If today is in the schedule and time hasn't passed, schedule for today
    if (repeatDays.includes(currentDay) && today > now) {
      console.log('🕐 Today is in repeat schedule, scheduling for today:', today.toLocaleString());
      return today;
    }

    // Schedule for next occurrence
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    nextDate.setHours(targetTime.getHours(), targetTime.getMinutes(), 0, 0);
    
    console.log('🕐 Scheduling for next repeat day:', nextDate.toLocaleString());
    return nextDate;
  }

  // Start alarm sequence
  async startAlarmSequence(alarmData) {
    this.currentAlarm = alarmData;
    this.snoozeCount = 0;

    // Play initial ringtone only - no AI calls yet
    await this.playRingtone();

    // Show snooze modal immediately when alarm starts
    console.log('🔔 Initial alarm played - showing snooze modal');
    this.showSnoozeOptions(alarmData);
  }

  // Play ringtone
  async playRingtone() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      console.log('🔔 Playing alarm ringtone...');
      this.isPlaying = true;
      
      // Load and play the actual alarm sound file
      const alarmSound = require('./alarmsound.mp3');
      console.log('🔔 Loading alarm sound file:', alarmSound);
      
      const { sound } = await Audio.Sound.createAsync(
        alarmSound,
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      
      this.sound = sound;
      console.log('🔔 Alarm sound loaded successfully, starting playback...');
      
      // Ensure the sound actually starts playing
      await sound.playAsync();
      console.log('🔔 Alarm play command sent');
      
      // Keep playing until manually stopped (no auto-stop)
      console.log('🔔 Alarm will play continuously until snooze/dismiss');
      
    } catch (error) {
      console.log('❌ Error playing ringtone:', error);
      // Fallback to system sound
      this.isPlaying = true;
    }
  }

  // Play wake-up song based on alarm purpose
  async playWakeUpSong(alarmPurpose) {
    try {
      console.log('🎵 Playing wake-up song for purpose:', alarmPurpose);
      
      // Stop any existing sound
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      let songFile;
      const purpose = alarmPurpose.toLowerCase();
      
      // Check if purpose contains exercise-related keywords
      const exerciseKeywords = ['exercise', 'workout', 'gym', 'run', 'jog', 'fitness', 'training', 'sport', 'cardio', 'lift', 'swim', 'bike', 'cycling', 'yoga', 'pilates', 'dance', 'soccer', 'basketball', 'tennis', 'volleyball', 'football', 'baseball', 'hockey', 'rugby', 'cricket', 'badminton', 'table tennis', 'ping pong', 'squash', 'racquetball', 'handball', 'lacrosse', 'field hockey', 'water polo', 'rowing', 'canoeing', 'kayaking', 'rock climbing', 'hiking', 'trekking', 'mountaineering', 'skiing', 'snowboarding', 'skating', 'rollerblading', 'skateboarding', 'surfing', 'windsurfing', 'kitesurfing', 'paragliding', 'hang gliding', 'bungee jumping', 'skydiving', 'parachuting', 'zip lining', 'rappelling', 'abseiling', 'caving', 'spelunking', 'orienteering', 'geocaching', 'parkour', 'free running', 'breakdancing', 'ballet', 'jazz', 'tap', 'contemporary', 'modern', 'hip hop', 'street', 'ballroom', 'latin', 'swing', 'salsa', 'tango', 'waltz', 'foxtrot', 'quickstep', 'cha cha', 'rumba', 'samba', 'paso doble', 'jive', 'east coast swing', 'west coast swing', 'lindy hop', 'charleston', 'shag', 'jitterbug', 'boogie woogie', 'rock and roll', 'twist', 'mashed potato', 'monkey', 'pony', 'frug', 'watusi', 'swim', 'swimming', 'pool', 'aqua', 'water', 'aquatic', 'marathon', 'sprint', 'triathlon', 'duathlon', 'biathlon', 'pentathlon', 'decathlon', 'heptathlon', 'octathlon', 'nonathlon', 'decathlon', 'heptathlon', 'pentathlon', 'tetrathlon', 'tritathlon', 'quadrathlon', 'quintathlon', 'sextathlon', 'septathlon', 'octathlon', 'nonathlon', 'decathlon'];
      
      if (exerciseKeywords.some(keyword => purpose.includes(keyword))) {
        console.log('🏃‍♂️ Exercise detected - playing exercisesong.mp3');
        songFile = require('./exercisesong.mp3');
      } else {
        // Default to wake-up songs for general wake-up purposes
        console.log('🌅 Wake-up purpose detected - playing wakeupsong.mp3');
        songFile = require('./wakeupsong.mp3');
      }
      
      console.log('🎵 Loading audio file:', songFile);
      
      // Load and play the song
      const { sound } = await Audio.Sound.createAsync(
        songFile,
        { shouldPlay: true, isLooping: false, volume: 1.0 }
      );
      
      this.sound = sound;
      console.log('🎵 Audio loaded successfully, starting playback...');
      
      // Ensure the sound actually starts playing
      await sound.playAsync();
      console.log('🎵 Audio play command sent');
      
      // Show snooze modal while song is playing
      if (this.onShowSnoozeModal && this.currentAlarm) {
        console.log('📱 Showing snooze modal during wake-up song');
        this.onShowSnoozeModal(this.currentAlarm);
      }
      
      // Wait for song to finish before continuing
      await new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          console.log('🎵 Playback status:', status);
          if (status.didJustFinish) {
            console.log('🎵 Wake-up song finished - continuing to AI voice sequence');
            resolve();
          }
        });
      });
      
      console.log('🎵 Wake-up song completed, proceeding to AI voice sequence');
      
      // After wake-up song finishes, start the AI voice sequence
      if (this.currentAlarm && this.isPlaying) {
        console.log('🎤 Starting AI voice sequence after wake-up song');
        const { purpose, useWakeUpVoice, includeSinging } = this.currentAlarm;
        const userProfile = await this.getUserProfile();
        
        // Start the AI voice loop immediately after wake-up song
        console.log('🎤 Calling startContinuousAIVoiceLoop after wake-up song');
        await this.startContinuousAIVoiceLoop(purpose, userProfile, useWakeUpVoice, includeSinging);
      } else {
        console.log('⚠️ Cannot start AI voice sequence - currentAlarm:', !!this.currentAlarm, 'isPlaying:', this.isPlaying);
      }
      
    } catch (error) {
      console.log('❌ Error playing wake-up song:', error);
    }
  }

  // Start AI voice sequence - BYPASSED: Just play music files
  async startAIVoiceSequence() {
    console.log('🎤 Starting AI voice sequence...');
    
    if (!this.currentAlarm) {
      console.log('⚠️ No current alarm data found');
      return;
    }

    const { purpose, useWakeUpVoice, includeSinging } = this.currentAlarm;
    console.log('🎤 Alarm data:', { purpose, useWakeUpVoice, includeSinging });
    
    // Get user profile for personalization
    const userProfile = await this.getUserProfile();
    console.log('🎤 User profile loaded:', userProfile);
    
    // Check snooze count to determine flow
    const snoozeCount = aiVoiceService.getSnoozeCount(this.currentAlarm.alarmId);
    console.log('🎤 Current snooze count:', snoozeCount);
    
    if (snoozeCount === 1) {
      // First snooze - play wake-up song first
      console.log('🎵 Playing wake-up song before AI voice sequence (first snooze)');
      await this.playWakeUpSong(purpose, userProfile);
    } else {
      // Second+ snooze - start AI voice immediately
      console.log('🎤 Starting AI voice immediately (second+ snooze)');
      this.startContinuousAIVoiceLoop(purpose, userProfile, useWakeUpVoice, includeSinging);
    }
  }

  // Continuous AI voice loop with snooze options
  async startContinuousAIVoiceLoop(purpose, userProfile, useWakeUpVoice, includeSinging) {
    console.log('🔄 Starting continuous AI voice loop...');
    console.log('🔄 Parameters - purpose:', purpose, 'useWakeUpVoice:', useWakeUpVoice, 'includeSinging:', includeSinging);
    
    // Set playing flag to true for AI voice loop (this is separate from alarm sound)
    this.isPlaying = true;
    console.log('🔄 AI voice loop isPlaying set to true');
    
    // Show snooze modal during AI voice playback
    if (this.onShowSnoozeModal) {
      console.log('📱 Showing snooze modal for AI voice loop');
      this.onShowSnoozeModal(this.currentAlarm);
    }
    
    let messageCount = 0;
    
    console.log('🔄 Entering AI voice loop while loop...');
    console.log('🔄 Loop condition - isPlaying:', this.isPlaying, 'currentAlarm:', !!this.currentAlarm);
    while (this.isPlaying && this.currentAlarm) {
      try {
        messageCount++;
        console.log('🔄 AI voice loop iteration', messageCount);
        
        // Check if user wants singing mode
        if (includeSinging && messageCount % 3 === 0) {
          console.log('🎵 Playing AI song...');
          await this.singAISong(purpose, userProfile);
        } else {
          console.log('🎤 Speaking AI message...');
          await this.speakAIMessage(purpose, userProfile);
        }
        
        // Wait before next message
        console.log('⏳ Waiting 3 seconds before next AI message...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('🔄 Continuing to next AI message...');
      } catch (error) {
        console.log('❌ Error in AI voice loop:', error);
        // Continue the loop even if there's an error
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    
    console.log('🔄 AI voice loop ended - isPlaying:', this.isPlaying, 'currentAlarm:', !!this.currentAlarm);
  }

  // Generate and speak AI message
  async speakAIMessage(purpose, userProfile) {
    try {
      console.log('🎤 speakAIMessage called with purpose:', purpose);
      
      // Get the current alarm data
      const alarmData = this.currentAlarm;
      if (!alarmData) {
        console.log('⚠️ No current alarm data found in speakAIMessage');
        return;
      }

      // Get snooze count for this alarm
      const snoozeCount = aiVoiceService.getSnoozeCount(alarmData.alarmId);
      console.log('🎤 Snooze count for AI message:', snoozeCount);
      
      // Generate AI message using the AI service
      console.log('🎤 Generating AI message...');
      const message = await aiVoiceService.generateWakeUpMessage(alarmData, snoozeCount);
      console.log('🎤 AI message generated:', message.substring(0, 100) + '...');
      
      // Convert to speech using ElevenLabs
      console.log('🎤 Converting to speech with ElevenLabs...');
      const audioBuffer = await aiVoiceService.textToSpeech(message, false);
      
      // Check if ElevenLabs failed
      if (audioBuffer === null) {
        console.log('❌ ElevenLabs failed, using system speech as fallback');
        // Use system speech as fallback
        const { Speech } = await import('expo-speech');
        await Speech.speak(message, {
          language: 'en',
          pitch: 1.0,
          rate: 0.9,
        });
        console.log('🎤 Fallback system speech used successfully');
        return;
      }
      
      console.log('🎤 ElevenLabs audio generated successfully');
      
      // Play the audio
      console.log('🎤 Playing AI audio...');
      await aiVoiceService.playAudio(audioBuffer);
      
      console.log('🎤 AI message spoken with ElevenLabs successfully');
    } catch (error) {
      console.log('❌ Error speaking AI message:', error);
      // Fallback to basic message with system speech
      const fallbackMessage = `Time to wake up for ${purpose}!`;
      try {
        console.log('🎤 Using fallback message with system speech:', fallbackMessage);
        const { Speech } = await import('expo-speech');
        await Speech.speak(fallbackMessage, {
          language: 'en',
          pitch: 1.0,
          rate: 0.9,
        });
        console.log('🎤 Fallback system speech used successfully');
      } catch (fallbackError) {
        console.log('❌ Fallback speech error:', fallbackError);
      }
    }
  }

  // Generate and sing AI song
  async singAISong(purpose, userProfile) {
    try {
      // Get the current alarm data
      const alarmData = this.currentAlarm;
      if (!alarmData) return;

      // Get snooze count for this alarm
      const snoozeCount = aiVoiceService.getSnoozeCount(alarmData.alarmId);
      
      // Generate AI song using the AI service
      const song = await aiVoiceService.generateWakeUpMessage(alarmData, snoozeCount);
      
      // Convert to speech using ElevenLabs with singing settings
      const audioBuffer = await aiVoiceService.textToSpeech(song, true);
      
      // Check if ElevenLabs failed
      if (audioBuffer === null) {
        console.log('❌ ElevenLabs failed for singing, using system speech as fallback');
        // Use system speech as fallback
        const { Speech } = await import('expo-speech');
        await Speech.speak(song, {
          language: 'en',
          pitch: 1.2,
          rate: 0.8,
        });
        console.log('🎵 Fallback system speech used for singing');
        return;
      }
      
      // Play the audio
      await aiVoiceService.playAudio(audioBuffer);
      
      console.log('AI song sung with ElevenLabs');
    } catch (error) {
      console.log('Error singing AI song:', error);
      // Fallback to basic song with system speech
      const fallbackSong = `🎵 Wake up, wake up, it's time to rise and shine! 🎵`;
      try {
        console.log('🎵 Using fallback song with system speech');
        const { Speech } = await import('expo-speech');
        await Speech.speak(fallbackSong, {
          language: 'en',
          pitch: 1.2,
          rate: 0.8,
        });
        console.log('🎵 Fallback system speech used for singing');
      } catch (fallbackError) {
        console.log('Fallback song error:', fallbackError);
      }
    }
  }



  // Snooze alarm
  async snoozeAlarm(alarmData, customSnoozeInterval = null) {
    console.log('⏰ Snoozing alarm - stopping AI voice loop');
    
    // Stop wake-up song if it's playing
    if (this.sound) {
      console.log('🎵 Stopping wake-up song due to snooze');
      await this.sound.unloadAsync();
      this.sound = null;
    }
    
    // Stop AI voice if it's playing
    await aiVoiceService.stopAudio();
    
    // Increment snooze count in AI service
    aiVoiceService.incrementSnoozeCount(alarmData.alarmId);
    
    // Check if we're currently playing a wake-up song (this means user snoozed during the song)
    const snoozeCount = aiVoiceService.getSnoozeCount(alarmData.alarmId);
    console.log('⏰ Current snooze count:', snoozeCount);
    
    if (snoozeCount >= 1) {
      // User snoozed during wake-up song - immediately start AI voice
      console.log('🎤 User snoozed during wake-up song - starting AI voice immediately');
      
      // Set current alarm and start AI voice sequence
      this.currentAlarm = alarmData;
      this.isPlaying = true;
      
      // Start AI voice immediately
      const { purpose, useWakeUpVoice, includeSinging } = alarmData;
      const userProfile = await this.getUserProfile();
      
      console.log('🎤 Starting AI voice immediately after snooze');
      this.startContinuousAIVoiceLoop(purpose, userProfile, useWakeUpVoice, includeSinging);
    } else {
      // First snooze - schedule notification for later
      console.log('⏰ First snooze - scheduling notification for later');
      
      const snoozeInterval = customSnoozeInterval || alarmData.snoozeInterval || 5;
      const snoozeTime = new Date(Date.now() + snoozeInterval * 60 * 1000);
      
      console.log(`⏰ Snoozed for ${snoozeInterval} minutes - AI voice will play at ${snoozeTime.toLocaleTimeString()}`);
      
      // Schedule snooze notification with AI voice sequence
      const snoozeNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'WakeyTalky - Snooze Time Up!',
          body: `Time to wake up for ${alarmData.purpose}`,
          data: {
            alarmId: alarmData.alarmId,
            purpose: alarmData.purpose,
            useWakeUpVoice: alarmData.useWakeUpVoice,
            includeSinging: alarmData.includeSinging,
            ringtoneType: alarmData.ringtoneType,
            snoozeEnabled: alarmData.snoozeEnabled,
            snoozeInterval: alarmData.snoozeInterval,
            originalTime: alarmData.originalTime,
            repeatDays: alarmData.repeatDays,
            isSnooze: true,
            snoozeCount: aiVoiceService.getSnoozeCount(alarmData.alarmId),
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          date: snoozeTime,
        },
      });
      
      console.log(`⏰ Snooze notification scheduled with ID: ${snoozeNotificationId}`);
    }
  }

  // Stop alarm
  async stopAlarm() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.isPlaying = false;
    this.currentAlarm = null;
    this.snoozeCount = 0;
    await aiVoiceService.stopAudio();
  }

  // Dismiss alarm
  async dismissAlarm(alarmData) {
    console.log('✅ Dismissing alarm - stopping AI voice loop');
    
    // Stop everything and clear alarm data
    this.isPlaying = false;
    this.currentAlarm = null;
    await aiVoiceService.stopAudio();
    
    // Stop wake-up song if it's playing
    if (this.sound) {
      console.log('🎵 Stopping wake-up song due to dismiss');
      await this.sound.unloadAsync();
      this.sound = null;
    }
    
    // Reset snooze count when alarm is dismissed
    aiVoiceService.resetSnoozeCount(alarmData.alarmId);
    
    // Cancel the notification
    if (alarmData.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(alarmData.notificationId);
    }
  }

  // Show snooze options in app (fallback if notification buttons don't work)
  showSnoozeOptions(alarmData) {
    console.log('🔔 Showing snooze options for alarm:', alarmData.purpose);
    
    // Call the callback to show the snooze modal
    if (this.onShowSnoozeModal) {
      this.onShowSnoozeModal(alarmData);
    } else {
      console.log('⚠️ No snooze modal callback set');
      // Fallback: auto-snooze for 5 minutes
      this.snoozeAlarm(alarmData, 5);
    }
  }

  // Set callback for showing snooze modal
  setSnoozeModalCallback(callback) {
    this.onShowSnoozeModal = callback;
  }

  // Get user profile from storage
  async getUserProfile() {
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      return profileJson ? JSON.parse(profileJson) : {};
    } catch (error) {
      console.log('Error getting user profile:', error);
      return {};
    }
  }

  // Save alarms to storage
  async saveAlarms() {
    try {
      const alarmsArray = Array.from(this.alarms.values());
      await AsyncStorage.setItem('alarms', JSON.stringify(alarmsArray));
    } catch (error) {
      console.log('Error saving alarms:', error);
    }
  }

  // Load alarms from storage
  async loadAlarms() {
    try {
      const alarmsJson = await AsyncStorage.getItem('alarms');
      if (alarmsJson) {
        const alarmsArray = JSON.parse(alarmsJson);
        this.alarms.clear();
        alarmsArray.forEach(alarm => {
          this.alarms.set(alarm.id, alarm);
        });
      }
    } catch (error) {
      console.log('Error loading alarms:', error);
    }
  }

  // Get all alarms
  getAlarms() {
    return Array.from(this.alarms.values());
  }

  // Delete alarm
  async deleteAlarm(alarmId) {
    const alarm = this.alarms.get(alarmId);
    if (alarm) {
      await Notifications.cancelScheduledNotificationAsync(alarm.notificationId);
      this.alarms.delete(alarmId);
      await this.saveAlarms();
    }
  }

  // Toggle alarm
  async toggleAlarm(alarmId) {
    const alarm = this.alarms.get(alarmId);
    if (alarm) {
      alarm.isActive = !alarm.isActive;
      
      if (alarm.isActive) {
        // Reschedule alarm - ensure time is a Date object
        const alarmData = {
          ...alarm,
          time: alarm.time instanceof Date ? alarm.time : new Date(alarm.time)
        };
        await this.scheduleAlarm(alarmData);
      } else {
        // Cancel alarm
        await Notifications.cancelScheduledNotificationAsync(alarm.notificationId);
      }
      
      await this.saveAlarms();
    }
  }
}

// Create singleton instance
const alarmService = new AlarmService();

export default alarmService; 