/* ============================================
   TEMA CONTEXT - ThemeContext
   Dark/Light mod geçişi yönetimi.
   Kullanıcının tema tercihini localStorage'da saklar.
   HTML data-theme attribute ile CSS değişkenlerini
   değiştirir.
   ============================================ */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

function getInitialTheme() {
  try {
    return localStorage.getItem('shopzone_theme') || 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * ThemeProvider: Tema yönetimi (dark/light)
 * HTML root elemanına data-theme attribute ekler
 * CSS değişkenleri bu attribute'a göre değişir
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Tema değiştiğinde DOM ve localStorage güncelle
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shopzone_theme', theme);
  }, [theme]);

  // Temayı toggle et
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme hook\'u ThemeProvider içinde kullanılmalıdır');
  }
  return context;
}
