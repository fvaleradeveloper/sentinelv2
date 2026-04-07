import { create } from 'zustand';
import type { Perfil } from '@/lib/types/database';

interface AuthState {
  perfil: Perfil | null;
  isLoading: boolean;
  setPerfil: (perfil: Perfil | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  perfil: null,
  isLoading: true,
  setPerfil: (perfil) => set({ perfil }),
  setLoading: (isLoading) => set({ isLoading }),
}));