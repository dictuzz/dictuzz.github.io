export const designTokens = {
  typography: {
    headline: "'Playfair Display', Georgia, serif",
    body: "'IM Fell English', 'Times New Roman', serif",
    mono: "'Special Elite', 'Courier New', monospace",
    ui: "'Inter', system-ui, sans-serif"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    '4xl': '4.5rem'
  },
  colors: {
    boardBg: '#1a1f1a',
    boardSurface: '#1e2420',
    boardEdge: '#0f1210',
    chalkWhite: '#f2ede4',
    chalkDim: '#a89f8c',
    chalkLine: '#6b6355',
    paperBg: '#f5efe0',
    paperAged: '#e8dcc8',
    paperShadow: '#c4b89a',
    inkBlack: '#1a1410',
    inkDark: '#2c241c',
    redString: '#c0392b',
    redStringGlow: '#e74c3c',
    pinMetal: '#8b7355',
    stampRed: '#8b1a1a',
    stampBlue: '#1a3a8b',
    yellowSticky: '#f9e04b',
    tapeColor: 'rgba(255, 245, 200, 0.6)'
  },
  spacing: {
    1: '8px',
    2: '16px',
    3: '24px',
    4: '32px',
    6: '48px',
    8: '64px',
    12: '96px',
    16: '128px',
    20: '160px'
  },
  shadows: {
    paper:
      '2px 2px 0px rgba(0,0,0,0.3), 4px 4px 8px rgba(0,0,0,0.4), 0px 0px 20px rgba(0,0,0,0.2)',
    pinned: '3px 3px 6px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.8)',
    deep: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)'
  }
} as const;

export type DesignTokens = typeof designTokens;
