'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { prestamoSchema, type PrestamoInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface PrestamoFormProps {
  onSubmit: (datos: PrestamoInput) => Promise<void>;
  cargando?: boolean;
}

export default function PrestamoForm({ onSubmit, cargando }: PrestamoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PrestamoInput>({
    resolver: zodResolver(prestamoSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Monto del préstamo (S/)" type="number" step="0.01" {...register('monto', { valueAsNumber: true })} error={errors.monto?.message} />
      <Input label="Cuotas pactadas" type="number" {...register('cuotas_pactadas', { valueAsNumber: true })} error={errors.cuotas_pactadas?.message} />
      <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
      <Input label="Motivo" {...register('motivo')} error={errors.motivo?.message} placeholder="Razón del préstamo" />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Registrar préstamo</Button>
      </div>
    </form>
  );
}