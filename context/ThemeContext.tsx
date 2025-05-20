import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = {
  // Base colors
  background: string;
  card: string;
  border: string;
  
  // Text colors
  text: string;
  textMuted: string;
  textInverse: string;
  
  // Status colors
  activeStatus: string;
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  
  // Interactive states
  buttonPrimary: string;
  buttonSecondary: string;
  buttonDisabled: string;
  
  // Overlay colors
  modalOverlay: string;
  loadingOverlay: string;
};

const lightTheme: Theme = {
  // Base colors
  background: '#F8F9FA',
  card: '#FFFFFF',
  border: '#E9ECEF',
  
  // Text colors
  text: '#212529',
  textMuted: '#6C757D',
  textInverse: '#FFFFFF',
  
  // Status colors
  activeStatus: '#4DABF7',
  primary: '#228BE6',
  secondary: '#868E96',
  success: '#40C057',
  error: '#FA5252',
  warning: '#FCC419',
  
  // Interactive states
  buttonPrimary: '#228BE6',
  buttonSecondary: '#868E96',
  buttonDisabled: '#CED4DA',
  
  // Overlay colors
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  loadingOverlay: 'rgba(255, 255, 255, 0.8)',
};

const darkTheme: Theme = {
  // Base colors
  background: '#1A1B1E',
  card: '#25262B',
  border: '#2C2E33',
  
  // Text colors
  text: '#E9ECEF',
  textMuted: '#868E96',
  textInverse: '#1A1B1E',
  
  // Status colors
  activeStatus: '#4DABF7',
  primary: '#339AF0',
  secondary: '#868E96',
  success: '#51CF66',
  error: '#FF6B6B',
  warning: '#FFD43B',
  
  // Interactive states
  buttonPrimary: '#339AF0',
  buttonSecondary: '#868E96',
  buttonDisabled: '#495057',
  
  // Overlay colors
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  loadingOverlay: 'rgba(0, 0, 0, 0.8)',
};

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
};

const defaultTheme = darkTheme; // Set dark theme as default
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  theme: defaultTheme
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Initialize with dark mode

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('isDarkMode');
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'true');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('isDarkMode', String(newMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context;
}
