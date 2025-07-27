import * as ImagePicker from 'expo-image-picker';
import { ChallengeObject, ChallengeAttempt } from '../types';

class ChallengeModeService {
  constructor() {
    this.challengeObjects = this.initializeChallengeObjects();
    this.timeLimit = 60; // Default 60 seconds
    this.maxAttempts = 3;
  }

  /**
   * Initialize the predefined challenge objects with detection keywords
   */
  initializeChallengeObjects() {
    return [
      {
        name: 'microwave',
        alternatives: ['micro', 'microwave oven', 'kitchen microwave'],
        description: 'The kitchen appliance used for heating food',
        detectionKeywords: ['microwave', 'oven', 'kitchen', 'appliance', 'cooking', 'heating']
      },
      {
        name: 'refrigerator',
        alternatives: ['fridge', 'refrigerator', 'icebox', 'freezer'],
        description: 'The large kitchen appliance for keeping food cold',
        detectionKeywords: ['refrigerator', 'fridge', 'freezer', 'kitchen', 'appliance', 'cold', 'ice']
      },
      {
        name: 'toothbrush',
        alternatives: ['toothbrush', 'tooth brush', 'dental brush'],
        description: 'The small brush used for cleaning teeth',
        detectionKeywords: ['toothbrush', 'brush', 'dental', 'teeth', 'bathroom', 'hygiene']
      },
      {
        name: 'shoes',
        alternatives: ['shoes', 'sneakers', 'boots', 'footwear'],
        description: 'Footwear worn on feet',
        detectionKeywords: ['shoes', 'sneakers', 'boots', 'footwear', 'sandals', 'foot']
      },
      {
        name: 'mirror',
        alternatives: ['mirror', 'looking glass', 'reflection'],
        description: 'A reflective surface, usually glass',
        detectionKeywords: ['mirror', 'reflection', 'glass', 'bathroom', 'vanity']
      },
      {
        name: 'television',
        alternatives: ['tv', 'television', 'telly', 'screen'],
        description: 'The electronic device for watching programs',
        detectionKeywords: ['television', 'tv', 'screen', 'monitor', 'display', 'entertainment']
      },
      {
        name: 'door handle',
        alternatives: ['door handle', 'doorknob', 'door knob', 'handle'],
        description: 'The handle used to open and close doors',
        detectionKeywords: ['door', 'handle', 'knob', 'entrance', 'exit', 'room']
      },
      {
        name: 'coffee mug',
        alternatives: ['mug', 'coffee mug', 'cup', 'coffee cup'],
        description: 'A drinking vessel, usually for hot beverages',
        detectionKeywords: ['mug', 'cup', 'coffee', 'drink', 'beverage', 'kitchen']
      },
      {
        name: 'book',
        alternatives: ['book', 'novel', 'textbook', 'publication'],
        description: 'A collection of written or printed pages',
        detectionKeywords: ['book', 'pages', 'text', 'reading', 'literature', 'paper']
      },
      {
        name: 'lamp',
        alternatives: ['lamp', 'light', 'table lamp', 'desk lamp'],
        description: 'A device that produces light',
        detectionKeywords: ['lamp', 'light', 'bulb', 'illumination', 'lighting', 'fixture']
      }
    ];
  }

  /**
   * Start a new challenge by selecting a random object
   */
  async startChallenge(alarmHistoryId, customTimeLimit = null) {
    try {
      // Request camera permissions
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        throw new Error('Camera permission is required for challenge mode');
      }

      // Select a random object for the challenge
      const randomObject = this.challengeObjects[
        Math.floor(Math.random() * this.challengeObjects.length)
      ];

      const challenge = {
        id: this.generateChallengeId(),
        alarmHistoryId,
        objectToFind: randomObject.name,
        timeLimit: customTimeLimit || this.timeLimit,
        isCompleted: false,
        attempts: [],
        createdAt: new Date()
      };

      return {
        challenge,
        objectDescription: randomObject.description,
        voiceInstruction: this.generateVoiceInstruction(randomObject)
      };

    } catch (error) {
      console.error('Error starting challenge:', error);
      throw error;
    }
  }

  /**
   * Generate voice instruction for the challenge
   */
  generateVoiceInstruction(challengeObject) {
    const instructions = [
      `Alright, no more snoozing! I need you to take a picture of your ${challengeObject.name}. No cheating - it must be live from your camera.`,
      `Challenge time! Find your ${challengeObject.name} and take a photo. You have 60 seconds to complete this task.`,
      `Wake-up verification required! Please photograph your ${challengeObject.name}. Remember, no gallery photos allowed.`,
      `Time to prove you're awake! Snap a picture of your ${challengeObject.name}. The camera is waiting.`
    ];

    return instructions[Math.floor(Math.random() * instructions.length)];
  }

  /**
   * Capture photo for challenge verification
   */
  async capturePhoto() {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
        exif: true // Include metadata to verify it's not from gallery
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Verify this is a fresh photo (not from gallery)
        if (this.isPhotoFromGallery(asset)) {
          throw new Error('Please use the camera to take a fresh photo, not from your gallery');
        }

        return {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          timestamp: new Date()
        };
      }

      return null;
    } catch (error) {
      console.error('Error capturing photo:', error);
      throw error;
    }
  }

  /**
   * Check if photo is from gallery (basic heuristic)
   */
  isPhotoFromGallery(asset) {
    // Basic check - if there's no exif data or the timestamp is too old
    const now = new Date();
    const assetTime = asset.exif?.DateTime ? new Date(asset.exif.DateTime) : now;
    const timeDifference = now - assetTime;
    
    // If photo is more than 2 minutes old, consider it from gallery
    return timeDifference > 2 * 60 * 1000;
  }

  /**
   * Verify the captured image contains the target object
   */
  async verifyChallenge(imageUri, targetObject, challengeId) {
    try {
      // For now, we'll use a simple mock detection
      // In production, this would integrate with TensorFlow.js or a cloud vision API
      const detectedObjects = await this.detectObjects(imageUri);
      
      const targetObjectData = this.challengeObjects.find(obj => obj.name === targetObject);
      if (!targetObjectData) {
        throw new Error(`Target object not found: ${targetObject}`);
      }

      // Check if any detected objects match the target
      const isCorrect = this.isObjectDetected(detectedObjects, targetObjectData);
      const confidence = this.calculateConfidence(detectedObjects, targetObjectData);

      const attempt = {
        id: this.generateAttemptId(),
        imageUrl: imageUri,
        detectedObjects: detectedObjects.map(obj => obj.label),
        isCorrect,
        confidence,
        timestamp: new Date()
      };

      return {
        attempt,
        isCorrect,
        confidence,
        detectedObjects: detectedObjects,
        feedback: this.generateFeedback(isCorrect, targetObject, detectedObjects)
      };

    } catch (error) {
      console.error('Error verifying challenge:', error);
      throw error;
    }
  }

  /**
   * Mock object detection (replace with actual ML model)
   */
  async detectObjects(imageUri) {
    // This is a mock implementation
    // In production, integrate with TensorFlow.js, Google Vision API, or similar
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock detection results based on common objects
    const mockDetections = [
      { label: 'person', confidence: 0.9 },
      { label: 'kitchen', confidence: 0.7 },
      { label: 'appliance', confidence: 0.6 },
      { label: 'room', confidence: 0.8 },
      { label: 'furniture', confidence: 0.5 }
    ];

    // Add some randomness to simulate real detection
    const randomObjects = ['microwave', 'refrigerator', 'book', 'shoes', 'mirror', 'door', 'lamp'];
    if (Math.random() > 0.3) {
      const randomObj = randomObjects[Math.floor(Math.random() * randomObjects.length)];
      mockDetections.push({ label: randomObj, confidence: Math.random() * 0.8 + 0.2 });
    }

    return mockDetections;
  }

  /**
   * Check if the target object is detected in the results
   */
  isObjectDetected(detectedObjects, targetObjectData) {
    const allPossibleNames = [
      targetObjectData.name,
      ...targetObjectData.alternatives,
      ...targetObjectData.detectionKeywords
    ].map(name => name.toLowerCase());

    return detectedObjects.some(detection => {
      const detectionLabel = detection.label.toLowerCase();
      return allPossibleNames.some(name => 
        detectionLabel.includes(name) || name.includes(detectionLabel)
      );
    });
  }

  /**
   * Calculate confidence score for the detection
   */
  calculateConfidence(detectedObjects, targetObjectData) {
    const relevantDetection = detectedObjects.find(detection => {
      const detectionLabel = detection.label.toLowerCase();
      const allNames = [targetObjectData.name, ...targetObjectData.alternatives]
        .map(name => name.toLowerCase());
      
      return allNames.some(name => 
        detectionLabel.includes(name) || name.includes(detectionLabel)
      );
    });

    return relevantDetection ? relevantDetection.confidence : 0;
  }

  /**
   * Generate feedback message based on detection results
   */
  generateFeedback(isCorrect, targetObject, detectedObjects) {
    if (isCorrect) {
      const successMessages = [
        `Perfect! I can see your ${targetObject}. Challenge completed! 🎉`,
        `Great job! That's definitely a ${targetObject}. You're officially awake! ✅`,
        `Success! Your ${targetObject} has been verified. Time to start your day! 🌟`,
        `Excellent! Challenge completed. Your ${targetObject} looks great! 👏`
      ];
      return successMessages[Math.floor(Math.random() * successMessages.length)];
    } else {
      const detectedLabels = detectedObjects.map(obj => obj.label).join(', ');
      const failureMessages = [
        `Hmm, I can see ${detectedLabels}, but no ${targetObject}. Try again! 🤔`,
        `I don't see a ${targetObject} in this photo. I found: ${detectedLabels}. Give it another shot! 📸`,
        `Close, but not quite! I see ${detectedLabels}. Look for your ${targetObject} and try again. 🔍`,
        `That's not a ${targetObject} - I'm seeing ${detectedLabels}. Keep looking! 👀`
      ];
      return failureMessages[Math.floor(Math.random() * failureMessages.length)];
    }
  }

  /**
   * Complete a challenge and update statistics
   */
  async completeChallenge(challengeId, isSuccessful, totalAttempts) {
    try {
      const completionData = {
        challengeId,
        isCompleted: isSuccessful,
        completedAt: isSuccessful ? new Date() : null,
        totalAttempts,
        success: isSuccessful
      };

      // Generate completion voice message
      const voiceMessage = this.generateCompletionMessage(isSuccessful, totalAttempts);

      return {
        completionData,
        voiceMessage,
        experience: isSuccessful ? this.calculateExperienceReward(totalAttempts) : 0
      };

    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }

  /**
   * Generate completion voice message
   */
  generateCompletionMessage(isSuccessful, attempts) {
    if (isSuccessful) {
      if (attempts === 1) {
        return "Wow! First try! You're definitely awake and ready to conquer the day! 🏆";
      } else if (attempts === 2) {
        return "Nice work! Second attempt success. That snooze button won't fool you anymore! 💪";
      } else {
        return "Finally! Third time's the charm. Now let's channel this determination into your day! 🎯";
      }
    } else {
      return "Challenge time expired, but I admire your effort! The alarm is still going to stop, but let's work on those wake-up skills! 😊";
    }
  }

  /**
   * Calculate experience reward based on performance
   */
  calculateExperienceReward(attempts) {
    switch (attempts) {
      case 1: return 50; // Perfect score
      case 2: return 30; // Good score
      case 3: return 15; // Basic completion
      default: return 5;  // Participation
    }
  }

  /**
   * Get random challenge object for preview
   */
  getRandomChallengeObject() {
    return this.challengeObjects[Math.floor(Math.random() * this.challengeObjects.length)];
  }

  /**
   * Get all available challenge objects
   */
  getAllChallengeObjects() {
    return this.challengeObjects;
  }

  /**
   * Generate unique challenge ID
   */
  generateChallengeId() {
    return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique attempt ID
   */
  generateAttemptId() {
    return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if challenge mode should be triggered
   */
  shouldTriggerChallenge(snoozeCount, maxSnoozes, challengeModeEnabled) {
    return challengeModeEnabled && snoozeCount >= Math.min(3, maxSnoozes);
  }

  /**
   * Get challenge instructions for UI display
   */
  getChallengeInstructions(objectName) {
    return {
      title: "Wake-Up Challenge! 📸",
      instruction: `Find your ${objectName} and take a photo`,
      rules: [
        "Use your camera (no gallery photos)",
        "Make sure the object is clearly visible",
        "You have 60 seconds to complete this",
        "3 attempts maximum"
      ],
      tips: [
        "Good lighting helps with detection",
        "Get close enough for a clear shot",
        "Make sure the entire object is in frame"
      ]
    };
  }
}

export default ChallengeModeService;