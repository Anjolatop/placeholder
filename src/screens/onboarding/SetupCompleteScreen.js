import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SetupCompleteScreen({ navigation, route }) {
  const { userName } = route.params || {};

  useEffect(() => {
    // Auto-navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      // Navigate to the parent navigator's MainApp screen
      navigation.getParent()?.navigate('MainApp');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Setup Complete!</Text>
        <Text style={styles.welcomeText}>
          Welcome, {userName || 'User'}! 🌞
        </Text>
        <Text style={styles.subtitle}>
          Your personalized wake-up experience is ready!
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎭</Text>
            <Text style={styles.featureText}>Personalized Voice Messages</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎵</Text>
            <Text style={styles.featureText}>Custom Wake-Up Songs</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔥</Text>
            <Text style={styles.featureText}>Gamified Streaks</Text>
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e07a5f" />
          <Text style={styles.loadingText}>Taking you to your dashboard...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e07a5f',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
}); 