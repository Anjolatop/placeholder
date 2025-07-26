import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export class UserService {
  // Create new user account
  static async createUser(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user profile data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Sign in existing user
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  static async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, userData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw error;
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }
} 