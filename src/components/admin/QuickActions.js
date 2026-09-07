// src/components/admin/QuickActions.js
// Admin tab for applying pre-programmed quick actions to a selected player

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { quickActions } from '../../services/quickActions';
import { theme } from '../../styles/theme';

const QuickActions = () => {
  const { players, modifyAttributes, modifyMoney, sendAnnouncement } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const gamePlayers = players.filter(p => !p.isAdmin);

  const handleApplyAction = async (action) => {
    if (!selectedPlayerId) {
      setMessage('Please select a player first.');
      return;
    }

    const player = players.find(p => p.id === selectedPlayerId);
    if (!player) {
      setMessage('Player not found.');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      // Apply attribute effects
      const newAttributes = { ...player.attributes };
      let moneyDelta = 0;

      for (const [key, value] of Object.entries(action.effects)) {
        if (key === 'money') {
          moneyDelta = value;
        } else if (key in newAttributes) {
          newAttributes[key] = Math.max(0, Math.min(10, (newAttributes[key] || 0) + value));
        }
      }

      await modifyAttributes(player.id, newAttributes);
      if (moneyDelta !== 0) {
        await modifyMoney(player.id, moneyDelta);
      }

      // Send announcement with player name
      const announcementMessage = action.announcement.replace('Player X', player.name);
      await sendAnnouncement({
        message: announcementMessage,
        playerName: player.name,
        type: action.id,
      });

      setMessage(`✅ ${announcementMessage}`);
    } catch (error) {
      console.error('Error applying quick action:', error);
      setMessage('❌ Failed to apply action.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quick Actions</h2>

      <div style={styles.selectContainer}>
        <label style={styles.label}>Select Player:</label>
        <select
          value={selectedPlayerId}
          onChange={(e) => {
            setSelectedPlayerId(e.target.value);
            setMessage('');
          }}
          style={styles.select}
        >
          <option value="">-- Choose player --</option>
          {gamePlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div style={message.startsWith('❌') ? styles.error : styles.success}>
          {message}
        </div>
      )}

      <div style={styles.actionsGrid}>
        {quickActions.map(action => (
          <button
            key={action.id}
            style={styles.actionButton}
            onClick={() => handleApplyAction(action)}
            disabled={!selectedPlayerId || isProcessing}
          >
            <span style={styles.actionLabel}>{action.label}</span>
            <span style={styles.actionEffects}>
              {Object.entries(action.effects).map(([key, val]) => (
                <span key={key} style={val > 0 ? styles.positiveEffect : styles.negativeEffect}>
                  {key} {val > 0 ? `+${val}` : val}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '8px',
  },
  title: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    marginBottom: '16px',
  },
  selectContainer: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '0.9rem',
  },
  error: {
    backgroundColor: theme.colors.error,
    color: 'white',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  success: {
    backgroundColor: theme.colors.success,
    color: 'white',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  actionButton: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.primary}`,
    borderRadius: theme.borderRadius.medium,
    padding: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.3s',
  },
  actionLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '6px',
  },
  actionEffects: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    fontSize: '0.75rem',
  },
  positiveEffect: {
    color: theme.colors.success,
  },
  negativeEffect: {
    color: theme.colors.error,
  },
};

export default QuickActions;