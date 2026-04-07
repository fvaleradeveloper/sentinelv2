'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { registroSchema, type RegistroInput } from '@/lib/utils/validators';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegistroPage() {
  const [cargando, setCargando] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<RegistroInput>({
    resolver: zodResolver(registroSchema),
  });

  const onSubmit = async (datos: RegistroInput) => {
    setCargando(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: datos.email,
        password: datos.password,
        options: {
          data: { username: datos.username },
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Cuenta creada. Revisa tu correo para confirmar.');
      router.push('/login');
    } catch {
      toast.error('Error al crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="text-on-primary" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-on-surface">Crear cuenta</h1>
        <p className="text-sm text-on-surface-muted mt-1">Ãšnete a SENTINEL</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Nombre de usuario" placeholder="tu_usuario" {...register('username')} error={errors.username?.message} />
        <Input label="Correo electrónico" type="email" placeholder="tu@email.com" {...register('email')} error={errors.email?.message} />
        <Input label="Contraseña" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" {...register('password')} error={errors.password?.message} />
        <Input label="Confirmar contraseña" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" {...register('confirmarPassword')} error={errors.confirmarPassword?.message} />
        <Button type="submit" cargando={cargando} className="w-full">
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-on-surface-muted mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}