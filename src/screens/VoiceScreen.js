import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function VoiceScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Voice</Text>
        <Text style={styles.subtitle}>Customize your wake-up experience</Text>
      </View>

      {/* Voice Persona Selection */}
      <View style={styles.personaCard}>
        <Text style={styles.cardTitle}>🎭 Voice Persona</Text>
        <View style={styles.personaGrid}>
          <TouchableOpacity style={[styles.personaItem, styles.selectedPersona]}>
            <Text style={styles.personaIcon}>💃</Text>
            <Text style={styles.personaName}>Nigerian Aunty</Text>
            <Text style={styles.personaDesc}>Sassy & Motivational</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.personaItem}>
            <Text style={styles.personaIcon}>🧙</Text>
            <Text style={styles.personaName}>Wise Elder</Text>
            <Text style={styles.personaDesc}>Calm & Wise</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.personaItem}>
            <Text style={styles.personaIcon}>🧘</Text>
            <Text style={styles.personaName}>Zen Monk</Text>
            <Text style={styles.personaDesc}>Peaceful & Gentle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.personaItem}>
            <Text style={styles.personaIcon}>🤓</Text>
            <Text style={styles.personaName}>Study Buddy</Text>
            <Text style={styles.personaDesc}>Nerdy & Encouraging</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tone Settings */}
      <View style={styles.toneCard}>
        <Text style={styles.cardTitle}>🎨 Tone Preference</Text>
        <View style={styles.toneSlider}>
          <View style={styles.toneLabels}>
            <Text style={styles.toneLabel}>Delicate</Text>
            <Text style={styles.toneLabel}>Mid-Delicate</Text>
            <Text style={styles.toneLabel}>Savage</Text>
          </View>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderThumb, { left: '60%' }]} />
          </View>
          <Text style={styles.currentTone}>Mid-Delicate</Text>
        </View>
      </View>

      {/* Voice Test */}
      <View style={styles.testCard}>
        <Text style={styles.cardTitle}>🎵 Test Your Voice</Text>
        <View style={styles.testButtons}>
          <TouchableOpacity style={styles.testButton}>
            <Text style={styles.testButtonText}>🎤 Test Spoken</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.testButton}>
            <Text style={styles.testButtonText}>🎵 Test Singing</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.testDesc}>
          Preview how your wake-up messages will sound
        </Text>
      </View>

      {/* Voice Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardTitle}>⚙️ Voice Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Voice Messages</Text>
          <View style={styles.toggleSwitch}>
            <View style={[styles.toggleThumb, styles.toggleActive]} />
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Singing Messages</Text>
          <View style={styles.toggleSwitch}>
            <View style={[styles.toggleThumb, styles.toggleActive]} />
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Challenge Mode</Text>
          <View style={styles.toggleSwitch}>
            <View style={styles.toggleThumb} />
          </View>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Volume Level</Text>
          <Text style={styles.settingValue}>80%</Text>
        </View>
      </View>

      {/* Sample Messages */}
      <View style={styles.sampleCard}>
        <Text style={styles.cardTitle}>💬 Sample Messages</Text>
        <View style={styles.messageItem}>
          <Text style={styles.messageText}>
            "Good morning, Anjola! Time to rise and shine like the superstar you are! 🌟"
          </Text>
          <Text style={styles.messageType}>Delicate</Text>
        </View>
        <View style={styles.messageItem}>
          <Text style={styles.messageText}>
            "Anjola, the gym is calling your name! Let's get those gains! 💪"
          </Text>
          <Text style={styles.messageType}>Mid-Delicate</Text>
        </View>
        <View style={styles.messageItem}>
          <Text style={styles.messageText}>
            "Anjola! Stop snoozing! Your dreams aren't going to chase themselves! 😤"
          </Text>
          <Text style={styles.messageType}>Savage</Text>
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
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  personaItem: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedPersona: {
    backgroundColor: '#d8c5f3',
    borderWidth: 2,
    borderColor: '#55786f',
  },
  personaIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  personaName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  personaDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
}); 