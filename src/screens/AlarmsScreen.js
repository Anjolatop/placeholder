import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, TextInput, Modal } from 'react-native';
import VoiceService from '../services/voiceService';

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState([
    {
      id: 1,
      time: '7:00 AM',
      label: 'Gym Session',
      days: 'Mon, Wed, Fri',
      active: true,
      scale: new Animated.Value(1),
      morningGoal: 'stretching',
      aiVoiceEnabled: true,
      ringCount: 0
    },
    {
      id: 2,
      time: '8:30 AM',
      label: 'Work',
      days: 'Mon - Fri',
      active: false,
      scale: new Animated.Value(1),
      morningGoal: 'studying',
      aiVoiceEnabled: true,
      ringCount: 0
    },
    {
      id: 3,
      time: '9:00 AM',
      label: 'Weekend',
      days: 'Sat, Sun',
      active: true,
      scale: new Animated.Value(1),
      morningGoal: 'running',
      aiVoiceEnabled: true,
      ringCount: 0
    }
  ]);

  const [settings, setSettings] = useState({
    snoozeDuration: '5 minutes',
    maxSnoozes: '3 times',
    voiceMessages: 'Enabled',
    aiVoiceTone: 'savage'
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [newAlarm, setNewAlarm] = useState({
    time: '7:00 AM',
    label: '',
    days: 'Mon - Fri',
    morningGoal: 'stretching',
    aiVoiceEnabled: true
  });

  // Quick settings modal states
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [showMaxSnoozesModal, setShowMaxSnoozesModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showToneModal, setShowToneModal] = useState(false);

  // Individual day options for better selection
  const individualDays = [
    { key: 'mon', label: 'Mon', selected: false },
    { key: 'tue', label: 'Tue', selected: false },
    { key: 'wed', label: 'Wed', selected: false },
    { key: 'thu', label: 'Thu', selected: false },
    { key: 'fri', label: 'Fri', selected: false },
    { key: 'sat', label: 'Sat', selected: false },
    { key: 'sun', label: 'Sun', selected: false }
  ];

  const [selectedDays, setSelectedDays] = useState({
    mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false
  });

  // Morning goals options
  const morningGoals = [
    { id: 'stretching', label: 'Stretching', icon: '🧘', desc: 'Gentle morning stretches' },
    { id: 'running', label: 'Running', icon: '🏃', desc: 'Cardio workout' },
    { id: 'studying', label: 'Studying', icon: '📚', desc: 'Academic focus' },
    { id: 'gym', label: 'Gym Workout', icon: '💪', desc: 'Strength training' },
    { id: 'meditation', label: 'Meditation', icon: '🧘‍♀️', desc: 'Mindfulness practice' },
    { id: 'cooking', label: 'Cooking', icon: '👨‍🍳', desc: 'Healthy breakfast prep' },
    { id: 'reading', label: 'Reading', icon: '📖', desc: 'Personal development' },
    { id: 'planning', label: 'Planning', icon: '📝', desc: 'Day organization' }
  ];

  // AI Voice Messages based on goals and tone with persona integration
  const generateAIVoiceMessage = (goal, tone, ringCount) => {
    const goalData = morningGoals.find(g => g.id === goal);
    const goalName = goalData ? goalData.label : goal;
    
    const toneIntensity = Math.min(ringCount, 7); // Max 7 levels of intensity
    const volumeLevel = Math.min(ringCount, 7);
    
    // Enhanced voice personas for AI alarm messages
    const aiPersonas = {
      'nigerian-aunty': {
        accent: 'Nigerian',
        emotionalIntensity: 85,
        culturalFlavor: 'Nigerian Pidgin English',
        messages: {
          savage: {
            stretching: [
              "Chai! You still dey sleep? Your body don dey call you for stretches! Wake up now! 💪",
              "Abeg, stop sleeping like baby! Your muscles don dey cry for attention! STRETCH NOW! 🔥",
              "My pikin, you dey waste time! Your flexibility don dey disappear! WAKE UP! ⚡",
              "Abeg, wake up jare! Your body don dey beg for those stretches! MOVE NOW! 💥",
              "Chai! You still dey snooze? Your muscles don dey get stiff! GET UP! 🚀",
              "My dear, stop sleeping! Your stretching routine don dey call your name! NOW! ⚡",
              "Abeg, wake up now! Your body don dey need those stretches! DON'T IGNORE! 🔥"
            ],
            running: [
              "Chai! Your running shoes don dey wait for you! Get out there now! 🏃‍♂️",
              "Abeg, stop sleeping! The road don dey call your name! RUN NOW! 💨",
              "My pikin, you dey miss your run! Hit the pavement now! ⚡",
              "Abeg, wake up! Your cardio don dey suffer! GET RUNNING! 🔥",
              "Chai! Your morning run don dey slip away! GO NOW! 🚀",
              "My dear, your running goals don dey fade! GET UP! 💥",
              "Abeg, get out of bed! Your running routine don dey need you! NOW! ⚡"
            ]
          },
          motivational: {
            stretching: [
              "Good morning, my pikin! Time to wake up and give your body love with stretches! 🌟",
              "Rise and shine, my dear! Your body don ready for amazing morning stretches! ✨",
              "Wake up, beautiful! Let's start the day with energizing stretches! 💫",
              "Good morning! Your flexibility journey don start with these stretches! 🌅",
              "Time to wake up! Your body go thank you for these wonderful stretches! 🙏",
              "Rise and shine! Let's make today amazing with morning stretches! 🌟",
              "Wake up, champion! Your stretching routine don dey wait for you! ⭐"
            ]
          }
        }
      },
      'fitness-coach': {
        accent: 'Australian',
        emotionalIntensity: 95,
        culturalFlavor: 'Fitness Culture',
        messages: {
          savage: {
            gym: [
              "Rise and grind, champion! Your body don ready to dominate today! 💪",
              "Wake up, warrior! Time to crush those fitness goals! 🏋️",
              "The early bird gets the gains! Let's make today count! 🎯",
              "Wake up, sleepyhead! Your muscles don dey call for action! 🔥",
              "Time to turn up the heat! Your workout don dey wait! ⚡",
              "Rise and shine! Time to make your body proud! 🏆",
              "Let's get this bread and those gains! Morning workout time! 🥖💪"
            ]
          }
        }
      },
      'wise-elder': {
        accent: 'British',
        emotionalIntensity: 60,
        culturalFlavor: 'Ancient Wisdom',
        messages: {
          gentle: {
            meditation: [
              "Greetings, young one. The dawn has arrived, and with it, new opportunities await. 🌅",
              "In the stillness of morning, we find our greatest strength. Rise with purpose. 🧘",
              "Each sunrise is a gift, a chance to write a new chapter in your story. 📖",
              "The early hours belong to those who seek wisdom. Begin your journey. 🗝️",
              "Listen to the whispers of dawn, they carry messages of hope and renewal. 🌸",
              "The path to greatness begins with a single step into the morning light. 🛤️",
              "Ancient wisdom tells us: the early bird catches not just worms, but dreams. 🦅"
            ]
          }
        }
      }
    };
    
    // Select persona based on goal and tone
    let selectedPersona = 'nigerian-aunty'; // Default
    if (goal === 'gym' && tone === 'savage') selectedPersona = 'fitness-coach';
    if (goal === 'meditation' && tone === 'gentle') selectedPersona = 'wise-elder';
    
    const persona = aiPersonas[selectedPersona];
    const personaMessages = persona?.messages?.[tone]?.[goal];
    
    // Fallback to original messages if persona-specific messages not found
    const messages = personaMessages || {
      savage: {
        stretching: [
          "WAKE UP! Your body is BEGGING for those stretches! Get moving NOW! 💪",
          "STOP BEING LAZY! Your muscles are screaming for attention! STRETCH! 🔥",
          "YOU'RE WASTING TIME! Get up and stretch like your life depends on it! ⚡",
          "ENOUGH SLEEPING! Your flexibility is disappearing! STRETCH NOW! 💥",
          "WAKE UP, LAZY BONES! Your body needs those stretches RIGHT NOW! 🚀",
          "STOP SNOOZING! Your muscles are getting stiffer by the minute! MOVE! ⚡",
          "GET UP NOW! Your stretching routine is calling your name! DON'T IGNORE IT! 🔥"
        ],
        running: [
          "WAKE UP! Your running shoes are waiting! Get out there NOW! 🏃‍♂️",
          "STOP SLEEPING! The road is calling your name! RUN! 💨",
          "YOU'RE MISSING YOUR RUN! Get up and hit the pavement! NOW! ⚡",
          "ENOUGH EXCUSES! Your cardio is suffering! GET RUNNING! 🔥",
          "WAKE UP, RUNNER! Your morning run is slipping away! GO! 🚀",
          "STOP SNOOZING! Your running goals are fading! GET UP! 💥",
          "GET OUT OF BED! Your running routine needs you! NOW! ⚡"
        ],
        studying: [
          "WAKE UP! Your brain is ready to learn! Study NOW! 📚",
          "STOP SLEEPING! Knowledge is waiting! Get studying! 🧠",
          "YOU'RE WASTING STUDY TIME! Get up and learn! NOW! ⚡",
          "ENOUGH PROCRASTINATION! Your grades need attention! STUDY! 🔥",
          "WAKE UP, STUDENT! Your academic goals are calling! LEARN! 📖",
          "STOP SNOOZING! Your future self needs you to study! NOW! 💥",
          "GET UP AND STUDY! Your brain is at peak performance! USE IT! ⚡"
        ],
        gym: [
          "WAKE UP! The gym is waiting for you! Get lifting! 💪",
          "STOP SLEEPING! Your gains are disappearing! WORKOUT! 🔥",
          "YOU'RE MISSING GAINS! Get to the gym NOW! ⚡",
          "ENOUGH LAZINESS! Your muscles need stimulation! LIFT! 💥",
          "WAKE UP, BEAST! Your workout is calling! GET STRONG! 🚀",
          "STOP SNOOZING! Your fitness goals need you! NOW! ⚡",
          "GET UP AND LIFT! Your body transformation starts NOW! 🔥"
        ]
      },
      motivational: {
        stretching: [
          "Good morning! Time to wake up and give your body the love it deserves with some gentle stretches! 🌟",
          "Rise and shine! Your body is ready for those amazing morning stretches! ✨",
          "Wake up, beautiful! Let's start the day with some energizing stretches! 💫",
          "Good morning! Your flexibility journey starts with these morning stretches! 🌅",
          "Time to wake up! Your body will thank you for these wonderful stretches! 🙏",
          "Rise and shine! Let's make today amazing with some morning stretches! 🌟",
          "Wake up, champion! Your stretching routine is waiting to energize you! ⭐"
        ],
        running: [
          "Good morning! Your running adventure awaits! Let's make today amazing! 🏃‍♀️",
          "Rise and shine! The road is calling your name for an incredible run! 🌟",
          "Wake up, runner! Today's run is going to be absolutely fantastic! ✨",
          "Good morning! Your cardio goals are within reach! Let's run! 💫",
          "Time to wake up! Your running routine is ready to energize you! 🚀",
          "Rise and shine! Your morning run is going to be incredible! 🌅",
          "Wake up, athlete! Your running journey continues today! ⭐"
        ],
        studying: [
          "Good morning! Your brilliant mind is ready to learn amazing things! 📚",
          "Rise and shine! Knowledge is power and you're about to gain more! 🧠",
          "Wake up, scholar! Your academic journey is going to be incredible! ✨",
          "Good morning! Your brain is at peak performance for learning! 🌟",
          "Time to wake up! Your study session is going to be productive! 💫",
          "Rise and shine! Your knowledge quest continues today! 📖",
          "Wake up, genius! Your learning adventure awaits! ⭐"
        ],
        gym: [
          "Good morning! Your strength training session is going to be incredible! 💪",
          "Rise and shine! Your muscles are ready for an amazing workout! 🔥",
          "Wake up, warrior! Your gym session is going to be powerful! ⚡",
          "Good morning! Your fitness journey continues with today's workout! 🌟",
          "Time to wake up! Your body transformation is in progress! 💫",
          "Rise and shine! Your strength goals are within reach! 🚀",
          "Wake up, champion! Your workout is going to be legendary! ⭐"
        ]
      },
      gentle: {
        stretching: [
          "Good morning, sweet one. Time to wake up gently and stretch your beautiful body... 🌸",
          "Rise softly, dear. Your body is ready for some gentle morning stretches... ✨",
          "Wake up peacefully. Let's start the day with some soothing stretches... 🕊️",
          "Good morning, love. Your flexibility journey begins with gentle care... 🌅",
          "Time to wake up softly. Your body will feel wonderful after these stretches... 🙏",
          "Rise gently, beautiful. Your morning stretches are waiting to nurture you... 🌟",
          "Wake up with love. Your stretching routine is here to care for you... 💕"
        ],
        running: [
          "Good morning, dear runner. Your peaceful run awaits... 🏃‍♀️",
          "Rise softly, sweet one. The road is ready for your gentle stride... 🌸",
          "Wake up softly, love. Today's run will be peaceful and refreshing... ✨",
          "Good morning, beautiful. Your running journey continues with grace... 🕊️",
          "Time to wake up gently. Your morning run will be soothing... 🌅",
          "Rise softly, dear. Your running routine is here to nurture you... 💕",
          "Wake up with peace. Your run today will be gentle and loving... 🌟"
        ],
        studying: [
          "Good morning, dear student. Your learning journey continues with love... 📚",
          "Rise gently, sweet one. Knowledge awaits with gentle guidance... 🧠",
          "Wake up softly, love. Your study session will be peaceful... ✨",
          "Good morning, beautiful. Your academic growth continues gently... 🌸",
          "Time to wake up softly. Your learning will be nurturing... 🕊️",
          "Rise with care, dear. Your knowledge quest continues with love... 📖",
          "Wake up gently, sweet one. Your learning adventure awaits... 💕"
        ],
        gym: [
          "Good morning, dear one. Your gentle workout awaits... 💪",
          "Rise softly, love. Your strength training will be caring... 🌸",
          "Wake up gently, sweet one. Your gym session will be nurturing... ✨",
          "Good morning, beautiful. Your fitness journey continues with love... 🕊️",
          "Time to wake up softly. Your workout will be gentle and caring... 🌅",
          "Rise with peace, dear. Your strength goals are within gentle reach... 💕",
          "Wake up lovingly, sweet one. Your workout is here to care for you... 🌟"
        ]
      }
    };
    
    const messageArray = messages[tone]?.[goal] || messages.savage.stretching;
    const messageIndex = Math.min(toneIntensity - 1, messageArray.length - 1);
    const message = messageArray[messageIndex];
    
    // Enhanced voice characteristics
    const voiceCharacteristics = {
      persona: selectedPersona,
      accent: persona?.accent || 'Standard',
      emotionalIntensity: persona?.emotionalIntensity || 70,
      culturalFlavor: persona?.culturalFlavor || 'Universal',
      volume: Math.min(50 + (volumeLevel * 10), 100), // 50-100% volume
      intensity: toneIntensity,
      haptics: toneIntensity > 3 // Enable haptics for higher intensity
    };
    
    return {
      message,
      volume: voiceCharacteristics.volume,
      intensity: voiceCharacteristics.intensity,
      haptics: voiceCharacteristics.haptics,
      persona: voiceCharacteristics.persona,
      accent: voiceCharacteristics.accent,
      emotionalIntensity: voiceCharacteristics.emotionalIntensity,
      culturalFlavor: voiceCharacteristics.culturalFlavor
    };
  };

  const simulateAlarmWithAI = async (alarm) => {
    const aiMessage = generateAIVoiceMessage(alarm.morningGoal, settings.aiVoiceTone, alarm.ringCount + 1);
    
    console.log(`🚨 AI Alarm Simulation for ${alarm.label}:`);
    console.log(`🎯 Goal: ${alarm.morningGoal}`);
    console.log(`🎨 Tone: ${settings.aiVoiceTone}`);
    console.log(`📢 Ring Count: ${alarm.ringCount + 1}`);
    console.log(`👤 Persona: ${aiMessage.persona}`);
    console.log(`🎭 Accent: ${aiMessage.accent}`);
    console.log(`💫 Emotional Intensity: ${aiMessage.emotionalIntensity}%`);
    console.log(`🌍 Cultural Flavor: ${aiMessage.culturalFlavor}`);
    console.log(`🔊 Volume Level: ${aiMessage.volume}%`);
    console.log(`💥 Intensity: ${aiMessage.intensity}/7`);
    console.log(`📳 Haptics: ${aiMessage.haptics ? 'ON' : 'OFF'}`);
    console.log(`💬 Message: "${aiMessage.message}"`);
    
    // Check if speech is supported
    const speechSupported = await VoiceService.isSupported();
    if (!speechSupported) {
      Alert.alert('Speech Not Supported', 'Text-to-speech is not supported on this device.');
      return;
    }
    
    // Enhanced alert with persona details and real voice playback
    Alert.alert(
      '🤖 AI Alarm Simulation',
      `Ring ${alarm.ringCount + 1}:\n\n"${aiMessage.message}"\n\n👤 ${aiMessage.persona}\n🎭 ${aiMessage.accent} accent\n💫 ${aiMessage.emotionalIntensity}% emotional intensity\n🌍 ${aiMessage.culturalFlavor}\n🔊 Volume: ${aiMessage.volume}%\n💥 Intensity: ${aiMessage.intensity}/7\n📳 Haptics: ${aiMessage.haptics ? 'ON' : 'OFF'}`,
      [
        { 
          text: 'Snooze', 
          onPress: async () => {
            setAlarms(prev => prev.map(a => 
              a.id === alarm.id ? { ...a, ringCount: a.ringCount + 1 } : a
            ));
            
            // Play the voice message
            try {
              await VoiceService.speakWithPersona(aiMessage.message, aiMessage.persona, {
                tone: settings.aiVoiceTone,
                volume: aiMessage.volume / 100
              });
            } catch (error) {
              console.error('Error playing alarm voice:', error);
            }
          }
        },
        { 
          text: 'Stop', 
          style: 'destructive', 
          onPress: async () => {
            setAlarms(prev => prev.map(a => 
              a.id === alarm.id ? { ...a, ringCount: 0 } : a
            ));
            
            // Stop any playing voice
            await VoiceService.stop();
          }
        }
      ]
    );
  };

  const handleAlarmToggle = (alarmId) => {
    setAlarms(prevAlarms => 
      prevAlarms.map(alarm => {
        if (alarm.id === alarmId) {
          // Animate the toggle
          Animated.sequence([
            Animated.timing(alarm.scale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(alarm.scale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          
          return { ...alarm, active: !alarm.active };
        }
        return alarm;
      })
    );
  };

  const handleAlarmEdit = (alarm) => {
    setEditingAlarm(alarm);
    setNewAlarm({
      time: alarm.time,
      label: alarm.label,
      days: alarm.days,
      morningGoal: alarm.morningGoal,
      aiVoiceEnabled: alarm.aiVoiceEnabled
    });
    
    // Initialize selected days based on alarm days
    const daysText = alarm.days.toLowerCase();
    const newSelectedDays = {
      mon: daysText.includes('mon'),
      tue: daysText.includes('tue'),
      wed: daysText.includes('wed'),
      thu: daysText.includes('thu'),
      fri: daysText.includes('fri'),
      sat: daysText.includes('sat'),
      sun: daysText.includes('sun')
    };
    setSelectedDays(newSelectedDays);
    
    setShowEditModal(true);
  };

  const handleAddAlarm = () => {
    setNewAlarm({
      time: '7:00 AM',
      label: '',
      days: 'Mon - Fri',
      morningGoal: 'stretching',
      aiVoiceEnabled: true
    });
    setShowAddModal(true);
  };

  const timeOptions = [
    '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM',
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'
  ];

  const dayOptions = [
    'Mon - Fri', 'Mon, Wed, Fri', 'Tue, Thu', 'Sat, Sun', 'Every Day'
  ];

  const snoozeOptions = ['3 minutes', '5 minutes', '10 minutes', '15 minutes'];
  const maxSnoozeOptions = ['1 time', '2 times', '3 times', '5 times'];
  const voiceOptions = ['Enabled', 'Disabled'];
  const toneOptions = ['savage', 'motivational', 'gentle'];

  const toggleDay = (dayKey) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const getSelectedDaysText = () => {
    const selected = Object.entries(selectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => key);
    
    if (selected.length === 0) return 'No days selected';
    if (selected.length === 7) return 'Every Day';
    if (selected.length === 5 && selected.includes('mon') && selected.includes('tue') && 
        selected.includes('wed') && selected.includes('thu') && selected.includes('fri')) {
      return 'Mon - Fri';
    }
    if (selected.length === 2 && selected.includes('sat') && selected.includes('sun')) {
      return 'Sat, Sun';
    }
    
    return selected.map(key => key.charAt(0).toUpperCase() + key.slice(1, 3)).join(', ');
  };

  const saveNewAlarm = () => {
    if (!newAlarm.label.trim()) {
      Alert.alert('Error', 'Please enter an alarm label');
      return;
    }

    const daysText = getSelectedDaysText();
    if (daysText === 'No days selected') {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    const alarm = {
      id: Date.now(),
      time: newAlarm.time,
      label: newAlarm.label.trim(),
      days: daysText,
      active: true,
      scale: new Animated.Value(1),
      morningGoal: newAlarm.morningGoal,
      aiVoiceEnabled: newAlarm.aiVoiceEnabled,
      ringCount: 0
    };

    setAlarms(prev => [...prev, alarm]);
    setShowAddModal(false);
    Alert.alert('Success', 'New alarm added successfully!');
  };

  const saveEditedAlarm = () => {
    if (!newAlarm.label.trim()) {
      Alert.alert('Error', 'Please enter an alarm label');
      return;
    }

    const daysText = getSelectedDaysText();
    if (daysText === 'No days selected') {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    setAlarms(prevAlarms => 
      prevAlarms.map(alarm => 
        alarm.id === editingAlarm.id 
          ? { ...alarm, time: newAlarm.time, label: newAlarm.label.trim(), days: daysText, morningGoal: newAlarm.morningGoal, aiVoiceEnabled: newAlarm.aiVoiceEnabled }
          : alarm
      )
    );
    setShowEditModal(false);
    setEditingAlarm(null);
    Alert.alert('Success', 'Alarm updated successfully!');
  };

  const deleteAlarm = (alarmId) => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
            Alert.alert('Success', 'Alarm deleted successfully!');
          }
        }
      ]
    );
  };

  const handleSettingPress = (settingKey) => {
    switch (settingKey) {
      case 'snoozeDuration':
        setShowSnoozeModal(true);
        break;
      case 'maxSnoozes':
        setShowMaxSnoozesModal(true);
        break;
      case 'voiceMessages':
        setShowVoiceModal(true);
        break;
      case 'aiVoiceTone':
        setShowToneModal(true);
        break;
    }
  };

  const updateSetting = (settingKey, value) => {
    setSettings(prev => ({ ...prev, [settingKey]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⏰ Alarms</Text>
        <Text style={styles.subtitle}>Manage your wake-up schedule</Text>
      </View>

      {/* Add Alarm Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm} activeOpacity={0.8}>
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>Add New Alarm</Text>
      </TouchableOpacity>

      {/* Alarm List */}
      <View style={styles.alarmList}>
        {alarms.map((alarm) => (
          <Animated.View key={alarm.id} style={{ transform: [{ scale: alarm.scale }] }}>
            <TouchableOpacity 
              style={styles.alarmItem} 
              onPress={() => handleAlarmEdit(alarm)}
              onLongPress={() => deleteAlarm(alarm.id)}
              activeOpacity={0.8}
            >
              <View style={styles.alarmInfo}>
                <Text style={styles.alarmTime}>{alarm.time}</Text>
                <Text style={styles.alarmLabel}>{alarm.label}</Text>
                <Text style={styles.alarmDays}>{alarm.days}</Text>
                <View style={styles.alarmGoalContainer}>
                  <Text style={styles.alarmGoal}>
                    {morningGoals.find(g => g.id === alarm.morningGoal)?.icon} {morningGoals.find(g => g.id === alarm.morningGoal)?.label}
                  </Text>
                  {alarm.aiVoiceEnabled && (
                    <Text style={styles.aiVoiceIndicator}>🤖 AI Voice</Text>
                  )}
                </View>
              </View>
              <View style={styles.alarmActions}>
                <TouchableOpacity 
                  style={styles.alarmStatus}
                  onPress={() => handleAlarmToggle(alarm.id)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.activeIndicator,
                    !alarm.active && styles.inactiveIndicator
                  ]} />
                  <Text style={styles.statusText}>
                    {alarm.active ? 'Active' : 'Inactive'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.testAlarmButton}
                  onPress={() => simulateAlarmWithAI(alarm)}
                >
                  <Text style={styles.testAlarmButtonText}>🔔</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleAlarmEdit(alarm)}
                >
                  <Text style={styles.editButtonText}>✏️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Quick Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>⚙️ Quick Settings</Text>
        <Text style={styles.settingsSubtitle}>Customize your alarm experience</Text>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => handleSettingPress('snoozeDuration')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Snooze Duration</Text>
            <Text style={styles.settingDescription}>How long to snooze</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{settings.snoozeDuration}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => handleSettingPress('maxSnoozes')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Max Snoozes</Text>
            <Text style={styles.settingDescription}>Maximum snooze attempts</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{settings.maxSnoozes}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => handleSettingPress('voiceMessages')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Voice Messages</Text>
            <Text style={styles.settingDescription}>Personalized wake-up messages</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{settings.voiceMessages}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.settingItem} 
          onPress={() => handleSettingPress('aiVoiceTone')}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>AI Voice Tone</Text>
            <Text style={styles.settingDescription}>Tone for AI voice messages</Text>
          </View>
          <View style={styles.settingValueContainer}>
            <Text style={styles.settingValue}>{settings.aiVoiceTone}</Text>
            <Text style={styles.settingArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Add Alarm Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Alarm</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeOption, newAlarm.time === time && styles.selectedTimeOption]}
                    onPress={() => setNewAlarm(prev => ({ ...prev, time }))}
                  >
                    <Text style={[styles.timeOptionText, newAlarm.time === time && styles.selectedTimeOptionText]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Label</Text>
              <TextInput
                style={styles.textInput}
                value={newAlarm.label}
                onChangeText={(text) => setNewAlarm(prev => ({ ...prev, label: text }))}
                placeholder="Enter alarm label"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Days</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {individualDays.map((day) => (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.timeOption,
                      selectedDays[day.key] && styles.selectedTimeOption,
                      !selectedDays[day.key] && styles.unselectedTimeOption
                    ]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      selectedDays[day.key] && styles.selectedTimeOptionText,
                      !selectedDays[day.key] && styles.unselectedTimeOptionText
                    ]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Morning Goal</Text>
              <Text style={styles.inputSubtitle}>What do you want to accomplish in the morning?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {morningGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalOption,
                      newAlarm.morningGoal === goal.id && styles.selectedGoalOption,
                      newAlarm.morningGoal !== goal.id && styles.unselectedGoalOption
                    ]}
                    onPress={() => setNewAlarm(prev => ({ ...prev, morningGoal: goal.id }))}
                  >
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <Text style={[
                      styles.goalLabel,
                      newAlarm.morningGoal === goal.id && styles.selectedGoalLabel,
                      newAlarm.morningGoal !== goal.id && styles.unselectedGoalLabel
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AI Voice</Text>
              <Text style={styles.inputSubtitle}>Enable AI-generated voice messages</Text>
              <TouchableOpacity
                style={[
                  styles.aiToggle,
                  newAlarm.aiVoiceEnabled && styles.aiToggleEnabled,
                  !newAlarm.aiVoiceEnabled && styles.aiToggleDisabled
                ]}
                onPress={() => setNewAlarm(prev => ({ ...prev, aiVoiceEnabled: !prev.aiVoiceEnabled }))}
              >
                <Text style={styles.aiToggleText}>
                  {newAlarm.aiVoiceEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveNewAlarm}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Alarm Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Alarm</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {timeOptions.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeOption, newAlarm.time === time && styles.selectedTimeOption]}
                    onPress={() => setNewAlarm(prev => ({ ...prev, time }))}
                  >
                    <Text style={[styles.timeOptionText, newAlarm.time === time && styles.selectedTimeOptionText]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Label</Text>
              <TextInput
                style={styles.textInput}
                value={newAlarm.label}
                onChangeText={(text) => setNewAlarm(prev => ({ ...prev, label: text }))}
                placeholder="Enter alarm label"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Days</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {individualDays.map((day) => (
                  <TouchableOpacity
                    key={day.key}
                    style={[
                      styles.timeOption,
                      selectedDays[day.key] && styles.selectedTimeOption,
                      !selectedDays[day.key] && styles.unselectedTimeOption
                    ]}
                    onPress={() => toggleDay(day.key)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      selectedDays[day.key] && styles.selectedTimeOptionText,
                      !selectedDays[day.key] && styles.unselectedTimeOptionText
                    ]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Morning Goal</Text>
              <Text style={styles.inputSubtitle}>What do you want to accomplish in the morning?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScroll}>
                {morningGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalOption,
                      newAlarm.morningGoal === goal.id && styles.selectedGoalOption,
                      newAlarm.morningGoal !== goal.id && styles.unselectedGoalOption
                    ]}
                    onPress={() => setNewAlarm(prev => ({ ...prev, morningGoal: goal.id }))}
                  >
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <Text style={[
                      styles.goalLabel,
                      newAlarm.morningGoal === goal.id && styles.selectedGoalLabel,
                      newAlarm.morningGoal !== goal.id && styles.unselectedGoalLabel
                    ]}>
                      {goal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>AI Voice</Text>
              <Text style={styles.inputSubtitle}>Enable AI-generated voice messages</Text>
              <TouchableOpacity
                style={[
                  styles.aiToggle,
                  newAlarm.aiVoiceEnabled && styles.aiToggleEnabled,
                  !newAlarm.aiVoiceEnabled && styles.aiToggleDisabled
                ]}
                onPress={() => setNewAlarm(prev => ({ ...prev, aiVoiceEnabled: !prev.aiVoiceEnabled }))}
              >
                <Text style={styles.aiToggleText}>
                  {newAlarm.aiVoiceEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEditedAlarm}>
                <Text style={styles.saveButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Snooze Duration Modal */}
      <Modal visible={showSnoozeModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Snooze Duration</Text>
            {snoozeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, settings.snoozeDuration === option && styles.selectedOption]}
                onPress={() => {
                  updateSetting('snoozeDuration', option);
                  setShowSnoozeModal(false);
                }}
              >
                <Text style={[styles.optionText, settings.snoozeDuration === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowSnoozeModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Max Snoozes Modal */}
      <Modal visible={showMaxSnoozesModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Max Snoozes</Text>
            {maxSnoozeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, settings.maxSnoozes === option && styles.selectedOption]}
                onPress={() => {
                  updateSetting('maxSnoozes', option);
                  setShowMaxSnoozesModal(false);
                }}
              >
                <Text style={[styles.optionText, settings.maxSnoozes === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowMaxSnoozesModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Voice Messages Modal */}
      <Modal visible={showVoiceModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voice Messages</Text>
            {voiceOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, settings.voiceMessages === option && styles.selectedOption]}
                onPress={() => {
                  updateSetting('voiceMessages', option);
                  setShowVoiceModal(false);
                }}
              >
                <Text style={[styles.optionText, settings.voiceMessages === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowVoiceModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* AI Voice Tone Modal */}
      <Modal visible={showToneModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI Voice Tone</Text>
            {toneOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionItem, settings.aiVoiceTone === option && styles.selectedOption]}
                onPress={() => {
                  updateSetting('aiVoiceTone', option);
                  setShowToneModal(false);
                }}
              >
                <Text style={[styles.optionText, settings.aiVoiceTone === option && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowToneModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#e07a5f',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alarmList: {
    paddingHorizontal: 15,
  },
  alarmItem: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  alarmLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  alarmDays: {
    fontSize: 14,
    color: '#666',
  },
  alarmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alarmStatus: {
    alignItems: 'center',
  },
  editButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f2d1d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
  },
  alarmGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  alarmGoal: {
    fontSize: 12,
    color: '#55786f',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  aiVoiceIndicator: {
    fontSize: 11,
    color: '#e07a5f',
    backgroundColor: '#ffe8e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  testAlarmButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e07a5f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testAlarmButtonText: {
    fontSize: 14,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#55786f',
    marginBottom: 5,
  },
  inactiveIndicator: {
    backgroundColor: '#ccc',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
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
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  settingValue: {
    fontSize: 16,
    color: '#55786f',
    fontWeight: '500',
    marginRight: 8,
  },
  settingArrow: {
    fontSize: 16,
    color: '#999',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  inputSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  goalOption: {
    alignItems: 'center',
    padding: 15,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    minWidth: 80,
  },
  selectedGoalOption: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#55786f',
  },
  unselectedGoalOption: {
    backgroundColor: '#f8f8f8',
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  goalLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedGoalLabel: {
    color: '#55786f',
  },
  unselectedGoalLabel: {
    color: '#666',
  },
  aiToggle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiToggleEnabled: {
    backgroundColor: '#e8f5e8',
    borderWidth: 2,
    borderColor: '#55786f',
  },
  aiToggleDisabled: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  aiToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  timeScroll: {
    flexDirection: 'row',
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedTimeOption: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  unselectedTimeOption: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeOptionText: {
    color: '#ffffff',
  },
  unselectedTimeOptionText: {
    color: '#999',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#e07a5f',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#55786f',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
}); 