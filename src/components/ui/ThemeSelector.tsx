'use client';

import { useThemeConfig } from '@/lib/hooks/useTheme';
import { TEMAS } from '@/lib/constants/temas';

export default function ThemeSelector() {
  const { colorTheme, setColorTheme } = useThemeConfig();

  return (
    <div className="flex flex-wrap gap-2">
      {TEMAS.map((tema) => (
        <button
          key={tema.slug}
          onClick={() => setColorTheme(tema.slug)}
          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
            colorTheme === tema.slug ? 'border-on-surface scale-110 ring-2 ring-primary/50' : 'border-transparent'
          }`}
          style={{ backgroundColor: tema.colores.primary }}
          title={tema.nombre}
        />
      ))}
    </div>
  );
}