import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

// API keys should be stored in environment variables or secure storage
// For development, you can set these in your environment or use placeholder values
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
const GITHUB_AI_ENDPOINT = 'https://models.github.ai/inference';
const MODEL = 'openai/gpt-4.1';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_ELEVENLABS_API_KEY_HERE';
const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam voice - more reliable
const ELEVENLABS_ENDPOINT = 'https://api.elevenlabs.io/v1';

class AIVoiceService {
  constructor() {
    this.userProfile = null;
    this.alarmHistory = new Map(); // Track snooze count per alarm
    this.currentSound = null;
  }

  // Initialize the service and load user profile
  async initialize() {
    await this.loadUserProfile();
  }

  // Load user profile from storage
  async loadUserProfile() {
    try {
      const profileJson = await AsyncStorage.getItem('userProfile');
      this.userProfile = profileJson ? JSON.parse(profileJson) : {};
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.userProfile = {};
    }
  }

  // Generate wake-up message using GitHub AI
  async generateWakeUpMessage(alarmData, snoozeCount = 0) {
    try {
      await this.loadUserProfile(); // Refresh profile data

      const {
        purpose: alarmLabel,
        useWakeUpVoice,
        includeSinging
      } = alarmData;

      // If user has snoozed 3+ times, force singing mode
      const shouldSing = includeSinging || snoozeCount >= 3;

      if (shouldSing) {
        return await this.generateSingingMessage(alarmData, snoozeCount);
      } else {
        return await this.generateSpokenMessage(alarmData, snoozeCount);
      }
    } catch (error) {
      console.error('Error generating AI message:', error);
      // Return fallback message immediately if AI fails
      return this.getFallbackMessage(alarmData, snoozeCount);
    }
  }

  // Generate spoken wake-up message
  async generateSpokenMessage(alarmData, snoozeCount) {
    const prompt = this.buildSpokenPrompt(alarmData, snoozeCount);
    
    console.log('🤖 SPOKEN PROMPT SENT TO AI:');
    console.log('='.repeat(50));
    console.log(prompt);
    console.log('='.repeat(50));
    
    const response = await fetch(`${GITHUB_AI_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a personalized wake-up assistant. Generate engaging, motivational wake-up messages that match the user\'s tone preference and personality.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        top_p: 1.0,
        model: MODEL
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    console.log('🤖 AI RESPONSE (SPOKEN):');
    console.log(aiResponse);
    
    return aiResponse;
  }

  // Generate singing wake-up message
  async generateSingingMessage(alarmData, snoozeCount) {
    const prompt = this.buildSingingPrompt(alarmData, snoozeCount);
    
    console.log('🎵 SINGING PROMPT SENT TO AI:');
    console.log('='.repeat(50));
    console.log(prompt);
    console.log('='.repeat(50));
    
    const response = await fetch(`${GITHUB_AI_ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a creative songwriter. Generate fun, catchy wake-up songs that match the user\'s tone preference and personality.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        top_p: 1.0,
        model: MODEL
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    console.log('🎵 AI RESPONSE (SINGING):');
    console.log(aiResponse);
    
    return aiResponse;
  }

  // Convert text to speech using ElevenLabs
  async textToSpeech(text, isSinging = false) {
    try {
      console.log('🎤 Converting to speech with ElevenLabs:', text.substring(0, 50) + '...');
      
      const response = await fetch(`${ELEVENLABS_ENDPOINT}/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: isSinging ? 0.3 : 0.5,
            similarity_boost: isSinging ? 0.7 : 0.5,
            style: isSinging ? 0.8 : 0.3,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('ElevenLabs API response:', errorData);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorData}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      if (audioBuffer === null) {
        console.log('❌ ElevenLabs failed, using system speech as fallback');
        // Fallback to system speech
        const { Speech } = await import('expo-speech');
        await Speech.speak(text, {
          language: 'en',
          pitch: isSinging ? 1.2 : 1.0,
          rate: isSinging ? 0.8 : 0.9,
        });
        return null;
      }

      return audioBuffer;
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      console.log('❌ ElevenLabs failed, using system speech as fallback');
      
      try {
        const { Speech } = await import('expo-speech');
        await Speech.speak(text, {
          language: 'en',
          pitch: isSinging ? 1.2 : 1.0,
          rate: isSinging ? 0.8 : 0.9,
        });
      } catch (speechError) {
        console.error('❌ Fallback speech error:', speechError);
      }
      
      return null;
    }
  }

  // Play audio from buffer
  async playAudio(audioBuffer) {
    try {
      if (!audioBuffer) {
        console.log('🎤 No audio buffer to play');
        return;
      }

      // Stop any currently playing audio
      await this.stopAudio();

      // Convert ArrayBuffer to base64
      const base64Audio = this.arrayBufferToBase64(audioBuffer);
      
      // Create audio URI
      const audioUri = `data:audio/mpeg;base64,${base64Audio}`;
      
      // Load and play audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true, volume: 1.0 }
      );
      
      this.currentSound = sound;
      
      // Set up playback status monitoring
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('🎤 AI message spoken successfully');
        }
      });
      
      await sound.playAsync();
      
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  // Save audio buffer to file (for debugging)
  async saveAudioToFile(audioBuffer) {
    try {
      const base64Audio = this.arrayBufferToBase64(audioBuffer);
      const fileName = `ai_voice_${Date.now()}.mp3`;
      
      // In a real app, you'd save this to the device's file system
      console.log(`🎵 Audio saved as ${fileName} (base64 length: ${base64Audio.length})`);
      
      return fileName;
    } catch (error) {
      console.error('Error saving audio file:', error);
      return null;
    }
  }

  // Convert ArrayBuffer to base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Stop current audio playback
  async stopAudio() {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      this.currentSound = null;
    }
  }

  // Build prompt for spoken messages
  buildSpokenPrompt(alarmData, snoozeCount) {
    const {
      purpose: alarmLabel,
      useWakeUpVoice
    } = alarmData;

    const user = this.userProfile?.name || 'User';
    const tone = this.userProfile?.tone || 'mid-delicate';
    const goals = this.userProfile?.goals || 'No specific goals set';
    const hobbies = this.userProfile?.hobbies || 'No hobbies specified';

    let toneInstruction = '';
    switch (tone) {
      case 'delicate':
        toneInstruction = 'Use a gentle, encouraging tone with soft language.';
        break;
      case 'mid-delicate':
        toneInstruction = 'Use a balanced tone with some humor and encouragement.';
        break;
      case 'savage':
        toneInstruction = 'Use a bold, sassy tone with humor and attitude.';
        break;
      default:
        toneInstruction = 'Use a balanced, encouraging tone.';
    }

    return `Create a personalized, 20-30 second wake-up message for a user based on their profile:

Name: ${user}
Tone: ${tone} (choose from: delicate, mid-delicate, savage)
Alarm label (reason for waking): '${alarmLabel}'
Personal goals: ${goals}
Hobbies or favorite interests: ${hobbies}
Snooze count: ${snoozeCount} times

Instructions:
${toneInstruction}
Keep it conversational and natural, approximately 2-3 sentences.
Include their name and reference their alarm reason.
Optionally mention their goals or hobbies if relevant.
Make it engaging and motivational.
Add relevant emojis for personality, but keep them minimal.

The message should feel personal and motivating, encouraging them to get out of bed for their specific reason.`;
  }

  // Build prompt for singing messages
  buildSingingPrompt(alarmData, snoozeCount) {
    const {
      purpose: alarmLabel,
      useWakeUpVoice
    } = alarmData;

    const user = this.userProfile?.name || 'User';
    const tone = this.userProfile?.tone || 'mid-delicate';
    const goals = this.userProfile?.goals || 'No specific goals set';
    const hobbies = this.userProfile?.hobbies || 'No hobbies specified';

    let styleInstruction = '';
    switch (tone) {
      case 'delicate':
        styleInstruction = 'soft melody, uplifting, calm';
        break;
      case 'mid-delicate':
        styleInstruction = 'clever, teasing, supportive';
        break;
      case 'savage':
        styleInstruction = 'energetic, sassy, comedic, bold';
        break;
      default:
        styleInstruction = 'balanced, encouraging, fun';
    }

    return `Create a personalized, 30-second rhyming wake-up song for a user based on their profile:
Name: ${user}
Tone: ${tone} (choose from: delicate, mid-delicate, savage)
Alarm label (reason for waking): '${alarmLabel}'
Personal goals: ${goals}
Hobbies or favorite interests: ${hobbies}
Optional: Gender/pronouns: Not specified
Snooze count: ${snoozeCount} times

Instructions:
The output should be a short lyrical song or jingle, formatted in stanzas.
Keep it rhythmic and rhyming, approximately 4–8 lines to fill 25–35 seconds when sung.
Style and vibe should match the user's tone:
Delicate: soft melody, uplifting, calm
Mid-Delicate: clever, teasing, supportive
Savage: energetic, sassy, comedic, bold
Include references to the user's goal and alarm reason.
Optionally reflect their hobby in the style (e.g., pop star vibes if they like Beyoncé, anime if they like manga, etc.).
Add relevant emojis for flair, but no spoken narration—only lyrics.`;
  }

  // Get fallback message when AI fails
  getFallbackMessage(alarmData, snoozeCount) {
    const { purpose: alarmLabel } = alarmData;
    const user = this.userProfile?.name || 'User';
    
    if (snoozeCount >= 3) {
      return `🎵 Rise and shine, ${user}! Your ${alarmLabel} is calling! 🎵`;
    } else {
      return `Good morning, ${user}! Time to wake up for ${alarmLabel}! 🌅`;
    }
  }

  // Track snooze count for specific alarms
  incrementSnoozeCount(alarmId) {
    const currentCount = this.alarmHistory.get(alarmId) || 0;
    this.alarmHistory.set(alarmId, currentCount + 1);
    console.log(`⏰ Current snooze count: ${currentCount + 1}`);
  }

  getSnoozeCount(alarmId) {
    return this.alarmHistory.get(alarmId) || 0;
  }

  resetSnoozeCount(alarmId) {
    this.alarmHistory.delete(alarmId);
  }

  // Get user profile for external use
  getUserProfile() {
    return this.userProfile || {};
  }
}

export default new AIVoiceService(); 