"use client";

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    let isDark = false;

    if (newTheme === 'dark') {
      isDark = true;
    } else if (newTheme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initial = stored || 'system';
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const current = localStorage.getItem('theme') as Theme | null;
      if (!current || current === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme };
}