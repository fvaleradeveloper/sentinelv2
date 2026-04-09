import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Crear una nueva instancia del cliente para cada llamada
// Esto evita problemas de sesiones compartidas en Next.js
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Faltan variables de entorno de Supabase');
    throw new Error('Configuracion de Supabase incompleta');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        getItem: (key: string) => {
          if (typeof window !== 'undefined') {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key: string, value: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key: string) => {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
          }
        }
      }
    }
  });
}

// Funcion para verificar autenticacion
export async function checkAuth() {
  const client = createClient();
  const { data: { user }, error } = await client.auth.getUser();
  return { user, error };
}

// Funcion para obtener sesion
export async function getSession() {
  const client = createClient();
  const { data: { session }, error } = await client.auth.getSession();
  return { session, error };
}