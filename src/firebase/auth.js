// src/firebase/auth.js
// Authentication service functions

import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, COLLECTIONS, GAME_CONSTANTS } from './config';

// Sign in as a player (anonymous authentication)
export const signInAsPlayer = async (playerName) => {
  try {
    const auth = getAuth();
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    // Check if player already exists
    const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Player exists, update lastActive only, do NOT overwrite name
      await setDoc(userDocRef, {
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      return {
        ...userDoc.data(),
        uid: user.uid,
        isNewPlayer: false
      };
    } else {
      // Create new player document
      const newPlayer = {
        name: playerName,
        attributes: {
          wisdom: 0,
          strength: 0,
          social: 0,
          sanity: 0,
          energy: GAME_CONSTANTS.STARTING_ENERGY
        },
        money: GAME_CONSTANTS.STARTING_MONEY,
        isAdmin: false,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userDocRef, newPlayer);
      
      return {
        ...newPlayer,
        uid: user.uid,
        isNewPlayer: true
      };
    }
  } catch (error) {
    console.error('Player sign-in error:', error);
    throw new Error('Failed to sign in as player. Please try again.');
  }
};

// Sign in as admin (email/password authentication)
export const signInAsAdmin = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user has admin privileges
    const userDocRef = doc(db, COLLECTIONS.USERS, user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().isAdmin === true) {
      return {
        ...userDoc.data(),
        uid: user.uid,
        isAdmin: true
      };
    } else {
      // Sign out if not admin
      await signOut(auth);
      throw new Error('Account does not have admin privileges.');
    }
  } catch (error) {
    console.error('Admin sign-in error:', error);
    if (error.code === 'auth/user-not-found') {
      throw new Error('Admin account not found.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password.');
    } else {
      throw new Error('Failed to sign in as admin. Please try again.');
    }
  }
};

// Sign out current user
export const signOutUser = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out.');
  }
};

// Listen to authentication state changes
export const onAuthStateChange = (callback) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  const auth = getAuth();
  return auth.currentUser;
};