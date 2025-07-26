import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { userProfile, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const getUserName = () => {
    return userProfile?.name || 'User';
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#55786f" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>🌞 WakeyTalky</Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Good morning, {getUserName()}!</Text>
      </View>

      {/* Current Time */}
      <View style={styles.timeCard}>
        <Text style={styles.timeLabel}>Current Time</Text>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
      </View>

      {/* Next Alarm */}
      <View style={styles.alarmCard}>
        <Text style={styles.cardTitle}>⏰ Next Alarm</Text>
        <Text style={styles.alarmTime}>7:00 AM</Text>
        <Text style={styles.alarmLabel}>Gym Session</Text>
        <Text style={styles.alarmStatus}>Tomorrow</Text>
      </View>

      {/* Wake Streak */}
      <View style={styles.streakCard}>
        <Text style={styles.cardTitle}>🔥 Wake Streak</Text>
        <Text style={styles.streakNumber}>5 days</Text>
        <Text style={styles.streakText}>Keep it up! You're doing great!</Text>
      </View>

      {/* User Preferences Summary */}
      <View style={styles.preferencesCard}>
        <Text style={styles.cardTitle}>🎭 Your Preferences</Text>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Tone:</Text>
          <Text style={styles.preferenceValue}>
            {userProfile?.preferredTone?.replace('-', ' ').toUpperCase() || 'Mid-Delicate'}
          </Text>
        </View>
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceLabel}>Wake Style:</Text>
          <Text style={styles.preferenceValue}>
            {userProfile?.wakeStylePreference?.toUpperCase() || 'Mixed'}
          </Text>
        </View>
        {userProfile?.hobbies?.length > 0 && (
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Hobbies:</Text>
            <Text style={styles.preferenceValue}>
              {userProfile.hobbies.slice(0, 2).join(', ')}
              {userProfile.hobbies.length > 2 && '...'}
            </Text>
          </View>
        )}
      </View>

      {/* Motivational Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          "The early bird catches the worm, but the early riser catches their dreams."
        </Text>
        <Text style={styles.quoteAuthor}>- WakeyTalky</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>⏰</Text>
            <Text style={styles.actionText}>Set Alarm</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>🎵</Text>
            <Text style={styles.actionText}>Voice Test</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Stats</Text>
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
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: '#f2d1d1',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 16,
    color: '#f2d1d1',
  },
  timeCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  alarmCard: {
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
    marginBottom: 10,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e07a5f',
    marginBottom: 5,
  },
  alarmLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  alarmStatus: {
    fontSize: 14,
    color: '#666',
  },
  streakCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e07a5f',
    marginBottom: 10,
  },
  streakText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  preferencesCard: {
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
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  preferenceValue: {
    fontSize: 14,
    color: '#55786f',
    fontWeight: 'bold',
  },
  quoteCard: {
    backgroundColor: '#d8c5f3',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsCard: {
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f2d1d1',
    borderRadius: 10,
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
}); 