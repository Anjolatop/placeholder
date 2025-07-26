// WakeyTalky Configuration

export const CONFIG = {
  // API Keys (should be stored in environment variables)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || 'your_elevenlabs_api_key_here',
  AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY || 'your_azure_speech_key_here',
  AZURE_SPEECH_REGION: process.env.AZURE_SPEECH_REGION || 'your_azure_region_here',
  BARK_API_KEY: process.env.BARK_API_KEY || 'your_bark_api_key_here',

  // Firebase Configuration
  FIREBASE: {
    apiKey: process.env.FIREBASE_API_KEY || 'your_firebase_api_key_here',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your_project.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your_project.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_sender_id',
    appId: process.env.FIREBASE_APP_ID || 'your_app_id',
  },

  // Supabase Configuration
  SUPABASE: {
    url: process.env.SUPABASE_URL || 'your_supabase_url_here',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key_here',
  },

  // Google Cloud Configuration
  GOOGLE_CLOUD: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'your_google_cloud_project_id',
    storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'your_storage_bucket_name',
  },

  // App Configuration
  APP: {
    env: process.env.APP_ENV || 'development',
    debugMode: process.env.DEBUG_MODE === 'true' || true,
    logLevel: process.env.LOG_LEVEL || 'debug',
  },

  // Voice Generation Settings
  VOICE: {
    defaultVoiceId: process.env.DEFAULT_VOICE_ID || 'default-voice-id',
    defaultSingingStyle: process.env.DEFAULT_SINGING_STYLE || 'pop-diva',
    maxDuration: parseInt(process.env.MAX_VOICE_DURATION) || 40,
    generationTimeout: parseInt(process.env.VOICE_GENERATION_TIMEOUT) || 30000,
  },

  // Alarm Settings
  ALARM: {
    defaultSnoozeInterval: parseInt(process.env.DEFAULT_SNOOZE_INTERVAL) || 5,
    maxSnoozeCount: parseInt(process.env.MAX_SNOOZE_COUNT) || 3,
    challengeModeEnabled: process.env.CHALLENGE_MODE_ENABLED === 'true' || true,
    challengeTimeLimit: parseInt(process.env.CHALLENGE_TIME_LIMIT) || 60,
  },

  // Notification Settings
  NOTIFICATION: {
    soundEnabled: process.env.NOTIFICATION_SOUND_ENABLED === 'true' || true,
    vibrationEnabled: process.env.VIBRATION_ENABLED === 'true' || true,
    backgroundAlarmEnabled: process.env.BACKGROUND_ALARM_ENABLED === 'true' || true,
  },

  // AI Settings
  AI: {
    model: process.env.AI_MODEL || 'gpt-4',
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.8,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 300,
    presencePenalty: parseFloat(process.env.AI_PRESENCE_PENALTY) || 0.1,
    frequencyPenalty: parseFloat(process.env.AI_FREQUENCY_PENALTY) || 0.1,
  },

  // Challenge Mode Objects
  CHALLENGE_OBJECTS: [
    'microwave',
    'fridge',
    'toothbrush',
    'shoes',
    'mirror',
    'tv',
    'door handle',
    'sink',
    'window',
    'lamp',
    'chair',
    'table',
    'book',
    'phone',
    'laptop',
    'remote control',
    'keys',
    'wallet',
    'backpack',
    'umbrella',
  ],

  // Voice Personas Configuration
  VOICE_PERSONAS: {
    defaultPersonas: [
      {
        id: 'soft-singer',
        name: 'Soft Singer',
        description: 'Gentle, melodic voice for delicate messages',
        tone: 'delicate',
        style: 'soft-singer',
        voiceId: 'soft-voice-id',
        isUnlocked: true,
        isDefault: true,
      },
      {
        id: 'hype-mc',
        name: 'Hype MC',
        description: 'Energetic, motivational voice',
        tone: 'savage',
        style: 'hype-mc',
        voiceId: 'hype-voice-id',
        isUnlocked: true,
        isDefault: false,
      },
      {
        id: 'pop-diva',
        name: 'Pop Diva',
        description: 'Powerful, confident voice',
        tone: 'mid-delicate',
        style: 'pop-diva',
        voiceId: 'diva-voice-id',
        isUnlocked: true,
        isDefault: false,
      },
    ],
    unlockablePersonas: [
      {
        id: 'nigerian-aunty',
        name: 'Nigerian Aunty',
        description: 'Warm, caring voice with Nigerian accent',
        tone: 'delicate',
        style: 'nigerian-aunty',
        voiceId: 'aunty-voice-id',
        unlockRequirement: 'Complete 7-day streak',
      },
      {
        id: 'wise-elder',
        name: 'Wise Elder',
        description: 'Calm, wise voice for gentle guidance',
        tone: 'delicate',
        style: 'wise-elder',
        voiceId: 'elder-voice-id',
        unlockRequirement: 'Wake up 30 times successfully',
      },
      {
        id: 'comedic-jester',
        name: 'Comedic Jester',
        description: 'Funny, playful voice for humor',
        tone: 'savage',
        style: 'comedic-jester',
        voiceId: 'jester-voice-id',
        unlockRequirement: 'Complete 5 challenges',
      },
    ],
  },

  // Achievement Configuration
  ACHIEVEMENTS: {
    streakAchievements: [
      {
        id: 'first-week',
        name: 'Week Warrior',
        description: 'Complete a 7-day wake-up streak',
        requirement: 7,
        category: 'streak',
        icon: 'local-fire-department',
      },
      {
        id: 'month-master',
        name: 'Month Master',
        description: 'Complete a 30-day wake-up streak',
        requirement: 30,
        category: 'streak',
        icon: 'emoji-events',
      },
      {
        id: 'hundred-club',
        name: 'Hundred Club',
        description: 'Complete a 100-day wake-up streak',
        requirement: 100,
        category: 'streak',
        icon: 'workspace-premium',
      },
    ],
    wakeTimeAchievements: [
      {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Wake up before 6 AM for 7 days',
        requirement: 7,
        category: 'wake-time',
        icon: 'wb-sunny',
      },
      {
        id: 'consistency-king',
        name: 'Consistency King',
        description: 'Wake up within 5 minutes of alarm for 14 days',
        requirement: 14,
        category: 'wake-time',
        icon: 'schedule',
      },
    ],
    challengeAchievements: [
      {
        id: 'challenge-accepted',
        name: 'Challenge Accepted',
        description: 'Complete your first challenge',
        requirement: 1,
        category: 'challenge',
        icon: 'camera-alt',
      },
      {
        id: 'challenge-master',
        name: 'Challenge Master',
        description: 'Complete 10 challenges',
        requirement: 10,
        category: 'challenge',
        icon: 'sports-esports',
      },
    ],
  },

  // Gamification Settings
  GAMIFICATION: {
    experiencePerWake: 10,
    experiencePerStreak: 50,
    experiencePerAchievement: 100,
    levelUpThreshold: 1000,
    maxLevel: 100,
  },
};

export default CONFIG; 