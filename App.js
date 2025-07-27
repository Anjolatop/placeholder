import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import alarmService from './src/services/alarmService';
import SnoozeModal from './src/components/SnoozeModal';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function AppContent() {
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();
  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
  const [currentAlarmData, setCurrentAlarmData] = useState(null);

  useEffect(() => {
    // Initialize alarm service
    alarmService.initialize().catch(console.error);
    
    // Set up snooze modal callback
    alarmService.setSnoozeModalCallback((alarmData) => {
      setCurrentAlarmData(alarmData);
      setSnoozeModalVisible(true);
    });
  }, []);

  const handleSnooze = (alarmData, snoozeMinutes) => {
    console.log(`⏰ Snoozing for ${snoozeMinutes} minutes`);
    alarmService.snoozeAlarm(alarmData, snoozeMinutes);
    setSnoozeModalVisible(false);
    setCurrentAlarmData(null);
  };

  const handleDismiss = (alarmData) => {
    console.log('✅ Dismissing alarm');
    alarmService.dismissAlarm(alarmData);
    setSnoozeModalVisible(false);
    setCurrentAlarmData(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55786f" />
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <SnoozeModal
        visible={snoozeModalVisible}
        alarmData={currentAlarmData}
        onSnooze={handleSnooze}
        onDismiss={handleDismiss}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#55786f" />
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6ec',
  },
}); 