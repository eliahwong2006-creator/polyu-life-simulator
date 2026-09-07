// src/firebase/firestore.js
// Firestore database service functions

import { 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,  // used in deleteCollection and possibly elsewhere
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, COLLECTIONS, GAME_CONSTANTS } from './config';

// ============ USER OPERATIONS ============

// Get a single user by ID
export const getUserById = async (userId) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get all users (for admin panel and directory)
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, COLLECTIONS.USERS);
    const usersQuery = query(usersCollection, orderBy('name'));
    const querySnapshot = await getDocs(usersQuery);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Listen to all users in real-time
export const listenToAllUsers = (callback) => {
  const usersCollection = collection(db, COLLECTIONS.USERS);
  const usersQuery = query(usersCollection, orderBy('name'));
  
  return onSnapshot(usersQuery, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(users);
  }, (error) => {
    console.error('Error listening to users:', error);
  });
};

// Listen to a specific user in real-time
export const listenToUser = (userId, callback) => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  
  return onSnapshot(userDocRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to user:', error);
  });
};

// Update user attributes
export const updateUserAttributes = async (userId, attributes) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      attributes,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user attributes:', error);
    throw error;
  }
};

// Update user money
export const updateUserMoney = async (userId, amount) => {
  try {
    const userDocRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userDocRef, {
      money: increment(amount),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user money:', error);
    throw error;
  }
};

// ============ ANNOUNCEMENT OPERATIONS ============

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const announcementsCollection = collection(db, COLLECTIONS.ANNOUNCEMENTS);
    const announcement = {
      ...announcementData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(announcementsCollection, announcement);
    return {
      id: docRef.id,
      ...announcement
    };
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

// Listen to announcements in real-time
export const listenToAnnouncements = (callback, limitCount = 20) => {
  const announcementsCollection = collection(db, COLLECTIONS.ANNOUNCEMENTS);
  const announcementsQuery = query(
    announcementsCollection,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(announcementsQuery, (snapshot) => {
    const announcements = [];
    snapshot.forEach((doc) => {
      announcements.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(announcements);
  }, (error) => {
    console.error('Error listening to announcements:', error);
  });
};

// ============ TRANSACTION OPERATIONS ============

// Create a new transaction (money transfer)
export const createTransaction = async (fromPlayer, toPlayer, amount) => {
  try {
    const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
    const transaction = {
      from: fromPlayer.id,
      fromName: fromPlayer.name,
      to: toPlayer.id,
      toName: toPlayer.name,
      amount: amount,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(transactionsCollection, transaction);
    
    // Update both players' money
    await updateUserMoney(fromPlayer.id, -amount);
    await updateUserMoney(toPlayer.id, amount);
    
    return {
      id: docRef.id,
      ...transaction
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

// Get transactions for a specific user
export const getUserTransactions = async (userId) => {
  try {
    const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
    const transactionsQuery = query(
      transactionsCollection,
      where('from', '==', userId)
    );
    
    const sentTransactions = [];
    const sentSnapshot = await getDocs(transactionsQuery);
    sentSnapshot.forEach((doc) => {
      sentTransactions.push({
        id: doc.id,
        ...doc.data(),
        type: 'sent'
      });
    });
    
    const receivedQuery = query(
      transactionsCollection,
      where('to', '==', userId)
    );
    
    const receivedTransactions = [];
    const receivedSnapshot = await getDocs(receivedQuery);
    receivedSnapshot.forEach((doc) => {
      receivedTransactions.push({
        id: doc.id,
        ...doc.data(),
        type: 'received'
      });
    });
    
    // Combine and sort by timestamp
    const allTransactions = [...sentTransactions, ...receivedTransactions];
    allTransactions.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
    
    return allTransactions;
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
};

// Listen to all transactions in real-time
export const listenToTransactions = (callback, limitCount = 50) => {
  const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
  const transactionsQuery = query(
    transactionsCollection,
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  return onSnapshot(transactionsQuery, (snapshot) => {
    const transactions = [];
    snapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(transactions);
  }, (error) => {
    console.error('Error listening to transactions:', error);
  });
};

// ============ GAME STATE OPERATIONS ============

// Get game state
export const getGameState = async () => {
  try {
    const gameStateDocRef = doc(db, COLLECTIONS.GAME_STATE, 'current');
    const gameStateDoc = await getDoc(gameStateDocRef);
    
    if (gameStateDoc.exists()) {
      return {
        id: gameStateDoc.id,
        ...gameStateDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting game state:', error);
    throw error;
  }
};

// Update game state
export const updateGameState = async (gameStateData) => {
  try {
    const gameStateDocRef = doc(db, COLLECTIONS.GAME_STATE, 'current');
    await setDoc(gameStateDocRef, {
      ...gameStateData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating game state:', error);
    throw error;
  }
};

// Helper to delete all documents in a collection
const deleteCollection = async (collectionName) => {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

// Reset game (all users back to starting values, clear announcements and transactions)
export const resetGame = async () => {
  try {
    const users = await getAllUsers();
    
    const resetPromises = users.map(async (user) => {
      const userDocRef = doc(db, COLLECTIONS.USERS, user.id);
      return setDoc(userDocRef, {
        attributes: {
          wisdom: 0,
          strength: 0,
          social: 0,
          sanity: 0,
          energy: GAME_CONSTANTS.STARTING_ENERGY
        },
        money: GAME_CONSTANTS.STARTING_MONEY,
        updatedAt: serverTimestamp()
      }, { merge: true });
    });
    
    await Promise.all(resetPromises);
    
    // Clear all announcements and transactions
    await deleteCollection(COLLECTIONS.ANNOUNCEMENTS);
    await deleteCollection(COLLECTIONS.TRANSACTIONS);
    
    // Update game state
    await updateGameState({
      status: 'active',
      round: 1,
      startedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error resetting game:', error);
    throw error;
  }
};   // <-- This closing brace was missing

// Delete all non-admin player documents
export const deleteAllPlayers = async () => {
  try {
    const usersCollection = collection(db, COLLECTIONS.USERS);
    const usersQuery = query(usersCollection, where('isAdmin', '!=', true));
    const snapshot = await getDocs(usersQuery);
    
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { deletedCount: snapshot.size };
  } catch (error) {
    console.error('Error deleting all players:', error);
    throw error;
  }
};