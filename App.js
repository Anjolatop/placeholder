import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import OnboardingNavigator from './src/navigation/OnboardingNavigator';
import TabNavigator from './src/navigation/TabNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function AppContent() {
  const { isAuthenticated, hasCompletedOnboarding, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#55786f" />
      </View>
    );
  }

  // Show onboarding if not authenticated or hasn't completed onboarding
  if (!isAuthenticated || !hasCompletedOnboarding) {
    return <OnboardingNavigator />;
  }

  // Show main app if authenticated and completed onboarding
  return <TabNavigator />;
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