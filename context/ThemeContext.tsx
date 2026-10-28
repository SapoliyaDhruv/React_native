import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { MindSprintColors, MindSprintDarkColors } from '../constants/mindsprintTheme';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof MindSprintColors;
};

const THEME_STORAGE_KEY = '@mindsprint_theme_mode';

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: MindSprintColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    async function loadSavedTheme() {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDarkMode(saved === 'dark');
        } else if (systemColorScheme) {
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.warn('Failed to load theme preference:', e);
      }
    }
    loadSavedTheme();
  }, [systemColorScheme]);

  const toggleDarkMode = async () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode ? 'dark' : 'light');
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  };

  const colors = isDarkMode ? MindSprintDarkColors : MindSprintColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

export const MindSprintThemeProvider = ThemeProvider;
export const useTheme = () => useContext(ThemeContext);


