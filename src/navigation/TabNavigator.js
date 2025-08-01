import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import AlarmsScreen from '../screens/AlarmsScreen';
import StatsScreen from '../screens/StatsScreen';
import VoiceScreen from '../screens/VoiceScreen';
import PreferencesScreen from '../screens/PreferencesScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icon component
const TabBarIcon = ({ focused, icon, label }) => (
  <View style={styles.tabBarItem}>
    <Text style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}>
      {icon}
    </Text>
    <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
      {label}
    </Text>
  </View>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#55786f',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="🏠" label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Alarms"
        component={AlarmsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="⏰" label="Alarms" />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="📊" label="Stats" />
          ),
        }}
      />
      <Tab.Screen
        name="Voice"
        component={VoiceScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="🎤" label="Voice" />
          ),
        }}
      />
      <Tab.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon="⚙️" label="Settings" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabBarIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabBarLabelFocused: {
    fontWeight: 'bold',
  },
}); 