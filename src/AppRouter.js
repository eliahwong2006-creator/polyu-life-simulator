// src/AppRouter.js
// Main application router with protected routes

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import pages (we'll create these next)
import LoginPage from './components/auth/LoginPage';
import PlayerDashboard from './components/player/PlayerDashboard';
import AdminPanel from './components/admin/AdminPanel';

// Loading spinner component (simple)
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <div>Loading...</div>
  </div>
);

// Protected route wrapper for players
const PlayerRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// Protected route wrapper for admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/player" replace />;
  }
  
  return children;
};

// Public route (redirects to appropriate page if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (isAuthenticated) {
    return isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/player" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public route: Login page */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        {/* Player dashboard route */}
        <Route 
          path="/player" 
          element={
            <PlayerRoute>
              <PlayerDashboard />
            </PlayerRoute>
          } 
        />
        
        {/* Admin panel route */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch-all redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;