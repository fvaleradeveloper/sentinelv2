export interface Tema {
  nombre: string;
  slug: string;
  colores: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
  };
}

export const TEMAS: Tema[] = [
  {
    nombre: 'Azul',
    slug: 'default',
    colores: {
      primary: '#2563eb',
      primaryLight: '#3b82f6',
      primaryDark: '#1d4ed8',
      accent: '#f59e0b',
    },
  },
  {
    nombre: 'Esmeralda',
    slug: 'esmeralda',
    colores: {
      primary: '#059669',
      primaryLight: '#10b981',
      primaryDark: '#047857',
      accent: '#f97316',
    },
  },
  {
    nombre: 'Violeta',
    slug: 'violeta',
    colores: {
      primary: '#7c3aed',
      primaryLight: '#8b5cf6',
      primaryDark: '#6d28d9',
      accent: '#ec4899',
    },
  },
  {
    nombre: 'Rojo',
    slug: 'rojo',
    colores: {
      primary: '#dc2626',
      primaryLight: '#ef4444',
      primaryDark: '#b91c1c',
      accent: '#eab308',
    },
  },
  {
    nombre: 'Océano',
    slug: 'oceano',
    colores: {
      primary: '#0891b2',
      primaryLight: '#06b6d4',
      primaryDark: '#0e7490',
      accent: '#a855f7',
    },
  },
  {
    nombre: 'Naranja',
    slug: 'naranja',
    colores: {
      primary: '#ea580c',
      primaryLight: '#f97316',
      primaryDark: '#c2410c',
      accent: '#0ea5e9',
    },
  },
];