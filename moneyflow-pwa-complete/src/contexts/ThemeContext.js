import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  blue: {
    name: 'Ocean Blue',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryRgb: '37, 99, 235',
    light: {
      '--primary-50': '239, 246, 255',
      '--primary-100': '219, 234, 254',
      '--primary-200': '191, 219, 254',
      '--primary-300': '147, 197, 253',
      '--primary-400': '96, 165, 250',
      '--primary-500': '59, 130, 246',
      '--primary-600': '37, 99, 235',
      '--primary-700': '29, 78, 216',
      '--primary-800': '30, 64, 175',
      '--primary-900': '30, 58, 138',
    },
    dark: {
      '--primary-50': '30, 58, 138',
      '--primary-100': '30, 64, 175',
      '--primary-200': '29, 78, 216',
      '--primary-300': '37, 99, 235',
      '--primary-400': '59, 130, 246',
      '--primary-500': '96, 165, 250',
      '--primary-600': '147, 197, 253',
      '--primary-700': '191, 219, 254',
      '--primary-800': '219, 234, 254',
      '--primary-900': '239, 246, 255',
    }
  },
  purple: {
    name: 'Purple Dream',
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    primaryRgb: '139, 92, 246',
    light: {
      '--primary-50': '245, 243, 255',
      '--primary-100': '237, 233, 254',
      '--primary-200': '221, 214, 254',
      '--primary-300': '196, 181, 253',
      '--primary-400': '167, 139, 250',
      '--primary-500': '139, 92, 246',
      '--primary-600': '124, 58, 237',
      '--primary-700': '109, 40, 217',
      '--primary-800': '91, 33, 182',
      '--primary-900': '76, 29, 149',
    },
    dark: {
      '--primary-50': '76, 29, 149',
      '--primary-100': '91, 33, 182',
      '--primary-200': '109, 40, 217',
      '--primary-300': '124, 58, 237',
      '--primary-400': '139, 92, 246',
      '--primary-500': '167, 139, 250',
      '--primary-600': '196, 181, 253',
      '--primary-700': '221, 214, 254',
      '--primary-800': '237, 233, 254',
      '--primary-900': '245, 243, 255',
    }
  },
  green: {
    name: 'Nature Green',
    primary: '#059669',
    primaryLight: '#10b981',
    primaryRgb: '5, 150, 105',
    light: {
      '--primary-50': '240, 253, 244',
      '--primary-100': '220, 252, 231',
      '--primary-200': '187, 247, 208',
      '--primary-300': '134, 239, 172',
      '--primary-400': '74, 222, 128',
      '--primary-500': '34, 197, 94',
      '--primary-600': '22, 163, 74',
      '--primary-700': '21, 128, 61',
      '--primary-800': '22, 101, 52',
      '--primary-900': '20, 83, 45',
    },
    dark: {
      '--primary-50': '20, 83, 45',
      '--primary-100': '22, 101, 52',
      '--primary-200': '21, 128, 61',
      '--primary-300': '22, 163, 74',
      '--primary-400': '34, 197, 94',
      '--primary-500': '74, 222, 128',
      '--primary-600': '134, 239, 172',
      '--primary-700': '187, 247, 208',
      '--primary-800': '220, 252, 231',
      '--primary-900': '240, 253, 244',
    }
  },
};

const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const savedTheme = localStorage.getItem('moneyflow_theme');
    const savedCurrency = localStorage.getItem('moneyflow_currency');
    const savedDarkMode = localStorage.getItem('moneyflow_dark');

    if (savedTheme && themes[savedTheme]) setTheme(savedTheme);
    if (savedCurrency && currencies[savedCurrency]) setCurrency(savedCurrency);
    if (savedDarkMode) setIsDark(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme];

    if (currentTheme) {
      // Apply CSS custom properties based on dark/light mode
      const modeProperties = isDark ? currentTheme.dark : currentTheme.light;
      Object.entries(modeProperties).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      // Apply primary colors (adjust for dark mode)
      if (isDark) {
        root.style.setProperty('--color-primary', currentTheme.primaryLight);
        root.style.setProperty('--color-primary-light', currentTheme.primary);
      } else {
        root.style.setProperty('--color-primary', currentTheme.primary);
        root.style.setProperty('--color-primary-light', currentTheme.primaryLight);
      }
      root.style.setProperty('--color-primary-rgb', currentTheme.primaryRgb);
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('moneyflow_theme', theme);
    localStorage.setItem('moneyflow_currency', currency);
    localStorage.setItem('moneyflow_dark', isDark.toString());
  }, [isDark, theme, currency]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
    }
  };

  const changeCurrency = (newCurrency) => {
    if (currencies[newCurrency]) {
      setCurrency(newCurrency);
    }
  };

  const formatCurrency = (amount) => {
    const currencyInfo = currencies[currency];
    return `${currencyInfo.symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const value = {
    isDark,
    theme,
    currency,
    themes,
    currencies,
    toggleDarkMode,
    changeTheme,
    changeCurrency,
    formatCurrency,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};