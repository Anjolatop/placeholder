import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state
const initialState = {
  user: null,
  alarms: [],
  currentAlarm: null,
  isAlarmActive: false,
  isChallengeMode: false,
  userStats: null,
  isLoading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  SET_ALARMS: 'SET_ALARMS',
  ADD_ALARM: 'ADD_ALARM',
  UPDATE_ALARM: 'UPDATE_ALARM',
  DELETE_ALARM: 'DELETE_ALARM',
  SET_CURRENT_ALARM: 'SET_CURRENT_ALARM',
  SET_ALARM_ACTIVE: 'SET_ALARM_ACTIVE',
  SET_CHALLENGE_MODE: 'SET_CHALLENGE_MODE',
  SET_USER_STATS: 'SET_USER_STATS',
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case ACTIONS.SET_ALARMS:
      return {
        ...state,
        alarms: action.payload,
      };

    case ACTIONS.ADD_ALARM:
      return {
        ...state,
        alarms: [...state.alarms, action.payload],
      };

    case ACTIONS.UPDATE_ALARM:
      return {
        ...state,
        alarms: state.alarms.map(alarm =>
          alarm.id === action.payload.id ? action.payload : alarm
        ),
      };

    case ACTIONS.DELETE_ALARM:
      return {
        ...state,
        alarms: state.alarms.filter(alarm => alarm.id !== action.payload),
      };

    case ACTIONS.SET_CURRENT_ALARM:
      return {
        ...state,
        currentAlarm: action.payload,
      };

    case ACTIONS.SET_ALARM_ACTIVE:
      return {
        ...state,
        isAlarmActive: action.payload,
      };

    case ACTIONS.SET_CHALLENGE_MODE:
      return {
        ...state,
        isChallengeMode: action.payload,
      };

    case ACTIONS.SET_USER_STATS:
      return {
        ...state,
        userStats: action.payload,
      };

    case ACTIONS.UPDATE_USER_STATS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload,
        },
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ACTIONS.RESET_STATE:
      return initialState;

    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });

      // Load user profile
      const userData = await AsyncStorage.getItem('userProfile');
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: ACTIONS.SET_USER, payload: user });
      }

      // Load alarms
      const alarmsData = await AsyncStorage.getItem('alarms');
      if (alarmsData) {
        const alarms = JSON.parse(alarmsData);
        dispatch({ type: ACTIONS.SET_ALARMS, payload: alarms });
      }

      // Load user stats
      const statsData = await AsyncStorage.getItem('userStats');
      if (statsData) {
        const stats = JSON.parse(statsData);
        dispatch({ type: ACTIONS.SET_USER_STATS, payload: stats });
      }

      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load user data' });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Save user data to storage
  const saveUserData = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Actions
  const actions = {
    // User actions
          setUser: async (user) => {
      dispatch({ type: ACTIONS.SET_USER, payload: user });
      await saveUserData('userProfile', user);
    },

            updateUser: async (updates) => {
      const updatedUser = { ...state.user, ...updates };
      dispatch({ type: ACTIONS.SET_USER, payload: updatedUser });
      await saveUserData('userProfile', updatedUser);
    },

    // Alarm actions
          setAlarms: async (alarms) => {
      dispatch({ type: ACTIONS.SET_ALARMS, payload: alarms });
      await saveUserData('alarms', alarms);
    },

          addAlarm: async (alarm) => {
      dispatch({ type: ACTIONS.ADD_ALARM, payload: alarm });
      const updatedAlarms = [...state.alarms, alarm];
      await saveUserData('alarms', updatedAlarms);
    },

          updateAlarm: async (alarm) => {
      dispatch({ type: ACTIONS.UPDATE_ALARM, payload: alarm });
      const updatedAlarms = state.alarms.map(a => a.id === alarm.id ? alarm : a);
      await saveUserData('alarms', updatedAlarms);
    },

    deleteAlarm: async (alarmId: string) => {
      dispatch({ type: ACTIONS.DELETE_ALARM, payload: alarmId });
      const updatedAlarms = state.alarms.filter(a => a.id !== alarmId);
      await saveUserData('alarms', updatedAlarms);
    },

          setCurrentAlarm: (alarm) => {
      dispatch({ type: ACTIONS.SET_CURRENT_ALARM, payload: alarm });
    },

    setAlarmActive: (isActive: boolean) => {
      dispatch({ type: ACTIONS.SET_ALARM_ACTIVE, payload: isActive });
    },

    setChallengeMode: (isActive: boolean) => {
      dispatch({ type: ACTIONS.SET_CHALLENGE_MODE, payload: isActive });
    },

    // Stats actions
          setUserStats: async (stats) => {
      dispatch({ type: ACTIONS.SET_USER_STATS, payload: stats });
      await saveUserData('userStats', stats);
    },

          updateUserStats: async (updates) => {
      dispatch({ type: ACTIONS.UPDATE_USER_STATS, payload: updates });
      const updatedStats = { ...state.userStats, ...updates };
      await saveUserData('userStats', updatedStats);
    },

    // Utility actions
    setLoading: (isLoading: boolean) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading });
    },

    setError: (error: string) => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    },

    resetState: () => {
      dispatch({ type: ACTIONS.RESET_STATE });
    },
  };

  const value = {
    state,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext; 