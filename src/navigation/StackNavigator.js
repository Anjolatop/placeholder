import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import main tab navigator
import TabNavigator from './TabNavigator';

// Import new screens
import VoicePersonaScreen from '../screens/VoicePersonaScreen';
import ChallengeModeScreen from '../screens/ChallengeModeScreen';

// Import existing screens that might be accessed from stack navigation
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {/* Main Tab Navigator */}
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      
      {/* Onboarding Flow */}
      <Stack.Screen 
        name="Onboarding" 
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      
      {/* Voice Persona Selection */}
      <Stack.Screen 
        name="VoicePersonaSelection" 
        component={VoicePersonaScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          presentation: 'modal',
        }}
      />
      
      {/* Challenge Mode */}
      <Stack.Screen 
        name="ChallengeMode" 
        component={ChallengeModeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable gesture to prevent accidental dismissal during challenge
          presentation: 'fullScreenModal',
        }}
      />
      
      {/* Singing Preview Modal */}
      <Stack.Screen 
        name="SingingPreview" 
        component={({ route, navigation }) => {
          // This could be a dedicated preview screen or handled within VoicePersonaScreen
          return <VoicePersonaScreen route={route} navigation={navigation} />;
        }}
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

// Main App Navigator with NavigationContainer
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;