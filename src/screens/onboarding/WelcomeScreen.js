import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌞 WakeyTalky</Text>
        <Text style={styles.subtitle}>Your smart alarm companion</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Clock Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.clockLogo}>
            <View style={styles.clockFace}>
              {/* Clock hour markers */}
              {[...Array(12)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.hourMarker,
                    {
                      transform: [
                        { rotate: `${i * 30}deg` },
                        { translateY: -35 }
                      ]
                    }
                  ]}
                />
              ))}
              {/* Clock hands */}
              <View style={[styles.hand, styles.minuteHand]} />
              <View style={[styles.hand, styles.hourHand]} />
              <View style={styles.centerDot} />
            </View>
            {/* Glowing orange outline */}
            <View style={styles.glowOutline} />
          </View>
        </View>
        
        <Text style={styles.welcomeText}>
          Welcome to WakeyTalky!
        </Text>
        
        <Text style={styles.description}>
          Get personalized wake-up messages with AI-powered voice and singing. 
          Let's create your perfect morning experience!
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
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  header: {
    backgroundColor: '#55786f',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#f2d1d1',
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  clockLogo: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  clockFace: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  hourMarker: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#4FC3F7',
    borderRadius: 1,
  },
  hand: {
    position: 'absolute',
    backgroundColor: '#4FC3F7',
    borderRadius: 2,
  },
  minuteHand: {
    width: 2,
    height: 35,
    transform: [{ translateY: -17.5 }],
  },
  hourHand: {
    width: 3,
    height: 25,
    transform: [{ translateY: -12.5 }, { rotate: '-30deg' }],
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4FC3F7',
  },
  glowOutline: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#55786f',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    width: '100%',
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
  actions: {
    padding: 30,
  },
  primaryButton: {
    backgroundColor: '#e07a5f',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#55786f',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 