'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Recibo } from '@/lib/types/database';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatMoneda, formatMes } from '@/lib/utils/format';

export default function RecibosMesPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const mes = params.mes as string;
  const supabase = createClient();

  const { data: recibos = [], isLoading } = useQuery({
    queryKey: ['recibos', condominioId, mes],
    queryFn: async (): Promise<Recibo[]> => {
      const { data, error } = await supabase
        .from('recibos')
        .select('*, unidad:unidades(numero, propietario)')
        .eq('condominio_id', condominioId)
        .eq('mes', mes)
        .order('created_at');
      if (error) throw error;
      return data;
    },
  });

  const columnas = [
    { key: 'unidad', titulo: 'Unidad', render: (r: Recibo) => r.unidad?.numero || '-' },
    { key: 'propietario', titulo: 'Propietario', render: (r: Recibo) => r.unidad?.propietario || '-' },
    { key: 'monto_total', titulo: 'Monto', render: (r: Recibo) => formatMoneda(r.monto_total) },
    { key: 'alicuota_calculada', titulo: 'Alícuota', render: (r: Recibo) => formatMoneda(r.alicuota_calculada) },
    {
      key: 'estado', titulo: 'Estado',
      render: (r: Recibo) => (
        <Badge variante={r.estado === 'pagado' ? 'success' : r.estado === 'vencido' ? 'danger' : 'warning'}>
          {r.estado === 'pagado' ? 'Pagado' : r.estado === 'vencido' ? 'Vencido' : 'Pendiente'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-2">Recibos - {formatMes(mes)}</h1>
      <p className="text-sm text-on-surface-muted mb-6">{recibos.length} recibos generados</p>
      <Table
        columnas={columnas}
        datos={recibos}
        keyExtractor={(r) => String(r.id)}
        cargando={isLoading}
        vacio="No hay recibos para este mes"
      />
    </div>
  );
}