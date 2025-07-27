import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  StatusBar 
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const toneOptions = [
  'motivational',
  'gentle',
  'humorous',
  'mid-delicate',
  'energetic'
];

const wakeStyleOptions = [
  'gradual',
  'immediate',
  'mixed'
];

const hobbyCategories = [
  {
    category: 'Sports & Fitness',
    icon: '🏃‍♂️',
    hobbies: ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Basketball', 'Soccer', 'Tennis', 'Hiking', 'Dancing']
  },
  {
    category: 'Creative Arts',
    icon: '🎨',
    hobbies: ['Painting', 'Drawing', 'Sketching', 'Photography', 'Crafting', 'Knitting', 'Sewing', 'DIY Projects', 'Calligraphy', 'Origami']
  },
  {
    category: 'Music & Entertainment',
    icon: '🎵',
    hobbies: ['Playing Guitar', 'Piano', 'Singing', 'Listening to Music', 'Podcasts', 'Watching Movies', 'Gaming', 'Reading', 'Writing', 'Podcasting']
  },
  {
    category: 'Technology',
    icon: '💻',
    hobbies: ['Coding', 'Web Development', 'App Development', 'Gaming', 'Tech Reviews', 'Learning New Software', 'Building Projects', 'AI/ML', 'Data Science', 'Cybersecurity']
  },
  {
    category: 'Cooking & Food',
    icon: '👨‍🍳',
    hobbies: ['Cooking', 'Baking', 'Recipe Development', 'Food Photography', 'Wine Tasting', 'Coffee Brewing', 'Meal Planning', 'Gardening', 'Fermentation', 'Food Blogging']
  },
  {
    category: 'Travel & Adventure',
    icon: '✈️',
    hobbies: ['Traveling', 'Backpacking', 'Road Trips', 'Photography', 'Language Learning', 'Cultural Exchange', 'Hiking', 'Camping', 'Scuba Diving', 'Rock Climbing']
  }
];

export default function PreferencesScreen() {
  const { userProfile, updateProfile } = useAuth();
  const [selectedTone, setSelectedTone] = useState(userProfile?.preferredTone || 'mid-delicate');
  const [selectedWakeStyle, setSelectedWakeStyle] = useState(userProfile?.wakeStylePreference || 'mixed');
  const [selectedHobbies, setSelectedHobbies] = useState(userProfile?.hobbies || []);
  const [customHobby, setCustomHobby] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setSelectedTone(userProfile.preferredTone || 'mid-delicate');
      setSelectedWakeStyle(userProfile.wakeStylePreference || 'mixed');
      setSelectedHobbies(userProfile.hobbies || []);
    }
  }, [userProfile]);

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
  };

  const handleWakeStyleSelect = (style) => {
    setSelectedWakeStyle(style);
  };

  const handleHobbyToggle = (hobby) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(h => h !== hobby);
      } else {
        return [...prev, hobby];
      }
    });
  };

  const handleAddCustomHobby = () => {
    if (customHobby.trim() && !selectedHobbies.includes(customHobby.trim())) {
      setSelectedHobbies(prev => [...prev, customHobby.trim()]);
      setCustomHobby('');
    }
  };

  const handleRemoveHobby = (hobby) => {
    setSelectedHobbies(prev => prev.filter(h => h !== hobby));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        preferredTone: selectedTone,
        wakeStylePreference: selectedWakeStyle,
        hobbies: selectedHobbies
      });
      Alert.alert('Success', 'Preferences updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentHobbies = hobbyCategories[selectedCategory]?.hobbies || [];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#55786f" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Preferences</Text>
        <Text style={styles.subtitle}>Customize your wake-up experience</Text>
      </View>

      {/* Tone Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎭 Preferred Tone</Text>
        <Text style={styles.sectionSubtitle}>Choose how you want to be woken up</Text>
        <View style={styles.optionsContainer}>
          {toneOptions.map((tone) => (
            <TouchableOpacity
              key={tone}
              style={[
                styles.optionChip,
                selectedTone === tone && styles.optionChipSelected
              ]}
              onPress={() => handleToneSelect(tone)}
            >
              <Text style={[
                styles.optionText,
                selectedTone === tone && styles.optionTextSelected
              ]}>
                {tone.replace('-', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Wake Style Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌅 Wake Style</Text>
        <Text style={styles.sectionSubtitle}>How would you like to be awakened?</Text>
        <View style={styles.optionsContainer}>
          {wakeStyleOptions.map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.optionChip,
                selectedWakeStyle === style && styles.optionChipSelected
              ]}
              onPress={() => handleWakeStyleSelect(style)}
            >
              <Text style={[
                styles.optionText,
                selectedWakeStyle === style && styles.optionTextSelected
              ]}>
                {style.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hobbies Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Your Hobbies</Text>
        <Text style={styles.sectionSubtitle}>Select hobbies for personalized messages</Text>
        
        {/* Selected Hobbies Display */}
        {selectedHobbies.length > 0 && (
          <View style={styles.selectedHobbiesContainer}>
            <Text style={styles.selectedHobbiesTitle}>Selected Hobbies:</Text>
            <View style={styles.selectedHobbiesList}>
              {selectedHobbies.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  style={styles.selectedHobbyChip}
                  onPress={() => handleRemoveHobby(hobby)}
                >
                  <Text style={styles.selectedHobbyText}>{hobby} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Category Tabs */}
        <View style={styles.categoryTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hobbyCategories.map((category, index) => (
              <TouchableOpacity
                key={category.category}
                style={[
                  styles.categoryTab,
                  selectedCategory === index && styles.categoryTabActive
                ]}
                onPress={() => setSelectedCategory(index)}
              >
                <Text style={styles.categoryTabIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === index && styles.categoryTabTextActive
                ]}>
                  {category.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Hobbies Grid */}
        <View style={styles.hobbiesGridContainer}>
          <ScrollView style={styles.hobbiesListContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.hobbiesGrid}>
              {currentHobbies.map((hobby) => (
                <TouchableOpacity
                  key={hobby}
                  style={[
                    styles.hobbyChip,
                    selectedHobbies.includes(hobby) && styles.hobbyChipSelected
                  ]}
                  onPress={() => handleHobbyToggle(hobby)}
                >
                  <Text style={[
                    styles.hobbyChipText,
                    selectedHobbies.includes(hobby) && styles.hobbyChipTextSelected
                  ]}>
                    {hobby}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Custom Hobby Input */}
        <View style={styles.customHobbyContainer}>
          <Text style={styles.customHobbyTitle}>Add your own hobby:</Text>
          <View style={styles.customHobbyInputContainer}>
            <TextInput
              style={styles.customHobbyInput}
              placeholder="Type a hobby and press +"
              placeholderTextColor="#999"
              value={customHobby}
              onChangeText={setCustomHobby}
              onSubmitEditing={handleAddCustomHobby}
            />
            <TouchableOpacity
              style={styles.addHobbyButton}
              onPress={handleAddCustomHobby}
            >
              <Text style={styles.addHobbyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf6ec',
  },
  header: {
    backgroundColor: '#55786f',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#f2d1d1',
  },
  section: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionChipSelected: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  selectedHobbiesContainer: {
    marginBottom: 15,
  },
  selectedHobbiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedHobbiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedHobbyChip: {
    backgroundColor: '#e07a5f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  selectedHobbyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTabsContainer: {
    marginBottom: 15,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  categoryTabActive: {
    backgroundColor: '#55786f',
  },
  categoryTabIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  categoryTabText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#ffffff',
  },
  hobbiesGridContainer: {
    marginBottom: 15,
  },
  hobbiesListContainer: {
    maxHeight: 200,
  },
  hobbiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  hobbyChipSelected: {
    backgroundColor: '#55786f',
    borderColor: '#55786f',
  },
  hobbyChipText: {
    fontSize: 12,
    color: '#333',
  },
  hobbyChipTextSelected: {
    color: '#ffffff',
  },
  customHobbyContainer: {
    marginTop: 10,
  },
  customHobbyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  customHobbyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customHobbyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  addHobbyButton: {
    backgroundColor: '#55786f',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addHobbyButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#55786f',
    margin: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 