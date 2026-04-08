'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Nomina } from '@/lib/types/database';
import Table from '@/components/ui/Table';
import { formatMoneda, formatMes } from '@/lib/utils/format';

export default function NominaDetallePage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const mes = params.mes as string;
  const supabase = createClient();

  const { data: nominas = [], isLoading } = useQuery({
    queryKey: ['nominas', condominioId, mes],
    queryFn: async (): Promise<Nomina[]> => {
      const { data, error } = await supabase
        .from('nominas')
        .select('*, personal:personal(nombre, cargo)')
        .eq('condominio_id', condominioId)
        .eq('mes', mes);
      if (error) throw error;
      return data;
    },
  });

  const columnas = [
    { key: 'personal', titulo: 'Empleado', render: (n: Nomina) => n.personal?.nombre || '-' },
    { key: 'sueldo_base', titulo: 'Sueldo base', render: (n: Nomina) => formatMoneda(n.sueldo_base) },
    { key: 'asignacion_familiar_monto', titulo: 'Asig. familiar', render: (n: Nomina) => formatMoneda(n.asignacion_familiar_monto) },
    { key: 'essalud_monto', titulo: 'EsSalud', render: (n: Nomina) => formatMoneda(n.essalud_monto) },
    { key: 'monto_bruto', titulo: 'Bruto', render: (n: Nomina) => formatMoneda(n.monto_bruto) },
    { key: 'monto_neto', titulo: 'Neto', render: (n: Nomina) => formatMoneda(n.monto_neto) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-2">Nómina - {formatMes(mes)}</h1>
      <p className="text-sm text-on-surface-muted mb-6">{nominas.length} empleados</p>
      <Table
        columnas={columnas}
        datos={nominas}
        keyExtractor={(n) => String(n.id)}
        cargando={isLoading}
        vacio="No hay registros de nómina para este mes"
      />
    </div>
  );
}