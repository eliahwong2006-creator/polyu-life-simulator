// src/components/trade/TradeSystem.js
// Money transfer interface and transaction history

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../styles/theme';

const TradeSystem = () => {
  const { players, transactions, transferMoney } = useGame();
  const { currentUser, userData } = useAuth();
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Current player's data (from real-time players list if available)
  const currentPlayer = players.find(p => p.id === currentUser?.uid) || userData;
  const balance = currentPlayer?.money ?? 0;

  // Other players (not current, not admin)
  const otherPlayers = players.filter(p => !p.isAdmin && p.id !== currentUser?.uid);

  // Filter transactions for current user
  const myTransactions = transactions.filter(
    t => t.from === currentUser?.uid || t.to === currentUser?.uid
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate recipient
    if (!recipientId) {
      setError('Please select a recipient.');
      return;
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    // Check sufficient funds
    if (numericAmount > balance) {
      setError('Insufficient funds.');
      return;
    }

    const recipient = players.find(p => p.id === recipientId);
    if (!recipient) {
      setError('Recipient not found.');
      return;
    }

    setIsSubmitting(true);
    try {
      await transferMoney(currentPlayer, recipient, numericAmount);
      setAmount('');
      setRecipientId('');
      setSuccess(`Successfully sent $${numericAmount} to ${recipient.name}.`);
    } catch (err) {
      setError(err.message || 'Transaction failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Money Transfer</h2>

      {/* Current Balance */}
      <div style={styles.balanceCard}>
        <span style={styles.balanceLabel}>Your Balance</span>
        <span style={styles.balanceAmount}>${balance}</span>
      </div>

      {/* Transfer Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Transfer To:</label>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            style={styles.select}
          >
            <option value="">Select player</option>
            {otherPlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.name} (${player.money || 0})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Amount:</label>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={styles.input}
          />
          <div style={styles.quickAmounts}>
            {[10, 50, 100].map(quick => (
              <button
                key={quick}
                type="button"
                onClick={() => setAmount(quick.toString())}
                style={styles.quickButton}
              >
                ${quick}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Send Money'}
        </button>
      </form>

      {/* Transaction History */}
      <div style={styles.historySection}>
        <h3 style={styles.historyTitle}>Transaction History</h3>
        {myTransactions.length > 0 ? (
          <div style={styles.historyList}>
            {myTransactions.map(tx => (
              <div key={tx.id} style={styles.historyItem}>
                <div style={styles.historyMain}>
                  <span style={styles.historyType}>
                    {tx.from === currentUser?.uid ? '→ Sent to' : '← Received from'}
                  </span>
                  <span style={styles.historyName}>
                    {tx.from === currentUser?.uid ? tx.toName : tx.fromName}
                  </span>
                </div>
                <div style={styles.historyDetails}>
                  <span style={tx.from === currentUser?.uid ? styles.sentAmount : styles.receivedAmount}>
                    {tx.from === currentUser?.uid ? '-' : '+'}${tx.amount}
                  </span>
                  <span style={styles.historyTime}>
                    {formatTimestamp(tx.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noTransactions}>No transactions yet.</p>
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
  balanceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '16px',
    textAlign: 'center',
    marginBottom: '20px',
    border: `1px solid ${theme.colors.primary}`,
  },
  balanceLabel: {
    display: 'block',
    color: theme.colors.textSecondary,
    fontSize: '0.9rem',
  },
  balanceAmount: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '16px',
    marginBottom: '20px',
  },
  formGroup: {
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
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '0.9rem',
  },
  quickAmounts: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  quickButton: {
    flex: 1,
    padding: '6px',
    background: theme.colors.primaryLight,
    color: theme.colors.text,
    border: 'none',
    borderRadius: theme.borderRadius.small,
    cursor: 'pointer',
    fontSize: '0.8rem',
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
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    border: 'none',
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  historySection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '16px',
  },
  historyTitle: {
    color: theme.colors.secondary,
    borderBottom: `1px solid ${theme.colors.primary}`,
    paddingBottom: '8px',
    marginBottom: '12px',
  },
  historyList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: `1px solid ${theme.colors.primaryDark}`,
  },
  historyMain: {
    display: 'flex',
    flexDirection: 'column',
  },
  historyType: {
    fontSize: '0.8rem',
    color: theme.colors.textSecondary,
  },
  historyName: {
    fontWeight: 'bold',
    fontSize: '0.95rem',
  },
  historyDetails: {
    textAlign: 'right',
  },
  sentAmount: {
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  receivedAmount: {
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  historyTime: {
    display: 'block',
    fontSize: '0.75rem',
    color: theme.colors.textMuted,
  },
  noTransactions: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    padding: '20px',
  },
};

export default TradeSystem;