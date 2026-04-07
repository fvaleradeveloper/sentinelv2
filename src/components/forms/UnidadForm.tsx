'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { unidadSchema, type UnidadInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface UnidadFormProps {
  datosIniciales?: Partial<UnidadInput>;
  onSubmit: (datos: UnidadInput) => Promise<void>;
  cargando?: boolean;
}

export default function UnidadForm({ datosIniciales, onSubmit, cargando }: UnidadFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UnidadInput>({
    resolver: zodResolver(unidadSchema),
    defaultValues: datosIniciales,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Número de unidad" {...register('numero')} error={errors.numero?.message} placeholder="Ej: A-101" />
      <Input label="Propietario" {...register('propietario')} error={errors.propietario?.message} placeholder="Nombre del propietario" />
      <Input label="Email del propietario" type="email" {...register('email_propietario')} error={errors.email_propietario?.message} />
      <Input label="Teléfono" {...register('telefono_propietario')} error={errors.telefono_propietario?.message} />
      <Input label="Alícuota (%)" type="number" step="0.01" {...register('alicuota', { valueAsNumber: true })} error={errors.alicuota?.message} />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" cargando={cargando}>
          {datosIniciales ? 'Actualizar' : 'Crear unidad'}
        </Button>
      </div>
    </form>
  );
}