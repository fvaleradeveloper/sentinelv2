'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Suscripcion } from '@/lib/types/database';

export function useSubscription(webappSlug: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['suscripcion', webappSlug],
    queryFn: async (): Promise<Suscripcion | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('suscripciones')
        .select('*, plan:planes(*)')
        .eq('user_id', user.id)
        .eq('webapp_slug', webappSlug)
        .eq('estado', 'activa')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
}

export function useSubscripciones() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['suscripciones'],
    queryFn: async (): Promise<Suscripcion[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('suscripciones')
        .select('*, plan:planes(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });
}