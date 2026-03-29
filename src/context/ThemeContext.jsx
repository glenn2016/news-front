import { createContext, useContext, useEffect, useState } from 'react';
import { getInitialTheme } from '../utils/theme.utils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Applique la classe dark sur <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Vérifie l'heure toutes les minutes pour switcher auto
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('theme');
      if (!saved) {
        const hour = new Date().getHours();
        setTheme(hour >= 18 || hour < 6 ? 'dark' : 'light');
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // sauvegarde le choix manuel
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);