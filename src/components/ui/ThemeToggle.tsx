'use client';

import { Sun, Moon } from 'lucide-react';
import { useThemeConfig } from '@/lib/hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleDarkMode } = useThemeConfig();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors"
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}