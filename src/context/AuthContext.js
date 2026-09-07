// src/context/AuthContext.js
// Authentication context to manage user state globally

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, signOutUser } from '../firebase/auth';
import { getUserById } from '../firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase authentication state changes
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // User is signed in
        setCurrentUser(user);
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getUserById(user.uid);
          setUserData(userDoc);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    // Fallback: stop loading after 3 seconds even if auth hasn't responded
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    // Cleanup subscription and timeout
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    currentUser,   // Firebase auth user object
    userData,      // Firestore user data (attributes, money, etc.)
    loading,       // True while checking auth state
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: userData?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};