import { AIGenerationRequest, AIGenerationResponse, VoiceMessage, SongStructure } from '../types';
import SingingService from './singingService';

class AIVoiceService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.elevenLabsKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
    this.elevenLabsUrl = 'https://api.elevenlabs.io/v1';
    this.singingService = new SingingService();
  }

  /**
   * Generate personalized wake-up message using GPT-4 with singing capabilities
   */
  async generateWakeUpMessage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      // Check if user wants singing or if behavioral triggers suggest it
      const shouldSing = this.shouldGenerateSong(request);
      
      if (shouldSing) {
        return await this.generateSingingMessage(request);
      } else {
        return await this.generateSpokenMessage(request);
      }
    } catch (error) {
      console.error('Error generating wake-up message:', error);
      return this.getFallbackMessage(request);
    }
  }

  /**
   * Generate spoken wake-up message
   */
  async generateSpokenMessage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const prompt = this.buildSpokenPrompt(request);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(request.userProfile.preferredTone)
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.8,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
      }

      const content = data.choices[0].message.content;
      return this.parseAIResponse(content, request);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generate singing wake-up message using the singing service
   */
  async generateSingingMessage(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const songData = await this.singingService.generateSong(
        request.userProfile,
        request.alarm,
        request.context
      );

      return {
        content: songData.content,
        tone: request.alarm.tone || request.userProfile.preferredTone,
        type: 'sung',
        style: songData.voicePersona,
        estimatedDuration: this.estimateSongDuration(songData.content),
        emotion: this.determineSongEmotion(songData.musicStyle),
        songStructure: songData.songStructure,
        shouldTriggerChallenge: songData.shouldTriggerChallenge
      };
    } catch (error) {
      console.error('Error generating singing message:', error);
      // Fallback to spoken message if singing fails
      return await this.generateSpokenMessage(request);
    }
  }

  /**
   * Determine if a song should be generated based on user preferences and context
   */
  shouldGenerateSong(request: AIGenerationRequest): boolean {
    const { userProfile, alarm, context } = request;
    
    // User explicitly wants singing
    if (userProfile.wakeStylePreference === 'sung' || alarm.includeSinging) {
      return true;
    }

    // Mixed preference - use some logic to decide
    if (userProfile.wakeStylePreference === 'mixed') {
      // Sing more often for special occasions or behavioral triggers
      if (context.snoozeCount >= 2) return true; // Intervention song
      if (context.consecutiveSkips >= 2) return true; // Guilt trip song
      if ([0, 6].includes(context.dayOfWeek)) return true; // Weekend vibes
      
      // Random chance for mixed users
      return Math.random() > 0.6;
    }

    // Behavioral triggers that override spoken preference
    if (context.snoozeCount >= 3) return true; // Dramatic intervention
    if (context.recentBehavior === 'skip-prone') return true; // Special motivation

    return false;
  }

  /**
   * Build the prompt for spoken message AI generation
   */
  buildSpokenPrompt(request: AIGenerationRequest): string {
    const { userProfile, alarm, context } = request;
    const timeOfDay = this.getTimeOfDay(new Date());
    const dayOfWeek = new Date().getDay();
    
    return `
Generate a personalized wake-up message for ${userProfile.name}.

User Profile:
- Name: ${userProfile.name}
- Preferred Tone: ${userProfile.preferredTone}
- Hobbies: ${userProfile.hobbies.join(', ')}
- Goals: ${userProfile.personalGoals.join(', ')}
- Wake Style: ${userProfile.wakeStylePreference}

Alarm Details:
- Purpose: ${alarm.purpose}
- Label: ${alarm.label}
- Tone: ${alarm.tone}

Context:
- Time of Day: ${timeOfDay}
- Day of Week: ${this.getDayName(dayOfWeek)}
- Snooze Count: ${context.snoozeCount}
- Previous Messages: ${context.previousMessages.length}

Requirements:
1. Keep the message between 20-40 seconds when spoken
2. Match the user's preferred tone (${userProfile.preferredTone})
3. Include their name and alarm purpose
4. Reference their hobbies or goals
5. Be motivational but appropriate for the tone
6. If snooze count > 2, make it more persistent/funny
7. If it's a singing message, include musical notation or style direction

Format the response as:
CONTENT: [the actual message]
TYPE: [spoken/sung/mixed]
STYLE: [specific style like "pop-diva", "rap", "lullaby", etc.]
EMOTION: [encouraging/sarcastic/funny/gentle/hype]
    `;
  }

  /**
   * Get system prompt based on tone preference
   */
  getSystemPrompt(tone: string): string {
    const prompts = {
      'delicate': `You are a gentle, caring wake-up companion. Use soft, encouraging language with warm humor. Be supportive and understanding, like a caring friend or family member.`,
      'mid-delicate': `You are a balanced wake-up companion. Use a mix of encouragement and light humor. Be motivating but not too harsh, like a supportive coach or mentor.`,
      'savage': `You are a sassy, no-nonsense wake-up companion. Use humor, sarcasm, and playful roasts. Be funny and direct, like a witty friend who tells it like it is.`
    };
    
    return prompts[tone] || prompts['mid-delicate'];
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(content: string, request: AIGenerationRequest): AIGenerationResponse {
    const lines = content.split('\n');
    let parsedContent = '';
    let type = 'spoken';
    let style = 'default';
    let emotion = 'encouraging';

    for (const line of lines) {
      if (line.startsWith('CONTENT:')) {
        parsedContent = line.replace('CONTENT:', '').trim();
      } else if (line.startsWith('TYPE:')) {
        type = line.replace('TYPE:', '').trim() as any;
      } else if (line.startsWith('STYLE:')) {
        style = line.replace('STYLE:', '').trim();
      } else if (line.startsWith('EMOTION:')) {
        emotion = line.replace('EMOTION:', '').trim() as any;
      }
    }

    return {
      content: parsedContent || content,
      tone: request.userProfile.preferredTone,
      type: type as any,
      style,
      estimatedDuration: this.estimateDuration(parsedContent),
      emotion: emotion as any,
    };
  }

  /**
   * Generate voice audio using ElevenLabs
   */
  async generateVoiceAudio(message: VoiceMessage, voiceId: string): Promise<string> {
    try {
      const response = await fetch(`${this.elevenLabsUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsKey,
        },
        body: JSON.stringify({
          text: message.content,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating voice audio:', error);
      throw error;
    }
  }

  /**
   * Generate singing voice using specialized models
   */
  async generateSingingVoice(message: VoiceMessage, style: string): Promise<string> {
    // This would integrate with Bark, DiffSinger, or Voicemod APIs
    // For now, return a placeholder
    console.log(`Generating singing voice for style: ${style}`);
    return 'placeholder_singing_audio_url';
  }

  /**
   * Get fallback message if AI generation fails
   */
  getFallbackMessage(request: AIGenerationRequest): AIGenerationResponse {
    const { userProfile, alarm } = request;
    const fallbackMessages = {
      'delicate': `Good morning, ${userProfile.name}. It's time to start your day. You have great things ahead of you.`,
      'mid-delicate': `Hey ${userProfile.name}, time to get up! Your ${alarm.purpose} is waiting for you.`,
      'savage': `Alright ${userProfile.name}, enough sleeping. Time to adult and tackle that ${alarm.purpose}.`
    };

    return {
      content: fallbackMessages[userProfile.preferredTone],
      tone: userProfile.preferredTone,
      type: 'spoken',
      style: 'default',
      estimatedDuration: 15,
      emotion: 'encouraging',
      shouldTriggerChallenge: request.context.snoozeCount >= 3
    };
  }

  /**
   * Estimate duration of song content
   */
  estimateSongDuration(songContent: string): number {
    // Songs typically take longer than spoken content due to melody and rhythm
    const baseWordCount = songContent.split(' ').length;
    const estimatedSeconds = Math.max(20, Math.min(45, baseWordCount * 1.5)); // 1.5 seconds per word for singing
    return estimatedSeconds;
  }

  /**
   * Determine emotion based on music style
   */
  determineSongEmotion(musicStyle: string): 'encouraging' | 'sarcastic' | 'funny' | 'gentle' | 'hype' {
    const emotionMap = {
      'gentle-lullaby': 'gentle',
      'pop-anthem': 'encouraging', 
      'rap-hype': 'hype',
      'comedic-jingle': 'funny',
      'r&b-smooth': 'encouraging',
      'nursery-remix': 'funny',
      'dramatic-song': 'sarcastic',
      'guilt-trip-song': 'sarcastic',
      'victory-jingle': 'hype'
    };

    return emotionMap[musicStyle] || 'encouraging';
  }

  /**
   * Estimate duration of spoken content
   */
  estimateDuration(content: string): number {
    const wordsPerMinute = 150;
    const words = content.split(' ').length;
    return Math.ceil((words / wordsPerMinute) * 60);
  }

  /**
   * Get time of day
   */
  getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'noon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  /**
   * Get day name
   */
  getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  /**
   * Generate challenge mode message
   */
  async generateChallengeMessage(userName: string, objectToFind: string): Promise<string> {
    const prompt = `
Generate a funny challenge message for ${userName} who needs to find a ${objectToFind}.

Requirements:
- Be humorous and engaging
- Mention the object they need to find
- Give them a time limit
- Make it sound like a game
- Keep it under 30 seconds when spoken

Format: Just return the message text.
    `;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a fun, engaging wake-up challenge creator.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      return `Okay ${userName}, no more snoozing! I need you to take a picture of your ${objectToFind}. You have 60 seconds. No cheating!`;
    }
  }
}

export default new AIVoiceService(); 