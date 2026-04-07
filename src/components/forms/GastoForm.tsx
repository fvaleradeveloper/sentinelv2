'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movimientoSchema, type MovimientoInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface GastoFormProps {
  onSubmit: (datos: MovimientoInput) => Promise<void>;
  cargando?: boolean;
}

const categoriasEgreso = [
  { valor: 'servicios', etiqueta: 'Servicios públicos' },
  { valor: 'mantenimiento', etiqueta: 'Mantenimiento' },
  { valor: 'limpieza', etiqueta: 'Limpieza' },
  { valor: 'seguridad', etiqueta: 'Seguridad' },
  { valor: 'reparaciones', etiqueta: 'Reparaciones' },
  { valor: 'administracion', etiqueta: 'Administración' },
  { valor: 'nomina', etiqueta: 'Nómina' },
  { valor: 'otros', etiqueta: 'Otros' },
];

export default function GastoForm({ onSubmit, cargando }: GastoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MovimientoInput>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: { tipo: 'egreso' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('tipo')} value="egreso" />
      <Select label="Categoría" {...register('categoria')} opciones={categoriasEgreso} error={errors.categoria?.message} placeholder="Seleccionar categoría" />
      <Input label="Descripción" {...register('descripcion')} error={errors.descripcion?.message} placeholder="Detalle del gasto" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Monto (S/)" type="number" step="0.01" {...register('monto', { valueAsNumber: true })} error={errors.monto?.message} />
        <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo de comprobante" {...register('tipo_comprobante')} opciones={[
          { valor: 'Boleta', etiqueta: 'Boleta' },
          { valor: 'Factura', etiqueta: 'Factura' },
          { valor: 'Recibo', etiqueta: 'Recibo' },
          { valor: 'Sin comprobante', etiqueta: 'Sin comprobante' },
        ]} />
        <Input label="Serie / Correlativo" {...register('serie_correlativo')} />
      </div>
      <Input label="IGV (S/)" type="number" step="0.01" {...register('igv_monto', { valueAsNumber: true })} />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Registrar egreso</Button>
      </div>
    </form>
  );
}