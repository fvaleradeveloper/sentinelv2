'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface AsistenciaData {
  fecha: string;
  estado: string;
  hora_entrada: string;
  hora_salida: string;
  observacion: string;
}

interface AsistenciaFormProps {
  onSubmit: (datos: AsistenciaData) => Promise<void>;
  cargando?: boolean;
}

export default function AsistenciaForm({ onSubmit, cargando }: AsistenciaFormProps) {
  const [form, setForm] = useState<AsistenciaData>({
    fecha: new Date().toISOString().split('T')[0],
    estado: 'presente',
    hora_entrada: '',
    hora_salida: '',
    observacion: '',
  });

  const handleChange = (campo: keyof AsistenciaData, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => handleChange('fecha', e.target.value)} />
      <Select
        label="Estado"
        value={form.estado}
        onChange={(e) => handleChange('estado', e.target.value)}
        opciones={[
          { valor: 'presente', etiqueta: 'Presente' },
          { valor: 'ausente', etiqueta: 'Ausente' },
          { valor: 'tardanza', etiqueta: 'Tardanza' },
          { valor: 'permiso', etiqueta: 'Con permiso' },
          { valor: 'vacaciones', etiqueta: 'Vacaciones' },
        ]}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Hora de entrada" type="time" value={form.hora_entrada} onChange={(e) => handleChange('hora_entrada', e.target.value)} />
        <Input label="Hora de salida" type="time" value={form.hora_salida} onChange={(e) => handleChange('hora_salida', e.target.value)} />
      </div>
      <Input label="Observación" value={form.observacion} onChange={(e) => handleChange('observacion', e.target.value)} placeholder="Nota adicional (opcional)" />
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Registrar asistencia</Button>
      </div>
    </form>
  );
}