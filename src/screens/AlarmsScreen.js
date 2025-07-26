import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function AlarmsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⏰ Alarms</Text>
        <Text style={styles.subtitle}>Manage your wake-up schedule</Text>
      </View>

      {/* Add Alarm Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Alarm</Text>
      </TouchableOpacity>

      {/* Alarm List */}
      <View style={styles.alarmList}>
        {/* Sample Alarm 1 */}
        <View style={styles.alarmItem}>
          <View style={styles.alarmInfo}>
            <Text style={styles.alarmTime}>7:00 AM</Text>
            <Text style={styles.alarmLabel}>Gym Session</Text>
            <Text style={styles.alarmDays}>Mon, Wed, Fri</Text>
          </View>
          <View style={styles.alarmStatus}>
            <View style={styles.activeIndicator} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {/* Sample Alarm 2 */}
        <View style={styles.alarmItem}>
          <View style={styles.alarmInfo}>
            <Text style={styles.alarmTime}>8:30 AM</Text>
            <Text style={styles.alarmLabel}>Work</Text>
            <Text style={styles.alarmDays}>Mon - Fri</Text>
          </View>
          <View style={styles.alarmStatus}>
            <View style={[styles.activeIndicator, styles.inactiveIndicator]} />
            <Text style={styles.statusText}>Inactive</Text>
          </View>
        </View>

        {/* Sample Alarm 3 */}
        <View style={styles.alarmItem}>
          <View style={styles.alarmInfo}>
            <Text style={styles.alarmTime}>9:00 AM</Text>
            <Text style={styles.alarmLabel}>Weekend</Text>
            <Text style={styles.alarmDays}>Sat, Sun</Text>
          </View>
          <View style={styles.alarmStatus}>
            <View style={styles.activeIndicator} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      {/* Quick Settings */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Quick Settings</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Snooze Duration</Text>
          <Text style={styles.settingValue}>5 minutes</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Max Snoozes</Text>
          <Text style={styles.settingValue}>3 times</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Voice Messages</Text>
          <Text style={styles.settingValue}>Enabled</Text>
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
  addButton: {
    backgroundColor: '#e07a5f',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
  alarmStatus: {
    alignItems: 'center',
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
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
}); 