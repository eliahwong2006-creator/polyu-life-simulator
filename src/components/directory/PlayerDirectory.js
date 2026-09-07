// src/components/directory/PlayerDirectory.js
// Directory of all players with profile viewing

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import RadarChart from '../player/RadarChart';
import { theme } from '../../styles/theme';

const PlayerDirectory = () => {
  const { players } = useGame();
  const { currentUser } = useAuth();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Filter out admins and optionally the current user? We'll show all except current user? 
  // Actually we can show all players, but mark current user.
  const gamePlayers = players.filter(p => !p.isAdmin);

  const handleViewProfile = (player) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Player Directory</h2>

      {gamePlayers.length > 0 ? (
        <div style={styles.list}>
          {gamePlayers.map(player => (
            <div key={player.id} style={styles.playerRow}>
              <div style={styles.playerInfo}>
                <span style={styles.playerName}>
                  {player.name}
                  {player.id === currentUser?.uid && <span style={styles.youBadge}> (You)</span>}
                </span>
                <div style={styles.quickStats}>
                  <span>💰 ${player.money || 0}</span>
                  <span>⚡ {player.attributes?.energy || 0}</span>
                </div>
              </div>
              <button 
                style={styles.viewButton}
                onClick={() => handleViewProfile(player)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.empty}>No players found.</p>
      )}

      {/* Profile Modal */}
      {selectedPlayer && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedPlayer.name}</h3>
              <button style={styles.closeButton} onClick={closeModal}>✕</button>
            </div>
            
            <RadarChart attributes={selectedPlayer.attributes} size={250} />

            <div style={styles.details}>
              <div style={styles.detailRow}>
                <span>💰 Money:</span>
                <span style={styles.detailValue}>${selectedPlayer.money || 0}</span>
              </div>
              <div style={styles.detailRow}>
                <span>📚 Wisdom:</span>
                <span style={styles.detailValue}>{selectedPlayer.attributes?.wisdom || 0}</span>
              </div>
              <div style={styles.detailRow}>
                <span>💪 Strength:</span>
                <span style={styles.detailValue}>{selectedPlayer.attributes?.strength || 0}</span>
              </div>
              <div style={styles.detailRow}>
                <span>🎉 Social:</span>
                <span style={styles.detailValue}>{selectedPlayer.attributes?.social || 0}</span>
              </div>
              <div style={styles.detailRow}>
                <span>🧠 Sanity:</span>
                <span style={styles.detailValue}>{selectedPlayer.attributes?.sanity || 0}</span>
              </div>
              <div style={styles.detailRow}>
                <span>⚡ Energy:</span>
                <span style={styles.detailValue}>{selectedPlayer.attributes?.energy || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  title: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    marginBottom: '16px',
  },
  list: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '12px',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    borderBottom: `1px solid ${theme.colors.primaryDark}`,
  },
  playerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: theme.colors.text,
  },
  youBadge: {
    color: theme.colors.accent,
    fontSize: '0.8rem',
  },
  quickStats: {
    display: 'flex',
    gap: '12px',
    color: theme.colors.textSecondary,
    fontSize: '0.85rem',
    marginTop: '4px',
  },
  viewButton: {
    background: theme.colors.primary,
    color: theme.colors.text,
    border: 'none',
    padding: '6px 12px',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'background-color 0.3s',
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    padding: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '20px',
    maxWidth: '90%',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: theme.shadows.large,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  modalTitle: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: theme.colors.text,
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  details: {
    marginTop: '16px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 0',
    borderBottom: `1px solid ${theme.colors.primaryDark}`,
    fontSize: '0.9rem',
  },
  detailValue: {
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
};

export default PlayerDirectory;