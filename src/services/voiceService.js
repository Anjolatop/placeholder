import * as Speech from 'expo-speech';
import * as Audio from 'expo-av';

class VoiceService {
  constructor() {
    this.isPlaying = false;
    this.currentSound = null;
    this.voiceQueue = [];
    this.isProcessing = false;
  }

  // Get voice configuration based on persona
  getVoiceConfig(persona) {
    const voiceConfigs = {
      'nigerian-aunty': {
        language: 'en-NG',
        pitch: 1.2,
        rate: 0.9,
        voice: 'com.apple.ttsbundle.siri_female_en-NG_compact'
      },
      'wise-elder': {
        language: 'en-GB',
        pitch: 0.8,
        rate: 0.7,
        voice: 'com.apple.ttsbundle.Daniel-compact'
      },
      'zen-monk': {
        language: 'ja-JP',
        pitch: 0.9,
        rate: 0.6,
        voice: 'com.apple.ttsbundle.Kyoko-compact'
      },
      'study-buddy': {
        language: 'en-US',
        pitch: 1.1,
        rate: 1.0,
        voice: 'com.apple.ttsbundle.Samantha-compact'
      },
      'fitness-coach': {
        language: 'en-AU',
        pitch: 1.3,
        rate: 1.1,
        voice: 'com.apple.ttsbundle.Karen-compact'
      },
      'chef-inspiration': {
        language: 'it-IT',
        pitch: 1.0,
        rate: 0.8,
        voice: 'com.apple.ttsbundle.Alice-compact'
      },
      'tech-enthusiast': {
        language: 'en-US',
        pitch: 1.2,
        rate: 1.2,
        voice: 'com.apple.ttsbundle.Alex-compact'
      },
      'nature-guide': {
        language: 'en-US',
        pitch: 0.9,
        rate: 0.7,
        voice: 'com.apple.ttsbundle.Victoria-compact'
      }
    };

    return voiceConfigs[persona] || voiceConfigs['nigerian-aunty'];
  }

  // Get available voices
  async getAvailableVoices() {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('🎤 Available voices:', voices.length);
      return voices;
    } catch (error) {
      console.log('❌ Error getting voices:', error);
      return [];
    }
  }

  // Speak text with persona-specific configuration
  async speakWithPersona(text, persona, options = {}) {
    if (this.isPlaying) {
      console.log('🔇 Voice already playing, queuing message...');
      this.voiceQueue.push({ text, persona, options });
      return;
    }

    try {
      this.isPlaying = true;
      const voiceConfig = this.getVoiceConfig(persona);
      
      // Apply tone-based modifications
      const toneModifications = this.getToneModifications(options.tone);
      
      const speechOptions = {
        language: voiceConfig.language,
        pitch: voiceConfig.pitch * toneModifications.pitch,
        rate: voiceConfig.rate * toneModifications.rate,
        volume: options.volume || 0.8,
        onStart: () => {
          console.log(`🎤 Started speaking: "${text}"`);
          console.log(`👤 Persona: ${persona}`);
          console.log(`🎭 Config: ${voiceConfig.language}, pitch: ${speechOptions.pitch}, rate: ${speechOptions.rate}`);
        },
        onDone: () => {
          console.log(`✅ Finished speaking: "${text}"`);
          this.isPlaying = false;
          this.processQueue();
        },
        onError: (error) => {
          console.log(`❌ Speech error:`, error);
          this.isPlaying = false;
          this.processQueue();
        }
      };

      // Try to use specific voice if available
      try {
        const voices = await this.getAvailableVoices();
        const matchingVoice = voices.find(v => v.identifier === voiceConfig.voice);
        if (matchingVoice) {
          speechOptions.voice = voiceConfig.voice;
        }
      } catch (error) {
        console.log('⚠️ Using default voice configuration');
      }

      await Speech.speak(text, speechOptions);
      
    } catch (error) {
      console.log('❌ Error in speakWithPersona:', error);
      this.isPlaying = false;
      this.processQueue();
    }
  }

  // Get tone-based voice modifications
  getToneModifications(tone) {
    const modifications = {
      'savage': {
        pitch: 1.3,
        rate: 1.2
      },
      'motivational': {
        pitch: 1.1,
        rate: 1.0
      },
      'gentle': {
        pitch: 0.8,
        rate: 0.7
      },
      'delicate': {
        pitch: 0.7,
        rate: 0.6
      },
      'mid-delicate': {
        pitch: 0.9,
        rate: 0.8
      }
    };

    return modifications[tone] || modifications['motivational'];
  }

  // Process voice queue
  async processQueue() {
    if (this.voiceQueue.length > 0 && !this.isPlaying) {
      const nextVoice = this.voiceQueue.shift();
      await this.speakWithPersona(nextVoice.text, nextVoice.persona, nextVoice.options);
    }
  }

  // Stop current speech
  async stop() {
    try {
      await Speech.stop();
      this.isPlaying = false;
      this.voiceQueue = [];
      console.log('🔇 Speech stopped');
    } catch (error) {
      console.log('❌ Error stopping speech:', error);
    }
  }

  // Check if speech is supported
  async isSupported() {
    try {
      const available = await Speech.isAvailableAsync();
      console.log('🎤 Speech supported:', available);
      return available;
    } catch (error) {
      console.log('❌ Error checking speech support:', error);
      return false;
    }
  }

  // Play alarm with AI voice
  async playAlarmVoice(message, persona, tone, volume = 0.8) {
    try {
      // Add alarm-specific audio effects
      await this.playAlarmSound();
      
      // Speak the message
      await this.speakWithPersona(message, persona, {
        tone,
        volume,
        alarm: true
      });
      
    } catch (error) {
      console.log('❌ Error playing alarm voice:', error);
    }
  }

  // Play alarm sound effect
  async playAlarmSound() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/alarm-sound.mp3'), // You'll need to add this file
        { shouldPlay: true, volume: 0.3 }
      );
      
      this.currentSound = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
      
    } catch (error) {
      console.log('⚠️ No alarm sound file found, continuing with voice only');
    }
  }

  // Test voice with different personas
  async testVoice(persona, message, tone = 'motivational') {
    console.log(`🧪 Testing voice for ${persona}: "${message}"`);
    
    const isSupported = await this.isSupported();
    if (!isSupported) {
      console.log('❌ Speech not supported on this device');
      return false;
    }

    await this.speakWithPersona(message, persona, { tone, volume: 0.8 });
    return true;
  }

  // Get voice status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      queueLength: this.voiceQueue.length,
      currentSound: this.currentSound ? 'Playing' : 'None'
    };
  }
}

export default new VoiceService(); 