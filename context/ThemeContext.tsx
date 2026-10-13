import React, { createContext, useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MindSprintColors, MindSprintDarkColors } from '../constants/mindsprintTheme';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof MindSprintColors;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: MindSprintColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
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

