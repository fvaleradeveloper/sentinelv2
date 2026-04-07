'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface NominaData {
  mes: string;
  incluir_gratificacion: boolean;
  incluir_cts: boolean;
}

interface NominaFormProps {
  onSubmit: (datos: NominaData) => Promise<void>;
  cargando?: boolean;
}

export default function NominaForm({ onSubmit, cargando }: NominaFormProps) {
  const ahora = new Date();
  const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

  const [form, setForm] = useState<NominaData>({
    mes: mesActual,
    incluir_gratificacion: false,
    incluir_cts: false,
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
      <Select label="Mes a generar" value={form.mes} onChange={(e) => setForm((p) => ({ ...p, mes: e.target.value }))} opciones={meses} />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="gratificacion" checked={form.incluir_gratificacion} onChange={(e) => setForm((p) => ({ ...p, incluir_gratificacion: e.target.checked }))} className="rounded border-border" />
          <label htmlFor="gratificacion" className="text-sm text-on-surface">Incluir gratificación (julio/diciembre)</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="cts" checked={form.incluir_cts} onChange={(e) => setForm((p) => ({ ...p, incluir_cts: e.target.checked }))} className="rounded border-border" />
          <label htmlFor="cts" className="text-sm text-on-surface">Incluir CTS (mayo/noviembre)</label>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Generar nómina</Button>
      </div>
    </form>
  );
}