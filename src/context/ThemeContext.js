import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'true');
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('darkMode', newTheme.toString());
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

    const theme = {
    isDark: isDarkMode,
    colors: isDarkMode ? {
      // Dark theme - Material Design 3
      background: '#121212',
      backgroundElevated: '#1E1E1E',
      card: '#1E1E1E',
      cardElevated: '#2C2C2C',
      text: '#E8EAED',
      textSecondary: '#9AA0A6',
      textTertiary: '#5F6368',
      border: '#3C4043',
      borderLight: '#2C2F33',
      
      // Primary colors
      primary: '#8AB4F8',
      primaryLight: '#A8C7FA',
      primaryDark: '#669DF6',
      onPrimary: '#001D35',
      primaryContainer: '#004A77',
      onPrimaryContainer: '#C2E7FF',
      
      // Secondary colors
      secondary: '#C2E7FF',
      secondaryLight: '#E8F4FF',
      secondaryDark: '#9CD2FF',
      onSecondary: '#003547',
      secondaryContainer: '#004D66',
      onSecondaryContainer: '#C2E7FF',
      
      // Status colors
      success: '#81C995',
      successContainer: '#0F5223',
      onSuccess: '#00390F',
      
      error: '#F28B82',
      errorContainer: '#8C1D18',
      onError: '#601410',
      
      warning: '#FDD663',
      warningContainer: '#643D00',
      onWarning: '#3D2500',
      
      // Surface colors
      surface: '#1E1E1E',
      surfaceVariant: '#2C2C2C',
      onSurface: '#E8EAED',
      onSurfaceVariant: '#9AA0A6',
      
      // Overlay
      overlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.9)',
      
      // Chart colors
      chartGreen: '#81C995',
      chartRed: '#F28B82',
      chartBlue: '#8AB4F8',
      chartYellow: '#FDD663',
      chartPurple: '#C58AF9',
      chartOrange: '#FCAD70',
    } : {
      // Light theme - Material Design 3
      background: '#FAFBFF',
      backgroundElevated: '#FFFFFF',
      card: '#FFFFFF',
      cardElevated: '#F8F9FE',
      text: '#1C1B1F',
      textSecondary: '#49454F',
      textTertiary: '#79747E',
      border: '#E7E0EC',
      borderLight: '#F4F3F7',
      
      // Primary colors
      primary: '#0B57D0',
      primaryLight: '#4285F4',
      primaryDark: '#0842A0',
      onPrimary: '#FFFFFF',
      primaryContainer: '#D3E3FD',
      onPrimaryContainer: '#001B3F',
      
      // Secondary colors
      secondary: '#006495',
      secondaryLight: '#0077B6',
      secondaryDark: '#004F78',
      onSecondary: '#FFFFFF',
      secondaryContainer: '#C2E7FF',
      onSecondaryContainer: '#001E2F',
      
      // Status colors
      success: '#0F9D58',
      successContainer: '#C4EED0',
      onSuccess: '#FFFFFF',
      
      error: '#D93025',
      errorContainer: '#FFDAD6',
      onError: '#FFFFFF',
      
      warning: '#F9AB00',
      warningContainer: '#FFEDC2',
      onWarning: '#3D2500',
      
      // Surface colors
      surface: '#FFFFFF',
      surfaceVariant: '#F8F9FE',
      onSurface: '#1C1B1F',
      onSurfaceVariant: '#49454F',
      
      // Overlay
      overlay: 'rgba(0, 0, 0, 0.1)',
      shadow: 'rgba(0, 0, 0, 0.2)',
      
      // Chart colors
      chartGreen: '#0F9D58',
      chartRed: '#D93025',
      chartBlue: '#4285F4',
      chartYellow: '#F9AB00',
      chartPurple: '#9334E6',
      chartOrange: '#FA903E',
    },
    
    // Spacing system
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    
    // Border radius
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    
    // Typography
    typography: {
      displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' },
      displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '400' },
      displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '400' },
      
      headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
      headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
      headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
      
      titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
      titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
      titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
      
      bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
      bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
      bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
      
      labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
      labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
      labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
    },
    
    // Elevation (shadows)
    elevation: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      sm: {
        shadowColor: isDarkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      md: {
        shadowColor: isDarkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.4 : 0.15,
        shadowRadius: 4,
        elevation: 4,
      },
      lg: {
        shadowColor: isDarkMode ? '#000' : '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDarkMode ? 0.5 : 0.2,
        shadowRadius: 8,
        elevation: 8,
      },
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};