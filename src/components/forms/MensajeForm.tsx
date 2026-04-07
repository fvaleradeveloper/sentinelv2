'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mensajeSchema, type MensajeInput } from '@/lib/utils/validators';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface MensajeFormProps {
  onSubmit: (datos: MensajeInput) => Promise<void>;
  cargando?: boolean;
  respuestaA?: string;
}

export default function MensajeForm({ onSubmit, cargando, respuestaA }: MensajeFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MensajeInput>({
    resolver: zodResolver(mensajeSchema),
    defaultValues: { respuesta_a: respuestaA || null },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Tipo de mensaje"
        {...register('tipo')}
        opciones={[
          { valor: 'aviso', etiqueta: 'Aviso' },
          { valor: 'consulta', etiqueta: 'Consulta' },
          { valor: 'sugerencia', etiqueta: 'Sugerencia' },
          { valor: 'reclamo', etiqueta: 'Reclamo' },
          { valor: 'general', etiqueta: 'General' },
        ]}
        error={errors.tipo?.message}
        placeholder="Seleccionar tipo"
      />
      <Input label="Título" {...register('titulo')} error={errors.titulo?.message} placeholder="Asunto del mensaje" />
      <div className="w-full">
        <label className="block text-sm font-medium text-on-surface mb-1.5">Contenido</label>
        <textarea
          {...register('contenido')}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-on-surface placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          placeholder="Escribe tu mensaje..."
        />
        {errors.contenido && <p className="text-xs text-red-500 mt-1">{errors.contenido.message}</p>}
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" cargando={cargando}>Enviar mensaje</Button>
      </div>
    </form>
  );
}