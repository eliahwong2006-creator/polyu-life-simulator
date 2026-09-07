// src/styles/theme.js
// PolyU Red Brick Theme Configuration

export const theme = {
  colors: {
    // Primary palette
    primary: '#8B0000',        // Dark red - brick color
    primaryDark: '#5C0000',    // Darker red for shadows
    primaryLight: '#A52A2A',   // Brown-red
    secondary: '#D4A574',      // Tan/sand - mortar color
    accent: '#FFD700',         // Gold for money display
    background: '#2C1810',     // Dark brick shadow background
    surface: '#3E2723',        // Slightly lighter surface
    text: '#FFFFFF',
    textSecondary: '#D3D3D3',
    textMuted: '#A9A9A9',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    energy: '#42A5F5',         // Blue for energy
    sanity: '#AB47BC',         // Purple for sanity
    wisdom: '#66BB6A',         // Green for wisdom
    strength: '#EF5350',       // Red for strength
    social: '#FFA726',         // Orange for social
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Roboto', sans-serif",
    mono: "'Courier New', monospace",
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.3)',
    medium: '0 4px 8px rgba(0,0,0,0.4)',
    large: '0 8px 16px rgba(0,0,0,0.5)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  // Radar chart colors
  radarChart: {
    wisdom: '#66BB6A',
    strength: '#EF5350',
    social: '#FFA726',
    sanity: '#AB47BC',
    energy: '#42A5F5',
    grid: '#D4A574',
    fill: 'rgba(212, 165, 116, 0.2)',
  },
};

export default theme;