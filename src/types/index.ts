// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  preferredTone: 'delicate' | 'mid-delicate' | 'savage';
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  pronouns?: string;
  hobbies: string[];
  personalGoals: string[];
  wakeStylePreference: 'spoken' | 'sung' | 'mixed';
  createdAt: Date;
  updatedAt: Date;
}

// Alarm Types
export interface Alarm {
  id: string;
  userId: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  label: string;
  purpose: string;
  isActive: boolean;
  snoozeEnabled: boolean;
  snoozeInterval: number; // minutes
  maxSnoozes: number;
  useWakeUpVoice: boolean;
  includeSinging: boolean;
  tone: 'delicate' | 'mid-delicate' | 'savage';
  createdAt: Date;
  updatedAt: Date;
}

// Voice Content Types
export interface VoiceMessage {
  id: string;
  alarmId: string;
  type: 'spoken' | 'sung' | 'mixed';
  content: string;
  tone: 'delicate' | 'mid-delicate' | 'savage';
  audioUrl?: string;
  duration: number; // seconds
  createdAt: Date;
}

export interface VoicePersona {
  id: string;
  name: string;
  description: string;
  tone: 'delicate' | 'mid-delicate' | 'savage';
  style: 'soft-singer' | 'hype-mc' | 'comedic-jester' | 'pop-diva' | 'nigerian-aunty' | 'wise-elder' | 'zen-monk' | 'study-buddy' | 'hype-coach';
  voiceId: string; // ElevenLabs voice ID
  isUnlocked: boolean;
  isDefault: boolean;
}

// Alarm History Types
export interface AlarmHistory {
  id: string;
  alarmId: string;
  userId: string;
  scheduledTime: Date;
  actualWakeTime?: Date;
  snoozeCount: number;
  wasSkipped: boolean;
  voiceMessageId?: string;
  challengeCompleted?: boolean;
  challengeObject?: string;
  createdAt: Date;
}

// Challenge Mode Types
export interface ChallengeMode {
  id: string;
  alarmHistoryId: string;
  objectToFind: string;
  timeLimit: number; // seconds
  isCompleted: boolean;
  completedAt?: Date;
  imageUrl?: string;
  createdAt: Date;
}

// Gamification Types
export interface UserStats {
  userId: string;
  totalAlarms: number;
  successfulWakes: number;
  currentStreak: number;
  longestStreak: number;
  totalSnoozes: number;
  totalSkips: number;
  averageWakeTime: number; // minutes after scheduled time
  achievements: Achievement[];
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: 'streak' | 'wake-time' | 'challenge' | 'voice' | 'social';
}

// AI Generation Types
export interface AIGenerationRequest {
  userId: string;
  alarmId: string;
  userProfile: UserProfile;
  alarm: Alarm;
  alarmHistory?: AlarmHistory;
  context: {
    snoozeCount: number;
    previousMessages: VoiceMessage[];
    timeOfDay: 'morning' | 'noon' | 'evening' | 'night';
    dayOfWeek: number;
  };
}

export interface AIGenerationResponse {
  content: string;
  tone: 'delicate' | 'mid-delicate' | 'savage';
  type: 'spoken' | 'sung' | 'mixed';
  style: string;
  estimatedDuration: number;
  emotion: 'encouraging' | 'sarcastic' | 'funny' | 'gentle' | 'hype';
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  AlarmSetup: { alarmId?: string };
  Profile: undefined;
  Settings: undefined;
  Achievements: undefined;
  VoicePreview: { messageId: string };
  ChallengeMode: { alarmHistoryId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Alarms: undefined;
  Stats: undefined;
  Voice: undefined;
};

// App State Types
export interface AppState {
  user: UserProfile | null;
  alarms: Alarm[];
  currentAlarm: Alarm | null;
  isAlarmActive: boolean;
  isChallengeMode: boolean;
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Voice Generation Types
export interface VoiceGenerationConfig {
  provider: 'elevenlabs' | 'azure' | 'google' | 'bark';
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

// Notification Types
export interface NotificationConfig {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  priority: 'high' | 'default' | 'low';
  channelId: string;
  scheduledTime: Date;
}

export default {
  UserProfile,
  Alarm,
  VoiceMessage,
  VoicePersona,
  AlarmHistory,
  ChallengeMode,
  UserStats,
  Achievement,
  AIGenerationRequest,
  AIGenerationResponse,
  RootStackParamList,
  MainTabParamList,
  AppState,
  APIResponse,
  VoiceGenerationConfig,
  NotificationConfig,
}; 