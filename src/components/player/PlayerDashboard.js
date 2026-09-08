// src/components/player/PlayerDashboard.js
// Main player dashboard with stats, radar chart, and navigation

import Locations from '../locations/Locations';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import RadarChart from './RadarChart';
import StatCard from './StatCard';
import Leaderboard from '../leaderboard/Leaderboard';
import PlayerDirectory from '../directory/PlayerDirectory';
import TradeSystem from '../trade/TradeSystem';
import { theme } from '../../styles/theme';

const PlayerDashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const { players, announcements, constants } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Get the most up-to-date player data from real-time players list
  const currentPlayer = players.find(p => p.id === currentUser?.uid) || userData;
  const attributes = currentPlayer?.attributes || {
    wisdom: 0,
    strength: 0,
    social: 0,
    sanity: 15,
    energy: constants?.STARTING_ENERGY || 15,
  };
  const money = currentPlayer?.money ?? constants?.STARTING_MONEY ?? 100;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard />;
      case 'directory':
        return <PlayerDirectory />;
      case 'trade':
        return <TradeSystem />;
      case 'locations':
        return <Locations />;
      case 'dashboard':
      default:
        return (
          <>
            {/* Radar Chart */}
            <div style={styles.section}>
              <RadarChart attributes={attributes} />
            </div>

            {/* Money and Energy */}
            <div style={styles.row}>
              <StatCard
                label="Money"
                value={`$${money}`}
                color={theme.colors.accent}
                icon="💰"
                max={1000}
                showBar={false}
              />
              <StatCard
                label="Energy"
                value={attributes.energy}
                color={theme.colors.energy}
                icon="⚡"
                max={constants?.STARTING_ENERGY || 15}
              />
            </div>

            {/* Attribute Cards */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Attributes</h3>
              <StatCard
                label="Wisdom"
                value={attributes.wisdom}
                color={theme.radarChart.wisdom}
                icon="📚"
                max={constants?.MAX_ATTRIBUTE_VALUE || 15}
              />
              <StatCard
                label="Strength"
                value={attributes.strength}
                color={theme.radarChart.strength}
                icon="💪"
                max={constants?.MAX_ATTRIBUTE_VALUE || 15}
              />
              <StatCard
                label="Social"
                value={attributes.social}
                color={theme.radarChart.social}
                icon="🎉"
                max={constants?.MAX_ATTRIBUTE_VALUE || 15}
              />
              <StatCard
                label="Sanity"
                value={attributes.sanity}
                color={theme.radarChart.sanity}
                icon="🧠"
                max={constants?.MAX_ATTRIBUTE_VALUE || 15}
              />
            </div>

            {/* Latest Announcements */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Latest Announcements</h3>
              {announcements && announcements.length > 0 ? (
                announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} style={styles.announcement}>
                    <span>{announcement.message}</span>
                  </div>
                ))
              ) : (
                <p style={styles.noAnnouncements}>No announcements yet.</p>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>PolyU Life</h1>
        <div style={styles.headerRight}>
          <span style={styles.playerName}>{currentPlayer?.name || 'Player'}</span>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={styles.content}>{renderTabContent()}</div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <button
          style={activeTab === 'dashboard' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('dashboard')}
        >
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navLabel}>Home</span>
        </button>
        <button
          style={activeTab === 'leaderboard' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('leaderboard')}
        >
          <span style={styles.navIcon}>🏆</span>
          <span style={styles.navLabel}>Leaderboard</span>
        </button>
        <button
          style={activeTab === 'directory' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('directory')}
        >
          <span style={styles.navIcon}>👥</span>
          <span style={styles.navLabel}>Directory</span>
        </button>
        <button
          style={activeTab === 'trade' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('trade')}
        >
          <span style={styles.navIcon}>💱</span>
          <span style={styles.navLabel}>Trade</span>
        </button>
        <button
          style={activeTab === 'locations' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveTab('locations')}
        >
          <span style={styles.navIcon}>📍</span>
          <span style={styles.navLabel}>Locations</span>
        </button>
      </div>
    </div>
  );
};

// Inline styles (same as before)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    maxWidth: '600px',
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
    gap: '8px',
  },
  playerName: {
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
  content: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: '80px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: theme.colors.secondary,
    borderBottom: `1px solid ${theme.colors.primary}`,
    paddingBottom: '4px',
    marginBottom: '12px',
    fontSize: '1.2rem',
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  announcement: {
    backgroundColor: theme.colors.surface,
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    marginBottom: '8px',
    borderLeft: `3px solid ${theme.colors.accent}`,
    fontSize: '0.9rem',
  },
  noAnnouncements: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    padding: '10px',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderTop: `2px solid ${theme.colors.primary}`,
    padding: '8px 0',
    zIndex: 100,
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.textMuted,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.7rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  navButtonActive: {
    background: 'none',
    border: 'none',
    color: theme.colors.accent,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.7rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  navIcon: {
    fontSize: '1.5rem',
    marginBottom: '2px',
  },
  navLabel: {
    fontWeight: 'bold',
  },
};

export default PlayerDashboard;