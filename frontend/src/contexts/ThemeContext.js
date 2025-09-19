import React, { createContext, useContext, useState, useEffect } from 'react';
import { themePresets } from '../data/mockData';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [currency, setCurrency] = useState('USD');
  const [colors, setColors] = useState({
    primary: '#2563eb',
    accent: '#0891b2',
    success: '#059669'
  });

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color scheme
    if (isDark) {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--bg-tertiary', '#334155');
      root.style.setProperty('--text-primary', '#f1f5f9');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--border-color', '#475569');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-tertiary', '#f1f5f9');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
    }

    // Apply custom colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-success', colors.success);

    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--font-size-base', fontSizes[fontSize]);
  }, [isDark, colors, fontSize]);

  const applyPreset = (presetName) => {
    const preset = themePresets[presetName];
    if (preset) {
      setColors({
        primary: preset.primary,
        accent: preset.accent,
        success: preset.success
      });
      setIsDark(presetName === 'Dark');
    }
  };

  const formatCurrency = (amount) => {
    const currencySymbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
      CHF: 'CHF',
      CNY: '¥',
      INR: '₹',
      BRL: 'R$'
    };
    
    const symbol = currencySymbols[currency] || '$';
    return `${symbol}${Math.abs(amount).toLocaleString()}`;
  };

  const value = {
    isDark,
    setIsDark,
    fontSize,
    setFontSize,
    currency,
    setCurrency,
    formatCurrency,
    colors,
    setColors,
    applyPreset
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};