import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Improved hobbies with categories
  const hobbyCategories = [
    {
      category: 'Sports & Fitness',
      icon: 'fitness-center',
      hobbies: [
        'Running', 'Cycling', 'Swimming', 'Hiking', 'Yoga', 'Pilates',
        'Weightlifting', 'CrossFit', 'Basketball', 'Soccer', 'Tennis',
        'Golf', 'Volleyball', 'Badminton', 'Table Tennis', 'Rock Climbing',
        'Bouldering', 'Surfing', 'Snowboarding', 'Skiing', 'Skateboarding',
        'Parkour', 'Martial Arts', 'Boxing', 'Kickboxing', 'Jiu-Jitsu',
        'Karate', 'Taekwondo', 'Wrestling', 'Gymnastics', 'Dance',
        'Ballet', 'Jazz', 'Hip Hop', 'Contemporary', 'Ballroom',
        'Salsa', 'Bachata', 'Swing', 'Tango', 'Waltz'
      ]
    },
    {
      category: 'Creative Arts',
      icon: 'palette',
      hobbies: [
        'Painting', 'Drawing', 'Sketching', 'Digital Art', 'Photography',
        'Videography', 'Sculpting', 'Pottery', 'Ceramics', 'Crafting',
        'Knitting', 'Crocheting', 'Sewing', 'Embroidery', 'Quilting',
        'Woodworking', 'Carpentry', 'Jewelry Making', 'Beading',
        'Calligraphy', 'Typography', 'Graphic Design', 'Web Design',
        'Animation', 'Film Making', 'Music Production', 'Songwriting',
        'Playing Guitar', 'Playing Piano', 'Playing Drums', 'Singing',
        'Acting', 'Stand-up Comedy', 'Magic', 'Juggling'
      ]
    },
    {
      category: 'Entertainment',
      icon: 'movie',
      hobbies: [
        'Reading', 'Writing', 'Blogging', 'Journaling', 'Poetry',
        'Gaming', 'Board Games', 'Card Games', 'Puzzles', 'Chess',
        'Poker', 'Video Games', 'Mobile Games', 'PC Gaming',
        'Console Gaming', 'VR Gaming', 'Watching Movies', 'TV Shows',
        'Anime', 'Manga', 'Comics', 'Podcasts', 'Audiobooks',
        'Karaoke', 'Dancing', 'Concerts', 'Theater', 'Museums',
        'Art Galleries', 'Theme Parks', 'Escape Rooms', 'Arcades'
      ]
    },
    {
      category: 'Food & Drink',
      icon: 'restaurant',
      hobbies: [
        'Cooking', 'Baking', 'Grilling', 'BBQ', 'Wine Tasting',
        'Beer Brewing', 'Coffee Roasting', 'Tea Ceremony', 'Mixology',
        'Cocktail Making', 'Food Photography', 'Recipe Development',
        'Meal Planning', 'Fermentation', 'Pickling', 'Canning',
        'Gardening', 'Herb Growing', 'Urban Farming', 'Foraging',
        'Food Blogging', 'Restaurant Reviews', 'Food Tours',
        'Cooking Classes', 'Wine Pairing', 'Cheese Tasting'
      ]
    },
    {
      category: 'Technology',
      icon: 'computer',
      hobbies: [
        'Programming', 'Coding', 'Web Development', 'App Development',
        'Game Development', 'Data Science', 'Machine Learning',
        'AI/ML', 'Robotics', '3D Printing', 'Electronics', 'Arduino',
        'Raspberry Pi', 'Drone Flying', 'Photography', 'Videography',
        'Video Editing', 'Photo Editing', 'Graphic Design',
        'UI/UX Design', 'Cybersecurity', 'Blockchain', 'Cryptocurrency',
        'Virtual Reality', 'Augmented Reality', 'IoT Projects'
      ]
    },
    {
      category: 'Outdoor & Nature',
      icon: 'nature',
      hobbies: [
        'Hiking', 'Camping', 'Backpacking', 'Rock Climbing', 'Mountain Biking',
        'Bird Watching', 'Wildlife Photography', 'Nature Photography',
        'Fishing', 'Hunting', 'Kayaking', 'Canoeing', 'Rafting',
        'Sailing', 'Scuba Diving', 'Snorkeling', 'Beach Activities',
        'Gardening', 'Urban Farming', 'Bonsai', 'Flower Arranging',
        'Stargazing', 'Astronomy', 'Geocaching', 'Orienteering',
        'Trail Running', 'Ultra Running', 'Triathlon', 'Adventure Racing'
      ]
    },
    {
      category: 'Learning & Education',
      icon: 'school',
      hobbies: [
        'Learning Languages', 'Duolingo', 'Rosetta Stone', 'Online Courses',
        'Coursera', 'Udemy', 'Khan Academy', 'TED Talks', 'Documentaries',
        'History', 'Science', 'Philosophy', 'Psychology', 'Economics',
        'Politics', 'Current Events', 'News Reading', 'Research',
        'Academic Writing', 'Thesis Writing', 'Book Clubs', 'Debate',
        'Public Speaking', 'Toastmasters', 'Teaching', 'Tutoring',
        'Mentoring', 'Volunteering', 'Community Service'
      ]
    },
    {
      category: 'Lifestyle & Wellness',
      icon: 'self-improvement',
      hobbies: [
        'Meditation', 'Mindfulness', 'Yoga', 'Tai Chi', 'Qigong',
        'Breathing Exercises', 'Journaling', 'Gratitude Practice',
        'Goal Setting', 'Habit Tracking', 'Productivity', 'Time Management',
        'Minimalism', 'Decluttering', 'Organization', 'Planning',
        'Bullet Journaling', 'Scrapbooking', 'Memory Keeping',
        'Self-Care', 'Spa Activities', 'Massage', 'Aromatherapy',
        'Essential Oils', 'Herbal Medicine', 'Natural Remedies',
        'Fitness Tracking', 'Health Monitoring', 'Nutrition'
      ]
    }
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
        return <HobbiesStep step={step} userData={userData} setUserData={setUserData} hobbyCategories={hobbyCategories} />;
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
        return userData.name.trim().length >= 2;
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

const NameStep = ({ step, userData, setUserData }) => {
  const [isValid, setIsValid] = useState(true);

  const handleNameChange = (text) => {
    setUserData({ ...userData, name: text });
    setIsValid(text.trim().length >= 2);
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            !isValid && userData.name.length > 0 && styles.textInputError
          ]}
          value={userData.name}
          onChangeText={handleNameChange}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.gray}
          autoFocus
          autoCapitalize="words"
          maxLength={50}
        />
        {!isValid && userData.name.length > 0 && (
          <Text style={styles.errorText}>Name must be at least 2 characters</Text>
        )}
        {userData.name.length > 0 && isValid && (
          <Text style={styles.successText}>✓ Great name!</Text>
        )}
      </View>
    </View>
  );
};

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

const HobbiesStep = ({ step, userData, setUserData, hobbyCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [customHobby, setCustomHobby] = useState('');

  const handleHobbyToggle = (hobby) => {
    const updatedHobbies = userData.hobbies.includes(hobby)
      ? userData.hobbies.filter((h) => h !== hobby)
      : [...userData.hobbies, hobby];
    setUserData({ ...userData, hobbies: updatedHobbies });
  };

  const currentHobbies = hobbyCategories[selectedCategory]?.hobbies || [];
  const filteredHobbies = currentHobbies.filter(hobby =>
    hobby.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      
      {/* Selected Hobbies Display */}
      {userData.hobbies.length > 0 && (
        <View style={styles.selectedHobbiesContainer}>
          <Text style={styles.selectedHobbiesTitle}>Selected Hobbies:</Text>
          <View style={styles.selectedHobbiesList}>
            {userData.hobbies.map((hobby) => (
              <TouchableOpacity
                key={hobby}
                style={styles.selectedHobbyChip}
                onPress={() => handleHobbyToggle(hobby)}
              >
                <Text style={styles.selectedHobbyText}>{hobby}</Text>
                <Icon name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hobbies..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hobbyCategories.map((category, index) => (
            <TouchableOpacity
              key={category.category}
              style={[
                styles.categoryTab,
                selectedCategory === index && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(index)}
            >
              <Icon 
                name={category.icon} 
                size={20} 
                color={selectedCategory === index ? COLORS.white : COLORS.gray} 
              />
              <Text style={[
                styles.categoryTabText,
                selectedCategory === index && styles.categoryTabTextActive,
              ]}>
                {category.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Hobbies List */}
      <ScrollView style={styles.hobbiesListContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.hobbiesGrid}>
          {filteredHobbies.map((hobby) => (
            <TouchableOpacity
              key={hobby}
              style={[
                styles.hobbyChip,
                userData.hobbies.includes(hobby) && styles.hobbyChipSelected,
              ]}
              onPress={() => handleHobbyToggle(hobby)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.hobbyChipText,
                  userData.hobbies.includes(hobby) && styles.hobbyChipTextSelected,
                ]}
              >
                {hobby}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Custom Hobby Input */}
        <View style={styles.customHobbyContainer}>
          <Text style={styles.customHobbyTitle}>Add your own hobby:</Text>
          <View style={styles.customHobbyInputContainer}>
            <TextInput
              style={styles.customHobbyInput}
              placeholder="Type a hobby and press +"
              placeholderTextColor={COLORS.gray}
              value={customHobby}
              onChangeText={setCustomHobby}
              onSubmitEditing={() => {
                if (customHobby.trim() && !userData.hobbies.includes(customHobby.trim())) {
                  handleHobbyToggle(customHobby.trim());
                  setCustomHobby('');
                }
              }}
            />
            <TouchableOpacity
              style={styles.addHobbyButton}
              onPress={() => {
                if (customHobby.trim() && !userData.hobbies.includes(customHobby.trim())) {
                  handleHobbyToggle(customHobby.trim());
                  setCustomHobby('');
                }
              }}
            >
              <Icon name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const GoalsStep = ({ step, userData, setUserData, goalOptions }) => {
  const [searchText, setSearchText] = useState('');
  
  const filteredGoals = goalOptions.filter(goal =>
    goal.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleGoalToggle = (goal) => {
    const updatedGoals = userData.personalGoals.includes(goal)
      ? userData.personalGoals.filter((g) => g !== goal)
      : [...userData.personalGoals, goal];
    setUserData({ ...userData, personalGoals: updatedGoals });
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search goals..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      {/* Selected Goals Display */}
      {userData.personalGoals.length > 0 && (
        <View style={styles.selectedGoalsContainer}>
          <Text style={styles.selectedGoalsTitle}>Selected Goals:</Text>
          <View style={styles.selectedGoalsList}>
            {userData.personalGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={styles.selectedGoalChip}
                onPress={() => handleGoalToggle(goal)}
              >
                <Text style={styles.selectedGoalText}>{goal}</Text>
                <Icon name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Goals Grid */}
      <View style={styles.goalsGridContainer}>
        <FlatList
          data={filteredGoals}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.goalChip,
                userData.personalGoals.includes(item) && styles.goalChipSelected,
              ]}
              onPress={() => handleGoalToggle(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.goalChipText,
                  userData.personalGoals.includes(item) && styles.goalChipTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.goalsGrid}
        />
      </View>
    </View>
  );
};

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
  inputContainer: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: THEME.layout.inputHeight,
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    ...THEME.shadows.sm,
  },
  textInputError: {
    borderColor: '#ff6b6b',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: THEME.typography.fontSize.sm,
    marginTop: THEME.spacing.xs,
    marginLeft: THEME.spacing.sm,
  },
  successText: {
    color: '#51cf66',
    fontSize: THEME.typography.fontSize.sm,
    marginTop: THEME.spacing.xs,
    marginLeft: THEME.spacing.sm,
    fontWeight: 'bold',
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
  // Selected Hobbies/Goals Display
  selectedHobbiesContainer: {
    marginBottom: THEME.spacing.lg,
  },
  selectedHobbiesTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginBottom: THEME.spacing.sm,
  },
  selectedHobbiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  selectedHobbyChip: {
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  selectedHobbyText: {
    color: COLORS.white,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: 'bold',
  },
  selectedGoalsContainer: {
    marginBottom: THEME.spacing.lg,
  },
  selectedGoalsTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginBottom: THEME.spacing.sm,
  },
  selectedGoalsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  selectedGoalChip: {
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  selectedGoalText: {
    color: COLORS.white,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: 'bold',
  },

  // Category Tabs
  categoryTabsContainer: {
    marginBottom: THEME.spacing.lg,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    marginRight: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  categoryTabActive: {
    backgroundColor: COLORS.accentBurntOrange,
    borderColor: COLORS.accentBurntOrange,
  },
  categoryTabText: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
    marginLeft: THEME.spacing.xs,
  },
  categoryTabTextActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.black,
    paddingVertical: THEME.spacing.md,
  },

  // Hobbies List Container
  hobbiesListContainer: {
    flex: 1,
    marginTop: THEME.spacing.md,
  },
  hobbiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: THEME.spacing.lg,
  },
  goalsGridContainer: {
    flex: 1,
  },
  goalsGrid: {
    paddingBottom: THEME.spacing.lg,
  },

  // Hobby and Goal Chips
  hobbyChip: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    margin: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    width: '48%',
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hobbyChipSelected: {
    backgroundColor: COLORS.accentBurntOrange,
    borderColor: COLORS.accentBurntOrange,
  },
  hobbyChipText: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
    textAlign: 'center',
  },
  hobbyChipTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  goalChip: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    margin: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalChipSelected: {
    backgroundColor: COLORS.accentBurntOrange,
    borderColor: COLORS.accentBurntOrange,
  },
  goalChipText: {
    fontSize: THEME.typography.fontSize.sm,
    color: COLORS.gray,
    textAlign: 'center',
  },
  goalChipTextSelected: {
    color: COLORS.white,
    fontWeight: 'bold',
  },

  // Custom Hobby Input
  customHobbyContainer: {
    marginTop: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.md,
  },
  customHobbyTitle: {
    fontSize: THEME.typography.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.forestGreen,
    marginBottom: THEME.spacing.sm,
  },
  customHobbyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  customHobbyInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
    fontSize: THEME.typography.fontSize.lg,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  addHobbyButton: {
    backgroundColor: COLORS.accentBurntOrange,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  chip: {
    backgroundColor: COLORS.white,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginRight: THEME.spacing.sm, // Add some margin for horizontal scroll
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