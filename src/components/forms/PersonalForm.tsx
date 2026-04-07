'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalSchema, type PersonalInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface PersonalFormProps {
  datosIniciales?: Partial<PersonalInput>;
  onSubmit: (datos: PersonalInput) => Promise<void>;
  cargando?: boolean;
}

export default function PersonalForm({ datosIniciales, onSubmit, cargando }: PersonalFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<PersonalInput>({
    resolver: zodResolver(personalSchema),
    defaultValues: datosIniciales,
  });

  const regimen = watch('regimen_pensionario');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nombre completo" {...register('nombre')} error={errors.nombre?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Cargo" {...register('cargo')} error={errors.cargo?.message} />
        <Input label="Teléfono" {...register('telefono')} error={errors.telefono?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Documento de identidad" {...register('documento_identidad')} error={errors.documento_identidad?.message} />
        <Input label="Salario (S/)" type="number" step="0.01" {...register('salario', { valueAsNumber: true })} error={errors.salario?.message} />
      </div>
      <Input label="Fecha de ingreso" type="date" {...register('fecha_ingreso')} error={errors.fecha_ingreso?.message} />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="asignacion_familiar" {...register('asignacion_familiar')} className="rounded border-border" />
        <label htmlFor="asignacion_familiar" className="text-sm text-on-surface">Tiene asignación familiar (S/ 102.50)</label>
      </div>
      <Select
        label="Régimen pensionario"
        {...register('regimen_pensionario')}
        opciones={[
          { valor: 'ONP', etiqueta: 'ONP (13%)' },
          { valor: 'AFP', etiqueta: 'AFP (12%)' },
        ]}
        error={errors.regimen_pensionario?.message}
      />
      {regimen === 'AFP' && (
        <Input label="Nombre de AFP" {...register('afp_nombre')} error={errors.afp_nombre?.message} />
      )}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" cargando={cargando}>
          {datosIniciales ? 'Actualizar' : 'Registrar personal'}
        </Button>
      </div>
    </form>
  );
}