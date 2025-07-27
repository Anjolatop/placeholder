import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import alarmService from '../services/alarmService';
import { useAuth } from '../context/AuthContext';

export default function AlarmSetupScreen({ navigation }) {
  const { userProfile } = useAuth();
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [alarmPurpose, setAlarmPurpose] = useState('');
  const [repeatDays, setRepeatDays] = useState([]);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeInterval, setSnoozeInterval] = useState(5);
  const [useWakeUpVoice, setUseWakeUpVoice] = useState(true);
  const [includeSinging, setIncludeSinging] = useState(false);
  const [ringtoneType, setRingtoneType] = useState('voice'); // 'voice', 'music', 'mixed'
  const [loading, setLoading] = useState(false);

  // Time picker state
  const [selectedHour, setSelectedHour] = useState(alarmTime.getHours());
  const [selectedMinute, setSelectedMinute] = useState(alarmTime.getMinutes());
  const [isAM, setIsAM] = useState(alarmTime.getHours() < 12);

  const daysOfWeek = [
    { key: 0, label: 'Sun', short: 'S' },
    { key: 1, label: 'Mon', short: 'M' },
    { key: 2, label: 'Tue', short: 'T' },
    { key: 3, label: 'Wed', short: 'W' },
    { key: 4, label: 'Thu', short: 'T' },
    { key: 5, label: 'Fri', short: 'F' },
    { key: 6, label: 'Sat', short: 'S' },
  ];

  const snoozeIntervals = [1, 3, 5, 10, 15, 30];

  const handleTimeChange = () => {
    let hour = selectedHour;
    if (!isAM && hour !== 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
    
    const newTime = new Date();
    newTime.setHours(hour, selectedMinute, 0, 0);
    setAlarmTime(newTime);
    setShowTimePicker(false);
  };

  const toggleRepeatDay = (dayKey) => {
    if (repeatDays.includes(dayKey)) {
      setRepeatDays(repeatDays.filter(day => day !== dayKey));
    } else {
      setRepeatDays([...repeatDays, dayKey]);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSaveAlarm = async () => {
    if (!alarmPurpose.trim()) {
      Alert.alert('Error', 'Please enter an alarm purpose');
      return;
    }

    setLoading(true);
    try {
      const alarmData = {
        time: alarmTime,
        purpose: alarmPurpose,
        repeatDays,
        snoozeEnabled,
        snoozeInterval,
        useWakeUpVoice,
        includeSinging,
        ringtoneType,
        isActive: true,
        createdAt: new Date(),
      };

      // Save alarm using the service
      const savedAlarm = await alarmService.scheduleAlarm(alarmData);
      
      Alert.alert(
        'Alarm Set! 🎉',
        `Your alarm "${alarmPurpose}" is set for ${formatTime(alarmTime)}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving alarm:', error);
      Alert.alert('Error', 'Failed to set alarm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill alarm purpose based on user goals
  const getSuggestedPurpose = () => {
    if (userProfile?.personalGoals?.length > 0) {
      const goal = userProfile.personalGoals[0];
      return `Work on: ${goal}`;
    }
    return '';
  };

  // Custom Time Picker Component
  const CustomTimePicker = () => (
    <Modal
      visible={showTimePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerModal}>
          <Text style={styles.timePickerTitle}>Set Alarm Time</Text>
          
          <View style={styles.timePickerContent}>
            {/* Hour Picker */}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Hour</Text>
              <ScrollView style={styles.timeScrollView} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeOption,
                      selectedHour === hour && styles.selectedTimeOption
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      selectedHour === hour && styles.selectedTimeOptionText
                    ]}>
                      {hour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            {/* Minute Picker */}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>Minute</Text>
              <ScrollView style={styles.timeScrollView} showsVerticalScrollIndicator={false}>
                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeOption,
                      selectedMinute === minute && styles.selectedTimeOption
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      selectedMinute === minute && styles.selectedTimeOptionText
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* AM/PM Picker */}
            <View style={styles.timeSection}>
              <Text style={styles.timeLabel}>AM/PM</Text>
              <View style={styles.ampmContainer}>
                <TouchableOpacity
                  style={[
                    styles.ampmOption,
                    isAM && styles.selectedAmpmOption
                  ]}
                  onPress={() => setIsAM(true)}
                >
                  <Text style={[
                    styles.ampmText,
                    isAM && styles.selectedAmpmText
                  ]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.ampmOption,
                    !isAM && styles.selectedAmpmOption
                  ]}
                  onPress={() => setIsAM(false)}
                >
                  <Text style={[
                    styles.ampmText,
                    !isAM && styles.selectedAmpmText
                  ]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.timePickerActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleTimeChange}
            >
              <Text style={styles.confirmButtonText}>Set Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set New Alarm</Text>
        <TouchableOpacity 
          onPress={handleSaveAlarm} 
          style={[styles.saveButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏰ Alarm Time</Text>
        <TouchableOpacity
          style={styles.timePickerButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeDisplay}>{formatTime(alarmTime)}</Text>
          <Text style={styles.timePickerHint}>Tap to change time</Text>
        </TouchableOpacity>
      </View>

      {/* Alarm Purpose */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Alarm Purpose</Text>
        <TextInput
          style={styles.textInput}
          value={alarmPurpose}
          onChangeText={setAlarmPurpose}
          placeholder={getSuggestedPurpose() || "e.g., Go to gym, Write thesis, Work meeting"}
          multiline
        />
        {userProfile?.personalGoals?.length > 0 && (
          <Text style={styles.suggestionText}>
            💡 Suggestion: {getSuggestedPurpose()}
          </Text>
        )}
      </View>

      {/* Repeat Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Repeat Schedule</Text>
        <View style={styles.repeatDaysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.key}
              style={[
                styles.dayButton,
                repeatDays.includes(day.key) && styles.dayButtonSelected
              ]}
              onPress={() => toggleRepeatDay(day.key)}
            >
              <Text style={[
                styles.dayButtonText,
                repeatDays.includes(day.key) && styles.dayButtonTextSelected
              ]}>
                {day.short}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>
          {repeatDays.length === 0 ? 'No repeat (one-time alarm)' : 
           repeatDays.length === 7 ? 'Every day' :
           `Repeats on: ${repeatDays.map(d => daysOfWeek[d].label).join(', ')}`}
        </Text>
      </View>

      {/* Ringtone Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔊 Ringtone Options</Text>
        <View style={styles.ringtoneOptions}>
          <TouchableOpacity
            style={[
              styles.ringtoneOption,
              ringtoneType === 'voice' && styles.ringtoneOptionSelected
            ]}
            onPress={() => setRingtoneType('voice')}
          >
            <Text style={styles.ringtoneIcon}>🎤</Text>
            <Text style={styles.ringtoneLabel}>Voice Only</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.ringtoneOption,
              ringtoneType === 'music' && styles.ringtoneOptionSelected
            ]}
            onPress={() => setRingtoneType('music')}
          >
            <Text style={styles.ringtoneIcon}>🎵</Text>
            <Text style={styles.ringtoneLabel}>Music Only</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.ringtoneOption,
              ringtoneType === 'mixed' && styles.ringtoneOptionSelected
            ]}
            onPress={() => setRingtoneType('mixed')}
          >
            <Text style={styles.ringtoneIcon}>🎭</Text>
            <Text style={styles.ringtoneLabel}>Mixed</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wake-Up Voice Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎤 Wake-Up Voice</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Use Personalized Voice</Text>
            <Text style={styles.toggleDescription}>
              AI-generated messages based on your preferences
            </Text>
          </View>
          <Switch
            value={useWakeUpVoice}
            onValueChange={setUseWakeUpVoice}
            trackColor={{ false: '#e0e0e0', true: '#55786f' }}
            thumbColor={useWakeUpVoice ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        {useWakeUpVoice && userProfile?.preferredTones && (
          <Text style={styles.voiceInfo}>
            🎭 Voice tone: {userProfile.preferredTones.join(', ')}
          </Text>
        )}
      </View>

      {/* Singing Wake-Up Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Singing Wake-Up</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Include Singing</Text>
            <Text style={styles.toggleDescription}>
              Custom wake-up songs with your name and goals
            </Text>
          </View>
          <Switch
            value={includeSinging}
            onValueChange={setIncludeSinging}
            trackColor={{ false: '#e0e0e0', true: '#e07a5f' }}
            thumbColor={includeSinging ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Snooze Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>😴 Snooze Settings</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Enable Snooze</Text>
            <Text style={styles.toggleDescription}>
              Allow snoozing the alarm
            </Text>
          </View>
          <Switch
            value={snoozeEnabled}
            onValueChange={setSnoozeEnabled}
            trackColor={{ false: '#e0e0e0', true: '#55786f' }}
            thumbColor={snoozeEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>
        
        {snoozeEnabled && (
          <View style={styles.snoozeIntervalContainer}>
            <Text style={styles.snoozeIntervalLabel}>Snooze Interval:</Text>
            <View style={styles.snoozeIntervalButtons}>
              {snoozeIntervals.map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.snoozeIntervalButton,
                    snoozeInterval === interval && styles.snoozeIntervalButtonSelected
                  ]}
                  onPress={() => setSnoozeInterval(interval)}
                >
                  <Text style={[
                    styles.snoozeIntervalButtonText,
                    snoozeInterval === interval && styles.snoozeIntervalButtonTextSelected
                  ]}>
                    {interval}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Save Button */}
      <View style={styles.saveSection}>
        <TouchableOpacity 
          style={[styles.saveAlarmButton, loading && styles.disabledButton]} 
          onPress={handleSaveAlarm}
          disabled={loading}
        >
          <Text style={styles.saveAlarmButtonText}>
            {loading ? 'Setting Alarm...' : 'Set Alarm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Time Picker Modal */}
      <CustomTimePicker />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#f2d1d1',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#f2d1d1',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 15,
  },
  timePickerButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 5,
  },
  timePickerHint: {
    fontSize: 14,
    color: '#666',
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 50,
  },
  suggestionText: {
    fontSize: 14,
    color: '#55786f',
    marginTop: 8,
    fontStyle: 'italic',
  },
  repeatDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  dayButtonSelected: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  dayButtonTextSelected: {
    color: '#ffffff',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ringtoneOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ringtoneOption: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  ringtoneOptionSelected: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  ringtoneIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  ringtoneLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 15,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
  },
  voiceInfo: {
    fontSize: 14,
    color: '#55786f',
    marginTop: 10,
    fontStyle: 'italic',
  },
  snoozeIntervalContainer: {
    marginTop: 15,
  },
  snoozeIntervalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  snoozeIntervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  snoozeIntervalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 60,
    alignItems: 'center',
  },
  snoozeIntervalButtonSelected: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  snoozeIntervalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  snoozeIntervalButtonTextSelected: {
    color: '#ffffff',
  },
  saveSection: {
    padding: 15,
    marginBottom: 30,
  },
  saveAlarmButton: {
    backgroundColor: '#e07a5f',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveAlarmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Custom Time Picker Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  timePickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#55786f',
    textAlign: 'center',
    marginBottom: 20,
  },
  timePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeSection: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  timeScrollView: {
    height: 150,
    width: '100%',
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#55786f',
  },
  timeOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeOptionText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#55786f',
    marginHorizontal: 10,
  },
  ampmContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  ampmOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedAmpmOption: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  ampmText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedAmpmText: {
    color: '#ffffff',
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#55786f',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
}); 