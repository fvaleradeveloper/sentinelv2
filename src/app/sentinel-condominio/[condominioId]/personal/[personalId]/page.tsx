'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { User, Calendar, Banknote, Package, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Personal } from '@/lib/types/database';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import { formatMoneda } from '@/lib/utils/format';

export default function PersonalDetallePage() {
  const params = useParams();
  const personalId = params.personalId as string;
  const supabase = createClient();

  const { data: persona, isLoading } = useQuery({
    queryKey: ['personal-detalle', personalId],
    queryFn: async (): Promise<Personal> => {
      const { data, error } = await supabase
        .from('personal')
        .select('*')
        .eq('id', personalId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="space-y-4"><div className="h-8 w-48 skeleton" /><div className="h-64 skeleton rounded-xl" /></div>;
  }

  if (!persona) {
    return <p className="text-on-surface-muted">Personal no encontrado</p>;
  }

  const tabs = [
    {
      id: 'datos',
      etiqueta: 'Datos personales',
      icono: <User size={16} />,
      contenido: (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="text-xs text-on-surface-muted">Nombre</span><p className="font-medium">{persona.nombre}</p></div>
            <div><span className="text-xs text-on-surface-muted">Cargo</span><p className="font-medium">{persona.cargo || '-'}</p></div>
            <div><span className="text-xs text-on-surface-muted">Documento</span><p className="font-medium">{persona.documento_identidad || '-'}</p></div>
            <div><span className="text-xs text-on-surface-muted">Teléfono</span><p className="font-medium">{persona.telefono || '-'}</p></div>
            <div><span className="text-xs text-on-surface-muted">Salario</span><p className="font-medium">{formatMoneda(persona.salario ?? 0)}</p></div>
            <div><span className="text-xs text-on-surface-muted">Régimen</span><p className="font-medium">{persona.regimen_pensionario}</p></div>
            <div><span className="text-xs text-on-surface-muted">Asignación familiar</span><p className="font-medium">{persona.asignacion_familiar ? 'Sí (S/ 102.50)' : 'No'}</p></div>
            <div><span className="text-xs text-on-surface-muted">Fecha de ingreso</span><p className="font-medium">{persona.fecha_ingreso || '-'}</p></div>
          </div>
        </Card>
      ),
    },
    {
      id: 'asistencia',
      etiqueta: 'Asistencia',
      icono: <Calendar size={16} />,
      contenido: <Card><p className="text-on-surface-muted text-sm">Historial de asistencia del empleado. Usa el formulario para registrar nuevas entradas.</p></Card>,
    },
    {
      id: 'prestamos',
      etiqueta: 'Préstamos',
      icono: <Banknote size={16} />,
      contenido: <Card><p className="text-on-surface-muted text-sm">Lista de préstamos otorgados al empleado.</p></Card>,
    },
    {
      id: 'dotaciones',
      etiqueta: 'Dotaciones',
      icono: <Package size={16} />,
      contenido: <Card><p className="text-on-surface-muted text-sm">Artículos y equipos entregados al empleado.</p></Card>,
    },
    {
      id: 'permisos',
      etiqueta: 'Permisos',
      icono: <Shield size={16} />,
      contenido: <Card><p className="text-on-surface-muted text-sm">Solicitudes de permisos y licencias.</p></Card>,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">{persona.nombre}</h1>
        <p className="text-sm text-on-surface-muted">{persona.cargo || 'Sin cargo asignado'}</p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}