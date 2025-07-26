import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌞 WakeyTalky</Text>
      <Text style={styles.subtitle}>Your smart alarm app is running!</Text>
      <Text style={styles.description}>
        This is the basic setup. The full app with AI voice generation, 
        personalized alarms, and beautiful UI is ready to be built!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e07a5f',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#9e9e9e',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 