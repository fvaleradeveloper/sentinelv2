'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { loginSchema, type LoginInput } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [cargando, setCargando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (datos: LoginInput) => {
    setCargando(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: datos.email,
        password: datos.password,
      });
      if (error) {
        toast.error(error.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas'
          : error.message);
        return;
      }
      toast.success('Sesión iniciada correctamente');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <LogIn className="text-on-primary" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Iniciar sesión</h1>
        <p className="text-sm text-on-surface-muted mt-1">Accede a tu cuenta SENTINEL</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" cargando={cargando} className="w-full">
          Iniciar sesión
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-muted mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-primary hover:underline font-medium">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}