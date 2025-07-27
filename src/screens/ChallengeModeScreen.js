import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ChallengeModeService from '../services/challengeModeService';

const { width, height } = Dimensions.get('window');

const ChallengeModeScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [capturedImage, setCapturedImage] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  const cameraRef = useRef(null);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  const challengeService = new ChallengeModeService();
  const { alarmHistoryId } = route.params || {};

  useEffect(() => {
    initializeChallenge();
    startPulseAnimation();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !isCompleted) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isCompleted]);

  const initializeChallenge = async () => {
    try {
      setIsLoading(true);
      
      // Get camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'We need camera access for the wake-up challenge. Please enable it in settings.',
          [
            { text: 'Cancel', onPress: () => navigation.goBack() },
            { text: 'Try Again', onPress: initializeChallenge }
          ]
        );
        return;
      }

      // Start the challenge
      const challengeData = await challengeService.startChallenge(alarmHistoryId);
      setChallenge(challengeData);
      
      // Play voice instruction
      Alert.alert(
        '📸 Wake-Up Challenge!',
        challengeData.voiceInstruction,
        [{ text: 'Got it! Let\'s do this!', style: 'default' }]
      );
      
    } catch (error) {
      console.error('Error initializing challenge:', error);
      Alert.alert(
        'Error',
        'Failed to start challenge. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
        base64: false,
      });

      setCapturedImage(photo.uri);
      await verifyPhoto(photo.uri);
      
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  };

  const verifyPhoto = async (imageUri) => {
    try {
      setIsVerifying(true);
      
      const verification = await challengeService.verifyChallenge(
        imageUri,
        challenge.challenge.objectToFind,
        challenge.challenge.id
      );

      const newAttempt = verification.attempt;
      setAttempts(prev => [...prev, newAttempt]);
      setFeedback(verification.feedback);

      if (verification.isCorrect) {
        // Success!
        setIsCompleted(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const completion = await challengeService.completeChallenge(
          challenge.challenge.id,
          true,
          attempts.length + 1
        );

        Alert.alert(
          '🎉 Challenge Completed!',
          completion.voiceMessage,
          [
            { 
              text: 'Awesome!', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      } else {
        // Failed attempt
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        startShakeAnimation();
        
        if (attempts.length + 1 >= challengeService.maxAttempts) {
          // Out of attempts
          handleMaxAttemptsReached();
        } else {
          // Try again
          setTimeout(() => {
            setCapturedImage(null);
            setIsCapturing(false);
            setIsVerifying(false);
          }, 2000);
        }
      }
      
    } catch (error) {
      console.error('Error verifying photo:', error);
      Alert.alert('Error', 'Failed to verify photo. Please try again.');
      setIsCapturing(false);
      setIsVerifying(false);
    }
  };

  const handleMaxAttemptsReached = async () => {
    try {
      const completion = await challengeService.completeChallenge(
        challenge.challenge.id,
        false,
        attempts.length + 1
      );

      Alert.alert(
        '⏰ Challenge Complete',
        `You've used all your attempts, but that's okay! ${completion.voiceMessage}`,
        [
          { 
            text: 'Continue', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Error completing challenge:', error);
      navigation.goBack();
    }
  };

  const handleTimeUp = async () => {
    try {
      const completion = await challengeService.completeChallenge(
        challenge.challenge.id,
        false,
        attempts.length
      );

      Alert.alert(
        '⏰ Time\'s Up!',
        completion.voiceMessage,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    } catch (error) {
      console.error('Error handling time up:', error);
      navigation.goBack();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 30) return '#4ECDC4';
    if (timeRemaining > 10) return '#FFE66D';
    return '#FF6B6B';
  };

  if (hasPermission === null || isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>
            {hasPermission === null ? 'Requesting camera permission...' : 'Starting challenge...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>📷 Camera Access Required</Text>
          <Text style={styles.errorText}>
            We need camera access to verify you're awake. Please enable camera permissions in settings.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with timer and challenge info */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: getTimerColor() }]}>
              ⏱️ {formatTime(timeRemaining)}
            </Text>
          </View>
          
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>Find Your</Text>
            <Text style={styles.objectName}>
              {challenge?.challenge?.objectToFind?.toUpperCase()}
            </Text>
            <Text style={styles.attemptCounter}>
              Attempt {attempts.length + 1} of {challengeService.maxAttempts}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Camera view */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <View style={styles.capturedImageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
            
            {isVerifying && (
              <View style={styles.verifyingOverlay}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.verifyingText}>🔍 Analyzing image...</Text>
              </View>
            )}

            {feedback && !isVerifying && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>{feedback}</Text>
              </View>
            )}
          </View>
        ) : (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.guidanceContainer}>
                <Text style={styles.guidanceText}>
                  📸 Point your camera at your {challenge?.challenge?.objectToFind}
                </Text>
                <Text style={styles.guidanceSubtext}>
                  Make sure it's clearly visible and well-lit
                </Text>
              </View>
            </View>
          </Camera>
        )}
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomContainer}>
        {!isCompleted && !capturedImage && (
          <Animated.View
            style={[
              styles.captureButtonContainer,
              { 
                transform: [
                  { scale: pulseAnim },
                  { translateX: shakeAnim }
                ]
              }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonDisabled
              ]}
              onPress={capturePhoto}
              disabled={isCapturing}
            >
              <LinearGradient
                colors={isCapturing ? ['#bdc3c7', '#95a5a6'] : ['#4ECDC4', '#44A08D']}
                style={styles.captureButtonGradient}
              >
                <Text style={styles.captureButtonText}>
                  {isCapturing ? '📸 Capturing...' : '📷 Take Photo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {capturedImage && !isVerifying && !isCompleted && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setCapturedImage(null);
              setFeedback('');
              setIsCapturing(false);
            }}
          >
            <Text style={styles.retryButtonText}>📷 Try Again</Text>
          </TouchableOpacity>
        )}

        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 Having trouble? Make sure your {challenge?.challenge?.objectToFind} is:
          </Text>
          <Text style={styles.helpBullet}>• Clearly visible in the frame</Text>
          <Text style={styles.helpBullet}>• Well-lit (turn on lights if needed)</Text>
          <Text style={styles.helpBullet}>• Not blocked by other objects</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  challengeInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  challengeTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  objectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  attemptCounter: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  guidanceContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  guidanceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  guidanceSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  capturedImageContainer: {
    flex: 1,
    position: 'relative',
  },
  capturedImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  verifyingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    borderRadius: 12,
  },
  feedbackText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingBottom: 40,
  },
  captureButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonDisabled: {
    shadowOpacity: 0.1,
  },
  captureButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '600',
  },
  helpBullet: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
    marginLeft: 8,
  },
});

export default ChallengeModeScreen;