'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Condominio } from '@/lib/types/database';

export function useCondominios() {
  const supabase = createClient();

  return useQuery({
    queryKey: ['condominios'],
    queryFn: async (): Promise<Condominio[]> => {
      const { data, error } = await supabase
        .from('condominios')
        .select('*')
        .eq('activo', true)
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });
}

export function useCondominio(id: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['condominio', id],
    queryFn: async (): Promise<Condominio> => {
      const { data, error } = await supabase
        .from('condominios')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCrearCondominio() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (datos: Partial<Condominio>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');
      const { data, error } = await supabase
        .from('condominios')
        .insert({ ...datos, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['condominios'] });
    },
  });
}