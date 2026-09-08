// src/components/admin/PlayerManagement.js
// Admin interface to view and edit player attributes and money

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { quickActions } from '../../services/quickActions';
import { theme } from '../../styles/theme';
import RadarChart from '../player/RadarChart';
import { GAME_CONSTANTS } from '../../firebase/config';

const PlayerManagement = () => {
  const { players, modifyAttributes, modifyMoney, sendAnnouncement } = useGame();
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);
  const [customAmounts, setCustomAmounts] = useState({});

  const handleToggleExpand = (playerId) => {
    setExpandedPlayerId(prev => (prev === playerId ? null : playerId));
  };

  const handleAttributeChange = async (playerId, attribute, delta) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    const currentValue = player.attributes?.[attribute] || 0;
    const newValue = Math.max(0, Math.min(GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE, currentValue + delta));
    const updatedAttributes = { ...player.attributes, [attribute]: newValue };
    await modifyAttributes(playerId, updatedAttributes);
  };

  const handleMoneyChange = async (playerId, delta) => {
    await modifyMoney(playerId, delta);
  };

  const handleCustomMoneyChange = async (playerId, isAdd) => {
    const amountStr = customAmounts[playerId] || '';
    const amount = Number(amountStr);
    if (!amountStr || isNaN(amount) || amount <= 0) return;

    const delta = isAdd ? amount : -amount;
    await handleMoneyChange(playerId, delta);

    // Clear input after applying
    setCustomAmounts(prev => ({ ...prev, [playerId]: '' }));
  };

  const handleQuickAction = async (player, action) => {
    // Apply attribute effects
    const newAttributes = { ...player.attributes };
    let moneyDelta = 0;
    if (action.effects) {
      for (const [key, value] of Object.entries(action.effects)) {
        if (key === 'money') {
          moneyDelta = value;
        } else if (key in newAttributes) {
          newAttributes[key] = Math.max(0, Math.min(GAME_CONSTANTS.MAX_ATTRIBUTE_VALUE, (newAttributes[key] || 0) + value));
        }
      }
    }
    await modifyAttributes(player.id, newAttributes);
    if (moneyDelta !== 0) {
      await modifyMoney(player.id, moneyDelta);
    }
    // Send announcement
    const message = action.announcement.replace('Player X', player.name);
    await sendAnnouncement({ message, playerName: player.name, type: action.id });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Player Management</h2>
      {players.length === 0 ? (
        <p style={styles.empty}>No players yet.</p>
      ) : (
        <div style={styles.list}>
          {players.filter(p => !p.isAdmin).map(player => (
            <div key={player.id} style={styles.playerCard}>
              <div style={styles.playerHeader} onClick={() => handleToggleExpand(player.id)}>
                <div style={styles.playerSummary}>
                  <span style={styles.playerName}>{player.name}</span>
                  <div style={styles.quickStats}>
                    <span>💰 ${player.money || 0}</span>
                    <span>⚡ {player.attributes?.energy || 0}</span>
                    <span>📚 {player.attributes?.wisdom || 0}</span>
                    <span>💪 {player.attributes?.strength || 0}</span>
                    <span>🎉 {player.attributes?.social || 0}</span>
                    <span>🧠 {player.attributes?.sanity || 0}</span>
                  </div>
                </div>
                <span style={styles.expandIcon}>{expandedPlayerId === player.id ? '▲' : '▼'}</span>
              </div>

              {expandedPlayerId === player.id && (
                <div style={styles.expandedContent}>
                  {/* Radar Chart */}
                  <div style={styles.radarContainer}>
                    <RadarChart attributes={player.attributes} size={200} />
                  </div>

                  {/* Manual Attribute Editing */}
                  <div style={styles.attributesSection}>
                    <h4 style={styles.sectionTitle}>Attributes</h4>
                    {['wisdom', 'strength', 'social', 'sanity', 'energy'].map(attr => (
                      <div key={attr} style={styles.attributeRow}>
                        <span style={styles.attributeLabel}>{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                        <span style={styles.attributeValue}>{player.attributes?.[attr] || 0}</span>
                        <button style={styles.smallButton} onClick={() => handleAttributeChange(player.id, attr, -1)}>-1</button>
                        <button style={styles.smallButton} onClick={() => handleAttributeChange(player.id, attr, 1)}>+1</button>
                        <button style={styles.smallButton} onClick={() => handleAttributeChange(player.id, attr, 5)}>+5</button>
                      </div>
                    ))}
                    <div style={styles.attributeRow}>
                      <span style={styles.attributeLabel}>Money</span>
                      <span style={styles.attributeValue}>${player.money || 0}</span><span></span><span></span><span></span><span></span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Amount"
                        value={customAmounts[player.id] || ''}
                        onChange={(e) => setCustomAmounts(prev => ({ ...prev, [player.id]: e.target.value }))}
                        style={styles.customInput}
                      />
                      <button style={styles.smallButton} onClick={() => handleCustomMoneyChange(player.id, true)}>
                        +$
                      </button>
                      <button style={styles.smallButton} onClick={() => handleCustomMoneyChange(player.id, false)}>
                        -$
                      </button>
                      <button style={styles.smallButton} onClick={() => handleMoneyChange(player.id, -50)}>-$50</button>
                      <button style={styles.smallButton} onClick={() => handleMoneyChange(player.id, 50)}>+$50</button>
                      <button style={styles.smallButton} onClick={() => handleMoneyChange(player.id, 200)}>+$200</button>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={styles.quickActionsSection}>
                    <h4 style={styles.sectionTitle}>Quick Actions</h4>
                    <div style={styles.quickActionsGrid}>
                      {quickActions.map(action => (
                        <button
                          key={action.id}
                          style={styles.quickActionButton}
                          onClick={() => handleQuickAction(player, action)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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
  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    padding: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  playerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: '12px',
    border: `1px solid ${theme.colors.primary}`,
  },
  playerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  playerSummary: {
    display: 'flex',
    flexDirection: 'column',
  },
  playerName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  quickStats: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    color: theme.colors.textSecondary,
    fontSize: '0.85rem',
    marginTop: '4px',
  },
  expandIcon: {
    color: theme.colors.accent,
    fontSize: '1.2rem',
  },
  expandedContent: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${theme.colors.primaryDark}`,
  },
  radarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  attributesSection: {
    marginBottom: '16px',
  },
  sectionTitle: {
    color: theme.colors.secondary,
    marginBottom: '8px',
    fontSize: '1rem',
  },
  attributeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  attributeLabel: {
    width: '80px',
    fontWeight: 'bold',
  },
  attributeValue: {
    width: '30px',
    textAlign: 'center',
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  smallButton: {
    padding: '4px 8px',
    fontSize: '0.8rem',
    backgroundColor: theme.colors.primaryLight,
    border: 'none',
    borderRadius: theme.borderRadius.small,
    color: theme.colors.text,
    cursor: 'pointer',
  },
  customInput: {
    width: '70px',
    padding: '4px',
    borderRadius: theme.borderRadius.small,
    border: `1px solid ${theme.colors.secondary}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '0.8rem',
  },
  quickActionsSection: {
    marginTop: '12px',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '8px',
  },
  quickActionButton: {
    padding: '8px',
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    border: 'none',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
};

export default PlayerManagement;