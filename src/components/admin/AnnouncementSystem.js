// src/components/admin/AnnouncementSystem.js
// Admin interface to send global announcements to all players

import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { theme } from '../../styles/theme';

const AnnouncementSystem = () => {
  const { players, sendAnnouncement } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [eventType, setEventType] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);

  const gamePlayers = players.filter(p => !p.isAdmin);

  // Preset event types with emojis and messages
  const presetEvents = [
    { id: 'HorseRacing', label: '🐎 贏得了賽馬比賽!' },
    { id: 'challenge', label: '🏆 贏得了 Kahoot!' },
    { id: 'trade', label: '💰 完成了一筆重磅交易!' },
    { id: 'broke', label: '📉 破產了!' },
    { id: 'graduated', label: '🎓 提前畢業!' },
    { id: 'trouble', label: '🚨 惹了麻煩!' },
    { id: 'job', label: '💼 找到工作了!' },
  ];

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    setStatus('');
    setIsSending(true);

    try {
      let finalMessage = '';
      let playerName = '';

      if (selectedPlayerId) {
        const selectedPlayer = players.find(p => p.id === selectedPlayerId);
        playerName = selectedPlayer?.name || '';
      }

      if (customMessage.trim()) {
        finalMessage = customMessage.trim();
      } else if (eventType) {
        const event = presetEvents.find(e => e.id === eventType);
        if (event) {
          finalMessage = playerName ? `${playerName} ${event.label}` : event.label;
        }
      }

      if (!finalMessage) {
        setStatus('❌ Please select an event type or enter a custom message.');
        setIsSending(false);
        return;
      }

      await sendAnnouncement({
        message: finalMessage,
        playerName: playerName || 'System',
        type: eventType || 'custom',
      });

      // Clear form
      setSelectedPlayerId('');
      setEventType('');
      setCustomMessage('');
      setStatus('✅ Announcement sent successfully!');
    } catch (error) {
      console.error('Error sending announcement:', error);
      setStatus('❌ Failed to send announcement.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Send Announcement</h2>

      <form onSubmit={handleSendAnnouncement} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Player (optional):</label>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- No specific player --</option>
            {gamePlayers.map(player => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Preset Event:</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Choose event --</option>
            {presetEvents.map(event => (
              <option key={event.id} value={event.id}>
                {event.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Custom Message (optional):</label>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type a custom announcement..."
            style={styles.textarea}
            rows={3}
          />
        </div>

        {status && (
          <div style={status.startsWith('❌') ? styles.error : styles.success}>
            {status}
          </div>
        )}

        <button
          type="submit"
          style={styles.submitButton}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Announcement'}
        </button>
      </form>

      <div style={styles.previewSection}>
        <h3 style={styles.previewTitle}>Preview</h3>
        <div style={styles.previewBox}>
          {selectedPlayerId && (
            <p>Player: {players.find(p => p.id === selectedPlayerId)?.name}</p>
          )}
          {eventType && (
            <p>Event: {presetEvents.find(e => e.id === eventType)?.label}</p>
          )}
          {customMessage ? (
            <p>Message: {customMessage}</p>
          ) : (
            selectedPlayerId && eventType && (
              <p>Final: {players.find(p => p.id === selectedPlayerId)?.name} {presetEvents.find(e => e.id === eventType)?.label}</p>
            )
          )}
        </div>
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
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: theme.borderRadius.medium,
    border: `1px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '0.9rem',
    resize: 'vertical',
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
  previewSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: '16px',
  },
  previewTitle: {
    color: theme.colors.secondary,
    marginBottom: '8px',
  },
  previewBox: {
    border: `1px dashed ${theme.colors.secondary}`,
    borderRadius: theme.borderRadius.small,
    padding: '12px',
    fontSize: '0.9rem',
    color: theme.colors.textSecondary,
  },
};

export default AnnouncementSystem;