import React, { createContext, useState, useContext, useEffect } from 'react';
import { APP_CONFIG } from '../config';

// Tema context'i oluşturma
const ThemeContext = createContext();

// Provider bileşeni
export const ThemeProvider = ({ children }) => {
  // Local storage'dan tema tercihini al veya varsayılan tema kullan
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('translate_app_theme');
    return savedTheme || APP_CONFIG.defaultTheme;
  });

  // Tema değiştiğinde local storage'a kaydet
  useEffect(() => {
    localStorage.setItem('translate_app_theme', theme);
    
    // HTML element'ine tema sınıfı ekle/çıkar
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Context değeri
  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 