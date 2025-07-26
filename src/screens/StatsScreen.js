import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function StatsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Stats</Text>
        <Text style={styles.subtitle}>Your wake-up journey</Text>
      </View>

      {/* Current Streak */}
      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>🔥 Current Streak</Text>
        <Text style={styles.streakNumber}>5 days</Text>
        <Text style={styles.streakSubtitle}>Keep it up!</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Total Wakes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>7:15</Text>
          <Text style={styles.statLabel}>Avg Wake Time</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Snoozes Used</Text>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>📈 This Week</Text>
        <View style={styles.weekProgress}>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Mon</Text>
            <View style={[styles.dayIndicator, styles.completedDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Tue</Text>
            <View style={[styles.dayIndicator, styles.completedDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Wed</Text>
            <View style={[styles.dayIndicator, styles.completedDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Thu</Text>
            <View style={[styles.dayIndicator, styles.completedDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Fri</Text>
            <View style={[styles.dayIndicator, styles.completedDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Sat</Text>
            <View style={[styles.dayIndicator, styles.pendingDay]} />
          </View>
          <View style={styles.dayItem}>
            <Text style={styles.dayLabel}>Sun</Text>
            <View style={[styles.dayIndicator, styles.pendingDay]} />
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.cardTitle}>🏆 Achievements</Text>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🔥</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Early Bird</Text>
            <Text style={styles.achievementDesc}>Wake up 5 days in a row</Text>
          </View>
          <Text style={styles.achievementStatus}>Unlocked</Text>
        </View>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>⚡</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Speed Demon</Text>
            <Text style={styles.achievementDesc}>Get up within 1 minute</Text>
          </View>
          <Text style={styles.achievementStatus}>Unlocked</Text>
        </View>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🎯</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Perfect Week</Text>
            <Text style={styles.achievementDesc}>No snoozes for 7 days</Text>
          </View>
          <Text style={styles.achievementStatus}>In Progress</Text>
        </View>
      </View>

      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>📅 Monthly Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Best Wake Time</Text>
          <Text style={styles.summaryValue}>6:45 AM</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Longest Streak</Text>
          <Text style={styles.summaryValue}>8 days</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Snoozes</Text>
          <Text style={styles.summaryValue}>12 times</Text>
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
  streakTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e07a5f',
    marginBottom: 5,
  },
  streakSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    width: '48%',
    marginBottom: 10,
    marginHorizontal: '1%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressCard: {
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
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dayIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  completedDay: {
    backgroundColor: '#55786f',
  },
  pendingDay: {
    backgroundColor: '#f0f0f0',
  },
  achievementsCard: {
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  achievementStatus: {
    fontSize: 12,
    color: '#55786f',
    fontWeight: 'bold',
  },
  summaryCard: {
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 16,
    color: '#55786f',
    fontWeight: 'bold',
  },
}); 