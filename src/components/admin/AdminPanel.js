// src/components/admin/AdminPanel.js
// Main admin control room with navigation

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import PlayerManagement from './PlayerManagement';
import QuickActions from './QuickActions';
import AnnouncementSystem from './AnnouncementSystem';
import ResetGame from './ResetGame';
import { theme } from '../../styles/theme';

const AdminPanel = () => {
  const { logout } = useAuth();
  const { players } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('players');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'players':
        return <PlayerManagement />;
      case 'quick':
        return <QuickActions />;
      case 'announce':
        return <AnnouncementSystem />;
      case 'reset':
        return <ResetGame />;
      default:
        return <PlayerManagement />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Control Room</h1>
        <div style={styles.headerRight}>
          <span style={styles.playerCount}>{players.length} Players</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        <button
          style={activeTab === 'players' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('players')}
        >
          👥 Player Management
        </button>
        <button
          style={activeTab === 'quick' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('quick')}
        >
          ⚡ Quick Actions
        </button>
        <button
          style={activeTab === 'announce' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('announce')}
        >
          📢 Announcements
        </button>
        <button
          style={activeTab === 'reset' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('reset')}
        >
          🔄 Reset Game
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 16px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: `2px solid ${theme.colors.primary}`,
    marginBottom: '16px',
  },
  headerTitle: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    fontSize: '1.5rem',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  playerCount: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    border: 'none',
    padding: '6px 12px',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  tab: {
    flex: '1 1 auto',
    minWidth: '120px',
    backgroundColor: theme.colors.surface,
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.primary}`,
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  tabActive: {
    flex: '1 1 auto',
    minWidth: '120px',
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.accent}`,
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '20px',
  },
};

export default AdminPanel;