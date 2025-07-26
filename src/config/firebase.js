import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtgeAQRmNFn8YiA9CuUTzemhTwlnL03Kk",
  authDomain: "placeholder-4cc65.firebaseapp.com",
  projectId: "placeholder-4cc65",
  storageBucket: "placeholder-4cc65.firebasestorage.app",
  messagingSenderId: "306244805028",
  appId: "1:306244805028:web:34796369d2fdd556d12131",
  measurementId: "G-MC613XMZH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db }; 