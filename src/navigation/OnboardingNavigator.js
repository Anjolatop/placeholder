import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import SignInScreen from '../screens/onboarding/SignInScreen';
import SignUpScreen from '../screens/onboarding/SignUpScreen';
import WelcomeKirosScreen from '../screens/WelcomeKirosScreen';
import ProfileSetupScreen from '../screens/onboarding/ProfileSetupScreen';
import SetupCompleteScreen from '../screens/onboarding/SetupCompleteScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="WelcomeKiros" component={WelcomeKirosScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
    </Stack.Navigator>
  );
} 