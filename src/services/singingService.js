import { MusicTemplate, SongStructure, VoicePersona, BehavioralTrigger } from '../types';

class SingingService {
  constructor() {
    this.elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    this.voicemodKey = process.env.VOICEMOD_API_KEY;
    this.elevenLabsUrl = 'https://api.elevenlabs.io/v1';
    this.voicemodUrl = 'https://api.voicemod.net/v1';
    this.musicTemplates = this.initializeMusicTemplates();
    this.voicePersonas = this.initializeVoicePersonas();
    this.behavioralTriggers = this.initializeBehavioralTriggers();
  }

  /**
   * Initialize music templates for different singing styles
   */
  initializeMusicTemplates() {
    return [
      {
        id: 'nursery-remix',
        name: 'Nursery Rhyme Remix',
        style: 'nursery-remix',
        tempo: 'medium',
        mood: 'humorous',
        structure: {
          intro: '🎵 {greeting} {greeting} 🎵',
          verse: '🎵 {coreMessage} don\'t you see 🎵',
          chorus: '🎵 {goalReminder} is the key 🎵',
          outro: '🎵 {closureLine} 1-2-3! 🎵'
        },
        sampleLyrics: 'Wake up wake up, sleepy head, Time to get out of your bed!'
      },
      {
        id: 'rap-hype',
        name: 'Hype Rap',
        style: 'rap-hype',
        tempo: 'fast',
        mood: 'energetic',
        structure: {
          intro: 'Yo! {greeting}',
          verse: '{coreMessage} - that\'s the plan',
          chorus: '{goalReminder} - you know you can!',
          outro: '{closureLine} - now let\'s GO!'
        },
        sampleLyrics: 'Alarm\'s ringing, time to move, Get your body in the groove!'
      },
      {
        id: 'comedic-jingle',
        name: 'Comedic Jingle',
        style: 'comedic-jingle',
        tempo: 'medium',
        mood: 'humorous',
        structure: {
          intro: '🎪 {greeting} 🎪',
          verse: '{coreMessage} (da da da)',
          chorus: '{goalReminder} (tra la la)',
          outro: '{closureLine} (ta-da!) 🎪'
        },
        sampleLyrics: 'Rise and shine, it\'s jingle time!'
      },
      {
        id: 'gentle-lullaby',
        name: 'Gentle Lullaby',
        style: 'gentle-lullaby',
        tempo: 'slow',
        mood: 'calming',
        structure: {
          intro: '🌅 {greeting} sweet soul 🌅',
          verse: '{coreMessage} take control',
          chorus: '{goalReminder} reach your goal',
          outro: '{closureLine} make you whole 🌅'
        },
        sampleLyrics: 'Gentle morning, soft and bright, Time to greet the morning light'
      },
      {
        id: 'pop-anthem',
        name: 'Pop Anthem',
        style: 'pop-anthem',
        tempo: 'fast',
        mood: 'uplifting',
        structure: {
          intro: '✨ {greeting} superstar ✨',
          verse: '{coreMessage} you\'ve come so far',
          chorus: '{goalReminder} you\'re gonna go far!',
          outro: '{closureLine} you\'re a star! ✨'
        },
        sampleLyrics: 'You\'re a champion, you\'re so strong, Today\'s the day you\'ll sing your song!'
      },
      {
        id: 'r&b-smooth',
        name: 'R&B Smooth',
        style: 'r&b-smooth',
        tempo: 'medium',
        mood: 'motivational',
        structure: {
          intro: '🎶 {greeting} baby 🎶',
          verse: '{coreMessage} don\'t be lazy',
          chorus: '{goalReminder} drive me crazy (in a good way)',
          outro: '{closureLine} amazing! 🎶'
        },
        sampleLyrics: 'Morning sunshine, time to rise, Success is waiting, that\'s your prize'
      }
    ];
  }

  /**
   * Initialize voice personas with singing capabilities
   */
  initializeVoicePersonas() {
    return [
      {
        id: 'soft-singer',
        name: '✨ Soft Singer',
        description: 'Gentle, melodic voice perfect for peaceful mornings',
        tone: 'delicate',
        style: 'soft-singer',
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // ElevenLabs voice
        isUnlocked: true,
        isDefault: true
      },
      {
        id: 'hype-mc',
        name: '😎 Hype MC',
        description: 'Energetic rapper who gets you pumped for the day',
        tone: 'savage',
        style: 'hype-mc',
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        isUnlocked: true,
        isDefault: false
      },
      {
        id: 'comedic-jester',
        name: '🤡 Comedic Jester',
        description: 'Funny entertainer who makes waking up amusing',
        tone: 'mid-delicate',
        style: 'comedic-jester',
        voiceId: 'N2lVS1w4EtoT3dr4eOWO',
        isUnlocked: false,
        isDefault: false,
        unlockRequirement: { type: 'streak', value: 7 }
      },
      {
        id: 'pop-diva',
        name: '🔥 Pop Diva',
        description: 'Beyoncé-inspired powerhouse vocalist',
        tone: 'savage',
        style: 'pop-diva',
        voiceId: 'ThT5KcBeYPX3keUQqHPh',
        isUnlocked: false,
        isDefault: false,
        unlockRequirement: { type: 'level', value: 10 }
      },
      {
        id: 'nigerian-aunty',
        name: '💃 Nigerian Aunty',
        description: 'Loving but firm African aunty voice',
        tone: 'mid-delicate',
        style: 'nigerian-aunty',
        voiceId: 'z9fAnlkpzviPz146aGWa',
        isUnlocked: false,
        isDefault: false,
        unlockRequirement: { type: 'achievement', value: 'cultural-explorer' }
      }
    ];
  }

  /**
   * Initialize behavioral triggers for dynamic singing responses
   */
  initializeBehavioralTriggers() {
    return [
      {
        condition: 'consecutive_snoozes',
        threshold: 3,
        action: 'dramatic_song',
        messageOverride: 'Time for an intervention! 🎭'
      },
      {
        condition: 'instant_wake',
        threshold: 1,
        action: 'victory_jingle',
        messageOverride: 'Champion wake-up! 🏆'
      },
      {
        condition: 'skip_streak',
        threshold: 2,
        action: 'guilt_trip_song',
        messageOverride: 'We need to talk... 💔'
      },
      {
        condition: 'weekend_mode',
        threshold: 1,
        action: 'gentle_reminder',
        messageOverride: 'Weekend vibes! 🌴'
      }
    ];
  }

  /**
   * Generate a personalized song based on user profile and context
   */
  async generateSong(userProfile, alarm, context) {
    try {
      // Determine appropriate music style based on user preferences and context
      const musicStyle = this.selectMusicStyle(userProfile, alarm, context);
      const template = this.musicTemplates.find(t => t.style === musicStyle);
      
      if (!template) {
        throw new Error(`Music template not found for style: ${musicStyle}`);
      }

      // Check for behavioral triggers
      const trigger = this.checkBehavioralTriggers(context);
      
      // Generate song structure
      const songStructure = await this.generateSongStructure(
        userProfile, 
        alarm, 
        context, 
        template,
        trigger
      );

      // Create the complete song
      const completeSong = this.assembleSong(songStructure, template);

      return {
        content: completeSong,
        lyrics: completeSong,
        melody: template.style,
        songStructure,
        musicStyle: template.style,
        voicePersona: this.selectVoicePersona(userProfile, alarm),
        shouldTriggerChallenge: context.snoozeCount >= 3
      };

    } catch (error) {
      console.error('Error generating song:', error);
      return this.getFallbackSong(userProfile, alarm);
    }
  }

  /**
   * Select appropriate music style based on context
   */
  selectMusicStyle(userProfile, alarm, context) {
    const { timeOfDay, snoozeCount, recentBehavior } = context;
    const tone = alarm.tone || userProfile.preferredTone;

    // Special cases for behavioral triggers
    if (snoozeCount >= 3) return 'dramatic-song';
    if (context.wasInstantWake) return 'victory-jingle';
    if (context.consecutiveSkips >= 2) return 'guilt-trip-song';

    // Time-based selection
    if (timeOfDay === 'morning') {
      switch (tone) {
        case 'delicate': return 'gentle-lullaby';
        case 'mid-delicate': return 'pop-anthem';
        case 'savage': return 'rap-hype';
        default: return 'pop-anthem';
      }
    }

    // Purpose-based selection
    if (alarm.purpose?.toLowerCase().includes('gym') || 
        alarm.purpose?.toLowerCase().includes('workout')) {
      return 'rap-hype';
    }

    if (alarm.purpose?.toLowerCase().includes('study') || 
        alarm.purpose?.toLowerCase().includes('work')) {
      return tone === 'delicate' ? 'gentle-lullaby' : 'pop-anthem';
    }

    // Default selection based on user preferences
    if (userProfile.musicPreferences?.includes('Beyoncé') || 
        userProfile.musicPreferences?.includes('Pop')) {
      return 'pop-anthem';
    }

    if (userProfile.musicPreferences?.includes('R&B')) {
      return 'r&b-smooth';
    }

    // Fallback based on tone
    switch (tone) {
      case 'delicate': return 'gentle-lullaby';
      case 'savage': return 'rap-hype';
      default: return 'comedic-jingle';
    }
  }

  /**
   * Select appropriate voice persona
   */
  selectVoicePersona(userProfile, alarm) {
    // Check for alarm-specific override
    if (alarm.voiceMoodOverride) {
      return alarm.voiceMoodOverride;
    }

    // Use user's preferred voice mood
    return userProfile.preferredVoiceMood || 'soft-singer';
  }

  /**
   * Check for behavioral triggers
   */
  checkBehavioralTriggers(context) {
    for (const trigger of this.behavioralTriggers) {
      switch (trigger.condition) {
        case 'consecutive_snoozes':
          if (context.snoozeCount >= trigger.threshold) return trigger;
          break;
        case 'instant_wake':
          if (context.wasInstantWake) return trigger;
          break;
        case 'skip_streak':
          if (context.consecutiveSkips >= trigger.threshold) return trigger;
          break;
        case 'weekend_mode':
          if ([0, 6].includes(context.dayOfWeek)) return trigger;
          break;
      }
    }
    return null;
  }

  /**
   * Generate song structure with AI assistance
   */
  async generateSongStructure(userProfile, alarm, context, template, trigger) {
    const greeting = `Good ${this.getTimeGreeting(context.timeOfDay)}, ${userProfile.name}`;
    
    let coreMessage;
    let goalReminder;
    let closureLine;

    if (trigger) {
      // Handle special behavioral triggers
      switch (trigger.action) {
        case 'dramatic_song':
          coreMessage = 'Snooze button\'s not your friend';
          goalReminder = 'This pattern has to end';
          closureLine = 'Time to rise and make amends';
          break;
        case 'victory_jingle':
          coreMessage = 'Look who\'s up without delay';
          goalReminder = 'Champion of the day';
          closureLine = 'Keep this energy, hooray!';
          break;
        case 'guilt_trip_song':
          coreMessage = 'Your dreams are calling out to you';
          goalReminder = 'But skipping won\'t make them come true';
          closureLine = 'One small step is all you need to do';
          break;
        case 'gentle_reminder':
          coreMessage = 'Weekend vibes are in the air';
          goalReminder = 'But your goals still need your care';
          closureLine = 'Balance rest with being aware';
          break;
        default:
          coreMessage = this.generateGenericCoreMessage(alarm, userProfile);
          goalReminder = this.generateGoalReminder(alarm, userProfile);
          closureLine = this.generateClosureLine(alarm, userProfile);
      }
    } else {
      coreMessage = this.generateGenericCoreMessage(alarm, userProfile);
      goalReminder = this.generateGoalReminder(alarm, userProfile);
      closureLine = this.generateClosureLine(alarm, userProfile);
    }

    return {
      greeting,
      coreMessage,
      goalReminder,
      closureLine,
      musicStyle: template.style
    };
  }

  /**
   * Generate core message based on alarm purpose and user profile
   */
  generateGenericCoreMessage(alarm, userProfile) {
    const purpose = alarm.purpose?.toLowerCase() || '';
    const tone = alarm.tone || userProfile.preferredTone;

    const messages = {
      'delicate': {
        'gym': 'Your body deserves some love today',
        'work': 'Great things await your gentle touch',
        'study': 'Knowledge flows to those who show up',
        'default': 'The world is brighter with you awake'
      },
      'mid-delicate': {
        'gym': 'Time to show those weights who\'s boss',
        'work': 'Success is calling your name today',
        'study': 'Your brain is hungry for some learning',
        'default': 'Adventure awaits outside these covers'
      },
      'savage': {
        'gym': 'Excuses are expired, time to work out',
        'work': 'Hustlers don\'t hit snooze, they hit goals',
        'study': 'Mediocrity is not in your vocabulary',
        'default': 'Legends don\'t stay in bed all day'
      }
    };

    const toneMessages = messages[tone] || messages['mid-delicate'];
    
    for (const key of Object.keys(toneMessages)) {
      if (purpose.includes(key) && key !== 'default') {
        return toneMessages[key];
      }
    }
    
    return toneMessages['default'];
  }

  /**
   * Generate goal reminder based on user's personal goals
   */
  generateGoalReminder(alarm, userProfile) {
    const goals = userProfile.personalGoals || [];
    if (goals.length > 0) {
      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      return `Remember: ${randomGoal}`;
    }

    // Fallback goal reminders
    const fallbackGoals = [
      'Every day is a new opportunity',
      'Small steps lead to big changes',
      'You\'re building the life you want',
      'Progress over perfection always',
      'Your future self will thank you'
    ];

    return fallbackGoals[Math.floor(Math.random() * fallbackGoals.length)];
  }

  /**
   * Generate closure line
   */
  generateClosureLine(alarm, userProfile) {
    const tone = alarm.tone || userProfile.preferredTone;
    
    const closureLines = {
      'delicate': [
        'You\'ve got this, beautiful soul',
        'Sending you gentle morning energy',
        'May your day be filled with peace',
        'Take it one breath at a time'
      ],
      'mid-delicate': [
        'Now go make some magic happen',
        'The day is yours to conquer',
        'Time to write your success story',
        'Let\'s turn dreams into reality'
      ],
      'savage': [
        'No excuses, just results',
        'Winners don\'t negotiate with snooze',
        'Time to show the world what you\'re made of',
        'Mediocrity is not on the menu today'
      ]
    };

    const lines = closureLines[tone] || closureLines['mid-delicate'];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  /**
   * Assemble the complete song using the template structure
   */
  assembleSong(songStructure, template) {
    const { intro, verse, chorus, outro } = template.structure;
    
    const completeSong = `${intro
      .replace('{greeting}', songStructure.greeting)}\n${verse
      .replace('{coreMessage}', songStructure.coreMessage)}\n${chorus
      .replace('{goalReminder}', songStructure.goalReminder)}\n${outro
      .replace('{closureLine}', songStructure.closureLine)}`;

    return completeSong;
  }

  /**
   * Get time-appropriate greeting
   */
  getTimeGreeting(timeOfDay) {
    switch (timeOfDay) {
      case 'morning': return 'morning';
      case 'noon': return 'afternoon';
      case 'evening': return 'evening';
      case 'night': return 'night';
      default: return 'morning';
    }
  }

  /**
   * Get fallback song when generation fails
   */
  getFallbackSong(userProfile, alarm) {
    return {
      content: `🎵 Good morning ${userProfile.name}!\nTime to rise and shine today!\nYour dreams are waiting for you,\nSo let's not delay! 🎵`,
      lyrics: `Good morning ${userProfile.name}, Time to rise and shine today, Your dreams are waiting for you, So let's not delay!`,
      melody: 'gentle-lullaby',
      musicStyle: 'gentle-lullaby',
      voicePersona: 'soft-singer',
      shouldTriggerChallenge: false
    };
  }

  /**
   * Convert song to audio using text-to-speech with singing capabilities
   */
  async generateSingingAudio(songContent, voicePersona, musicStyle) {
    try {
      const persona = this.voicePersonas.find(p => p.id === voicePersona);
      if (!persona) {
        throw new Error(`Voice persona not found: ${voicePersona}`);
      }

      // Use ElevenLabs for high-quality singing voice generation
      const response = await fetch(`${this.elevenLabsUrl}/text-to-speech/${persona.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsKey,
        },
        body: JSON.stringify({
          text: songContent,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.8,
            style: 0.8,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return audioBuffer;

    } catch (error) {
      console.error('Error generating singing audio:', error);
      throw error;
    }
  }

  /**
   * Get available voice personas for user
   */
  getAvailableVoicePersonas(userStats) {
    return this.voicePersonas.filter(persona => {
      if (persona.isUnlocked) return true;
      
      if (!persona.unlockRequirement) return true;
      
      const { type, value } = persona.unlockRequirement;
      
      switch (type) {
        case 'streak':
          return userStats.currentStreak >= value;
        case 'level':
          return userStats.level >= value;
        case 'achievement':
          return userStats.achievements.some(a => a.id === value && a.isUnlocked);
        default:
          return false;
      }
    });
  }

  /**
   * Get music templates for preview
   */
  getMusicTemplates() {
    return this.musicTemplates;
  }

  /**
   * Generate a preview sample for a voice persona
   */
  generatePreviewSample(voicePersona, userName) {
    const samples = {
      'soft-singer': `🌅 Good morning ${userName}, beautiful soul 🌅\nTime to greet the world with grace\nYour dreams are calling softly\nLet's start at a gentle pace 🌅`,
      'hype-mc': `Yo ${userName}! Time to rise!\nNo more sleeping, no compromise!\nYour goals are waiting, don't you see?\nLet's get moving, 1-2-3!`,
      'comedic-jester': `🎪 Wake up, wake up, ${userName} dear! 🎪\nThe circus of life is starting here! (da da da)\nJuggle your dreams and chase your goals (tra la la)\nTime to play your starring role! (ta-da!) 🎪`,
      'pop-diva': `✨ ${userName}, you're a superstar! ✨\nShining bright like who you are!\nToday's your stage, time to perform!\nBreak through barriers, break the norm! ✨`,
      'nigerian-aunty': `Eh ${userName}! My dear child!\nTime to wake up, don't be wild!\nYour mama raised a champion, you see?\nNow get up and let your light shine free! 💃`
    };

    return samples[voicePersona] || samples['soft-singer'];
  }
}

export default SingingService;