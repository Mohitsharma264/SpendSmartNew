import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#212529',
  subText: '#6C757D',
  border: '#E9ECEF',
  primary: '#4C4DDC',
  inputBg: '#F1F3F5',
  cardBorder: '#E2E8F0',
};

export const darkTheme = {
  mode: 'dark',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F8FAFC',
  subText: '#94A3B8',
  border: '#334155',
  primary: '#6366F1',
  inputBg: '#334155',
  cardBorder: '#334155',
};

interface ThemeContextType {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@user_theme');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDark;
      setIsDark(newMode);
      await AsyncStorage.setItem('@user_theme', newMode ? 'dark' : 'light');
    } catch (e) {
      console.error(e);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};