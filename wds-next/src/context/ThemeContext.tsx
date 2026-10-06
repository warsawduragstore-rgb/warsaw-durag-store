'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const urlTheme = new URLSearchParams(window.location.search).get('theme') as Theme | null;
      if (urlTheme === 'light' || urlTheme === 'dark') {
        setThemeState(urlTheme);
        localStorage.setItem('wds_theme', urlTheme);
        if (urlTheme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
        setIsLoaded(true);
        return;
      }

      const stored = localStorage.getItem('wds_theme') as Theme | null;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
        if (stored === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      } else {
        // Default is dark
        if (document.documentElement.classList.contains('light')) {
          setThemeState('light');
        }
      }
    } catch {
      // ignore localStorage errors (e.g. private mode)
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('wds_theme', newTheme);
    } catch {
      // ignore
    }
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
