'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movimientoSchema, type MovimientoInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface IngresoFormProps {
  onSubmit: (datos: MovimientoInput) => Promise<void>;
  cargando?: boolean;
}

const categoriasIngreso = [
  { valor: 'cuota_ordinaria', etiqueta: 'Cuota ordinaria' },
  { valor: 'cuota_extraordinaria', etiqueta: 'Cuota extraordinaria' },
  { valor: 'alquiler', etiqueta: 'Alquiler de áreas comunes' },
  { valor: 'multas', etiqueta: 'Multas' },
  { valor: 'intereses', etiqueta: 'Intereses moratorios' },
  { valor: 'otros', etiqueta: 'Otros ingresos' },
];

export default function IngresoForm({ onSubmit, cargando }: IngresoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MovimientoInput>({
    resolver: zodResolver(movimientoSchema),
    defaultValues: { tipo: 'ingreso' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('tipo')} value="ingreso" />
      <Select label="Categoría" {...register('categoria')} opciones={categoriasIngreso} error={errors.categoria?.message} placeholder="Seleccionar categoría" />
      <Input label="Descripción" {...register('descripcion')} error={errors.descripcion?.message} placeholder="Detalle del ingreso" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Monto (S/)" type="number" step="0.01" {...register('monto', { valueAsNumber: true })} error={errors.monto?.message} />
        <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
      </div>
      <Select label="Tipo de comprobante" {...register('tipo_comprobante')} opciones={[
        { valor: 'Boleta', etiqueta: 'Boleta' },
        { valor: 'Factura', etiqueta: 'Factura' },
        { valor: 'Recibo', etiqueta: 'Recibo' },
      ]} />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Registrar ingreso</Button>
      </div>
    </form>
  );
}