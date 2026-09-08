// src/components/auth/LoginPage.js
// Login page with player and admin authentication

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAsPlayer, signInAsAdmin } from '../../firebase/auth';
import { GAME_CONSTANTS } from '../../firebase/config';

const LoginPage = () => {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [adminEmail, setAdminEmail] = useState(GAME_CONSTANTS.ADMIN_EMAIL || '');
  const [adminPassword, setAdminPassword] = useState('');
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle player login
  const handlePlayerLogin = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    setIsPlayerLoading(true);
    try {
      await signInAsPlayer(playerName.trim());
      navigate('/player');
    } catch (err) {
      setError(err.message || 'Failed to sign in as player.');
    } finally {
      setIsPlayerLoading(false);
    }
  };

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setError('Please enter admin credentials.');
      return;
    }
    setError('');
    setIsAdminLoading(true);
    try {
      await signInAsAdmin(adminEmail.trim(), adminPassword);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to sign in as admin.');
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="login-page" style={styles.container}>
      <div className="login-card" style={styles.card}>
        <h1 style={styles.title}>Welcome!</h1>
        <p style={styles.subtitle}>香港理得你死工業大學</p>
        <img  
          src={`${process.env.PUBLIC_URL}/polyulogo.png`} 
          alt="PolyU Logo" 
          style={styles.logo} 
        />

        {error && <div style={styles.error}>{error}</div>}

        {/* Player Login Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Player Login</h2>
          <form onSubmit={handlePlayerLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={styles.input}
              disabled={isPlayerLoading}
            />
            <button
              type="submit"
              style={styles.button}
              disabled={isPlayerLoading}
            >
              {isPlayerLoading ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Admin Login Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="email"
              placeholder="Admin email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              style={styles.input}
              disabled={isAdminLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={styles.input}
              disabled={isAdminLoading}
            />
            <button
              type="submit"
              style={styles.button}
              disabled={isAdminLoading}
            >
              {isAdminLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Inline styles (can be moved to CSS later)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#2C1810',
    padding: '20px',
  },
  card: {
    backgroundColor: '#3E2723',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
    border: '2px solid #8B0000',
  },
  title: {
    textAlign: 'center',
    color: '#FFD700',
    marginBottom: '2px',
    fontFamily: "'Playfair Display', serif",
    fontSize: '3.5rem',
  },
  subtitle: {
    textAlign: 'center',
    color: '#D4A574',
    marginBottom: '20px',
    fontSize: '1.3rem',
  },
  logo: {
  display: 'block',
  margin: '20px auto 0',
  width: '100px',        // adjust as needed
  height: 'auto',
  borderRadius: '8px',   // optional, for rounded corners
},
  error: {
    backgroundColor: '#F44336',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#D4A574',
    marginBottom: '10px',
    fontSize: '1.2rem',
    borderBottom: '2px solid #8B0000',
    paddingBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid #D4A574',
    backgroundColor: '#2C1810',
    color: '#FFFFFF',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#8B0000',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
  },
  dividerText: {
    margin: '0 10px',
    color: '#D4A574',
    fontSize: '0.8rem',
  },
};

export default LoginPage;