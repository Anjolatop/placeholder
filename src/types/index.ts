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
  preferredVoiceMood: 'soft-singer' | 'hype-mc' | 'comedic-jester' | 'pop-diva';
  musicPreferences: string[]; // e.g., ['Beyoncé', 'Pop', 'R&B']
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
  voiceMoodOverride?: 'soft-singer' | 'hype-mc' | 'comedic-jester' | 'pop-diva';
  tone: 'delicate' | 'mid-delicate' | 'savage';
  challengeModeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Voice Content Types
export interface VoiceMessage {
  id: string;
  alarmId: string;
  type: 'spoken' | 'sung' | 'mixed';
  content: string;
  lyrics?: string; // For sung messages
  melody?: string; // Musical notation or style description
  tone: 'delicate' | 'mid-delicate' | 'savage';
  mood: 'soft-singer' | 'hype-mc' | 'comedic-jester' | 'pop-diva';
  audioUrl?: string;
  duration: number; // seconds
  isGenerated: boolean;
  createdAt: Date;
}

export interface SongStructure {
  greeting: string;
  coreMessage: string;
  goalReminder: string;
  closureLine: string;
  musicStyle: 'nursery-remix' | 'rap-hype' | 'comedic-jingle' | 'gentle-lullaby' | 'pop-anthem' | 'r&b-smooth';
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
  unlockRequirement?: {
    type: 'streak' | 'level' | 'achievement';
    value: number | string;
  };
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
  voiceMessageType?: 'spoken' | 'sung' | 'mixed';
  challengeCompleted?: boolean;
  challengeObject?: string;
  challengeAttempts?: number;
  wasInstantWake: boolean; // Woke up within 30 seconds
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
  attempts: ChallengeAttempt[];
  createdAt: Date;
}

export interface ChallengeAttempt {
  id: string;
  imageUrl: string;
  detectedObjects: string[];
  isCorrect: boolean;
  confidence: number;
  timestamp: Date;
}

export interface ChallengeObject {
  name: string;
  alternatives: string[]; // Alternative names for the object
  description: string;
  detectionKeywords: string[];
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
  instantWakes: number; // Woke up within 30 seconds
  songsHeard: number;
  challengesCompleted: number;
  averageWakeTime: number; // minutes after scheduled time
  achievements: Achievement[];
  level: number;
  experience: number;
  unlockedVoicePersonas: string[];
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
  reward?: {
    type: 'voice-persona' | 'experience' | 'title';
    value: string | number;
  };
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
    recentBehavior: 'punctual' | 'snooze-heavy' | 'skip-prone';
    consecutiveSkips: number;
  };
}

export interface AIGenerationResponse {
  content: string;
  tone: 'delicate' | 'mid-delicate' | 'savage';
  type: 'spoken' | 'sung' | 'mixed';
  style: string;
  estimatedDuration: number;
  emotion: 'encouraging' | 'sarcastic' | 'funny' | 'gentle' | 'hype';
  songStructure?: SongStructure;
  shouldTriggerChallenge: boolean;
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
  VoicePersonaSelection: undefined;
  SingingPreview: { voicePersona: string; sampleText: string };
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
  unlockedVoicePersonas: VoicePersona[];
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
  provider: 'elevenlabs' | 'azure' | 'google' | 'bark' | 'voicemod';
  voiceId: string;
  model: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  isMusic: boolean; // For singing voices
  musicStyle?: 'pop' | 'r&b' | 'rap' | 'lullaby' | 'jingle';
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

// Music and Singing Types
export interface MusicTemplate {
  id: string;
  name: string;
  style: 'nursery-remix' | 'rap-hype' | 'comedic-jingle' | 'gentle-lullaby' | 'pop-anthem' | 'r&b-smooth';
  tempo: 'slow' | 'medium' | 'fast';
  mood: 'uplifting' | 'energetic' | 'calming' | 'motivational' | 'humorous';
  structure: {
    intro: string;
    verse: string;
    chorus: string;
    outro: string;
  };
  sampleLyrics: string;
}

export interface BehavioralTrigger {
  condition: 'consecutive_snoozes' | 'instant_wake' | 'skip_streak' | 'weekend_mode' | 'goal_reminder';
  threshold: number;
  action: 'dramatic_song' | 'victory_jingle' | 'guilt_trip_song' | 'gentle_reminder' | 'hype_anthem';
  messageOverride?: string;
}

export default {
  UserProfile,
  Alarm,
  VoiceMessage,
  SongStructure,
  VoicePersona,
  AlarmHistory,
  ChallengeMode,
  ChallengeAttempt,
  ChallengeObject,
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
  MusicTemplate,
  BehavioralTrigger,
}; 