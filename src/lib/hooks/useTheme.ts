'use client';

import { useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { useUIStore } from '@/lib/store/useUIStore';

export function useThemeConfig() {
  const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
  const colorTheme = useUIStore((s) => s.colorTheme);
  const setColorTheme = useUIStore((s) => s.setColorTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  const toggleDarkMode = () => {
    setNextTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    isDark: resolvedTheme === 'dark',
    theme,
    colorTheme,
    setColorTheme,
    toggleDarkMode,
  };
}