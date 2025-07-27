import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { UserService } from '../../services/userService';

export default function ProfileSetupScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState({
    name: '',
    preferredTones: ['mid-delicate'], // Changed to array for multiple selections
    gender: '',
    hobbies: [],
    personalGoals: [],
    wakeStylePreference: 'mixed'
  });

  const steps = [
    {
      title: "Hi there, welcome to your new world of better habits, I'm your assistant!",
      subtitle: "What name would you like me to call you, a nickname works too!",
      field: 'name',
      type: 'text'
    },
    {
      title: "Choose your tone preferences",
      subtitle: "Pick up to 2 tones that motivate you best",
      field: 'preferredTones',
      type: 'tone'
    },
    {
      title: "Gender/Pronouns (Optional)",
      subtitle: "This helps with voice avatar & phrasing",
      field: 'gender',
      type: 'gender'
    },
    {
      title: "What are your hobbies?",
      subtitle: "We'll add these to your wake-up messages",
      field: 'hobbies',
      type: 'hobbies'
    },
    {
      title: "What are your goals?",
      subtitle: "What do you want to achieve?",
      field: 'personalGoals',
      type: 'goals'
    },
    {
      title: "How do you want to wake up?",
      subtitle: "Choose your preferred wake style",
      field: 'wakeStylePreference',
      type: 'wakeStyle'
    }
  ];

  const tones = [
    { key: 'delicate', label: 'Delicate', emoji: '🌸', description: 'Gentle & encouraging' },
    { key: 'mid-delicate', label: 'Mid-Delicate', emoji: '💪', description: 'Balanced motivation' },
    { key: 'savage', label: 'Savage', emoji: '🔥', description: 'Direct & bold' }
  ];

  const wakeStyles = [
    { key: 'spoken', label: 'Spoken Only', emoji: '🎤', description: 'Voice messages only' },
    { key: 'sung', label: 'Sung Only', emoji: '🎵', description: 'Singing messages only' },
    { key: 'mixed', label: 'Mixed', emoji: '🎭', description: 'Both spoken & sung' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleComplete = async () => {
    if (!userData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const currentUser = UserService.getCurrentUser();
      if (currentUser) {
        await UserService.updateUserProfile(currentUser.uid, {
          ...userData,
          onboardingCompleted: true
        });
        // Navigate to completion screen
        navigation.navigate('SetupComplete', { userName: userData.name });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    const step = steps[currentStep];
    
    switch (step.type) {
      case 'text':
        return (
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.textInput}
              value={userData[step.field]}
              onChangeText={(text) => updateUserData(step.field, text)}
              placeholder={`Enter your ${step.field}`}
              autoFocus
            />
          </View>
        );

      case 'tone':
        return (
          <View style={styles.optionsContainer}>
            {tones.map((tone) => {
              const isSelected = userData.preferredTones.includes(tone.key);
              const canSelect = isSelected || userData.preferredTones.length < 2;
              
              return (
                <TouchableOpacity
                  key={tone.key}
                  style={[
                    styles.optionCard,
                    isSelected && styles.selectedOption,
                    !canSelect && styles.disabledOption
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      // Remove if already selected
                      updateUserData('preferredTones', 
                        userData.preferredTones.filter(t => t !== tone.key)
                      );
                    } else if (canSelect) {
                      // Add if not selected and under limit
                      updateUserData('preferredTones', 
                        [...userData.preferredTones, tone.key]
                      );
                    }
                  }}
                  disabled={!canSelect}
                >
                  <Text style={styles.optionEmoji}>{tone.emoji}</Text>
                  <Text style={styles.optionLabel}>{tone.label}</Text>
                  <Text style={styles.optionDescription}>{tone.description}</Text>
                  {isSelected && <Text style={styles.selectedIndicator}>✓</Text>}
                </TouchableOpacity>
              );
            })}
            <Text style={styles.hint}>
              Selected: {userData.preferredTones.length}/2
            </Text>
          </View>
        );

      case 'gender':
        return (
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.textInput}
              value={userData.gender}
              onChangeText={(text) => updateUserData('gender', text)}
              placeholder="e.g., She/Her, He/Him, They/Them, or leave blank"
              autoFocus
            />
          </View>
        );

      case 'hobbies':
        return (
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={userData.hobbies.join(', ')}
              onChangeText={(text) => {
                // Split by comma and clean up each hobby
                const hobbiesArray = text
                  .split(',')
                  .map(hobby => hobby.trim())
                  .filter(hobby => hobby.length > 0);
                updateUserData('hobbies', hobbiesArray);
              }}
              placeholder="e.g., reading, gym, cooking, gaming"
              multiline
              numberOfLines={3}
              autoCapitalize="words"
            />
            <Text style={styles.hint}>Separate hobbies with commas</Text>
            {userData.hobbies.length > 0 && (
              <View style={styles.hobbiesPreview}>
                <Text style={styles.hint}>Your hobbies:</Text>
                <View style={styles.hobbiesList}>
                  {userData.hobbies.map((hobby, index) => (
                    <View key={index} style={styles.hobbyTag}>
                      <Text style={styles.hobbyText}>{hobby}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 'goals':
        return (
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={userData.personalGoals.join(', ')}
              onChangeText={(text) => updateUserData('personalGoals', text.split(',').map(g => g.trim()).filter(g => g))}
              placeholder="e.g., work out, write thesis, go to work on time"
              multiline
              numberOfLines={3}
            />
            <Text style={styles.hint}>Separate goals with commas</Text>
          </View>
        );

      case 'wakeStyle':
        return (
          <View style={styles.optionsContainer}>
            {wakeStyles.map((style) => (
              <TouchableOpacity
                key={style.key}
                style={[
                  styles.optionCard,
                  userData.wakeStylePreference === style.key && styles.selectedOption
                ]}
                onPress={() => updateUserData('wakeStylePreference', style.key)}
              >
                <Text style={styles.optionEmoji}>{style.emoji}</Text>
                <Text style={styles.optionLabel}>{style.label}</Text>
                <Text style={styles.optionDescription}>{style.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <Text style={styles.backButtonText}>
            {currentStep === 0 ? '← Back' : '← Previous'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.stepIndicator}>
          {currentStep + 1} of {steps.length}
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[
          styles.title,
          currentStep === 0 && { fontSize: 22, lineHeight: 28 } // Smaller font for welcome message
        ]}>
          {steps[currentStep].title}
        </Text>
        <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
        
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, loading && styles.disabledButton]}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
            </Text>
          )}
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#f2d1d1',
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e07a5f',
    borderRadius: 2,
  },
  stepIndicator: {
    color: '#f2d1d1',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 30,
  },
  textInput: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  selectedOption: {
    borderColor: '#55786f',
    backgroundColor: '#f8f9fa',
  },
  disabledOption: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  optionEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 20,
    color: '#55786f',
    fontWeight: 'bold',
  },
  hobbiesPreview: {
    marginTop: 15,
  },
  hobbiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  hobbyTag: {
    backgroundColor: '#e07a5f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  hobbyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 30,
    paddingTop: 0,
  },
  nextButton: {
    backgroundColor: '#e07a5f',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 