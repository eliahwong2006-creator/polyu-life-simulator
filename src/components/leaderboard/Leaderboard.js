// src/components/leaderboard/Leaderboard.js
// Leaderboard displaying top 5 players in various categories

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { theme } from '../../styles/theme';

const Leaderboard = () => {
  const { players } = useGame();
  const [activeCategory, setActiveCategory] = useState('money');

  // Filter out admin users
  const gamePlayers = players.filter(p => !p.isAdmin);

  // Helper function to get top 5 for a given category
  const getTopPlayers = (category) => {
    let sortedPlayers = [...gamePlayers];

    switch (category) {
      case 'money':
        sortedPlayers.sort((a, b) => (b.money || 0) - (a.money || 0));
        break;
      case 'wisdom':
        sortedPlayers.sort((a, b) => (b.attributes?.wisdom || 0) - (a.attributes?.wisdom || 0));
        break;
      case 'strength':
        sortedPlayers.sort((a, b) => (b.attributes?.strength || 0) - (a.attributes?.strength || 0));
        break;
      case 'social':
        sortedPlayers.sort((a, b) => (b.attributes?.social || 0) - (a.attributes?.social || 0));
        break;
      default:
        break;
    }

    return sortedPlayers.slice(0, 5);
  };

  const topPlayers = getTopPlayers(activeCategory);

  const getValueForCategory = (player, category) => {
    switch (category) {
      case 'money':
        return `$${player.money || 0}`;
      case 'wisdom':
        return player.attributes?.wisdom || 0;
      case 'strength':
        return player.attributes?.strength || 0;
      case 'social':
        return player.attributes?.social || 0;
      default:
        return '';
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const categories = [
    { key: 'money', label: '💰 Money' },
    { key: 'wisdom', label: '📚 Wisdom' },
    { key: 'strength', label: '💪 Strength' },
    { key: 'social', label: '🎉 Social' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Leaderboard</h2>

      {/* Category Tabs */}
      <div style={styles.tabs}>
        {categories.map(cat => (
          <button
            key={cat.key}
            style={activeCategory === cat.key ? styles.tabActive : styles.tab}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Top 5 List */}
      <div style={styles.list}>
        {topPlayers.length > 0 ? (
          topPlayers.map((player, index) => (
            <div key={player.id} style={styles.playerRow}>
              <span style={styles.rank}>{getMedal(index)}</span>
              <span style={styles.name}>{player.name}</span>
              <span style={styles.value}>{getValueForCategory(player, activeCategory)}</span>
            </div>
          ))
        ) : (
          <p style={styles.empty}>No players yet.</p>
        )}
      </div>
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
  tabs: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '4px',
  },
  tab: {
    background: theme.colors.surface,
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.primary}`,
    padding: '8px 12px',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  tabActive: {
    background: theme.colors.primary,
    color: theme.colors.text,
    border: `1px solid ${theme.colors.accent}`,
    padding: '8px 12px',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  list: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '12px',
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: `1px solid ${theme.colors.primaryDark}`,
    fontSize: '0.95rem',
  },
  rank: {
    width: '30px',
    textAlign: 'center',
    marginRight: '8px',
    fontSize: '1.2rem',
  },
  name: {
    flex: 1,
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    padding: '20px',
  },
};

export default Leaderboard;