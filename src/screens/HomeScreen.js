import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../context/AppContext';
import { COLORS, THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextAlarm, setNextAlarm] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    calculateNextAlarm();
  }, [state.alarms]);

  const calculateNextAlarm = () => {
    if (!state.alarms || state.alarms.length === 0) {
      setNextAlarm(null);
      return;
    }

    const now = new Date();
    const today = now.getDay();
    const currentTimeString = now.toTimeString().slice(0, 5);

    // Find the next alarm for today
    const todayAlarms = state.alarms.filter(alarm => 
      alarm.isActive && alarm.days.includes(today) && alarm.time > currentTimeString
    );

    if (todayAlarms.length > 0) {
      // Sort by time and get the earliest
      const sortedAlarms = todayAlarms.sort((a, b) => a.time.localeCompare(b.time));
      setNextAlarm(sortedAlarms[0]);
    } else {
      // Find the next alarm for future days
      const futureAlarms = state.alarms.filter(alarm => alarm.isActive);
      if (futureAlarms.length > 0) {
        // For simplicity, just get the first active alarm
        setNextAlarm(futureAlarms[0]);
      } else {
        setNextAlarm(null);
      }
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Every morning is a new beginning. Make it count!",
      "Your future self is watching you right now through memories.",
      "The only bad workout is the one that didn't happen.",
      "Wake up with determination. Go to bed with satisfaction.",
      "Your body can stand almost anything. It's your mind you have to convince.",
      "The difference between try and triumph is just a little umph!",
      "Don't wish for it. Work for it.",
      "Make yourself proud.",
      "Today's goal: Outdo yesterday.",
      "Small progress is still progress.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  };

  const getTimeUntilAlarm = (alarmTime) => {
    const now = new Date();
    const [hours, minutes] = alarmTime.split(':');
    const alarmDate = new Date();
    alarmDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (alarmDate <= now) {
      alarmDate.setDate(alarmDate.getDate() + 1);
    }
    
    const diff = alarmDate - now;
    const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
    const minutesDiff = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursDiff > 0) {
      return `${hoursDiff}h ${minutesDiff}m`;
    }
    return `${minutesDiff}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.softLilac, COLORS.creamBeige]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {state.user?.name || 'Friend'}! 👋
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="person" size={24} color={COLORS.forestGreen} />
            </TouchableOpacity>
          </View>

          {/* Current Time */}
          <View style={styles.timeContainer}>
            <Text style={styles.currentTime}>
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </Text>
            <Text style={styles.currentDate}>
              {currentTime.toLocaleDateString([], { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          {/* Next Alarm Card */}
          {nextAlarm ? (
            <View style={styles.alarmCard}>
              <View style={styles.alarmHeader}>
                <Icon name="alarm" size={24} color={COLORS.accentBurntOrange} />
                <Text style={styles.alarmTitle}>Next Alarm</Text>
              </View>
              <Text style={styles.alarmTime}>{formatTime(nextAlarm.time)}</Text>
              <Text style={styles.alarmLabel}>{nextAlarm.label}</Text>
              <Text style={styles.alarmPurpose}>{nextAlarm.purpose}</Text>
              <View style={styles.alarmFooter}>
                <Text style={styles.timeUntil}>
                  In {getTimeUntilAlarm(nextAlarm.time)}
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('AlarmSetup', { alarmId: nextAlarm.id })}
                >
                  <Icon name="edit" size={16} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.noAlarmCard}>
              <Icon name="alarm-off" size={48} color={COLORS.gray} />
              <Text style={styles.noAlarmTitle}>No alarms set</Text>
              <Text style={styles.noAlarmSubtitle}>
                Set your first alarm to get started!
              </Text>
              <TouchableOpacity
                style={styles.addAlarmButton}
                onPress={() => navigation.navigate('AlarmSetup')}
              >
                <Text style={styles.addAlarmButtonText}>Add Alarm</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="local-fire-department" size={32} color={COLORS.accentBurntOrange} />
              <Text style={styles.statNumber}>
                {state.userStats?.currentStreak || 0}
              </Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="check-circle" size={32} color={COLORS.forestGreen} />
              <Text style={styles.statNumber}>
                {state.userStats?.successfulWakes || 0}
              </Text>
              <Text style={styles.statLabel}>Successful Wakes</Text>
            </View>
            
            <View style={styles.statCard}>
              <Icon name="trending-up" size={32} color={COLORS.dustyBlue} />
              <Text style={styles.statNumber}>
                {state.userStats?.level || 1}
              </Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>

          {/* Motivational Quote */}
          <View style={styles.quoteCard}>
            <Icon name="format-quote" size={24} color={COLORS.accentBurntOrange} />
            <Text style={styles.quoteText}>{getMotivationalQuote()}</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AlarmSetup')}
            >
              <Icon name="add-alarm" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>New Alarm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Stats')}
            >
              <Icon name="bar-chart" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>View Stats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Voice')}
            >
              <Icon name="mic" size={24} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Voice Test</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.lg,
  },
  greeting: {
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.gray,
  },
  userName: {
    fontSize: THEME.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.forestGreen,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
  },
  currentTime: {
    fontSize: THEME.typography.fontSize['4xl'],
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    fontFamily: 'monospace',
  },
  currentDate: {
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.gray,
    marginTop: THEME.spacing.xs,
  },
  alarmCard: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  alarmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  alarmTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginLeft: THEME.spacing.sm,
  },
  alarmTime: {
    fontSize: THEME.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: COLORS.accentBurntOrange,
    marginBottom: THEME.spacing.sm,
  },
  alarmLabel: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: THEME.spacing.xs,
  },
  alarmPurpose: {
    fontSize: THEME.typography.fontSize.base,
    color: COLORS.gray,
    marginBottom: THEME.spacing.md,
  },
  alarmFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeUntil: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
  },
  editButton: {
    padding: THEME.spacing.xs,
  },
  noAlarmCard: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  noAlarmTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  noAlarmSubtitle: {
    fontSize: THEME.typography.fontSize.base,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: THEME.spacing.lg,
  },
  addAlarmButton: {
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  addAlarmButtonText: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    marginHorizontal: THEME.spacing.xs,
    ...THEME.shadows.sm,
  },
  statNumber: {
    fontSize: THEME.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginTop: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: THEME.spacing.xs,
  },
  quoteCard: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    ...THEME.shadows.sm,
  },
  quoteText: {
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.forestGreen,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: THEME.spacing.sm,
    lineHeight: THEME.typography.lineHeight.relaxed,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xl,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
    marginHorizontal: THEME.spacing.xs,
    ...THEME.shadows.sm,
  },
  actionButtonText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: THEME.spacing.xs,
  },
});

export default HomeScreen; 