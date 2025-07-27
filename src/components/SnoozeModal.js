import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import COLORS from '../constants/colors';

const { width, height } = Dimensions.get('window');

const SnoozeModal = ({ visible, alarmData, onSnooze, onDismiss }) => {
  if (!alarmData) return null;

  const snoozeOptions = [
    { minutes: 1, label: '1 minute' },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>⏰ WakeyTalky Alarm</Text>
            <Text style={styles.subtitle}>{alarmData.purpose}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>
              {alarmData.isSnooze 
                ? "AI is speaking to you! You can snooze again or dismiss:"
                : "Your alarm is ringing! Choose an option:"
              }
            </Text>

            <View style={styles.snoozeOptions}>
              {snoozeOptions.map((option) => (
                <TouchableOpacity
                  key={option.minutes}
                  style={styles.snoozeButton}
                  onPress={() => onSnooze(alarmData, option.minutes)}
                >
                  <Text style={styles.snoozeButtonText}>
                    ⏰ Snooze {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => onDismiss(alarmData)}
            >
              <Text style={styles.dismissButtonText}>✅ Dismiss Alarm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width * 0.85,
    backgroundColor: COLORS.creamBeige,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.black,
    textAlign: 'center',
  },
  content: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 24,
  },
  snoozeOptions: {
    width: '100%',
    marginBottom: 20,
  },
  snoozeButton: {
    backgroundColor: COLORS.accentBurntOrange,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  snoozeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: COLORS.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  dismissButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SnoozeModal; 