// src/context/GameContext.js
// Game context to manage real-time game data and actions

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  listenToAllUsers,
  listenToAnnouncements,
  listenToTransactions,
  getGameState,
  updateGameState,
  createAnnouncement,
  createTransaction,
  resetGame,
  updateUserAttributes,
  updateUserMoney,
  deleteAllPlayers,
} from '../firebase/firestore';
import { GAME_CONSTANTS } from '../firebase/config';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Action: Delete all non-admin players (admin only)
  const handleDeleteAllPlayers = useCallback(async () => {
    try {
      const result = await deleteAllPlayers();
      return result;
    } catch (error) {
      console.error('Error deleting all players:', error);
      throw error;
    }
  }, []);

  // Load real-time data
  useEffect(() => {
    setLoading(true);

    console.log("GameContext: Setting up listeners...");

    const unsubscribeUsers = listenToAllUsers((users) => {
      console.log("Users updated:", users);
      setPlayers(users);
    });

    const unsubscribeAnnouncements = listenToAnnouncements((announcements) => {
      console.log("Announcements updated:", announcements);
      setAnnouncements(announcements);
    });

    const unsubscribeTransactions = listenToTransactions((transactions) => {
      console.log("Transactions updated:", transactions);
      setTransactions(transactions);
    });

    // Fetch initial game state (non-real-time)
    getGameState().then((state) => {
      setGameState(state);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching game state:', error);
      setLoading(false);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeAnnouncements();
      unsubscribeTransactions();
    };
  }, []);

  // Action: Send announcement (admin only)
  const sendAnnouncement = useCallback(async (announcementData) => {
    try {
      await createAnnouncement(announcementData);
      return true;
    } catch (error) {
      console.error('Error sending announcement:', error);
      throw error;
    }
  }, []);

  // Action: Perform money transfer (player)
  const transferMoney = useCallback(async (fromPlayer, toPlayer, amount) => {
    try {
      await createTransaction(fromPlayer, toPlayer, amount);
      return true;
    } catch (error) {
      console.error('Error transferring money:', error);
      throw error;
    }
  }, []);

  // Action: Update a player's attributes (admin)
  const modifyAttributes = useCallback(async (userId, attributes) => {
    try {
      await updateUserAttributes(userId, attributes);
      return true;
    } catch (error) {
      console.error('Error updating attributes:', error);
      throw error;
    }
  }, []);

  // Action: Update a player's money (admin)
  const modifyMoney = useCallback(async (userId, amount) => {
    try {
      await updateUserMoney(userId, amount);
      return true;
    } catch (error) {
      console.error('Error updating money:', error);
      throw error;
    }
  }, []);

  // Action: Reset entire game (admin)
  const handleResetGame = useCallback(async () => {
    try {
      await resetGame();
      // Optionally refresh game state after reset
      const state = await getGameState();
      setGameState(state);
      return true;
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  }, []);

  // Action: Update game state (admin)
  const updateGameStatus = useCallback(async (newState) => {
    try {
      await updateGameState(newState);
      setGameState((prev) => ({ ...prev, ...newState }));
      return true;
    } catch (error) {
      console.error('Error updating game state:', error);
      throw error;
    }
  }, []);

  const value = {
    players,
    announcements,
    transactions,
    gameState,
    loading,
    sendAnnouncement,
    transferMoney,
    modifyAttributes,
    modifyMoney,
    handleResetGame,
    updateGameStatus,
    handleDeleteAllPlayers,
    constants: GAME_CONSTANTS,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};