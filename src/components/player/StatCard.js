// src/components/player/StatCard.js
// Reusable card for displaying a single attribute/stat

import React from 'react';
import { theme } from '../../styles/theme';

const StatCard = ({ 
  label, 
  value, 
  color = theme.colors.secondary, 
  icon = null, 
  max = 15,
  showBar = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>{icon}</span>
        <span style={styles.label}>{label}</span>
        <span style={styles.value}>{value}</span>
      </div>
      {showBar && (
        <div style={styles.barContainer}>
          <div 
            style={{ 
              ...styles.barFill, 
              width: `${percentage}%`,
              backgroundColor: color 
            }} 
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#3E2723',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    border: '1px solid #8B0000',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  icon: {
    fontSize: '1.2rem',
    marginRight: '8px',
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  value: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginLeft: '8px',
  },
  barContainer: {
    width: '100%',
    height: '6px',
    backgroundColor: '#2C1810',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    transition: 'width 0.5s ease',
  },
};

export default StatCard;