// src/firebase/config.js
// Firebase initialization and configuration

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration object
// Values are loaded from environment variables (.env file)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (optional, only if supported)
export const initializeAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Export default app for advanced use cases
export default app;

// Game constants (can be accessed throughout the app)
export const GAME_CONSTANTS = {
  STARTING_MONEY: Number(process.env.REACT_APP_STARTING_MONEY) || 100,
  STARTING_ENERGY: Number(process.env.REACT_APP_STARTING_ENERGY) || 10,
  STARTING_SANITY: Number(process.env.REACT_APP_STARTING_SANITY) || 0,
  MAX_ATTRIBUTE_VALUE: Number(process.env.REACT_APP_MAX_ATTRIBUTE_VALUE) || 10,
  MIN_ATTRIBUTE_VALUE: 0,
  ADMIN_EMAIL: process.env.REACT_APP_ADMIN_EMAIL || 'admin@polyu.edu.hk'
};

// Collection names (centralized for consistency)
export const COLLECTIONS = {
  USERS: 'users',
  ANNOUNCEMENTS: 'announcements',
  TRANSACTIONS: 'transactions',
  GAME_STATE: 'gameState'
};

// Log configuration status in development mode
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Configuration Status:');
  console.log('API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.log('Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
  console.log('Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
  console.log('Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing');
  console.log('Messaging Sender ID:', firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing');
  console.log('App ID:', firebaseConfig.appId ? '✅ Set' : '❌ Missing');
}