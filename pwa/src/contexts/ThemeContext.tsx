import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  theme: string;
  currency: string;
  toggleDarkMode: () => void;
  changeTheme: (theme: string) => void;
  changeCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes = {
  blue: {
    name: 'Ocean Blue',
    primary: '#2563eb',
    primaryLight: '#3b82f6',
  },
  purple: {
    name: 'Purple Dream',
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
  },
  green: {
    name: 'Nature Green',
    primary: '#059669',
    primaryLight: '#10b981',
  },
};

const currencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState('blue');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const savedTheme = localStorage.getItem('moneyflow_theme');
    const savedCurrency = localStorage.getItem('moneyflow_currency');
    const savedDarkMode = localStorage.getItem('moneyflow_dark');

    if (savedTheme) setTheme(savedTheme);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedDarkMode) setIsDark(savedDarkMode === 'true');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = themes[theme as keyof typeof themes];

    if (currentTheme) {
      root.style.setProperty('--primary-color', currentTheme.primary);
      root.style.setProperty('--primary-light', currentTheme.primaryLight);
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

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  const changeCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  const formatCurrency = (amount: number) => {
    const currencyInfo = currencies[currency as keyof typeof currencies];
    return `${currencyInfo.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const value: ThemeContextType = {
    isDark,
    theme,
    currency,
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