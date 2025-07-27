import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import SingingService from '../services/singingService';
import VoiceService from '../services/voiceService';

const { width } = Dimensions.get('window');

const VoicePersonaScreen = ({ navigation, route }) => {
  const [selectedPersona, setSelectedPersona] = useState('soft-singer');
  const [availablePersonas, setAvailablePersonas] = useState([]);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [previewText, setPreviewText] = useState('');
  
  const singingService = new SingingService();
  const voiceService = new VoiceService();

  useEffect(() => {
    loadVoicePersonas();
    loadUserStats();
  }, []);

  const loadVoicePersonas = async () => {
    try {
      setIsLoading(true);
      const allPersonas = singingService.voicePersonas;
      setAvailablePersonas(allPersonas);
    } catch (error) {
      console.error('Error loading voice personas:', error);
      Alert.alert('Error', 'Failed to load voice personas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    // In a real app, this would fetch from your user service
    const mockStats = {
      currentStreak: 5,
      level: 8,
      achievements: [
        { id: 'cultural-explorer', isUnlocked: false }
      ]
    };
    setUserStats(mockStats);
  };

  const isPersonaUnlocked = (persona) => {
    if (persona.isUnlocked) return true;
    if (!persona.unlockRequirement || !userStats) return false;

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
  };

  const getUnlockDescription = (persona) => {
    if (!persona.unlockRequirement) return '';
    
    const { type, value } = persona.unlockRequirement;
    
    switch (type) {
      case 'streak':
        return `Unlock with ${value}-day wake-up streak`;
      case 'level':
        return `Unlock at level ${value}`;
      case 'achievement':
        return `Unlock with "${value}" achievement`;
      default:
        return 'Special unlock required';
    }
  };

  const handlePersonaSelect = async (persona) => {
    if (!isPersonaUnlocked(persona)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        'Voice Locked 🔒',
        `${getUnlockDescription(persona)}\n\nKeep building your wake-up habits to unlock this amazing voice!`,
        [{ text: 'Got it!', style: 'default' }]
      );
      return;
    }

    Haptics.selectionAsync();
    setSelectedPersona(persona.id);
  };

  const playPreview = async (persona) => {
    if (!isPersonaUnlocked(persona)) {
      handlePersonaSelect(persona);
      return;
    }

    try {
      setIsPreviewPlaying(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Generate sample text for this persona
      const userName = route.params?.userName || 'Friend';
      const sampleText = singingService.generatePreviewSample(persona.id, userName);
      setPreviewText(sampleText);
      
      // In a real implementation, this would play the actual audio
      // For now, we'll simulate the preview duration
      setTimeout(() => {
        setIsPreviewPlaying(false);
      }, 3000);
      
      Alert.alert(
        `🎵 ${persona.name} Preview`,
        sampleText,
        [
          { text: 'Stop', style: 'cancel', onPress: () => setIsPreviewPlaying(false) },
          { text: 'Select This Voice', style: 'default', onPress: () => setSelectedPersona(persona.id) }
        ]
      );
      
    } catch (error) {
      console.error('Error playing preview:', error);
      Alert.alert('Error', 'Failed to play preview');
      setIsPreviewPlaying(false);
    }
  };

  const savePersonaSelection = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // In a real app, save to user preferences
      Alert.alert(
        'Voice Saved! 🎉',
        'Your voice persona has been updated. Enjoy your personalized wake-up experience!',
        [
          { text: 'Done', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Error saving persona:', error);
      Alert.alert('Error', 'Failed to save voice persona');
    }
  };

  const renderPersonaCard = (persona) => {
    const unlocked = isPersonaUnlocked(persona);
    const isSelected = selectedPersona === persona.id;
    
    return (
      <TouchableOpacity
        key={persona.id}
        style={[
          styles.personaCard,
          isSelected && styles.selectedCard,
          !unlocked && styles.lockedCard
        ]}
        onPress={() => handlePersonaSelect(persona)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            isSelected 
              ? ['#FF6B6B', '#4ECDC4'] 
              : unlocked 
                ? ['#667eea', '#764ba2'] 
                : ['#bdc3c7', '#95a5a6']
          }
          style={styles.personaGradient}
        >
          <View style={styles.personaHeader}>
            <Text style={styles.personaName}>{persona.name}</Text>
            {!unlocked && <Text style={styles.lockIcon}>🔒</Text>}
          </View>
          
          <Text style={[
            styles.personaDescription,
            !unlocked && styles.lockedText
          ]}>
            {persona.description}
          </Text>
          
          <View style={styles.personaTags}>
            <View style={[styles.toneTag, styles[`${persona.tone}Tag`]]}>
              <Text style={styles.toneText}>{persona.tone}</Text>
            </View>
          </View>
          
          {!unlocked && (
            <Text style={styles.unlockRequirement}>
              {getUnlockDescription(persona)}
            </Text>
          )}
          
          <TouchableOpacity
            style={[
              styles.previewButton,
              !unlocked && styles.disabledButton,
              isPreviewPlaying && styles.playingButton
            ]}
            onPress={() => playPreview(persona)}
            disabled={isPreviewPlaying}
          >
            <Text style={[
              styles.previewButtonText,
              !unlocked && styles.disabledButtonText
            ]}>
              {isPreviewPlaying ? '🎵 Playing...' : '🎤 Preview'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading voice personas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>🎭 Voice Personas</Text>
            <Text style={styles.headerSubtitle}>
              Choose your perfect wake-up companion
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🎵 Your Personal Wake-Up Artist</Text>
            <Text style={styles.infoText}>
              Each voice persona brings a unique personality to your mornings. 
              From gentle lullabies to energetic rap anthems, find the voice that 
              matches your mood and goals!
            </Text>
          </View>

          <View style={styles.personasContainer}>
            {availablePersonas.map(renderPersonaCard)}
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>🏆 Your Progress</Text>
            <Text style={styles.progressText}>
              Current Streak: {userStats?.currentStreak || 0} days
            </Text>
            <Text style={styles.progressText}>
              Level: {userStats?.level || 1}
            </Text>
            <Text style={styles.progressHint}>
              Keep building your wake-up habits to unlock more voices!
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            selectedPersona && styles.saveButtonActive
          ]}
          onPress={savePersonaSelection}
          disabled={!selectedPersona}
        >
          <LinearGradient
            colors={selectedPersona ? ['#4ECDC4', '#44A08D'] : ['#bdc3c7', '#95a5a6']}
            style={styles.saveButtonGradient}
          >
            <Text style={[
              styles.saveButtonText,
              selectedPersona && styles.saveButtonTextActive
            ]}>
              Save My Voice Choice
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  personasContainer: {
    marginBottom: 24,
  },
  personaCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedCard: {
    transform: [{ scale: 1.02 }],
  },
  lockedCard: {
    opacity: 0.7,
  },
  personaGradient: {
    padding: 20,
  },
  personaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personaName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  lockIcon: {
    fontSize: 20,
  },
  personaDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    lineHeight: 18,
  },
  lockedText: {
    opacity: 0.7,
  },
  personaTags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toneTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  delicateTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  'mid-delicateTag': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  savageTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  toneText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  unlockRequirement: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  previewButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  disabledButton: {
    opacity: 0.5,
  },
  playingButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
  progressInfo: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 4,
  },
  progressHint: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonActive: {
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  saveButtonTextActive: {
    color: 'white',
  },
});

export default VoicePersonaScreen;