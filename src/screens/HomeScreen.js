import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { userProfile, signOut } = useAuth();
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Animated values for button interactions
  const alarmScale = new Animated.Value(1);
  const preferencesScale = new Animated.Value(1);
  const actionButtonScales = {
    alarm: new Animated.Value(1),
    voice: new Animated.Value(1),
    stats: new Animated.Value(1),
  };

  // Motivational quotes array
  const motivationalQuotes = [
    {
      text: "The early bird catches the worm, but the early riser catches their dreams.",
      author: "WakeyTalky"
    },
    {
      text: "Every morning is a new beginning. Make it count!",
      author: "WakeyTalky"
    },
    {
      text: "Your future self is watching you right now through memories.",
      author: "WakeyTalky"
    },
    {
      text: "The only bad workout is the one that didn't happen.",
      author: "WakeyTalky"
    },
    {
      text: "Wake up with determination. Go to bed with satisfaction.",
      author: "WakeyTalky"
    },
    {
      text: "Morning is when the magic happens. Don't sleep through it!",
      author: "WakeyTalky"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The difference between try and triumph is just a little umph!",
      author: "Marvin Phillips"
    }
  ];

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Change quote every 30 seconds
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % motivationalQuotes.length);
    }, 30000);

    // Cleanup timers on component unmount
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, [motivationalQuotes.length]);

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

  const handleAlarmPress = () => {
    Animated.sequence([
      Animated.timing(alarmScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(alarmScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('Alarms');
  };

  const handlePreferencesPress = () => {
    Animated.sequence([
      Animated.timing(preferencesScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(preferencesScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    navigation.navigate('Preferences');
  };

  const handleActionButtonPress = (action, scaleKey) => {
    Animated.sequence([
      Animated.timing(actionButtonScales[scaleKey], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(actionButtonScales[scaleKey], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    switch (action) {
      case 'alarm':
        navigation.navigate('Alarms');
        break;
      case 'voice':
        navigation.navigate('Voice');
        break;
      case 'stats':
        navigation.navigate('Stats');
        break;
    }
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
      <Animated.View style={{ transform: [{ scale: alarmScale }] }}>
        <TouchableOpacity style={styles.alarmCard} onPress={handleAlarmPress} activeOpacity={0.8}>
          <View style={styles.alarmHeader}>
            <Text style={styles.cardTitle}>⏰ Next Alarm</Text>
            <View style={styles.alarmIndicator}>
              <View style={styles.alarmDot} />
            </View>
          </View>
          <Text style={styles.alarmTime}>7:00 AM</Text>
          <Text style={styles.alarmLabel}>Gym Session</Text>
          <Text style={styles.alarmStatus}>Tomorrow</Text>
          <View style={styles.alarmAction}>
            <Text style={styles.tapHint}>Tap to manage alarms</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Wake Streak */}
      <TouchableOpacity style={styles.streakCard} activeOpacity={0.9} onPress={() => {
        navigation.navigate('Stats');
      }}>
        <Text style={styles.cardTitle}>🔥 Wake Streak</Text>
        <Text style={styles.streakNumber}>5 days</Text>
        <Text style={styles.streakText}>Keep it up! You're doing great!</Text>
        <View style={styles.streakAction}>
          <Text style={styles.tapHint}>Tap to view detailed stats</Text>
          <Text style={styles.arrowIcon}>→</Text>
        </View>
      </TouchableOpacity>

      {/* User Preferences Summary */}
      <Animated.View style={{ transform: [{ scale: preferencesScale }] }}>
        <TouchableOpacity style={styles.preferencesCard} onPress={handlePreferencesPress} activeOpacity={0.8}>
          <View style={styles.preferencesHeader}>
            <Text style={styles.cardTitle}>🎭 Your Preferences</Text>
            <View style={styles.editIcon}>
              <Text style={styles.editIconText}>✏️</Text>
            </View>
          </View>
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
          <View style={styles.preferencesAction}>
            <Text style={styles.tapHint}>Tap to edit preferences</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Motivational Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteIcon}>💭</Text>
        <Text style={styles.quoteText}>
          "{motivationalQuotes[currentQuoteIndex].text}"
        </Text>
        <Text style={styles.quoteAuthor}>- {motivationalQuotes[currentQuoteIndex].author}</Text>
        <View style={styles.quoteIndicator}>
          {motivationalQuotes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.quoteDot,
                index === currentQuoteIndex && styles.quoteDotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>🚀 Quick Actions</Text>
        <Text style={styles.cardSubtitle}>Get things done faster</Text>
        <View style={styles.actionButtons}>
          <Animated.View style={{ transform: [{ scale: actionButtonScales.alarm }] }}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleActionButtonPress('alarm', 'alarm')} 
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionIcon}>⏰</Text>
                <Text style={styles.actionText}>Set Alarm</Text>
                <Text style={styles.actionSubtext}>Create new</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: actionButtonScales.voice }] }}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleActionButtonPress('voice', 'voice')} 
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionIcon}>🎵</Text>
                <Text style={styles.actionText}>Voice Test</Text>
                <Text style={styles.actionSubtext}>Try it out</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: actionButtonScales.stats }] }}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleActionButtonPress('stats', 'stats')} 
              activeOpacity={0.8}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>Stats</Text>
                <Text style={styles.actionSubtext}>View progress</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerIcon}>🌅</Text>
          <Text style={styles.footerText}>Made with ❤️ by WakeyTalky</Text>
          <Text style={styles.footerSubtext}>Your smart wake-up companion</Text>
        </View>
        <View style={styles.footerStats}>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatIcon}>🔥</Text>
            <Text style={styles.footerStatNumber}>5</Text>
            <Text style={styles.footerStatLabel}>Day Streak</Text>
          </View>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatIcon}>⏰</Text>
            <Text style={styles.footerStatNumber}>12</Text>
            <Text style={styles.footerStatLabel}>Alarms Set</Text>
          </View>
          <View style={styles.footerStat}>
            <Text style={styles.footerStatIcon}>🎤</Text>
            <Text style={styles.footerStatNumber}>4</Text>
            <Text style={styles.footerStatLabel}>Voice Personas</Text>
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerBottomText}>Version 1.0.0 • Ready to wake up!</Text>
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
    borderRadius: 12,
    minWidth: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  tapHint: {
    fontSize: 12,
    color: '#e07a5f',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  alarmIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e07a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alarmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  alarmAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#55786f',
    fontWeight: 'bold',
  },
  preferencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f2d1d1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 12,
  },
  preferencesAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  actionSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  quoteIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 6,
  },
  quoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  quoteDotActive: {
    backgroundColor: '#55786f',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55786f',
  },
  footerStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  footerIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  footerStatIcon: {
    fontSize: 16,
    marginBottom: 5,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  footerBottomText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
}); 