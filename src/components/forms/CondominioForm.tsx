'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { condominioSchema, type CondominioInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CondominioFormProps {
  datosIniciales?: Partial<CondominioInput>;
  onSubmit: (datos: CondominioInput) => Promise<void>;
  cargando?: boolean;
}

export default function CondominioForm({ datosIniciales, onSubmit, cargando }: CondominioFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CondominioInput>({
    resolver: zodResolver(condominioSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      rif: '',
      fondo_reserva_porcentaje: 10,
      simbolo_moneda: 'S/',
      ubicacion: 'Peru',
      ...datosIniciales,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nombre del condominio" {...register('nombre')} error={errors.nombre?.message} placeholder="Ej: Residencial Los Pinos" />
      <Input label="Dirección" {...register('direccion')} error={errors.direccion?.message} placeholder="Dirección completa" />
      <Input label="RIF / RUC" {...register('rif')} error={errors.rif?.message} placeholder="Número de identificación fiscal" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fondo de reserva (%)" type="number" step="0.01" {...register('fondo_reserva_porcentaje', { valueAsNumber: true })} error={errors.fondo_reserva_porcentaje?.message} />
        <Input label="Símbolo de moneda" {...register('simbolo_moneda')} error={errors.simbolo_moneda?.message} />
      </div>
      <Input label="Ubicación" {...register('ubicacion')} error={errors.ubicacion?.message} />
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" cargando={cargando}>
          {datosIniciales ? 'Actualizar' : 'Crear condominio'}
        </Button>
      </div>
    </form>
  );
}