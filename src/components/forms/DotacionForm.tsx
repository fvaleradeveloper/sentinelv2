'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface DotacionData {
  descripcion: string;
  cantidad: number;
  fecha_entrega: string;
  observacion: string;
}

interface DotacionFormProps {
  onSubmit: (datos: DotacionData) => Promise<void>;
  cargando?: boolean;
}

export default function DotacionForm({ onSubmit, cargando }: DotacionFormProps) {
  const [form, setForm] = useState<DotacionData>({
    descripcion: '',
    cantidad: 1,
    fecha_entrega: new Date().toISOString().split('T')[0],
    observacion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Descripción del artículo" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Ej: Uniforme, herramientas, etc." />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Cantidad" type="number" min={1} value={form.cantidad} onChange={(e) => setForm((p) => ({ ...p, cantidad: Number(e.target.value) }))} />
        <Input label="Fecha de entrega" type="date" value={form.fecha_entrega} onChange={(e) => setForm((p) => ({ ...p, fecha_entrega: e.target.value }))} />
      </div>
      <Input label="Observación" value={form.observacion} onChange={(e) => setForm((p) => ({ ...p, observacion: e.target.value }))} placeholder="Nota adicional (opcional)" />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Registrar dotación</Button>
      </div>
    </form>
  );
}