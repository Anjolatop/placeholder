import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import VoiceService from '../services/voiceService';

export default function VoiceScreen() {
  const [selectedPersona, setSelectedPersona] = useState('nigerian-aunty');
  const [toneLevel, setToneLevel] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voiceMessages: true,
    singingMessages: true,
    challengeMode: false,
    volumeLevel: 80
  });
  const [speechSupported, setSpeechSupported] = useState(false);

  // Check speech support on component mount
  useEffect(() => {
    checkSpeechSupport();
  }, []);

  const checkSpeechSupport = async () => {
    const supported = await VoiceService.isSupported();
    setSpeechSupported(supported);
    console.log('🎤 Speech support checked:', supported);
  };

  const personas = [
    {
      id: 'nigerian-aunty',
      icon: '💃',
      name: 'Nigerian Aunty',
      desc: 'Sassy & Motivational',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Nigerian',
        speed: 'medium',
        pitch: 'high',
        personality: 'sassy',
        emotionalRange: 'high',
        energyLevel: 'very high',
        culturalFlavor: 'Nigerian Pidgin English'
      },
      messages: {
        spoken: [
          "My dear, it's time to wake up! The world is waiting for your greatness! 🌟",
          "Abeg, stop sleeping like a baby! Your dreams won't chase themselves! 💪",
          "My pikin, the sun is already shining! Time to shine too! ✨",
          "Wake up, my love! God has given you another beautiful day! 🙏",
          "Chai! You still dey sleep? The day don start o! Make we go hustle! 💼",
          "My darling, your future is calling! Answer the call with style! 👑",
          "Abeg, wake up jare! Your success story is waiting to be written! 📚"
        ],
        singing: [
          "🎵 Rise and shine, my beautiful one! The day is calling your name! 🎵",
          "🎵 Wake up, wake up, it's a brand new day! Time to make it count! 🎵",
          "🎵 My darling, the birds are singing for you! Join the melody! 🎵",
          "🎵 Oh my pikin, the morning is here! Let's dance with the sun! 🎵"
        ]
      }
    },
    {
      id: 'wise-elder',
      icon: '🧙',
      name: 'Wise Elder',
      desc: 'Calm & Wise',
      scale: new Animated.Value(1),
      voice: {
        accent: 'British',
        speed: 'slow',
        pitch: 'low',
        personality: 'wise',
        emotionalRange: 'moderate',
        energyLevel: 'calm',
        culturalFlavor: 'Ancient Wisdom'
      },
      messages: {
        spoken: [
          "Greetings, young one. The dawn has arrived, and with it, new opportunities await. 🌅",
          "In the stillness of morning, we find our greatest strength. Rise with purpose. 🧘",
          "Each sunrise is a gift, a chance to write a new chapter in your story. 📖",
          "The early hours belong to those who seek wisdom. Begin your journey. 🗝️",
          "Listen to the whispers of dawn, they carry messages of hope and renewal. 🌸",
          "The path to greatness begins with a single step into the morning light. 🛤️",
          "Ancient wisdom tells us: the early bird catches not just worms, but dreams. 🦅"
        ],
        singing: [
          "🎵 The morning light brings wisdom bright, embrace this sacred time... 🎵",
          "🎵 In quiet moments, truth is found, let peace guide your way... 🎵",
          "🎵 Ancient wisdom flows like water, let it nourish your soul... 🎵",
          "🎵 The dawn of wisdom breaks, let knowledge light your path... 🎵"
        ]
      }
    },
    {
      id: 'zen-monk',
      icon: '🧘',
      name: 'Zen Monk',
      desc: 'Peaceful & Gentle',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Japanese',
        speed: 'very slow',
        pitch: 'medium',
        personality: 'peaceful',
        emotionalRange: 'low',
        energyLevel: 'serene',
        culturalFlavor: 'Zen Buddhism'
      },
      messages: {
        spoken: [
          "Breathe in the morning air, let peace fill your being. 🌸",
          "The gentle light awakens not just the body, but the spirit within. 🕊️",
          "In this moment of awakening, find your center and inner calm. ☮️",
          "Let go of yesterday's worries, embrace today's possibilities. 🍃",
          "The morning bell rings softly, calling you to mindfulness. 🔔",
          "In the space between sleep and wakefulness, find your true self. 🌅",
          "Each breath is a new beginning, each moment a fresh start. 🫁"
        ],
        singing: [
          "🎵 Om mani padme hum, the morning bell calls... 🎵",
          "🎵 Peace flows like a river, let it carry you gently... 🎵",
          "🎵 In silence we find strength, in stillness we find peace... 🎵",
          "🎵 The lotus blooms at dawn, awakening the soul within... 🎵"
        ]
      }
    },
    {
      id: 'study-buddy',
      icon: '🤓',
      name: 'Study Buddy',
      desc: 'Nerdy & Encouraging',
      scale: new Animated.Value(1),
      voice: {
        accent: 'American',
        speed: 'fast',
        pitch: 'medium-high',
        personality: 'enthusiastic',
        emotionalRange: 'high',
        energyLevel: 'high',
        culturalFlavor: 'Academic Excellence'
      },
      messages: {
        spoken: [
          "Good morning, fellow knowledge seeker! Ready to conquer today's challenges? 📚",
          "The brain is most active in the morning! Let's optimize your learning potential! 🧠",
          "Rise and shine, it's time to expand your mind and crush your goals! 🎯",
          "Every morning is a new opportunity to level up your skills! 🚀",
          "The early bird gets the worm, but the early student gets the A+! 🏆",
          "Time to activate your genius mode! The world needs your brilliance! 💡",
          "Let's turn this morning into a productivity masterpiece! 🎨"
        ],
        singing: [
          "🎵 Wake up, wake up, it's study time! Knowledge is power! 🎵",
          "🎵 The morning brain is a learning machine! Let's get smart! 🎵",
          "🎵 Rise and shine, it's time to define your academic destiny! 🎵",
          "🎵 Every sunrise brings new wisdom, let's chase it together! 🎵"
        ]
      }
    },
    {
      id: 'fitness-coach',
      icon: '💪',
      name: 'Fitness Coach',
      desc: 'Energetic & Motivational',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Australian',
        speed: 'fast',
        pitch: 'high',
        personality: 'energetic',
        emotionalRange: 'very high',
        energyLevel: 'explosive',
        culturalFlavor: 'Fitness Culture'
      },
      messages: {
        spoken: [
          "Rise and grind, champion! Your body is ready to dominate today! 💪",
          "Good morning, warrior! Time to crush those fitness goals! 🏋️",
          "The early bird gets the gains! Let's make today count! 🎯",
          "Wake up, sleepyhead! Your muscles are calling for action! 🔥",
          "Time to turn up the heat! Your workout is waiting! ⚡",
          "Rise and shine, it's time to make your body proud! 🏆",
          "Let's get this bread and those gains! Morning workout time! 🥖💪"
        ],
        singing: [
          "🎵 Wake up, wake up, it's time to pump! Let's get those gains! 🎵",
          "🎵 Rise and shine, it's workout time! Your body is a temple! 🎵",
          "🎵 The morning sweat is the best sweat! Let's make it happen! 🎵",
          "🎵 Every rep counts, every day matters! Let's crush it! 🎵"
        ]
      }
    },
    {
      id: 'chef-inspiration',
      icon: '👨‍🍳',
      name: 'Chef Inspiration',
      desc: 'Passionate & Creative',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Italian',
        speed: 'medium',
        pitch: 'medium',
        personality: 'passionate',
        emotionalRange: 'high',
        energyLevel: 'warm',
        culturalFlavor: 'Culinary Arts'
      },
      messages: {
        spoken: [
          "Buongiorno! The kitchen is calling, and creativity awaits! 👨‍🍳",
          "Good morning, my culinary artist! Time to create something delicious! 🍳",
          "Rise and shine, it's time to cook up some magic! ✨",
          "The morning is perfect for experimenting with new flavors! 🌶️",
          "Wake up, chef! Your taste buds are ready for adventure! 🍽️",
          "Let's turn this morning into a culinary masterpiece! 🎨",
          "The best dishes start with the best morning energy! 🔥"
        ],
        singing: [
          "🎵 Wake up, wake up, it's cooking time! Let's make it delicious! 🎵",
          "🎵 The morning kitchen is alive with possibilities! 🎵",
          "🎵 Rise and shine, it's time to create culinary magic! 🎵",
          "🎵 Every ingredient tells a story, let's write a delicious one! 🎵"
        ]
      }
    },
    {
      id: 'tech-enthusiast',
      icon: '🤖',
      name: 'Tech Enthusiast',
      desc: 'Innovative & Futuristic',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Silicon Valley',
        speed: 'very fast',
        pitch: 'medium-high',
        personality: 'innovative',
        emotionalRange: 'moderate',
        energyLevel: 'high',
        culturalFlavor: 'Tech Innovation'
      },
      messages: {
        spoken: [
          "System boot sequence initiated! Time to optimize your day! 🤖",
          "Good morning, human! Ready to disrupt your routine? 💻",
          "Wake up, it's time to code your way to success! ⌨️",
          "The future is now! Let's build something amazing today! 🚀",
          "Rise and shine, it's time to iterate on your life! 🔄",
          "Good morning, innovator! Ready to change the world? 🌍",
          "Time to debug your morning and optimize for success! 🐛"
        ],
        singing: [
          "🎵 Wake up, wake up, it's innovation time! Let's build the future! 🎵",
          "🎵 The morning code is the best code! Let's create something epic! 🎵",
          "🎵 Rise and shine, it's time to disrupt the status quo! 🎵",
          "🎵 Every line of code is a step toward the future! 🎵"
        ]
      }
    },
    {
      id: 'nature-guide',
      icon: '🌿',
      name: 'Nature Guide',
      desc: 'Organic & Grounded',
      scale: new Animated.Value(1),
      voice: {
        accent: 'Pacific Northwest',
        speed: 'slow',
        pitch: 'low',
        personality: 'grounded',
        emotionalRange: 'natural',
        energyLevel: 'steady',
        culturalFlavor: 'Environmental Awareness'
      },
      messages: {
        spoken: [
          "The forest is waking up, and so should you! 🌲",
          "Good morning, earth child! The birds are singing your name! 🐦",
          "Rise with the sun, let nature guide your day! ☀️",
          "The morning dew holds ancient wisdom, breathe it in! 💧",
          "Wake up, wild one! The mountains are calling! 🏔️",
          "Let the morning breeze carry away your worries! 🌬️",
          "The earth is alive with possibility, join the dance! 🌍"
        ],
        singing: [
          "🎵 Wake up, wake up, the forest is calling! Let's explore! 🎵",
          "🎵 The morning birds are singing, join their chorus! 🎵",
          "🎵 Rise and shine, it's time to connect with nature! 🎵",
          "🎵 Every sunrise is a gift from Mother Earth! 🎵"
        ]
      }
    }
  ];

  const handlePersonaSelect = (personaId) => {
    setSelectedPersona(personaId);
    
    // Animate the selection
    personas.forEach(persona => {
      if (persona.id === personaId) {
        Animated.sequence([
          Animated.timing(persona.scale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(persona.scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  };

  const handleToneChange = (newTone) => {
    setToneLevel(newTone);
  };

  const handleSliderPress = (event) => {
    // This would need to be implemented with proper slider library
    // For now, we'll use the buttons for tone adjustment
  };

  const simulateVoiceSynthesis = async (persona, message, type) => {
    if (!speechSupported) {
      Alert.alert('Speech Not Supported', 'Text-to-speech is not supported on this device.');
      return;
    }

    setIsPlaying(true);
    
    // Enhanced voice synthesis with emotional intelligence
    const voiceConfig = persona.voice;
    const tone = getToneLabel(toneLevel);
    
    // Calculate dynamic voice characteristics based on persona and tone
    const emotionalIntensity = calculateEmotionalIntensity(persona, tone);
    const voiceModulation = calculateVoiceModulation(persona, tone);
    const culturalExpression = getCulturalExpression(persona);
    
    console.log(`🎤 Playing ${type} message:`);
    console.log(`👤 Persona: ${persona.name}`);
    console.log(`🎭 Voice: ${voiceConfig.accent} accent, ${voiceConfig.speed} speed, ${voiceConfig.pitch} pitch`);
    console.log(`🎨 Tone: ${tone}`);
    console.log(`💫 Emotional Intensity: ${emotionalIntensity}`);
    console.log(`🎵 Voice Modulation: ${voiceModulation}`);
    console.log(`🌍 Cultural Expression: ${culturalExpression}`);
    console.log(`📝 Message: "${message}"`);
    console.log(`🔊 Adjust volume to ${voiceSettings.volumeLevel}%`);
    
    try {
      // Use real text-to-speech with persona-specific configuration
      await VoiceService.speakWithPersona(message, persona.id, {
        tone: tone,
        volume: voiceSettings.volumeLevel / 100
      });
      
      console.log(`✨ Voice synthesis complete!`);
      console.log(`🎯 Emotional resonance: ${emotionalIntensity}%`);
      console.log(`🎪 Cultural authenticity: ${culturalExpression}%`);
      
      // Enhanced alert with more details
      Alert.alert(
        '🎤 Voice Synthesis Complete',
        `"${message}"\n\n👤 ${persona.name}\n🎭 ${voiceConfig.accent} accent\n🎨 ${tone} tone\n💫 ${emotionalIntensity}% emotional intensity\n🌍 ${culturalExpression}% cultural authenticity\n🔊 Volume: ${voiceSettings.volumeLevel}%`,
        [{ text: 'Amazing! ✨' }]
      );
    } catch (error) {
      console.error('Voice synthesis failed:', error);
      Alert.alert('Voice Synthesis Error', 'Failed to play voice message. Please check your settings.');
    } finally {
      setIsPlaying(false);
    }
  };

  // Helper functions for enhanced voice synthesis
  const calculateEmotionalIntensity = (persona, tone) => {
    const baseIntensity = {
      'nigerian-aunty': 85,
      'wise-elder': 60,
      'zen-monk': 40,
      'study-buddy': 75,
      'fitness-coach': 95,
      'chef-inspiration': 80,
      'tech-enthusiast': 70,
      'nature-guide': 55
    };
    
    const toneMultiplier = {
      'Delicate': 0.7,
      'Mid-Delicate': 1.0,
      'Savage': 1.3
    };
    
    return Math.round(baseIntensity[persona.id] * toneMultiplier[tone]);
  };

  const calculateVoiceModulation = (persona, tone) => {
    const modulationTypes = {
      'nigerian-aunty': 'Rhythmic & Expressive',
      'wise-elder': 'Measured & Contemplative',
      'zen-monk': 'Smooth & Flowing',
      'study-buddy': 'Energetic & Clear',
      'fitness-coach': 'Dynamic & Powerful',
      'chef-inspiration': 'Warm & Melodic',
      'tech-enthusiast': 'Precise & Fast',
      'nature-guide': 'Organic & Natural'
    };
    
    return modulationTypes[persona.id];
  };

  const getCulturalExpression = (persona) => {
    const culturalScores = {
      'nigerian-aunty': 95,
      'wise-elder': 90,
      'zen-monk': 85,
      'study-buddy': 70,
      'fitness-coach': 80,
      'chef-inspiration': 85,
      'tech-enthusiast': 75,
      'nature-guide': 90
    };
    
    return culturalScores[persona.id];
  };

  const handleTestVoice = (type) => {
    const persona = personas.find(p => p.id === selectedPersona);
    const messages = persona.messages[type.toLowerCase()];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (isPlaying) {
      Alert.alert('Voice Playing', 'Please wait for the current voice to finish playing.');
      return;
    }
    
    Alert.alert(
      'Voice Test',
      `Test ${type} voice with ${persona.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Play Sample', 
          onPress: () => simulateVoiceSynthesis(persona, randomMessage, type)
        }
      ]
    );
  };

  const handlePersonaVoiceTest = async (persona) => {
    if (!speechSupported) {
      Alert.alert('Speech Not Supported', 'Text-to-speech is not supported on this device.');
      return;
    }

    const messages = persona.messages.spoken;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (isPlaying) {
      Alert.alert('Voice Playing', 'Please wait for the current voice to finish playing.');
      return;
    }
    
    try {
      setIsPlaying(true);
      await VoiceService.speakWithPersona(randomMessage, persona.id, {
        tone: getToneLabel(toneLevel),
        volume: voiceSettings.volumeLevel / 100
      });
    } catch (error) {
      console.error('Persona voice test failed:', error);
      Alert.alert('Voice Test Error', 'Failed to play voice message.');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSettingToggle = (setting) => {
    setVoiceSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleVolumeChange = () => {
    Alert.alert(
      'Volume Settings',
      'Adjust volume level?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Adjust', onPress: () => console.log('Adjust volume') }
      ]
    );
  };

  const getToneLabel = (level) => {
    if (level < 30) return 'Delicate';
    if (level < 70) return 'Mid-Delicate';
    return 'Savage';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Voice</Text>
        <Text style={styles.subtitle}>Customize your wake-up experience</Text>
      </View>

      {/* Voice Status Indicator */}
      <View style={styles.voiceStatusCard}>
        <View style={styles.voiceStatusHeader}>
          <Text style={styles.voiceStatusTitle}>🎤 Voice System Status</Text>
          <View style={[styles.statusIndicator, { backgroundColor: speechSupported ? '#4CAF50' : '#F44336' }]}>
            <Text style={styles.statusText}>{speechSupported ? 'ONLINE' : 'OFFLINE'}</Text>
          </View>
        </View>
        <Text style={styles.voiceStatusDesc}>
          {speechSupported 
            ? 'Text-to-speech is ready to play your personalized voice messages!'
            : 'Text-to-speech is not supported on this device. Voice features will be limited.'
          }
        </Text>
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <Text style={styles.playingText}>🔊 Playing voice sample...</Text>
          </View>
        )}
      </View>

      {/* Voice Persona Selection */}
      <View style={styles.personaCard}>
        <Text style={styles.cardTitle}>🎭 Voice Persona</Text>
        <Text style={styles.cardSubtitle}>Choose your wake-up personality</Text>
        <View style={styles.personaList}>
          {personas.map((persona) => (
            <Animated.View key={persona.id} style={{ transform: [{ scale: persona.scale }] }}>
              <TouchableOpacity 
                style={[
                  styles.personaItem,
                  selectedPersona === persona.id && styles.selectedPersona
                ]}
                onPress={() => handlePersonaSelect(persona.id)}
                activeOpacity={0.8}
              >
                <View style={styles.personaContent}>
                  <View style={styles.personaLeft}>
                    <Text style={styles.personaIcon}>{persona.icon}</Text>
                    <View style={styles.personaText}>
                      <Text style={styles.personaName}>{persona.name}</Text>
                      <Text style={styles.personaDesc}>{persona.desc}</Text>
                      <Text style={styles.personaVoice}>
                        {persona.voice.accent} • {persona.voice.speed} • {persona.voice.pitch}
                      </Text>
                      <Text style={styles.personaCharacteristics}>
                        💫 {persona.voice.emotionalRange} • ⚡ {persona.voice.energyLevel} • 🌍 {persona.voice.culturalFlavor}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.personaActions}>
                    {selectedPersona === persona.id && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedCheck}>✓</Text>
                      </View>
                    )}
                    <TouchableOpacity 
                      style={[
                        styles.voiceTestButton,
                        isPlaying && styles.voiceTestButtonDisabled
                      ]}
                      onPress={() => handlePersonaVoiceTest(persona)}
                      disabled={isPlaying}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.voiceTestButtonText}>
                        {isPlaying ? '🔊' : '🎤'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Tone Settings */}
      <View style={styles.toneCard}>
        <Text style={styles.cardTitle}>🎨 Tone Preference</Text>
        <Text style={styles.cardSubtitle}>Adjust the intensity of your wake-up messages</Text>
        <View style={styles.toneSlider}>
          <View style={styles.toneLabels}>
            <Text style={styles.toneLabel}>Delicate</Text>
            <Text style={styles.toneLabel}>Mid-Delicate</Text>
            <Text style={styles.toneLabel}>Savage</Text>
          </View>
          <TouchableOpacity 
            style={styles.sliderTrack}
            onPress={(event) => {
              // Calculate position based on touch
              const { locationX } = event.nativeEvent;
              const trackWidth = 250; // Approximate track width
              const percentage = Math.max(0, Math.min(100, (locationX / trackWidth) * 100));
              setToneLevel(Math.round(percentage));
            }}
            activeOpacity={1}
          >
            <View style={[styles.sliderFill, { width: `${toneLevel}%` }]} />
            <View style={[styles.sliderThumb, { left: `${toneLevel}%` }]} />
          </TouchableOpacity>
          <Text style={styles.currentTone}>{getToneLabel(toneLevel)}</Text>
          <View style={styles.toneButtons}>
            <TouchableOpacity 
              style={[
                styles.toneButton,
                toneLevel <= 30 && styles.activeToneButton
              ]}
              onPress={() => handleToneChange(20)}
            >
              <Text style={[
                styles.toneButtonText,
                toneLevel <= 30 && styles.activeToneButtonText
              ]}>Gentle</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toneButton,
                toneLevel > 30 && toneLevel <= 70 && styles.activeToneButton
              ]}
              onPress={() => handleToneChange(60)}
            >
              <Text style={[
                styles.toneButtonText,
                toneLevel > 30 && toneLevel <= 70 && styles.activeToneButtonText
              ]}>Balanced</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toneButton,
                toneLevel > 70 && styles.activeToneButton
              ]}
              onPress={() => handleToneChange(90)}
            >
              <Text style={[
                styles.toneButtonText,
                toneLevel > 70 && styles.activeToneButtonText
              ]}>Intense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Voice Test */}
      <View style={styles.testCard}>
        <Text style={styles.cardTitle}>🎵 Test Your Voice</Text>
        <Text style={styles.cardSubtitle}>Preview how your wake-up messages will sound</Text>
        {isPlaying && (
          <View style={styles.playingIndicator}>
            <Text style={styles.playingText}>🔊 Playing voice sample...</Text>
          </View>
        )}
        <View style={styles.testButtons}>
          <TouchableOpacity 
            style={[
              styles.testButton,
              isPlaying && styles.testButtonDisabled
            ]}
            onPress={() => handleTestVoice('Spoken')}
            disabled={isPlaying}
            activeOpacity={0.7}
          >
            <View style={styles.testButtonContent}>
              <Text style={styles.testButtonIcon}>🎤</Text>
              <Text style={styles.testButtonText}>Test Spoken</Text>
              <Text style={styles.testButtonSubtext}>Regular messages</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.testButton,
              isPlaying && styles.testButtonDisabled
            ]}
            onPress={() => handleTestVoice('Singing')}
            disabled={isPlaying}
            activeOpacity={0.7}
          >
            <View style={styles.testButtonContent}>
              <Text style={styles.testButtonIcon}>🎵</Text>
              <Text style={styles.testButtonText}>Test Singing</Text>
              <Text style={styles.testButtonSubtext}>Musical messages</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>⚙️ Voice Settings</Text>
        <Text style={styles.cardSubtitle}>Customize your voice experience</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingToggle('voiceMessages')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Voice Messages</Text>
            <Text style={styles.settingDescription}>Enable spoken wake-up messages</Text>
          </View>
          <View style={styles.toggleSwitch}>
            <View style={[
              styles.toggleThumb, 
              voiceSettings.voiceMessages && styles.toggleActive
            ]} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingToggle('singingMessages')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Singing Messages</Text>
            <Text style={styles.settingDescription}>Enable musical wake-up messages</Text>
          </View>
          <View style={styles.toggleSwitch}>
            <View style={[
              styles.toggleThumb, 
              voiceSettings.singingMessages && styles.toggleActive
            ]} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => handleSettingToggle('challengeMode')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Challenge Mode</Text>
            <Text style={styles.settingDescription}>Extra motivation for tough mornings</Text>
          </View>
          <View style={styles.toggleSwitch}>
            <View style={[
              styles.toggleThumb, 
              voiceSettings.challengeMode && styles.toggleActive
            ]} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleVolumeChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Volume Level</Text>
            <Text style={styles.settingDescription}>Adjust message volume</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{voiceSettings.volumeLevel}%</Text>
            <Text style={styles.settingArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* AI Voice Features */}
      <View style={styles.aiFeaturesCard}>
        <Text style={styles.cardTitle}>🤖 AI Voice Features</Text>
        <Text style={styles.cardSubtitle}>Advanced voice synthesis with emotional intelligence</Text>
        
        <View style={styles.aiFeatureGrid}>
          <View style={styles.aiFeature}>
            <Text style={styles.aiFeatureIcon}>💫</Text>
            <Text style={styles.aiFeatureTitle}>Emotional Intelligence</Text>
            <Text style={styles.aiFeatureDesc}>Dynamic emotional intensity based on persona and tone</Text>
          </View>
          
          <View style={styles.aiFeature}>
            <Text style={styles.aiFeatureIcon}>🎵</Text>
            <Text style={styles.aiFeatureTitle}>Voice Modulation</Text>
            <Text style={styles.aiFeatureDesc}>Persona-specific voice characteristics and patterns</Text>
          </View>
          
          <View style={styles.aiFeature}>
            <Text style={styles.aiFeatureIcon}>🌍</Text>
            <Text style={styles.aiFeatureTitle}>Cultural Expression</Text>
            <Text style={styles.aiFeatureDesc}>Authentic cultural accents and expressions</Text>
          </View>
          
          <View style={styles.aiFeature}>
            <Text style={styles.aiFeatureIcon}>🎯</Text>
            <Text style={styles.aiFeatureTitle}>Tone Adaptation</Text>
            <Text style={styles.aiFeatureDesc}>Messages adapt to your preferred intensity level</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.aiDemoButton}
          onPress={() => {
            const persona = personas.find(p => p.id === selectedPersona);
            const emotionalIntensity = calculateEmotionalIntensity(persona, getToneLabel(toneLevel));
            const culturalExpression = getCulturalExpression(persona);
            
            Alert.alert(
              '🤖 AI Voice Analysis',
              `Current Voice Profile:\n\n👤 ${persona.name}\n💫 Emotional Intensity: ${emotionalIntensity}%\n🌍 Cultural Expression: ${culturalExpression}%\n🎵 Voice Modulation: ${calculateVoiceModulation(persona, getToneLabel(toneLevel))}\n🎨 Tone: ${getToneLabel(toneLevel)}\n\nThis persona will deliver messages with authentic cultural expression and dynamic emotional resonance.`,
              [{ text: 'Amazing! ✨' }]
            );
          }}
        >
          <Text style={styles.aiDemoButtonText}>🔍 Analyze Current Voice Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Sample Messages */}
      <View style={styles.sampleCard}>
        <Text style={styles.cardTitle}>💬 Sample Messages</Text>
        <Text style={styles.cardSubtitle}>Preview of your personalized wake-up messages</Text>
        {personas.map((persona) => (
          <View key={persona.id} style={styles.messageItem}>
            <Text style={styles.messageText}>
              "{persona.messages.spoken[0]}"
            </Text>
            <View style={styles.messageMeta}>
              <Text style={styles.messageType}>{getToneLabel(toneLevel)}</Text>
              <Text style={styles.messagePersona}>{persona.name} ({persona.voice.accent})</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>🎤 Voice Customization Complete</Text>
          <Text style={styles.footerSubtext}>Your wake-up experience is now personalized</Text>
        </View>
        <View style={styles.footerStats}>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatNumber}>8</Text>
            <Text style={styles.footerStatLabel}>Personas</Text>
          </View>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatNumber}>3</Text>
            <Text style={styles.footerStatLabel}>Tone Levels</Text>
          </View>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatNumber}>4</Text>
            <Text style={styles.footerStatLabel}>AI Features</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  header: {
    backgroundColor: '#55786f',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#f2d1d1',
  },
  personaCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 15,
  },
  personaList: {
    // Vertical list layout
  },
  personaItem: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  personaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  personaText: {
    flex: 1,
  },
  personaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  personaDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  personaVoice: {
    fontSize: 11,
    color: '#55786f',
    fontStyle: 'italic',
    marginTop: 2,
  },
  personaCharacteristics: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  personaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceTestButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e07a5f',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  voiceTestButtonDisabled: {
    backgroundColor: '#ccc',
  },
  voiceTestButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  selectedPersona: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#55786f',
    shadowColor: '#55786f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#55786f',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  selectedCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toneCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  toneLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toneLabel: {
    fontSize: 12,
    color: '#666',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    position: 'relative',
    marginBottom: 10,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#55786f',
    borderRadius: 8,
  },
  currentTone: {
    fontSize: 14,
    color: '#55786f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  testButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#e07a5f',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  testButtonContent: {
    alignItems: 'center',
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  playingIndicator: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  playingText: {
    color: '#55786f',
    fontSize: 14,
    fontWeight: '500',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  testDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#55786f',
    fontWeight: 'bold',
  },
  toggleSwitch: {
    width: 50,
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    position: 'relative',
  },
  toggleThumb: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: '#55786f',
    left: 28,
  },
  sampleCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  messageItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  messageType: {
    fontSize: 12,
    color: '#55786f',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 4,
    backgroundColor: '#55786f',
    borderRadius: 2,
    width: '60%',
  },
  toneButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  toneButton: {
    backgroundColor: '#f2d1d1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  toneButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  activeToneButton: {
    backgroundColor: '#55786f',
  },
  activeToneButtonText: {
    color: '#ffffff',
  },
  testButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  testButtonSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePersona: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  footerContent: {
    alignItems: 'center',
    marginBottom: 15,
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  footerStat: {
    alignItems: 'center',
  },
  footerStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#55786f',
  },
  footerStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  aiFeaturesCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiFeatureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  aiFeature: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  aiFeatureIcon: {
    fontSize: 36,
    marginBottom: 10,
    color: '#55786f',
  },
  aiFeatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  aiFeatureDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  aiDemoButton: {
    backgroundColor: '#55786f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  aiDemoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voiceStatusCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  voiceStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  voiceStatusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55786f',
  },
  statusIndicator: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  voiceStatusDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 15,
  },
}); 