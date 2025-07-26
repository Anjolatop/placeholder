import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = UserService.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          const profile = await UserService.getUserProfile(authUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await UserService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (profileData) => {
    if (user) {
      try {
        await UserService.updateUserProfile(user.uid, profileData);
        setUserProfile(prev => ({ ...prev, ...profileData }));
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
    hasCompletedOnboarding: userProfile?.onboardingCompleted || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 