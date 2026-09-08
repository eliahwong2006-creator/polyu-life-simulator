// src/components/locations/Locations.js
// Display booths grouped by room with their gains and requirements

import React from 'react';
import { quickActions } from '../../services/quickActions';
import { theme } from '../../styles/theme';

const Locations = () => {
  // Group actions by room
  const rooms = quickActions.reduce((acc, action) => {
    const room = action.room || 'Unknown Room';
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(action);
    return acc;
  }, {});

  const formatEffects = (effects) => {
    return Object.entries(effects)
      .map(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        return `${formattedKey} ${value > 0 ? '+' : ''}${value}`;
      })
      .join(', ');
  };

  const formatRequirements = (requirements) => {
    if (Object.keys(requirements).length === 0) return 'None';
    return Object.entries(requirements)
      .map(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        return `${formattedKey} ${value}`;
      })
      .join(', ');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Locations</h2>

      {Object.keys(rooms).length === 0 ? (
        <p style={styles.empty}>No locations available.</p>
      ) : (
        Object.keys(rooms).map((room) => (
          <div key={room} style={styles.roomCard}>
            <h3 style={styles.roomTitle}>{room}</h3>
            {rooms[room].map((action) => (
              <div key={action.id} style={styles.boothCard}>
                <div style={styles.boothName}>{action.label}</div>
                <div style={styles.boothDetails}>
                  <span style={styles.detailLabel}>Develop:</span>
                  <span>{formatEffects(action.effects)}</span>
                </div>
                <div style={styles.boothDetails}>
                  <span style={styles.detailLabel}>Requirements:</span>
                  <span>{formatRequirements(action.requirements)}</span>
                </div>
              </div>
            ))}
          </div>
        ))
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
  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    padding: '20px',
  },
  roomCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '12px',
    marginBottom: '16px',
    border: `1px solid ${theme.colors.primary}`,
  },
  roomTitle: {
    color: theme.colors.secondary,
    borderBottom: `1px solid ${theme.colors.primary}`,
    paddingBottom: '6px',
    marginBottom: '10px',
    fontSize: '1.2rem',
  },
  boothCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: '10px',
    marginBottom: '8px',
  },
  boothName: {
    fontWeight: 'bold',
    marginBottom: '4px',
    color: theme.colors.text,
  },
  boothDetails: {
    fontSize: '0.85rem',
    color: theme.colors.textSecondary,
    marginBottom: '2px',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginRight: '4px',
  },
};

export default Locations;