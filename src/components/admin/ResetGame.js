// src/components/admin/ResetGame.js
// Admin interface to reset the entire game and delete all players

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { theme } from '../../styles/theme';

const ResetGame = () => {
  const { handleResetGame, handleDeleteAllPlayers } = useGame();
  const [confirmText, setConfirmText] = useState('');
  const [status, setStatus] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isResetConfirmed = confirmText === 'RESET';
  const isDeleteConfirmed = deleteConfirmText === 'DELETE';

  const handleReset = async () => {
    if (!isResetConfirmed) return;
    setIsResetting(true);
    setStatus('');
    try {
      await handleResetGame();
      setConfirmText('');
      setStatus('✅ Game has been reset successfully.');
    } catch (error) {
      console.error('Reset failed:', error);
      setStatus('❌ Reset failed. Check console for details.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDeletePlayers = async () => {
    if (!isDeleteConfirmed) return;
    setIsDeleting(true);
    setDeleteStatus('');
    try {
      const result = await handleDeleteAllPlayers();
      setDeleteConfirmText('');
      setDeleteStatus(`✅ Deleted ${result.deletedCount} players.`);
    } catch (error) {
      console.error('Delete all players failed:', error);
      setDeleteStatus('❌ Failed to delete players.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Game</h2>

      {/* Reset Game Section */}
      <div style={styles.warningBox}>
        <h3 style={styles.warningTitle}>⚠️ Reset All Stats</h3>
        <p>This action will:</p>
        <ul style={styles.warningList}>
          <li>Reset all players' attributes to 0</li>
          <li>Reset all players' money to $100</li>
          <li>Reset all players' energy to 10</li>
          <li>Clear all announcements</li>
          <li>Clear all transaction history</li>
          <li>Keep player accounts intact</li>
        </ul>
        <p>This cannot be undone.</p>
      </div>

      <div style={styles.confirmSection}>
        <p style={styles.confirmLabel}>Type "RESET" to confirm:</p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="RESET"
          style={styles.input}
          disabled={isResetting}
        />
      </div>

      {status && (
        <div style={status.startsWith('✅') ? styles.success : styles.error}>
          {status}
        </div>
      )}

      <button
        onClick={handleReset}
        style={isResetConfirmed ? styles.resetButton : styles.resetButtonDisabled}
        disabled={!isResetConfirmed || isResetting}
      >
        {isResetting ? 'Resetting...' : 'Reset Game'}
      </button>

      <div style={styles.divider}></div>

      {/* Delete All Players Section */}
      <div style={styles.warningBox}>
        <h3 style={styles.warningTitle}>🗑️ Delete All Players</h3>
        <p>This will permanently delete all non-admin player accounts. Transactions and announcements will remain.</p>
        <div style={styles.confirmSection}>
          <p style={styles.confirmLabel}>Type "DELETE" to confirm:</p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="DELETE"
            style={styles.input}
            disabled={isDeleting}
          />
        </div>
        {deleteStatus && (
          <div style={deleteStatus.startsWith('✅') ? styles.success : styles.error}>
            {deleteStatus}
          </div>
        )}
        <button
          onClick={handleDeletePlayers}
          style={isDeleteConfirmed ? styles.deleteButton : styles.deleteButtonDisabled}
          disabled={!isDeleteConfirmed || isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete All Players'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '8px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  title: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.heading,
    textAlign: 'center',
    marginBottom: '16px',
  },
  warningBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '16px',
    marginBottom: '20px',
    border: `2px solid ${theme.colors.error}`,
  },
  warningTitle: {
    color: theme.colors.error,
    marginBottom: '8px',
  },
  warningList: {
    marginLeft: '20px',
    color: theme.colors.textSecondary,
    marginBottom: '8px',
  },
  confirmSection: {
    marginBottom: '16px',
  },
  confirmLabel: {
    color: theme.colors.textSecondary,
    marginBottom: '6px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '1rem',
  },
  success: {
    backgroundColor: theme.colors.success,
    color: 'white',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    marginBottom: '12px',
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
  resetButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: theme.colors.error,
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  resetButtonDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#666',
    color: '#999',
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: 'not-allowed',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  deleteButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  deleteButtonDisabled: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#666',
    color: '#999',
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: 'not-allowed',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  divider: {
    borderTop: `1px solid ${theme.colors.primary}`,
    margin: '20px 0',
  },
};

export default ResetGame;