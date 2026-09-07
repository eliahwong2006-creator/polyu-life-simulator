// src/App.js
// Main application component with providers

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppRouter />
      </GameProvider>
    </AuthProvider>
  );
}

export default App;