import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeKirosScreen({ navigation }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 4 seconds
    const timer = setTimeout(() => {
      navigation.replace('ProfileSetup');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />
      
      {/* Animated glow circles */}
      <Animated.View 
        style={[
          styles.glowCircle1,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.glowCircle2,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.glowCircle3,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          }
        ]} 
      />

      {/* Main content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
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
                        { translateY: -45 }
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

        {/* Welcome text */}
        <Text style={styles.welcomeTitle}>Welcome, Kiros!</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personalized wake-up experience is ready
        </Text>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <Animated.View 
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                  transform: [{ scale: glowAnim }],
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                  transform: [{ scale: glowAnim }],
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.loadingDot,
                {
                  opacity: glowAnim,
                  transform: [{ scale: glowAnim }],
                }
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>Setting up your experience...</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0a0a0a',
  },
  glowCircle1: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
  },
  glowCircle2: {
    position: 'absolute',
    top: height * 0.6,
    right: width * 0.1,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  glowCircle3: {
    position: 'absolute',
    bottom: height * 0.2,
    left: width * 0.2,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  clockLogo: {
    position: 'relative',
    width: 150,
    height: 150,
  },
  clockFace: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#333',
  },
  hourMarker: {
    position: 'absolute',
    width: 3,
    height: 10,
    backgroundColor: '#4FC3F7',
    borderRadius: 1.5,
  },
  hand: {
    position: 'absolute',
    backgroundColor: '#4FC3F7',
    borderRadius: 2,
  },
  minuteHand: {
    width: 3,
    height: 45,
    transform: [{ translateY: -22.5 }],
  },
  hourHand: {
    width: 4,
    height: 30,
    transform: [{ translateY: -15 }, { rotate: '-30deg' }],
  },
  centerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4FC3F7',
  },
  glowOutline: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 152, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF9800',
    marginHorizontal: 6,
  },
  loadingText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
}); 