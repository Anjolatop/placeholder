import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AIVoiceService from './aiVoiceService';

class VoiceService {
  constructor() {
    this.isInitialized = false;
    this.currentSound = null;
    this.isPlaying = false;
    this.voicePersonas = [];
    this.defaultVoiceId = 'default-voice-id';
  }

  async initialize() {
    try {
      // Load voice personas
      await this.loadVoicePersonas();
      
      // Initialize audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      this.isInitialized = true;
      console.log('VoiceService initialized successfully');
    } catch (error) {
      console.error('Error initializing VoiceService:', error);
    }
  }

  async loadVoicePersonas() {
    try {
      const personasData = await AsyncStorage.getItem('voicePersonas');
      if (personasData) {
        this.voicePersonas = JSON.parse(personasData);
      } else {
        // Initialize with default personas
        this.voicePersonas = this.getDefaultPersonas();
        await AsyncStorage.setItem('voicePersonas', JSON.stringify(this.voicePersonas));
      }
    } catch (error) {
      console.error('Error loading voice personas:', error);
      this.voicePersonas = this.getDefaultPersonas();
    }
  }

  getDefaultPersonas() {
    return [
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
      {
        id: 'nigerian-aunty',
        name: 'Nigerian Aunty',
        description: 'Warm, caring voice with Nigerian accent',
        tone: 'delicate',
        style: 'nigerian-aunty',
        voiceId: 'aunty-voice-id',
        isUnlocked: false,
        isDefault: false,
      },
      {
        id: 'wise-elder',
        name: 'Wise Elder',
        description: 'Calm, wise voice for gentle guidance',
        tone: 'delicate',
        style: 'wise-elder',
        voiceId: 'elder-voice-id',
        isUnlocked: false,
        isDefault: false,
      },
      {
        id: 'comedic-jester',
        name: 'Comedic Jester',
        description: 'Funny, playful voice for humor',
        tone: 'savage',
        style: 'comedic-jester',
        voiceId: 'jester-voice-id',
        isUnlocked: false,
        isDefault: false,
      },
    ];
  }

  async speakText(text, options = {}) {
    try {
      const {
        voice = 'en-US',
        rate = 0.8,
        pitch = 1.0,
        volume = 1.0,
        onStart,
        onDone,
        onError,
      } = options;

      const speechOptions = {
        language: voice,
        pitch: pitch,
        rate: rate,
        volume: volume,
      };

      if (onStart) onStart();

      await Speech.speak(text, speechOptions);

      // Listen for speech completion
      Speech.addEventListener('onSpeechStart', () => {
        this.isPlaying = true;
        if (onStart) onStart();
      });

      Speech.addEventListener('onSpeechEnd', () => {
        this.isPlaying = false;
        if (onDone) onDone();
      });

      Speech.addEventListener('onSpeechError', (error) => {
        this.isPlaying = false;
        console.error('Speech error:', error);
        if (onError) onError(error);
      });

    } catch (error) {
      console.error('Error speaking text:', error);
      if (options.onError) options.onError(error);
    }
  }

  async playVoiceMessage(message, personaId) {
    try {
      // Stop any currently playing audio
      await this.stopAudio();

      // Get voice persona
      const persona = personaId 
        ? this.voicePersonas.find(p => p.id === personaId)
        : this.voicePersonas.find(p => p.isDefault);

      if (!persona) {
        throw new Error('No voice persona found');
      }

      // Generate audio using AI service
      const audioUrl = await AIVoiceService.generateVoiceAudio(message, persona.voiceId);

      // Play the audio
      await this.playAudio(audioUrl);

    } catch (error) {
      console.error('Error playing voice message:', error);
      
      // Fallback to text-to-speech
      await this.speakText(message.content, {
        voice: 'en-US',
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
      });
    }
  }

  async playAudio(audioUrl) {
    try {
      // Create sound object
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      this.currentSound = sound;

      // Set up audio status updates
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          this.isPlaying = status.isPlaying;
          
          if (status.didJustFinish) {
            this.isPlaying = false;
            this.currentSound = null;
          }
        }
      });

      // Play the sound
      await sound.playAsync();

    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  async stopAudio() {
    try {
      if (this.currentSound) {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
        this.currentSound = null;
      }
      
      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async pauseAudio() {
    try {
      if (this.currentSound && this.isPlaying) {
        await this.currentSound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }

  async resumeAudio() {
    try {
      if (this.currentSound && !this.isPlaying) {
        await this.currentSound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Error resuming audio:', error);
    }
  }

  async playSingingVoice(message, style) {
    try {
      // Generate singing voice using specialized models
      const audioUrl = await AIVoiceService.generateSingingVoice(message, style);
      
      // Play the singing audio
      await this.playAudio(audioUrl);
      
    } catch (error) {
      console.error('Error playing singing voice:', error);
      
      // Fallback to regular speech
      await this.speakText(message.content, {
        voice: 'en-US',
        rate: 0.7, // Slower for singing-like effect
        pitch: 1.1, // Slightly higher pitch
        volume: 1.0,
      });
    }
  }

  async previewVoicePersona(persona, sampleText) {
    try {
      const message = {
        id: 'preview',
        alarmId: 'preview',
        type: 'spoken',
        content: sampleText,
        tone: persona.tone,
        duration: 0,
        createdAt: new Date(),
      };

      await this.playVoiceMessage(message, persona.id);
      
    } catch (error) {
      console.error('Error previewing voice persona:', error);
      
      // Fallback to text-to-speech
      await this.speakText(sampleText, {
        voice: 'en-US',
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0,
      });
    }
  }

  async unlockVoicePersona(personaId) {
    try {
      const persona = this.voicePersonas.find(p => p.id === personaId);
      if (persona) {
        persona.isUnlocked = true;
        await AsyncStorage.setItem('voicePersonas', JSON.stringify(this.voicePersonas));
        console.log(`Voice persona unlocked: ${persona.name}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unlocking voice persona:', error);
      return false;
    }
  }

  getVoicePersonas() {
    return this.voicePersonas;
  }

  getUnlockedPersonas() {
    return this.voicePersonas.filter(p => p.isUnlocked);
  }

  getPersonaById(personaId) {
    return this.voicePersonas.find(p => p.id === personaId);
  }

  getPersonasByTone(tone) {
    return this.voicePersonas.filter(p => p.tone === tone && p.isUnlocked);
  }

  // Getter methods
  isInitialized() {
    return this.isInitialized;
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
  }

  getCurrentSound() {
    return this.currentSound;
  }

  // Test methods
  async testVoiceGeneration(text) {
    try {
      const message = {
        id: 'test',
        alarmId: 'test',
        type: 'spoken',
        content: text,
        tone: 'mid-delicate',
        duration: 0,
        createdAt: new Date(),
      };

      await this.playVoiceMessage(message);
      return true;
    } catch (error) {
      console.error('Error testing voice generation:', error);
      return false;
    }
  }

  async testSingingGeneration(text, style = 'pop-diva') {
    try {
      const message = {
        id: 'test-singing',
        alarmId: 'test',
        type: 'sung',
        content: text,
        tone: 'mid-delicate',
        duration: 0,
        createdAt: new Date(),
      };

      await this.playSingingVoice(message, style);
      return true;
    } catch (error) {
      console.error('Error testing singing generation:', error);
      return false;
    }
  }
}

export default new VoiceService(); 