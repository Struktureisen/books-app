import React, { createContext, useContext, useState } from 'react';

type Theme = {
  background: string;
  text: string;
  textMuted: string;
  border: string;
  card: string;
};

const lightTheme: Theme = {
  background: '#ffffff',
  text: '#000000',
  textMuted: '#666666',
  border: '#e1e1e1',
  card: '#ffffff',
};

const darkTheme: Theme = {
  background: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#999999',
  border: '#333333',
  card: '#2a2a2a',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
