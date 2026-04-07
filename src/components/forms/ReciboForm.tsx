'use client';

import { useState } from 'react';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ReciboData {
  mes: string;
  fecha_vencimiento: string;
}

interface ReciboFormProps {
  onSubmit: (datos: ReciboData) => Promise<void>;
  cargando?: boolean;
}

export default function ReciboForm({ onSubmit, cargando }: ReciboFormProps) {
  const ahora = new Date();
  const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

  const [form, setForm] = useState<ReciboData>({
    mes: mesActual,
    fecha_vencimiento: '',
  });

  const meses = Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0');
    const nombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return { valor: `${ahora.getFullYear()}-${m}`, etiqueta: `${nombres[i]} ${ahora.getFullYear()}` };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label="Mes de recibos" value={form.mes} onChange={(e) => setForm((p) => ({ ...p, mes: e.target.value }))} opciones={meses} />
      <Input label="Fecha de vencimiento" type="date" value={form.fecha_vencimiento} onChange={(e) => setForm((p) => ({ ...p, fecha_vencimiento: e.target.value }))} />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Generar recibos</Button>
      </div>
    </form>
  );
}