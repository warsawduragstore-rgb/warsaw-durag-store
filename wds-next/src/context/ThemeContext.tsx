'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      localStorage.removeItem('wds_theme');
      document.documentElement.classList.add('light');
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setTheme = () => {};
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme, toggleTheme, isLoaded }}>
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
