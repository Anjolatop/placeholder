import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useApp } from '../context/AppContext';
import { COLORS, THEME } from '../constants/theme';

const OnboardingScreen = ({ navigation }) => {
  const { actions } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    preferredTone: 'mid-delicate',
    gender: '',
    pronouns: '',
    hobbies: [],
    personalGoals: [],
    wakeStylePreference: 'mixed',
  });

  const steps = [
    {
      title: 'Welcome to WakeyTalky! 🌞',
      subtitle: 'Let\'s get to know you so we can create the perfect wake-up experience.',
      component: 'welcome',
    },
    {
      title: 'What\'s your name?',
      subtitle: 'We\'ll use this to personalize your wake-up messages.',
      component: 'name',
    },
    {
      title: 'Choose your wake-up style',
      subtitle: 'How do you like to be motivated?',
      component: 'tone',
    },
    {
      title: 'What are your hobbies?',
      subtitle: 'We\'ll use these to make your messages more personal.',
      component: 'hobbies',
    },
    {
      title: 'What are your goals?',
      subtitle: 'We\'ll remind you of what you\'re working towards.',
      component: 'goals',
    },
    {
      title: 'Voice preferences',
      subtitle: 'How would you like to be woken up?',
      component: 'voice',
    },
    {
      title: 'You\'re all set! 🎉',
      subtitle: 'Let\'s start your personalized wake-up journey.',
      component: 'complete',
    },
  ];

  const tones = [
    {
      id: 'delicate',
      title: 'Delicate',
      description: 'Gentle, encouraging messages',
      icon: 'favorite',
      color: COLORS.delicate.primary,
    },
    {
      id: 'mid-delicate',
      title: 'Balanced',
      description: 'A mix of encouragement and humor',
      icon: 'balance',
      color: COLORS.midDelicate.primary,
    },
    {
      id: 'savage',
      title: 'Savage',
      description: 'Sassy, no-nonsense motivation',
      icon: 'whatshot',
      color: COLORS.savage.primary,
    },
  ];

  const wakeStyles = [
    {
      id: 'spoken',
      title: 'Spoken Only',
      description: 'Just voice messages',
      icon: 'record-voice-over',
    },
    {
      id: 'sung',
      title: 'Singing Only',
      description: 'Custom wake-up songs',
      icon: 'music-note',
    },
    {
      id: 'mixed',
      title: 'Mixed',
      description: 'Both spoken and sung',
      icon: 'queue-music',
    },
  ];

  const hobbyOptions = [
    'Reading', 'Gaming', 'Cooking', 'Fitness', 'Music', 'Art',
    'Travel', 'Photography', 'Writing', 'Dancing', 'Yoga', 'Running',
    'Swimming', 'Cycling', 'Hiking', 'Painting', 'Drawing', 'Crafting',
    'Gardening', 'Knitting', 'Sewing', 'Woodworking', 'Pottery', 'Baking',
    'Coffee', 'Tea', 'Wine', 'Beer', 'Cocktails', 'Cigars', 'Pipes',
    'Anime', 'Manga', 'Comics', 'Movies', 'TV Shows', 'Podcasts',
    'Puzzles', 'Board Games', 'Card Games', 'Chess', 'Poker', 'Bingo',
    'Karaoke', 'Dancing', 'Singing', 'Acting', 'Stand-up', 'Magic',
    'Juggling', 'Circus', 'Acrobatics', 'Parkour', 'Skateboarding',
    'Surfing', 'Snowboarding', 'Skiing', 'Rock Climbing', 'Bouldering',
    'Mountain Biking', 'Road Biking', 'Triathlon', 'Marathon', 'Ultra',
    'Weightlifting', 'Powerlifting', 'CrossFit', 'Pilates', 'Barre',
    'Ballet', 'Jazz', 'Hip Hop', 'Tap', 'Contemporary', 'Modern',
    'Ballroom', 'Latin', 'Swing', 'Salsa', 'Bachata', 'Kizomba',
    'Tango', 'Waltz', 'Foxtrot', 'Quickstep', 'Viennese Waltz',
    'Cha Cha', 'Rumba', 'Samba', 'Paso Doble', 'Jive', 'East Coast Swing',
    'West Coast Swing', 'Lindy Hop', 'Charleston', 'Shag', 'Balboa',
    'Blues', 'Fusion', 'WCS', 'ECS', 'Lindy', 'Charleston', 'Shag',
    'Balboa', 'Blues', 'Fusion', 'WCS', 'ECS', 'Lindy', 'Charleston',
  ];

  const goalOptions = [
    'Lose weight', 'Build muscle', 'Get fit', 'Run a marathon',
    'Write a book', 'Learn a language', 'Start a business',
    'Get promoted', 'Save money', 'Buy a house', 'Travel more',
    'Learn to cook', 'Play an instrument', 'Learn to code',
    'Get organized', 'Be more productive', 'Read more books',
    'Watch less TV', 'Spend time with family', 'Make new friends',
    'Volunteer', 'Learn to paint', 'Take photos', 'Start a blog',
    'Learn to dance', 'Get better sleep', 'Reduce stress',
    'Be more confident', 'Learn to meditate', 'Practice yoga',
    'Quit smoking', 'Drink less alcohol', 'Eat healthier',
    'Drink more water', 'Take vitamins', 'Go to therapy',
    'Learn to drive', 'Get a pet', 'Plant a garden',
    'Learn to sew', 'Make jewelry', 'Learn to knit',
    'Start a collection', 'Learn magic', 'Join a club',
    'Take a class', 'Get a degree', 'Change careers',
    'Move to a new city', 'Buy a car', 'Get married',
    'Have children', 'Adopt a pet', 'Buy a boat',
    'Learn to sail', 'Get a pilot license', 'Learn to fly',
    'Go skydiving', 'Climb a mountain', 'Run a triathlon',
    'Complete an Ironman', 'Swim across a lake', 'Bike across country',
    'Walk across country', 'Hike the Appalachian Trail',
    'Climb Mount Everest', 'Visit all 50 states', 'Visit all continents',
    'Learn to surf', 'Learn to snowboard', 'Learn to ski',
    'Learn to skateboard', 'Learn to rollerblade', 'Learn to ice skate',
    'Learn to figure skate', 'Learn to speed skate', 'Learn to hockey',
    'Learn to play hockey', 'Learn to play soccer', 'Learn to play basketball',
    'Learn to play baseball', 'Learn to play football', 'Learn to play tennis',
    'Learn to play golf', 'Learn to play volleyball', 'Learn to play badminton',
    'Learn to play table tennis', 'Learn to play squash', 'Learn to play racquetball',
    'Learn to play handball', 'Learn to play racquetball', 'Learn to play squash',
  ];

  const renderStep = () => {
    const step = steps[currentStep];
    
    switch (step.component) {
      case 'welcome':
        return <WelcomeStep step={step} />;
      case 'name':
        return <NameStep step={step} userData={userData} setUserData={setUserData} />;
      case 'tone':
        return <ToneStep step={step} userData={userData} setUserData={setUserData} tones={tones} />;
      case 'hobbies':
        return <HobbiesStep step={step} userData={userData} setUserData={setUserData} hobbyOptions={hobbyOptions} />;
      case 'goals':
        return <GoalsStep step={step} userData={userData} setUserData={setUserData} goalOptions={goalOptions} />;
      case 'voice':
        return <VoiceStep step={step} userData={userData} setUserData={setUserData} wakeStyles={wakeStyles} />;
      case 'complete':
        return <CompleteStep step={step} />;
      default:
        return null;
    }
  };

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
    }
  };

  const handleComplete = async () => {
    try {
      // Create user profile
      const userProfile = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create initial user stats
      const userStats = {
        userId: userProfile.id,
        totalAlarms: 0,
        successfulWakes: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalSnoozes: 0,
        totalSkips: 0,
        averageWakeTime: 0,
        achievements: [],
        level: 1,
        experience: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save user data
      await actions.setUser(userProfile);
      await actions.setUserStats(userStats);

      // Mark onboarding as complete
      await AsyncStorage.setItem('onboardingCompleted', 'true');

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].component) {
      case 'name':
        return userData.name.trim().length > 0;
      case 'hobbies':
        return userData.hobbies.length > 0;
      case 'goals':
        return userData.personalGoals.length > 0;
      default:
        return true;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.softLilac, COLORS.creamBeige]}
        style={styles.gradient}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / steps.length) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Step Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Icon name="arrow-back" size={24} color={COLORS.gray} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Icon
              name={currentStep === steps.length - 1 ? 'check' : 'arrow-forward'}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Step Components
const WelcomeStep = ({ step }) => (
  <View style={styles.stepContainer}>
    <View style={styles.iconContainer}>
      <Icon name="wb-sunny" size={80} color={COLORS.accentBurntOrange} />
    </View>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
  </View>
);

const NameStep = ({ step, userData, setUserData }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    <TextInput
      style={styles.textInput}
      value={userData.name}
      onChangeText={(text) => setUserData({ ...userData, name: text })}
      placeholder="Enter your name"
      placeholderTextColor={COLORS.gray}
    />
  </View>
);

const ToneStep = ({ step, userData, setUserData, tones }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    <View style={styles.optionsContainer}>
      {tones.map((tone) => (
        <TouchableOpacity
          key={tone.id}
          style={[
            styles.optionCard,
            userData.preferredTone === tone.id && styles.optionCardSelected,
          ]}
          onPress={() => setUserData({ ...userData, preferredTone: tone.id })}
        >
          <Icon name={tone.icon} size={32} color={tone.color} />
          <Text style={styles.optionTitle}>{tone.title}</Text>
          <Text style={styles.optionDescription}>{tone.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const HobbiesStep = ({ step, userData, setUserData, hobbyOptions }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    <View style={styles.chipContainer}>
      {hobbyOptions.slice(0, 20).map((hobby) => (
        <TouchableOpacity
          key={hobby}
          style={[
            styles.chip,
            userData.hobbies.includes(hobby) && styles.chipSelected,
          ]}
          onPress={() => {
            const updatedHobbies = userData.hobbies.includes(hobby)
              ? userData.hobbies.filter((h) => h !== hobby)
              : [...userData.hobbies, hobby];
            setUserData({ ...userData, hobbies: updatedHobbies });
          }}
        >
          <Text
            style={[
              styles.chipText,
              userData.hobbies.includes(hobby) && styles.chipTextSelected,
            ]}
          >
            {hobby}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const GoalsStep = ({ step, userData, setUserData, goalOptions }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    <View style={styles.chipContainer}>
      {goalOptions.slice(0, 20).map((goal) => (
        <TouchableOpacity
          key={goal}
          style={[
            styles.chip,
            userData.personalGoals.includes(goal) && styles.chipSelected,
          ]}
          onPress={() => {
            const updatedGoals = userData.personalGoals.includes(goal)
              ? userData.personalGoals.filter((g) => g !== goal)
              : [...userData.personalGoals, goal];
            setUserData({ ...userData, personalGoals: updatedGoals });
          }}
        >
          <Text
            style={[
              styles.chipText,
              userData.personalGoals.includes(goal) && styles.chipTextSelected,
            ]}
          >
            {goal}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const VoiceStep = ({ step, userData, setUserData, wakeStyles }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
    <View style={styles.optionsContainer}>
      {wakeStyles.map((style) => (
        <TouchableOpacity
          key={style.id}
          style={[
            styles.optionCard,
            userData.wakeStylePreference === style.id && styles.optionCardSelected,
          ]}
          onPress={() => setUserData({ ...userData, wakeStylePreference: style.id })}
        >
          <Icon name={style.icon} size={32} color={COLORS.accentBurntOrange} />
          <Text style={styles.optionTitle}>{style.title}</Text>
          <Text style={styles.optionDescription}>{style.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const CompleteStep = ({ step }) => (
  <View style={styles.stepContainer}>
    <View style={styles.iconContainer}>
      <Icon name="celebration" size={80} color={COLORS.accentBurntOrange} />
    </View>
    <Text style={styles.stepTitle}>{step.title}</Text>
    <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: THEME.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: 2,
  },
  progressText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: THEME.typography.fontSize.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  iconContainer: {
    marginBottom: THEME.spacing.lg,
  },
  stepTitle: {
    fontSize: THEME.typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  stepSubtitle: {
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: THEME.spacing.xl,
    lineHeight: THEME.typography.lineHeight.relaxed,
  },
  textInput: {
    width: '100%',
    height: THEME.layout.inputHeight,
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.black,
    ...THEME.shadows.sm,
  },
  optionsContainer: {
    width: '100%',
    gap: THEME.spacing.md,
  },
  optionCard: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  optionCardSelected: {
    backgroundColor: COLORS.softLilac,
    borderColor: COLORS.accentBurntOrange,
    borderWidth: 2,
  },
  optionTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
  },
  optionDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  chipSelected: {
    backgroundColor: COLORS.accentBurntOrange,
    borderColor: COLORS.accentBurntOrange,
  },
  chipText: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
  },
  backButtonText: {
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.gray,
    marginLeft: THEME.spacing.xs,
  },
  nextButton: {
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...THEME.shadows.md,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  nextButtonText: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: THEME.spacing.sm,
  },
});

export default OnboardingScreen; 