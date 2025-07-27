import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const SingingSetupComponent = ({ 
  includeSinging = false,
  voiceMoodOverride = null,
  challengeModeEnabled = true,
  onSingingToggle,
  onVoiceMoodChange,
  onChallengeToggle,
  showPreview = false,
  onPreviewPress
}) => {
  const [localIncludeSinging, setLocalIncludeSinging] = useState(includeSinging);
  const [localVoiceMood, setLocalVoiceMood] = useState(voiceMoodOverride);
  const [localChallengeMode, setLocalChallengeMode] = useState(challengeModeEnabled);

  const voiceMoods = [
    {
      id: 'soft-singer',
      name: '✨ Soft Singer',
      description: 'Gentle, melodic wake-ups',
      color: ['#a8e6cf', '#dcedc8']
    },
    {
      id: 'hype-mc',
      name: '😎 Hype MC',
      description: 'Energetic rap motivation',
      color: ['#ff8a65', '#ffab91']
    },
    {
      id: 'comedic-jester',
      name: '🤡 Comedic Jester',
      description: 'Funny wake-up entertainment',
      color: ['#ffd54f', '#fff176']
    },
    {
      id: 'pop-diva',
      name: '🔥 Pop Diva',
      description: 'Beyoncé-style powerhouse',
      color: ['#e1bee7', '#f8bbd9']
    }
  ];

  const handleSingingToggle = (value) => {
    setLocalIncludeSinging(value);
    onSingingToggle?.(value);
    Haptics.selectionAsync();
  };

  const handleVoiceMoodSelect = (moodId) => {
    setLocalVoiceMood(moodId);
    onVoiceMoodChange?.(moodId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleChallengeToggle = (value) => {
    setLocalChallengeMode(value);
    onChallengeToggle?.(value);
    Haptics.selectionAsync();
  };

  const handlePreview = (moodId) => {
    if (onPreviewPress) {
      onPreviewPress(moodId);
    } else {
      Alert.alert(
        '🎵 Preview',
        `This would preview the ${voiceMoods.find(m => m.id === moodId)?.name} voice style.`,
        [{ text: 'Cool!', style: 'default' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Singing Toggle Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>🎤 Include Wake-Up Song</Text>
            <Text style={styles.sectionSubtitle}>
              Let AI create personalized songs for your wake-ups
            </Text>
          </View>
          <Switch
            value={localIncludeSinging}
            onValueChange={handleSingingToggle}
            trackColor={{ false: '#e0e0e0', true: '#4ECDC4' }}
            thumbColor={localIncludeSinging ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>
      </View>

      {/* Voice Mood Selection */}
      {localIncludeSinging && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎭 Choose Your Voice Mood</Text>
          <Text style={styles.sectionSubtitle}>
            Select the singing style for this alarm (overrides global preference)
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.voiceMoodsContainer}
            contentContainerStyle={styles.voiceMoodsContent}
          >
            {voiceMoods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.voiceMoodCard,
                  localVoiceMood === mood.id && styles.selectedMoodCard
                ]}
                onPress={() => handleVoiceMoodSelect(mood.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={mood.color}
                  style={[
                    styles.moodGradient,
                    localVoiceMood === mood.id && styles.selectedGradient
                  ]}
                >
                  <Text style={styles.moodName}>{mood.name}</Text>
                  <Text style={styles.moodDescription}>{mood.description}</Text>
                  
                  {showPreview && (
                    <TouchableOpacity
                      style={styles.previewButton}
                      onPress={() => handlePreview(mood.id)}
                    >
                      <Text style={styles.previewText}>🎵 Preview</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
                
                {localVoiceMood === mood.id && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Clear Selection Button */}
          {localVoiceMood && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => handleVoiceMoodSelect(null)}
            >
              <Text style={styles.clearButtonText}>
                Use Global Voice Preference
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Challenge Mode Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.sectionTitle}>📸 Challenge Mode</Text>
            <Text style={styles.sectionSubtitle}>
              Require photo verification after 3 snoozes
            </Text>
          </View>
          <Switch
            value={localChallengeMode}
            onValueChange={handleChallengeToggle}
            trackColor={{ false: '#e0e0e0', true: '#4ECDC4' }}
            thumbColor={localChallengeMode ? '#fff' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        </View>
        
        {localChallengeMode && (
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeInfoText}>
              💡 When enabled, you'll need to take a photo of a random object 
              (like your microwave or shoes) to prove you're awake after excessive snoozing.
            </Text>
          </View>
        )}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
        <Text style={styles.tipText}>
          • Singing works best for morning alarms (6 AM - 10 AM)
        </Text>
        <Text style={styles.tipText}>
          • Different voice moods match different alarm purposes
        </Text>
        <Text style={styles.tipText}>
          • Challenge mode helps break persistent snoozing habits
        </Text>
        <Text style={styles.tipText}>
          • Voice personas unlock as you build wake-up streaks
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 16,
  },
  voiceMoodsContainer: {
    marginTop: 16,
  },
  voiceMoodsContent: {
    paddingHorizontal: 4,
  },
  voiceMoodCard: {
    width: 140,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMoodCard: {
    shadowColor: '#4ECDC4',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  moodGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGradient: {
    opacity: 0.9,
  },
  moodName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 10,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 12,
  },
  previewButton: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewText: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#7f8c8d',
    fontSize: 12,
    fontStyle: 'italic',
  },
  challengeInfo: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  challengeInfoText: {
    fontSize: 12,
    color: '#6c757d',
    lineHeight: 16,
  },
  tipsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    lineHeight: 16,
  },
});

export default SingingSetupComponent;